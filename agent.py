import sys
import os
from dotenv import load_dotenv

load_dotenv()

from langgraph.graph import StateGraph, END
from state import AgentState
from nodes import build_outline, draft_slides, generate_js, execute_js, fix_js, report_result

def build_graph():
    g = StateGraph(AgentState)

    g.add_node("build_outline", build_outline)
    g.add_node("draft_slides", draft_slides)
    g.add_node("generate_js", generate_js)
    g.add_node("execute_js", execute_js)
    g.add_node("fix_js", fix_js)
    g.add_node("report_result", report_result)

    g.set_entry_point("build_outline")
    g.add_edge("build_outline", "draft_slides")
    g.add_edge("draft_slides", "generate_js")
    g.add_edge("generate_js", "execute_js")

    g.add_conditional_edges("execute_js", lambda s: s["status"], {
        "done": "report_result",
        "fixing": "fix_js",
    })

    g.add_conditional_edges("fix_js", lambda s: s["status"], {
        "executing": "execute_js",
        "failed": "report_result",
    })

    g.add_edge("report_result", END)

    return g.compile()

if __name__ == "__main__":
    import argparse

    if "GROQ_API_KEY" not in os.environ:
        print("Error: GROQ_API_KEY environment variable is not set.", file=sys.stderr)
        sys.exit(1)

    parser = argparse.ArgumentParser(description="LangGraph Presentation Agent")
    parser.add_argument("topic", nargs="*", default=["Retrieval-Augmented Generation (RAG) — 5 slides"],
                        help="The topic for the presentation")
    parser.add_argument("--simplified", action="store_true", 
                        help="Run in simplified mode (fewer tokens) by omitting the raw documentation from prompts")
    
    args = parser.parse_args()
    topic = " ".join(args.topic)
    
    # Also support environment variable SIMPLIFIED_MODE
    is_simplified = args.simplified or os.environ.get("SIMPLIFIED_MODE") == "1"
    
    print(f"Generating presentation for topic: {topic}")
    if is_simplified:
        print("Running in SIMPLIFIED mode (docs excluded to save tokens).")
    
    graph = build_graph()
    
    initial_state = {
        "user_prompt": topic,
        "topic_outline": {},
        "slide_plan": "",
        "js_code": "",
        "execution_result": "",
        "error": None,
        "retry_count": 0,
        "output_path": "",
        "status": "planning",
        "simplified": is_simplified,
    }
    
    graph.invoke(initial_state)
