'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState, Suspense } from 'react'
import { toast } from '@/hooks/use-toast'
import { confirmSync, setIdUserGuest } from './api'

function LoadingFallback() {
  return <div>Loading...</div>
}

function ConfirmPage() {
  const [isLoad, setIsLoad] = useState(false)
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  const router = useRouter()

  const confirm = async () => {
    if (!token) {
      router.push('/')
      return
    }
    setIsLoad(true)
    try {
      const res: IBackendRes<string> = await confirmSync({
        token
      })
      if (res.statusCode === 200 || res.statusCode === 201) {
        setIsLoad(false)
        toast({
          title: 'Thành công',
          description: 'Xác nhận đặt đồng bộ dữ liệu thành công, vui lòng chờ trong giây lát',
          variant: 'default'
        })
        if (res.data) {
          await setIdUserGuest(res.data)
        }

        router.push('/')
      } else {
        toast({
          title: 'Thất bại',
          description: 'Xác nhận đặt đồng bộ dữ liệu thất bại, vui lòng thử lại',
          variant: 'destructive'
        })
        router.push('/')
      }
    } catch (error) {
      toast({
        title: 'Thất bại',
        description: 'Xác nhận đặt đồng bộ dữ liệu thất bại, vui lòng thử lại',
        variant: 'destructive'
      })
      router.push('/')
    } finally {
      setIsLoad(false)
    }
  }

  useEffect(() => {
    confirm()
  }, [])

  return <div>{isLoad ? <div>Đang xử lý...</div> : null}</div>
}

export default function Page() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <ConfirmPage />
    </Suspense>
  )
}
