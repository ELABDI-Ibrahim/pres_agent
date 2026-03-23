# Consulting-Grade Slide Generation System

## Core Presentation Principles (Strategy & Story)  

- **Lead with the conclusion (Pyramid Principle)** – Always put the key answer or recommendation at the top.  Start each section (and presentation) with the assertion, then support it with logically grouped reasons and evidence【16†L138-L146】【31†L219-L227】.  *Rationale:* Executives have short attention spans and want the “so‑what” up front【31†L229-L237】【21†L50-L58】.  Presenting bottom-up (data→analysis→conclusion) confuses readers; reversing to top-down respects cognitive load and makes arguments actionable【31†L229-L237】【16†L138-L146】.  *Implementation:* The AI agent should generate an initial hypothesis (top‑level insight) for the topic, then structure the deck so that every slide and section either states a recommendation or clearly supports it【18†L1-L4】【31†L229-L237】.  *Pseudocode:* 
  ```python
  hypothesis = propose_insight(topic)
  outline = build_pyramid(hypothesis, data)
  deck[0].title = hypothesis  # Title of deck or executive summary
  for i, point in enumerate(outline.supporting_points):
      deck[i+1].title = point.summary
      deck[i+1].content = format_support(point.details)
  ```
  *Example:* A topic “Improve efficiency” yields an action title slide “Centralize procurement to cut costs by 15%” followed by slides explaining how and why. 

- **Structure MECE (Mutually Exclusive, Collectively Exhaustive)** – Divide content into non-overlapping categories that cover all important aspects【16†L132-L134】【23†L188-L197】.  *Rationale:* MECE grouping ensures no gaps or redundancies in logic【23†L188-L197】【21†L50-L58】. Executives trust analyses where arguments are clearly distinct and comprehensive.  *Implementation:* When the AI splits the topic into points, it must ensure categories do not overlap (“no item in two buckets”) and together cover the whole problem【23†L188-L197】【31†L259-L262】. For example, if analyzing revenue changes, it might use “Price / Volume / Mix” instead of overlapping terms.  *Pseudocode:* 
  ```python
  categories = cluster_insights(insights)
  if overlap(categories) or has_gap(categories):
      refine_clusters(categories)
  ```
  *Example:* Instead of “Cost reduction” and “Efficiency” (overlap), use distinct buckets like “Headcount” vs “Technology”【23†L201-L208】.

- **SCQA Storytelling (Situation-Complication-Question-Answer)** – Structure each narrative in a three-act flow: define the context (Situation), highlight the problem or opportunity (Complication), pose the key question, then state the answer (recommendation)【31†L137-L146】【14†L94-L101】.  *Rationale:* This mirrors a classic story arc and immediately shows why change is needed【14†L94-L101】【31†L137-L146】. Starting with SCQ engages the audience by clarifying context and urgency before delivering the solution【14†L94-L101】【31†L137-L146】.  *Implementation:* The AI agent should generate slide titles and executive summaries that follow SCQA. For example, write an “opening” slide with the current situation and complication, then a question slide (“How do we sustain growth?”), then a slide or section giving the answer (“Expand into new market”)【14†L109-L117】【31†L137-L146】.  *Pseudocode:* 
  ```python
  slides.append(Slide(title=f"Situation: {context_summary}"))
  slides.append(Slide(title=f"Complication: {issue_summary}"))
  slides.append(Slide(title=f"Question: {key_question}"))
  slides.append(Slide(title=f"Answer: {hypothesis_recommendation}"))
  ```
  *Example:* “Situation: Sales have flattened in core markets. Complication: Competitors are gaining share. Question: How can we grow? Answer: Enter the German market (10 slides of supporting evidence)【31†L139-L147】【14†L94-L101】.” 

