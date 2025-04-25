'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState, Suspense } from 'react'
import { ICreateBookTable } from '../nha-hang/api'
import { toast } from '@/hooks/use-toast'
import { IOrderFood } from '../dat-mon-an/order.food.interface'
import { guestConfirmBookRoom } from './api'

function LoadingFallback() {
  return <div>Loading...</div>
}

function ConfirmPage() {
  const [isLoad, setIsLoad] = useState(false)
  const searchParams = useSearchParams()
  const bkr_id = searchParams.get('bkr_id')
  const bkr_res_id = searchParams.get('bkr_res_id')
  const router = useRouter()

  const confirmBook = async () => {
    if (!bkr_id || !bkr_res_id) {
      router.push('phong-da-dat')
      return
    }
    setIsLoad(true)
    try {
      const res: IBackendRes<IOrderFood> = await guestConfirmBookRoom({
        bkr_id,
        bkr_res_id
      })
      if (res.statusCode === 200 || res.statusCode === 201) {
        setIsLoad(false)
        toast({
          title: 'Thành công',
          description: 'Xác nhận đặt phòng thành công, chúc bạn có một chuyến đi vui vẻ',
          variant: 'default'
        })
        router.push('phong-da-dat')
      } else {
        toast({
          title: 'Thất bại',
          description: res.message,
          variant: 'destructive'
        })
        router.push('phong-da-dat')
      }
    } catch (error) {
      toast({
        title: 'Thất bại',
        description: 'Xác nhận đặt món ăn thất bại',
        variant: 'destructive'
      })
      router.push('phong-da-dat')
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
