"use client"
import { TopBar } from "@/components/layout/topbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { FileEdit, Sparkles, Lightbulb, Printer, Download, ChevronDown } from "lucide-react";
import { useState } from "react";

export default function NewGenerationPage() {
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [level, setLevel] = useState("");
  const [time,setTime] = useState("45");
  const [pedagogie,setPedagogie] = useState("");
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

  return (
    <div className="min-h-screen">
      <TopBar placeholder="البحث..." />
      <div className="px-6 lg:px-10 pb-12">
        <h1 className="mb-6 text-right text-headline-md font-bold text-on-surface">إنشاء جذاذة جديدة</h1>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 lg:gap-8" dir="ltr">
          {/* Form (right column in RTL) */}
          

          {/* Preview (left column in RTL) */}
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
          </Card>
          {/*form */}
          <div className="space-y-5 order-1 lg:order-2">
            <Card>
              <div className="flex items-center justify-between border-b border-outline-variant/60 px-5 py-4">
                <FileEdit className="h-5 w-5 text-primary" />
                <h2 className="text-title-lg font-semibold text-primary">المعطيات الأساسية</h2>
              </div>
              <div className="p-5 space-y-4">
                <div>
                  <Label className="text-right">عنوان الدرس</Label>
                  <Input 
                  placeholder={"اختر العنوان"}
                    value={title}
                    onChange={(e)=> setTitle(e.target.value)}
                    className="text-right"
                   />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-right">المادة</Label>
                    <select className="w-full appearance-none rounded-lg border border-gray-200 bg-white py-2.5 pr-3 pl-10 text-sm text-gray-900 shadow-sm outline-none transition-all hover:border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-green-200">
                      <option value="" >اختر المادة...</option>
                      {subjects.map((e)=>(
                        <option key={e} value={e}>{e}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label className="text-right">المستوى</Label>
                    <select className="w-full appearance-none rounded-lg border border-gray-200 bg-white py-2.5 pr-3 pl-10 text-sm text-gray-900 shadow-sm outline-none transition-all hover:border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-green-200">
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
                      value={time}
                      onChange={(e)=> setTime(e.target.value)}
              
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
                   <select className="w-full appearance-none rounded-lg border border-gray-200 bg-white py-2.5 pr-3 pl-10 text-sm text-gray-900 shadow-sm outline-none transition-all hover:border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-green-200">
                      <option value="" className="bg-white text-gray-800 font-medium text-right">اختر البيداغوجيا.</option>
                      {pedagogies.map((e)=>(
                        <option className="bg-white text-gray-800 font-medium text-right" key={e} value={e}>{e}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <Button size="lg" className="w-full">
                  <Sparkles className="h-4 w-4" />
                  توليد الجذاذة
                </Button>
              </div>
            </Card>

            
          </div>
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
