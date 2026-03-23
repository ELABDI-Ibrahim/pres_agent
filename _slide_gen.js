const pptxgen = require("pptxgenjs");

let pres = new pptxgen();
pres.layout = 'LAYOUT_16x9';  
pres.author = 'Your Name';
pres.title = 'Managing a Data Project';

let slide = pres.addSlide();
slide.background = { color: "1E2761" };

let title = slide.addText("Introduction to Data Project Management", {
  x: 0.5, y: 0.5, w: 9, h: 0.6,
  fontSize: 36, fontFace: "Georgia", color: "FFFFFF", bold: true
});

let content = slide.addText([
  { text: "Effective data project management is crucial in today's data-driven world, as it enables organizations to make informed decisions, drive business growth, and stay competitive. An overview of data project management involves understanding the entire lifecycle of a data project, from initiation to deployment, and ensuring that all stakeholders are aligned and working towards a common goal.", options: { breakLine: true } },
  { text: "The importance of data project management cannot be overstated, as it helps to mitigate risks, ensure timely completion, and guarantee that the project meets its intended objectives. By prioritizing data project management, organizations can unlock the full potential of their data assets and drive meaningful business outcomes.", options: { breakLine: true } },
  { text: "A well-managed data project requires a deep understanding of the organization's data ecosystem, including its strengths, weaknesses, and areas for improvement. By taking a holistic approach to data project management, organizations can identify opportunities for innovation, optimize their data workflows, and create a culture of data-driven decision-making." }
], {
  x: 0.5, y: 1.2, w: 9, h: 3,
  fontSize: 16, fontFace: "Calibri", color: "FFFFFF"
});

slide = pres.addSlide();
slide.background = { color: "1E2761" };

title = slide.addText("Project Planning", {
  x: 0.5, y: 0.5, w: 9, h: 0.6,
  fontSize: 36, fontFace: "Georgia", color: "FFFFFF", bold: true
});

content = slide.addText([
  { text: "Define clear and measurable objectives that align with the organization's overall strategy, ensuring all stakeholders are aware of the project's purpose and expected outcomes.", options: { breakLine: true } },
  { text: "Identify and engage with key stakeholders, including project sponsors, team members, and end-users, to understand their needs, expectations, and potential concerns.", options: { breakLine: true } },
  { text: "Create a detailed project timeline, including milestones and deadlines, to help track progress, allocate resources, and make informed decisions throughout the project lifecycle." }
], {
  x: 0.5, y: 1.2, w: 9, h: 3,
  fontSize: 16, fontFace: "Calibri", color: "FFFFFF"
});

slide = pres.addSlide();
slide.background = { color: "1E2761" };

title = slide.addText("Data Management", {
  x: 0.5, y: 0.5, w: 9, h: 0.6,
  fontSize: 36, fontFace: "Georgia", color: "FFFFFF", bold: true
});

content = slide.addText([
  { text: "Data collection is the process of gathering and measuring data from various sources, which can include databases, files, and external data providers. It is essential to ensure that the data collected is relevant, accurate, and in the correct format for analysis.", options: { breakLine: true } },
  { text: "Data cleaning involves identifying and correcting errors, inconsistencies, and inaccuracies in the collected data to ensure that it is reliable and usable for analysis. This step is critical in maintaining data quality and preventing incorrect insights.", options: { breakLine: true } },
  { text: "Data analysis is the process of examining and interpreting the cleaned data to extract insights, patterns, and relationships. It involves using various statistical and analytical techniques to turn data into actionable information that can inform business decisions." }
], {
  x: 0.5, y: 1.2, w: 9, h: 3,
  fontSize: 16, fontFace: "Calibri", color: "FFFFFF"
});

slide = pres.addSlide();
slide.background = { color: "1E2761" };

title = slide.addText("Conclusion", {
  x: 0.5, y: 0.5, w: 9, h: 0.6,
  fontSize: 36, fontFace: "Georgia", color: "FFFFFF", bold: true
});

content = slide.addText([
  { text: "To ensure the success of a data project, it's essential to follow best practices, including establishing clear goals and objectives, selecting the right tools and technologies, and fostering a culture of collaboration and open communication among team members.", options: { breakLine: true } },
  { text: "By adopting these best practices, organizations can unlock the full potential of their data, drive business growth, and stay ahead of the competition in an increasingly data-driven world.", options: { breakLine: true } },
  { text: "As the field of data science continues to evolve, future directions for data projects may include the integration of emerging technologies like artificial intelligence and machine learning, the development of more sophisticated data visualization tools, and the exploration of new applications for data analytics in various industries." }
], {
  x: 0.5, y: 1.2, w: 9, h: 3,
  fontSize: 16, fontFace: "Calibri", color: "FFFFFF"
});

pres.writeFile({ fileName: "output.pptx" });