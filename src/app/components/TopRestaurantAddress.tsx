import { Label } from '@/components/ui/label'
import React from 'react'
import Image from 'next/image'

export interface ImageUrl {
  image_cloud: string
  image_custom: string
  link: string
}

export interface ItemData {
  title: string
  order: number // Thêm trường order
  images: ImageUrl[]
}

export default function TopRestaurantAddress({ images, order, title }: ItemData) {
  return (
    <div className='mt-7'>
      <Label className='font-semibold text-3xl px-2'>{title}</Label>
      <hr className='my-3 font-semibold' />

      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5'>
        {images.map((image, index) => (
          <div key={index}>
            <Image src={image.image_cloud} width={250} height={350} alt='vuducbo' />
          </div>
        ))}
      </div>
    </div>
  )
}
