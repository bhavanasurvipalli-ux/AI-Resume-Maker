// Pre-configured ATS Keywords and Templates for Intelligent Local AI Engine
const ROLE_DATA = {
  "software_engineer": {
    title: "Senior Software Engineer",
    summary: "High-impact Software Engineer with 5+ years of experience designing, architecting, and deploying resilient cloud-native web applications. Proven track record of boosting system performance by 40% and mentoring cross-functional engineering teams.",
    skills: {
      technical: ["JavaScript", "TypeScript", "React", "Node.js", "Python", "Docker", "Kubernetes", "AWS", "PostgreSQL", "GraphQL", "REST APIs", "Microservices"],
      soft: ["System Architecture", "Agile / Scrum", "Technical Mentorship", "Code Review", "Cross-functional Collaboration", "Incident Management"]
    },
    actionVerbs: ["Architected", "Engineered", "Spearheaded", "Optimized", "Refactored", "Automated", "Scaled", "Deployed"],
    bulletTemplates: [
      "Architected and deployed high-throughput microservices using {tech1} and {tech2}, reducing API latency by {metric1}% across {metric2}k daily active users.",
      "Spearheaded the migration of legacy monolith to containerized {tech1} infrastructure, slashing cloud infrastructure costs by {metric1}%.",
      "Engineered automated CI/CD deployment pipelines utilizing {tech1}, reducing release cycles from bi-weekly to on-demand daily deployments.",
      "Mentored a team of {metric1} junior and mid-level engineers, enforcing strict code quality standards and achieving {metric2}% test coverage."
    ]
  },
  "data_scientist": {
    title: "Data Scientist & Machine Learning Engineer",
    summary: "Innovative Data Scientist with extensive expertise in predictive modeling, deep learning, and NLP pipelines. Experienced in deploying production ML systems that drive measurable business growth and data-backed decision making.",
    skills: {
      technical: ["Python", "PyTorch", "TensorFlow", "Scikit-Learn", "SQL", "Pandas", "Spark", "MLflow", "Data Modeling", "Feature Engineering", "A/B Testing", "AWS SageMaker"],
      soft: ["Data Storytelling", "Statistical Analysis", "Stakeholder Communication", "Research & Prototyping", "Problem Solving"]
    },
    actionVerbs: ["Developed", "Trained", "Evaluated", "Optimized", "Extracted", "Modeled", "Implemented", "Productionized"],
    bulletTemplates: [
      "Developed and productionized an ensemble ML model using {tech1} and {tech2}, boosting recommendation accuracy by {metric1}% and lifting revenue by ${metric2}k.",
      "Built end-to-end data pipelines processing {metric1}M+ records daily with Apache Spark and PostgreSQL, reducing processing latency by {metric2}%.",
      "Designed and executed A/B experimentation frameworks for product features, improving user retention by {metric1}% over a 6-month period.",
      "Trained custom Transformer and NLP models for sentiment classification, achieving {metric1}% F1-score in production customer analytics."
    ]
  },
  "product_manager": {
    title: "Senior Product Manager",
    summary: "Results-driven Product Manager with proven success steering customer-centric digital products from concept to high-scale adoption. Adept at bridging engineering, UX, and business goals to drive user acquisition and revenue growth.",
    skills: {
      technical: ["Product Strategy", "Roadmapping", "User Research", "Wireframing", "Jira", "Mixpanel", "Google Analytics", "SQL", "A/B Testing", "PRDs"],
      soft: ["Stakeholder Management", "Executive Presentation", "Agile Leadership", "Design Thinking", "Negotiation", "Customer Empathy"]
    },
    actionVerbs: ["Launched", "Steered", "Defined", "Accelerated", "Spearheaded", "Prioritized", "Analyzed", "Grew"],
    bulletTemplates: [
      "Led end-to-end product discovery and launch of flagship mobile application, scaling to {metric1}k active users within {metric2} months.",
      "Defined product roadmaps and prioritized backlogs for {metric1} cross-functional squads, increasing feature delivery velocity by {metric2}%.",
      "Conducted user research and qualitative interviews with {metric1}+ enterprise clients, directly influencing core UX improvements and cutting churn by {metric2}%.",
      "Drove go-to-market strategy resulting in a {metric1}% increase in quarterly MRR and {metric2}% improvement in customer satisfaction (CSAT)."
    ]
  },
  "frontend_developer": {
    title: "Frontend Engineer / UI Specialist",
    summary: "Creative and detail-oriented Frontend Engineer focused on crafting accessible, pixel-perfect, and ultra-responsive web experiences. Passionate about web performance, clean component design, and modern CSS/JavaScript ecosystems.",
    skills: {
      technical: ["React", "Next.js", "Vue.js", "TypeScript", "Tailwind CSS", "HTML5", "CSS3/Sass", "Redux", "Webpack/Vite", "Responsive Design", "Web Vitals", "Jest"],
      soft: ["Design Systems", "UI/UX Sensibility", "Cross-Browser Compatibility", "Accessibility (a11y)", "Collaborative Problem Solving"]
    },
    actionVerbs: ["Crafted", "Revamped", "Engineered", "Implemented", "Enhanced", "Standardized", "Designed"],
    bulletTemplates: [
      "Revamped primary web client using {tech1} and {tech2}, elevating Lighthouse Core Web Vitals performance score from 62 to 98.",
      "Built and maintained accessible component design system adopted across {metric1} internal web applications, reducing design-to-code time by {metric2}%.",
      "Implemented responsive layouts and fluid state management, decreasing bounce rates by {metric1}% on mobile devices.",
      "Engineered high-performance client-side filtering and search indexing, handling {metric1}k items with sub-50ms render latency."
    ]
  },
  "devops_engineer": {
    title: "DevOps / Cloud Platform Engineer",
    summary: "Proactive DevOps & Platform Engineer specializing in high-availability infrastructure as code, automated CI/CD, and zero-downtime deployments across multi-cloud environments.",
    skills: {
      technical: ["Kubernetes", "Docker", "Terraform", "AWS", "CI/CD", "GitHub Actions", "Prometheus", "Grafana", "Linux", "Bash", "Ansible", "Helm"],
      soft: ["Site Reliability", "Security Best Practices", "Disaster Recovery", "Incident Response", "Cost Optimization"]
    },
    actionVerbs: ["Automated", "Standardized", "Provisioned", "Secured", "Migrated", "Monitored", "Orchestrated"],
    bulletTemplates: [
      "Automated multi-region cloud infrastructure using {tech1} and {tech2}, cutting provisioning time from 3 days to under {metric1} minutes.",
      "Architected Kubernetes microservice clusters with autoscaling, maintaining {metric1}.99% service uptime during peak holiday traffic.",
      "Optimized cloud resource allocation and spot instance utilization, slashing monthly AWS expenses by {metric1}%.",
      "Implemented centralized observability with Prometheus and Grafana, reducing Mean Time to Resolution (MTTR) by {metric1}%."
    ]
  },
  "marketing_specialist": {
    title: "Growth Marketing & Digital Strategist",
    summary: "Data-driven Growth Marketing Strategist with expertise in omni-channel acquisition, SEO, paid media campaigns, and marketing automation. Proven ability to scale customer acquisition while reducing CAC.",
    skills: {
      technical: ["SEO / SEM", "Google Ads", "Meta Ads", "HubSpot", "Google Analytics 4", "Email Marketing", "Content Strategy", "A/B Testing", "Conversion Rate Optimization"],
      soft: ["Brand Storytelling", "Audience Segmentation", "Budget Allocation", "Campaign Optimization", "Creative Direction"]
    },
    actionVerbs: ["Spearheaded", "Scaled", "Executed", "Generated", "Acquired", "Optimized", "Boosted"],
    bulletTemplates: [
      "Spearheaded multi-channel acquisition campaign across Google & Meta, driving {metric1}k new qualified leads and cutting CAC by {metric2}%.",
      "Overhauled technical SEO and organic content strategy, increasing organic search traffic by {metric1}% year-over-year.",
      "Designed automated email nurturing workflows in {tech1}, achieving an industry-leading {metric1}% open rate and {metric2}% click-to-conversion rate.",
      "Managed annual paid media budget of ${metric1}k, generating 3.8x ROAS and accelerating pipeline velocity."
    ]
  }
};

