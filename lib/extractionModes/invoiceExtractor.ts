import { Type } from "@google/genai";
import { ExtractionModeConfig, buildConfidenceFieldSchema } from "./types";

export const invoiceExtractor: ExtractionModeConfig = {
  id: "invoice",
  name: "Invoice Extraction",
  description: "Accurately extracts vendor details, invoice numbers, line items, taxes, totals, and dating details.",
  systemInstruction: `You are an expert financial document assistant specializing in parsing invoices.
Extract the relevant fields from the invoice.
For each field, extract both the raw/computed value and assess your confidence in that extraction as a float between 0.0 (absolutely no confidence) and 1.0 (perfect, 100% confidence).
If a field is not present in the invoice, return an empty string or 0 as value and 0.0 as confidence.`,
  responseSchema: {
    type: Type.OBJECT,
    properties: {
      invoiceNumber: buildConfidenceFieldSchema("The unique identification number of the invoice."),
      invoiceDate: buildConfidenceFieldSchema("The release/issue date of the invoice (e.g. YYYY-MM-DD or formatted raw string)."),
      dueDate: buildConfidenceFieldSchema("The payment due date specified on the invoice."),
      vendorName: buildConfidenceFieldSchema("The company or vendor name issuing the invoice."),
      vendorAddress: buildConfidenceFieldSchema("The physical/mailing address of the issuing vendor."),
      billingName: buildConfidenceFieldSchema("The recipient name or customer organization name being billed."),
      billingAddress: buildConfidenceFieldSchema("The billing address of the recipient."),
      subtotal: buildConfidenceFieldSchema("The total amount of the invoice before taxes, fees, or discounts.", Type.NUMBER),
      tax: buildConfidenceFieldSchema("Tax amount or percentage applied to the invoice.", Type.NUMBER),
      totalAmount: buildConfidenceFieldSchema("The final grand total amount due on the invoice.", Type.NUMBER),
      currency: buildConfidenceFieldSchema("The currency of the money listed in the invoice (e.g. USD, EUR, RUB, AMD, etc.)."),
      lineItems: {
        type: Type.ARRAY,
        description: "List of individual items billed in the invoice.",
        items: {
          type: Type.OBJECT,
          properties: {
            description: buildConfidenceFieldSchema("Description or title of the billed product or service."),
            quantity: buildConfidenceFieldSchema("Quantity of items purchased.", Type.NUMBER),
            unitPrice: buildConfidenceFieldSchema("Price of a single unit.", Type.NUMBER),
            total: buildConfidenceFieldSchema("Total price for the line item (quantity * unitPrice).", Type.NUMBER),
          },
          required: ["description", "quantity", "unitPrice", "total"],
        },
      },
    },
    required: [
      "invoiceNumber",
      "invoiceDate",
      "dueDate",
      "vendorName",
      "vendorAddress",
      "billingName",
      "billingAddress",
      "subtotal",
      "tax",
      "totalAmount",
      "currency",
      "lineItems",
    ],
  },
};
