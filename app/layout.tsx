import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import BodyWrapper from "@/components/BodyWrapper";

let title = "GeminiCoderXtra – Multi-Model AI Code Generator";
let description = "Generate your next app with multiple AI models";
let url = "https://github.com/Nichols-AI/GeminiCoderXtra";
let ogimage = "/logo.svg";
let sitename = "geminicoderxtra.io";

export const metadata: Metadata = {
  metadataBase: new URL(url),
  title,
  description,
  icons: {
    icon: "/app/favicon.ico",
  },
  openGraph: {
    images: [ogimage],
    title,
    description,
    url: url,
    siteName: sitename,
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    images: [ogimage],
    title,
    description,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body suppressHydrationWarning>
        <ThemeProvider>
          <BodyWrapper>
            {children}
          </BodyWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}
