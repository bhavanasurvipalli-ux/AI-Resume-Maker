/**
 * ResumAI - Client Application Logic
 * Reactive resume editor, multi-template live renderer, ATS scoring, and AI integration
 */

// Initial default resume data
const DEFAULT_RESUME = {
  personal: {
    fullName: "Alex Rivera",
    jobTitle: "Senior Full Stack Software Engineer",
    email: "alex.rivera.dev@gmail.com",
    phone: "+1 (555) 382-9014",
    location: "San Francisco, CA (Remote Friendly)",
    website: "https://alexrivera.dev",
    linkedin: "linkedin.com/in/alexrivera-dev",
    github: "github.com/alexrivera"
  },
  summary: "High-impact Senior Full Stack Engineer with 6+ years of experience architecting resilient cloud-native platforms and distributed microservices. Proven track record of boosting system performance by 45%, reducing cloud operational costs by $180k annually, and mentoring cross-functional engineering teams in agile execution.",
  experience: [
    {
      id: "exp_1",
      title: "Senior Full Stack Engineer",
      company: "Starlight Cloud Systems",
      location: "San Francisco, CA",
      startDate: "2022-03",
      endDate: "Present",
      current: true,
      bullets: [
        "Architected and deployed event-driven microservices using Node.js, TypeScript, and Kafka, handling 18M+ daily requests with 99.98% uptime.",
        "Spearheaded redesign of customer portal with React and Tailwind CSS, reducing page load latency by 42% and increasing user session duration by 28%.",
        "Engineered automated CI/CD deployment pipelines on AWS ECS and GitHub Actions, cutting release cycles from 2 weeks to continuous daily deployments.",
        "Mentored 6 junior and mid-level software developers, conducting bi-weekly code reviews and driving automated test coverage from 64% to 92%."
      ]
    },
    {
      id: "exp_2",
      title: "Software Engineer",
      company: "Nexis Digital Media",
      location: "San Jose, CA",
      startDate: "2019-06",
      endDate: "2022-02",
      current: false,
      bullets: [
        "Developed core REST and GraphQL APIs using Express.js and PostgreSQL for real-time video analytics platform serving 450k active subscribers.",
        "Optimized slow SQL queries and implemented Redis caching layer, slashing database query execution time by 65%.",
        "Collaborated closely with UX designers to develop reusable UI component library, accelerating frontend feature development speed by 35% across 4 product squads."
      ]
    }
  ],
  education: [
    {
      id: "edu_1",
      degree: "Bachelor of Science in Computer Science",
      school: "University of California, Berkeley",
      location: "Berkeley, CA",
      graduationDate: "2019-05",
      gpa: "3.85 / 4.0",
      honors: "Magna Cum Laude, Dean's Honor List"
    }
  ],
  skills: [
    { category: "Languages & Frameworks", items: ["TypeScript", "JavaScript", "Python", "React", "Next.js", "Node.js", "Express", "GraphQL"] },
    { category: "Cloud & Infrastructure", items: ["AWS (ECS, S3, RDS)", "Docker", "Kubernetes", "PostgreSQL", "Redis", "Kafka", "CI/CD"] },
    { category: "Core Competencies", items: ["System Architecture", "Microservices", "RESTful APIs", "Agile / Scrum", "Unit Testing (Jest)"] }
  ],
  projects: [
    {
      id: "proj_1",
      name: "DevPulse - Real-time Developer Analytics Platform",
      role: "Creator & Lead Architect",
      link: "https://github.com/alexrivera/devpulse",
      bullets: [
        "Built full-stack open-source developer dashboard tracking pull request metrics and commit velocity for GitHub organizations.",
        "Integrated GitHub Webhooks with Redis queues and Next.js frontend, attracting 3,500+ GitHub stars and 800+ active monthly users."
      ]
    }
  ],
  certifications: [
    {
      id: "cert_1",
      name: "AWS Certified Solutions Architect – Associate",
      issuer: "Amazon Web Services",
      date: "2023-04"
    }
  ]
};

// Application State
const state = {
  resume: null,
  template: 'modern',
  color: '#4f46e5',
  font: "'Inter', sans-serif",
  density: 'normal',
  zoom: 1.0,
  activeBulletTarget: null, // { expId, projId, index }
  geminiApiKey: localStorage.getItem('resumai_gemini_key') || ''
};

// ========================================================
// Initialization
// ========================================================
let allSamples = {};
let currentSampleCategory = 'all';

document.addEventListener('DOMContentLoaded', () => {
  loadSavedState();
  initEventListeners();
  renderAll();
  calculateAtsScore();
  fetchAndInitializeSamples();
});

function loadSavedState() {
  const savedResume = localStorage.getItem('resumai_resume_data');
  if (savedResume) {
    try {
      state.resume = JSON.parse(savedResume);
    } catch (e) {
      state.resume = JSON.parse(JSON.stringify(DEFAULT_RESUME));
    }
  } else {
    state.resume = JSON.parse(JSON.stringify(DEFAULT_RESUME));
  }

  state.template = localStorage.getItem('resumai_template') || 'modern';
  state.color = localStorage.getItem('resumai_color') || '#4f46e5';
  state.font = localStorage.getItem('resumai_font') || "'Inter', sans-serif";
  state.density = localStorage.getItem('resumai_density') || 'compact';

  // Apply root variables
  document.documentElement.style.setProperty('--accent-color', state.color);
  document.documentElement.style.setProperty('--resume-font', state.font);

  // Sync controls in UI
  const templateSelect = document.getElementById('templateSelect');
  if (templateSelect) templateSelect.value = state.template;

  const fontSelect = document.getElementById('fontSelect');
  if (fontSelect) fontSelect.value = state.font;

  const colorDots = document.querySelectorAll('.color-dot');
  colorDots.forEach(dot => {
    if (dot.getAttribute('data-color') === state.color) {
      dot.classList.add('active');
    } else {
      dot.classList.remove('active');
    }
  });

  const densityBtns = document.querySelectorAll('.density-btn');
  densityBtns.forEach(btn => {
    if (btn.getAttribute('data-density') === state.density) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  if (state.geminiApiKey) {
    const keyInput = document.getElementById('inpGeminiApiKey');
    if (keyInput) keyInput.value = state.geminiApiKey;
    const statusText = document.getElementById('aiEngineStatusText');
    if (statusText) statusText.innerText = "Gemini API Key Connected & Local AI Fallback Enabled";
  }
}

function saveState() {
  localStorage.setItem('resumai_resume_data', JSON.stringify(state.resume));
  localStorage.setItem('resumai_template', state.template);
  localStorage.setItem('resumai_color', state.color);
  localStorage.setItem('resumai_font', state.font);
  localStorage.setItem('resumai_density', state.density);
}

// ========================================================
// Event Listeners
// ========================================================
function initEventListeners() {
  // Navigation Tabs
  const tabBtns = document.querySelectorAll('.tab-btn');
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      const target = document.getElementById(btn.getAttribute('data-tab'));
      if (target) target.classList.add('active');
    });
  });

  // Template select
  document.getElementById('templateSelect')?.addEventListener('change', (e) => {
    state.template = e.target.value;
    saveState();
    renderLivePreview();
  });

  // Font select
  document.getElementById('fontSelect')?.addEventListener('change', (e) => {
    state.font = e.target.value;
    document.documentElement.style.setProperty('--resume-font', state.font);
    saveState();
    renderLivePreview();
  });

  // Color picker
  document.querySelectorAll('.color-dot').forEach(dot => {
    dot.addEventListener('click', (e) => {
      document.querySelectorAll('.color-dot').forEach(d => d.classList.remove('active'));
      dot.classList.add('active');
      state.color = dot.getAttribute('data-color');
      document.documentElement.style.setProperty('--accent-color', state.color);
      saveState();
      renderLivePreview();
    });
  });

  // Density toggle
  document.querySelectorAll('.density-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.density-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.density = btn.getAttribute('data-density');
      saveState();
      renderLivePreview();
    });
  });

  // Theme toggle
  document.getElementById('themeToggleBtn')?.addEventListener('click', () => {
    const html = document.documentElement;
    const current = html.getAttribute('data-theme') || 'dark';
    const next = current === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    const icon = document.querySelector('#themeToggleBtn i');
    if (icon) {
      icon.className = next === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
    }
  });

  // Zoom controls
  document.getElementById('btnZoomIn')?.addEventListener('click', () => {
    if (state.zoom < 1.6) {
      state.zoom += 0.1;
      applyZoom();
    }
  });
  document.getElementById('btnZoomOut')?.addEventListener('click', () => {
    if (state.zoom > 0.5) {
      state.zoom -= 0.1;
      applyZoom();
    }
  });
  document.getElementById('btnZoomFit')?.addEventListener('click', () => {
    state.zoom = 0.9;
    applyZoom();
  });

  // Personal Info Form 2-way binding
  const personalFields = ['fullName', 'jobTitle', 'email', 'phone', 'location', 'website', 'linkedin', 'github'];
  personalFields.forEach(field => {
    const id = 'inp' + field.charAt(0).toUpperCase() + field.slice(1);
    const inp = document.getElementById(id);
    if (inp) {
      inp.addEventListener('input', (e) => {
        state.resume.personal[field] = e.target.value;
        saveState();
        renderLivePreview();
        calculateAtsScore();
      });
    }
  });

  // Summary Form binding
  document.getElementById('inpSummary')?.addEventListener('input', (e) => {
    state.resume.summary = e.target.value;
    saveState();
    renderLivePreview();
    calculateAtsScore();
  });

  // Add Item Buttons
  document.getElementById('btnAddExperience')?.addEventListener('click', () => addExperienceItem());
  document.getElementById('btnAddEducation')?.addEventListener('click', () => addEducationItem());
  document.getElementById('btnAddSkillCategory')?.addEventListener('click', () => addSkillCategory());
  document.getElementById('btnAddProject')?.addEventListener('click', () => addProjectItem());
  document.getElementById('btnAddCertification')?.addEventListener('click', () => addCertificationItem());

  // Sample Picker & Search Modal Triggers
  document.getElementById('btnOpenSampleModal')?.addEventListener('click', openSampleSearchModal);

  document.getElementById('sampleSelect')?.addEventListener('change', (e) => {
    const key = e.target.value;
    if (key && allSamples[key]) {
      loadSampleResume(key);
    }
  });

  // Sample Search Input live filtering
  const sampleSearchInp = document.getElementById('sampleSearchInput');
  const clearSearchBtn = document.getElementById('clearSampleSearch');

  sampleSearchInp?.addEventListener('input', (e) => {
    const val = e.target.value.trim();
    if (clearSearchBtn) clearSearchBtn.style.display = val ? 'block' : 'none';
    filterAndRenderSamples();
  });

  clearSearchBtn?.addEventListener('click', () => {
    if (sampleSearchInp) sampleSearchInp.value = '';
    if (clearSearchBtn) clearSearchBtn.style.display = 'none';
    filterAndRenderSamples();
    sampleSearchInp?.focus();
  });

  // Sample Category Filter Pills
  document.querySelectorAll('#sampleCategoryFilters .cat-filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#sampleCategoryFilters .cat-filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentSampleCategory = btn.getAttribute('data-cat') || 'all';
      filterAndRenderSamples();
    });
  });

  // Modal Openers & Closers
  document.getElementById('btnAiQuickCreate')?.addEventListener('click', () => openModal('modalAiGenerate'));
  document.getElementById('btnOpenAiSummaryModal')?.addEventListener('click', () => openSummaryModal());
  document.getElementById('btnAiSuggestSkills')?.addEventListener('click', () => suggestSkills());

  document.querySelectorAll('.modal-close-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const modal = e.target.closest('.modal-backdrop');
      if (modal) modal.classList.remove('show');
    });
  });

  // AI Generate Full Resume Submit
  document.getElementById('btnSubmitAiGenerate')?.addEventListener('click', handleAiFullResumeGenerate);

  // ATS Job Match Run
  document.getElementById('btnRunAtsMatch')?.addEventListener('click', runAtsMatcher);

  // Export Dropdown
  const exportBtn = document.getElementById('btnExportMenu');
  const exportMenu = document.getElementById('exportDropdown');
  if (exportBtn && exportMenu) {
    exportBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      exportMenu.classList.toggle('show');
    });
    document.addEventListener('click', () => exportMenu.classList.remove('show'));
  }

  // Export Center & Dropdown Actions
  document.getElementById('btnExportPdf')?.addEventListener('click', openPdfModal);
  document.getElementById('btnToolbarPdf')?.addEventListener('click', openPdfModal);
  document.getElementById('btnExecutePdfDownload')?.addEventListener('click', executePdfDownload);
  document.getElementById('btnOpenExportHub')?.addEventListener('click', openExportHub);
  document.getElementById('menuExportPdf')?.addEventListener('click', (e) => { e.preventDefault(); openPdfModal(); });
  document.getElementById('menuExportWord')?.addEventListener('click', (e) => { e.preventDefault(); exportToWord(); });
  document.getElementById('menuExportPng')?.addEventListener('click', (e) => { e.preventDefault(); exportToPNG(); });
  document.getElementById('menuExportHtml')?.addEventListener('click', (e) => { e.preventDefault(); exportToHTML(); });
  document.getElementById('menuExportTxt')?.addEventListener('click', (e) => { e.preventDefault(); exportToTextFile(); });
  document.getElementById('btnPrintNative')?.addEventListener('click', () => window.print());
  document.getElementById('btnExportJson')?.addEventListener('click', exportJSON);
  document.getElementById('btnExportTxt')?.addEventListener('click', copyPlainText);

  // Export Hub Cards
  document.getElementById('cardExportPdf')?.querySelector('button')?.addEventListener('click', openPdfModal);
  document.getElementById('cardExportWord')?.querySelector('button')?.addEventListener('click', exportToWord);
  document.getElementById('cardExportPng')?.querySelector('button')?.addEventListener('click', exportToPNG);
  document.getElementById('cardExportHtml')?.querySelector('button')?.addEventListener('click', exportToHTML);
  document.getElementById('cardExportTxt')?.querySelector('button')?.addEventListener('click', exportToTextFile);
  document.getElementById('cardExportJson')?.querySelector('button')?.addEventListener('click', exportJSON);

  // Import JSON
  const fileInp = document.getElementById('jsonFileInput');
  document.getElementById('btnImportJson')?.addEventListener('click', () => fileInp?.click());
  fileInp?.addEventListener('change', handleImportJson);

  // Save API Key
  document.getElementById('btnSaveApiKey')?.addEventListener('click', () => {
    const key = document.getElementById('inpGeminiApiKey')?.value.trim();
    state.geminiApiKey = key;
    localStorage.setItem('resumai_gemini_key', key);
    const statusText = document.getElementById('aiEngineStatusText');
    if (key) {
      if (statusText) statusText.innerText = "Gemini API Key Saved & Active";
      showToast('Gemini API Key saved!', 'success');
    } else {
      if (statusText) statusText.innerText = "Built-in Local AI Engine Active (Zero Configuration Needed)";
      showToast('Reverted to Built-in Local AI Engine', 'info');
    }
  });
}

