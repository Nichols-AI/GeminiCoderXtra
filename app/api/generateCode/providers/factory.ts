import { MODEL_PROVIDER_MAP } from "./types";
import { GoogleAIProvider } from "./google";
import { DeepSeekProvider } from "./deepseek";
import { AnthropicProvider } from "./anthropic";
import { GrokProvider } from "./grok";
import { OpenAIProvider } from "./openai";
import type { AIProvider } from "./types";

export class ProviderFactory {
  private static providers: Record<string, AIProvider> = {};

  static getProvider(model: string): AIProvider {
    const providerType = MODEL_PROVIDER_MAP[model];
    if (!providerType) {
      throw new Error(`Unsupported model: ${model}`);
    }

    // Return cached provider instance if it exists
    if (this.providers[providerType]) {
      return this.providers[providerType];
    }

    // Create new provider instance
    switch (providerType) {
      case "google":
        this.providers[providerType] = new GoogleAIProvider();
        break;
      case "deepseek":
        this.providers[providerType] = new DeepSeekProvider();
        break;
      case "anthropic":
        this.providers[providerType] = new AnthropicProvider();
        break;
      case "grok":
        this.providers[providerType] = new GrokProvider();
        break;
      case "openai":
        this.providers[providerType] = new OpenAIProvider();
        break;
      default:
        throw new Error(`Unknown provider type: ${providerType}`);
    }

    return this.providers[providerType];
  }
}
