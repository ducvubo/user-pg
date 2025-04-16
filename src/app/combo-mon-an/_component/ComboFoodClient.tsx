'use client'
import { IComboFood } from '@/app/nha-hang/_component/ComboList'
import React, { useEffect, useState } from 'react'
import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { Input } from '@/components/ui/input'
import Link from 'next/link'

interface ClientProps {
  comboImages: {
    image_cloud: string
    image_custom?: string
  }
  comboFood: IComboFood
  isComboSoldOut: boolean
  showButtons?: boolean
}

export default function ComboFoodClient({ comboImages, comboFood, isComboSoldOut, showButtons = false }: ClientProps) {
  const [isWithinServiceHours, setIsWithinServiceHours] = useState(true)
  const [quantity, setQuantity] = useState(1)

  const normalizeTime = (time: string) => {
    const [h, m, s] = time.split(':')
    return `${h.padStart(2, '0')}:${m.padStart(2, '0')}:${s.padStart(2, '0')}`
  }

  const checkServiceHours = () => {
    const now = new Date()
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now
      .getMinutes()
      .toString()
      .padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`

    const openTime = normalizeTime(comboFood.fcb_open_time)
    const closeTime = normalizeTime(comboFood.fcb_close_time)

    const isOpen = currentTime >= openTime && currentTime <= closeTime
    setIsWithinServiceHours(isOpen)
  }

  useEffect(() => {
    if (typeof window !== 'undefined') {
      checkServiceHours()
      const interval = setInterval(checkServiceHours, 60000)
      return () => clearInterval(interval)
    }
  }, [comboFood.fcb_open_time, comboFood.fcb_close_time])


  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)
  }

  if (showButtons) {
    return (
      <>
        <div className='flex items-start justify-start border border-gray-300 rounded-lg h-10 w-32'>
          <Button
            variant='ghost'
            className='h-full w-8 p-0 text-lg'
            onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
            disabled={isComboSoldOut || quantity <= 1}
          >
            -
          </Button>
          <Input
            type='number'
            value={quantity}
            onChange={(e) => {
              const value = parseInt(e.target.value) || 1
              setQuantity(Math.max(1, value))
            }}
            className='w-20 h-full text-center border-none focus-visible:ring-0 focus-visible:ring-offset-0'
            min='1'
            disabled={isComboSoldOut}
          />
          <Button
            variant='ghost'
            className='h-full w-8 p-0 text-lg'
            onClick={() => setQuantity((prev) => prev + 1)}
            disabled={isComboSoldOut}
          >
            +
          </Button>
        </div>
        <div>
          <span className='text-sm font-semibold'>Tổng tiền:</span>
          <span className='text-red-500 font-semibold text-sm ml-1'>{formatPrice(comboFood.fcb_price * quantity)}</span>
        </div>
        <div className='mt-4 flex flex-col sm:flex-row gap-3'>

          <Button
            className='w-full sm:w-auto flex-1 min-w-[120px] bg-red-500 hover:bg-red-600 text-white text-sm py-2 rounded-lg'
            disabled={isComboSoldOut}
          >
            {isComboSoldOut ? 'Hết hàng' : 'Thêm vào giỏ hàng'}
          </Button>
          <Link
            className='w-full sm:w-auto flex-1 min-w-[120px]'
            href={`/dat-combo-mon-an?&slug=${comboFood.fcb_slug}&quantity=${quantity}`}
            onClick={(e) => {
              if (isComboSoldOut || !isWithinServiceHours) {
                e.preventDefault()
              }
            }}
          >
            <Button
              className='w-full bg-green-500 hover:bg-green-600 text-white text-sm py-2 rounded-lg'
              disabled={isComboSoldOut || !isWithinServiceHours}
            >
              {isComboSoldOut ? 'Hết hàng' : !isWithinServiceHours ? 'Hiện không phục vụ' : 'Đặt hàng ngay'}
            </Button>
          </Link>

        </div>
      </>

    )
  }

  return (
    <>
      <div className='relative w-full h-96'>
        <Image
          src={comboImages.image_cloud}
          alt='No image available'
          layout='fill'
          objectFit='cover'
          className='rounded-lg'
        />
      </div>
    </>
  )
}
