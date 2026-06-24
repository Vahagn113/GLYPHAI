import type { HighlightBox } from "./types";

export const DOCUMENT_HIGHLIGHT_MAP: Record<string, HighlightBox[]> = {
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
