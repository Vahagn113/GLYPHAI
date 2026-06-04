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
  X
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

interface DemoPreset {
  name: string;
  illustration: string;
  raw: string;
  layout: string;
  summary: string;
  "key-value": string;
}

const DEMO_PRESETS: DemoPreset[] = [
  {
    name: "Cozy Bakery Invoice #429",
    illustration: `<svg viewBox="0 0 100 100" class="w-24 h-24 text-amber-700/80"><rect width="80" height="90" x="10" y="5" rx="5" fill="#FAF6F0" stroke="#eeded5" stroke-width="2"/><circle cx="50" cy="40" r="18" fill="#E8D5C4"/><path d="M40 40 Q50 30 60 40" stroke="#B2533E" stroke-width="4" fill="none"/><line x1="25" y1="70" x2="75" y2="70" stroke="#eeded5" stroke-width="2"/><line x1="25" y1="80" x2="60" y2="80" stroke="#eeded5" stroke-width="2"/></svg>`,
    raw: "SWEET HARVEST BAKERY\nInvoice #429\nDate: 2026-06-03\n3x Butter Croissant....$13.50\n1x Warm Apple Cider...$4.50\nTotal Paid: $18.00\nThanks for stopping by!",
    layout: "### SWEET HARVEST BAKERY\n* **Invoice:** #429\n* **Date:** June 3, 2026\n\n| Item | Qty | Total Price |\n| :--- | :---: | :---: |\n| Butter Croissant | 3 | $13.50 |\n| Warm Apple Cider | 1 | $4.50 |\n\n**Total Amount Paid:** **$18.00**",
    summary: "# Executive Brief: Invoice #429\n- **Client/Merchant:** Sweet Harvest Bakery\n- **Date Identified:** June 3, 2026\n- **Primary Intent:** Commercial sales receipt\n- **Key Total:** $18.00\n- **Takeaways:** 4 items total sold; billing was completed successfully.",
    "key-value": "| Label Attribute | Extracted Value |\n| :--- | :--- |\n| Merchant Name | Sweet Harvest Bakery |\n| Document Reference | Invoice #429 |\n| Billing Date | June 3, 2026 |\n| Quantity of Items | 4 items |\n| Grand Monetary Sum | $18.00 |"
  },
  {
    name: "Lecture Notes on Archeology",
    illustration: `<svg viewBox="0 0 100 100" class="w-24 h-24 text-amber-700/80"><rect width="80" height="90" x="10" y="5" rx="5" fill="#FAF6F0" stroke="#eeded5" stroke-width="2"/><path d="M20 20 L80 20" stroke="#7D6B60" stroke-width="2"/><path d="M20 35 L80 35" stroke="#eeded5" stroke-dasharray="2" stroke-width="1.5"/><path d="M20 50 L60 50" stroke="#eeded5" stroke-dasharray="2" stroke-width="1.5"/><polygon points="40,65 75,65 57,85" fill="#B2533E" opacity="0.8"/></svg>`,
    raw: "Archeology Lab 08 - Warm Sun Sands\nGiza pyramid alignment suggests seasonal coordination\nCarbon dating estimates: ~2500 BCE\nNext task: review stone quarries map and write draft proposal",
    layout: "# Archeology Lab 08: Giza Exploration\n\n*   **General Assessment:** Structural analysis shows alignments correspond to key seasonal solar configurations.\n*   **Timeline Coordinates:** Radiocarbon logs place construction parameters around **~2500 BCE**.\n*   **Actionable Items:**\n    1.  Conduct stone quarry GIS mapping analysis.\n    2.  Formulate the secondary draft research proposal.",
    summary: "# Research Outline: Archeology Notes\n- **Subject:** Giza Pyramid Alignments & Chronology\n- **Chronological Period:** ~2500 BCE\n- **Essential Discovery:** Physical layouts match ancient celestial calendars.\n- **Action Item:** Compile GIS coordinates & outline the draft proposal next week.",
    "key-value": "| Research Attribute | Historical Value |\n| :--- | :--- |\n| Field Lab Title | Archeology Lab 08 |\n| Primary Subject | Pyramid Seasonal Alignment |\n| Chronology Date | ~2500 BCE |\n| Follow-Up Milestone | Write draft proposal & review quarry map |"
  }
];

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
      <div className="w-14 h-1.5 bg-stone-200 dark:bg-stone-850 rounded-full overflow-hidden">
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