- **Executive Summary / “So What” thinking** – Always include a concise summary slide up front that answers: What’s the situation? What’s the problem? What’s the recommendation? Why will it work?【23†L293-L302】【31†L304-L313】.  *Rationale:* Senior decision-makers often read only this slide. It must be self-contained and distill the entire deck into a few bolded claims and bullets【23†L293-L302】【31†L307-L314】.  *Implementation:* The AI should generate an “Executive Summary” slide after the title/agenda: use the SCR structure (Situation, Complication, Resolution) with Resolution taking 60–70% of content【23†L302-L310】. Format it in bold-bullet style (bold claim + indented evidence) so it can stand alone【23†L312-L321】.  *Pseudocode:* 
  ```python
  exec_summary = Slide(title="Executive Summary", format="bold_bullet")
  exec_summary.add_bullet(f"Situation: {context}")
  exec_summary.add_bullet(f"Complication: {complication}")
  exec_summary.add_bold(f"Recommendation: {primary_insight}")
  exec_summary.add_bullet(f"- {supporting_point_1}")
  exec_summary.add_bold(f"Recommendation (cont’d): {secondary_insight}")
  exec_summary.add_bullet(f"- {supporting_point_2}")
  ```
  *Example (before/after):* A raw notes slide might have just bullet text; *after* the AI formats it as: **“Executive Summary: Sales are stagnating; we must enter Germany to sustain growth.”** with concise indented bullets of key evidence【23†L302-L310】【31†L317-L324】. 

- **Hypothesis-Driven Communication** – Formulate a key hypothesis early and shape analysis to test it【18†L1-L4】【16†L138-L146】. Lead with that hypothesis in titles or summaries, updating it only if data contradicts.  *Rationale:* Beginning with an answer focuses analysis and storytelling【18†L1-L4】. As ManagementConsulted notes, 99% of the time your final takeaway differs from your initial guess, but framing work around a hypothesis streamlines slide construction【18†L1-L4】.  *Implementation:* The AI should generate an initial hypothesis sentence for the overall deck (the main recommendation) and use it to guide which insights to include. If new data strongly alters the hypothesis, adjust the story accordingly.  *Pseudocode:* 
  ```python
  hypothesis = brainstorm_hypothesis(topic)
  validate = analyze_data_against(hypothesis)
  if validate == False:
      hypothesis = refine_hypothesis(data)
  ```
  *Example:* Before deep analysis, the AI might *guess* “Customer churn is driven by poor service,” then collect stats to confirm. The presentation will present the initial hypothesis slide and supporting slides that prove or adjust it【18†L1-L4】【16†L138-L146】.

## Slide-Level Best Practices

- 【37†embed_image】 **Action Titles (Insight-Led Headlines):** Every slide’s title must be a concise, *complete* sentence stating the slide’s key takeaway【31†L219-L227】【34†L74-L82】. It should **tell the reader what to conclude**, not just what the topic is【31†L219-L227】【34†L74-L82】. Rules: ≤15 words, active voice, 1–2 lines, and pass the “so what?” test (each title answers why the slide matters)【23†L233-L241】【34†L89-L97】.  *Rationale:* Executives often skim by reading titles only, so each title must carry meaning【23†L229-L237】【34†L74-L82】. If a title is just a topic, the deck’s logic chain breaks and key points are lost.  *Implementation:* The AI should generate slide titles by formulating the slide’s main insight: e.g. from data “Market share fell 5%” it should output “Market share fell 5%, halting company’s lead” rather than “Market Share”【31†L219-L227】【34†L74-L82】. After filling slide content, run a check: does the title summarize the main message? If not, rephrase.  *Pseudocode:* 
  ```python
  insight = extract_insight(slide.data)
  title = make_declarative(insight)   # ensure it has a verb and conclusion
  assert is_complete_sentence(title)
  slide.set_title(title)
  ```
  *Example:* *Before:* Title = “Competitive Analysis”. *After:* Title = “We outperform competitors on 4 of 6 buying criteria”【23†L223-L230】. The professional slide on the right shows an actionable headline, whereas the amateur left slide just states “Competitive Analysis”【37†】.

