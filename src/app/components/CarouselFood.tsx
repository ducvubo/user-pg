'use client'

import React from 'react'
import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import Image from 'next/image'
import Link from 'next/link'
import { IRestaurant } from '../interface/restaurant.interface'
import { buildPriceRestaurant, replaceDimensions } from '../utils'
import { IFoodRestaurant } from '../interface/food-restaurant.interface'

const NextArrow: React.FC<{ className?: string; style?: React.CSSProperties; onClick?: () => void }> = (props) => {
  const { className, style, onClick } = props
  return (
    <div className={className} style={{ ...style, display: 'block', right: '10px', zIndex: 1 }} onClick={onClick} />
  )
}

const PrevArrow: React.FC<{ className?: string; style?: React.CSSProperties; onClick?: () => void }> = (props) => {
  const { className, style, onClick } = props
  return <div className={className} style={{ ...style, display: 'block', left: '10px', zIndex: 1 }} onClick={onClick} />
}

function formatTimeWithoutSeconds(time: string) {
  const parts = time.split(':')
  const hours = parts[0].padStart(2, '0')
  const minutes = parts[1].padStart(2, '0')
  return `${hours}:${minutes}`
}

interface IProps {
  listFoodRestaurant?: IFoodRestaurant[]
}

export default function CarouselFood({ listFoodRestaurant }: IProps) {
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
    autoplaySpeed: 2000
  }

  const renderFoodCard = (food: IFoodRestaurant, index: number) => {
    let parsedImage = ''
    try {
      parsedImage = replaceDimensions(JSON.parse(food.food_image).image_custom, 1000, 1000)
    } catch (error) {
      console.error('Invalid image JSON:', error)
    }

    return (
      <Link href={`/`} key={index}>
        <div className='w-full px-1 cursor-pointer relative'>
          <Image
            src={parsedImage || '/fallback-image.jpg'} // Fallback nếu parse thất bại
            width={500}
            height={500}
            alt={food.food_name}
            className='flex justify-center w-full h-[318px]'
          />
          <div
            style={{
              width: 'calc(100% - 8px)'
            }}
            className='flex justify-center items-center flex-col gap-1 absolute bottom-0 w-full bg-[#373534] bg-opacity-35'
          >
            <span className='font-semibold line-clamp-1 text-white'>{food.food_name}</span>
            <span className='font-semibold line-clamp-1 text-white'>
              {formatTimeWithoutSeconds(food.food_open_time)} - {formatTimeWithoutSeconds(food.food_close_time)}
            </span>
            <span className='line-clamp-1 text-white'>{food.food_price.toLocaleString()}</span>
          </div>
        </div>
      </Link>
    )
  }

  return (
    <div className='mt-4'>
      {listFoodRestaurant && listFoodRestaurant.length > 2 ? (
        <Slider {...settings}>{listFoodRestaurant.map((food, index) => renderFoodCard(food, index))}</Slider>
      ) : (
        <div className='flex gap-2'>{listFoodRestaurant?.map((food, index) => renderFoodCard(food, index))}</div>
      )}
    </div>
  )
}
