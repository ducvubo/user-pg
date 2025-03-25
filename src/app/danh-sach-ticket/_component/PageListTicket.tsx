'use client'
import React, { useState } from 'react'
import { ITicketGuestRestaurant } from '../ticket.interface'
import { findListTicketGuest } from '../ticket.api'
import { toast } from '@/hooks/use-toast'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { Pagination } from '@/components/Pagination'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
export const getTextStatus = (status?: string) => {
  switch (status) {
    case 'open':
      return 'Mở'
    case 'in_progress':
      return 'Đang xử lý'
    case 'close':
      return 'Đóng'
    case 'resolved':
      return 'Đã giải quyết'
    default:
      return ''
  }
}

export const getTextPriority = (priority?: string) => {
  switch (priority) {
    case 'low':
      return 'Thấp'
    case 'medium':
      return 'Trung bình'
    case 'high':
      return 'Cao'
    case 'urgent':
      return 'Khẩn cấp'
    default:
      return ''
  }
}

export const getTextType = (type?: string) => {
  switch (type) {
    case 'book_table':
      return 'Đặt bàn'
    case 'order_dish':
      return 'Gọi món'
    case 'Q&A':
      return 'Hỏi đáp'
    case 'complain':
      return 'Khiếu nại'
    case 'other':
      return 'Khác'
    default:
      return ''
  }
}

