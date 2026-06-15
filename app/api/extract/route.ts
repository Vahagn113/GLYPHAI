import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";
import { CUSTOM_EXTRACTION_MODES_MAP } from "../../../lib/extractionModes";

// Initialize the Google GenAI client
// Setting User-Agent header to 'aistudio-build' as required by instructions
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

const MODELS_TO_TRY = [
  "gemini-3.1-flash-lite",
  "gemini-3.5-flash",
  "gemini-flash-latest",
];

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function generateWithFallbackAndRetry(parts: any[], config: any) {
  let lastError: any = null;

  for (const model of MODELS_TO_TRY) {
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        console.log(`[Extract API] Trying model ${model} (attempt ${attempt}/2)`);
        const response = await ai.models.generateContent({
          model,
          contents: {
            parts,
          },
          config,
        });
        if (response && response.text) {
          return response;
        }
      } catch (err: any) {
        lastError = err;
        const errMsg = err?.message || err?.toString() || "";
        console.warn(`[Extract API] ${model} attempt ${attempt} failed: ${errMsg}`);
        
        if (errMsg.includes("key is invalid") || errMsg.includes("not configured") || errMsg.includes("API_KEY")) {
          throw err;
        }
        await sleep(600 * attempt);
      }
    }
  }

  throw lastError || new Error("All extraction fallback models failed.");
}

