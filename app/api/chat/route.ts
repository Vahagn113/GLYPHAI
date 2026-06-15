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

async function chatWithFallbackAndRetry(contents: any[], config: any) {
  let lastError: any = null;

  for (const model of MODELS_TO_TRY) {
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        console.log(`[Chat API] Trying model ${model} (attempt ${attempt}/2)`);
        const response = await ai.models.generateContent({
          model,
          contents,
          config,
        });
        if (response && response.text) {
          return response;
        }
      } catch (err: any) {
        lastError = err;
        const errMsg = err?.message || err?.toString() || "";
        console.warn(`[Chat API] ${model} attempt ${attempt} failed: ${errMsg}`);
        
        if (errMsg.includes("key is invalid") || errMsg.includes("not configured") || errMsg.includes("API_KEY")) {
          throw err;
        }
        await sleep(600 * attempt);
      }
    }
  }

  throw lastError || new Error("All chat fallback models failed.");
}

export async function POST(req: NextRequest) {
  try {
    const { file, mimeType, messages } = await req.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: "Conversation history (messages) is required." },
        { status: 400 }
      );
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        {
          error:
            "Gemini API key is not configured. Please configure it in your secrets.",
        },
        { status: 500 }
      );
    }

    // Prepare contents array for the model
    // The Gemini contents array supports structured role-based conversation turns:
    // [{ role: 'user', parts: [...] }, { role: 'model', parts: [...] }]
    const contents: any[] = [];

    // Format all messages. We inject the file into the FIRST user message
    // so the model maintains the document context throughout the chat session.
    messages.forEach((msg, idx) => {
      const parts: any[] = [];

      // If it's the very first message and a file is provided, attach the file parts
      if (idx === 0 && file && mimeType) {
        let cleanBase64 = file;
        if (file.includes(";base64,")) {
          cleanBase64 = file.split(";base64,").pop() || "";
        }

        parts.push({
          inlineData: {
            data: cleanBase64,
            mimeType: mimeType,
          },
        });
      }

      // Add the message text
      parts.push({ text: msg.content });

      // Build turn content
      // Note: role in Gemini API must be "user" or "model"
      contents.push({
        role: msg.role === "assistant" ? "model" : "user",
        parts: parts,
      });
    });

    const response = await chatWithFallbackAndRetry(
      contents,
      {
        systemInstruction:
          "You are a helpful document assistant. Keep answers factual and precise based on the attached document or image. Reference parts of the document if needed. If information is not in the document, clarify that.",
        temperature: 0.2,
      }
    );

    return NextResponse.json({
      text: response.text || "",
    });
  } catch (error: any) {
    console.error("Chat API Error:", error);
    return NextResponse.json(
      {
        error:
          error.message ||
          "An unexpected error occurred during the document chat session.",
        details: error.toString(),
      },
      { status: 500 }
    );
  }
}
