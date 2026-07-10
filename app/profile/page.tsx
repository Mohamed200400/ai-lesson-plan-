// app/(app)/profile/page.tsx

"use client";

import React, { useEffect, useState } from "react";

import Image from 'next/image';
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
import { useSession } from "next-auth/react";
import { getUser, updateUser } from "../actions/user";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<"info" | "security" | "preferences">("info");
  const [isEditing, setIsEditing] = useState(false);
  const [image , setImage] = useState("https://static.vecteezy.com/system/resources/thumbnails/048/334/475/small/a-person-icon-on-a-transparent-background-png.png")
  const [data,setData] = useState<any>({
    name : "",
    email : "",
    level : "",
    phone : "",
    country : ""
  })
  const {data : session } = useSession()
  //@ts-ignore
  const userId = session?.user?.id
  
  const handleEdit= async ()=>{
    setIsEditing(!isEditing);
    if (isEditing){
      const res = await updateUser(userId,data)
    console.log(res)
    }
    

  }

  useEffect(()=>{
    const userData = async  () => {
      try{
        const res = await getUser(userId)
        setData({
          name : res?.data?.name || "",
          email : res?.data?.email || "",
          level : res?.data?.defaultLevel || "",
          phone : res?.data?.phone || "",
          country : res?.data?.country || "",
         
        })
        if (res?.data?.image){
        setImage(res?.data?.image )}

      }catch(e){
        console.log(e)
      }
    }
     userData()

  },[userId])


  const ImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file){
        const localUrl = URL.createObjectURL(file)
        setImage(localUrl)
      }
  }

 



  const tabs = [
    { id: "info", label: "المعلومات الشخصية" },
    
  ] as const;

  return (
    <main className="min-h-screen bg-slate-50 p-4 md:p-8" dir="rtl">
      {data && <div className="mx-auto max-w-5xl space-y-6">
        {/* Header */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-600 to-emerald-500 p-8 text-white shadow-lg">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.15),transparent_40%)]" />
          <div className="relative flex flex-col items-center gap-4 md:flex-row md:gap-6">
            <div className="relative">
             
                <Image src={image } alt="pic" 
                    width={100} 
                    height={100} 
                    priority
                  className="flex h-24 w-24 items-center justify-center bg-white rounded-full bg-cover" />
                  
         
              <button className="absolute -bottom-1 -right-1 rounded-full bg-emerald-700 p-1.5 text-white hover:bg-emerald-800">
                <Camera className="h-4 w-4" />
              </button>
             <input
          id="image-upload"
          type="file"
          name="profileImage"
          accept="image/*" // 👈 Restricts file picker to images only
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          onChange={(e) => ImageUpload(e)}
        />
            </div>
            <div className="text-center md:text-right">
              <h1 className="text-2xl font-bold">{data.name}</h1>
              <p className="mt-1 text-emerald-50">
                {data.email}
              </p>
             
            </div>
          </div>
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
                    onClick={() => handleEdit()}
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
                    value={data.name}
                    readOnly={!isEditing}
                    onChange={(v) => setData({ ...data, name : v })}
                  />
                  <Field
                    label="البريد الإلكتروني"
                    icon={Mail}
                    value={data.email}
                    readOnly={!isEditing}
                    onChange={(v) => setData({ ...data, email: v })}
                  />
                  <Field
                    label="رقم الهاتف"
                    icon={Phone}
                    value={data.phone}
                    readOnly={!isEditing}
                    onChange={(v) => setData({ ...data, phone: v })}
                  />
                  <Field
                    label="الموقع"
                    icon={MapPin}
                    value={data.country}
                    readOnly={!isEditing}
                    onChange={(v) => setData({ ...data, country: v })}
                  />
                  <Field
                    label="المرحلة الدراسية"
                    icon={GraduationCap}
                    value={data.level}
                    readOnly={!isEditing}
                    onChange={(v) => setData({ ...data, level: v })}
                  />
                 
                </div>
              </div>
            )}

            

           
          </div>
        </div>
      </div>}
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
          value={value || ""}
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



