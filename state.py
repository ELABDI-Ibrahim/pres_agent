from typing import TypedDict, Optional, Any

class AgentState(TypedDict):
    user_prompt: str           # Original user request
    topic_outline: Any         # The high-level outline dictionary
    slide_plan: str            # Structured outline (JSON string)
    js_code: str               # Generated pptxgenjs script
    execution_result: str      # stdout/stderr from node
    error: Optional[str]       # Last error message if any
    retry_count: int           # How many fix attempts so far
    output_path: str           # Final .pptx path on success
    status: str                # "planning"|"drafting"|"generating"|"executing"|"fixing"|"done"|"failed"
    simplified: bool           # Whether to use simplified token-saving prompts
