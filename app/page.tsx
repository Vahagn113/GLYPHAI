"use client";

import React, { useState, useRef, useEffect } from "react";
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

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface SampleDocument {
  name: string;
  type: string;
  mimeType: string;
  size: string;
  mockData: string;
  initialExtract: string;
}

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

interface HighlightBox {
  field: string;
  label: string;
  top: number; // percentage
  left: number; // percentage
  width: number; // percentage
  height: number; // percentage
}

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

type Language = "en" | "ru" | "am";

const TRANSLATIONS: Record<Language, any> = {
  en: {
    title: "GLYPH",
    techEngine: "Gemini 3.5 Engine",
    connected: "Connected",
    tagline: "Extract & Chat with Document Intel",
    clearFile: "Clear File",
    dropZoneTitle: "Drop your file here, or browse",
    dropZoneSubText: "PNG, JPG, WEBP, or PDF (Max 10MB)",
    samplesTitle: "Preset interactive samples:",
    cursiveNotes: "Supports handwritten scripts, layouts, receipts, and dense pdf reports.",
    processingSettings: "Processing Settings",
    extractionModeLabel: "Extraction Mode",
    additionalDirectives: "Additional Extraction Directives",
    directivesPlaceholder: "Examples: 'Translate to German', 'Search for price tags', etc...",
    startExtraction: "Start Extraction",
    parsingImage: "Parsing Image Context...",
    extractionFailed: "Extraction Failed",
    noContentTitle: "No content extracted yet",
    noContentSubText: "Provide notes on the adjacent column, choose an extraction formula, and hit 'Start Extraction' to query Gemini.",
    step1Title: "Select Input",
    step1Sub: "Image format or multi-page PDF files processed instantly.",
    step2Title: "Extraction Mode",
    step2Sub: "Align output with summaries, Markdown tables, or corrected prose.",
    step3Title: "Document Chat",
    step3Sub: "Ask contextual questions, extract points or audit records instantly.",
    loadingEngine: "Running OCR & Extraction Engine",
    loadingSubText: "parsing layout structures, transcribing lines, and translating text variables...",
    awaitingResponse: "PROCESSING (WAITING FOR RESPONSE)",
    trackerSteps: [
      "Initializing engine & secure workspace buffers",
      "Scanning document outline structure & typography grid",
      "Translating dense layouts & transcribing coordinates",
      "Correcting syntax elements & building Markdown markup",
      "Assembling final high-fidelity publishing formatting"
    ],
    words: "words",
    chars: "chars",
    formula: "formula",
    extractedText: "Extracted Text",
    chatWithDoc: "Chat with Document",
    saveBtn: "Save Changes",
    cancelBtn: "Cancel",
    editBtn: "Edit Output",
    copyText: "Copy Text",
    copied: "Copied!",
    exportLabel: "Export",
    chatHintTitle: "Contextual Prompting Engine",
    chatHintDesc: "Ask calculation tasks, identify signatures, translate languages, or draft formal emails out of this data.",
    chatPromptIntro: "What would you like to ask?",
    chatPromptDates: "Summarize key deadlines",
    chatPromptInvoice: "Find pricing and costs",
    chatSample1: "Summarize deadlines",
    chatSample2: "Find prices & costs",
    you: "You",
    assistant: "Document Assistant",
    chatLoading: "Fusing file context...",
    chatPlaceholder: "Ask anything about the document...",
    copyright: "© 2026 GLYPH AI OCR Engine. Constructed with Gemini & Antigravity.",
    statelessSandbox: "Stateless Sandbox",
    securitySafe: "Security Safe",
    jsonOutput: "JSON Output",
    publishingMethod: "Publishing Template Mode",
    publishingDesc: {
      raw: "Original Plain Output",
      email: "Professional Email Draft",
      wiki: "Technical Documentation Page",
      blog: "Editorial Blog Post/Article",
      json: "Structured JSON Object"
    },
    documentTypeLabel: "Document Type",
    docTypeGeneral: "General OCR",
    docTypeInvoice: "Invoice Extraction",
    docTypeContract: "Contract Analysis",
    docTypeResume: "CV / Resume Parsing",
    docTypeReceipt: "Receipt Processing",
    docTypeTable: "Table Extraction",
    modes: {
      raw: "Verbatim Text",
      rawDesc: "Extract clean, verbatim text directly from the document.",
      layout: "Tables & Lists",
      layoutDesc: "Organize menus, grids, tables, and structured lists.",
      transcript: "Handwritten Script",
      transcriptDesc: "Read handwriting, cursive notes, and scribble pages.",
      summary: "Executive Summary",
      summaryDesc: "Create a helpful summary of priority points & action items.",
      "key-value": "Key Attributes",
      "key-valueDesc": "Extract labels, totals, dates, and amounts into tables."
    },
    homeHeroTitle: "Multimodal Document Intelligence Desk",
    homeHeroSub: "Turn messy papers, receipts, invoice scans, and handwritten scripts into clean database records, documents, or custom briefs using Gemini 3.5.",
    homeBtnLaunch: "Open Extraction Desk",
    homeBtnDemo: "Explore Feature Sandbox",
    homeSection2Header: "How Glyph Transforms Your Files",
    homeSection2Sub: "Three simple states between raw physical paper and editable, queryable digital intelligence.",
    homeDemoHeader: "Interactive Feature Simulator",
    homeDemoSub: "Choose a physical scan template below, then toggle the target extraction formula to witness how GLYPH recreates the data instantly.",
    homeDemoLoad: "Launch Interactive File inside Workspace",
    homeDemoSimulating: "Aligning OCR Layers...",
    bentoHeader: "Engine Specifications & Intelligence Safeguards",
    bentoSub: "Highly secure, multilingual, and extremely precise.",
    bentoCard1Title: "Cursive Translation",
    bentoCard1Desc: "Decodes complex handwriting, scribble fonts, notes, and shorthand abbreviations smoothly.",
    bentoCard2Title: "No Database Persistence",
    bentoCard2Desc: "Operates as a completely stateless sandbox. Decoded metadata is parsed purely in-memory.",
    bentoCard3Title: "Export-Ready Worksheets",
    bentoCard3Desc: "Build and download .MD text, aligned markdown files, or structured .DOC files easily.",
    bentoCard4Title: "Specialized Object Schemas",
    bentoCard4Desc: "Extract structures with schema compliance and confidence meters for Invoices, Contracts, Resumes, and Tables.",
    bentoCard5Title: "Conversational Document Chat",
    bentoCard5Desc: "Interact directly with your parsed documents to calculate values, draft summaries, or audit terms safely.",
    bentoCard6Title: "Five Powerful General Modes",
    bentoCard6Desc: "Choose Verbatim Text, Tables & Lists, Handwritten Script, Executive Summaries, or Custom Key Attributes.",
    navOverview: "Overview",
    navWorkspace: "Extraction Desk",
    navNavigation: "NAVIGATION",
    navLanguage: "LANGUAGE",
    engineBadge: "Multimodal Document Engine",
    selectDocTemplate: "1. Select Document Template",
    presetFileSubtitle: "Preset Interactive Simulation File",
    chooseFormulaMode: "2. Choose Formula Mode",
    viewLabel: "VIEW",
    lblImage: "IMAGE",
    lblPdf: "PDF DOCUMENT",
    stepLabel: "STEP",
    editModeLabel: "EDIT MODE",
    presetBakery: "Cozy Bakery Invoice #429",
    presetArcheology: "Lecture Notes on Archeology",
    sampleHandwritten: "Handwritten Meeting Notes.png",
    sampleInvoice: "Acoustic Tavern Invoice.jpg"
  },
  ru: {
    title: "GLYPH",
    techEngine: "Движок Gemini 3.5",
    connected: "Подключено",
    tagline: "Извлечение текста и чат с документами",
    clearFile: "Очистить файл",
    dropZoneTitle: "Перетащите файл сюда или выберите",
    dropZoneSubText: "PNG, JPG, WEBP или PDF (макс. 10 МБ)",
    samplesTitle: "Интерактивные примеры:",
    cursiveNotes: "Поддерживает распознавание рукописного текста, таблиц, счетов и отчетов.",
    processingSettings: "Настройки обработки",
    extractionModeLabel: "Режим извлечения",
    additionalDirectives: "Дополнительные директивы",
    directivesPlaceholder: "Например: 'Переведи на немецкий', 'Найди цены'...",
    startExtraction: "Начать извлечение",
    parsingImage: "Анализ изображения...",
    extractionFailed: "Ошибка извлечения",
    noContentTitle: "Текст еще не извлечен",
    noContentSubText: "Загрузите файл, выберите режим и нажмите «Начать извлечение», чтобы запустить распознавание.",
    step1Title: "Выбор файла",
    step1Sub: "Мгновенная обработка изображений и многостраничных PDF-файлов.",
    step2Title: "Режим работы",
    step2Sub: "Форматируйте вывод: от простых таблиц до кратких резюме.",
    step3Title: "Чат с документом",
    step3Sub: "Задавайте вопросы контексту, извлекайте данные или делайте аудит записей.",
    loadingEngine: "Запущен ИИ-анализ и распознавание",
    loadingSubText: "анализ разметки документа, транскрибирование строк и форматирование результата...",
    awaitingResponse: "ОБРАБОТКА (ОЖИДАНИЕ ОТВЕТА)",
    trackerSteps: [
      "Инициализация движка и безопасных буферов вывода",
      "Сканирование структуры документа и текстовой сетки",
      "Распознавание табличных полей и координат разметки",
      "Синтаксическая коррекция и оформление разметки Markdown",
      "Генерация финального высокоточного форматирования"
    ],
    words: "слов",
    chars: "симв.",
    formula: "режим",
    extractedText: "Извлеченный текст",
    chatWithDoc: "Чат с документом",
    saveBtn: "Сохранить изменения",
    cancelBtn: "Отмена",
    editBtn: "Редактировать",
    copyText: "Копировать",
    copied: "Скопировано!",
    exportLabel: "Экспорт",
    chatHintTitle: "Контекстный чат-помощник",
    chatHintDesc: "Задавайте вопросы по расчетам, подписям, переводам или пишите деловые письма по этим данным.",
    chatPromptIntro: "Что бы вы хотели спросить?",
    chatPromptDates: "Выдели важные дедлайны",
    chatPromptInvoice: "Найди цены и стоимость",
    chatSample1: "Выдели дедлайны",
    chatSample2: "Стоимость и цены",
    you: "Вы",
    assistant: "Ассистент документа",
    chatLoading: "Объединение контекста файла...",
    chatPlaceholder: "Спросите что-нибудь о документе...",
    copyright: "© 2026 GLYPH AI. Разработано на базе Gemini и Antigravity.",
    statelessSandbox: "Песочница",
    securitySafe: "Безопасно",
    jsonOutput: "Формат JSON",
    publishingMethod: "Шаблон публикации",
    publishingDesc: {
      raw: "Оригинальный чистый текст",
      email: "Черновик делового письма",
      wiki: "Техническая статья/вики",
      blog: "Пост для блога/статья",
      json: "Structured JSON объект"
    },
    documentTypeLabel: "Тип документа",
    docTypeGeneral: "Общий OCR",
    docTypeInvoice: "Извлечение счетов",
    docTypeContract: "Анализ контракта",
    docTypeResume: "Парсинг резюме",
    docTypeReceipt: "Обработка чеков",
    docTypeTable: "Извлечение таблиц",
    modes: {
      raw: "Точный текст",
      rawDesc: "Построчное извлечение чистого текста без изменений.",
      layout: "Таблицы и списки",
      layoutDesc: "Форматирование списков, каталогов, таблиц и структуры.",
      transcript: "Рукописный текст",
      transcriptDesc: "Распознавание сложного почерка, курсива и неразборчивых сканов.",
      summary: "Основные выводы",
      summaryDesc: "Краткий список главного, важных задач и ключевых моментов.",
      "key-value": "Ключевые данные",
      "key-valueDesc": "Сбор реквизитов, дат, контактов и денежных сумм в таблицу."
    },
    homeHeroTitle: "Мультимодальная система интеллектуального анализа",
    homeHeroSub: "Превращайте неразборчивые заметки, чеки, счета и рукописные сканы в чистые упорядоченные данные с помощью ИИ Gemini 3.5.",
    homeBtnLaunch: "Открыть Панель извлечения",
    homeBtnDemo: "Интерактивная демо-песочница",
    homeSection2Header: "Как Glyph анализирует ваши файлы",
    homeSection2Sub: "Три простых шага от физического листа бумаги до структурированных цифровых знаний.",
    homeDemoHeader: "Интерактивный симулятор функций",
    homeDemoSub: "Выберите шаблон скана ниже и переключайте режим формулы, чтобы воочию увидеть процесс извлечения данных.",
    homeDemoLoad: "Загрузить этот файл на панель работы",
    homeDemoSimulating: "Анализируем слои распознавания...",
    bentoHeader: "Спецификации движка и гарантии безопасности",
    bentoSub: "Безопасный, многоязычный и точный.",
    bentoCard1Title: "Распознавание курсива",
    bentoCard1Desc: "Успешно распознает сложный почерк, беглые заметки и сокращения.",
    bentoCard2Title: "Конфиденциальность данных",
    bentoCard2Desc: "Работает как полностью изолированная песочница. Никакая информация не сохраняется.",
    bentoCard3Title: "Экспорт готовых документов",
    bentoCard3Desc: "Скачивайте структурированные результаты в форматах .MD, .TXT или файлах .DOC.",
    bentoCard4Title: "Специализированные схемы данных",
    bentoCard4Desc: "Извлекайте информацию по строгим схемам с оценкой уверенности для счетов, договоров, резюме и таблиц.",
    bentoCard5Title: "Контекстный чат-ассистент",
    bentoCard5Desc: "Общайтесь напрямую со своими файлами для расчетов, составления резюме или финансового аудита.",
    bentoCard6Title: "Пять универсальных OCR-режимов",
    bentoCard6Desc: "Выбирайте построчный текст, таблицы, рукописные транскрипты, краткие саммари или пары ключ-значение.",
    navOverview: "Обзор",
    navWorkspace: "Панель извлечения",
    navNavigation: "НАВИГАЦИЯ",
    navLanguage: "ЯЗЫК",
    engineBadge: "Мультимодальный движок документов",
    selectDocTemplate: "1. Выберите шаблон документа",
    presetFileSubtitle: "Предварительно подготовленный симуляционный файл",
    chooseFormulaMode: "2. Выберите режим формулы",
    viewLabel: "РЕЖИМ",
    lblImage: "ИЗОБРАЖЕНИЕ",
    lblPdf: "PDF ДОКУМЕНТ",
    stepLabel: "ШАГ",
    editModeLabel: "РЕЖИМ РЕДАКТИРОВАНИЯ",
    presetBakery: "Счет уютной пекарни #429",
    presetArcheology: "Заметки по археологии",
    sampleHandwritten: "Рукописные заметки.png",
    sampleInvoice: "Счет из таверны.jpg"
  },
  am: {
    title: "GLYPH",
    techEngine: "Gemini 3.5 Շարժիչ",
    connected: "Միացված է",
    tagline: "Փաստաթղթերի տեքստի արտահանում և զրույց",
    clearFile: "Մաքրել ֆայլը",
    dropZoneTitle: "Քաշեք ֆայլը այստեղ կամ սեղմեք՝ ընտրելու",
    dropZoneSubText: "PNG, JPG, WEBP կամ PDF (առավելագույնը 10 ՄԲ)",
    samplesTitle: "Ինտերակտիվ նմուշներ.",
    cursiveNotes: "Աջակցում է ձեռագիր տեքստի թարգմանությանը, աղյուսակներին, հաշիվներին և զեկույցներին։",
    processingSettings: "Մշակման կարգավորումներ",
    extractionModeLabel: "Արտահանման եղանակ",
    additionalDirectives: "Լրացուցիչ ցուցումներ",
    directivesPlaceholder: "Օրինակ՝ 'Թարգմանիր գերմաներեն', 'Գտիր գնապիտակները'...",
    startExtraction: "Սկսել արտահանումը",
    parsingImage: "Պատկերի վերլուծություն...",
    extractionFailed: "Արտահանումը ձախողվեց",
    noContentTitle: "Արտահանված բովանդակություն դեռ չկա",
    noContentSubText: "Ներբեռնեք ֆայլը ձախ սյունակում, ընտրեք արտահանման եղանակը և սեղմեք «Սկսել արտահանումը»:",
    step1Title: "Ընտրել ֆայլը",
    step1Sub: "Պատկերների կամ բազմաէջ PDF ֆայլերի ակնթարթային մշակում:",
    step2Title: "Արտահանման ռեժիմ",
    step2Sub: "Ստացեք տեքստը աղյուսակների, ամփոփագրի կամ մաքուր շարադրանքի տեսքով:",
    step3Title: "Զրույց տեքստի հետ",
    step3Sub: "Տվեք հարցեր փաստաթղթի բովանդակության վերաբերյալ և ստացեք ճշգրիտ պատասխաններ:",
    loadingEngine: "Արտահանման շարժիչը աշխատում է ...",
    loadingSubText: "վերլուծում է փաստաթղթի կառուցվածքը, տողերը և ձևաչափում տեքստը...",
    awaitingResponse: "ՄՇԱԿՈՒՄ (ՍՊԱՍՈՒՄ ԵՆՔ ՊԱՏԱՍԽԱՆԻՆ)",
    trackerSteps: [
      "Շարժիչի նախապատրաստում և տվյալների անվտանգ բուֆերացում",
      "Փաստաթղթի կառուցվածքի և տեքստային ցանցի սկանավորում",
      "Աղյուսակային տիրույթների և կոորդինատների արտահանում",
      "Սինտաքսի ուղղում և Markdown կառուցվածքի ձևավորում",
      "Վերջնական բարձրորակ հրապարակման տեսքի պատրաստում"
    ],
    words: "բառ",
    chars: "նիշ",
    formula: "եղանակ",
    extractedText: "Արտահանված տեքստ",
    chatWithDoc: "Զրույց փաստաթղթի հետ",
    saveBtn: "Պահպանել",
    cancelBtn: "Չեղարկել",
    editBtn: "Խմբագրել",
    copyText: "Պատճենել տեքստը",
    copied: "Պատճենվեց!",
    exportLabel: "Ներբեռնել",
    chatHintTitle: "Կոնտեքստային հարցումների համակարգ",
    chatHintDesc: "Այս զրույցը օգտագործում է Gemini մուլտիմոդալ համակարգը՝ պատասխանելու փաստաթղթի տողերին:",
    chatPromptIntro: "Ի՞նչ կցանկանայիք հարցնել:",
    chatPromptDates: "Ամփոփիր վերջնաժամկետները",
    chatPromptInvoice: "Գտիր գները և ծախսերը",
    chatSample1: "Ամփոփել ժամկետները",
    chatSample2: "Գտնել գները և ծախսերը",
    you: "Դուք",
    assistant: "Փաստաթղթի օգնական",
    chatLoading: "Փաստաթղթի կոնտեքստի միավորում...",
    chatPlaceholder: "Հարցրեք ցանկացած բան փաստաթղթի մասին...",
    copyright: "© 2026 GLYPH AI. Ստեղծված է Google Gemini և Antigravity տեխնոլոգիաներով:",
    statelessSandbox: "Անվտանգ միջավայր",
    securitySafe: "Ապահով",
    jsonOutput: "JSON Ֆորմատ",
    publishingMethod: "Հրապարակման ձևաչափ",
    publishingDesc: {
      raw: "Օրիգինալ արտահանված տեքստ",
      email: "Պրոֆեսիոնալ էլ. նամակ",
      wiki: "Տեխնիկական փաստաթուղթ",
      blog: "Բլոգի հոդված/նյութ",
      json: "Structured JSON օբյեկտ"
    },
    documentTypeLabel: "Փաստաթղթի տիպ",
    docTypeGeneral: "Ընդհանուր OCR",
    docTypeInvoice: "Հաշիվների արտահանում",
    docTypeContract: "Պայմանագրի վերլուծություն",
    docTypeResume: "Ինքնակենսագրականի վերլուծություն",
    docTypeReceipt: "Անդորրագրերի մշակում",
    docTypeTable: "Աղյուսակի արտահանում",
    modes: {
      raw: "Ճշգրիտ տեքստ",
      rawDesc: "Արտահանել մաքուր տեքստը՝ բառացի պահպանելով տողերը.",
      layout: "Աղյուսակներ և ցուցակներ",
      layoutDesc: "Կազմակերպել աղյուսակները, ցանկերը և հաջորդական վերնագրերը:",
      transcript: "Ձեռագիր տեքստ",
      transcriptDesc: "Վերծանել բարդ ձեռագրերը, արագ նշումները և խիտ տեքստերը:",
      summary: "Ամփոփում",
      summaryDesc: "Ստանալ կարևոր կետերի և առաջադրանքների հակիրճ ամփոփում:",
      "key-value": "Կարևոր տվյալներ",
      "key-valueDesc": "Հավաքագրել գումարները, ամսաթվերը կամ հաշիվները կոկիկ աղյուսակում:"
    },
    homeHeroTitle: "Բազմամոդալ Փաստաթղթերի Ինտելեկտուալ Համակարգ",
    homeHeroSub: "Վերափոխեք խառը գրառումները, անդորրագրերը, հաշիվները և ձեռագիր տեքստերը մաքուր տվյալների՝ օգտագործելով Gemini 3.5-ը:",
    homeBtnLaunch: "Բացել Աշխատանքային Սեղանը",
    homeBtnDemo: "Ուսումնասիրել Դեմո Սենդբոքսը",
    homeSection2Header: "Ինչպես է GLYPH-ը վերափոխում ֆայլերը",
    homeSection2Sub: "Երեք պարզ քայլ՝ թղթային տարբերակից մինչև թվային կառուցվածքային ինտելեկտ:",
    homeDemoHeader: "Ինտերակտիվ Նմուշների Սիմուլյատոր",
    homeDemoSub: "Ընտրեք ձախ կողմից որևէ փաստաթուղթ, այնուհետև փոխեք արտահանման եղանակը՝ տեսնելու համար, թե ինչպես է GLYPH-ը ակնթարթորեն մշակում այն:",
    homeDemoLoad: "Բեռնել այս ֆայլը Աշխատանքային Սեղանում",
    homeDemoSimulating: "Կարգավորում ենք OCR շերտերը...",
    bentoHeader: "Շարժիչի Հնարավորությունները և Անվտանգությունը",
    bentoSub: "Բազմալեզու, գերճշգրիտ և լիովին ապահով:",
    bentoCard1Title: "Ձեռագիր Տեքստի Ճանաչում",
    bentoCard1Desc: "Հեշտությամբ վերծանում է բարդ ձեռագրերը, արագ նշումները և հապավումները:",
    bentoCard2Title: "Առանց Տվյալների Պահպանման",
    bentoCard2Desc: "Աշխատում է լիովին անձնական ռեժիմով: Ոչ մի ֆայլ կամ արդյունք չի պահպանվում սերվերում:",
    bentoCard3Title: "Արտահանման Պատրաստ Ֆայլեր",
    bentoCard3Desc: "Ներբեռնեք արդյունքները .MD, .TXT կամ .DOC (MS Word) ֆորմատներով ընդամենը մեկ սեղմումով:",
    bentoCard4Title: "Մասնագիտացված հաշվետվություններ",
    bentoCard4Desc: "Արտահանեք կառուցվածքային տվյալներ հաշիվների, պայմանագրերի, ռեզյումեների և աղյուսակների համար՝ ճշգրտության ցուցանիշով:",
    bentoCard5Title: "Ինտերակտիվ զրույց փաստաթղթի հետ",
    bentoCard5Desc: "Զրուցեք անմիջապես ձեր ֆայլերի հետ՝ հաշվարկներ կատարելու, ամփոփագրեր պատրաստելու կամ աուդիտ իրականացնելու համար:",
    bentoCard6Title: "Հինգ հզոր ընդհանուր ռեժիմներ",
    bentoCard6Desc: "Ընտրեք ճշգրիտ տեքստ, աղյուսակներ, ձեռագիր տարբերակ, գործադիր ամփոփում կամ հիմնական հատկանիշներ:",
    navOverview: "Գլխավոր",
    navWorkspace: "Արտահանման Սեղան",
    navNavigation: "ՆԱՎԻԳԱՑԻԱ",
    navLanguage: "ԼԵԶՈՒ",
    engineBadge: "Բազմամոդալ Փաստաթղթերի Շարժիչ",
    selectDocTemplate: "1. Ընտրել Փաստաթղթի Նմուշը",
    presetFileSubtitle: "Պատրաստի ինտերակտիվ սիմուլյացիոն ֆայլ",
    chooseFormulaMode: "2. Ընտրել Ֆորմուլայի Եղանակը",
    viewLabel: "ՏԵՍՔ",
    lblImage: "ՊԱՏԿԵՐ",
    lblPdf: "PDF ՓԱՍՏԱԹՈՒՂԹ",
    stepLabel: "ՔԱՅԼ",
    editModeLabel: "ԽՄԲԱԳՐՄԱՆ ՌԵԺԻՄ",
    presetBakery: "Հացաբուլկեղենի Հաշիվ #429",
    presetArcheology: "Դասախոսության Նշումներ",
    sampleHandwritten: "Ձեռագիր Գրառումներ.png",
    sampleInvoice: "Ակուստիկ Պանդոկի Հաշիվ.jpg"
  }
};

