const pptxgen = require("pptxgenjs");
const React = require("react");
const ReactDOMServer = require("react-dom/server");
const sharp = require("sharp");
const path = require("path");

const makeShadow = () => ({ type: "outer", blur: 8, offset: 3, angle: 135, color: "000000", opacity: 0.12 });

const C = {
  green: "1B5E3B",
  greenMid: "2E7D52",
  greenLight: "4CAF73",
  terracotta: "8B4513",
  cream: "FAF7F2",
  sand: "F0EAD6",
  charcoal: "2D2D2D",
  gray: "6B7280",
  white: "FFFFFF",
  red: "C0392B",
  orange: "E67E22",
  blue: "1A5276",
  lightGreen: "D4EFDF",
  lightRed: "FADBD8",
  lightOrange: "FDEBD0",
  lightBlue: "D6EAF8",
  teal: "0D6E6E",
  lightTeal: "D0EEEE",
  purple: "5B2C6F",
  lightPurple: "E8DAEF",
};

// We rebuild the full presentation with all 3 slides
async function build() {
  let pres = new pptxgen();
  pres.layout = "LAYOUT_16x9";
  pres.title = "DossierMed – Plan de Tests Design Thinking";

  // ─────────────────────────────────────────────
  // SLIDE 1 (unchanged copy)
  // ─────────────────────────────────────────────
  {
    let s = pres.addSlide();
    s.background = { color: C.cream };
    s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 0.12, h: 5.625, fill: { color: C.green }, line: { color: C.green } });
    s.addShape(pres.shapes.RECTANGLE, { x: 0.12, y: 0, w: 9.88, h: 1.1, fill: { color: C.green }, line: { color: C.green } });
    s.addText("TEST 1 — TESTS D'UTILISABILITÉ", { x: 0.35, y: 0.05, w: 7.5, h: 0.45, fontSize: 10, bold: true, color: C.lightGreen, fontFace: "Calibri", margin: 0 });
    s.addText("Valider l'ergonomie de chaque module DossierMed avec les utilisateurs réels", { x: 0.35, y: 0.5, w: 8.8, h: 0.5, fontSize: 18, bold: true, color: C.white, fontFace: "Georgia", margin: 0 });
    s.addShape(pres.shapes.RECTANGLE, { x: 0.25, y: 1.25, w: 4.5, h: 1.85, fill: { color: C.white }, line: { color: C.greenLight, pt: 2 }, shadow: makeShadow() });
    s.addShape(pres.shapes.RECTANGLE, { x: 0.25, y: 1.25, w: 4.5, h: 0.35, fill: { color: C.greenMid }, line: { color: C.greenMid } });
    s.addText("🎯  JUSTIFICATION", { x: 0.35, y: 1.27, w: 4.3, h: 0.3, fontSize: 10, bold: true, color: C.white, fontFace: "Calibri", margin: 0 });
    s.addText([
      { text: "DossierMed regroupe 6 profils différents", options: { bullet: true, breakLine: true } },
      { text: "(médecin, infirmier, pharmacien, labo, patient, admin)", options: { italic: true, color: C.gray, fontSize: 11, bullet: false, breakLine: true } },
      { text: "chacun avec des workflows critiques distincts.", options: { bullet: true, breakLine: true } },
      { text: "Un test d'utilisabilité révèle les frictions avant le code final.", options: { bullet: true } },
    ], { x: 0.35, y: 1.65, w: 4.3, h: 1.4, fontSize: 12, color: C.charcoal, fontFace: "Calibri" });
    s.addShape(pres.shapes.RECTANGLE, { x: 5.0, y: 1.25, w: 4.75, h: 1.85, fill: { color: C.white }, line: { color: C.terracotta, pt: 2 }, shadow: makeShadow() });
    s.addShape(pres.shapes.RECTANGLE, { x: 5.0, y: 1.25, w: 4.75, h: 0.35, fill: { color: C.terracotta }, line: { color: C.terracotta } });
    s.addText("📋  PLAN D'IMPLÉMENTATION", { x: 5.1, y: 1.27, w: 4.55, h: 0.3, fontSize: 10, bold: true, color: C.white, fontFace: "Calibri", margin: 0 });
    s.addText([
      { text: "Semaine 1-2 :", options: { bold: true, color: C.terracotta, breakLine: false } },
      { text: "  Recrutement de 5 participants/profil (30 total)", options: { breakLine: true } },
      { text: "Semaine 3 :", options: { bold: true, color: C.terracotta, breakLine: false } },
      { text: "  Sessions de 45 min avec protocole think-aloud", options: { breakLine: true } },
      { text: "Semaine 4 :", options: { bold: true, color: C.terracotta, breakLine: false } },
      { text: "  Analyse + rapport d'insights + priorisation", options: { breakLine: true } },
      { text: "Outil :", options: { bold: true, color: C.blue, breakLine: false } },
      { text: "  Figma + Maze / enregistrement écran Lookback.io", options: {} },
    ], { x: 5.1, y: 1.65, w: 4.55, h: 1.4, fontSize: 11, color: C.charcoal, fontFace: "Calibri" });
    const personas = [
      { label: "Médecin", task: "Consulter dossier patient en < 10 sec", color: C.green, bg: C.lightGreen },
      { label: "Infirmier", task: "Saisir les constantes vitales via tablette", color: C.blue, bg: C.lightBlue },
      { label: "Pharmacien", task: "Vérifier & délivrer une ordonnance", color: C.terracotta, bg: C.lightOrange },
      { label: "Patient", task: "Accéder à son dossier numérique", color: C.charcoal, bg: C.sand },
    ];
    personas.forEach((p, i) => {
      const x = 0.25 + i * 2.38;
      s.addShape(pres.shapes.RECTANGLE, { x, y: 3.25, w: 2.2, h: 1.75, fill: { color: p.bg }, line: { color: p.color, pt: 1.5 }, shadow: makeShadow() });
      s.addShape(pres.shapes.RECTANGLE, { x, y: 3.25, w: 2.2, h: 0.3, fill: { color: p.color }, line: { color: p.color } });
      s.addText(p.label, { x: x + 0.05, y: 3.27, w: 2.1, h: 0.26, fontSize: 10, bold: true, color: C.white, fontFace: "Calibri", margin: 0, align: "center" });
      s.addText(p.task, { x: x + 0.08, y: 3.6, w: 2.04, h: 1.1, fontSize: 10.5, color: p.color, fontFace: "Calibri", valign: "middle" });
    });
    s.addShape(pres.shapes.RECTANGLE, { x: 0.12, y: 5.1, w: 9.88, h: 0.525, fill: { color: C.green }, line: { color: C.green } });
    s.addText("KPI CIBLES   ·   Taux de complétion de tâche ≥ 85%   ·   Score SUS ≥ 70   ·   Temps sur tâche critique ≤ 10s   ·   Taux d'erreur critique = 0", {
      x: 0.3, y: 5.12, w: 9.5, h: 0.48, fontSize: 11, color: C.white, fontFace: "Calibri", margin: 0, align: "center",
    });
  }

  // ─────────────────────────────────────────────
  // SLIDE 2 (unchanged copy)
  // ─────────────────────────────────────────────
  {
    let s = pres.addSlide();
    s.background = { color: C.cream };
    s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 1.1, fill: { color: C.charcoal }, line: { color: C.charcoal } });
    s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 0.12, h: 5.625, fill: { color: C.red }, line: { color: C.red } });
    s.addText("TEST 2 — TESTS DE SÉCURITÉ CLINIQUE & TECHNIQUE", { x: 0.35, y: 0.05, w: 8, h: 0.45, fontSize: 10, bold: true, color: "E74C3C", fontFace: "Calibri", margin: 0 });
    s.addText("Zéro erreur médicale tolérée : valider les garde-fous de DossierMed", { x: 0.35, y: 0.5, w: 9.3, h: 0.5, fontSize: 18, bold: true, color: C.white, fontFace: "Georgia", margin: 0 });
    const cols = [
      { title: "🔒  Sécurité des Données", color: C.red, bg: C.lightRed, justif: "Le DPP centralise des données de santé ultra-sensibles. Toute faille = violation RGPD + risque patient.", steps: ["Tests de pénétration (RBAC, injections SQL)", "Vérifier isolation des rôles (patient ≠ médecin ≠ admin)", "Audit logs d'accès : traçabilité complète", "Chiffrement BD et transit (TLS, AES-256)"], outil: "OWASP ZAP, Burp Suite" },
      { title: "⚠️  Alertes Médicales", color: C.orange, bg: C.lightOrange, justif: "Le moteur d'alertes allergies/interactions est la fonctionnalité de sécurité n°1. Un bug = risque vital.", steps: ["Injecter 50+ cas d'allergies connues (ex. Pénicilline)", "Tester les faux positifs et faux négatifs", "Vérifier le blocage effectif côté pharmacie", "Mesurer le délai de déclenchement de l'alerte"], outil: "Scénarios cliniques réels + QA manuelle" },
      { title: "🗄️  Cohérence des Données", color: C.blue, bg: C.lightBlue, justif: "Single Source of Truth = toute mise à jour (labo, prescription) doit se propager sans délai ni perte.", steps: ["Tests E2E de flux labo → médecin → pharmacie", "Simuler coupures réseau (mode offline CHW)", "Vérifier cohérence après sync déconnexion", "Tests de charge (100+ utilisateurs simultanés)"], outil: "Cypress, Jest, k6 load testing" },
    ];
    cols.forEach((col, i) => {
      const x = 0.2 + i * 3.27;
      const w = 3.05;
      s.addShape(pres.shapes.RECTANGLE, { x, y: 1.2, w, h: 3.9, fill: { color: C.white }, line: { color: col.color, pt: 1.5 }, shadow: makeShadow() });
      s.addShape(pres.shapes.RECTANGLE, { x, y: 1.2, w, h: 0.4, fill: { color: col.color }, line: { color: col.color } });
      s.addText(col.title, { x: x + 0.08, y: 1.22, w: w - 0.15, h: 0.36, fontSize: 11, bold: true, color: C.white, fontFace: "Calibri", margin: 0 });
      s.addShape(pres.shapes.RECTANGLE, { x: x + 0.08, y: 1.68, w: w - 0.16, h: 0.75, fill: { color: col.bg }, line: { color: col.color, pt: 0.5 } });
      s.addText(col.justif, { x: x + 0.12, y: 1.71, w: w - 0.24, h: 0.69, fontSize: 9.5, color: col.color === C.blue ? C.blue : col.color, fontFace: "Calibri", italic: true });
      col.steps.forEach((step, j) => {
        s.addShape(pres.shapes.RECTANGLE, { x: x + 0.08, y: 2.52 + j * 0.42, w: 0.22, h: 0.22, fill: { color: col.color }, line: { color: col.color } });
        s.addText(String(j + 1), { x: x + 0.08, y: 2.52 + j * 0.42, w: 0.22, h: 0.22, fontSize: 9, bold: true, color: C.white, align: "center", valign: "middle", margin: 0 });
        s.addText(step, { x: x + 0.35, y: 2.52 + j * 0.42, w: w - 0.43, h: 0.38, fontSize: 9.5, color: C.charcoal, fontFace: "Calibri", valign: "middle" });
      });
      s.addShape(pres.shapes.RECTANGLE, { x: x + 0.08, y: 4.72, w: w - 0.16, h: 0.28, fill: { color: col.color }, line: { color: col.color } });
      s.addText("Outil : " + col.outil, { x: x + 0.1, y: 4.73, w: w - 0.2, h: 0.24, fontSize: 9, color: C.white, fontFace: "Calibri", bold: true, margin: 0 });
    });
    s.addShape(pres.shapes.RECTANGLE, { x: 0.12, y: 5.15, w: 9.88, h: 0.475, fill: { color: C.charcoal }, line: { color: C.charcoal } });
    s.addText("PRIORITÉ ABSOLUE   ·   Ces tests bloquent le déploiement — aucune mise en production sans validation complète de tous les cas critiques", {
      x: 0.3, y: 5.17, w: 9.5, h: 0.43, fontSize: 11, color: "E74C3C", fontFace: "Calibri", bold: true, margin: 0, align: "center",
    });
  }

  // ─────────────────────────────────────────────
  // SLIDE 3: Tree Testing — Navigation & Adoption Utilisateurs Marocains
  // ─────────────────────────────────────────────
  {
    let s = pres.addSlide();
    s.background = { color: C.cream };

    // Left accent bar — teal color for this test
    s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 0.12, h: 5.625, fill: { color: C.teal }, line: { color: C.teal } });
    // Header band
    s.addShape(pres.shapes.RECTANGLE, { x: 0.12, y: 0, w: 9.88, h: 1.1, fill: { color: C.teal }, line: { color: C.teal } });

    s.addText("TEST 3 — TREE TESTING & ADOPTION COMPORTEMENTALE", {
      x: 0.35, y: 0.05, w: 9, h: 0.45, fontSize: 10, bold: true, color: C.lightTeal, fontFace: "Calibri", margin: 0,
    });
    s.addText("Vérifier que médecins & utilisateurs marocains trouvent l'information sans effort", {
      x: 0.35, y: 0.5, w: 9.3, h: 0.5, fontSize: 17, bold: true, color: C.white, fontFace: "Georgia", margin: 0,
    });

    // ── LEFT COLUMN: Pourquoi ce test est critique ──
    // Justification card
    s.addShape(pres.shapes.RECTANGLE, { x: 0.22, y: 1.18, w: 3.1, h: 2.05, fill: { color: C.white }, line: { color: C.teal, pt: 2 }, shadow: makeShadow() });
    s.addShape(pres.shapes.RECTANGLE, { x: 0.22, y: 1.18, w: 3.1, h: 0.35, fill: { color: C.teal }, line: { color: C.teal } });
    s.addText("🎯  POURQUOI CE TEST ?", { x: 0.32, y: 1.2, w: 2.9, h: 0.3, fontSize: 10, bold: true, color: C.white, fontFace: "Calibri", margin: 0 });
    s.addText([
      { text: "Au Maroc", options: { bold: true, color: C.teal, breakLine: false } },
      { text: ", les médecins travaillent encore majoritairement sur papier.", options: { breakLine: true } },
      { text: "Si la navigation est contre-intuitive ou trop « tech »,", options: { bullet: true, breakLine: true } },
      { text: "le risque de rejet du système est élevé.", options: { bullet: true, breakLine: true } },
      { text: "Ce test révèle les points de blocage", options: { italic: true, color: C.teal, breakLine: false } },
      { text: " avant le déploiement.", options: { italic: true, breakLine: true } },
    ], { x: 0.32, y: 1.58, w: 2.9, h: 1.55, fontSize: 10.5, color: C.charcoal, fontFace: "Calibri" });

    // Adoption risk card
    s.addShape(pres.shapes.RECTANGLE, { x: 0.22, y: 3.32, w: 3.1, h: 1.68, fill: { color: C.white }, line: { color: C.purple, pt: 2 }, shadow: makeShadow() });
    s.addShape(pres.shapes.RECTANGLE, { x: 0.22, y: 3.32, w: 3.1, h: 0.35, fill: { color: C.purple }, line: { color: C.purple } });
    s.addText("⚡  RISQUE D'ADOPTION", { x: 0.32, y: 3.34, w: 2.9, h: 0.3, fontSize: 10, bold: true, color: C.white, fontFace: "Calibri", margin: 0 });
    // Two mini risk boxes
    const risks = [
      { label: "Comportement ancien", desc: "Habitude papier/Excel difficile à changer sans UX intuitive", color: C.orange },
      { label: "Barrière linguistique", desc: "Darija / Arabe / Français : les libellés doivent être clairs pour tous", color: C.purple },
    ];
    risks.forEach((r, i) => {
      s.addShape(pres.shapes.RECTANGLE, { x: 0.3, y: 3.74 + i * 0.55, w: 2.94, h: 0.45, fill: { color: i === 0 ? C.lightOrange : C.lightPurple }, line: { color: r.color, pt: 1 } });
      s.addText([
        { text: r.label + " : ", options: { bold: true, color: r.color } },
        { text: r.desc, options: {} },
      ], { x: 0.34, y: 3.76 + i * 0.55, w: 2.86, h: 0.41, fontSize: 9, color: C.charcoal, fontFace: "Calibri", valign: "middle" });
    });

    // ── MIDDLE COLUMN: tree structure diagram ──
    const mx = 3.55;

    s.addShape(pres.shapes.RECTANGLE, { x: mx, y: 1.18, w: 3.15, h: 3.82, fill: { color: C.white }, line: { color: C.teal, pt: 1.5 }, shadow: makeShadow() });
    s.addShape(pres.shapes.RECTANGLE, { x: mx, y: 1.18, w: 3.15, h: 0.35, fill: { color: C.teal }, line: { color: C.teal } });
    s.addText("🌳  ARBORESCENCE TESTÉE", { x: mx + 0.1, y: 1.2, w: 2.95, h: 0.3, fontSize: 10, bold: true, color: C.white, fontFace: "Calibri", margin: 0 });

    // Tree root node
    s.addShape(pres.shapes.RECTANGLE, { x: mx + 0.9, y: 1.65, w: 1.35, h: 0.28, fill: { color: C.teal }, line: { color: C.teal } });
    s.addText("DossierMed", { x: mx + 0.9, y: 1.65, w: 1.35, h: 0.28, fontSize: 9, bold: true, color: C.white, align: "center", valign: "middle", margin: 0 });

    // Connector line down from root
    s.addShape(pres.shapes.LINE, { x: mx + 1.575, y: 1.93, w: 0, h: 0.18, line: { color: C.teal, width: 1.5 } });

    // Level 1 branch line
    s.addShape(pres.shapes.LINE, { x: mx + 0.35, y: 2.11, w: 2.45, h: 0, line: { color: C.teal, width: 1.5 } });

    // 3 Level-1 nodes
    const l1 = [
      { label: "Patients", color: C.green, x: mx + 0.1 },
      { label: "Agenda", color: C.teal, x: mx + 0.95 },
      { label: "Résultats", color: C.blue, x: mx + 1.8 },
    ];
    l1.forEach((n) => {
      s.addShape(pres.shapes.LINE, { x: n.x + 0.37, y: 2.11, w: 0, h: 0.18, line: { color: n.color, width: 1.5 } });
      s.addShape(pres.shapes.RECTANGLE, { x: n.x, y: 2.29, w: 0.75, h: 0.26, fill: { color: n.color }, line: { color: n.color } });
      s.addText(n.label, { x: n.x, y: 2.29, w: 0.75, h: 0.26, fontSize: 8.5, bold: true, color: C.white, align: "center", valign: "middle", margin: 0 });
    });

    // Level 2 subnodes under "Patients"
    s.addShape(pres.shapes.LINE, { x: mx + 0.47, y: 2.55, w: 0, h: 0.15, line: { color: C.green, width: 1 } });
    s.addShape(pres.shapes.LINE, { x: mx + 0.15, y: 2.70, w: 0.65, h: 0, line: { color: C.green, width: 1 } });
    const l2patients = [
      { label: "Dossier", x: mx + 0.04 },
      { label: "Ordon.", x: mx + 0.54 },
    ];
    l2patients.forEach((n) => {
      s.addShape(pres.shapes.LINE, { x: n.x + 0.27, y: 2.70, w: 0, h: 0.13, line: { color: C.green, width: 1 } });
      s.addShape(pres.shapes.RECTANGLE, { x: n.x, y: 2.83, w: 0.55, h: 0.23, fill: { color: C.lightGreen }, line: { color: C.green, pt: 1 } });
      s.addText(n.label, { x: n.x, y: 2.83, w: 0.55, h: 0.23, fontSize: 7.5, color: C.green, align: "center", valign: "middle", margin: 0, bold: true });
    });

    // Level 2 subnodes under "Agenda"
    s.addShape(pres.shapes.LINE, { x: mx + 1.32, y: 2.55, w: 0, h: 0.15, line: { color: C.teal, width: 1 } });
    s.addShape(pres.shapes.LINE, { x: mx + 1.05, y: 2.70, w: 0.55, h: 0, line: { color: C.teal, width: 1 } });
    const l2agenda = [
      { label: "RDV", x: mx + 0.93 },
      { label: "Rappels", x: mx + 1.38 },
    ];
    l2agenda.forEach((n) => {
      s.addShape(pres.shapes.LINE, { x: n.x + 0.27, y: 2.70, w: 0, h: 0.13, line: { color: C.teal, width: 1 } });
      s.addShape(pres.shapes.RECTANGLE, { x: n.x, y: 2.83, w: 0.55, h: 0.23, fill: { color: C.lightTeal }, line: { color: C.teal, pt: 1 } });
      s.addText(n.label, { x: n.x, y: 2.83, w: 0.55, h: 0.23, fontSize: 7.5, color: C.teal, align: "center", valign: "middle", margin: 0, bold: true });
    });

    // Level 2 subnodes under "Résultats"
    s.addShape(pres.shapes.LINE, { x: mx + 2.17, y: 2.55, w: 0, h: 0.15, line: { color: C.blue, width: 1 } });
    s.addShape(pres.shapes.LINE, { x: mx + 1.90, y: 2.70, w: 0.55, h: 0, line: { color: C.blue, width: 1 } });
    const l2res = [
      { label: "Labo", x: mx + 1.79 },
      { label: "Radios", x: mx + 2.24 },
    ];
    l2res.forEach((n) => {
      s.addShape(pres.shapes.LINE, { x: n.x + 0.27, y: 2.70, w: 0, h: 0.13, line: { color: C.blue, width: 1 } });
      s.addShape(pres.shapes.RECTANGLE, { x: n.x, y: 2.83, w: 0.55, h: 0.23, fill: { color: C.lightBlue }, line: { color: C.blue, pt: 1 } });
      s.addText(n.label, { x: n.x, y: 2.83, w: 0.55, h: 0.23, fontSize: 7.5, color: C.blue, align: "center", valign: "middle", margin: 0, bold: true });
    });

    // 3 task scenarios in the tree card
    const tasks = [
      { icon: "👨‍⚕️", text: "Trouver les résultats labo d'un patient urgence", color: C.blue },
      { icon: "📅", text: "Modifier un RDV depuis la vue patient", color: C.teal },
      { icon: "💊", text: "Accéder à l'historique d'ordonnances", color: C.green },
    ];
    s.addText("TÂCHES SOUMISES AUX UTILISATEURS :", {
      x: mx + 0.1, y: 3.2, w: 2.95, h: 0.28, fontSize: 9, bold: true, color: C.charcoal, fontFace: "Calibri",
    });
    tasks.forEach((t, i) => {
      s.addShape(pres.shapes.RECTANGLE, { x: mx + 0.1, y: 3.5 + i * 0.44, w: 2.95, h: 0.38, fill: { color: i % 2 === 0 ? "F5FAFA" : C.white }, line: { color: t.color, pt: 0.5 } });
      s.addText(t.icon + "  " + t.text, { x: mx + 0.15, y: 3.52 + i * 0.44, w: 2.85, h: 0.34, fontSize: 9, color: C.charcoal, fontFace: "Calibri", valign: "middle" });
    });

    // ── RIGHT COLUMN: Plan d'implémentation ──
    const rx = 6.88;
    s.addShape(pres.shapes.RECTANGLE, { x: rx, y: 1.18, w: 3.0, h: 3.72, fill: { color: C.white }, line: { color: C.purple, pt: 2 }, shadow: makeShadow() });
    s.addShape(pres.shapes.RECTANGLE, { x: rx, y: 1.18, w: 3.0, h: 0.35, fill: { color: C.purple }, line: { color: C.purple } });
    s.addText("📋  PLAN D'IMPLÉMENTATION", { x: rx + 0.1, y: 1.2, w: 2.8, h: 0.3, fontSize: 10, bold: true, color: C.white, fontFace: "Calibri", margin: 0 });

    const planSteps = [
      { phase: "Semaine 1", action: "Définir l'arborescence de DossierMed (menus, labels, hiérarchie)", color: C.teal },
      { phase: "Semaine 2", action: "Recruter 15 participants : 8 médecins marocains + 7 patients (zones urbaine & rurale)", color: C.teal },
      { phase: "Semaine 3", action: "Sessions Optimal Workshop / Treejack : chaque participant réalise 5–7 tâches de navigation sans aide", color: C.purple },
      { phase: "Semaine 4", action: "Analyser : taux de succès direct, taux d'errance, nœuds problématiques → recommandations UX", color: C.purple },
      { phase: "Semaine 5", action: "Réviser les libellés / structure si score < seuil → Re-test itératif", color: C.orange },
    ];
    planSteps.forEach((step, i) => {
      const y = 1.62 + i * 0.62;
      s.addShape(pres.shapes.RECTANGLE, { x: rx + 0.08, y, w: 2.84, h: 0.6, fill: { color: "FAFAFA" }, line: { color: step.color, pt: 1 } });
      s.addShape(pres.shapes.RECTANGLE, { x: rx + 0.08, y, w: 0.75, h: 0.6, fill: { color: step.color }, line: { color: step.color } });
      s.addText(step.phase, { x: rx + 0.08, y, w: 0.75, h: 0.6, fontSize: 8.5, bold: true, color: C.white, align: "center", valign: "middle", margin: 0 });
      s.addText(step.action, { x: rx + 0.88, y: y + 0.02, w: 2.0, h: 0.56, fontSize: 8.5, color: C.charcoal, fontFace: "Calibri", valign: "middle" });
    });

    // Outil badge
    s.addShape(pres.shapes.RECTANGLE, { x: rx + 0.08, y: 4.74, w: 2.84, h: 0.28, fill: { color: C.purple }, line: { color: C.purple } });
    s.addText("Outil : Optimal Workshop · Treejack · Maze", { x: rx + 0.1, y: 4.75, w: 2.8, h: 0.24, fontSize: 9, color: C.white, fontFace: "Calibri", bold: true, margin: 0 });

    // ── Bottom KPI strip ──
    s.addShape(pres.shapes.RECTANGLE, { x: 0.12, y: 5.1, w: 9.88, h: 0.525, fill: { color: C.teal }, line: { color: C.teal } });
    s.addText("CRITÈRE DE RÉUSSITE   ·   Taux de succès direct ≥ 80%   ·   < 2 étapes d'errance par tâche   ·   Si échec → refonte labels/arborescence obligatoire avant lancement", {
      x: 0.3, y: 5.12, w: 9.5, h: 0.48, fontSize: 10.5, color: C.white, fontFace: "Calibri", bold: false, margin: 0, align: "center",
    });
  }

  // ─────────────────────────────────────────────
  // SLIDE 4: A/B Testing — SMS vs Kiosque de Santé
  // ─────────────────────────────────────────────
  {
    let s = pres.addSlide();
    s.background = { color: C.cream };

    // Accent bar — orange for A/B decision energy
    const AB = "7D3C98"; // deep violet
    const ABlight = "EAD7F7";
    const smsColor = "1A5276";    // deep blue for SMS
    const smsLight = "D6EAF8";
    const kiosqueColor = "1B5E3B"; // deep green for Kiosque
    const kiosqueLight = "D4EFDF";

    s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 0.12, h: 5.625, fill: { color: AB }, line: { color: AB } });
    s.addShape(pres.shapes.RECTANGLE, { x: 0.12, y: 0, w: 9.88, h: 1.1, fill: { color: AB }, line: { color: AB } });

    s.addText("TEST 4 — A/B TESTING  ·  CANAL D'INCLUSION NUMÉRIQUE", {
      x: 0.35, y: 0.05, w: 9, h: 0.42, fontSize: 10, bold: true, color: ABlight, fontFace: "Calibri", margin: 0,
    });
    s.addText("SMS/USSD vs Kiosque de Santé : quel canal garder pour les zones rurales ?", {
      x: 0.35, y: 0.5, w: 9.3, h: 0.52, fontSize: 17, bold: true, color: C.white, fontFace: "Georgia", margin: 0,
    });

    // ── CONTEXT BANNER ──
    s.addShape(pres.shapes.RECTANGLE, { x: 0.22, y: 1.18, w: 9.56, h: 0.52, fill: { color: ABlight }, line: { color: AB, pt: 1 } });
    s.addText([
      { text: "Problème : ", options: { bold: true, color: AB } },
      { text: "Maintenir les deux canaux simultanément représente un coût opérationnel élevé (infrastructure kiosques + opérateurs SMS). ", options: { color: C.charcoal } },
      { text: "L'A/B Test détermine lequel maximise l'adoption réelle auprès des populations cibles.", options: { bold: true, color: C.charcoal } },
    ], { x: 0.32, y: 1.2, w: 9.36, h: 0.48, fontSize: 10.5, fontFace: "Calibri", valign: "middle" });

    // ── VARIANT A — SMS/USSD ──
    const ax = 0.22;
    const cardW = 4.3;

    // Card background
    s.addShape(pres.shapes.RECTANGLE, { x: ax, y: 1.82, w: cardW, h: 3.1, fill: { color: C.white }, line: { color: smsColor, pt: 2 }, shadow: makeShadow() });
    // Header
    s.addShape(pres.shapes.RECTANGLE, { x: ax, y: 1.82, w: cardW, h: 0.42, fill: { color: smsColor }, line: { color: smsColor } });
    s.addText("VARIANTE A  —  📱 SMS / USSD", { x: ax + 0.1, y: 1.84, w: cardW - 0.2, h: 0.38, fontSize: 12, bold: true, color: C.white, fontFace: "Calibri", margin: 0 });

    // Big stat
    s.addShape(pres.shapes.RECTANGLE, { x: ax + 0.1, y: 2.3, w: cardW - 0.2, h: 0.5, fill: { color: smsLight }, line: { color: smsColor, pt: 0.5 } });
    s.addText([
      { text: "Nokia basique suffisant  ·  ", options: { bold: true, color: smsColor } },
      { text: "Accessible sans internet", options: { color: C.charcoal } },
    ], { x: ax + 0.15, y: 2.32, w: cardW - 0.3, h: 0.46, fontSize: 10.5, fontFace: "Calibri", valign: "middle" });

    // Pros
    const smsPros = [
      "Coût déploiement quasi nul (réseau existant)",
      "Couverture maximale : fonctionne partout au Maroc",
      "Rappels RDV, résultats labo envoyés automatiquement",
      "Aucune maintenance physique requise",
    ];
    s.addText("✅  AVANTAGES", { x: ax + 0.1, y: 2.87, w: cardW - 0.2, h: 0.25, fontSize: 9.5, bold: true, color: smsColor, fontFace: "Calibri" });
    smsPros.forEach((p, i) => {
      s.addShape(pres.shapes.RECTANGLE, { x: ax + 0.1, y: 3.15 + i * 0.3, w: 0.18, h: 0.18, fill: { color: smsColor }, line: { color: smsColor } });
      s.addText("✓", { x: ax + 0.1, y: 3.15 + i * 0.3, w: 0.18, h: 0.18, fontSize: 8, bold: true, color: C.white, align: "center", valign: "middle", margin: 0 });
      s.addText(p, { x: ax + 0.32, y: 3.15 + i * 0.3, w: cardW - 0.42, h: 0.28, fontSize: 9.5, color: C.charcoal, fontFace: "Calibri", valign: "middle" });
    });

    // Con
    s.addShape(pres.shapes.RECTANGLE, { x: ax + 0.1, y: 4.37, w: cardW - 0.2, h: 0.42, fill: { color: C.lightRed }, line: { color: C.red, pt: 0.5 } });
    s.addText([
      { text: "❌  Limite : ", options: { bold: true, color: C.red } },
      { text: "Interaction limitée, pas de consultation dossier complet", options: {} },
    ], { x: ax + 0.15, y: 4.39, w: cardW - 0.3, h: 0.38, fontSize: 9.5, color: C.charcoal, fontFace: "Calibri", valign: "middle" });

    // ── VARIANT B — KIOSQUE ──
    const bx = 5.38;

    s.addShape(pres.shapes.RECTANGLE, { x: bx, y: 1.82, w: cardW, h: 3.1, fill: { color: C.white }, line: { color: kiosqueColor, pt: 2 }, shadow: makeShadow() });
    s.addShape(pres.shapes.RECTANGLE, { x: bx, y: 1.82, w: cardW, h: 0.42, fill: { color: kiosqueColor }, line: { color: kiosqueColor } });
    s.addText("VARIANTE B  —  🏪 KIOSQUE DE SANTÉ", { x: bx + 0.1, y: 1.84, w: cardW - 0.2, h: 0.38, fontSize: 12, bold: true, color: C.white, fontFace: "Calibri", margin: 0 });

    s.addShape(pres.shapes.RECTANGLE, { x: bx + 0.1, y: 2.3, w: cardW - 0.2, h: 0.5, fill: { color: kiosqueLight }, line: { color: kiosqueColor, pt: 0.5 } });
    s.addText([
      { text: "Accès complet au DPP  ·  ", options: { bold: true, color: kiosqueColor } },
      { text: "Interface guidée sur place", options: { color: C.charcoal } },
    ], { x: bx + 0.15, y: 2.32, w: cardW - 0.3, h: 0.46, fontSize: 10.5, fontFace: "Calibri", valign: "middle" });

    const kiosPros = [
      "Accès dossier complet + résultats labo visuels",
      "Agent de santé sur place = accompagnement humain",
      "Idéal pour populations âgées ou peu alphabétisées",
      "Collecte biométrique possible (poids, TA, SpO2)",
    ];
    s.addText("✅  AVANTAGES", { x: bx + 0.1, y: 2.87, w: cardW - 0.2, h: 0.25, fontSize: 9.5, bold: true, color: kiosqueColor, fontFace: "Calibri" });
    kiosPros.forEach((p, i) => {
      s.addShape(pres.shapes.RECTANGLE, { x: bx + 0.1, y: 3.15 + i * 0.3, w: 0.18, h: 0.18, fill: { color: kiosqueColor }, line: { color: kiosqueColor } });
      s.addText("✓", { x: bx + 0.1, y: 3.15 + i * 0.3, w: 0.18, h: 0.18, fontSize: 8, bold: true, color: C.white, align: "center", valign: "middle", margin: 0 });
      s.addText(p, { x: bx + 0.32, y: 3.15 + i * 0.3, w: cardW - 0.42, h: 0.28, fontSize: 9.5, color: C.charcoal, fontFace: "Calibri", valign: "middle" });
    });

    s.addShape(pres.shapes.RECTANGLE, { x: bx + 0.1, y: 4.37, w: cardW - 0.2, h: 0.42, fill: { color: C.lightRed }, line: { color: C.red, pt: 0.5 } });
    s.addText([
      { text: "❌  Limite : ", options: { bold: true, color: C.red } },
      { text: "Coût élevé (installation, énergie solaire, agent)", options: {} },
    ], { x: bx + 0.15, y: 4.39, w: cardW - 0.3, h: 0.38, fontSize: 9.5, color: C.charcoal, fontFace: "Calibri", valign: "middle" });

    // ── VS divider ──
    s.addShape(pres.shapes.OVAL, { x: 4.72, y: 2.95, w: 0.56, h: 0.56, fill: { color: AB }, line: { color: AB } });
    s.addText("VS", { x: 4.72, y: 2.95, w: 0.56, h: 0.56, fontSize: 12, bold: true, color: C.white, align: "center", valign: "middle", margin: 0 });

    // ── MÉTRIQUES DE DÉCISION ──
    // Small metrics row between the cards and the footer
    const metrics = [
      { label: "Taux d'adoption", sms: "≥ 60%", kio: "≥ 40%", note: "SMS gagne si rural dispersé" },
      { label: "Coût / utilisateur", sms: "< 5 MAD/mois", kio: "< 80 MAD/mois", note: "Ratio à comparer" },
      { label: "Score satisfaction", sms: "≥ 65 / 100", kio: "≥ 75 / 100", note: "Kiosque attendu meilleur" },
    ];

    // Footer decision strip
    s.addShape(pres.shapes.RECTANGLE, { x: 0.12, y: 5.1, w: 9.88, h: 0.525, fill: { color: AB }, line: { color: AB } });
    s.addText([
      { text: "DÉCISION :  ", options: { bold: true, color: ABlight } },
      { text: "Piloter les 2 canaux sur 2 régions distinctes pendant 6 semaines → comparer adoption, satisfaction & coût → garder le meilleur, ou SMS par défaut si résultats équivalents", options: { color: C.white } },
    ], { x: 0.3, y: 5.12, w: 9.5, h: 0.48, fontSize: 10.5, fontFace: "Calibri", margin: 0, align: "left", valign: "middle" });
  }

  const outputPath = path.join(__dirname, "DossierMed_Tests_DesignThinking.pptx");
  await pres.writeFile({ fileName: outputPath });
  console.log("✅  Fichier généré : " + outputPath);
}

build().catch(console.error);
