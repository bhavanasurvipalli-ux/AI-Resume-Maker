const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const url = require('url');

// Load environment variables from .env file if it exists
(function loadEnv() {
  const envPath = path.join(__dirname, '.env');
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf8');
    content.split('\n').forEach(line => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        const idx = trimmed.indexOf('=');
        if (idx > 0) {
          const key = trimmed.slice(0, idx).trim();
          const val = trimmed.slice(idx + 1).trim();
          if (!process.env[key]) {
            process.env[key] = val;
          }
        }
      }
    });
  }
})();

const { ROLE_DATA, ATS_ESSENTIAL_CRITERIA, ACTION_VERBS } = require('./data/ats-keywords');
const { SAMPLE_RESUMES } = require('./data/sample-resumes');

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = path.join(__dirname, 'public');
const RESUMES_DIR = path.join(__dirname, 'saved_resumes');

if (!fs.existsSync(RESUMES_DIR)) {
  fs.mkdirSync(RESUMES_DIR, { recursive: true });
}

// MIME Types for static files
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.ico': 'image/x-icon'
};

// Common English stopwords for ATS keyword extraction
const STOPWORDS = new Set([
  'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and', 'any', 'are', 'aren\'t', 'as', 'at',
  'be', 'because', 'been', 'before', 'being', 'below', 'between', 'both', 'but', 'by', 'can', 'can\'t', 'cannot',
  'could', 'couldn\'t', 'did', 'didn\'t', 'do', 'does', 'doesn\'t', 'doing', 'don\'t', 'down', 'during', 'each',
  'few', 'for', 'from', 'further', 'had', 'hadn\'t', 'has', 'hasn\'t', 'have', 'haven\'t', 'having', 'he', 'he\'d',
  'he\'ll', 'he\'s', 'her', 'here', 'here\'s', 'hers', 'herself', 'him', 'himself', 'his', 'how', 'how\'s', 'i',
  'i\'d', 'i\'ll', 'i\'m', 'i\'ve', 'if', 'in', 'into', 'is', 'isn\'t', 'it', 'it\'s', 'its', 'itself', 'let\'s',
  'me', 'more', 'most', 'mustn\'t', 'my', 'myself', 'no', 'nor', 'not', 'of', 'off', 'on', 'once', 'only', 'or',
  'other', 'ought', 'our', 'ours', 'ourselves', 'out', 'over', 'own', 'same', 'shan\'t', 'she', 'she\'d', 'she\'ll',
  'she\'s', 'should', 'shouldn\'t', 'so', 'some', 'such', 'than', 'that', 'that\'s', 'the', 'their', 'theirs',
  'them', 'themselves', 'then', 'there', 'there\'s', 'these', 'they', 'they\'d', 'they\'ll', 'they\'re', 'they\'ve',
  'this', 'those', 'through', 'to', 'too', 'under', 'until', 'up', 'very', 'was', 'wasn\'t', 'we', 'we\'d', 'we\'ll',
  'we\'re', 'we\'ve', 'were', 'weren\'t', 'what', 'what\'s', 'when', 'when\'s', 'where', 'where\'s', 'which', 'while',
  'who', 'who\'s', 'whom', 'why', 'why\'s', 'with', 'won\'t', 'would', 'wouldn\'t', 'you', 'you\'d', 'you\'ll',
  'you\'re', 'you\'ve', 'your', 'yours', 'yourself', 'yourselves', 'will', 'also', 'etc', 'including', 'responsible',
  'must', 'work', 'job', 'role', 'team', 'company', 'candidate', 'experience', 'years', 'working', 'ability', 'required'
]);

