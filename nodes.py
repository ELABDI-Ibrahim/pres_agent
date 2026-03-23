import os
import re
import json
from pydantic import BaseModel, Field
from langchain_groq import ChatGroq
from langchain_core.messages import HumanMessage
from langchain_core.output_parsers import JsonOutputParser, StrOutputParser
from state import AgentState
from tools import run_js_code
from prompts import build_outline_prompt, build_draft_slide_prompt, build_generator_prompt, build_fixer_prompt

_llm = None

def get_llm():
    global _llm
    if _llm is None:
        api_key = os.environ.get("GROQ_API_KEY")
        if not api_key:
            raise ValueError("GROQ_API_KEY is not set in environment.")
        _llm = ChatGroq(model="openai/gpt-oss-20b", temperature=0.2, max_tokens=4096)
    return _llm

class ColorPalette(BaseModel):
    primary: str = Field(description="Dominant color hex code without #")
    secondary: str = Field(description="Secondary color hex code without #")
    accent: str = Field(description="Accent color hex code without #")

class FontPair(BaseModel):
    header: str = Field(description="Header font name")
    body: str = Field(description="Body font name")

class SlideOutline(BaseModel):
    type: str = Field(description="E.g., title_slide, content_slide, conclusion_slide")
    heading: str = Field(description="Slide heading or title")
    subheadings: list[str] = Field(description="High-level topics to cover on this slide")

class PresentationOutline(BaseModel):
    title: str = Field(description="The overall presentation title")
    color_palette: ColorPalette
    font_pair: FontPair
    slides: list[SlideOutline]

class DraftedSlideContent(BaseModel):
    layout_reasoning: str = Field(description="Chain of thought reasoning explaining exactly why the chosen layout is visually stunning, avoids boring text walls, and uniquely fits the 3-5 bullet points.")
    content: list[str] = Field(description="Verbose, well-written bullet points")
    layout: str = Field(description="Layout hint e.g., Two-column, 2x2 grid, Half-bleed image, etc")
    source: str = Field(description="A short credibility source line for the footer (e.g., 'Source: Internal Analysis, 2024')")

def log_prompt_tokens(prompt_value, step_name: str):
    try:
        import tiktoken
        enc = tiktoken.get_encoding("cl100k_base")
        text = "\n".join([m.content for m in prompt_value.to_messages() if isinstance(m.content, str)])
        tokens = len(enc.encode(text))
        print(f"[{step_name}] Prompt tokens (approx): {tokens}")
    except ImportError:
        text = "\n".join([m.content for m in prompt_value.to_messages() if isinstance(m.content, str)])
        print(f"[{step_name}] Prompt length (chars): {len(text)}")
    except Exception as e:
        print(f"[{step_name}] Failed to count tokens: {e}")

def build_outline(state: AgentState) -> dict:
    print("[build_outline] Starting...")
    is_simplified = state.get("simplified", False)
    prompt_val = build_outline_prompt(simplified=is_simplified).invoke({"user_prompt": state["user_prompt"]})
    log_prompt_tokens(prompt_val, "build_outline")
    
    llm = get_llm()
    structured_llm = llm.with_structured_output(PresentationOutline)
    
    outline_dict = {}
    last_error = ""
    for attempt in range(3):
        try:
            if attempt == 0:
                outline_obj = structured_llm.invoke(prompt_val.to_messages())
            else:
                print(f"[build_outline] ✗ Parsing attempt {attempt} failed, recorrecting...")
                messages = prompt_val.to_messages()
                messages.append(HumanMessage(content=f"Validation failed: {last_error}\nPlease fix the JSON output and try again."))
                outline_obj = structured_llm.invoke(messages)
                
            outline_dict = outline_obj.model_dump()
            break
        except Exception as e:
            last_error = str(e)
            print(f"[build_outline] Attempt {attempt+1} error: {e}")
            if attempt == 2:
                print("[build_outline] ✗ All retries failed.")
    
    print("[build_outline] ✓ Outline created with {} slides".format(len(outline_dict.get('slides', []))))
    return {"topic_outline": outline_dict, "status": "drafting"}

