'use client';
import React, { useEffect, useState } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { IRestaurant } from '@/app/interface/restaurant.interface';
import { CircleDollarSign, MapPin, PhoneCall } from 'lucide-react';
import { buildPriceRestaurant } from '@/app/utils';
import Link from 'next/link';
import { IAmenity, IMenuItem } from '../room.api';
import { IRoom } from '@/app/nha-hang/api';

interface IProps {
  roomRes: IRoom;
  restaurant: IRestaurant;
  listAmenity: IAmenity[];
  listMenuItems: IMenuItem[];
}

const NextArrow = ({ className, style, onClick }: any) => {
  return (
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
        width: '24px',
        height: '24px',
        lineHeight: '24px',
        textAlign: 'center',
      }}
      onClick={onClick}
    />
  );
};

const PrevArrow = ({ className, style, onClick }: any) => {
  return (
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
        width: '24px',
        height: '24px',
        lineHeight: '24px',
        textAlign: 'center',
      }}
      onClick={onClick}
    />
  );
};

export default function PageInforRoom({ roomRes, restaurant, listAmenity, listMenuItems }: IProps) {
  const images = JSON.parse(roomRes.room_images);
  const imageUrls = images.map((img: { image_cloud: string }) => img.image_cloud || 'https://via.placeholder.com/300');

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const [isRoomAvailable, setIsRoomAvailable] = useState(roomRes.room_status === 'enable');

  // Chia listAmenity thành 2 phần cho 2 cột
  const midIndex = Math.ceil(listAmenity.length / 2);
  const leftColumnAmenities = listAmenity.slice(0, midIndex);
  const rightColumnAmenities = listAmenity.slice(midIndex);

  useEffect(() => {
    setIsRoomAvailable(roomRes.room_status === 'enable');
  }, [roomRes.room_status]);

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  return (
    <div className="w-full px-4 md:px-8 lg:px-[100px] bg-[#e6eaed] py-5 flex flex-col gap-4">
      {/* Container 1: Thông tin nhà hàng */}
      <div className="bg-white rounded-lg shadow-md p-5">
        <Link
          href={`/nha-hang/${restaurant.restaurant_slug}`}
          className="w-full rounded-md overflow-hidden flex flex-col sm:flex-row gap-3 justify-start items-center"
        >
          <Image
            src={restaurant?.restaurant_banner.image_cloud}
            alt={restaurant?.restaurant_name || 'Restaurant'}
            width={128}
            height={128}
            className="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-lg"
          />
          <div className="flex flex-col gap-2 w-full">
            <div className="flex justify-between">
              <h1 className="font-semibold text-lg sm:text-xl">{restaurant.restaurant_name}</h1>
            </div>
            <div className="flex items-center">
              <MapPin size={16} />
              <span className="ml-1 text-xs sm:text-sm">
                Địa chỉ: {restaurant.restaurant_address.address_specific}
              </span>
            </div>
            <div className="flex items-center">
              <CircleDollarSign size={16} />
              <span className="ml-1 font-semibold text-red-500 text-xs sm:text-sm">
                {buildPriceRestaurant(restaurant.restaurant_price)}
              </span>
            </div>
            <div className="flex items-center">
              <PhoneCall size={16} />
              <span className="ml-1 font-semibold text-red-500 text-xs sm:text-sm">
                {restaurant.restaurant_phone}
              </span>
            </div>
          </div>
        </Link>
      </div>

      {/* Container 2: Thông tin phòng */}
      <div className="bg-white rounded-lg shadow-md p-5">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="md:w-1/2">
            {imageUrls.length > 1 ? (
              <Slider {...settings}>
                {imageUrls.map((imageUrl: string, index: number) => (
                  <div key={index} className="relative w-full h-96">
                    <Image
                      src={imageUrl}
                      alt={`${roomRes.room_name} - Image ${index + 1}`}
                      layout="fill"
                      objectFit="cover"
                      className="rounded-lg"
                    />
                  </div>
                ))}
              </Slider>
            ) : (
              <div className="relative w-full h-96">
                <Image
                  src={imageUrls[0] || 'https://via.placeholder.com/500'}
                  alt="No image available"
                  layout="fill"
                  objectFit="cover"
                  className="rounded-lg"
                />
              </div>
            )}
          </div>

          <div className="md:w-1/2 flex flex-col gap-2">
            <h1 className="text-2xl font-bold text-gray-800">{roomRes.room_name}</h1>

            <div className="flex flex-col gap-1">
              <span className="text-xl font-semibold text-red-500">
                Giá: {formatPrice(roomRes.room_base_price)}
              </span>
              <span className="text-sm text-gray-600">
                Đặt cọc: {formatPrice(roomRes.room_deposit)}
              </span>
              <span className="text-sm font-semibold">
                Tổng tiền: <span className="text-red-500">{formatPrice(roomRes.room_base_price)}</span>
              </span>
            </div>

            <div className="text-sm">
              <p className="font-semibold">Diện tích:</p>
              <p className="text-gray-600">{roomRes.room_area}</p>
            </div>

            <div className="text-sm">
              <p className="font-semibold">Sức chứa:</p>
              <p className="text-gray-600">{roomRes.room_max_guest} người</p>
            </div>

            <div className="text-sm">
              <p className="font-semibold">Tiện ích cố định:</p>
              <p className="text-gray-600">{roomRes.room_fix_ame}</p>
            </div>
            <div className="text-sm">
              <p className="font-semibold">Ghi chú:</p>
              <p className="text-gray-600">{roomRes.room_note}</p>
            </div>

            <div className="mt-2 flex flex-col sm:flex-row gap-3 max-w-full items-center justify-center sm:justify-start">
              <Link
                href={`/dat-phong/${roomRes.room_id}`}
                target="_blank"
                className="w-full sm:w-auto"
                onClick={(e) => {
                  if (!isRoomAvailable) {
                    e.preventDefault();
                  }
                }}
              >
                <Button
                  className="bg-green-500 hover:bg-green-600 text-white text-sm py-2 px-4 rounded-lg w-full"
                  disabled={!isRoomAvailable}
                >
                  {isRoomAvailable ? 'Đặt ngay' : 'Không có sẵn'}
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-4 text-sm">
          <p className="font-semibold">Mô tả:</p>
          <div className="text-gray-600" dangerouslySetInnerHTML={{ __html: roomRes.room_description }} />
        </div>
      </div>

      {listAmenity.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-5">
          <h2 className="text-xl font-bold text-gray-800">Tiện ích bổ sung</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:gap-3">
            {/* Cột trái */}
            <ul className="list-disc pl-5 text-sm">
              {leftColumnAmenities.map((amenity) => (
                <li key={amenity.ame_id} className="mb-2">
                  <span className="font-medium">{amenity.ame_name}</span> -{' '}
                  <span className="text-red-500">{formatPrice(amenity.ame_price)}</span>
                  <p className="text-gray-600">{amenity.ame_description}</p>
                  {amenity.ame_note && (
                    <p className="text-xs text-gray-500 italic">Ghi chú: {amenity.ame_note}</p>
                  )}
                </li>
              ))}
            </ul>
            {/* Cột phải */}
            {rightColumnAmenities.length > 0 && (
              <ul className="list-disc pl-5 text-sm">
                {rightColumnAmenities.map((amenity) => (
                  <li key={amenity.ame_id} className="mb-2">
                    <span className="font-medium">{amenity.ame_name}</span> -{' '}
                    <span className="text-red-500">{formatPrice(amenity.ame_price)}</span>
                    <p className="text-gray-600">{amenity.ame_description}</p>
                    {amenity.ame_note && (
                      <p className="text-xs text-gray-500 italic">Ghi chú: {amenity.ame_note}</p>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}

      {/* Container 4: Menu món ăn */}
      {listMenuItems.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-5">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Menu Món Ăn</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {listMenuItems.map((menuItem) => {
              const image = JSON.parse(menuItem.mitems_image);
              const imageUrl = image.image_cloud || 'https://via.placeholder.com/150';

              return (
                <div
                  key={menuItem.mitems_id}
                  className="bg-white rounded-lg shadow-md p-4 flex flex-col gap-2"
                >
                  <div className="relative w-full h-32">
                    <Image
                      src={imageUrl}
                      alt={menuItem.mitems_name}
                      layout="fill"
                      objectFit="cover"
                      className="rounded-lg"
                    />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800">{menuItem.mitems_name}</h3>
                  <p className="text-sm text-red-500">{formatPrice(Number(menuItem.mitems_price))}</p>
                  <p className="text-sm text-gray-600">{menuItem.mitems_description}</p>
                  {menuItem.mitems_note && (
                    <p className="text-sm text-gray-500 italic">Ghi chú: {menuItem.mitems_note}</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}