"use client"
import React from 'react'
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';


const Topbar = () => {
    const router = useRouter();
  return (
    <nav className="fixed top-0 left-0 right-0 flex justify-between m-4">
        <span className='text-4xl font-bold'>Tiktr</span>
      <Button className="top-4 right-4" variant="outline" onClick={()=>{router.push("/auth/sign-out")}}>Sign out</Button>
    </nav>
  )
}

export default Topbar
