Architecting Intelligent Presentation Agents: Advanced Prompt Engineering and System Design for PptxGenJS AutomationThe automated generation of professional presentation slides represents a highly complex intersection of natural language processing, cognitive structuring, and programmatic layout rendering. While Large Language Models (LLMs) are exceptionally capable of synthesizing textual information, transforming that synthesis into an engaging, spatially coherent, and programmatically valid visual artifact requires a highly orchestrated multi-agent architecture. This exhaustive analysis provides a comprehensive blueprint for constructing an elite AI agent optimized specifically for the Anthropic Claude model family, designed to output production-ready PowerPoint presentations via the PptxGenJS library.The paradigm of automated slide generation has shifted dramatically from monolithic, single-prompt text summarization to specialized, stateful agent graphs. Early iterations of AI slide generators suffered inherently from the "generate everything" trap, wherein models would output encyclopedic walls of text devoid of visual hierarchy, aesthetic balance, or persuasive narrative flow. The contemporary, robust approach mitigates these failures by coupling advanced cognitive frameworks—such as the Minto Pyramid Principle and the SCQA (Situation, Complication, Question, Answer) model—with rigorous XML-based prompt engineering and deterministic JSON schema validation.Furthermore, integrating these cognitive processes with PptxGenJS—a pure JavaScript library capable of generating standard Open Office XML (OOXML) files without native dependencies—allows for seamless deployment across Node.js backends, React frontends, and serverless environments like AWS Lambda or Cloudflare Workers. The following report details the exact architecture, Claude-specific prompting strategies, ideal JSON schemas, and exhaustive prompt libraries required to build a fault-tolerant, high-fidelity presentation generation system.Phase 1: Multi-Agent Architecture DesignTo achieve deterministic, high-quality presentation generation, the system must abandon the monolithic prompt approach in favor of a modular, multi-agent architecture. This framework, often orchestrated using state-machine libraries such as LangGraph or custom routing logic, treats the presentation generation workflow as a reliable, stateful graph rather than a single probabilistic text generation event. The architecture is divided into specialized nodes, each responsible for a distinct phase of the cognitive and programmatic translation process.State Management and OrchestrationThe foundation of the architecture is a robust state management system. The state object, typically defined as a strongly typed dictionary in Python or an interface in TypeScript, serves as the single source of truth passed between agent nodes. It maintains the user's original prompt, the evolving presentation outline, the generated slide content, metadata for visual enrichment, and execution error logs. By maintaining state across distinct execution phases, the system supports iterative refinement and human-in-the-loop interventions, allowing a user to modify the outline before the computationally expensive rendering phase begins.The standard state dictionary for a presentation agent typically contains the following core parameters, passed from node to node:State VariableData StructurePurpose and Functionalityuser_promptStringThe raw input string provided by the user, including uploaded documents or strategic intent.audience_profileObjectExtracted demographics, technical proficiency, and primary goals of the intended audience.slides_outlineArray<Object>A sequential list of slide titles and core theses, establishing the narrative arc.slides_contentArray<Object>The fully fleshed-out slide data, including bullet points, chart data, and speaker notes.pptx_schemaJSON ObjectThe strictly formatted JSON object mapped exactly to PptxGenJS API requirements.execution_errorsArray<String>Logs of validation failures (e.g., overlapping coordinates, invalid hex colors) for the repair agent.The Node TopologyThe multi-agent system comprises five primary modules, each executed sequentially with embedded cyclical validation loops to ensure structural integrity and factual accuracy.1. Input Understanding and Strategy Module
The initial node acts as an intent classifier and context extractor. It ingests raw documents, research papers, or user prompts and outputs a structured representation of the presentation's overarching goal. It identifies the target audience (e.g., C-suite executives vs. technical engineering teams), the desired tone (e.g., persuasive, analytical, academic), and any specific constraints (e.g., a maximum slide count of 10). This node is critical for preventing the AI from generating a generic summary; it forces the subsequent nodes to adopt a specific communicative strategy.2. The Planner Agent (Outline Generator)
Operating strictly on structural logic, the Planner Agent separates narrative design from content generation. It utilizes the Minto Pyramid Principle, ensuring that the primary recommendation or "answer" is presented first, followed by mutually exclusive and collectively exhaustive (MECE) supporting arguments. This agent generates a high-level JSON outline containing only slide titles and core theses. This prevents the LLM from losing context or experiencing "middle-loss," a common failure mode when attempting to write an entire 20-slide deck in one pass.3. The Content Generator Agent
The Content Generator iterates over the JSON outline, populating each slide with specific, highly constrained text. It is governed by strict heuristic rules designed to combat cognitive overload: no more than four bullet points per slide, and no more than twelve words per bullet. This node is also responsible for identifying data points that should be converted into quantitative visual aids, such as substituting a text description of quarterly revenue with a directive to render a bar chart. Excess information is strategically routed into a speaker_notes JSON field rather than being crammed onto the visual slide.4. The Layout and Mapping Agent
This highly specialized node translates semantic content into spatial geometry. The Layout Mapper understands the strict coordinate system of PptxGenJS—which utilizes either inches (e.g., $10 \times 7.5$ for a standard 4:3 slide) or percentage strings (e.g., "50%"). It calculates bounding boxes for text arrays to prevent overlap, assigns standard corporate layouts (e.g., two-column comparisons, quote callouts, metric dashboards), and specifies precise chart types (e.g., mapping time-series data to pres.ChartType.line).5. Validation Layer and Assembly Engine
Before code execution, a Critic Agent reviews the final JSON schema against PptxGenJS API constraints. It actively scans for hallucinated properties, ensures all hex color codes are devoid of the # prefix (which corrupts the OOXML file), and verifies that text length will not overflow the allocated geometric bounds. If an error is detected, the Critic Agent triggers a self-correction loop, sending the flawed JSON back to the Layout Mapper with specific error coordinates. Once validated, the JSON is passed to a Node.js runtime where the generate-ppt.js script maps the data to PptxGenJS functions and writes the binary .pptx file.Phase 2: Claude-Specific Prompt Engineering StrategiesAnthropic's Claude models, particularly the Claude 3.5 Sonnet architecture, exhibit distinct behavioral patterns that differ from other large language models like GPT-4o or Gemini. Optimizing prompts for Claude requires leveraging its unique parsing capabilities, specifically its affinity for XML tags, structured prefilling, and Guided Chain-of-Thought reasoning. Generic prompting techniques yield suboptimal layouts and frequent JSON parsing errors when generating complex presentation schemas.XML Tag Structuring and Context IsolationClaude has been extensively fine-tuned to recognize and compartmentalize information encapsulated within XML tags. When generating complex presentation schemas, intermingling instructions, source data, and output constraints within plain text inevitably leads to context degradation, hallucination, and instruction ignorance. By encapsulating distinct prompt components in explicit tags, the prompt engineer provides Claude with an unambiguous hierarchical structure.The optimal structure for a Claude prompt involves a clear, nested hierarchy. The <system> or <role> defines the persona. The <task> defines the immediate objective. The <context> or <documents> tag houses the raw data the user wants to convert into a presentation. Crucially, the <constraints> and <output_format> tags must be placed at the very end of the prompt, ensuring they are the most recent tokens in Claude's context window before it begins generation.Structured Output Enforcement via PrefillingWhile modern API updates have introduced native JSON schema forcing (via output_config.format with type: "json_schema"), the technique of "prefilling" the assistant's response remains an exceptionally potent strategy for Claude, especially for complex, deeply nested slide schemas where strict API schema validation might fail or reject valid edge cases.By supplying the initial characters of the desired response in the API call—such as <json>\n{ or {"presentation": [—the system completely bypasses Claude's tendency to produce conversational preambles (e.g., "Here is the presentation schema you requested based on the data:"). Preambles are a primary cause of JSON decoding errors in automated pipelines. Prefilling physically forces the model's token generation to begin precisely at the root of the data structure, guaranteeing a parseable output payload and saving compute tokens.Guided Chain-of-Thought (CoT) Reasoning for Spatial LayoutsGenerating a visually coherent slide requires both spatial and narrative reasoning. If Claude is asked to output a JSON slide schema directly without a scratchpad, it relies entirely on its feed-forward generation, which often results in poor coordinate guessing, overlapping text, and misaligned charts.Guided Chain-of-Thought (CoT) prompting mitigates this by instructing Claude to utilize a <thinking> tag before generating the final <json> payload. Within the thinking block, the model is instructed to calculate spatial geometries explicitly. For example, the prompt forces Claude to write: "The title occupies $y=5\%$ to $y=15\%$. Therefore, the body text bounding box must begin at $y=20\%$. Since there are two columns, Column 1 will have $x=5\%, w=40\%$ and Column 2 will have $x=55\%, w=40\%$." This process of explicit intermediate calculation drastically reduces formatting hallucinations, ensures zero overlapping elements, and enforces logical narrative progression.Mitigating Apologies and Filler PhrasesSystem prompts for presentation agents must explicitly instruct the model to avoid apologies, filler phrases, and disclaimers. In automated pipelines, an LLM responding with "I cannot access real-time financial data, but here is a hypothetical slide..." breaks the downstream JSON parser. Claude 3.5 Sonnet's system prompts should include directives such as "Return JSON only. Do not apologize. Do not include introductory filler. Act as a deterministic data transformation function".Phase 3: Output Specification and PptxGenJS Mapping RulesThe transition from the semantic output of an LLM to a native, binary .pptx file is bridged by an intermediate JSON specification. This schema acts as a strict contract between the Python/LLM planning layer and the Node.js/PptxGenJS rendering layer. It must perfectly mirror the capabilities of the PptxGenJS API while remaining easily parsable by the rendering script.The Ideal JSON Slide Schema StructureThe following schema demonstrates the optimal, exhaustive structure for an AI-to-PptxGenJS pipeline. It rigorously isolates slide metadata, narrative content, visual assets, table structures, chart data, and strict spatial coordinates.JSON{
  "presentation_metadata": {
    "title": "Q3 Financial Performance Strategy",
    "layout": "LAYOUT_16x9",
    "author": "AI Strategy Agent",
    "master_template": "CorporateDark",
    "rtlMode": false
  },
  "slides":,
        "charts":,
                "values": 
              }
            ],
            "options": { "x": "50%", "y": "25%", "w": "45%", "h": "60%", "showLegend": true, "legendPos": "b", "barDir": "col" }
          }
        ],
        "tables":
      },
      "speaker_notes": "Emphasize to the board that the 14% expansion in EMEA was driven primarily by the new enterprise software tier launch in Germany."
    }
  ]
}
Mapping Rules: From JSON to PptxGenJS CodeThe execution layer (typically a Node.js script) consumes the validated JSON and executes PptxGenJS methods. The mapping rules must be strictly defined to prevent runtime errors and visual glitches.JSON Schema ElementPptxGenJS API MethodParsing Logic & Transformation Rulespresentation_metadata.layoutpres.layout = 'LAYOUT_16x9'Maps string constants directly. PptxGenJS supports LAYOUT_16x9, LAYOUT_16x10, LAYOUT_4x3, and LAYOUT_WIDE.text_blocks[n]slide.addText(text, options)Iterates through text arrays. Ensures coordinates (x,y,w,h) are passed as strings if they contain %, or as float if representing inches.charts[n].typepres.ChartType[type]Maps the JSON string "BAR" to pres.ChartType.bar. Also supports line, pie, doughnut, scatter, radar.charts[n].dataslide.addChart(type, data, opts)Passes the array of objects ([{name: "A", labels: ["X"], values: }]) directly to the API, alongside spatial options.tables[n].rowsslide.addTable(rows, options)Expects an array of row arrays. Each cell can be a string or a complex object {text: "A", options: {fill: "F1F1F1"}}.speaker_notesslide.addNotes(notes)Directly injects the string into the hidden notes panel of the slide.Handling Edge Cases in RenderingSeveral programmatic edge cases must be addressed in the JavaScript rendering layer to ensure the AI's output does not crash the PptxGenJS engine:Hexadecimal Color Sanitization: The most critical syntax rule in PptxGenJS is the strict omission of the # symbol in hexadecimal color codes. The library expects color: "FFFFFF", not color: "#FFFFFF". If a # is passed, it corrupts the internal OOXML <a:srgbClr> tags, causing PowerPoint to declare the file corrupted upon opening. The rendering script must include a regex sanitizer (e.g., opts.color.replace(/^#/, '')) for all color properties before calling addText or addChart.Opacity Encoding Prevention: LLMs occasionally attempt to encode CSS-style opacity into the hex string (e.g., generating an 8-character hex code like 00000020). This is invalid in PptxGenJS. Opacity must be handled via separate property flags (e.g., opacity: 0.12). The rendering script should truncate any hex string longer than 6 characters to prevent file corruption.Multilingual Font Stacks: When generating presentations containing CJK (Chinese, Japanese, Korean) characters alongside Latin characters, the LLM must be instructed to define universal font stacks in the JSON (e.g., fontFace: "Meiryo" or fontFace: "Arial Unicode MS"). If omitted, the default Calibri font will result in missing glyphs or layout breaking during PowerPoint rendering.Phase 4: Comprehensive Prompt Library for Agentic GenerationTo orchestrate the complex generation process, an exhaustive, highly specialized library of prompts is required. These prompts are divided into four distinct functional categories, utilizing XML structures, strict constraints, and Claude-specific optimization techniques.Category A: Slide Outline Generation and Narrative FlowThese prompts are utilized by the Planner Agent to establish the structural backbone of the presentation before any detailed content is generated.Prompt 1: The Minto Pyramid Strategic Outline
Purpose: Forces the LLM to structure executive presentations with the conclusion first, followed by logically grouped supporting evidence, preventing "mystery novel" style presentations where the point is hidden at the end.XML<system_instruction>
You are an elite management consultant at a top-tier firm. Your task is to generate a presentation outline based on the provided source data. You must adhere strictly to the Minto Pyramid Principle: lead with the core answer/recommendation on the first slide, followed by mutually exclusive, collectively exhaustive (MECE) supporting arguments.
</system_instruction>
<formatting_rules>
1. Use the SCQA (Situation, Complication, Question, Answer) framework for the opening sequence (Slides 1-3).
2. Limit the outline to exactly 10-12 slides.
3. Slide titles must be action-oriented, governing-thought takeaways, not generic topics (e.g., use "Cloud Migration Reduces OpEx by 20%" instead of "Financial Analysis").
</formatting_rules>
<input_data>
{{USER_SOURCE_MATERIAL}}
</input_data>
<task>
Analyze the input data and generate the outline. Return ONLY a valid JSON array of objects, where each object contains "slide_number", "slide_title", "slide_purpose", and "key_takeaway".
</task>
<json>

