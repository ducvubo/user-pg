'use client'
import { ICreateBookTable } from '@/app/nha-hang/api'
import { Card, CardContent } from '@/components/ui/card'
import React, { useState } from 'react'
import Image from 'next/image'
import { format } from 'date-fns'
interface IProps {
  listTableOrder: IBackendRes<ICreateBookTable[]>
}

export default function PageOrderTable({ listTableOrder }: IProps) {
  return (
    <div className='px-4 md:px-8 lg:px-[100px]'>
      <Card className='rounded-none p-0 mt-3'>
        <CardContent className='p-3 mx-5'>
          <div className='flex space-x-4 md:space-x-8 lg:space-x-12 overflow-x-auto whitespace-nowrap'>
            <span className='font-semibold text-sm md:text-base text-gray-800 hover:text-gray-600 cursor-pointer'>
              Danh sách bàn đã đặt
            </span>
            <span className='font-semibold text-sm md:text-base text-gray-800 hover:text-gray-600 cursor-pointer'>
              Chờ bạn xác nhận
            </span>
            <span className='font-semibold text-sm md:text-base text-gray-800 hover:text-gray-600 cursor-pointer'>
              Chờ nhà hàng xác nhận
            </span>
            <span className='font-semibold text-sm md:text-base text-gray-800 hover:text-gray-600 cursor-pointer'>
              Hoàn thành
            </span>
            <span className='font-semibold text-sm md:text-base text-gray-800 hover:text-gray-600 cursor-pointer'>
              Hủy
            </span>
          </div>
        </CardContent>
      </Card>

      <Card className='rounded-none p-0 mt-3'>
        <CardContent className='p-3 mx-5'>
          {listTableOrder.data &&
            listTableOrder?.data.map((order, index) => (
              <div
                key={index}
                className='p-4 border border-gray-200 flex flex-col md:flex-row items-start space-y-4 md:space-y-0 md:space-x-4 mb-4 last:mb-0'
              >
                <div className='w-32 h-32 rounded-md overflow-hidden flex-shrink-0'>
                  {order.restaurant && (
                    <Image
                      src={order.restaurant?.restaurant_banner.image_cloud}
                      alt='Isushi - Triều Việt Vương'
                      width={100}
                      height={100}
                      className='w-full h-full object-cover'
                    />
                  )}
                </div>

                <div className='flex-1 w-full'>
                  <h3 className='text-base md:text-lg font-semibold text-gray-800'>
                    {order.restaurant?.restaurant_name}
                  </h3>
                  <p className='text-sm text-gray-600'>
                    Địa chỉ: {order.restaurant ? order.restaurant.restaurant_address.address_specific : ''}
                  </p>
                  <p className='text-sm text-gray-600'>
                    Số điện thoại: {order.restaurant ? order.restaurant.restaurant_phone : ''}
                  </p>
                  <p className='text-sm text-gray-600'>
                    Thời gian đến: {order.book_tb_hour} - {format(new Date(order.book_tb_date), 'dd/MM/yyyy')}
                  </p>
                  <p className='text-sm text-gray-600'>
                    Thời gian đặt:{' '}
                    {format(new Date(order.createdAt ? order.createdAt : new Date()), 'HH:mm - dd/MM/yyyy')}
                  </p>{' '}
                  <p className='text-sm text-gray-600'>
                    Trạng thái: {order.book_tb_status ? order.book_tb_status : 'Chờ xác nhận'}
                  </p>
                </div>

                {/* Thông tin người đặt */}
                <div className='flex-1 w-full'>
                  <h3 className='text-base md:text-lg font-semibold text-gray-800'>Tên: {order.book_tb_name}</h3>
                  <p className='text-sm text-gray-600'>Số điện thoại: {order.book_tb_phone}</p>
                  <p className='text-sm text-gray-600'>Số người lớn: {order.book_tb_number_adults}</p>
                  <p className='text-sm text-gray-600'>Số trẻ em: {order.book_tb_number_children}</p>
                  <p className='text-sm text-gray-600'>Ghi chú: {order.book_tb_note}</p>
                </div>
                {/* Nút cập nhật trạng thái */}
                <div className='flex flex-col space-y-2'>
                  <>
                    <button className='bg-green-500 text-white px-3 py-1 rounded-md text-sm hover:bg-green-600'>
                      Xác nhận
                    </button>
                    <button className='bg-red-500 text-white px-3 py-1 rounded-md text-sm hover:bg-red-600'>Hủy</button>
                  </>
                </div>
              </div>
            ))}
        </CardContent>
      </Card>
    </div>
  )
}
