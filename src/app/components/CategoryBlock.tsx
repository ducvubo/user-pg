'use client'

import React from 'react'
import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import Link from 'next/link'
import { ICategory } from '../home/home.api'

interface IProps {
  categories: ICategory[]
}

const NextArrow = ({ className, style, onClick }: any) => (
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
      width: '32px',
      height: '32px',
      lineHeight: '32px',
      textAlign: 'center'
    }}
    onClick={onClick}
  />
)

const PrevArrow = ({ className, style, onClick }: any) => (
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
      width: '32px',
      height: '32px',
      lineHeight: '32px',
      textAlign: 'center'
    }}
    onClick={onClick}
  />
)

export default function CategoryBlock({ categories }: IProps) {
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 10, // Mặc định cho desktop lớn
    slidesToScroll: 1,
    arrows: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    autoplay: true,
    autoplaySpeed: 2000,
    responsive: [
      {
        breakpoint: 1280, // xl
        settings: {
          slidesToShow: 8,
          slidesToScroll: 1
        }
      },
      {
        breakpoint: 1024, // lg
        settings: {
          slidesToShow: 6,
          slidesToScroll: 1
        }
      },
      {
        breakpoint: 768, // md
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1
        }
      },
      {
        breakpoint: 640, // sm
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1
        }
      }
    ]
  }

  return (
    <div className='px-4 sm:px-8 md:px-12 lg:px-[100px] py-4'>
      <Slider {...settings}>
        {categories.map((category, index) => (
          <Link href={`/danh-muc-nha-hang/${category.category_slug}`} key={index}>
            <div className='flex flex-col items-center cursor-pointer px-2'>
              <div className='w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-white rounded-full flex items-center justify-center shadow-md'>
                <span className='text-xl sm:text-2xl md:text-3xl'>{category.category_icon}</span>
              </div>
              <span className='mt-2 text-sm sm:text-base md:text-lg text-gray-700 font-semibold text-center line-clamp-1'>
                {category.category_name}
              </span>
            </div>
          </Link>
        ))}
      </Slider>
    </div>
  )
}
