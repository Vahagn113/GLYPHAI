import { Type } from "@google/genai";
import { ExtractionModeConfig, buildConfidenceFieldSchema } from "./types";

export const resumeParser: ExtractionModeConfig = {
  id: "resume",
  name: "CV / Resume Parsing",
  description: "Structures resumes and CVs into profiles, categorizing contact details, experience, skills, and education history.",
  systemInstruction: `You are an expert HR recruitment assistant specializing in Parsing Resumes (CVs).
Extract the key details from the resume and map them to the structured properties.
For all key text and numeric values, compute your extraction confidence rate as a float between 0.0 and 1.0.`,
  responseSchema: {
    type: Type.OBJECT,
    properties: {
      candidateName: buildConfidenceFieldSchema("The full name of the candidate."),
      email: buildConfidenceFieldSchema("The candidate's primary contact email."),
      phone: buildConfidenceFieldSchema("The candidate's contact phone number."),
      location: buildConfidenceFieldSchema("The candidate's physical state, city, or country of residence."),
      summary: buildConfidenceFieldSchema("A concise summary of the candidate's professional profile, goals, or pitch."),
      skills: {
        type: Type.ARRAY,
        description: "Grouped categories of skillsets listed (e.g., Programming, Languages, Management).",
        items: {
          type: Type.OBJECT,
          properties: {
            category: buildConfidenceFieldSchema("Skill category title."),
            skillsList: {
              type: Type.ARRAY,
              description: "Array of individual skill names under this category.",
              items: { type: Type.STRING },
            },
          },
          required: ["category", "skillsList"],
        },
      },
      education: {
        type: Type.ARRAY,
        description: "The list of school degrees, certificate trainings, or university milestones.",
        items: {
          type: Type.OBJECT,
          properties: {
            institution: buildConfidenceFieldSchema("The name of the university, academy, or school."),
            degree: buildConfidenceFieldSchema("The degree or certificate title earned (e.g. Master's in Computer Science)."),
            graduationYear: buildConfidenceFieldSchema("Year of graduation (e.g., '2023' or 'Completed')."),
          },
          required: ["institution", "degree", "graduationYear"],
        },
      },
      experience: {
        type: Type.ARRAY,
        description: "The professional work experience items listed in chronological sequence.",
        items: {
          type: Type.OBJECT,
          properties: {
            company: buildConfidenceFieldSchema("The name of the employer firm or organization."),
            role: buildConfidenceFieldSchema("The professional title or designation held."),
            startDate: buildConfidenceFieldSchema("Start date of employment (e.g., 'Jan 2021' or '2021')."),
            endDate: buildConfidenceFieldSchema("End date of employment (e.g., 'Present' or 'Dec 2023')."),
            description: buildConfidenceFieldSchema("Short narrative explaining responsibilities, major achievements, and tasks completed in this role."),
          },
          required: ["company", "role", "startDate", "endDate", "description"],
        },
      },
    },
    required: ["candidateName", "email", "phone", "location", "summary", "skills", "education", "experience"],
  },
};
