"use client";

import React from "react";

import { Toaster } from "./ui/toaster";

export type MainLayoutProps = {
  children: React.ReactNode;
};

export const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="w-full h-screen flex flex-row bg-white dark:bg-zinc-800">
      {children}
      <Toaster />
    </div>
  );
};
