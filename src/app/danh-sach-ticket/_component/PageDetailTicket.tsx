'use client'
import { useParams } from 'next/navigation'
import React, { useEffect, useRef, useState } from 'react'
import { toast } from '@/hooks/use-toast'
import { deleteCookiesAndRedirect } from '@/app/actions/action'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import EditorTiny from '@/components/EditorTiny'
import { ITicketGuestRestaurant, ITicketGuestRestaurantReplice } from '../ticket.interface'
import { closeTicket, createTicketReplice, getInformationTicket, getTicketReplice } from '../ticket.api'
import { getTextPriority, getTextStatus, getTextType } from './PageListTicket'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { formatDateMongo } from '@/app/utils'

export default function PageDetailTicket() {
  const params = useParams()
  const [ticket, setTicket] = useState<ITicketGuestRestaurant>()
  const [ticketReply, setTicketReply] = useState<ITicketGuestRestaurantReplice[]>()
  const [isReplying, setIsReplying] = useState(false)
  const [replyAttachmentLinks, setReplyAttachmentLinks] = useState<string[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false) // New loading state for reply submission
  const refContent = useRef<any>('')

  const getTicket = async () => {
    const res = await getInformationTicket(params.slug as string)
    console.log('🚀 ~ getTicket ~ res:', res)
    if (res.statusCode === 200) {
      setTicket(res.data)
    } else if (res.code === -10) {
      setTicket(undefined)
      toast({
        title: 'Thông báo',
        description: 'Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại',
        variant: 'destructive'
      })
      await deleteCookiesAndRedirect()
    } else if (res.code === -11) {
      setTicket(undefined)
      toast({
        title: 'Thông báo',
        description: 'Bạn không có quyền thực hiện thao tác này, vui lòng liên hệ quản trị viên để biết thêm chi tiết',
        variant: 'destructive'
      })
    } else {
      setTicket(undefined)
      toast({
        title: 'Thất bại',
        description: 'Đã có lỗi xảy ra, vui lòng thử lại sau',
        variant: 'destructive'
      })
    }
  }

  const getTicketReply = async () => {
    const res = await getTicketReplice(params.slug as string)
    console.log('🚀 ~ getTicketReply ~ res:', res)
    if (res.statusCode === 200) {
      setTicketReply(res.data)
    } else if (res.code === -10) {
      setTicketReply(undefined)
      toast({
        title: 'Thông báo',
        description: 'Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại',
        variant: 'destructive'
      })
      await deleteCookiesAndRedirect()
    } else if (res.code === -11) {
      setTicketReply(undefined)
      toast({
        title: 'Thông báo',
        description: 'Bạn không có quyền thực hiện thao tác này, vui lòng liên hệ quản trị viên để biết thêm chi tiết',
        variant: 'destructive'
      })
    } else {
      setTicketReply(undefined)
      toast({
        title: 'Thất bại',
        description: 'Đã có lỗi xảy ra, vui lòng thử lại sau',
        variant: 'destructive'
      })
    }
  }

  const uploadFile = async (file: File): Promise<IBackendRes<{ link: string }>> => {
    const formData = new FormData()
    formData.append('upload', file)

    const res: IBackendRes<{ link: string }> = await (
      await fetch(`${process.env.NEXT_PUBLIC_URL_CLIENT}/api/file`, {
        method: 'POST',
        headers: {
          folder_type: 'ticket-guest-restaurant'
        },
        body: formData
      })
    ).json()

    return res
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]
      setIsUploading(true)

      const response: any = await uploadFile(file)

      if (response.statusCode === 201 && response.data && response.data.link) {
        setReplyAttachmentLinks((prevLinks) => [...prevLinks, response.data.link])
        toast({
          title: 'Thành công',
          description: 'Tải tệp lên thành công'
        })
        e.target.value = ''
      } else if (response.statusCode === 413) {
        toast({
          title: 'Thất bại',
          description: 'File quá lớn, vui lòng chọn file khác',
          variant: 'destructive'
        })
        e.target.value = ''
      } else {
        toast({
          title: 'Thất bại',
          description: 'Upload file thất bại',
          variant: 'destructive'
        })
        e.target.value = ''
      }
      setIsUploading(false)
    }
  }

  const handleRemoveFile = (index: number) => {
    setReplyAttachmentLinks((prevLinks) => prevLinks.filter((_, i) => i !== index))
  }

  const handleReplySubmit = async () => {
    setIsSubmitting(true) // Start loading
    try {
      const res: IBackendRes<ITicketGuestRestaurantReplice> = await createTicketReplice({
        tkgr_id: params.slug as string,
        tkgr_rp_content: refContent.current.getContent(),
        tkgr_rp_attachment: JSON.stringify(replyAttachmentLinks)
      })

      if (res.statusCode === 201) {
        await getTicketReply()
        refContent.current.setContent('') // Clear editor content
        setReplyAttachmentLinks([])
        setIsReplying(false)
        toast({
          title: 'Thành công',
          description: 'Đã gửi phản hồi thành công'
        })
      } else if (res.code === -10) {
        toast({
          title: 'Thông báo',
          description: 'Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại',
          variant: 'destructive'
        })
        await deleteCookiesAndRedirect()
      } else if (res.code === -11) {
        toast({
          title: 'Thông báo',
          description:
            'Bạn không có quyền thực hiện thao tác này, vui lòng liên hệ quản trị viên để biết thêm chi tiết',
          variant: 'destructive'
        })
      } else {
        toast({
          title: 'Thất bại',
          description: 'Đã có lỗi xảy ra, vui lòng thử lại sau',
          variant: 'destructive'
        })
      }
    } catch (error) {
      toast({
        title: 'Thất bại',
        description: 'Đã có lỗi xảy ra, vui lòng thử lại sau',
        variant: 'destructive'
      })
    } finally {
      setIsSubmitting(false) // Stop loading
    }
  }

  const handleResolvedTicket = async () => {
    const res: IBackendRes<ITicketGuestRestaurant> = await closeTicket(params.slug as string)
    if (res.statusCode === 200 || res.statusCode === 201) {
      getTicket()
      toast({
        title: 'Thành công',
        description: 'Đã giải quyết ticket thành công'
      })
    } else if (res.code === -10) {
      toast({
        title: 'Thông báo',
        description: 'Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại',
        variant: 'destructive'
      })
      await deleteCookiesAndRedirect()
    } else if (res.code === -11) {
      toast({
        title: 'Thông báo',
        description: 'Bạn không có quyền thực hiện thao tác này, vui lòng liên hệ quản trị viên để biết thêm chi tiết',
        variant: 'destructive'
      })
    } else {
      toast({
        title: 'Thất bại',
        description: 'Đã có lỗi xảy ra, vui lòng thử lại sau',
        variant: 'destructive'
      })
    }
  }

  useEffect(() => {
    getTicket()
    getTicketReply()
  }, [params.slug])

  return (
    <section className='px-4 md:px-8 lg:px-[100px] mt-10 h-auto'>
      <Card className='w-full'>
        <CardHeader className='p-4'>
          <CardTitle className='text-lg truncate'>{ticket?.tkgr_title || 'Thông tin ticket'}</CardTitle>
        </CardHeader>
        <CardContent className='p-4 pt-0'>
          {ticket ? (
            <div className='space-y-4'>
              <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-sm'>
                <span className='font-medium truncate'>Email: {ticket.tkgr_user_email}</span>
                <span className='flex items-center gap-1'>
                  Độ ưu tiên:
                  <Badge variant='outline' className='capitalize'>
                    {getTextPriority(ticket.tkgr_priority)}
                  </Badge>
                </span>
                <span className='flex items-center gap-1'>
                  Trạng thái:
                  <Badge variant='outline' className='capitalize'>
                    {getTextStatus(ticket.tkgr_status)}
                  </Badge>
                </span>
                <span className='flex items-center gap-1'>
                  Loại ticker:
                  <Badge variant='outline' className='capitalize'>
                    {getTextType(ticket.tkgr_type)}
                  </Badge>
                </span>
              </div>
              <div className='space-y-1'>
                <div className='text-sm text-muted-foreground'>Nội dung</div>
                <div className='border border-gray-200 rounded p-4'>
                  <div className='prose text-sm' dangerouslySetInnerHTML={{ __html: ticket.tkgr_description }} />
                </div>
              </div>
              <div className='flex flex-col sm:flex-row sm:justify-between gap-4'>
                {ticket.tkgr_attachment && (
                  <div className='space-y-1'>
                    <div className='text-sm text-muted-foreground'>Tệp đính kèm</div>
                    <div className='space-y-2'>
                      {JSON.parse(ticket.tkgr_attachment).map((url: string, index: number) => (
                        <a
                          key={index}
                          href={url}
                          target='_blank'
                          rel='noopener noreferrer'
                          className='text-sm text-blue-600 hover:underline block truncate'
                        >
                          Tệp đính kèm {index + 1}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
                <div className='flex justify-end gap-2 flex-wrap'>
                  <Button
                    disabled={ticket.tkgr_status === 'resolved' || ticket.tkgr_status === 'close'}
                    onClick={handleResolvedTicket}
                    size='sm'
                    variant='outline'
                  >
                    Đóng ticket
                  </Button>
                  <Button
                    disabled={
                      ticket.tkgr_status === 'resolved' ||
                      ticket.tkgr_status === 'close' ||
                      ticket.tkgr_status === 'open'
                    }
                    onClick={() => setIsReplying(true)}
                    size='sm'
                  >
                    Trả lời
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className='text-center text-muted-foreground'>No ticket data available</div>
          )}
        </CardContent>
      </Card>

      {isReplying && (
        <Card className='mt-4 w-full'>
          <CardHeader className='p-4'>
            <CardTitle className='text-lg'>Trả lời Ticket</CardTitle>
          </CardHeader>
          <CardContent className='p-4 pt-0'>
            <div className='space-y-4'>
              <div>
                <div className='text-sm text-muted-foreground mb-1'>Nội dung trả lời</div>
                <EditorTiny editorRef={refContent} height='200px' />
              </div>
              <div>
                <div className='text-sm text-muted-foreground mb-1'>Tệp đính kèm</div>
                <Input type='file' onChange={handleFileChange} className='mt-0' disabled={isUploading} />
                {isUploading && <div className='text-sm text-muted-foreground mt-1'>Đang tải lên...</div>}
                {replyAttachmentLinks.length > 0 && !isUploading && (
                  <div className='mt-2 space-y-2'>
                    {replyAttachmentLinks.map((link, index) => (
                      <div key={index} className='flex items-center gap-2'>
                        <a
                          href={link}
                          target='_blank'
                          rel='noopener noreferrer'
                          className='text-sm text-blue-600 hover:underline truncate max-w-[200px]'
                        >
                          Tệp đính kèm {index + 1}
                        </a>
                        <Button variant='link' className='text-red-600 p-0' onClick={() => handleRemoveFile(index)}>
                          Xóa
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className='flex gap-2 justify-end'>
                <Button
                  disabled={ticket?.tkgr_status === 'resolved' || ticket?.tkgr_status === 'close'}
                  variant='outline'
                  size='sm'
                  onClick={() => setIsReplying(false)}
                >
                  Hủy
                </Button>
                <Button
                  disabled={
                    ticket?.tkgr_status === 'resolved' || ticket?.tkgr_status === 'close' || isUploading || isSubmitting
                  }
                  size='sm'
                  onClick={handleReplySubmit}
                >
                  {isSubmitting ? (
                    <span className='flex items-center gap-2'>
                      <svg
                        className='animate-spin h-5 w-5 text-white'
                        xmlns='http://www.w3.org/2000/svg'
                        fill='none'
                        viewBox='0 0 24 24'
                      >
                        <circle
                          className='opacity-25'
                          cx='12'
                          cy='12'
                          r='10'
                          stroke='currentColor'
                          strokeWidth='房子4'
                        ></circle>
                        <path
                          className='opacity-75'
                          fill='currentColor'
                          d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                        ></path>
                      </svg>
                      Đang gửi...
                    </span>
                  ) : (
                    'Gửi'
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {ticketReply && ticketReply.length > 0 && (
        <div className='mt-4 space-y-4'>
          {ticketReply.map((reply) => (
            <Card key={reply.tkgr_rp_id} className='p-4 w-full'>
              <CardContent className='p-0'>
                <div className='space-y-2'>
                  <div className='flex items-center gap-2'>
                    <Avatar>
                      <AvatarImage
                        src={
                          reply.tkgr_rp_type === 'restaurant'
                            ? 'https://github.com/shadcn.png'
                            : '/api/view-image?bucket=ticket-guest-restaurant&file=1742392233297-0cf361cd-31dc-4fef-8c9e-42995ef9217c.gif'
                        }
                        alt='@shadcn'
                      />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <div className='flex flex-col gap-1'>
                      <span className='text-sm'>{reply.tkgr_rp_type === 'restaurant' ? 'Nhà hàng' : 'Khách hàng'}</span>
                      <span className='text-xs text-muted-foreground'>
                        {formatDateMongo(reply.tkgr_rp_time?.toString() ?? '')}
                      </span>
                    </div>
                  </div>
                  <div className='prose text-sm' dangerouslySetInnerHTML={{ __html: reply.tkgr_rp_content }} />
                  {reply.tkgr_rp_attachment && (
                    <div className='space-y-1'>
                      {JSON.parse(reply.tkgr_rp_attachment).map((url: string, index: number) => (
                        <a
                          key={index}
                          href={url}
                          target='_blank'
                          rel='noopener noreferrer'
                          className='text-sm text-blue-600 hover:underline block truncate'
                        >
                          Tệp đính kèm {index + 1}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </section>
  )
}
