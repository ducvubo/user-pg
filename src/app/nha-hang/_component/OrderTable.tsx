'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import React, { useEffect, useState } from 'react'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { CalendarIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import DatePicker from 'react-datepicker'
import { IRestaurant } from '@/app/interface/restaurant.interface'
import { Label } from '@/components/ui/label'
import 'react-datepicker/dist/react-datepicker.css'
import { format, isWithinInterval, parse, isToday, getHours, getMinutes, set } from 'date-fns'
import { vi } from 'date-fns/locale'
import { createBookTable, ICreateBookTable } from '../api'
import { toast } from '@/hooks/use-toast'
import { useRouter } from 'next/navigation'

const formSchema = z.object({
  book_tb_email: z.string().email({ message: 'Email không hợp lệ.' }),
  book_tb_phone: z.string().min(10, { message: 'Số điện thoại phải có ít nhất 10 số.' }),
  book_tb_name: z.string().min(2, { message: 'Tên phải có ít nhất 2 ký tự.' }),
  book_tb_number_adults: z.number().int().min(1, { message: 'Số người lớn phải lớn hơn 0.' }),
  book_tb_number_children: z.number().int().min(0, { message: 'Số trẻ em phải lớn hơn hoặc bằng 0.' }),
  book_tb_note: z.string().max(255, { message: 'Ghi chú không được vượt quá 255 ký tự.' })
})

interface IProps {
  restaurant: IRestaurant
}

