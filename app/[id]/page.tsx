"use client"
import { useReactToPrint } from "react-to-print";
import React, { useEffect, useRef, useState, useTransition } from 'react'
import { deleteLesson, getLessonById, incrementDownloads, shareLesson, updateLessonContent } from '../actions/lesson'
import { TopBar } from '@/components/layout/topbar';
import { AlertTriangle, Check, CheckCircle2, Download, FileEdit, Lightbulb, Loader2, Printer, Save, Sparkles, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useParams, useRouter } from 'next/navigation';
import { Corben } from 'next/font/google';
import { toast } from 'sonner';
import type { LessonContent, LessonPhase } from '@/lib/lesson-content';
import { LessonSection as Section } from '@/components/lesson/lesson-section';

interface MetaState {
  success: boolean | null;
  message: string;
  id: string ;
}
interface FormState {
  success: boolean | null;
  message: string;
}

export default function page() {



  const router = useRouter()
    const params = useParams()
    const id = params.id as string
    const [lessonData, setLessonData] = useState<LessonContent | null>(null);
    const [isPublic,setIsPublic] = useState<boolean | undefined>()
    const [edit, setEdit] = useState(false);
    
    const [savingStatus,setSavingStatus] = useState("idle") 
    const [subject,setSubject] = useState("") 
    const [level,setLevel] = useState("") 
    const [title,setTitle] = useState("") 
    
    useEffect(() => {
    let ignore = false // Prevents state updates on unmounted components

    async function fetchStats() {
      try {
       
        const data =  await getLessonById(id)
        if (data){

          setIsPublic(data?.isPublic)
      
        
          setLessonData(data?.content)
         
          setLevel(data?.level)
        
          setSubject(data?.subject)
        
          setTitle(data?.title)
        
        }
        
      } catch (err) {
        
          
          
      }
    }

    fetchStats()

    
  }, [])

    
    
    
      // 🛠️ State Management Handlers for Inline Editing
      const handleFieldChange = (field: keyof LessonContent, value: string) => {
        setLessonData((prev) => prev && ({
          ...prev,
          [field]: value
        }));
      };
    
      const handleArrayFieldChange = (field: "objectives" | "competencies" | "prerequisites" | "didacticMaterials", index: number, value: string) => {
        setLessonData((prev) => {
          if (!prev) return prev;
          const updatedArray = [...(prev[field] || [])];
          updatedArray[index] = value;
          return { ...prev, [field]: updatedArray };
        });
      };
    
      const handleTableFieldChange = (index: number, key: keyof LessonPhase, value: string) => {
        setLessonData((prev) => {
          if (!prev) return prev;
          const updatedProcess = [...(prev.lessonProcess || [])];
          updatedProcess[index] = { ...updatedProcess[index], [key]: value };
          return { ...prev, lessonProcess: updatedProcess };
        });
      };
      const handleSaveToLibrary = async ()=>{
          try{
            if (!lessonData) return
            setSavingStatus("saving") 
            const res = await updateLessonContent(id,lessonData)
            
            if (res.success){
              setSavingStatus("saved")
              setTimeout(() => {
              setSavingStatus("idle");
              setTimeout(() => {
                setEdit(prev => !prev)
              }, 1000);
            }, 2000);
            }
          }catch(e){
      
          }
          
        }
        const [isPending, startTransition] = useTransition()

  const handleDelete = () => {
    // Wrap the async operation inside startTransition
    startTransition(async () => {
      try {
        const res = await deleteLesson(id)
        if (res.success){
          router.push('/')
          toast.success("تم حذف الجذاذة بنجاح", {
            icon: <CheckCircle2 className="w-5 h-5 text-emerald-500" />,
            duration: 4000,
          })
        }
        console.log('Deleted successfully!')
      } catch (error) {
        toast.error( "حدث خطأ ما", {
            icon: <AlertTriangle className="w-5 h-5 text-red-500" />,
          })
        console.error('Failed to delete:', error)
      }
    })
  }
      
  

  const contentRef = useRef<HTMLDivElement>(null);
    const [isGenerating, setIsGenerating] = useState(false);
  
    const handleDownload = async () => {
      if (!contentRef.current) return;
      setIsGenerating(true);
  
      try {
        // Import the client-side browser package
        
        const html2pdf = (await import('html2pdf.js')).default;
  
        const options = {
          margin: [10, 10, 10, 10] as [number, number, number, number],
          filename: "download.pdf" ,
          image: { type: 'jpeg' as const, quality: 0.98 },
          html2canvas: { scale: 2, useCORS: true },
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' as const },
        };
        await html2pdf().set(options).from(contentRef.current).save();
        await incrementDownloads(id)
      } catch (error) {
        console.error('Download failed:', error);
      } finally {
        setIsGenerating(false);
      }
    };
    const handlePrint = useReactToPrint({
  contentRef: contentRef,
  documentTitle: "جذاذة-درس",
});

var data = lessonData
  return (
    <div className="min-h-screen">
      <TopBar placeholder="البحث..." />
      <div className="px-6 lg:px-10 pb-12">
       

        <div className="mx-auto max-w-7xl" dir="ltr">
          
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
                    <button
                    onClick={()=>handlePrint()} 
                    className="p-2 hover:bg-gray-200 rounded-md transition" aria-label="طباعة">
                      <Printer className="w-5 h-5" />
                    </button>
                    <button onClick={()=> handleDownload()} disabled={isGenerating} className="p-2 hover:bg-gray-200 rounded-md transition" aria-label="تحميل">
                      <Download className="w-5 h-5" />
                    </button>
                    <button 
                    onClick={handleDelete}
                    className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" 
                    aria-label="حذف">
                      <Trash2 className="w-5 h-5" />
                    </button>
                    
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
                    <Publish sharedStatus={isPublic} />
                   
                  </div>
                  
                  
                </div>

                <div className="relative">
                  <div className={`absolute top-0 bottom-0 right-0 w-1 transition-colors ${edit ? "bg-amber-500" : "bg-emerald-500"}`} />

                  <div  ref={contentRef} className="max-w-5xl mx-auto px-8 py-10">
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
                          { title || "جذاذة نمطية"}
                        </h1>
                      )}
                      
                      <div className="mt-4 flex flex-wrap justify-center gap-6 lg:gap-10 text-sm text-gray-700">
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold text-gray-900 whitespace-nowrap">المادة:</span> 
                          
                            <span>{ subject || "⏳"}</span>
                        
                        </div>
                        
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold text-gray-900 whitespace-nowrap">المستوى:</span> 
                         
                            <span>{ level || "⏳"}</span>
                         
                        </div>
                        
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold text-gray-900 whitespace-nowrap">المقاربة:</span> 
                          
                            <span>{data?.pedagogicalApproach || "المقاربة بالكفايات"}</span>
                         
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
                              {data.lessonProcess.map((phase: LessonPhase, i: number) => (
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
            <div className="">
            
            </div>
          )}

          

        </div>
      </div>
    </div>
  );
}

