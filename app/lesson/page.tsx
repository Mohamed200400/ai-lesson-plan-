import { TopBar } from "@/components/layout/topbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/input";
import { FileText, Palette, Plus, Flag } from "lucide-react";

const meta = [
  { label: "المادة", value: "النشاط العلمي" },
  { label: "المستوى", value: "الرابع ابتدائي" },
  { label: "الموضوع", value: "صحة الإنسان" },
  { label: "المدة الزمنية", value: "45 دقيقة" },
];

export default function LessonPage() {
  return (
    <div className="min-h-screen">
      <TopBar placeholder="البحث في الجذاذات..." />
      <div className="px-6 lg:px-10 pb-12 space-y-6">
        {/* Header */}
        <Card className="p-5 flex flex-col-reverse md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="primary" size="sm"><FileText className="h-4 w-4" /> تصدير Word</Button>
            <Button variant="outline" size="sm">PDF</Button>
            <Button variant="outline" size="sm"><Palette className="h-4 w-4" /> السمة</Button>
          </div>
          <div className="flex items-center justify-end gap-3">
            <Badge className="bg-primary-fixed/60 text-primary border-primary-fixed">مسودة</Badge>
            <h1 className="text-title-lg font-bold text-on-surface text-right">
              جذاذة الدرس: الجهاز الهضمي
            </h1>
          </div>
        </Card>

        {/* Meta */}
        <Card className="grid grid-cols-2 md:grid-cols-4 gap-4 p-5">
          {meta.map((m) => (
            <div key={m.label} className="text-right">
              <div className="text-caption text-on-surface-variant">{m.label}</div>
              <div className="mt-1 text-body-lg font-semibold text-on-surface">{m.value}</div>
            </div>
          ))}
        </Card>

        {/* Objectives */}
        <Card className="overflow-hidden">
          <div className="flex items-center justify-end gap-2 px-5 py-3">
            <span className="text-label-md font-semibold text-on-surface">الأهداف التعلمية</span>
            <Flag className="h-4 w-4 text-primary" />
          </div>
          <div className="border-r-4 border-success/60 bg-ai-tint/60 px-5 py-4">
            <ul className="space-y-2 text-right text-body-md text-on-surface list-disc pr-5">
              <li>أن يتعرف المتعلم على أعضاء الجهاز الهضمي ووظائفها الأساسية.</li>
              <li>أن يستنتج مسار اللقمة الغذائية داخل الجسم.</li>
            </ul>
          </div>
        </Card>

        {/* Lesson table */}
        <Card className="overflow-hidden">
          <div className="grid grid-cols-4 bg-surface-low text-right text-label-md font-semibold text-on-surface">
            {["الوضعية المشكلة", "أنشطة المدرس", "أنشطة المتعلم", "التقويم والدعم"].map((h, i) => (
              <div key={h} className={i < 3 ? "px-4 py-3 border-l border-outline-variant/60" : "px-4 py-3"}>{h}</div>
            ))}
          </div>

          {/* Row 1 */}
          <div className="grid grid-cols-4 text-right text-body-md text-on-surface border-t border-outline-variant/60">
            <Cell>
              تقديم صورة لطفل يتناول تفاحة، وسؤال المتعلمين: &quot;أين تذهب هذه التفاحة بعد مضغها وبلعها؟&quot;
            </Cell>
            <Cell>
              - يعرض الصورة على السبورة.<br />
              - يطرح السؤال المحفز.<br />
              - يسجل تمثلات المتعلمين الأولية على جانب السبورة دون تصحيحها.
            </Cell>
            <Cell>
              - يلاحظون الصورة باهتمام.<br />
              - يقدمون إجابات عفوية (تذهب للمعدة، تذوب، نخرجها...).
            </Cell>
            <Cell last>
              تقويم تشخيصي: مدى قدرة المتعلم على التعبير عن تمثلاته بحرية.
            </Cell>
          </div>

          {/* Row 2 */}
          <div className="grid grid-cols-4 text-right text-body-md text-on-surface border-t border-outline-variant/60">
            <Cell>
              التعرف على أعضاء الجهاز الهضمي من خلال مجسم أو وثيقة.
            </Cell>
            <Cell>
              - يوزع وثيقة تبين الجهاز الهضمي غير معنونة.<br />
              - يطلب من مجموعات العمل محاولة تسمية الأعضاء انطلاقاً من مكتسبات سابقة أو تخمين.<br />
              - يوجه النقاش ويقدم التسميات العلمية الدقيقة (الفم، المريء، المعدة، الأمعاء الدقيقة، الأمعاء الغليظة).
            </Cell>
            <Cell>
              - يعملون في مجموعات صغيرة.<br />
              - يلاحظون الوثيقة ويحاولون وضع الأسماء.<br />
              - يصححون أخطاءهم بناءً على توجيهات المدرس ويبنون الملخص جماعياً.
            </Cell>
            <Cell last>
              <span className="italic text-on-surface-variant">انقر لإضافة أنشطة التقويم التكويني...</span>
            </Cell>
          </div>

          <button className="w-full border-t border-outline-variant/60 py-4 text-center text-label-md text-primary hover:bg-surface-low">
            <span className="inline-flex items-center gap-2"><Plus className="h-4 w-4" /> إضافة مقطع تعليمي جديد</span>
          </button>
        </Card>
      </div>
    </div>
  );
}

function Cell({ children, last = false }: { children: React.ReactNode; last?: boolean }) {
  return (
    <div className={`px-4 py-4 leading-7 ${last ? "" : "border-l border-outline-variant/60"}`}>
      {children}
    </div>
  );
}
