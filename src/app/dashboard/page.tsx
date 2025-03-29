import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Topbar from '@/components/Topbar'

const page = () => {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <Topbar/>
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Success</CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription>
            You are successfully linked to a host org, now you can start scanning tickets
          </CardDescription>
        </CardContent>
      </Card>
    </div>
  )
}

export default page
