'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState, Suspense } from 'react'
import { toast } from '@/hooks/use-toast'
import { confirmOrderFood } from './api'
import { IOrderFoodCombo } from '../dat-combo-mon-an/order.combo.interface'

function LoadingFallback() {
  return <div>Loading...</div>
}

function ConfirmPage() {
  const [isLoad, setIsLoad] = useState(false)
  const searchParams = useSearchParams()
  const od_cb_id = searchParams.get('od_cb_id')
  const od_cb_res_id = searchParams.get('od_cb_res_id')
  const router = useRouter()

  const confirmBook = async () => {
    if (!od_cb_id || !od_cb_res_id) {
      router.push('combo-da-dat')
      return
    }
    setIsLoad(true)
    try {
      const res: IBackendRes<IOrderFoodCombo> = await confirmOrderFood({
        od_cb_id,
        od_cb_res_id
      })
      if (res.statusCode === 200 || res.statusCode === 201) {
        setIsLoad(false)
        toast({
          title: 'Thành công',
          description: 'Xác nhận đặt combo thành công, chúc bạn ngon miệng',
          variant: 'default'
        })
        router.push('combo-da-dat')
      } else {
        toast({
          title: 'Thất bại',
          description: 'Xác nhận đặt combo thất bại',
          variant: 'destructive'
        })
        router.push('combo-da-dat')
      }
    } catch (error) {
      toast({
        title: 'Thất bại',
        description: 'Xác nhận đặt combo thất bại',
        variant: 'destructive'
      })
      router.push('combo-da-dat')
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
