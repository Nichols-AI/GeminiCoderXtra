import { GoogleGenerativeAI } from "@google/generative-ai";
import { AIProvider } from "./types";

export class GoogleAIProvider implements AIProvider {
  private genAI: GoogleGenerativeAI;
  
  supportedModels = ["gemini-pro"];

  constructor() {
    const apiKey = process.env.GOOGLE_AI_API_KEY;
    if (!apiKey) {
      throw new Error("GOOGLE_AI_API_KEY is required for GoogleAIProvider");
    }
    this.genAI = new GoogleGenerativeAI(apiKey);
  }

  async generateStream(prompt: string): Promise<ReadableStream> {
    const model = this.genAI.getGenerativeModel({ model: "gemini-pro" });
    const geminiStream = await model.generateContentStream(prompt);

    return new ReadableStream({
      async start(controller) {
        for await (const chunk of geminiStream.stream) {
          const chunkText = chunk.text();
          controller.enqueue(new TextEncoder().encode(chunkText));
        }
        controller.close();
      },
    });
  }
}
