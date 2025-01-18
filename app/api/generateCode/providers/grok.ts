import { AIProvider } from "./types";

export class GrokProvider implements AIProvider {
  private apiKey: string;
  
  supportedModels = ["grok-1"];

  constructor() {
    const apiKey = process.env.GROK_API_KEY;
    if (!apiKey) {
      throw new Error("GROK_API_KEY is required for GrokProvider");
    }
    this.apiKey = apiKey;
  }

  async generateStream(prompt: string): Promise<ReadableStream> {
    const response = await fetch("https://api.x.com/v1/grok/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${this.apiKey}`,
        "X-Grok-Version": "2024-03"
      },
      body: JSON.stringify({
        model: "grok-1",
        messages: [{ role: "user", content: prompt }],
        stream: true
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Grok API error: ${error.message}`);
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
                console.error("Error parsing Grok response:", e);
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
