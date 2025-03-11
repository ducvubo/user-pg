'use client'
import { Label } from '@/components/ui/label'
import { IRestaurant } from '../../interface/restaurant.interface'
import CarouselRestaurantClient from './CarouselRestaurantClient'
import { findRecommendRestaurant } from '@/app/nha-hang/api'
import { useEffect, useState } from 'react'

export default function CarouselRestaurantRecommend() {

  const [listRestaurantSelected, setListRestaurantSelected] = useState<IRestaurant[]>([])

  const getRestaurantRecommend = async () => {
    try {
      const res: IBackendRes<IRestaurant[]> = await findRecommendRestaurant()
      if (res.statusCode === 201 && res.data) {
        setListRestaurantSelected(res.data)
      } else {
        console.log('error')
      }
    } catch (error) {
      console.log("🚀 ~ getRestaurantRecommend ~ error:", error)
    }
  }

  useEffect(() => {
    getRestaurantRecommend()
  }, [])


  return (
    <div className='mt-10'>
      <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2'>
        <Label className='font-semibold text-xl sm:text-2xl md:text-3xl'>Danh sách nhà gợi ý</Label>

      </div>
      <hr className='my-3 font-semibold' />
      {
        listRestaurantSelected && listRestaurantSelected.length !== 0 &&
        <CarouselRestaurantClient listRestaurantSelected={listRestaurantSelected} />
      }
    </div>
  )
}