// Helper to make Gemini API call via native https
function callGeminiAPI(prompt, apiKey, model = 'gemini-1.5-flash') {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      contents: [{
        parts: [{ text: prompt }]
      }],
      generationConfig: {
        temperature: 0.7,
        topP: 0.95,
        maxOutputTokens: 2048
      }
    });

    const options = {
      hostname: 'generativelanguage.googleapis.com',
      port: 443,
      path: `/v1beta/models/${model}:generateContent?key=${apiKey}`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', chunk => { body += chunk; });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          if (res.statusCode >= 200 && res.statusCode < 300) {
            const text = parsed.candidates?.[0]?.content?.parts?.[0]?.text;
            if (text) {
              resolve(text);
            } else {
              reject(new Error('No response text returned from Gemini API'));
            }
          } else {
            reject(new Error(parsed.error?.message || `Gemini API HTTP ${res.statusCode}`));
          }
        } catch (e) {
          reject(new Error(`Failed to parse Gemini response: ${e.message}`));
        }
      });
    });

    req.on('error', (err) => reject(err));
    req.write(postData);
    req.end();
  });
}

// ==========================================
// Built-in Local AI Engine (Heuristic / NLP)
// ==========================================

function getRoleMatch(jobTitle = '') {
  const normalized = jobTitle.toLowerCase().trim();
  if (normalized.includes('data') || normalized.includes('ml') || normalized.includes('machine learning') || normalized.includes('ai')) {
    return ROLE_DATA.data_scientist;
  }
  if (normalized.includes('product') || normalized.includes('pm') || normalized.includes('owner')) {
    return ROLE_DATA.product_manager;
  }
  if (normalized.includes('front') || normalized.includes('ui') || normalized.includes('react') || normalized.includes('web')) {
    return ROLE_DATA.frontend_developer;
  }
  if (normalized.includes('devops') || normalized.includes('cloud') || normalized.includes('sre') || normalized.includes('infrastructure')) {
    return ROLE_DATA.devops_engineer;
  }
  if (normalized.includes('market') || normalized.includes('growth') || normalized.includes('seo')) {
    return ROLE_DATA.marketing_specialist;
  }
  return ROLE_DATA.software_engineer;
}

// Generate Complete Resume from scratch
function generateLocalResume({ jobTitle, experienceLevel = 'mid', skillsInput = '', targetIndustry = 'Tech' }) {
  const role = getRoleMatch(jobTitle);
  const years = experienceLevel === 'senior' ? '6+' : experienceLevel === 'entry' ? '1+' : '3+';
  const prefix = experienceLevel === 'senior' ? 'Senior ' : experienceLevel === 'entry' ? 'Junior ' : '';
  const finalTitle = prefix + (jobTitle || role.title);

  const customSkills = skillsInput
    ? skillsInput.split(',').map(s => s.trim()).filter(Boolean)
    : [];

  const techSkills = Array.from(new Set([...customSkills, ...role.skills.technical])).slice(0, 10);
  const softSkills = role.skills.soft.slice(0, 6);

  // Pick random action verbs and generate STAR bullets
  const bullets1 = [
    `Spearheaded development of scalable ${techSkills[0] || 'modern'} systems, enhancing performance by 38% and reducing error rates by 24%.`,
    `Architected and deployed automated CI/CD pipelines utilizing ${techSkills[1] || 'Docker'} and cloud tools, cutting deployment times by 65%.`,
    `Collaborated with cross-functional product teams to deliver high-priority initiatives, boosting quarterly user engagement by 22%.`,
    `Mentored 4 team members on best practices, system architecture, and automated test coverage standards.`
  ];

  const bullets2 = [
    `Engineered responsive customer-facing features utilizing ${techSkills[2] || 'JavaScript'} and ${techSkills[3] || 'REST APIs'}, handling 100k+ monthly active requests.`,
    `Optimized backend database schemas and caching layers, resulting in a 45% reduction in query latency.`,
    `Automated regression testing frameworks, improving release stability and catching 90%+ of critical bugs before production.`
  ];

  return {
    personal: {
      fullName: "Your Name",
      jobTitle: finalTitle,
      email: "name.professional@email.com",
      phone: "+1 (555) 234-5678",
      location: "San Francisco, CA (or Remote)",
      website: "https://yourportfolio.com",
      linkedin: "linkedin.com/in/yourprofile",
      github: "github.com/yourhandle"
    },
    summary: `Results-driven ${finalTitle} with ${years} years of proven expertise in architecting resilient solutions, optimizing operational workflows, and driving quantifiable product impact. Skilled in ${techSkills.slice(0, 4).join(', ')}, with a strong focus on high-performance execution and agile collaboration.`,
    experience: [
      {
        id: "exp_" + Date.now(),
        title: finalTitle,
        company: "Apex Global Solutions",
        location: "San Francisco, CA",
        startDate: "2022-04",
        endDate: "Present",
        current: true,
        bullets: bullets1
      },
      {
        id: "exp_" + (Date.now() + 1),
        title: (jobTitle || role.title).replace(/senior\s*/i, ''),
        company: "Nexus Innovations",
        location: "New York, NY",
        startDate: "2019-06",
        endDate: "2022-03",
        current: false,
        bullets: bullets2
      }
    ],
    education: [
      {
        id: "edu_" + Date.now(),
        degree: "Bachelor of Science in Computer Science / Related Field",
        school: "State University of Technology",
        location: "Austin, TX",
        graduationDate: "2019-05",
        gpa: "3.8 / 4.0",
        honors: "Dean's List with Academic Distinction"
      }
    ],
    skills: [
      { category: "Technical & Core Stack", items: techSkills },
      { category: "Tools & Methodologies", items: ["Git", "Agile / Scrum", "Jira", "CI/CD", "RESTful Architecture", "Cloud Infrastructure"] },
      { category: "Professional & Soft Skills", items: softSkills }
    ],
    projects: [
      {
        id: "proj_" + Date.now(),
        name: `${finalTitle.split(' ')[0]} Cloud Orchestrator`,
        role: "Lead Creator",
        link: "https://github.com/yourhandle/project-demo",
        bullets: [
          `Engineered high-performance web dashboard integrating ${techSkills[0] || 'React'} and backend APIs, supporting real-time telemetry updates.`,
          `Implemented automated unit and end-to-end testing with Jest and Cypress, ensuring 95% continuous reliability.`
        ]
      }
    ],
    certifications: [
      {
        id: "cert_" + Date.now(),
        name: "Industry Recognized Professional Certification",
        issuer: "Accredited Body / Cloud Provider",
        date: "2023-08"
      }
    ]
  };
}

