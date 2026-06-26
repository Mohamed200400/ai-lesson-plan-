import { TopBar } from "@/components/layout/topbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/input";
import { Plus, Zap, Folder, FolderPlus, FileText, Sparkles, Calculator, FlaskConical } from "lucide-react";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Link from "next/link";





export default async function DashboardPage() {
        
        const session = await getServerSession(authOptions)
        //@ts-ignore
        const userId =session?.user.id
        
        const lessons = await prisma.lessonPlan.findMany({
          where : {  userId },
        })
        const lessonCount = lessons.length
        
        const sharedLesson = await prisma.lessonPlan.findMany({
           where: {
              userId: userId,    
              isPublic: true,    
        }}) 
        const sharedCount = sharedLesson.length;
        

       const savedLesson = await prisma.user.findUnique({
          where: {
            id: userId, // 1. 'where' needs an object specifying the field (e.g., id or userId)
          },
          include: {
            savedLessons: true, // 2. 'include' sits outside the 'where' object
          },
});
          const savedCount = savedLesson?.savedLessons.length
          const stats = [
              { value: savedCount , label: "عنصر محفوظ" },
              { value: sharedCount , label: "تمت مشاركتها" },
              { value: lessonCount , label: "درس تم إنشاؤها" },
            ];
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
                
                مرحباً بعودتك، { session?.user?.name}! <span aria-hidden>👋</span>
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
                  <Link href="/new-generation" ><Plus className="h-5 w-5 text-primary" /></Link>
                </div>
              </div>
              <div className="text-right">
                <h3 className="text-title-lg font-bold text-primary">إنشاء خطة درس جديدة</h3>
                <p className="mt-2 text-body-md text-on-surface-variant">
                  استخدم الذكاء الاصطناعي لتوليد خطة درس متكاملة في ثوانٍ.
                </p>
                <Link href="/new-generation"><Button className="mt-4 w-full" size="lg">
                  <Sparkles className="h-4 w-4" />
                  ابدأ التوليد
                </Button></Link>
              </div>
            </Card>

            {/*{lesson.map((q) => (
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
                   
            ))}*/}
          </div>
        </section>

        
        
      </div>
    </div>
  );
}