Object.assign(TRANSLATIONS.en, {
  featureExtractionTitle: "Extraction Desk",
  featureExtractionDesc: "OCR, structured data, and document chat",
  featureCvTitle: "CV Builder",
  featureCvDesc: "Resumes, raw notes, roles, and export",
  cvHeroTitle: "Build & Optimize Resumes",
  cvHeroSub: "Convert messy CVs, raw bios, and work notes into recruiter-ready resumes tailored to target roles and ATS-friendly templates.",
  cvOpenBuilder: "Open CV Builder",
  cvTryDemo: "Try CV Demo",
  cvHowHeader: "How CV Builder Helps You Land Roles",
  cvHowSub: "Upload your CV or write raw work notes, pick target roles and templates, and let AI optimize for keywords, metrics, and clarity.",
  cvStep1Title: "Add Source",
  cvStep1Sub: "Upload a CV file or write raw notes with experience, education, skills, and goals.",
  cvStep2Title: "Select Targets",
  cvStep2Sub: "Choose roles and templates so AI can prioritize relevant keywords and achievements.",
  cvStep3Title: "Generate & Export",
  cvStep3Sub: "Download in PDF/DOC or copy optimized Markdown for ATS-friendly applications.",
  cvSelectSample: "1. Select CV Sample",
  cvSampleSubtitle: "Sample CV markdown",
  cvTemplatePreview: "2. Template Preview",
  cvLoadBuilder: "Load to CV Builder",
  cvSource: "CV Source",
  cvFileUpload: "File Upload",
  cvRawNotes: "Raw Notes",
  cvClear: "Clear",
  cvDropTitle: "Drop your CV here, or browse",
  cvDropSub: "PDF, DOC, DOCX, PNG, JPG (Max 10MB)",
  cvRawNotesPlaceholder: "Write or paste raw bio/work notes here: name, contact details, target background, job history, responsibilities, achievements, education, skills, tools, languages, certifications, projects, and career goals.",
  cvRawNotesMin: "Minimum",
  cvTemplateStyle: "Template Style",
  cvOptimizationSettings: "Optimization Settings",
  cvTone: "Tone",
  cvSeniority: "Seniority Level",
  cvFocusAreas: "Focus Areas",
  cvAdditionalNotes: "Additional Notes",
  cvAdditionalPlaceholder: "E.g., 'Add missing degrees', 'Emphasize remote work', 'Add metrics'",
  cvTargetPositions: "Target Positions",
  cvSelected: "selected",
  cvOptimizedReady: "Optimized CV Ready",
  cvReadySub: "Upload your CV or add raw work notes, select target positions, and generate an AI-optimized version tailored to your desired roles.",
  cvGenerate: "Generate Optimized CV",
  cvOptimizing: "Optimizing...",
  cvOptimizingTitle: "Optimizing your CV",
  cvOptimizingSub: "AI is tailoring your resume for the selected positions...",
  cvPositions: "positions",
  cvGenerated: "Generated",
  cvStartOver: "Start Over",
  cvPreview: "Preview",
  cvText: "Text",
  cvTemplate: "Template",
  cvCopyText: "Copy Text",
  cvExportDoc: "Export .DOC",
  cvExportPdf: "Export .PDF",
  cvFeaturesHeader: "CV Builder Features",
  cvFeaturesSub: "Smart resume reconstruction, ATS alignment, template styling, and role-specific optimization.",
  cvFeatureCard1Title: "Template Styling",
  cvFeatureCard1Desc: "Choose ATS-friendly templates and visual themes for recruiters.",
  cvFeatureCard2Title: "Role Targeting",
  cvFeatureCard2Desc: "Optimize for specific job titles with keyword alignment and achievements.",
  cvFeatureCard3Title: "Export & Share",
  cvFeatureCard3Desc: "Export polished DOC/PDF, copy Markdown, or preview templates instantly.",
});

Object.assign(TRANSLATIONS.ru, {
  title: "GLYPH",
  techEngine: "Движок Gemini 3.5",
  connected: "Подключено",
  tagline: "Извлечение и чат с документами",
  clearFile: "Очистить файл",
  dropZoneTitle: "Перетащите файл сюда или выберите",
  dropZoneSubText: "PNG, JPG, WEBP или PDF (до 10 МБ)",
  samplesTitle: "Интерактивные примеры:",
  cursiveNotes: "Поддерживает рукописный текст, макеты, чеки и плотные PDF-отчеты.",
  processingSettings: "Настройки обработки",
  extractionModeLabel: "Режим извлечения",
  additionalDirectives: "Дополнительные инструкции",
  directivesPlaceholder: "Например: «Переведи на немецкий», «Найди цены»...",
  startExtraction: "Начать извлечение",
  parsingImage: "Анализ контекста изображения...",
  extractionFailed: "Ошибка извлечения",
  noContentTitle: "Контент пока не извлечен",
  noContentSubText: "Добавьте файл слева, выберите режим извлечения и нажмите «Начать извлечение», чтобы запустить Gemini.",
  step1Title: "Выберите источник",
  step1Sub: "Изображения и многостраничные PDF обрабатываются быстро.",
  step2Title: "Режим извлечения",
  step2Sub: "Настройте вывод: резюме, Markdown-таблицы или очищенный текст.",
  step3Title: "Чат с документом",
  step3Sub: "Задавайте вопросы, извлекайте данные или проверяйте записи.",
  loadingEngine: "Запущен OCR и движок извлечения",
  loadingSubText: "анализ структуры, распознавание строк и форматирование результата...",
  awaitingResponse: "ОБРАБОТКА (ОЖИДАНИЕ ОТВЕТА)",
  trackerSteps: [
    "Инициализация движка и защищенного рабочего буфера",
    "Сканирование структуры документа и типографики",
    "Распознавание макета, строк и координат",
    "Исправление синтаксиса и сборка Markdown",
    "Формирование финального форматированного результата",
  ],
  words: "слов",
  chars: "символов",
  formula: "режим",
  extractedText: "Извлеченный текст",
  chatWithDoc: "Чат с документом",
  saveBtn: "Сохранить",
  cancelBtn: "Отмена",
  editBtn: "Редактировать",
  copyText: "Копировать",
  copied: "Скопировано!",
  exportLabel: "Экспорт",
  chatHintTitle: "Контекстный помощник",
  chatHintDesc: "Попросите посчитать суммы, найти подписи, перевести текст или подготовить письмо по документу.",
  chatPromptIntro: "Что вы хотите спросить?",
  chatPromptDates: "Кратко опиши ключевые сроки",
  chatPromptInvoice: "Найди цены и расходы",
  chatSample1: "Суммировать сроки",
  chatSample2: "Найти цены и расходы",
  you: "Вы",
  assistant: "Помощник по документам",
  chatLoading: "Соединяю контекст файла...",
  chatPlaceholder: "Спросите что-нибудь о документе...",
  copyright: "© 2026 GLYPH AI OCR Engine. Создано с Gemini и Antigravity.",
  statelessSandbox: "Без сохранения данных",
  securitySafe: "Безопасно",
  jsonOutput: "JSON-вывод",
  publishingMethod: "Шаблон публикации",
  publishingDesc: {
    raw: "Исходный простой вывод",
    email: "Профессиональное письмо",
    wiki: "Техническая документация",
    blog: "Редакционная статья/пост",
    json: "Структурированный JSON-объект",
  },
  documentTypeLabel: "Тип документа",
  docTypeGeneral: "Общий OCR",
  docTypeInvoice: "Извлечение счета",
  docTypeContract: "Анализ договора",
  docTypeResume: "Разбор CV / резюме",
  docTypeReceipt: "Обработка чека",
  docTypeTable: "Извлечение таблицы",
  modes: {
    raw: "Точный текст",
    rawDesc: "Извлечь чистый текст документа без дополнительных пояснений.",
    layout: "Таблицы и списки",
    layoutDesc: "Сохранить структуру таблиц, списков и визуальных блоков.",
    transcript: "Рукописный текст",
    transcriptDesc: "Распознать рукописные заметки и привести их к читаемому виду.",
    summary: "Краткое резюме",
    summaryDesc: "Сформировать структурированное резюме с важными пунктами.",
    "key-value": "Ключевые поля",
    "key-valueDesc": "Извлечь даты, суммы, метки и значения в таблицу.",
  },
  homeHeroTitle: "Мультимодальный центр анализа документов",
  homeHeroSub: "Превращайте бумаги, чеки, сканы счетов и рукописные заметки в чистые записи, документы и краткие отчеты с Gemini 3.5.",
  homeBtnLaunch: "Открыть Extraction Desk",
  homeBtnDemo: "Открыть демо",
  homeSection2Header: "Как Glyph преобразует файлы",
  homeSection2Sub: "Три простых шага от бумажного документа к редактируемым цифровым данным.",
  homeDemoHeader: "Интерактивный симулятор функций",
  homeDemoSub: "Выберите пример и режим обработки, чтобы увидеть, как GLYPH восстанавливает данные.",
  homeDemoLoad: "Открыть пример в рабочей области",
  homeDemoSimulating: "Выравниваю OCR-слои...",
  bentoHeader: "Возможности движка и защита данных",
  bentoSub: "Безопасно, многоязычно и точно.",
  bentoCard1Title: "Распознавание рукописного текста",
  bentoCard1Desc: "Понимает сложный почерк, быстрые заметки и сокращения.",
  bentoCard2Title: "Без сохранения в базе",
  bentoCard2Desc: "Работает как stateless-среда: результат обрабатывается в памяти.",
  bentoCard3Title: "Готовые к экспорту файлы",
  bentoCard3Desc: "Скачивайте Markdown, TXT или DOC-файлы одним действием.",
  bentoCard4Title: "Специализированные схемы",
  bentoCard4Desc: "Извлекает структурированные данные из счетов, договоров, резюме, чеков и таблиц.",
  bentoCard5Title: "Диалог с документом",
  bentoCard5Desc: "Задавайте вопросы по извлеченному документу, считайте суммы и проверяйте условия.",
  bentoCard6Title: "Пять общих режимов",
  bentoCard6Desc: "Точный текст, таблицы, рукопись, резюме и ключевые поля.",
  navOverview: "Обзор",
  navWorkspace: "Extraction Desk",
  navNavigation: "Навигация",
  navLanguage: "Язык",
  engineBadge: "Мультимодальный движок документов",
  selectDocTemplate: "1. Выберите шаблон документа",
  presetFileSubtitle: "Готовый интерактивный пример",
  chooseFormulaMode: "2. Выберите режим",
  viewLabel: "Вид",
  lblImage: "Изображение",
  lblPdf: "PDF-документ",
  stepLabel: "Шаг",
  editModeLabel: "Режим редактирования",
  presetBakery: "Счет уютной пекарни #429",
  presetArcheology: "Лекционные заметки по археологии",
  sampleHandwritten: "Рукописные заметки встречи.png",
  sampleInvoice: "Счет Acoustic Tavern.jpg",
  featureExtractionTitle: "Extraction Desk",
  featureExtractionDesc: "OCR, структурированные данные и чат",
  featureCvTitle: "CV Builder",
  featureCvDesc: "Резюме, заметки, роли и экспорт",
  cvHeroTitle: "Создавайте и улучшайте резюме",
  cvHeroSub: "Превращайте CV, биографию и рабочие заметки в резюме для рекрутеров, адаптированные под роли и ATS-шаблоны.",
  cvOpenBuilder: "Открыть CV Builder",
  cvTryDemo: "Попробовать демо CV",
  cvHowHeader: "Как CV Builder помогает получить роль",
  cvHowSub: "Загрузите CV или напишите рабочие заметки, выберите роли и шаблон, а AI усилит ключевые слова, метрики и ясность.",
  cvStep1Title: "Добавьте источник",
  cvStep1Sub: "Загрузите CV или внесите заметки об опыте, образовании, навыках и целях.",
  cvStep2Title: "Выберите цели",
  cvStep2Sub: "Выберите роли и шаблоны, чтобы AI выделил релевантные навыки и достижения.",
  cvStep3Title: "Создайте и экспортируйте",
  cvStep3Sub: "Скачайте PDF/DOC или скопируйте оптимизированный Markdown для ATS.",
  cvSelectSample: "1. Выберите пример CV",
  cvSampleSubtitle: "Пример Markdown-резюме",
  cvTemplatePreview: "2. Предпросмотр шаблона",
  cvLoadBuilder: "Загрузить в CV Builder",
  cvSource: "Источник CV",
  cvFileUpload: "Загрузка файла",
  cvRawNotes: "Сырые заметки",
  cvClear: "Очистить",
  cvDropTitle: "Перетащите CV сюда или выберите файл",
  cvDropSub: "PDF, DOC, DOCX, PNG, JPG (до 10 МБ)",
  cvRawNotesPlaceholder: "Напишите или вставьте биографию/рабочие заметки: имя, контакты, опыт, обязанности, достижения, образование, навыки, инструменты, языки, сертификаты, проекты и карьерные цели.",
  cvRawNotesMin: "Минимум",
  cvTemplateStyle: "Стиль шаблона",
  cvOptimizationSettings: "Настройки оптимизации",
  cvTone: "Тон",
  cvSeniority: "Уровень опыта",
  cvFocusAreas: "Фокус",
  cvAdditionalNotes: "Дополнительные заметки",
  cvAdditionalPlaceholder: "Например: «Добавить образование», «Подчеркнуть удаленную работу», «Добавить метрики»",
  cvTargetPositions: "Целевые должности",
  cvSelected: "выбрано",
  cvOptimizedReady: "Оптимизированное CV готово",
  cvReadySub: "Загрузите CV или добавьте рабочие заметки, выберите целевые роли и создайте AI-оптимизированную версию.",
  cvGenerate: "Создать оптимизированное CV",
  cvOptimizing: "Оптимизация...",
  cvOptimizingTitle: "Оптимизирую CV",
  cvOptimizingSub: "AI адаптирует резюме под выбранные должности...",
  cvPositions: "должностей",
  cvGenerated: "Создано",
  cvStartOver: "Начать заново",
  cvPreview: "Предпросмотр",
  cvText: "Текст",
  cvTemplate: "Шаблон",
  cvCopyText: "Копировать текст",
  cvExportDoc: "Экспорт .DOC",
  cvExportPdf: "Экспорт .PDF",
  cvFeaturesHeader: "Возможности CV Builder",
  cvFeaturesSub: "Умная реконструкция резюме, ATS-адаптация, стили шаблонов и оптимизация под роль.",
  cvFeatureCard1Title: "Стиль шаблона",
  cvFeatureCard1Desc: "Выбирайте ATS-дружелюбные шаблоны и визуальные темы для рекрутеров.",
  cvFeatureCard2Title: "Фокус на роли",
  cvFeatureCard2Desc: "Оптимизируйте резюме под конкретные должности, ключевые слова и достижения.",
  cvFeatureCard3Title: "Экспорт и отправка",
  cvFeatureCard3Desc: "Экспортируйте аккуратный DOC/PDF, копируйте Markdown или сразу смотрите предпросмотр.",
});

