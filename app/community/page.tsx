import { TopBar } from "@/components/layout/topbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/input";
import { Heart, Download, Copy, FileText, Sparkles, ChevronDown, SlidersHorizontal } from "lucide-react";

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

const posts: Post[] = [
  {
    author: "أحمد محمود",
    meta: "مدرس علوم • مدرسة النور",
    when: "منذ يومين",
    title: "مقدمة في الكيمياء العضوية: استكشاف الروابط",
    desc: "خطة درس تفاعلية مصممة لطلاب الصف العاشر، تركز على فهم الروابط التساهمية في المركبات العضوية باستخدام النماذج ثلاثية...",
    tags: ["العلوم", "الصف العاشر", "تفاعلي"],
    likes: 124,
    downloads: 89,
    ai: true,
  },
  {
    author: "سارة خالد",
    meta: "لغة عربية • أكاديمية التميز",
    when: "منذ أسبوع",
    title: 'تحليل قصيدة "المساء" لخليل مطران',
    desc: "دليل شامل لتحليل الصور الشعرية والعواطف في قصيدة المساء يتضمن أسئلة نقاش عميقة وأنشطة استنتاجية لتعزيز...",
    tags: ["اللغة العربية", "الثانوية العامة", "أدب"],
    likes: 87,
    downloads: 56,
  },
  {
    author: "عمر حسن",
    meta: "رياضيات • مدرسة المستقبل",
    when: "منذ 3 أسابيع",
    title: "تطبيقات الجبر في الحياة اليومية",
    desc: "وحدة تعليمية كاملة تربط المفاهيم الجبرية المجردة بمواقف حياتية واقعية، مثل إدارة الميزانية الشخصية وحساب التخفيضات...",
    tags: ["الرياضيات", "المرحلة المتوسطة"],
    likes: 215,
    downloads: 180,
  },
];

export default function CommunityPage() {
  return (
    <div className="min-h-screen">
      <TopBar placeholder="ابحث في مجتمع المعلمين..." />

      <div className="px-6 lg:px-10 pb-12">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <h1 className="text-headline-lg font-bold text-on-surface">مجتمع المعلمين</h1>
          <p className="mt-2 text-body-md text-on-surface-variant">
            اكتشف واستلهم من آلاف خطط الدروس المميزة التي شاركها زملاؤك.
          </p>
        </div>

        {/* Filters */}
        <Card className="p-3 flex flex-wrap items-center gap-2 mb-8 justify-end">
          <FilterPill label="المادة (الكل)" />
          <FilterPill label="المرحلة (الكل)" />
          <FilterPill label="الأكثر شيوعاً" />
          <button className="grid h-10 w-10 place-items-center rounded-md hover:bg-surface-low ml-auto">
            <SlidersHorizontal className="h-4 w-4 text-on-surface-variant" />
          </button>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {posts.map((p) => (
            <Card key={p.title} className="flex flex-col p-5">
              {p.ai && (
                <div className="self-start mb-3">
                  <span className="inline-flex items-center gap-1 rounded-full bg-ai-tint px-2.5 py-0.5 text-caption text-success">
                    <Sparkles className="h-3 w-3" /> مدعوم بالذكاء الاصطناعي
                  </span>
                </div>
              )}
              {/* Author */}
              <div className="flex items-start justify-between gap-3">
                <span className="text-caption text-on-surface-variant whitespace-nowrap">{p.when}</span>
                <div className="flex items-center gap-3 min-w-0 text-right">
                  <div className="min-w-0">
                    <div className="text-label-md font-semibold text-on-surface truncate">{p.author}</div>
                    <div className="text-caption text-on-surface-variant truncate">{p.meta}</div>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary-container to-primary shrink-0" />
                </div>
              </div>

              <h3 className="mt-4 text-title-lg font-bold text-on-surface text-right leading-7">{p.title}</h3>
              <p className="mt-2 text-body-md text-on-surface-variant text-right leading-7 line-clamp-4">{p.desc}</p>

              <div className="mt-4 flex flex-wrap justify-end gap-2">
                {p.tags.map((t) => (
                  <Badge key={t}>{t}</Badge>
                ))}
              </div>

              <div className="mt-4 flex items-center justify-end gap-4 text-caption text-on-surface-variant">
                <span className="inline-flex items-center gap-1">{p.downloads} <Download className="h-3.5 w-3.5" /></span>
                <span className="inline-flex items-center gap-1">{p.likes} <Heart className="h-3.5 w-3.5 text-danger fill-danger" /></span>
              </div>

              <div className="mt-4 space-y-2">
                <Button className="w-full"><Copy className="h-4 w-4" /> استخدام كقالب</Button>
                <Button variant="outline" className="w-full"><FileText className="h-4 w-4" /> توليد ورقة عمل</Button>
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
