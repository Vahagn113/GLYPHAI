import { Type } from "@google/genai";
import { ExtractionModeConfig, buildConfidenceFieldSchema } from "./types";

export const contractAnalyzer: ExtractionModeConfig = {
  id: "contract",
  name: "Contract Analysis",
  description: "Examines legal agreements for key terms, dates, signatories, Governing Law, and liability clauses.",
  systemInstruction: `You are an expert legal assistant specializing in contract clause analysis.
Analyze the provided document and extract the relevant fields.
Return a structured representation of the contract including:
1. Executive Summary: Overarching purpose and summary.
2. Important Dates: Milestones, effective, expiration, and notice period deadlines.
3. Parties: Key entities involved.
4. Key Obligations: Core obligations of each party.
5. Identified Risks: Liability limits, potential legal risks, strict parameters or missing coverage.
6. Clauses: Crucial legal conditions (e.g. Governing Law, Termination Notice, Liability Cap).
For numerical, date, and key text fields, attach a confidence score as a float from 0.0 to 1.0.`,
  responseSchema: {
    type: Type.OBJECT,
    properties: {
      contractTitle: buildConfidenceFieldSchema("The legal title or name of the agreement."),
      summary: buildConfidenceFieldSchema("A concise 2-3 sentence executive summary of the entire contract."),
      effectiveDate: buildConfidenceFieldSchema("The starting validation date of the contract."),
      expirationDate: buildConfidenceFieldSchema("The ending/termination date of the contract."),
      importantDates: {
        type: Type.ARRAY,
        description: "List of all critical dates, milestones, renewal notifications, or deadline events mentioned.",
        items: {
          type: Type.OBJECT,
          properties: {
            event: buildConfidenceFieldSchema("The event description associated with this date."),
            dateValue: buildConfidenceFieldSchema("The calendar date text or duration."),
          },
          required: ["event", "dateValue"],
        },
      },
      parties: {
        type: Type.ARRAY,
        description: "The legal entities or signatories involved in the contract.",
        items: {
          type: Type.OBJECT,
          properties: {
            name: buildConfidenceFieldSchema("The legal name of the party."),
            role: buildConfidenceFieldSchema("The role of the party (e.g. Client, Vendor, Employer, Contractor)."),
          },
          required: ["name", "role"],
        },
      },
      governingLaw: buildConfidenceFieldSchema("The specific jurisdiction or governing law (e.g. Delaware, UK)."),
      terminationNoticePeriod: buildConfidenceFieldSchema("Minimum notice period required to terminate (e.g. 30 days)."),
      liabilityCap: buildConfidenceFieldSchema("The liability cap amount or limitation of liability clause details."),
      keyObligations: {
        type: Type.ARRAY,
        description: "List of critical obligations or performance requirements for the parties.",
        items: {
          type: Type.OBJECT,
          properties: {
            partyName: buildConfidenceFieldSchema("The party responsible for this obligation."),
            name: buildConfidenceFieldSchema("The obligation summary title."),
            detail: buildConfidenceFieldSchema("Full description of the obligation requirement."),
          },
          required: ["partyName", "name", "detail"],
        },
      },
      risks: {
        type: Type.ARRAY,
        description: "Potential risks, penalties, visual liabilities, or high-risk sections identified.",
        items: {
          type: Type.OBJECT,
          properties: {
            riskFactor: buildConfidenceFieldSchema("Title of the risk or issue."),
            severity: buildConfidenceFieldSchema("The level of risk (e.g. High, Medium, Low)."),
            detail: buildConfidenceFieldSchema("Detailed explanation of the risk and potential impact."),
          },
          required: ["riskFactor", "severity", "detail"],
        },
      },
      keyClauses: {
        type: Type.ARRAY,
        description: "Other critical underlying clauses or boilerplate adjustments extracted.",
        items: {
          type: Type.OBJECT,
          properties: {
            title: buildConfidenceFieldSchema("The clause title (e.g. Indemnification, Force Majeure, Confidentiality)."),
            content: buildConfidenceFieldSchema("Extract or summarization of the clause content."),
          },
          required: ["title", "content"],
        },
      },
    },
    required: [
      "contractTitle",
      "summary",
      "effectiveDate",
      "expirationDate",
      "importantDates",
      "parties",
      "governingLaw",
      "terminationNoticePeriod",
      "liabilityCap",
      "keyObligations",
      "risks",
      "keyClauses",
    ],
  },
};

