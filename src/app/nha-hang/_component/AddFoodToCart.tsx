'use client'
import { ShoppingBasket } from 'lucide-react'
import React from 'react'
import { motion } from 'framer-motion'
import { addFoodToCart } from '../api'
import { toast } from '@/hooks/use-toast'

interface IProps {
  food_id: string
}

export default function AddFoodToCart({ food_id }: IProps) {
  const handleAddToCart = async () => {
    const res: IBackendRes<boolean> = await addFoodToCart({ food_id })
    if (res.statusCode === 201 && res.data) {
      toast({
        title: 'Thêm vào giỏ hàng thành công',
        description: 'Món ăn đã được thêm vào giỏ hàng của bạn',
        variant: 'default'
      })
    } else {
      toast({
        title: 'Thêm vào giỏ hàng thất bại',
        description: 'Có lỗi xảy ra khi thêm món ăn vào giỏ hàng của bạn',
        variant: 'destructive'
      })
    }
  }

  // Animation variants
  const basketVariants = {
    initial: {
      scale: 1,
      rotate: 0,
    },
    animate: {
      scale: [1, 1.2, 1], // Bounce effect
      rotate: [0, 10, -10, 0], // Slight wobble
      transition: {
        duration: 0.4,
        ease: 'easeInOut',
        times: [0, 0.5, 0.75, 1],
      },
    },
  }

  return (
    <motion.div
      variants={basketVariants}
      initial="initial"
      whileTap="animate" // Triggers animation on click/tap
      onClick={handleAddToCart}
      className='cursor-pointer inline-block'
    >
      <ShoppingBasket size={23} color='red' />
    </motion.div>
  )
}