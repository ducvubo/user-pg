import React from 'react'
import Image from 'next/image'
import { Label } from '@/components/ui/label'
import Link from 'next/link'

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

export default function YouLookingForRestaurant({ images, order, title }: ItemData) {
  return (
    <div className='mt-7'>
      <Label className='font-semibold text-3xl px-2'>{title}</Label>
      <hr className='my-3  font-semibold' />

      <div className='grid grid-cols-3 gap-5'>
        {images.map((image, index) => (
          <Link href={image.link} key={index}>
            <Image src={image.image_cloud} width={650} height={400} alt='vuducbo' />
          </Link>
        ))}
      </div>
    </div>
  )
}