- **Slide Anatomy (Title, Content, Footer):** Each slide has a fixed structure: a top header (action title), a body (one chart/table or 3–5 bullet points) supporting that title, and a footer with sources/page info【29†L243-L251】【36†L210-L218】.  Use white space and alignment guides to separate these clearly【29†L248-L251】【36†L186-L194】. *Rationale:* A consistent template helps readers quickly locate the key message, evidence, and source【29†L243-L251】【36†L210-L218】.  *Implementation:* The AI’s slide template should specify these zones. It should never put long paragraphs in the body—only charts, tables, or short bullets. The footer always shows data sources (in small font) and optionally slide number/date【36†L216-L224】.  *Pseudocode:* 
  ```python
  slide = pptx.addSlide()
  slide.addText(slide.title, options_header)      # action title (largest font)
  slide.addContent(slide.charts or slide.bullets) # body content
  slide.addText(f"Source: {data_source}", options_footer)
  ```
  *Example:* A well-formed slide might have a chart taking up most of the body and a caption beneath it. The figure below illustrates a professional layout: a bold action title, a single chart as proof, and a source line at the bottom【38†】. 

- **One Idea Per Slide:** Constrain each slide to a single insight or message【34†L100-L109】【23†L237-L244】. If you find yourself writing “and” in the title or including multiple charts/bullets that answer different questions, split into two slides【13†L307-L314】【34†L116-L124】.  *Rationale:* Packing multiple points on one slide dilutes the headline and confuses the audience【34†L116-L124】【13†L307-L314】.  Each slide should have one main bullet point or chart that directly proves its title【31†L248-L256】【34†L100-L109】.  *Implementation:* The AI should track the number of distinct insights per slide; if more than one, it should allocate a new slide. It must enforce the “titles test”: reading titles alone must tell a coherent story without extra slides【31†L229-L237】【34†L116-L124】.  *Pseudocode:* 
  ```python
  insights = identify_insights(data_chunk)
  for insight in insights:
      new_slide = create_slide(insight)
  ```
  *Example:* Instead of a single slide “Growth drivers” covering sales and margin, the AI would create two slides, e.g. “Sales grew 8% in Q4, driven by new product” and “Gross margin widened to 40% on raw-materials savings”【23†L251-L259】【34†L100-L109】. 

- **Logical Flow (Storyboarding):** Order slides so each one naturally follows from the last. Use a “ghost deck” outline first: list slide titles as an outline and ensure they form a coherent narrative【12†L169-L174】【36†L281-L289】. Signpost transitions (e.g. section headers) and use agenda slides to orient the audience. *Rationale:* A clear sequence (context→issue→analysis→recap) keeps the reader engaged and makes complex information digestible【29†L253-L262】【36†L281-L289】.  *Implementation:* The AI should generate a deck outline by grouping slides under high-level arguments (e.g. 3–5 pillars supporting the recommendation)【12†L169-L174】【23†L188-L197】. It then inserts agenda and section slides to break the narrative. Check that jumping between slide titles reads logically.  *Pseudocode:* 
  ```python
  outline = []
  outline.append("Agenda: " + ", ".join(sections))
  for section in sections:
      outline.append(f"Section: {section.name}")
      for title in section.slide_titles:
          outline.append(title)
  ```
  *Example:* A deck might begin with an “Agenda” slide listing *Context*, *Findings*, *Recommendations*. Each slide’s title under those headings then follows a story: “Declining Demand in Core Market” → “Factory Utilization Has Fallen 30%” → “We Should Repurpose the Facility” – making the narrative obvious.

- **Charts vs. Text (Data Storytelling):** Use visuals to convey data and bullet points for explanation. Charts (line, bar, waterfall, etc.) should be dedicated slides (often full-slide) to emphasize the trend or comparison【29†L370-L380】【13†L299-L307】. Tables can compare numbers, and minimal text can explain concepts. Avoid large text blocks【13†L299-L307】【29†L372-L380】.  *Rationale:* Charts let busy executives grasp data quickly【29†L372-L380】. Consulting decks favor one chart per slide with a headline insight because it focuses attention on the key evidence【29†L372-L380】【23†L248-L256】.  *Implementation:* The AI decides slide format by purpose: 
  - **Trends/Relationships:** Use a chart + bullets【13†L299-L307】 (e.g. bar/line graphs).  
  - **Comparisons:** Use a table or side-by-side charts.  
  - **Conceptual:** Use a concise text box or simple diagram.  
  After selecting a format, populate it with relevant data. Always label axes and highlight key values.  *Pseudocode:* 
  ```python
  if slide.purpose == "trend":
      slide.addChart(type="line", data=slide.data)
  elif slide.purpose == "comparison":
      slide.addChart(type="bar", data=slide.data)
  elif slide.purpose == "process":
      slide.addGraphic(type="flow", data=slide.process_steps)
  ```
  *Example:* Instead of listing numbers in bullets, the AI would present “Q3 Sales vs Forecast” as a bar chart slide with title “Sales beat forecast by 5%,” and only brief text for interpretation【13†L299-L307】.

