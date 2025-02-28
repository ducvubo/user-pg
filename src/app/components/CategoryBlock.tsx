'use client'

import React from 'react'
import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import Link from 'next/link'

export interface ICategoryRestaurant {
  cat_res_slug: string
  cat_res_icon: string
  cat_res_name: string
}

interface IProps {
  categories: ICategoryRestaurant[]
}

const NextArrow = ({ className, style, onClick }: any) => (
  <div
    className={className}
    style={{ ...style, display: 'block', right: '10px', top: '40px', zIndex: 1 }}
    onClick={onClick}
  />
)

const PrevArrow = ({ className, style, onClick }: any) => (
  <div
    className={className}
    style={{ ...style, display: 'block', left: '10px', top: '40px', zIndex: 1 }}
    onClick={onClick}
  />
)

export default function CategorySlider({ categories }: IProps) {
  // Cấu hình slider giống như trong CarouselRestaurantClient
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 10, // Hiển thị 5 danh mục mỗi lần
    slidesToScroll: 1,
    arrows: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    autoplay: true,
    autoplaySpeed: 2000
  }

  return (
    <div className='px-[100px] py-4'>
      <Slider {...settings}>
        {categories.map((category) => (
          <Link href={`/category/${category.cat_res_slug}`} key={category.cat_res_slug}>
            <div className='flex flex-col items-center cursor-pointer'>
              <div className='w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-md'>
                <span className='text-2xl'>{category.cat_res_icon}</span>
              </div>
              <span className='mt-2 text-base text-gray-700 font-semibold'>{category.cat_res_name}</span>
            </div>
          </Link>
        ))}
      </Slider>
    </div>
  )
}