// Enhance a single bullet point into 3 STAR variations
function enhanceBulletPointLocal(bulletText, roleContext = '') {
  const text = (bulletText || '').trim();
  const cleaned = text.replace(/^[•\-\*]\s*/, '').trim();

  // Pick suitable power verbs
  const verbs = ["Spearheaded", "Architected", "Engineered", "Orchestrated", "Optimized", "Automated", "Delivered"];
  const randomVerb1 = verbs[Math.floor(Math.random() * verbs.length)];
  const randomVerb2 = verbs[Math.floor(Math.random() * verbs.length)];
  const randomVerb3 = verbs[Math.floor(Math.random() * verbs.length)];

  // Clean away weak lead phrases
  let core = cleaned
    .replace(/^(responsible for|helped to|worked on|assisted with|handled|did|participated in|contributed to|was in charge of)\s*/i, '')
    .trim();

  if (core.length === 0) {
    core = "critical system improvements and feature delivery across cross-functional sprints";
  }

  // Capitalize first letter of core
  core = core.charAt(0).toLowerCase() + core.slice(1);

  return [
    {
      type: "Metric-Driven (High Impact)",
      text: `${randomVerb1} ${core}, boosting overall performance by 34% and cutting processing turnaround time by 45%.`
    },
    {
      type: "Technical & Architectural Depth",
      text: `${randomVerb2} end-to-end implementation for ${core}, enforcing modular best practices and achieving 95% automated test coverage.`
    },
    {
      type: "Leadership & Collaboration (STAR)",
      text: `${randomVerb3} cross-functional execution of ${core}, delivering milestones 2 weeks ahead of schedule and aligning 5+ stakeholders.`
    }
  ];
}

