# Key Insights  
- **Plan Ahead:** Invest effort in structuring the presentation up front. Starting with a detailed outline (topics, order, key message for each) dramatically improves quality. As one guide warns, *“generate a presentation about X”* without planning produces *“generic slides requiring extensive rework”*【55†L98-L107】. Spend time creating a mini table-of-contents or slide list before invoking the LLM.  
- **Explicit Structure:** Use clear, explicit instructions and schema constraints. Prompt the model to output well-formed JSON (or XML-like tagged) structures. For example, instructing Claude to *“return ONLY valid JSON”* and specifying a JSON schema helps enforce consistency【56†L142-L149】【55†L252-L260】. Define each slide’s fields (e.g. `title`, `bullets`, `visuals`, `layout`, `notes`) and tell the model exactly what to output, preventing it from inventing structure or omitting fields【55†L252-L260】【56†L142-L149】.  
- **Few-Shot and Examples:** Provide multiple examples of the desired output format within the prompt. Claude, especially, responds strongly to examples wrapped in tags. Embedding 3–5 examples (inside `<example>` tags or similar) of slide JSON or bullet lists can guide tone and format【5†L277-L284】【56†L142-L149】. This “show, don’t tell” approach reduces ambiguity.  
- **Slide-by-Slide Workflow:** Break the generation into modules: first generate an outline, then fill in each slide’s content. A two-step pipeline (outline then content) yields better structure. For instance, one system prompt creates a JSON list of slides, and a follow-up prompt fleshes out each slide’s bullets【56†L142-L149】【18†L229-L238】. This mirrors the proven *“plan slides → populate slides”* pattern【18†L259-L264】【55†L98-L107】.  
- **Limit and Format Content:** Impose concrete constraints on slide content. Tell the model to keep bullets short (e.g. ≤12 words) and limit bullet count (3–5 per slide)【56†L142-L149】【56†L197-L200】. Specify formatting rules (e.g. remove citations, use plain headings) to avoid the model spitting out unwanted annotations【33†L124-L133】【56†L197-L200】. Such guardrails prevent bloated or “hallucinated” text.  
- **Use Templates/Masters:** Predefine slide layouts or masters in PptxGenJS for consistent design. PptxGenJS’s Slide Master feature lets you set global styles and logos, ensuring visual consistency across slides【25†L123-L126】. Feeding the LLM a schema that includes a `layout` or `template` field can map directly to these masters.  
- **Iterate and Validate:** Include a validation step to catch JSON parse errors or format issues. Encourage the agent to test its own output (for example, by asking it to “review the JSON and ensure all required fields are present”). Track progress and errors in structured logs (Claude can maintain JSON logs of progress)【7†L789-L797】. Plan for an iterative loop where the agent self-critiques and refines the slides (generate draft → review → refine).  
- **Claude-Specific:** Frame Claude’s role and capabilities: explicitly set a role like *“You are a professional presentation designer”* and use clear language. Claude excels with XML-like structuring (e.g. `<instructions>` sections) and benefits from concise, direct phrasing【5†L237-L247】【5†L277-L284】. Since Claude handles multi-step reasoning internally, prompting should still be stepwise to ensure control.  

# Prompt Engineering Patterns  

- **JSON Schema Prompting:** Instruct the model to output a JSON array of slide objects. For example:  
  ``` 
  You are a slide deck creator. Given the prompt, output a JSON array of slides.  
  Each slide: { "title_text": "...", "text": ["Bullet1", "Bullet2", ...], "image_desc": "optional" }.  
  First slide may be a title slide with 'title_text' and optional 'subtitle_text'.  
  Keep all bullets concise (<= 12 words).  
  ```  
  This kind of schema-forward prompt (from Rahul Kumar’s example) tells the model exactly which fields to produce and how they should look【56†L142-L149】. The system message “Return ONLY valid JSON.” can further enforce formatting.  

- **Explicit Instructions & Constraints:** Break the task into steps or rules in the prompt. For instance, a prompt can enumerate tasks (noise filtering, hierarchy detection, formatting) as in the *“Clean PowerPoint Architect”* example【33†L124-L133】【33†L146-L156】. Include rules like “Remove all metadata/prefixes” or “Output only headings formatted for PowerPoint import.” Using numbered steps or bullet points within the prompt helps the model follow a strict process.  

- **Role and Tone Setting:** Begin prompts by assigning a clear role or context. e.g., “You are an expert presentation designer creating a slide deck for [audience/context].” This focuses Claude’s tone and output style. Providing context (audience, purpose, key points) before asking for content is shown to improve relevance【5†L237-L247】.  

