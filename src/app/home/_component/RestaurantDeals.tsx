// 'use client'
// import React, { useState } from 'react'
// import Slider from 'react-slick'
// import 'slick-carousel/slick/slick.css'
// import 'slick-carousel/slick/slick-theme.css'
// import Image from 'next/image'
// import Link from 'next/link'
// import { Label } from '@/components/ui/label'

// const NextArrow = (props: any) => {
//   const { className, style, onClick } = props
//   return (
//     <div className={className} style={{ ...style, display: 'block', right: '10px', zIndex: 1 }} onClick={onClick} />
//   )
// }

// const PrevArrow = (props: any) => {
//   const { className, style, onClick } = props
//   return <div className={className} style={{ ...style, display: 'block', left: '10px', zIndex: 1 }} onClick={onClick} />
// }

// export interface ImageUrl {
//   image_cloud: string
//   image_custom: string
//   link: string
// }

// export interface IProps {
//   title: string
//   description: string
//   order: number
//   images: ImageUrl[]
// }

// export default function RestaurantDeals({ description, images, order, title }: IProps) {
//   const settings = {
//     dots: false,
//     infinite: true,
//     speed: 500,
//     slidesToShow: 3,
//     slidesToScroll: 1,
//     arrows: true,
//     nextArrow: <NextArrow />,
//     prevArrow: <PrevArrow />,
//     autoplay: true,
//     autoplaySpeed: 2000
//   }

//   const listRestaurant = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

//   return (
//     <div className='mt-5'>
//       <div className='flex justify-between items-center'>
//         <div className='flex flex-col gap-1'>
//           <Label className='font-semibold text-3xl px-2'>{title}</Label>
//           <Label className='text-sm px-2'>{description}</Label>
//         </div>
//       </div>
//       <hr className='my-3 mx-2 font-semibold' />
//       <Slider {...settings}>
//         {images?.map((image, index) => {
//           return (
//             <Link href={image.link} className='w-full px-2' key={index}>
//               <Image
//                 src={image.image_cloud}
//                 width={800}
//                 height={500}
//                 alt='vuducbo'
//                 className='flex justify-center w-full h-[270px]'
//               />
//             </Link>
//           )
//         })}
//       </Slider>
//     </div>
//   )
// }


'use client'

import React, { useState } from 'react'
import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import Image from 'next/image'
import Link from 'next/link'
import { Label } from '@/components/ui/label'

const NextArrow = (props: any) => {
  const { className, style, onClick } = props
  return (
    <div
      className={className}
      style={{
        ...style,
        display: 'block',
        right: '5px',
        top: '50%',
        transform: 'translateY(-50%)',
        zIndex: 1,
        borderRadius: '50%',
        width: '32px',
        height: '32px',
        lineHeight: '32px',
        textAlign: 'center',
      }}
      onClick={onClick}
    />
  )
}

const PrevArrow = (props: any) => {
  const { className, style, onClick } = props
  return (
    <div
      className={className}
      style={{
        ...style,
        display: 'block',
        left: '5px',
        top: '50%',
        transform: 'translateY(-50%)',
        zIndex: 1,
        borderRadius: '50%',
        width: '32px',
        height: '32px',
        lineHeight: '32px',
        textAlign: 'center',
      }}
      onClick={onClick}
    />
  )
}

export interface ImageUrl {
  image_cloud: string
  image_custom: string
  link: string
}

export interface IProps {
  title: string
  description: string
  order: number
  images: ImageUrl[]
}

export default function RestaurantDeals({ description, images, order, title }: IProps) {
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    autoplay: true,
    autoplaySpeed: 2000,
    responsive: [
      {
        breakpoint: 1024, // lg
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 640, // sm
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  }

  return (
    <div className="mt-5">
      <div className="flex justify-between items-center">
        <div className="flex flex-col gap-1">
          <Label className="font-semibold text-xl sm:text-2xl md:text-3xl">{title}</Label>
          <Label className="text-xs sm:text-sm md:text-base">{description}</Label>
        </div>
      </div>
      <hr className="my-3" />
      <Slider {...settings}>
        {images?.map((image, index) => (
          <Link href={image.link} className="w-full px-2" key={index}>
            <Image
              src={image.image_cloud}
              width={800}
              height={500}
              alt="Restaurant Deal"
              className="w-full h-40 sm:h-52 md:h-[270px] object-cover"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          </Link>
        ))}
      </Slider>
    </div>
  )
}
