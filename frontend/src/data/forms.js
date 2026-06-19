const industries = [
  "BPO / KPO / Medical Coding",
  "Healthcare / Hospitals",
  "NBFC / Financial Services",
  "Retail / F&B",
  "SaaS / IT",
  "Hospitality",
  "Manufacturing",
  "Other",
];

const sizes = ["50-100", "100-300", "300-600", "600-1000", "1000-2000", "2000+"];

const personas = [
  "Founder / CEO",
  "Leadership / Management / MD",
  "Sales Head / Business Head",
  "CHRO / HR Head",
  "L&D Head",
  "Operations Head",
];

export const TOOL_FORMS = {
  intelligence: {
    title: "Sales Intelligence Copilot",
    description: "Enter company details to generate a full sales intelligence report.",
    fields: [
      { id: "company", label: "Company Name", type: "text", placeholder: "e.g. MedFirst Coding Solutions" },
      { id: "website", label: "Company Website", type: "text", placeholder: "e.g. https://medfirst.com" },
      { id: "linkedinUrl", label: "LinkedIn Company Profile", type: "text", placeholder: "https://www.linkedin.com/company/example" },
      { id: "industry", label: "Industry", type: "select", options: industries },
      { id: "size", label: "Employee Size", type: "select", options: sizes },
      { id: "persona", label: "Point of Contact", type: "select", options: personas },
      { id: "linkedin", label: "LinkedIn Profile", type: "text", placeholder: "e.g. https://linkedin.com/in/name" },
      { id: "pain", label: "Pain Points Known", type: "text", placeholder: "e.g. High attrition, inconsistent team performance" },
      { id: "location", label: "Location", type: "text", placeholder: "e.g. Bangalore, India" },
    ],
  },
  "opportunity-discovery": {
    title: "Opportunity Analysis & Discovery",
    description: "Qualify deal opportunities and prepare for discovery calls in one unified analysis.",
    fields: [
      { id: "company", label: "Company Name", type: "text", placeholder: "e.g. Acme Corp" },
      { id: "website", label: "Company Website", type: "text", placeholder: "e.g. steel.tata.com" },
      { id: "industry", label: "Industry", type: "select", options: industries },
      { id: "targetFunction", label: "Target Function", type: "text", placeholder: "e.g. Sales Team, Healthcare Operations..." },
      { id: "size", label: "Employee Size", type: "select", options: sizes },
      { id: "persona", label: "Contact Role/Persona", type: "select", options: personas },
      { id: "context", label: "What do you already know / Context", type: "textarea", placeholder: "e.g. They mentioned attrition or training budget constraints..." },
    ],
  },
  outreach: {
    title: "Outreach Generator",
    description: "Generate ready-to-send messages for every channel and stage.",
    fields: [
      { id: "company", label: "Company Name", type: "text", placeholder: "e.g. NovaTech Solutions" },
      { id: "industry", label: "Industry", type: "select", options: industries },
      { id: "persona", label: "Contact Persona", type: "select", options: personas },
      { id: "stage", label: "Sales Stage", type: "select", options: ["Cold Outreach", "Post First Call", "Follow-up Day 3", "Follow-up Day 7", "Closing"] },
      { id: "pain", label: "Known Pain Point", type: "text", placeholder: "e.g. Attrition in critical roles" },
    ],
  },
  execution: {
    title: "Deal Execution Coach",
    description: "Analyze your meeting notes and deal details to get coached on winning next steps.",
    fields: [
      { id: "company", label: "Company Name", type: "text", placeholder: "e.g. Acme Corp" },
      { id: "meetingNotes", label: "Meeting Notes", type: "textarea", placeholder: "e.g. Discussed training budget, interested in Aspire program..." },
      { id: "stakeholders", label: "Stakeholders", type: "textarea", placeholder: "e.g. HR Director (champion), CFO (budget sign-off)" },
      { id: "challenges", label: "Challenges", type: "textarea", placeholder: "e.g. CFO worried about ROI, competitor X pitch tomorrow" },
      { id: "clientObjection", label: "Client Objection", type: "textarea", placeholder: "e.g., 'This feels soft.' or 'We can't afford this right now'" },
    ],
  },
  proposal: {
    title: "Proposal Intelligence Engine",
    description: "Generate a comprehensive proposal framework tailored to the prospect's needs.",
    fields: [
      { id: "company", label: "Company Name", type: "text", placeholder: "e.g. Acme Corp" },
      { id: "industry", label: "Industry", type: "select", options: industries },
      { id: "pain", label: "Pain Points", type: "textarea", placeholder: "e.g. High attrition, training gaps..." },
      { id: "size", label: "Team Size", type: "select", options: sizes },
    ],
  },
};

export function getFormFields(toolId, agent) {
  const isThriving = agent?.toLowerCase().includes("thriving");
  let rawFields = [];

  if (toolId === "opportunity-discovery" || toolId === "icp") {
    if (isThriving) {
      rawFields = [
        { id: "company", label: "Company Name", type: "text", placeholder: "e.g. Acme Corp" },
        { id: "website", label: "Company Website", type: "text", placeholder: "e.g., steel.tata.com" },
        { id: "industry", label: "Industry", type: "select", options: industries },
        { id: "size", label: "Employee Count", type: "select", options: sizes },
        { id: "hiringStatus", label: "Hiring Status", type: "text", placeholder: "e.g. Hiring aggressively, flat, frozen..." },
        { id: "knownIssues", label: "Known Issues / Context", type: "textarea", placeholder: "e.g. Recognition, Manager quality, Career growth, Generational conflict..." }
      ];
    } else {
      rawFields = [
        { id: "company", label: "Company Name", type: "text", placeholder: "e.g. Acme Corp" },
        { id: "website", label: "Company Website", type: "text", placeholder: "e.g., steel.tata.com" },
        { id: "industry", label: "Industry", type: "select", options: industries },
        { id: "targetFunction", label: "Target Function", type: "text", placeholder: "e.g. Sales Team, Healthcare Operations..." }
      ];
    }
  } else {
    rawFields = TOOL_FORMS[toolId]?.fields || [];
  }

  const companyIndex = rawFields.findIndex((f) => f.id === "company");
  const hasWebsite = rawFields.some((f) => f.id === "website");
  if (companyIndex !== -1 && !hasWebsite) {
    const updated = [...rawFields];
    updated.splice(companyIndex + 1, 0, {
      id: "website",
      label: "Company Website",
      type: "text",
      placeholder: "e.g., steel.tata.com"
    });
    return updated;
  }

  return rawFields;
}
