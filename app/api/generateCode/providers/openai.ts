import { AIProvider } from "./types";

export class OpenAIProvider implements AIProvider {
  private apiKey: string;
  
  supportedModels = [
    "gpt-4-turbo-preview",
    "gpt-4",
    "gpt-3.5-turbo",
    "gpt-4-vision-preview"
  ];

  constructor() {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error("OPENAI_API_KEY is required for OpenAIProvider");
    }
    this.apiKey = apiKey;
  }

  async generateStream(prompt: string, options?: { model: string }): Promise<ReadableStream> {
    const model = options?.model || "gpt-4-turbo-preview";

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${this.apiKey}`,
        "OpenAI-Beta": "assistants=v1"
      },
      body: JSON.stringify({
        model: model,
        messages: [{ role: "user", content: prompt }],
        stream: true
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`OpenAI API error: ${error.message}`);
    }

    return new ReadableStream({
      async start(controller) {
        const reader = response.body?.getReader();
        if (!reader) {
          controller.close();
          return;
        }

        const decoder = new TextDecoder();
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value);
            const lines = chunk
              .split("\n")
              .filter((line) => line.trim().startsWith("data: "));

            for (const line of lines) {
              const data = line.replace("data: ", "").trim();
              if (data === "[DONE]") continue;

              try {
                const parsed = JSON.parse(data);
                const content = parsed.choices[0]?.delta?.content || "";
                if (content) {
                  controller.enqueue(new TextEncoder().encode(content));
                }
              } catch (e) {
                console.error("Error parsing OpenAI response:", e);
              }
            }
          }
        } finally {
          reader.releaseLock();
          controller.close();
        }
      },
    });
  }
}
