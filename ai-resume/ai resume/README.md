# 🚀 ResumAI - AI Resume Maker & ATS Optimizer

An intelligent, full-stack AI Resume Maker and ATS (Applicant Tracking System) Optimizer built with Node.js and a modern responsive web dashboard.

---

## ✨ Key Features

1. **Dual AI Engine**:
   - **Built-in Local AI Engine**: Runs 100% offline with zero dependencies and no API key required! Uses domain-trained heuristic NLP, STAR-method bullet transformation, ATS keyword analysis, and dynamic summary synthesis.
   - **Google Gemini API Support**: Optionally connect your Gemini API key in the UI or `.env` for frontier generative AI capabilities.

2. **5 ATS-Optimized & Modern Resume Templates**:
   - **Modern Tech**: Clean accent bar, structured contact ribbon, and crisp modern typography.
   - **Executive Elite**: Distinguished serif headings, classic double-line dividers, ideal for leadership and management roles.
   - **Two-Column Tech**: Sidebar layout separating skills and credentials from deep technical experience.
   - **Clean Creative**: Contemporary header block with pill-tag skill badges.
   - **Classic ATS Minimal**: Single-column high-contrast layout guaranteed 100% readable by legacy ATS parsers (Taleo, Workday, Greenhouse).

3. **Interactive ATS Job Description Scanner**:
   - Paste any target Job Description (JD).
   - Real-time **Match Score Gauge (0–100%)**.
   - Identifies **Matched Keywords** found across your resume.
   - Pinpoints **Missing High-Priority Keywords** with **1-click instant addition** into your skills.
   - Actionable recommendations to pass automated recruiter screening filters.

4. **AI-Powered Writing Tools**:
   - **AI Quick Resume Generator**: Provide a target role and experience level, and generate a complete structured resume in seconds.
   - **AI Bullet Point Enhancer**: Converts weak bullet points into high-impact accomplishment statements using the **STAR Method** (Situation, Task, Action, Result) with quantifiable metrics.
   - **AI Summary Writer**: Generates compelling professional summaries in 4 customizable tones (Professional, Executive, Creative, Entry-Level).
   - **AI Skill Suggester**: Recommends core technical and soft competencies for any job title.

5. **Live Interactive Preview & Multi-Format Export**:
   - Real-time side-by-side editing and preview.
   - Customizable color palettes (Indigo, Emerald, Sapphire, Violet, Crimson, Slate).
   - Typography selector (Inter, Outfit, Roboto, Merriweather, Playfair Display).
   - Spacing density toggle (Compact, Normal, Spacious) for single-page optimization.
   - **One-Click PDF Download** (A4 print-ready vector quality).
   - **JSON Backup Export & Import**.
   - **One-Click Plain Text / Markdown Copy**.
   - **Browser Auto-Save** via localStorage.

---

## 🛠️ Quick Start

### 1. Start the Server
```bash
node server.js
```
The server will start on port `3000`:
```
📡 Server running at http://localhost:3000
```

### 2. Open in Browser
Open `http://localhost:3000` in any web browser.

---

## 📁 Project Architecture

```
ai resume/
├── server.js               # Zero-dependency Node.js HTTP server & API endpoints
├── data/
│   ├── ats-keywords.js     # ATS dictionaries, action verbs, and role templates
│   └── sample-resumes.js   # Pre-configured demo profiles
├── public/
│   ├── index.html          # Semantic modern Single-Page Application
│   ├── styles.css          # CSS Variables, dark/light themes, print layout
│   └── app.js              # Reactive state engine, live renderer, ATS scoring
├── package.json            # NPM scripts and project metadata
├── .env.example            # Optional environment configuration
└── README.md               # Documentation
```
