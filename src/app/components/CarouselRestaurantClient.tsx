'use client';

import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Image from 'next/image';
import Link from 'next/link';
import { IRestaurant } from '../interface/restaurant.interface';
import { buildPriceRestaurant, replaceDimensions } from '../utils';

const NextArrow = ({ className, style, onClick }: any) => (
  <div className={className} style={{ ...style, display: 'block', right: '10px', zIndex: 1 }} onClick={onClick} />
);

const PrevArrow = ({ className, style, onClick }: any) => (
  <div className={className} style={{ ...style, display: 'block', left: '10px', zIndex: 1 }} onClick={onClick} />
);

interface IProps {
  listRestaurantSelected: IRestaurant[];
}

export default function CarouselRestaurantClient({ listRestaurantSelected }: IProps) {
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
  };

  return (
    <Slider {...settings}>
      {listRestaurantSelected.map((restaurant, index) => (
        <Link href={`/nha-hang/${restaurant.restaurant_slug}`} key={index}>
          <div className="w-full px-2 cursor-pointer">
            <Image
              src={replaceDimensions(restaurant.restaurant_banner.image_custom, 1000, 1000)}
              width={500}
              height={500}
              alt="vuducbo"
              className="flex justify-center w-full h-[318px]"
            />
            <div className="flex flex-col gap-1">
              <span className="font-semibold line-clamp-1">{restaurant.restaurant_name}</span>
              <span className="line-clamp-1">{restaurant.restaurant_address.address_district.name}</span>
              <span className="font-semibold text-red-500 text-sm">
                {buildPriceRestaurant(restaurant.restaurant_price)}
              </span>
            </div>
          </div>
        </Link>
      ))}
    </Slider>
  );
}