- **Data Credibility (Sources):** Cite every data point or graphic with its source on the slide【23†L263-L272】【36†L222-L230】. Place source text in a small footer. *Rationale:* Consulting clients expect rigor. Unsourced claims undermine credibility and raise doubts about analysis【23†L273-L281】【36†L252-L260】.  *Implementation:* Whenever the AI inserts a chart or number from a dataset, it must include a source line (e.g. “Source: Company annual report (2024)”) at the bottom【23†L269-L277】【36†L218-L225】.  *Pseudocode:* 
  ```python
  slide.addText(f"Source: {slide.data_source}", {fontSize:8, align:"left", x:0.5, y:7.0})
  ```
  *Example:* A slide showing “Revenue grew 12%” would include *“Source: Acme Co. earnings report 2025”* in the footer【23†L269-L277】. 

- **Visual Hierarchy & Design Consistency:** Apply a simple grid layout, limit fonts to two types (one for titles, one for body) and use consistent font sizes【34†L158-L167】【26†L74-L82】. Maintain alignment via master templates or guides so titles and text don’t shift between slides【34†L169-L177】【36†L210-L218】. Use a restrained color palette (3–4 colors) and reserve bright colors only to highlight key figures【36†L176-L185】【26†L91-L99】.  *Rationale:* Uniform formatting signals professionalism【34†L158-L167】【36†L244-L252】. Inconsistent fonts, misalignment or gaudy colors distract and imply carelessness【34†L154-L162】【36†L268-L274】.  *Implementation:* The AI’s template rules should enforce one title font (e.g. Arial or Georgia) and one body font (e.g. Calibri)【34†L158-L166】. It should apply a color theme (often company color + neutrals) and use whitespace generously【29†L248-L251】【36†L186-L194】. For any chart, use standard color codes (e.g. positive=green, negative=red) consistently【36†L178-L184】.  *Pseudocode:* 
  ```python
  slide.setFont(title="Arial Bold", body="Calibri")
  slide.setThemeColors(primary=brand_blue, accent=gray, highlight=orange)
  slide.addLayoutGrid(margins=1.0, columns=1, rows=... )
  ```
  *Example:* All slides might use Arial 18pt for titles and Calibri 14pt for text【34†L158-L166】. Colors like blue for headers and gray for text are reused to tie slides together, and white space is left around charts so slides don’t look cramped【36†L176-L185】【26†L123-L131】.

- **Minimalism and Clarity:** Trim non‑essential elements. Remove decorative images, 3D effects or unrelated clip art【36†L260-L268】. Ensure each element (bullet, icon, chart) directly supports the main message. Use ample white space around text and figures【29†L248-L251】【36†L186-L194】. *Rationale:* Extra decorations distract from the insight and make slides look like marketing fluff【36†L260-L268】【13†L313-L319】. Clarity demands only data and visuals that serve the argument【13†L313-L319】【36†L268-L274】.  *Implementation:* The AI should apply a “content filter” after slide creation: scan for any graphic or text not tied to the action title and remove it. If text overflows, split into more slides or shorten wording【36†L244-L252】【13†L311-L319】.  *Pseudocode:* 
  ```python
  if slide.has_clip_art or slide.has_fancy_effects:
      slide.remove_decorations()
  slide.ensure_minimum_margin(0.5)  # inches around edges
  if content_overflow(slide):
      truncate_or_split(slide)
  ```
  *Example:* Rather than a flowery background or stock photo, the AI leaves the slide background plain. The figure below shows a clean layout with only an icon (relevant to the topic), bullet text and white margins【26†L159-L167】【38†】.

## Deck Structure Patterns

