import { ChevronRight, CircleDollarSign, List, MapPin, PhoneCall } from 'lucide-react'
import React from 'react'
import { IRestaurant } from '@/app/interface/restaurant.interface'
import { Card, CardHeader } from '@/components/ui/card'
import Image from 'next/image'
import { buildPriceRestaurant, replaceDimensions } from '@/app/utils'

interface IProps {
  restaurant: IRestaurant
}

export interface ISpecialOffer {
  spo_id: string
  spo_title: string
  spo_description: string
}

export default async function QARestaurant({ restaurant }: IProps) {


  return (
    <div className='bg-[#e6eaed] min-h-screen pb-10'>
      <div className='bg-white h-auto min-h-10 px-4 sm:px-6 md:px-8 lg:px-[100px] flex flex-wrap items-center gap-2 sm:gap-3 md:gap-4 py-2'>
        <span className='text-xs sm:text-sm md:text-base'>Trang chủ</span>
        <ChevronRight size={12} strokeWidth={3} className='sm:w-4 sm:h-4 md:w-5 md:h-5 shrink-0' />
        <span className='text-xs sm:text-sm md:text-base'>{restaurant.restaurant_address.address_province.name}</span>
        <ChevronRight size={12} strokeWidth={3} className='sm:w-4 sm:h-4 md:w-5 md:h-5 shrink-0' />
        <span className='text-xs sm:text-sm md:text-base'>{restaurant.restaurant_address.address_district.name}</span>
        <ChevronRight size={12} strokeWidth={3} className='sm:w-4 sm:h-4 md:w-5 md:h-5 shrink-0' />
        <span className='text-xs sm:text-sm md:text-base'>{restaurant.restaurant_address.address_ward.name}</span>
      </div>

      <Card className='bg-white h-auto min-h-10 mx-4 sm:mx-6 md:mx-8 lg:mx-[100px] mt-5'>
        <CardHeader className='font-semibold text-2xl'>
          Hỏi đáp với nhà hàng
        </CardHeader>
      </Card>

      <Card className='bg-white h-auto min-h-10 mx-4 sm:mx-6 md:mx-8 lg:mx-[100px] mt-2'>
        <div className='w-full  rounded-md overflow-hidden flex-shrink-0 flex gap-2 justify-start items-center ml-3'>
          <Image
            src={restaurant?.restaurant_banner.image_cloud}
            alt={restaurant?.restaurant_name || 'Restaurant'}
            width={100}
            height={100}
            className='w-32 h-32 m-2 object-cover rounded-lg'
          />
          <div className='flex flex-col gap-2'>
            <div className='flex justify-between'>
              <h1 className='font-semibold text-xl'>{restaurant.restaurant_name}</h1>
            </div>
            <div className='flex items-center'>
              <MapPin size={16} />
              <span className='ml-1 text-sm md:text-base'>
                Địa chỉ: {restaurant.restaurant_address.address_specific}
              </span>
            </div>
            <div className='flex items-center '>
              <CircleDollarSign size={16} />
              <span className='ml-1 font-semibold text-red-500 text-sm md:text-base'>
                {buildPriceRestaurant(restaurant.restaurant_price)}
              </span>
            </div>
            <div className='flex items-center '>
              <PhoneCall size={16} />
              <span className='ml-1 font-semibold text-red-500 text-sm md:text-base'>
                {restaurant.restaurant_phone}
              </span>
            </div>

          </div>
        </div>
      </Card>

    </div >
  )
}
