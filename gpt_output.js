const pptxgen = require("pptxgenjs");
const path = require("path");

const C = {
    primary: "065A82",
    secondary: "1C7293",
    accent: "21295C",
    lightGray: "F2F2F2",
    darkText: "212121",
    white: "FFFFFF",
};

const makeShadow = () => ({
    type: "outer",
    blur: 10,
    offset: 3,
    angle: 135,
    color: "000000",
    opacity: 0.15,
});

async function build() {
    let pres = new pptxgen();
    pres.layout = "LAYOUT_16x9";
    pres.title = "Dynamic Data Project Management Deck";

    // ── Slide 1: Project Vision ──
    {
        let s = pres.addSlide();
        s.background = { color: C.lightGray };
        s.addText("PROJECT VISION", {
            x: 0, y: 0.2, w: 10, h: 0.6,
            fontSize: 36, bold: true, color: C.primary, align: "center"
        });

        const cards = [
            { title: "Objective", desc: "Define measurable goals", color: C.primary },
            { title: "Stakeholders", desc: "Identify key contributors", color: C.secondary },
            { title: "Scope", desc: "Data sources & deliverables", color: C.accent },
        ];
        cards.forEach((c, i) => {
            const x = 0.5 + i * 3.2;
            s.addShape(pres.ShapeType.rect, {
                x, y: 1.2, w: 2.8, h: 1.8,
                fill: { color: c.color },
                line: { color: C.darkText },
                rectRadius: 0.2, shadow: makeShadow()
            });
            s.addText(c.title, {
                x, y: 1.25, w: 2.8, h: 0.5,
                fontSize: 16, bold: true, color: C.white, align: "center"
            });
            s.addText(c.desc, {
                x: x + 0.1, y: 1.75, w: 2.6, h: 1.2,
                fontSize: 12, color: C.white, align: "center"
            });
        });
    }

    // ── Slide 2: Workflow & Data Pipeline ──
    {
        let s = pres.addSlide();
        s.background = { color: C.white };
        s.addText("WORKFLOW & DATA PIPELINE", {
            x: 0, y: 0.2, w: 10, h: 0.6,
            fontSize: 32, bold: true, color: C.darkText, align: "center"
        });

        const stages = ["Collect", "Clean", "Engineer", "Model", "Deploy"];
        stages.forEach((stage, i) => {
            s.addShape(pres.ShapeType.ellipse, {
                x: 0.8 + i * 1.6, y: 1.5, w: 1, h: 1,
                fill: { color: C.primary }, line: { color: C.darkText }
            });
            s.addText(stage, {
                x: 0.8 + i * 1.6, y: 2.65, w: 1, h: 0.4,
                fontSize: 11, color: C.darkText, align: "center"
            });
            if (i < stages.length - 1) {
                s.addShape(pres.ShapeType.line, {
                    x: 1.3 + i * 1.6, y: 2,
                    w: 0.8, h: 0,
                    line: { color: C.secondary, width: 2 }
                });
            }
        });
    }

    // ── Slide 3: Metrics Dashboard ──
    {
        let s = pres.addSlide();
        s.background = { color: C.lightGray };
        s.addText("METRICS DASHBOARD", {
            x: 0, y: 0.2, w: 10, h: 0.6,
            fontSize: 32, bold: true, color: C.primary, align: "center"
        });

        const chartData = [
            {
                name: "Data Quality",
                labels: ["Completeness", "Accuracy", "Consistency"],
                values: [92, 85, 88],
            },
            {
                name: "Model Performance",
                labels: ["Precision", "Recall", "F1-Score"],
                values: [82, 78, 80],
            }
        ];

        // Use pres.ChartType.bar per documentation
        s.addChart(pres.ChartType.bar, chartData, {
            x: 0.5, y: 1.2, w: 9, h: 3.5,
            barDir: "col", showLegend: true, legendPos: "b"
        });  // chart type is from pres.ChartType enum :contentReference[oaicite:1]{index=1}

        const progressBars = [
            { label: "Data Cleaning Progress", percent: 70, y: 5.0, color: C.secondary },
            { label: "Model Training Progress", percent: 55, y: 5.6, color: C.primary }
        ];
        progressBars.forEach(pb => {
            s.addShape(pres.ShapeType.rect, {
                x: 1, y: pb.y, w: 8, h: 0.3, fill: { color: C.white }
            });
            s.addShape(pres.ShapeType.rect, {
                x: 1, y: pb.y,
                w: 8 * (pb.percent / 100), h: 0.3,
                fill: { color: pb.color }
            });
            s.addText(`${pb.label}: ${pb.percent}%`, {
                x: 1, y: pb.y - 0.25, w: 8, h: 0.25,
                fontSize: 10, color: C.darkText, align: "center"
            });
        });
    }

    // ── Slide 4: Risk vs Impact Matrix ──
    {
        let s = pres.addSlide();
        s.background = { color: C.white };
        s.addText("RISK & IMPACT MATRIX", {
            x: 0, y: 0.2, w: 10, h: 0.6,
            fontSize: 32, bold: true, color: C.primary, align: "center"
        });

        const risks = [
            { risk: "Incomplete Data", impact: 80, likelihood: 70, color: C.secondary },
            { risk: "Stakeholder Delay", impact: 60, likelihood: 50, color: C.primary },
            { risk: "Model Overfit", impact: 40, likelihood: 30, color: C.accent },
        ];
        risks.forEach(r => {
            s.addShape(pres.ShapeType.ellipse, {
                x: r.likelihood / 12, y: r.impact / 12,
                w: 0.6, h: 0.6, fill: { color: r.color },
                line: { color: C.darkText }
            });
            s.addText(r.risk, {
                x: r.likelihood / 12 + 0.7, y: r.impact / 12,
                w: 2.5, h: 0.4,
                fontSize: 10, color: C.darkText
            });
        });

        s.addText("Impact →", { x: 7, y: 0.5, w: 2, h: 0.3, fontSize: 12, color: C.darkText });
        s.addText("Likelihood ↓", {
            x: 0.1, y: 4.8, w: 1, h: 0.3,
            fontSize: 12, color: C.darkText, rotate: 90
        });
    }

    const outputPath = path.join(__dirname, "Fixed_Data_Project_Deck.pptx");
    await pres.writeFile({ fileName: outputPath });
    console.log("✅ Presentation generated at " + outputPath);
}

build().catch(console.error);