- **Typical Consulting Deck Outline:** The AI should assemble decks in a standard structure: 
  1. **Title Slide** (project name, client, date)【10†L279-L288】, 
  2. **Agenda** (roadmap of sections)【10†L283-L290】, 
  3. **Executive Summary**, 
  4. **Context/Background** (problem definition), 
  5. **Methodology/Approach**, 
  6. **Analysis/Findings** (data slides), 
  7. **Recommendations/Next Steps**, 
  8. **Conclusion**, 
  9. **Appendix** (detailed backup)【10†L279-L288】【10†L309-L312】.  *Rationale:* This “front-heavy” structure puts answers and key insights up front, while detailed data is reserved for later or appendix【10†L279-L288】【23†L302-L310】.  *Implementation:* After generating content, the AI tags each slide by type (e.g. “approach”, “data”, “recommendation”). It then orders slides into the sequence above. Agenda and section header slides are automatically inserted to segment content.  *Pseudocode:* 
  ```python
  slides = []
  slides.append(title_slide)
  slides.append(agenda_slide(sections))
  slides.append(executive_summary_slide)
  slides.extend(context_slides)
  slides.append(methodology_slide)
  slides.extend(analysis_slides)
  slides.append(recommendation_slide)
  slides.append(conclusion_slide)
  slides.extend(appendix_slides)
  ```
  *Example:* A consulting deck on market entry might have sections: “Market Overview,” “Customer Insights,” “Financial Case,” each introduced by an agenda or header slide. 

- **Storyboarding and Ghost Deck:** Build the narrative outline before final slide design【12†L169-L174】【36†L281-L289】. Use a “ghost deck” (simple list of titles in Word or JSON) to map the argument flow【12†L169-L174】【36†L281-L289】.  *Rationale:* Ensuring logical structure first avoids wasted effort on irrelevant slides【12†L169-L174】【36†L281-L289】. The Deckary guide calls this a business-led roadmap and stresses testing the story by reading titles alone【12†L169-L174】【36†L281-L289】.  *Implementation:* The AI should first generate an array of slide titles representing each argument (with hierarchy). It can then adjust ordering and content before rendering slides. After finalizing titles, only then populate with full content and visuals【12†L169-L174】【36†L281-L289】.  *Pseudocode:* 
  ```python
  outline = generate_outline(problem_statement)
  for title in outline:
      ghost_slide = {"title": title}
      ghost_deck.append(ghost_slide)
  review_coherence(ghost_deck)
  # Once titles flow logically, create real slides:
  for ghost in ghost_deck:
      create_slide_from_ghost(ghost)
  ```
  *Example:* The AI might output: **“Problem: Sales plateau”**, **“Drivers: Customer churn”**, **“We need to invest in retention”**, **“Action: Launch new loyalty program”**. If that title flow makes sense, it proceeds to fill each slide. 

- **Slide Sequencing:** Arrange slides so each one “answers the question” raised by the previous.  For instance, after a slide describing a challenge (“Existing system fails at scale”), the next should address it (“Proposed solutions (1/3): Cloud migration”). *Rationale:* This question-and-answer rhythm keeps the narrative engaging and prevents logic gaps【29†L253-L262】【31†L253-L262】.  *Implementation:* When generating slides, the AI inserts transition phrases or ensures the next slide’s title is a direct resolution or continuation of the previous slide’s point. 

## Visual Design Systems

- **Layout Grid & Spacing:** Use a consistent grid. All slide elements (titles, charts, text) should align to invisible guides or margins【34†L168-L177】【36†L201-L210】.  *Rationale:* Aligning content gives a polished look; misaligned text/objects is immediately noticeable and sloppy【34†L168-L177】【36†L268-L274】.  *Implementation:* The AI’s template enforces fixed margins (e.g. 1” at edges). Text blocks and charts snap to these guides. It should leave ample whitespace – if content crowding occurs, automatically increase slide count.  *Pseudocode:* 
  ```python
  set_margin(left=1.0, right=1.0, top=1.0, bottom=1.0)
  slide.align_to_grid(elements)
  if any_element_out_of_bounds():
      increase_slide_height_or_split()
  ```
  *Example:* Notice how titles and charts line up perfectly across slides, creating a clean flow of information, thanks to strict alignment rules【34†L168-L177】【36†L201-L210】.