// Generate 3 variations of Professional Summary
function generateSummaryLocal({ jobTitle, years = '5', tone = 'professional', keySkills = '' }) {
  const role = getRoleMatch(jobTitle);
  const skillsList = keySkills || role.skills.technical.slice(0, 4).join(', ');
  const title = jobTitle || role.title;

  const summaries = {
    professional: [
      `Results-oriented ${title} with ${years}+ years of experience delivering high-impact solutions in fast-paced environments. Proven track record in ${skillsList}, specializing in system optimization, cross-functional collaboration, and driving quantifiable business value.`,
      `Accomplished ${title} bringing ${years}+ years of hands-on expertise across ${skillsList}. Recognized for engineering scalable architectures, fostering agile team excellence, and cutting operational bottlenecks.`
    ],
    executive: [
      `Strategic and vision-oriented ${title} with ${years}+ years steering enterprise initiatives from conception to multi-million-dollar scale. Adept at leveraging ${skillsList} to align technical roadmaps with strategic organizational objectives.`,
      `Dynamic ${title} with proven leadership managing cross-functional teams and complex technical portfolios. Consistently delivers 30%+ improvements in operational efficiency and stakeholder satisfaction.`
    ],
    creative: [
      `Innovative and forward-thinking ${title} passionate about building intuitive, cutting-edge products using ${skillsList}. Blends technical precision with creative problem-solving to design experiences users love.`,
      `User-focused ${title} dedicated to transforming complex challenges into elegant, resilient solutions with modern tooling and design principles.`
    ],
    entry: [
      `Ambitious and fast-learning ${title} equipped with strong foundational knowledge in ${skillsList}. Eager to contribute hands-on problem-solving, rapid adaptability, and disciplined development practices to high-velocity teams.`,
      `Motivated professional seeking to leverage rigorous academic and project training in ${skillsList} to accelerate team goals and deliver high-quality technical contributions.`
    ]
  };

  return summaries[tone] || summaries.professional;
}

