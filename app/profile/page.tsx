// app/(app)/profile/page.tsx

"use client";

import React, { useState } from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  BookOpen,
  Lock,
  Bell,
  Moon,
  Shield,
  Camera,
  Pencil,
  Check,
  Eye,
  EyeOff,
  Award,
  Users,
  BookMarked,
  Clock,
} from "lucide-react";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<"info" | "security" | "preferences">("info");
  const [isEditing, setIsEditing] = useState(false);

  const [info, setInfo] = useState({
    fullName: "أحمد محمد",
    email: "ahmed@example.com",
    phone: "05xxxxxxxx",
    location: "الرياض، المملكة العربية السعودية",
    stage: "المرحلة الثانوية",
    subject: "الرياضيات",
  });

  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  const [preferences, setPreferences] = useState({
    notifications: true,
    darkMode: false,
    weeklyReport: true,
    privateProfile: false,
  });

  const stats = [
    { label: "الدروس", value: "24", icon: BookMarked },
    { label: "الطلاب", value: "156", icon: Users },
    { label: "سنوات الخبرة", value: "5", icon: Clock },
    { label: "الإنجازات", value: "12", icon: Award },
  ];

  const tabs = [
    { id: "info", label: "المعلومات الشخصية" },
    { id: "security", label: "الأمان" },
    { id: "preferences", label: "التفضيلات" },
  ] as const;

  return (
    <main className="min-h-screen bg-slate-50 p-4 md:p-8" dir="rtl">
      <div className="mx-auto max-w-5xl space-y-6">
        {/* Header */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-600 to-emerald-500 p-8 text-white shadow-lg">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.15),transparent_40%)]" />
          <div className="relative flex flex-col items-center gap-4 md:flex-row md:gap-6">
            <div className="relative">
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white text-2xl font-bold text-emerald-600 shadow-md">
                {info.fullName
                  .split(" ")
                  .map((n) => n[0])
                  .slice(0, 2)
                  .join(" ")}
              </div>
              <button className="absolute -bottom-1 -right-1 rounded-full bg-emerald-700 p-1.5 text-white hover:bg-emerald-800">
                <Camera className="h-4 w-4" />
              </button>
            </div>
            <div className="text-center md:text-right">
              <h1 className="text-2xl font-bold">{info.fullName}</h1>
              <p className="mt-1 text-emerald-50">
                {info.stage} • {info.subject}
              </p>
              <button
                onClick={() => setActiveTab("info")}
                className="mt-3 inline-flex items-center gap-2 rounded-lg bg-white/20 px-4 py-2 text-sm font-medium backdrop-blur-sm hover:bg-white/30"
              >
                <Pencil className="h-4 w-4" />
                تعديل الملف الشخصي
              </button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl bg-white p-4 shadow-sm transition hover:shadow-md"
            >
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                <stat.icon className="h-5 w-5" />
              </div>
              <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
              <p className="text-sm text-slate-500">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="rounded-2xl bg-white shadow-sm">
          <div className="flex border-b border-slate-100">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 px-4 py-4 text-sm font-medium transition ${
                  activeTab === tab.id
                    ? "border-b-2 border-emerald-600 text-emerald-600"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="p-6">
            {activeTab === "info" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-slate-900">المعلومات الشخصية</h2>
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className={`inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium ${
                      isEditing
                        ? "bg-emerald-50 text-emerald-600"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {isEditing ? <Check className="h-4 w-4" /> : <Pencil className="h-4 w-4" />}
                    {isEditing ? "حفظ" : "تعديل"}
                  </button>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <Field
                    label="الاسم الكامل"
                    icon={User}
                    value={info.fullName}
                    readOnly={!isEditing}
                    onChange={(v) => setInfo({ ...info, fullName: v })}
                  />
                  <Field
                    label="البريد الإلكتروني"
                    icon={Mail}
                    value={info.email}
                    readOnly={!isEditing}
                    onChange={(v) => setInfo({ ...info, email: v })}
                  />
                  <Field
                    label="رقم الهاتف"
                    icon={Phone}
                    value={info.phone}
                    readOnly={!isEditing}
                    onChange={(v) => setInfo({ ...info, phone: v })}
                  />
                  <Field
                    label="الموقع"
                    icon={MapPin}
                    value={info.location}
                    readOnly={!isEditing}
                    onChange={(v) => setInfo({ ...info, location: v })}
                  />
                  <Field
                    label="المرحلة الدراسية"
                    icon={GraduationCap}
                    value={info.stage}
                    readOnly={!isEditing}
                    onChange={(v) => setInfo({ ...info, stage: v })}
                  />
                  <Field
                    label="المادة"
                    icon={BookOpen}
                    value={info.subject}
                    readOnly={!isEditing}
                    onChange={(v) => setInfo({ ...info, subject: v })}
                  />
                </div>
              </div>
            )}

            

           
          </div>
        </div>
      </div>
    </main>
  );
}

function Field({
  label,
  icon: Icon,
  value,
  readOnly,
  onChange,
}: {
  label: string;
  icon: React.ElementType;
  value: string;
  readOnly?: boolean;
  onChange: (val: string) => void;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-slate-700">{label}</label>
      <div className="relative">
        <Icon className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={value}
          readOnly={readOnly}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pr-11 pl-4 text-sm text-slate-900 outline-none transition ${
            readOnly
              ? "cursor-default bg-slate-100"
              : "focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
          }`}
        />
      </div>
    </div>
  );
}

function PasswordField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
}) {
  const [show, setShow] = useState(false);
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-slate-700">{label}</label>
      <div className="relative">
        <Lock className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pr-11 pl-12 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
        />
        <button
          type="button"
          onClick={() => setShow(!show)}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
        >
          {show ? <EyeOff className="h-5 w-5 " /> : <Eye className="h-5 w-5 " />}
        </button>
      </div>
    </div>
  );
}

function ToggleRow({
  label,
  description,
  icon: Icon,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  icon: React.ElementType;
  checked: boolean;
  onChange: (val: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-slate-100 p-4">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="font-medium text-slate-900">{label}</p>
          <p className="text-sm text-slate-500">{description}</p>
        </div>
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={`relative h-7 w-12 rounded-full transition ${
          checked ? "bg-emerald-600" : "bg-slate-200"
        }`}
      >
        <span
          className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow-sm transition ${
            checked ? "right-1" : "left-1"
          }`}
        />
      </button>
    </div>
  );
}