export default function OrderTable({ restaurant }: IProps) {
  const [open, setOpen] = useState(false)
  const router = useRouter()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      book_tb_email: '',
      book_tb_phone: '',
      book_tb_name: '',
      book_tb_number_adults: 1,
      book_tb_number_children: 0,
      book_tb_note: ''
    }
  })

  const [book_tb_date, setBook_tb_date] = useState<Date | undefined>()
  const [book_tb_hour, setBook_tb_hour] = useState<string>('')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const currentDate = new Date()

  const validateDateTime = () => {
    if (!book_tb_date || !book_tb_hour) {
      setErrorMessage(null)
      return true // Chưa chọn đủ thông tin, không hiển thị lỗi
    }

    // 1. Xác định ngày trong tuần của ngày được chọn
    const selectedDayName = format(book_tb_date, 'EEEE', { locale: vi }) // VD: "Thứ Hai"

    // 2. Lấy tất cả các khung giờ mở cửa của ngày đó
    const schedulesForDay = restaurant.restaurant_hours.filter((schedule) => schedule.day_of_week === selectedDayName)

    // 3. Nếu không có khung giờ mở cửa nào cho ngày đó
    if (schedulesForDay.length === 0) {
      setErrorMessage(`Nhà hàng không mở cửa vào ${selectedDayName}. Vui lòng chọn ngày khác.`)
      return false
    }

    // 4. Kiểm tra giờ được chọn có nằm trong bất kỳ khung giờ mở cửa nào không
    const selectedTime = parse(book_tb_hour, 'HH:mm', new Date())
    const isValidTime = schedulesForDay.some((schedule) => {
      const openTime = parse(schedule.open, 'HH:mm', new Date())
      const closeTime = parse(schedule.close, 'HH:mm', new Date())
      return isWithinInterval(selectedTime, { start: openTime, end: closeTime })
    })

    if (!isValidTime) {
      const timeRanges = schedulesForDay.map((schedule) => `${schedule.open} - ${schedule.close}`).join(' và ')
      setErrorMessage(`Nhà hàng chỉ mở cửa vào ${selectedDayName} từ ${timeRanges}. Vui lòng chọn giờ khác.`)
      return false
    }

    // 5. Nếu là ngày hôm nay, không cho phép chọn giờ trước giờ hiện tại
    if (isToday(book_tb_date)) {
      const selectedHour = getHours(selectedTime)
      const selectedMinute = getMinutes(selectedTime)
      const currentHour = currentDate.getHours()
      const currentMinute = currentDate.getMinutes()

      if (selectedHour < currentHour || (selectedHour === currentHour && selectedMinute < currentMinute)) {
        setErrorMessage('Không thể đặt bàn trước giờ hiện tại. Vui lòng chọn giờ khác.')
        return false
      }
    }

    setErrorMessage(null) // Không có lỗi
    return true
  }

  useEffect(() => {
    validateDateTime()
  }, [book_tb_date, book_tb_hour])

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!validateDateTime()) return
    try {
      if (!book_tb_date || !book_tb_hour) {
        setErrorMessage('Vui lòng chọn ngày và giờ đến.')
        return
      }

      const data: ICreateBookTable = {
        book_tb_email: values.book_tb_email,
        book_tb_hour: book_tb_hour,
        book_tb_name: values.book_tb_name,
        book_tb_note: values.book_tb_note,
        book_tb_date: new Date(book_tb_date),
        //trừ 7 giờ để đúng múi giờ VN
        // book_tb_date: new Date(book_tb_date.setHours(book_tb_date.getHours() - 7)),
        book_tb_number_adults: values.book_tb_number_adults,
        book_tb_number_children: values.book_tb_number_children,
        book_tb_phone: values.book_tb_phone,
        book_tb_redirect_url: process.env.NEXT_PUBLIC_URL_CLIENT + '/xac-nhan-dat-ban',
        book_tb_restaurant_id: restaurant._id
      }

      const res: IBackendRes<ICreateBookTable> = await createBookTable(data)
      if (res.statusCode === 201 || res.statusCode === 200) {
        toast({
          title: 'Thành công',
          description: 'Đặt bàn thành công, vui lòng xác nhận qua email của bạn.',
          variant: 'default'
        })
        setOpen(false)
        form.reset()
        setBook_tb_date(undefined)
        setBook_tb_hour('')
        router.push('/ban-da-dat')
        return
      }
      if (res.statusCode === 400) {
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
        return
      } else {
        toast({
          title: 'Thất bại',
          description: 'Đặt bàn thất bại',
          variant: 'destructive'
        })
      }
    } catch (error) {
      console.error('Lỗi khi gửi form:', error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild className='w-full'>
        <Button variant={'destructive'} className='w-full font-semibold text-xl h-12 '>
          Đặt ngay
        </Button>
      </DialogTrigger>

      <DialogContent className='max-w-[95vw] sm:max-w-[600px] md:max-w-[700px] overflow-y-auto max-h-[95vh] rounded-lg shadow-xl border border-gray-200 bg-white p-6'>
        <DialogHeader className='mb-6'>
          <DialogTitle className=' font-bold text-gray-800'>Nhập thông tin đặt bàn</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-3'>
            <div className='grid grid-cols-1 gap-3 sm:grid-cols-2'>
              <FormField
                control={form.control}
                name='book_tb_email'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-sm font-medium'>Email</FormLabel>
                    <FormControl>
                      <Input placeholder='Nhập email của bạn' type='email' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='book_tb_phone'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-sm font-medium'>Số điện thoại</FormLabel>
                    <FormControl>
                      <Input placeholder='Nhập số điện thoại' type='tel' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name='book_tb_name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-sm font-medium'>Tên</FormLabel>
                  <FormControl>
                    <Input placeholder='Nhập tên của bạn' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className='grid grid-cols-1 gap-3 sm:grid-cols-2'>
              <FormField
                control={form.control}
                name='book_tb_number_adults'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-sm font-medium'>Số người lớn</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Nhập số người lớn'
                        type='number'
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='book_tb_number_children'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-sm font-medium'>Số trẻ em</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Nhập số trẻ em'
                        type='number'
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name='book_tb_note'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-sm font-medium'>Ghi chú</FormLabel>
                  <FormControl>
                    <Input placeholder='Nhập ghi chú' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className='grid grid-cols-1 gap-3 sm:grid-cols-2'>
              <div className='w-full flex flex-col gap-2'>
                <Label className='text-sm font-medium'>Ngày đến</Label>
                <DatePicker
                  selected={book_tb_date}
                  onChange={(date: Date | null) => {
                    if (date) {
                      setBook_tb_date(date)
                    }
                  }}
                  minDate={currentDate}
                  dateFormat="EEEE, dd 'Tháng' MM 'Năm' yyyy"
                  locale={vi}
                  placeholderText='Chọn ngày'
                  className='-mt-[1px]'
                  customInput={<Input />}
                />
                {/* <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={'outline'}
                      className={cn(
                        'w-full justify-start text-left font-normal',
                        !book_tb_date && 'text-muted-foreground'
                      )}
                      onTouchStart={() => {}}
                    >
                      <CalendarIcon className='mr-2 h-4 w-4' />
                      {book_tb_date ? (
                        format(book_tb_date, "EEEE, dd 'Tháng' MM 'Năm' yyyy", { locale: vi })
                      ) : (
                        <span>Chọn ngày</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className='w-auto p-0'>
                    <Calendar
                      mode='single'
                      selected={book_tb_date}
                      onSelect={setBook_tb_date}
                      initialFocus
                      locale={vi}
                      fromDate={currentDate}
                      captionLayout='dropdown'
                      classNames={{
                        day_hidden: 'invisible',
                        dropdown:
                          'px-2 py-1.5 rounded-md bg-popover text-popover-foreground text-sm  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background',
                        caption_dropdowns: 'flex gap-3',
                        vhidden: 'hidden',
                        caption_label: 'hidden'
                      }}
                    />
                  </PopoverContent>
                </Popover> */}
              </div>
              <div className='w-full flex flex-col mt-2 gap-2'>
                <Label className=''>Giờ đến</Label>
                <DatePicker
                  selected={book_tb_hour ? new Date(`1970-01-01T${book_tb_hour}:00`) : null}
                  onChange={(date: Date | null) => {
                    if (date) {
                      setBook_tb_hour(format(date, 'HH:mm'))
                    }
                  }}
                  showTimeSelect
                  showTimeSelectOnly
                  timeIntervals={15}
                  timeCaption='Chọn giờ đến'
                  dateFormat='HH:mm'
                  timeFormat='HH:mm'
                  placeholderText='Chọn giờ'
                  className='-mt-[1px]'
                  customInput={<Input />}
                />
              </div>
            </div>
            {errorMessage && <div className='text-red-500 text-sm mt-2'>{errorMessage}</div>}
            <DialogFooter className='flex gap-4 w-full mt-6'>
              <Button type='submit' disabled={form.formState.isSubmitting} className='w-full'>
                {form.formState.isSubmitting ? 'Đang gửi...' : 'Xác nhận'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
