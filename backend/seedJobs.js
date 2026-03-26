const admin = require("firebase-admin");
require("dotenv").config();

const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://job-application-1ce2f-default-rtdb.firebaseio.com/",
});

const db = admin.database();

const jobs = {
  job1: {
    id: "job1",
    title: "Software Engineer",
    company: "TechNova Inc.",
    location: "San Francisco, CA",
    jobType: "Full-time",
    experience: "2-4 years",
    skillsRequired: ["JavaScript", "React", "Node.js", "SQL", "Git"],
    jobDescription:
      "We are looking for a Software Engineer to join our product team. You will build scalable web applications, write clean and maintainable code, collaborate with cross-functional teams, and participate in code reviews. Experience with cloud services (AWS/GCP) is a plus.",
    salaryRange: "$120,000 - $160,000",
    postedDate: "2025-01-15",
  },
  job2: {
    id: "job2",
    title: "Data Scientist",
    company: "DataMinds Analytics",
    location: "New York, NY",
    jobType: "Full-time",
    experience: "3-5 years",
    skillsRequired: ["Python", "TensorFlow", "SQL", "Statistics", "Tableau"],
    jobDescription:
      "Join our data science team to build predictive models, analyze large datasets, and drive business decisions with data. You will work closely with stakeholders to identify opportunities and deliver actionable insights. Experience with NLP and deep learning is preferred.",
    salaryRange: "$130,000 - $170,000",
    postedDate: "2025-01-18",
  },
  job3: {
    id: "job3",
    title: "AI Engineer",
    company: "Cortex AI Labs",
    location: "Seattle, WA",
    jobType: "Full-time",
    experience: "3-6 years",
    skillsRequired: ["Python", "PyTorch", "LLMs", "MLOps", "Docker"],
    jobDescription:
      "We are seeking an AI Engineer to design and deploy large language model applications. You will fine-tune models, build RAG pipelines, optimize inference, and work with our research team on cutting-edge AI products. Strong background in transformer architectures required.",
    salaryRange: "$150,000 - $200,000",
    postedDate: "2025-01-20",
  },
  job4: {
    id: "job4",
    title: "ML Engineer",
    company: "Predictive Systems Co.",
    location: "Austin, TX",
    jobType: "Full-time",
    experience: "2-5 years",
    skillsRequired: ["Python", "Scikit-learn", "Kubernetes", "Spark", "AWS"],
    jobDescription:
      "As an ML Engineer, you will design, build, and maintain machine learning pipelines at scale. Responsibilities include feature engineering, model training, A/B testing, and deploying models to production. Experience with real-time ML serving is a plus.",
    salaryRange: "$125,000 - $165,000",
    postedDate: "2025-01-22",
  },
  job5: {
    id: "job5",
    title: "Frontend Developer",
    company: "PixelPerfect Studios",
    location: "Remote",
    jobType: "Full-time",
    experience: "1-3 years",
    skillsRequired: ["React", "TypeScript", "CSS", "Figma", "Jest"],
    jobDescription:
      "We need a Frontend Developer passionate about crafting beautiful, responsive user interfaces. You will translate design mockups into pixel-perfect components, optimize performance, and ensure cross-browser compatibility. Experience with design systems is valued.",
    salaryRange: "$90,000 - $130,000",
    postedDate: "2025-01-25",
  },
  job6: {
    id: "job6",
    title: "Backend Developer",
    company: "ServerStack Technologies",
    location: "Chicago, IL",
    jobType: "Full-time",
    experience: "3-5 years",
    skillsRequired: ["Node.js", "Express", "PostgreSQL", "Redis", "Docker"],
    jobDescription:
      "Join our backend team to architect and build robust APIs and microservices. You will handle database design, caching strategies, authentication, and system performance optimization. Experience with event-driven architectures and message queues is preferred.",
    salaryRange: "$115,000 - $155,000",
    postedDate: "2025-01-28",
  },
  job7: {
    id: "job7",
    title: "Full Stack Developer",
    company: "OmniWeb Solutions",
    location: "Denver, CO",
    jobType: "Full-time",
    experience: "2-4 years",
    skillsRequired: ["React", "Node.js", "MongoDB", "TypeScript", "AWS"],
    jobDescription:
      "Looking for a Full Stack Developer who can own features end-to-end. You will build both client and server components, design database schemas, write tests, and deploy to cloud infrastructure. Startup experience and comfort with ambiguity is valued.",
    salaryRange: "$110,000 - $150,000",
    postedDate: "2025-02-01",
  },
  job8: {
    id: "job8",
    title: "Cloud Engineer",
    company: "Cumulus Cloud Corp",
    location: "Remote",
    jobType: "Full-time",
    experience: "3-6 years",
    skillsRequired: ["AWS", "Terraform", "Kubernetes", "CI/CD", "Linux"],
    jobDescription:
      "We are looking for a Cloud Engineer to design and manage our cloud infrastructure. Responsibilities include provisioning resources with IaC, setting up monitoring, managing Kubernetes clusters, and ensuring high availability. Multi-cloud experience is a bonus.",
    salaryRange: "$135,000 - $175,000",
    postedDate: "2025-02-03",
  },
  job9: {
    id: "job9",
    title: "DevOps Engineer",
    company: "PipelinePro Inc.",
    location: "Boston, MA",
    jobType: "Full-time",
    experience: "2-5 years",
    skillsRequired: ["Docker", "Jenkins", "AWS", "Python", "Ansible"],
    jobDescription:
      "As a DevOps Engineer, you will automate deployment pipelines, manage infrastructure as code, implement monitoring and alerting, and improve system reliability. You will work closely with development teams to streamline the software delivery lifecycle.",
    salaryRange: "$120,000 - $160,000",
    postedDate: "2025-02-05",
  },
  job10: {
    id: "job10",
    title: "Cybersecurity Analyst",
    company: "SecureShield Labs",
    location: "Washington, DC",
    jobType: "Full-time",
    experience: "2-4 years",
    skillsRequired: ["SIEM", "Firewalls", "Python", "Penetration Testing", "ISO 27001"],
    jobDescription:
      "Join our security team to protect enterprise systems from cyber threats. You will conduct vulnerability assessments, monitor security events, respond to incidents, and implement security best practices. CISSP or CEH certification is preferred.",
    salaryRange: "$110,000 - $145,000",
    postedDate: "2025-02-07",
  },
  job11: {
    id: "job11",
    title: "Business Analyst",
    company: "InsightBridge Consulting",
    location: "Atlanta, GA",
    jobType: "Full-time",
    experience: "2-4 years",
    skillsRequired: ["SQL", "Excel", "Jira", "Requirements Gathering", "Agile"],
    jobDescription:
      "We are hiring a Business Analyst to bridge the gap between business stakeholders and technical teams. You will gather requirements, create user stories, analyze processes, and facilitate sprint planning. Experience in financial services or healthcare is a plus.",
    salaryRange: "$85,000 - $115,000",
    postedDate: "2025-02-09",
  },
  job12: {
    id: "job12",
    title: "Product Manager",
    company: "LaunchPad Products",
    location: "San Jose, CA",
    jobType: "Full-time",
    experience: "4-7 years",
    skillsRequired: ["Product Strategy", "Agile", "Analytics", "User Research", "Roadmapping"],
    jobDescription:
      "Lead product strategy and execution for our SaaS platform. You will define the product roadmap, prioritize features based on user data, collaborate with engineering and design, and drive product launches. Experience with B2B SaaS products and data-driven decision making required.",
    salaryRange: "$140,000 - $180,000",
    postedDate: "2025-02-10",
  },
  job13: {
    id: "job13",
    title: "Data Analyst",
    company: "MetricFlow Inc.",
    location: "Portland, OR",
    jobType: "Full-time",
    experience: "1-3 years",
    skillsRequired: ["SQL", "Python", "Tableau", "Excel", "Statistics"],
    jobDescription:
      "We need a Data Analyst to transform raw data into meaningful business insights. You will build dashboards, run ad-hoc analyses, create automated reports, and collaborate with stakeholders across marketing, product, and operations teams.",
    salaryRange: "$75,000 - $105,000",
    postedDate: "2025-02-11",
  },
  job14: {
    id: "job14",
    title: "Research Engineer",
    company: "DeepThink Research",
    location: "Palo Alto, CA",
    jobType: "Full-time",
    experience: "3-6 years",
    skillsRequired: ["Python", "PyTorch", "Research Papers", "CUDA", "Mathematics"],
    jobDescription:
      "Join our research lab to push the boundaries of machine learning. You will implement state-of-the-art papers, design novel architectures, run large-scale experiments, and publish at top conferences. Strong mathematical background and publication record preferred.",
    salaryRange: "$160,000 - $220,000",
    postedDate: "2025-02-12",
  },
  job15: {
    id: "job15",
    title: "QA Engineer",
    company: "QualityFirst Software",
    location: "Remote",
    jobType: "Full-time",
    experience: "2-4 years",
    skillsRequired: ["Selenium", "Cypress", "JavaScript", "API Testing", "CI/CD"],
    jobDescription:
      "We are looking for a QA Engineer to ensure our software meets the highest quality standards. You will design test plans, write automated tests, perform regression testing, and work with developers to identify and fix defects. Experience with performance testing tools is a bonus.",
    salaryRange: "$90,000 - $125,000",
    postedDate: "2025-02-13",
  },
};

async function seedJobs() {
  try {
    console.log("Seeding jobs to Firebase...");
    await db.ref("jobs").set(jobs);
    console.log(`Successfully seeded ${Object.keys(jobs).length} jobs!`);
    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
}

seedJobs();