- **Fonts:** Limit to two complementary fonts. McKinsey-style decks often use Arial (body) and Georgia (titles)【34†L158-L166】; BCG/Bain prefer san-serifs like Calibri/Helvetica【34†L158-L166】. Text should be large enough to read from the back of a room (e.g. ≥18pt for body)【34†L158-L166】.  *Rationale:* Sans-serif fonts improve legibility on screen【25†L15-L18】. Consistent font usage reinforces professionalism; varying fonts on a slide distracts【34†L160-L166】【36†L270-L274】.  *Implementation:* The AI’s style guide fixes one title font and one body font. When adding text, it must not deviate sizes within the same type (all titles same size, all body text same size)【34†L160-L166】.  *Pseudocode:* 
  ```javascript
  slide.addText("Insight Title", { fontFace:"Arial", fontSize:18, bold:true });
  slide.addText("Supporting bullet", { fontFace:"Calibri", fontSize:14 });
  ```
  *Example:* All example slides use Arial 20 for titles and Calibri 16 for text, ensuring uniformity【34†L158-L166】.

- **Color Usage:** Stick to a limited palette (3–4 colors) – typically the firm’s brand colors plus gray/black【36†L176-L185】【26†L91-L99】. Use color sparingly to highlight or categorize, not for decoration【36†L176-L185】【26†L91-L99】. Establish meaning with color (e.g. green = positive, red = negative) and apply it consistently【36†L176-L185】.  *Rationale:* A restrained color scheme prevents visual overload【26†L91-L99】【36†L176-L185】. Bright colors should emphasize key data or section headings. Consistency (e.g. always blue for headers, always gray for secondary text) makes the deck feel cohesive【36†L176-L185】.  *Implementation:* The AI applies a theme: one brand color for titles or accents, one neutral for backgrounds/text. In charts, it auto-assigns +/– color coding. It never uses more than 4 colors on a slide.  *Pseudocode:* 
  ```python
  theme = {"primary": "#005a9c", "accent": "#f99416", "neutral": "#666666", "background": "#ffffff"}
  slide.setColors(theme)
  ```
  *Example:* A bar chart slide might use the firm’s blue for key bars and light gray for others; any positive/negative bars are green/red by default【36†L176-L185】.

- **Chart Types:** Use each chart format appropriately. Common consulting charts include: **Bar/Line/Area** for trends, **Waterfall** for financial bridges, **Funnel** for process stages, **Maps** for regional data, etc. Never use 3D or fancy styles – keep them flat and labeled【36†L260-L268】【13†L313-L319】.  *Rationale:* Clean charts focus on the insight. 3D or animated charts look unprofessional and can mislead interpretation.  *Implementation:* The AI should choose the simplest chart that conveys the data. For example, use a waterfall chart (or stacked bars) to show stepwise changes. It should remove gridlines and shadows (“chart junk”)【13†L311-L319】 and ensure all axes are labeled and legends are clear.  

- **Icons and Callouts:** Use simple, monochromatic icons or callout shapes to represent concepts (e.g. a factory icon for production)【26†L159-L167】. Icons should all be the same style and size within a deck. *Rationale:* Icons quickly convey ideas and break up text【26†L159-L167】. When used consistently, they guide the eye and add visual interest without clutter.  *Implementation:* The AI can insert an icon next to a list or data point when it matches a concept. It keeps icon size uniform (e.g. 24pt square) and color-matched to the palette. It never inserts unrelated decorative images. 

## Content Generation Logic  

- **Data → Insight Transformation:** For each data point, generate an interpretive insight (the “so what?”). The AI should distill raw numbers into conclusions. *Rationale:* Consultants emphasize insight over raw data – clients pay for answers, not charts of uninterpreted figures【11†L100-L103】【13†L311-L319】.  *Implementation:* After summarizing data, run an interpretation step: e.g. if data shows “Sales +15%”, output title text “Sales grew 15% year-over-year, the fastest in the region” and bullet “Driven by new product X”【37†】. Use natural language generation constrained by the action-title rules. 

