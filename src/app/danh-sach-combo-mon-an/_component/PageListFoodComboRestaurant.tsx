'use client'

import React, { useEffect, useState, useCallback } from 'react'
import Image from 'next/image'
import { Loader2 } from 'lucide-react'
import Link from 'next/link'
import { IComboFood } from '@/app/nha-hang/_component/ComboList'
import AddComboFoodToCart from '@/app/nha-hang/_component/AddComboFoodToCart'
import { getListFoodComboPagination } from '../list.food.combo.api'

export default function PageListFoodComboRestaurant() {
  const [pageIndex, setPageIndex] = useState(1)
  const [pageSize] = useState(10)
  const [listCombos, setListCombos] = useState<IComboFood[]>([])
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

  // Hàm gọi API lấy danh sách combo
  const fetchCombos = async (page: number) => {
    if (!hasMore || isLoading) return

    setIsLoading(true)
    try {
      const res: IBackendRes<IModelPaginate<IComboFood>> = await getListFoodComboPagination(page, pageSize)
      if (res.statusCode === 200 && res.data?.result) {
        setListCombos(prev => [...prev, ...(res.data as any).result])
        setHasMore(res.data.meta.totalPage > page)
      } else {
        setHasMore(false)
      }
    } catch (error) {
      console.error('Error fetching combos:', error)
      setHasMore(false)
    } finally {
      setIsLoading(false)
    }
  }

  // Gọi API lần đầu
  useEffect(() => {
    fetchCombos(1)
  }, [])

  // Xử lý infinite scroll
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

  // Gọi API khi pageIndex thay đổi
  useEffect(() => {
    if (pageIndex > 1) {
      fetchCombos(pageIndex)
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

  // Hàm render từng combo
  const renderComboItem = (combo: IComboFood) => {
    const images = JSON.parse(combo.fcb_image)
    const primaryImage = images.image_cloud
    const sellingStatus = isSelling(combo.fcb_open_time, combo.fcb_close_time)

    return (
      <div
        key={combo.fcb_id}
        className='bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300'
      >
        {primaryImage && (
          <Link href={`/combo-mon-an/${combo.fcb_slug}`} target='_blank'>
            <div className='relative w-full h-48'>
              <Image src={primaryImage} alt={combo.fcb_name} fill className='object-cover' />
            </div>
          </Link>
        )}
        <div className='p-4'>
          <div className='flex justify-between'>
            <Link href={`/combo-mon-an/${combo.fcb_slug}`} target='_blank'>
              <h2 className='text-xl font-semibold text-gray-800 mb-2'>{combo.fcb_name}</h2>
            </Link>
            <AddComboFoodToCart fcb_id={combo.fcb_id} />
          </div>
          <Link href={`/combo-mon-an/${combo.fcb_slug}`} target='_blank'>
            <p className='text-gray-600 mb-2'>Giá: {combo.fcb_price.toLocaleString('vi-VN')} VNĐ</p>
            <p className='text-sm text-gray-500'>
              Giờ mở: {combo.fcb_open_time} - {combo.fcb_close_time} {sellingStatus ? '(Đang bán)' : '(Hết giờ)'}
            </p>
            <p className='text-sm mt-1'>
              Trạng thái:{' '}
              <span
                className={combo.fcb_state === 'inStock' && sellingStatus ? 'text-green-600' : 'text-red-600'}
              >
                {combo.fcb_state === 'inStock' && 'Còn hàng'}
                {combo.fcb_state === 'soldOut' && 'Hết hàng'}
                {combo.fcb_state === 'almostOut' && 'Sắp hết hàng'}
              </span>
            </p>
            {combo.fcb_note && <p className='text-sm text-gray-500 mt-1 italic'>Ghi chú: {combo.fcb_note}</p>}
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className='container px-4 md:px-8 lg:px-[100px] mt-5 py-4'>
      <h1 className='text-3xl font-bold mb-6 text-center'>Combo Ưu Đãi</h1>
      {listCombos.length > 0 ? (
        <div className='grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {listCombos.map(combo => renderComboItem(combo))}
        </div>
      ) : (
        !isLoading && (
          <div className='text-center py-10'>
            <p>Không tìm thấy combo nào.</p>
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