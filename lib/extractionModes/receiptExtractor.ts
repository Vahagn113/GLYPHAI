import { Type } from "@google/genai";
import { ExtractionModeConfig, buildConfidenceFieldSchema } from "./types";

export const receiptExtractor: ExtractionModeConfig = {
  id: "receipt",
  name: "Receipt Processing",
  description: "Perfect for lightweight retail and restaurant receipts, sorting items, merchant tags, VAT/taxes, tips, and totals.",
  systemInstruction: `You are an expert expense auditor agent specializing in receipts.
Extract key receipt details.
Assign clear confidence ratings as floats between 0.0 and 1.0 for each extracted data field.`,
  responseSchema: {
    type: Type.OBJECT,
    properties: {
      merchantName: buildConfidenceFieldSchema("The retail store, restaurant, or business name."),
      merchantAddress: buildConfidenceFieldSchema("Store location, branch address, or online origin."),
      merchantPhone: buildConfidenceFieldSchema("Store telephone contact number."),
      transactionDate: buildConfidenceFieldSchema("Date the transaction occurred (e.g., YYYY-MM-DD)."),
      transactionTime: buildConfidenceFieldSchema("Time the transaction was finalised (e.g., HH:MM)."),
      items: {
        type: Type.ARRAY,
        description: "Standard receipt purchase item logs.",
        items: {
          type: Type.OBJECT,
          properties: {
            description: buildConfidenceFieldSchema("Line item name or description."),
            quantity: buildConfidenceFieldSchema("The quantity purchased.", Type.NUMBER),
            totalPrice: buildConfidenceFieldSchema("The line item total amount.", Type.NUMBER),
          },
          required: ["description", "quantity", "totalPrice"],
        },
      },
      tax: buildConfidenceFieldSchema("Tax or VAT amount charged.", Type.NUMBER),
      tip: buildConfidenceFieldSchema("Optional tip, gratuity, or surcharge added to the payment.", Type.NUMBER),
      totalAmount: buildConfidenceFieldSchema("The net final value charged or paid as shown on the receipt.", Type.NUMBER),
      paymentMethod: buildConfidenceFieldSchema("The mode of payment (e.g. Card, Visa, Cash, Apple Pay)."),
    },
    required: ["merchantName", "merchantAddress", "merchantPhone", "transactionDate", "transactionTime", "items", "tax", "tip", "totalAmount", "paymentMethod"],
  },
};
