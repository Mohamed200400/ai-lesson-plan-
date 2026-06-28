"use client"
import { TopBar } from "@/components/layout/topbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { FileEdit, Sparkles, Lightbulb, Printer, Download, ChevronDown } from "lucide-react";
import { useActionState, useState } from "react";
import { generateLesson } from "../actions/lesson";
const partialParse = require('partial-json-parser');

interface FormState {
  success: boolean | null;
  message: string;
}

interface SectionProps {
  title: string;
  children: React.ReactNode;
}

export default function NewGenerationPage() {
  const subjects = [
  "اللغة العربية",
  "الرياضيات",
  "الإيقاظ العلمي",
  "اللغة الفرنسية",
  "اللغة الإنكليزية",
  "التاريخ",
  "الجغرافيا",
  "التربية الإسلامية",
  "التربية المدنية",
  "التربية التشكيلية",
  "التربية الموسيقية",
  "التربية البدنية",
  "التربية التقنية"
]
const levels = ["السنة الأولى", "السنة الثانية", "السنة الثالثة", "السنة الرابعة", "السنة الخامسة", "السنة السادسة"];
const pedagogies = [
  "المقاربة البنائية",
  "التعلم القائم على التقصي",
  "المقاربة التعاونية",
  "التعليم المباشر"
]
  const [streamedText, setStreamedText] = useState("");
  const [lessonData, setLessonData] = useState<any>(null);
const [state, formAction, isPending] = useActionState(
  async (prevState: FormState, formData: FormData): Promise<FormState> => {
    setStreamedText("");
    setLessonData(null)

    try {
      // 🔥 مرر الـ formData كما هي للسيرفر أكشن مباشرة!
      const stream = await generateLesson("user_123", formData);

      let accumulatedText =""
      for await (const chunk of stream) {
        accumulatedText += chunk;
        setStreamedText(accumulatedText);
     
          
          try {
            const parsedPartial = partialParse(accumulatedText);
            
            setLessonData(parsedPartial); // تحديث كائن البيانات الحي
          } catch (e) {
            // تجاهل أخطاء السينتاكس المؤقتة جداً بين تدفق الحروف
          }
        }

      return { success: true, message: "تمت صياغة وحفظ الجذاذة بنجاح!" };

    } catch (error) {
      console.error("حدث خطأ أثناء البث:", error);
      return { success: false, message: "حدث خطأ غير متوقع أثناء التوليد." };
    }
  },
  { success: null, message: "" }
);
 /* const initialState = {
  success: false,
  message: '',
};
 const [state, formAction, isPending] = useActionState(generateLesson, initialState);*/
 
 
console.log(lessonData)
let data = lessonData

  return (
    <div className="min-h-screen">
      <TopBar placeholder="البحث..." />
      <div className="px-6 lg:px-10 pb-12">
        <h1 className="mb-6 text-right text-headline-md font-bold text-on-surface">إنشاء جذاذة جديدة</h1>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 lg:gap-8" dir="ltr">
          
          

          {/* Preview (left column in RTL) 
          <Card className="order-2 lg:order-1 overflow-hidden">
            <div className="flex items-center justify-between border-b border-outline-variant/60 px-5 py-3">
              <div className="flex items-center gap-2">
                <button className="grid h-8 w-8 place-items-center rounded-md hover:bg-surface-low"><Printer className="h-4 w-4 text-on-surface-variant" /></button>
                <button className="grid h-8 w-8 place-items-center rounded-md hover:bg-surface-low"><Download className="h-4 w-4 text-on-surface-variant" /></button>
              </div>
              <div className="flex items-center gap-2">
                <h2 className="text-title-lg font-semibold text-on-surface">معاينة التوليد</h2>
                <Sparkles className="h-4 w-4 text-success" />
              </div>
            </div>

            <div className="p-6 border-r-4 border-success/60">
              <div className="text-center">
                <h3 className="text-headline-md font-bold text-primary">جذاذة نمطية</h3>
                <div className="mt-2 flex justify-center gap-6 text-caption text-on-surface-variant">
                  <span><b className="text-on-surface">المستوى:</b> الرابع ابتدائي</span>
                  <span><b className="text-on-surface">المادة:</b> النشاط العلمي</span>
                </div>
              </div>

              <hr className="my-5 border-outline-variant/60" />

              <div className="text-right">
                <h4 className="text-title-lg font-semibold text-primary mb-3">الأهداف التعلمية</h4>
                <ul className="space-y-2 text-body-md text-on-surface list-disc pr-5">
                  <li>أن يتعرف المتعلم على أعضاء الجهاز الهضمي.</li>
                  <li>أن يحدد وظيفة كل عضو بشكل مبسط.</li>
                  <li>أن يدرك أهمية التغذية السليمة لحفظ صحة الجهاز الهضمي.</li>
                </ul>
              </div>

              <h4 className="mt-6 text-right text-title-lg font-semibold text-primary mb-3">
                سيرورة الحصة (المقاربة بالكفايات)
              </h4>

              <div className="overflow-hidden rounded-md border border-outline-variant/60">
                <table className="w-full text-right text-caption">
                  <thead className="bg-surface-low text-on-surface">
                    <tr>
                      <th className="px-3 py-2 font-semibold border-l border-outline-variant/60">المراحل</th>
                      <th className="px-3 py-2 font-semibold border-l border-outline-variant/60">أنشطة المدرس</th>
                      <th className="px-3 py-2 font-semibold border-l border-outline-variant/60">أنشطة المتعلم</th>
                      <th className="px-3 py-2 font-semibold">التقويم / الدعم</th>
                    </tr>
                  </thead>
                  <tbody className="text-on-surface-variant">
                    <tr className="ai-row border-t border-outline-variant/60">
                      <td className="px-3 py-3 align-top font-semibold text-on-surface border-l border-outline-variant/60">وضعية الانطلاق<br /><span className="text-caption font-normal">(5 دقائق)</span></td>
                      <td className="px-3 py-3 align-top border-l border-outline-variant/60 leading-6">
                        يطرح سؤالاً محفزاً: &quot;أين يذهب الطعام الذي نأكله بعد مضغه؟&quot; ويعرض صورة مبهمة لمسار الطعام.
                      </td>
                      <td className="px-3 py-3 align-top border-l border-outline-variant/60 leading-6">
                        يقدمون فرضيات مختلفة بناءً على تصوراتهم الأولية ويناقشونها بحرية.
                      </td>
                      <td className="px-3 py-3 align-top leading-6">تقويم تشخيصي للتمثلات.</td>
                    </tr>
                    <tr className="border-t border-outline-variant/60">
                      <td className="px-3 py-3 align-top font-semibold text-on-surface border-l border-outline-variant/60">بناء التعلمات<br /><span className="text-caption font-normal">(20 دقيقة)</span></td>
                      <td className="px-3 py-3 align-top border-l border-outline-variant/60 leading-6">
                        يعرض مجسماً أو شريط فيديو يوضح رحلة اللقمة. يوجه التلاميذ للعمل في مجموعات لتسمية الأعضاء باستخدام بطاقات...
                      </td>
                      <td className="px-3 py-3 align-top border-l border-outline-variant/60">
                        <div className="h-2 w-3/4 rounded bg-outline-variant/60 mb-2" />
                        <div className="h-2 w-1/2 rounded bg-outline-variant/60" />
                      </td>
                      <td className="px-3 py-3 align-top">
                        <div className="h-2 w-2/3 rounded bg-outline-variant/60" />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </Card>*/}
       {data ? <section className="order-2 lg:order-1 border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
      <div
        dir="rtl"
        className="min-h-screen bg-white"
        style={{ fontFamily: "'Tajawal', 'Cairo', system-ui, sans-serif" }}
      >
        {/* شريط التحكم العلوي */}
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-3 bg-gray-50">
          <div className="flex items-center gap-3 text-gray-600">
            <button className="p-2 hover:bg-gray-200 rounded-md transition" aria-label="طباعة">
              <Printer className="w-5 h-5" />
            </button>
            <button className="p-2 hover:bg-gray-200 rounded-md transition" aria-label="تحميل">
              <Download className="w-5 h-5" />
            </button>
          </div>
          <div className="flex items-center gap-2 text-gray-800 font-semibold">
            <span>معاينة التوليد البيداغوجي</span>
            <Sparkles className="w-5 h-5 text-emerald-500 animate-pulse" />
          </div>
        </div>

        <div className="relative">
          {/* خط جمالي جانبي يعبر عن حالة البث */}
          <div className="absolute top-0 bottom-0 right-0 w-1 bg-emerald-500" />

          <div className="max-w-5xl mx-auto px-8 py-10">
            {/* الهوية الأساسية للدرس */}
            <div className="text-center bg-emerald-50/40 p-6 rounded-2xl border border-emerald-100/70 mb-6">
              <h1 className="text-3xl font-bold text-[#1e5a8e]">
                {data?.title || "جذاذة نمطية"}
              </h1>
              <div className="mt-4 flex justify-center gap-10 text-sm text-gray-700">
                <div>
                  <span className="font-semibold text-gray-900">المادة:</span> {data?.subject || "⏳"}
                </div>
                <div>
                  <span className="font-semibold text-gray-900">المستوى:</span> {data?.level || "⏳"}
                </div>
                <div>
                  <span className="font-semibold text-gray-900">المقاربة:</span> {data?.pedagogicalApproach || "المقاربة بالكفايات"}
                </div>
              </div>
            </div>

            <hr className="my-6 border-gray-100" />

            {/* ✨ حماية المصفوفات عبر الـ Optional Chaining والفروقات الافتراضية || [] */}
            
            {/* الأهداف التعلمية */}
            {data?.objectives && (
              <Section title="الأهداف التعلمية">
                <ul className="list-disc pr-6 space-y-2 text-gray-800">
                  {data.objectives.map((o: string, i: number) => (
                    <li key={i} className="animate-fade-in">{o}</li>
                  ))}
                </ul>
              </Section>
            )}

            {/* الكفايات المستهدفة */}
            {data?.competencies && (
              <Section title="الكفايات المستهدفة">
                <ul className="list-disc pr-6 space-y-2 text-gray-800">
                  {data.competencies.map((c: string, i: number) => (
                    <li key={i} className="animate-fade-in">{c}</li>
                  ))}
                </ul>
              </Section>
            )}

            {/* المكتسبات القبلية */}
            {data?.prerequisites && (
              <Section title="المكتسبات القبلية">
                <ul className="list-disc pr-6 space-y-2 text-gray-800">
                  {data.prerequisites.map((p: string, i: number) => (
                    <li key={i} className="animate-fade-in">{p}</li>
                  ))}
                </ul>
              </Section>
            )}

            {/* الوسائل التعليمية */}
            {data?.didacticMaterials && (
              <Section title="الوسائل التعليمية">
                <ul className="list-disc pr-6 space-y-2 text-gray-800">
                  {data.didacticMaterials.map((m: string, i: number) => (
                    <li key={i} className="animate-fade-in">{m}</li>
                  ))}
                </ul>
              </Section>
            )}

            {/* سيرورة الحصة في جدول */}
            {data?.lessonProcess && data.lessonProcess.length > 0 && (
              <Section title="سيرورة الحصة (المقاربة بالكفايات)">
                <div className="overflow-x-auto border border-gray-200 rounded-xl shadow-sm">
                  <table className="w-full text-sm text-right border-collapse">
                    <thead className="bg-gray-100 text-gray-700 border-b border-gray-200">
                      <tr>
                        <th className="border-l border-gray-200 px-4 py-3 font-bold w-32 text-center">المراحل</th>
                        <th className="border-l border-gray-200 px-4 py-3 font-bold">أنشطة المدرس</th>
                        <th className="border-l border-gray-200 px-4 py-3 font-bold">أنشطة المتعلم</th>
                        <th className="px-4 py-3 font-bold w-40 text-center">التقويم / الدعم</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {data.lessonProcess.map((phase: any, i: number) => (
                        <tr key={i} className="align-top hover:bg-gray-50/50 transition-colors">
                          <td className="border-l border-gray-200 px-4 py-3 text-center font-semibold text-gray-900 bg-gray-50/30">
                            <div>{phase?.phaseName || "⏳"}</div>
                            {phase?.duration && (
                              <div className="text-xs text-emerald-600 font-normal mt-1 bg-emerald-50 px-1 py-0.5 rounded-full inline-block">
                                {phase.duration} دق
                              </div>
                            )}
                          </td>
                          <td className="border-l border-gray-200 px-4 py-3 text-gray-800 leading-relaxed whitespace-pre-line">
                            {phase?.teacherActivity || "..."}
                          </td>
                          <td className="border-l border-gray-200 px-4 py-3 text-gray-800 leading-relaxed whitespace-pre-line">
                            {phase?.studentActivity || "..."}
                          </td>
                          <td className="px-4 py-3 text-center text-sm font-medium text-amber-700 bg-amber-50/10">
                            {phase?.evaluationType || "—"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Section>
            )}

            {/* الواجب المنزلي */}
            {data?.homework && (
              <Section title="الواجب المنزلي والأمور الامتدادية">
                <p className="text-gray-800 leading-relaxed p-2 bg-amber-50/30 rounded-lg border border-amber-100/50">
                  {data.homework}
                </p>
              </Section>
            )}
          </div>
        </div>
      </div>
    </section> : <div>please fill the lesson plan data</div> }
          {/*form */}

          <form action={formAction} className="space-y-5 order-1 lg:order-2">
            <Card>
              <div className="flex items-center justify-between border-b border-outline-variant/60 px-5 py-4">
                <FileEdit className="h-5 w-5 text-primary" />
                <h2 className="text-title-lg font-semibold text-primary">المعطيات الأساسية</h2>
              </div>
              <div className="p-5 space-y-4">
                <div>
                  <Label className="text-right">عنوان الدرس</Label>
                  <Input 
                  name="title"
                  placeholder={"اختر العنوان"}
                    
                    className="text-right"
                   />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-right">المادة</Label>
                    <select 
                    name="subject"
                    className="w-full appearance-none rounded-lg border border-gray-200 bg-white py-2.5 pr-3 pl-10 text-sm text-gray-900 shadow-sm outline-none transition-all hover:border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-green-200">
                      <option value="" >اختر المادة...</option>
                      {subjects.map((e)=>(
                        <option key={e} value={e}>{e}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label className="text-right">المستوى</Label>
                    <select 
                    name="level"
                    className="w-full appearance-none rounded-lg border border-gray-200 bg-white py-2.5 pr-3 pl-10 text-sm text-gray-900 shadow-sm outline-none transition-all hover:border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-green-200">
                      <option value="" >اختر المستوى..</option>
                      {levels.map((e)=>(
                        <option key={e} value={e}>{e}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                  
                  </div>
                  <div>
                    <Label className="text-right">المدة الزمنية</Label>
                    <div className="relative">
                      <Input 
                      name="time"
              
                      className="text-right pr-12" />
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-caption text-on-surface-variant">دقيقة</span>
                    </div>
                  </div>
                </div>
                <div>
                  <Label className="flex items-center justify-between">
                    <Sparkles className="h-3.5 w-3.5 text-success" />
                    <span className="text-right">المقاربة البيداغوجية</span>
                  </Label>
                  <div className="rounded-md border-2 border-success/40 bg-paper">
                   <select
                   name="pedagogie"
                    className="w-full appearance-none rounded-lg border border-gray-200 bg-white py-2.5 pr-3 pl-10 text-sm text-gray-900 shadow-sm outline-none transition-all hover:border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-green-200">
                      <option value="" className="bg-white text-gray-800 font-medium text-right">اختر البيداغوجيا.</option>
                      {pedagogies.map((e)=>(
                        <option className="bg-white text-gray-800 font-medium text-right" key={e} value={e}>{e}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <Button size="lg" className="w-full" type="submit">
                  <Sparkles className="h-4 w-4" />
                  توليد الجذاذة
                </Button>
              </div>
            </Card>

            
          </form>

        </div>
      </div>
    </div>
  );
}

function SelectFake({ value }: { value: string }) {
  return (
    <div className="flex h-11 items-center justify-between rounded-md border border-outline-variant bg-paper px-3 text-body-md text-on-surface">
      <ChevronDown className="h-4 w-4 text-on-surface-variant" />
      <span>{value}</span>
    </div>
  );
}
function Section({ title, children }: SectionProps) {
  return (
    <div className="mb-6 bg-gray-50/50 p-4 rounded-xl border border-gray-100">
      <h3 className="text-lg font-bold text-[#1e5a8e] mb-3 border-r-4 border-emerald-500 pr-2">
        {title}
      </h3>
      {children}
    </div>
  );
}
