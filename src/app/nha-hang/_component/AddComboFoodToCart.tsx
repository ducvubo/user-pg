'use client'
import { ShoppingBasket } from 'lucide-react'
import React from 'react'
import { toast } from '@/hooks/use-toast'
import { addComboToCart } from '../api'

interface IProps {
  fcb_id: string
}

export default function AddComboFoodToCart({ fcb_id }: IProps) {
  const handleAddToCart = async () => {
    const res: IBackendRes<boolean> = await addComboToCart({ fcb_id })
    if (res.statusCode === 201 && res.data) {
      toast({
        title: 'Thêm vào giỏ hàng thành công',
        description: 'Combo món ăn đã được thêm vào giỏ hàng của bạn',
        variant: 'default'
      })
    } else {
      toast({
        title: 'Thêm vào giỏ hàng thất bại',
        description: 'Có lỗi xảy ra khi thêm combo món ăn vào giỏ hàng của bạn',
        variant: 'destructive'
      })
    }
  }

  return <ShoppingBasket onClick={handleAddToCart} size={23} color='red' className='cursor-pointer' />
}
