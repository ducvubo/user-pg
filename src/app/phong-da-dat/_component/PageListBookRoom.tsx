'use client'

import React, { useCallback, useEffect, useState } from 'react'
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { CalendarIcon, ChevronDown } from "lucide-react"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { IRestaurant } from '@/app/interface/restaurant.interface'
import { GetRestaurantByIds } from '@/app/home/home.api'
import Link from 'next/link'
import Image from 'next/image'
import { Textarea } from "@/components/ui/textarea"
import { toast } from '@/hooks/use-toast'
import debounce from 'lodash/debounce'
import { useSearchParams } from 'next/navigation'
import { Calendar } from '@/components/ui/calendar'
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from '@/lib/utils'
import { addDays } from 'date-fns'
import { vi } from 'date-fns/locale'
import { Input } from '@/components/ui/input'
import { Pagination } from '@/components/Pagination'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  getListBookRoomGuestPagination,
  guestCancelBookRoom,
  guestFeedbackBookRoom,
  guestComplaintBookRoom,
  guestExceptionBookRoom,
} from '../list.book.room.api'
import { IBookRoom, BookRoomStatus } from '../book.room.interface'

const formatVietnameseDate = (date: Date) => {
  const day = date.getDate()
  const month = date.getMonth() + 1
  const year = date.getFullYear()
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${hours}:${minutes} ${day}/${month}/${year}`
}

export default function PageListBookRoom() {
  const [bookRooms, setBookRooms] = useState<IBookRoom[]>([])
  console.log("🚀 ~ PageListBookRoom ~ bookRooms:", bookRooms)
  const [loading, setLoading] = useState(true)
  const [listRestaurant, setListRestaurant] = useState<IRestaurant[]>([])
  const [feedbackContent, setFeedbackContent] = useState<{ [key: string]: string }>({})
  const [feedbackStar, setFeedbackStar] = useState<{ [key: string]: 1 | 2 | 3 | 4 | 5 }>({})
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false)
  const [cancelReason, setCancelReason] = useState('')
  const [selectedBookRoom, setSelectedBookRoom] = useState<{ bkr_id: string } | null>(null)

  const today = new Date()
  const defaultToDate = new Date()
  defaultToDate.setHours(0, 0, 0, 0)
  defaultToDate.setDate(defaultToDate.getDate() - 10)
  const defaultFromDate = new Date(defaultToDate)
  defaultFromDate.setDate(defaultFromDate.getDate() + 70)
  const [toDate, setToDate] = useState<Date>(defaultToDate)
  const [fromDate, setFromDate] = useState<Date>(defaultFromDate)
  const [pageIndex, setPageIndex] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState<string>('all')
  const [meta, setMeta] = useState<{
    pageIndex: number
    pageSize: number
    totalPage: number
    totalItem: number
  }>({
    pageIndex: 1,
    pageSize: 10,
    totalPage: 1,
    totalItem: 0,
  })
  const searchParam = useSearchParams().get('a')

  const handleSelectFromDate = (date: Date | undefined) => {
    if (date) {
      const newDate = new Date(date)
      newDate.setHours(23)
      newDate.setMinutes(59)
      newDate.setSeconds(0)
      setFromDate(newDate)
    }
  }

  const handleSelectToDate = (date: Date | undefined) => {
    if (date) {
      const newDate = new Date(date)
      newDate.setHours(0)
      newDate.setMinutes(0)
      newDate.setSeconds(0)
      setToDate(newDate)
    }
  }

  const debouncedFindListBookRoom = useCallback(
    debounce(() => {
      fetchBookRooms()
    }, 300),
    [toDate, fromDate, pageIndex, pageSize, query, status]
  )

  useEffect(() => {
    debouncedFindListBookRoom()
    return () => {
      debouncedFindListBookRoom.cancel()
    }
  }, [toDate, fromDate, pageIndex, pageSize, query, status, debouncedFindListBookRoom, searchParam])

  const fetchBookRooms = async () => {
    try {
      const res = await getListBookRoomGuestPagination({
        pageSize,
        pageIndex,
        q: query,
        status,
        toDate,
        fromDate,
      })
      if (res.statusCode === 200 || res.statusCode === 201) {
        if (res.data && res.data.result) {
          setBookRooms(res.data.result)
          setMeta({
            pageIndex: res.data.meta.pageIndex,
            pageSize: res.data.meta.pageSize,
            totalPage: res.data.meta.totalPage,
            totalItem: res.data.meta.totalItem,
          })
          setPageIndex(res.data.meta.pageIndex)
          setPageSize(res.data.meta.pageSize)
          const listIdRestaurant = res.data.result.map((book: IBookRoom) => book.bkr_res_id)
          const resRestaurant = await GetRestaurantByIds(listIdRestaurant)
          if (resRestaurant.statusCode === 201 && resRestaurant.data) {
            setListRestaurant(resRestaurant.data)
          } else {
            setListRestaurant([])
          }
        } else {
          setBookRooms([])
        }
      } else {
        setBookRooms([])
      }
    } catch (error) {
      console.error('Error fetching book rooms:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusVariant = (status: BookRoomStatus) => {
    switch (status) {
      case BookRoomStatus.NEW_CREATED:
      case BookRoomStatus.WAITING_RESTAURANT:
        return 'default'
      case BookRoomStatus.CANCEL_GUEST:
      case BookRoomStatus.CANCEL_RESTAURANT:
      case BookRoomStatus.NO_SHOW:
      case BookRoomStatus.OVERTIME_GUEST:
      case BookRoomStatus.GUEST_EXCEPTION:
      case BookRoomStatus.RESTAURANT_EXCEPTION:
        return 'destructive'
      case BookRoomStatus.GUEST_CHECK_IN:
      case BookRoomStatus.GUEST_CHECK_OUT:
      case BookRoomStatus.DONE_COMPLAINT:
      case BookRoomStatus.RESTAURANT_CONFIRM:
      case BookRoomStatus.RESTAURANT_CONFIRM_PAYMENT:
        return 'secondary'
      default:
        return 'secondary'
    }
  }

  const getTextStatus = (status: BookRoomStatus) => {
    const statusMap: { [key in BookRoomStatus]?: string } = {
      [BookRoomStatus.NEW_CREATED]: 'Mới tạo',
      [BookRoomStatus.OVERTIME_GUEST]: 'Quá hạn xác nhận khách',
      [BookRoomStatus.CANCEL_GUEST]: 'Khách hủy',
      [BookRoomStatus.WAITING_RESTAURANT]: 'Chờ nhà hàng xác nhận',
      [BookRoomStatus.RESTAURANT_CONFIRM_DEPOSIT]: 'Nhà hàng xác nhận đặt cọc',
      [BookRoomStatus.CANCEL_RESTAURANT]: 'Nhà hàng hủy',
      [BookRoomStatus.RESTAURANT_CONFIRM]: 'Nhà hàng xác nhận',
      [BookRoomStatus.GUEST_CHECK_IN]: 'Khách đã check-in',
      [BookRoomStatus.GUEST_CHECK_OUT]: 'Khách đã check-out',
      [BookRoomStatus.GUEST_CHECK_OUT_OVERTIME]: 'Check-out quá giờ',
      [BookRoomStatus.NO_SHOW]: 'Khách không đến',
      [BookRoomStatus.RESTAURANT_REFUND_DEPOSIT]: 'Hoàn cọc đầy đủ',
      [BookRoomStatus.RESTAURANT_REFUND_ONE_THIRD_DEPOSIT]: 'Hoàn 1/3 cọc',
      [BookRoomStatus.RESTAURANT_REFUND_ONE_TWO_DEPOSITE]: 'Hoàn 1/2 cọc',
      [BookRoomStatus.RESTAURANT_NO_DEPOSIT]: 'Không hoàn cọc',
      [BookRoomStatus.IN_USE]: 'Đang sử dụng',
      [BookRoomStatus.RESTAURANT_CONFIRM_PAYMENT]: 'Xác nhận thanh toán',
      [BookRoomStatus.GUEST_COMPLAINT]: 'Khách khiếu nại',
      [BookRoomStatus.DONE_COMPLAINT]: 'Khiếu nại đã giải quyết',
      [BookRoomStatus.RESTAURANT_EXCEPTION]: 'Nhà hàng bất thường',
      [BookRoomStatus.GUEST_EXCEPTION]: 'Khách bất thường',
    }
    return statusMap[status] || status
  }

  const handleCancelBookRoom = async () => {
    if (!selectedBookRoom || !cancelReason.trim()) {
      toast({
        title: 'Lỗi',
        description: 'Vui lòng nhập lý do hủy đặt phòng.',
        variant: 'destructive',
      })
      return
    }

    const res = await guestCancelBookRoom(selectedBookRoom.bkr_id, cancelReason)
    if (res.statusCode === 200) {
      toast({
        title: 'Thành công',
        description: 'Đặt phòng đã được hủy.',
        variant: 'default',
      })
      fetchBookRooms()
      setIsCancelDialogOpen(false)
      setCancelReason('')
      setSelectedBookRoom(null)
    } else {
      toast({
        title: 'Thất bại',
        description: res.message || 'Không thể hủy đặt phòng.',
        variant: 'destructive',
      })
    }
  }

  const openCancelDialog = (bkr_id: string) => {
    setSelectedBookRoom({ bkr_id })
    setIsCancelDialogOpen(true)
  }

  const handleComplaintBookRoom = async (bkr_id: string) => {
    const res = await guestComplaintBookRoom(bkr_id)
    if (res.statusCode === 200) {
      toast({
        title: 'Thành công',
        description: 'Đã gửi khiếu nại.',
        variant: 'default',
      })
      fetchBookRooms()
    } else {
      toast({
        title: 'Thất bại',
        description: res.message || 'Không thể gửi khiếu nại.',
        variant: 'destructive',
      })
    }
  }

  const handleExceptionBookRoom = async (bkr_id: string) => {
    const res = await guestExceptionBookRoom(bkr_id)
    if (res.statusCode === 200) {
      toast({
        title: 'Thành công',
        description: 'Đã báo cáo sự cố.',
        variant: 'default',
      })
      fetchBookRooms()
    } else {
      toast({
        title: 'Thất bại',
        description: res.message || 'Không thể báo cáo sự cố.',
        variant: 'destructive',
      })
    }
  }

  const handleFeedbackBookRoom = async (bkr_id: string) => {
    const content = feedbackContent[bkr_id] || ''
    const star = feedbackStar[bkr_id] || 5

    if (!content.trim()) {
      toast({
        title: 'Lỗi',
        description: 'Vui lòng nhập nội dung phản hồi.',
        variant: 'destructive',
      })
      return
    }

    const res = await guestFeedbackBookRoom(bkr_id, content, star)
    if (res.statusCode === 200) {
      toast({
        title: 'Thành công',
        description: 'Phản hồi đã được gửi.',
        variant: 'default',
      })
      setFeedbackContent((prev) => ({ ...prev, [bkr_id]: '' }))
      setFeedbackStar((prev) => ({ ...prev, [bkr_id]: 5 }))
      fetchBookRooms()
    } else {
      toast({
        title: 'Thất bại',
        description: res.message || 'Không thể gửi phản hồi.',
        variant: 'destructive',
      })
    }
  }

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>
  }

  return (
    <div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8">
      <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6">Danh sách phòng đã đặt</h1>

      <div className="flex flex-col sm:flex-row gap-4 mb-6 flex-wrap">
        <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center w-full sm:w-auto">
          <Label className="mt-2 shrink-0">Từ</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={'outline'}
                className={cn('w-full sm:w-[180px] justify-start text-left font-normal', !toDate && 'text-muted-foreground')}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {toDate ? formatVietnameseDate(toDate) : <span>Chọn ngày</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="flex w-auto flex-col space-y-2 p-2">
              <Select onValueChange={(value) => handleSelectToDate(addDays(new Date(), parseInt(value)))}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn" />
                </SelectTrigger>
                <SelectContent position="popper">
                  <SelectItem value="0">Ngày hôm nay</SelectItem>
                  <SelectItem value="-1">Ngày hôm qua</SelectItem>
                  <SelectItem value="-3">3 ngày trước</SelectItem>
                  <SelectItem value="-7">7 ngày trước</SelectItem>
                </SelectContent>
              </Select>
              <div className="rounded-md border">
                <Calendar mode="single" selected={toDate} onSelect={handleSelectToDate} locale={vi} />
              </div>
            </PopoverContent>
          </Popover>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center w-full sm:w-auto">
          <Label className="mt-2 shrink-0">Đến</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={'outline'}
                className={cn('w-full sm:w-[180px] justify-start text-left font-normal', !fromDate && 'text-muted-foreground')}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {fromDate ? formatVietnameseDate(fromDate) : <span>Chọn ngày</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="flex w-auto flex-col space-y-2 p-2">
              <Select onValueChange={(value) => handleSelectFromDate(addDays(new Date(), parseInt(value)))}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn" />
                </SelectTrigger>
                <SelectContent position="popper">
                  <SelectItem value="0">Ngày hôm nay</SelectItem>
                  <SelectItem value="-1">Ngày hôm qua</SelectItem>
                  <SelectItem value="-3">3 ngày trước</SelectItem>
                  <SelectItem value="-7">7 ngày trước</SelectItem>
                </SelectContent>
              </Select>
              <div className="rounded-md border">
                <Calendar mode="single" selected={fromDate} onSelect={handleSelectFromDate} locale={vi} />
              </div>
            </PopoverContent>
          </Popover>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center w-full sm:w-auto">
          <Label className="mt-2 shrink-0">Tìm kiếm</Label>
          <Input
            placeholder="Nhập từ khóa tìm kiếm..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full sm:w-[200px]"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center w-full sm:w-auto">
          <Label className="mt-2 shrink-0">Trạng thái</Label>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Chọn trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              {Object.values(BookRoomStatus).map((status) => (
                <SelectItem key={status} value={status}>
                  {getTextStatus(status)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4 sm:gap-6">
        {bookRooms.map((bookRoom) => {
          const total = (bookRoom.menuItems?.reduce((sum, item) => sum + (item.mitems_snap_price || 0) * (item.mitems_snap_quantity || 1), 0) || 0) +
            (bookRoom.amenities?.reduce((sum, item) => sum + (item.ame_snap_price || 0) * (item.ame_snap_quantity || 1), 0) || 0) +
            (bookRoom.bkr_base_price || 0)
          const history = bookRoom.bkr_detail_history ? JSON.parse(bookRoom.bkr_detail_history) : []
          const restaurant = listRestaurant.find((res) => res._id === bookRoom.bkr_res_id)

          return (
            <Card key={bookRoom.bkr_id} className="shadow-md">
              <CardContent className="p-4 sm:p-6">
                <Separator className="my-3" />

                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex gap-3 w-full md:w-1/2">
                    <Link
                      href={restaurant?.restaurant_slug ? `/nha-hang/${restaurant.restaurant_slug}` : '/'}
                      className="w-24 h-24 sm:w-28 sm:h-28 rounded-md overflow-hidden flex-shrink-0"
                    >
                      {restaurant && (
                        <Image
                          src={restaurant.restaurant_banner.image_cloud}
                          alt={restaurant.restaurant_name || 'Restaurant'}
                          width={112}
                          height={112}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </Link>
                    <div className="flex-1">
                      <Link href={restaurant?.restaurant_slug ? `/nha-hang/${restaurant.restaurant_slug}` : '/'}>
                        <h3 className="text-base sm:text-lg font-semibold text-gray-800 line-clamp-1">
                          {restaurant?.restaurant_name}
                        </h3>
                      </Link>
                      <p className="text-xs sm:text-sm text-gray-600 line-clamp-1">
                        Địa chỉ: {restaurant ? restaurant.restaurant_address.address_specific : ''}
                      </p>

                      <p className="text-xs sm:text-sm text-gray-600 line-clamp-1">
                        Tên phòng: {bookRoom.room?.room_name || 'Chưa có tên phòng'}
                      </p>
                      <p className="text-xs sm:text-sm text-gray-600 line-clamp-1">
                        Giá cọc: {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(bookRoom.bkr_deposit_price || 0)}
                      </p>
                      <p className="text-xs sm:text-sm text-gray-600 line-clamp-1">
                        Giá cơ bản: {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(bookRoom.bkr_base_price || 0)}
                      </p>


                      <p className="text-xs sm:text-sm text-gray-600 line-clamp-1">
                        Phản hồi: {bookRoom.bkr_reply || 'Chưa có phản hồi'}
                      </p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <p className="text-xs sm:text-sm text-muted-foreground">Trạng thái</p>
                        <Badge variant={getStatusVariant(bookRoom.bkr_status)} className="text-xs sm:text-sm">
                          {getTextStatus(bookRoom.bkr_status)}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-2 w-full md:w-1/2 text-xs sm:text-sm">
                    <div className="flex flex-col sm:flex-row gap-1">
                      <p className="text-muted-foreground shrink-0">Tên người đặt:</p>
                      <p className="font-medium">{bookRoom.bkr_ame} - {bookRoom.bkr_phone}</p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-1">
                      <p className="text-muted-foreground shrink-0">Thời gian đặt:</p>
                      <p className="font-medium">
                        {new Date(bookRoom.bkr_created_at!).toLocaleString('vi-VN')}
                      </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-1">
                      <p className="text-muted-foreground shrink-0">Thời gian sử dụng:</p>
                      <p className="font-medium">
                        {formatVietnameseDate(new Date(bookRoom.bkr_time_start!))} - {formatVietnameseDate(new Date(bookRoom.bkr_time_end!))}
                      </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-1">
                      <p className="text-muted-foreground shrink-0">Ghi chú:</p>
                      <p className="font-medium">{bookRoom.bkr_note || 'Không có'}</p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-1">
                      <p className="text-muted-foreground shrink-0">Feedback:</p>
                      <p className="font-medium">
                        {bookRoom.bkr_star ? `${bookRoom.bkr_star} ⭐` : ''} {bookRoom.bkr_feedback || 'Chưa có phản hồi'}
                      </p>
                    </div>
                  </div>
                </div>

                <Separator className="my-3" />

                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="menu-items">
                    <AccordionTrigger>
                      <div className="flex justify-between items-center w-full text-xs sm:text-sm font-medium">
                        <span>Danh sách món ăn</span>
                        <span>
                          Tổng hóa đơn: {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(total)}
                        </span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4 max-h-[300px] overflow-y-auto">
                        {bookRoom.menuItems?.length ? (
                          bookRoom.menuItems.map((item) => (
                            <div key={item.mitems_snap_id} className="flex gap-3">
                              <Avatar className="h-16 w-16 sm:h-20 sm:w-20 !rounded-md flex-shrink-0">
                                <AvatarImage
                                  src={item.mitems_snap_image ? JSON.parse(item.mitems_snap_image).image_cloud : '/placeholder-image.jpg'}
                                  alt={item.mitems_snap_name}
                                />
                                <AvatarFallback>ITEM</AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <p className="font-medium text-sm sm:text-base line-clamp-1">
                                  {item.mitems_snap_name} - {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format((item.mitems_snap_price || 0) * (item.mitems_snap_quantity || 1))}
                                </p>
                                <p className="text-xs sm:text-sm text-muted-foreground">
                                  Giá: {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.mitems_snap_price || 0)} x {item.mitems_snap_quantity}
                                </p>
                                <p className="text-xs sm:text-sm text-muted-foreground">{item.mitems_snap_note}</p>
                              </div>
                            </div>
                          ))
                        ) : (
                          <p className="text-xs sm:text-sm text-muted-foreground">Không có món ăn nào</p>
                        )}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>

                <Accordion type="single" collapsible className="w-full mt-4">
                  <AccordionItem value="amenities">
                    <AccordionTrigger>
                      <div className="flex justify-between items-center w-full text-xs sm:text-sm font-medium">
                        <span>Danh sách tiện ích</span>
                        {/* <span>
                          Tổng hóa đơn: {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(total)}
                        </span> */}
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4 max-h-[300px] overflow-y-auto">
                        {bookRoom.amenities?.length ? (
                          bookRoom.amenities.map((item) => (
                            <div key={item.ame_snap_id} className="flex gap-3">
                              <div className="flex-1">
                                <p className="font-medium text-sm sm:text-base line-clamp-1">
                                  {item.ame_snap_name} - {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format((item.ame_snap_price || 0) * (item.ame_snap_quantity || 1))}
                                </p>
                                <p className="text-xs sm:text-sm text-muted-foreground">
                                  Giá: {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.ame_snap_price || 0)} x {item.ame_snap_quantity}
                                </p>
                                <p className="text-xs sm:text-sm text-muted-foreground">{item.ame_snap_note}</p>
                                <p className="text-xs sm:text-sm text-muted-foreground">{item.ame_snap_description}</p>
                              </div>
                            </div>
                          ))
                        ) : (
                          <p className="text-xs sm:text-sm text-muted-foreground">Không có tiện ích nào</p>
                        )}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>

                {history.length > 0 && (
                  <>
                    <Separator className="my-3" />
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value="history">
                        <AccordionTrigger>
                          <p className="text-xs sm:text-sm font-medium">Lịch sử đặt phòng</p>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="p-2 max-h-[300px] overflow-y-auto">
                            <div className="relative pl-6 after:absolute after:inset-y-0 after:w-px after:bg-gray-500/20 after:left-0 grid gap-4">
                              {history.map((attr: any, index: number) => (
                                <div className="grid gap-1 text-xs sm:text-sm relative" key={index}>
                                  <div className="aspect-square w-3 bg-gray-900 rounded-full absolute left-0 -translate-x-[29.5px] top-1" />
                                  <div className="font-medium line-clamp-1">
                                    {new Date(attr.time).toLocaleString('vi-VN')} - {attr.type}
                                  </div>
                                  <div className="text-gray-500 line-clamp-2">{attr.description}</div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </>
                )}

                <Separator className="my-3" />

                <div className="flex flex-col gap-4">
                  <div className="flex flex-wrap gap-2">
                    {bookRoom.bkr_status === BookRoomStatus.NEW_CREATED && (
                      <Dialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full sm:w-auto"
                            onClick={() => openCancelDialog(bookRoom.bkr_id!)}
                          >
                            Hủy đặt phòng
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                          <DialogHeader>
                            <DialogTitle>Lý do hủy đặt phòng</DialogTitle>
                            <DialogDescription>
                              Vui lòng nhập lý do bạn muốn hủy đặt phòng này. Lý do sẽ được gửi đến nhà hàng.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <Textarea
                              placeholder="Nhập lý do hủy..."
                              value={cancelReason}
                              onChange={(e) => setCancelReason(e.target.value)}
                              className="min-h-[100px]"
                            />
                          </div>
                          <DialogFooter>
                            <Button
                              variant="outline"
                              onClick={() => {
                                setIsCancelDialogOpen(false)
                                setCancelReason('')
                                setSelectedBookRoom(null)
                              }}
                            >
                              Đóng
                            </Button>
                            <Button onClick={handleCancelBookRoom}>Xác nhận hủy</Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    )}
                    {bookRoom.bkr_status === BookRoomStatus.RESTAURANT_CONFIRM_PAYMENT && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full sm:w-auto"
                        onClick={() => handleComplaintBookRoom(bookRoom.bkr_id!)}
                      >
                        Khiếu nại
                      </Button>
                    )}
                    {[
                      BookRoomStatus.RESTAURANT_CONFIRM,
                      BookRoomStatus.GUEST_CHECK_IN,
                      BookRoomStatus.IN_USE,
                      BookRoomStatus.GUEST_CHECK_OUT,
                    ].includes(bookRoom.bkr_status) && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full sm:w-auto"
                          onClick={() => handleExceptionBookRoom(bookRoom.bkr_id!)}
                        >
                          Báo cáo sự cố
                        </Button>
                      )}
                  </div>

                  {bookRoom.bkr_status === BookRoomStatus.RESTAURANT_CONFIRM_PAYMENT && !bookRoom.bkr_feedback && (
                    <div className="space-y-3">
                      <p className="text-xs sm:text-sm font-medium">Gửi phản hồi</p>
                      <Textarea
                        value={feedbackContent[bookRoom.bkr_id!] || ''}
                        onChange={(e) => setFeedbackContent((prev) => ({ ...prev, [bookRoom.bkr_id!]: e.target.value }))}
                        placeholder="Nhập phản hồi của bạn..."
                      />
                      <div className="flex flex-wrap gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Button
                            key={star}
                            variant={feedbackStar[bookRoom.bkr_id!] === star ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setFeedbackStar((prev) => ({ ...prev, [bookRoom.bkr_id!]: star as 1 | 2 | 3 | 4 | 5 }))}
                          >
                            {star} ⭐
                          </Button>
                        ))}
                      </div>
                      <Button
                        size="sm"
                        onClick={() => handleFeedbackBookRoom(bookRoom.bkr_id!)}
                        className="w-full sm:w-auto"
                      >
                        Gửi phản hồi
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {bookRooms.length === 0 && (
        <div className="text-center py-6 text-muted-foreground text-sm sm:text-base">
          Không có đặt phòng nào
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4">
        <div className="text-xs sm:text-sm text-muted-foreground">
          Số đặt phòng: {bookRooms.length}
        </div>
        <div className="flex justify-center">
          <Pagination
            meta={{
              current: pageIndex,
              pageSize: pageSize,
              totalPage: meta.totalPage,
              totalItem: meta.totalItem,
            }}
            pageIndex={pageIndex}
            pageSize={pageSize}
            setPageIndex={setPageIndex}
            setPageSize={setPageSize}
          />
        </div>
      </div>
    </div>
  )
}