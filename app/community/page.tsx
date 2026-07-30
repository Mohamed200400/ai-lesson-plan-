"use client"

import { TopBar } from "@/components/layout/topbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/input";
import { Heart, Download, Copy, FileText, Sparkles, ChevronDown, SlidersHorizontal } from "lucide-react";
import { useEffect, useState } from "react";
import { getPublicLesson } from "../actions/lesson";
import { toggleLike } from "../actions/like";
import { useSession } from "next-auth/react";
import Link from "next/link";


type Post = {
  author: string;
  meta: string;
  when: string;
  title: string;
  desc: string;
  tags: string[];
  likes: number;
  downloads: number;
  ai?: boolean;
};

type Lesson = {
 success: boolean;
 message: string;
 data: ({
 likes: {
 id: string;
 createdAt: Date;
 userId: string;
 lessonPlanId: string;
 }[];
 } &{
  user : {
    name: string;
    image: string | null;
  }
 }& {
 title: string;
 subject: string;
 level: string;
 duration: number;
 id: string;
 createdAt: Date;
 updatedAt: Date;
 pedagogicalApproach: string;
 content: any ;
 isPublic: boolean;
 downloadsCount: number;
 userId: string;
 })[];
} | {
 success: boolean;
 message: string;
 data: undefined;
}



export default function CommunityPage() {
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
  
  const { data: session } = useSession();

  const [lessons, setLessons] = useState<Lesson>();
  const [loading, setLoading] = useState(true);
  const [upd,setUpd] = useState(true)
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');
  //@ts-ignore
  const id =  session?.user?.id;

  const [liked,setLiked] = useState()

  useEffect(()=>{
    async function fetchLessons() {
      try{
        
          const data : any = await getPublicLesson()
          setLessons(data);
          console.log(data)
      } catch (e) {
        console.error("Failed to fetch lessons", e);
      } finally {
        setLoading(false);
      }
    }
    fetchLessons();
  }, [upd]);

      const allLessons = lessons?.data || [];


      let filteredLesson = selectedSubject
        ? allLessons.filter((lesson: any) => lesson.subject === selectedSubject)
        : allLessons;
      
        filteredLesson = selectedLevel ? filteredLesson.filter((lesson: any) => lesson.level === selectedLevel) : filteredLesson;



  const updateLike = async (e:any,p:any)=>{
    e.preventDefault();
    setUpd(prev => !prev)
    try{
      const result = await toggleLike( p.id);
      console.log(result)
      
      console.log(id)
    }catch(e){
      console.log(e)
    }
  }
          
    
  return (
    <div className="min-h-screen">
    

      <div className="px-6 lg:px-10 py-12">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <h1 className="text-headline-lg font-bold text-on-surface">مجتمع المعلمين</h1>
          <p className="mt-2 text-body-md text-on-surface-variant">
            اكتشف واستلهم من آلاف خطط الدروس المميزة التي شاركها زملاؤك.
          </p>
        </div>

        {/* Filters */}
        <Card className="p-3 flex flex-wrap items-center gap-2 mb-8 justify-end">
        
         <SlidersHorizontal className="h-4 w-4 text-on-surface-variant" />
  <select
  value={selectedSubject}
  onChange={(e) => setSelectedSubject(e.target.value)}
  
    className="
      h-10 px-4 pl-10 rounded-md border border-outline-variant bg-paper 
      text-label-md text-on-surface-variant 
      hover:border-primary hover:text-primary 
      focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary
      appearance-none cursor-pointer transition-colors
    "
  >
        <option value="">جميع المواد </option>
    
    {subjects.map((subject, index) => (
      <option key={index} value={subject} className="text-gray-900 bg-white">
        {subject}
      </option>
    ))}
  </select>

  
  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-on-surface-variant">
    <ChevronDown className="h-4 w-4" />
  </div>

        

          <select
    value={selectedLevel}
    onChange={(e)=> setSelectedLevel(e.target.value)}
    className="
      h-10 px-4 pl-10 rounded-md border border-outline-variant bg-paper 
      text-label-md text-on-surface-variant 
      hover:border-primary hover:text-primary 
      focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary
      appearance-none cursor-pointer transition-colors
    "
  >
    <option value="" >
    جميع المراحل
    </option>
    {levels.map((lvl, index) => (
      <option key={index} value={lvl} className="text-gray-900 bg-white">
        {lvl}
      </option>
    ))}
  </select>
         
          <button className="grid h-10 w-10 place-items-center rounded-md hover:bg-surface-low ml-auto">
            
          </button>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredLesson?.map((p) => (
            <Card key={p.title} className="flex flex-col p-5">
              {
                <div className="self-start mb-3">
                  <span className="inline-flex items-center gap-1 rounded-full bg-ai-tint px-2.5 py-0.5 text-caption text-success">
                    <Sparkles className="h-3 w-3" /> مدعوم بالذكاء الاصطناعي
                  </span>
                </div>
              }
              {/* Author */}
              <div className="flex items-start justify-between gap-3">
                <span className="text-caption text-on-surface-variant whitespace-nowrap">{p.createdAt.toLocaleDateString()}</span>
                <div className="flex items-center gap-3 min-w-0 text-right">
                  <div className="min-w-0">
                    <div className="text-label-md font-semibold text-on-surface truncate">{p.user.name}</div>
                    <div className="text-caption text-on-surface-variant truncate">{}</div>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary-container to-primary shrink-0" >
                    <img src={p.user?.image ||"https://static.vecteezy.com/system/resources/thumbnails/048/334/475/small/a-person-icon-on-a-transparent-background-png.png"} alt={p.user?.name || "User avatar"}  className="h-10 w-10 rounded-full object-cover" />
                  </div>
                </div>
              </div>

              <h3 className="mt-4 text-title-lg font-bold text-on-surface text-right leading-7">{p.title}</h3>
              <p className="mt-2 text-body-md text-on-surface-variant text-right leading-7 line-clamp-4">{p.content.competencies}</p>

              <div className="mt-4 flex flex-wrap justify-end gap-2">
              
                  <Badge >{p.level}</Badge>
                  <Badge >{p.subject}</Badge>
                  <Badge >{p.pedagogicalApproach}</Badge>
          
              </div>

              <div className="mt-4 flex items-center justify-end gap-4 text-caption text-on-surface-variant">
                <span className="inline-flex items-center gap-1">{p.downloadsCount} <Download className="h-3.5 w-3.5" /></span>
                <span
                onClick={(e)=> updateLike(e,p)}
                 className="inline-flex items-center gap-1">{p?.likes?.length } <Heart className={`h-3.5 w-3.5 ${p.likes.find(user => user.userId === id)?"text-danger fill-danger" : "" } `} /></span>
              </div>

              <div className="mt-4 space-y-2">
                 <Link href={`/community/${p.id}`} ><Button variant="outline" className="w-full"><FileText className="h-4 w-4" />  تصفح </Button> </Link>
                
              
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

function FilterPill({ label }: { label: string }) {
  return (
    <button className="inline-flex items-center gap-2 rounded-md border border-outline-variant bg-paper px-4 h-10 text-label-md text-on-surface-variant hover:border-primary hover:text-primary">
      <ChevronDown className="h-4 w-4" />
      <span>{label}</span>
    </button>
  );
}
