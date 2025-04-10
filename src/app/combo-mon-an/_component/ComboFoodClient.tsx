'use client'
import { IComboFood } from '@/app/nha-hang/_component/ComboList'
import React, { useEffect, useState } from 'react'
import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import { Button } from '@/components/ui/button'
import Image from 'next/image'

interface ClientProps {
  foodImages: string[]
  comboFood: IComboFood
  isComboSoldOut: boolean
  showButtons?: boolean
}

const NextArrow = ({ className, style, onClick }: any) => {
  return (
    <div
      className={className}
      style={{
        ...style,
        display: 'block',
        right: '10px',
        top: '50%',
        transform: 'translateY(-50%)',
        zIndex: 1,
        borderRadius: '50%',
        width: '24px',
        height: '24px',
        lineHeight: '24px',
        textAlign: 'center'
      }}
      onClick={onClick}
    />
  )
}

const PrevArrow = ({ className, style, onClick }: any) => {
  return (
    <div
      className={className}
      style={{
        ...style,
        display: 'block',
        left: '10px',
        top: '50%',
        transform: 'translateY(-50%)',
        zIndex: 1,
        borderRadius: '50%',
        width: '24px',
        height: '24px',
        lineHeight: '24px',
        textAlign: 'center'
      }}
      onClick={onClick}
    />
  )
}

export default function ComboFoodClient({ foodImages, comboFood, isComboSoldOut, showButtons = false }: ClientProps) {
  const [isWithinServiceHours, setIsWithinServiceHours] = useState(true)

  const checkServiceHours = () => {
    const now = new Date()
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now
      .getMinutes()
      .toString()
      .padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`
    const openTime = comboFood.fcb_open_time
    const closeTime = comboFood.fcb_close_time
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

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    autoplay: true,
    autoplaySpeed: 3000
  }

  if (showButtons) {
    return (
      <div className='mt-4 flex flex-col sm:flex-row gap-3'>
        <Button
          className='w-full sm:w-auto flex-1 min-w-[120px] bg-red-500 hover:bg-red-600 text-white text-sm py-2 rounded-lg'
          disabled={isComboSoldOut}
        >
          {isComboSoldOut ? 'Hết hàng' : 'Thêm vào giỏ hàng'}
        </Button>
        <Button
          className='w-full sm:w-auto flex-1 min-w-[120px] bg-green-500 hover:bg-green-600 text-white text-sm py-2 rounded-lg'
          disabled={isComboSoldOut || !isWithinServiceHours}
        >
          {isComboSoldOut ? 'Hết hàng' : !isWithinServiceHours ? 'Hiện không phục vụ' : 'Đặt hàng ngay'}
        </Button>
      </div>
    )
  }

  return (
    <>
      {foodImages.length > 0 ? (
        <Slider {...settings}>
          {foodImages.map((imageUrl, index) => (
            <div key={index} className='relative w-full h-96'>
              <Image
                src={imageUrl}
                alt={`${comboFood.fcbi_combo[index]?.fcbi_food.food_name}`}
                layout='fill'
                objectFit='cover'
                className='rounded-lg'
              />
            </div>
          ))}
        </Slider>
      ) : (
        <div className='relative w-full h-96'>
          <Image
            src='https://via.placeholder.com/300'
            alt='No image available'
            layout='fill'
            objectFit='cover'
            className='rounded-lg'
          />
        </div>
      )}
    </>
  )
}
