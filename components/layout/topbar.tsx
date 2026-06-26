"use client";
import * as React from "react";
import { Search,  Bot } from "lucide-react";

export function TopBar({ placeholder = "البحث في الدروس والمصادر..." }: { placeholder?: string }) {
  return (
    <header className="flex items-center gap-4 px-6 py-4 lg:px-10">
      <button className="grid h-10 w-10 place-items-center rounded-md bg-ai-soft text-success" aria-label="AI">
        <Bot className="h-5 w-5" />
      </button>
      
      <div className="relative flex-1 max-w-xl">
        <Search className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-on-surface-variant" />
        <input
          type="search"
          placeholder={placeholder}
          className="w-full rounded-full border border-outline-variant/70 bg-paper px-4 py-2.5 pr-10 text-body-md placeholder:text-on-surface-variant focus:border-primary focus:outline-none focus:shadow-focus"
        />
      </div>
    </header>
  );
}