```xml
<system_instruction>
You are a master corporate storyteller and presentation designer. Transform the provided technical project update into a compelling narrative presentation using the Hero's Journey framework.
</system_instruction>
<framework_mapping>
- Slide 1-2 (The Ordinary World): Current baseline, legacy system constraints, and status quo.
- Slide 3-4 (The Inciting Incident): The critical failure, market shift, or crisis demanding immediate change.
- Slide 5-7 (The Journey/Trials): The implementation process, technical hurdles overcome, and engineering solutions.
- Slide 8-9 (The Victory): Measurable success metrics, ROI, and KPIs achieved.
- Slide 10 (The Return): Next steps, scaling strategies, and how the audience can leverage these capabilities.
</framework_mapping>
<input_data>
{{PROJECT_REPORT}}
</input_data>
<task>
Produce a 10-slide outline mapped precisely to this framework. Provide detailed descriptions of the emotional tone and narrative hook for each slide.
</task>
Prompt 3: Executive Summary Condensation
Purpose: Compresses massive documents into highly dense, scannable summaries optimized for time-poor C-suite audiences.XML<system_instruction>
Turn the provided comprehensive research brief into a high-impact, 5-slide Executive Summary presentation. 
</system_instruction>
<constraints>
- Assume an audience of C-suite executives with zero technical background but high financial literacy.
- Focus exclusively on ROI, efficiency gains, strategic risks, and measurable outcomes.
- Each slide must focus on exactly ONE key strategic insight.
- Ruthlessly eliminate technical jargon and operational minutiae.
</constraints>
<input_data>
{{RESEARCH_BRIEF}}
</input_data>
<task>
Draft the slide outlines. Use the `<thinking>` tag to explicitly explain why you chose to omit certain details to respect the time of the executive audience, ensuring only signal (no noise) remains. Then output the structured summary outline.
</task>
Prompt 4: The 10/20/30 Pitch Deck Enforcer
Purpose: Creates startup or project pitch decks adhering to Guy Kawasaki's famous 10/20/30 rule (10 slides, 20 minutes, 30-point font concept).XML<system_instruction>
Generate a pitch deck outline following the 10/20/30 rule: exactly 10 slides, designed to be presented in 20 minutes, focusing on high-level concepts.
</system_instruction>
<slide_requirements>
1. The Problem
2. Your Solution (Value Proposition)
3. Business Model
4. Underlying Magic / Technology
5. Marketing and Sales Strategy
6. Competitive Landscape
7. Management Team
8. Financial Projections and Key Metrics
9. Current Status, Accomplishments to Date, Timeline
10. Summary and Call to Action (The Ask)
</slide_requirements>
<input_data>
{{STARTUP_PITCH_TEXT}}
</input_data>
<task>
Map the provided input data to these 10 exact slides. Ensure the narrative flows logically, builds investment interest, and highlights the unique competitive moat.
</task>
Prompt 5: Academic Research Breakdown (Pedagogical Optimization)
Purpose: Converts dense academic papers into digestible, visually supported conference presentations, applying cognitive science principles for learning.XML<system_instruction>
You are an expert in pedagogical design and academic communication. Convert this dense research paper into a structured conference presentation.
</system_instruction>
<structure>
Allocate slides proportionally based on standard academic formats: 10% Introduction/Background, 20% Literature Review/Gap, 30% Methodology/Design, 30% Results/Data Analysis, 10% Conclusion/Future Work.
</structure>
<input_data>
{{ACADEMIC_PAPER_TEXT}}
</input_data>
<task>
Extract the core academic arguments. For each slide outline, explicitly identify which specific chart, table, or mathematical equation from the paper must be visually highlighted to support the specific claim being made on that slide.
</task>
Prompt 6: Problem-Solution-Benefit Framework
Purpose: Generates a highly persuasive, sales-oriented outline focused on alleviating pain points and delivering clear benefits.XML<system_instruction>
Generate a sales presentation outline using the Problem-Solution-Benefit framework.
</system_instruction>
<guidelines>
- Slides 1-2: Clearly articulate the prospect's specific pain points (The Problem). Use quantifiable costs of inaction.
- Slides 3-5: Introduce our product/service as the direct answer to those pain points (The Solution).
- Slides 6-8: Detail the specific, measurable positive outcomes of implementing the solution (The Benefit). Include case studies.
- Slide 9: Implementation timeline.
- Slide 10: Pricing and Next Steps.
</guidelines>
<task>
Analyze the product specs and target client persona provided, and output the 10-slide outline. Ensure the tone is consultative, not overly aggressive.
</task>
Category B: Slide Content Generation (Combating the "Wall of Text")These prompts are utilized by the Content Generator Agent to expand the outline into concise, highly readable slide text, avoiding the common AI failure of information overload.Prompt 7: The Anti-Wall-of-Text Content Generator
Purpose: Strictly enforces cognitive load theory by limiting text density and forcing the LLM to separate visual content from spoken content.XML<system_instruction>
You are a minimalist presentation designer specializing in cognitive load theory. Your task is to generate the exact text that will appear on the slides based on the provided outline. You are actively fighting against "Information Overload" and the "Wall of Text" phenomenon.
</system_instruction>
<strict_rules>
1. MAXIMUM 3 bullet points per slide.
2. MAXIMUM 12 words per bullet point.
3. Phrase every bullet as a complete, impactful idea, not a fragmented thought.
4. Eliminate all filler words.
5. If the source material is too dense to fit these rules, you MUST use the `speaker_notes` JSON field to store the excess context. DO NOT put excess text on the visual slide.
</strict_rules>
<input_outline>
{{SLIDE_OUTLINE_JSON}}
</input_outline>
<task>
Iterate through the outline and generate the minimal slide text and comprehensive speaker notes.
</task>
Prompt 8: Data-to-Insight Translator
Purpose: Transforms raw tables of numbers into narrative insights, ensuring every data slide passes the "So what?" test.XML<system_instruction>
Transform raw metrics into strategic narrative insights. For each slide in the outline that requires quantitative data, you must provide the raw data structure AND the interpretive takeaway.
</system_instruction>
<format>
Each slide content object must include:
- A "data_spotlight": A single massive number to highlight visually (e.g., "47%").
- An "insight_bullet": A one-sentence explanation of what the number means (interpretation).
- An "implication_bullet": A one-sentence explanation of why the audience should care (ROI/impact).
</format>
<input_data>
{{FINANCIAL_OR_METRICS_DATA}}
</input_data>
<task>
Analyze the data provided and generate 5 data-driven slides following this exact format.
</task>
Prompt 9: The "Progressive Disclosure" Explainer
Purpose: Breaks down highly complex technical architectures or processes into digestible, step-by-step slides to prevent overwhelming the audience.XML<system_instruction>
Generate content to explain the highly complex technical architecture provided using the principle of "progressive disclosure" across exactly 4 sequential slides.
</system_instruction>
<task>
- Slide 1 must explain the highest-level abstraction (the 'black box' overview). 
- Slide 2 reveals the primary underlying subsystems and components. 
- Slide 3 details the data flow and integration between those subsystems. 
- Slide 4 highlights the specific technical innovation, performance metrics, or competitive moat. 
Keep the text minimal, highly technical, but accessible. Use analogies where appropriate.
</task>
Prompt 10: Case Study Content Generator
Purpose: Standardizes the creation of highly impactful, metric-driven case study slides.XML<system_instruction>
Write content for a high-impact, single-slide Case Study.
</system_instruction>
<structure>
The slide must contain exactly these elements:
1. The Challenge: 1 bullet outlining the client's initial pain point.
2. The Solution: 1 bullet detailing our specific intervention or product used.
3. The Results: 2 bullets containing hard, quantifiable metrics (e.g., "X% improvement in Y over Z months").
4. The Quote: 1 brief, glowing quote from a named stakeholder.
</structure>
<input_data>
{{CASE_STUDY_SOURCE_DOC}}
</input_data>
<task>
Extract these specific elements from the provided source document and format them for a single, highly dense but scannable slide. If hard metrics are missing, use `<thinking>` to extrapolate reasonable approximations based on the text, but flag them for review.
</task>
Prompt 11: Comparison and Contrast Matrix
Purpose: Generates structured data for competitive analysis or feature comparison tables.XML<system_instruction>
Generate content for a feature comparison slide against our primary competitor.
</system_instruction>
<rules>
Maintain an objective but confident tone. Highlight our product's unique selling propositions (USPs) as "advantages" and the competitor's gaps as "limitations". Limit the comparison to the 5 most critical decision-making factors.
</rules>
<task>
Output a structured JSON representation of a comparison table. The JSON must define an array of rows, where each row compares a specific feature between "Us" and "Them".
</task>
Prompt 12: Rule of Three SynthesizerPurpose: Forces the LLM to group concepts into threes, leveraging a well-known cognitive principle for memorability.XML<system_instruction>
You are a speechwriter. Take the provided strategy document and distill its core message using the "Rule of Three" for a single, powerful summary slide.
</system_instruction>
<task>
Identify the three most critical pillars of the strategy. For each pillar, provide a 2-word title and a 6-word explanatory subtitle. This slide is meant to be highly visual and highly memorable.
</task>
Prompt 13: Action-Oriented Next StepsPurpose: Ensures presentations end with clear, accountable directives rather than generic summaries.XML<system_instruction>
Generate the concluding "Next Steps" slide for a project kickoff presentation.
</system_instruction>
<rules>
Every bullet point must start with a strong action verb. Every action must be assigned a specific timeline (e.g., "Q3", "Next 30 Days") and an owner role (e.g., "Engineering Lead").
</rules>
<task>
Extract the deliverables from the provided project scope and format them into 4 clear, accountable next steps.
</task>
Category C: Visual Layout, Spatial Planning, and StorytellingThese prompts instruct the Layout Mapper Agent to assign spatial coordinates, charts, and visual hierarchy to the generated text, preparing it for the PptxGenJS schema.Prompt 14: Geometric Bounding Box Calculator (Chain-of-Thought)
Purpose: Forces the LLM to calculate explicit, non-overlapping percentage coordinates for PptxGenJS layout injection.XML<system_instruction>
You are a layout calculation engine for PptxGenJS. You must map the provided text content to an invisible 16:9 grid using percentage coordinates.
</system_instruction>
<rules>
- The Title always occupies the top 15% (y: "5%", h: "10%").
- The remaining 85% must be divided logically based on the content type.
- For a two-column layout: Column A is x: "5%", w: "40%". Column B is x: "55%", w: "40%".
- Maintain at least a 5% margin/padding around all elements to prevent edge-clipping.
- The sum of 'y' + 'h' for any element must never exceed 95%.
</rules>
<task>
Given the following slide content, use the `<thinking>` tag to calculate the precise x, y, w, and h percentages for every text box and chart to ensure zero overlapping. Then, output the layout definitions injected into the slide JSON.
</task>
Prompt 15: Visual Hierarchy and Typography Selector
Purpose: Assigns specific font sizes, weights, and colors to text blocks to prevent the "ransom note" formatting effect.XML<system_instruction>
Assign visual hierarchy formatting metadata to the generated slide text objects. 
</system_instruction>
<hierarchy_levels>
- Slide Title: `fontSize: 36`, `bold: true`, `color: "003366"` (Primary Brand Dark Blue).
- Section Header: `fontSize: 24`, `italic: true`, `color: "0088CC"` (Secondary Brand Blue).
- Main Body Text: `fontSize: 18`, `color: "363636"` (Standard Dark Grey).
- Footnote/Source Citation: `fontSize: 12`, `color: "888888"`, `valign: "bottom"`.
</hierarchy_levels>
<task>
Tag each text element in the provided JSON slide with the appropriate typography options object suitable for direct injection into a `slide.addText()` PptxGenJS call.
</task>
Prompt 16: Automated Chart Selection Logic
Purpose: Programmatically decides the best data visualization method based on the shape and intent of the data array.XML<system_instruction>
Act as a Data Visualization Expert. Review the quantitative data intended for the presentation and select the optimal PptxGenJS chart type.
</system_instruction>
<rules>
- Use "LINE" for time-series trends over 4 or more periods.
- Use "BAR" for comparative categorical data or rankings.
- Use "PIE" ONLY for parts-of-a-whole data totaling exactly 100%, and ONLY if there are fewer than 5 slices.
- Use "SCATTER" for correlation analysis between two variables.
</rules>
<task>
For each data point provided, output the chosen PptxGenJS chart type (e.g., `pres.ChartType.bar`), format the data array appropriately, and provide a one-sentence justification for the choice in the `<thinking>` tag.
</task>
Prompt 17: Dark Mode / Light Mode Theme Generator
Purpose: Generates reusable SlideMaster theme definitions for PptxGenJS to ensure corporate consistency.XML<system_instruction>
Generate a comprehensive slide master theme definition for a corporate presentation.
</system_instruction>
<task>
Provide two complete sets of hex colors (WITHOUT the # symbol, as required by PptxGenJS). 
Set 1: Minimalist Light Mode (white background, dark grey text, vibrant blue accent).
Set 2: Executive Dark Mode (deep navy/black background, off-white text, neon cyan accent).
Format the output as a JSON object mapping to PptxGenJS `theme` and `SlideMasterProps` properties, including default font face definitions.
</task>
Prompt 18: Iconography and Visual Metaphor Brainstorm
Purpose: Enhances visual engagement by generating search keywords for downstream image-fetching APIs (like Unsplash or Iconify).XML<system_instruction>
For each slide in the presentation outline, suggest a central visual metaphor and three specific search keywords for icons or stock photography.
</system_instruction>
<task>
Ensure the metaphors move beyond generic business tropes. For example, avoid "a handshake" for partnership; instead, suggest "interlocking gears", "a symbiotic ecosystem diagram", or "woven threads". Output the suggestions as a structured list appended to the `visual_assets` array in the slide metadata.
</task>
Prompt 19: Complex Table Styler
Purpose: Formats raw Markdown or CSV data into the complex nested array structure required by the PptxGenJS addTable method.XML<system_instruction>
Convert the provided analytical comparison data into a strictly formatted PptxGenJS table structure.
</system_instruction>
<format>
The table must be an array of row arrays. Each cell must be a complex object: `{ text: "Content", options: { fill: "F1F1F1", color: "363636", bold: false } }`.
Apply alternating row colors (zebra striping) for readability: odd rows get fill "FFFFFF", even rows get fill "F2F9FC". Set the header row to a dark background ("0088CC") with white text ("FFFFFF") and `bold: true`.
</format>
<task>
Generate the JSON representation of the fully styled table array.
</task>
Prompt 20: Slide Density and White Space CheckerPurpose: Evaluates spatial distribution before rendering to prevent cluttered slides.XML<system_instruction>
You are an expert presentation designer reviewing layout density. Analyze the provided bounding box coordinates for the slide elements.
</system_instruction>
<task>
Calculate the total percentage of the slide area (w * h) occupied by text and charts. If the occupied area exceeds 65%, you must trigger a "Density Alert" and recommend breaking the content into two separate slides to preserve essential white space. Output your calculations in the `<thinking>` tag.
</task>
Category D: JSON Schema, Validation, and PptxGenJS-Ready OutputThese prompts govern the final compilation, validation, and generation of the executable code or strict schema.Prompt 21: The Strict PptxGenJS JSON Schema Enforcer
Purpose: The final translation step. Forces the LLM to output a flawless, API-compliant JSON payload, utilizing Claude prefilling to prevent preamble errors.XML<system_instruction>
You are an API integration layer. Your sole purpose is to convert slide content into a strict, validated JSON schema that perfectly matches the downstream PptxGenJS rendering script.
</system_instruction>
<critical_constraints>
1. NEVER use the "#" symbol in hex colors. Use "FF0000", NOT "#FF0000". This will corrupt the file.
2. Coordinates (x,y,w,h) MUST be either numbers (representing inches) or strings ending in "%" (e.g., "50%").
3. Chart data must strictly follow the array of objects format: `, "values": }]`.
4. Output nothing but valid JSON.
</critical_constraints>
<task>
Transform the provided semantic slide content into the strict JSON layout payload.
</task>
<json>
{
*(Note for implementation: Pass this prompt to the API with `{"presentation":XML<system_instruction>
You are an automated Quality Assurance (QA) agent reviewing a generated JSON slide schema before it is compiled into a.pptx binary file. You must prevent file corruption and rendering crashes.
</system_instruction>
<checklist>
1. Verify no text strings exceed 150 characters per standard text box.
2. Verify all hex colors are exactly 6 characters and lack the '#' symbol.
3. Verify that the sum of the widths ('w') of side-by-side elements on the same 'y' axis does not exceed 100%.
4. Verify all chart types are valid PptxGenJS enums (BAR, LINE, PIE, etc.).
</checklist>
<task>
Analyze the provided JSON. Use `<thinking>` to log your step-by-step checks against the checklist. If errors are found, fix them and output a corrected JSON schema. If the schema is flawless, output the exact original schema.
</task>
Prompt 23: Full Native JavaScript Generation (Bypass JSON)
Purpose: Generates raw Node.js executable code for standalone scripts, bypassing the JSON intermediate step entirely.XML<system_instruction>
Write a complete, executable Node.js script using the PptxGenJS library to generate a presentation based on the prompt. You are writing JavaScript code, not JSON.
</system_instruction>
<requirements>
- `import pptxgen from "pptxgenjs";`
- Instantiate the presentation: `let pres = new pptxgen();`
- Define a slide layout and add slides using `pres.addSlide();`
- Add text, charts, and tables using standard API methods with percentage-based coordinate objects.
- Save the file using `pres.writeFile({ fileName: "Automated_Output.pptx" });`
</requirements>
<task>
Output ONLY valid, executable JavaScript code enclosed in markdown ````javascript ```` code blocks. Do not include explanatory text outside the code block.
</task>
Prompt 24: Multilingual Font Stack Handling
Purpose: Prevents glyph rendering errors when mixing languages by explicitly defining robust font stacks.XML<system_instruction>
Generate a slide schema that includes a mix of English and Japanese text.
</system_instruction>
<task>
Ensure that the `fontFace` property for all text objects explicitly calls a universally compatible CJK font stack (e.g., "Meiryo", "MS Gothic", or "Arial Unicode MS") to prevent box-character rendering errors in the final PPTX file. Add this property to every text options object.
</task>
Prompt 25: Master Slide Template Generator
Purpose: Automates the creation of reusable corporate templates, reducing code duplication across slides.XML<system_instruction>
Write the PptxGenJS code to define a `SlideMaster`.
</system_instruction>
<task>
Create a `pres.defineSlideMaster()` call. Include a background color, a corporate logo image positioned in the top right corner (`x: "90%", y: "2%", w: "8%", h: "8%"`), a standard footer text, and a slide number (`slideNumber: { x: "95%", y: "95%", color: "888888" }`). Output the JavaScript object for this configuration.
</task>
Prompt 26: Data Parsing and Chart Mapping Router
Purpose: Determines if raw text should be a bulleted list or a chart based on data density.XML<system_instruction>
Analyze the following text block. If the text contains more than 3 distinct numerical data points comparing categories or tracking time, you must convert it into a chart object. If it contains fewer, keep it as text bullets.
</system_instruction>
<task>
Output either a `text_blocks` JSON array or a `charts` JSON array based on your analysis of the data density.
</task>
Phase 5: Failure Mode Analysis and Automated MitigationEven with advanced agent architectures, automated presentation generation is prone to specific failure modes resulting from the tension between linguistic generation (LLMs) and spatial/programmatic rendering (PptxGenJS). Analyzing these failures is critical for building resilient systems.The following table categorizes the most frequent failures, their underlying mechanisms, and the architectural or prompt-engineering solutions required to resolve them.Failure ModeObservable SymptomsRoot Cause MechanismAutomated Mitigation StrategyCognitive Overload ("Wall of Text")8+ bullets per slide, tiny font size (auto-shrunk by PowerPoint), audience disengagement.LLMs naturally optimize for comprehensiveness and verbosity over persuasive minimalism.Implement Prompt 7. Limit output to max 3 bullets; push excess generated text strictly to the speaker_notes JSON field.Spatial Overlap & Boundary ClippingText rendering off-screen, overlapping columns, or text rendering behind charts.LLMs operate in a 1D token sequence and lack intrinsic 2D spatial reasoning; bad percentage math.Enforce Guided Chain-of-Thought (CoT) coordinate checking (Prompt 14). Alternatively, use hardcoded layout templates in the Node.js runtime and only map content to them.File Corruption (Repair Error)PowerPoint prompts "File needs to be repaired" upon opening the .pptx.Inclusion of the # prefix in hex colors (#FF0000), opacity encoded in hex, or invalid API properties.Use Prompt 21 to explicitly forbid #. Implement Regex sanitization in the Node.js rendering script to strip # before writeFile().JSON Parsing FailuresBackend crashes attempting to JSON.parse() the LLM output.Claude outputs conversational preambles ("Here is the JSON:") before the actual data object.Utilize Claude API prefilling (injecting {"slides": [ as an assistant message) to force immediate data generation.Context Drift & HallucinationSlide 15 contradicts Slide 2; formatting style changes mid-deck.Context window saturation; token limit exhaustion during long generations.Generate slides sequentially (node-by-node) rather than in a single prompt, using a fixed JSON outline as the anchor state.The "Ransom Note" AestheticSlides are functional but look unprofessional due to inconsistent fonts, colors, and alignments.The AI treats each text block as an isolated rendering event rather than part of a cohesive design system.Define corporate branding via PptxGenJS SlideMaster templates. Instruct the LLM to only output content, inheriting master styles.CJK Typography BreakingJapanese, Chinese, or Korean text renders as blank squares or default system fonts.Lack of explicit font stack definition; default Calibri fails on Asian characters in OOXML.Force the schema to include fontFace: "Meiryo" or universal Unicode font stacks for all text objects (Prompt 24).Deep Dive: The "Make it Not Ugly" TaxA significant realization in automated presentation generation is that users rarely need AI to invent content from scratch; they typically possess the content (e.g., discovery notes, financial data) but lack the time to format it visually. This is referred to as the "Make it Not Ugly" tax.If an LLM agent is allowed to invent formatting options (colors, font sizes) randomly on a per-element basis, the result is visually chaotic. The optimal architectural solution is to strip the LLM of formatting authority. The AI should only be responsible for semantic mapping (e.g., tagging a string as "type": "header" or "type": "body"). The Node.js execution layer should then map these semantic tags to rigid, pre-approved corporate style objects before passing them to PptxGenJS. This completely eliminates the formatting tax and ensures 100% brand compliance.Deep Dive: The "Generate Everything" TrapThe most seductive but dangerous feature of early AI PowerPoint tools is the single-prompt generation (e.g., "Create a 15-slide presentation about Q3 sales"). This bypasses structural logic, resulting in encyclopedia entries formatted as slides. Presentations are persuasive arguments, not comprehensive data dumps. By forcing the architecture through a Planner Agent that applies the Minto Pyramid Principle (Prompt 1), the system forces the AI to construct a logical argument before it writes a single bullet point, drastically increasing the professional utility of the final .pptx file.Implementation Roadmap and ConclusionThe successful deployment of an automated presentation generation agent requires a fundamental shift in engineering philosophy: moving away from "text generation" and toward "programmatic visual compilation." By leveraging the superior instruction-following capabilities of the Claude 3.5 Sonnet architecture alongside the robust, dependency-free compilation engine of PptxGenJS, developers can bypass the severe limitations of traditional AI slide generators.To maximize system efficacy and reliability, implementations must enforce a strict separation of concerns within a stateful, multi-agent graph. Utilizing a Planner Agent governed by the Minto Pyramid Principle ensures a persuasive narrative structure. A heavily constrained Content Agent applying the 10/20/30 rule prevents cognitive overload. Finally, a rigid JavaScript runtime maps validated LLM-generated JSON to spatial coordinates.Critically, prompt engineers must deploy XML tag structuring, Guided Chain-of-Thought for spatial reasoning, and JSON prefilling to guarantee the deterministic payload required by the PptxGenJS API. By implementing automated sanitization to prevent OOXML format-breaking syntax errors (such as hex color corruption), the system achieves production readiness. When orchestrated correctly, this multi-agent architecture eliminates the manual formatting tax, prevents hallucinations, and transforms raw enterprise data into highly persuasive, boardroom-ready visual narratives at massive scale.