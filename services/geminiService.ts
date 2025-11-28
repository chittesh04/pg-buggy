import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

const SYSTEM_INSTRUCTION = `You are the AI Virtual Warden for a Hostel Management System.
Your role is to assist students and administrators with common queries.
- Be polite, concise, and helpful.
- Common topics: Room allocation, Mess menu (Breakfast: 8-9AM, Lunch: 12-2PM, Dinner: 8-9PM), Gate closing time (10 PM), Complaints procedure.
- If asked about technical issues, suggest contacting the system admin.
- Keep answers under 50 words unless asked for details.`;

export const sendMessageToGemini = async (userMessage: string): Promise<string> => {
  try {
    if (!apiKey) {
      return "API Key is missing. Please configure the environment.";
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: userMessage,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      }
    });

    return response.text || "I couldn't generate a response. Please try again.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Sorry, I'm having trouble connecting to the hostel network right now.";
  }
};