'use client'

import React, { useEffect, useState, useCallback } from 'react'
import Image from 'next/image'
import { ShoppingBasket, Loader2 } from 'lucide-react'
import Link from 'next/link'
import AddFoodToCart from '@/app/nha-hang/_component/AddFoodToCart'
import { getListRoomPagination } from '../list.room.api'
import { IRoom } from '@/app/nha-hang/api'

export default function PageListFoodRestaurant() {
  const [pageIndex, setPageIndex] = useState(1)
  const [pageSize] = useState(10)
  const [listRoom, setListRoom] = useState<IRoom[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  const [showBackToTop, setShowBackToTop] = useState(false)

  // Kiểm tra thiết bị mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    const handleScrollVisibility = () => {
      setShowBackToTop(window.scrollY > 200)
    }

    window.addEventListener('scroll', handleScrollVisibility)
    return () => window.removeEventListener('scroll', handleScrollVisibility)
  }, [])

  // Hàm gọi API lấy danh sách phòng
  const fetchFoods = async (page: number) => {
    if (!hasMore || isLoading) return

    setIsLoading(true)
    try {
      const res: IBackendRes<IModelPaginate<IRoom>> = await getListRoomPagination(page, pageSize)
      if (res.statusCode === 200 && res.data && res.data.result) {
        setListRoom((prev) => [...prev, ...(res.data as any).result])
        setHasMore(res.data.meta.totalPage > page)
      } else {
        setHasMore(false)
      }
    } catch (error) {
      console.error('Error fetching rooms:', error)
      setHasMore(false)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchFoods(1)
  }, [])

  const handleScroll = useCallback(() => {
    const triggerDistance = isMobile ? 1200 : 500
    if (
      window.innerHeight + document.documentElement.scrollTop >=
      document.documentElement.offsetHeight - triggerDistance &&
      !isLoading &&
      hasMore
    ) {
      setPageIndex(prev => prev + 1)
    }
  }, [isLoading, hasMore, isMobile])

  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  useEffect(() => {
    if (pageIndex > 1) {
      fetchFoods(pageIndex)
    }
  }, [pageIndex])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  // Hàm kiểm tra trạng thái bán hàng
  const getTimeAsDate = (timeString: string) => {
    const [hours, minutes, seconds] = timeString.split(':').map(Number)
    const now = new Date()
    return new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes, seconds)
  }

  const isSelling = (openTime: string, closeTime: string) => {
    const now = new Date()
    const open = getTimeAsDate(openTime)
    const close = getTimeAsDate(closeTime)

    if (close < open) {
      close.setDate(close.getDate() + 1)
    }

    return now >= open && now <= close
  }

  const renderRoomItem = (room: IRoom) => {
    const images = JSON.parse(room.room_images)
    const primaryImage = images[0]?.image_cloud
    return (
      <div
        key={room.room_id}
        className='bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300'
      >
        {primaryImage && (
          <Link href={`/phong/${room.room_id}`} target='_blank'>
            <div className='relative w-full h-48'>
              <Image src={primaryImage} alt={room.room_name} fill className='object-cover' />
            </div>
          </Link>
        )}
        <div className='p-4'>
          <div className='flex justify-between'>
            <Link href={`/phong/${room.room_id}`} target='_blank'>
              <h2 className='text-xl font-semibold text-gray-800 mb-2'>{room.room_name}</h2>
            </Link>
            {/* <AddFoodToCart room_id={room.room_id} /> */}
          </div>
          <Link href={`/phong/${room.room_id}`} target='_blank'>
            <p className='text-gray-600 mb-2'>Giá: {room.room_base_price.toLocaleString('vi-VN')} VNĐ</p>
            {room.room_note && <p className='text-sm text-gray-500 mt-1 italic'>Ghi chú: {room.room_note}</p>}
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className=' px-4 md:px-8 lg:px-[100px] mt-5 py-4'>
      <h1 className='text-3xl font-bold mb-6 text-center'>Danh sách phòng</h1>
      {listRoom.length > 0 ? (
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
          {listRoom.map(room => renderRoomItem(room))}
        </div>
      ) : (
        !isLoading && (
          <div className='text-center py-10'>
            <p>Không tìm thấy phòng nào.</p>
          </div>
        )
      )}
      {isLoading && (
        <div className='flex justify-center py-4'>
          <Loader2 className='animate-spin' />
        </div>
      )}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className='fixed bottom-10 right-10 bg-red-500 text-white p-3 rounded-full shadow-lg hover:bg-red-600 transition-all duration-300 z-50'
          aria-label='Back to top'
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className='h-6 w-6'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M5 15l7-7 7 7'
            />
          </svg>
        </button>
      )}
    </div>
  )
}