"use client";

import Link from "next/link";
import { useActionState, useEffect, useState } from "react";
import { Eye, EyeOff, Mail, Lock, User, BookOpen, GraduationCap } from "lucide-react";
import { useRouter } from "next/navigation";
import prisma from "@/lib/db";
import { registerUser } from "./actions";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const [state ,formAction ,isPending] = useActionState(registerUser, {
    success: false,
    error: null,
  });

  useEffect(()=>{
    
    if (state.success){
      router.push("/auth/login")
    }
  },[state.success, router])


  return (
    <div className="min-h-screen flex" dir="rtl">
      {/* Brand Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.15),transparent_50%)]" />
        <div className="relative z-10 flex flex-col justify-between p-12 text-white w-full">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center">
              <GraduationCap className="w-7 h-7" />
            </div>
            <span className="text-2xl font-bold">جدادة</span>
          </div>
          <div>
            <h1 className="text-4xl font-bold mb-4 leading-tight">
              انضم إلى مجتمع<br />المعلمين المبدعين
            </h1>
            <p className="text-lg text-white/80 leading-relaxed">
              أنشئ حسابك مجاناً واحصل على أدوات ذكية لتحضير دروسك وإدارة فصلك.
            </p>
            <ul className="mt-6 space-y-2 text-white/90">
              <li className="flex items-center gap-2">✓ تحضير دروس بالذكاء الاصطناعي</li>
              <li className="flex items-center gap-2">✓ مكتبة موارد ضخمة</li>
              <li className="flex items-center gap-2">✓ مجتمع تعليمي نشط</li>
            </ul>
          </div>
          <div className="text-sm text-white/60">© 2026 جدادة. جميع الحقوق محفوظة.</div>
        </div>
      </div>

      {/* Form Panel */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 overflow-y-auto">
        <div className="w-full max-w-md py-8">
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white">
              <GraduationCap className="w-6 h-6" />
            </div>
            <span className="text-xl font-bold text-slate-900">جدادة</span>
          </div>

          <h2 className="text-3xl font-bold text-slate-900 mb-2">إنشاء حساب جديد</h2>
          <p className="text-slate-600 mb-8">ابدأ رحلتك التعليمية معنا اليوم</p>

          <form className="space-y-5" action={formAction}>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">الاسم الكامل</label>
              <div className="relative">
                <User className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input 
                value={name} 
                name="name"
                onChange={(e)=> setName(e.target.value)} 
                type="text" 
                placeholder=" " 
                className="w-full pr-11 pl-4 py-3 rounded-xl border border-slate-200 bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">البريد الإلكتروني</label>
              <div className="relative">
                <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input 
                name="email"
                value={email} 
                onChange={(e)=> setEmail(e.target.value)}
                type="email" 
                placeholder="name@example.com" 
                className="w-full pr-11 pl-4 py-3 rounded-xl border border-slate-200 bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition" />
              </div>
            </div>

            

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">كلمة المرور</label>
              <div className="relative">
                <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input 
                name="password"
                value={password} 
                onChange={(e)=> setPassword(e.target.value)}
                type={showPassword ? "text" : "password"} 
                placeholder="••••••••" 
                className="w-full pr-11 pl-11 py-3 rounded-xl border border-slate-200 bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">تأكيد كلمة المرور</label>
              <div className="relative">
                <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input 
                value={confirmPassword}
                onChange={(e)=> setConfirmPassword(e.target.value)}
                type={showConfirm ? "text" : "password"} 
                placeholder="••••••••" 
                className="w-full pr-11 pl-11 py-3 rounded-xl border border-slate-200 bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition" />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <label className="flex items-start gap-2 text-sm text-slate-600 cursor-pointer">
              <input type="checkbox" className="mt-1 w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
              <span>
                أوافق على{" "}
                <Link href="/terms" className="text-indigo-600 hover:text-indigo-700 font-medium">شروط الاستخدام</Link>
                {" "}و{" "}
                <Link href="/privacy" className="text-indigo-600 hover:text-indigo-700 font-medium">سياسة الخصوصية</Link>
              </span>
            </label>
            {state.error && <p style={{ color: "red" }}>{state.error}</p>}

            <button type="submit" className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold hover:from-indigo-700 hover:to-purple-700 transition shadow-lg shadow-indigo-200">
              إنشاء الحساب
            </button>
          </form>

          

          <p className="mt-8 text-center text-sm text-slate-600">
            لديك حساب بالفعل؟{" "}
            <Link href="/auth/login" className="text-indigo-600 hover:text-indigo-700 font-semibold">
              سجّل دخولك
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
