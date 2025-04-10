// FoodClient.tsx
'use client'
import { IFoodRestaurant } from '@/app/interface/food-restaurant.interface'
import React, { useEffect, useMemo, useState } from 'react'
import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import Link from 'next/link'
import { Input } from '@/components/ui/input'

interface ClientProps {
  imageUrls: string[]
  food: IFoodRestaurant
  isFoodSoldOut: boolean
  groupedOptions: Record<string, IFoodRestaurant['fopt_food']>
  showPrice?: boolean
  showOptions?: boolean
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

export default function FoodClient({
  imageUrls,
  food,
  isFoodSoldOut,
  groupedOptions,
  showPrice = false,
  showOptions = false,
  showButtons = false
}: ClientProps) {
  const [isWithinServiceHours, setIsWithinServiceHours] = useState(true)
  const [selectedOptions, setSelectedOptions] = useState<string[]>([])
  const [quantity, setQuantity] = useState(1)
  const [keyPrice, setKeyPrice] = useState(0)

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)
  }

  const checkServiceHours = () => {
    const now = new Date()
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now
      .getMinutes()
      .toString()
      .padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`
    const openTime = food.food_open_time
    const closeTime = food.food_close_time
    const isOpen = currentTime >= openTime && currentTime <= closeTime
    setIsWithinServiceHours(isOpen)
  }

  useEffect(() => {
    checkServiceHours()
    const interval = setInterval(checkServiceHours, 60000)
    return () => clearInterval(interval)
  }, [food.food_open_time, food.food_close_time])

  const handleOptionSelect = (optionId: string) => {
    if (selectedOptions.includes(optionId)) {
      setSelectedOptions(selectedOptions.filter((id) => id !== optionId))
    } else {
      setSelectedOptions([...selectedOptions, optionId])
    }
  }

  // const totalPrice =
  //   food.food_price +
  //   selectedOptions.reduce((sum, optionId) => {
  //     const option = food.fopt_food?.find((opt) => opt.fopt_id === optionId)
  //     return sum + (option ? option.fopt_price : 0)
  //   }, 0)
  // console.log('🚀 ~ selectedOptions.reduce ~ selectedOptions:', totalPrice)

  const totalPrice = useMemo(() => {
    const basePrice =
      food.food_price +
      selectedOptions.reduce((sum, optionId) => {
        const option = food.fopt_food?.find((opt) => opt.fopt_id === optionId)
        return sum + (option ? option.fopt_price : 0)
      }, 0)
    return basePrice * quantity
  }, [food.food_price, selectedOptions, food.fopt_food, quantity])

  useEffect(() => {
    setKeyPrice((prev) => prev + 1)
    console.log('keyPrice', keyPrice)
  }, [totalPrice])

  const settings = {
    dots: false,
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

  if (showPrice) {
    return (
      <div className='flex items-center gap-2'>
        <span className='text-xl font-semibold text-red-500' key={keyPrice}>
          {formatPrice(totalPrice)}
        </span>
      </div>
    )
  }

  if (showOptions) {
    return (
      <>
        {food.fopt_food && food.fopt_food.length > 0 && (
          <div className='text-sm'>
            <p className='font-semibold mb-1'>Tùy chọn món ăn:</p>
            {Object.entries(groupedOptions).map(([groupName, options]) => (
              <div key={groupName} className='mb-2'>
                <p className='font-medium text-gray-700'>{groupName}</p>
                <div className='flex flex-wrap gap-1.5 mt-1'>
                  {options.map((option) => {
                    const isSelected = selectedOptions.includes(option.fopt_id)
                    const isOptionSoldOut = option.fopt_state === 'soldOut'
                    const optionImage = JSON.parse(option.fopt_image)?.image_cloud || 'https://via.placeholder.com/50'

                    return (
                      <Button
                        key={option.fopt_id}
                        variant='outline'
                        className={`flex items-center gap-1.5 p-1.5 rounded-lg border transition-all ${
                          isSelected && !isOptionSoldOut ? 'border-red-500 text-red-500' : 'border-gray-300'
                        } ${isOptionSoldOut ? 'opacity-50 cursor-not-allowed' : ''}`}
                        onClick={() => !isOptionSoldOut && handleOptionSelect(option.fopt_id)}
                        disabled={isOptionSoldOut}
                      >
                        <div className='relative w-6 h-6'>
                          <Image
                            src={optionImage}
                            alt={option.fopt_name}
                            layout='fill'
                            objectFit='cover'
                            className='rounded'
                          />
                        </div>
                        <div className='flex flex-col items-start'>
                          <span className='font-medium'>{option.fopt_attribute}</span>
                          <span className='text-red-500'>{formatPrice(option.fopt_price)}</span>
                        </div>
                      </Button>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </>
    )
  }

  if (showButtons) {
    return (
      <>
        <div className='flex items-start justify-start border border-gray-300 rounded-lg h-10 w-32'>
          <Button
            variant='ghost'
            className='h-full w-8 p-0 text-lg'
            onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
            disabled={isFoodSoldOut || quantity <= 1}
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
            disabled={isFoodSoldOut}
          />
          <Button
            variant='ghost'
            className='h-full w-8 p-0 text-lg'
            onClick={() => setQuantity((prev) => prev + 1)}
            disabled={isFoodSoldOut}
          >
            +
          </Button>
        </div>
        <div className='mt-2 flex flex-col sm:flex-row gap-3 max-w-full items-center justify-center sm:justify-start'>
          <Link href='/dat-mon-an' className='w-full sm:w-auto'>
            <Button
              className='bg-green-500 hover:bg-green-600 text-white text-sm py-2 px-4 rounded-lg w-full'
              disabled={isFoodSoldOut || !isWithinServiceHours}
            >
              {isFoodSoldOut ? 'Hết hàng' : !isWithinServiceHours ? 'Hiện không phục vụ' : 'Đặt ngay'}
            </Button>
          </Link>
          <Button
            className='bg-red-500 hover:bg-red-600 text-white text-sm py-2 px-4 rounded-lg w-full sm:w-auto'
            disabled={isFoodSoldOut}
          >
            Thêm vào giỏ hàng
          </Button>
        </div>
      </>
    )
  }

  return (
    <>
      {imageUrls.length > 1 ? (
        <Slider {...settings}>
          {imageUrls.map((imageUrl: string, index: number) => (
            <div key={index} className='relative w-full h-96'>
              <Image
                src={imageUrl}
                alt={`${food.food_name} - Image ${index + 1}`}
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
            src={imageUrls[0] || 'https://via.placeholder.com/500'}
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
