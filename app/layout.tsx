
import type { Metadata } from "next";
import "./globals.css";
import SideBarWrapper from "./side-bar-wrapper";


export const metadata: Metadata = {
  title: "Gedada — AI Lesson Planner",
  description: "Academic Intelligence System for educators.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {

  return (
    <html lang="ar" dir="rtl">
      <body className="min-h-screen bg-surface text-on-surface">
        <div className="flex min-h-screen">
          {/* Main content (RTL: appears on the left of sidebar) */}
          <main className="flex-1 min-w-0">{children}</main>
          {/* Sidebar on the right in RTL */}
          <SideBarWrapper/>
        </div>
      </body>
    </html>
  );
}
