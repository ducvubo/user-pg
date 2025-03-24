'use client';

import React from 'react';
import Link from 'next/link';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { Label } from '@/components/ui/label';
import { ICategoryBlogRestaurant, IArticleRestaurant } from '../api';
import Image from 'next/image';

// Định nghĩa NextArrow và PrevArrow cho slider (không có background)
const NextArrow = ({ className, style, onClick }: any) => (
  <div
    className={className}
    style={{
      ...style,
      display: 'block',
      right: '10px',
      top: '65%',
      transform: 'translateY(-50%)',
      zIndex: 1,
      borderRadius: '50%',
      width: '32px',
      height: '32px',
      lineHeight: '32px',
      textAlign: 'center',
      color: 'white',
    }}
    onClick={onClick}
  />
);

const PrevArrow = ({ className, style, onClick }: any) => (
  <div
    className={className}
    style={{
      ...style,
      display: 'block',
      left: '10px',
      top: '65%',
      transform: 'translateY(-50%)',
      zIndex: 1,
      borderRadius: '50%',
      width: '32px',
      height: '32px',
      lineHeight: '32px',
      textAlign: 'center',
      color: 'white',
    }}
    onClick={onClick}
  />
);
const NextArrowArticle = ({ className, style, onClick }: any) => (
  <div
    className={className}
    style={{
      ...style,
      display: 'block',
      right: '10px',
      top: '40%',
      transform: 'translateY(-50%)',
      zIndex: 1,
      borderRadius: '50%',
      width: '32px',
      height: '32px',
      lineHeight: '32px',
      textAlign: 'center',
      color: 'white',
    }}
    onClick={onClick}
  />
);

const PrevArrowArticle = ({ className, style, onClick }: any) => (
  <div
    className={className}
    style={{
      ...style,
      display: 'block',
      left: '10px',
      top: '40%',
      transform: 'translateY(-50%)',
      zIndex: 1,
      borderRadius: '50%',
      width: '32px',
      height: '32px',
      lineHeight: '32px',
      textAlign: 'center',
      color: 'white',
    }}
    onClick={onClick}
  />
);
interface Props {
  categories: ICategoryBlogRestaurant[];
  articles: IArticleRestaurant[];
}

export default function BlockBlogClient({ categories, articles }: Props) {
  // Cấu hình slider cho danh mục
  const categorySettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 6, // Mặc định cho desktop lớn
    slidesToScroll: 1,
    arrows: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 1280, // xl
        settings: {
          slidesToShow: 5,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 1024, // lg
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 768, // md
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 640, // sm
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
    ],
  };

  // Cấu hình slider cho bài viết
  const articleSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4, // Hiển thị 4 bài viết trên desktop lớn
    slidesToScroll: 1,
    arrows: true,
    nextArrow: <NextArrowArticle />,
    prevArrow: <PrevArrowArticle />,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 1280, // xl
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 1024, // lg
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 768, // md
        settings: {
          slidesToShow: 1,
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
  };

  // Hàm chuyển đổi thời gian đăng thành định dạng dễ đọc
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  return (
    <div className="mt-10">
      <Label className="font-semibold text-xl sm:text-2xl md:text-3xl">Blog Nhà hàng</Label>
      <hr className="my-3 font-semibold" />
      <Slider {...categorySettings} className="">
        {categories.map((category: ICategoryBlogRestaurant) => (
          <div
            key={category.catId}
            // href={`/blog/${category.catSlug}`}
            className="block w-full px-2"
          >
            <span
              className="flex-shrink-0 w-full h-16 font-semibold bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg shadow-sm transition-colors duration-200 flex items-center justify-center text-center"
            >
              {category.catName}
            </span>
          </div>
        ))}
      </Slider>

      <div className="mt-8">

        <Slider {...articleSettings} className="">
          {articles.map((article: IArticleRestaurant) => {
            const imageData = JSON.parse(article.atlImage);
            const imageUrl = imageData.image_custom || imageData.image_cloud;

            return (
              <Link
                key={article.atlId}
                href={`/bai-viet-nha-hang/${article.atlSlug}`}
                className="block px-1"
              >
                <div className="relative w-full h-52">
                  <Image
                    src={imageUrl}
                    alt={article.atlTitle}
                    fill
                    className="object-cover rounded-lg"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
                <div className="mt-2 text-center">
                  <h3 className="text-base font-semibold text-gray-800 line-clamp-2">{article.atlTitle}</h3>
                  <p className="text-sm text-gray-500 mt-1">{formatDate(article.atlPublishedTime)}</p>
                </div>
              </Link>
            );
          })}
        </Slider>
      </div>
    </div>
  );
}