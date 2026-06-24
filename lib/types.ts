export type Language = "en" | "ru" | "am";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export interface SampleDocument {
  name: string;
  type: string;
  mimeType: string;
  size: string;
  mockData: string;
  initialExtract: string;
}

export interface HighlightBox {
  field: string;
  label: string;
  top: number;
  left: number;
  width: number;
  height: number;
}

export interface DemoPreset {
  name: string;
  illustration: string;
  raw: string;
  layout: string;
  transcript: string;
  summary: string;
  "key-value": string;
}

export interface CvDemoPreset {
  name: string;
  illustration: string;
  markdown: string;
}

export interface ExtractionResult {
  text: string;
  documentType?: string;
  isSpecialized?: boolean;
}

export interface UploadedDocument {
  file?: File | null;
  preview: string;
  mimeType: string;
  name: string;
  size: string;
}

export interface CvResult {
  text: string;
  template: string;
  positions: string[];
}