// ATS Keyword Analyzer & Job Description Matcher
function analyzeAtsJobMatch(resumeData, jobDescriptionText) {
  if (!jobDescriptionText || jobDescriptionText.trim().length === 0) {
    return {
      matchScore: 0,
      matchedKeywords: [],
      missingKeywords: [],
      recommendations: ["Paste a target Job Description to get real-time keyword matching and ATS scoring!"]
    };
  }

  // Tokenize JD
  const words = jobDescriptionText
    .toLowerCase()
    .replace(/[^a-z0-9+#.\s-]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 2 && !STOPWORDS.has(w));

  // Word frequency map
  const freqMap = {};
  words.forEach(w => {
    freqMap[w] = (freqMap[w] || 0) + 1;
  });

  // Extract top keywords from JD
  const sortedKeywords = Object.entries(freqMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 35)
    .map(([word, count]) => ({ word, count }));

  // Collect all resume text
  const resumeTokens = new Set();
  const addTextToTokens = (str) => {
    if (!str) return;
    str.toLowerCase()
      .replace(/[^a-z0-9+#.\s-]/g, ' ')
      .split(/\s+/)
      .forEach(w => {
        if (w.length > 2) resumeTokens.add(w);
      });
  };

  addTextToTokens(resumeData.personal?.fullName);
  addTextToTokens(resumeData.personal?.jobTitle);
  addTextToTokens(resumeData.summary);

  (resumeData.experience || []).forEach(exp => {
    addTextToTokens(exp.title);
    addTextToTokens(exp.company);
    (exp.bullets || []).forEach(b => addTextToTokens(b));
  });

  (resumeData.skills || []).forEach(grp => {
    addTextToTokens(grp.category);
    (grp.items || []).forEach(item => addTextToTokens(item));
  });

  (resumeData.projects || []).forEach(p => {
    addTextToTokens(p.name);
    addTextToTokens(p.role);
    (p.bullets || []).forEach(b => addTextToTokens(b));
  });

  (resumeData.education || []).forEach(edu => {
    addTextToTokens(edu.degree);
    addTextToTokens(edu.school);
  });

  const matchedKeywords = [];
  const missingKeywords = [];

  sortedKeywords.forEach(kw => {
    if (resumeTokens.has(kw.word)) {
      matchedKeywords.push(kw);
    } else {
      missingKeywords.push(kw);
    }
  });

  const matchRatio = sortedKeywords.length > 0 ? (matchedKeywords.length / sortedKeywords.length) : 0;
  const matchScore = Math.min(100, Math.round(matchRatio * 100));

  // Actionable recommendations
  const recommendations = [];
  if (missingKeywords.length > 0) {
    const topMissing = missingKeywords.slice(0, 5).map(k => `"${k.word}"`).join(', ');
    recommendations.push(`Incorporate these high-frequency keywords found in the job description: ${topMissing}.`);
  }
  if (!resumeData.summary || resumeData.summary.length < 50) {
    recommendations.push("Expand your Professional Summary to include the target role title and 3-4 primary technical skills.");
  }
  
  // Check for numbers and quantifiable metrics
  let hasMetrics = false;
  const metricRegex = /\d+[%$kKmM+]|\d+\s*(percent|users|clients|hours|days|x|fold)/i;
  (resumeData.experience || []).forEach(exp => {
    (exp.bullets || []).forEach(b => {
      if (metricRegex.test(b)) hasMetrics = true;
    });
  });

  if (!hasMetrics) {
    recommendations.push("Add quantifiable metrics (e.g. 'reduced latency by 35%', 'scaled to 50k users') to your experience bullets to increase ATS recruiter scoring.");
  }

  return {
    matchScore,
    matchedKeywords: matchedKeywords.map(k => k.word),
    missingKeywords: missingKeywords.map(k => k.word),
    recommendations
  };
}

// Comprehensive Resume Critique & Overall Score (0-100)
function calculateResumeScore(resumeData) {
  let score = 0;
  const breakdown = [];

  // 1. Contact info check (15 pts)
  const p = resumeData.personal || {};
  let contactPoints = 0;
  if (p.fullName && p.fullName.trim().length > 2) contactPoints += 4;
  if (p.email && p.email.includes('@')) contactPoints += 4;
  if (p.phone && p.phone.trim().length >= 7) contactPoints += 3;
  if (p.location && p.location.trim().length > 2) contactPoints += 2;
  if (p.linkedin || p.website || p.github) contactPoints += 2;
  score += contactPoints;
  breakdown.push({ criteria: "Contact Details & Links", points: contactPoints, max: 15 });

  // 2. Summary quality check (15 pts)
  let summaryPoints = 0;
  if (resumeData.summary && resumeData.summary.trim().length > 80) {
    summaryPoints = 15;
  } else if (resumeData.summary && resumeData.summary.trim().length > 30) {
    summaryPoints = 10;
  }
  score += summaryPoints;
  breakdown.push({ criteria: "Professional Summary", points: summaryPoints, max: 15 });

  // 3. Work Experience & Quantified Metrics (25 pts)
  let expPoints = 0;
  const exps = resumeData.experience || [];
  if (exps.length >= 2) expPoints += 10;
  else if (exps.length === 1) expPoints += 6;

  let totalBullets = 0;
  let metricBullets = 0;
  let strongVerbBullets = 0;

  const metricRegex = /\d+[%$kKmM+]|\d+\s*(percent|users|clients|hours|days|x|fold)/i;

  exps.forEach(exp => {
    (exp.bullets || []).forEach(b => {
      totalBullets++;
      if (metricRegex.test(b)) metricBullets++;
      const firstWord = (b || '').trim().split(/\s+/)[0].replace(/[^a-zA-Z]/g, '');
      if (ACTION_VERBS.some(v => v.toLowerCase() === firstWord.toLowerCase())) {
        strongVerbBullets++;
      }
    });
  });

  if (totalBullets >= 4) expPoints += 5;
  if (metricBullets >= 2) expPoints += 5;
  else if (metricBullets === 1) expPoints += 2;
  if (strongVerbBullets >= 2) expPoints += 5;
  else if (strongVerbBullets === 1) expPoints += 2;

  score += expPoints;
  breakdown.push({ criteria: "Work Experience & Quantified Metrics", points: expPoints, max: 25 });

  // 4. Skills Depth & Organization (20 pts)
  let skillPoints = 0;
  const skillGroups = resumeData.skills || [];
  let totalSkills = 0;
  skillGroups.forEach(g => {
    totalSkills += (g.items || []).length;
  });

  if (skillGroups.length >= 2) skillPoints += 5;
  if (totalSkills >= 10) skillPoints += 15;
  else if (totalSkills >= 5) skillPoints += 10;
  else if (totalSkills >= 2) skillPoints += 5;

  score += skillPoints;
  breakdown.push({ criteria: "Categorized Skills & Core Competencies", points: skillPoints, max: 20 });

  // 5. Education Credentials (15 pts)
  let eduPoints = 0;
  const edus = resumeData.education || [];
  if (edus.length > 0 && edus[0].degree && edus[0].school) {
    eduPoints = 15;
  } else if (edus.length > 0) {
    eduPoints = 8;
  }
  score += eduPoints;
  breakdown.push({ criteria: "Education & Degree Verification", points: eduPoints, max: 15 });

  // 6. Projects & Certifications (10 pts)
  let addPoints = 0;
  if ((resumeData.projects || []).length > 0) addPoints += 5;
  if ((resumeData.certifications || []).length > 0) addPoints += 5;
  score += addPoints;
  breakdown.push({ criteria: "Projects & Certifications", points: addPoints, max: 10 });

  return {
    totalScore: Math.min(100, score),
    breakdown,
    status: score >= 85 ? "Excellent (ATS Optimized)" : score >= 70 ? "Good (Minor Polishing Needed)" : "Needs Improvement"
  };
}

// Request parser utility
function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
      if (body.length > 5 * 1024 * 1024) { // 5MB limit
        reject(new Error('Payload too large'));
      }
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (e) {
        reject(e);
      }
    });
    req.on('error', reject);
  });
}

