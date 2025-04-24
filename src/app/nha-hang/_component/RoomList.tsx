import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { IRoom } from '../api';

export default function RoomList({ rooms }: { rooms: IRoom[] }) {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Danh Sách Phòng</h1>
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rooms.map((room) => {
          const images = JSON.parse(room.room_images);
          const primaryImage = images[0]?.image_cloud;

          return (
            <div
              key={room.room_id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              {primaryImage && (
                <Link href={`/phong/${room.room_id}`} target="_blank">
                  <div className="relative w-full h-48">
                    <Image src={primaryImage} alt={room.room_name} fill className="object-cover" />
                  </div>
                </Link>
              )}
              <div className="p-4">
                <Link href={`/phong/${room.room_id}`} target="_blank">
                  <h2 className="text-xl font-semibold text-gray-800 mb-2">{room.room_name}</h2>
                </Link>
                <Link href={`/phong/${room.room_id}`} target="_blank">
                  <p className="text-gray-600 mb-2 line-clamp-2">Giá: {room.room_base_price.toLocaleString('vi-VN')} VNĐ</p>
                  <p className="text-gray-600 mb-2 line-clamp-2">Đặt cọc: {room.room_deposit.toLocaleString('vi-VN')} VNĐ</p>
                  <p className="text-sm text-gray-500 line-clamp-2">Diện tích: {room.room_area}</p>
                  <p className="text-sm text-gray-500 line-clamp-2">Sức chứa: {room.room_max_guest} người</p>
                  <p className="text-sm text-gray-500 line-clamp-2">Tiện ích: {room.room_fix_ame}</p>
                  {room.room_description && (
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">Mô tả: {room.room_description}</p>
                  )}
                  {room.room_note && (
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2 italic">Ghi chú: {room.room_note}</p>
                  )}
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}