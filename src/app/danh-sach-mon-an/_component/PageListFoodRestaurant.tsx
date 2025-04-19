'use client'

import React, { useEffect, useState, useCallback } from 'react'
import Image from 'next/image'
import { IFoodRestaurant } from '@/app/interface/food-restaurant.interface'
import { ShoppingBasket, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { getListFoodPagination } from '../list.food.api'
import AddFoodToCart from '@/app/nha-hang/_component/AddFoodToCart'

export default function PageListFoodRestaurant() {
  const [pageIndex, setPageIndex] = useState(1)
  const [pageSize] = useState(10)
  const [listFoods, setListFoods] = useState<IFoodRestaurant[]>([])
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

  // Hiển thị nút back to top khi scroll
  useEffect(() => {
    const handleScrollVisibility = () => {
      setShowBackToTop(window.scrollY > 200)
    }

    window.addEventListener('scroll', handleScrollVisibility)
    return () => window.removeEventListener('scroll', handleScrollVisibility)
  }, [])

  // Hàm gọi API lấy danh sách món ăn
  const fetchFoods = async (page: number) => {
    if (!hasMore || isLoading) return

    setIsLoading(true)
    try {
      const res: IBackendRes<IModelPaginate<IFoodRestaurant>> = await getListFoodPagination(page, pageSize)
      if (res.statusCode === 200 && res.data && res.data.result) {
        setListFoods((prev) => [...prev, ...(res.data as any).result])
        setHasMore(res.data.meta.totalPage > page)
      } else {
        setHasMore(false)
      }
    } catch (error) {
      console.error('Error fetching foods:', error)
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

  const renderFoodItem = (food: IFoodRestaurant) => {
    const images = JSON.parse(food.food_image)
    const primaryImage = images[0]?.image_cloud
    const sellingStatus = isSelling(food.food_open_time, food.food_close_time)

    return (
      <div
        key={food.food_id}
        className='bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300'
      >
        {primaryImage && (
          <Link href={`/mon-an/${food.food_slug}`} target='_blank'>
            <div className='relative w-full h-48'>
              <Image src={primaryImage} alt={food.food_name} fill className='object-cover' />
            </div>
          </Link>
        )}
        <div className='p-4'>
          <div className='flex justify-between'>
            <Link href={`/mon-an/${food.food_slug}`} target='_blank'>
              <h2 className='text-xl font-semibold text-gray-800 mb-2'>{food.food_name}</h2>
            </Link>
            <AddFoodToCart food_id={food.food_id} />
          </div>
          <Link href={`/mon-an/${food.food_slug}`} target='_blank'>
            <p className='text-gray-600 mb-2'>Giá: {food.food_price.toLocaleString('vi-VN')} VNĐ</p>
            <p className='text-sm text-gray-500'>
              Giờ mở: {food.food_open_time} - {food.food_close_time} {sellingStatus ? '(Đang bán)' : '(Hết giờ)'}
            </p>
            <p className='text-sm mt-1'>
              Trạng thái:{' '}
              <span
                className={food.food_state === 'inStock' && sellingStatus ? 'text-green-600' : 'text-red-600'}
              >
                {food.food_state === 'inStock' && 'Còn hàng'}
                {food.food_state === 'soldOut' && 'Hết hàng'}
                {food.food_state === 'almostOut' && 'Sắp hết hàng'}
              </span>
            </p>
            {food.food_note && <p className='text-sm text-gray-500 mt-1 italic'>Ghi chú: {food.food_note}</p>}
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className='container px-4 md:px-8 lg:px-[100px] mt-5 py-4'>
      <h1 className='text-3xl font-bold mb-6 text-center'>Danh sách món ăn</h1>
      {listFoods.length > 0 ? (
        <div className='grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {listFoods.map(food => renderFoodItem(food))}
        </div>
      ) : (
        !isLoading && (
          <div className='text-center py-10'>
            <p>Không tìm thấy món ăn nào.</p>
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