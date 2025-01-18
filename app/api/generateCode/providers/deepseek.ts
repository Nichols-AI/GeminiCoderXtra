import { AIProvider } from "./types";

export class DeepSeekProvider implements AIProvider {
  private apiKey: string;
  
  supportedModels = ["deepseek-chat"];

  constructor() {
    const apiKey = process.env.DEEPSEEK_API_KEY;
    if (!apiKey) {
      throw new Error("DEEPSEEK_API_KEY is required for DeepSeekProvider");
    }
    this.apiKey = apiKey;
  }

  async generateStream(prompt: string, options?: { model: string }): Promise<ReadableStream> {
    const model = options?.model || "deepseek-chat";
    const apiEndpoint = "https://api.deepseek.com/v1/chat/completions";

    // Add specific instruction for code formatting
    const formattedPrompt = `${prompt}\n\nIMPORTANT: Your response must start with proper import statements using the 'import' keyword. For example: 'import React, { useState } from "react";'`;

    const response = await fetch(apiEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: model,
        messages: [{ role: "user", content: formattedPrompt }],
        stream: true,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`DeepSeek API error: ${error.message}`);
    }

    return new ReadableStream({
      async start(controller) {
        const reader = response.body?.getReader();
        if (!reader) {
          controller.close();
          return;
        }

        const decoder = new TextDecoder();
        let accumulatedCode = '';
        let seenImport = false;

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
                  // If we haven't seen an import statement yet, accumulate until we do
                  if (!seenImport) {
                    accumulatedCode += content;
                    if (accumulatedCode.includes('import React')) {
                      seenImport = true;
                      // Clean up any malformed imports
                      accumulatedCode = accumulatedCode.replace(/React,\s*{[^}]*}\s*from\s*['"]react['"];?/g, '');
                      if (!accumulatedCode.includes('import React')) {
                        accumulatedCode = 'import React, { useState } from "react";\n' + accumulatedCode;
                      }
                      controller.enqueue(new TextEncoder().encode(accumulatedCode));
                      accumulatedCode = '';
                    }
                  } else {
                    // After seeing import, stream normally but filter any additional React imports
                    if (!content.includes('React') || content.includes('import React')) {
                      controller.enqueue(new TextEncoder().encode(content));
                    }
                  }
                }
              } catch (e) {
                console.error("Error parsing DeepSeek response:", e);
              }
            }
          }

          // If we never saw an import statement, add one
          if (!seenImport && accumulatedCode) {
            const finalCode = 'import React, { useState } from "react";\n' + accumulatedCode;
            controller.enqueue(new TextEncoder().encode(finalCode));
          }
        } finally {
          reader.releaseLock();
          controller.close();
        }
      },
    });
  }
}
