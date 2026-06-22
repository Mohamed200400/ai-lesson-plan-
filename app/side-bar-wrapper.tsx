"use client"
import {Sidebar } from "@/components/layout/sidebar"
import { usePathname } from 'next/navigation'
import React from 'react'

const  SideBarWrapper = () => {
    const hiddenRoutes = ['/auth/login','/auth/register']
    
    const pathname = usePathname()
    console.log(pathname)
  
        if (hiddenRoutes.includes(pathname)) {return null}
        return <Sidebar />
    
  
}

export default SideBarWrapper