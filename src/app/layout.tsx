import "./globals.css";
import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import Provider from "@/lib/Provider";

export const metadata: Metadata = {
  title: "Notion-Ai",
  description: "Create Notes using Ai",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <Provider>
          <body>{children}</body>
        </Provider>
      </html>
    </ClerkProvider>
  );
}