- **Recommendation Phrasing:** Recommendations should be phrased as imperatives or clear suggested actions (e.g. “We should…” or “Do X” verbs). *Rationale:* Direct, actionable language aligns with the goal of persuading executives【21†L50-L58】【16†L138-L146】.  *Implementation:* When writing the recommendation slide(s), ensure titles and bullets use active voice and commit to a course of action (avoid passive or tentative phrasing). 

- **Information Density:** Include only critical information on each slide. *Rationale:* Consultants maximize clarity by cutting fluff【13†L331-L334】【36†L186-L194】. Every bullet or data point must tie to the headline.  *Implementation:* The AI applies the “so what” test to every content element: if an element doesn’t directly support the slide’s main title, omit it or move it to an appendix. Favor multiple slides over overcrowding【13†L331-L334】【36†L244-L252】.  

- **Tailoring to Audience (Executive vs. Analyst):** Adapt language and detail level. *Rationale:* Senior audiences get summaries with broad impacts, while technical audiences may require detailed analysis slides【12†L160-L163】【12†L165-L174】.  *Implementation:* The AI can have a parameter for audience. For “executive” mode, it uses more bottom-line phrasing and high-level charts; for “analyst” mode, it includes more granular data and method explanation slides. For example, use a top-down structure for execs (conclusions first) and a bit more development for technical readers【12†L160-L163】【12†L223-L232】.

## AI & Automation Insights

- **Consulting Firms Using AI:** Leading firms are actively building AI tools for slide production. For example, McKinsey’s internal AI platform *Lilli* now includes “slide-building capabilities”【45†L1-L4】.  In general, top firms aim to automate routine work so consultants can focus on analysis【42†L24-L32】【42†L40-L48】.  *Rationale:* Automation speeds up deck creation and has become a competitive advantage in consulting【42†L26-L34】【42†L40-L48】.  *Implementation:* The AI agent envisioned here is in line with such efforts, using templates and rules to auto-generate slides. Firms emphasize *integrated workflows*, so the agent could pull data from connected sources (databases, spreadsheets) and loop in approval or review steps as needed【42†L65-L74】【42†L75-L83】.

- **Quality Control & Slide Review:** Use automated checks analogous to consulting quality processes. *Rationale:* Firms train consultants to critically review slides (e.g. “squint test”, “60-second rule”). The agent should emulate these tests【13†L332-L334】【36†L317-L326】.  *Implementation:* Before finalizing, the AI should simulate common QA steps: 
  - **Titles Test:** Extract slide titles and verify they form a logical story【34†L97-L99】【31†L229-L237】.  
  - **So What Test:** Ensure every bullet/chart can be tied to the title【23†L251-L259】.  
  - **Squint Test:** Render a thumbnail of each slide to check if the main takeaway (title + largest visual cue) is obvious【13†L332-L334】.  
  - **60-Second Rule:** Estimate reading time; if >60 seconds per slide, trim content【36†L317-L326】.  

- **Internal Tools and Workflows:** While details are private, interviews suggest top firms have proprietary AI with robust data security【42†L13-L21】【42†L69-L77】. The AI agent here should therefore treat client data securely and allow overwriting outputs (i.e. it generates editable slide structures rather than immutable images). *Rationale:* Consultants need editable slides to refine and customize. *Implementation:* Use PptxGenJS objects so final output is a standard PPTX file that humans can edit later.

## Slide Generation Framework

We propose a multi-stage system:

1. **Input Processing:** Start with a high-level topic or problem statement. The AI extracts key nouns and verbs to seed the storyline (e.g. market, growth, consolidation).

2. **Storyline Generation:** Use hypothesis-driven logic and SCQA to outline the narrative (see *Storyline Generation Algorithm* below). Output is an ordered list of slide titles (the “ghost deck”).

3. **Content Planning:** For each slide title, determine slide *type* (e.g. data chart, bullet list, process flow). Allocate needed data: fetch or generate charts, stats or bullet content supporting that point.

4. **Slide Assembly:** Using a slide template schema, populate each slide with title, content, visuals, sources. Apply design rules (fonts, colors, alignment). Construct PptxGenJS slide objects accordingly.