const ATS_ESSENTIAL_CRITERIA = [
  { id: "contact_info", label: "Complete Contact Information (Email, Phone, Location)", weight: 15 },
  { id: "summary", label: "Professional Summary with Target Role", weight: 15 },
  { id: "experience_metrics", label: "Quantified Metrics in Work Experience (% or $ or numbers)", weight: 20 },
  { id: "action_verbs", label: "High-Impact Action Verbs at Start of Bullets", weight: 15 },
  { id: "skills_depth", label: "Categorized Technical & Core Competencies", weight: 15 },
  { id: "education", label: "Clear Education & Degree Credentials", weight: 10 },
  { id: "formatting", label: "ATS-Safe Clean Structure (No complex tables or graphics)", weight: 10 }
];

const ACTION_VERBS = [
  "Accelerated", "Achieved", "Administered", "Advised", "Analyzed", "Architected",
  "Automated", "Built", "Championed", "Coached", "Collaborated", "Conceptualized",
  "Consolidated", "Constructed", "Coordinated", "Created", "Customized", "Decreased",
  "Delivered", "Demonstrated", "Designed", "Developed", "Devised", "Directed",
  "Doubled", "Drafted", "Eliminated", "Engineered", "Enhanced", "Established",
  "Evaluated", "Expanded", "Expedited", "Formulated", "Generated", "Grew",
  "Guided", "Handled", "Headed", "Identified", "Implemented", "Improved",
  "Increased", "Initiated", "Innovated", "Inspected", "Installed", "Instituted",
  "Integrated", "Introduced", "Invented", "Launched", "Led", "Maintained",
  "Managed", "Maximized", "Minimized", "Modernized", "Negotiated", "Operated",
  "Optimized", "Orchestrated", "Organized", "Overhauled", "Oversaw", "Performed",
  "Pioneered", "Planned", "Prepared", "Produced", "Programmed", "Promoted",
  "Proposed", "Published", "Realigned", "Rebuilt", "Redesigned", "Reduced",
  "Refactored", "Regulated", "Reorganized", "Replaced", "Restructured", "Revamped",
  "Reviewed", "Revised", "Revitalized", "Scaled", "Scheduled", "Secured",
  "Selected", "Simplified", "Spearheaded", "Standardized", "Streamlined", "Strengthened",
  "Structured", "Succeeded", "Supervised", "Surpassed", "Targeted", "Trained",
  "Transformed", "Upgraded", "Validated", "Verified", "Yielded"
];

module.exports = {
  ROLE_DATA,
  ATS_ESSENTIAL_CRITERIA,
  ACTION_VERBS
};
