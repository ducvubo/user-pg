'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState, Suspense } from 'react'
import { ICreateBookTable } from '../nha-hang/api'
import { toast } from '@/hooks/use-toast'
import { IOrderFood } from '../dat-mon-an/order.food.api'
import { confirmOrderFood } from './api'

function LoadingFallback() {
  return <div>Loading...</div>
}

function ConfirmPage() {
  const [isLoad, setIsLoad] = useState(false)
  const searchParams = useSearchParams()
  const od_id = searchParams.get('od_id')
  const od_res_id = searchParams.get('od_res_id')
  const router = useRouter()

  const confirmBook = async () => {
    if (!od_id || !od_res_id) {
      router.push('mon-an-da-dat')
      return
    }
    setIsLoad(true)
    try {
      const res: IBackendRes<IOrderFood> = await confirmOrderFood({
        od_id,
        od_res_id
      })
      console.log("🚀 ~ confirmBook ~ res:", res)
      if (res.statusCode === 200 || res.statusCode === 201) {
        setIsLoad(false)
        toast({
          title: 'Thành công',
          description: 'Xác nhận đặt bàn thành công, chúc bạn ngon miệng',
          variant: 'default'
        })
        router.push('mon-an-da-dat')
      } else {
        toast({
          title: 'Thất bại',
          description: 'Xác nhận đặt bàn thất bại',
          variant: 'destructive'
        })
        router.push('mon-an-da-dat')
      }
    } catch (error) {
      toast({
        title: 'Thất bại',
        description: 'Xác nhận đặt bàn thất bại',
        variant: 'destructive'
      })
      router.push('mon-an-da-dat')
    } finally {
      setIsLoad(false)
    }
  }

  useEffect(() => {
    confirmBook()
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