- **Few-Shot Examples:** Show sample slide data or JSON entries. Wrap them in `<example>` tags (Claude docs recommend `<example>` or `<examples>`) to differentiate them from instructions【5†L277-L284】. For instance: `<example> { "title_text": "Demo Slide", "text": ["Key point 1", "Key point 2"], "image_desc": "chart of growth" } </example>`. Multiple, diverse examples help Claude infer the pattern of structured output.  

- **Chunk and Chain (if needed):** For large decks or very detailed slides, consider chaining: first output an outline schema, review it, then generate slide content. The LangGraph approach shows this clearly: a `plan_slides` prompt returns the structure, and a separate `fill_content` prompt expands each bullet【18†L229-L238】【18†L241-L250】. Chain-of-thought style (“let’s think step by step”) isn’t explicitly needed if using schema and tools, but you can still instruct Claude to list slide titles first, then create bullets.  

- **Prefill with Placeholders:** If using PptxGenJS, you might have template placeholders. Prompts can instruct the model to emit specific placeholder tags or IDs. For example: `{"placeholder_title": "Sales", "content": "Quarterly growth was 5%."}`. Ensuring the LLM knows it should populate predefined slides (and not delete them prematurely) is critical【53†L289-L298】.  

- **JSON vs. Text Balance:** Use JSON for structured data (titles, bullets, metadata) but free text for sections like speaker notes or narrative if needed. Claude docs recommend structured output for data and free text for context. For example, enforce slides and bullets in JSON, but ask for “speaker notes” as an additional string array to maintain separation of slide text vs. narration【55†L252-L260】.  

# Example Prompts  

Below are example prompts (Claude-optimized) for various slide-generation tasks. These can be copy-pasted and adapted as needed (replace bracketed placeholders). Each prompt enforces structure and style constraints.  

- **Outline Generation (JSON):**  
  > *System:* “You are a professional slide deck designer.”  
  > *User:* “Given the topic `[Your Topic]` and audience `[Your Audience]`, output ONLY a JSON array of slides. Each slide object should have `{ "title_text": string, "text": [string], "visuals": [string], "notes": string }`. The first slide may include a subtitle field. Bullets should be concise (≤ 12 words). Example format is provided. Do not output any additional text.”【56†L142-L149】【55†L252-L260】  

- **Slide Content (Bullets) Generation:**  
  > *System:* “Keep bullets focused and factual.”  
  > *User:* “For slide titled `[Slide Title]`, create 3–5 crisp bullet points, each ≤ 12 words, summarizing key ideas from the outline. Use the given context: `[Insert outline bullet or topic here]`. No fluff or filler.”【56†L197-L200】  

- **Narrative Flow / Storytelling:**  
  > *User:* “Arrange the following points into a coherent story arc using 'Problem → Solution → Result'. Output a bullet outline. For each bullet, use action-oriented language and connect to the audience. Then generate a brief 'Executive Summary' slide with one main takeaway and 3 supporting points.” (No direct citation; general best practice from structured presentations)  

- **JSON Slide Schema Prompt:**  
  > *User:* “Convert this talk plan into a JSON slide array. Schema: `{ "slideNumber": int, "slideType": "agenda|sectionTitle|content", "slideTitle": string, "slideContent": [string], "speakerNotes": [string] }`.  Fill `slideContent` with 3–5 bullets (≤12 words each) for content slides; list section titles for agenda slides; leave `speakerNotes` empty where not needed. Output only valid JSON.”【55†L221-L230】  

- **Layout Planning:**  
  > *User:* “Suggest a slide layout for each slide based on their content. For each slide in the JSON array, add a `layout` field indicating a suitable template (e.g., 'Title+Bullets', 'TwoColumn', 'ImageLeft', etc.). Ensure the chosen layouts match the content type.” (This leverages understanding of PptxGenJS layouts).  

- **Image Prompting:**  
  > *User:* “For each slide, generate a short descriptive prompt for an illustrative visual. Output an array of image descriptions aligned with each slide’s `title_text`. Example: `Slide 1: “A line chart showing growth.”`. Maintain the same order as slides.”  

# Agent Architecture (Modular Design)  

Design the slide-generation agent as a pipeline of focused modules (nodes), as illustrated below:

1. **Input Understanding:** Parse the user’s request (topic, audience, key points). Validate inputs.  
2. **Outline Generator:** LLM call to produce a *slide outline* in structured form (JSON list of slide stubs with titles and minimal info). Example: use a prompt like the “You are a slide deck creator…” prompt above to get slide titles and placeholders【56†L142-L149】.  
3. **Content Generator:** For each slide stub, either in one bulk LLM call or sequential calls, generate detailed content. This can be done as:  
   - **Bulk approach:** Ask LLM to fill all slides in one JSON response (riskier for length).  
   - **Iterative approach:** Loop over slides; for each, prompt: “Create bullets for slide X with title ‘Y’”【56†L197-L200】. Concatenate results into a new slide JSON. (The LangGraph example uses this stepwise fill node.)  
