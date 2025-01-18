import dedent from "dedent";
import { z } from "zod";
import { ProviderFactory } from "./providers/factory";

export async function POST(req: Request) {
  let json = await req.json();
  let result = z
    .object({
      model: z.string(),
      messages: z.array(
        z.object({
          role: z.enum(["user", "assistant"]),
          content: z.string(),
        }),
      ),
    })
    .safeParse(json);

  if (result.error) {
    return new Response(result.error.message, { status: 422 });
  }

  try {
    let { model, messages } = result.data;
    let systemPrompt = getSystemPrompt();
    
    // Get the appropriate provider for the requested model
    const provider = ProviderFactory.getProvider(model);
    
    // Generate the stream using the provider
    // Ensure proper code formatting
    const formattingInstructions = "\nPlease ONLY return code, NO backticks or language names. Don't start with \`\`\`typescript or \`\`\`javascript or \`\`\`tsx or \`\`\`. ALWAYS start with proper import statements using the 'import' keyword.";
    
    const stream = await provider.generateStream(
      messages[0].content + systemPrompt + formattingInstructions,
      { model }
    );

    return new Response(stream);
  } catch (error) {
    console.error("Error generating code:", error);
    let errorMessage = "An unknown error occurred";
    if (error instanceof Error) {
      errorMessage = error.message;
      // Add more context if it's an API error
      if (errorMessage.includes("API")) {
        errorMessage = `API Error: ${errorMessage}. Please try again.`;
      }
    }
    return new Response(errorMessage, { 
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}

function getSystemPrompt() {
  let systemPrompt = 
`You are an expert frontend React engineer who is also a great UI/UX designer. Follow these instructions EXACTLY:

1. Start EVERY file with proper imports, EXACTLY like this:
   import React, { useState, useEffect } from 'react';
   
   Example of a complete, valid component:
   import React, { useState } from 'react';
   
   interface Props {}
   
   const MyComponent: React.FC<Props> = () => {
     const [value, setValue] = useState<string>('');
     return <div>{value}</div>;
   };
   
   export default MyComponent;

2. Follow TypeScript best practices:
   - Use proper type annotations
   - Define interfaces/types for props and state
   - Use React.FC for functional components
   - Export components as default

3. Component requirements:
   - Make components interactive using React hooks (useState, useEffect)
   - No required props (components should work standalone)
   - Use descriptive variable names
   - Add proper TypeScript types for all variables and functions

4. Styling:
   - Use Tailwind CSS classes only
   - NO arbitrary values (e.g. NO h-[600px])
   - Use consistent color palette
   - Use proper margin/padding classes for spacing

5. Code format:
   - Return ONLY the complete React code
   - Start with imports
   - NO markdown code blocks (NO \`\`\`typescript or similar)
   - Include semicolons at the end of statements
   - Proper indentation and spacing

6. Special cases:
   - For charts/graphs: import from recharts (e.g. import { LineChart } from 'recharts')
   - For images: use <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />

Double-check your code before returning to ensure:
- All imports are properly formatted with 'import' keyword
- All statements end with semicolons
- All types are properly defined
- No syntax errors
  `;

  systemPrompt += `
    Available libraries:
    - uuid (for generating unique IDs, import { v4 as uuidv4 } from 'uuid')
    - recharts (for charts/graphs)
    - All Radix UI components
    
    NO OTHER LIBRARIES (e.g. zod, hookform) ARE INSTALLED OR ABLE TO BE IMPORTED.
  `;

  return dedent(systemPrompt);
}

export const runtime = "edge";
export const maxDuration = 300; // 5 minutes timeout

// Explicitly declare which env vars are used
export const envVars = [
  'ANTHROPIC_API_KEY',
  'GOOGLE_AI_API_KEY',
  'DEEPSEEK_API_KEY',
  'GROK_API_KEY',
  'OPENAI_API_KEY'
];
