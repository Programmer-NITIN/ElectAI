/**
 * Static election data for ElectAI.
 *
 * Contains curated, ECI-sourced educational content that serves as:
 * 1. Fallback data when AI providers are unavailable (demo mode)
 * 2. Default tool output for generative UI components
 * 3. Rich educational content for offline scenarios
 *
 * All data is apolitical, factual, and sourced from official ECI resources.
 *
 * @module election-data
 * @see https://eci.gov.in
 */

import type {
  ConstituencyRoadmap,
  EVMSimulatorOutput,
  FactCardOutput,
  ChecklistOutput,
  Form6WizardOutput,
} from "./schemas";

// ── EVM Voting Steps ──────────────────────────────────────────────────

/** Default EVM voting process steps for the simulator. */
export const EVM_VOTING_STEPS: EVMSimulatorOutput = {
  title: "EVM Voting Process — Step by Step",
  description: "Learn how Electronic Voting Machines (EVM) and VVPAT work on election day.",
  steps: [
    {
      id: "step-1",
      title: "Arrive at Polling Booth",
      description: "Go to your assigned polling station on election day between 7 AM and 6 PM.",
      instruction: "Carry your Voter ID (EPIC card) or any approved photo ID.",
      icon: "🏛️",
    },
    {
      id: "step-2",
      title: "Identity Verification",
      description: "Present your EPIC card or approved ID to the polling officer at the entrance.",
      instruction: "The officer will check your name against the electoral roll.",
      icon: "🪪",
    },
    {
      id: "step-3",
      title: "Ink Application",
      description: "Indelible ink is applied to the nail of your left index finger.",
      instruction: "This prevents duplicate voting and is non-removable for 72 hours.",
      icon: "✍️",
    },
    {
      id: "step-4",
      title: "Receive Voter Slip",
      description: "Collect your signed voter slip from the second polling officer.",
      instruction: "Verify your details — name, serial number, and constituency.",
      icon: "📋",
    },
    {
      id: "step-5",
      title: "Enter the Voting Compartment",
      description: "Proceed to the private voting compartment with the EVM Ballot Unit.",
      instruction: "Only one voter is allowed in the compartment at a time.",
      icon: "🗳️",
    },
    {
      id: "step-6",
      title: "Cast Your Vote on EVM",
      description: "Press the blue button next to your chosen candidate's name and symbol.",
      instruction: "A beep sound and a red light confirms your vote has been recorded.",
      icon: "🔘",
    },
    {
      id: "step-7",
      title: "Verify on VVPAT",
      description: "The VVPAT machine displays a printed slip for 7 seconds showing your choice.",
      instruction: "Verify that the printed slip matches your intended candidate.",
      icon: "🖨️",
    },
    {
      id: "step-8",
      title: "Exit the Booth",
      description: "Leave the polling station after casting your vote.",
      instruction: "Your civic duty is complete! Results are announced after counting day.",
      icon: "✅",
    },
  ],
};

// ── Constituency Roadmap ──────────────────────────────────────────────