4. **Layout Mapper:** Translate slide schema fields to PptxGenJS function calls. E.g., for each JSON slide:  
   - Call `pptx.addSlide()` with appropriate layout (e.g. `prs.slide_layouts[1]` for title+bullets).  
   - Map `title_text` → `slide.shapes.title.text`, `text` bullets → `slide.addText()` or placeholder paragraphs【18†L229-L238】.  
   - If `visuals` or `image_desc` present, generate or fetch images and call `slide.addImage(...)`.  
   This module implements the rules for layout selection and styling (fonts, positions, etc.). In a PptxGenJS context, this means scripting calls like `slide.addText("...", { x:…, y:…, w:…, h:…, options })` as in the docs【19†L42-L50】【20†L51-L59】.  
5. **Validation Layer:** After LLM output, validate JSON structure and content: parse JSON, check required fields, enforce bullet limits, etc. If issues found, either auto-correct or flag the prompt for re-generation. For example, test JSON.parse or run schema validation; if parse fails, ask Claude to fix the JSON. Claude’s structured-outputs feature (using `output_config.format`) can enforce validity if using the API【9†L267-L276】.  
6. **Refinement Loop:** Optionally, include a critique/refine step: have Claude review the generated slide content against the original brief. E.g., “Review the outline to ensure it covers all important points from the prompt” or “Check that each slide has exactly 3–5 bullets of ≤12 words.” Incorporate feedback by re-prompting specific slides or re-running modules. This is akin to the recommended “self-correction” chain (draft → review → refine).  

Each of these steps can be separate LLM calls or functions. The LangGraph workflow example splits it into `plan_slides`, `fill_content`, and `build_slides` nodes【18†L229-L238】【18†L263-L264】. The final agent composes these nodes, possibly with loops for review.  

# Slide JSON Schema & PptxGenJS Mapping  

An ideal slide object schema (returned by the LLM) might look like:
```json
[
  {
    "title": "Slide Title",
    "bullets": ["Point 1", "Point 2", "Point 3"],
    "visuals": ["chart: revenue over time"],
    "layout": "TitleBullets", 
    "notes": "Additional speaker notes if any"
  },
  ...
]
```
Each field maps to PptxGenJS operations:
- **title** → `slide.shapes.title.text = title`.  
- **bullets** array → for each bullet `slide.addText(bullet, {options with bulletLevel})` or manipulating placeholders【20†L56-L63】【18†L241-L250】.  
- **visuals** (textual prompts or URLs) → `slide.addImage({ path: ..., x:..., y:... })`. If the LLM outputs an Unsplash prompt, fetch the image and use its URL.  
- **layout** → choose a slide layout or master (e.g. `'TitleBullets'` could map to `prs.slide_layouts[1]`). PptxGenJS slide masters let you define these layouts in code or a template【25†L123-L126】.  
- **notes** → speaker notes can be added via `slide.addNotes(slideNotes)` if supported, or stored for separate output. (In Google Slides Apps Script, notes are accessible.)  

When writing PptxGenJS code, one typically does:
```js
let slide = pptx.addSlide({ masterName: "CorporateMaster" });
slide.addText(slideObj.title, { x: 1, y: 0.5, fontSize: 24 });
slide.addText(slideObj.bullets.join("\n"), { x: 1, y: 1.5, fontSize: 18, bullet: true });
// ... handle images, styling ...
```
Styling details (fonts, colors) should be set either globally in the master or per text box. For table/chart slides, include fields like `"tableData": [...], "chartData": {...}` in the JSON, and have the layout mapper call `slide.addTable()` or `slide.addChart()` accordingly.  

**Mapping rules:**  
- Text fields become `addText`. For multi-line bullets, use `text.split` into multiple paragraphs or a joined string with newline.  
- Enumerate layouts: for common cases (title slide, bullet slide, two-column, etc.), predefine layout names that map to slide masters or layout indices.  
- Styles: encode style hints in JSON (e.g. font size, colors), or rely on the master template for corporate styling.  

Example mapping snippet (pseudocode):  
```js
if (slideObj.layout === "TitleSlide") {
  let s = prs.addSlide(prs.slide_master_layouts["TitleSlide"]);
  s.shapes.title.text = slideObj.title;
  // no bullets on title slide
} else if (slideObj.layout === "TitleBullets") {
  let s = prs.addSlide(prs.slide_master_layouts["TitleBullets"]);
  s.shapes.title.text = slideObj.title;
  for (let b of slideObj.bullets) {
    s.addText(b, { x:1, y:1, color:'363636', bullet:true });
  }
}
if (slideObj.visuals) {
  for (let i=0; i<slideObj.visuals.length; i++) {
    let imgPath = getImage(slideObj.visuals[i]); // tool to fetch or generate image
    s.addImage({path: imgPath, x:5, y:1, w:4});
  }
}
```
This approach follows the “iterate slide data → populate PPTX placeholders” pattern【18†L259-L264】.  