function sendJSON(res, statusCode, data) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-gemini-key',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
  });
  res.end(JSON.stringify(data));
}

// Main HTTP Server
const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  // Handle CORS Preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-gemini-key',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
    });
    return res.end();
  }

  // -------------------------------------------------------------
  // API ROUTING
  // -------------------------------------------------------------

  // Health check
  if (pathname === '/api/health') {
    return sendJSON(res, 200, { status: 'healthy', timestamp: new Date().toISOString() });
  }

  // Samples endpoint
  if (pathname === '/api/samples' && req.method === 'GET') {
    return sendJSON(res, 200, SAMPLE_RESUMES);
  }

  // AI Resume Generator from scratch
  if (pathname === '/api/ai/generate' && req.method === 'POST') {
    try {
      const body = await parseBody(req);
      const userKey = req.headers['x-gemini-key'] || process.env.GEMINI_API_KEY;

      if (userKey && body.useGemini !== false) {
        // Try Gemini with fallback to local
        try {
          const prompt = `You are an expert executive resume writer and ATS optimization specialist.
Generate a complete, highly professional, ATS-friendly resume JSON for:
Target Job Title: "${body.jobTitle || 'Full Stack Engineer'}"
Experience Level: "${body.experienceLevel || 'mid'}"
Key Skills: "${body.skillsInput || ''}"
Industry: "${body.targetIndustry || 'Technology'}"

Return ONLY valid JSON matching this schema exactly, with NO markdown backticks or extra text:
{
  "personal": {
    "fullName": "Full Name",
    "jobTitle": "${body.jobTitle || 'Software Engineer'}",
    "email": "email@example.com",
    "phone": "+1 (555) 000-0000",
    "location": "City, State",
    "website": "https://example.com",
    "linkedin": "linkedin.com/in/example",
    "github": "github.com/example"
  },
  "summary": "2-3 sentences summarizing achievements, skills, and value.",
  "experience": [
    {
      "id": "exp_1",
      "title": "Title",
      "company": "Company",
      "location": "Location",
      "startDate": "YYYY-MM",
      "endDate": "Present",
      "current": true,
      "bullets": [
        "Action verb + task + quantified result metric",
        "Action verb + task + quantified result metric"
      ]
    }
  ],
  "education": [
    {
      "id": "edu_1",
      "degree": "Degree",
      "school": "University",
      "location": "Location",
      "graduationDate": "YYYY-MM",
      "gpa": "3.8 / 4.0",
      "honors": ""
    }
  ],
  "skills": [
    { "category": "Technical Skills", "items": ["Skill1", "Skill2"] },
    { "category": "Tools & Frameworks", "items": ["Tool1", "Tool2"] },
    { "category": "Soft Skills", "items": ["SkillA", "SkillB"] }
  ],
  "projects": [
    {
      "id": "proj_1",
      "name": "Project Name",
      "role": "Role",
      "link": "https://...",
      "bullets": ["Accomplishment bullet with metrics"]
    }
  ],
  "certifications": [
    {
      "id": "cert_1",
      "name": "Cert Name",
      "issuer": "Issuer",
      "date": "YYYY-MM"
    }
  ]
}`;
          const geminiRaw = await callGeminiAPI(prompt, userKey);
          const cleanJson = geminiRaw.replace(/```json\s*/i, '').replace(/```\s*$/i, '').trim();
          const parsed = JSON.parse(cleanJson);
          return sendJSON(res, 200, { success: true, source: 'gemini', resume: parsed });
        } catch (geminiError) {
          console.warn('Gemini generation failed, falling back to local engine:', geminiError.message);
        }
      }

      // Local engine fallback
      const localResume = generateLocalResume(body);
      return sendJSON(res, 200, { success: true, source: 'local_ai', resume: localResume });
    } catch (err) {
      return sendJSON(res, 500, { success: false, error: err.message });
    }
  }

  // AI Bullet Enhancer
  if (pathname === '/api/ai/enhance-bullet' && req.method === 'POST') {
    try {
      const body = await parseBody(req);
      const userKey = req.headers['x-gemini-key'] || process.env.GEMINI_API_KEY;

      if (userKey && body.useGemini !== false) {
        try {
          const prompt = `You are a professional resume writer specializing in the STAR method and ATS optimization.
Transform this plain bullet point into 3 strong, quantified, action-verb-driven resume accomplishment bullets:
Original Bullet: "${body.bullet || ''}"
Role/Context: "${body.context || ''}"

Return ONLY valid JSON array with 3 objects, no markdown:
[
  { "type": "Metric-Driven (High Impact)", "text": "Enhanced bullet..." },
  { "type": "Technical Depth", "text": "Enhanced bullet..." },
  { "type": "Leadership & Collaboration (STAR)", "text": "Enhanced bullet..." }
]`;
          const raw = await callGeminiAPI(prompt, userKey);
          const cleanJson = raw.replace(/```json\s*/i, '').replace(/```\s*$/i, '').trim();
          const parsed = JSON.parse(cleanJson);
          return sendJSON(res, 200, { success: true, source: 'gemini', variations: parsed });
        } catch (geminiError) {
          console.warn('Gemini bullet enhancer failed, falling back to local:', geminiError.message);
        }
      }

      const variations = enhanceBulletPointLocal(body.bullet, body.context);
      return sendJSON(res, 200, { success: true, source: 'local_ai', variations });
    } catch (err) {
      return sendJSON(res, 500, { success: false, error: err.message });
    }
  }

  // AI Summary Generator
  if (pathname === '/api/ai/summary' && req.method === 'POST') {
    try {
      const body = await parseBody(req);
      const userKey = req.headers['x-gemini-key'] || process.env.GEMINI_API_KEY;

      if (userKey && body.useGemini !== false) {
        try {
          const prompt = `Write 2 compelling professional resume summaries (2-3 sentences each) for:
Job Title: "${body.jobTitle || 'Software Engineer'}"
Years Experience: "${body.years || '5'}"
Tone: "${body.tone || 'professional'}"
Key Skills: "${body.keySkills || ''}"

Return ONLY a JSON array of 2 strings:
["Summary 1...", "Summary 2..."]`;
          const raw = await callGeminiAPI(prompt, userKey);
          const cleanJson = raw.replace(/```json\s*/i, '').replace(/```\s*$/i, '').trim();
          const parsed = JSON.parse(cleanJson);
          return sendJSON(res, 200, { success: true, source: 'gemini', summaries: parsed });
        } catch (geminiError) {
          console.warn('Gemini summary generator failed, falling back to local:', geminiError.message);
        }
      }

      const summaries = generateSummaryLocal(body);
      return sendJSON(res, 200, { success: true, source: 'local_ai', summaries });
    } catch (err) {
      return sendJSON(res, 500, { success: false, error: err.message });
    }
  }

  // AI Skills Suggester
  if (pathname === '/api/ai/skills' && req.method === 'POST') {
    try {
      const body = await parseBody(req);
      const role = getRoleMatch(body.jobTitle);
      return sendJSON(res, 200, {
        success: true,
        technical: role.skills.technical,
        soft: role.skills.soft
      });
    } catch (err) {
      return sendJSON(res, 500, { success: false, error: err.message });
    }
  }

  // ATS Matcher and Job Description Analysis
  if (pathname === '/api/ai/ats-check' && req.method === 'POST') {
    try {
      const body = await parseBody(req);
      const analysis = analyzeAtsJobMatch(body.resume || {}, body.jobDescription || '');
      return sendJSON(res, 200, { success: true, analysis });
    } catch (err) {
      return sendJSON(res, 500, { success: false, error: err.message });
    }
  }

  // Overall Resume Critique and Score
  if (pathname === '/api/ai/score' && req.method === 'POST') {
    try {
      const body = await parseBody(req);
      const scoreData = calculateResumeScore(body.resume || {});
      return sendJSON(res, 200, { success: true, scoreData });
    } catch (err) {
      return sendJSON(res, 500, { success: false, error: err.message });
    }
  }

  // Local Resume Save / Load
  if (pathname === '/api/resumes/save' && req.method === 'POST') {
    try {
      const body = await parseBody(req);
      const id = body.id || 'resume_' + Date.now();
      const filePath = path.join(RESUMES_DIR, `${id}.json`);
      fs.writeFileSync(filePath, JSON.stringify(body.resume, null, 2), 'utf8');
      return sendJSON(res, 200, { success: true, id, message: 'Resume saved successfully' });
    } catch (err) {
      return sendJSON(res, 500, { success: false, error: err.message });
    }
  }

  if (pathname === '/api/resumes/list' && req.method === 'GET') {
    try {
      const files = fs.readdirSync(RESUMES_DIR).filter(f => f.endsWith('.json'));
      const list = files.map(f => {
        const id = f.replace('.json', '');
        try {
          const data = JSON.parse(fs.readFileSync(path.join(RESUMES_DIR, f), 'utf8'));
          return {
            id,
            title: data.personal?.jobTitle || 'Untitled Resume',
            fullName: data.personal?.fullName || 'Anonymous',
            updatedAt: fs.statSync(path.join(RESUMES_DIR, f)).mtime
          };
        } catch (e) {
          return { id, title: id, updatedAt: new Date() };
        }
      });
      return sendJSON(res, 200, { success: true, resumes: list });
    } catch (err) {
      return sendJSON(res, 500, { success: false, error: err.message });
    }
  }

  if (pathname.startsWith('/api/resumes/') && req.method === 'GET') {
    const id = pathname.replace('/api/resumes/', '');
    const safeId = path.basename(id).replace(/[^a-zA-Z0-9_-]/g, '');
    const filePath = path.join(RESUMES_DIR, `${safeId}.json`);
    if (fs.existsSync(filePath)) {
      const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      return sendJSON(res, 200, { success: true, resume: data });
    } else {
      return sendJSON(res, 404, { success: false, error: 'Resume not found' });
    }
  }

  // -------------------------------------------------------------
  // STATIC FILE SERVING
  // -------------------------------------------------------------
  let safePath = path.normalize(pathname).replace(/^(\.\.[\/\\])+/, '');
  if (safePath === '/' || safePath === '\\') {
    safePath = '/index.html';
  }

  const filePath = path.join(PUBLIC_DIR, safePath);

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      // 404 handler
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      return res.end('404 Not Found');
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, {
      'Content-Type': contentType,
      'Cache-Control': 'no-cache'
    });

    const stream = fs.createReadStream(filePath);
    stream.pipe(res);
  });
});

server.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🚀 ResumAI - AI Resume Maker & ATS Optimizer`);
  console.log(`📡 Server running at http://localhost:${PORT}`);
  console.log(`⚡ AI Mode: ${process.env.GEMINI_API_KEY ? 'Gemini API + Local NLP' : 'High-Performance Local AI Engine (No Key Required)'}`);
  console.log(`====================================================`);
});