/** Default election phases timeline. */
export const CONSTITUENCY_ROADMAP: ConstituencyRoadmap = {
  title: "Indian General Election Timeline",
  description: "Key phases of the election process from announcement to results.",
  steps: [
    {
      id: "phase-1",
      title: "Election Announcement",
      description:
        "The Election Commission announces the election schedule and Model Code of Conduct comes into effect.",
      date: "45-60 days before polling",
      status: "completed",
      icon: "📢",
    },
    {
      id: "phase-2",
      title: "Nomination Filing",
      description: "Candidates file their nomination papers with the Returning Officer.",
      details:
        "Candidates must submit affidavits declaring assets, criminal cases, and educational qualifications.",
      date: "30-35 days before polling",
      status: "completed",
      icon: "📝",
    },
    {
      id: "phase-3",
      title: "Scrutiny of Nominations",
      description: "The Returning Officer examines all nomination papers for validity.",
      date: "28-30 days before polling",
      status: "completed",
      icon: "🔍",
    },
    {
      id: "phase-4",
      title: "Withdrawal of Candidature",
      description: "Last date for candidates to withdraw their nominations.",
      date: "25-27 days before polling",
      status: "current",
      icon: "↩️",
    },
    {
      id: "phase-5",
      title: "Campaign Period",
      description:
        "Candidates campaign in their constituencies. Campaign must stop 48 hours before polling.",
      details: "No campaigning allowed 48 hours before polling day (silence period).",
      date: "2-25 days before polling",
      status: "upcoming",
      icon: "📣",
    },
    {
      id: "phase-6",
      title: "Polling Day",
      description: "Voters cast their ballots at assigned polling stations using EVMs.",
      details: "Polling hours: 7:00 AM to 6:00 PM. Voters in queue at 6 PM are allowed to vote.",
      date: "Polling day",
      status: "upcoming",
      icon: "🗳️",
    },
    {
      id: "phase-7",
      title: "Counting Day",
      description: "EVMs are unsealed and votes are counted under strict supervision.",
      details: "Counting begins at 8:00 AM. VVPAT slips of 5 random booths are also verified.",
      date: "3-4 days after last polling phase",
      status: "upcoming",
      icon: "📊",
    },
    {
      id: "phase-8",
      title: "Results Declaration",
      description: "The Election Commission announces results and winning candidates.",
      date: "Counting day evening",
      status: "upcoming",
      icon: "🏆",
    },
  ],
};

// ── ECI Facts ─────────────────────────────────────────────────────────

/** Key facts about the Election Commission of India. */
export const ECI_FACTS: FactCardOutput = {
  title: "Election Commission of India — Key Facts",
  summary:
    "The ECI is an autonomous constitutional authority responsible for administering elections in India.",
  facts: [
    { label: "Established", value: "25 January 1950", icon: "📅" },
    { label: "Headquarters", value: "New Delhi", icon: "🏛️" },
    { label: "Total Voters (2024)", value: "97+ Crore", icon: "🗳️" },
    { label: "Polling Stations", value: "10.5+ Lakh", icon: "🏢" },
    { label: "Lok Sabha Seats", value: "543", icon: "🪑" },
    { label: "Rajya Sabha Seats", value: "245", icon: "🪑" },
    { label: "State Assemblies", value: "28 States + 2 UTs", icon: "🗺️" },
    { label: "Constitutional Article", value: "Article 324", icon: "📜" },
  ],
  sources: [
    { title: "Election Commission of India", url: "https://eci.gov.in" },
    { title: "National Voters' Service Portal", url: "https://www.nvsp.in" },
  ],
};

// ── Voter Registration Checklist ──────────────────────────────────────

/** Default voter registration checklist items. */
export const VOTER_REGISTRATION_CHECKLIST: ChecklistOutput = {
  title: "Voter Registration Checklist",
  description: "Complete these steps to register as a voter in India.",
  items: [
    {
      id: "check-1",
      text: "Check if you are already registered",
      description: "Visit the NVSP portal or call 1950 to verify your registration status.",
      url: "https://www.nvsp.in",
      priority: "high",
      completed: false,
    },
    {
      id: "check-2",
      text: "Gather required documents",
      description: "Aadhaar card, passport, or any government-issued photo ID proof.",
      priority: "high",
      completed: false,
    },
    {
      id: "check-3",
      text: "Fill Form 6 (New Registration)",
      description: "Available online at NVSP portal or at your local ERO office.",
      url: "https://www.nvsp.in/Forms/Forms/form6",
      priority: "high",
      completed: false,
    },
    {
      id: "check-4",
      text: "Submit passport-size photograph",
      description: "Recent color photograph with white background.",
      priority: "medium",
      completed: false,
    },
    {
      id: "check-5",
      text: "Address proof submission",
      description: "Utility bill, bank passbook, rent agreement, or Aadhaar.",
      priority: "medium",
      completed: false,
    },
    {
      id: "check-6",
      text: "Age proof submission",
      description: "Birth certificate, school leaving certificate, or Aadhaar.",
      priority: "medium",
      completed: false,
    },
    {
      id: "check-7",
      text: "Track application status",
      description: "Use the reference number to track your application on NVSP.",
      url: "https://www.nvsp.in/Forms/Forms/trackstatus",
      priority: "low",
      completed: false,
    },
    {
      id: "check-8",
      text: "Collect your Voter ID (EPIC card)",
      description: "Once approved, collect your EPIC card from the ERO office or download e-EPIC.",
      url: "https://voterportal.eci.gov.in",
      priority: "low",
      completed: false,
    },
  ],
};

