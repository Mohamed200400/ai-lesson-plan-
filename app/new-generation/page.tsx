
"use client"
import { TopBar } from "@/components/layout/topbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { FileEdit, Sparkles, Lightbulb, Printer, Download, ChevronDown, Check, X, Save, Loader2 } from "lucide-react";
import { useActionState, useRef, useState } from "react";
import { generateLesson, incrementDownloads, updateLessonContent } from "../actions/lesson";
import { useSession } from "next-auth/react";
import { generateLessonSchema } from "@/lib/validations/lesson";
import { toast } from "sonner";
const partialParse = require('partial-json-parser');

interface MetaState {
  success: boolean | null;
  message: string;
  id: string ;
}
interface FormState {
  success: boolean | null;
  message: string;
}

interface SectionProps {
  title: string;
  children: React.ReactNode;
}

export default function NewGenerationPage() {



  const { data: session } = useSession();

  const userId = (session?.user as { id?: string })?.id
  
  const [meta, setMeta] = useState<MetaState>({
    success: null,
    message: "",
    id: "",
  });

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
  const [edit, setEdit] = useState(false);

  const [savingStatus,setSavingStatus] = useState("idle") 


  // 🛠️ State Management Handlers for Inline Editing
  const handleFieldChange = (field: string, value: string) => {
    setLessonData((prev: any) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleArrayFieldChange = (field: string, index: number, value: string) => {
    setLessonData((prev: any) => {
      const updatedArray = [...(prev[field] || [])];
      updatedArray[index] = value;
      return { ...prev, [field]: updatedArray };
    });
  };

  const handleTableFieldChange = (index: number, key: string, value: string) => {
    setLessonData((prev: any) => {
      const updatedProcess = [...(prev.lessonProcess || [])];
      updatedProcess[index] = { ...updatedProcess[index], [key]: value };
      return { ...prev, lessonProcess: updatedProcess };
    });
  };

  const [state, formAction, isPending] = useActionState(
    async (prevState: FormState, formData: FormData): Promise<FormState> => {
      setStreamedText("");
      setLessonData(null)
      setEdit(false);
      setMeta({ success: null, message: "", id: "" });

      const rawData = Object.fromEntries(formData.entries());
      const validation = generateLessonSchema.safeParse(rawData);

      if (!validation.success) {
      // Extract the first validation error message to display
      const firstError = validation.error.issues[0]?.message || "يرجى التأكد من البيانات المدخلة.";

        toast.error(firstError);

      setMeta({
        success: false,
        message: firstError,
        id: "",
      });
      console.log(firstError)

      return {
        success: false,
        message: firstError,
      };
    }

      try {
                if (!userId) {
          // Handle unauthenticated state (e.g., return early, show toast, or redirect)
          console.error("User is not authenticated");
         return {
            success: false,
            message: "User is not authenticated",
          };
        }
        
        const stream = await generateLesson( userId ,formData);
        let accumulatedText = ""
        
        for await (const chunk of stream) {
          if (chunk.startsWith("||METADATA||")) {
            const jsonString = chunk.replace("||METADATA||", "");
            const parsedMeta = JSON.parse(jsonString) as MetaState;
            setMeta(parsedMeta); 
            continue; 
          }

          accumulatedText += chunk;
          setStreamedText(accumulatedText);
       
          try {
            const parsedPartial = partialParse(accumulatedText);
            setLessonData(parsedPartial); 
          } catch (e) {
            // Ignore temporary parser errors during live streaming updates
          }
        }

        return { success: true, message: "تمت صياغة وحفظ الجذاذة بنجاح!" };

      } catch (error) {
        toast.error( "حدث خطأ غير متوقع في خط الاتصال بالخادم.");
        setMeta({
          success: false,
          message: "حدث خطأ غير متوقع في خط الاتصال بالخادم.",
          id: "",
        });
        console.error("حدث خطأ أثناء البث:", error);
        return { success: false, message: "حدث خطأ غير متوقع أثناء التوليد." };
      }
    },
    { success: null, message: "" }
  );
  
  const handleSaveToLibrary = async ()=>{
    try{
      setSavingStatus("saving") 
      const res = await updateLessonContent(meta.id,lessonData)
      
      if (res.success){
        setSavingStatus("saved")
        setTimeout(() => {
        setSavingStatus("idle");
        setTimeout(() => {
          setEdit(prev => !prev)
        }, 3000);
      }, 3000);
      toast.success("تم حفظ الجذاذة بنجاح");
      }
    }catch(e){

    }
    
  }

  let data = lessonData;

  

  return (
    <div className="min-h-screen">
      
      <div className="px-6 lg:px-10 py-12">
        <h1 className="mb-6 text-right text-headline-md font-bold text-on-surface">إنشاء جذاذة جديدة</h1>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 lg:gap-8" dir="ltr">
          
          {data ? (
            <section className="order-2 lg:order-1 border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
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
                   {/* <button
                    onClick={ ()=> handleDownload()}
                    disabled={isGenerating}
                    className="p-2 hover:bg-gray-200 rounded-md transition" aria-label="تحميل">
                      <Download className="w-5 h-5" />
                    </button>*/}
                    
                    {edit ? 
                     <button
      type="button"
      
      onClick={() => handleSaveToLibrary()}
      className={`
        flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold
        transition-all duration-250 shadow-sm border
        ${savingStatus === "idle"? "bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-600 hover:shadow-md active:scale-95" : ""}
        ${savingStatus === "saving" ? "bg-emerald-50 text-emerald-700 border-emerald-200 cursor-not-allowed" : ""}
        ${savingStatus === "saved" ? "bg-emerald-100 text-emerald-800 border-emerald-300 shadow-none cursor-default" : ""}
      `}
      dir="rtl"
    >
    
      {savingStatus === "idle" && (
        <>
          <Save className="w-4 h-4 transition-transform group-hover:scale-110" />
          <span>حفظ التغييرات</span>
        </>
      )}

     
      {savingStatus === "saving" && (
        <>
          <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
          <span>جاري حفظ البيانات...</span>
        </>
      )}

     
      {savingStatus === "saved" && (
        <>
          <Check className="w-4 h-4 text-emerald-700 stroke-[3]" />
          <span>تم الحفظ بنجاح</span>
        </>
      )}
    </button> :
                    
                    <button 
                      type="button" 
                      onClick={() => setEdit(!edit)} 
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors  bg-gray-100 text-gray-700 hover:bg-gray-200"
                      `}
                    >
                      
                        <>
                          <FileEdit className="w-4 h-4 text-gray-600" />
                          <span>تعديل الجذاذة</span>
                        </>
                      
                    </button>}
                   
                  </div>
                  
                  <div className="flex items-center gap-2 text-gray-800 font-semibold">
                    <span>{edit ? "وضع التعديل النشط" : "معاينة التوليد البيداغوجي"}</span>
                    <Sparkles className={`w-5 h-5 text-emerald-500 ${isPending ? "animate-spin" : "animate-pulse"}`} />
                  </div>
                </div>

                <div className="relative">
                  <div className={`absolute top-0 bottom-0 right-0 w-1 transition-colors ${edit ? "bg-amber-500" : "bg-emerald-500"}`} />

                  <div   className="max-w-5xl mx-auto px-8 py-10">
                    {/* الهوية الأساسية للدرس */}
                    <div className={`${edit ? "bg-amber-50/40 border-amber-100" : "bg-emerald-50/40 border-emerald-100"} p-6 rounded-2xl border mb-6 transition-colors`}>
                      {edit ? (
                        <Input 
                          value={data.title || ""} 
                          onChange={(e) => handleFieldChange("title", e.target.value)}
                          className="text-center font-bold text-xl border-amber-300 focus-visible:ring-amber-400 max-w-xl mx-auto bg-white"
                          placeholder="عنوان الجذاذة"
                        />
                      ) : (
                        <h1 className="text-3xl font-bold text-[#1e5a8e]">
                          {data?.title || "جذاذة نمطية"}
                        </h1>
                      )}
                      
                      <div className="mt-4 flex flex-wrap justify-center gap-6 lg:gap-10 text-sm text-gray-700">
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold text-gray-900 whitespace-nowrap">المادة:</span> 
                          {edit ? (
                            <select 
                              value={data.subject || ""} 
                              onChange={(e) => handleFieldChange("subject", e.target.value)}
                              className="rounded border border-gray-300 px-2 py-0.5 bg-white text-xs text-right outline-none"
                            >
                              <option value="">اختر...</option>
                              {subjects.map((s) => <option key={s} value={s}>{s}</option>)}
                            </select>
                          ) : (
                            <span>{data?.subject || "⏳"}</span>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold text-gray-900 whitespace-nowrap">المستوى:</span> 
                          {edit ? (
                            <select 
                              value={data.level || ""} 
                              onChange={(e) => handleFieldChange("level", e.target.value)}
                              className="rounded border border-gray-300 px-2 py-0.5 bg-white text-xs text-right outline-none"
                            >
                              <option value="">اختر...</option>
                              {levels.map((l) => <option key={l} value={l}>{l}</option>)}
                            </select>
                          ) : (
                            <span>{data?.level || "⏳"}</span>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold text-gray-900 whitespace-nowrap">المقاربة:</span> 
                          {edit ? (
                            <select 
                              value={data.pedagogicalApproach || ""} 
                              onChange={(e) => handleFieldChange("pedagogicalApproach", e.target.value)}
                              className="rounded border border-gray-300 px-2 py-0.5 bg-white text-xs text-right outline-none"
                            >
                              <option value="">اختر...</option>
                              {pedagogies.map((p) => <option key={p} value={p}>{p}</option>)}
                            </select>
                          ) : (
                            <span>{data?.pedagogicalApproach || "المقاربة بالكفايات"}</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <hr className="my-6 border-gray-100" />

                    {/* الأهداف التعلمية */}
                    {data?.objectives && (
                      <Section title="الأهداف التعلمية">
                        <ul className="list-disc pr-6 space-y-2 text-gray-800">
                          {data.objectives.map((o: string, i: number) => (
                            <li key={i} className="list-none md:list-item">
                              {edit ? (
                                <Input 
                                  value={o} 
                                  onChange={(e) => handleArrayFieldChange("objectives", i, e.target.value)}
                                  className="text-right border-gray-200 focus-visible:ring-amber-400 bg-white h-9 mt-1"
                                />
                              ) : (
                                <span className="animate-fade-in">{o}</span>
                              )}
                            </li>
                          ))}
                        </ul>
                      </Section>
                    )}

                    {/* الكفايات المستهدفة */}
                    {data?.competencies && (
                      <Section title="الكفايات المستهدفة">
                        <ul className="list-disc pr-6 space-y-2 text-gray-800">
                          {data.competencies.map((c: string, i: number) => (
                            <li key={i} className="list-none md:list-item">
                              {edit ? (
                                <Input 
                                  value={c} 
                                  onChange={(e) => handleArrayFieldChange("competencies", i, e.target.value)}
                                  className="text-right border-gray-200 focus-visible:ring-amber-400 bg-white h-9 mt-1"
                                />
                              ) : (
                                <span className="animate-fade-in">{c}</span>
                              )}
                            </li>
                          ))}
                        </ul>
                      </Section>
                    )}

                    {/* المكتسبات القبلية */}
                    {data?.prerequisites && (
                      <Section title="المكتسبات القبلية">
                        <ul className="list-disc pr-6 space-y-2 text-gray-800">
                          {data.prerequisites.map((p: string, i: number) => (
                            <li key={i} className="list-none md:list-item">
                              {edit ? (
                                <Input 
                                  value={p} 
                                  onChange={(e) => handleArrayFieldChange("prerequisites", i, e.target.value)}
                                  className="text-right border-gray-200 focus-visible:ring-amber-400 bg-white h-9 mt-1"
                                />
                              ) : (
                                <span className="animate-fade-in">{p}</span>
                              )}
                            </li>
                          ))}
                        </ul>
                      </Section>
                    )}

                    {/* الوسائل التعليمية */}
                    {data?.didacticMaterials && (
                      <Section title="الوسائل التعليمية">
                        <ul className="list-disc pr-6 space-y-2 text-gray-800">
                          {data.didacticMaterials.map((m: string, i: number) => (
                            <li key={i} className="list-none md:list-item">
                              {edit ? (
                                <Input 
                                  value={m} 
                                  onChange={(e) => handleArrayFieldChange("didacticMaterials", i, e.target.value)}
                                  className="text-right border-gray-200 focus-visible:ring-amber-400 bg-white h-9 mt-1"
                                />
                              ) : (
                                <span className="animate-fade-in">{m}</span>
                              )}
                            </li>
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
                                  <td className="border-l border-gray-200 px-3 py-3 text-center font-semibold text-gray-900 bg-gray-50/30">
                                    {edit ? (
                                      <div className="space-y-2">
                                        <Input 
                                          value={phase?.phaseName || ""} 
                                          onChange={(e) => handleTableFieldChange(i, "phaseName", e.target.value)}
                                          className="text-right text-xs bg-white" 
                                          placeholder="اسم المرحلة"
                                        />
                                        <div className="flex items-center gap-1 justify-center">
                                          <Input 
                                            value={phase?.duration || ""} 
                                            onChange={(e) => handleTableFieldChange(i, "duration", e.target.value)}
                                            className="text-center text-xs bg-white w-14 h-7 p-1" 
                                          />
                                          <span className="text-xs text-gray-500">دق</span>
                                        </div>
                                      </div>
                                    ) : (
                                      <>
                                        <div>{phase?.phaseName || "⏳"}</div>
                                        {phase?.duration && (
                                          <div className="text-xs text-emerald-600 font-normal mt-1 bg-emerald-50 px-1 py-0.5 rounded-full inline-block">
                                            {phase.duration} دق
                                          </div>
                                        )}
                                      </>
                                    )}
                                  </td>
                                  
                                  <td className="border-l border-gray-200 px-3 py-3 text-gray-800 leading-relaxed">
                                    {edit ? (
                                      <textarea 
                                        value={phase?.teacherActivity || ""} 
                                        onChange={(e) => handleTableFieldChange(i, "teacherActivity", e.target.value)}
                                        className="w-full p-2 text-right text-sm bg-white min-h-[100px] border border-gray-200 rounded-lg outline-none transition-all focus:border-amber-400 focus:ring-1 focus:ring-amber-400 resize-y"
                                      />
                                    ) : (
                                      <div className="whitespace-pre-line">{phase?.teacherActivity || "..."}</div>
                                    )}
                                  </td>
                                  
                                  <td className="border-l border-gray-200 px-3 py-3 text-gray-800 leading-relaxed">
                                    {edit ? (
                                      <textarea 
                                        value={phase?.studentActivity || ""} 
                                        onChange={(e) => handleTableFieldChange(i, "studentActivity", e.target.value)}
                                        className="w-full p-2 text-right text-sm bg-white min-h-[100px] border border-gray-200 rounded-lg outline-none transition-all focus:border-amber-400 focus:ring-1 focus:ring-amber-400 resize-y"
                                      />
                                    ) : (
                                      <div className="whitespace-pre-line">{phase?.studentActivity || "..."}</div>
                                    )}
                                  </td>
                                  
                                  <td className="px-3 py-3 text-center text-sm font-medium text-amber-700 bg-amber-50/10">
                                    {edit ? (
                                      <Input 
                                        value={phase?.evaluationType || ""} 
                                        onChange={(e) => handleTableFieldChange(i, "evaluationType", e.target.value)}
                                        className="text-right text-xs bg-white"
                                        placeholder="نوع التقييم"
                                      />
                                    ) : (
                                      <span>{phase?.evaluationType || "—"}</span>
                                    )}
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
                        {edit ? (
                          <textarea 
                            value={data.homework} 
                            onChange={(e) => handleFieldChange("homework", e.target.value)}
                            className="w-full p-2 text-right text-sm bg-white min-h-[100px] border border-amber-200 rounded-lg outline-none transition-all focus:border-amber-400 focus:ring-1 focus:ring-amber-400 resize-y"
                          />
                        ) : (
                          <p className="text-gray-800 leading-relaxed p-2 bg-amber-50/30 rounded-lg border border-amber-100/50">
                            {data.homework}
                          </p>
                        )}
                      </Section>
                    )}
                  </div>
                </div>
              </div>
            </section>
          ) : (
            <div className="order-2 lg:order-1 flex items-center justify-center border-2 border-dashed border-gray-200 rounded-2xl p-12 bg-gray-50/50 text-gray-400 min-h-[400px]">
              <div className="text-center space-y-2">
                <Lightbulb className="w-8 h-8 mx-auto text-gray-300" />
                <p className="text-sm font-medium">يرجى ملء البيانات الجانبية لتوليد خطة الدرس</p>
              </div>
            </div>
          )}

          {/* form */}
          <form action={formAction} className="space-y-5 order-1 lg:order-2">
            <Card>
              <div className="flex items-center justify-between border-b border-outline-variant/60 px-5 py-4">
                <FileEdit className="h-5 w-5 text-primary" />
                <h2 className="text-title-lg font-semibold text-primary">المعطيات الأساسية</h2>
              </div>
              <div className="p-5 space-y-4">
                <div>
                  <Label className="text-right block mb-1">عنوان الدرس</Label>
                  <Input 
                    name="title"
                    placeholder="اختر العنوان أو المفهوم البيداغوجي"
                    className="text-right"
                   
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-right block mb-1">المادة</Label>
                    <select 
                      name="subject"
                   
                      className="w-full appearance-none rounded-lg border border-gray-200 bg-white py-2.5 pr-3 pl-10 text-sm text-gray-900 shadow-sm outline-none transition-all hover:border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-green-200">
                      <option value="">اختر المادة...</option>
                      {subjects.map((e) => (
                        <option key={e} value={e}>{e}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label className="text-right block mb-1">المستوى</Label>
                    <select 
                      name="level"
                     
                      className="w-full appearance-none rounded-lg border border-gray-200 bg-white py-2.5 pr-3 pl-10 text-sm text-gray-900 shadow-sm outline-none transition-all hover:border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-green-200">
                      <option value="">اختر المستوى..</option>
                      {levels.map((e) => (
                        <option key={e} value={e}>{e}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div></div>
                  <div>
                    <Label className="text-right block mb-1">المدة الزمنية</Label>
                    <div className="relative">
                      <Input 
                        name="time"
                        className="text-right pr-12" 
                        placeholder="60"
                       
                      />
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">دقيقة</span>
                    </div>
                  </div>
                </div>
                <div>
                  <Label className="flex items-center justify-between mb-1">
                    <Sparkles className="h-3.5 w-3.5 text-success" />
                    <span className="text-right">المقاربة البيداغوجية</span>
                  </Label>
                  <div className="rounded-md border-2 border-success/40 bg-paper">
                    <select
                      name="pedagogie"
                      
                      className="w-full appearance-none rounded-lg border border-gray-200 bg-white py-2.5 pr-3 pl-10 text-sm text-gray-900 shadow-sm outline-none transition-all hover:border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-green-200">
                      <option value="" className="bg-white text-gray-800 font-medium text-right">اختر البيداغوجيا.</option>
                      {pedagogies.map((e) => (
                        <option className="bg-white text-gray-800 font-medium text-right" key={e} value={e}>{e}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <Button size="lg" className="w-full" type="submit" disabled={isPending}>
                  <Sparkles className={`h-4 w-4 ${isPending ? 'animate-spin' : ''}`} />
                  {isPending ? "جاري التوليد الذكي..." : "توليد الجذاذة البيداغوجية"}
                </Button>
              </div>
            </Card>
          </form>

        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: SectionProps) {
  return (
    <div className="mb-6 bg-gray-50/50 p-4 rounded-xl border border-gray-100 text-right">
      <h3 className="text-lg font-bold text-[#1e5a8e] mb-3 border-r-4 border-emerald-500 pr-2">
        {title}
      </h3>
      {children}
    </div>
  );
}