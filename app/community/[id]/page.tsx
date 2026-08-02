"use client";

import React, { useEffect, useRef, useState, useTransition } from "react";
import { getPublicLessonById, incrementDownloads } from "../../actions/lesson";
import { TopBar } from "@/components/layout/topbar";
import {
  AlertTriangle,
  CheckCircle2,
  Download,
  Printer,
  Trash2,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import type { LessonContent, LessonPhase } from "@/lib/lesson-content";
import { LessonSection as Section } from "@/components/lesson/lesson-section";

export default function StaticLessonPage() {
   const params = useParams();
  const id = params.id as string;

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


  const router = useRouter();
 

  const [lesson, setLesson] = useState<{
    title: string;
    subject: string;
    level: string;
    pedagogicalApproach: string;
    content: LessonContent;
  } | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    async function fetchLesson() {
      try {
        const data = await getPublicLessonById(id);
        setLesson(data);
      } catch (err) {
        console.error("Failed to fetch lesson:", err);
      }
    }

    if (id) {
      fetchLesson();
    }
  }, [id]);

 
  

  const data = lesson?.content;

  return (
    <div className="min-h-screen">
    
      <div className="px-6 lg:px-10 py-12">
        <div className="mx-auto max-w-7xl" dir="ltr">
          {data ? (
            <section className="order-2 lg:order-1 border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
              <div
                dir="rtl"
                className="min-h-screen bg-white"
                style={{
                  fontFamily: "'Tajawal', 'Cairo', system-ui, sans-serif",
                }}
              >
                {/* شريط التحكم العلوي */}
                <div className="flex items-center justify-between border-b border-gray-200 px-6 py-3 bg-gray-50">
                  <div className="flex items-center gap-3 text-gray-600">
                    <button 
                    className="flex gap-2"
                     onClick={() => handleDownload()}
                     disabled={isGenerating}
                     ><Download/>
                   تحميل</button>
                    
                   
                  </div>
                </div>

                <div className="relative">
                  <div  className="absolute top-0 bottom-0 right-0 w-1 bg-emerald-500" />

                  <div ref={contentRef} className="max-w-5xl mx-auto px-8 py-10">
                    {/* الهوية الأساسية للدرس */}
                    <div className="bg-emerald-50/40 border-emerald-100 p-6 rounded-2xl border mb-6 transition-colors">
                      <h1 className="text-3xl font-bold text-[#1e5a8e] text-center">
                        {lesson?.title || "جذاذة نمطية"}
                      </h1>

                      <div className="mt-4 flex flex-wrap justify-center gap-6 lg:gap-10 text-sm text-gray-700">
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold text-gray-900 whitespace-nowrap">
                            المادة:
                          </span>
                          <span>{lesson?.subject || "⏳"}</span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold text-gray-900 whitespace-nowrap">
                            المستوى:
                          </span>
                          <span>{lesson?.level || "⏳"}</span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold text-gray-900 whitespace-nowrap">
                            المقاربة:
                          </span>
                          <span>
                            {data?.pedagogicalApproach || "المقاربة بالكفايات"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <hr className="my-6 border-gray-100" />

                    {/* الأهداف التعلمية */}
                    {data?.objectives && data.objectives.length > 0 && (
                      <Section title="الأهداف التعلمية">
                        <ul className="list-disc pr-6 space-y-2 text-gray-800">
                          {data.objectives.map((o: string, i: number) => (
                            <li key={i} className="list-none md:list-item">
                              <span className="animate-fade-in">{o}</span>
                            </li>
                          ))}
                        </ul>
                      </Section>
                    )}

                    {/* الكفايات المستهدفة */}
                    {data?.competencies && data.competencies.length > 0 && (
                      <Section title="الكفايات المستهدفة">
                        <ul className="list-disc pr-6 space-y-2 text-gray-800">
                          {data.competencies.map((c: string, i: number) => (
                            <li key={i} className="list-none md:list-item">
                              <span className="animate-fade-in">{c}</span>
                            </li>
                          ))}
                        </ul>
                      </Section>
                    )}

                    {/* المكتسبات القبلية */}
                    {data?.prerequisites && data.prerequisites.length > 0 && (
                      <Section title="المكتسبات القبلية">
                        <ul className="list-disc pr-6 space-y-2 text-gray-800">
                          {data.prerequisites.map((p: string, i: number) => (
                            <li key={i} className="list-none md:list-item">
                              <span className="animate-fade-in">{p}</span>
                            </li>
                          ))}
                        </ul>
                      </Section>
                    )}

                    {/* الوسائل التعليمية */}
                    {data?.didacticMaterials &&
                      data.didacticMaterials.length > 0 && (
                        <Section title="الوسائل التعليمية">
                          <ul className="list-disc pr-6 space-y-2 text-gray-800">
                            {data.didacticMaterials.map(
                              (m: string, i: number) => (
                                <li key={i} className="list-none md:list-item">
                                  <span className="animate-fade-in">{m}</span>
                                </li>
                              )
                            )}
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
                                <th className="border-l border-gray-200 px-4 py-3 font-bold w-32 text-center">
                                  المراحل
                                </th>
                                <th className="border-l border-gray-200 px-4 py-3 font-bold">
                                  أنشطة المدرس
                                </th>
                                <th className="border-l border-gray-200 px-4 py-3 font-bold">
                                  أنشطة المتعلم
                                </th>
                                <th className="px-4 py-3 font-bold w-40 text-center">
                                  التقويم / الدعم
                                </th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                              {data.lessonProcess.map((phase: LessonPhase, i: number) => (
                                <tr
                                  key={i}
                                  className="align-top hover:bg-gray-50/50 transition-colors"
                                >
                                  <td className="border-l border-gray-200 px-3 py-3 text-center font-semibold text-gray-900 bg-gray-50/30">
                                    <div>{phase?.phaseName || "⏳"}</div>
                                    {phase?.duration && (
                                      <div className="text-xs text-emerald-600 font-normal mt-1 bg-emerald-50 px-1 py-0.5 rounded-full inline-block">
                                        {phase.duration} دق
                                      </div>
                                    )}
                                  </td>

                                  <td className="border-l border-gray-200 px-3 py-3 text-gray-800 leading-relaxed">
                                    <div className="whitespace-pre-line">
                                      {phase?.teacherActivity || "..."}
                                    </div>
                                  </td>

                                  <td className="border-l border-gray-200 px-3 py-3 text-gray-800 leading-relaxed">
                                    <div className="whitespace-pre-line">
                                      {phase?.studentActivity || "..."}
                                    </div>
                                  </td>

                                  <td className="px-3 py-3 text-center text-sm font-medium text-amber-700 bg-amber-50/10">
                                    <span>{phase?.evaluationType || "—"}</span>
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
            </section>
          ) : (
            <div className="min-h-[400px] flex items-center justify-center">
              <p className="text-gray-500">جاري تحميل الجذاذة...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

