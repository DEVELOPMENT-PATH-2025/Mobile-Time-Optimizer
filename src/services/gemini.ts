import { GoogleGenAI } from "@google/genai";

const getAIClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is missing");
  }
  return new GoogleGenAI({ apiKey });
};

export const analyzeUsage = async (domain: string, usageData: { app: string; time: string }[]) => {
  const ai = getAIClient();
  const prompt = `
You are an AI Screen Time Optimizer. The user is a student pursuing: ${domain}.
Their current daily app usage is:
${usageData.map((u) => `- ${u.app}: ${u.time}`).join("\n")}

1. Analyze if this usage is aligned with their domain.
2. Provide a constructive suggestion for their highest usage app. If it's a social media or entertainment app (like Instagram), suggest a productive way to use it relevant to their domain (e.g., for a CS student using Instagram for 4 hours, suggest using it for software marketing or following tech channels).
3. Briefly tell them which apps should have high screen time and which should have low screen time for a student in their specific domain.

Format the response in JSON with this structure:
{
  "summary": "overall assessment",
  "constructiveSuggestion": "productive use of high-time app",
  "idealHighUsage": ["app1", "app2"],
  "idealLowUsage": ["app3", "app4"]
}
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.1-pro-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("AI Analysis failed", error);
    return null;
  }
};

export const createChatSession = () => {
  const ai = getAIClient();
  return ai.chats.create({
    model: "gemini-3.1-flash-lite", // Fast responses for chat
    config: {
      systemInstruction:
        "You are a strict but helpful digital & minimalistic screen time optimizer AI agent. You help students manage their app usage intelligently. Encourage them to align their screen time with their field of study. Give concise, direct, and actionable advice.",
    },
  });
};
