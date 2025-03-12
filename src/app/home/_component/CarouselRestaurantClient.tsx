'use client'
import React, { useState, useEffect } from 'react'
import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import Image from 'next/image'
import Link from 'next/link'
import { IRestaurant } from '../../interface/restaurant.interface'
import { buildPriceRestaurant, replaceDimensions } from '../../utils'

const NextArrow = ({ className, style, onClick }: any) => {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    setIsMobile(window.innerWidth < 768)
  }, [])

  return (
    <div
      className={className}
      style={{
        ...style,
        display: 'block',
        right: isMobile ? '5px' : '10px',
        top: '35%', // Sửa từ '35%' thành '50%' để căn giữa
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
}

const PrevArrow = ({ className, style, onClick }: any) => {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    setIsMobile(window.innerWidth < 768)
  }, [])

  return (
    <div
      className={className}
      style={{
        ...style,
        display: 'block',
        left: isMobile ? '5px' : '10px',
        top: '35%', // Sửa từ '35%' thành '50%' để căn giữa
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
}

interface IProps {
  listRestaurantSelected: IRestaurant[]
}

export default function CarouselRestaurantCatClient({ listRestaurantSelected }: IProps) {
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 5,
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
          slidesToShow: 3,
          slidesToScroll: 1
        }
      },
      {
        breakpoint: 768, // md
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1
        }
      },
      {
        breakpoint: 640, // sm
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  }

  const renderRestaurantItem = (restaurant: IRestaurant, index: number) => (
    <Link href={`/nha-hang/${restaurant.restaurant_slug}`} target='_blank' key={index}>
      <div className='w-full px-2 cursor-pointer'>
        <Image
          // src={replaceDimensions(restaurant.restaurant_banner.image_custom, 1000, 1000)}
          src={restaurant.restaurant_banner.image_cloud}
          width={500}
          height={700}
          alt={restaurant.restaurant_name}
          priority
          className='w-full h-40 md:h-64 lg:h-[310px] object-cover'
          sizes='(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw'
        />
        <div className='flex flex-col gap-1 group hover:text-red-500 mt-3'>
          <span className='font-semibold text-sm md:text-base line-clamp-1'>{restaurant.restaurant_name}</span>
          <div className='flex flex-col md:flex-row gap-2 text-xs md:text-sm'>
            <span className='line-clamp-1 mt-1'>{restaurant.restaurant_address.address_province.name}</span>
            {(restaurant.restaurant_type[0] || restaurant.restaurant_type[1]) && (
              <div className='flex flex-wrap gap-1'>
                {restaurant.restaurant_type[0] && (
                  <span className='border rounded-md px-1 py-1'>
                    {restaurant.restaurant_type[0].restaurant_type_name}
                  </span>
                )}
                {restaurant.restaurant_type[1] && (
                  <span className='border rounded-md px-1 py-1'>
                    {restaurant.restaurant_type[1].restaurant_type_name}
                  </span>
                )}
              </div>
            )}
          </div>
          <span className='font-semibold text-red-500 text-sm md:text-base'>
            {buildPriceRestaurant(restaurant.restaurant_price)}
          </span>
        </div>
      </div>
    </Link>
  )

  if (listRestaurantSelected.length < 5) {
    return (
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:px-0'>
        {listRestaurantSelected && listRestaurantSelected.length !== 0 && listRestaurantSelected.map((restaurant, index) => renderRestaurantItem(restaurant, index))}
      </div>
    )
  }

  return (
    <div className=''>
      <Slider {...settings}>
        {listRestaurantSelected.map((restaurant, index) => renderRestaurantItem(restaurant, index))}
      </Slider>
    </div>
  )
}
