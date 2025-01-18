import { AIProvider } from "./types";

export class AnthropicProvider implements AIProvider {
  private apiKey: string;
  
  supportedModels = ["claude-3-opus-20240229", "claude-3-sonnet-20240229"];

  constructor() {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      throw new Error("ANTHROPIC_API_KEY is required for AnthropicProvider");
    }
    this.apiKey = apiKey;
  }

  async generateStream(prompt: string, options?: { model: string }): Promise<ReadableStream> {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": this.apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: options?.model || "claude-3-opus-20240229",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 4000,
        stream: true,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Anthropic API error: ${error.error?.message || JSON.stringify(error)}`);
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
            const lines = chunk.split('\n');
            for (const line of lines) {
              if (!line.trim()) continue;
              
              if (line.startsWith('data: ')) {
                const data = line.slice(6);
                if (data === '[DONE]') continue;

                try {
                  const parsed = JSON.parse(data);
                  if (parsed.type === 'content_block_delta' && parsed.delta?.text) {
                    controller.enqueue(new TextEncoder().encode(parsed.delta.text));
                  } else if (parsed.type === 'content_block_start' && parsed.content?.text) {
                    controller.enqueue(new TextEncoder().encode(parsed.content.text));
                  }
                } catch (e) {
                  // Ignore parsing errors for non-JSON lines (like 'event:' lines)
                  continue;
                }
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
