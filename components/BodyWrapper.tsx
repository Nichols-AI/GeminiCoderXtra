"use client";

export default function BodyWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-brand dark:bg-dark antialiased dark:text-gray-100">
      <div className="flex min-h-screen flex-col">
        {children}
      </div>
    </div>
  );
}
