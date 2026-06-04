import { Type } from "@google/genai";
import { ExtractionModeConfig, buildConfidenceFieldSchema } from "./types";

export const tableExtractor: ExtractionModeConfig = {
  id: "table",
  name: "Table Extraction",
  description: "Extracts tabular data matrices with headers and structural indexes into fully mapped grid cells.",
  systemInstruction: `You are an expert OCR and data grid analyst specializing in structured tables.
Identify and trace the grid layout of tabular data within the document.
For each heading cell and data cell, extract the string value and assign a confidence value of 0.0 to 1.0.`,
  responseSchema: {
    type: Type.OBJECT,
    properties: {
      tableName: buildConfidenceFieldSchema("Brief title, identifier, or subject of the table."),
      headers: {
        type: Type.ARRAY,
        description: "The header titles of the table in left-to-right order.",
        items: {
          type: Type.OBJECT,
          properties: {
            value: { type: Type.STRING, description: "The header name." },
            confidence: { type: Type.NUMBER, description: "Confidence score." },
          },
          required: ["value", "confidence"],
        },
      },
      rows: {
        type: Type.ARRAY,
        description: "The row data lists of the table in row-by-row sequence.",
        items: {
          type: Type.OBJECT,
          properties: {
            cells: {
              type: Type.ARRAY,
              description: "The table cells for this row, aligned with headers.",
              items: {
                type: Type.OBJECT,
                properties: {
                  value: { type: Type.STRING, description: "The CELL coordinate text value." },
                  confidence: { type: Type.NUMBER, description: "Confidence score." },
                },
                required: ["value", "confidence"],
              },
            },
          },
          required: ["cells"],
        },
      },
    },
    required: ["tableName", "headers", "rows"],
  },
};
