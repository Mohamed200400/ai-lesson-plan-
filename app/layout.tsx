
import type { Metadata } from "next";
import "./globals.css";
import SideBarWrapper from "./side-bar-wrapper";
import SessionWraper from "./session-provider-wrapper";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: "Gedada — AI Lesson Planner",
  description: "Academic Intelligence System for educators.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {

  return (
    <html lang="ar" dir="rtl" className={cn("font-sans", geist.variable)}>
      <body className="min-h-screen bg-surface text-on-surface">
        <div className="flex min-h-screen">
          <SessionWraper>
            <SideBarWrapper/>
            {/* Main content (RTL: appears on the left of sidebar) */}
            <main className="flex-1 min-w-0">{children}</main>
            {/* Sidebar on the right in RTL */}
          </SessionWraper>
        </div>
      </body>
    </html>
  );
}