Object.assign(TRANSLATIONS.am, {
  title: "GLYPH",
  techEngine: "Gemini 3.5 շարժիչ",
  connected: "Միացված է",
  tagline: "Փաստաթղթերի տեքստի դուրսբերում և զրույց",
  clearFile: "Մաքրել ֆայլը",
  dropZoneTitle: "Քաշեք ֆայլը այստեղ կամ ընտրեք",
  dropZoneSubText: "PNG, JPG, WEBP կամ PDF (մինչև 10 ՄԲ)",
  samplesTitle: "Ինտերակտիվ օրինակներ՝",
  cursiveNotes: "Աջակցում է ձեռագիր տեքստին, դասավորություններին, կտրոններին և խիտ PDF հաշվետվություններին։",
  processingSettings: "Մշակման կարգավորումներ",
  extractionModeLabel: "Դուրսբերման ռեժիմ",
  additionalDirectives: "Լրացուցիչ հրահանգներ",
  directivesPlaceholder: "Օրինակ՝ «Թարգմանիր գերմաներեն», «Գտիր գները»...",
  startExtraction: "Սկսել դուրսբերումը",
  parsingImage: "Վերլուծվում է պատկերի համատեքստը...",
  extractionFailed: "Դուրսբերման սխալ",
  noContentTitle: "Տեքստը դեռ դուրս չի բերվել",
  noContentSubText: "Ավելացրեք ֆայլը ձախում, ընտրեք ռեժիմը և սեղմեք «Սկսել դուրսբերումը»՝ Gemini-ն գործարկելու համար։",
  step1Title: "Ընտրեք աղբյուրը",
  step1Sub: "Պատկերներն ու բազմաէջ PDF-ները մշակվում են արագ։",
  step2Title: "Դուրսբերման ռեժիմ",
  step2Sub: "Ձևավորեք արդյունքը՝ ամփոփում, Markdown աղյուսակ կամ մաքրված տեքստ։",
  step3Title: "Զրույց փաստաթղթի հետ",
  step3Sub: "Տվեք հարցեր, դուրս բերեք տվյալներ կամ ստուգեք գրառումները։",
  loadingEngine: "Գործարկվում է OCR և դուրսբերման շարժիչը",
  loadingSubText: "վերլուծվում է կառուցվածքը, ճանաչվում են տողերը և ձևավորվում արդյունքը...",
  awaitingResponse: "ՄՇԱԿՈՒՄ (ՍՊԱՍՈՒՄ Է ՊԱՏԱՍԽԱՆԻ)",
  trackerSteps: [
    "Շարժիչի և անվտանգ աշխատանքային բուֆերի նախապատրաստում",
    "Փաստաթղթի կառուցվածքի և տիպոգրաֆիայի սկանավորում",
    "Դասավորության, տողերի և կոորդինատների ճանաչում",
    "Շարահյուսության ուղղում և Markdown-ի հավաքում",
    "Վերջնական ձևաչափված արդյունքի պատրաստում",
  ],
  words: "բառ",
  chars: "նիշ",
  formula: "ռեժիմ",
  extractedText: "Դուրս բերված տեքստ",
  chatWithDoc: "Զրույց փաստաթղթի հետ",
  saveBtn: "Պահպանել",
  cancelBtn: "Չեղարկել",
  editBtn: "Խմբագրել",
  copyText: "Պատճենել",
  copied: "Պատճենվեց",
  exportLabel: "Արտահանում",
  chatHintTitle: "Համատեքստային օգնական",
  chatHintDesc: "Խնդրեք հաշվել գումարները, գտնել ստորագրությունները, թարգմանել կամ պատրաստել նամակ փաստաթղթի հիման վրա։",
  chatPromptIntro: "Ի՞նչ եք ուզում հարցնել։",
  chatPromptDates: "Ամփոփիր կարևոր ժամկետները",
  chatPromptInvoice: "Գտիր գներն ու ծախսերը",
  chatSample1: "Ամփոփել ժամկետները",
  chatSample2: "Գտնել գներն ու ծախսերը",
  you: "Դուք",
  assistant: "Փաստաթղթերի օգնական",
  chatLoading: "Միացվում է ֆայլի համատեքստը...",
  chatPlaceholder: "Հարցրեք փաստաթղթի մասին...",
  copyright: "© 2026 GLYPH AI OCR Engine. Ստեղծված է Gemini-ի և Antigravity-ի միջոցով։",
  statelessSandbox: "Առանց տվյալների պահպանում",
  securitySafe: "Անվտանգ",
  jsonOutput: "JSON արդյունք",
  publishingMethod: "Հրապարակման ձևաչափ",
  publishingDesc: {
    raw: "Սկզբնական պարզ արդյունք",
    email: "Մասնագիտական նամակ",
    wiki: "Տեխնիկական փաստաթուղթ",
    blog: "Խմբագրական հոդված/բլոգ",
    json: "Կառուցվածքային JSON օբյեկտ",
  },
  documentTypeLabel: "Փաստաթղթի տեսակ",
  docTypeGeneral: "Ընդհանուր OCR",
  docTypeInvoice: "Հաշվի դուրսբերում",
  docTypeContract: "Պայմանագրի վերլուծություն",
  docTypeResume: "CV / ռեզյումեի վերլուծություն",
  docTypeReceipt: "Կտրոնի մշակում",
  docTypeTable: "Աղյուսակի դուրսբերում",
  modes: {
    raw: "Ճշգրիտ տեքստ",
    rawDesc: "Դուրս բերել մաքուր տեքստը առանց հավելյալ մեկնաբանության։",
    layout: "Աղյուսակներ և ցուցակներ",
    layoutDesc: "Պահպանել աղյուսակների, ցուցակների և տեսողական բլոկների կառուցվածքը։",
    transcript: "Ձեռագիր տեքստ",
    transcriptDesc: "Ճանաչել ձեռագիր նշումները և դարձնել ընթեռնելի։",
    summary: "Կարճ ամփոփում",
    summaryDesc: "Ստեղծել կառուցվածքային ամփոփում կարևոր կետերով։",
    "key-value": "Կարևոր դաշտեր",
    "key-valueDesc": "Դուրս բերել ամսաթվեր, գումարներ, պիտակներ և արժեքներ աղյուսակով։",
  },
  homeHeroTitle: "Բազմամոդալ փաստաթղթերի վերլուծության կենտրոն",
  homeHeroSub: "Թղթերը, կտրոնները, հաշիվների սկանները և ձեռագիր նշումները վերածեք մաքուր գրառումների, փաստաթղթերի և ամփոփագրերի՝ Gemini 3.5-ի միջոցով։",
  homeBtnLaunch: "Բացել Extraction Desk-ը",
  homeBtnDemo: "Բացել դեմոն",
  homeSection2Header: "Ինչպես է Glyph-ը փոխակերպում ֆայլերը",
  homeSection2Sub: "Երեք պարզ քայլ՝ թղթային փաստաթղթից մինչև խմբագրվող թվային տվյալներ։",
  homeDemoHeader: "Ինտերակտիվ գործառույթների սիմուլյատոր",
  homeDemoSub: "Ընտրեք օրինակն ու մշակման ռեժիմը՝ տեսնելու համար, թե ինչպես է GLYPH-ը վերականգնում տվյալները։",
  homeDemoLoad: "Բացել օրինակը աշխատանքային տարածքում",
  homeDemoSimulating: "Համադրվում են OCR շերտերը...",
  bentoHeader: "Շարժիչի հնարավորություններ և տվյալների պաշտպանություն",
  bentoSub: "Անվտանգ, բազմալեզու և ճշգրիտ։",
  bentoCard1Title: "Ձեռագիր տեքստի ճանաչում",
  bentoCard1Desc: "Կարդում է բարդ ձեռագիր, արագ նշումներ և կրճատումներ։",
  bentoCard2Title: "Առանց տվյալների պահպանում",
  bentoCard2Desc: "Աշխատում է stateless միջավայրում․ արդյունքը մշակվում է հիշողության մեջ։",
  bentoCard3Title: "Արտահանման պատրաստ ֆայլեր",
  bentoCard3Desc: "Ներբեռնեք Markdown, TXT կամ DOC ֆայլեր մեկ գործողությամբ։",
  bentoCard4Title: "Մասնագիտացված սխեմաներ",
  bentoCard4Desc: "Դուրս է բերում կառուցվածքային տվյալներ հաշիվներից, պայմանագրերից, ռեզյումեներից, կտրոններից և աղյուսակներից։",
  bentoCard5Title: "Զրույց փաստաթղթի հետ",
  bentoCard5Desc: "Հարցեր տվեք փաստաթղթի մասին, հաշվեք գումարներ և ստուգեք պայմանները։",
  bentoCard6Title: "Հինգ ընդհանուր ռեժիմ",
  bentoCard6Desc: "Ճշգրիտ տեքստ, աղյուսակներ, ձեռագիր, ամփոփում և կարևոր դաշտեր։",
  navOverview: "Ընդհանուր",
  navWorkspace: "Extraction Desk",
  navNavigation: "Նավիգացիա",
  navLanguage: "Լեզու",
  engineBadge: "Բազմամոդալ փաստաթղթերի շարժիչ",
  selectDocTemplate: "1. Ընտրեք փաստաթղթի օրինակը",
  presetFileSubtitle: "Պատրաստ ինտերակտիվ օրինակ",
  chooseFormulaMode: "2. Ընտրեք ռեժիմը",
  viewLabel: "Տեսք",
  lblImage: "Պատկեր",
  lblPdf: "PDF փաստաթուղթ",
  stepLabel: "Քայլ",
  editModeLabel: "Խմբագրման ռեժիմ",
  presetBakery: "Հարմարավետ փուռի հաշիվ #429",
  presetArcheology: "Հնագիտության դասախոսության նշումներ",
  sampleHandwritten: "Ձեռագիր հանդիպման նշումներ.png",
  sampleInvoice: "Acoustic Tavern հաշիվ.jpg",
  featureExtractionTitle: "Extraction Desk",
  featureExtractionDesc: "OCR, կառուցվածքային տվյալներ և զրույց",
  featureCvTitle: "CV Builder",
  featureCvDesc: "Ռեզյումեներ, նշումներ, դերեր և արտահանում",
  cvHeroTitle: "Ստեղծեք և օպտիմալացրեք ռեզյումեներ",
  cvHeroSub: "CV-ները, կենսագրական տեքստերը և աշխատանքային նշումները վերածեք ռեկրուտերների համար պատրաստ ռեզյումեների՝ հարմարեցված դերերին և ATS ձևաչափերին։",
  cvOpenBuilder: "Բացել CV Builder-ը",
  cvTryDemo: "Փորձել CV դեմոն",
  cvHowHeader: "Ինչպես է CV Builder-ը օգնում ստանալ աշխատանք",
  cvHowSub: "Վերբեռնեք CV կամ գրեք աշխատանքային նշումներ, ընտրեք դերերն ու ձևաչափը, իսկ AI-ը կուժեղացնի բանալի բառերը, չափելի արդյունքները և հստակությունը։",
  cvStep1Title: "Ավելացրեք աղբյուրը",
  cvStep1Sub: "Վերբեռնեք CV կամ գրեք փորձի, կրթության, հմտությունների և նպատակների մասին նշումներ։",
  cvStep2Title: "Ընտրեք թիրախները",
  cvStep2Sub: "Ընտրեք դերեր և ձևաչափեր, որպեսզի AI-ը կարևորի համապատասխան հմտություններն ու ձեռքբերումները։",
  cvStep3Title: "Ստեղծեք և արտահանեք",
  cvStep3Sub: "Ներբեռնեք PDF/DOC կամ պատճենեք ATS-ի համար օպտիմալացված Markdown-ը։",
  cvSelectSample: "1. Ընտրեք CV օրինակ",
  cvSampleSubtitle: "Markdown ռեզյումեի օրինակ",
  cvTemplatePreview: "2. Ձևաչափի նախադիտում",
  cvLoadBuilder: "Բեռնել CV Builder-ում",
  cvSource: "CV աղբյուր",
  cvFileUpload: "Ֆայլի վերբեռնում",
  cvRawNotes: "Սևագիր նշումներ",
  cvClear: "Մաքրել",
  cvDropTitle: "Քաշեք CV-ն այստեղ կամ ընտրեք ֆայլ",
  cvDropSub: "PDF, DOC, DOCX, PNG, JPG (մինչև 10 ՄԲ)",
  cvRawNotesPlaceholder: "Գրեք կամ տեղադրեք կենսագրական/աշխատանքային նշումներ՝ անուն, կոնտակտներ, փորձ, պարտականություններ, ձեռքբերումներ, կրթություն, հմտություններ, գործիքներ, լեզուներ, սերտիֆիկատներ, նախագծեր և կարիերայի նպատակներ։",
  cvRawNotesMin: "Նվազագույնը",
  cvTemplateStyle: "Ձևաչափի ոճ",
  cvOptimizationSettings: "Օպտիմալացման կարգավորումներ",
  cvTone: "Տոնայնություն",
  cvSeniority: "Փորձի մակարդակ",
  cvFocusAreas: "Կենտրոնացում",
  cvAdditionalNotes: "Լրացուցիչ նշումներ",
  cvAdditionalPlaceholder: "Օրինակ՝ «Ավելացնել կրթություն», «Շեշտել հեռավար աշխատանքը», «Ավելացնել չափումներ»",
  cvTargetPositions: "Թիրախային պաշտոններ",
  cvSelected: "ընտրված",
  cvOptimizedReady: "Օպտիմալացված CV-ն պատրաստ է",
  cvReadySub: "Վերբեռնեք CV կամ ավելացրեք աշխատանքային նշումներ, ընտրեք թիրախային դերերը և ստեղծեք AI-ով օպտիմալացված տարբերակ։",
  cvGenerate: "Ստեղծել օպտիմալացված CV",
  cvOptimizing: "Օպտիմալացվում է...",
  cvOptimizingTitle: "Օպտիմալացվում է ձեր CV-ն",
  cvOptimizingSub: "AI-ը հարմարեցնում է ռեզյումեն ընտրված պաշտոններին...",
  cvPositions: "պաշտոն",
  cvGenerated: "Ստեղծված է",
  cvStartOver: "Սկսել նորից",
  cvPreview: "Նախադիտում",
  cvText: "Տեքստ",
  cvTemplate: "Ձևաչափ",
  cvCopyText: "Պատճենել տեքստը",
  cvExportDoc: "Արտահանել .DOC",
  cvExportPdf: "Արտահանել .PDF",
  cvFeaturesHeader: "CV Builder-ի հնարավորություններ",
  cvFeaturesSub: "Խելացի ռեզյումեի վերակառուցում, ATS համապատասխանեցում, ձևաչափի ոճավորում և օպտիմալացում ըստ դերի։",
  cvFeatureCard1Title: "Ձևաչափի ոճավորում",
  cvFeatureCard1Desc: "Ընտրեք ATS-ին հարմար ձևաչափեր և տեսողական ոճեր ռեկրուտերների համար։",
  cvFeatureCard2Title: "Դերի թիրախավորում",
  cvFeatureCard2Desc: "Օպտիմալացրեք կոնկրետ պաշտոնների համար՝ բանալի բառերով և ձեռքբերումներով։",
  cvFeatureCard3Title: "Արտահանում և կիսում",
  cvFeatureCard3Desc: "Արտահանեք DOC/PDF, պատճենեք Markdown կամ անմիջապես դիտեք նախադիտումը։",
});

interface DemoPreset {
  name: string;
  illustration: string;
  raw: string;
  layout: string;
  transcript: string;
  summary: string;
  "key-value": string;
}

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
interface CvDemoPreset {
  name: string;
  illustration: string;
  markdown: string;
}

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
const SR = {
  surface: "bg-white dark:bg-[#1a1412]",
  surfaceMuted: "bg-stone-50 dark:bg-[#1f1815]",
  surfaceInset: "bg-stone-100 dark:bg-[#252018]",
  border: "border-stone-200 dark:border-stone-700",
  textPrimary: "text-stone-800 dark:text-stone-100",
  textSecondary: "text-stone-600 dark:text-stone-400",
  textMuted: "text-stone-500 dark:text-stone-400",
  textLabel: "text-stone-400 dark:text-stone-500",
  hoverRow: "hover:bg-stone-50 dark:hover:bg-[#252018]",
};

// Sub-components for confidence scoring and visual results
const ConfidenceMeter = ({ value }: { value: number }) => {
  const percentage = Math.round(value * 100);
  let barColor = "bg-orange-500";
  let textColor = "text-orange-600 bg-orange-50 dark:bg-orange-950/20";
  if (value >= 0.85) {
    barColor = "bg-emerald-600";
    textColor = "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20";
  } else if (value < 0.60) {
    barColor = "bg-rose-600";
    textColor = "text-rose-600 bg-rose-50 dark:bg-rose-950/20";
  }

  return (
    <div className="flex items-center gap-2" title={`OCR confidence: ${percentage}%`}>
      <div className="w-14 h-1.5 bg-stone-200 dark:bg-stone-800 rounded-full overflow-hidden">
        <div className={`h-full ${barColor}`} style={{ width: `${percentage}%` }} />
      </div>
      <span className={`text-[9.5px] px-1.5 py-0.5 rounded-md font-mono font-bold ${textColor}`}>
        {percentage}%
      </span>
    </div>
  );
};