function applyZoom() {
  const wrapper = document.getElementById('paperWrapper');
  const display = document.getElementById('zoomLevelDisplay');
  if (wrapper) {
    wrapper.style.transform = `scale(${state.zoom})`;
  }
  if (display) {
    display.innerText = `${Math.round(state.zoom * 100)}%`;
  }
}

// ========================================================
// Master Render Functions
// ========================================================
function renderAll() {
  populatePersonalForm();
  populateSummaryForm();
  renderExperienceEditor();
  renderEducationEditor();
  renderSkillsEditor();
  renderProjectsEditor();
  renderCertificationsEditor();
  renderLivePreview();
}

function populatePersonalForm() {
  const p = state.resume.personal || {};
  document.getElementById('inpFullName').value = p.fullName || '';
  document.getElementById('inpJobTitle').value = p.jobTitle || '';
  document.getElementById('inpEmail').value = p.email || '';
  document.getElementById('inpPhone').value = p.phone || '';
  document.getElementById('inpLocation').value = p.location || '';
  document.getElementById('inpWebsite').value = p.website || '';
  document.getElementById('inpLinkedin').value = p.linkedin || '';
  document.getElementById('inpGithub').value = p.github || '';
}

function populateSummaryForm() {
  const s = document.getElementById('inpSummary');
  if (s) s.value = state.resume.summary || '';
}

// ========================================================
// Experience Editor
// ========================================================
function renderExperienceEditor() {
  const container = document.getElementById('experienceContainer');
  if (!container) return;
  container.innerHTML = '';

  const exps = state.resume.experience || [];
  exps.forEach((exp, idx) => {
    const card = document.createElement('div');
    card.className = 'accordion-card';
    card.innerHTML = `
      <div class="accordion-header" onclick="toggleAccordion(this)">
        <div>
          <div class="accordion-title">${exp.title || 'Untitled Role'}</div>
          <div class="accordion-subtitle">${exp.company || 'Company'} • ${exp.startDate || ''} - ${exp.current ? 'Present' : (exp.endDate || '')}</div>
        </div>
        <div class="accordion-actions" onclick="event.stopPropagation()">
          <button class="btn btn-icon-sm text-danger" title="Delete" onclick="deleteExperienceItem('${exp.id}')">
            <i class="fa-solid fa-trash-can"></i>
          </button>
          <i class="fa-solid fa-chevron-down text-muted"></i>
        </div>
      </div>
      <div class="accordion-body">
        <div class="form-grid">
          <div class="form-group">
            <label>Job Title</label>
            <input type="text" class="form-control" value="${exp.title || ''}" oninput="updateExpField('${exp.id}', 'title', this.value)">
          </div>
          <div class="form-group">
            <label>Company Name</label>
            <input type="text" class="form-control" value="${exp.company || ''}" oninput="updateExpField('${exp.id}', 'company', this.value)">
          </div>
          <div class="form-group">
            <label>Location</label>
            <input type="text" class="form-control" value="${exp.location || ''}" oninput="updateExpField('${exp.id}', 'location', this.value)">
          </div>
          <div class="form-group">
            <label>Start Date</label>
            <input type="text" class="form-control" placeholder="YYYY-MM" value="${exp.startDate || ''}" oninput="updateExpField('${exp.id}', 'startDate', this.value)">
          </div>
          <div class="form-group">
            <label>End Date</label>
            <input type="text" class="form-control" placeholder="Present or YYYY-MM" value="${exp.endDate || ''}" ${exp.current ? 'disabled' : ''} oninput="updateExpField('${exp.id}', 'endDate', this.value)">
          </div>
          <div class="form-group" style="display:flex; align-items:center; gap:0.5rem; margin-top:1.2rem;">
            <input type="checkbox" id="curr_${exp.id}" ${exp.current ? 'checked' : ''} onchange="toggleCurrentExp('${exp.id}', this.checked)">
            <label for="curr_${exp.id}" style="margin-bottom:0; cursor:pointer;">Current Job</label>
          </div>
        </div>

        <!-- Bullets Manager -->
        <div class="bullet-list-manager">
          <label style="font-weight:700; font-size:0.75rem; color:var(--text-muted); display:block; margin-bottom:0.4rem;">
            ACCOMPLISHMENT BULLETS (STAR METHOD):
          </label>
          <div id="bullets_${exp.id}">
            ${(exp.bullets || []).map((b, bIdx) => `
              <div class="bullet-item-row">
                <textarea class="form-control" oninput="updateExpBullet('${exp.id}', ${bIdx}, this.value)">${b}</textarea>
                <button class="btn-ai-enhance-bullet" title="Enhance with AI" onclick="openBulletEnhanceModal('${exp.id}', null, ${bIdx})">
                  <i class="fa-solid fa-wand-magic-sparkles"></i> AI Enhance
                </button>
                <button class="btn btn-icon-sm" title="Remove bullet" onclick="deleteExpBullet('${exp.id}', ${bIdx})">
                  <i class="fa-solid fa-times"></i>
                </button>
              </div>
            `).join('')}
          </div>
          <button class="btn btn-secondary btn-sm mt-2" onclick="addExpBullet('${exp.id}')">
            <i class="fa-solid fa-plus"></i> Add Bullet
          </button>
        </div>
      </div>
    `;
    container.appendChild(card);
  });
}

