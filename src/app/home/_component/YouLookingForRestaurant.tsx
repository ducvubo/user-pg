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
  order: number
  images: ImageUrl[]
}

export default function YouLookingForRestaurant({ images, order, title }: ItemData) {
  return (
    <div className='mt-5'>
      <Label className='font-semibold text-xl sm:text-2xl md:text-3xl'>{title}</Label>
      <hr className='my-3' />

      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5 md:gap-6'>
        {images.map((image, index) => (
          <Link href={image.link} key={index}>
            <Image
              src={image.image_cloud}
              width={650}
              height={400}
              alt='Restaurant Image'
              className='w-full h-48 sm:h-56 md:h-64 object-cover'
              sizes='(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw'
              loading='lazy'
            />
          </Link>
        ))}
      </div>
    </div>
  )
}
