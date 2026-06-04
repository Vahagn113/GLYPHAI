import { Type } from "@google/genai";
import { ExtractionModeConfig, buildConfidenceFieldSchema } from "./types";

export const generalOcr: ExtractionModeConfig = {
  id: "general_ocr",
  name: "General OCR",
  description: "Standard document-agnostic optical character recognition with block categorization and confidence indices.",
  systemInstruction: `You are an expert OCR analysis system.
Transcribe and extract the text from the document. Organize the data into title, language context, and main structural content blocks.
Assesses your confidence between 0.0 and 1.0 for each extracted block.`,
  responseSchema: {
    type: Type.OBJECT,
    properties: {
      documentTitle: buildConfidenceFieldSchema("An identified title, heading, or general topic name of the document."),
      detectedLanguage: buildConfidenceFieldSchema("The primary language detected in this file (e.g., 'English', 'Russian', 'Armenian')."),
      rawText: buildConfidenceFieldSchema("The general, literal, block text transcript in line-by-line order."),
      keyBlocks: {
        type: Type.ARRAY,
        description: "Text block sections identified, such as paragraphs, callouts, or column segments.",
        items: {
          type: Type.OBJECT,
          properties: {
            heading: buildConfidenceFieldSchema("Heading, subtitle, or section label if any."),
            content: buildConfidenceFieldSchema("The block text paragraphs."),
          },
          required: ["heading", "content"],
        },
      },
    },
    required: ["documentTitle", "detectedLanguage", "rawText", "keyBlocks"],
  },
};