function Publish({ sharedStatus }:{ sharedStatus : boolean | undefined }) {
  console.log(sharedStatus)
  const [isShared, setIsShared] = useState(sharedStatus);
  const router = useRouter()
    const params = useParams()
    const id = params.id as string

  const handlePublish = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault()
    const nextSharedState = !isShared;
    setIsShared(nextSharedState)
    
    try{
        const res = await shareLesson(id ,nextSharedState)
    console.log(res)
    }catch(e){

    }
    
  };

  return (
    <div className="flex flex-col items-center gap-4 p-4   max-w-sm mx-auto bg-slate-50" dir="rtl">
      
      {/* Toggle Switch Container */}
      <div className="flex items-center justify-between w-full px-2">
        <span className="text-sm font-medium  text-slate-700">
          {isShared ?' إلغاء النشر': ' نشر'  }
        </span>
        
        <button
          type="button"
          onClick={(e) => handlePublish(e)}
          className={`
            relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent 
            transition-colors duration-200 ease-in-out focus:outline-none
            ${isShared ? 'bg-emerald-600' : 'bg-slate-200'}
          `}
        >
          {/* Toggle Knob */}
          <span
            className={`
              pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 
              transition duration-200 ease-in-out
              ${isShared ? '-translate-x-5' : 'translate-x-0'}
            `}
          />
        </button>
      </div>

    
    </div>
  );
}

