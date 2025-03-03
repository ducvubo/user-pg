'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState, Suspense } from 'react'
import { confirmBookTable } from './api'
import { ICreateBookTable } from '../nha-hang/api'
import { toast } from '@/hooks/use-toast'
import HeaderPato from '../home/_component/HeaderPato'
import Footer from '../home/_component/Footer'

// A fallback component to show while Suspense is resolving
function LoadingFallback() {
  return <div>Loading...</div>
}

// The main page component
function ConfirmPage() {
  const [isLoad, setIsLoad] = useState(false)
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  const router = useRouter()

  const confirmBook = async () => {
    if (!token) {
      router.push('ban-da-dat')
      return
    }
    setIsLoad(true)
    try {
      const res: IBackendRes<ICreateBookTable> = await confirmBookTable(token)
      if (res.statusCode === 200 || res.statusCode === 201) {
        setIsLoad(false)
        toast({
          title: 'Thành công',
          description: 'Xác nhận đặt bàn thành công, chúc bạn ngon miệng',
          variant: 'default'
        })
        router.push('ban-da-dat')
      } else {
        toast({
          title: 'Thất bại',
          description: 'Xác nhận đặt bàn thất bại',
          variant: 'destructive'
        })
        router.push('ban-da-dat')
      }
    } catch (error) {
      toast({
        title: 'Thất bại',
        description: 'Xác nhận đặt bàn thất bại',
        variant: 'destructive'
      })
      router.push('ban-da-dat')
    } finally {
      setIsLoad(false)
    }
  }

  useEffect(() => {
    confirmBook()
  }, [])

  return (
    <div>
      <HeaderPato />
      {isLoad ? <div>Đang xử lý...</div> : null}
      <Footer />
    </div>
  )
}

// Wrap the page in Suspense
export default function Page() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <ConfirmPage />
    </Suspense>
  )
}