5. **Quality Checks:** Run the automated QA tests (Titles Test, So-What, Squint, etc.). Flag any issues for correction (re-simplify content, split slide, edit title).

6. **Output:** Export the slides in PptxGenJS JSON or direct PPTX output. The structure is ready to present or further refine.

### Storyline Generation Algorithm

```plaintext
1. Define Problem and Hypothesis:
   - Input topic → draft a primary hypothesis (one-sentence recommendation).
2. Identify Key Questions:
   - Break down hypothesis into 3–5 core arguments or questions that need answers.
3. Structure with Pyramid/SCQA:
   - For each argument, frame a Situation and Complication (if needed), then formulate the Answer.
   - Decide whether each segment should be top-down (conclusion first) or bottom-up (data first) based on audience.
4. Create Ghost Deck Outline:
   - List slide titles: Start with an agenda/section header, then each argument’s title (action statement).
   - Order slides so that each title logically follows from the previous.
5. Review Logic Flow:
   - Check that reading titles in sequence tells a coherent story with no gaps or redundancies (MECE).
   - Refine outline until titles alone pass the “story test”.
```

### Slide Template Schema

We define a JSON-like schema for PptxGenJS:

```json
{
  "slides": [
    {
      "title": "Insight Title (actionable sentence)",
      "subtitle": "Optional subtitle/context (smaller font)",
      "type": "chart"|"bullet"|"text"|"image",
      "content": {
        // For a chart slide:
        "chartType": "bar",
        "data": [...], "labels": [...], "colors": [...],
        // For a bullet slide:
        "bullets": ["First supporting point", "Second point", ...],
        // For text/diagram:
        "graphic": "flowchart/diagram id or definition"
      },
      "footer": {
        "source": "Source: X, Year",
        "pageNumber": 5
      }
    },
    // ... more slides ...
  ]
}
```

This structure guides the code. In PptxGenJS, one would do:

```javascript
let pptx = new PptxGenJS();
for (let slideData of deck.slides) {
  let slide = pptx.addSlide();
  slide.addText(slideData.title, {...titleStyle});
  if (slideData.type == "chart") {
    slide.addChart(pptx.ChartType[slideData.content.chartType], slideData.content.data, slideData.content.opts);
  }
  else if (slideData.type == "bullet") {
    slide.addText(slideData.content.bullets, {...bulletStyle});
  }
  slide.addText(slideData.footer.source, {...footerStyle, fontSize:8});
}
pptx.writeFile();
```

### Consulting Slide Quality Checklist

Before finalizing, ensure **all** of the following【36†L337-L346】【13†L332-L334】:

- **Structure:**  
  - Every slide has an action title (declarative sentence, ≤2 lines).  
  - Only one main message/insight per slide.  
  - Reading all titles in order tells a coherent story.  
  - Deck follows an inverted pyramid (conclusion first, then support).

- **Formatting/Design:**  
  - Fonts are consistent (max 2 families) and text is legible.  
  - Titles are aligned in the same position across slides.  
  - Color palette is limited and applied consistently.  
  - Sufficient white space is left on every slide (no crowding).  
  - Visual hierarchy (size/weight) guides the eye appropriately.  

- **Content/Credibility:**  
  - Every chart or data point has a source line.  
  - Page numbers and confidentiality legend (if needed) are present.  
  - No decorative images or 3D/Excel-style graphics.  
  - The slide passes the “60-second rule”: it can be fully explained in under a minute【36†L317-L326】.  
  - It also passes the “squint test”: at thumbnail size, the title and highlight stand out【13†L332-L334】.

By enforcing these rules programmatically, the AI agent will produce fully “consulting-grade” slide decks. Each slide is generated to meet the **Principles** above, and structured for clarity and impact. This framework turns a user’s topic into an outline (Storyline Algorithm), into well-designed slides (Template Schema), and finally into a PPTX via PptxGenJS.

**Sources:** Authoritative consulting blogs, training guides, and firm publications were used to compile these rules【10†L249-L257】【12†L195-L203】【23†L217-L227】【36†L337-L346】. They reflect methods taught by McKinsey, BCG, Bain, Deloitte, etc. All examples and guidelines follow these principles to ensure consulting-quality output.