window.toggleAccordion = function (headerEl) {
  const body = headerEl.nextElementSibling;
  const chevron = headerEl.querySelector('.fa-chevron-down');
  if (body.style.display === 'none') {
    body.style.display = 'block';
    if (chevron) chevron.style.transform = 'rotate(0deg)';
  } else {
    body.style.display = 'none';
    if (chevron) chevron.style.transform = 'rotate(-90deg)';
  }
};

window.addExperienceItem = function () {
  const newItem = {
    id: 'exp_' + Date.now(),
    title: 'New Position',
    company: 'Company Name',
    location: 'City, State',
    startDate: '2023-01',
    endDate: 'Present',
    current: true,
    bullets: ['Spearheaded development of scalable solutions, improving workflow speed by 35%.']
  };
  state.resume.experience.unshift(newItem);
  saveState();
  renderExperienceEditor();
  renderLivePreview();
  calculateAtsScore();
};

window.deleteExperienceItem = function (id) {
  state.resume.experience = state.resume.experience.filter(e => e.id !== id);
  saveState();
  renderExperienceEditor();
  renderLivePreview();
  calculateAtsScore();
};

window.updateExpField = function (id, field, value) {
  const item = state.resume.experience.find(e => e.id === id);
  if (item) {
    item[field] = value;
    saveState();
    renderLivePreview();
    calculateAtsScore();
  }
};

window.toggleCurrentExp = function (id, isCurrent) {
  const item = state.resume.experience.find(e => e.id === id);
  if (item) {
    item.current = isCurrent;
    if (isCurrent) item.endDate = 'Present';
    saveState();
    renderExperienceEditor();
    renderLivePreview();
  }
};

window.addExpBullet = function (expId) {
  const item = state.resume.experience.find(e => e.id === expId);
  if (item) {
    item.bullets.push('Architected feature with modern tech stack, delivering 25% quantifiable efficiency gains.');
    saveState();
    renderExperienceEditor();
    renderLivePreview();
    calculateAtsScore();
  }
};

window.updateExpBullet = function (expId, index, value) {
  const item = state.resume.experience.find(e => e.id === expId);
  if (item && item.bullets[index] !== undefined) {
    item.bullets[index] = value;
    saveState();
    renderLivePreview();
    calculateAtsScore();
  }
};

window.deleteExpBullet = function (expId, index) {
  const item = state.resume.experience.find(e => e.id === expId);
  if (item) {
    item.bullets.splice(index, 1);
    saveState();
    renderExperienceEditor();
    renderLivePreview();
    calculateAtsScore();
  }
};

// ========================================================
// Education Editor
// ========================================================
function renderEducationEditor() {
  const container = document.getElementById('educationContainer');
  if (!container) return;
  container.innerHTML = '';

  const edus = state.resume.education || [];
  edus.forEach((edu) => {
    const card = document.createElement('div');
    card.className = 'accordion-card';
    card.innerHTML = `
      <div class="accordion-header" onclick="toggleAccordion(this)">
        <div>
          <div class="accordion-title">${edu.degree || 'Degree'}</div>
          <div class="accordion-subtitle">${edu.school || 'University'} • ${edu.graduationDate || ''}</div>
        </div>
        <div class="accordion-actions" onclick="event.stopPropagation()">
          <button class="btn btn-icon-sm text-danger" title="Delete" onclick="deleteEducationItem('${edu.id}')">
            <i class="fa-solid fa-trash-can"></i>
          </button>
          <i class="fa-solid fa-chevron-down text-muted"></i>
        </div>
      </div>
      <div class="accordion-body">
        <div class="form-grid">
          <div class="form-group col-span-2">
            <label>Degree / Major</label>
            <input type="text" class="form-control" value="${edu.degree || ''}" oninput="updateEduField('${edu.id}', 'degree', this.value)">
          </div>
          <div class="form-group">
            <label>School / University</label>
            <input type="text" class="form-control" value="${edu.school || ''}" oninput="updateEduField('${edu.id}', 'school', this.value)">
          </div>
          <div class="form-group">
            <label>Location</label>
            <input type="text" class="form-control" value="${edu.location || ''}" oninput="updateEduField('${edu.id}', 'location', this.value)">
          </div>
          <div class="form-group">
            <label>Graduation Date</label>
            <input type="text" class="form-control" placeholder="YYYY-MM" value="${edu.graduationDate || ''}" oninput="updateEduField('${edu.id}', 'graduationDate', this.value)">
          </div>
          <div class="form-group">
            <label>GPA / Honors</label>
            <input type="text" class="form-control" placeholder="3.8 / 4.0 or Dean's List" value="${edu.gpa || ''}" oninput="updateEduField('${edu.id}', 'gpa', this.value)">
          </div>
        </div>
      </div>
    `;
    container.appendChild(card);
  });
}

window.addEducationItem = function () {
  const newItem = {
    id: 'edu_' + Date.now(),
    degree: 'Bachelor of Science in Computer Science',
    school: 'State University',
    location: 'City, State',
    graduationDate: '2020-05',
    gpa: '3.8 / 4.0'
  };
  state.resume.education.push(newItem);
  saveState();
  renderEducationEditor();
  renderLivePreview();
  calculateAtsScore();
};

window.deleteEducationItem = function (id) {
  state.resume.education = state.resume.education.filter(e => e.id !== id);
  saveState();
  renderEducationEditor();
  renderLivePreview();
  calculateAtsScore();
};

window.updateEduField = function (id, field, value) {
  const item = state.resume.education.find(e => e.id === id);
  if (item) {
    item[field] = value;
    saveState();
    renderLivePreview();
    calculateAtsScore();
  }
};

// ========================================================
// Skills Editor
// ========================================================
function renderSkillsEditor() {
  const container = document.getElementById('skillsContainer');
  if (!container) return;
  container.innerHTML = '';

  const groups = state.resume.skills || [];
  groups.forEach((grp, grpIdx) => {
    const card = document.createElement('div');
    card.className = 'skill-category-card';
    card.innerHTML = `
      <div class="flex-between">
        <input type="text" class="form-control" style="font-weight:700; max-width:240px;" value="${grp.category}" oninput="updateSkillCategoryName(${grpIdx}, this.value)">
        <button class="btn btn-icon-sm text-danger" title="Delete category" onclick="deleteSkillCategory(${grpIdx})">
          <i class="fa-solid fa-trash-can"></i>
        </button>
      </div>

      <div class="skill-tags-wrapper">
        ${(grp.items || []).map((item, itemIdx) => `
          <span class="skill-tag">
            ${item}
            <i class="fa-solid fa-times remove-skill" onclick="removeSkillItem(${grpIdx}, ${itemIdx})"></i>
          </span>
        `).join('')}
      </div>

      <div class="add-skill-inline">
        <input type="text" class="form-control form-control-sm" id="inp_add_skill_${grpIdx}" placeholder="Type skill & press Enter or Add..." onkeydown="if(event.key==='Enter'){addSkillItem(${grpIdx}); event.preventDefault();}">
        <button class="btn btn-secondary btn-sm" onclick="addSkillItem(${grpIdx})">
          <i class="fa-solid fa-plus"></i> Add
        </button>
      </div>
    `;
    container.appendChild(card);
  });
}

window.addSkillCategory = function () {
  state.resume.skills.push({
    category: 'New Category',
    items: ['Skill A', 'Skill B']
  });
  saveState();
  renderSkillsEditor();
  renderLivePreview();
  calculateAtsScore();
};

window.deleteSkillCategory = function (index) {
  state.resume.skills.splice(index, 1);
  saveState();
  renderSkillsEditor();
  renderLivePreview();
  calculateAtsScore();
};

window.updateSkillCategoryName = function (index, value) {
  if (state.resume.skills[index]) {
    state.resume.skills[index].category = value;
    saveState();
    renderLivePreview();
  }
};

window.addSkillItem = function (grpIndex) {
  const input = document.getElementById(`inp_add_skill_${grpIndex}`);
  if (!input) return;
  const val = input.value.trim();
  if (val && state.resume.skills[grpIndex]) {
    const itemsToAdd = val.split(',').map(s => s.trim()).filter(Boolean);
    state.resume.skills[grpIndex].items.push(...itemsToAdd);
    input.value = '';
    saveState();
    renderSkillsEditor();
    renderLivePreview();
    calculateAtsScore();
  }
};

window.removeSkillItem = function (grpIndex, itemIndex) {
  if (state.resume.skills[grpIndex]) {
    state.resume.skills[grpIndex].items.splice(itemIndex, 1);
    saveState();
    renderSkillsEditor();
    renderLivePreview();
    calculateAtsScore();
  }
};

