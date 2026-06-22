"use client";
import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid, Sparkles, Archive, Users, BookOpen, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/", label: "Dashboard", icon: LayoutGrid },
  { href: "/new-generation", label: "New Generation", icon: Sparkles },
  { href: "/archive", label: "My Archive", icon: Archive },
  { href: "/community", label: "Community Hub", icon: Users },
  { href: "/resources", label: "Resources", icon: BookOpen },
];

export function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="hidden md:flex w-[240px] shrink-0 flex-col justify-between border-l border-outline-variant/60 bg-paper px-5 py-6">
      <div>
        <div className="mb-10 flex items-center justify-between">
          <div className="h-9 w-9 rounded-md bg-primary" aria-hidden />
          <div className="text-right">
            <div className="text-title-lg font-bold text-primary">Gedada</div>
            <div className="text-caption text-on-surface-variant">AI Lesson Planner</div>
          </div>
        </div>

        <nav className="flex flex-col gap-1">
          {nav.map((item) => {
            const active = pathname === item.href || (item.href !== "/" && pathname?.startsWith(item.href));
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center justify-between rounded-md px-3 py-2.5 text-label-md transition-colors",
                  active
                    ? "bg-surface-low text-primary font-semibold"
                    : "text-on-surface-variant hover:bg-surface-low hover:text-on-surface"
                )}
              >
                <span>{item.label}</span>
                <Icon className="h-4 w-4" strokeWidth={1.8} />
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="flex items-center justify-between rounded-md px-2 py-2">
        <Settings className="h-4 w-4 text-on-surface-variant" />
        <div className="flex items-center gap-2">
          <div className="text-right">
            <div className="text-label-md font-semibold">أحمد محمود</div>
            <div className="text-caption text-on-surface-variant">Teacher Profile</div>
          </div>
          <div className="h-9 w-9 rounded-full bg-gradient-to-br from-primary-container to-primary" />
        </div>
      </div>
    </aside>
  );
}