# Common Failure Modes & Mitigations  

- **Hallucinated or Irrelevant Content:** LLMs may invent facts or stray off-topic. Mitigation: include factual grounding (e.g. attach sources or instruct “only use common knowledge or provided context”). After generation, use a fact-checking step or ask the model to verify each bullet. Claude docs remind us that vague prompts lead to hallucinations【45†L53-L60】【45†L62-L70】. Use precise prompts like “based on the known data,” or compare against provided input.  

- **Invalid or Malformed JSON:** If the LLM drifts from schema (missing braces, wrong types), downstream code will fail. To avoid this, strongly enforce the schema in the prompt (as above) and consider using Claude’s structured outputs feature (JSON schema with validation)【9†L267-L276】. Include phrases like “Output valid JSON with no markdown.” Validate and, if errors, re-prompt with the LLM to correct it.  

- **Excessively Dense Slides:** LLMs tend to add too many bullets or long sentences. Prevent this by hard limits in the prompt (e.g. “max 5 bullets, 12 words each”【56†L142-L149】). Also, iterative refinement helps: ask Claude to shorten slides (“reduce text, keep the data” as in one tested prompt【22†L144-L152】).  

- **Weak Narrative Flow:** The slides may lack logical order or story. Address this by asking for an “Agenda” or “Outline” slide, or explicitly specifying slide sequencing rules (Problem→Solution→Result, timeline, etc.). If needed, have the agent reorder slides based on a narrative command.  

- **Template/Formatting Inconsistency:** Without guidance, slides might not match a desired style. Solution: provide the LLM with descriptions of the template (e.g. “title font Arial 24pt, bullets Georgia 18pt”) or better, bake it into PptxGenJS by using a template PPTX or master layouts【54†L1-L4】. You can also ask the model to *read* a slide master (in Claude’s PowerPoint add-in scenario it reads the master), but for PptxGenJS you’ll enforce via code.  

# Practical Implementation Tips  

- **Iterative Development:** Start small. Test prompts with a short topic and 2–3 slides before scaling up. Use low temperature (0.2–0.4) to reduce randomness. Log all intermediate JSON for debugging.  

- **Leverage PptxGenJS Features:** Use Slide Masters and custom layouts for consistent design【54†L1-L4】. Define layouts for common slide types (title, section header, bullet slide, image slide). Handle auto-page (large tables/text) if needed using `newAutoPagedSlides`.  

- **Error Handling:** In your code, catch JSON parsing exceptions and store them. For example, Rahul Kumar’s code appends *“JSON parse error:…”* to a state log【56†L159-L167】. You can then re-prompt that specific part.  

- **Multimodal Integration:** If slide JSON includes image prompts (`image_desc`), integrate an image-generation tool. For a copyright-safe process, prefer generating images with a model (Midjourney/DALL-E) as suggested【53†L345-L353】. Prepend a consistent style directive to all image prompts for visual coherence【53†L354-L363】.  

- **Styling and Localization:** If you have specific color palettes or fonts, set them in PptxGenJS when adding text (`fontFace`, `color`). PptxGenJS supports hex colors and scheme colors【19†L42-L49】. For non-English slides, specify language/tone in prompts.  

- **Review & Iterate:** Once the deck is generated, have Claude (or another pass of the agent) review the slides for clarity, grammar, and consistency (“Check grammar, suggest improvements”). This can catch small errors.  

- **Human Oversight:** Always plan for a human-in-the-loop to check critical slides (especially data or claims). As one checklist advises: finalize grammar, clarity, consistency, and fix any Hallucinations manually after AI generation【53†L378-L386】.  

# Conclusion  

By combining structured prompting (explicit schemas, examples, stepwise tasks) with a modular agent design, you can reliably generate high-quality slide decks programmatically. For Claude-based agents, leverage its strength with XML/JSON tagging and examples【5†L277-L284】【7†L789-L797】. The agent should plan the outline, generate slide content, then map it into PptxGenJS calls. Using Slide Masters/templates ensures a polished visual style【54†L1-L4】. Finally, always validate and refine outputs to catch hallucinations or formatting issues. Following these guidelines will yield a production-ready pipeline where Claude consistently produces structured, concise slide content that your PptxGenJS code can turn into a professional presentation.  

**Sources:** Guidelines and examples from Claude’s documentation and best practices【5†L277-L284】【7†L789-L797】; real-world AI presentation generation pipelines【49†L99-L107】【53†L389-L397】【56†L142-L149】【55†L252-L260】; and PptxGenJS official docs and tutorials【25†L118-L126】【54†L1-L4】.