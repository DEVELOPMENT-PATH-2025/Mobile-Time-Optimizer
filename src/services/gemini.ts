export const analyzeUsage = async (domain: string, usageData: { app: string; time: string }[]) => {
  try {
    const res = await fetch("/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ domain, usageData })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "API request failed");
    return data;
  } catch (error: any) {
    console.error("AI Analysis failed", error);
    return { error: error.message || "Failed to connect to AI service" };
  }
};

export const sendChatMessage = async (domain: string, userName: string, history: any[], message: string) => {
  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ domain, userName, history, message })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "API request failed");
    return data.text;
  } catch (err: any) {
    console.error(err);
    throw err;
  }
};