// ========================================================
// Projects Editor
// ========================================================
function renderProjectsEditor() {
  const container = document.getElementById('projectsContainer');
  if (!container) return;
  container.innerHTML = '';

  const projs = state.resume.projects || [];
  projs.forEach((p) => {
    const card = document.createElement('div');
    card.className = 'accordion-card';
    card.innerHTML = `
      <div class="accordion-header" onclick="toggleAccordion(this)">
        <div>
          <div class="accordion-title">${p.name || 'Untitled Project'}</div>
          <div class="accordion-subtitle">${p.role || 'Role / Creator'} • ${p.link || ''}</div>
        </div>
        <div class="accordion-actions" onclick="event.stopPropagation()">
          <button class="btn btn-icon-sm text-danger" title="Delete" onclick="deleteProjectItem('${p.id}')">
            <i class="fa-solid fa-trash-can"></i>
          </button>
          <i class="fa-solid fa-chevron-down text-muted"></i>
        </div>
      </div>
      <div class="accordion-body">
        <div class="form-grid">
          <div class="form-group col-span-2">
            <label>Project Title</label>
            <input type="text" class="form-control" value="${p.name || ''}" oninput="updateProjectField('${p.id}', 'name', this.value)">
          </div>
          <div class="form-group">
            <label>Your Role</label>
            <input type="text" class="form-control" value="${p.role || ''}" oninput="updateProjectField('${p.id}', 'role', this.value)">
          </div>
          <div class="form-group">
            <label>Live Link / GitHub</label>
            <input type="text" class="form-control" value="${p.link || ''}" oninput="updateProjectField('${p.id}', 'link', this.value)">
          </div>
        </div>

        <div class="bullet-list-manager">
          <label style="font-weight:700; font-size:0.75rem; color:var(--text-muted); display:block; margin-bottom:0.4rem;">
            PROJECT HIGHLIGHTS:
          </label>
          <div id="proj_bullets_${p.id}">
            ${(p.bullets || []).map((b, bIdx) => `
              <div class="bullet-item-row">
                <textarea class="form-control" oninput="updateProjectBullet('${p.id}', ${bIdx}, this.value)">${b}</textarea>
                <button class="btn btn-icon-sm" title="Remove" onclick="deleteProjectBullet('${p.id}', ${bIdx})">
                  <i class="fa-solid fa-times"></i>
                </button>
              </div>
            `).join('')}
          </div>
          <button class="btn btn-secondary btn-sm mt-2" onclick="addProjectBullet('${p.id}')">
            <i class="fa-solid fa-plus"></i> Add Bullet
          </button>
        </div>
      </div>
    `;
    container.appendChild(card);
  });
}

window.addProjectItem = function () {
  const newItem = {
    id: 'proj_' + Date.now(),
    name: 'New Featured Project',
    role: 'Creator & Architect',
    link: 'https://github.com/yourname/project',
    bullets: ['Designed high-throughput architecture and automated deployments with 99.9% uptime.']
  };
  state.resume.projects.push(newItem);
  saveState();
  renderProjectsEditor();
  renderLivePreview();
  calculateAtsScore();
};

window.deleteProjectItem = function (id) {
  state.resume.projects = state.resume.projects.filter(p => p.id !== id);
  saveState();
  renderProjectsEditor();
  renderLivePreview();
  calculateAtsScore();
};

window.updateProjectField = function (id, field, value) {
  const p = state.resume.projects.find(i => i.id === id);
  if (p) {
    p[field] = value;
    saveState();
    renderLivePreview();
  }
};

window.addProjectBullet = function (projId) {
  const p = state.resume.projects.find(i => i.id === projId);
  if (p) {
    p.bullets.push('Engineered feature yielding a 30% reduction in processing latency.');
    saveState();
    renderProjectsEditor();
    renderLivePreview();
  }
};

window.updateProjectBullet = function (projId, index, value) {
  const p = state.resume.projects.find(i => i.id === projId);
  if (p && p.bullets[index] !== undefined) {
    p.bullets[index] = value;
    saveState();
    renderLivePreview();
  }
};

window.deleteProjectBullet = function (projId, index) {
  const p = state.resume.projects.find(i => i.id === projId);
  if (p) {
    p.bullets.splice(index, 1);
    saveState();
    renderProjectsEditor();
    renderLivePreview();
  }
};

// ========================================================
// Certifications Editor
// ========================================================
function renderCertificationsEditor() {
  const container = document.getElementById('certificationsContainer');
  if (!container) return;
  container.innerHTML = '';

  const certs = state.resume.certifications || [];
  certs.forEach((c) => {
    const card = document.createElement('div');
    card.className = 'accordion-card';
    card.innerHTML = `
      <div class="accordion-header" onclick="toggleAccordion(this)">
        <div>
          <div class="accordion-title">${c.name || 'Certification'}</div>
          <div class="accordion-subtitle">${c.issuer || 'Issuer'} • ${c.date || ''}</div>
        </div>
        <div class="accordion-actions" onclick="event.stopPropagation()">
          <button class="btn btn-icon-sm text-danger" title="Delete" onclick="deleteCertItem('${c.id}')">
            <i class="fa-solid fa-trash-can"></i>
          </button>
          <i class="fa-solid fa-chevron-down text-muted"></i>
        </div>
      </div>
      <div class="accordion-body">
        <div class="form-grid">
          <div class="form-group col-span-2">
            <label>Certificate Name</label>
            <input type="text" class="form-control" value="${c.name || ''}" oninput="updateCertField('${c.id}', 'name', this.value)">
          </div>
          <div class="form-group">
            <label>Issuing Organization</label>
            <input type="text" class="form-control" value="${c.issuer || ''}" oninput="updateCertField('${c.id}', 'issuer', this.value)">
          </div>
          <div class="form-group">
            <label>Issue Date</label>
            <input type="text" class="form-control" placeholder="YYYY-MM" value="${c.date || ''}" oninput="updateCertField('${c.id}', 'date', this.value)">
          </div>
        </div>
      </div>
    `;
    container.appendChild(card);
  });
}

window.addCertificationItem = function () {
  const newItem = {
    id: 'cert_' + Date.now(),
    name: 'Certified Professional',
    issuer: 'Accredited Organization',
    date: '2023-01'
  };
  state.resume.certifications.push(newItem);
  saveState();
  renderCertificationsEditor();
  renderLivePreview();
};

window.deleteCertItem = function (id) {
  state.resume.certifications = state.resume.certifications.filter(c => c.id !== id);
  saveState();
  renderCertificationsEditor();
  renderLivePreview();
};

window.updateCertField = function (id, field, value) {
  const c = state.resume.certifications.find(i => i.id === id);
  if (c) {
    c[field] = value;
    saveState();
    renderLivePreview();
  }
};

