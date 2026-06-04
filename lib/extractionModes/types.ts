import { Type } from "@google/genai";

export interface ConfidenceField<T = string> {
  value: T;
  confidence: number; // A float between 0 and 1, representing model confidence
}

// Common property schema builder for standard fields to avoid copy-paste
export const buildConfidenceFieldSchema = (description: string, valType: Type = Type.STRING) => ({
  type: Type.OBJECT,
  description,
  properties: {
    value: {
      type: valType,
      description: "The extracted value for this field.",
    },
    confidence: {
      type: Type.NUMBER,
      description: "Confidence score for the extraction (value between 0.0 and 1.0).",
    },
  },
  required: ["value", "confidence"],
});

export interface ExtractionModeConfig {
  id: string;
  name: string;
  description: string;
  systemInstruction: string;
  responseSchema: {
    type: Type;
    properties?: Record<string, any>;
    required?: string[];
    items?: any;
    description?: string;
  };
}
