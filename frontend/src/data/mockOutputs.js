export const MOCK_OUTPUTS = {
  intelligence: {
    aspire: {
      sections: [
        {
          title: "Likely Pain Points",
          items: [
            "Inconsistent execution despite ongoing training programs.",
            "Managers cannot systematically improve team performance.",
            "Training ROI is hard to prove after programs are delivered.",
          ],
        },
        {
          title: "Industry Insight",
          text: "Large service teams usually have enough training content. The gap is daily execution, manager visibility, and consistent behavior change after training.",
        },
        {
          title: "Recommended Pitch Angle",
          text: "Lead with measurable performance improvement. Position Aspire as a daily execution system, not another LMS or training program.",
        },
        {
          title: "Discovery Questions",
          items: [
            "How do you measure whether training changes daily performance?",
            "What happens when a manager identifies an underperformer today?",
            "What would you show leadership as proof of improvement?",
          ],
        },
        {
          title: "Personalized Outreach Draft",
          copyable: true,
          text: "Hi [Name],\n\nMost teams invest heavily in training, but still struggle to make execution consistent on the floor.\n\nWe help companies turn training into measurable daily performance improvement through manager visibility and structured execution tracking.\n\nWould it be relevant to explore this for your teams?",
        },
      ],
    },
    thriving: {
      sections: [
        {
          title: "Likely Pain Points",
          items: [
            "Attrition in critical roles without clear root cause visibility.",
            "Engagement surveys exist, but action ownership is unclear.",
            "Leadership needs sharper people intelligence for decisions.",
          ],
        },
        {
          title: "Industry Insight",
          text: "Companies in scaling stages often have people data, but not enough diagnosis. The opportunity is to connect sentiment, root causes, action plans, and leadership accountability.",
        },
        {
          title: "Recommended Pitch Angle",
          text: "Lead with attrition clarity and organizational intelligence. Position Thriving Workplace as the system that explains why problems are happening and what leaders should do next.",
        },
        {
          title: "Discovery Questions",
          items: [
            "How confident are you about what is really driving attrition?",
            "What changed after your last engagement survey?",
            "Where does leadership need better people visibility today?",
          ],
        },
        {
          title: "Personalized Outreach Draft",
          copyable: true,
          text: "Hi [Name],\n\nQuick question: are you confident you know what is actually driving attrition across your teams?\n\nWe help companies move beyond engagement scores into root-cause clarity, action ownership, and measurable people outcomes.\n\nWould it be useful to compare notes?",
        },
      ],
    },
  },
  icp: {
    aspire: {
      fitLevel: "High Fit",
      aspireScore: 8,
      thrivingScore: 7,
      urgency: "High",
      budget: "Medium-High",
      recommendation: "Lead with Aspire. Strong execution gap signals.",
      reasoning: "The company has enough scale for manager-led performance systems, measurable output improvement, and a clear training ROI conversation.",
    },
    thriving: {
      fitLevel: "High Fit",
      aspireScore: 7,
      thrivingScore: 9,
      urgency: "High",
      budget: "High",
      recommendation: "Lead with Thriving Workplace. Attrition and culture signals are strong.",
      reasoning: "The prospect has the scale and people complexity where root-cause diagnosis, leadership visibility, and action planning become valuable.",
    },
  },
  discovery: {
    aspire: {
      sections: [
        {
          title: "Call Brief",
          text: "Assume the buyer already has training programs. Diagnose whether those programs are creating measurable execution change before pitching.",
        },
        {
          title: "Top Questions",
          items: [
            "How do managers track improvement between review cycles?",
            "Where does performance drop most often?",
            "What does success look like 60 days after training?",
          ],
        },
        {
          title: "Best Pitch Angle",
          text: "Frame Aspire as the operating system for turning learning into daily performance improvement.",
        },
      ],
    },
    thriving: {
      sections: [
        {
          title: "Call Brief",
          text: "Start with the business cost of attrition, engagement gaps, and slow action cycles. Keep the conversation strategic.",
        },
        {
          title: "Top Questions",
          items: [
            "What people problem is most expensive right now?",
            "How do you decide which HR actions to prioritize?",
            "How do leaders know whether actions worked?",
          ],
        },
        {
          title: "Best Pitch Angle",
          text: "Frame Thriving Workplace as an intelligence layer that helps leaders understand people risks and act with ownership.",
        },
      ],
    },
  },
  outreach: {
    aspire: {
      messages: [
        {
          channel: "LinkedIn DM",
          content: "Hi [Name],\n\nAfter training programs, how much actually changes in daily execution?\n\nWe help teams close that gap through measurable execution tracking and manager visibility. Open to a quick conversation?",
        },
        {
          channel: "Cold Email",
          subject: "Quick thought on performance gaps at [Company]",
          content: "Hi [Name],\n\nMany teams invest in training but still struggle with execution consistency.\n\nWe help companies convert training into measurable daily performance improvement.\n\nWould 20 minutes next week be useful?",
        },
      ],
    },
    thriving: {
      messages: [
        {
          channel: "LinkedIn DM",
          content: "Hi [Name],\n\nAre you confident you know what is actually driving attrition across your teams?\n\nWe help companies move beyond engagement scores into root-cause clarity and action ownership. Worth comparing notes?",
        },
        {
          channel: "Cold Email",
          subject: "What is really driving attrition at [Company]?",
          content: "Hi [Name],\n\nEngagement surveys often show what employees say, but not always why problems continue.\n\nWe help companies identify root causes and build action plans leaders can own.\n\nWorth a short conversation?",
        },
      ],
    },
  },
};