const renderInvoiceNode = (data: any) => {
  const lineItems = Array.isArray(data.lineItems) ? data.lineItems : [];
  return (
    <div className="flex flex-col gap-4 text-stone-700 dark:text-stone-300 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        <div className="p-3.5 rounded-2xl border border-stone-150 dark:border-stone-850 bg-stone-50/55 dark:bg-stone-900/40 flex flex-col gap-1.5 shadow-3xs">
          <div className="flex items-center justify-between">
            <span className="text-[9.5px] font-bold uppercase tracking-wider text-stone-400">Company (Vendor Name)</span>
            <div className="flex items-center gap-1.5">
              {data.vendorName?.confidence !== undefined && <ConfidenceMeter value={data.vendorName?.confidence} />}
              <CopyFieldButton value={data.vendorName?.value || ""} />
            </div>
          </div>
          <p className="text-xs font-black text-stone-850 dark:text-white">{data.vendorName?.value || "N/A"}</p>
          <p className="text-[10px] text-stone-500">{data.vendorAddress?.value || "N/A"}</p>
        </div>

        <div className="p-3.5 rounded-2xl border border-stone-150 dark:border-stone-850 bg-stone-50/55 dark:bg-stone-900/40 flex flex-col gap-1.5 shadow-3xs">
          <div className="flex items-center justify-between">
            <span className="text-[9.5px] font-bold uppercase tracking-wider text-stone-400">Customer (Billed To)</span>
            <div className="flex items-center gap-1.5">
              {data.billingName?.confidence !== undefined && <ConfidenceMeter value={data.billingName?.confidence} />}
              <CopyFieldButton value={data.billingName?.value || ""} />
            </div>
          </div>
          <p className="text-xs font-semibold text-stone-850 dark:text-white">{data.billingName?.value || "N/A"}</p>
          <p className="text-[10px] text-stone-505">{data.billingAddress?.value || "N/A"}</p>
        </div>
      </div>

      <div className="p-3.5 rounded-2xl border border-stone-150 dark:border-stone-850 bg-stone-50/55 dark:bg-stone-900/40 grid grid-cols-2 md:grid-cols-5 gap-3 shadow-3xs">
        <div>
          <span className="text-[9.5px] font-bold uppercase tracking-wider text-stone-400 block mb-0.5 font-sans">Invoice Number</span>
          <div className="flex items-center gap-1.5">
            <p className="text-xs font-bold text-stone-850 dark:text-white font-mono">{data.invoiceNumber?.value || "N/A"}</p>
            <CopyFieldButton value={data.invoiceNumber?.value || ""} />
          </div>
          {data.invoiceNumber?.confidence !== undefined && <div className="mt-1"><ConfidenceMeter value={data.invoiceNumber?.confidence} /></div>}
        </div>
        <div>
          <span className="text-[9.5px] font-bold uppercase tracking-wider text-stone-400 block mb-0.5 font-sans">Date (Issue)</span>
          <div className="flex items-center gap-1.5">
            <p className="text-xs font-semibold text-stone-800 dark:text-white font-mono">{data.invoiceDate?.value || "N/A"}</p>
            <CopyFieldButton value={data.invoiceDate?.value || ""} />
          </div>
          {data.invoiceDate?.confidence !== undefined && <div className="mt-1"><ConfidenceMeter value={data.invoiceDate?.confidence} /></div>}
        </div>
        <div>
          <span className="text-[9.5px] font-bold uppercase tracking-wider text-stone-400 block mb-0.5 font-sans">VAT / Tax Amount</span>
          <div className="flex items-center gap-1.5">
            <p className="text-xs font-semibold text-stone-800 dark:text-white font-mono">{data.tax?.value || "0.00"}</p>
            <CopyFieldButton value={data.tax?.value || ""} />
          </div>
          {data.tax?.confidence !== undefined && <div className="mt-1"><ConfidenceMeter value={data.tax?.confidence} /></div>}
        </div>
        <div>
          <span className="text-[9.5px] font-bold uppercase tracking-wider text-stone-400 block mb-0.5 font-sans">Currency</span>
          <div className="flex items-center gap-1.5">
            <p className="text-xs font-semibold text-[#C86432] uppercase font-mono font-bold">{data.currency?.value || "N/A"}</p>
            <CopyFieldButton value={data.currency?.value || ""} />
          </div>
          {data.currency?.confidence !== undefined && <div className="mt-1"><ConfidenceMeter value={data.currency?.confidence} /></div>}
        </div>
        <div className="col-span-2 md:col-span-1 border-t md:border-t-0 md:border-l border-[#eeded5] dark:border-stone-850 md:pl-2.5 font-sans">
          <span className="text-[9.5px] font-bold uppercase tracking-wider text-[#C86432] block mb-0.5 font-sans">Total Amount</span>
          <div className="flex items-center gap-1.5">
            <p className="text-xs font-black text-rose-600 dark:text-rose-455 font-mono">{data.totalAmount?.value || "0.00"}</p>
            <CopyFieldButton value={data.totalAmount?.value || ""} />
          </div>
          {data.totalAmount?.confidence !== undefined && <div className="mt-1"><ConfidenceMeter value={data.totalAmount?.confidence} /></div>}
        </div>
      </div>

      <div className="rounded-2xl border border-stone-150 dark:border-stone-800 overflow-hidden bg-stone-50/20 shadow-3xs">
        <div className="p-2.5 bg-stone-105 dark:bg-stone-800/80 text-[10px] font-extrabold text-[#C86432] uppercase tracking-wider grid grid-cols-12 gap-2 border-b border-stone-150 dark:border-stone-800">
          <div className="col-span-6">Billed Item Description (Line Items)</div>
          <div className="col-span-2 text-center">Qty</div>
          <div className="col-span-2 text-right">Unit Price</div>
          <div className="col-span-2 text-right">Total</div>
        </div>
        <div className="divide-y divide-stone-150 dark:divide-stone-800/60 font-mono">
          {lineItems.length === 0 ? (
            <p className="p-3 text-center text-[11px] text-stone-400 italic font-sans">No invoice line items parsed.</p>
          ) : (
            lineItems.map((item: any, id: number) => (
              <div key={id} className="p-2.5 grid grid-cols-12 gap-2 text-[11px] items-center hover:bg-stone-100/10">
                <div className="col-span-6 flex flex-col gap-0.5">
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-stone-800 dark:text-white font-sans">{item.description?.value || "Item"}</span>
                    <CopyFieldButton value={item.description?.value || ""} />
                  </div>
                  {item.description?.confidence !== undefined && <ConfidenceMeter value={item.description?.confidence} />}
                </div>
                <div className="col-span-2 text-center text-stone-550 font-mono">
                  {item.quantity?.value !== undefined ? item.quantity.value : "1"}
                </div>
                <div className="col-span-2 text-right text-stone-550 font-mono">
                  {item.unitPrice?.value !== undefined ? item.unitPrice.value : "N/A"}
                </div>
                <div className="col-span-2 text-right font-bold text-stone-800 dark:text-white font-mono">
                  {item.total?.value !== undefined ? item.total.value : "N/A"}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="flex justify-end mt-1 font-sans">
        <div className="w-full md:w-64 p-3.5 rounded-2xl border border-stone-150 dark:border-stone-850 bg-stone-50/50 dark:bg-stone-900/40 flex flex-col gap-2 shadow-2xs">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-stone-400 font-sans">Subtotal:</span>
            <span className="font-mono font-semibold">{data.subtotal?.value || "0.00"}</span>
          </div>
          <div className="flex items-center justify-between text-[11px] border-b border-[#eeded5] dark:border-stone-850 pb-1.5">
            <span className="text-stone-400 font-sans">VAT / Tax:</span>
            <span className="font-mono font-semibold">{data.tax?.value || "0.00"}</span>
          </div>
          <div className="flex items-center justify-between text-[11.5px] font-bold font-sans animate-fade-in bg-stone-50 dark:bg-stone-900/50 p-1 px-2.5 rounded-xl">
            <span className="text-stone-800 dark:text-white font-sans font-extrabold">Grand Total:</span>
            <div className="flex items-center gap-1.5">
              <span className="font-mono text-emerald-600 dark:text-emerald-500 font-extrabold">{data.totalAmount?.value || "0.00"}</span>
              <CopyFieldButton value={data.totalAmount?.value || ""} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const renderContractNode = (data: any) => {
  const parties = Array.isArray(data.parties) ? data.parties : [];
  const importantDates = Array.isArray(data.importantDates) ? data.importantDates : [];
  const keyObligations = Array.isArray(data.keyObligations) ? data.keyObligations : [];
  const risks = Array.isArray(data.risks) ? data.risks : [];
  const keyClauses = Array.isArray(data.keyClauses) ? data.keyClauses : [];

  return (
    <div className="flex flex-col gap-4 text-stone-700 dark:text-stone-300 animate-fade-in">
      {/* Title block */}
      <div className="p-4 rounded-2xl border border-stone-150 dark:border-stone-850 bg-stone-50/50 dark:bg-stone-900/40 flex flex-col gap-1.5 shadow-3xs">
        <div className="flex justify-between items-center">
          <span className="text-[9px] font-bold uppercase tracking-wider text-[#C86432]">Contract Agreement</span>
          <CopyFieldButton value={data.contractTitle?.value || "Legal Agreement"} />
        </div>
        <h3 className="text-xs font-black text-stone-900 dark:text-white leading-snug">{data.contractTitle?.value || "Legal Agreement"}</h3>
        {data.contractTitle?.confidence !== undefined && <ConfidenceMeter value={data.contractTitle?.confidence} />}
      </div>

      {/* Summary Section */}
      <div className="p-4 rounded-2xl border border-stone-150 dark:border-stone-850 bg-stone-50/40 dark:bg-[#1c1613]/30 flex flex-col gap-2 shadow-2xs">
        <div className="flex justify-between items-center border-b pb-2 border-stone-150 dark:border-stone-850">
          <h4 className="text-[10px] font-extrabold uppercase tracking-wide text-stone-800 dark:text-stone-200">Summary</h4>
          <CopyFieldButton value={data.summary?.value || ""} />
        </div>
        <p className="text-[11px] leading-relaxed italic text-stone-600 dark:text-stone-350 bg-stone-100/10 p-2.5 rounded-xl">
          {data.summary?.value || "No agreement summary parsed."}
        </p>
        {data.summary?.confidence !== undefined && <ConfidenceMeter value={data.summary?.confidence} />}
      </div>

      {/* Important Dates Segment */}
      <div className="p-4 rounded-2xl border border-stone-150 dark:border-stone-850 bg-stone-50/40 dark:bg-[#1c1613]/30 flex flex-col gap-2 shadow-2xs font-sans">
        <h4 className="text-[10px] font-extrabold uppercase tracking-wide text-stone-800 dark:text-stone-200 border-b pb-2 border-stone-150 dark:border-stone-850">Important Dates & Notice Details</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
          <div className="p-3 bg-stone-100/30 dark:bg-stone-900/40 rounded-xl border border-dashed border-stone-200 dark:border-stone-800 flex flex-col justify-between">
            <div>
              <span className="text-[9px] uppercase font-bold text-stone-400 block pb-0.5">Effective Start Date</span>
              <span className="text-xs font-bold text-stone-800 dark:text-white">{data.effectiveDate?.value || "N/A"}</span>
            </div>
            <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-stone-150 dark:border-stone-800">
              <ConfidenceMeter value={data.effectiveDate?.confidence ?? 0.8} />
              <CopyFieldButton value={data.effectiveDate?.value || ""} />
            </div>
          </div>
          <div className="p-3 bg-stone-100/30 dark:bg-stone-900/40 rounded-xl border border-dashed border-stone-200 dark:border-stone-800 flex flex-col justify-between">
            <div>
              <span className="text-[9px] uppercase font-bold text-stone-400 block pb-0.5">Expiration Date</span>
              <span className="text-xs font-bold text-stone-800 dark:text-white">{data.expirationDate?.value || "N/A"}</span>
            </div>
            <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-stone-150 dark:border-stone-800">
              <ConfidenceMeter value={data.expirationDate?.confidence ?? 0.8} />
              <CopyFieldButton value={data.expirationDate?.value || ""} />
            </div>
          </div>
        </div>
        {importantDates.length > 0 && (
          <div className="flex flex-col gap-2 mt-2">
            <span className="text-[9px] uppercase font-bold tracking-wider text-stone-450">Dates & Deadlines</span>
            <div className="divide-y divide-stone-150 dark:divide-stone-850">
              {importantDates.map((d: any, idx: number) => (
                <div key={idx} className="py-2.5 flex items-center justify-between text-[11px] hover:bg-stone-50/5">
                  <span className="font-semibold text-stone-805 dark:text-stone-150">{d.event?.value || d.event || "Deadline"}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 font-bold px-1.5 py-0.5 rounded-md">
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
      <div className="p-4 rounded-2xl border border-[#eeded5] dark:border-stone-850 bg-stone-50/40 dark:bg-[#1c1613]/30 flex flex-col gap-2 shadow-2xs">
        <h4 className="text-[10px] font-extrabold uppercase tracking-wide text-stone-800 dark:text-stone-200 border-b pb-2 border-[#eeded5] dark:border-stone-850 font-sans">Risks</h4>
        {risks.length === 0 ? (
          <p className="p-4 rounded-xl text-center text-[11px] text-[#C86432] italic bg-[#C86432]/5 font-bold border border-[#C86432]/10 flex items-center justify-center gap-1.5 font-sans">
            🛡️ No critical contractual risks visualizable.
          </p>
        ) : (
          <div className="flex flex-col gap-2.5 pt-1.5 font-sans">
            {risks.map((risk: any, idx: number) => {
              const severityVal = (risk.severity?.value || risk.severity || "Medium").toLowerCase();
              const badgeBg = severityVal.includes("high") 
                ? "bg-rose-500/10 text-rose-600 dark:text-rose-455 border border-rose-500/20" 
                : severityVal.includes("low") 
                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-455 border border-emerald-500/20"
                : "bg-amber-500/10 text-amber-600 dark:text-amber-455 border border-amber-500/20";
              return (
                <div key={idx} className="p-3 rounded-xl border border-stone-150 dark:border-stone-800 bg-stone-50/10 flex flex-col gap-1.5 text-stone-700 dark:text-stone-300">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${badgeBg}`}>
                        {risk.severity?.value || "Medium"}
                      </span>
                      <span className="text-xs font-bold text-stone-805 dark:text-white font-sans">{risk.riskFactor?.value || "Risk Factor"}</span>
                    </div>
                    <CopyFieldButton value={`${risk.riskFactor?.value || ""}: ${risk.detail?.value || ""}`} />
                  </div>
                  <p className="text-[11px] text-stone-555 leading-relaxed font-sans">{risk.detail?.value || ""}</p>
                  {risk.riskFactor?.confidence !== undefined && <ConfidenceMeter value={risk.riskFactor?.confidence} />}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Clauses Segment */}
      <div className="p-4 rounded-2xl border border-stone-150 dark:border-stone-855 bg-stone-50/40 dark:bg-[#1c1613]/30 flex flex-col gap-2 shadow-2xs font-sans">
        <h4 className="text-[10px] font-extrabold uppercase tracking-wide text-stone-800 dark:text-stone-200 border-b pb-2 border-stone-150 dark:border-stone-850 font-sans">Clauses</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 py-1 select-none font-sans">
          <div className="p-2.5 rounded-xl bg-stone-100/35 dark:bg-stone-900/40 border flex flex-col justify-between gap-1">
            <div>
              <span className="text-[9px] uppercase font-bold text-stone-400 font-sans block pb-0.5 font-sans">Governing Law</span>
              <p className="text-xs font-semibold font-sans text-stone-800 dark:text-white">{data.governingLaw?.value || "Default"}</p>
            </div>
            <div className="flex justify-end border-t dark:border-stone-800 pt-1 mt-1 font-sans">
              <CopyFieldButton value={data.governingLaw?.value || ""} />
            </div>
          </div>
          <div className="p-2.5 rounded-xl bg-stone-100/35 dark:bg-stone-900/40 border flex flex-col justify-between gap-1">
            <div>
              <span className="text-[9px] uppercase font-bold text-stone-400 font-sans block pb-0.5 font-sans">Termination Period</span>
              <p className="text-xs font-semibold font-sans text-stone-800 dark:text-white">{data.terminationNoticePeriod?.value || "Immediate"}</p>
            </div>
            <div className="flex justify-end border-t dark:border-stone-800 pt-1 mt-1 font-sans">
              <CopyFieldButton value={data.terminationNoticePeriod?.value || ""} />
            </div>
          </div>
          <div className="p-2.5 rounded-xl bg-stone-100/35 dark:bg-stone-900/40 border flex flex-col justify-between gap-1">
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
            <span className="text-[9px] uppercase font-bold tracking-wider text-stone-455 font-sans">Legal Provisions</span>
            <div className="flex flex-col gap-2">
              {keyClauses.map((clause: any, idx: number) => (
                <details key={idx} className="group border border-stone-150 dark:border-stone-800/80 rounded-xl bg-stone-100/10 dark:bg-stone-900/10 [&_summary::-webkit-details-marker]:hidden transition-all duration-300">
                  <summary className="p-3 select-none flex justify-between items-center text-xs font-bold text-stone-805 dark:text-white cursor-pointer hover:bg-stone-50/20 font-sans">
                    <div className="flex items-center gap-2 font-sans">
                      <span className="w-1.5 h-1.5 bg-[#C86432] rounded-full" />
                      <span>{clause.title?.value || clause.title || "Section Clause"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ChevronDown className="w-3.5 h-3.5 text-stone-450 group-open:rotate-180 transition-transform" />
                    </div>
                  </summary>
                  <div className="p-3 pt-0 border-t border-stone-150 dark:border-stone-800/55 text-[11px] text-stone-555 leading-relaxed font-sans">
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



const renderResumeNode = (data: any) => {
  const skills = Array.isArray(data.skills) ? data.skills : [];
  const education = Array.isArray(data.education) ? data.education : [];
  const experience = Array.isArray(data.experience) ? data.experience : [];

  return (
    <div className="flex flex-col gap-4 text-stone-700 dark:text-stone-300">
      <div className="p-3.5 rounded-2xl border border-stone-150 dark:border-stone-800 bg-stone-50/55 dark:bg-stone-900/40 flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-extrabold text-[#C86432]">{data.candidateName?.value || "Resume Profile"}</h3>
          {data.candidateName?.confidence !== undefined && <ConfidenceMeter value={data.candidateName?.confidence} />}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-[11px] text-stone-500 border-t border-stone-150 dark:border-stone-800 pt-2.5">
          <p>📧 Email: <span className="font-semibold text-stone-750 dark:text-stone-200">{data.email?.value || "N/A"}</span></p>
          <p>📞 Phone: <span className="font-semibold text-stone-750 dark:text-stone-200">{data.phone?.value || "N/A"}</span></p>
          <p>📍 Location: <span className="font-semibold text-stone-750 dark:text-stone-200">{data.location?.value || "N/A"}</span></p>
        </div>

        {data.summary?.value && (
          <div className="bg-stone-100/30 dark:bg-stone-900/30 p-2.5 rounded-xl mt-1.5">
            <span className="text-[9px] uppercase font-bold tracking-wider text-stone-400 block mb-0.5">Summary Profile</span>
            <p className="text-[11px] leading-relaxed italic text-stone-550 dark:text-stone-350">{data.summary.value}</p>
          </div>
        )}
      </div>

      {skills.length > 0 && (
        <div className="flex flex-col gap-2">
          <h4 className="text-[10px] font-bold uppercase tracking-wider text-stone-400">Technical Skillset</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            {skills.map((sk: any, idx: number) => (
              <div key={idx} className="p-2.5 rounded-xl border border-stone-150 dark:border-stone-800 bg-stone-50/10">
                <span className="text-xs font-bold text-[#C86432] block mb-1.5">{sk.category?.value || "Skills"}</span>
                <div className="flex flex-wrap gap-1">
                  {Array.isArray(sk.skillsList) ? sk.skillsList.map((item: string, id: number) => (
                    <span key={id} className="text-[9.5px] bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 font-bold px-1.5 py-0.5 rounded-md">
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
        <div className="flex flex-col gap-2">
          <h3 className="text-[10px] font-bold uppercase tracking-wider text-stone-400">Experience History</h3>
          <div className="flex flex-col gap-2.5">
            {experience.map((ex: any, idx: number) => (
              <div key={idx} className="p-3 rounded-xl border border-stone-150 dark:border-stone-800 flex flex-col gap-1.5 bg-stone-50/5">
                <div className="flex flex-wrap justify-between items-start gap-2 border-b border-stone-150 dark:border-stone-850 pb-1.5">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-stone-800 dark:text-white">{ex.role?.value || "Role"}</span>
                    <span className="text-[11px] text-stone-505">{ex.company?.value || "Employer"}</span>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-[9.5px] font-mono bg-stone-100 dark:bg-stone-800 px-1.5 py-0.5 rounded-md font-bold text-[#C86432]">
                      {ex.startDate?.value || "Start"} - {ex.endDate?.value || "End"}
                    </span>
                    {ex.role?.confidence !== undefined && <ConfidenceMeter value={ex.role?.confidence} />}
                  </div>
                </div>
                <p className="text-[11px] text-stone-500 leading-relaxed font-sans">{ex.description?.value || ""}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {education.length > 0 && (
        <div className="flex flex-col gap-2">
          <h3 className="text-[10px] font-bold uppercase tracking-wider text-stone-400">Academic History</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            {education.map((ed: any, idx: number) => (
              <div key={idx} className="p-2.5 rounded-xl border border-stone-150 dark:border-stone-800 bg-stone-50/10 flex items-center justify-between">
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs font-bold text-stone-800 dark:text-white">{ed.degree?.value || "Degree"}</span>
                  <span className="text-[10px] text-stone-550">{ed.institution?.value || "College/Univ"}</span>
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

const renderReceiptNode = (data: any) => {
  const items = Array.isArray(data.items) ? data.items : [];
  return (
    <div className="flex flex-col gap-4 text-stone-700 dark:text-stone-300">
      <div className="p-3.5 rounded-2xl border border-stone-150 dark:border-stone-800 bg-stone-100/30 dark:bg-stone-900/30 flex flex-col items-center text-center gap-1">
        <span className="text-[9px] uppercase font-bold text-stone-450">Commercial Slip</span>
        <h3 className="text-xs font-black text-stone-850 dark:text-white uppercase tracking-wider">{data.merchantName?.value || "Merchant"}</h3>
        <p className="text-[10px] text-stone-505">{data.merchantAddress?.value || ""}</p>
        <p className="text-[9px] text-stone-450 font-mono">{data.merchantPhone?.value || ""}</p>
        {data.merchantName?.confidence !== undefined && <div className="mt-1.5"><ConfidenceMeter value={data.merchantName?.confidence} /></div>}
      </div>

      <div className="grid grid-cols-2 gap-2 text-[11px] border-y border-stone-150 dark:border-stone-800 py-2.5 font-mono">
        <div>📅 DATE: <span className="font-bold">{data.transactionDate?.value || "N/A"}</span></div>
        <div className="text-right">🕒 TIME: <span className="font-bold">{data.transactionTime?.value || "N/A"}</span></div>
      </div>

      <div className="flex flex-col gap-1.5">
        <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">Purchases List</span>
        <div className="border border-stone-150 dark:border-stone-850 rounded-xl overflow-hidden bg-stone-50/10">
          <div className="p-2 bg-stone-100 dark:bg-stone-800/80 text-[9px] font-bold text-stone-500 uppercase flex items-center justify-between border-b dark:border-stone-850">
            <span>Description</span>
            <div className="flex items-center gap-5">
              <span>Qty</span>
              <span className="w-14 text-right">Total</span>
            </div>
          </div>
          <div className="divide-y divide-stone-150 dark:divide-stone-800/60">
            {items.map((it: any, idx: number) => (
              <div key={idx} className="p-2 flex items-center justify-between text-[11px] hover:bg-stone-100/5">
                <div className="flex flex-col gap-0.5">
                  <span className="font-semibold text-stone-850 dark:text-stone-150">{it.description?.value || "Purchase Item"}</span>
                  {it.description?.confidence !== undefined && <ConfidenceMeter value={it.description?.confidence} />}
                </div>
                <div className="flex items-center gap-6 font-mono">
                  <span>{it.quantity?.value !== undefined ? it.quantity.value : "1"}</span>
                  <span className="w-14 text-right font-bold text-stone-850 dark:text-white">{it.totalPrice?.value !== undefined ? it.totalPrice.value : "N/A"}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-stone-150 dark:border-stone-800 pt-2.5 flex flex-col gap-1.5 text-[11px]">
        <div className="flex justify-between items-center text-stone-555">
          <span>VAT Taxes:</span>
          <span className="font-mono">{data.tax?.value || "0.00"}</span>
        </div>
        <div className="flex justify-between items-center text-stone-555">
          <span>Tips:</span>
          <span className="font-mono">{data.tip?.value || "0.00"}</span>
        </div>
        <div className="flex justify-between items-center text-stone-555">
          <span>Payment Channel:</span>
          <span className="font-semibold">{data.paymentMethod?.value || "Card"}</span>
        </div>
        <div className="flex justify-between items-center text-stone-850 dark:text-white font-bold border-t dark:border-stone-85 pt-1.5">
          <span>GRAND TOTAL:</span>
          <span className="font-mono text-[#C86432]">{data.totalAmount?.value || "0.00"}</span>
        </div>
      </div>
    </div>
  );
};

const renderTableNode = (data: any) => {
  const headers = Array.isArray(data.headers) ? data.headers : [];
  const rows = Array.isArray(data.rows) ? data.rows : [];

  return (
    <div className="flex flex-col gap-3.5 text-stone-700 dark:text-stone-300">
      <div className="p-3 rounded-xl border border-stone-150 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-900/40 flex items-center justify-between">
        <div>
          <span className="text-[9.5px] font-bold uppercase text-stone-400 block pb-0.5">Grid Title</span>
          <h4 className="text-xs font-bold text-stone-800 dark:text-white">{data.tableName?.value || "Structured Data Matrix"}</h4>
        </div>
        {data.tableName?.confidence !== undefined && <ConfidenceMeter value={data.tableName?.confidence} />}
      </div>

      <div className="border border-stone-150 dark:border-stone-800 rounded-2xl overflow-x-auto bg-stone-50/10">
        <table className="w-full text-[11px] text-left text-stone-550 dark:text-stone-400 border-collapse">
          <thead>
            <tr className="bg-stone-100 dark:bg-stone-800/80 text-[9px] font-bold uppercase tracking-wider text-stone-500 border-b dark:border-stone-800">
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
          <tbody className="divide-y divide-stone-150 dark:divide-stone-800/60">
            {rows.length === 0 ? (
              <tr>
                <td colSpan={headers.length || 1} className="p-3 text-center text-stone-400 italic">No structured rows.</td>
              </tr>
            ) : (
              rows.map((row: any, rIdx: number) => {
                const cells = Array.isArray(row.cells) ? row.cells : [];
                return (
                  <tr key={rIdx} className="hover:bg-stone-100/5">
                    {cells.map((cell: any, cIdx: number) => (
                      <td key={cIdx} className="p-2.5">
                        <div className="flex flex-col gap-0.5">
                          <span className="font-medium text-stone-800 dark:text-stone-200">{cell.value || ""}</span>
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

const renderGeneralOcrNode = (data: any) => {
  const keyBlocks = Array.isArray(data.keyBlocks) ? data.keyBlocks : [];
  return (
    <div className="flex flex-col gap-3.5 text-stone-700 dark:text-stone-300">
      <div className="p-3 rounded-xl border border-stone-150 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-900/40 grid grid-cols-2 gap-3">
        <div>
          <span className="text-[9.5px] uppercase font-bold text-stone-400 block mb-0.5 font-sans">Title Code</span>
          <span className="text-xs font-bold text-stone-800 dark:text-white">{data.documentTitle?.value || "N/A"}</span>
          {data.documentTitle?.confidence !== undefined && <ConfidenceMeter value={data.documentTitle?.confidence} />}
        </div>
        <div>
          <span className="text-[9.5px] uppercase font-bold text-stone-400 block mb-0.5 font-sans">Detected Language</span>
          <span className="text-xs font-bold text-stone-800 dark:text-white">{data.detectedLanguage?.value || "N/A"}</span>
          {data.detectedLanguage?.confidence !== undefined && <ConfidenceMeter value={data.detectedLanguage?.confidence} />}
        </div>
      </div>

      <div className="flex flex-col gap-2.5 mt-1">
        <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 font-sans">Blocks</span>
        <div className="flex flex-col gap-2.5">
          {keyBlocks.map((blk: any, idx: number) => (
            <div key={idx} className="p-2.5 rounded-xl border border-stone-150 dark:border-stone-800">
              <span className="text-xs font-extrabold text-[#C86432] block mb-1">{blk.heading?.value || `Content Block #${idx + 1}`}</span>
              <p className="text-[11px] text-stone-550 leading-relaxed font-sans">{blk.content?.value || ""}</p>
            </div>
          ))}
        </div>
      </div>

      {data.rawText?.value && (
        <div className="mt-1 text-[11px] border-t dark:border-stone-800 pt-2.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block mb-1 font-sans">Raw Fallback</span>
          <pre className="p-2.5 border rounded-xl bg-stone-100/40 dark:bg-stone-900/40 font-mono text-[9.5px] leading-relaxed whitespace-pre-wrap overflow-x-auto text-stone-500">
            {data.rawText.value}
          </pre>
        </div>
      )}
    </div>
  );
};

const renderVisualStructuredResult = (extractedText: string, resultDocumentType: string) => {
  try {
    const parsed = JSON.parse(extractedText);
    switch (resultDocumentType) {
      case "invoice":
        return renderInvoiceNode(parsed);
      case "contract":
        return renderContractNode(parsed);
      case "resume":
        return renderResumeNode(parsed);
      case "receipt":
        return renderReceiptNode(parsed);
      case "table":
        return renderTableNode(parsed);
      case "general_ocr":
      default:
        return renderGeneralOcrNode(parsed);
    }
  } catch (e) {
    return (
      <div className="p-3 border border-rose-150/40 bg-rose-50/10 rounded-xl text-[11px] text-rose-500 flex flex-col gap-1.5">
        <p className="font-bold uppercase tracking-wider text-[10px]">JSON Output Parsing Blocked</p>
        <p className="text-stone-400 font-sans">The server processed your request as structured data but the response isn&apos;t directly visualizable (likely raw unstructured format). Showing fallback text representation:</p>
        <pre className="p-2.5 bg-stone-950 text-stone-300 font-mono text-[9.5px] rounded-lg whitespace-pre-wrap">
          {extractedText}
        </pre>
      </div>
    );
  }
};

export default function Home() {
  const [activeView, setActiveView] = useState<"home" | "workspace">("home");
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

  const selectSimPreset = (idx: number) => {
    setSimSelectedPreset(idx);
    setSimIsLoading(true);
    setTimeout(() => {
      const p = DEMO_PRESETS[idx];
      setSimText(p[simSelectedMode as keyof DemoPreset] || p.raw);
      setSimIsLoading(false);
    }, 250);
  };

  const selectSimMode = (mode: string) => {
    setSimSelectedMode(mode);
    setSimIsLoading(true);
    setTimeout(() => {
      const p = DEMO_PRESETS[simSelectedPreset];
      setSimText(p[mode as keyof DemoPreset] || p.raw);
      setSimIsLoading(false);
    }, 250);
  };

  const dropRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);
  const [dragOver, setDragOver] = useState<boolean>(false);

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
    const textToCopy = isEditing ? editedText : extractedText;
    navigator.clipboard.writeText(textToCopy);
    setCopyFeedback(true);
    setTimeout(() => setCopyFeedback(false), 2000);
  };

  const downloadTextFile = (ext: "md" | "txt") => {
    const textContent = isEditing ? editedText : extractedText;
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
    const textContent = isEditing ? editedText : extractedText;
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
                  : "text-stone-500 hover:text-stone-850 dark:text-stone-400 dark:hover:text-stone-100"
              }`}
            >
              {t.navOverview}
            </button>
            <button
              onClick={() => setActiveView("workspace")}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                activeView === "workspace"
                  ? "bg-[#C86432]/10 text-[#C86432]"
                  : "text-stone-500 hover:text-stone-850 dark:text-stone-400 dark:hover:text-stone-100"
              }`}
            >
              {t.navWorkspace}
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
                          ? "bg-[#1d1714] text-stone-300 border border-stone-850"
                          : "bg-white text-stone-700 border border-stone-150"
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
                          ? "bg-[#1d1714] text-stone-300 border border-stone-850"
                          : "bg-white text-stone-700 border border-stone-150"
                      }`}
                    >
                      <Layers className="w-4 h-4" />
                      {t.navWorkspace}
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
                            ? "bg-[#1d1714] border-stone-850 text-stone-400"
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
                            ? "bg-[#1d1714] border-stone-850 text-stone-400"
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
                            ? "bg-[#1d1714] border-stone-850 text-stone-400"
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
              {/* Cozy Hero Container */}
              <section className="text-center max-w-4xl mx-auto flex flex-col items-center pt-6 pb-2 gap-5">
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

              {/* Three-step timeline section */}
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
                              <span className="text-[10px] text-stone-550 dark:text-stone-400">Preset Interactive Simulation File</span>
                            </div>
                          </button>
                        ))}
                      </div>

                      {/* Formula Selector */}
                      <div className="border-t border-[#eeded5] dark:border-[#332822] pt-4 mt-2">
                        <h3 className="text-xs font-mono font-bold uppercase tracking-wider mb-2.5 text-[#C86432]">2. Choose Formula Mode</h3>
                        <div className="grid grid-cols-2 gap-2">
                          {["raw", "layout", "summary", "key-value"].map((mode) => (
                            <button
                              key={mode}
                              onClick={() => selectSimMode(mode)}
                              className={`py-2 px-3 rounded-xl text-xs font-bold uppercase transition-all cursor-pointer ${
                                simSelectedMode === mode
                                  ? "bg-[#C86432] text-white"
                                  : isDarkMode
                                  ? "bg-[#1d1714]/30 hover:bg-[#1d1714]/85 text-[#cbb9af]"
                                  : "bg-white/40 hover:bg-white text-[#7d6b60]"
                              }`}
                            >
                              {mode === "raw" ? "Plain text" : mode === "layout" ? "Markdown" : mode === "summary" ? "Summary" : "Table"}
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
                    </div>
                  </div>

                  {/* Simulated terminal result output (Right) */}
                  <div className="lg:col-span-7 flex flex-col">
                    <div className="bg-[#110D0B] border border-[#2A1E19] text-amber-100 rounded-3xl p-6 flex flex-col h-full min-h-[350px] shadow-2xl relative overflow-hidden">
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
                            <motion.div
                              key="simtext"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              className="whitespace-pre-wrap select-text selection:bg-[#C86432]"
                            >
                              {simText}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      <div className="absolute bottom-3 right-3 bg-[#C86432]/10 text-[#D97736] px-2 py-0.5 rounded text-[9px] font-bold border border-[#C86432]/20">
                        {simSelectedMode.toUpperCase()} VIEW
                      </div>
                    </div>
                  </div>

                </div>
              </section>

              {/* Bento information specification grid */}
              <section className="flex flex-col gap-8 pb-8">
                <div className="text-center max-w-xl mx-auto gap-2 flex flex-col">
                  <h2 className="text-xl sm:text-2xl font-bold tracking-tight">{t.bentoHeader}</h2>
                  <p className={`text-xs ${isDarkMode ? "text-[#cbb9af]" : "text-[#7d6b60]"}`}>
                    {t.bentoSub}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className={`p-8 rounded-3xl border flex flex-col gap-3 ${
                    isDarkMode ? "bg-[#1d1714]/40 border-[#332822]" : "bg-white/40 border-[#eeded5]"
                  }`}>
                    <BookOpen className="w-7 h-7 text-[#C86432]" />
                    <h3 className="font-bold text-sm mt-1">{t.bentoCard1Title}</h3>
                    <p className={`text-xs leading-relaxed ${isDarkMode ? "text-[#cbb9af]" : "text-[#7d6b60]"}`}>{t.bentoCard1Desc}</p>
                  </div>
                  <div className={`p-8 rounded-3xl border flex flex-col gap-3 ${
                    isDarkMode ? "bg-[#1d1714]/40 border-[#332822]" : "bg-white/40 border-[#eeded5]"
                  }`}>
                    <ShieldCheck className="w-7 h-7 text-emerald-600" />
                    <h3 className="font-bold text-sm mt-1">{t.bentoCard2Title}</h3>
                    <p className={`text-xs leading-relaxed ${isDarkMode ? "text-[#cbb9af]" : "text-[#7d6b60]"}`}>{t.bentoCard2Desc}</p>
                  </div>
                  <div className={`p-8 rounded-3xl border flex flex-col gap-3 ${
                    isDarkMode ? "bg-[#1d1714]/40 border-[#332822]" : "bg-white/40 border-[#eeded5]"
                  }`}>
                    <FileCheck className="w-7 h-7 text-[#C86432]" />
                    <h3 className="font-bold text-sm mt-1">{t.bentoCard3Title}</h3>
                    <p className={`text-xs leading-relaxed ${isDarkMode ? "text-[#cbb9af]" : "text-[#7d6b60]"}`}>{t.bentoCard3Desc}</p>
                  </div>
                </div>
              </section>

            </motion.div>
          ) : (
            
            /* ORIGINAL INTELLECTUAL WORKSPACE WITH COZY PALETTE */
            <motion.div
              key="workspace"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch"
            >
              
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
                        <p className={`text-[10px] mt-1 ${isDarkMode ? "text-stone-400" : "text-stone-550"}`}>
                          {t.dropZoneSubText}
                        </p>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="preview"
                        className={`border rounded-2xl overflow-hidden relative flex flex-col min-h-[220px] justify-center items-center ${
                          isDarkMode ? "border-stone-850 bg-stone-900/10" : "border-stone-200 bg-white"
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
                            <span className="text-xs font-bold font-mono text-stone-550 uppercase tracking-widest">PDF DOCUMENT</span>
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
                      <p className={`text-xs max-w-sm mt-1.5 leading-relaxed ${isDarkMode ? "text-stone-400" : "text-stone-550"}`}>
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
                                    isCompleted ? "bg-[#C86432]" : isDarkMode ? "bg-stone-850" : "bg-stone-150"
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
                              <div className="px-5 pt-3.5 pb-2 border-b border-stone-150 dark:border-stone-800 flex items-center justify-between bg-stone-100/10 dark:bg-stone-900/10">
                                <span className="text-[10.5px] font-bold uppercase tracking-wider text-stone-400">⚡ Structured Mode</span>
                                <div className="flex items-center gap-1 bg-stone-100 dark:bg-stone-900 border dark:border-stone-850 p-0.5 rounded-xl text-[10px]">
                                  <button
                                    onClick={() => setIsJsonVisualMode(true)}
                                    className={`px-3 py-1 font-bold rounded-lg transition-all cursor-pointer ${
                                      isJsonVisualMode
                                        ? "bg-[#C86432] text-white"
                                        : "text-stone-400 hover:text-stone-550"
                                    }`}
                                  >
                                    Visual Report
                                  </button>
                                  <button
                                    onClick={() => setIsJsonVisualMode(false)}
                                    className={`px-3 py-1 font-bold rounded-lg transition-all cursor-pointer ${
                                      !isJsonVisualMode
                                        ? "bg-[#C86432] text-white"
                                        : "text-stone-400 hover:text-stone-550"
                                    }`}
                                  >
                                    Raw JSON Code
                                  </button>
                                </div>
                              </div>
                            )}

                            <div className="flex-1 overflow-y-auto p-5 max-h-[380px] text-xs">
                              {isEditing ? (
                                <div className="flex flex-col gap-1.5 h-full">
                                  <span className="text-[10px] font-bold text-[#C86432]">EDIT MODE</span>
                                  <textarea
                                    value={editedText}
                                    onChange={(e) => setEditedText(e.target.value)}
                                    className={`w-full min-h-[220px] p-4 text-xs font-mono rounded-xl border focus:outline-hidden ${
                                      isDarkMode ? "border-stone-800 bg-stone-950 text-white" : "border-stone-200 bg-stone-50 text-stone-850"
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
                                    onClick={() => { setEditedText(extractedText); setIsEditing(true); }}
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

                                <div className="flex items-center border p-0.5 rounded-xl border-[#eeded5] dark:border-[#332822] bg-stone-150/40 text-[10px]">
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
                                        isDarkMode ? "border-stone-850 bg-stone-900/20 hover:bg-stone-900" : "border-stone-200 bg-white hover:bg-stone-50"
                                      }`}
                                    >
                                      {t.chatSample1}
                                    </button>
                                    <button
                                      onClick={() => setChatInput(t.chatPromptInvoice)}
                                      className={`p-2.5 rounded-xl text-left border text-[11px] font-bold cursor-pointer ${
                                        isDarkMode ? "border-stone-850 bg-stone-900/20 hover:bg-stone-900" : "border-stone-200 bg-white hover:bg-stone-50"
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
                                      msg.role === "user" ? "bg-[#C86432] text-white" : isDarkMode ? "bg-stone-950 text-stone-200 border border-stone-850" : "bg-stone-50 text-stone-800 border"
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
                                  isDarkMode ? "border-stone-800 bg-[#14100e] text-white" : "border-stone-200 bg-white text-stone-850"
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

            </motion.div>
          )}
        </AnimatePresence>

      </div>

      {/* Footer Segment */}
      <footer className={`border-t py-6 px-12 text-center text-xs transition-all duration-300 ${
        isDarkMode ? "border-[#332822]/40 bg-[#14100e] text-stone-400" : "border-[#eeded5]/60 bg-white/30 text-stone-550"
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
