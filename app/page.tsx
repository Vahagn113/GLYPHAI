"use client";

import React, { useState, useRef, useEffect } from "react";
import { BeforeVsAfterWorkspace, getDisplayableOrDownloadableText, renderVisualStructuredResult } from "@/components/extraction/ResultViewer";
import { translations as TRANSLATIONS } from "@/lib/translations";
import { ALLOWED_CV_FILE_TYPES, validateFile } from "@/lib/fileValidation";
import { copyToClipboard, downloadAsTxt, downloadBlob } from "@/lib/exportUtils";
import type { ChatMessage, SampleDocument, HighlightBox, Language, DemoPreset, CvDemoPreset } from "@/lib/types";
import { motion, AnimatePresence } from "motion/react";
import {
  Upload,
  FileText,
  Copy,
  Check,
  Download,
  Edit2,
  Trash2,
  MessageSquare,
  Sparkles,
  RefreshCw,
  Eye,
  AlertCircle,
  HelpCircle,
  Send,
  Layers,
  FileSpreadsheet,
  FileCheck,
  Sun,
  Moon,
  Globe,
  Instagram,
  ChevronDown,
  ArrowRight,
  ShieldCheck,
  Zap,
  BookOpen,
  Menu,
  X,
  ZoomIn,
  ZoomOut,
  Maximize2,
  ChevronLeft,
  ChevronRight,
  Gauge,
  TrendingUp,
  ShieldAlert,
  Briefcase,
  Target,
  Palette,
  Award
} from "lucide-react";

const CV_POSITION_CATEGORIES = [
  "Data Analyst",
  "Business Analyst",
  "Financial Analyst",
  "Product Manager",
  "Project Manager",
  "Operations Manager",
  "Software Engineer",
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "QA Engineer",
  "DevOps Engineer",
  "Cybersecurity Analyst",
  "Cloud Engineer",
  "Machine Learning Engineer",
  "AI Engineer",
  "Data Scientist",
  "Data Engineer",
  "UX/UI Designer",
  "Graphic Designer",
  "Digital Marketing Specialist",
  "SEO Specialist",
  "Content Manager",
  "Sales Manager",
  "Account Executive",
  "Customer Success Manager",
  "HR Specialist",
  "Recruiter",
  "Administrative Assistant",
  "Executive Assistant",
  "Legal Assistant",
  "Teacher",
  "Nurse",
  "Healthcare Administrator",
  "Logistics Coordinator",
  "Supply Chain Analyst",
  "Civil Engineer",
  "Mechanical Engineer",
  "Electrical Engineer",
  "Architect",
  "Research Assistant",
  "Consultant",
  "Entrepreneur",
];

const CV_TEMPLATES = [
  {
    id: "modern-ats",
    name: "Modern ATS",
    desc: "Clean headings, recruiter-friendly structure, strong keyword density.",
  },
  {
    id: "executive",
    name: "Executive",
    desc: "Leadership profile with strategic impact and concise achievements.",
  },
  {
    id: "technical",
    name: "Technical",
    desc: "Skills matrix, projects, tools, and engineering achievements up front.",
  },
  {
    id: "creative",
    name: "Creative Pro",
    desc: "Stylish but still export-safe for design, marketing, and content roles.",
  },
  {
    id: "graduate",
    name: "Graduate",
    desc: "Education, projects, internships, and transferable skills emphasized.",
  },
];

const CV_FOCUS_AREAS = [
  "ATS keywords",
  "Measurable achievements",
  "Leadership impact",
  "Technical skills",
  "Transferable skills",
  "Grammar polish",
  "Shorter one-page style",
  "International format",
];

const CV_TONES = [
  "Confident professional",
  "Bold leadership",
  "Technical expert",
  "Creative innovator",
  "Strategic thinker",
  "Collaborative team player",
];

const CV_SENIORITY_LEVELS = [
  "Adaptive",
  "Junior (0-3 years)",
  "Mid-level (3-6 years)",
  "Senior (6-10 years)",
  "Executive (10+ years)",
];

const SAMPLES: SampleDocument[] = [
  {
    name: "Handwritten Meeting Notes.png",
    type: "image/png",
    mimeType: "image/png",
    size: "142 KB",
    mockData: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='250' viewBox='0 0 400 250'><rect width='100%' height='100%' fill='%23FAF6F0'/><path d='M30 40 L370 40' stroke='%23eeded5' stroke-width='1'/><path d='M30 80 L370 80' stroke='%23eeded5' stroke-dasharray='4' stroke-width='1'/><path d='M30 120 L370 120' stroke='%23eeded5' stroke-dasharray='4' stroke-width='1'/><path d='M30 160 L370 160' stroke='%23eeded5' stroke-dasharray='4' stroke-width='1'/><text x='40' y='65' font-family='sans-serif' font-size='16' fill='%235A4A42' font-style='italic'>Project Warmth - Core Milestones</text><text x='40' y='105' font-family='sans-serif' font-size='14' fill='%237D6B60' font-style='italic'>* Launch cozy warm theme by early June (Antigravity to test)</text><text x='40' y='145' font-family='sans-serif' font-size='14' fill='%237D6B60' font-style='italic'>* Integrate full-featured homepage & micro OCR simulator</text><text x='40' y='185' font-family='sans-serif' font-size='14' fill='%23B2533E' font-weight='bold' font-style='italic'>Notice: Safe sandboxed local storage used.</text></svg>",
    initialExtract: `# Project Warmth - Core Milestones

*   **Milestone 1:** Launch cozy warm theme by early June (Antigravity will execute testing protocols).
*   **Milestone 2:** Integrate the premium homepage alongside an interactive micro OCR simulator engine.
*   **Crucial Reminder:** Keep all local persistent metadata safely sandboxed within local storage parameters.`
  },
  {
    name: "Acoustic Tavern Invoice.jpg",
    type: "image/jpeg",
    mimeType: "image/jpeg",
    size: "94 KB",
    mockData: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='250' viewBox='0 0 400 250'><rect width='100%' height='100%' fill='%23F4EFEA'/><text x='110' y='40' font-family='monospace' font-size='18' font-weight='bold' fill='%233C2F2F'>ACOUSTIC TAVERNA</text><text x='120' y='60' font-family='monospace' font-size='11' fill='%237D6B60'>102 Cozy Way, Boston</text><text x='50' y='110' font-family='monospace' font-size='12' fill='%235A4A42'>2x Warm Cinnamon Latte...$12.00</text><text x='50' y='135' font-family='monospace' font-size='12' fill='%235A4A42'>1x Fresh Baked Croissant..$6.50</text><text x='50' y='160' font-family='monospace' font-size='12' fill='%235A4A42'>1x Honey Apple Galette....$8.00</text><text x='50' y='190' font-family='monospace' font-size='12' font-weight='bold' fill='%233C2F2F'>Total Paid...............$26.50</text></svg>",
    initialExtract: `| Item | Qty | Price |
| :--- | :---: | :---: |
| Warm Cinnamon Latte | 2 | $12.00 |
| Fresh Baked Croissant | 1 | $6.50 |
| Honey Apple Galette | 1 | $8.00 |

**Financial Summary:**
*   **TOTAL AMOUNT PAID:** $26.50
*   **Merchant:** ACOUSTIC TAVERNA, 102 Cozy Way, Boston`
  }
];

const DOCUMENT_HIGHLIGHT_MAP: Record<string, HighlightBox[]> = {
  invoice: [
    { field: "vendorName", label: "Vendor Name", top: 4, left: 4, width: 34, height: 6 },
    { field: "vendorAddress", label: "Vendor Address", top: 11, left: 4, width: 34, height: 8 },
    { field: "invoiceNumber", label: "Invoice Number", top: 4, left: 60, width: 36, height: 6 },
    { field: "invoiceDate", label: "Invoice Date", top: 11, left: 60, width: 36, height: 5 },
    { field: "dueDate", label: "Due Date", top: 17, left: 60, width: 36, height: 5 },
    { field: "billingName", label: "Billing Name", top: 22, left: 4, width: 44, height: 6 },
    { field: "billingAddress", label: "Billing Address", top: 29, left: 4, width: 44, height: 8 },
    { field: "lineItems", label: "Line Items Table", top: 41, left: 4, width: 92, height: 26 },
    { field: "subtotal", label: "Subtotal", top: 70, left: 60, width: 36, height: 4 },
    { field: "tax", label: "Tax", top: 75, left: 60, width: 36, height: 4 },
    { field: "totalAmount", label: "Total Amount", top: 80, left: 60, width: 36, height: 6 },
    { field: "currency", label: "Currency Identifier", top: 81, left: 40, width: 18, height: 5 },
  ],
  receipt: [
    { field: "merchantName", label: "Merchant Name", top: 4, left: 20, width: 60, height: 10 },
    { field: "merchantAddress", label: "Merchant Address", top: 15, left: 14, width: 72, height: 8 },
    { field: "merchantPhone", label: "Merchant Phone", top: 24, left: 24, width: 52, height: 4 },
    { field: "transactionDate", label: "Receipt Date", top: 30, left: 10, width: 38, height: 5 },
    { field: "transactionTime", label: "Receipt Time", top: 30, left: 52, width: 38, height: 5 },
    { field: "invoiceNumber", label: "ID/Order No", top: 36, left: 10, width: 80, height: 5 },
    { field: "items", label: "Registered Items", top: 44, left: 8, width: 84, height: 32 },
    { field: "subtotal", label: "Receipt Subtotal", top: 78, left: 35, width: 55, height: 4 },
    { field: "tax", label: "Tax Amount", top: 83, left: 35, width: 55, height: 4 },
    { field: "totalAmount", label: "Total Sum Paid", top: 88, left: 35, width: 55, height: 7 },
  ],
  contract: [
    { field: "contractTitle", label: "Contract Title", top: 6, left: 12, width: 76, height: 8 },
    { field: "summary", label: "Summary Overview", top: 16, left: 6, width: 88, height: 16 },
    { field: "dates", label: "Effective Dates", top: 35, left: 6, width: 88, height: 12 },
    { field: "risks", label: "Key Risks Identified", top: 50, left: 6, width: 88, height: 18 },
    { field: "clauses", label: "Legal Clauses Included", top: 71, left: 6, width: 88, height: 23 },
  ],
  resume: [
    { field: "candidateName", label: "Candidate Name", top: 4, left: 6, width: 50, height: 8 },
    { field: "email", label: "Email Address", top: 14, left: 6, width: 40, height: 4 },
    { field: "phone", label: "Phone Connection", top: 19, left: 6, width: 40, height: 4 },
    { field: "skills", label: "Listed Skills Matrix", top: 26, left: 6, width: 88, height: 20 },
    { field: "experience", label: "Work History Items", top: 49, left: 6, width: 88, height: 24 },
    { field: "education", label: "Academic Curriculum", top: 76, left: 6, width: 88, height: 18 },
  ],
  table: [
    { field: "tableName", label: "Table Element Name", top: 4, left: 6, width: 88, height: 8 },
    { field: "headers", label: "Column Headers Row", top: 15, left: 6, width: 88, height: 6 },
    { field: "rows", label: "Grid Rows Dataset", top: 23, left: 6, width: 88, height: 65 },
    { field: "totalAmount", label: "Calculated Totals", top: 90, left: 60, width: 34, height: 6 },
  ],
  general_ocr: [
    { field: "title", label: "Document Headline", top: 5, left: 10, width: 80, height: 10 },
    { field: "body", label: "Document Text Body", top: 18, left: 10, width: 80, height: 75 },
  ]
};

const DEMO_PRESETS: DemoPreset[] = [
  {
    name: "Cozy Bakery Invoice #429",
    illustration: `<svg viewBox="0 0 100 100" class="w-24 h-24 text-amber-700/80"><rect width="80" height="90" x="10" y="5" rx="5" fill="#FAF6F0" stroke="#eeded5" stroke-width="2"/><circle cx="50" cy="40" r="18" fill="#E8D5C4"/><path d="M40 40 Q50 30 60 40" stroke="#B2533E" stroke-width="4" fill="none"/><line x1="25" y1="70" x2="75" y2="70" stroke="#eeded5" stroke-width="2"/><line x1="25" y1="80" x2="60" y2="80" stroke="#eeded5" stroke-width="2"/></svg>`,
    raw: "SWEET HARVEST BAKERY\nInvoice #429\nDate: 2026-06-03\n3x Butter Croissant....$13.50\n1x Warm Apple Cider...$4.50\nTotal Paid: $18.00\nThanks for stopping by!",
    layout: "### SWEET HARVEST BAKERY\n* **Invoice:** #429\n* **Date:** June 3, 2026\n\n| Item | Qty | Total Price |\n| :--- | :---: | :---: |\n| Butter Croissant | 3 | $13.50 |\n| Warm Apple Cider | 1 | $4.50 |\n\n**Total Amount Paid:** **$18.00**",
    transcript: "[00:01] Customer: Hi! I'd like to get three butter croissants, please.\n[00:04] Baker: Absolutely! Three butter croissants. Would you like anything to drink?\n[00:08] Customer: Yes, a warm apple cider as well, please.\n[00:11] Baker: Great, that's three croissants and one warm apple cider.\n[00:15] Baker: Your total is $18.00. How would you like to pay?\n[00:18] Customer: Card, please. *beeps*\n[00:20] Baker: Perfect, payment accepted! Thanks for stopping by, have a wonderful day!\n[00:24] Customer: Thank you! You too!",
    summary: "# Executive Brief: Invoice #429\n- **Client/Merchant:** Sweet Harvest Bakery\n- **Date Identified:** June 3, 2026\n- **Primary Intent:** Commercial sales receipt\n- **Key Total:** $18.00\n- **Takeaways:** 4 items total sold; billing was completed successfully.",
    "key-value": "| Label Attribute | Extracted Value |\n| :--- | :--- |\n| Merchant Name | Sweet Harvest Bakery |\n| Document Reference | Invoice #429 |\n| Billing Date | June 3, 2026 |\n| Quantity of Items | 4 items |\n| Grand Monetary Sum | $18.00 |"
  },
  {
    name: "Lecture Notes on Archeology",
    illustration: `<svg viewBox="0 0 100 100" class="w-24 h-24 text-amber-700/80"><rect width="80" height="90" x="10" y="5" rx="5" fill="#FAF6F0" stroke="#eeded5" stroke-width="2"/><path d="M20 20 L80 20" stroke="#7D6B60" stroke-width="2"/><path d="M20 35 L80 35" stroke="#eeded5" stroke-dasharray="2" stroke-width="1.5"/><path d="M20 50 L60 50" stroke="#eeded5" stroke-dasharray="2" stroke-width="1.5"/><polygon points="40,65 75,65 57,85" fill="#B2533E" opacity="0.8"/></svg>`,
    raw: "Archeology Lab 08 - Warm Sun Sands\nGiza pyramid alignment suggests seasonal coordination\nCarbon dating estimates: ~2500 BCE\nNext task: review stone quarries map and write draft proposal",
    layout: "# Archeology Lab 08: Giza Exploration\n\n*   **General Assessment:** Structural analysis shows alignments correspond to key seasonal solar configurations.\n*   **Timeline Coordinates:** Radiocarbon logs place construction parameters around **~2500 BCE**.\n*   **Actionable Items:**\n    1.  Conduct stone quarry GIS mapping analysis.\n    2.  Formulate the secondary draft research proposal.",
    transcript: "[00:15] Archaeologist: Dr. Ames, what did the latest analysis of the Giza solar alignment reveal?\n[00:21] Dr. Ames: Well, the calculations suggest a deliberate seasonal coordination, likely aligned with the solstice.\n[00:28] Archaeologist: Fascinating. And do we have the final radiocarbon results back from the lab?\n[00:32] Dr. Ames: Yes, the carbon dating estimates place construction activities around ~2500 BCE.\n[00:38] Archaeologist: Magnificent! What are our priority next steps?\n[00:41] Dr. Ames: We must review the stone quarries GIS map and finish writing the draft research proposal.",
    summary: "# Research Outline: Archeology Notes\n- **Subject:** Giza Pyramid Alignments & Chronology\n- **Chronological Period:** ~2500 BCE\n- **Essential Discovery:** Physical layouts match ancient celestial calendars.\n- **Action Item:** Compile GIS coordinates & outline the draft proposal next week.",
    "key-value": "| Research Attribute | Historical Value |\n| :--- | :--- |\n| Field Lab Title | Archeology Lab 08 |\n| Primary Subject | Pyramid Seasonal Alignment |\n| Chronology Date | ~2500 BCE |\n| Follow-Up Milestone | Write draft proposal & review quarry map |"
  }
];

// Small set of CV demo presets used for the homepage CV Builder simulator
const CV_DEMO_PRESETS: CvDemoPreset[] = [
  {
    name: "Data Analyst - Sample CV",
    illustration: `<svg viewBox="0 0 100 100" class="w-24 h-24 text-amber-700/80"><rect width="80" height="90" x="10" y="5" rx="5" fill="#FAF6F0" stroke="#eeded5" stroke-width="2"/></svg>`,
    markdown: `# Jane Doe\n\n**Data Analyst** · jane.doe@example.com · (555) 555-0100\n\n## Summary\nAnalytical Data Analyst with 4 years of experience turning raw data into actionable insights. Skilled in SQL, Python, and dashboarding.\n\n## Experience\n- **Data Analyst**, ACME Corp (2021 - Present) — Improved reporting pipelines, reduced query time by 30%.\n\n## Education\n- B.Sc. in Statistics, State University (2019)`
  },
  {
    name: "Product Manager - Sample CV",
    illustration: `<svg viewBox="0 0 100 100" class="w-24 h-24 text-amber-700/80"><rect width="80" height="90" x="10" y="5" rx="5" fill="#FAF6F0" stroke="#eeded5" stroke-width="2"/></svg>`,
    markdown: `# Alex Smith\n\n**Product Manager** · alex.smith@example.com · (555) 555-0123\n\n## Summary\nProduct Manager with experience leading cross-functional teams and launching mobile products used by 200k+ users.\n\n## Experience\n- **PM**, FutureApps (2019 - Present) — Led roadmap and GTM for subscription product.`
  }
];