export default function PageListTicket() {
  const [priority, setPriority] = useState<'low' | 'medium' | 'high' | 'urgent' | ''>('')
  const [type, setType] = useState<'book_table' | 'order_dish' | 'Q&A' | 'complain' | 'other' | ''>('')
  const [status, setStatus] = useState<'open' | 'in_progress' | 'close' | 'resolved' | ''>('')
  const [q, setQ] = useState('')
  const [meta, setMeta] = useState({
    current: 1,
    pageSize: 10,
    totalPage: 0,
    totalItem: 0
  })
  const [pageIndex, setPageIndex] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [listTicket, setListTicket] = useState<ITicketGuestRestaurant[]>([])

  const findListTicket = async () => {
    const res = await findListTicketGuest({
      pageIndex: pageIndex,
      pageSize: pageSize,
      q,
      tkgr_priority: priority,
      tkgr_status: status,
      tkgr_type: type,
      tkgr_user_id: 0
    })
    if (res.statusCode === 200 && res.data && res.data.result) {
      setListTicket(res.data.result)
      setMeta({
        current: res.data.meta.pageIndex,
        pageSize: res.data.meta.pageSize,
        totalPage: res.data.meta.totalPage,
        totalItem: res.data.meta.totalItem
      })
      setPageIndex(res.data.meta.pageIndex)
      setPageSize(res.data.meta.pageSize)
    } else if (res.code === -10) {
      setListTicket([])
      toast({
        title: 'Thông báo',
        description: 'Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại',
        variant: 'destructive'
      })
    } else if (res.code === -11) {
      setListTicket([])
      toast({
        title: 'Thông báo',
        description: 'Bạn không có quyền thực hiện thao tác này, vui lòng liên hệ quản trị viên để biết thêm chi tiết',
        variant: 'destructive'
      })
    } else {
      setListTicket([])
      toast({
        title: 'Thất bại',
        description: 'Đã có lỗi xảy ra, vui lòng thử lại sau',
        variant: 'destructive'
      })
    }
  }

  React.useEffect(() => {
    findListTicket()
  }, [pageIndex, pageSize, priority, type, status, q])

  return (
    <div className='px-4 md:px-8 lg:px-[100px] mt-10 h-auto'>
      {/* Filter Section */}
      <div className='mb-6'>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
          {/* Status Filter */}
          <div>
            <label className='text-sm font-medium mb-1 block'>Trạng thái</label>
            <Select value={status} onValueChange={(e: any) => setStatus(e)}>
              <SelectTrigger className='w-full'>
                <SelectValue placeholder='Chọn trạng thái' />
              </SelectTrigger>
              <SelectContent>
                {/* <SelectItem value=''>Tất cả</SelectItem> */}
                <SelectItem value='open'>Mở</SelectItem>
                <SelectItem value='in_progress'>Đang xử lý</SelectItem>
                <SelectItem value='close'>Đóng</SelectItem>
                <SelectItem value='resolved'>Đã giải quyết</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Priority Filter */}
          <div>
            <label className='text-sm font-medium mb-1 block'>Độ ưu tiên</label>
            <Select value={priority} onValueChange={(e: any) => setPriority(e)}>
              <SelectTrigger className='w-full'>
                <SelectValue placeholder='Chọn độ ưu tiên' />
              </SelectTrigger>
              <SelectContent>
                {/* <SelectItem value=''>Tất cả</SelectItem> */}
                <SelectItem value='low'>Thấp</SelectItem>
                <SelectItem value='medium'>Trung bình</SelectItem>
                <SelectItem value='high'>Cao</SelectItem>
                <SelectItem value='urgent'>Khẩn cấp</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Type Filter */}
          <div>
            <label className='text-sm font-medium mb-1 block'>Loại</label>
            <Select value={type} onValueChange={(e: any) => setType(e)}>
              <SelectTrigger className='w-full'>
                <SelectValue placeholder='Chọn loại' />
              </SelectTrigger>
              <SelectContent>
                {/* <SelectItem value=''>Tất cả</SelectItem> */}
                <SelectItem value='book_table'>Đặt bàn</SelectItem>
                <SelectItem value='order_dish'>Gọi món</SelectItem>
                <SelectItem value='Q&A'>Hỏi đáp</SelectItem>
                <SelectItem value='complain'>Khiếu nại</SelectItem>
                <SelectItem value='other'>Khác</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Search Input */}
          <div>
            <label className='text-sm font-medium mb-1 block'>Tìm kiếm</label>
            <input
              type='text'
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder='Tìm kiếm ticket...'
              className='w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
            />
          </div>
        </div>
      </div>

      {/* Ticket List */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
        {listTicket.map((ticket, index) => (
          <Card className='w-full shadow-sm' key={index}>
            <CardHeader className='p-3'>
              <CardTitle className='text-base truncate'>{ticket?.tkgr_title || 'Ticket Details'}</CardTitle>
            </CardHeader>
            <CardContent className='p-3 pt-0'>
              {ticket ? (
                <div className='space-y-2'>
                  <div className='grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs'>
                    <span className='font-medium truncate'>Email: {ticket.tkgr_user_email}</span>
                    <span className='flex items-center gap-1'>
                      Độ ưu tiên:
                      <Badge variant='outline' className='text-xs'>
                        {getTextPriority(ticket.tkgr_priority)}
                      </Badge>
                    </span>
                    <span className='flex items-center gap-1'>
                      Trạng thái:
                      <Badge variant='outline' className='text-xs'>
                        {getTextStatus(ticket.tkgr_status)}
                      </Badge>
                    </span>
                    <span className='flex items-center gap-1'>
                      Loại:
                      <Badge variant='outline' className='text-xs'>
                        {getTextType(ticket.tkgr_type)}
                      </Badge>
                    </span>
                  </div>
                  <div className='space-y-1'>
                    <div className='text-xs text-muted-foreground'>Nội dung</div>
                    <div className='border rounded p-2 text-xs max-h-20 overflow-y-auto'>
                      <div className='prose prose-sm' dangerouslySetInnerHTML={{ __html: ticket.tkgr_description }} />
                    </div>
                  </div>
                  {ticket.tkgr_attachment && (
                    <div className='space-y-1'>
                      <div className='text-xs text-muted-foreground'>Tệp đính kèm</div>
                      <a
                        href={JSON.parse(ticket.tkgr_attachment)[0]}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='text-xs text-blue-600 hover:underline block truncate'
                      >
                        Tệp đính kèm 1
                      </a>
                    </div>
                  )}
                  <div className='flex justify-end gap-2 mt-2 flex-wrap'>
                    <Link href={`/danh-sach-ticket/${ticket.tkgr_id}`}>
                      <Button
                        disabled={ticket.tkgr_status === 'resolved' || ticket.tkgr_status === 'close'}
                        size='sm'
                        className='text-xs py-1 px-2 h-7'
                      >
                        Xem chi tiết
                      </Button>
                    </Link>
                  </div>
                </div>
              ) : (
                <span className='text-center text-xs text-muted-foreground block'>No ticket data available</span>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      <div className='flex justify-center mt-3'>
        <Pagination
          meta={meta}
          pageIndex={pageIndex}
          pageSize={pageSize}
          setPageIndex={setPageIndex}
          setPageSize={setPageSize}
        />
      </div>
    </div>
  )
}