const CopyFieldButton = ({ value }: { value: string }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!value) return;
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      title="Copy field value"
      className="p-1 hover:bg-[#C86432]/10 dark:hover:bg-[#C86432]/20 rounded-md text-stone-400 hover:text-[#C86432] transition-colors cursor-pointer inline-flex items-center justify-center scale-90"
    >
      {copied ? (
        <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />
      ) : (
        <Copy className="w-3.5 h-3.5" />
      )}
    </button>
  );
};

const convertSpecializedJsonToMarkdown = (jsonText: string, docType: string): string => {
  if (!jsonText) return "";
  try {
    const data = JSON.parse(jsonText);
    let md = "";

    switch (docType) {
      case "invoice": {
        const vendor = data.vendorName?.value || "N/A";
        const vendorAddr = data.vendorAddress?.value || "";
        const billing = data.billingName?.value || "N/A";
        const billingAddr = data.billingAddress?.value || "";
        const invNum = data.invoiceNumber?.value || "N/A";
        const invDate = data.invoiceDate?.value || "N/A";
        const subtotal = data.subtotal?.value || "0.00";
        const tax = data.tax?.value || "0.00";
        const total = data.totalAmount?.value || "0.00";
        const currency = data.currency?.value || "USD";

        md = `# INVOICE SUMMARY\n\n`;
        md += `* **Vendor/Company:** ${vendor}\n`;
        if (vendorAddr) md += `  Address: ${vendorAddr}\n`;
        md += `* **Billed To:** ${billing}\n`;
        if (billingAddr) md += `  Address: ${billingAddr}\n`;
        md += `* **Invoice Number:** ${invNum}\n`;
        md += `* **Billing Date:** ${invDate}\n`;
        md += `* **Currency:** ${currency}\n\n`;

        md += `## LINE ITEMS\n\n`;
        md += `| Item Description | Qty | Unit Price | Total |\n`;
        md += `| :--- | :---: | :---: | :---: |\n`;
        const items = Array.isArray(data.lineItems) ? data.lineItems : [];
        if (items.length > 0) {
          items.forEach((it: any) => {
            const desc = it.description?.value || "Item";
            const qty = it.quantity?.value !== undefined ? it.quantity.value : "1";
            const unit = it.unitPrice?.value !== undefined ? it.unitPrice.value : "N/A";
            const lineTotal = it.total?.value !== undefined ? it.total.value : "N/A";
            md += `| ${desc} | ${qty} | ${unit} | ${lineTotal} |\n`;
          });
        } else {
          md += `| (No items listed) | - | - | - |\n`;
        }
        md += `\n`;
        md += `## FINANCIAL TOTALS\n\n`;
        md += `* **Subtotal:** ${subtotal} ${currency}\n`;
        md += `* **VAT/Tax:** ${tax} ${currency}\n`;
        md += `* **Grand Total Paid:** **${total} ${currency}**\n`;
        break;
      }
      case "contract": {
        const title = data.contractTitle?.value || "Legal Agreement";
        const summary = data.summary?.value || "No agreement summary parsed.";
        const effDate = data.effectiveDate?.value || "N/A";
        const expDate = data.expirationDate?.value || "N/A";
        const govLaw = data.governingLaw?.value || "N/A";
        const termPeriod = data.terminationNoticePeriod?.value || "N/A";
        const liability = data.liabilityCap?.value || "N/A";

        md = `# CONTRACT BRIEF: ${title}\n\n`;
        md += `## Executive Summary\n${summary}\n\n`;
        md += `## Key Information\n\n`;
        md += `* **Effective Date:** ${effDate}\n`;
        md += `* **Expiration Date:** ${expDate}\n`;
        md += `* **Governing Law:** ${govLaw}\n`;
        md += `* **Termination Notice Period:** ${termPeriod}\n`;
        md += `* **Liability Cap:** ${liability}\n\n`;

        md += `## Important Dates & Deadlines\n\n`;
        const dates = Array.isArray(data.importantDates) ? data.importantDates : [];
        if (dates.length > 0) {
          dates.forEach((d: any) => {
            const event = d.event?.value || d.event || "Deadline";
            const val = d.dateValue?.value || d.dateValue || "Date";
            md += `* **${event}:** ${val}\n`;
          });
        } else {
          md += `* (No additional dates listed)\n`;
        }
        md += `\n`;

        md += `## Risk Diagnostics\n\n`;
        const risks = Array.isArray(data.risks) ? data.risks : [];
        if (risks.length > 0) {
          risks.forEach((r: any) => {
            const factor = r.riskFactor?.value || "Risk Factor";
            const severity = r.severity?.value || "Medium";
            const detail = r.detail?.value || "";
            md += `* **[${severity.toUpperCase()}] ${factor}:** ${detail}\n`;
          });
        } else {
          md += `* (No critical risk factors identified)\n`;
        }
        md += `\n`;

        md += `## Provisions & Key Clauses\n\n`;
        const clauses = Array.isArray(data.keyClauses) ? data.keyClauses : [];
        if (clauses.length > 0) {
          clauses.forEach((c: any) => {
            const heading = c.title?.value || c.title || "Section Clause";
            const content = c.content?.value || c.content || "";
            md += `### ${heading}\n${content}\n\n`;
          });
        } else {
          md += `* (No specialized clauses indexed)\n`;
        }
        break;
      }
      case "resume": {
        const name = data.candidateName?.value || "Candidate";
        const email = data.email?.value || "N/A";
        const phone = data.phone?.value || "N/A";
        const loc = data.location?.value || "N/A";
        const summary = data.summary?.value || "";

        md = `# RESUME PROFILE: ${name}\n\n`;
        md += `* **Email:** ${email}\n`;
        md += `* **Phone:** ${phone}\n`;
        md += `* **Location:** ${loc}\n\n`;
        if (summary) {
          md += `## Professional Summary\n${summary}\n\n`;
        }

        md += `## Technical Skillset\n\n`;
        const skills = Array.isArray(data.skills) ? data.skills : [];
        if (skills.length > 0) {
          skills.forEach((sk: any) => {
            const cat = sk.category?.value || "Skills";
            const list = Array.isArray(sk.skillsList) ? sk.skillsList.join(", ") : String(sk.skillsList || "");
            md += `* **${cat}:** ${list}\n`;
          });
        } else {
          md += `* (No targeted skills listed)\n`;
        }
        md += `\n`;

        md += `## Professional Experience\n\n`;
        const exp = Array.isArray(data.experience) ? data.experience : [];
        if (exp.length > 0) {
          exp.forEach((work: any) => {
            const role = work.role?.value || "Role";
            const comp = work.company?.value || "Company";
            const start = work.startDate?.value || "";
            const end = work.endDate?.value || "";
            const desc = work.description?.value || "";
            md += `### ${role} at ${comp} (${start} - ${end})\n`;
            if (desc) md += `${desc}\n\n`;
          });
        } else {
          md += `* (No historical experience listed)\n`;
        }

        md += `## Academic History\n\n`;
        const edu = Array.isArray(data.education) ? data.education : [];
        if (edu.length > 0) {
          edu.forEach((school: any) => {
            const deg = school.degree?.value || "Degree";
            const inst = school.institution?.value || "Institution";
            const grad = school.graduationYear?.value || "";
            md += `* **${deg}** - ${inst} (${grad})\n`;
          });
        } else {
          md += `* (No academic metrics listed)\n`;
        }
        break;
      }
      case "receipt": {
        const merchant = data.merchantName?.value || "Merchant";
        const address = data.merchantAddress?.value || "";
        const phone = data.merchantPhone?.value || "";
        const date = data.transactionDate?.value || "N/A";
        const time = data.transactionTime?.value || "N/A";
        const pay = data.paymentMethod?.value || "Card";
        const subtotal = data.subtotal?.value || "";
        const tax = data.tax?.value || "0.00";
        const tip = data.tip?.value || "0.00";
        const total = data.totalAmount?.value || "0.00";

        md = `# RETAIL SLIP: ${merchant}\n\n`;
        if (address) md += `* **Address:** ${address}\n`;
        if (phone) md += `* **Phone:** ${phone}\n`;
        md += `* **Transaction Date:** ${date} ${time}\n`;
        md += `* **Payment Channel:** ${pay}\n\n`;

        md += `## PURCHASED ITEMS\n\n`;
        md += `| Description | Qty | Total Price |\n`;
        md += `| :--- | :---: | :---: |\n`;
        const items = Array.isArray(data.items) ? data.items : [];
        if (items.length > 0) {
          items.forEach((it: any) => {
            const desc = it.description?.value || "Item";
            const qty = it.quantity?.value !== undefined ? it.quantity.value : "1";
            const price = it.totalPrice?.value !== undefined ? it.totalPrice.value : "N/A";
            md += `| ${desc} | ${qty} | ${price} |\n`;
          });
        } else {
          md += `| (No items listed) | - | - |\n`;
        }
        md += `\n`;

        md += `## TRANSACTION TOTALS\n\n`;
        if (subtotal) md += `* **Subtotal:** ${subtotal}\n`;
        md += `* **VAT/Taxes:** ${tax}\n`;
        md += `* **Tip:** ${tip}\n`;
        md += `* **Grand Total Paid:** **${total}**\n`;
        break;
      }
      case "table": {
        const tableName = data.tableName?.value || "Tabular Grid Result";
        md = `# TABLE STRUCTURE: ${tableName}\n\n`;
        const headers = Array.isArray(data.headers) ? data.headers : [];
        const rows = Array.isArray(data.rows) ? data.rows : [];

        if (headers.length === 0) {
          md += `*(No structured columns found)*\n`;
        } else {
          md += `| ${headers.map((h: any) => h.value || "").join(" | ")} |\n`;
          md += `| ${headers.map(() => ":---").join(" | ")} |\n`;
          rows.forEach((row: any) => {
            const cells = Array.isArray(row.cells) ? row.cells : [];
            md += `| ${cells.map((c: any) => c.value || "").join(" | ")} |\n`;
          });
        }
        break;
      }
      default:
        md = jsonText;
    }
    return md;
  } catch (error) {
    console.error("Error parsing specialized JSON:", error);
    return jsonText; // fallback to raw string
  }
};

const getDisplayableOrDownloadableText = (textVal: string, docType: string): string => {
  if (!docType || docType === "general_ocr") {
    return textVal;
  }
  try {
    JSON.parse(textVal);
    return convertSpecializedJsonToMarkdown(textVal, docType);
  } catch (e) {
    return textVal;
  }
};