export async function POST(req: NextRequest) {
  try {
    const { file, mimeType, mode, customPrompt, publishingMethod, documentType } = await req.json();

    if (!file) {
      return NextResponse.json(
        { error: "No file content was provided in the request." },
        { status: 400 }
      );
    }

    if (!mimeType) {
      return NextResponse.json(
        { error: "File MIME type is required to process the document." },
        { status: 400 }
      );
    }

    // Check if the API key is configured
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        {
          error:
            "Gemini API key is not configured. Please add GEMINI_API_KEY to your environment variables or secrets.",
          isConfigError: true,
        },
        { status: 500 }
      );
    }

    // Clean base64 string if it contains the Data URL prefix
    let cleanBase64 = file;
    if (file.includes(";base64,")) {
      cleanBase64 = file.split(";base64,").pop() || "";
    }

    if (!cleanBase64) {
      return NextResponse.json(
        { error: "Could not parse file data." },
        { status: 400 }
      );
    }

    // Determine the documentType (auto-detect or user-selected)
    let finalDocType = documentType;
    let autoDetected = false;

    if (documentType === "auto") {
      try {
        console.log(`[Auto-Detect] Analyzing document using ${MODELS_TO_TRY[0]} to classify type...`);
        const classificationPrompt = `Analyze this document and classify its type into EXACTLY one of the following string categories. Do not include any other text, quotes, or markdown. Output only the category name:
- "invoice" (for invoices, utility bills, billing sheets)
- "resume" (for human resource resumes, curriculums vitae (CVs), professional profiles)
- "contract" (for legal service agreements, contracts, covenants, NDAs, lease agreements)
- "receipt" (for sales slips, checkout receipts, retail tickets)
- "table" (for lists of items structured as matrices, tabular sheet views, financial charts with columns)
- "general_ocr" (for letters, general pages, books, transcripts, handwriting, or if it doesn't clearly fit any above)

Output category:`;

        const classificationResponse = await ai.models.generateContent({
          model: MODELS_TO_TRY[0],
          contents: {
            parts: [
              { inlineData: { data: cleanBase64, mimeType: mimeType } },
              { text: classificationPrompt }
            ]
          },
          config: {
            temperature: 0.0,
          }
        });

        const classificationText = classificationResponse.text?.trim().toLowerCase() || "general_ocr";
        console.log(`[Auto-Detect] Classified output: "${classificationText}"`);

        if (classificationText.includes("invoice")) finalDocType = "invoice";
        else if (classificationText.includes("resume") || classificationText.includes("cv") || classificationText.includes("curriculum")) finalDocType = "resume";
        else if (classificationText.includes("contract") || classificationText.includes("agreement")) finalDocType = "contract";
        else if (classificationText.includes("receipt")) finalDocType = "receipt";
        else if (classificationText.includes("table") || classificationText.includes("spreadsheet")) finalDocType = "table";
        else finalDocType = "general_ocr";

        autoDetected = true;
        console.log(`[Auto-Detect] Determined document type: ${finalDocType}`);
      } catch (err) {
        console.error("[Auto-Detect] Classification failed, falling back to general_ocr:", err);
        finalDocType = "general_ocr";
      }
    }

    // Handle specialized extraction modes if finalDocType matches, except for general_ocr
    const isSpecialized = finalDocType && finalDocType !== "general_ocr" && CUSTOM_EXTRACTION_MODES_MAP[finalDocType];

    if (isSpecialized) {
      const config = CUSTOM_EXTRACTION_MODES_MAP[finalDocType];
      let systemInstruction = config.systemInstruction;
      if (customPrompt && customPrompt.trim().length > 0) {
        systemInstruction += `\n\nAdditional user guidelines: ${customPrompt}`;
      }

      const documentPart = {
        inlineData: {
          data: cleanBase64,
          mimeType: mimeType,
        },
      };

      const textPart = {
        text: "Perform high-quality structured extraction of this document according to the designated JSON schema rules. Write values in their original document language.",
      };

      const response = await generateWithFallbackAndRetry(
        [documentPart, textPart],
        {
          temperature: 0.1,
          systemInstruction,
          responseMimeType: "application/json",
          responseSchema: config.responseSchema,
        }
      );

      const extractedText = response.text || "";

      return NextResponse.json({
        text: extractedText,
        mode: mode,
        isSpecialized: true,
        documentType: finalDocType,
        autoDetected: autoDetected,
      });
    }

    // Build the instruction prompt based on the chosen mode
    let instruction = "";
    switch (mode) {
      case "layout":
        instruction =
          "Extract the text from this document while preserving its layout, tables, lists, and visual structures in clean Markdown format. Use proper headings, spacing, and tables where appropriate to match the spatial arrangement of the original document.";
        break;
      case "transcript":
        instruction =
          "Transcribe this handwritten or typed document into a clean, legible transcript. Correct any obvious handwriting misspellings, fix missing punctuation, and resolve shorthand acronyms or abbreviations for professional readability. Retain the original meaning perfectly.";
        break;
      case "summary":
        instruction =
          "Analyze the document and provide an organized structured summary. Identify the main title, list key points, capture important terms or names, and provide bullet points with action items or high-level summaries.";
        break;
      case "key-value":
        instruction =
          "Parse this document (e.g., invoices, receipts, forms, or checklists) and extract all structural data, core entities, numbers, and labels. Present the extracted information as a clean Markdown table of key-value attributes.";
        break;
      case "raw":
      default:
        instruction =
          "Extract the text from this image/document. Maintain the original word order and text lines as closely as possible. Provide exactly the extracted text without any introduction, headers, or commentary.";
        break;
    }

    // If there is a custom prompt, append or prepend it to focus the extraction
    if (customPrompt && customPrompt.trim().length > 0) {
      instruction += `\n\nAdditional user guidelines: ${customPrompt}`;
    }

    // Adapt document representation according to the chosen publishing method
    if (publishingMethod && publishingMethod !== "raw") {
      switch (publishingMethod) {
        case "email":
          instruction += "\n\nFinally, reformat the extracted copy into a highly polished Email Draft. Structure it with clean 'Subject:', 'Body:', and bulleted takeaways.";
          break;
        case "wiki":
          instruction += "\n\nFinally, reconstruct the extracted content into a detailed Wiki/Technical Documentation article. Use nested markdown headings, blockquotes, code-formatting for technical values, and high structural hierarchy.";
          break;
        case "blog":
          instruction += "\n\nFinally, transform the extracted content into an engaging editorial Blog Post. Frame it with an exciting header, smooth paragraph transitions, callout observations, and a quick summary/closing thought.";
          break;
        case "json":
          instruction += "\n\nFinally, organize the extracted text/data into a valid and structured JSON object. Include relevant key parameters such as 'title', 'date', 'entities', 'numerical_totals', and 'summary_draft'. Respond ONLY with the clean JSON string.";
          break;
      }
    }

    // Force output in the original/dominant language of the document
    if (mode !== "raw" || (publishingMethod && publishingMethod !== "raw")) {
      instruction += "\n\nCRITICAL LANGUAGE BOUNDARY RULE: First, identify the dominant/primary language of the source document itself (for example: Armenian, German, Spanish, Russian, etc.). You MUST write and structure the ENTIRE extraction and formatted output in that exact same dominant/original language of the source document. This means that all markdown headers, table column titles, extracted keys, action items, subject lines, body labels, takeaway summaries, outline parts, and descriptive text elements MUST be written directly in the document's original language (e.g., if the document is in Armenian, translate English structural formatting labels or templates like 'Subject:', 'Body:', 'Takeaways:', 'Summary', 'Key Points', 'Value' etc. to their Armenian equivalents). Maintain complete seamlessness so that the entire output reads naturally and professionally in the document's original language without introducing unauthorized English words or labels.";
    }

    // Structure the parts for multimodal input
    const documentPart = {
      inlineData: {
        data: cleanBase64,
        mimeType: mimeType,
      },
    };

    const textPart = {
      text: instruction,
    };

    const response = await generateWithFallbackAndRetry(
      [documentPart, textPart],
      {
        temperature: 0.1, // low temperature for precise text extraction
      }
    );

    const extractedText = response.text || "";

    return NextResponse.json({
      text: extractedText,
      mode: mode,
      isSpecialized: false,
      documentType: finalDocType,
      autoDetected: autoDetected,
    });
  } catch (error: any) {
    console.error("Extraction API Error:", error);
    return NextResponse.json(
      {
        error:
          error.message ||
          "An unexpected error occurred while parsing the file with Gemini API.",
        details: error.toString(),
      },
      { status: 500 }
    );
  }
}
