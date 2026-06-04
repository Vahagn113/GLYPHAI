import { generalOcr } from "./generalOcr";
import { invoiceExtractor } from "./invoiceExtractor";
import { contractAnalyzer } from "./contractAnalyzer";
import { resumeParser } from "./resumeParser";
import { receiptExtractor } from "./receiptExtractor";
import { tableExtractor } from "./tableExtractor";
import { ExtractionModeConfig } from "./types";

export * from "./types";
export * from "./generalOcr";
export * from "./invoiceExtractor";
export * from "./contractAnalyzer";
export * from "./resumeParser";
export * from "./receiptExtractor";
export * from "./tableExtractor";

export const CUSTOM_EXTRACTION_MODES_MAP: Record<string, ExtractionModeConfig> = {
  general_ocr: generalOcr,
  invoice: invoiceExtractor,
  contract: contractAnalyzer,
  resume: resumeParser,
  receipt: receiptExtractor,
  table: tableExtractor,
};

export const CUSTOM_EXTRACTION_MODES_LIST: ExtractionModeConfig[] = [
  generalOcr,
  invoiceExtractor,
  contractAnalyzer,
  resumeParser,
  receiptExtractor,
  tableExtractor,
];
