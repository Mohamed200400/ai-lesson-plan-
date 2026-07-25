"use client";
import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid, Sparkles, Archive, Users, BookOpen, Settings, User } from "lucide-react";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/", label: "Dashboard", icon: LayoutGrid },
  { href: "/new-generation", label: "New Generation", icon: Sparkles },
  { href: "/profile", label: "My Profile", icon: User },
  { href: "/community", label: "Community Hub", icon: Users },
 
];

export function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="hidden md:flex w-[240px] shrink-0 flex-col justify-between border-l border-outline-variant/60 bg-paper px-5 py-6 ">
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

     
    </aside>
  );
}
