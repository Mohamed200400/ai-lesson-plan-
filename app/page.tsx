import { TopBar } from "@/components/layout/topbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/input";
import { Plus, Zap, Folder, FolderPlus, FileText, Sparkles, Calculator, FlaskConical } from "lucide-react";

const stats = [
  { value: "128", label: "عنصر محفوظ" },
  { value: "15", label: "تمت مشاركتها" },
  { value: "42", label: "درس تم إنشاؤها" },
];

const quick = [
  { tag: "الرياضيات", title: "الكسور العشرية", sub: "الصف الخامس • تم التعديل بالأمس", icon: Calculator },
  { tag: "العلوم", title: "دورة حياة النبات", sub: "الصف الرابع • تم التعديل قبل ساعتين", icon: FlaskConical },
];

const folders = [
  { title: "الدورة الأول - علوم", count: "12 ملف" },
  { title: "الدورة الأول - رياضيات", count: "8 ملفات" },
  { title: "مشاريع مشتركة", count: "5 ملفات" },
];

const archive = [
  { name: "مقدمة في الفيزياء الحركية", subject: "العلوم", date: "12 أكتوبر 2023", ai: true },
  { name: "تمارين القسمة المطولة", subject: "الرياضيات", date: "10 أكتوبر 2023" },
  { name: "اختبار قصير: الجهاز الهضمي", subject: "العلوم", date: "8 أكتوبر 2023" },
];

export default function DashboardPage() {
  return (
    <div className="min-h-screen">
      <TopBar />

      <div className="px-6 lg:px-10 pb-12 space-y-8">
        {/* Welcome + stats */}
        <Card className="p-6 lg:p-8">
          <div className="flex flex-col-reverse lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex flex-wrap gap-3">
              {stats.map((s) => (
                <div
                  key={s.label}
                  className="min-w-[140px] rounded-md bg-surface-low px-5 py-4 text-center"
                >
                  <div className="text-headline-lg font-bold text-on-surface">{s.value}</div>
                  <div className="text-caption text-on-surface-variant">{s.label}</div>
                </div>
              ))}
            </div>
            <div className="text-right">
              <h1 className="text-headline-md font-bold text-on-surface flex items-center justify-end gap-2">
                مرحباً بعودتك، أ. أحمد! <span aria-hidden>👋</span>
              </h1>
              <p className="mt-2 text-body-md text-on-surface-variant max-w-md">
                مستعد لتخطيط دروس مبدعة اليوم؟ المساعد الذكي جاهز لمساعدتك.
              </p>
            </div>
          </div>
        </Card>

        {/* Quick start */}
        <section>
          <div className="mb-4 flex items-center justify-end gap-2">
            <h2 className="text-title-lg font-semibold text-on-surface">البدء السريع</h2>
            <Zap className="h-5 w-5 text-primary" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* New plan AI card */}
            <Card className="bg-ai-card border-primary-fixed/60 p-6 flex flex-col justify-between min-h-[220px]">
              <div className="flex justify-end">
                <div className="grid h-10 w-10 place-items-center rounded-full bg-paper shadow-card">
                  <Plus className="h-5 w-5 text-primary" />
                </div>
              </div>
              <div className="text-right">
                <h3 className="text-title-lg font-bold text-primary">إنشاء خطة درس جديدة</h3>
                <p className="mt-2 text-body-md text-on-surface-variant">
                  استخدم الذكاء الاصطناعي لتوليد خطة درس متكاملة في ثوانٍ.
                </p>
                <Button className="mt-4 w-full" size="lg">
                  <Sparkles className="h-4 w-4" />
                  ابدأ التوليد
                </Button>
              </div>
            </Card>

            {quick.map((q) => (
              <Card key={q.title} className="p-6 flex flex-col justify-between min-h-[220px]">
                <div className="flex items-start justify-between">
                  <div className="grid h-9 w-9 place-items-center rounded-md bg-surface-low">
                    <q.icon className="h-4 w-4 text-primary" />
                  </div>
                  <Badge>{q.tag}</Badge>
                </div>
                <div className="text-right">
                  <h3 className="text-title-lg font-semibold text-on-surface">{q.title}</h3>
                  <p className="mt-1 text-caption text-on-surface-variant">{q.sub}</p>
                  <Button variant="outline" className="mt-4 w-full">استكمال</Button>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Personal archive */}
        <section>
          <div className="mb-4 flex items-center justify-between">
            <button className="text-label-md text-primary hover:underline">عرض الكل</button>
            <div className="flex items-center gap-2">
              <h2 className="text-title-lg font-semibold text-on-surface">الأرشيف السحابي الشخصي</h2>
              <Folder className="h-5 w-5 text-primary" />
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button className="rounded-md border border-dashed border-outline-variant bg-transparent px-4 py-5 text-label-md text-on-surface-variant hover:border-primary hover:text-primary flex items-center justify-center gap-2">
              <FolderPlus className="h-4 w-4" /> مجلد جديد
            </button>
            {folders.map((f) => (
              <Card key={f.title} className="p-4 flex items-center justify-between">
                <Folder className="h-5 w-5 text-primary shrink-0" />
                <div className="text-right min-w-0">
                  <div className="text-label-md font-semibold text-on-surface truncate">{f.title}</div>
                  <div className="text-caption text-on-surface-variant">{f.count}</div>
                </div>
              </Card>
            ))}
          </div>

          {/* Recent table */}
          <Card className="mt-6 overflow-hidden">
            <div className="grid grid-cols-[1fr_140px_140px_80px] gap-4 px-6 py-3 text-caption text-on-surface-variant border-b border-outline-variant/60 bg-surface-low/50">
              <div className="text-right">الاسم</div>
              <div className="text-right">المادة</div>
              <div className="text-right">التاريخ</div>
              <div className="text-right">إجراء</div>
            </div>
            {archive.map((row) => (
              <div
                key={row.name}
                className="grid grid-cols-[1fr_140px_140px_80px] items-center gap-4 px-6 py-4 border-b border-outline-variant/40 last:border-0 hover:bg-surface-low/40"
              >
                <div className="flex items-center justify-end gap-3">
                  {row.ai && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-ai-tint px-2 py-0.5 text-caption text-success">
                      <Sparkles className="h-3 w-3" /> ذكاء اصطناعي
                    </span>
                  )}
                  <span className="text-body-md text-on-surface">{row.name}</span>
                  <FileText className="h-4 w-4 text-on-surface-variant shrink-0" />
                </div>
                <div className="text-right text-body-md text-on-surface-variant">{row.subject}</div>
                <div className="text-right text-body-md text-on-surface-variant">{row.date}</div>
                <div className="text-right text-on-surface-variant">⋯</div>
              </div>
            ))}
          </Card>
        </section>
      </div>
    </div>
  );
}
