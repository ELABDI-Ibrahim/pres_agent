import subprocess, os, re

# Use the current working directory where package.json is located
WORKDIR = os.path.abspath(os.path.dirname(__file__))

def clean_js(raw: str) -> str:
    raw = re.sub(r"^```(?:javascript|js)?\s*\n", "", raw.strip(), flags=re.IGNORECASE)
    raw = re.sub(r"\n```\s*$", "", raw.strip())
    return raw.strip()

def run_js_code(js_code: str) -> dict:
    code = clean_js(js_code)
    script_path = os.path.join(WORKDIR, "_slide_gen.js")
    with open(script_path, "w", encoding="utf-8") as f:
        f.write(code)
        
    result = subprocess.run(
        ["node", "_slide_gen.js"],
        capture_output=True, text=True, cwd=WORKDIR
    )
    
    return {
        "success": result.returncode == 0,
        "stdout": result.stdout,
        "stderr": result.stderr,
        "output_path": os.path.join(WORKDIR, "output.pptx"),
        "workdir": WORKDIR,
    }
