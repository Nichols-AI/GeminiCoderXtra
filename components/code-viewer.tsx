"use client";

import shadcnDocs from "@/utils/shadcn-docs";
import {
  Sandpack,
  SandpackPreview,
  SandpackProvider,
} from "@codesandbox/sandpack-react";
import { dracula as draculaTheme } from "@codesandbox/sandpack-themes";
import dedent from "dedent";
import "./code-viewer.css";

function preprocessCode(code: string): string {
  // Remove any markdown code block syntax if present
  code = code.replace(/```[a-z]*\n?|\n```/g, '');
  
  // Clean up the code
  let lines = code.split('\n');
  
  // Remove any malformed React imports or partial imports
  lines = lines.filter(line => {
    const isPartialImport = line.trim().startsWith('React,') || 
                           line.trim().startsWith(',') ||
                           line.trim().startsWith('{ useState }');
    return !isPartialImport;
  });
  
  // Find any valid React import
  const hasValidImport = lines.some(line => 
    line.includes('import React') && line.includes('from') && line.includes('react')
  );
  
  // If no valid import found, add one
  if (!hasValidImport) {
    lines.unshift('import React, { useState } from "react";');
  }
  
  return lines.join('\n');
}

export default function CodeViewer({
  code,
  showEditor = false,
}: {
  code: string;
  showEditor?: boolean;
}) {
  const processedCode = preprocessCode(code);
  return showEditor ? (
    <Sandpack
      options={{
        showNavigator: true,
        editorHeight: "80vh",
        showTabs: false,
        ...sharedOptions,
      }}
      files={{
        "App.tsx": processedCode,
        ...sharedFiles,
      }}
      {...sharedProps}
    />
  ) : (
    <SandpackProvider
      files={{
        "App.tsx": processedCode,
        ...sharedFiles,
      }}
      className="flex h-full w-full grow flex-col justify-center"
      options={{ ...sharedOptions }}
      {...sharedProps}
    >
      <SandpackPreview
        className="flex h-full w-full grow flex-col justify-center p-4 md:pt-16"
        showOpenInCodeSandbox={false}
        showRefreshButton={false}
      />
    </SandpackProvider>
  );
}

let sharedProps = {
  template: "react-ts",
  theme: draculaTheme,
  customSetup: {
    dependencies: {
      "lucide-react": "latest",
      recharts: "2.9.0",
      "react-router-dom": "latest",
      uuid: "^9.0.0",
      "@radix-ui/react-accordion": "^1.2.0",
      "@radix-ui/react-alert-dialog": "^1.1.1",
      "@radix-ui/react-aspect-ratio": "^1.1.0",
      "@radix-ui/react-avatar": "^1.1.0",
      "@radix-ui/react-checkbox": "^1.1.1",
      "@radix-ui/react-collapsible": "^1.1.0",
      "@radix-ui/react-dialog": "^1.1.1",
      "@radix-ui/react-dropdown-menu": "^2.1.1",
      "@radix-ui/react-hover-card": "^1.1.1",
      "@radix-ui/react-label": "^2.1.0",
      "@radix-ui/react-menubar": "^1.1.1",
      "@radix-ui/react-navigation-menu": "^1.2.0",
      "@radix-ui/react-popover": "^1.1.1",
      "@radix-ui/react-progress": "^1.1.0",
      "@radix-ui/react-radio-group": "^1.2.0",
      "@radix-ui/react-select": "^2.1.1",
      "@radix-ui/react-separator": "^1.1.0",
      "@radix-ui/react-slider": "^1.2.0",
      "@radix-ui/react-slot": "^1.1.0",
      "@radix-ui/react-switch": "^1.1.0",
      "@radix-ui/react-tabs": "^1.1.0",
      "@radix-ui/react-toast": "^1.2.1",
      "@radix-ui/react-toggle": "^1.1.0",
      "@radix-ui/react-toggle-group": "^1.1.0",
      "@radix-ui/react-tooltip": "^1.1.2",
      "class-variance-authority": "^0.7.0",
      clsx: "^2.1.1",
      "date-fns": "^3.6.0",
      "embla-carousel-react": "^8.1.8",
      "react-day-picker": "^8.10.1",
      "tailwind-merge": "^2.4.0",
      "tailwindcss-animate": "^1.0.7",
      vaul: "^0.9.1",
    },
  },
} as const;

let sharedOptions = {
  externalResources: [
    "https://unpkg.com/@tailwindcss/ui/dist/tailwind-ui.min.css",
  ],
  recompileMode: "immediate" as const,
  recompileDelay: 300,
};

let sharedFiles = {
  "/components/ui/avatar.tsx": {
    code: shadcnDocs[0],
    hidden: true
  },
  "/components/ui/button.tsx": {
    code: shadcnDocs[1],
    hidden: true
  },
  "/components/ui/card.tsx": {
    code: shadcnDocs[2],
    hidden: true
  },
  "/components/ui/input.tsx": {
    code: shadcnDocs[3],
    hidden: true
  },
  "/components/ui/label.tsx": {
    code: shadcnDocs[4],
    hidden: true
  },
  "/components/ui/radio-group.tsx": {
    code: shadcnDocs[5],
    hidden: true
  },
  "/components/ui/select.tsx": {
    code: shadcnDocs[6],
    hidden: true
  },
  "/components/ui/textarea.tsx": {
    code: shadcnDocs[7],
    hidden: true
  },
  "/public/index.html": dedent`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document</title>
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body>
        <div id="root"></div>
      </body>
    </html>
  `,
};
