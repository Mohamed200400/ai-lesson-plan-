"use client";
import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid, Sparkles, Archive, Users, BookOpen, Settings, User } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";


const nav = [
  { href: "/", label: "لوحة التحكم", icon: LayoutGrid },
  { href: "/new-generation", label: "إنشاء الخطة", icon: Sparkles },
  { href: "/profile", label: "ملفي الشخصي", icon: User },
  { href: "/community", label: "مركز المجتمع", icon: Users },
];

export function Sidebar() {
  const pathname = usePathname();
  return (
    <aside dir="ltr" className="hidden md:flex w-[240px] shrink-0 flex-col justify-between border-l border-outline-variant/60 bg-paper px-5 py-6 ">
      <div>
        <div className="mb-10 flex items-center  justify-between">
         
          <div className="text-right pr-4">
            <div className="text-title-lg font-bold text-primary pb-2">جذاذة</div>
            <div className="text-caption text-on-surface-variant">مخطط الدروس بالذكاء الاصطناعي</div>
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
                  "flex items-center justify-end gap-3 rounded-md px-3 py-2.5 text-label-md transition-colors",
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