// ========================================================
// LIVE RESUME RENDERING ENGINE (5 TEMPLATES)
// ========================================================
function renderLivePreview() {
  const doc = document.getElementById('resumeDocument');
  if (!doc) return;

  doc.className = `resume-sheet template-${state.template} density-${state.density}`;

  const { personal, summary, experience, education, skills, projects, certifications } = state.resume;

  // Contact items builder
  const contactItems = [];
  if (personal.email) contactItems.push(`<span class="resume-contact-item"><i class="fa-solid fa-envelope"></i> ${escapeHTML(personal.email)}</span>`);
  if (personal.phone) contactItems.push(`<span class="resume-contact-item"><i class="fa-solid fa-phone"></i> ${escapeHTML(personal.phone)}</span>`);
  if (personal.location) contactItems.push(`<span class="resume-contact-item"><i class="fa-solid fa-location-dot"></i> ${escapeHTML(personal.location)}</span>`);
  if (personal.linkedin) contactItems.push(`<span class="resume-contact-item"><i class="fa-brands fa-linkedin"></i> ${escapeHTML(personal.linkedin)}</span>`);
  if (personal.github) contactItems.push(`<span class="resume-contact-item"><i class="fa-brands fa-github"></i> ${escapeHTML(personal.github)}</span>`);
  if (personal.website) contactItems.push(`<span class="resume-contact-item"><i class="fa-solid fa-globe"></i> ${escapeHTML(personal.website)}</span>`);

  const contactBarHTML = contactItems.join('');

  // Experience HTML
  const expHTML = (experience || []).map(exp => `
    <div class="entry-item">
      <div class="entry-header">
        <div>
          <span class="entry-title">${escapeHTML(exp.title)}</span> — <span class="entry-company">${escapeHTML(exp.company)}</span>
        </div>
        <div class="entry-date">${escapeHTML(exp.startDate || '')} – ${exp.current ? 'Present' : escapeHTML(exp.endDate || '')}</div>
      </div>
      ${exp.location ? `<div class="entry-location">${escapeHTML(exp.location)}</div>` : ''}
      <ul class="bullet-list">
        ${(exp.bullets || []).map(b => `<li>${escapeHTML(b)}</li>`).join('')}
      </ul>
    </div>
  `).join('');

  // Education HTML
  const eduHTML = (education || []).map(edu => `
    <div class="entry-item">
      <div class="entry-header">
        <div>
          <span class="entry-title">${escapeHTML(edu.degree)}</span>
        </div>
        <div class="entry-date">${escapeHTML(edu.graduationDate || '')}</div>
      </div>
      <div class="entry-company">${escapeHTML(edu.school)}${edu.location ? `, ${escapeHTML(edu.location)}` : ''} ${edu.gpa ? `• <em>GPA: ${escapeHTML(edu.gpa)}</em>` : ''}</div>
    </div>
  `).join('');

  // Skills HTML
  const skillsHTML = (skills || []).map(grp => `
    <div class="skill-row">
      <div class="skill-category-name">${escapeHTML(grp.category)}:</div>
      <div class="skill-category-values">${(grp.items || []).map(item => state.template === 'creative' ? `<span class="skill-tag-pill">${escapeHTML(item)}</span>` : escapeHTML(item)).join(state.template === 'creative' ? ' ' : ', ')}</div>
    </div>
  `).join('');

  // Projects HTML
  const projHTML = (projects || []).map(p => `
    <div class="entry-item">
      <div class="entry-header">
        <div>
          <span class="entry-title">${escapeHTML(p.name)}</span> ${p.role ? `<span class="text-muted">(${escapeHTML(p.role)})</span>` : ''}
        </div>
        ${p.link ? `<div class="entry-date"><a href="${escapeHTML(p.link)}" target="_blank" style="color:var(--accent-color); text-decoration:none;">${escapeHTML(p.link.replace(/^https?:\/\//, ''))}</a></div>` : ''}
      </div>
      <ul class="bullet-list">
        ${(p.bullets || []).map(b => `<li>${escapeHTML(b)}</li>`).join('')}
      </ul>
    </div>
  `).join('');

  // Certifications HTML
  const certHTML = (certifications || []).map(c => `
    <div class="entry-item">
      <div class="entry-header">
        <div>
          <span class="entry-title">${escapeHTML(c.name)}</span> — <span class="entry-company">${escapeHTML(c.issuer)}</span>
        </div>
        <div class="entry-date">${escapeHTML(c.date || '')}</div>
      </div>
    </div>
  `).join('');

  // Render Template Layouts
  if (state.template === 'tech') {
    // Two-column layout
    doc.innerHTML = `
      <div class="tech-sidebar">
        <div class="resume-header">
          <h1 class="resume-name">${escapeHTML(personal.fullName || 'Your Name')}</h1>
          <div class="resume-role">${escapeHTML(personal.jobTitle || 'Professional Title')}</div>
          <div class="resume-contact-bar">${contactBarHTML}</div>
        </div>

        ${skills && skills.length > 0 ? `
          <div class="resume-section">
            <h2 class="resume-section-title"><i class="fa-solid fa-code"></i> Skills</h2>
            <div class="resume-skills-block">${skillsHTML}</div>
          </div>
        ` : ''}

        ${education && education.length > 0 ? `
          <div class="resume-section">
            <h2 class="resume-section-title"><i class="fa-solid fa-graduation-cap"></i> Education</h2>
            ${eduHTML}
          </div>
        ` : ''}

        ${certifications && certifications.length > 0 ? `
          <div class="resume-section">
            <h2 class="resume-section-title"><i class="fa-solid fa-award"></i> Certifications</h2>
            ${certHTML}
          </div>
        ` : ''}
      </div>

      <div class="tech-main-col">
        ${summary ? `
          <div class="resume-section">
            <h2 class="resume-section-title"><i class="fa-solid fa-user-tie"></i> Profile</h2>
            <p class="resume-summary-text">${escapeHTML(summary)}</p>
          </div>
        ` : ''}

        ${experience && experience.length > 0 ? `
          <div class="resume-section">
            <h2 class="resume-section-title"><i class="fa-solid fa-briefcase"></i> Experience</h2>
            ${expHTML}
          </div>
        ` : ''}

        ${projects && projects.length > 0 ? `
          <div class="resume-section">
            <h2 class="resume-section-title"><i class="fa-solid fa-diagram-project"></i> Projects</h2>
            ${projHTML}
          </div>
        ` : ''}
      </div>
    `;
  } else {
    // Single column templates (Modern, Executive, Creative, ATS)
    doc.innerHTML = `
      <header class="resume-header">
        <h1 class="resume-name">${escapeHTML(personal.fullName || 'Your Name')}</h1>
        <div class="resume-role">${escapeHTML(personal.jobTitle || 'Professional Title')}</div>
        <div class="resume-contact-bar">${contactBarHTML}</div>
      </header>

      ${summary ? `
        <section class="resume-section">
          <h2 class="resume-section-title">Professional Summary</h2>
          <p class="resume-summary-text">${escapeHTML(summary)}</p>
        </section>
      ` : ''}

      ${experience && experience.length > 0 ? `
        <section class="resume-section">
          <h2 class="resume-section-title">Work Experience</h2>
          ${expHTML}
        </section>
      ` : ''}

      ${skills && skills.length > 0 ? `
        <section class="resume-section">
          <h2 class="resume-section-title">Core Competencies & Technical Skills</h2>
          <div class="resume-skills-block">${skillsHTML}</div>
        </section>
      ` : ''}

      ${education && education.length > 0 ? `
        <section class="resume-section">
          <h2 class="resume-section-title">Education</h2>
          ${eduHTML}
        </section>
      ` : ''}

      ${projects && projects.length > 0 ? `
        <section class="resume-section">
          <h2 class="resume-section-title">Key Projects</h2>
          ${projHTML}
        </section>
      ` : ''}

      ${certifications && certifications.length > 0 ? `
        <section class="resume-section">
          <h2 class="resume-section-title">Certifications</h2>
          ${certHTML}
        </section>
      ` : ''}
    `;
  }

  // Update page count indicator estimation
  updatePageCountEstimate();
}

function updatePageCountEstimate() {
  const doc = document.getElementById('resumeDocument');
  const indicator = document.getElementById('pageCountIndicator');
  if (!doc || !indicator) return;

  autoFitStrictOnePage(doc);

  indicator.className = 'page-indicator page-indicator-locked';
  indicator.innerHTML = '<i class="fa-solid fa-lock text-success"></i> Strictly 1 Page (ATS Standard)';
}

function autoFitStrictOnePage(doc) {
  if (!doc) return;
  // A4 target pixel height at 96 DPI is ~1123px (297mm)
  const targetMaxHeight = 1120;
  
  // If content is overflowing or user is on compact density, lock one-page-fit
  if (doc.scrollHeight > targetMaxHeight || state.density === 'compact') {
    doc.classList.add('one-page-fit');
  } else {
    doc.classList.remove('one-page-fit');
  }
}

function escapeHTML(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// ========================================================
// ATS Scoring & Feedback
// ========================================================
async function calculateAtsScore() {
  try {
    const res = await fetch('/api/ai/score', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ resume: state.resume })
    });
    const data = await res.json();
    if (data.success && data.scoreData) {
      const score = data.scoreData.totalScore;
      const badge = document.getElementById('headerAtsScore');
      if (badge) {
        badge.innerText = `${score}%`;
        badge.style.color = score >= 80 ? 'var(--success)' : score >= 60 ? 'var(--warning)' : 'var(--danger)';
      }
    }
  } catch (e) {
    // Non-blocking fallback
  }
}

// ========================================================
// ATS Job Matcher Feature
// ========================================================
async function runAtsMatcher() {
  const jdText = document.getElementById('inpJobDescription')?.value;
  if (!jdText || jdText.trim().length < 20) {
    showToast('Please paste a job description first', 'warning');
    return;
  }

  const btn = document.getElementById('btnRunAtsMatch');
  const originalHtml = btn.innerHTML;
  btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Analyzing Keywords...';
  btn.disabled = true;

  try {
    const res = await fetch('/api/ai/ats-check', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        resume: state.resume,
        jobDescription: jdText
      })
    });
    const data = await res.json();

    if (data.success && data.analysis) {
      const { matchScore, matchedKeywords, missingKeywords, recommendations } = data.analysis;

      document.getElementById('atsResultsBox').style.display = 'block';
      document.getElementById('atsScoreValue').innerText = `${matchScore}%`;

      const feedback = document.getElementById('atsScoreFeedback');
      if (matchScore >= 75) {
        feedback.innerHTML = `<strong>Strong ATS Match!</strong> Your resume incorporates key terms from this job posting.`;
      } else if (matchScore >= 50) {
        feedback.innerHTML = `<strong>Moderate Match (${matchScore}%).</strong> Add high-priority missing keywords below to increase interview callback odds.`;
      } else {
        feedback.innerHTML = `<strong>Low Keyword Density (${matchScore}%).</strong> The ATS parser may filter this resume. Tailor your skills and experience.`;
      }

      // Matched Keywords
      document.getElementById('matchedCount').innerText = matchedKeywords.length;
      document.getElementById('matchedKeywordsList').innerHTML = matchedKeywords.map(k => `
        <span class="kw-tag"><i class="fa-solid fa-check"></i> ${escapeHTML(k)}</span>
      `).join('') || '<span class="text-muted">None detected yet.</span>';

      // Missing Keywords with 1-click addition to skills
      document.getElementById('missingCount').innerText = missingKeywords.length;
      document.getElementById('missingKeywordsList').innerHTML = missingKeywords.map(k => `
        <span class="kw-tag" title="Click to quickly add to skills" onclick="quickAddSkill('${escapeHTML(k)}')">
          <i class="fa-solid fa-plus"></i> ${escapeHTML(k)}
        </span>
      `).join('') || '<span class="text-muted">No high-frequency keywords missing!</span>';

      // Recommendations
      document.getElementById('atsRecommendationsList').innerHTML = recommendations.map(r => `
        <li>${escapeHTML(r)}</li>
      `).join('');

      showToast(`Job match analyzed: ${matchScore}% Match!`, 'success');
    }
  } catch (err) {
    showToast('Failed to analyze job match: ' + err.message, 'danger');
  } finally {
    btn.innerHTML = originalHtml;
    btn.disabled = false;
  }
}

window.quickAddSkill = function (skillName) {
  if (!state.resume.skills || state.resume.skills.length === 0) {
    state.resume.skills = [{ category: 'Core Competencies', items: [] }];
  }
  state.resume.skills[0].items.push(skillName);
  saveState();
  renderSkillsEditor();
  renderLivePreview();
  calculateAtsScore();
  showToast(`Added "${skillName}" to skills`, 'success');
  // Re-run match to reflect update
  runAtsMatcher();
};

// ========================================================
// AI Quick Full Resume Generator
// ========================================================
async function handleAiFullResumeGenerate() {
  const jobTitle = document.getElementById('aiGenJobTitle')?.value.trim();
  const experienceLevel = document.getElementById('aiGenExpLevel')?.value;
  const targetIndustry = document.getElementById('aiGenIndustry')?.value.trim();
  const skillsInput = document.getElementById('aiGenSkills')?.value.trim();

  if (!jobTitle) {
    showToast('Please enter a target job title', 'warning');
    return;
  }

  const btn = document.getElementById('btnSubmitAiGenerate');
  const origText = btn.innerHTML;
  btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Generating Full Resume...';
  btn.disabled = true;

  try {
    const headers = { 'Content-Type': 'application/json' };
    if (state.geminiApiKey) headers['x-gemini-key'] = state.geminiApiKey;

    const res = await fetch('/api/ai/generate', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        jobTitle,
        experienceLevel,
        targetIndustry,
        skillsInput,
        useGemini: !!state.geminiApiKey
      })
    });

    const data = await res.json();
    if (data.success && data.resume) {
      state.resume = data.resume;
      saveState();
      renderAll();
      calculateAtsScore();
      closeModal('modalAiGenerate');
      showToast(`AI Resume generated for ${jobTitle}!`, 'success');
    } else {
      throw new Error(data.error || 'Failed to generate');
    }
  } catch (err) {
    showToast('AI Generation error: ' + err.message, 'danger');
  } finally {
    btn.innerHTML = origText;
    btn.disabled = false;
  }
}

// ========================================================
// AI Bullet Point Enhancer
// ========================================================
window.openBulletEnhanceModal = async function (expId, projId, index) {
  let bulletText = '';
  let context = state.resume.personal?.jobTitle || '';

  if (expId) {
    const item = state.resume.experience.find(e => e.id === expId);
    if (item) {
      bulletText = item.bullets[index] || '';
      context = `${item.title} at ${item.company}`;
    }
  }

  state.activeBulletTarget = { expId, projId, index };

  document.getElementById('originalBulletPreview').innerText = bulletText;
  const listEl = document.getElementById('enhancedBulletsList');
  listEl.innerHTML = '<div class="loading-state"><i class="fa-solid fa-spinner fa-spin"></i> Crafting STAR action bullets...</div>';

  openModal('modalAiBullet');

  try {
    const headers = { 'Content-Type': 'application/json' };
    if (state.geminiApiKey) headers['x-gemini-key'] = state.geminiApiKey;

    const res = await fetch('/api/ai/enhance-bullet', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        bullet: bulletText,
        context,
        useGemini: !!state.geminiApiKey
      })
    });

    const data = await res.json();
    if (data.success && data.variations) {
      listEl.innerHTML = data.variations.map((v, i) => `
        <div class="variation-card" onclick="applyEnhancedBullet(${i})">
          <div class="variation-type"><i class="fa-solid fa-sparkles"></i> ${escapeHTML(v.type)}</div>
          <div class="variation-text">${escapeHTML(v.text)}</div>
        </div>
      `).join('');
      state.currentBulletVariations = data.variations;
    } else {
      listEl.innerHTML = '<div class="text-danger">Failed to generate variations.</div>';
    }
  } catch (err) {
    listEl.innerHTML = `<div class="text-danger">Error: ${escapeHTML(err.message)}</div>`;
  }
};

window.applyEnhancedBullet = function (variationIndex) {
  const variation = state.currentBulletVariations?.[variationIndex];
  if (!variation || !state.activeBulletTarget) return;

  const { expId, projId, index } = state.activeBulletTarget;

  if (expId) {
    const item = state.resume.experience.find(e => e.id === expId);
    if (item && item.bullets[index] !== undefined) {
      item.bullets[index] = variation.text;
    }
  }

  saveState();
  renderExperienceEditor();
  renderLivePreview();
  calculateAtsScore();
  closeModal('modalAiBullet');
  showToast('Bullet replaced with enhanced STAR accomplishment!', 'success');
};

// ========================================================
// AI Summary Generator Modal
// ========================================================
function openSummaryModal() {
  document.getElementById('summaryModalYears').value = '5';
  openModal('modalAiSummary');
  triggerSummaryGeneration();
}

document.getElementById('btnGenerateSummaryOptions')?.addEventListener('click', triggerSummaryGeneration);

async function triggerSummaryGeneration() {
  const tone = document.getElementById('summaryModalTone')?.value || 'professional';
  const years = document.getElementById('summaryModalYears')?.value || '5';
  const jobTitle = state.resume.personal?.jobTitle || 'Professional';

  const listEl = document.getElementById('summaryOptionsList');
  listEl.innerHTML = '<div class="loading-state"><i class="fa-solid fa-spinner fa-spin"></i> Writing summaries...</div>';

  try {
    const headers = { 'Content-Type': 'application/json' };
    if (state.geminiApiKey) headers['x-gemini-key'] = state.geminiApiKey;

    const res = await fetch('/api/ai/summary', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        jobTitle,
        years,
        tone,
        useGemini: !!state.geminiApiKey
      })
    });

    const data = await res.json();
    if (data.success && data.summaries) {
      listEl.innerHTML = data.summaries.map((s, idx) => `
        <div class="variation-card" onclick="applySummaryOption(${idx})">
          <div class="variation-type">Option ${idx + 1} (${tone.toUpperCase()})</div>
          <div class="variation-text">${escapeHTML(s)}</div>
        </div>
      `).join('');
      state.currentSummaryOptions = data.summaries;
    }
  } catch (err) {
    listEl.innerHTML = `<div class="text-danger">Failed to generate: ${escapeHTML(err.message)}</div>`;
  }
}

window.applySummaryOption = function (idx) {
  const text = state.currentSummaryOptions?.[idx];
  if (text) {
    state.resume.summary = text;
    document.getElementById('inpSummary').value = text;
    saveState();
    renderLivePreview();
    calculateAtsScore();
    closeModal('modalAiSummary');
    showToast('Summary updated!', 'success');
  }
};

// ========================================================
// AI Skill Suggester
// ========================================================
async function suggestSkills() {
  const jobTitle = state.resume.personal?.jobTitle || 'Software Engineer';
  try {
    const res = await fetch('/api/ai/skills', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jobTitle })
    });
    const data = await res.json();
    if (data.success && data.technical) {
      if (!state.resume.skills || state.resume.skills.length === 0) {
        state.resume.skills = [];
      }
      state.resume.skills.push({
        category: `Suggested for ${jobTitle}`,
        items: data.technical.slice(0, 8)
      });
      saveState();
      renderSkillsEditor();
      renderLivePreview();
      calculateAtsScore();
      showToast('Added AI recommended skills!', 'success');
    }
  } catch (err) {
    showToast('Could not fetch suggestions: ' + err.message, 'danger');
  }
}

// ========================================================
// PDF & Export Utilities (Export Center)
// ========================================================
function getExportBaseName() {
  const customName = document.getElementById('exportFileName')?.value.trim();
  if (customName) {
    return customName.replace(/[^a-zA-Z0-9_\-\s]/g, '').replace(/\s+/g, '_');
  }
  const fullName = state.resume.personal?.fullName || 'Resume';
  return `${fullName.replace(/[^a-zA-Z0-9_\-\s]/g, '').replace(/\s+/g, '_')}_Resume`;
}

function openExportHub() {
  const fileInput = document.getElementById('exportFileName');
  if (fileInput) {
    const fullName = state.resume.personal?.fullName || 'My';
    fileInput.value = `${fullName.replace(/[^a-zA-Z0-9_\-\s]/g, '').replace(/\s+/g, '_')}_Resume`;
  }
  openModal('modalExportHub');
}

let selectedPdfMethod = 'direct';

window.selectPdfMethod = function (method) {
  selectedPdfMethod = method;
  const directBox = document.getElementById('optDirectPdf');
  const printBox = document.getElementById('optPrintPdf');
  const directRadio = directBox ? directBox.querySelector('.pdf-option-radio') : null;
  const printRadio = printBox ? printBox.querySelector('.pdf-option-radio') : null;

  if (method === 'direct') {
    directBox?.classList.add('active');
    if (directRadio) directRadio.innerHTML = '<i class="fa-solid fa-circle-check text-success"></i>';
    printBox?.classList.remove('active');
    if (printRadio) printRadio.innerHTML = '<i class="fa-regular fa-circle"></i>';
  } else {
    printBox?.classList.add('active');
    if (printRadio) printRadio.innerHTML = '<i class="fa-solid fa-circle-check text-success"></i>';
    directBox?.classList.remove('active');
    if (directRadio) directRadio.innerHTML = '<i class="fa-regular fa-circle"></i>';
  }
};

function openPdfModal() {
  const baseName = getExportBaseName();
  const titleEl = document.getElementById('pdfModalTitle');
  if (titleEl) titleEl.innerText = `${baseName}.pdf`;
  openModal('modalPdfDownload');
}

function executePdfDownload() {
  closeModal('modalPdfDownload');
  if (selectedPdfMethod === 'print') {
    window.print();
  } else {
    exportToPDF();
  }
}

function exportToPDF() {
  const element = document.getElementById('resumeDocument');
  const wrapper = document.getElementById('paperWrapper');
  if (!element) return;

  const baseName = getExportBaseName();
  const format = document.getElementById('pdfPaperFormat')?.value || document.getElementById('exportPaperSize')?.value || 'a4';
  const density = document.getElementById('pdfDensityOption')?.value;

  const originalTransform = wrapper ? wrapper.style.transform : '';
  const originalDensity = state.density;

  if (density && density !== 'current') {
    element.className = `resume-sheet template-${state.template} density-${density}`;
  }

  // Enforce strict 1-page fit
  element.classList.add('one-page-fit');

  // Temporarily reset zoom transform so html2canvas renders at exact 1.0 resolution without clipping
  if (wrapper) wrapper.style.transform = 'none';

  showToast('Generating 1-Page ATS PDF...', 'info');

  const opt = {
    margin: [6, 6, 6, 6],
    filename: `${baseName}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: {
      scale: 2,
      useCORS: true,
      logging: false,
      scrollY: 0,
      scrollX: 0
    },
    jsPDF: {
      unit: 'mm',
      format: format,
      orientation: 'portrait'
    },
    pagebreak: { mode: 'avoid-all' }
  };

  if (window.html2pdf) {
    window.html2pdf().set(opt).from(element).save().then(() => {
      showToast('PDF downloaded successfully!', 'success');
      if (wrapper) wrapper.style.transform = originalTransform;
      element.className = `resume-sheet template-${state.template} density-${originalDensity}`;
    }).catch(err => {
      console.warn('html2pdf failed, falling back to window.print():', err);
      if (wrapper) wrapper.style.transform = originalTransform;
      element.className = `resume-sheet template-${state.template} density-${originalDensity}`;
      window.print();
    });
  } else {
    if (wrapper) wrapper.style.transform = originalTransform;
    window.print();
  }
}

function exportToWord() {
  const { personal, summary, experience, education, skills, projects, certifications } = state.resume;
  const baseName = getExportBaseName();
  const accentColor = state.color || '#4f46e5';

  // Construct standard Office HTML for Word
  let docContent = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head>
      <meta charset='utf-8'>
      <title>${escapeHTML(personal.fullName || 'Resume')}</title>
      <!--[if gte mso 9]>
      <xml>
      <w:WordDocument>
        <w:View>Print</w:View>
        <w:Zoom>100</w:Zoom>
        <w:DoNotOptimizeForBrowser/>
      </w:WordDocument>
      </xml>
      <![endif]-->
      <style>
        @page {
          size: 21cm 29.7cm;
          margin: 1.5cm 1.5cm 1.5cm 1.5cm;
          mso-page-orientation: portrait;
        }
        body {
          font-family: Arial, Helvetica, sans-serif;
          font-size: 10.5pt;
          line-height: 1.4;
          color: #1f2937;
        }
        h1 {
          font-size: 22pt;
          font-weight: bold;
          color: #111827;
          margin: 0 0 4pt 0;
        }
        .role {
          font-size: 13pt;
          font-weight: bold;
          color: ${accentColor};
          margin: 0 0 6pt 0;
        }
        .contact-info {
          font-size: 9.5pt;
          color: #4b5563;
          margin-bottom: 14pt;
          border-bottom: 1pt solid #e5e7eb;
          padding-bottom: 6pt;
        }
        h2 {
          font-size: 11pt;
          font-weight: bold;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: ${accentColor};
          border-bottom: 1.5pt solid ${accentColor};
          margin: 12pt 0 6pt 0;
          padding-bottom: 2pt;
        }
        p.summary {
          font-size: 10pt;
          color: #374151;
          margin-bottom: 10pt;
          text-align: justify;
        }
        .entry {
          margin-bottom: 8pt;
        }
        .entry-title {
          font-weight: bold;
          font-size: 10.5pt;
          color: #111827;
        }
        .entry-company {
          font-weight: 600;
          color: #4b5563;
        }
        .entry-date {
          float: right;
          font-size: 9pt;
          color: #6b7280;
        }
        ul {
          margin: 4pt 0 6pt 16pt;
          padding: 0;
        }
        li {
          font-size: 9.5pt;
          color: #374151;
          margin-bottom: 2pt;
        }
        .skill-group {
          margin-bottom: 4pt;
          font-size: 9.5pt;
        }
        .skill-cat {
          font-weight: bold;
          color: #111827;
        }
      </style>
    </head>
    <body>
      <h1>${escapeHTML(personal.fullName || 'Your Name')}</h1>
      <div class="role">${escapeHTML(personal.jobTitle || '')}</div>
      <div class="contact-info">
        ${[
      personal.email,
      personal.phone,
      personal.location,
      personal.linkedin,
      personal.github,
      personal.website
    ].filter(Boolean).map(escapeHTML).join(' &nbsp;|&nbsp; ')}
      </div>

      ${summary ? `
        <h2>Professional Summary</h2>
        <p class="summary">${escapeHTML(summary)}</p>
      ` : ''}

      ${experience && experience.length > 0 ? `
        <h2>Work Experience</h2>
        ${experience.map(e => `
          <div class="entry">
            <div>
              <span class="entry-title">${escapeHTML(e.title)}</span> — <span class="entry-company">${escapeHTML(e.company)}</span>
              <span class="entry-date">${escapeHTML(e.startDate || '')} – ${e.current ? 'Present' : escapeHTML(e.endDate || '')}</span>
            </div>
            ${e.location ? `<div style="font-size:9pt; color:#6b7280; font-style:italic;">${escapeHTML(e.location)}</div>` : ''}
            <ul>
              ${(e.bullets || []).map(b => `<li>${escapeHTML(b)}</li>`).join('')}
            </ul>
          </div>
        `).join('')}
      ` : ''}

      ${skills && skills.length > 0 ? `
        <h2>Skills & Competencies</h2>
        ${skills.map(s => `
          <div class="skill-group">
            <span class="skill-cat">${escapeHTML(s.category)}:</span> ${(s.items || []).map(escapeHTML).join(', ')}
          </div>
        `).join('')}
      ` : ''}

      ${education && education.length > 0 ? `
        <h2>Education</h2>
        ${education.map(edu => `
          <div class="entry">
            <div>
              <span class="entry-title">${escapeHTML(edu.degree)}</span>
              <span class="entry-date">${escapeHTML(edu.graduationDate || '')}</span>
            </div>
            <div class="entry-company">${escapeHTML(edu.school)}${edu.location ? `, ${escapeHTML(edu.location)}` : ''} ${edu.gpa ? `(GPA: ${escapeHTML(edu.gpa)})` : ''}</div>
          </div>
        `).join('')}
      ` : ''}

      ${projects && projects.length > 0 ? `
        <h2>Key Projects</h2>
        ${projects.map(p => `
          <div class="entry">
            <div>
              <span class="entry-title">${escapeHTML(p.name)}</span> ${p.role ? `<span style="color:#6b7280;">(${escapeHTML(p.role)})</span>` : ''}
              ${p.link ? `<span class="entry-date">${escapeHTML(p.link)}</span>` : ''}
            </div>
            <ul>
              ${(p.bullets || []).map(b => `<li>${escapeHTML(b)}</li>`).join('')}
            </ul>
          </div>
        `).join('')}
      ` : ''}

      ${certifications && certifications.length > 0 ? `
        <h2>Certifications</h2>
        ${certifications.map(c => `
          <div class="entry">
            <span class="entry-title">${escapeHTML(c.name)}</span> — <span class="entry-company">${escapeHTML(c.issuer)}</span>
            <span class="entry-date">${escapeHTML(c.date || '')}</span>
          </div>
        `).join('')}
      ` : ''}
    </body>
    </html>
  `;

  const blob = new Blob(['\ufeff' + docContent], { type: 'application/msword;charset=utf-8' });
  const downloadLink = document.createElement('a');
  downloadLink.href = URL.createObjectURL(blob);
  downloadLink.download = `${baseName}.doc`;
  document.body.appendChild(downloadLink);
  downloadLink.click();
  downloadLink.remove();
  URL.revokeObjectURL(downloadLink.href);

  showToast('Word document (.doc) exported!', 'success');
}

function exportToPNG() {
  const element = document.getElementById('resumeDocument');
  if (!element) return;

  const baseName = getExportBaseName();
  showToast('Generating high-resolution PNG image...', 'info');

  if (window.html2canvas) {
    window.html2canvas(element, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff'
    }).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const downloadAnchor = document.createElement('a');
      downloadAnchor.href = imgData;
      downloadAnchor.download = `${baseName}.png`;
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      showToast('PNG image downloaded!', 'success');
    }).catch(err => {
      showToast('Image capture failed: ' + err.message, 'danger');
    });
  } else {
    showToast('html2canvas library is loading, please try again in a moment', 'warning');
  }
}

function exportToHTML() {
  const element = document.getElementById('resumeDocument');
  if (!element) return;

  const baseName = getExportBaseName();
  const fullName = state.resume.personal?.fullName || 'Resume';

  const standaloneHTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHTML(fullName)} - Resume</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Merriweather:wght@300;400;700&family=Outfit:wght@400;500;600;700;800&family=Playfair+Display:wght@500;600;700&family=Roboto:wght@300;400;500;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <style>
    :root {
      --accent-color: ${state.color || '#4f46e5'};
      --resume-font: ${state.font || "'Inter', sans-serif"};
    }
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      background: #f1f5f9;
      font-family: var(--resume-font);
      display: flex;
      justify-content: center;
      padding: 2rem 1rem;
      color: #1e293b;
    }
    .resume-sheet {
      width: 210mm;
      min-height: 297mm;
      background: #ffffff;
      padding: 18mm 20mm;
      box-shadow: 0 10px 25px rgba(0,0,0,0.1);
      box-sizing: border-box;
      line-height: 1.5;
    }
    .resume-header { margin-bottom: 5mm; }
    .resume-name { font-size: 22pt; font-weight: 800; color: #0f172a; margin-bottom: 2mm; line-height: 1.1; }
    .resume-role { font-size: 12pt; font-weight: 600; color: var(--accent-color); margin-bottom: 3mm; }
    .resume-contact-bar { display: flex; flex-wrap: wrap; gap: 3mm 6mm; font-size: 8.5pt; color: #475569; }
    .resume-contact-item { display: inline-flex; align-items: center; gap: 1.5mm; }
    .resume-contact-item i { color: var(--accent-color); font-size: 8pt; }
    .resume-section-title {
      font-size: 11pt; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em;
      color: var(--accent-color); border-bottom: 1.5px solid var(--accent-color);
      padding-bottom: 1.5mm; margin-bottom: 3.5mm;
    }
    .resume-summary-text { font-size: 9.5pt; color: #334155; text-align: justify; margin-bottom: 4mm; }
    .entry-item { margin-bottom: 3.5mm; }
    .entry-header { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 1mm; }
    .entry-title { font-weight: 700; font-size: 10pt; color: #0f172a; }
    .entry-company { font-weight: 600; color: #334155; }
    .entry-date { font-size: 8.5pt; font-weight: 600; color: #64748b; }
    .entry-location { font-size: 8.5pt; color: #64748b; font-style: italic; }
    .bullet-list { padding-left: 4.5mm; margin-top: 1mm; color: #334155; }
    .bullet-list li { margin-bottom: 1.5mm; font-size: 9.2pt; text-align: justify; }
    .resume-skills-block { display: flex; flex-direction: column; gap: 2mm; }
    .skill-row { display: flex; gap: 3mm; font-size: 9pt; }
    .skill-category-name { font-weight: 700; min-width: 32mm; color: #0f172a; }
    .skill-category-values { color: #334155; }
    @media print {
      body { background: transparent; padding: 0; }
      .resume-sheet { box-shadow: none; width: 100%; padding: 0; }
      @page { size: A4 portrait; margin: 12mm 15mm; }
    }
  </style>
</head>
<body>
  ${element.outerHTML}
</body>
</html>`;

  const blob = new Blob([standaloneHTML], { type: 'text/html;charset=utf-8' });
  const downloadAnchor = document.createElement('a');
  downloadAnchor.href = URL.createObjectURL(blob);
  downloadAnchor.download = `${baseName}.html`;
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
  URL.revokeObjectURL(downloadAnchor.href);

  showToast('Standalone HTML webpage exported!', 'success');
}

function exportToTextFile() {
  const { personal, summary, experience, education, skills, projects } = state.resume;
  const baseName = getExportBaseName();

  let text = `${personal.fullName || ''}\n${personal.jobTitle || ''}\n`;
  text += `${personal.email || ''} | ${personal.phone || ''} | ${personal.location || ''}\n`;
  if (personal.linkedin) text += `LinkedIn: ${personal.linkedin}\n`;
  if (personal.github) text += `GitHub: ${personal.github}\n`;
  if (personal.website) text += `Website: ${personal.website}\n`;
  text += `\n${'='.repeat(50)}\n\n`;

  if (summary) {
    text += `PROFESSIONAL SUMMARY\n${'-'.repeat(25)}\n${summary}\n\n`;
  }

  if (experience && experience.length > 0) {
    text += `WORK EXPERIENCE\n${'-'.repeat(25)}\n`;
    experience.forEach(e => {
      text += `${e.title} - ${e.company} (${e.startDate} - ${e.current ? 'Present' : e.endDate})\n`;
      if (e.location) text += `${e.location}\n`;
      (e.bullets || []).forEach(b => text += `• ${b}\n`);
      text += `\n`;
    });
  }

  if (skills && skills.length > 0) {
    text += `CORE COMPETENCIES & SKILLS\n${'-'.repeat(25)}\n`;
    skills.forEach(s => {
      text += `${s.category}: ${(s.items || []).join(', ')}\n`;
    });
    text += `\n`;
  }

  if (education && education.length > 0) {
    text += `EDUCATION\n${'-'.repeat(25)}\n`;
    education.forEach(edu => {
      text += `${edu.degree} - ${edu.school} (${edu.graduationDate})\n`;
      if (edu.gpa) text += `GPA: ${edu.gpa}\n`;
    });
    text += `\n`;
  }

  if (projects && projects.length > 0) {
    text += `KEY PROJECTS\n${'-'.repeat(25)}\n`;
    projects.forEach(p => {
      text += `${p.name}${p.role ? ` (${p.role})` : ''}\n`;
      if (p.link) text += `Link: ${p.link}\n`;
      (p.bullets || []).forEach(b => text += `• ${b}\n`);
      text += `\n`;
    });
  }

  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
  const downloadAnchor = document.createElement('a');
  downloadAnchor.href = URL.createObjectURL(blob);
  downloadAnchor.download = `${baseName}.txt`;
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
  URL.revokeObjectURL(downloadAnchor.href);

  showToast('Plain text file (.txt) exported!', 'success');
}

function exportJSON() {
  const baseName = getExportBaseName();
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state.resume, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute("href", dataStr);
  downloadAnchor.setAttribute("download", `${baseName}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
  showToast('JSON backup exported', 'success');
}

function handleImportJson(e) {
  const file = e.target.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (event) => {
    try {
      const parsed = JSON.parse(event.target.result);
      if (parsed.personal && (parsed.experience || parsed.education || parsed.skills)) {
        state.resume = parsed;
        saveState();
        renderAll();
        calculateAtsScore();
        showToast('Resume imported successfully!', 'success');
      } else {
        throw new Error('Invalid resume schema');
      }
    } catch (err) {
      showToast('Failed to import JSON: ' + err.message, 'danger');
    }
  };
  reader.readAsText(file);
}

function copyPlainText() {
  const { personal, summary, experience, education, skills, projects } = state.resume;
  let text = `${personal.fullName || ''}\n${personal.jobTitle || ''}\n`;
  text += `${personal.email || ''} | ${personal.phone || ''} | ${personal.location || ''}\n`;
  if (personal.linkedin) text += `${personal.linkedin} | `;
  if (personal.github) text += `${personal.github}\n\n`;

  if (summary) text += `PROFESSIONAL SUMMARY\n${summary}\n\n`;

  if (experience && experience.length > 0) {
    text += `EXPERIENCE\n`;
    experience.forEach(e => {
      text += `${e.title} - ${e.company} (${e.startDate} - ${e.current ? 'Present' : e.endDate})\n`;
      (e.bullets || []).forEach(b => text += `• ${b}\n`);
      text += `\n`;
    });
  }

  if (skills && skills.length > 0) {
    text += `SKILLS\n`;
    skills.forEach(s => {
      text += `${s.category}: ${(s.items || []).join(', ')}\n`;
    });
    text += `\n`;
  }

  if (education && education.length > 0) {
    text += `EDUCATION\n`;
    education.forEach(edu => {
      text += `${edu.degree} - ${edu.school} (${edu.graduationDate})\n`;
    });
  }

  navigator.clipboard.writeText(text).then(() => {
    showToast('Plain text copied to clipboard!', 'success');
  }).catch(() => {
    showToast('Failed to copy to clipboard', 'danger');
  });
}

// ========================================================
// Sample Library & Search Engine
// ========================================================
async function fetchAndInitializeSamples() {
  try {
    const res = await fetch('/api/samples');
    const data = await res.json();
    if (data && typeof data === 'object') {
      allSamples = data;
      const keys = Object.keys(allSamples);

      // Update badge counts in UI
      const countPill = document.getElementById('sampleCountPill');
      if (countPill) countPill.innerText = keys.length;

      const libraryTotal = document.getElementById('sampleLibraryTotal');
      if (libraryTotal) libraryTotal.innerText = keys.length;

      // Populate quick select dropdown
      const select = document.getElementById('sampleSelect');
      if (select) {
        select.innerHTML = '<option value="" disabled selected>Quick Select Profile...</option>';
        keys.forEach(key => {
          const item = allSamples[key];
          const opt = document.createElement('option');
          opt.value = key;
          const roleTitle = item.personal?.jobTitle || key;
          const exp = item.meta?.experienceLevel ? ` (${item.meta.experienceLevel.split(' ')[0]})` : '';
          opt.innerText = `${roleTitle}${exp}`;
          select.appendChild(opt);
        });
      }
    }
  } catch (err) {
    console.warn('Failed to load sample resumes:', err);
  }
}

function openSampleSearchModal() {
  openModal('modalSampleSearch');
  filterAndRenderSamples();
  setTimeout(() => {
    document.getElementById('sampleSearchInput')?.focus();
  }, 100);
}

function filterAndRenderSamples() {
  const grid = document.getElementById('sampleCardsGrid');
  if (!grid) return;

  const query = (document.getElementById('sampleSearchInput')?.value || '').toLowerCase().trim();
  const keys = Object.keys(allSamples);

  const filteredKeys = keys.filter(key => {
    const item = allSamples[key];
    const meta = item.meta || {};
    const personal = item.personal || {};

    // 1. Category check
    if (currentSampleCategory !== 'all') {
      if (meta.category !== currentSampleCategory) {
        return false;
      }
    }

    // 2. Search query check
    if (!query) return true;

    const name = (personal.fullName || '').toLowerCase();
    const title = (personal.jobTitle || '').toLowerCase();
    const location = (personal.location || '').toLowerCase();
    const summary = (item.summary || '').toLowerCase();
    const tags = (meta.tags || []).map(t => t.toLowerCase()).join(' ');

    return name.includes(query) ||
      title.includes(query) ||
      location.includes(query) ||
      summary.includes(query) ||
      tags.includes(query);
  });

  // Update counter
  const statusCount = document.getElementById('sampleResultsCount');
  if (statusCount) statusCount.innerText = filteredKeys.length;

  if (filteredKeys.length === 0) {
    grid.innerHTML = `
      <div class="no-samples-found">
        <i class="fa-solid fa-magnifying-glass"></i>
        <h4>No matching profiles found</h4>
        <p class="text-muted">Try searching with a different role title, skill name (e.g. React, Python), or switch category filters.</p>
      </div>
    `;
    return;
  }

  grid.innerHTML = filteredKeys.map(key => {
    const item = allSamples[key];
    const meta = item.meta || {};
    const p = item.personal || {};
    const initials = (p.fullName || 'User')
      .split(' ')
      .map(n => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();

    const topSkills = (meta.tags || []).slice(0, 5);

    return `
      <div class="sample-profile-card">
        <div class="sample-card-top">
          <div class="sample-avatar-badge">${initials}</div>
          <div class="sample-meta-info">
            <div class="sample-card-name">${escapeHTML(p.fullName)}</div>
            <div class="sample-card-role">${escapeHTML(p.jobTitle)}</div>
            <div class="sample-badge-row">
              ${meta.categoryLabel ? `<span class="sample-pill-badge">${escapeHTML(meta.categoryLabel)}</span>` : ''}
              ${meta.experienceLevel ? `<span class="sample-pill-badge" style="background:var(--success-bg); color:var(--success);">${escapeHTML(meta.experienceLevel)}</span>` : ''}
            </div>
          </div>
        </div>

        <div class="sample-card-summary">
          ${escapeHTML(item.summary || '')}
        </div>

        <div class="sample-skills-row">
          ${topSkills.map(s => `<span class="sample-skill-chip">${escapeHTML(s)}</span>`).join('')}
        </div>

        <div class="sample-card-footer">
          <div class="sample-location-tag">
            <i class="fa-solid fa-location-dot"></i> ${escapeHTML(p.location || 'Remote')}
          </div>
          <button class="btn btn-primary btn-sm" onclick="loadSampleResume('${key}')">
            <i class="fa-solid fa-arrow-right-to-bracket"></i> Load Resume
          </button>
        </div>
      </div>
    `;
  }).join('');
}

window.loadSampleResume = function (key) {
  if (!allSamples[key]) return;

  state.resume = JSON.parse(JSON.stringify(allSamples[key]));
  saveState();
  renderAll();
  calculateAtsScore();
  closeModal('modalSampleSearch');

  const title = state.resume.personal?.jobTitle || 'Profile';
  showToast(`Loaded ${title} sample resume!`, 'success');
};

// ========================================================
// Modal & Toast Helpers
// ========================================================
function openModal(id) {
  const modal = document.getElementById(id);
  if (modal) modal.classList.add('show');
}

function closeModal(id) {
  const modal = document.getElementById(id);
  if (modal) modal.classList.remove('show');
}

function showToast(message, type = 'info') {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <i class="fa-solid ${type === 'success' ? 'fa-check-circle text-success' : type === 'danger' ? 'fa-triangle-exclamation text-danger' : 'fa-info-circle text-primary'}"></i>
    <span>${escapeHTML(message)}</span>
  `;

  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}
