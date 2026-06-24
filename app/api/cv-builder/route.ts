import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

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

// Simple helper to race a promise against a timeout
const withTimeout = async <T>(p: Promise<T>, ms: number, label = "operation") => {
  let timer: NodeJS.Timeout;
  const timeoutPromise = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new Error(`${label} timed out after ${ms}ms`)), ms);
  });
  try {
    return await Promise.race([p, timeoutPromise]);
  } finally {
    clearTimeout(timer!);
  }
};

async function generateWithFallbackAndRetry(parts: any[], config: any) {
  let lastError: any = null;

  for (const model of MODELS_TO_TRY) {
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        console.log(`[CV Builder API] Trying model ${model} (attempt ${attempt}/2)`);
        // Limit each model attempt to 30s to avoid hanging on slow model responses
        const response = await withTimeout(
          ai.models.generateContent({
            model,
            contents: {
              parts,
            },
            config,
          }),
          30000,
          `generateContent ${model}`
        );

        if (response?.text) {
          return response;
        }
      } catch (err: any) {
        lastError = err;
        const errMsg = err?.message || err?.toString() || "";
        console.warn(`[CV Builder API] ${model} attempt ${attempt} failed: ${errMsg}`);

        if (errMsg.includes("key is invalid") || errMsg.includes("not configured") || errMsg.includes("API_KEY")) {
          throw err;
        }

        await sleep(600 * attempt);
      }
    }
  }

  throw lastError || new Error("All CV builder fallback models failed.");
}

export async function POST(req: NextRequest) {
  try {
    const {
      file,
      mimeType,
      rawNotes,
      targetPositions,
      template,
      tone,
      seniority,
      outputLanguage,
      focusAreas,
      customRequest,
    } = await req.json();

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        {
          error: "Gemini API key is not configured. Please add GEMINI_API_KEY to your environment variables or secrets.",
        },
        { status: 500 }
      );
    }

    const cleanRawNotes = typeof rawNotes === "string" ? rawNotes.trim() : "";
    const hasRawNotes = cleanRawNotes.length >= 20;
    const hasFileInput = Boolean(file && mimeType);

    if (!hasFileInput && !hasRawNotes) {
      return NextResponse.json(
        { error: "A CV file or raw bio/work notes are required." },
        { status: 400 }
      );
    }

    if (!Array.isArray(targetPositions) || targetPositions.length === 0) {
      return NextResponse.json(
        { error: "Select at least one target position before rebuilding the CV." },
        { status: 400 }
      );
    }

    const outputLanguageMap: Record<string, string> = {
      en: "English",
      ru: "Russian",
      am: "Armenian",
      es: "Spanish",
      fr: "French",
      de: "German",
    };
    const requestedOutputLanguage =
      outputLanguageMap[typeof outputLanguage === "string" ? outputLanguage : ""] || "English";
    const templateStyleMap: Record<string, string> = {
      "modern-ats": "Modern ATS - clean headings, recruiter-friendly structure, and strong keyword density",
      executive: "Executive - leadership profile with strategic impact and concise achievements",
      technical: "Technical - skills matrix, projects, tools, and engineering achievements up front",
      creative: "Creative Pro - stylish but export-safe for design, marketing, and content roles",
      graduate: "Graduate - education, projects, internships, and transferable skills emphasized",
    };
    const requestedTemplateStyle =
      templateStyleMap[typeof template === "string" ? template : ""] || templateStyleMap["modern-ats"];

    let cleanBase64 = "";
    if (hasFileInput) {
      cleanBase64 = file;
      if (file.includes(";base64,")) {
        cleanBase64 = file.split(";base64,").pop() || "";
      }

      if (!cleanBase64) {
        return NextResponse.json(
          { error: "Could not parse the uploaded CV file." },
          { status: 400 }
        );
      }
    }

    const instruction = `You are an expert resume writer, ATS optimization specialist, and technical recruiter.

  First parse the ${hasRawNotes ? "raw bio/work notes supplied by the user" : "uploaded CV"} and extract the candidate's factual details (name, contact, experience, education, skills, projects).
  Then rebuild a clean, production-ready, optimized CV tailored for these selected target positions: ${targetPositions.join(", ")}.

  Configuration:
  - Template style: ${requestedTemplateStyle}
  - Tone: ${tone || "confident professional"}
  - Seniority target: ${seniority || "adaptive to candidate evidence"}
  - Output language: ${requestedOutputLanguage}
  - Focus areas: ${Array.isArray(focusAreas) && focusAreas.length ? focusAreas.join(", ") : "ATS keywords, measurable impact, clarity, role alignment"}
  - User request: ${customRequest || "No extra request provided."}

  Important rules (do NOT include extra QA sections):
  - Return the final ready-to-use CV entirely in ${requestedOutputLanguage}. Translate section headings, summary, skills labels, and rewritten bullets into ${requestedOutputLanguage}, while preserving factual names, company names, email addresses, phone numbers, URLs, dates, product/tool names, and certifications as written when appropriate.
  - Keep facts faithful to the source CV. Do not invent employers, degrees, certifications, dates, metrics, or tools not supported by the original CV.
  - You may rewrite, reorganize, strengthen phrasing, and surface transferable skills.
  - Do NOT include sections titled "ATS Keyword Alignment", "ATS Keywords", "Missing Details To Add", or any meta checklist in the returned CV. The final output must be a ready-to-use CV without QA/meta sections.
  - Optimize for the selected positions with ATS-friendly keywords, concise bullets, action verbs, and measurable impact where evidence exists.
  - If the original CV lacks role-critical details, _do not fabricate_; instead, prefer stronger phrasing of existing facts.
  - If multiple positions are selected, create a single balanced master CV that can be lightly tailored later.
  - Return clean Markdown only (no code fences). The markdown should contain the candidate name, contact line, summary/profile, core skills, professional experience, projects (if present), education, and certifications (if present).
  `;

    const parts = hasRawNotes
      ? [
          {
            text: `${instruction}\n\nRaw bio/work notes supplied by the user:\n${cleanRawNotes}`,
          },
        ]
      : [
          {
            inlineData: {
              data: cleanBase64,
              mimeType,
            },
          },
          { text: instruction },
        ];

    console.log("[CV Builder API] Sending request to model (with 60s timeout)...");
    const response = await withTimeout(
      generateWithFallbackAndRetry(
        parts,
        {
          temperature: 0.25,
        }
      ),
      60000,
      "CV model generation"
    );
    console.log("[CV Builder API] Model returned response.");

    return NextResponse.json({
      text: response.text || "",
    });
  } catch (error: any) {
    console.error("CV Builder API Error:", error);
    return NextResponse.json(
      {
        error: error.message || "An unexpected error occurred while rebuilding the CV.",
        details: error.toString(),
      },
      { status: 500 }
    );
  }
}
