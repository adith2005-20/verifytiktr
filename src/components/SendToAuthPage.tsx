"use client"
import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react';

const SendToAuthPage = () => {
    const router = useRouter();
    useEffect(() => {
        router.push("/auth/sign-in");
    }, [router]);
  return (
    <div>
      <Loader2 className='animate-spin'/>
    </div>
  )
}

export default SendToAuthPage
