import React from 'react'
import { getLessonById } from '../actions/lesson'


export default async function page({ params }: { params: Promise<{ id: string }> }) {
    const {id} = await params
    try{
        var data = await getLessonById(id)
        
    }catch(e){

    }
    console.log(data)
  return (
    <div className="max-w-5xl mx-auto px-8 py-10">
  {/* الهوية الأساسية للدرس */}
  <div className="bg-emerald-50/40 border-emerald-100 p-6 rounded-2xl border mb-6 transition-colors">
    <h1 className="text-3xl font-bold text-[#1e5a8e]">
      {data?.title || "جذاذة نمطية"}
    </h1>
    
    <div className="mt-4 flex flex-wrap justify-center gap-6 lg:gap-10 text-sm text-gray-700">
      <div className="flex items-center gap-1.5">
        <span className="font-semibold text-gray-900 whitespace-nowrap">المادة:</span> 
        <span>{data?.subject || "⏳"}</span>
      </div>
      
      <div className="flex items-center gap-1.5">
        <span className="font-semibold text-gray-900 whitespace-nowrap">المستوى:</span> 
        <span>{data?.level || "⏳"}</span>
      </div>
      
      <div className="flex items-center gap-1.5">
        <span className="font-semibold text-gray-900 whitespace-nowrap">المقاربة:</span> 
        <span>{data?.pedagogicalApproach || "المقاربة بالكفايات"}</span>
      </div>
    </div>
  </div>

  <hr className="my-6 border-gray-100" />

  {/* الأهداف التعلمية */}
  {data?.content?.objectives && (
    <Section title="الأهداف التعلمية">
      <ul className="list-disc pr-6 space-y-2 text-gray-800">
        {data.content.objectives.map((o: string, i: number) => (
          <li key={i} className="list-none md:list-item">
            <span className="animate-fade-in">{o}</span>
          </li>
        ))}
      </ul>
    </Section>
  )}

  {/* الكفايات المستهدفة */}
  {data?.content?.competencies && (
    <Section title="الكفايات المستهدفة">
      <ul className="list-disc pr-6 space-y-2 text-gray-800">
        {data.content.competencies.map((c: string, i: number) => (
          <li key={i} className="list-none md:list-item">
            <span className="animate-fade-in">{c}</span>
          </li>
        ))}
      </ul>
    </Section>
  )}

  {/* المكتسبات القبلية */}
  {data?.content?.prerequisites && (
    <Section title="المكتسبات القبلية">
      <ul className="list-disc pr-6 space-y-2 text-gray-800">
        {data.content.prerequisites.map((p: string, i: number) => (
          <li key={i} className="list-none md:list-item">
            <span className="animate-fade-in">{p}</span>
          </li>
        ))}
      </ul>
    </Section>
  )}

  {/* الوسائل التعليمية */}
  {data?.content?.didacticMaterials && (
    <Section title="الوسائل التعليمية">
      <ul className="list-disc pr-6 space-y-2 text-gray-800">
        {data.content.didacticMaterials.map((m: string, i: number) => (
          <li key={i} className="list-none md:list-item">
            <span className="animate-fade-in">{m}</span>
          </li>
        ))}
      </ul>
    </Section>
  )}

  {/* سيرورة الحصة في جدول */}
  {data?.content?.lessonProcess && data.content.lessonProcess.length > 0 && (
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
            {data.content.lessonProcess.map((phase: any, i: number) => (
              <tr key={i} className="align-top hover:bg-gray-50/50 transition-colors">
                <td className="border-l border-gray-200 px-3 py-3 text-center font-semibold text-gray-900 bg-gray-50/30">
                  <div>{phase?.phaseName || "⏳"}</div>
                  {phase?.duration && (
                    <div className="text-xs text-emerald-600 font-normal mt-1 bg-emerald-50 px-1 py-0.5 rounded-full inline-block">
                      {phase.duration} دق
                    </div>
                  )}
                </td>
                
                <td className="border-l border-gray-200 px-3 py-3 text-gray-800 leading-relaxed">
                  <div className="whitespace-pre-line">{phase?.teacherActivity || "..."}</div>
                </td>
                
                <td className="border-l border-gray-200 px-3 py-3 text-gray-800 leading-relaxed">
                  <div className="whitespace-pre-line">{phase?.studentActivity || "..."}</div>
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
  {data?.content?.homework && (
    <Section title="الواجب المنزلي والأمور الامتدادية">
      <p className="text-gray-800 leading-relaxed p-2 bg-amber-50/30 rounded-lg border border-amber-100/50">
        {data.content.homework}
      </p>
    </Section>
  )}
</div>
  )
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
interface SectionProps {
  title: string;
  children: React.ReactNode;
}
