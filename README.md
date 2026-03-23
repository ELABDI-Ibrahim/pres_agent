# DossierMed — Générateur de Présentation Design Thinking

Génère automatiquement un fichier PowerPoint `.pptx` de 4 slides sur les tests Design Thinking de DossierMed.

## Prérequis

- **Node.js** v18+ ([télécharger ici](https://nodejs.org))
- **npm** (inclus avec Node.js)

## Installation

```bash
# 1. Cloner / dézipper le projet
cd dossiermed-pptx

# 2. Installer les dépendances
npm install
```

> ⚠️ La librairie `sharp` compile du code natif (C++). L'installation peut prendre 1-2 minutes.

## Utilisation

```bash
npm run generate
# ou
node generate.js
```

Le fichier **`DossierMed_Tests_DesignThinking.pptx`** sera créé dans le dossier courant.

## Structure du projet

```
dossiermed-pptx/
├── generate.js        ← Script principal (toute la logique des slides)
├── package.json       ← Dépendances npm
└── README.md          ← Ce fichier
```

## Les 4 slides générées

| # | Titre | Type de test |
|---|-------|-------------|
| 1 | Tests d'Utilisabilité | Usability Testing |
| 2 | Tests de Sécurité Clinique & Technique | Security / Clinical Safety |
| 3 | Tree Testing & Adoption Comportementale | Tree Testing |
| 4 | A/B Testing SMS vs Kiosque de Santé | A/B Testing |

## Dépendances utilisées

| Package | Rôle |
|---------|------|
| `pptxgenjs` | Génération du fichier .pptx natif |
| `react` + `react-dom` | Rendu des icônes SVG côté serveur |
| `react-icons` | Bibliothèque d'icônes (Font Awesome, Material…) |
| `sharp` | Conversion SVG → PNG base64 pour les icônes |

## Modifier les slides

Tout le contenu est dans `generate.js`. Les zones clés :

- **Couleurs** : objet `C` en haut du fichier
- **Slide 1** : bloc `// SLIDE 1`
- **Slide 2** : bloc `// SLIDE 2`
- **Slide 3** : bloc `// SLIDE 3`
- **Slide 4** : bloc `// SLIDE 4`

### Ajouter une nouvelle slide

```js
// À la fin de la fonction build(), avant writeFile()
{
  let s = pres.addSlide();
  s.background = { color: C.cream };
  s.addText("Ma nouvelle slide", { x: 0.5, y: 0.5, w: 9, h: 1, fontSize: 36, bold: true, color: C.green });
}
```

### Changer le nom du fichier de sortie

```js
// Dernière ligne de build()
await pres.writeFile({ fileName: "MonNouveauNom.pptx" });
```