def draft_slides(state: AgentState) -> dict:
    print("[draft_slides] Starting...")
    outline = state.get("topic_outline", {})
    title = outline.get("title", "Presentation")
    slides = outline.get("slides", [])
    
    llm = get_llm()
    structured_llm = llm.with_structured_output(DraftedSlideContent)
    
    final_slides = []
    batch_inputs = []
    
    for s in slides:
        prompt_val = build_draft_slide_prompt().invoke({
            "title": title,
            "heading": s["heading"],
            "subheadings": "\n".join(f"- {topic}" for topic in s["subheadings"])
        })
        batch_inputs.append(prompt_val.to_messages())
        
    if batch_inputs:
        # Just logging the first prompt's tokens to avoid spam
        log_prompt_tokens(build_draft_slide_prompt().invoke({"title": title, "heading": slides[0]["heading"], "subheadings": slides[0]["subheadings"]}), "draft_batch_sample")
        print(f"[draft_slides] Drafting {len(batch_inputs)} slides in parallel...")
        try:
            # Parallel inference via batch
            drafted_objs = structured_llm.batch(batch_inputs)
            for original_slide, drafted in zip(slides, drafted_objs):
                final_slides.append({
                    "type": original_slide["type"],
                    "heading": original_slide["heading"],
                    "content": drafted.content,
                    "layout": drafted.layout,
                    "source": drafted.source
                })
            print("[draft_slides] ✓ Batch drafting successful.")
        except Exception as e:
            print(f"[draft_slides] Batch drafting failed: {e}. Falling back to sequential...")
            for idx, (original_slide, msgs) in enumerate(zip(slides, batch_inputs)):
                try:
                    drafted = structured_llm.invoke(msgs)
                    final_slides.append({
                        "type": original_slide["type"],
                        "heading": original_slide["heading"],
                        "content": drafted.content,
                        "layout": drafted.layout,
                        "source": drafted.source
                    })
                except Exception as e2:
                    print(f"[draft_slides] ✗ Slide {idx+1} failed: {e2}")
                    final_slides.append({
                        "type": original_slide["type"],
                        "heading": original_slide["heading"],
                        "content": original_slide["subheadings"], # fallback to raw outline
                        "layout": "Centered title",
                        "source": "Source: Internal Data"
                    })

    plan_dict = {
        "title": title,
        "color_palette": outline.get("color_palette", {}),
        "font_pair": outline.get("font_pair", {}),
        "slides": final_slides
    }
    
    plan_text = json.dumps(plan_dict, indent=2)
    print("[draft_slides] ✓ Final plan successfully assembled:\n" + plan_text + "\n")
    return {"slide_plan": plan_text, "status": "generating"}

def generate_js(state: AgentState) -> dict:
    print("[generate_js] Starting...")
    is_simplified = state.get("simplified", False)
    prompt_val = build_generator_prompt(simplified=is_simplified).invoke({"slide_plan": state["slide_plan"]})
    log_prompt_tokens(prompt_val, "generate_js")
    
    llm = get_llm()
    chain = build_generator_prompt(simplified=is_simplified) | llm | StrOutputParser()
    
    js_code = chain.invoke({"slide_plan": state["slide_plan"]})
    
    # Optional markdown stripping if the model still wrapped in code fences
    js_code = re.sub(r"^```(?:javascript|js)?\s*\n", "", js_code.strip(), flags=re.IGNORECASE)
    js_code = re.sub(r"\n```\s*$", "", js_code.strip())
    
    print(f"[generate_js] ✓ JS code generated ({len(js_code)} chars)")
    print(f"   [Preview]:\n{js_code[:300]}...\n")
    return {"js_code": js_code, "status": "executing"}

def execute_js(state: AgentState) -> dict:
    print("[execute_js] Starting...")
    result = run_js_code(state["js_code"])
    
    if result["success"]:
        print("[execute_js] ✓ Execution successful")
        if result.get('stdout', '').strip():
            print(f"   [Stdout]:\n{result['stdout']}")
        return {
            "execution_result": result["stdout"],
            "output_path": result["output_path"],
            "status": "done",
            "error": None
        }
    else:
        print("[execute_js] ✗ Execution failed — retrying")
        if result.get('stderr', '').strip():
            print(f"   [Stderr]:\n{result['stderr']}")
        if result.get('stdout', '').strip():
            print(f"   [Stdout]:\n{result['stdout']}")
        return {
            "execution_result": result["stderr"],
            "error": result["stderr"],
            "status": "fixing"
        }

def fix_js(state: AgentState) -> dict:
    print("[fix_js] Starting...")
    retry_count = state.get("retry_count", 0)
    if retry_count >= 3:
        print("[fix_js] ✗ Max retries reached")
        return {"status": "failed"}
    
    is_simplified = state.get("simplified", False)
    prompt_val = build_fixer_prompt(simplified=is_simplified).invoke({
        "js_code": state["js_code"],
        "error": state["error"]
    })
    log_prompt_tokens(prompt_val, "fix_js")
    
    llm = get_llm()
    chain = build_fixer_prompt(simplified=is_simplified) | llm | StrOutputParser()
    
    fixed_code = chain.invoke({
        "js_code": state["js_code"],
        "error": state["error"]
    })
    
    fixed_code = re.sub(r"^```(?:javascript|js)?\s*\n", "", fixed_code.strip(), flags=re.IGNORECASE)
    fixed_code = re.sub(r"\n```\s*$", "", fixed_code.strip())
    
    print(f"[fix_js] ✓ Code fixed (attempt {retry_count + 1}). New JS length: {len(fixed_code)}")
    print(f"   [Preview]:\n{fixed_code[:300]}...\n")
    return {
        "js_code": fixed_code,
        "retry_count": retry_count + 1,
        "status": "executing"
    }

def report_result(state: AgentState) -> dict:
    if state["status"] == "done":
        print(f"[report_result] SUCCESS: Presentation generated at {state['output_path']}")
    else:
        print(f"[report_result] FAILED: Last error message:\n{state['error']}")
        import sys
        sys.exit(1)
    return {}
