import type { ReactNode } from "react";

export function LessonSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="mb-6 bg-gray-50/50 p-4 rounded-xl border border-gray-100 text-right">
      <h3 className="text-lg font-bold text-[#1e5a8e] mb-3 border-r-4 border-emerald-500 pr-2">
        {title}
      </h3>
      {children}
    </div>
  );
}
