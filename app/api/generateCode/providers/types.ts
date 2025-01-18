export interface AIProvider {
  generateStream(prompt: string, options?: any): Promise<ReadableStream>;
  supportedModels: string[];
}

export const MODEL_PROVIDER_MAP: Record<string, string> = {
  'gemini-pro': 'google',
  'deepseek-chat': 'deepseek',
  'claude-3-opus-20240229': 'anthropic',
  'claude-3-sonnet-20240229': 'anthropic',
  'grok-1': 'grok',
  'gpt-4-turbo-preview': 'openai',
  'gpt-4': 'openai',
  'gpt-3.5-turbo': 'openai',
  'gpt-4-vision-preview': 'openai'
};
