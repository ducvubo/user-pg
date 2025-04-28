import React from 'react'
import Image from 'next/image'
import AddComboFoodToCart from './AddComboFoodToCart'
import Link from 'next/link'
import { IFoodRestaurant } from '@/app/interface/food-restaurant.interface'
export interface IComboFood {
  fcb_id: string
  fcb_res_id: string
  fcb_name: string
  fcb_slug: string
  fcb_price: number
  fcb_open_time: string
  fcb_close_time: string
  fcb_note: string
  fcb_state: 'soldOut' | 'inStock' | 'almostOut'
  fcb_sort: number
  fcb_image: string
  fcbi_combo: IFoodComboItems[]
  fcb_description: string
}

export interface IFoodComboItems {
  fcbi_id: string
  fcbi_res_id: string
  fcbi_food_id: string
  fcbi_combo_id: string
  fcbi_quantity: number
  fcbi_food: IFoodRestaurant
}

export default function ComboList({ comboFoods }: { comboFoods: IComboFood[] }) {
  // Hàm chuyển đổi thời gian string sang Date object
  const getTimeAsDate = (timeString: string) => {
    const [hours, minutes, seconds] = timeString.split(':').map(Number)
    const now = new Date()
    return new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes, seconds)
  }

  // Hàm kiểm tra xem món ăn có đang trong giờ bán không
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
      <h1 className='text-3xl font-bold mb-6 text-center'>Combo Ưu Đãi</h1>
      <div className='grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {comboFoods.map((combo) => {
          const images = JSON.parse(combo.fcb_image)
          const primaryImage = images.image_cloud
          const sellingStatus = isSelling(combo.fcb_open_time, combo.fcb_close_time)

          return (
            <div
              key={combo.fcb_id}
              className='bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300'
            >
              {primaryImage && (
                <div className='relative w-full h-48'>
                  <Link href={`/combo-mon-an/${combo.fcb_slug}`} target='_blank'>
                    <Image src={primaryImage} alt={combo.fcb_name} fill className='object-cover' />
                  </Link>
                </div>
              )}
              <div className='p-4'>
                <div className='flex justify-between'>
                  <Link href={`/combo-mon-an/${combo.fcb_slug}`} target='_blank'>
                    <h2 className='text-xl font-semibold text-gray-800 mb-2'>{combo.fcb_name}</h2>
                  </Link>
                  <AddComboFoodToCart fcb_id={combo.fcb_id} />
                </div>
                <Link href={`/combo-mon-an/${combo.fcb_slug}`} target='_blank'>
                  <p className='text-gray-600 mb-2'>Giá: {combo.fcb_price.toLocaleString('vi-VN')} VNĐ</p>
                  <p className='text-sm text-gray-500'>
                    Giờ mở: {combo.fcb_open_time} - {combo.fcb_close_time} {sellingStatus ? '(Đang bán)' : '(Hết giờ)'}
                  </p>
                  <p className='text-sm mt-1'>
                    Trạng thái:{' '}
                    <span
                      className={combo.fcb_state === 'inStock' && sellingStatus ? 'text-green-600' : 'text-red-600'}
                    >
                      {combo.fcb_state === 'inStock' && 'Còn hàng'}
                      {combo.fcb_state === 'soldOut' && 'Hết hàng'}
                      {combo.fcb_state === 'almostOut' && 'Sắp hết hàng'}
                    </span>
                  </p>
                  {combo.fcb_note && <p className='text-sm text-gray-500 mt-1 italic'>Ghi chú: {combo.fcb_note}</p>}
                </Link>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
