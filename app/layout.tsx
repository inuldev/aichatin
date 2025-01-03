import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import "./globals.css";
import { ChatProvider } from "@/context/chat/provider";
import { FiltersProvider } from "@/context/filter/provider";
import { SettingsProvider } from "@/context/settings/provider";
import { TooltipProvider } from "@/components/ui/tooltip";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AIchatIn",
  description: "AI chat platform in single interface",
  icons: {
    icon: "/icons/aichat.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <TooltipProvider>
          <ChatProvider>
            <SettingsProvider>
              <FiltersProvider>
                <div className="w-full h-screen flex flex-row dark:bg-zinc-800">
                  {children}
                </div>
              </FiltersProvider>
            </SettingsProvider>
          </ChatProvider>
        </TooltipProvider>
      </body>
    </html>
  );
}
