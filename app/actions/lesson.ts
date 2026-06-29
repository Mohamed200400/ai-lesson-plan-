"use server"

import prisma from "@/lib/db"
import { GoogleGenAI, Type } from "@google/genai"

export async function* generateLesson(userId:string , formData: FormData){
    const title = formData.get("title") as string
    const subject = formData.get("subject") as string
    const level = formData.get("level") as string
    console.log(typeof level)
    const time = formData.get("time") 
    const duration = Number(time)
    const pedagogie = formData.get("pedagogie") as string
 
    if (!title || !subject || !level || !time || !pedagogie){
       
         throw new Error('الرجاء ملء جميع الخانات المطلوبة قبل التوليد.');
    }
    const jsonSchema = {
    type: Type.OBJECT,
    properties: {
      competencies: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: "الكفايات المستهدفة: الكفاية الختامية (المستعرضة) والكفايات المكونة وفق المنهاج التونسي"
      },
      objectives: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: "الأهداف الإجرائية السلوكية المصاغة بدقة (قابلة للملاحظة والقياس)"
      },
      prerequisites: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: "المكتسبات القبلية والامتدادات الضرورية التي يبنى عليها الدرس"
      },
      didacticMaterials: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: "الوسائل والمعينات التعليمية والسيناريوهات البيداغوجية العامة"
      },
      lessonProcess: {
        type: Type.ARRAY,
        description: "سير الحصة مفصلاً ويجب أن يحتوي إلزامياً بالترتيب على: التمهيد، بناء التعلمات، التطبيق، التقويم، الدعم، الغلق",
        items: {
          type: Type.OBJECT,
          properties: {
            phaseName: { 
              type: Type.STRING, 
              description: "اسم المرحلة حصراً (مثال: التمهيد / بناء التعلمات / التطبيق / التقويم / الدعم / الغلق)" 
            },
            duration: { 
              type: Type.INTEGER, 
              description: "الزمن المخصص لهذه المرحلة بالدقائق" 
            },
            teacherActivity: { 
              type: Type.STRING, 
              description: "نشاط الأستاذ بالتفصيل: طرح وضعية المشكل، الأسئلة الهادية، التوجيه الديداكتيكي" 
            },
            studentActivity: { 
              type: Type.STRING, 
              description: "نشاط المتعلم: البحث، التمشي، العمل الفردي أو المجموعاتي، الإجابات والصياغات المتوقعة" 
            },
            phaseMaterials: { 
              type: Type.STRING, 
              description: "الوسائل والسندات المحددة المستخدمة في هذه المرحلة بالذات (وثائق، كتاب مدرسي، لوحة، حاسوب...)" 
            },
            evaluationType: { 
              type: Type.STRING, 
              description: "نوع التقويم المرافق للمرحلة (تقويم تشخيصي، تكويني، تعديلي، جزائي)" 
            },
            expectedOutputs: { 
              type: Type.STRING, 
              description: "المخرجات والإنتاجات المنتظرة من المتعلم في نهاية هذه المرحلة" 
            }
          },
          required: ["phaseName", "duration", "teacherActivity", "studentActivity", "phaseMaterials", "evaluationType", "expectedOutputs"]
        }
      },
      homework: {
        type: Type.STRING,
        description: "الواجب المنزلي أو الأنشطة الامتدادية الموكلة للمتعلم في البيت"
      }
    },
    required: ["competencies", "objectives", "prerequisites", "didacticMaterials", "lessonProcess", "homework"]
  };
    const prompt=`
    أنت خبير بيداغوجي ومفتش تعليمي محترف. قم بإعداد جذاذة تربوية تفصيلية ومكتملة للدرس التالي:
    - عنوان الدرس: ${title}
    - المادة: ${subject}
    - المستوى الدراسي: ${level}
    - المدة الزمنية الإجمالية: ${time} دقيقة
    - المقاربة البيداغوجية المعتمدة: ${pedagogie}

    تأكد من أن الأنشطة تطبيقية وعصرية وتراعي المقاربة المذكورة، واجعل التقويم يقيس تحقيق الأهداف بشكل حقيقي.
  `;
      const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY, 
    });
    const responseStream = await ai.models.generateContentStream({
          model: 'gemini-2.5-flash',
          contents: prompt,
          config: {
                // نحدد هنا أننا نريد النتيجة بصيغة JSON حصراً
                responseMimeType: "application/json",
                responseSchema: jsonSchema, 
                temperature: 0.7, // نسبة الإبداع (0.7 مثالية للخطط التربوية)
            }
        });

        let fullText = "";

  // 2. بث الأجزاء فوراً للمتصفح عبر yield
  for await (const chunk of responseStream) {
    if (chunk.text) {
      fullText += chunk.text;
      yield chunk.text; // 
    }
  }
      
     
      try{
        const content = JSON.parse(fullText)

        const res = await prisma.lessonPlan.create({
          data : {
            title : title ,
            subject : subject ,
            level : level ,
            duration : duration ,
            pedagogicalApproach : pedagogie ,
            content : content,
            userId : userId
          
          }
        })
        const successMeta = {
          success: true,
          message: "تم توليد الجذاذة وحفظها في قاعدة البيانات بنجاح!",
          id: res.id,
        };
    
    yield `||METADATA||${JSON.stringify(successMeta)}`;

      }catch(e){
        console.log(e)
        const errorMeta = {
      success: false,
      message: "تم توليد النص ولكن فشل الحفظ في قاعدة البيانات.",
      id: null,
    };

    yield `||METADATA||${JSON.stringify(errorMeta)}`;

      }
    
}