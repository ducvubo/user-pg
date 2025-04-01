'use client'
import { IFoodRestaurant } from '@/app/interface/food-restaurant.interface'
import React, { useState } from 'react'
import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import ComboList, { IComboFood } from '@/app/nha-hang/_component/ComboList'
import FoodList from '@/app/nha-hang/_component/FoodList'
import { Card, CardContent } from '@/components/ui/card'
import { IRestaurant } from '@/app/interface/restaurant.interface'
import { CircleDollarSign, MapPin, PhoneCall } from 'lucide-react'
import { buildPriceRestaurant } from '@/app/utils'
import Link from 'next/link'

interface IProps {
  food: IFoodRestaurant
  listFood?: IFoodRestaurant[]
  listCombo?: IComboFood[]
  restaurant: IRestaurant
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

export default function PageInforFood({ food, listCombo, listFood, restaurant }: IProps) {
  const images = JSON.parse(food.food_image)
  const imageUrls = images.map((img: { image_cloud: string }) => img.image_cloud || 'https://via.placeholder.com/300')

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)
  }

  const [selectedOptions, setSelectedOptions] = useState<string[]>([])

  const handleOptionSelect = (optionId: string) => {
    if (selectedOptions.includes(optionId)) {
      setSelectedOptions(selectedOptions.filter((id) => id !== optionId))
    } else {
      setSelectedOptions([...selectedOptions, optionId])
    }
  }

  const totalPrice =
    food.food_price +
    selectedOptions.reduce((sum, optionId) => {
      const option = food.fopt_food.find((opt) => opt.fopt_id === optionId)
      return sum + (option ? option.fopt_price : 0)
    }, 0)

  const isFoodSoldOut = food.food_state === 'soldOut'

  const groupedOptions =
    food.fopt_food?.reduce((acc, option) => {
      const groupName = option.fopt_name
      if (!acc[groupName]) {
        acc[groupName] = []
      }
      acc[groupName].push(option)
      return acc
    }, {} as Record<string, IFoodRestaurant['fopt_food']>) || {}

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

  return (
    <div className='w-full px-4 md:px-8 lg:px-[100px] bg-[#e6eaed] py-5 flex flex-col gap-4'>
      <Card className='bg-white h-auto p-4'>
        <Link
          href={`/nha-hang/${restaurant.restaurant_slug}`}
          className='w-full rounded-md overflow-hidden flex flex-col sm:flex-row gap-3 justify-start items-center'
        >
          <Image
            src={restaurant?.restaurant_banner.image_cloud}
            alt={restaurant?.restaurant_name || 'Restaurant'}
            width={128}
            height={128}
            className='w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-lg'
          />
          <div className='flex flex-col gap-2 w-full'>
            <div className='flex justify-between'>
              <h1 className='font-semibold text-lg sm:text-xl'>{restaurant.restaurant_name}</h1>
            </div>
            <div className='flex items-center'>
              <MapPin size={16} />
              <span className='ml-1 text-xs sm:text-sm'>Địa chỉ: {restaurant.restaurant_address.address_specific}</span>
            </div>
            <div className='flex items-center'>
              <CircleDollarSign size={16} />
              <span className='ml-1 font-semibold text-red-500 text-xs sm:text-sm'>
                {buildPriceRestaurant(restaurant.restaurant_price)}
              </span>
            </div>
            <div className='flex items-center'>
              <PhoneCall size={16} />
              <span className='ml-1 font-semibold text-red-500 text-xs sm:text-sm'>{restaurant.restaurant_phone}</span>
            </div>
          </div>
        </Link>
      </Card>
      <div className='bg-white rounded-lg shadow-md p-5'>
        <div className='flex flex-col md:flex-row gap-4'>
          <div className='md:w-1/2'>
            {imageUrls.length > 0 ? (
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
                  src='https://via.placeholder.com/300'
                  alt='No image available'
                  layout='fill'
                  objectFit='cover'
                  className='rounded-lg'
                />
              </div>
            )}
          </div>

          <div className='md:w-1/2 flex flex-col gap-2'>
            <h1 className='text-2xl font-bold text-gray-800'>{food.food_name}</h1>

            <div className='flex items-center gap-2'>
              <span className='text-xl font-semibold text-red-500'>{formatPrice(totalPrice)}</span>
            </div>

            <div className='text-sm text-gray-600'>
              <p>
                <span className='font-semibold'>Gọi ngay:</span>{' '}
                <a href='tel:1900633045' className='text-blue-500 hover:underline'>
                  1900 633 045
                </a>
              </p>
            </div>

            <div className='text-sm'>
              <p className='font-semibold'>Giờ bán:</p>
              <p className='text-gray-600'>
                {food.food_open_time} - {food.food_close_time}
              </p>
            </div>

            <div className='text-sm'>
              <p className='font-semibold'>Ghi chú:</p>
              <p className='text-gray-600'>{food.food_note}</p>
            </div>

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
                        const optionImage =
                          JSON.parse(option.fopt_image)?.image_cloud || 'https://via.placeholder.com/50'

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

            <div className='mt-2'>
              <Button
                className='w-full bg-red-500 hover:bg-red-600 text-white text-sm py-2 rounded-lg'
                disabled={isFoodSoldOut}
              >
                {isFoodSoldOut ? 'Hết hàng' : 'Thêm vào giỏ hàng'}
              </Button>
            </div>
          </div>
        </div>

        <div className='mt-2 text-sm'>
          <div className='text-gray-600' dangerouslySetInnerHTML={{ __html: food.food_description }} />
        </div>
      </div>
      {listFood && listFood.length > 0 && (
        <Card>
          <CardContent>
            <FoodList foods={listFood} />
          </CardContent>
        </Card>
      )}
      {listCombo && listCombo.length > 0 && (
        <Card>
          <CardContent>
            <ComboList comboFoods={listCombo} />
          </CardContent>
        </Card>
      )}
    </div>
  )
}