// Theme-aware tokens for structured result cards (light + dark must always pair)
export default function Home() {
  const [activeView, setActiveView] = useState<"home" | "workspace" | "cv">("home");
  const [language, setLanguage] = useState<Language>("en");
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [publishingMethod, setPublishingMethod] = useState<string>("raw");
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [trackerStep, setTrackerStep] = useState<number>(0);

  // File states
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string>("");
  const [fileMimeType, setFileMimeType] = useState<string>("");
  const [fileName, setFileName] = useState<string>("");
  const [fileSize, setFileSize] = useState<string>("");

  // Control states
  const [extractionMode, setExtractionMode] = useState<string>("raw");
  const [documentType, setDocumentType] = useState<string>("general_ocr");
  const [customPrompt, setCustomPrompt] = useState<string>("");
  const [isExtracting, setIsExtracting] = useState<boolean>(false);
  const [extractionError, setExtractionError] = useState<string>("");

  // Result states
  const [extractedText, setExtractedText] = useState<string>("");
  const [isSpecializedResult, setIsSpecializedResult] = useState<boolean>(false);
  const [resultDocumentType, setResultDocumentType] = useState<string>("");
  const [isJsonVisualMode, setIsJsonVisualMode] = useState<boolean>(true);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editedText, setEditedText] = useState<string>("");
  const [copyFeedback, setCopyFeedback] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<"result" | "chat">("result");

  // Before vs After split board state values
  const [activeField, setActiveField] = useState<string | null>(null);
  const [zoomScale, setZoomScale] = useState<number>(1.0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(3);
  const [activeWorkspaceTab, setActiveWorkspaceTab] = useState<"visual" | "summary" | "confidence" | "chat">("visual");

  // Chat states
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState<string>("");
  const [isChatting, setIsChatting] = useState<boolean>(false);
  const [chatError, setChatError] = useState<string>("");

  // UI Interactive simulator states
  const [simSelectedPreset, setSimSelectedPreset] = useState<number>(0);
  const [simSelectedMode, setSimSelectedMode] = useState<string>("raw");
  const [simIsLoading, setSimIsLoading] = useState<boolean>(false);
  const [simText, setSimText] = useState<string>(DEMO_PRESETS[0].raw);
  // Simulator scope: 'extraction' shows extraction desk simulator; 'cv' shows CV Builder simulator
  const [simScope, setSimScope] = useState<"extraction" | "cv">("extraction");

  // CV Builder states
  const [cvInputMode, setCvInputMode] = useState<"file" | "notes">("file");
  const [cvFilePreview, setCvFilePreview] = useState<string>("");
  const [cvFileMimeType, setCvFileMimeType] = useState<string>("");
  const [cvFileName, setCvFileName] = useState<string>("");
  const [cvFileSize, setCvFileSize] = useState<string>("");
  const [cvRawNotes, setCvRawNotes] = useState<string>("");
  const [cvSelectedPositions, setCvSelectedPositions] = useState<string[]>(["Data Analyst"]);
  const [cvCustomPosition, setCvCustomPosition] = useState<string>("");
  const [cvTemplate, setCvTemplate] = useState<string>("modern-ats");
  const [cvTone, setCvTone] = useState<string>("Confident professional");
  const [cvSeniority, setCvSeniority] = useState<string>("Adaptive");
  const [cvFocusAreas, setCvFocusAreas] = useState<string[]>(["ATS keywords", "Measurable achievements", "Grammar polish"]);
  const [cvCustomRequest, setCvCustomRequest] = useState<string>("");
  const [cvGeneratedText, setCvGeneratedText] = useState<string>("");
  const [cvEditedText, setCvEditedText] = useState<string>("");
  const [cvPreviewMode, setCvPreviewMode] = useState<"text" | "preview">("preview");
  const [cvIsGenerating, setCvIsGenerating] = useState<boolean>(false);
  const [cvError, setCvError] = useState<string>("");
  const [cvCopyFeedback, setCvCopyFeedback] = useState<boolean>(false);
  const [cvDragOver, setCvDragOver] = useState<boolean>(false);
  const [cvTrackerStep, setCvTrackerStep] = useState<number>(0);
  const cvTrackerRef = useRef<number | null>(null);
  const cvRawNotesMinLength = 20;
  const cvRawNotesMaxLength = 12000;
  const cvRawNotesTrimmed = cvRawNotes.trim();
  const hasValidCvInput =
    cvInputMode === "file"
      ? Boolean(cvFilePreview)
      : cvRawNotesTrimmed.length >= cvRawNotesMinLength;

  const selectSimPreset = (idx: number) => {
    setSimSelectedPreset(idx);
    setSimIsLoading(true);
    setTimeout(() => {
      if (simScope === "extraction") {
        const p = DEMO_PRESETS[idx];
        setSimText(p[simSelectedMode as keyof DemoPreset] || p.raw);
      } else {
        const p = CV_DEMO_PRESETS[idx % CV_DEMO_PRESETS.length];
        setSimText(p.markdown);
      }
      setSimIsLoading(false);
    }, 250);
  };

  const selectSimMode = (mode: string) => {
    setSimSelectedMode(mode);
    setSimIsLoading(true);
    setTimeout(() => {
      if (simScope === "extraction") {
        const p = DEMO_PRESETS[simSelectedPreset];
        setSimText(p[mode as keyof DemoPreset] || p.raw);
      } else {
        const p = CV_DEMO_PRESETS[simSelectedPreset % CV_DEMO_PRESETS.length];
        setSimText(p.markdown);
      }
      setSimIsLoading(false);
    }, 250);
  };

  // Build a full HTML preview for a CV markdown and template id
  const buildCvPreviewHtml = (md: string, tplId: string) => {
    const body = convertCvMarkdownToHtml(md);
    const templateName = CV_TEMPLATES.find((item) => item.id === tplId)?.name || "Modern ATS";
    const templateStyles: Record<string, string> = {
      "modern-ats": `body{font-family:Inter, Arial, sans-serif;color:#2f2925;margin:24px;line-height:1.45}h1{font-size:20px;color:#1f2937;margin:0 0 6px}h2{color:#C86432;font-size:11px;text-transform:uppercase;margin-top:12px;border-bottom:1px solid #fde8dc;padding-bottom:6px}p{font-size:12px;margin:0 0 8px}`,
      "executive": `body{font-family:Georgia, serif;color:#111827;margin:32px;background:#fff}h1{font-family:Georgia, serif;color:#0f172a;font-size:24px;margin:0 0 4px}h2{color:#0f172a;font-size:12px;border-left:4px solid #cbd5e1;padding-left:10px;margin-top:10px}p{font-size:13px;margin:0 0 8px}`,
      "technical": `body{font-family:JetBrains Mono, ui-monospace, monospace;color:#0b1220;margin:20px;background:#f8fafc}h1{font-size:18px;color:#0b1220;border-bottom:2px dashed #e6edf3;padding-bottom:8px}h2{color:#0b1220;font-size:11px;margin-top:10px}p{font-size:12px;margin:0 0 6px}`,
      "creative": `body{font-family:Space Grotesk, Arial, sans-serif;color:#1b1b1b;margin:24px}h1{font-size:22px;color:#6b21a8;margin:0 0 8px}h2{color:#6b21a8;font-size:11px;margin-top:8px}p{font-size:13px;margin:0 0 8px}`,
      "graduate": `body{font-family:Inter, Arial, sans-serif;color:#222;margin:24px}h1{font-size:20px;color:#0f172a;margin:0 0 6px}h2{color:#0f172a;font-size:11px;margin-top:10px}p{font-size:12px;margin:0 0 6px}`,
    };

    const css = templateStyles[tplId] || templateStyles["modern-ats"];

    return `<!doctype html><html><head><meta charset='utf-8'/><meta name='viewport' content='width=device-width,initial-scale=1' /><title>${templateName}</title><style>${css}.bullet{margin-left:14px}</style></head><body><div class='meta' style='color:#8b7569;font-size:9px;margin-bottom:12px;text-transform:uppercase;letter-spacing:0.08em'>${templateName} · CV Demo</div>${body}</body></html>`;
  };

  const simPreviewHtml =
    simScope === "cv"
      ? buildCvPreviewHtml(CV_DEMO_PRESETS[simSelectedPreset % CV_DEMO_PRESETS.length].markdown, cvTemplate)
      : "";

  const handleSelectSimScope = (scope: "extraction" | "cv") => {
    setSimScope(scope);
    if (scope === "extraction") {
      const p = DEMO_PRESETS[simSelectedPreset % DEMO_PRESETS.length];
      setSimText(p[simSelectedMode as keyof DemoPreset] || p.raw);
      return;
    }

    const p = CV_DEMO_PRESETS[simSelectedPreset % CV_DEMO_PRESETS.length];
    setSimText(p.markdown);
  };

  const handleLoadCvSimulatedToBuilder = (idx: number) => {
    const p = CV_DEMO_PRESETS[idx % CV_DEMO_PRESETS.length];
    // set a small svg preview and fill the CV editor/preview with markdown
    const svgPreview = `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='250'><rect width='100%' height='100%' fill='%23FAF6F0'/><text x='20' y='120' font-family='sans-serif' font-size='16' fill='%235A4A42'>${p.name}</text></svg>`;
    setCvFilePreview(svgPreview);
    setCvFileName(`${p.name}.md`);
    setCvFileMimeType("text/markdown");
    setCvFileSize("12 KB");
    setCvGeneratedText(p.markdown);
    setCvEditedText(p.markdown);
    // navigate user to CV builder view
    setActiveView("cv");
  };

  const dropRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cvDropRef = useRef<HTMLDivElement>(null);
  const cvFileInputRef = useRef<HTMLInputElement>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);
  const [dragOver, setDragOver] = useState<boolean>(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode);
    return () => document.documentElement.classList.remove("dark");
  }, [isDarkMode]);

  const t = TRANSLATIONS[language] || TRANSLATIONS.en;
  const cvTemplateCopy = t.cvTemplates || {};
  const cvToneLabels = t.cvToneOptions || {};
  const cvSeniorityLabels = t.cvSeniorityOptions || {};
  const cvFocusLabels = t.cvFocusAreaLabels || {};
  const cvPositionLabels = t.cvPositionLabels || {};
  const getTemplateName = (template: (typeof CV_TEMPLATES)[number]) => cvTemplateCopy[template.id]?.name || template.name;
  const getTemplateDesc = (template: (typeof CV_TEMPLATES)[number]) => cvTemplateCopy[template.id]?.desc || template.desc;
  const getFocusLabel = (area: string) => cvFocusLabels[area] || area;
  const getPositionLabel = (position: string) => cvPositionLabels[position] || position;
  const openHomeSection = (sectionId?: string) => {
    setActiveView("home");
    if (!sectionId) return;
    window.setTimeout(() => {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 80);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const processSelectedFile = (selectedFile: File) => {
    if (!selectedFile) return;

    const validation = validateFile(selectedFile);
    if (!validation.valid) {
      setExtractionError(
        validation.error === "The file is too large. Please upload files smaller than 10MB."
          ? "The file is too large. Please upload files smaller than 10MB to avoid oversized base64 payloads."
          : validation.error || "Unsupported file type."
      );
      return;
    }

    setFile(selectedFile);
    setFileName(selectedFile.name);
    setFileMimeType(selectedFile.type);
    setExtractionError("");

    const kb = selectedFile.size / 1024;
    const mb = kb / 1024;
    setFileSize(mb >= 1 ? `${mb.toFixed(2)} MB` : `${kb.toFixed(0)} KB`);

    setExtractedText("");
    setEditedText("");
    setChatMessages([]);
    setIsEditing(false);
    setActiveTab("result");

    const reader = new FileReader();
    reader.onloadend = () => {
      setFilePreview(reader.result as string);
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processSelectedFile(e.target.files[0]);
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const processSelectedCvFile = (selectedFile: File) => {
    if (!selectedFile) return;

    const validation = validateFile(selectedFile, ALLOWED_CV_FILE_TYPES);
    if (!validation.valid) {
      setCvError(
        validation.error === "The file is too large. Please upload files smaller than 10MB."
          ? "The CV file is too large. Please upload files smaller than 10MB."
          : validation.error || "Unsupported CV file type."
      );
      return;
    }

    const kb = selectedFile.size / 1024;
    const mb = kb / 1024;
    setCvFileName(selectedFile.name);
    setCvFileMimeType(selectedFile.type || "application/pdf");
    setCvFileSize(mb >= 1 ? `${mb.toFixed(2)} MB` : `${kb.toFixed(0)} KB`);
    setCvGeneratedText("");
    setCvEditedText("");
    setCvError("");

    const reader = new FileReader();
    reader.onloadend = () => {
      setCvFilePreview(reader.result as string);
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleCvDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setCvDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processSelectedCvFile(e.dataTransfer.files[0]);
    }
  };

  const handleCvFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processSelectedCvFile(e.target.files[0]);
    }
  };

  const clearCvFile = () => {
    setCvFilePreview("");
    setCvFileMimeType("");
    setCvFileName("");
    setCvFileSize("");
    setCvGeneratedText("");
    setCvEditedText("");
    setCvError("");
  };

  const toggleCvPosition = (position: string) => {
    setCvSelectedPositions((prev) =>
      prev.includes(position)
        ? prev.filter((item) => item !== position)
        : [...prev, position]
    );
  };

  const addCustomCvPosition = () => {
    const position = cvCustomPosition.trim();
    if (!position) return;

    setCvSelectedPositions((prev) =>
      prev.some((item) => item.toLowerCase() === position.toLowerCase())
        ? prev
        : [...prev, position]
    );
    setCvCustomPosition("");
  };

  const toggleCvFocusArea = (area: string) => {
    setCvFocusAreas((prev) =>
      prev.includes(area)
        ? prev.filter((item) => item !== area)
        : [...prev, area]
    );
  };

  const handleGenerateCv = async () => {
    if (cvInputMode === "file" && !cvFilePreview) {
      setCvError("Upload an existing CV before generating the rebuilt version.");
      return;
    }

    if (cvInputMode === "notes" && cvRawNotesTrimmed.length < cvRawNotesMinLength) {
      setCvError("Add raw bio or work notes before generating the rebuilt CV.");
      return;
    }

    if (cvSelectedPositions.length === 0) {
      setCvError("Select at least one target position before rebuilding the CV.");
      return;
    }

    setCvIsGenerating(true);
    setCvError("");
    setCvGeneratedText("");
    setCvEditedText("");
    // start a simple tracker to give users feedback
    setCvTrackerStep(0);
    if (cvTrackerRef.current) {
      window.clearInterval(cvTrackerRef.current);
      cvTrackerRef.current = null;
    }
    cvTrackerRef.current = window.setInterval(() => {
      setCvTrackerStep((prev) => (prev < 4 ? prev + 1 : prev));
    }, 1400);

    try {
      const response = await fetch("/api/cv-builder", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...(cvInputMode === "file"
            ? {
                file: cvFilePreview,
                mimeType: cvFileMimeType || "application/pdf",
              }
            : {
                rawNotes: cvRawNotesTrimmed,
              }),
          targetPositions: cvSelectedPositions,
          template: cvTemplate,
          tone: cvTone,
          seniority: cvSeniority,
          focusAreas: cvFocusAreas,
          customRequest: cvCustomRequest,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to rebuild the CV.");
      }

      // Post-process the returned markdown to remove auxiliary QA sections
      // like ATS Keyword Alignment and Missing Details which should not
      // appear in the end-user ready CV output by default.
      const raw = data.text || "";
      const cleaned = stripAuxSections(raw);

      setCvGeneratedText(cleaned);
      setCvEditedText(cleaned);
    } catch (err: any) {
      setCvError(err.message || "Failed to generate the optimized CV.");
    } finally {
      setCvIsGenerating(false);
      // ensure tracker finishes
      setCvTrackerStep(4);
      if (cvTrackerRef.current) {
        window.clearInterval(cvTrackerRef.current);
        cvTrackerRef.current = null;
      }
    }
  };

  // Remove auxiliary headings and their content (e.g., ATS Keyword Alignment, Missing Details To Add)
  const stripAuxSections = (md: string) => {
    if (!md) return md;
    // Remove sections that start with headings like '## ATS' or '## Missing Details' (case-insensitive)
    // We remove from the matching heading until the next top-level heading of same level (##) or EOF.
    try {
      return md.replace(/(^|\n)##\s*(ATS Keyword Alignment|ATS Keywords|ATS Keyword|ATS Alignment|Missing Details To Add|Missing Details To Add\b|Missing Details|Missing Details to Add)[\s\S]*?(?=(\n##\s)|$)/gim, "");
    } catch (e) {
      return md;
    }
  };

  function escapeHtml(value: string) {
    return value
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function convertCvMarkdownToHtml(md: string): string {
    return md
      .split("\n")
      .map((line) => {
        const trimmed = line.trim();
        if (!trimmed) return "<p style='margin: 0 0 7px;'></p>";
        if (trimmed.startsWith("# ")) return `<h1>${escapeHtml(trimmed.substring(2))}</h1>`;
        if (trimmed.startsWith("## ")) return `<h2>${escapeHtml(trimmed.substring(3))}</h2>`;
        if (trimmed.startsWith("### ")) return `<h3>${escapeHtml(trimmed.substring(4))}</h3>`;
        if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
          return `<p class="bullet">• ${escapeHtml(trimmed.substring(2)).replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")}</p>`;
        }
        return `<p>${escapeHtml(trimmed).replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")}</p>`;
      })
      .join("");
  }

  const buildCvHtmlDocument = () => {
    const md = cvEditedText || cvGeneratedText;
    const body = convertCvMarkdownToHtml(md);
    const templateName = CV_TEMPLATES.find((item) => item.id === cvTemplate)?.name || "Modern ATS";

    // Template-specific CSS variations
    const templateStyles: Record<string, string> = {
      "modern-ats": `body{font-family:Inter, Arial, sans-serif;color:#2f2925;margin:40px;line-height:1.45}h1{font-size:26px;color:#1f2937;margin:0 0 6px}h2{color:#C86432;font-size:12px;text-transform:uppercase;margin-top:18px;border-bottom:1px solid #fde8dc;padding-bottom:6px}p{font-size:12px;margin:0 0 8px}`,
      "executive": `body{font-family:Georgia, serif;color:#111827;margin:48px;background:#fff}h1{font-family:Georgia, serif;color:#0f172a;font-size:30px;margin:0 0 4px}h2{color:#0f172a;font-size:13px;border-left:4px solid #cbd5e1;padding-left:10px;margin-top:16px}p{font-size:13px;margin:0 0 8px}`,
      "technical": `body{font-family:JetBrains Mono, ui-monospace, SFMono-Regular, Menlo, Monaco, monospace;color:#0b1220;margin:36px;background:#f8fafc}h1{font-size:22px;color:#0b1220;border-bottom:2px dashed #e6edf3;padding-bottom:8px}h2{color:#0b1220;font-size:12px;margin-top:14px}p{font-size:12px;margin:0 0 6px}`,
      "creative": `body{font-family:Space Grotesk, Arial, sans-serif;color:#1b1b1b;margin:36px}h1{font-size:28px;color:#6b21a8;margin:0 0 8px}h2{color:#6b21a8;font-size:12px;margin-top:12px}p{font-size:13px;margin:0 0 8px}`,
      "graduate": `body{font-family:Inter, Arial, sans-serif;color:#222;margin:36px}h1{font-size:24px;color:#0f172a;margin:0 0 6px}h2{color:#0f172a;font-size:12px;margin-top:12px}p{font-size:12px;margin:0 0 6px}`,
    };

    const css = templateStyles[cvTemplate] || templateStyles["modern-ats"];

    return `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>${escapeHtml(templateName)} - Optimized CV</title>
  <style>
    ${css}
    .meta{color:#8b7569;font-size:9px;margin-bottom:18px;text-transform:uppercase;letter-spacing:0.08em}
    .bullet{margin-left:14px}
    @page{margin:0.6in}
  </style>
</head>
<body>
  <div class="meta">Generated with GLYPH AI CV Builder · ${escapeHtml(templateName)}</div>
  ${body}
</body>
</html>`;
  };

  const copyCvText = () => {
    copyToClipboard(cvEditedText || cvGeneratedText);
    setCvCopyFeedback(true);
    setTimeout(() => setCvCopyFeedback(false), 2000);
  };

  const downloadCvDoc = () => {
    const baseName = cvFileName ? cvFileName.substring(0, cvFileName.lastIndexOf(".")) || cvFileName : "optimized-cv";
    downloadBlob("\ufeff" + buildCvHtmlDocument(), `${baseName}-optimized.doc`, "application/msword;charset=utf-8");
  };

  const exportCvPdf = () => {
    // Open a preview window with the selected template and trigger print
    const html = buildCvHtmlDocument();
    const w = window.open("", "_blank", "width=900,height=1100");
    if (!w) {
      setCvError("The browser blocked the PDF export window. Please allow popups and try again.");
      return;
    }
    w.document.open();
    w.document.write(html);
    w.document.close();
    w.focus();
    setTimeout(() => w.print(), 500);
  };

  const handleLoadSample = (sample: SampleDocument) => {
    setFileName(sample.name);
    setFileMimeType(sample.mimeType);
    setFileSize(sample.size);
    setFilePreview(sample.mockData);
    setFile(null);
    setExtractedText(sample.initialExtract);
    setEditedText(sample.initialExtract);
    setExtractionError("");
    setChatMessages([]);
    setIsEditing(false);
    setActiveTab("result");
  };

  const handleLoadSimulatedToWorkspace = () => {
    const preset = DEMO_PRESETS[simSelectedPreset];
    // Form standard sample properties
    setFileName(`${preset.name}.png`);
    setFileMimeType("image/png");
    setFileSize("128 KB");
    // Generate simple preview svg URL
    const svgPreview = `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='250' viewBox='0 0 400 250'><rect width='100%' height='100%' fill='%23FAF6F0'/><text x='20' y='120' font-family='sans-serif' font-size='18' fill='%235A4A42'>${preset.name}</text></svg>`;
    setFilePreview(svgPreview);
    setFile(null);
    setExtractedText(preset[simSelectedMode as keyof DemoPreset] || preset.raw);
    setEditedText(preset[simSelectedMode as keyof DemoPreset] || preset.raw);
    setExtractionError("");
    setChatMessages([]);
    setIsEditing(false);
    setExtractionMode(simSelectedMode);
    setActiveTab("result");
    setActiveView("workspace");
  };

  const clearFile = () => {
    setFile(null);
    setFilePreview("");
    setFileName("");
    setFileSize("");
    setFileMimeType("");
    setExtractedText("");
    setEditedText("");
    setChatMessages([]);
    setIsEditing(false);
    setExtractionError("");
    setActiveTab("result");
    setIsSpecializedResult(false);
    setResultDocumentType("");
  };

  const handleExtractText = async () => {
    if (!filePreview) return;

    setIsExtracting(true);
    setExtractionError("");
    setExtractedText("");
    setChatMessages([]);
    setTrackerStep(0);

    const trackerInterval = setInterval(() => {
      setTrackerStep((prev) => (prev < 4 ? prev + 1 : prev));
    }, 1850);

    try {
      const response = await fetch("/api/extract", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          file: filePreview,
          mimeType: fileMimeType || "image/png",
          mode: extractionMode,
          customPrompt: customPrompt,
          publishingMethod: publishingMethod,
          documentType: documentType,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to extract text from file.");
      }

      setTrackerStep(4);
      setExtractedText(data.text);
      setEditedText(data.text);
      setIsSpecializedResult(!!data.isSpecialized);
      setResultDocumentType(data.documentType || "");
    } catch (err: any) {
      console.error(err);
      setExtractionError(err.message || "APIs are unreachable. Please ensure the dev server has a valid GEMINI_API_KEY.");
    } finally {
      clearInterval(trackerInterval);
      setIsExtracting(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || !filePreview || isChatting) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: chatInput,
    };

    setChatMessages((prev) => [...prev, userMsg]);
    setChatInput("");
    setIsChatting(true);
    setChatError("");

    setTimeout(() => {
      chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 50);

    try {
      const chatHistory = [...chatMessages, userMsg].map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          file: file ? filePreview : undefined,
          mimeType: fileMimeType,
          messages: chatHistory,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Chat failed to retrieve answers.");
      }

      const reply: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.text,
      };

      setChatMessages((prev) => [...prev, reply]);
    } catch (err: any) {
      setChatError(err.message || "Failed to get response from document chat.");
    } finally {
      setIsChatting(false);
      setTimeout(() => {
        chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 50);
    }
  };

  const handleCopy = () => {
    const textToCopy = isEditing ? editedText : getDisplayableOrDownloadableText(extractedText, resultDocumentType);
    copyToClipboard(textToCopy);
    setCopyFeedback(true);
    setTimeout(() => setCopyFeedback(false), 2000);
  };

  const downloadTextFile = (ext: "md" | "txt") => {
    const textContent = isEditing ? editedText : getDisplayableOrDownloadableText(extractedText, resultDocumentType);
    const baseName = fileName ? fileName.substring(0, fileName.lastIndexOf(".")) || fileName : "extracted-doc";
    downloadAsTxt(textContent, `${baseName}-extracted.${ext}`);
  };

  const downloadDocFile = () => {
    const textContent = isEditing ? editedText : getDisplayableOrDownloadableText(extractedText, resultDocumentType);
    const convertMarkdownToHtml = (md: string): string => {
      return md
        .split("\n")
        .map(line => {
          let trimmed = line.trim();
          if (!trimmed) return "<p style='margin-bottom: 8px;'></p>";
          if (trimmed.startsWith("# ")) return `<h1 style="color: #8B4513; font-size: 18pt; font-weight: bold; margin-top: 16px; border-bottom: 2px solid #D27642; padding-bottom: 4px;">${trimmed.substring(2)}</h1>`;
          if (trimmed.startsWith("## ")) return `<h2 style="color: #A05C38; font-size: 15pt; font-weight: bold; margin-top: 14px;">${trimmed.substring(3)}</h2>`;
          if (trimmed.startsWith("### ")) return `<h3 style="color: #A05C38; font-size: 13pt; font-weight: bold; margin-top: 12px;">${trimmed.substring(4)}</h3>`;
          if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
            return `<li style="font-family: Arial, sans-serif; font-size: 11pt; margin-left: 20px;">${trimmed.substring(2).replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")}</li>`;
          }
          if (trimmed.startsWith("|")) {
            const cells = trimmed.split("|").map(c => c.trim()).filter(Boolean);
            if (cells.every(c => c.startsWith("-"))) return "";
            return `<tr style="border-bottom: 1px solid #eeded5;">${cells.map(c => `<td style="padding: 6px; border: 1px solid #eeded5;">${c.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")}</td>`).join("")}</tr>`;
          }
          return `<p style="font-family: Arial; font-size: 11pt; line-height: 1.4; margin-bottom: 8px;">${trimmed.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")}</p>`;
        })
        .join("");
    };

    const docContent = convertMarkdownToHtml(textContent);
    const docHtml = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
      <head>
        <meta charset="utf-8">
        <title>Extracted Document</title>
        <style>
          body {
            font-family: 'Calibri', 'Arial', sans-serif;
            font-size: 11pt;
            line-height: 1.15;
            color: #3c2f2f;
            margin: 1in;
          }
        </style>
      </head>
      <body>
        ${docContent}
      </body>
      </html>
    `;

    const baseName = fileName ? fileName.substring(0, fileName.lastIndexOf(".")) || fileName : "extracted-doc";
    downloadBlob("\ufeff" + docHtml, `${baseName}-extracted.doc`, "application/msword;charset=utf-8");
  };

  const wordCount = (isEditing ? editedText : extractedText).trim().split(/\s+/).filter(Boolean).length;
  const charCount = (isEditing ? editedText : extractedText).length;

  return (
    <div
      lang={language === "am" ? "hy" : language}
      data-language={language}
      className={`flex flex-col min-h-screen font-sans transition-colors duration-500 ${
        isDarkMode ? "text-[#f7f3f0] bg-[#181210]" : "text-[#3c2f2f] bg-[#fbf9f6]"
      }`}
      style={{
        backgroundImage: isDarkMode
          ? "radial-gradient(circle at 0% 0%, #301f17 0%, transparent 45%), radial-gradient(circle at 100% 100%, #201511 0%, transparent 50%)"
          : "radial-gradient(circle at 0% 0%, #f7ebe1 0%, transparent 45%), radial-gradient(circle at 100% 100%, #f0e2d5 0%, transparent 55%)",
      }}
    >
      {/* Premium Cozy Header Nav */}
      <nav className={`flex items-center justify-between px-4 sm:px-12 py-4 border-b sticky top-0 z-50 transition-all duration-300 ${
        isDarkMode ? "border-[#332822] bg-[#181210]/95 backdrop-blur-md" : "border-[#eeded5] bg-[#fbf9f6]/95 backdrop-blur-md"
      }`}>
        {/* Brand Logo & Desktop Nav Links */}
        <div className="flex items-center gap-7">
          <button
            type="button"
            onClick={() => setActiveView("home")}
            className="flex items-center gap-2.5 text-left rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#C86432]/50 cursor-pointer"
            aria-label="Go to homepage"
          >
            <div className="w-9 h-9 bg-[#C86432] rounded-xl flex items-center justify-center shadow-lg shadow-[#C86432]/20 text-white shrink-0">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-baseline gap-1.5 font-sans">
                <span id="brand-logo" className={`text-xl font-bold tracking-tight font-display ${isDarkMode ? "text-white" : "text-[#3c2f2f]"}`}>
                  {t.title}<span className="text-[#C86432] font-semibold">AI</span>
                </span>
                <span className="text-[10px] bg-[#C86432]/10 text-[#C86432] dark:bg-[#C86432]/20 dark:text-[#D97736] px-2 py-0.5 rounded-full font-bold">
                  v3.0
                </span>
              </div>
            </div>
          </button>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-2.5">
            <button
              onClick={() => setActiveView("home")}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                activeView === "home"
                  ? "bg-[#C86432]/10 text-[#C86432]"
                  : "text-stone-500 hover:text-stone-800 dark:text-stone-300 dark:hover:text-white"
              }`}
            >
              {t.navOverview}
            </button>
            <button
              onClick={() => setActiveView("workspace")}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                activeView === "workspace"
                  ? "bg-[#C86432]/10 text-[#C86432]"
                  : "text-stone-500 hover:text-stone-800 dark:text-stone-300 dark:hover:text-white"
              }`}
            >
              {t.navWorkspace}
            </button>
            <button
              onClick={() => setActiveView("cv")}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                activeView === "cv"
                  ? "bg-[#C86432]/10 text-[#C86432]"
                  : "text-stone-500 hover:text-stone-800 dark:text-stone-300 dark:hover:text-white"
              }`}
            >
              {t.featureCvTitle}
            </button>
          </div>
        </div>

        {/* Global Toolbar and Toggles for Desktop */}
        <div className="hidden md:flex items-center gap-3">
          {/* Language Menu */}
          <div className="relative">
            <button
              onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl border text-xs font-bold uppercase tracking-wider backdrop-blur-xs transition-all cursor-pointer ${
                isDarkMode ? "border-[#332822] bg-[#1d1714]/60 text-white" : "border-[#eeded5] bg-white/60 text-[#3c2f2f]"
              }`}
            >
              <Globe className="w-3.5 h-3.5 text-[#C86432]" />
              <span>{language === "en" ? "🇺🇸 EN" : language === "ru" ? "🇷🇺 RU" : "🇦🇲 HY"}</span>
              <ChevronDown className="w-3.5 h-3.5 text-[#7d6b60]" />
            </button>

            <AnimatePresence>
              {isLangDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setIsLangDropdownOpen(false)} />
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className={`absolute right-0 mt-2 w-32 rounded-2xl p-1 border shadow-xl z-20 backdrop-blur-xl ${
                      isDarkMode ? "bg-[#1d1714] border-[#332822] text-white" : "bg-white border-[#eeded5] text-[#3c2f2f]"
                    }`}
                  >
                    <button
                      onClick={() => { setLanguage("en"); setIsLangDropdownOpen(false); }}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs hover:bg-[#C86432] hover:text-white transition-all flex items-center gap-2 cursor-pointer"
                    >
                      <span>🇺🇸</span> English
                    </button>
                    <button
                      onClick={() => { setLanguage("ru"); setIsLangDropdownOpen(false); }}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs hover:bg-[#C86432] hover:text-white transition-all flex items-center gap-2 cursor-pointer"
                    >
                      <span>🇷🇺</span> Русский
                    </button>
                    <button
                      onClick={() => { setLanguage("am"); setIsLangDropdownOpen(false); }}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs hover:bg-[#C86432] hover:text-white transition-all flex items-center gap-2 cursor-pointer"
                    >
                      <span>🇦🇲</span> Հայերեն
                    </button>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          {/* Theme Button */}
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`w-8.5 h-8.5 flex items-center justify-center rounded-xl border backdrop-blur-xs transition-all cursor-pointer ${
              isDarkMode ? "border-[#332822] bg-[#1d1714]/60 text-amber-400" : "border-[#eeded5] bg-white/60 text-[#C86432]"
            }`}
          >
            {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>

        {/* Mobile controls & Burger Toggle */}
        <div className="flex md:hidden items-center gap-2">
          {/* Theme Button directly in mobile header */}
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`w-8.5 h-8.5 flex items-center justify-center rounded-xl border backdrop-blur-xs transition-all cursor-pointer ${
              isDarkMode ? "border-[#332822] bg-[#1d1714]/60 text-amber-400" : "border-[#eeded5] bg-white/60 text-[#C86432]"
            }`}
          >
            {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Elegant Burger trigger buttons */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`w-8.5 h-8.5 flex items-center justify-center rounded-xl border transition-all cursor-pointer ${
              isDarkMode ? "border-[#332822] bg-[#1d1714]/60 text-[#D97736]" : "border-[#eeded5] bg-white text-[#C86432]"
            }`}
          >
            {isMobileMenuOpen ? <X className="w-4.5 h-4.5" /> : <Menu className="w-4.5 h-4.5" />}
          </button>
        </div>

        {/* Full-width Animated Mobile Drawer Dropdown menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <>
              {/* Backing screen block */}
              <div className="fixed inset-0 top-[69px] z-40 bg-black/20 dark:bg-black/40 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
              
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className={`absolute left-0 right-0 top-[69px] w-full border-b z-50 overflow-hidden shadow-2xl transition-all ${
                  isDarkMode ? "bg-[#181210] border-[#332822]" : "bg-[#fbf9f6] border-[#eeded5]"
                }`}
              >
                <div className="p-5 flex flex-col gap-4">
                  {/* Page Links */}
                  <div className="flex flex-col gap-2">
                    <span className="text-[10px] font-bold font-mono text-stone-400 uppercase tracking-wider block mb-1">
                      {t.navNavigation}
                    </span>
                    <button
                      onClick={() => { setActiveView("home"); setIsMobileMenuOpen(false); }}
                      className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold transition-all flex items-center gap-3 ${
                        activeView === "home"
                          ? "bg-[#C86432] text-white"
                          : isDarkMode
                          ? "bg-[#1d1714] text-stone-300 border border-stone-800"
                          : "bg-white text-stone-700 border border-stone-200"
                      }`}
                    >
                      <BookOpen className="w-4 h-4" />
                      {t.navOverview}
                    </button>
                    <button
                      onClick={() => { setActiveView("workspace"); setIsMobileMenuOpen(false); }}
                      className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold transition-all flex items-center gap-3 ${
                        activeView === "workspace"
                          ? "bg-[#C86432] text-white"
                          : isDarkMode
                          ? "bg-[#1d1714] text-stone-300 border border-stone-800"
                          : "bg-white text-stone-700 border border-stone-200"
                      }`}
                    >
                      <Layers className="w-4 h-4" />
                      {t.navWorkspace}
                    </button>
                    <button
                      onClick={() => { setActiveView("cv"); setIsMobileMenuOpen(false); }}
                      className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold transition-all flex items-center gap-3 ${
                        activeView === "cv"
                          ? "bg-[#C86432] text-white"
                          : isDarkMode
                          ? "bg-[#1d1714] text-stone-300 border border-stone-800"
                          : "bg-white text-stone-700 border border-stone-200"
                      }`}
                    >
                      <Briefcase className="w-4 h-4" />
                      {t.featureCvTitle}
                    </button>
                  </div>

                  {/* Language Selection */}
                  <div className="flex flex-col gap-2 pt-2 border-t border-[#eeded5] dark:border-[#332822]">
                    <span className="text-[10px] font-bold font-mono text-stone-400 uppercase tracking-wider block mb-1">
                      {t.navLanguage}
                    </span>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        onClick={() => { setLanguage("en"); setIsMobileMenuOpen(false); }}
                        className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border transition-all ${
                          language === "en"
                            ? "bg-[#C86432]/10 border-[#C86432] text-[#C86432]"
                            : isDarkMode
                            ? "bg-[#1d1714] border-stone-800 text-stone-400"
                            : "bg-white border-stone-200 text-stone-600"
                        }`}
                      >
                        🇺🇸 EN
                      </button>
                      <button
                        onClick={() => { setLanguage("ru"); setIsMobileMenuOpen(false); }}
                        className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border transition-all ${
                          language === "ru"
                            ? "bg-[#C86432]/10 border-[#C86432] text-[#C86432]"
                            : isDarkMode
                            ? "bg-[#1d1714] border-stone-800 text-stone-400"
                            : "bg-white border-stone-200 text-stone-600"
                        }`}
                      >
                        🇷🇺 RU
                      </button>
                      <button
                        onClick={() => { setLanguage("am"); setIsMobileMenuOpen(false); }}
                        className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border transition-all ${
                          language === "am"
                            ? "bg-[#C86432]/10 border-[#C86432] text-[#C86432]"
                            : isDarkMode
                            ? "bg-[#1d1714] border-stone-800 text-stone-400"
                            : "bg-white border-stone-200 text-stone-600"
                        }`}
                      >
                        🇦🇲 HY
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </nav>

      {/* Main Responsive Canvas view controller */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col justify-start">
        
        <AnimatePresence mode="wait">
          {activeView === "home" ? (
            
            /* GORGEOUS DESIGNED COZY HOMEPAGE */
            <motion.div
              key="homepage"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col gap-16 py-4"
            >
              {/* Cozy Hero Container (switches by simScope) */}
              {simScope === "extraction" ? (
                <section className="text-center max-w-4xl mx-auto flex flex-col items-center pt-6 pb-2 gap-5">
                  <div className={`w-full max-w-xl grid grid-cols-2 gap-1.5 rounded-2xl border p-1.5 shadow-sm ${
                    isDarkMode ? "bg-[#1d1714]/70 border-[#332822]" : "bg-white/70 border-[#eeded5]"
                  }`}>
                    <button
                      type="button"
                      onClick={() => handleSelectSimScope("extraction")}
                      className="rounded-xl px-3 py-3 text-left transition-all cursor-pointer bg-[#C86432] text-white shadow-md shadow-[#C86432]/15"
                    >
                      <span className="flex items-center gap-2 text-xs font-black uppercase tracking-wider">
                        <Layers className="w-4 h-4" />
                        {t.featureExtractionTitle}
                      </span>
                      <span className="mt-1 block text-[10px] font-semibold opacity-85 leading-tight">{t.featureExtractionDesc}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSelectSimScope("cv")}
                      className={`rounded-xl px-3 py-3 text-left transition-all cursor-pointer ${
                        isDarkMode ? "text-stone-300 hover:bg-[#301c13]" : "text-[#5a4a42] hover:bg-[#FAF6F0]"
                      }`}
                    >
                      <span className="flex items-center gap-2 text-xs font-black uppercase tracking-wider">
                        <Briefcase className="w-4 h-4 text-[#C86432]" />
                        {t.featureCvTitle}
                      </span>
                      <span className="mt-1 block text-[10px] font-semibold opacity-70 leading-tight">{t.featureCvDesc}</span>
                    </button>
                  </div>
                  <span className={`text-[10px] uppercase font-mono px-3 py-1 rounded-full font-bold tracking-widest ${
                    isDarkMode ? "bg-[#301c13] text-[#D97736]" : "bg-[#eeded5] text-[#C86432]"
                  }`}>
                    Multimodal Document Engine
                  </span>
                  <h1 className="text-3xl sm:text-5xl font-display font-extrabold tracking-tight leading-tight">
                    {t.homeHeroTitle}
                  </h1>
                  <p className={`text-sm sm:text-base leading-relaxed max-w-2xl ${isDarkMode ? "text-[#cbb9af]" : "text-[#7d6b60]"}`}>
                    {t.homeHeroSub}
                  </p>
                  <div className="flex flex-wrap items-center justify-center gap-3 mt-4">
                    <button
                      onClick={() => setActiveView("workspace")}
                      className="px-6 py-3.5 rounded-xl font-bold text-sm bg-[#C86432] hover:bg-[#aa5328] text-white transition-all shadow-lg shadow-[#C86432]/10 hover:shadow-[#C86432]/20 hover:scale-[1.01] flex items-center gap-2 cursor-pointer"
                    >
                      <span>{t.homeBtnLaunch}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    <a
                      href="#simulator"
                      className={`px-6 py-3.5 rounded-xl font-bold text-sm border transition-all flex items-center gap-1.5 cursor-pointer ${
                        isDarkMode
                          ? "border-[#332822] bg-[#1d1714]/60 text-[#cbb9af] hover:text-white"
                          : "border-[#eeded5] bg-white/60 text-[#7d6b60] hover:text-[#3c2f2f]"
                      }`}
                    >
                      <Zap className="w-3.5 h-3.5 text-[#C86432]" />
                      <span>{t.homeBtnDemo}</span>
                    </a>
                  </div>
                </section>
              ) : (
                <section className="text-center max-w-4xl mx-auto flex flex-col items-center pt-6 pb-2 gap-5">
                  <div className={`w-full max-w-xl grid grid-cols-2 gap-1.5 rounded-2xl border p-1.5 shadow-sm ${
                    isDarkMode ? "bg-[#1d1714]/70 border-[#332822]" : "bg-white/70 border-[#eeded5]"
                  }`}>
                    <button
                      type="button"
                      onClick={() => handleSelectSimScope("extraction")}
                      className={`rounded-xl px-3 py-3 text-left transition-all cursor-pointer ${
                        isDarkMode ? "text-stone-300 hover:bg-[#301c13]" : "text-[#5a4a42] hover:bg-[#FAF6F0]"
                      }`}
                    >
                      <span className="flex items-center gap-2 text-xs font-black uppercase tracking-wider">
                        <Layers className="w-4 h-4 text-[#C86432]" />
                        {t.featureExtractionTitle}
                      </span>
                      <span className="mt-1 block text-[10px] font-semibold opacity-70 leading-tight">{t.featureExtractionDesc}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSelectSimScope("cv")}
                      className="rounded-xl px-3 py-3 text-left transition-all cursor-pointer bg-[#C86432] text-white shadow-md shadow-[#C86432]/15"
                    >
                      <span className="flex items-center gap-2 text-xs font-black uppercase tracking-wider">
                        <Briefcase className="w-4 h-4" />
                        {t.featureCvTitle}
                      </span>
                      <span className="mt-1 block text-[10px] font-semibold opacity-85 leading-tight">{t.featureCvDesc}</span>
                    </button>
                  </div>
                  <span className={`text-[10px] uppercase font-mono px-3 py-1 rounded-full font-bold tracking-widest ${
                    isDarkMode ? "bg-[#301c13] text-[#D97736]" : "bg-[#eeded5] text-[#C86432]"
                  }`}>
                    {t.featureCvTitle}
                  </span>
                  <h1 className="text-3xl sm:text-5xl font-display font-extrabold tracking-tight leading-tight">{t.cvHeroTitle}</h1>
                  <p className={`text-sm sm:text-base leading-relaxed max-w-2xl ${isDarkMode ? "text-[#cbb9af]" : "text-[#7d6b60]"}`}>
                    {t.cvHeroSub}
                  </p>
                  <div className="flex flex-wrap items-center justify-center gap-3 mt-4">
                    <button
                      onClick={() => setActiveView("cv")}
                      className="px-6 py-3.5 rounded-xl font-bold text-sm bg-[#C86432] hover:bg-[#aa5328] text-white transition-all shadow-lg shadow-[#C86432]/10 hover:shadow-[#C86432]/20 hover:scale-[1.01] flex items-center gap-2 cursor-pointer"
                    >
                      <span>{t.cvOpenBuilder}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    <a
                      href="#simulator"
                      className={`px-6 py-3.5 rounded-xl font-bold text-sm border transition-all flex items-center gap-1.5 cursor-pointer ${
                        isDarkMode
                          ? "border-[#332822] bg-[#1d1714]/60 text-[#cbb9af] hover:text-white"
                          : "border-[#eeded5] bg-white/60 text-[#7d6b60] hover:text-[#3c2f2f]"
                      }`}
                    >
                      <BookOpen className="w-3.5 h-3.5 text-[#C86432]" />
                      <span>{t.cvTryDemo}</span>
                    </a>
                  </div>
                </section>
              )}

              {/* Three-step timeline section (switch by simScope) */}
              {simScope === "extraction" ? (
                <section className="flex flex-col gap-10">
                <div className="text-center max-w-xl mx-auto gap-2 flex flex-col">
                  <h2 className="text-xl sm:text-2xl font-bold tracking-tight">{t.homeSection2Header}</h2>
                  <p className={`text-xs ${isDarkMode ? "text-[#cbb9af]" : "text-[#7d6b60]"}`}>
                    {t.homeSection2Sub}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
                  <div className={`p-6 rounded-3xl border transition-all flex flex-col gap-3 relative overflow-hidden ${
                    isDarkMode ? "bg-[#1d1714]/80 border-[#332822]" : "bg-white/80 border-[#eeded5]"
                  }`}>
                    <div className="w-8 h-8 rounded-full bg-[#C86432]/10 text-[#C86432] font-bold text-xs flex items-center justify-center">1</div>
                    <h3 className="font-bold text-sm">{t.step1Title}</h3>
                    <p className={`text-xs leading-relaxed ${isDarkMode ? "text-[#cbb9af]" : "text-[#7d6b60]"}`}>{t.step1Sub}</p>
                  </div>
                  <div className={`p-6 rounded-3xl border transition-all flex flex-col gap-3 relative overflow-hidden ${
                    isDarkMode ? "bg-[#1d1714]/80 border-[#332822]" : "bg-white/80 border-[#eeded5]"
                  }`}>
                    <div className="w-8 h-8 rounded-full bg-[#C86432]/10 text-[#C86432] font-bold text-xs flex items-center justify-center">2</div>
                    <h3 className="font-bold text-sm">{t.step2Title}</h3>
                    <p className={`text-xs leading-relaxed ${isDarkMode ? "text-[#cbb9af]" : "text-[#7d6b60]"}`}>{t.step2Sub}</p>
                  </div>
                  <div className={`p-6 rounded-3xl border transition-all flex flex-col gap-3 relative overflow-hidden ${
                    isDarkMode ? "bg-[#1d1714]/80 border-[#332822]" : "bg-white/80 border-[#eeded5]"
                  }`}>
                    <div className="w-8 h-8 rounded-full bg-[#C86432]/10 text-[#C86432] font-bold text-xs flex items-center justify-center">3</div>
                    <h3 className="font-bold text-sm">{t.step3Title}</h3>
                    <p className={`text-xs leading-relaxed ${isDarkMode ? "text-[#cbb9af]" : "text-[#7d6b60]"}`}>{t.step3Sub}</p>
                  </div>
                </div>
                </section>
              ) : (
                <section className="flex flex-col gap-10">
                  <div className="text-center max-w-xl mx-auto gap-2 flex flex-col">
                    <h2 className="text-xl sm:text-2xl font-bold tracking-tight">{t.cvHowHeader}</h2>
                    <p className={`text-xs ${isDarkMode ? "text-[#cbb9af]" : "text-[#7d6b60]"}`}>
                      {t.cvHowSub}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
                    <div className={`p-6 rounded-3xl border transition-all flex flex-col gap-3 relative overflow-hidden ${
                      isDarkMode ? "bg-[#1d1714]/80 border-[#332822]" : "bg-white/80 border-[#eeded5]"
                    }`}>
                      <div className="w-8 h-8 rounded-full bg-[#C86432]/10 text-[#C86432] font-bold text-xs flex items-center justify-center">1</div>
                      <h3 className="font-bold text-sm">{t.cvStep1Title}</h3>
                      <p className={`text-xs leading-relaxed ${isDarkMode ? "text-[#cbb9af]" : "text-[#7d6b60]"}`}>{t.cvStep1Sub}</p>
                    </div>
                    <div className={`p-6 rounded-3xl border transition-all flex flex-col gap-3 relative overflow-hidden ${
                      isDarkMode ? "bg-[#1d1714]/80 border-[#332822]" : "bg-white/80 border-[#eeded5]"
                    }`}>
                      <div className="w-8 h-8 rounded-full bg-[#C86432]/10 text-[#C86432] font-bold text-xs flex items-center justify-center">2</div>
                      <h3 className="font-bold text-sm">{t.cvStep2Title}</h3>
                      <p className={`text-xs leading-relaxed ${isDarkMode ? "text-[#cbb9af]" : "text-[#7d6b60]"}`}>{t.cvStep2Sub}</p>
                    </div>
                    <div className={`p-6 rounded-3xl border transition-all flex flex-col gap-3 relative overflow-hidden ${
                      isDarkMode ? "bg-[#1d1714]/80 border-[#332822]" : "bg-white/80 border-[#eeded5]"
                    }`}>
                      <div className="w-8 h-8 rounded-full bg-[#C86432]/10 text-[#C86432] font-bold text-xs flex items-center justify-center">3</div>
                      <h3 className="font-bold text-sm">{t.cvStep3Title}</h3>
                      <p className={`text-xs leading-relaxed ${isDarkMode ? "text-[#cbb9af]" : "text-[#7d6b60]"}`}>{t.cvStep3Sub}</p>
                    </div>
                  </div>
                </section>
              )}

              {/* Interactive simulator playground */}
              <section id="simulator" className="flex flex-col gap-8 pt-4 scrolling-mt-10">
                <div className="text-center max-w-xl mx-auto gap-2 flex flex-col">
                  <h2 className="text-xl sm:text-2xl font-bold tracking-tight">{t.homeDemoHeader}</h2>
                  <p className={`text-xs ${isDarkMode ? "text-[#cbb9af]" : "text-[#7d6b60]"}`}>
                    {t.homeDemoSub}
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                  
                  {/* Selector panel of files (Left) */}
                  <div className="lg:col-span-5 flex flex-col gap-4">
                    <div className={`p-6 rounded-3xl border flex flex-col gap-4 ${
                      isDarkMode ? "bg-[#1d1714]/60 border-[#332822]" : "bg-white/60 border-[#eeded5]"
                    }`}>
                      {simScope === "extraction" ? (
                        <>
                          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#C86432]">1. Select Document Template</h3>
                          <div className="flex flex-col gap-2.5">
                            {DEMO_PRESETS.map((preset, idx) => (
                              <button
                                key={idx}
                                onClick={() => selectSimPreset(idx)}
                                className={`p-3 rounded-2xl border text-left transition-all flex items-center gap-4 cursor-pointer ${
                                  simSelectedPreset === idx
                                    ? "border-[#C86432] bg-[#C86432]/5 shadow-sm"
                                    : isDarkMode
                                    ? "border-transparent bg-[#1d1714]/40 hover:bg-[#1d1714]"
                                    : "border-transparent bg-white/40 hover:bg-white"
                                }`}
                              >
                                <div className="bg-[#eeded5]/40 dark:bg-stone-800 p-1.5 rounded-xl shrink-0" dangerouslySetInnerHTML={{ __html: preset.illustration }} />
                                <div className="truncate">
                                  <span className="text-xs font-bold block">{preset.name}</span>
                                  <span className="text-[10px] text-stone-500 dark:text-stone-300">Preset Interactive Simulation File</span>
                                </div>
                              </button>
                            ))}
                          </div>

                          {/* Formula Selector */}
                          <div className="border-t border-[#eeded5] dark:border-[#332822] pt-4 mt-2">
                            <h3 className="text-xs font-mono font-bold uppercase tracking-wider mb-2.5 text-[#C86432]">2. Choose Formula Mode</h3>
                            <div className="flex flex-wrap gap-2">
                              {["raw", "layout", "transcript", "summary", "key-value"].map((mode) => (
                                <button
                                  key={mode}
                                  onClick={() => selectSimMode(mode)}
                                  className={`py-1.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                                    simSelectedMode === mode
                                      ? "bg-[#C86432] text-white"
                                      : isDarkMode
                                      ? "bg-[#1d1714]/30 hover:bg-[#1d1714]/85 text-[#cbb9af]"
                                      : "bg-white/40 hover:bg-white text-[#7d6b60]"
                                  }`}
                                >
                                  {t.modes[mode] || mode}
                                </button>
                              ))}
                            </div>
                          </div>

                          <button
                            onClick={handleLoadSimulatedToWorkspace}
                            className="w-full mt-4 py-3 bg-[#C86432] hover:bg-[#aa5328] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer"
                          >
                            <Sparkles className="w-4 h-4 text-amber-200" />
                            <span>{t.homeDemoLoad}</span>
                          </button>
                        </>
                      ) : (
                        <>
                          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#C86432]">{t.cvSelectSample}</h3>
                          <div className="flex flex-col gap-2.5">
                            {CV_DEMO_PRESETS.map((preset, idx) => (
                              <button
                                key={idx}
                                onClick={() => { setSimSelectedPreset(idx); selectSimPreset(idx); }}
                                className={`p-3 rounded-2xl border text-left transition-all flex items-center gap-4 cursor-pointer ${
                                  simSelectedPreset === idx
                                    ? "border-[#C86432] bg-[#C86432]/5 shadow-sm"
                                    : isDarkMode
                                    ? "border-transparent bg-[#1d1714]/40 hover:bg-[#1d1714]"
                                    : "border-transparent bg-white/40 hover:bg-white"
                                }`}
                              >
                                <div className="bg-[#eeded5]/40 dark:bg-stone-800 p-1.5 rounded-xl shrink-0" dangerouslySetInnerHTML={{ __html: preset.illustration }} />
                                <div className="truncate">
                                  <span className="text-xs font-bold block">{preset.name}</span>
                                  <span className="text-[10px] text-stone-500 dark:text-stone-300">{t.cvSampleSubtitle}</span>
                                </div>
                              </button>
                            ))}
                          </div>

                          <div className="border-t border-[#eeded5] dark:border-[#332822] pt-4 mt-2">
                            <h3 className="text-xs font-mono font-bold uppercase tracking-wider mb-2.5 text-[#C86432]">{t.cvTemplatePreview}</h3>
                            <div className="flex flex-wrap gap-2">
                              {CV_TEMPLATES.map((tpl) => (
                                <button
                                  key={tpl.id}
                                  onClick={() => setCvTemplate(tpl.id)}
                                  className={`py-1.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                                    cvTemplate === tpl.id
                                      ? "bg-[#C86432] text-white"
                                      : isDarkMode
                                      ? "bg-[#1d1714]/30 hover:bg-[#1d1714]/85 text-[#cbb9af]"
                                      : "bg-white/40 hover:bg-white text-[#7d6b60]"
                                  }`}
                                >
                                  {getTemplateName(tpl)}
                                </button>
                              ))}
                            </div>
                          </div>

                          <button
                            onClick={() => handleLoadCvSimulatedToBuilder(simSelectedPreset)}
                            className="w-full mt-4 py-3 bg-[#C86432] hover:bg-[#aa5328] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer"
                          >
                            <BookOpen className="w-4 h-4 text-amber-200" />
                            <span>{t.cvLoadBuilder}</span>
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Simulated terminal result output (Right) */}
                  <div className="lg:col-span-7 flex flex-col">
                    <div className={`rounded-3xl p-6 flex flex-col h-full min-h-[350px] shadow-2xl relative overflow-hidden ${
                      simScope === "extraction" ? "bg-[#110D0B] border border-[#2A1E19] text-amber-100" : isDarkMode ? "bg-[#1d1714]/60 border-[#332822] text-stone-100" : "bg-white border-[#eeded5] text-stone-800"
                    }`}>
                      <div className="flex items-center justify-between border-b border-[#2A1E19] pb-3 mb-4">
                        <div className="flex items-center gap-2">
                          <span className="w-3 h-3 rounded-full bg-rose-500"></span>
                          <span className="w-3 h-3 rounded-full bg-amber-500"></span>
                          <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                        </div>
                        <span className="font-mono text-[10px] text-stone-500 tracking-widest uppercase">GLYPH SIMULATOR PRO v3.0</span>
                      </div>

                      <div className="flex-1 overflow-y-auto font-mono text-[11px] leading-relaxed relative min-h-[220px]">
                        <AnimatePresence mode="wait">
                          {simIsLoading ? (
                            <motion.div
                              key="loading"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-stone-400"
                            >
                              <RefreshCw className="w-5 h-5 animate-spin text-[#C86432]" />
                              <span>{t.homeDemoSimulating}</span>
                            </motion.div>
                          ) : (
                            <motion.div key="simtext" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="whitespace-pre-wrap select-text selection:bg-[#C86432]">
                              {simScope === "extraction" ? (
                                <div className="whitespace-pre-wrap select-text selection:bg-[#C86432]">{simText}</div>
                              ) : (
                                <div className="w-full h-[340px] rounded-xl overflow-hidden border">
                                  {simPreviewHtml ? (
                                    <iframe title="cv-sim-preview" srcDoc={simPreviewHtml} className="w-full h-full" />
                                  ) : (
                                    <div className={`p-4 rounded-xl border ${isDarkMode ? "border-stone-800 bg-stone-950 text-stone-200" : "border-stone-200 bg-stone-50 text-stone-800"}`}>
                                      <h3 className="text-sm font-bold mb-2">{CV_DEMO_PRESETS[simSelectedPreset % CV_DEMO_PRESETS.length].name}</h3>
                                      <pre className="whitespace-pre-wrap text-xs">{simText}</pre>
                                    </div>
                                  )}
                                </div>
                              )}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      <div className="absolute bottom-3 right-3 bg-[#C86432]/10 text-[#D97736] px-2 py-0.5 rounded text-[9px] font-bold border border-[#C86432]/20">
                        {simScope === "extraction" ? simSelectedMode.toUpperCase() + " VIEW" : "CV SAMPLE"}
                      </div>
                    </div>
                  </div>

                </div>
              </section>

              {/* Information specification grid (switch by simScope) */}
              {simScope === "extraction" ? (
                <section className="flex flex-col gap-8 pb-8">
                <div className="text-center max-w-xl mx-auto gap-2 flex flex-col">
                  <h2 className="text-xl sm:text-2xl font-bold tracking-tight">{t.bentoHeader}</h2>
                  <p className={`text-xs ${isDarkMode ? "text-[#cbb9af]" : "text-[#7d6b60]"}`}>
                    {t.bentoSub}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className={`p-8 rounded-3xl border flex flex-col gap-3 transition-transform hover:scale-[1.01] ${
                    isDarkMode ? "bg-[#1d1714]/40 border-[#332822]" : "bg-white/40 border-[#eeded5]"
                  }`}>
                    <BookOpen className="w-7 h-7 text-[#C86432]" />
                    <h3 className="font-bold text-sm mt-1">{t.bentoCard1Title}</h3>
                    <p className={`text-xs leading-relaxed ${isDarkMode ? "text-[#cbb9af]" : "text-[#7d6b60]"}`}>{t.bentoCard1Desc}</p>
                  </div>
                  <div className={`p-8 rounded-3xl border flex flex-col gap-3 transition-transform hover:scale-[1.01] ${
                    isDarkMode ? "bg-[#1d1714]/40 border-[#332822]" : "bg-white/40 border-[#eeded5]"
                  }`}>
                    <ShieldCheck className="w-7 h-7 text-emerald-600" />
                    <h3 className="font-bold text-sm mt-1">{t.bentoCard2Title}</h3>
                    <p className={`text-xs leading-relaxed ${isDarkMode ? "text-[#cbb9af]" : "text-[#7d6b60]"}`}>{t.bentoCard2Desc}</p>
                  </div>
                  <div className={`p-8 rounded-3xl border flex flex-col gap-3 transition-transform hover:scale-[1.01] ${
                    isDarkMode ? "bg-[#1d1714]/40 border-[#332822]" : "bg-white/40 border-[#eeded5]"
                  }`}>
                    <FileCheck className="w-7 h-7 text-[#C86432]" />
                    <h3 className="font-bold text-sm mt-1">{t.bentoCard3Title}</h3>
                    <p className={`text-xs leading-relaxed ${isDarkMode ? "text-[#cbb9af]" : "text-[#7d6b60]"}`}>{t.bentoCard3Desc}</p>
                  </div>
                  <div className={`p-8 rounded-3xl border flex flex-col gap-3 transition-transform hover:scale-[1.01] ${
                    isDarkMode ? "bg-[#1d1714]/40 border-[#332822]" : "bg-white/40 border-[#eeded5]"
                  }`}>
                    <FileSpreadsheet className="w-7 h-7 text-amber-600" />
                    <h3 className="font-bold text-sm mt-1">{t.bentoCard4Title}</h3>
                    <p className={`text-xs leading-relaxed ${isDarkMode ? "text-[#cbb9af]" : "text-[#7d6b60]"}`}>{t.bentoCard4Desc}</p>
                  </div>
                  <div className={`p-8 rounded-3xl border flex flex-col gap-3 transition-transform hover:scale-[1.01] ${
                    isDarkMode ? "bg-[#1d1714]/40 border-[#332822]" : "bg-white/40 border-[#eeded5]"
                  }`}>
                    <MessageSquare className="w-7 h-7 text-[#C86432]" />
                    <h3 className="font-bold text-sm mt-1">{t.bentoCard5Title}</h3>
                    <p className={`text-xs leading-relaxed ${isDarkMode ? "text-[#cbb9af]" : "text-[#7d6b60]"}`}>{t.bentoCard5Desc}</p>
                  </div>
                  <div className={`p-8 rounded-3xl border flex flex-col gap-3 transition-transform hover:scale-[1.01] ${
                    isDarkMode ? "bg-[#1d1714]/40 border-[#332822]" : "bg-white/40 border-[#eeded5]"
                  }`}>
                    <Layers className="w-7 h-7 text-teal-600" />
                    <h3 className="font-bold text-sm mt-1">{t.bentoCard6Title}</h3>
                    <p className={`text-xs leading-relaxed ${isDarkMode ? "text-[#cbb9af]" : "text-[#7d6b60]"}`}>{t.bentoCard6Desc}</p>
                  </div>
                </div>
                </section>
              ) : (
                <section className="flex flex-col gap-8 pb-8">
                  <div className="text-center max-w-xl mx-auto gap-2 flex flex-col">
                    <h2 className="text-xl sm:text-2xl font-bold tracking-tight">{t.cvFeaturesHeader}</h2>
                    <p className={`text-xs ${isDarkMode ? "text-[#cbb9af]" : "text-[#7d6b60]"}`}>
                      {t.cvFeaturesSub}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className={`p-8 rounded-3xl border flex flex-col gap-3 transition-transform hover:scale-[1.01] ${
                      isDarkMode ? "bg-[#1d1714]/40 border-[#332822]" : "bg-white/40 border-[#eeded5]"
                    }`}>
                      <Palette className="w-7 h-7 text-[#C86432]" />
                      <h3 className="font-bold text-sm mt-1">{t.cvFeatureCard1Title}</h3>
                      <p className={`text-xs leading-relaxed ${isDarkMode ? "text-[#cbb9af]" : "text-[#7d6b60]"}`}>{t.cvFeatureCard1Desc}</p>
                    </div>
                    <div className={`p-8 rounded-3xl border flex flex-col gap-3 transition-transform hover:scale-[1.01] ${
                      isDarkMode ? "bg-[#1d1714]/40 border-[#332822]" : "bg-white/40 border-[#eeded5]"
                    }`}>
                      <Target className="w-7 h-7 text-amber-600" />
                      <h3 className="font-bold text-sm mt-1">{t.cvFeatureCard2Title}</h3>
                      <p className={`text-xs leading-relaxed ${isDarkMode ? "text-[#cbb9af]" : "text-[#7d6b60]"}`}>{t.cvFeatureCard2Desc}</p>
                    </div>
                    <div className={`p-8 rounded-3xl border flex flex-col gap-3 transition-transform hover:scale-[1.01] ${
                      isDarkMode ? "bg-[#1d1714]/40 border-[#332822]" : "bg-white/40 border-[#eeded5]"
                    }`}>
                      <Award className="w-7 h-7 text-teal-600" />
                      <h3 className="font-bold text-sm mt-1">{t.cvFeatureCard3Title}</h3>
                      <p className={`text-xs leading-relaxed ${isDarkMode ? "text-[#cbb9af]" : "text-[#7d6b60]"}`}>{t.cvFeatureCard3Desc}</p>
                    </div>
                  </div>
                </section>
              )}

            </motion.div>
          ) : activeView === "workspace" ? (
            
            /* ORIGINAL INTELLECTUAL WORKSPACE WITH COZY PALETTE */
            <motion.div
              key="workspace"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch"
            >
              {extractedText ? (
                <BeforeVsAfterWorkspace
                  filePreview={filePreview}
                  extractedText={extractedText}
                  resultDocumentType={resultDocumentType}
                  isDarkMode={isDarkMode}
                  clearFile={clearFile}
                  setExtractedText={setExtractedText}
                  language={language}
                  chatMessages={chatMessages}
                  handleSendMessage={handleSendMessage}
                  chatInput={chatInput}
                  setChatInput={setChatInput}
                  isChatting={isChatting}
                  chatError={chatError}
                  chatBottomRef={chatBottomRef}
                  isSpecializedResult={isSpecializedResult}
                  isEditing={isEditing}
                  setIsEditing={setIsEditing}
                  editedText={editedText}
                  setEditedText={setEditedText}
                  handleCopy={handleCopy}
                  copyFeedback={copyFeedback}
                  downloadTextFile={downloadTextFile}
                  downloadDocFile={downloadDocFile}
                  t={t}
                />
              ) : (
                <>
                  {/* Left Column: Configs & Uploads */}
                  <section className="lg:col-span-5 flex flex-col gap-6" id="upload-panel">
                
                {/* Upload Card */}
                <div className={`rounded-3xl border p-6 flex flex-col gap-4 ${
                  isDarkMode ? "bg-[#1d1714]/80 border-[#332822]" : "bg-white/80 border-[#eeded5]"
                }`}>
                  <div className="flex items-center justify-between">
                    <h2 className="text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#C86432] animate-pulse"></span>
                      {t.step1Title}
                    </h2>
                    {filePreview && (
                      <button
                        onClick={clearFile}
                        className="text-[11px] font-bold text-rose-500 hover:text-white border border-rose-500/20 bg-rose-500/10 hover:bg-rose-600 px-2.5 py-1 rounded-lg transition-all cursor-pointer"
                      >
                        {t.clearFile}
                      </button>
                    )}
                  </div>

                  <AnimatePresence mode="wait">
                    {!filePreview ? (
                      <motion.div
                        key="dropzone"
                        ref={dropRef}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        onClick={triggerFileSelect}
                        className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all duration-300 flex flex-col items-center justify-center min-h-[220px] ${
                          dragOver
                            ? "border-[#C86432] bg-[#C86432]/5"
                            : isDarkMode
                            ? "border-stone-800 bg-[#1d1714]/30 hover:bg-[#1d1714]/65"
                            : "border-stone-200 bg-white/30 hover:bg-white"
                        }`}
                      >
                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={handleFileChange}
                          className="hidden"
                          accept="image/*,application/pdf"
                        />
                        <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-3 border ${
                          isDarkMode ? "bg-[#301c13] text-[#D97736] border-[#4a2e21]" : "bg-[#eeded5]/60 text-[#C86432] border-[#eeded5]"
                        }`}>
                          <Upload className="w-6 h-6" />
                        </div>
                        <p className="text-xs font-semibold">
                          Drop your file here, or <span className="text-[#C86432] underline">browse</span>
                        </p>
                        <p className={`text-[10px] mt-1 ${isDarkMode ? "text-stone-300" : "text-stone-500"}`}>
                          {t.dropZoneSubText}
                        </p>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="preview"
                        className={`border rounded-2xl overflow-hidden relative flex flex-col min-h-[220px] justify-center items-center ${
                          isDarkMode ? "border-stone-800 bg-stone-900/10" : "border-stone-200 bg-white"
                        }`}
                      >
                        {fileMimeType.startsWith("image/") ? (
                          <div className="relative w-full max-h-[260px] overflow-hidden flex items-center justify-center p-2">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={filePreview}
                              alt="Uploaded visual document"
                              className="object-contain max-h-[240px] rounded-lg border border-[#eeded5]/40"
                            />
                            <div className="absolute top-2 left-2 bg-[#1d1714]/90 text-white text-[9px] px-2.5 py-0.5 rounded-full font-mono">
                              IMAGE
                            </div>
                          </div>
                        ) : (
                          <div className="p-8 flex flex-col items-center justify-center text-center">
                            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-3 border ${
                              isDarkMode ? "bg-stone-900 border-stone-800 text-[#C86432]" : "bg-white border-stone-200 text-[#C86432]"
                            }`}>
                              <FileText className="w-8 h-8" />
                            </div>
                            <span className="text-xs font-bold font-mono text-stone-500 uppercase tracking-widest">PDF DOCUMENT</span>
                          </div>
                        )}

                        {/* Metadata bar */}
                        <div className={`w-full border-t p-3 text-xs flex justify-between items-center ${
                          isDarkMode ? "border-[#332822] bg-[#1d1714]/84 text-[#f7f3f0]" : "border-[#eeded5] bg-[#FAF6F0] text-[#3c2f2f]"
                        }`}>
                          <div className="flex flex-col gap-0.5 max-w-[70%]">
                            <span className="font-bold truncate">{fileName}</span>
                            <span className="font-mono text-[10px] opacity-70">{fileSize}</span>
                          </div>
                          <button onClick={clearFile} className="p-1.5 rounded-lg border border-transparent text-rose-500 hover:bg-rose-500/10 cursor-pointer">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Sample selection panels */}
                  {!filePreview && (
                    <div className="pt-2 border-t border-[#eeded5] dark:border-[#332822]">
                      <p className="text-[10px] font-bold uppercase tracking-wider mb-2.5 text-[#C86432]">{t.samplesTitle}</p>
                      <div className="grid grid-cols-2 gap-2">
                        {SAMPLES.map((sample, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleLoadSample(sample)}
                            className={`p-2 border rounded-xl text-[11px] font-bold text-left transition-all truncate flex items-center gap-1.5 cursor-pointer ${
                              isDarkMode
                                ? "border-transparent bg-[#1d1714]/30 hover:bg-[#1d1714]/90 hover:border-[#C86432]"
                                : "border-transparent bg-white shadow-2xs hover:border-[#C86432]"
                            }`}
                          >
                            <Eye className="w-3.5 h-3.5 text-[#C86432]" />
                            <span className="truncate">{sample.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Processing parameters card */}
                <div className={`rounded-3xl border p-6 flex flex-col gap-4 ${
                  isDarkMode ? "bg-[#1d1714]/80 border-[#332822]" : "bg-white/80 border-[#eeded5]"
                }`}>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-[#C86432]">
                    {t.processingSettings}
                  </h3>

                  {/* Document Type Selector */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] uppercase font-bold tracking-wider text-stone-500 dark:text-stone-300">{t.documentTypeLabel}</label>
                    <select
                      value={documentType}
                      onChange={(e) => setDocumentType(e.target.value)}
                      className={`w-full p-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                        isDarkMode ? "border-[#332822] bg-[#1a1412] text-white" : "border-[#eeded5] bg-white text-[#3c2f2f]"
                      }`}
                    >
                      <option value="general_ocr">{t.docTypeGeneral}</option>
                      <option value="invoice">{t.docTypeInvoice}</option>
                      <option value="contract">{t.docTypeContract}</option>
                      <option value="resume">{t.docTypeResume}</option>
                      <option value="receipt">{t.docTypeReceipt}</option>
                      <option value="table">{t.docTypeTable}</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] uppercase font-bold tracking-wider text-stone-500 dark:text-stone-300">{t.extractionModeLabel}</label>
                    {documentType === "general_ocr" ? (
                      <div className="flex flex-col gap-1.5">
                        {["raw", "layout", "transcript", "summary", "key-value"].map((mode) => (
                          <button
                            key={mode}
                            onClick={() => setExtractionMode(mode)}
                            className={`p-2.5 rounded-xl border text-left text-xs font-bold flex items-center justify-between transition-all cursor-pointer ${
                              extractionMode === mode
                                ? "border-[#C86432] bg-[#C86432]/10 text-[#C86432]"
                                : isDarkMode
                                ? "border-transparent bg-[#1d1714]/30 hover:bg-[#1d1714]/50"
                                : "border-transparent bg-white shadow-3xs hover:bg-stone-50"
                            }`}
                          >
                            <span>{t.modes[mode]}</span>
                            <span className={`text-[9px] font-mono opacity-80 ${extractionMode === mode ? "text-[#C86432]" : "text-stone-500 dark:text-stone-300"}`}>
                              {mode.toUpperCase()}
                            </span>
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className={`p-3.5 rounded-xl border text-[11px] leading-relaxed transition-all ${
                        isDarkMode ? "bg-stone-900/40 border-stone-800 text-stone-300" : "bg-stone-50/60 border-stone-100 text-stone-600"
                      }`}>
                        ✨ <span className="font-bold text-[#C86432]">
                          {documentType === "invoice" && t.docTypeInvoice}
                          {documentType === "contract" && t.docTypeContract}
                          {documentType === "resume" && t.docTypeResume}
                          {documentType === "receipt" && t.docTypeReceipt}
                          {documentType === "table" && t.docTypeTable}
                        </span>: Uses schema-enforced structured JSON output with field-by-field OCR confidence meters.
                      </div>
                    )}
                  </div>

                  {/* Publishing template selection */}
                  <div className="border-t border-[#eeded5] dark:border-[#332822] pt-3 flex flex-col gap-1.5">
                    <label className="text-[10px] uppercase font-bold tracking-wider text-stone-500 dark:text-stone-300">{t.publishingMethod}</label>
                    <select
                      value={publishingMethod}
                      onChange={(e) => setPublishingMethod(e.target.value)}
                      className={`w-full p-2.5 rounded-xl border text-xs font-bold transition-all ${
                        isDarkMode ? "border-[#332822] bg-[#1a1412] text-white" : "border-[#eeded5] bg-white text-[#3c2f2f]"
                      }`}
                    >
                      <option value="raw">{t.publishingDesc.raw}</option>
                      <option value="email">{t.publishingDesc.email}</option>
                      <option value="wiki">{t.publishingDesc.wiki}</option>
                      <option value="blog">{t.publishingDesc.blog}</option>
                      <option value="json">{t.publishingDesc.json}</option>
                    </select>
                  </div>

                  {/* Additional parameters prompt input */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] uppercase font-bold tracking-wider text-stone-500 dark:text-stone-300">{t.additionalDirectives}</label>
                    <textarea
                      value={customPrompt}
                      onChange={(e) => setCustomPrompt(e.target.value)}
                      placeholder={t.directivesPlaceholder}
                      className={`w-full text-xs p-3 rounded-xl border h-16 resize-none focus:ring-1 focus:ring-[#C86432] focus:outline-hidden ${
                        isDarkMode ? "border-stone-800 bg-[#1a1412] text-white" : "border-stone-205 bg-white text-[#3c2f2f]"
                      }`}
                    />
                  </div>

                  <button
                    onClick={handleExtractText}
                    disabled={!filePreview || isExtracting}
                    className={`w-full py-3.5 rounded-xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      !filePreview
                        ? "bg-stone-200 text-stone-400 cursor-not-allowed"
                        : isExtracting
                        ? "bg-[#C86432] text-white animate-pulse"
                        : "bg-[#C86432] hover:bg-[#aa5328] text-white"
                    }`}
                  >
                    {isExtracting ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin text-white" />
                        <span>{t.parsingImage}</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 text-amber-100" />
                        <span>{t.startExtraction}</span>
                      </>
                    )}
                  </button>

                  {extractionError && (
                    <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl flex gap-2 items-start text-xs text-rose-900 font-bold dark:text-rose-200 font-mono">
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-500" />
                      <div>
                        <div>{t.extractionFailed}</div>
                        <div className="text-[10px] font-normal opacity-80 mt-0.5">{extractionError}</div>
                      </div>
                    </div>
                  )}

                </div>
              </section>

              {/* Right Column: Dynamic Output Segment & Chat tabs */}
              <section className="lg:col-span-7 flex flex-col gap-6" id="result-workspace">
                <div className={`rounded-3xl border flex flex-col h-full min-h-[500px] ${
                  isDarkMode ? "bg-[#1d1714]/80 border-[#332822]" : "bg-white/80 border-[#eeded5]"
                }`}>
                  
                  {/* Outer view checker: Empty state check */}
                  {!extractedText && !isExtracting ? (
                    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center min-h-[380px]">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 border ${
                        isDarkMode ? "bg-[#301c13] text-[#D97736] border-[#4a2e21]" : "bg-[#eeded5] text-[#C86432] border-[#eeded5]"
                      }`}>
                        <Layers className="w-5 h-5" />
                      </div>
                      <h3 className="text-sm font-bold">{t.noContentTitle}</h3>
                      <p className={`text-xs max-w-sm mt-1.5 leading-relaxed ${isDarkMode ? "text-stone-300" : "text-stone-500"}`}>
                        {t.noContentSubText}
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-lg mt-8 w-full text-left">
                        <div className={`p-4 rounded-2xl border ${isDarkMode ? "bg-[#1d1714]/30 border-stone-800" : "bg-stone-50 border-stone-200"}`}>
                          <span className="text-[10px] font-bold text-[#C86432] uppercase">STEP 1</span>
                          <h4 className="text-xs font-bold mt-1">{t.step1Title}</h4>
                          <p className="text-[10px] text-stone-500 dark:text-stone-300 mt-1">{t.step1Sub}</p>
                        </div>
                        <div className={`p-4 rounded-2xl border ${isDarkMode ? "bg-[#1d1714]/30 border-stone-800" : "bg-stone-50 border-stone-200"}`}>
                          <span className="text-[10px] font-bold text-[#C86432] uppercase">STEP 2</span>
                          <h4 className="text-xs font-bold mt-1">{t.step2Title}</h4>
                          <p className="text-[10px] text-stone-500 dark:text-stone-300 mt-1">{t.step2Sub}</p>
                        </div>
                        <div className={`p-4 rounded-2xl border ${isDarkMode ? "bg-[#1d1714]/30 border-stone-800" : "bg-stone-50 border-stone-200"}`}>
                          <span className="text-[10px] font-bold text-[#C86432] uppercase">STEP 3</span>
                          <h4 className="text-xs font-bold mt-1">{t.step3Title}</h4>
                          <p className="text-[10px] text-stone-500 dark:text-stone-300 mt-1">{t.step3Sub}</p>
                        </div>
                      </div>
                    </div>
                  ) : isExtracting ? (
                    
                    /* Loader component with beautiful Processing Tracker */
                    <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-10 max-w-xl mx-auto w-full text-center">
                      <div className="relative mb-8 flex flex-col items-center">
                        <div className="w-14 h-14 rounded-full border-4 border-transparent border-t-[#C86432] animate-spin mb-4" />
                        <span className="text-[10px] font-mono font-extrabold tracking-widest text-[#C86432] uppercase bg-[#C86432]/10 px-3 py-1 rounded-full">
                          {t.awaitingResponse}
                        </span>
                      </div>

                      <div className="w-full mb-8">
                        <div className="flex justify-between items-baseline mb-2">
                          <span className={`text-[10px] font-mono font-bold uppercase ${isDarkMode ? "text-stone-300" : "text-stone-500"}`}>
                            {t.loadingEngine}
                          </span>
                          <span className="text-sm font-extrabold text-[#C86432] font-mono">
                            {Math.min(100, Math.round(((trackerStep + 1) / 5) * 100))}%
                          </span>
                        </div>
                        {/* Progress Bar background track */}
                        <div className={`w-full h-2 rounded-full overflow-hidden ${isDarkMode ? "bg-stone-800" : "bg-stone-200"}`}>
                          <motion.div
                            className="h-full bg-[#C86432]"
                            initial={{ width: "10%" }}
                            animate={{ width: `${Math.min(100, ((trackerStep + 1) / 5) * 100)}%` }}
                            transition={{ duration: 0.5, ease: "easeOut" }}
                          />
                        </div>
                      </div>

                      {/* Vertically connected Steps tracker */}
                      <div className="w-full text-left space-y-4">
                        {(t.trackerSteps || []).map((stepText: string, idx: number) => {
                          const isCompleted = idx < trackerStep;
                          const isActive = idx === trackerStep;
                          return (
                            <div key={idx} className="flex gap-4 items-start relative select-none">
                              {/* Left line connection */}
                              {idx < 4 && (
                                <div
                                  className={`absolute left-3 top-6 w-0.5 h-10 -ml-[1px] ${
                                    isCompleted ? "bg-[#C86432]" : isDarkMode ? "bg-stone-800" : "bg-stone-200"
                                  }`}
                                />
                              )}
                              
                              {/* Step indicator node */}
                              <div
                                className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 border z-10 transition-all ${
                                  isCompleted
                                    ? "bg-[#C86432] border-[#C86432] text-white"
                                    : isActive
                                    ? "bg-[#C86432]/10 border-[#C86432] text-[#C86432] animate-pulse scale-105"
                                    : isDarkMode
                                    ? "bg-stone-900 border-stone-800 text-stone-600"
                                    : "bg-white border-stone-200 text-stone-400"
                                }`}
                              >
                                {isCompleted ? (
                                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                                ) : (
                                  <span className="text-[10px] font-bold font-mono">{idx + 1}</span>
                                )}
                              </div>

                              {/* Target step description label */}
                              <div className="pt-0.5">
                                <p
                                  className={`text-xs font-bold transition-all ${
                                    isActive
                                      ? "text-[#C86432] scale-[1.01]"
                                      : isCompleted
                                      ? isDarkMode
                                        ? "text-stone-300 font-medium"
                                        : "text-stone-600 font-medium"
                                      : isDarkMode
                                      ? "text-stone-600"
                                      : "text-stone-400"
                                  }`}
                                >
                                  {stepText}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    
                    /* Workspace with real output metadata */
                    <div className="flex-1 flex flex-col min-h-0">
                      
                      {/* Active Panel header toolbar with controls */}
                      <div className={`p-4 border-b flex flex-wrap items-center justify-between gap-3 ${
                        isDarkMode ? "border-[#332822] bg-[#1c1411]" : "border-[#eeded5] bg-[#FAF6F0]"
                      }`}>
                        {/* Word counter attributes */}
                        <div className="flex flex-wrap items-center gap-1.5 font-mono text-[10px] text-stone-500 dark:text-stone-300 font-bold uppercase">
                          <span className="bg-[#C86432]/10 text-[#C86432] px-2 py-1 rounded-lg">{wordCount} {t.words}</span>
                          <span className="bg-[#C86432]/10 text-[#C86432] px-2 py-1 rounded-lg">{charCount} {t.chars}</span>
                          <span className="bg-[#C86432] text-white px-2 py-1 rounded-lg">{extractionMode.toUpperCase()}</span>
                        </div>

                        {/* Workspace toggle tabs */}
                        <div className="grid grid-cols-2 w-full sm:w-auto border border-[#eeded5] dark:border-[#332822] p-0.5 rounded-xl bg-stone-100/50 dark:bg-stone-900/40 gap-1">
                          <button
                            onClick={() => setActiveTab("result")}
                            className={`min-h-10 px-2.5 sm:px-3 py-2 sm:py-1.5 text-[11px] sm:text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 text-center leading-tight cursor-pointer ${
                              activeTab === "result" ? "bg-[#C86432] text-white" : "text-stone-500 dark:text-stone-300"
                            }`}
                          >
                            <FileCheck className="w-3.5 h-3.5" />
                            <span>{t.extractedText}</span>
                          </button>
                          <button
                            onClick={() => setActiveTab("chat")}
                            className={`min-h-10 px-2.5 sm:px-3 py-2 sm:py-1.5 text-[11px] sm:text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 text-center leading-tight cursor-pointer ${
                              activeTab === "chat" ? "bg-[#C86432] text-white" : "text-stone-500 dark:text-stone-300"
                            }`}
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                            <span>{t.chatWithDoc}</span>
                          </button>
                        </div>
                      </div>

                      {/* Display Panels */}
                      <div className="flex-1 flex flex-col min-h-0 bg-transparent relative">
                        {activeTab === "result" ? (
                          <div className="flex-1 flex flex-col min-h-0">
                            {/* Visual vs Raw JSON Toggler for Specialized Extractions */}
                            {isSpecializedResult && !isEditing && (
                              <div className="px-5 pt-3.5 pb-2 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between bg-stone-100 dark:bg-stone-900/10">
                                <span className="text-[10.5px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-300">⚡ Structured Mode</span>
                                <div className="flex items-center gap-1 bg-stone-100 dark:bg-stone-900 border dark:border-stone-800 p-0.5 rounded-xl text-[10px]">
                                  <button
                                    onClick={() => setIsJsonVisualMode(true)}
                                    className={`px-3 py-1 font-bold rounded-lg transition-all cursor-pointer ${
                                      isJsonVisualMode
                                        ? "bg-[#C86432] text-white"
                                        : "text-stone-500 dark:text-stone-300 hover:text-stone-700 dark:hover:text-stone-100"
                                    }`}
                                  >
                                    Visual Report
                                  </button>
                                  <button
                                    onClick={() => setIsJsonVisualMode(false)}
                                    className={`px-3 py-1 font-bold rounded-lg transition-all cursor-pointer ${
                                      !isJsonVisualMode
                                        ? "bg-[#C86432] text-white"
                                        : "text-stone-500 dark:text-stone-300 hover:text-stone-700 dark:hover:text-stone-100"
                                    }`}
                                  >
                                    Raw JSON Code
                                  </button>
                                </div>
                              </div>
                            )}

                            <div className={`flex-1 overflow-y-auto p-5 max-h-[380px] text-xs ${isDarkMode ? "text-stone-200" : "text-stone-800"}`}>
                              {isEditing ? (
                                <div className="flex flex-col gap-1.5 h-full">
                                  <span className="text-[10px] font-bold text-[#C86432]">EDIT MODE</span>
                                  <textarea
                                    value={editedText}
                                    onChange={(e) => setEditedText(e.target.value)}
                                    className={`w-full min-h-[220px] p-4 text-xs font-mono rounded-xl border focus:outline-hidden ${
                                      isDarkMode ? "border-stone-800 bg-stone-950 text-white" : "border-stone-200 bg-stone-50 text-stone-800"
                                    }`}
                                  />
                                </div>
                              ) : isSpecializedResult && isJsonVisualMode ? (
                                <div className="p-1">
                                  {renderVisualStructuredResult(extractedText, resultDocumentType)}
                                </div>
                              ) : (
                                <div className={`p-4 rounded-xl border whitespace-pre-wrap font-sans text-xs leading-relaxed selection:bg-[#C86432] ${
                                  isDarkMode ? "border-stone-800 bg-stone-950 text-stone-200" : "border-stone-200 bg-stone-50 text-stone-800"
                                }`}>
                                  {extractedText}
                                </div>
                              )}
                            </div>

                            {/* Toolbar actions footer */}
                            <div className={`p-4 border-t flex flex-wrap items-center justify-between gap-3 ${
                              isDarkMode ? "border-[#332822] bg-[#1d1714]/60" : "border-[#eeded5] bg-[#FAF6F0]"
                            }`}>
                              <div>
                                {isEditing ? (
                                  <div className="flex items-center gap-2">
                                    <button
                                      onClick={() => { setExtractedText(editedText); setIsEditing(false); }}
                                      className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg transition-all cursor-pointer"
                                    >
                                      {t.saveBtn}
                                    </button>
                                    <button
                                      onClick={() => { setEditedText(extractedText); setIsEditing(false); }}
                                      className="px-3.5 py-1.5 border border-stone-200 dark:border-stone-800 font-bold text-xs rounded-lg transition-all cursor-pointer"
                                    >
                                      {t.cancelBtn}
                                    </button>
                                  </div>
                                ) : (
                                  <button
                                    onClick={() => { setEditedText(getDisplayableOrDownloadableText(extractedText, resultDocumentType)); setIsEditing(true); }}
                                    className="px-3 py-1.5 border border-[#eeded5] dark:border-[#332822] text-xs font-bold rounded-xl hover:bg-stone-50 dark:hover:bg-stone-900 cursor-pointer text-[#C86432]"
                                  >
                                    {t.editBtn}
                                  </button>
                                )}
                              </div>

                              <div className="flex items-center gap-2">
                                <button
                                  onClick={handleCopy}
                                  className="px-3 py-1.5 border border-[#eeded5] dark:border-[#332822] text-xs font-bold rounded-xl transition-all cursor-pointer"
                                >
                                  {copyFeedback ? t.copied : t.copyText}
                                </button>

                                <div className="flex items-center border p-0.5 rounded-xl border-[#eeded5] dark:border-[#332822] bg-stone-200/40 text-[10px]">
                                  <button onClick={() => downloadTextFile("md")} className="p-1 px-2 font-bold font-mono">.MD</button>
                                  <button onClick={() => downloadTextFile("txt")} className="p-1 px-2 font-bold font-mono border-l border-[#eeded5] dark:border-[#332822]">.TXT</button>
                                  <button onClick={downloadDocFile} className="p-1 px-2 font-bold font-mono border-l border-[#eeded5] dark:border-[#332822]">.DOC</button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ) : (
                          
                          /* Dialogue layout tab */
                          <div className="flex-1 flex flex-col min-h-0">
                            
                            {chatMessages.length === 0 && (
                              <div className={`p-4 text-xs ${isDarkMode ? "bg-[#301c13]/30 text-stone-300" : "bg-[#eeded5]/20 text-stone-700"}`}>
                                <h3 className="font-bold text-[#C86432] flex items-center gap-1.5">
                                  <MessageSquare className="w-4 h-4" />
                                  <span>{t.chatHintTitle}</span>
                                </h3>
                                <p className="mt-1 opacity-90 leading-normal">{t.chatHintDesc}</p>
                              </div>
                            )}

                            {/* Dialogue feeds */}
                            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 max-h-[300px]">
                              {chatMessages.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-8 text-stone-400">
                                  <MessageSquare className="w-8 h-8 mb-2 text-[#C86432]/60 animate-bounce" />
                                  <span className="text-xs font-bold uppercase tracking-wider">{t.chatPromptIntro}</span>
                                  <div className="flex flex-col gap-1.5 mt-3.5 max-w-sm w-full">
                                    <button
                                      onClick={() => setChatInput(t.chatPromptDates)}
                                      className={`p-2.5 rounded-xl text-left border text-[11px] font-bold cursor-pointer ${
                                        isDarkMode ? "border-stone-800 bg-stone-900/20 hover:bg-stone-900" : "border-stone-200 bg-white hover:bg-stone-50"
                                      }`}
                                    >
                                      {t.chatSample1}
                                    </button>
                                    <button
                                      onClick={() => setChatInput(t.chatPromptInvoice)}
                                      className={`p-2.5 rounded-xl text-left border text-[11px] font-bold cursor-pointer ${
                                        isDarkMode ? "border-stone-800 bg-stone-900/20 hover:bg-stone-900" : "border-stone-200 bg-white hover:bg-stone-50"
                                      }`}
                                    >
                                      {t.chatSample2}
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                chatMessages.map((msg) => (
                                  <div key={msg.id} className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}>
                                    <span className="text-[9px] font-mono tracking-widest text-[#C86432]/80 uppercase mb-0.5">{msg.role === "user" ? t.you : t.assistant}</span>
                                    <div className={`p-3 rounded-2xl max-w-[85%] text-xs leading-relaxed ${
                                      msg.role === "user" ? "bg-[#C86432] text-white" : isDarkMode ? "bg-stone-950 text-stone-200 border border-stone-800" : "bg-stone-50 text-stone-800 border"
                                    }`}>
                                      {msg.content}
                                    </div>
                                  </div>
                                ))
                              )}

                              {isChatting && (
                                <div className="items-start flex flex-col gap-0.5">
                                  <span className="text-[9px] tracking-widest text-[#C86432]/80 uppercase">{t.assistant}</span>
                                  <div className="p-3 bg-[#eeded5]/40 dark:bg-stone-900/50 rounded-2xl animate-pulse text-xs italic flex items-center gap-1 text-[#C86432]">
                                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                    <span>{t.chatLoading}</span>
                                  </div>
                                </div>
                              )}

                              {chatError && (
                                <div className="p-2 bg-rose-500/10 text-rose-800 dark:text-rose-200 text-xs font-bold rounded-xl font-mono flex items-center gap-2">
                                  <AlertCircle className="w-4 h-4 text-rose-500" />
                                  <span>{chatError}</span>
                                </div>
                              )}
                              <div ref={chatBottomRef} />
                            </div>

                            {/* Dialogue footer bar input */}
                            <form onSubmit={handleSendMessage} className={`p-3 border-t flex gap-2 ${
                              isDarkMode ? "border-[#332822] bg-[#1d1714]/60" : "border-[#eeded5] bg-[#FAF6F0]"
                            }`}>
                              <input
                                type="text"
                                value={chatInput}
                                onChange={(e) => setChatInput(e.target.value)}
                                placeholder={t.chatPlaceholder}
                                disabled={isChatting}
                                className={`flex-1 text-xs p-2.5 rounded-xl border focus:outline-hidden focus:ring-1 focus:ring-[#C86432] ${
                                  isDarkMode ? "border-stone-800 bg-[#14100e] text-white" : "border-stone-200 bg-white text-stone-800"
                                }`}
                              />
                              <button
                                type="submit"
                                disabled={!chatInput.trim() || isChatting}
                                className="px-4 py-2 bg-[#C86432] hover:bg-[#aa5328] disabled:bg-stone-300 disabled:text-stone-500 text-white font-bold rounded-xl text-xs flex items-center justify-center transition-all shrink-0 cursor-pointer"
                              >
                                <Send className="w-3.5 h-3.5" />
                              </button>
                            </form>
                          </div>

                        )}
                      </div>

                    </div>
                  )}

                </div>
              </section>
                </>
              )}
            </motion.div>
          ) : activeView === "cv" ? (
            
            /* CV BUILDER PAGE - Full-featured resume optimization */
            <motion.div
              key="cv-builder"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch"
            >
              {/* Left Column: CV Upload & Configuration */}
              <section className="lg:col-span-5 flex flex-col gap-6" id="cv-upload-panel">
                
                {/* CV Upload Card */}
                <div className={`rounded-3xl border p-6 flex flex-col gap-4 ${
                  isDarkMode ? "bg-[#1d1714]/80 border-[#332822]" : "bg-white/80 border-[#eeded5]"
                }`}>
                  <div className="flex items-center justify-between">
                    <h2 className="text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#C86432] animate-pulse"></span>
                      {t.cvSource}
                    </h2>
                    {cvInputMode === "file" && cvFilePreview && (
                      <button
                        onClick={clearCvFile}
                        className="text-[11px] font-bold text-rose-500 hover:text-white border border-rose-500/20 bg-rose-500/10 hover:bg-rose-600 px-2.5 py-1 rounded-lg transition-all cursor-pointer"
                      >
                        {t.cvClear}
                      </button>
                    )}
                    {cvInputMode === "notes" && cvRawNotes && (
                      <button
                        onClick={() => setCvRawNotes("")}
                        className="text-[11px] font-bold text-rose-500 hover:text-white border border-rose-500/20 bg-rose-500/10 hover:bg-rose-600 px-2.5 py-1 rounded-lg transition-all cursor-pointer"
                      >
                        {t.cvClear}
                      </button>
                    )}
                  </div>

                  <div className={`grid grid-cols-2 gap-1 rounded-xl border p-1 text-[11px] font-bold ${
                    isDarkMode ? "border-[#332822] bg-[#14100e]" : "border-[#eeded5] bg-[#FAF6F0]"
                  }`}>
                    <button
                      type="button"
                      onClick={() => setCvInputMode("file")}
                      className={`rounded-lg px-3 py-2 transition-all cursor-pointer ${
                        cvInputMode === "file"
                          ? "bg-[#C86432] text-white shadow-sm"
                          : isDarkMode
                          ? "text-stone-400 hover:text-white"
                          : "text-stone-600 hover:text-[#3c2f2f]"
                      }`}
                    >
                      {t.cvFileUpload}
                    </button>
                    <button
                      type="button"
                      onClick={() => setCvInputMode("notes")}
                      className={`rounded-lg px-3 py-2 transition-all cursor-pointer ${
                        cvInputMode === "notes"
                          ? "bg-[#C86432] text-white shadow-sm"
                          : isDarkMode
                          ? "text-stone-400 hover:text-white"
                          : "text-stone-600 hover:text-[#3c2f2f]"
                      }`}
                    >
                      {t.cvRawNotes}
                    </button>
                  </div>

                  <AnimatePresence mode="wait">
                    {cvInputMode === "notes" ? (
                      <motion.div
                        key="cv-raw-notes"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        className="flex flex-col gap-2"
                      >
                        <textarea
                          value={cvRawNotes}
                          onChange={(e) => setCvRawNotes(e.target.value.slice(0, cvRawNotesMaxLength))}
                          placeholder={t.cvRawNotesPlaceholder}
                          maxLength={cvRawNotesMaxLength}
                          className={`w-full min-h-[240px] rounded-2xl border p-4 text-xs leading-relaxed resize-y focus:outline-hidden focus:ring-1 focus:ring-[#C86432] ${
                            isDarkMode
                              ? "border-stone-800 bg-[#14100e] text-white placeholder-stone-600"
                              : "border-stone-200 bg-white text-stone-800 placeholder-stone-400"
                          }`}
                        />
                        <div className="flex items-center justify-between gap-3 text-[10px]">
                          <span className={cvRawNotesTrimmed.length > 0 && cvRawNotesTrimmed.length < cvRawNotesMinLength ? "text-amber-600 dark:text-amber-300 font-bold" : "text-stone-500 dark:text-stone-300"}>
                            {t.cvRawNotesMin} {cvRawNotesMinLength} {t.chars}
                          </span>
                          <span className="text-stone-500 dark:text-stone-300 font-mono">
                            {cvRawNotes.length}/{cvRawNotesMaxLength}
                          </span>
                        </div>
                      </motion.div>
                    ) : !cvFilePreview ? (
                      <motion.div
                        key="cv-dropzone"
                        ref={cvDropRef}
                        onDragOver={(e) => { e.preventDefault(); setCvDragOver(true); }}
                        onDragLeave={() => setCvDragOver(false)}
                        onDrop={handleCvDrop}
                        onClick={() => cvFileInputRef.current?.click()}
                        className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all duration-300 flex flex-col items-center justify-center min-h-[220px] ${
                          cvDragOver
                            ? "border-[#C86432] bg-[#C86432]/5"
                            : isDarkMode
                            ? "border-stone-800 bg-[#1d1714]/30 hover:bg-[#1d1714]/65"
                            : "border-stone-200 bg-white/30 hover:bg-white"
                        }`}
                      >
                        <input
                          type="file"
                          ref={cvFileInputRef}
                          onChange={handleCvFileChange}
                          className="hidden"
                          accept="image/*,.pdf,.doc,.docx"
                        />
                        <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-3 border ${
                          isDarkMode ? "bg-[#301c13] text-[#D97736] border-[#4a2e21]" : "bg-[#eeded5]/60 text-[#C86432] border-[#eeded5]"
                        }`}>
                          <FileText className="w-6 h-6" />
                        </div>
                        <p className="text-xs font-semibold">
                          {t.cvDropTitle}
                        </p>
                        <p className={`text-[10px] mt-1 ${isDarkMode ? "text-stone-300" : "text-stone-500"}`}>
                          {t.cvDropSub}
                        </p>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="cv-preview"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex flex-col gap-3"
                      >
                        <div className={`p-3 rounded-2xl flex items-start justify-between gap-3 ${
                          isDarkMode ? "bg-[#301c13]/50 border border-[#4a2e21]" : "bg-[#eeded5]/30 border border-[#eeded5]"
                        }`}>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold truncate">{cvFileName}</p>
                            <p className={`text-[10px] ${isDarkMode ? "text-stone-300" : "text-stone-500"}`}>{cvFileSize}</p>
                          </div>
                          <Check className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                        </div>
                        {cvFilePreview && cvFilePreview.startsWith("data:image") && (
                          <div className={`w-full h-32 rounded-xl border overflow-hidden ${isDarkMode ? "border-stone-800 bg-stone-950" : "border-stone-200 bg-white"}`}>
                            <img src={cvFilePreview} alt="CV Preview" className="w-full h-full object-cover" />
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Template Selector Card */}
                <div className={`rounded-3xl border p-6 flex flex-col gap-4 ${
                  isDarkMode ? "bg-[#1d1714]/80 border-[#332822]" : "bg-white/80 border-[#eeded5]"
                }`}>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-[#C86432] flex items-center gap-2">
                    <Palette className="w-4 h-4" />
                    {t.cvTemplateStyle}
                  </h3>
                  <div className="flex flex-col gap-2">
                    {CV_TEMPLATES.map((template) => (
                      <button
                        key={template.id}
                        onClick={() => setCvTemplate(template.id)}
                        className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                          cvTemplate === template.id
                            ? "border-[#C86432] bg-[#C86432]/10"
                            : isDarkMode
                            ? "border-transparent bg-[#1d1714]/30 hover:bg-[#1d1714]/50"
                            : "border-transparent bg-white shadow-3xs hover:bg-stone-50"
                        }`}
                      >
                        <span className={`text-xs font-bold block ${cvTemplate === template.id ? "text-[#C86432]" : ""}`}>
                          {getTemplateName(template)}
                        </span>
                        <span className="text-[10px] text-stone-500 dark:text-stone-300 block mt-1 leading-tight">{getTemplateDesc(template)}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* CV Customization Card */}
                <div className={`rounded-3xl border p-6 flex flex-col gap-4 ${
                  isDarkMode ? "bg-[#1d1714]/80 border-[#332822]" : "bg-white/80 border-[#eeded5]"
                }`}>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-[#C86432] flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    {t.cvOptimizationSettings}
                  </h3>

                  {/* Tone */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] uppercase font-bold tracking-wider text-stone-500 dark:text-stone-300">{t.cvTone}</label>
                    <select
                      value={cvTone}
                      onChange={(e) => setCvTone(e.target.value)}
                      className={`w-full p-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                        isDarkMode ? "border-[#332822] bg-[#1a1412] text-white" : "border-[#eeded5] bg-white text-[#3c2f2f]"
                      }`}
                    >
                      {CV_TONES.map((tone) => (
                        <option key={tone} value={tone}>{cvToneLabels[tone] || tone}</option>
                      ))}
                    </select>
                  </div>

                  {/* Seniority Level */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] uppercase font-bold tracking-wider text-stone-500 dark:text-stone-300">{t.cvSeniority}</label>
                    <select
                      value={cvSeniority}
                      onChange={(e) => setCvSeniority(e.target.value)}
                      className={`w-full p-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                        isDarkMode ? "border-[#332822] bg-[#1a1412] text-white" : "border-[#eeded5] bg-white text-[#3c2f2f]"
                      }`}
                    >
                      {CV_SENIORITY_LEVELS.map((level) => (
                        <option key={level} value={level}>{cvSeniorityLabels[level] || level}</option>
                      ))}
                    </select>
                  </div>

                  {/* Focus Areas - Multi-select */}
                  <div className="flex flex-col gap-2 border-t border-[#eeded5] dark:border-[#332822] pt-3">
                    <label className="text-[10px] uppercase font-bold tracking-wider text-stone-500 dark:text-stone-300 flex items-center gap-2">
                      <Target className="w-3.5 h-3.5" />
                      {t.cvFocusAreas}
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {CV_FOCUS_AREAS.map((area) => (
                        <button
                          key={area}
                          onClick={() => toggleCvFocusArea(area)}
                          className={`p-2.5 rounded-lg border text-[11px] font-bold text-left transition-all cursor-pointer ${
                            cvFocusAreas.includes(area)
                              ? "border-[#C86432] bg-[#C86432]/10 text-[#C86432]"
                              : isDarkMode
                              ? "border-transparent bg-[#1d1714]/30 text-stone-300 hover:bg-[#1d1714]/50"
                              : "border-transparent bg-white text-stone-600 shadow-xs hover:bg-stone-50"
                          }`}
                        >
                          <div className="flex items-center gap-1.5">
                            <div className={`w-3 h-3 rounded border ${cvFocusAreas.includes(area) ? "bg-[#C86432] border-[#C86432]" : isDarkMode ? "border-stone-700" : "border-stone-300"}`} />
                            <span>{getFocusLabel(area)}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Custom Request */}
                  <div className="flex flex-col gap-1.5 border-t border-[#eeded5] dark:border-[#332822] pt-3">
                    <label className="text-[10px] uppercase font-bold tracking-wider text-stone-500 dark:text-stone-300">{t.cvAdditionalNotes}</label>
                    <textarea
                      value={cvCustomRequest}
                      onChange={(e) => setCvCustomRequest(e.target.value)}
                      placeholder={t.cvAdditionalPlaceholder}
                      maxLength={500}
                      className={`w-full p-2.5 rounded-xl border text-xs resize-none h-20 focus:outline-hidden focus:ring-1 focus:ring-[#C86432] ${
                        isDarkMode ? "border-stone-800 bg-[#14100e] text-white placeholder-stone-600" : "border-stone-200 bg-white text-stone-800 placeholder-stone-400"
                      }`}
                    />
                    <span className="text-[9px] text-stone-500 dark:text-stone-300">{cvCustomRequest.length}/500</span>
                  </div>
                </div>
              </section>

              {/* Right Column: Target Positions & Results */}
              <section className="lg:col-span-7 flex flex-col gap-6" id="cv-result-panel">
                
                {/* Target Positions Card */}
                <div className={`rounded-3xl border p-6 flex flex-col gap-4 ${
                  isDarkMode ? "bg-[#1d1714]/80 border-[#332822]" : "bg-white/80 border-[#eeded5]"
                }`}>
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-[#C86432] flex items-center gap-2">
                      <Briefcase className="w-4 h-4" />
                      {t.cvTargetPositions}
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${
                        cvSelectedPositions.length > 0 ? "bg-emerald-500/20 text-emerald-600" : "bg-amber-500/20 text-amber-600"
                      }`}>
                        {cvSelectedPositions.length} {t.cvSelected}
                      </span>
                      <button
                        onClick={() => setCvSelectedPositions([])}
                        className="text-[11px] font-bold text-stone-500 hover:text-stone-800 dark:text-stone-300 dark:hover:text-white border border-stone-200 dark:border-stone-800 dark:bg-stone-900/30 px-2 py-1 rounded-lg transition-all"
                      >
                        {t.cvClear}
                      </button>
                    </div>
                  </div>

                  <div className={`flex flex-col sm:flex-row gap-2 rounded-2xl border p-2 ${
                    isDarkMode ? "border-[#332822] bg-[#14100e]" : "border-[#eeded5] bg-[#FAF6F0]"
                  }`}>
                    <input
                      type="text"
                      value={cvCustomPosition}
                      onChange={(e) => setCvCustomPosition(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addCustomCvPosition();
                        }
                      }}
                      placeholder={t.cvCustomPositionPlaceholder || "Write a custom target position"}
                      maxLength={80}
                      className={`flex-1 rounded-xl border px-3 py-2 text-xs font-bold focus:outline-hidden focus:ring-1 focus:ring-[#C86432] ${
                        isDarkMode
                          ? "border-stone-800 bg-[#1d1714] text-white placeholder-stone-500"
                          : "border-stone-200 bg-white text-stone-800 placeholder-stone-400"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={addCustomCvPosition}
                      disabled={!cvCustomPosition.trim()}
                      className="px-4 py-2 rounded-xl text-xs font-bold bg-[#C86432] hover:bg-[#aa5328] disabled:bg-stone-300 disabled:text-stone-500 text-white transition-all cursor-pointer"
                    >
                      {t.cvAddPosition || "Add"}
                    </button>
                  </div>

                  {cvSelectedPositions.some((position) => !CV_POSITION_CATEGORIES.includes(position)) && (
                    <div className="flex flex-wrap gap-2">
                      {cvSelectedPositions
                        .filter((position) => !CV_POSITION_CATEGORIES.includes(position))
                        .map((position) => (
                          <button
                            key={position}
                            type="button"
                            onClick={() => toggleCvPosition(position)}
                            className="px-3 py-1.5 rounded-full text-[11px] font-bold bg-[#C86432]/10 text-[#C86432] border border-[#C86432]/20 hover:bg-[#C86432] hover:text-white transition-all"
                          >
                            {position} ×
                          </button>
                        ))}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[480px] overflow-y-auto pr-2">
                    {CV_POSITION_CATEGORIES.map((position) => (
                      <button
                        key={position}
                        onClick={() => toggleCvPosition(position)}
                        className={`p-2.5 rounded-xl border text-left text-xs font-bold transition-all cursor-pointer flex items-start gap-2 ${
                          cvSelectedPositions.includes(position)
                            ? "border-[#C86432] bg-[#C86432]/10 text-[#C86432]"
                            : isDarkMode
                            ? "border-transparent bg-[#1d1714]/30 text-stone-300 hover:bg-[#1d1714]/50"
                            : "border-transparent bg-white text-stone-600 shadow-xs hover:bg-stone-50"
                        }`}
                      >
                        <div className={`w-4 h-4 rounded border mt-0.5 flex-shrink-0 flex items-center justify-center ${
                          cvSelectedPositions.includes(position)
                            ? "bg-[#C86432] border-[#C86432]"
                            : isDarkMode
                            ? "border-stone-700"
                            : "border-stone-300"
                        }`}>
                          {cvSelectedPositions.includes(position) && <Check className="w-2.5 h-2.5 text-white" />}
                        </div>
                        <span>{getPositionLabel(position)}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Output Area */}
                <div className={`rounded-3xl border flex flex-col h-full min-h-[400px] ${
                  isDarkMode ? "bg-[#1d1714]/80 border-[#332822]" : "bg-white/80 border-[#eeded5]"
                }`}>
                  
                  {!cvGeneratedText ? (
                    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 border ${
                        isDarkMode ? "bg-[#301c13] text-[#D97736] border-[#4a2e21]" : "bg-[#eeded5] text-[#C86432] border-[#eeded5]"
                      }`}>
                        <Award className="w-5 h-5" />
                      </div>
                      <h3 className="text-sm font-bold">{t.cvOptimizedReady}</h3>
                      <p className={`text-xs max-w-sm mt-1.5 leading-relaxed ${isDarkMode ? "text-stone-300" : "text-stone-500"}`}>
                        {t.cvReadySub}
                      </p>
                      <button
                        onClick={handleGenerateCv}
                        disabled={!hasValidCvInput || cvSelectedPositions.length === 0 || cvIsGenerating}
                        className="mt-6 px-6 py-3 rounded-xl font-bold text-sm bg-[#C86432] hover:bg-[#aa5328] disabled:bg-stone-300 disabled:text-stone-500 text-white transition-all shadow-lg shadow-[#C86432]/10 hover:shadow-[#C86432]/20 hover:scale-[1.01] flex items-center gap-2 cursor-pointer"
                      >
                        <Sparkles className="w-4 h-4" />
                        {cvIsGenerating ? t.cvOptimizing : t.cvGenerate}
                      </button>
                    </div>
                  ) : cvIsGenerating ? (
                    <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-10">
                      <div className="w-full max-w-xl">
                        <div className="relative mb-4 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full border-4 border-transparent border-t-[#C86432] animate-spin" />
                            <div>
                              <div className="text-sm font-bold">{t.cvOptimizingTitle}</div>
                              <div className="text-[11px] text-stone-500 dark:text-stone-300">{t.cvOptimizingSub}</div>
                            </div>
                          </div>
                          <div className="text-[11px] text-stone-500 dark:text-stone-300">{cvSelectedPositions.length} {t.cvPositions}</div>
                        </div>

                        <div className="w-full bg-stone-200 dark:bg-stone-800 h-3 rounded-full overflow-hidden mb-2">
                          <div className="h-full bg-[#C86432]" style={{ width: `${Math.min(100, Math.round(((cvTrackerStep + 1) / 5) * 100))}%` }} />
                        </div>
                        <div className="flex justify-between text-[11px] text-stone-500 dark:text-stone-300">
                          <div>{Math.min(100, Math.round(((cvTrackerStep + 1) / 5) * 100))}%</div>
                          <div className="uppercase text-[10px]">{(t.trackerSteps || [])[cvTrackerStep] || "Finishing"}</div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex-1 flex flex-col min-h-0">
                      {/* Header with stats */}
                      <div className={`p-4 border-b flex items-center justify-between gap-3 ${
                        isDarkMode ? "border-[#332822] bg-[#1c1411]" : "border-[#eeded5] bg-[#FAF6F0]"
                      }`}>
                        <div className="flex flex-wrap items-center gap-1.5 font-mono text-[10px] text-stone-500 dark:text-stone-300 font-bold uppercase">
                          <span className="bg-emerald-500/10 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-300 px-2 py-1 rounded-lg">{t.cvGenerated}</span>
                          <span className="bg-[#C86432]/10 text-[#C86432] px-2 py-1 rounded-lg">{cvSelectedPositions.length} {t.cvPositions}</span>
                        </div>
                        <button
                          onClick={() => setCvGeneratedText("")}
                          className="text-[11px] font-bold text-[#C86432] hover:text-white border border-[#C86432]/20 bg-[#C86432]/10 hover:bg-[#C86432] px-2.5 py-1 rounded-lg transition-all cursor-pointer"
                        >
                          {t.cvStartOver}
                        </button>
                      </div>

                      {/* Output Text Area */}
                      <div className={`flex-1 overflow-hidden p-4 max-h-[420px] text-xs leading-relaxed ${isDarkMode ? "text-stone-200" : "text-stone-800"}`}>
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
                          <div className="grid grid-cols-2 w-full sm:w-auto gap-1.5">
                            <button
                              onClick={() => setCvPreviewMode("preview")}
                              className={`min-h-10 px-2.5 sm:px-3 py-2 sm:py-1.5 rounded-lg text-[11px] sm:text-xs font-bold transition-all text-center leading-tight flex items-center justify-center ${cvPreviewMode === "preview" ? "bg-[#C86432] text-white" : isDarkMode ? "bg-stone-900/80 text-stone-200 border border-stone-800" : "bg-white text-stone-700"}`}
                            >
                              {t.cvPreview}
                            </button>
                            <button
                              onClick={() => setCvPreviewMode("text")}
                              className={`min-h-10 px-2.5 sm:px-3 py-2 sm:py-1.5 rounded-lg text-[11px] sm:text-xs font-bold transition-all text-center leading-tight flex items-center justify-center ${cvPreviewMode === "text" ? "bg-[#C86432] text-white" : isDarkMode ? "bg-stone-900/80 text-stone-200 border border-stone-800" : "bg-white text-stone-700"}`}
                            >
                              {t.cvText}
                            </button>
                          </div>
                          <div className="text-[10px] text-stone-500 dark:text-stone-300 leading-snug">{t.cvTemplate}: <span className="font-bold">{getTemplateName(CV_TEMPLATES.find((item)=>item.id===cvTemplate) || CV_TEMPLATES[0])}</span></div>
                        </div>

                        {cvPreviewMode === "preview" ? (
                          <div className={`w-full h-[360px] rounded-xl border overflow-hidden ${isDarkMode ? "border-stone-800 bg-stone-950" : "border-stone-200 bg-white"}`}>
                            <iframe
                              title="cv-preview"
                              srcDoc={buildCvHtmlDocument()}
                              className="w-full h-full"
                            />
                          </div>
                        ) : (
                          <textarea
                            value={cvEditedText || cvGeneratedText}
                            onChange={(e) => setCvEditedText(e.target.value)}
                            aria-label={t.cvManualEditLabel || "Edit generated CV"}
                            className={`w-full h-[360px] p-4 rounded-xl border font-sans text-xs leading-relaxed resize-none focus:outline-hidden focus:ring-1 focus:ring-[#C86432] selection:bg-[#C86432] ${
                              isDarkMode ? "border-stone-800 bg-stone-950 text-stone-200" : "border-stone-200 bg-stone-50 text-stone-800"
                            }`}
                          />
                        )}
                      </div>

                      {/* Export Toolbar */}
                      <div className={`p-4 border-t flex flex-wrap items-center justify-between gap-3 ${
                        isDarkMode ? "border-[#332822] bg-[#1d1714]/60" : "border-[#eeded5] bg-[#FAF6F0]"
                      }`}>
                        <button
                          onClick={copyCvText}
                          className="px-3 py-1.5 border border-[#eeded5] dark:border-[#4a3329] text-xs font-bold rounded-xl hover:bg-stone-50 dark:hover:bg-stone-900 cursor-pointer text-[#C86432] dark:text-[#f09a62] transition-all"
                        >
                          {cvCopyFeedback ? `✓ ${t.copied}` : t.cvCopyText}
                        </button>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={downloadCvDoc}
                            className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg transition-all flex items-center gap-1.5 cursor-pointer"
                          >
                            <Download className="w-3.5 h-3.5" />
                            {t.cvExportDoc}
                          </button>
                          <button
                            onClick={exportCvPdf}
                            className="px-3.5 py-1.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-lg transition-all flex items-center gap-1.5 cursor-pointer"
                          >
                            <Download className="w-3.5 h-3.5" />
                            {t.cvExportPdf}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {cvError && (
                    <div className="p-4 bg-rose-500/10 text-rose-800 dark:text-rose-200 text-xs font-bold rounded-xl font-mono flex items-start gap-2 m-4 mt-auto">
                      <AlertCircle className="w-4 h-4 text-rose-500 mt-0.5 flex-shrink-0" />
                      <span>{cvError}</span>
                    </div>
                  )}
                </div>
              </section>
            </motion.div>
          ) : null}
        </AnimatePresence>

      </div>

      {/* Footer Segment */}
      <footer className={`border-t px-6 sm:px-12 py-10 text-xs transition-all duration-300 ${
        isDarkMode ? "border-[#332822]/60 bg-[#0f0b0a] text-stone-300" : "border-[#eeded5]/70 bg-white/45 text-stone-600"
      }`}>
        <div className="max-w-7xl mx-auto font-sans">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-left">
            <div className="flex flex-col gap-3">
              <h3 className="text-[11px] font-black uppercase tracking-[0.22em] text-[#C86432]">{t.footerProduct}</h3>
              <button type="button" onClick={() => openHomeSection()} className="w-fit font-bold hover:text-[#C86432] transition-colors cursor-pointer">{t.navOverview}</button>
              <button type="button" onClick={() => setActiveView("workspace")} className="w-fit font-bold hover:text-[#C86432] transition-colors cursor-pointer">{t.navWorkspace}</button>
              <button type="button" onClick={() => setActiveView("cv")} className="w-fit font-bold hover:text-[#C86432] transition-colors cursor-pointer">{t.featureCvTitle}</button>
              <button type="button" onClick={() => openHomeSection("simulator")} className="w-fit font-bold hover:text-[#C86432] transition-colors cursor-pointer">{t.footerDemo}</button>
            </div>

            <div className="flex flex-col gap-3">
              <h3 className="text-[11px] font-black uppercase tracking-[0.22em] text-[#C86432]">{t.footerResources}</h3>
              <button type="button" onClick={() => setActiveView("workspace")} className="w-fit font-bold hover:text-[#C86432] transition-colors cursor-pointer">{t.footerUpload}</button>
              <button type="button" onClick={() => setActiveView("workspace")} className="w-fit font-bold hover:text-[#C86432] transition-colors cursor-pointer">{t.extractedText}</button>
              <button type="button" onClick={() => setActiveView("workspace")} className="w-fit font-bold hover:text-[#C86432] transition-colors cursor-pointer">{t.chatWithDoc}</button>
              <button type="button" onClick={() => setActiveView("cv")} className="w-fit font-bold hover:text-[#C86432] transition-colors cursor-pointer">{t.cvTemplateStyle}</button>
            </div>

            <div className="flex flex-col gap-3">
              <h3 className="text-[11px] font-black uppercase tracking-[0.22em] text-[#C86432]">{t.footerSocial}</h3>
              <button type="button" onClick={() => openHomeSection("simulator")} className="w-fit font-bold hover:text-[#C86432] transition-colors cursor-pointer flex items-center gap-2">
                <Instagram className="w-3.5 h-3.5" />
                Instagram
              </button>
              <a href="https://t.me/digitalhelperam" target="_blank" rel="noopener noreferrer" className="w-fit font-bold hover:text-[#C86432] transition-colors cursor-pointer flex items-center gap-2">
                <Send className="w-3.5 h-3.5" />
                Telegram
              </a>
            </div>
          </div>

          <div className={`mt-8 pt-5 border-t flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-center sm:text-left ${
            isDarkMode ? "border-[#332822]/70" : "border-[#eeded5]/80"
          }`}>
          <p>{t.copyright}</p>
          <div className="flex justify-center gap-4 text-[10px] font-bold uppercase tracking-wider text-[#C86432]">
            <span>{t.statelessSandbox}</span>
            <span className="opacity-40">·</span>
            <span>{t.securitySafe}</span>
            <span className="opacity-40">·</span>
            <span>{t.jsonOutput}</span>
          </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
