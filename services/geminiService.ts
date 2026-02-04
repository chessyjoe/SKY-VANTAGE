import { GoogleGenAI, Type } from "@google/genai";
import { MetricType, GeminiInsight } from '../types';

// Safely access the API key
const apiKey = process.env.API_KEY || '';

export const analyzeUrbanData = async (metric: MetricType): Promise<GeminiInsight> => {
  if (!apiKey) {
    return {
      title: "API Key Missing",
      content: "Please provide a valid Gemini API Key in the environment to unlock strategic insights.",
      recommendation: "Configuration Required"
    };
  }

  const ai = new GoogleGenAI({ apiKey });

  const prompt = `
    You are SkyVantage, an advanced AI urban strategist for Nairobi, Kenya.
    The user is viewing a 3D digital twin of Nairobi colored by the metric: ${metric.toUpperCase()}.
    
    If metric is PRICE: Red means expensive/prime, Green means affordable.
    If metric is TRAFFIC: Red means congested, Green means clear.
    
    Provide a brief, high-level strategic executive summary for a real estate investor.
    Focus on the correlation between this metric and investment opportunity in Nairobi's Westlands and CBD areas.
    
    Do not mention you are an AI. Be professional, futuristic, and concise.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            content: { type: Type.STRING },
            recommendation: { type: Type.STRING }
          },
          required: ["title", "content", "recommendation"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text) as GeminiInsight;

  } catch (error) {
    console.error("Gemini Analysis Failed", error);
    return {
      title: "Connection Offline",
      content: "Unable to establish uplink with SkyVantage Core. Using cached heuristics.",
      recommendation: "Retry Analysis"
    };
  }
};