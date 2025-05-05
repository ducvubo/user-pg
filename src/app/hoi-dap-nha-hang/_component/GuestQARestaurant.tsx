'use client'
import { IRestaurant } from '@/app/interface/restaurant.interface'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { toast } from '@/hooks/use-toast'
import dynamic from 'next/dynamic'
import { guestCreateTicket, IGuestTicket } from '../api'
import { useRouter } from 'next/navigation'

const EditorTiny = dynamic(() => import('@/components/EditorTiny'), { ssr: false })

interface IProps {
  restaurant: IRestaurant
}

export default function GuestQARestaurant({ restaurant }: IProps) {
  const router = useRouter()
  const [email, setEmail] = useState<string>('')
  const [priority, setPriority] = useState<'low' | 'medium' | 'high' | 'urgent'>('medium')
  const [type, setType] = useState<'book_table' | 'order_dish' | 'Q&A' | 'complain' | 'other'>('Q&A')
  const [title, setTitle] = useState<string>('')
  const [fileLinks, setFileLinks] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false) // New loading state
  const refContent = useRef<any>('')

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]
      const response = await uploadFile(file)

      if (response.statusCode === 201 && response.data && response.data.link) {
        setFileLinks((prevLinks: any) => [...prevLinks, response.data?.link])
        e.target.value = ''
        return
      }
      if (response.statusCode === 413) {
        toast({
          title: 'Thất bại',
          description: 'File quá lớn, vui lòng chọn file khác',
          variant: 'destructive'
        })
        e.target.value = ''
        return
      } else {
        toast({
          title: 'Thất bại',
          description: 'Upload file thất bại',
          variant: 'destructive'
        })
        e.target.value = ''
        return
      }
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

  const removeFileLink = (index: number) => {
    setFileLinks((prevLinks) => prevLinks.filter((_, i) => i !== index))
  }

  const confirmTicket = async () => {
    if (!email || !priority || !type || !title || !refContent.current.getContent()) {
      toast({
        title: 'Thất bại',
        description: 'Vui lòng điền đầy đủ thông tin',
        variant: 'destructive'
      })
      return
    }

    setIsLoading(true) // Start loading
    try {
      const res: IBackendRes<IGuestTicket> = await guestCreateTicket({
        tkgr_res_id: restaurant._id,
        tkgr_attachment: JSON.stringify(fileLinks),
        tkgr_description: refContent.current.getContent(),
        tkgr_priority: priority,
        tkgr_title: title,
        tkgr_type: type,
        tkgr_user_email: email
      })

      if (res.statusCode === 201 || res.statusCode === 200) {
        toast({
          title: 'Thành công',
          description: 'Tạo ticket thành công',
          variant: 'default'
        })
        router.push('/danh-sach-ticket')
      } else if (res.statusCode === 400) {
        if (Array.isArray(res.message)) {
          res.message.map((item: string) => {
            toast({
              title: 'Thất bại',
              description: item,
              variant: 'destructive'
            })
          })
        } else {
          toast({
            title: 'Thất bại',
            description: res.message,
            variant: 'destructive'
          })
        }
      } else {
        toast({
          title: 'Thất bại',
          description: 'Tạo ticket thất bại',
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
      setIsLoading(false) // Stop loading
    }
  }

  return (
    <div className='max-w-full mx-auto p-4'>
      <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
        <div className='space-y-2'>
          <Label htmlFor='email'>Email</Label>
          <Input
            type='email'
            id='email'
            placeholder='Email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className='w-full'
          />
        </div>

        <div className='space-y-2'>
          <Label>Độ ưu tiên</Label>
          <Select value={priority} onValueChange={(e: 'low' | 'medium' | 'high' | 'urgent') => setPriority(e)}>
            <SelectTrigger className='w-full'>
              <SelectValue placeholder='Độ ưu tiên' />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value='low'>Thấp</SelectItem>
                <SelectItem value='medium'>Trung bình</SelectItem>
                <SelectItem value='high'>Cao</SelectItem>
                <SelectItem value='urgent'>Khẩn cấp</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className='space-y-2'>
          <Label>Loại yêu cầu</Label>
          <Select
            value={type}
            onValueChange={(e: 'book_table' | 'order_dish' | 'Q&A' | 'complain' | 'other') => setType(e)}
          >
            <SelectTrigger className='w-full'>
              <SelectValue placeholder='Loại câu hỏi' />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value='book_table'>Đặt bàn</SelectItem>
                <SelectItem value='order_dish'>Gọi món</SelectItem>
                <SelectItem value='Q&A'>Hỏi đáp</SelectItem>
                <SelectItem value='complain'>Khiếu nại</SelectItem>
                <SelectItem value='other'>Khác</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className='space-y-2'>
          <Label htmlFor='title'>Tiêu đề</Label>
          <Input
            type='text'
            id='title'
            placeholder='Tiêu đề'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className='w-full'
          />
        </div>
      </div>
      <div className='mt-6 space-y-4'>
        <Label>Tệp đính kèm</Label>
        <div className='flex items-center gap-4'>
          <Input type='file' onChange={handleFileChange} className='w-full md:w-auto' />
        </div>

        {fileLinks.length > 0 && (
          <div className='space-y-2'>
            <p className='text-sm font-medium'>Danh sách file đã upload:</p>
            <ul className='list-disc pl-5 flex flex-col gap-2'>
              {fileLinks.map((link, index) => (
                <li key={index} className='flex items-center justify-between'>
                  <a
                    href={process.env.NEXT_PUBLIC_URL_CLIENT + link}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='text-blue-600 underline'
                  >
                    Tệp đính kèm {index + 1}
                  </a>
                  <Button variant='destructive' size='sm' onClick={() => removeFileLink(index)}>
                    Xóa
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <div className='mt-6 space-y-2'>
        <Label>Nội dung</Label>
        <EditorTiny editorRef={refContent} height='300px' className='w-full' />
      </div>
      <div className='flex justify-center items-center'>
        <Button className='mt-3' onClick={confirmTicket} disabled={isLoading}>
          {isLoading ? (
            <span className='flex items-center gap-2'>
              <svg
                className='animate-spin h-5 w-5 text-white'
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
              >
                <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4'></circle>
                <path
                  className='opacity-75'
                  fill='currentColor'
                  d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                ></path>
              </svg>
              Đang tạo...
            </span>
          ) : (
            'Tạo hỏi đáp'
          )}
        </Button>
      </div>
    </div>
  )
}
