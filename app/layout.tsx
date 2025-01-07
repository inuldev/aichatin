import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";

import "./globals.css";
import { inter } from "./fonts";

import { MainLayout } from "@/components/main-layout";
import { ChatProvider } from "@/context/chat/provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { FiltersProvider } from "@/context/filter/provider";
import { SettingsProvider } from "@/context/settings/provider";

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
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <TooltipProvider>
            <SettingsProvider>
              <ChatProvider>
                <FiltersProvider>
                  <MainLayout>{children}</MainLayout>
                </FiltersProvider>
              </ChatProvider>
            </SettingsProvider>
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