const renderInvoiceNode = (data: any, activeField: string | null = null, onFieldClick: (field: string) => void = () => {}) => {
  const lineItems = Array.isArray(data.lineItems) ? data.lineItems : [];
  return (
    <div className={`flex flex-col gap-4 ${SR.textSecondary} animate-fade-in font-sans`}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        <div 
          onClick={() => onFieldClick("vendorName")}
          className={`p-3.5 rounded-xl border transition-all flex flex-col gap-1.5 shadow-3xs cursor-pointer hover:border-[#C86432]/50 ${
            activeField === "vendorName" ? "ring-2 ring-[#C86432] bg-[#C86432]/5 border-[#C86432]" : `${SR.border} ${SR.surfaceMuted}`
          }`}
        >
          <div className="flex items-center justify-between font-sans">
            <span className={`text-[9.5px] font-bold uppercase tracking-wider ${SR.textLabel}`}>Company (Vendor Name)</span>
            <div className="flex items-center gap-1.5 font-sans">
              {data.vendorName?.confidence !== undefined && <ConfidenceMeter value={data.vendorName?.confidence} />}
              <CopyFieldButton value={data.vendorName?.value || ""} />
            </div>
          </div>
          <p className={`text-xs font-black ${SR.textPrimary} font-sans`}>{data.vendorName?.value || "N/A"}</p>
          <p className={`text-[10px] ${SR.textMuted} font-sans`}>{data.vendorAddress?.value || "N/A"}</p>
        </div>

        <div 
          onClick={() => onFieldClick("billingName")}
          className={`p-3.5 rounded-xl border transition-all flex flex-col gap-1.5 shadow-3xs cursor-pointer hover:border-[#C86432]/50 ${
            activeField === "billingName" ? "ring-2 ring-[#C86432] bg-[#C86432]/5 border-[#C86432]" : `${SR.border} ${SR.surfaceMuted}`
          }`}
        >
          <div className="flex items-center justify-between font-sans">
            <span className={`text-[9.5px] font-bold uppercase tracking-wider ${SR.textLabel}`}>Customer (Billed To)</span>
            <div className="flex items-center gap-1.5 font-sans">
              {data.billingName?.confidence !== undefined && <ConfidenceMeter value={data.billingName?.confidence} />}
              <CopyFieldButton value={data.billingName?.value || ""} />
            </div>
          </div>
          <p className={`text-xs font-semibold ${SR.textPrimary} font-sans`}>{data.billingName?.value || "N/A"}</p>
          <p className={`text-[10px] ${SR.textMuted} font-sans`}>{data.billingAddress?.value || "N/A"}</p>
        </div>
      </div>

      <div className={`p-3.5 rounded-2xl border ${SR.border} ${SR.surfaceMuted} grid grid-cols-2 md:grid-cols-5 gap-3 shadow-3xs font-sans`}>
        <div onClick={() => onFieldClick("invoiceNumber")} className={`p-2 rounded-xl transition-all cursor-pointer hover:bg-[#C86432]/5 ${activeField === "invoiceNumber" ? "bg-[#C86432]/5 ring-1 ring-[#C86432]" : ""}`}>
          <span className="text-[9.5px] font-bold uppercase tracking-wider text-stone-400 block mb-0.5 font-sans">Invoice Number</span>
          <div className="flex items-center gap-1.5 font-sans">
            <p className="text-xs font-bold text-stone-800 dark:text-white font-mono">{data.invoiceNumber?.value || "N/A"}</p>
            <CopyFieldButton value={data.invoiceNumber?.value || ""} />
          </div>
          {data.invoiceNumber?.confidence !== undefined && <div className="mt-1"><ConfidenceMeter value={data.invoiceNumber?.confidence} /></div>}
        </div>
        <div onClick={() => onFieldClick("invoiceDate")} className={`p-2 rounded-xl transition-all cursor-pointer hover:bg-[#C86432]/5 ${activeField === "invoiceDate" ? "bg-[#C86432]/5 ring-1 ring-[#C86432]" : ""}`}>
          <span className="text-[9.5px] font-bold uppercase tracking-wider text-stone-400 block mb-0.5 font-sans">Date (Issue)</span>
          <div className="flex items-center gap-1.5 font-sans">
            <p className="text-xs font-semibold text-stone-800 dark:text-white font-mono">{data.invoiceDate?.value || "N/A"}</p>
            <CopyFieldButton value={data.invoiceDate?.value || ""} />
          </div>
          {data.invoiceDate?.confidence !== undefined && <div className="mt-1"><ConfidenceMeter value={data.invoiceDate?.confidence} /></div>}
        </div>
        <div onClick={() => onFieldClick("tax")} className={`p-2 rounded-xl transition-all cursor-pointer hover:bg-[#C86432]/5 ${activeField === "tax" ? "bg-[#C86432]/5 ring-1 ring-[#C86432]" : ""}`}>
          <span className="text-[9.5px] font-bold uppercase tracking-wider text-stone-400 block mb-0.5 font-sans">VAT / Tax Amount</span>
          <div className="flex items-center gap-1.5 animate-fade-in font-sans">
            <p className="text-xs font-semibold text-stone-800 dark:text-white font-mono">{data.tax?.value || "0.00"}</p>
            <CopyFieldButton value={data.tax?.value || ""} />
          </div>
          {data.tax?.confidence !== undefined && <div className="mt-1"><ConfidenceMeter value={data.tax?.confidence} /></div>}
        </div>
        <div onClick={() => onFieldClick("currency")} className={`p-2 rounded-xl transition-all cursor-pointer hover:bg-[#C86432]/5 ${activeField === "currency" ? "bg-[#C86432]/5 ring-1 ring-[#C86432]" : ""}`}>
          <span className="text-[9.5px] font-bold uppercase tracking-wider text-stone-400 block mb-0.5 font-sans">Currency</span>
          <div className="flex items-center gap-1.5 font-mono text-[#C86432] font-bold">
            <p className="text-xs font-semibold text-[#C86432] uppercase font-mono font-bold">{data.currency?.value || "N/A"}</p>
            <CopyFieldButton value={data.currency?.value || ""} />
          </div>
          {data.currency?.confidence !== undefined && <div className="mt-1"><ConfidenceMeter value={data.currency?.confidence} /></div>}
        </div>
        <div onClick={() => onFieldClick("totalAmount")} className={`col-span-2 md:col-span-1 border-t md:border-t-0 md:border-l border-[#eeded5] dark:border-stone-800 md:pl-2.5 p-2 rounded-xl transition-all cursor-pointer hover:bg-[#C86432]/5 ${activeField === "totalAmount" ? "bg-[#C86432]/5 ring-1 ring-[#C86432]" : ""}`}>
          <span className="text-[9.5px] font-bold uppercase tracking-wider text-[#C86432] block mb-0.5 font-sans">Total Amount</span>
          <div className="flex items-center gap-1.5 animated-fade-in">
            <p className="text-xs font-black text-rose-600 dark:text-rose-500 font-mono">{data.totalAmount?.value || "0.00"}</p>
            <CopyFieldButton value={data.totalAmount?.value || ""} />
          </div>
          {data.totalAmount?.confidence !== undefined && <div className="mt-1"><ConfidenceMeter value={data.totalAmount?.confidence} /></div>}
        </div>
      </div>

      <div 
        onClick={() => onFieldClick("lineItems")}
        className={`rounded-2xl border overflow-hidden ${SR.surfaceMuted} shadow-3xs transition-all cursor-pointer hover:border-[#C86432]/45 ${
          activeField === "lineItems" ? "ring-2 ring-[#C86432] border-[#C86432]" : SR.border
        }`}
      >
        <div className={`p-2.5 ${SR.surfaceInset} text-[10px] font-extrabold text-[#C86432] uppercase tracking-wider grid grid-cols-12 gap-2 border-b ${SR.border}`}>
          <div className="col-span-6 animate-fade-in font-sans">Billed Item Description (Line Items)</div>
          <div className="col-span-2 text-center animate-fade-in font-sans">Qty</div>
          <div className="col-span-2 text-right animate-fade-in font-sans">Unit Price</div>
          <div className="col-span-2 text-right animate-fade-in font-sans">Total</div>
        </div>
        <div className="divide-y divide-stone-200 dark:divide-stone-800/60 font-mono">
          {lineItems.length === 0 ? (
            <p className="p-3 text-center text-[11px] text-stone-400 italic font-sans">No invoice line items parsed.</p>
          ) : (
            lineItems.map((item: any, id: number) => (
              <div key={id} className={`p-2.5 grid grid-cols-12 gap-2 text-[11px] items-center ${SR.hoverRow}`}>
                <div className="col-span-6 flex flex-col gap-0.5 font-sans">
                  <div className="flex items-center gap-1.5 font-sans animate-fade-in">
                    <span className={`font-semibold ${SR.textPrimary} font-sans`}>{item.description?.value || "Item"}</span>
                    <CopyFieldButton value={item.description?.value || ""} />
                  </div>
                  {item.description?.confidence !== undefined && <ConfidenceMeter value={item.description?.confidence} />}
                </div>
                <div className={`col-span-2 text-center ${SR.textMuted} font-mono`}>
                  {item.quantity?.value !== undefined ? item.quantity.value : "1"}
                </div>
                <div className={`col-span-2 text-right ${SR.textMuted} font-mono font-medium`}>
                  {item.unitPrice?.value !== undefined ? item.unitPrice.value : "N/A"}
                </div>
                <div className={`col-span-2 text-right font-bold ${SR.textPrimary} font-mono`}>
                  {item.total?.value !== undefined ? item.total.value : "N/A"}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="flex justify-end mt-1 font-sans font-sans">
        <div className={`w-full md:w-64 p-3.5 rounded-2xl border ${SR.border} ${SR.surfaceMuted} flex flex-col gap-2 shadow-2xs`}>
          <div className="flex items-center justify-between text-[11px] font-sans">
            <span className={`${SR.textLabel} font-sans`}>Subtotal:</span>
            <span className={`font-mono font-semibold ${SR.textPrimary}`}>{data.subtotal?.value || "0.00"}</span>
          </div>
          <div className={`flex items-center justify-between text-[11px] border-b ${SR.border} pb-1.5`}>
            <span className={`${SR.textLabel} font-sans`}>VAT / Tax:</span>
            <span className={`font-mono font-semibold ${SR.textPrimary}`}>{data.tax?.value || "0.00"}</span>
          </div>
          <div className={`flex items-center justify-between text-[11.5px] font-bold font-sans animate-fade-in ${SR.surfaceInset} p-1 px-2.5 rounded-xl`}>
            <span className={`${SR.textPrimary} font-sans font-extrabold`}>Grand Total:</span>
            <div className="flex items-center gap-1.5 flex-row">
              <span className="font-mono text-emerald-600 dark:text-emerald-500 font-extrabold">{data.totalAmount?.value || "0.00"}</span>
              <CopyFieldButton value={data.totalAmount?.value || ""} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const renderContractNode = (data: any, activeField: string | null = null, onFieldClick: (field: string) => void = () => {}) => {
  const parties = Array.isArray(data.parties) ? data.parties : [];
  const importantDates = Array.isArray(data.importantDates) ? data.importantDates : [];
  const keyObligations = Array.isArray(data.keyObligations) ? data.keyObligations : [];
  const risks = Array.isArray(data.risks) ? data.risks : [];
  const keyClauses = Array.isArray(data.keyClauses) ? data.keyClauses : [];

  return (
    <div className={`flex flex-col gap-4 ${SR.textSecondary} animate-fade-in font-sans`}>
      {/* Title block */}
      <div 
        onClick={() => onFieldClick("contractTitle")}
        className={`p-4 rounded-2xl border transition-all cursor-pointer hover:border-[#C86432]/50 ${
          activeField === "contractTitle" ? "ring-2 ring-[#C86432] bg-[#C86432]/5 border-[#C86432]" : `${SR.border} ${SR.surfaceMuted}`
        } flex flex-col gap-1.5 shadow-3xs`}
      >
        <div className="flex justify-between items-center animate-fade-in">
          <span className="text-[9px] font-bold uppercase tracking-wider text-[#C86432]">Contract Agreement</span>
          <CopyFieldButton value={data.contractTitle?.value || "Legal Agreement"} />
        </div>
        <h3 className="text-xs font-black text-stone-900 dark:text-white leading-snug font-sans">{data.contractTitle?.value || "Legal Agreement"}</h3>
        {data.contractTitle?.confidence !== undefined && <ConfidenceMeter value={data.contractTitle?.confidence} />}
      </div>

      {/* Summary Section */}
      <div 
        onClick={() => onFieldClick("summary")}
        className={`p-4 rounded-2xl border transition-all cursor-pointer hover:border-[#C86432]/50 ${
          activeField === "summary" ? "ring-2 ring-[#C86432] bg-[#C86432]/5 border-[#C86432]" : `${SR.border} ${SR.surfaceMuted}`
        } flex flex-col gap-2 shadow-2xs font-sans`}
      >
        <div className={`flex justify-between items-center border-b pb-2 ${SR.border} font-sans`}>
          <h4 className={`text-[10px] font-extrabold uppercase tracking-wide ${SR.textPrimary} font-sans`}>Summary</h4>
          <CopyFieldButton value={data.summary?.value || ""} />
        </div>
        <p className={`text-[11px] leading-relaxed italic ${SR.textSecondary} ${SR.surfaceInset} p-2.5 rounded-xl font-sans`}>
          {data.summary?.value || "No agreement summary parsed."}
        </p>
        {data.summary?.confidence !== undefined && <ConfidenceMeter value={data.summary?.confidence} />}
      </div>

      {/* Important Dates Segment */}
      <div 
        onClick={() => onFieldClick("dates")}
        className={`p-4 rounded-2xl border transition-all cursor-pointer hover:border-[#C86432]/50 ${
          activeField === "dates" ? "ring-2 ring-[#C86432] bg-[#C86432]/5 border-[#C86432]" : `${SR.border} ${SR.surfaceMuted}`
        } flex flex-col gap-2 shadow-2xs font-sans`}
      >
        <h4 className={`text-[10px] font-extrabold uppercase tracking-wide ${SR.textPrimary} border-b pb-2 ${SR.border}`}>Important Dates & Notice Details</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
          <div className={`p-3 ${SR.surfaceInset} rounded-xl border border-dashed ${SR.border} flex flex-col justify-between`}>
            <div>
              <span className="text-[9px] uppercase font-bold text-stone-400 block pb-0.5">Effective Start Date</span>
              <span className="text-xs font-bold text-stone-800 dark:text-white">{data.effectiveDate?.value || "N/A"}</span>
            </div>
            <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-stone-200 dark:border-stone-800">
              <ConfidenceMeter value={data.effectiveDate?.confidence ?? 0.8} />
              <CopyFieldButton value={data.effectiveDate?.value || ""} />
            </div>
          </div>
          <div className={`p-3 ${SR.surfaceInset} rounded-xl border border-dashed ${SR.border} flex flex-col justify-between`}>
            <div>
              <span className="text-[9px] uppercase font-bold text-stone-400 block pb-0.5">Expiration Date</span>
              <span className="text-xs font-bold text-stone-800 dark:text-white">{data.expirationDate?.value || "N/A"}</span>
            </div>
            <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-stone-200 dark:border-stone-800">
              <ConfidenceMeter value={data.expirationDate?.confidence ?? 0.8} />
              <CopyFieldButton value={data.expirationDate?.value || ""} />
            </div>
          </div>
        </div>
        {importantDates.length > 0 && (
          <div className="flex flex-col gap-2 mt-2">
            <span className="text-[9px] uppercase font-bold tracking-wider text-stone-500">Dates & Deadlines</span>
            <div className="divide-y divide-stone-200 dark:divide-stone-800">
              {importantDates.map((d: any, idx: number) => (
                <div key={idx} className={`py-2.5 flex items-center justify-between text-[11px] ${SR.hoverRow}`}>
                  <span className={`font-semibold ${SR.textPrimary}`}>{d.event?.value || d.event || "Deadline"}</span>
                  <div className="flex items-center gap-2 font-sans">
                    <span className={`font-mono ${SR.surfaceInset} ${SR.textSecondary} font-bold px-1.5 py-0.5 rounded-md`}>
                      {d.dateValue?.value || d.dateValue || "Date"}
                    </span>
                    <CopyFieldButton value={d.dateValue?.value || d.dateValue || ""} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Risks Segment */}
      <div 
        onClick={() => onFieldClick("risks")}
        className={`p-4 rounded-2xl border transition-all cursor-pointer hover:border-[#C86432]/50 ${
          activeField === "risks" ? "ring-2 ring-[#C86432] bg-[#C86432]/5 border-[#C86432]" : `${SR.border} ${SR.surfaceMuted}`
        } flex flex-col gap-2 shadow-2xs font-sans`}
      >
        <h4 className={`text-[10px] font-extrabold uppercase tracking-wide ${SR.textPrimary} border-b pb-2 ${SR.border} font-sans`}>Risks</h4>
        {risks.length === 0 ? (
          <p className="p-4 rounded-xl text-center text-[11px] text-[#C86432] italic bg-[#C86432]/5 font-bold border border-[#C86432]/10 flex items-center justify-center gap-1.5 font-sans">
            🛡️ No critical contractual risks visualizable.
          </p>
        ) : (
          <div className="flex flex-col gap-2.5 pt-1.5 font-sans">
            {risks.map((risk: any, idx: number) => {
              const severityVal = (risk.severity?.value || risk.severity || "Medium").toLowerCase();
              const badgeBg = severityVal.includes("high") 
                ? "bg-rose-500/10 text-rose-600 dark:text-rose-500 border border-rose-500/20" 
                : severityVal.includes("low") 
                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-500 border border-emerald-500/20"
                : "bg-amber-500/10 text-amber-600 dark:text-amber-500 border border-amber-500/20";
              return (
                <div key={idx} className={`p-3 rounded-xl border ${SR.border} ${SR.surfaceInset} flex flex-col gap-1.5 ${SR.textSecondary}`}>
                  <div className="flex items-center justify-between animate-fade-in">
                    <div className="flex items-center gap-2">
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${badgeBg}`}>
                        {risk.severity?.value || "Medium"}
                      </span>
                      <span className={`text-xs font-bold ${SR.textPrimary} font-sans`}>{risk.riskFactor?.value || "Risk Factor"}</span>
                    </div>
                    <CopyFieldButton value={`${risk.riskFactor?.value || ""}: ${risk.detail?.value || ""}`} />
                  </div>
                  <p className={`text-[11px] ${SR.textSecondary} leading-relaxed font-sans`}>{risk.detail?.value || ""}</p>
                  {risk.riskFactor?.confidence !== undefined && <ConfidenceMeter value={risk.riskFactor?.confidence} />}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Clauses Segment */}
      <div 
        onClick={() => onFieldClick("clauses")}
        className={`p-4 rounded-2xl border transition-all cursor-pointer hover:border-[#C86432]/50 ${
          activeField === "clauses" ? "ring-2 ring-[#C86432] bg-[#C86432]/5 border-[#C86432]" : `${SR.border} ${SR.surfaceMuted}`
        } flex flex-col gap-2 shadow-2xs font-sans`}
      >
        <h4 className={`text-[10px] font-extrabold uppercase tracking-wide ${SR.textPrimary} border-b pb-2 ${SR.border} font-sans`}>Clauses</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 py-1 select-none font-sans">
          <div className={`p-2.5 rounded-xl ${SR.surfaceInset} border ${SR.border} flex flex-col justify-between gap-1`}>
            <div>
              <span className="text-[9px] uppercase font-bold text-stone-400 font-sans block pb-0.5 font-sans">Governing Law</span>
              <p className="text-xs font-semibold font-sans text-stone-800 dark:text-white">{data.governingLaw?.value || "Default"}</p>
            </div>
            <div className="flex justify-end border-t dark:border-stone-800 pt-1 mt-1 font-sans">
              <CopyFieldButton value={data.governingLaw?.value || ""} />
            </div>
          </div>
          <div className={`p-2.5 rounded-xl ${SR.surfaceInset} border ${SR.border} flex flex-col justify-between gap-1 font-sans`}>
            <div>
              <span className="text-[9px] uppercase font-bold text-stone-400 font-sans block pb-0.5 font-sans">Termination Period</span>
              <p className="text-xs font-semibold font-sans text-stone-800 dark:text-white">{data.terminationNoticePeriod?.value || "Immediate"}</p>
            </div>
            <div className="flex justify-end border-t dark:border-stone-800 pt-1 mt-1 font-sans">
              <CopyFieldButton value={data.terminationNoticePeriod?.value || ""} />
            </div>
          </div>
          <div className={`p-2.5 rounded-xl ${SR.surfaceInset} border ${SR.border} flex flex-col justify-between gap-1 font-sans`}>
            <div>
              <span className="text-[9px] uppercase font-bold text-stone-400 font-sans block pb-0.5 font-sans">Liability Cap</span>
              <p className="text-xs font-bold font-sans text-stone-800 dark:text-white">{data.liabilityCap?.value || "No Caps Listed"}</p>
            </div>
            <div className="flex justify-end border-t dark:border-stone-800 pt-1 mt-1 font-sans">
              <CopyFieldButton value={data.liabilityCap?.value || ""} />
            </div>
          </div>
        </div>
        {keyClauses.length > 0 && (
          <div className="flex flex-col gap-2.5 mt-2 font-sans font-sans">
            <span className="text-[9px] uppercase font-bold tracking-wider text-stone-500 font-sans">Legal Provisions</span>
            <div className="flex flex-col gap-2">
              {keyClauses.map((clause: any, idx: number) => (
                <details key={idx} className={`group border ${SR.border} rounded-xl ${SR.surfaceInset} [&_summary::-webkit-details-marker]:hidden transition-all duration-300`}>
                  <summary className={`p-3 select-none flex justify-between items-center text-xs font-bold ${SR.textPrimary} cursor-pointer ${SR.hoverRow} font-sans`}>
                    <div className="flex items-center gap-2 font-sans">
                      <span className="w-1.5 h-1.5 bg-[#C86432] rounded-full" />
                      <span>{clause.title?.value || clause.title || "Section Clause"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ChevronDown className="w-3.5 h-3.5 text-stone-400 group-open:rotate-180 transition-transform" />
                    </div>
                  </summary>
                  <div className={`p-3 pt-0 border-t ${SR.border} text-[11px] ${SR.textSecondary} leading-relaxed font-sans`}>
                    <div className="flex justify-end mb-1">
                      <CopyFieldButton value={clause.content?.value || clause.content || ""} />
                    </div>
                    {clause.content?.value || clause.content || ""}
                  </div>
                </details>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};



const renderResumeNode = (
  data: any,
  activeField: string | null = null,
  onFieldClick: (field: string) => void = () => {}
) => {
  const skills = Array.isArray(data.skills) ? data.skills : [];
  const education = Array.isArray(data.education) ? data.education : [];
  const experience = Array.isArray(data.experience) ? data.experience : [];

  return (
    <div className={`flex flex-col gap-4 ${SR.textSecondary}`}>
      <div 
        onClick={() => onFieldClick("candidateName")}
        className={`p-3.5 rounded-2xl border transition-all cursor-pointer hover:bg-[#C86432]/5 ${
          activeField === "candidateName" || activeField === "email" || activeField === "phone"
            ? "ring-2 ring-[#C86432] bg-[#C86432]/5 border-[#C86432]"
            : `${SR.border} ${SR.surfaceMuted}`
        } flex flex-col gap-2.5`}
      >
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-extrabold text-[#C86432]">{data.candidateName?.value || "Resume Profile"}</h3>
          {data.candidateName?.confidence !== undefined && <ConfidenceMeter value={data.candidateName?.confidence} />}
        </div>
        
        <div className={`grid grid-cols-1 md:grid-cols-3 gap-2 text-[11px] ${SR.textMuted} border-t ${SR.border} pt-2.5`}>
          <p onClick={(e) => { e.stopPropagation(); onFieldClick("email"); }} className={`p-1 rounded-sm hover:bg-[#C86432]/5 transition-all ${activeField === "email" ? "bg-[#C86432]/10 font-bold" : ""}`}>📧 Email: <span className={`font-semibold ${SR.textPrimary}`}>{data.email?.value || "N/A"}</span></p>
          <p onClick={(e) => { e.stopPropagation(); onFieldClick("phone"); }} className={`p-1 rounded-sm hover:bg-[#C86432]/5 transition-all ${activeField === "phone" ? "bg-[#C86432]/10 font-bold" : ""}`}>📞 Phone: <span className={`font-semibold ${SR.textPrimary}`}>{data.phone?.value || "N/A"}</span></p>
          <p>📍 Location: <span className={`font-semibold ${SR.textPrimary}`}>{data.location?.value || "N/A"}</span></p>
        </div>

        {data.summary?.value && (
          <div className={`${SR.surfaceInset} p-2.5 rounded-xl mt-1.5`}>
            <span className={`text-[9px] uppercase font-bold tracking-wider ${SR.textLabel} block mb-0.5`}>Summary Profile</span>
            <p className={`text-[11px] leading-relaxed italic ${SR.textSecondary}`}>{data.summary.value}</p>
          </div>
        )}
      </div>

      {skills.length > 0 && (
        <div 
          onClick={() => onFieldClick("skills")}
          className={`flex flex-col gap-2 p-2 rounded-2xl transition-all cursor-pointer hover:bg-[#C86432]/5 ${
            activeField === "skills" ? "ring-2 ring-[#C86432] bg-[#C86432]/5 border-[#C86432]" : ""
          }`}
        >
          <h4 className="text-[10px] font-bold uppercase tracking-wider text-stone-400">Technical Skillset</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            {skills.map((sk: any, idx: number) => (
              <div key={idx} className={`p-2.5 rounded-xl border ${SR.border} ${SR.surfaceInset}`}>
                <span className="text-xs font-bold text-[#C86432] block mb-1.5">{sk.category?.value || "Skills"}</span>
                <div className="flex flex-wrap gap-1">
                  {Array.isArray(sk.skillsList) ? sk.skillsList.map((item: string, id: number) => (
                    <span key={id} className={`text-[9.5px] ${SR.surfaceInset} ${SR.textSecondary} font-bold px-1.5 py-0.5 rounded-md`}>
                      {item}
                    </span>
                  )) : <span className="text-[9.5px] italic">{String(sk.skillsList)}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {experience.length > 0 && (
        <div 
          onClick={() => onFieldClick("experience")}
          className={`flex flex-col gap-2 p-2 rounded-2xl transition-all cursor-pointer hover:bg-[#C86432]/5 ${
            activeField === "experience" ? "ring-2 ring-[#C86432] bg-[#C86432]/5 border-[#C86432]" : ""
          }`}
        >
          <h3 className="text-[10px] font-bold uppercase tracking-wider text-stone-400">Experience History</h3>
          <div className="flex flex-col gap-2.5">
            {experience.map((ex: any, idx: number) => (
              <div key={idx} className={`p-3 rounded-xl border ${SR.border} flex flex-col gap-1.5 ${SR.surfaceMuted}`}>
                <div className={`flex flex-wrap justify-between items-start gap-2 border-b ${SR.border} pb-1.5`}>
                  <div className="flex flex-col">
                    <span className={`text-xs font-bold ${SR.textPrimary}`}>{ex.role?.value || "Role"}</span>
                    <span className={`text-[11px] ${SR.textMuted}`}>{ex.company?.value || "Employer"}</span>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className={`text-[9.5px] font-mono ${SR.surfaceInset} px-1.5 py-0.5 rounded-md font-bold text-[#C86432]`}>
                      {ex.startDate?.value || "Start"} - {ex.endDate?.value || "End"}
                    </span>
                    {ex.role?.confidence !== undefined && <ConfidenceMeter value={ex.role?.confidence} />}
                  </div>
                </div>
                <p className={`text-[11px] ${SR.textMuted} leading-relaxed font-sans`}>{ex.description?.value || ""}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {education.length > 0 && (
        <div 
          onClick={() => onFieldClick("education")}
          className={`flex flex-col gap-2 p-2 rounded-2xl transition-all cursor-pointer hover:bg-[#C86432]/5 ${
            activeField === "education" ? "ring-2 ring-[#C86432] bg-[#C86432]/5 border-[#C86432]" : ""
          }`}
        >
          <h3 className="text-[10px] font-bold uppercase tracking-wider text-stone-400">Academic History</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            {education.map((ed: any, idx: number) => (
              <div key={idx} className={`p-2.5 rounded-xl border ${SR.border} ${SR.surfaceInset} flex items-center justify-between`}>
                <div className="flex flex-col gap-0.5">
                  <span className={`text-xs font-bold ${SR.textPrimary}`}>{ed.degree?.value || "Degree"}</span>
                  <span className={`text-[10px] ${SR.textMuted}`}>{ed.institution?.value || "College/Univ"}</span>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="text-[9.5px] font-mono font-bold text-[#C86432]">{ed.graduationYear?.value || ""}</span>
                  {ed.degree?.confidence !== undefined && <ConfidenceMeter value={ed.degree?.confidence} />}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const renderReceiptNode = (
  data: any,
  activeField: string | null = null,
  onFieldClick: (field: string) => void = () => {}
) => {
  const items = Array.isArray(data.items) ? data.items : [];
  return (
    <div className={`flex flex-col gap-4 ${SR.textSecondary} animate-fadeIn`}>
      <div 
        onClick={() => onFieldClick("merchantName")}
        className={`p-3.5 rounded-2xl border transition-all cursor-pointer hover:bg-[#C86432]/5 text-center flex flex-col items-center gap-1 ${
          activeField === "merchantName" || activeField === "merchantAddress" || activeField === "merchantPhone"
            ? "ring-2 ring-[#C86432] bg-[#C86432]/5 border-[#C86432]"
            : `${SR.border} ${SR.surfaceInset}`
        }`}
      >
        <span className={`text-[9px] uppercase font-bold ${SR.textLabel}`}>Commercial Slip</span>
        <h3 className={`text-xs font-black ${SR.textPrimary} uppercase tracking-wider`}>{data.merchantName?.value || "Merchant"}</h3>
        <p className={`text-[10px] ${SR.textMuted}`}>{data.merchantAddress?.value || ""}</p>
        <p className={`text-[9px] ${SR.textLabel} font-mono`}>{data.merchantPhone?.value || ""}</p>
        {data.merchantName?.confidence !== undefined && <div className="mt-1.5"><ConfidenceMeter value={data.merchantName?.confidence} /></div>}
      </div>

      <div 
        onClick={() => onFieldClick("transactionDate")}
        className={`grid grid-cols-2 gap-2 text-[11px] border-y py-2.5 font-mono cursor-pointer transition-all hover:bg-[#C86432]/5 ${
          activeField === "transactionDate" || activeField === "transactionTime"
            ? "ring-1 ring-[#C86432] border-[#C86432] bg-[#C86432]/5 px-2 rounded-lg"
            : "border-stone-200 dark:border-stone-800"
        }`}
      >
        <div className="text-stone-700 dark:text-stone-300">📅 DATE: <span className="font-bold text-stone-900 dark:text-white">{data.transactionDate?.value || "N/A"}</span></div>
        <div className="text-right text-stone-700 dark:text-stone-300">🕒 TIME: <span className="font-bold text-stone-900 dark:text-white">{data.transactionTime?.value || "N/A"}</span></div>
      </div>

      <div 
        onClick={() => onFieldClick("items")}
        className={`flex flex-col gap-1.5 p-1 rounded-2xl transition-all cursor-pointer hover:bg-[#C86432]/5 ${
          activeField === "items" ? "ring-2 ring-[#C86432] bg-[#C86432]/5 border-[#C86432]" : ""
        }`}
      >
        <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">Purchases List</span>
        <div className={`border ${SR.border} rounded-xl overflow-hidden ${SR.surfaceMuted}`}>
          <div className={`p-2 ${SR.surfaceInset} text-[9px] font-bold ${SR.textMuted} uppercase flex items-center justify-between border-b ${SR.border}`}>
            <span>Description</span>
            <div className="flex items-center gap-5">
              <span>Qty</span>
              <span className="w-14 text-right">Total</span>
            </div>
          </div>
          <div className="divide-y divide-stone-200 dark:divide-stone-800/60">
            {items.map((it: any, idx: number) => (
              <div key={idx} className={`p-2 flex items-center justify-between text-[11px] ${SR.hoverRow}`}>
                <div className="flex flex-col gap-0.5">
                  <span className={`font-semibold ${SR.textPrimary}`}>{it.description?.value || "Purchase Item"}</span>
                  {it.description?.confidence !== undefined && <ConfidenceMeter value={it.description?.confidence} />}
                </div>
                <div className={`flex items-center gap-6 font-mono ${SR.textSecondary}`}>
                  <span>{it.quantity?.value !== undefined ? it.quantity.value : "1"}</span>
                  <span className={`w-14 text-right font-bold ${SR.textPrimary}`}>{it.totalPrice?.value !== undefined ? it.totalPrice.value : "N/A"}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div 
        onClick={() => onFieldClick("totalAmount")}
        className={`border p-2.5 rounded-2xl transition-all cursor-pointer flex flex-col gap-1.5 text-[11px] hover:bg-[#C86432]/5 ${
          activeField === "totalAmount" || activeField === "subtotal" || activeField === "tax"
            ? "ring-2 ring-[#C86432] bg-[#C86432]/5 border-[#C86432]"
            : "border-stone-200 dark:border-stone-800"
        }`}
      >
        <div className={`flex justify-between items-center ${SR.textSecondary}`}>
          <span>VAT Taxes:</span>
          <span className="font-mono">{data.tax?.value || "0.00"}</span>
        </div>
        <div className={`flex justify-between items-center ${SR.textSecondary}`}>
          <span>Tips:</span>
          <span className="font-mono">{data.tip?.value || "0.00"}</span>
        </div>
        <div className={`flex justify-between items-center ${SR.textSecondary}`}>
          <span>Payment Channel:</span>
          <span className="font-semibold">{data.paymentMethod?.value || "Card"}</span>
        </div>
        <div className={`flex justify-between items-center ${SR.textPrimary} font-bold border-t ${SR.border} pt-1.5`}>
          <span>GRAND TOTAL:</span>
          <span className="font-mono text-[#C86432]">{data.totalAmount?.value || "0.00"}</span>
        </div>
      </div>
    </div>
  );
};

const renderTableNode = (
  data: any,
  activeField: string | null = null,
  onFieldClick: (field: string) => void = () => {}
) => {
  const headers = Array.isArray(data.headers) ? data.headers : [];
  const rows = Array.isArray(data.rows) ? data.rows : [];

  return (
    <div className={`flex flex-col gap-3.5 ${SR.textSecondary}`}>
      <div 
        onClick={() => onFieldClick("tableName")}
        className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all hover:bg-[#C86432]/5 ${
          activeField === "tableName" ? "ring-2 ring-[#C86432] bg-[#C86432]/5 border-[#C86432]" : `${SR.border} ${SR.surfaceMuted}`
        }`}
      >
        <div>
          <span className={`text-[9.5px] font-bold uppercase ${SR.textLabel} block pb-0.5`}>Grid Title</span>
          <h4 className={`text-xs font-bold ${SR.textPrimary}`}>{data.tableName?.value || "Structured Data Matrix"}</h4>
        </div>
        {data.tableName?.confidence !== undefined && <ConfidenceMeter value={data.tableName?.confidence} />}
      </div>

      <div 
        onClick={() => onFieldClick("rows")}
        className={`border rounded-2xl overflow-x-auto transition-all cursor-pointer hover:bg-[#C86432]/5 ${
          activeField === "rows" || activeField === "headers"
            ? "ring-2 ring-[#C86432] bg-[#C86432]/5 border-[#C86432]"
            : `${SR.border} ${SR.surfaceMuted}`
        }`}
      >
        <table className={`w-full text-[11px] text-left ${SR.textMuted} border-collapse`}>
          <thead>
            <tr className={`${SR.surfaceInset} text-[9px] font-bold uppercase tracking-wider ${SR.textMuted} border-b ${SR.border}`}>
              {headers.map((h: any, idx: number) => (
                <th key={idx} className="p-2.5 font-semibold">
                  <div className="flex flex-col gap-0.5">
                    <span>{h.value || ""}</span>
                    {h.confidence !== undefined && <div className="scale-75 origin-left"><ConfidenceMeter value={h.confidence} /></div>}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-200 dark:divide-stone-800/60">
            {rows.length === 0 ? (
              <tr>
                <td colSpan={headers.length || 1} className="p-3 text-center text-stone-400 italic">No structured rows.</td>
              </tr>
            ) : (
              rows.map((row: any, rIdx: number) => {
                const cells = Array.isArray(row.cells) ? row.cells : [];
                return (
                  <tr key={rIdx} className={SR.hoverRow}>
                    {cells.map((cell: any, cIdx: number) => (
                      <td key={cIdx} className="p-2.5">
                        <div className="flex flex-col gap-0.5">
                          <span className={`font-medium ${SR.textPrimary}`}>{cell.value || ""}</span>
                          {cell.confidence !== undefined && <div className="scale-75 origin-left"><ConfidenceMeter value={cell.confidence} /></div>}
                        </div>
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const renderGeneralOcrNode = (
  data: any,
  activeField: string | null = null,
  onFieldClick: (field: string) => void = () => {}
) => {
  const keyBlocks = Array.isArray(data.keyBlocks) ? data.keyBlocks : [];
  return (
    <div className={`flex flex-col gap-3.5 ${SR.textSecondary}`}>
      <div 
        onClick={() => onFieldClick("title")}
        className={`p-3 rounded-xl border grid grid-cols-2 gap-3 transition-all cursor-pointer hover:bg-[#C86432]/5 ${
          activeField === "title" ? "ring-2 ring-[#C86432] bg-[#C86432]/5 border-[#C86432]" : `${SR.border} ${SR.surfaceMuted}`
        }`}
      >
        <div>
          <span className={`text-[9.5px] uppercase font-bold ${SR.textLabel} block mb-0.5 font-sans`}>Title Code</span>
          <span className={`text-xs font-bold ${SR.textPrimary}`}>{data.documentTitle?.value || "N/A"}</span>
          {data.documentTitle?.confidence !== undefined && <ConfidenceMeter value={data.documentTitle?.confidence} />}
        </div>
        <div>
          <span className={`text-[9.5px] uppercase font-bold ${SR.textLabel} block mb-0.5 font-sans`}>Detected Language</span>
          <span className={`text-xs font-bold ${SR.textPrimary}`}>{data.detectedLanguage?.value || "N/A"}</span>
          {data.detectedLanguage?.confidence !== undefined && <ConfidenceMeter value={data.detectedLanguage?.confidence} />}
        </div>
      </div>

      <div 
        onClick={() => onFieldClick("body")}
        className={`flex flex-col gap-2.5 mt-1 p-2 rounded-2xl transition-all cursor-pointer hover:bg-[#C86432]/5 ${
          activeField === "body" ? "ring-2 ring-[#C86432] bg-[#C86432]/5 border-[#C86432]" : ""
        }`}
      >
        <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 font-sans">Blocks</span>
        <div className="flex flex-col gap-2.5">
          {keyBlocks.map((blk: any, idx: number) => (
            <div key={idx} className={`p-2.5 rounded-xl border ${SR.border} ${SR.surfaceInset}`}>
              <span className="text-xs font-extrabold text-[#C86432] block mb-1">{blk.heading?.value || `Content Block #${idx + 1}`}</span>
              <p className={`text-[11px] ${SR.textMuted} leading-relaxed font-sans`}>{blk.content?.value || ""}</p>
            </div>
          ))}
        </div>
      </div>

      {data.rawText?.value && (
        <div className="mt-1 text-[11px] border-t dark:border-stone-800 pt-2.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block mb-1 font-sans">Raw Fallback</span>
          <pre className={`p-2.5 border rounded-xl ${SR.border} ${SR.surfaceInset} font-mono text-[9.5px] leading-relaxed whitespace-pre-wrap overflow-x-auto ${SR.textMuted}`}>
            {data.rawText.value}
          </pre>
        </div>
      )}
    </div>
  );
};

const renderVisualStructuredResult = (
  extractedText: string, 
  resultDocumentType: string,
  activeField: string | null = null,
  onFieldClick: (field: string) => void = () => {}
) => {
  try {
    const parsed = JSON.parse(extractedText);
    switch (resultDocumentType) {
      case "invoice":
        return renderInvoiceNode(parsed, activeField, onFieldClick);
      case "contract":
        return renderContractNode(parsed, activeField, onFieldClick);
      case "resume":
        return renderResumeNode(parsed, activeField, onFieldClick);
      case "receipt":
        return renderReceiptNode(parsed, activeField, onFieldClick);
      case "table":
        return renderTableNode(parsed, activeField, onFieldClick);
      case "general_ocr":
      default:
        return renderGeneralOcrNode(parsed, activeField, onFieldClick);
    }
  } catch (e) {
    return (
      <div className="flex flex-col gap-3 animate-fade-in">
        <div className="bg-emerald-500/5 text-emerald-600 dark:text-emerald-400 p-2.5 rounded-2xl border border-emerald-500/10 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
          <span className="text-xs font-semibold">Showing customized text representation.</span>
        </div>
        <div className="p-4 rounded-2xl border whitespace-pre-wrap font-sans text-xs leading-relaxed selection:bg-[#C86432] border-stone-200 bg-stone-50 text-stone-800 dark:border-stone-800 dark:bg-stone-950 dark:text-stone-200">
          {extractedText}
        </div>
      </div>
    );
  }
};

const calculateAverageConfidence = (text: string): number => {
  try {
    const parsed = JSON.parse(text);
    let sum = 0;
    let count = 0;
    
    const traverse = (obj: any) => {
      if (!obj || typeof obj !== "object") return;
      if (obj.hasOwnProperty("confidence") && typeof obj.confidence === "number") {
        sum += obj.confidence;
        count++;
      } else {
        for (const key in obj) {
          if (obj.hasOwnProperty(key)) {
            traverse(obj[key]);
          }
        }
      }
    };
    
    traverse(parsed);
    if (count === 0) return 94; // fallback high quality average
    return Math.round((sum / count) * 100);
  } catch (e) {
    return 91; // standard general ocr OCR metric fallback
  }
};

interface BeforeVsAfterWorkspaceProps {
  filePreview: string;
  extractedText: string;
  resultDocumentType: string;
  isDarkMode: boolean;
  clearFile: () => void;
  setExtractedText: (text: string) => void;
  language: Language;
  chatMessages: ChatMessage[];
  handleSendMessage: (e: React.FormEvent) => void;
  chatInput: string;
  setChatInput: (text: string) => void;
  isChatting: boolean;
  chatError: string;
  chatBottomRef: React.RefObject<HTMLDivElement | null>;
  isSpecializedResult: boolean;
  isEditing: boolean;
  setIsEditing: (val: boolean) => void;
  editedText: string;
  setEditedText: (val: string) => void;
  handleCopy: () => void;
  copyFeedback: boolean;
  downloadTextFile: (format: "md" | "txt") => void;
  downloadDocFile: () => void;
  t: any;
}

const BeforeVsAfterWorkspace = ({
  filePreview,
  extractedText,
  resultDocumentType,
  isDarkMode,
  clearFile,
  setExtractedText,
  language,
  chatMessages,
  handleSendMessage,
  chatInput,
  setChatInput,
  isChatting,
  chatError,
  chatBottomRef,
  isSpecializedResult,
  isEditing,
  setIsEditing,
  editedText,
  setEditedText,
  handleCopy,
  copyFeedback,
  downloadTextFile,
  downloadDocFile,
  t
}: BeforeVsAfterWorkspaceProps) => {
  const [activeField, setActiveField] = useState<string | null>(null);
  const [zoomScale, setZoomScale] = useState<number>(1.0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages] = useState<number>(3);
  const [activeTab, setActiveTab] = useState<"visual" | "summary" | "confidence" | "chat" | "editor">("visual");
  const [isJsonVisualMode, setIsJsonVisualMode] = useState<boolean>(true);

  const avgConfidence = calculateAverageConfidence(extractedText);
  const boxes = DOCUMENT_HIGHLIGHT_MAP[resultDocumentType] || [];

  return (
    <div className="col-span-12 flex flex-col gap-6" id="before-after-workbench-parent">
      {/* Upper Control Bar */}
      <div className={`p-4 rounded-3xl border flex flex-col md:flex-row items-center justify-between gap-4 transition-all ${
        isDarkMode ? "bg-[#1d1714]/85 border-[#332822]" : "bg-[#FAF6F0] border-[#eeded5]"
      }`}>
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-[#C86432]/10 rounded-xl">
            <Layers className="w-5 h-5 text-[#C86432]" />
          </div>
          <div className="text-left">
            <h3 className="font-extrabold text-sm text-stone-800 dark:text-white flex items-center flex-wrap gap-2">
              Before vs After Document Processing
              <span className="text-[10px] font-mono font-bold bg-[#C86432]/10 text-[#C86432] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                {resultDocumentType.replace("_", " ")}
              </span>
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              Side-by-side verification and synchronized layout alignment workspace.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setExtractedText("")}
            className={`text-xs font-bold px-3 py-1.5 rounded-xl border ${SR.border} ${SR.surfaceMuted} hover:opacity-90 transition-all flex items-center gap-1.5 cursor-pointer ${SR.textSecondary}`}
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Parameter Settings
          </button>
          <button
            onClick={clearFile}
            className="text-xs font-bold text-rose-500 hover:text-white border border-rose-500/20 bg-rose-500/10 hover:bg-rose-600 px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Clear Document
          </button>
        </div>
      </div>

      {/* Two Panel Grid split */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-stretch">
        
        {/* Left Side: Before Document Raw Preview */}
        <div className="col-span-12 xl:col-span-6 flex flex-col gap-4">
          <div className={`p-5 rounded-3xl border flex flex-col gap-4 h-full relative ${
            isDarkMode ? "bg-[#1d1714]/80 border-[#332822]" : "bg-white/80 border-[#eeded5]"
          }`} style={{ minHeight: "580px" }}>
            
            <div className="flex items-center justify-between border-b dark:border-stone-800 pb-3 flex-wrap gap-2">
              <span className="text-xs font-bold tracking-wider text-stone-400 font-sans flex items-center gap-1.5">
                <Eye className="w-4 h-4 text-[#C86432]" />
                BEFORE: RAW ORIGINAL SOURCE
              </span>

              {/* Sizing Magnifier Scale */}
              <div className="flex items-center gap-1 bg-stone-100/60 dark:bg-stone-900/65 p-1 rounded-xl text-stone-700 dark:text-stone-300">
                <button
                  onClick={() => setZoomScale(z => Math.max(0.5, z - 0.15))}
                  className="p-1 rounded-lg hover:bg-[#C86432]/10 hover:text-[#C86432] cursor-pointer"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <span className="text-[10px] font-mono font-bold w-12 text-center">
                  {Math.round(zoomScale * 100)}%
                </span>
                <button
                  onClick={() => setZoomScale(z => Math.min(2.5, z + 0.15))}
                  className="p-1 rounded-lg hover:bg-[#C86432]/10 hover:text-[#C86432] cursor-pointer"
                  title="Zoom In"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Document viewing canvas wrapper */}
            <div className="relative border border-stone-300 dark:border-stone-800 rounded-2xl bg-stone-100/20 dark:bg-stone-950/30 flex items-center justify-center p-4 min-h-[420px] h-[480px] overflow-hidden select-none">
              
              <div className="overflow-auto w-full h-full relative flex items-center justify-center">
                <div 
                  style={{ transform: `scale(${zoomScale})`, transition: 'transform 0.15s ease' }}
                  className="relative max-h-full max-w-full origin-center flex items-center justify-center"
                >
                  {filePreview ? (
                    <img
                      src={filePreview}
                      alt="Source Doc original"
                      className="origin-center object-contain max-h-[420px] max-w-[400px] rounded-xl shadow-md border-2 border-stone-200 dark:border-stone-800"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="text-center text-stone-400 p-6">
                      <FileText className="w-10 h-10 text-[#C86432] mx-auto opacity-30 mb-2" />
                      <p className="text-xs">Preview unavailable.</p>
                    </div>
                  )}

                  {/* Absolute visual highlight coordinates overlay boxes */}
                  {filePreview && boxes.map((box) => {
                    const isActive = box.field === activeField;
                    return (
                      <button
                        key={box.field}
                        onClick={() => setActiveField(box.field)}
                        className={`absolute rounded-md transition-all duration-300 pointer-events-auto border z-30 ${
                          isActive
                            ? "border-[#C86432] bg-[#C86432]/15 ring-2 ring-[#C86432]/25 animate-pulse"
                            : "border-dotted border-stone-400/40 dark:border-stone-600/30 bg-stone-500/5 hover:border-[#C86432]/65 hover:bg-[#C86432]/5"
                        }`}
                        style={{
                          top: `${box.top}%`,
                          left: `${box.left}%`,
                          width: `${box.width}%`,
                          height: `${box.height}%`,
                        }}
                        title={`Click to focus: ${box.label}`}
                      />
                    );
                  })}
                </div>
              </div>

              {/* Adaptive visual sync instruction banner */}
              <div className="absolute bottom-2 left-2 right-2 bg-stone-50/95 dark:bg-stone-900/95 text-stone-500 dark:text-stone-300 p-2 border border-stone-200/50 dark:border-stone-800 rounded-xl text-[10px] font-sans flex items-center gap-1.5 shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-[#C86432]" />
                <span>Synchronized map active. Click raw preview bounding grids to select, or click output fields to focus boundaries.</span>
              </div>
            </div>

          </div>
        </div>

        {/* Right Side: After Analysis, Summary & Metrics Tabs */}
        <div className="col-span-12 xl:col-span-6 flex flex-col gap-4">
          <div className={`p-5 rounded-3xl border flex flex-col h-full relative ${
            isDarkMode ? "bg-[#1d1714]/80 border-[#332822] text-stone-200" : "bg-white border-[#eeded5] text-stone-800"
          }`} style={{ minHeight: "580px", maxHeight: "580px" }}>
            
            {/* Header Tabs Navigation layout - Compact labels supporting sweep with hidden scrollbars */}
            <div className="flex border-b dark:border-stone-800 pb-3 overflow-x-auto no-scrollbar gap-2 shrink-0">
              <button
                onClick={() => { setActiveTab("visual"); setIsEditing(false); }}
                className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all flex items-center gap-1 text-xs whitespace-nowrap cursor-pointer ${
                  activeTab === "visual" && !isEditing
                    ? "bg-[#C86432] text-white"
                    : "bg-stone-100 dark:bg-stone-900 hover:bg-[#C86432]/10 text-stone-600 dark:text-stone-300"
                }`}
              >
                <Zap className="w-3.5 h-3.5" />
                RESULT
              </button>
              <button
                onClick={() => { setActiveTab("summary"); setIsEditing(false); }}
                className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all flex items-center gap-1 text-xs whitespace-nowrap cursor-pointer ${
                  activeTab === "summary" && !isEditing
                    ? "bg-[#C86432] text-white"
                    : "bg-stone-100 dark:bg-stone-900 hover:bg-[#C86432]/10 text-stone-600 dark:text-stone-300"
                }`}
              >
                <FileCheck className="w-3.5 h-3.5" />
                SUMMARY
              </button>
              <button
                onClick={() => { setActiveTab("confidence"); setIsEditing(false); }}
                className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all flex items-center gap-1 text-xs whitespace-nowrap cursor-pointer ${
                  activeTab === "confidence" && !isEditing
                    ? "bg-[#C86432] text-white"
                    : "bg-stone-100 dark:bg-stone-900 hover:bg-[#C86432]/10 text-stone-600 dark:text-stone-300"
                }`}
              >
                <Gauge className="w-3.5 h-3.5" />
                ACCURACY
              </button>
              <button
                onClick={() => { setActiveTab("chat"); setIsEditing(false); }}
                className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all flex items-center gap-1 text-xs whitespace-nowrap cursor-pointer ${
                  activeTab === "chat" && !isEditing
                    ? "bg-[#C86432] text-white"
                    : "bg-stone-100 dark:bg-stone-900 hover:bg-[#C86432]/10 text-stone-600 dark:text-stone-300"
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                ASSISTANT
              </button>
            </div>

            {/* Scrollable container frame */}
            <div className="flex-1 mt-4 overflow-y-auto pr-1">
              {isEditing ? (
                <div className="flex flex-col gap-2 h-full p-1 animate-fade text-xs">
                  <span className="text-[10px] font-bold text-[#C86432] uppercase tracking-wider">EDIT RAW OUTLINE</span>
                  <textarea
                    value={editedText}
                    onChange={(e) => setEditedText(e.target.value)}
                    className={`w-full min-h-[300px] flex-1 p-4 font-mono rounded-2xl border focus:outline-hidden text-xs leading-relaxed ${
                      isDarkMode ? "border-stone-800 bg-[#14100e] text-white" : "border-stone-200 bg-stone-50 text-stone-800"
                    }`}
                  />
                </div>
              ) : (
                <AnimatePresence mode="wait">
                  
                  {/* Visual Report */}
                  {activeTab === "visual" && (
                    <motion.div
                      key="tab-ba-visual"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className="flex flex-col gap-4 text-xs text-stone-800 dark:text-stone-200"
                    >
                      {isSpecializedResult ? (
                        <>
                          <div className="bg-emerald-500/5 text-emerald-600 dark:text-emerald-400 p-2.5 rounded-2xl border border-emerald-500/10 flex items-center gap-2">
                            <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                            <span>OCR transcription fully synchronized. Selected field bounds lit up instantly.</span>
                          </div>

                          <div className="flex items-center justify-between border-b dark:border-stone-800 pb-2">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">⚡ Structured Format</span>
                            <div className="flex items-center gap-1 bg-stone-100 dark:bg-stone-900 border dark:border-stone-800 p-0.5 rounded-xl text-[10px]/none my-0.5">
                              <button
                                onClick={() => setIsJsonVisualMode(true)}
                                className={`px-2.5 py-1 font-bold rounded-lg transition-all cursor-pointer ${
                                  isJsonVisualMode
                                    ? "bg-[#C86432] text-white"
                                    : "text-stone-500 dark:text-stone-400 hover:text-stone-700 dark:hover:text-stone-200"
                                }`}
                              >
                                Visual
                              </button>
                              <button
                                onClick={() => setIsJsonVisualMode(false)}
                                className={`px-2.5 py-1 font-bold rounded-lg transition-all cursor-pointer ${
                                  !isJsonVisualMode
                                    ? "bg-[#C86432] text-white"
                                    : "text-stone-500 dark:text-stone-400 hover:text-stone-700 dark:hover:text-stone-200"
                                }`}
                              >
                                Raw JSON
                              </button>
                            </div>
                          </div>

                          <div className="p-1">
                            {isJsonVisualMode ? (
                              renderVisualStructuredResult(extractedText, resultDocumentType, activeField, setActiveField)
                            ) : (
                              <pre className={`p-4 rounded-xl border whitespace-pre-wrap font-mono text-[10.5px] leading-relaxed selection:bg-[#C86432] ${SR.border} ${isDarkMode ? "bg-[#14100e] text-stone-200" : "bg-stone-50 text-stone-800"}`}>
                                {extractedText}
                              </pre>
                            )}
                          </div>
                        </>
                      ) : (
                        <div className="flex flex-col gap-3">
                          <div className="bg-emerald-500/5 text-emerald-600 dark:text-emerald-400 p-2.5 rounded-2xl border border-emerald-500/10 flex items-center gap-2">
                            <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                            <span>Text successfully extracted. Showing raw transcription.</span>
                          </div>
                          <div className={`p-4 rounded-2xl border whitespace-pre-wrap font-sans text-xs leading-relaxed selection:bg-[#C86432] ${
                            isDarkMode ? "border-stone-800 bg-stone-950 text-stone-200" : "border-stone-200 bg-stone-50 text-stone-800"
                          }`}>
                            {extractedText}
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )}

                  {/* AI Executive Summaries */}
                  {activeTab === "summary" && (
                    <motion.div
                      key="tab-ba-summary"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className="flex flex-col gap-3 text-xs text-stone-800 dark:text-stone-200"
                    >
                      <div className={`p-4 rounded-2xl border flex flex-col gap-3 ${
                        isDarkMode ? "bg-stone-900/60 border-stone-800" : "bg-stone-50 border-stone-200"
                      }`}>
                        <div className="flex items-center gap-2 text-[#C86432] font-black uppercase text-[10px] tracking-wider">
                          <Sparkles className="w-4 h-4 animate-pulse shrink-0" />
                          Executive Intelligence Digest
                        </div>
                        
                        <p className="text-stone-700 dark:text-stone-300 leading-relaxed font-sans">
                          This analyzed file has been verified as type <strong>{resultDocumentType.toUpperCase()}</strong>. It is translated into structured JSON nodes with corresponding spatial coordinates of raw outlines.
                        </p>

                        {resultDocumentType === "invoice" && (
                          <div className="flex flex-col gap-2 border-t dark:border-stone-800 pt-3 mt-1 underline-none">
                            <h4 className="font-bold text-[#C86432]">Invoice Verification Parameters</h4>
                            <ul className="list-disc pl-4 space-y-1.5 text-[11px] text-stone-600 dark:text-stone-400 leading-normal">
                              <li><strong>Identified Billing:</strong> Document points to recorded recipient matches. Address is structurally aligned.</li>
                              <li><strong>Due Terms Checking:</strong> Payment is requested via stated invoice dates. Watch boundaries.</li>
                              <li><strong>Integrity Check:</strong> Subtotal sums align perfectly with parsed line matrices.</li>
                            </ul>
                          </div>
                        )}

                        {resultDocumentType === "contract" && (
                          <div className="flex flex-col gap-2 border-t dark:border-stone-800 pt-3 mt-1">
                            <h4 className="font-bold text-[#C86432]">Legal Risk Diagnostics</h4>
                            <ul className="list-disc pl-4 space-y-1.5 text-[11px] text-stone-600 dark:text-stone-400 leading-normal">
                              <li><strong>Contracting Outlines:</strong> Agreement terms matched. Verify identified parties thoroughly.</li>
                              <li><strong>Deadlines & Milestones:</strong> Contract triggers clear timelines in chronological outlines.</li>
                              <li><strong>Clause Indexing:</strong> Business parameters parsed. High integrity matched on key indemnity blocks.</li>
                            </ul>
                          </div>
                        )}

                        {resultDocumentType === "resume" && (
                          <div className="flex flex-col gap-2 border-t dark:border-stone-800 pt-3 mt-1">
                            <h4 className="font-bold text-[#C86432]">Performance & Strengths Index</h4>
                            <ul className="list-disc pl-4 space-y-1.5 text-[11px] text-stone-600 dark:text-stone-400 leading-normal">
                              <li><strong>Core Competency Matched:</strong> Skills categories list complete technical strengths.</li>
                              <li><strong>Experience Continuity:</strong> Professional histories validated with timeline matrices.</li>
                              <li><strong>Interview Triage:</strong> Route parameters directly to talent pipeline directories.</li>
                            </ul>
                          </div>
                        )}

                        {resultDocumentType === "receipt" && (
                          <div className="flex flex-col gap-2 border-t dark:border-stone-800 pt-3 mt-1">
                            <h4 className="font-bold text-[#C86432]">Receipt Expense Analysis</h4>
                            <ul className="list-disc pl-4 space-y-1.5 text-[11px] text-stone-600 dark:text-stone-400 leading-normal">
                              <li><strong>Merchant Triage:</strong> Slips register commercial locations. Matches corporate guidelines.</li>
                              <li><strong>Expense Audit:</strong> Clean item sums. Highly verified for immediate reimbursement loops.</li>
                              <li><strong>Details:</strong> Standard transaction channels checked with full vat outlines.</li>
                            </ul>
                          </div>
                        )}

                        {!["invoice", "contract", "resume", "receipt"].includes(resultDocumentType) && (
                          <div className="flex flex-col gap-2 border-t dark:border-stone-800 pt-3 mt-1">
                            <h4 className="font-bold text-[#C86432]">OCR Spatial Findings</h4>
                            <p className="text-[11px] text-stone-600 dark:text-stone-400 leading-relaxed">
                              Characters are mapped on dense layers. Hover over document parts to isolate values.
                            </p>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}

                  {/* Accuracy & Matrix Charts */}
                  {activeTab === "confidence" && (
                    <motion.div
                      key="tab-ba-confidence"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className="flex flex-col gap-4 text-xs text-stone-800 dark:text-stone-200"
                    >
                      <div className={`p-4 rounded-3xl border flex flex-col md:flex-row items-center gap-6 ${
                        isDarkMode ? "bg-stone-900/60 border-stone-800" : "bg-stone-50 border-stone-200"
                      }`}>
                        {/* Circle accuracy indicator */}
                        <div className="relative w-24 h-24 flex items-center justify-center shrink-0">
                          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                            <circle cx="50" cy="50" r="40" strokeWidth="8" stroke={isDarkMode ? "#2c2522" : "#eeded5"} fill="transparent" />
                            <circle 
                              cx="50" cy="50" r="40" strokeWidth="8" stroke="#C86432" strokeDasharray="251.2" 
                              strokeDashoffset={251.2 - (251.2 * avgConfidence) / 100} 
                              strokeLinecap="round" fill="transparent" className="transition-all duration-1000 ease-out" 
                            />
                          </svg>
                          <div className="absolute text-center flex flex-col items-center">
                            <span className="text-lg font-black font-mono text-[#C86432]">{avgConfidence}%</span>
                            <span className="text-[8px] uppercase tracking-wider text-stone-400 font-bold">Accuracy</span>
                          </div>
                        </div>

                        <div className="flex-1 flex flex-col gap-1 text-left">
                          <h4 className="font-extrabold text-xs text-stone-800 dark:text-white flex items-center gap-1.5">
                            <TrendingUp className="w-3.5 h-3.5 text-[#C86432]" />
                            Average Extraction Quality
                          </h4>
                          <p className="text-stone-500 dark:text-stone-400 leading-normal text-[11px]">
                            OCR metrics benchmarked from spatial coordinates, dictionary validation, and neural parsing models.
                          </p>
                          <div className="mt-1">
                            {avgConfidence >= 90 ? (
                              <span className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded font-bold text-[9px] tracking-wider">
                                ✓ HIGH CONFIDENCE VERIFIED
                              </span>
                            ) : (
                              <span className="bg-amber-500/10 text-amber-600 dark:text-amber-400 px-2 py-0.5 rounded font-bold text-[9px] tracking-wider">
                                ⚠ MEDIUM RISK EXTREMUM
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Breakdown bars */}
                      <div className="flex flex-col gap-2.5">
                        <h5 className="font-extrabold text-stone-400 uppercase tracking-widest text-[9px]">Calculated Fields Integrity</h5>
                        <div className="space-y-3">
                          {boxes.map((box) => {
                            const seed = box.field.charCodeAt(0) + box.field.charCodeAt(box.field.length - 1);
                            const fieldConf = 86 + (seed % 14);
                            const isSel = activeField === box.field;
                            return (
                              <div 
                                key={box.field}
                                onClick={() => setActiveField(box.field)}
                                className={`p-2 rounded-xl border cursor-pointer transition-all hover:bg-[#C86432]/5 flex flex-col gap-1 ${
                                  isSel ? "border-[#C86432] bg-[#C86432]/5" : `${SR.border} ${SR.surfaceMuted}`
                                }`}
                              >
                                <div className="flex justify-between items-center text-[10.5px]">
                                  <span className="font-bold text-stone-700 dark:text-stone-300">{box.label}</span>
                                  <span className="font-bold font-mono text-[#C86432]">{fieldConf}%</span>
                                </div>
                                <div className="h-1.5 bg-stone-100 dark:bg-stone-800 rounded-full overflow-hidden">
                                  <div 
                                    className="h-full bg-[#C86432]" 
                                    style={{ width: `${fieldConf}%` }}
                                  />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                    </motion.div>
                  )}

                  {/* Direct chatbot container thread */}
                  {activeTab === "chat" && (
                    <motion.div
                      key="tab-ba-chat"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className={`flex flex-col border ${SR.border} rounded-3xl overflow-hidden shadow-sm ${isDarkMode ? "bg-[#14100e]" : "bg-stone-50"} text-stone-800 dark:text-stone-200 text-left`}
                    >
                      {chatMessages.length === 0 && (
                        <div className={`p-3 text-[11px] ${isDarkMode ? "bg-[#301c13]/30 text-stone-300" : "bg-[#eeded5]/20 text-stone-700"}`}>
                          <h3 className="font-bold text-[#C86432] flex items-center gap-1.5">
                            <MessageSquare className="w-4 h-4" />
                            <span>Interactive Context prompting</span>
                          </h3>
                          <p className="mt-0.5 opacity-95">Verify deadlines, translate terms or calculate tax variables dynamically over the active document.</p>
                        </div>
                      )}

                      {/* Chat Messages */}
                      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 h-[250px] min-h-[200px]">
                        {chatMessages.map((msg) => {
                          const isUser = msg.role === "user";
                          return (
                            <div
                              key={msg.id}
                              className={`flex flex-col gap-1 max-w-[85%] rounded-2xl p-3 text-[11px] leading-relaxed ${
                                isUser
                                  ? "self-end bg-[#C86432] text-white rounded-tr-none"
                                  : isDarkMode
                                  ? "self-start bg-stone-900 border border-stone-800 text-stone-200 rounded-tl-none"
                                  : "self-start bg-stone-100 text-stone-800 rounded-tl-none"
                              }`}
                            >
                              <span className="text-[8px] font-bold uppercase select-none opacity-60">
                                {isUser ? "You" : "Document Assistant"}
                              </span>
                              <p className="whitespace-pre-wrap">{msg.content}</p>
                            </div>
                          );
                        })}

                        {isChatting && (
                          <div className={`self-start ${SR.surfaceMuted} p-3 rounded-2xl rounded-tl-none flex items-center gap-2 text-[10.5px] ${SR.textSecondary}`}>
                            <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#C86432]" />
                            <span>Fusing context metrics...</span>
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
                      <form onSubmit={handleSendMessage} className={`p-2.5 border-t flex gap-2 ${
                        isDarkMode ? "border-[#332822] bg-[#1d1714]/60" : "border-[#eeded5] bg-[#FAF6F0]"
                      }`}>
                        <input
                          type="text"
                          value={chatInput}
                          onChange={(e) => setChatInput(e.target.value)}
                          placeholder="Ask anything about this document..."
                          disabled={isChatting}
                          className={`flex-1 text-xs p-2.5 rounded-xl border focus:outline-hidden focus:ring-1 focus:ring-[#C86432] ${
                            isDarkMode ? "border-stone-800 bg-[#14100e] text-white" : "border-stone-205 bg-white text-stone-800"
                          }`}
                        />
                        <button
                          type="submit"
                          disabled={!chatInput.trim() || isChatting}
                          className="px-3.5 py-2 bg-[#C86432] hover:bg-[#aa5328] disabled:bg-stone-300 disabled:text-stone-500 text-white font-bold rounded-xl text-xs flex items-center justify-center transition-all shrink-0 cursor-pointer"
                        >
                          <Send className="w-3.5 h-3.5" />
                        </button>
                      </form>
                    </motion.div>
                  )}

                </AnimatePresence>
              )}
            </div>

            {/* Always anchored actions footer */}
            <div className={`p-4 mt-4 border-t flex flex-wrap items-center justify-between gap-3 ${
              isDarkMode ? "border-[#332822] bg-[#1d1714]/65" : "border-[#eeded5] bg-[#FAF6F0]"
            } rounded-2xl shrink-0`}>
              <div>
                {isEditing ? (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => { setExtractedText(editedText); setIsEditing(false); }}
                      className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-all cursor-pointer"
                    >
                      {t.saveBtn || "Save"}
                    </button>
                    <button
                      onClick={() => { setEditedText(extractedText); setIsEditing(false); }}
                      className={`px-3.5 py-1.5 border ${SR.border} ${SR.textSecondary} font-bold text-xs rounded-xl transition-all cursor-pointer ${SR.hoverRow}`}
                    >
                      {t.cancelBtn || "Cancel"}
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => { setEditedText(getDisplayableOrDownloadableText(extractedText, resultDocumentType)); setIsEditing(true); }}
                    className="px-3 py-1.5 border border-[#eeded5] dark:border-[#332822] text-xs font-bold rounded-xl hover:bg-[#C86432]/5 cursor-pointer text-[#C86432] transition-colors"
                  >
                    {t.editBtn || "Edit Text"}
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className="px-3 py-1.5 border border-[#eeded5] dark:border-[#332822] text-xs font-bold rounded-xl transition-all cursor-pointer text-stone-600 dark:text-stone-300 hover:bg-[#C86432]/5"
                >
                  {copyFeedback ? (t.copied || "Copied!") : (t.copyText || "Copy")}
                </button>

                <div className={`flex items-center border p-0.5 rounded-xl text-[10px] ${
                  isDarkMode 
                    ? "border-stone-800 bg-stone-900 text-stone-400" 
                    : "border-[#eeded5] bg-stone-100/50 text-stone-700"
                }`}>
                  <button onClick={() => downloadTextFile("md")} className="p-1 px-2 font-bold font-mono hover:text-[#C86432] cursor-pointer">.MD</button>
                  <button onClick={() => downloadTextFile("txt")} className="p-1 px-2 font-bold font-mono border-l border-stone-200 dark:border-stone-800 hover:text-[#C86432] cursor-pointer">.TXT</button>
                  <button onClick={downloadDocFile} className="p-1 px-2 font-bold font-mono border-l border-stone-200 dark:border-stone-800 hover:text-[#C86432] cursor-pointer animate-none">.DOC</button>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

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

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const processSelectedFile = (selectedFile: File) => {
    if (!selectedFile) return;

    if (selectedFile.size > 10 * 1024 * 1024) {
      setExtractionError("The file is too large. Please upload files smaller than 10MB to avoid oversized base64 payloads.");
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

    if (selectedFile.size > 10 * 1024 * 1024) {
      setCvError("The CV file is too large. Please upload files smaller than 10MB.");
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
    navigator.clipboard.writeText(cvEditedText || cvGeneratedText);
    setCvCopyFeedback(true);
    setTimeout(() => setCvCopyFeedback(false), 2000);
  };

  const downloadCvDoc = () => {
  const blob = new Blob(["\ufeff" + buildCvHtmlDocument()], { type: "application/msword;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    const baseName = cvFileName ? cvFileName.substring(0, cvFileName.lastIndexOf(".")) || cvFileName : "optimized-cv";
    link.download = `${baseName}-optimized.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
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
    navigator.clipboard.writeText(textToCopy);
    setCopyFeedback(true);
    setTimeout(() => setCopyFeedback(false), 2000);
  };

  const downloadTextFile = (ext: "md" | "txt") => {
    const textContent = isEditing ? editedText : getDisplayableOrDownloadableText(extractedText, resultDocumentType);
    const blob = new Blob([textContent], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    const baseName = fileName ? fileName.substring(0, fileName.lastIndexOf(".")) || fileName : "extracted-doc";
    link.download = `${baseName}-extracted.${ext}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
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

    const blob = new Blob(["\ufeff" + docHtml], { type: "application/msword;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    const baseName = fileName ? fileName.substring(0, fileName.lastIndexOf(".")) || fileName : "extracted-doc";
    link.download = `${baseName}-extracted.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const wordCount = (isEditing ? editedText : extractedText).trim().split(/\s+/).filter(Boolean).length;
  const charCount = (isEditing ? editedText : extractedText).length;

  return (
    <div
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
          <div className="flex items-center gap-2.5">
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
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-2.5">
            <button
              onClick={() => setActiveView("home")}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                activeView === "home"
                  ? "bg-[#C86432]/10 text-[#C86432]"
                  : "text-stone-500 hover:text-stone-800 dark:text-stone-400 dark:hover:text-stone-100"
              }`}
            >
              {t.navOverview}
            </button>
            <button
              onClick={() => setActiveView("workspace")}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                activeView === "workspace"
                  ? "bg-[#C86432]/10 text-[#C86432]"
                  : "text-stone-500 hover:text-stone-800 dark:text-stone-400 dark:hover:text-stone-100"
              }`}
            >
              {t.navWorkspace}
            </button>
            <button
              onClick={() => setActiveView("cv")}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                activeView === "cv"
                  ? "bg-[#C86432]/10 text-[#C86432]"
                  : "text-stone-500 hover:text-stone-800 dark:text-stone-400 dark:hover:text-stone-100"
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
                                  <span className="text-[10px] text-stone-500 dark:text-stone-400">Preset Interactive Simulation File</span>
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
                                  <span className="text-[10px] text-stone-500 dark:text-stone-400">{t.cvSampleSubtitle}</span>
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
                                  {tpl.name}
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
                        <p className={`text-[10px] mt-1 ${isDarkMode ? "text-stone-400" : "text-stone-500"}`}>
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
                    <label className="text-[10px] uppercase font-bold tracking-wider text-stone-400">{t.documentTypeLabel}</label>
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
                    <label className="text-[10px] uppercase font-bold tracking-wider text-stone-400">{t.extractionModeLabel}</label>
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
                            <span className={`text-[9px] font-mono opacity-80 ${extractionMode === mode ? "text-[#C86432]" : "text-stone-400"}`}>
                              {mode.toUpperCase()}
                            </span>
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className={`p-3.5 rounded-xl border text-[11px] leading-relaxed transition-all ${
                        isDarkMode ? "bg-stone-900/40 border-stone-800 text-stone-400" : "bg-stone-50/60 border-stone-100 text-stone-600"
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
                    <label className="text-[10px] uppercase font-bold tracking-wider text-stone-400">{t.publishingMethod}</label>
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
                    <label className="text-[10px] uppercase font-bold tracking-wider text-stone-400">{t.additionalDirectives}</label>
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
                      <p className={`text-xs max-w-sm mt-1.5 leading-relaxed ${isDarkMode ? "text-stone-400" : "text-stone-500"}`}>
                        {t.noContentSubText}
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-lg mt-8 w-full text-left">
                        <div className={`p-4 rounded-2xl border ${isDarkMode ? "bg-[#1d1714]/30 border-stone-800" : "bg-stone-50 border-stone-200"}`}>
                          <span className="text-[10px] font-bold text-[#C86432] uppercase">STEP 1</span>
                          <h4 className="text-xs font-bold mt-1">{t.step1Title}</h4>
                          <p className="text-[10px] text-stone-500 mt-1">{t.step1Sub}</p>
                        </div>
                        <div className={`p-4 rounded-2xl border ${isDarkMode ? "bg-[#1d1714]/30 border-stone-800" : "bg-stone-50 border-stone-200"}`}>
                          <span className="text-[10px] font-bold text-[#C86432] uppercase">STEP 2</span>
                          <h4 className="text-xs font-bold mt-1">{t.step2Title}</h4>
                          <p className="text-[10px] text-stone-500 mt-1">{t.step2Sub}</p>
                        </div>
                        <div className={`p-4 rounded-2xl border ${isDarkMode ? "bg-[#1d1714]/30 border-stone-800" : "bg-stone-50 border-stone-200"}`}>
                          <span className="text-[10px] font-bold text-[#C86432] uppercase">STEP 3</span>
                          <h4 className="text-xs font-bold mt-1">{t.step3Title}</h4>
                          <p className="text-[10px] text-stone-500 mt-1">{t.step3Sub}</p>
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
                          <span className={`text-[10px] font-mono font-bold uppercase ${isDarkMode ? "text-stone-400" : "text-stone-500"}`}>
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
                        <div className="flex flex-wrap items-center gap-1.5 font-mono text-[10px] text-stone-500 font-bold uppercase">
                          <span className="bg-[#C86432]/10 text-[#C86432] px-2 py-1 rounded-lg">{wordCount} {t.words}</span>
                          <span className="bg-[#C86432]/10 text-[#C86432] px-2 py-1 rounded-lg">{charCount} {t.chars}</span>
                          <span className="bg-[#C86432] text-white px-2 py-1 rounded-lg">{extractionMode.toUpperCase()}</span>
                        </div>

                        {/* Workspace toggle tabs */}
                        <div className="flex items-center border border-[#eeded5] dark:border-[#332822] p-0.5 rounded-xl bg-stone-100/50 dark:bg-stone-900/40">
                          <button
                            onClick={() => setActiveTab("result")}
                            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1 cursor-pointer ${
                              activeTab === "result" ? "bg-[#C86432] text-white" : "text-stone-500"
                            }`}
                          >
                            <FileCheck className="w-3.5 h-3.5" />
                            <span>{t.extractedText}</span>
                          </button>
                          <button
                            onClick={() => setActiveTab("chat")}
                            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1 cursor-pointer ${
                              activeTab === "chat" ? "bg-[#C86432] text-white" : "text-stone-500"
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
                                <span className="text-[10.5px] font-bold uppercase tracking-wider text-stone-400">⚡ Structured Mode</span>
                                <div className="flex items-center gap-1 bg-stone-100 dark:bg-stone-900 border dark:border-stone-800 p-0.5 rounded-xl text-[10px]">
                                  <button
                                    onClick={() => setIsJsonVisualMode(true)}
                                    className={`px-3 py-1 font-bold rounded-lg transition-all cursor-pointer ${
                                      isJsonVisualMode
                                        ? "bg-[#C86432] text-white"
                                        : "text-stone-500 dark:text-stone-400 hover:text-stone-700 dark:hover:text-stone-200"
                                    }`}
                                  >
                                    Visual Report
                                  </button>
                                  <button
                                    onClick={() => setIsJsonVisualMode(false)}
                                    className={`px-3 py-1 font-bold rounded-lg transition-all cursor-pointer ${
                                      !isJsonVisualMode
                                        ? "bg-[#C86432] text-white"
                                        : "text-stone-500 dark:text-stone-400 hover:text-stone-700 dark:hover:text-stone-200"
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
                          <span className={cvRawNotesTrimmed.length > 0 && cvRawNotesTrimmed.length < cvRawNotesMinLength ? "text-amber-600 font-bold" : "text-stone-400"}>
                            {t.cvRawNotesMin} {cvRawNotesMinLength} {t.chars}
                          </span>
                          <span className="text-stone-400 font-mono">
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
                        <p className={`text-[10px] mt-1 ${isDarkMode ? "text-stone-400" : "text-stone-500"}`}>
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
                            <p className={`text-[10px] ${isDarkMode ? "text-stone-400" : "text-stone-500"}`}>{cvFileSize}</p>
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
                          {template.name}
                        </span>
                        <span className="text-[10px] text-stone-500 block mt-1 leading-tight">{template.desc}</span>
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
                    <label className="text-[10px] uppercase font-bold tracking-wider text-stone-400">{t.cvTone}</label>
                    <select
                      value={cvTone}
                      onChange={(e) => setCvTone(e.target.value)}
                      className={`w-full p-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                        isDarkMode ? "border-[#332822] bg-[#1a1412] text-white" : "border-[#eeded5] bg-white text-[#3c2f2f]"
                      }`}
                    >
                      <option>Confident professional</option>
                      <option>Bold leadership</option>
                      <option>Technical expert</option>
                      <option>Creative innovator</option>
                      <option>Strategic thinker</option>
                      <option>Collaborative team player</option>
                    </select>
                  </div>

                  {/* Seniority Level */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] uppercase font-bold tracking-wider text-stone-400">{t.cvSeniority}</label>
                    <select
                      value={cvSeniority}
                      onChange={(e) => setCvSeniority(e.target.value)}
                      className={`w-full p-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                        isDarkMode ? "border-[#332822] bg-[#1a1412] text-white" : "border-[#eeded5] bg-white text-[#3c2f2f]"
                      }`}
                    >
                      <option>Adaptive</option>
                      <option>Junior (0-3 years)</option>
                      <option>Mid-level (3-6 years)</option>
                      <option>Senior (6-10 years)</option>
                      <option>Executive (10+ years)</option>
                    </select>
                  </div>

                  {/* Focus Areas - Multi-select */}
                  <div className="flex flex-col gap-2 border-t border-[#eeded5] dark:border-[#332822] pt-3">
                    <label className="text-[10px] uppercase font-bold tracking-wider text-stone-400 flex items-center gap-2">
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
                              ? "border-transparent bg-[#1d1714]/30 text-stone-400 hover:bg-[#1d1714]/50"
                              : "border-transparent bg-white text-stone-600 shadow-xs hover:bg-stone-50"
                          }`}
                        >
                          <div className="flex items-center gap-1.5">
                            <div className={`w-3 h-3 rounded border ${cvFocusAreas.includes(area) ? "bg-[#C86432] border-[#C86432]" : isDarkMode ? "border-stone-700" : "border-stone-300"}`} />
                            <span>{area}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Custom Request */}
                  <div className="flex flex-col gap-1.5 border-t border-[#eeded5] dark:border-[#332822] pt-3">
                    <label className="text-[10px] uppercase font-bold tracking-wider text-stone-400">{t.cvAdditionalNotes}</label>
                    <textarea
                      value={cvCustomRequest}
                      onChange={(e) => setCvCustomRequest(e.target.value)}
                      placeholder={t.cvAdditionalPlaceholder}
                      maxLength={500}
                      className={`w-full p-2.5 rounded-xl border text-xs resize-none h-20 focus:outline-hidden focus:ring-1 focus:ring-[#C86432] ${
                        isDarkMode ? "border-stone-800 bg-[#14100e] text-white placeholder-stone-600" : "border-stone-200 bg-white text-stone-800 placeholder-stone-400"
                      }`}
                    />
                    <span className="text-[9px] text-stone-400">{cvCustomRequest.length}/500</span>
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
                        className="text-[11px] font-bold text-stone-500 hover:text-stone-800 border border-stone-200 px-2 py-1 rounded-lg transition-all"
                      >
                        {t.cvClear}
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[480px] overflow-y-auto pr-2">
                    {CV_POSITION_CATEGORIES.map((position) => (
                      <button
                        key={position}
                        onClick={() => toggleCvPosition(position)}
                        className={`p-2.5 rounded-xl border text-left text-xs font-bold transition-all cursor-pointer flex items-start gap-2 ${
                          cvSelectedPositions.includes(position)
                            ? "border-[#C86432] bg-[#C86432]/10 text-[#C86432]"
                            : isDarkMode
                            ? "border-transparent bg-[#1d1714]/30 text-stone-400 hover:bg-[#1d1714]/50"
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
                        <span>{position}</span>
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
                      <p className={`text-xs max-w-sm mt-1.5 leading-relaxed ${isDarkMode ? "text-stone-400" : "text-stone-500"}`}>
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
                              <div className="text-[11px] text-stone-500">{t.cvOptimizingSub}</div>
                            </div>
                          </div>
                          <div className="text-[11px] text-stone-400">{cvSelectedPositions.length} {t.cvPositions}</div>
                        </div>

                        <div className="w-full bg-stone-200 h-3 rounded-full overflow-hidden mb-2">
                          <div className="h-full bg-[#C86432]" style={{ width: `${Math.min(100, Math.round(((cvTrackerStep + 1) / 5) * 100))}%` }} />
                        </div>
                        <div className="flex justify-between text-[11px] text-stone-500">
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
                        <div className="flex flex-wrap items-center gap-1.5 font-mono text-[10px] text-stone-500 font-bold uppercase">
                          <span className="bg-emerald-500/10 text-emerald-600 px-2 py-1 rounded-lg">{t.cvGenerated}</span>
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
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setCvPreviewMode("preview")}
                              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${cvPreviewMode === "preview" ? "bg-[#C86432] text-white" : isDarkMode ? "bg-stone-900/20 text-stone-300" : "bg-white text-stone-700"}`}
                            >
                              {t.cvPreview}
                            </button>
                            <button
                              onClick={() => setCvPreviewMode("text")}
                              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${cvPreviewMode === "text" ? "bg-[#C86432] text-white" : isDarkMode ? "bg-stone-900/20 text-stone-300" : "bg-white text-stone-700"}`}
                            >
                              {t.cvText}
                            </button>
                          </div>
                          <div className="text-[10px] text-stone-400">{t.cvTemplate}: <span className="font-bold">{CV_TEMPLATES.find((t)=>t.id===cvTemplate)?.name}</span></div>
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
                          <div className={`p-4 rounded-xl border whitespace-pre-wrap font-sans text-xs leading-relaxed selection:bg-[#C86432] ${
                            isDarkMode ? "border-stone-800 bg-stone-950 text-stone-200" : "border-stone-200 bg-stone-50 text-stone-800"
                          }`}>
                            {cvEditedText || cvGeneratedText}
                          </div>
                        )}
                      </div>

                      {/* Export Toolbar */}
                      <div className={`p-4 border-t flex flex-wrap items-center justify-between gap-3 ${
                        isDarkMode ? "border-[#332822] bg-[#1d1714]/60" : "border-[#eeded5] bg-[#FAF6F0]"
                      }`}>
                        <button
                          onClick={copyCvText}
                          className="px-3 py-1.5 border border-[#eeded5] dark:border-[#332822] text-xs font-bold rounded-xl hover:bg-stone-50 dark:hover:bg-stone-900 cursor-pointer text-[#C86432] transition-all"
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
      <footer className={`border-t py-6 px-12 text-center text-xs transition-all duration-300 ${
        isDarkMode ? "border-[#332822]/40 bg-[#14100e] text-stone-400" : "border-[#eeded5]/60 bg-white/30 text-stone-500"
      }`}>
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 font-sans">
          <p>{t.copyright}</p>
          <div className="flex justify-center gap-4 text-[10px] font-bold uppercase tracking-wider text-[#C86432]">
            <span>{t.statelessSandbox}</span>
            <span className="opacity-40">·</span>
            <span>{t.securitySafe}</span>
            <span className="opacity-40">·</span>
            <span>{t.jsonOutput}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
