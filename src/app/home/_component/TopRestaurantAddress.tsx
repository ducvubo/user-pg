import { Label } from '@/components/ui/label'
import React from 'react'
import Image from 'next/image'
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

export default function TopRestaurantAddress({ images, order, title }: ItemData) {
  return (
    <div className='mt-5 '>
      <Label className='font-semibold text-xl sm:text-2xl md:text-3xl'>{title}</Label>
      <hr className='my-3' />

      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-5 md:gap-6'>
        {images.map((image, index) => (
          <Link href={image.link ? image.link : '/'} key={index}>
            <Image
              src={image.image_cloud}
              width={350}
              height={350}
              alt='Top Restaurant'
              className='w-full h-48 sm:h-56 md:h-64 object-cover '
              sizes='(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw'
              loading='lazy'
            />
          </Link>
        ))}
      </div>
    </div>
  )
}