// ── Default Form 6 Wizard Output ──────────────────────────────────────

/** Default eligibility output for the Form 6 wizard. */
export const DEFAULT_FORM6_OUTPUT: Form6WizardOutput = {
  state: "Maharashtra",
  eligible: true,
  summary: "Based on the information provided, you appear to be eligible to register as a voter.",
  requirements: [
    {
      id: "req-1",
      label: "Indian Citizenship",
      description: "You must be a citizen of India.",
      met: true,
      category: "citizenship",
    },
    {
      id: "req-2",
      label: "Minimum Age (18 years)",
      description: "You must be at least 18 years old on the qualifying date (1st January).",
      met: true,
      category: "age",
    },
    {
      id: "req-3",
      label: "Ordinary Resident",
      description:
        "You must be an ordinary resident of the constituency where you wish to register.",
      met: true,
      category: "residency",
    },
    {
      id: "req-4",
      label: "Not Already Registered",
      description: "You should not already be registered as a voter in another constituency.",
      met: false,
      category: "registration",
    },
    {
      id: "req-5",
      label: "Valid ID Proof",
      description: "Aadhaar, Passport, Driving License, PAN Card, or Ration Card.",
      met: true,
      category: "id",
    },
  ],
  registrationUrl: "https://www.nvsp.in/Forms/Forms/form6",
};

// ── Indian States & UTs ───────────────────────────────────────────────

/** List of all Indian states and union territories. */
export const INDIAN_STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Andaman & Nicobar Islands",
  "Chandigarh",
  "Dadra & Nagar Haveli and Daman & Diu",
  "Delhi",
  "Jammu & Kashmir",
  "Ladakh",
  "Lakshadweep",
  "Puducherry",
] as const;

/** Type for a valid Indian state or UT name. */
export type IndianState = (typeof INDIAN_STATES)[number];

// ── Demo Mode Responses ───────────────────────────────────────────────

/** Keyword-to-intent mapping for demo mode (no API key). */
export const DEMO_INTENTS: Record<string, string> = {
  register:
    "To register as a voter in India, you need to fill Form 6 on the NVSP portal (nvsp.in). You'll need: Aadhaar card or other ID proof, address proof, passport photo, and age proof. You must be at least 18 years old on January 1st of the qualifying year.",
  evm: "The Electronic Voting Machine (EVM) is used in Indian elections. It has a Ballot Unit where you press the blue button next to your candidate's name. The Control Unit records votes. A VVPAT machine prints a slip showing your choice for 7 seconds for verification.",
  vote: "To vote in India: 1) Check your name in the electoral roll at nvsp.in 2) Go to your assigned polling booth on election day (7AM-6PM) 3) Carry your EPIC card or approved photo ID 4) Get ink on your finger 5) Enter the voting booth 6) Press the button next to your candidate 7) Verify on VVPAT.",
  form6:
    "Form 6 is the application form for new voter registration. You can fill it online at nvsp.in or submit it physically at your local ERO office. Required documents: ID proof (Aadhaar/Passport), address proof, passport photo, and age proof (birth certificate).",
  timeline:
    "Indian election timeline: 1) Election announcement (45-60 days before) 2) Nominations filed (30-35 days before) 3) Scrutiny (28-30 days before) 4) Withdrawal deadline (25-27 days before) 5) Campaign period (ends 48 hours before polling) 6) Polling day 7) Counting (3-4 days after) 8) Results.",
  eligibility:
    "To be eligible to vote in India: 1) You must be an Indian citizen 2) You must be at least 18 years old on January 1st of the qualifying year 3) You must be an ordinary resident of your constituency 4) You must not be disqualified under any law.",
  booth:
    "To find your polling booth: 1) Visit voterportal.eci.gov.in 2) Enter your EPIC number or search by name 3) Your booth details (name, address, booth number) will be displayed. You can also call 1950 for assistance.",
};
