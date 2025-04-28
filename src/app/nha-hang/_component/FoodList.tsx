import React from 'react'
import Image from 'next/image'
import { IFoodRestaurant } from '@/app/interface/food-restaurant.interface'
import { ShoppingBasket } from 'lucide-react'
import AddFoodToCart from './AddFoodToCart'
import Link from 'next/link'

export default function FoodList({ foods }: { foods: IFoodRestaurant[] }) {
  const getTimeAsDate = (timeString: string) => {
    const [hours, minutes, seconds] = timeString.split(':').map(Number)
    const now = new Date()
    return new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes, seconds)
  }

  const isSelling = (openTime: string, closeTime: string) => {
    const now = new Date()
    const open = getTimeAsDate(openTime)
    const close = getTimeAsDate(closeTime)

    // Xử lý trường hợp giờ đóng cửa qua nửa đêm
    if (close < open) {
      close.setDate(close.getDate() + 1)
    }

    return now >= open && now <= close
  }

  return (
    <div className=' mx-auto px-4 py-8'>
      <h1 className='text-3xl font-bold mb-6 text-center'>Menu Nhà Hàng</h1>
      <div className='grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {foods.map((food) => {
          const images = JSON.parse(food.food_image)
          const primaryImage = images[0]?.image_cloud
          const sellingStatus = isSelling(food.food_open_time, food.food_close_time)

          return (
            <div
              key={food.food_id}
              className='bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300'
            >
              {primaryImage && (
                <Link href={`/mon-an/${food.food_slug}`} target='_blank'>
                  <div className='relative w-full h-48'>
                    <Image src={primaryImage} alt={food.food_name} fill className='object-cover' />
                  </div>
                </Link>
              )}
              <div className='p-4'>
                <div className='flex justify-between'>
                  <Link href={`/mon-an/${food.food_slug}`} target='_blank'>
                    <h2 className='text-xl font-semibold text-gray-800 mb-2'>{food.food_name}</h2>
                  </Link>
                  <AddFoodToCart food_id={food.food_id} />
                </div>
                <Link href={`/mon-an/${food.food_slug}`} target='_blank'>
                  <p className='text-gray-600 mb-2'>Giá: {food.food_price.toLocaleString('vi-VN')} VNĐ</p>
                  <p className='text-sm text-gray-500'>
                    Giờ mở: {food.food_open_time} - {food.food_close_time} {sellingStatus ? '(Đang bán)' : '(Hết giờ)'}
                  </p>
                  <p className='text-sm mt-1'>
                    Trạng thái:{' '}
                    <span
                      className={food.food_state === 'inStock' && sellingStatus ? 'text-green-600' : 'text-red-600'}
                    >
                      {food.food_state === 'inStock' && 'Còn hàng'}
                      {food.food_state === 'soldOut' && 'Hết hàng'}
                      {food.food_state === 'almostOut' && 'Sắp hết hàng'}
                    </span>
                  </p>
                  {food.food_note && <p className='text-sm text-gray-500 mt-1 italic'>Ghi chú: {food.food_note}</p>}
                </Link>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
