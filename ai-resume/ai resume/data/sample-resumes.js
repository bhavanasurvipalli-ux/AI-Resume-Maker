// Rich library of realistic Sample Resumes across multiple domains and experience levels
const SAMPLE_RESUMES = {
  software_engineer: {
    meta: {
      category: "engineering",
      categoryLabel: "Software Engineering",
      experienceLevel: "Senior (6+ Years)",
      tags: ["TypeScript", "React", "Node.js", "AWS", "Kafka", "PostgreSQL", "Docker"]
    },
    personal: {
      fullName: "Alex Rivera",
      jobTitle: "Senior Full Stack Software Engineer",
      email: "alex.rivera.dev@gmail.com",
      phone: "+1 (555) 382-9014",
      location: "San Francisco, CA",
      website: "https://alexrivera.dev",
      linkedin: "linkedin.com/in/alexrivera-dev",
      github: "github.com/alexrivera"
    },
    summary: "Innovative Senior Full Stack Engineer with 6+ years of experience engineering high-scale web platforms and cloud-native microservices. Proven track record of boosting system performance by 45%, reducing AWS operational expenses, and leading cross-functional teams to deliver enterprise-grade features on time.",
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
          "Engineered automated CI/CD deployment pipelines on AWS ECS and GitHub Actions, cutting production release cycles from 2 weeks to continuous daily deployments.",
          "Mentored 6 junior and mid-level software developers, conducting bi-weekly code reviews and driving automated testing coverage from 64% to 92%."
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
          "Collaborated closely with UX designers to develop reusable UI component library, accelerating frontend feature development speed by 35% across 4 product teams."
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
        honors: "Dean's Honor List, Magna Cum Laude"
      }
    ],
    skills: [
      { category: "Languages", items: ["TypeScript", "JavaScript", "Python", "SQL", "HTML5", "CSS3"] },
      { category: "Frontend", items: ["React", "Next.js", "Redux Toolkit", "Tailwind CSS", "Vue.js"] },
      { category: "Backend & Cloud", items: ["Node.js", "Express", "PostgreSQL", "MongoDB", "Redis", "AWS (ECS, S3, RDS)", "Docker", "Kubernetes"] },
      { category: "Tools & Practices", items: ["Git", "CI/CD", "Jest", "Microservices", "System Design", "Agile / Scrum"] }
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
  },

  frontend_developer: {
    meta: {
      category: "engineering",
      categoryLabel: "Frontend & UI",
      experienceLevel: "Mid-Senior (4+ Years)",
      tags: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Web Vitals", "Redux", "Figma"]
    },
    personal: {
      fullName: "Sophia Martinez",
      jobTitle: "Senior Frontend Engineer / UI Architect",
      email: "sophia.martinez.ui@gmail.com",
      phone: "+1 (555) 492-7103",
      location: "Seattle, WA",
      website: "https://sophiamartinez.design",
      linkedin: "linkedin.com/in/sophiamartinez-ui",
      github: "github.com/sophiamartinez"
    },
    summary: "Creative and detail-obsessed Senior Frontend Engineer with 4+ years of experience building accessible, lightning-fast web applications. Specializes in design systems, React, Next.js, and core web vitals optimization. Boosted conversion rates by 26% through component refactoring.",
    experience: [
      {
        id: "exp_1",
        title: "Senior Frontend Engineer",
        company: "Vivid Interactive Systems",
        location: "Seattle, WA",
        startDate: "2021-08",
        endDate: "Present",
        current: true,
        bullets: [
          "Architected corporate design system adopted across 8 SaaS products, reducing frontend sprint cycle time by 40%.",
          "Optimized Lighthouse Core Web Vitals across e-commerce checkout flow, improving LCP from 3.8s to 1.1s and boosting conversion by 26%.",
          "Spearheaded accessibility (WCAG 2.1 AA) compliance overhaul, resolving 300+ accessibility violations across 50,000 active customer pages."
        ]
      },
      {
        id: "exp_2",
        title: "Frontend Developer",
        company: "PixelCraft Studio",
        location: "Portland, OR",
        startDate: "2019-06",
        endDate: "2021-07",
        current: false,
        bullets: [
          "Developed rich, animated marketing and web client dashboards using React, Framer Motion, and Tailwind CSS.",
          "Collaborated with UX researchers and visual designers to transform Figma prototypes into production-grade reusable code."
        ]
      }
    ],
    education: [
      {
        id: "edu_1",
        degree: "Bachelor of Science in Web Design & Software Engineering",
        school: "University of Washington",
        location: "Seattle, WA",
        graduationDate: "2019-06",
        gpa: "3.82 / 4.0",
        honors: "Departmental Honors"
      }
    ],
    skills: [
      { category: "Core Frontend", items: ["React", "Next.js", "TypeScript", "JavaScript (ESNext)", "HTML5", "CSS3 / Sass", "Tailwind CSS"] },
      { category: "State & Architecture", items: ["Redux Toolkit", "Zustand", "React Query", "REST / GraphQL", "Micro-frontends"] },
      { category: "Quality & Testing", items: ["Jest", "React Testing Library", "Cypress", "Web Vitals Optimization", "WCAG Accessibility"] }
    ],
    projects: [
      {
        id: "proj_1",
        name: "Lumina UI - Accessible Design System",
        role: "Author",
        link: "https://github.com/sophiamartinez/lumina-ui",
        bullets: [
          "Open-source React component library with 40+ accessible UI primitives and 2,200+ monthly npm downloads."
        ]
      }
    ],
    certifications: [
      {
        id: "cert_1",
        name: "Meta Certified Front-End Developer",
        issuer: "Meta",
        date: "2022-05"
      }
    ]
  },

  data_scientist: {
    meta: {
      category: "data",
      categoryLabel: "Data Science & AI",
      experienceLevel: "Senior (5+ Years)",
      tags: ["Python", "PyTorch", "TensorFlow", "MLflow", "SageMaker", "SQL", "Transformers", "NLP"]
    },
    personal: {
      fullName: "Maya Chen",
      jobTitle: "Senior Machine Learning & Data Scientist",
      email: "maya.chen.ai@gmail.com",
      phone: "+1 (555) 842-1920",
      location: "New York, NY",
      website: "https://mayachen.ai",
      linkedin: "linkedin.com/in/mayachen-ml",
      github: "github.com/mayachen-data"
    },
    summary: "Accomplished Data Scientist with 5+ years of hands-on experience building, fine-tuning, and productionizing predictive machine learning and NLP models. Leveraged statistical modeling and deep learning to lift conversion rates by 22% and automate anomaly detection for millions of transactions.",
    experience: [
      {
        id: "exp_1",
        title: "Senior Data Scientist",
        company: "FinTech Quantum Labs",
        location: "New York, NY",
        startDate: "2021-09",
        endDate: "Present",
        current: true,
        bullets: [
          "Designed and deployed gradient boosting and neural network models for real-time fraud detection, preventing $4.2M in annual fraudulent transactions with 94.2% precision.",
          "Architected automated ML training pipeline using MLflow, Airflow, and AWS SageMaker, decreasing model retraining and deployment turnaround from 3 weeks to 2 days.",
          "Created A/B testing infrastructure to evaluate dynamic pricing algorithms, directly lifting quarterly revenue by 14% ($850k impact)."
        ]
      },
      {
        id: "exp_2",
        title: "Machine Learning Engineer",
        company: "DataMetrics Analytics",
        location: "Boston, MA",
        startDate: "2019-07",
        endDate: "2021-08",
        current: false,
        bullets: [
          "Trained custom BERT and RoBERTa NLP models for sentiment classification and customer intent extraction, achieving 91.5% F1 score across 12 languages.",
          "Built high-throughput ETL pipelines with PySpark and Snowflake to ingest and normalize 15TB of unstructured text data weekly."
        ]
      }
    ],
    education: [
      {
        id: "edu_1",
        degree: "Master of Science in Data Science & Machine Learning",
        school: "Columbia University",
        location: "New York, NY",
        graduationDate: "2019-05",
        gpa: "3.92 / 4.0",
        honors: "Graduate Research Fellow"
      }
    ],
    skills: [
      { category: "ML & Deep Learning", items: ["PyTorch", "TensorFlow", "Scikit-Learn", "HuggingFace Transformers", "XGBoost", "Computer Vision", "NLP"] },
      { category: "Data Engineering", items: ["Python", "SQL", "PySpark", "Pandas", "Snowflake", "dbt", "Airflow"] },
      { category: "Cloud & MLOps", items: ["AWS SageMaker", "MLflow", "Docker", "Kubernetes", "Git", "FastAPI"] },
      { category: "Analytics & Stats", items: ["A/B Testing", "Hypothesis Testing", "Time Series Forecasting", "Tableau", "Looker"] }
    ],
    projects: [
      {
        id: "proj_1",
        name: "MedText Summarizer - Clinical NLP Pipeline",
        role: "Lead Researcher",
        link: "https://github.com/mayachen-data/medtext",
        bullets: [
          "Fine-tuned open-source Llama-3 models on clinical diagnostic reports, improving diagnostic summary readability by 40% based on physician blind evals."
        ]
      }
    ],
    certifications: [
      {
        id: "cert_1",
        name: "Google Cloud Professional Machine Learning Engineer",
        issuer: "Google Cloud",
        date: "2023-01"
      }
    ]
  },

  devops_engineer: {
    meta: {
      category: "engineering",
      categoryLabel: "DevOps & Cloud",
      experienceLevel: "Senior (5+ Years)",
      tags: ["Kubernetes", "Terraform", "AWS", "CI/CD", "Docker", "Prometheus", "Grafana", "Linux"]
    },
    personal: {
      fullName: "Marcus Vance",
      jobTitle: "Senior DevOps & Cloud Platform Engineer",
      email: "marcus.vance.cloud@gmail.com",
      phone: "+1 (555) 601-3829",
      location: "Denver, CO",
      website: "https://marcusvance.io",
      linkedin: "linkedin.com/in/marcusvance-devops",
      github: "github.com/marcusvance"
    },
    summary: "Reliability-driven Senior DevOps & Platform Engineer with 5+ years automating resilient multi-cloud infrastructure and high-velocity CI/CD systems. Championed Infrastructure as Code with Terraform and orchestrated Kubernetes clusters maintaining 99.99% uptime for enterprise clients.",
    experience: [
      {
        id: "exp_1",
        title: "Senior DevOps Engineer",
        company: "AeroCloud Technologies",
        location: "Denver, CO",
        startDate: "2021-11",
        endDate: "Present",
        current: true,
        bullets: [
          "Automated deployment of 4 multi-region EKS Kubernetes clusters via Terraform, cutting developer environment spin-up time from 2 days to 14 minutes.",
          "Overhauled CI/CD release pipelines with GitHub Actions and ArgoCD, increasing deployment frequency from weekly to 18 deployments daily.",
          "Reduced annual AWS cloud infrastructure expenditures by $240,000 (32%) by implementing spot instance autoscaling and right-sizing underutilized databases."
        ]
      },
      {
        id: "exp_2",
        title: "Cloud Infrastructure Engineer",
        company: "Summit SaaS Platforms",
        location: "Boulder, CO",
        startDate: "2019-05",
        endDate: "2021-10",
        current: false,
        bullets: [
          "Deployed Prometheus, Grafana, and Datadog monitoring suites, reducing Mean Time to Resolution (MTTR) by 48%.",
          "Hardened IAM role policies and automated container vulnerability scanning with Trivy across 120+ microservice repositories."
        ]
      }
    ],
    education: [
      {
        id: "edu_1",
        degree: "Bachelor of Science in Information Technology & Networking",
        school: "Colorado State University",
        location: "Fort Collins, CO",
        graduationDate: "2019-05",
        gpa: "3.75 / 4.0",
        honors: ""
      }
    ],
    skills: [
      { category: "Cloud & Orchestration", items: ["AWS", "Kubernetes (EKS)", "Docker", "Terraform", "Helm", "Linux / Bash"] },
      { category: "CI/CD & Observability", items: ["GitHub Actions", "GitLab CI", "ArgoCD", "Prometheus", "Grafana", "Datadog", "ELK Stack"] },
      { category: "Security & Networking", items: ["IAM", "HashiCorp Vault", "TLS / SSL", "VPC Peering", "Zero Trust Architecture"] }
    ],
    projects: [
      {
        id: "proj_1",
        name: "KubeAutoscaler - Cost-Efficient Pod Optimizer",
        role: "Creator",
        link: "https://github.com/marcusvance/kube-autoscaler",
        bullets: [
          "Engineered lightweight Kubernetes operator monitoring CPU memory spikes to dynamically schedule spot workloads, saving 25% compute cost."
        ]
      }
    ],
    certifications: [
      {
        id: "cert_1",
        name: "Certified Kubernetes Administrator (CKA)",
        issuer: "CNCF",
        date: "2022-09"
      },
      {
        id: "cert_2",
        name: "HashiCorp Certified: Terraform Associate",
        issuer: "HashiCorp",
        date: "2023-03"
      }
    ]
  },

  product_manager: {
    meta: {
      category: "product",
      categoryLabel: "Product & Strategy",
      experienceLevel: "Lead / Principal (7+ Years)",
      tags: ["Product Strategy", "Roadmapping", "PRDs", "A/B Testing", "Mixpanel", "Jira", "Figma"]
    },
    personal: {
      fullName: "David Sterling",
      jobTitle: "Lead Product Manager",
      email: "david.sterling.pm@gmail.com",
      phone: "+1 (555) 719-4458",
      location: "Austin, TX",
      website: "https://davidsterling.io",
      linkedin: "linkedin.com/in/davidsterling-pm",
      github: "github.com/davidsterling"
    },
    summary: "Visionary Product Leader with 7+ years driving B2B SaaS product innovation and user growth. Proven record of scaling products from zero to $12M ARR, leading high-performing cross-functional teams of engineers and product designers, and improving user retention by 32%.",
    experience: [
      {
        id: "exp_1",
        title: "Lead Product Manager",
        company: "Vanguard SaaS Platforms",
        location: "Austin, TX",
        startDate: "2021-01",
        endDate: "Present",
        current: true,
        bullets: [
          "Spearheaded product discovery and rollout of enterprise workflow automation tool, generating $3.8M in net new ARR in the first 12 months.",
          "Partnered with engineering and UX teams to define quarterly product OKRs, increasing feature release predictability by 38%.",
          "Conducted 120+ customer discovery interviews, translating qualitative insights into high-impact PRDs and reducing user onboarding churn by 26%."
        ]
      },
      {
        id: "exp_2",
        title: "Senior Product Manager",
        company: "CloudScale Technologies",
        location: "Denver, CO",
        startDate: "2018-04",
        endDate: "2020-12",
        current: false,
        bullets: [
          "Managed core product lifecycle for developer API platform, growing active monthly developer accounts from 40k to 220k.",
          "Instituted data-driven experimentation framework using Mixpanel and Optimizely, executing 30+ conversion rate optimization tests."
        ]
      }
    ],
    education: [
      {
        id: "edu_1",
        degree: "Bachelor of Business Administration (BBA) in Information Systems",
        school: "University of Texas at Austin",
        location: "Austin, TX",
        graduationDate: "2017-05",
        gpa: "3.80 / 4.0",
        honors: ""
      }
    ],
    skills: [
      { category: "Product Leadership", items: ["Product Strategy", "Roadmapping", "PRDs", "Go-To-Market (GTM)", "Competitive Analysis", "User Research"] },
      { category: "Metrics & Analytics", items: ["A/B Testing", "Mixpanel", "Amplitude", "Google Analytics", "SQL", "Tableau"] },
      { category: "Tools & Frameworks", items: ["Jira", "Confluence", "Figma", "Notion", "Linear", "Agile / Scrum"] }
    ],
    projects: [
      {
        id: "proj_1",
        name: "Enterprise Workflow Builder",
        role: "Product Owner",
        link: "https://davidsterling.io/portfolio",
        bullets: [
          "Defined and launched no-code visual workflow designer adopted by over 200 Fortune 500 customers."
        ]
      }
    ],
    certifications: [
      {
        id: "cert_1",
        name: "Certified Scrum Product Owner (CSPO)",
        issuer: "Scrum Alliance",
        date: "2020-08"
      }
    ]
  },

  uiux_designer: {
    meta: {
      category: "design",
      categoryLabel: "UI/UX & Design",
      experienceLevel: "Senior (5+ Years)",
      tags: ["Figma", "Design Systems", "Prototyping", "User Research", "Wireframing", "Interaction Design"]
    },
    personal: {
      fullName: "Elena Rostova",
      jobTitle: "Senior Product & UI/UX Designer",
      email: "elena.rostova.ux@gmail.com",
      phone: "+1 (555) 918-4720",
      location: "Chicago, IL",
      website: "https://elenarostova.design",
      linkedin: "linkedin.com/in/elenarostova-design",
      github: "github.com/elenarostova"
    },
    summary: "Senior Product Designer with 5+ years crafting human-centered digital experiences for mobile and desktop applications. Expert in translating complex user workflows into clean, intuitive UI interfaces that drive engagement and business metrics.",
    experience: [
      {
        id: "exp_1",
        title: "Senior Product Designer",
        company: "Aurora FinTech Solutions",
        location: "Chicago, IL",
        startDate: "2021-06",
        endDate: "Present",
        current: true,
        bullets: [
          "Led complete redesign of flagship mobile banking app, boosting Apple App Store rating from 3.6 to 4.8 stars.",
          "Established comprehensive Figma component library and tokenized design system, increasing designer-developer handoff speed by 45%.",
          "Conducted usability testing sessions with 85+ end users, identifying pain points in onboarding and reducing drop-off by 31%."
        ]
      },
      {
        id: "exp_2",
        title: "UI/UX Designer",
        company: "Craft & Code Agency",
        location: "Minneapolis, MN",
        startDate: "2019-04",
        endDate: "2021-05",
        current: false,
        bullets: [
          "Designed responsive web interfaces and design collateral for 14 enterprise and startup clients.",
          "Created interactive high-fidelity prototypes in Figma and Principle, validating core user journeys before engineering handoff."
        ]
      }
    ],
    education: [
      {
        id: "edu_1",
        degree: "Bachelor of Fine Arts (BFA) in Interaction Design",
        school: "Rhode Island School of Design (RISD)",
        location: "Providence, RI",
        graduationDate: "2019-05",
        gpa: "3.88 / 4.0",
        honors: "Design Excellence Award"
      }
    ],
    skills: [
      { category: "Design Tools", items: ["Figma", "FigJam", "Adobe Creative Cloud", "Principle", "Miro", "Sketch"] },
      { category: "Design Methodologies", items: ["Design Systems", "User Journeys", "Wireframing", "High-Fidelity Prototyping", "Design Tokens", "Information Architecture"] },
      { category: "Research & Strategy", items: ["Usability Testing", "A/B Testing", "User Interviews", "Heuristic Evaluation", "Design Sprints"] }
    ],
    projects: [
      {
        id: "proj_1",
        name: "PayFlow - Frictionless Checkout Flow",
        role: "Lead Designer",
        link: "https://elenarostova.design/payflow",
        bullets: [
          "Redesigned multi-step checkout experience for 1.2M monthly shoppers, resulting in an 18% increase in completed transactions."
        ]
      }
    ],
    certifications: [
      {
        id: "cert_1",
        name: "Nielsen Norman Group UX Master Certified",
        issuer: "Nielsen Norman Group",
        date: "2022-10"
      }
    ]
  },

  marketing_specialist: {
    meta: {
      category: "marketing",
      categoryLabel: "Marketing & Growth",
      experienceLevel: "Senior (5+ Years)",
      tags: ["SEO / SEM", "Google Ads", "HubSpot", "Meta Ads", "Google Analytics 4", "Email Marketing"]
    },
    personal: {
      fullName: "Rachel Kim",
      jobTitle: "Growth Marketing & SEO Specialist",
      email: "rachel.kim.growth@gmail.com",
      phone: "+1 (555) 732-8419",
      location: "Los Angeles, CA",
      website: "https://rachelkimgrowth.com",
      linkedin: "linkedin.com/in/rachelkim-growth",
      github: ""
    },
    summary: "Results-driven Growth Marketing Strategist with 5+ years executing data-backed customer acquisition, technical SEO, and paid performance campaigns. Managed $1.8M in annual digital ad spend while cutting customer acquisition cost (CAC) by 34%.",
    experience: [
      {
        id: "exp_1",
        title: "Senior Growth Marketing Manager",
        company: "NextWave Consumer Brands",
        location: "Los Angeles, CA",
        startDate: "2021-04",
        endDate: "Present",
        current: true,
        bullets: [
          "Spearheaded omni-channel acquisition strategy across Google Ads, Meta, and TikTok, scaling annual revenue from $2.4M to $7.1M.",
          "Overhauled technical SEO architecture and content cluster strategy, increasing organic non-branded search impressions by 185% year-over-year.",
          "Built automated lifecycle email retention sequences in Klaviyo and HubSpot, lifting repeat purchase rate by 24%."
        ]
      },
      {
        id: "exp_2",
        title: "Digital Marketing Specialist",
        company: "Elevate Media Partners",
        location: "San Diego, CA",
        startDate: "2019-05",
        endDate: "2021-03",
        current: false,
        bullets: [
          "Executed 50+ conversion rate optimization (CRO) landing page tests, improving overall lead capture conversion from 2.1% to 4.7%.",
          "Managed paid search campaigns generating an average 4.2x Return on Ad Spend (ROAS)."
        ]
      }
    ],
    education: [
      {
        id: "edu_1",
        degree: "Bachelor of Arts in Marketing & Communications",
        school: "University of Southern California (USC)",
        location: "Los Angeles, CA",
        graduationDate: "2019-05",
        gpa: "3.78 / 4.0",
        honors: ""
      }
    ],
    skills: [
      { category: "Paid Media & Ads", items: ["Google Ads", "Meta Ads Manager", "LinkedIn Ads", "TikTok Ads", "Retargeting", "ROAS Optimization"] },
      { category: "SEO & Content", items: ["Ahrefs", "Semrush", "Technical SEO", "Keyword Research", "Content Strategy", "Link Building"] },
      { category: "Analytics & Automation", items: ["Google Analytics 4", "Google Tag Manager", "HubSpot", "Klaviyo", "Looker Studio"] }
    ],
    projects: [
      {
        id: "proj_1",
        name: "Zero to $100k MRR Playbook",
        role: "Strategist",
        link: "https://rachelkimgrowth.com/case-study",
        bullets: [
          "Published comprehensive marketing teardown detailing how a B2B SaaS startup scaled from zero to $100k MRR via organic search."
        ]
      }
    ],
    certifications: [
      {
        id: "cert_1",
        name: "Google Ads & Google Analytics 4 Certified",
        issuer: "Google",
        date: "2023-02"
      }
    ]
  },

  cybersecurity_analyst: {
    meta: {
      category: "security",
      categoryLabel: "Cybersecurity & InfoSec",
      experienceLevel: "Mid-Senior (4+ Years)",
      tags: ["SIEM", "Splunk", "Incident Response", "Penetration Testing", "Wireshark", "Network Security"]
    },
    personal: {
      fullName: "Ethan Thorne",
      jobTitle: "Cybersecurity & SOC Analyst",
      email: "ethan.thorne.sec@gmail.com",
      phone: "+1 (555) 304-9812",
      location: "Washington, DC",
      website: "https://ethanthorne.sec",
      linkedin: "linkedin.com/in/ethanthorne-cyber",
      github: "github.com/ethanthorne"
    },
    summary: "Proactive Information Security Analyst with 4+ years of experience in Security Operations Centers (SOC), incident response, threat hunting, and vulnerability remediation. Proven success safeguarding enterprise networks against sophisticated cyber threats.",
    experience: [
      {
        id: "exp_1",
        title: "Senior Security Operations Center (SOC) Analyst",
        company: "Sentinel Cyber Defense",
        location: "Washington, DC",
        startDate: "2021-10",
        endDate: "Present",
        current: true,
        bullets: [
          "Monitored and investigated over 5,000 security alerts monthly using Splunk SIEM and CrowdStrike EDR, maintaining a 99.7% threat triage SLA.",
          "Led incident response team during zero-day vulnerability remediation, mitigating potential exposure for 15,000 internal endpoints within 6 hours.",
          "Conducted quarterly penetration testing and vulnerability assessments with Nessus, reducing overall security attack surface by 42%."
        ]
      },
      {
        id: "exp_2",
        title: "Junior Information Security Specialist",
        company: "Federal Tech Guard",
        location: "Reston, VA",
        startDate: "2020-01",
        endDate: "2021-09",
        current: false,
        bullets: [
          "Configured firewall rules, intrusion detection systems (IDS/IPS), and VPN access control policies for 800+ remote personnel.",
          "Developed automated Python scripts to parse firewall logs and flag suspicious IP addresses, saving 12 manual analysis hours weekly."
        ]
      }
    ],
    education: [
      {
        id: "edu_1",
        degree: "Bachelor of Science in Cybersecurity & Network Forensics",
        school: "George Mason University",
        location: "Fairfax, VA",
        graduationDate: "2019-12",
        gpa: "3.84 / 4.0",
        honors: "Cyber Defense Scholarship Recipient"
      }
    ],
    skills: [
      { category: "Security Operations", items: ["SIEM (Splunk, Sentinel)", "CrowdStrike Falcon", "Wireshark", "Nessus", "Incident Response", "Threat Hunting"] },
      { category: "Network & Systems", items: ["Firewalls (Palo Alto)", "Linux Administration", "Python Scripting", "Bash", "Snort", "Metasploit"] },
      { category: "Compliance & Frameworks", items: ["NIST CSF", "ISO 27001", "MITRE ATT&CK", "SOC 2 Type II", "OWASP Top 10"] }
    ],
    projects: [
      {
        id: "proj_1",
        name: "LogSieve - Open Source Threat Intelligence Parser",
        role: "Creator",
        link: "https://github.com/ethanthorne/logsieve",
        bullets: [
          "Engineered CLI threat hunting tool in Python that cross-references auth logs against live AbuseIPDB threat feeds."
        ]
      }
    ],
    certifications: [
      {
        id: "cert_1",
        name: "CompTIA Security+ (SY0-601)",
        issuer: "CompTIA",
        date: "2021-03"
      },
      {
        id: "cert_2",
        name: "Certified Ethical Hacker (CEH)",
        issuer: "EC-Council",
        date: "2022-07"
      }
    ]
  },

  qa_engineer: {
    meta: {
      category: "engineering",
      categoryLabel: "QA & SDET",
      experienceLevel: "Senior (5+ Years)",
      tags: ["Playwright", "Cypress", "Selenium", "Jest", "API Testing", "Postman", "CI/CD", "TypeScript"]
    },
    personal: {
      fullName: "Ananya Sharma",
      jobTitle: "Senior QA & Test Automation Engineer (SDET)",
      email: "ananya.sharma.qa@gmail.com",
      phone: "+1 (555) 412-8902",
      location: "San Jose, CA",
      website: "https://ananyasharma.dev",
      linkedin: "linkedin.com/in/ananyasharma-qa",
      github: "github.com/ananyasharma-qa"
    },
    summary: "Quality-focused Senior Test Automation Engineer with 5+ years designing scalable test automation frameworks for web, mobile, and REST APIs. Championed continuous automated testing in CI/CD, reducing production defect escape rate by 65%.",
    experience: [
      {
        id: "exp_1",
        title: "Senior SDET / Automation Lead",
        company: "Apex Cloud Financials",
        location: "San Jose, CA",
        startDate: "2021-05",
        endDate: "Present",
        current: true,
        bullets: [
          "Built end-to-end automated testing framework using Playwright and TypeScript, expanding regression test coverage from 35% to 88%.",
          "Integrated automated smoke and regression test suites into GitLab CI pipelines, cutting release QA verification from 4 days to 45 minutes.",
          "Spearheaded performance and load testing using k6 and JMeter, uncovering critical database connection bottlenecks prior to high-traffic product launches."
        ]
      },
      {
        id: "exp_2",
        title: "Quality Assurance Engineer",
        company: "Optima Software Solutions",
        location: "Fremont, CA",
        startDate: "2019-03",
        endDate: "2021-04",
        current: false,
        bullets: [
          "Automated UI regression test cases using Selenium WebDriver and Python across cross-browser environments.",
          "Designed comprehensive API test suites in Postman and Newman, verifying 120+ RESTful microservice endpoints on every merge request."
        ]
      }
    ],
    education: [
      {
        id: "edu_1",
        degree: "Bachelor of Technology in Computer Engineering",
        school: "San Jose State University",
        location: "San Jose, CA",
        graduationDate: "2018-12",
        gpa: "3.76 / 4.0",
        honors: ""
      }
    ],
    skills: [
      { category: "Test Automation", items: ["Playwright", "Cypress", "Selenium WebDriver", "Appium", "Cucumber (BDD)", "TypeScript", "Python"] },
      { category: "API & Performance", items: ["Postman", "Newman", "REST Assured", "k6", "Apache JMeter", "SQL Validation"] },
      { category: "DevOps & Tools", items: ["Git", "GitLab CI", "GitHub Actions", "Jenkins", "Docker", "Jira / Xray", "Agile / Scrum"] }
    ],
    projects: [
      {
        id: "proj_1",
        name: "Playwright-Boilerplate - Enterprise Test Harness",
        role: "Creator",
        link: "https://github.com/ananyasharma-qa/playwright-enterprise",
        bullets: [
          "Created modular TypeScript Playwright framework template with multi-environment configs, parallel execution, and HTML reporting."
        ]
      }
    ],
    certifications: [
      {
        id: "cert_1",
        name: "ISTQB Certified Tester – Foundation Level (CTFL)",
        issuer: "ISTQB",
        date: "2020-04"
      }
    ]
  },

  entry_level_dev: {
    meta: {
      category: "entry",
      categoryLabel: "Fresher & Junior",
      experienceLevel: "Entry-Level / Fresher (0-1 Year)",
      tags: ["JavaScript", "React", "Node.js", "HTML5", "CSS3", "Git", "MongoDB", "Python"]
    },
    personal: {
      fullName: "Kiran Patel",
      jobTitle: "Junior Software Developer / Fresh Graduate",
      email: "kiran.patel.dev@gmail.com",
      phone: "+1 (555) 219-5830",
      location: "Dallas, TX",
      website: "https://kiranpatel.dev",
      linkedin: "linkedin.com/in/kiranpatel-dev",
      github: "github.com/kiranpatel"
    },
    summary: "Ambitious and disciplined Junior Software Developer with strong foundational mastery in JavaScript, React, Node.js, and object-oriented programming. Proven project experience building full-stack applications and collaborative problem-solving through academic and open-source contributions.",
    experience: [
      {
        id: "exp_1",
        title: "Software Engineering Intern",
        company: "TechSpark Digital Solutions",
        location: "Dallas, TX",
        startDate: "2023-05",
        endDate: "2023-08",
        current: false,
        bullets: [
          "Developed 6 responsive user dashboard components using React and Tailwind CSS, improving customer profile completion by 18%.",
          "Assisted senior engineers in refactoring Express.js API routes and creating automated unit tests with Jest, increasing test coverage by 22%.",
          "Participated actively in daily Agile standups, sprint reviews, and pair-programming sessions."
        ]
      }
    ],
    education: [
      {
        id: "edu_1",
        degree: "Bachelor of Science in Computer Science",
        school: "University of Texas at Dallas",
        location: "Richardson, TX",
        graduationDate: "2024-05",
        gpa: "3.88 / 4.0",
        honors: "Dean's Honor Roll, Academic Excellence Scholarship"
      }
    ],
    skills: [
      { category: "Programming Languages", items: ["JavaScript (ES6+)", "Python", "Java", "SQL", "C++", "HTML5", "CSS3"] },
      { category: "Web Frameworks & Libraries", items: ["React", "Node.js", "Express.js", "Tailwind CSS", "Bootstrap", "REST APIs"] },
      { category: "Databases & Tools", items: ["MongoDB", "PostgreSQL", "Git / GitHub", "Postman", "VS Code", "Vercel"] }
    ],
    projects: [
      {
        id: "proj_1",
        name: "CampusConnect - Student Tutoring & Study Portal",
        role: "Full Stack Developer (Capstone)",
        link: "https://github.com/kiranpatel/campus-connect",
        bullets: [
          "Engineered full-stack web application using React, Node.js, and MongoDB allowing 400+ students to schedule peer tutoring sessions.",
          "Implemented JWT authentication and responsive mobile UI, receiving 1st place in Senior Capstone Showcase."
        ]
      },
      {
        id: "proj_2",
        name: "DevBookmark - Developer Resource Manager",
        role: "Solo Creator",
        link: "https://github.com/kiranpatel/dev-bookmark",
        bullets: [
          "Created browser tool for tagging and searching developer documentation with instant client-side search filtering."
        ]
      }
    ],
    certifications: [
      {
        id: "cert_1",
        name: "freeCodeCamp Full Stack Developer Certification",
        issuer: "freeCodeCamp",
        date: "2023-11"
      }
    ]
  }
};

module.exports = {
  SAMPLE_RESUMES
};
