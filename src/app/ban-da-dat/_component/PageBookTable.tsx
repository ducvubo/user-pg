// 'use client'
// import { ICreateBookTable } from '@/app/nha-hang/api'
// import { Card, CardContent } from '@/components/ui/card'
// import React, { useEffect, useState, useCallback } from 'react'
// import Image from 'next/image'
// import { format } from 'date-fns'
// import { getListBookTable, guestCancelBookTable, guestExceptionBookTable, guestSendFeedback } from '../api'
// import { toast } from '@/hooks/use-toast'
// import { Pagination } from '@/components/Pagination'
// import { Input } from '@/components/ui/input'
// import debounce from 'lodash/debounce'
// import { Button } from '@/components/ui/button'
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle
// } from '@/components/ui/dialog'
// import { Label } from '@/components/ui/label'

// const getTextStatus = (status: string) => {
//   switch (status) {
//     case 'WAITING_GUEST':
//       return 'Chờ khách hàng xác nhận'
//     case 'GUEST_CANCEL':
//       return 'Khách hàng hủy'
//     case 'EXPRIED_CONFIRM_GUEST':
//       return 'Hết hạn xác nhận của khách hàng'
//     case 'WAITING_RESTAURANT':
//       return 'Chờ nhà hàng xác nhận'
//     case 'RESTAURANT_CANCEL':
//       return 'Nhà hàng hủy'
//     case 'RESTAURANT_CONFIRM':
//       return 'Nhà hàng xác nhận'
//     case 'DONE':
//       return 'Hoàn thành'
//     case 'EXEPTION':
//       return 'Ngoại lệ'
//     default:
//       return ''
//   }
// }

// export default function PageOrderTable() {
//   const [pageSize, setPageSize] = useState(10)
//   const [pageIndex, setPageIndex] = useState(1)
//   const [meta, setMeta] = useState({
//     current: 1,
//     pageSize: 10,
//     totalPage: 0,
//     totalItem: 0
//   })
//   const [listTableOrder, setListTableOrder] = useState<ICreateBookTable[]>([])
//   const [selectedStatus, setSelectedStatus] = useState('')
//   const [searchQuery, setSearchQuery] = useState('')
//   const [dialogOpen, setDialogOpen] = useState(false) // State for dialog visibility
//   const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null) // Track the order being edited
//   const [bookTbNote, setBookTbNote] = useState('') // State for exception note
//   const [bookTbFeedback, setBookTbFeedback] = useState('') // State for feedback note
//   const [bookTbStar, setBookTbStar] = useState<0 | 1 | 2 | 3 | 4 | 5>(0) // State for feedback star

//   const findListBookTable = async () => {
//     try {
//       const res: IBackendRes<IModelPaginate<ICreateBookTable>> = await getListBookTable({
//         pageIndex,
//         pageSize,
//         status: selectedStatus,
//         q: searchQuery
//       })

//       if (res.statusCode === 200 && res.data) {
//         setListTableOrder(res.data.result)
//         setPageIndex(res.data.meta.pageIndex)
//         setPageSize(res.data.meta.pageSize)
//         setMeta({
//           current: res.data.meta.pageIndex,
//           pageSize: res.data.meta.pageSize,
//           totalPage: res.data.meta.totalPage,
//           totalItem: res.data.meta.totalItem
//         })
//       }
//     } catch (error) {
//       console.log('error', error)
//     }
//   }

//   const debouncedSearch = useCallback(
//     debounce((query: string) => {
//       setSearchQuery(query)
//       setPageIndex(1) // Reset về trang 1 khi tìm kiếm
//     }, 500),
//     []
//   )

//   const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     debouncedSearch(e.target.value)
//   }

//   const handleStatusClick = (status: string) => {
//     setSelectedStatus(status)
//     setPageIndex(1)
//   }

//   useEffect(() => {
//     findListBookTable()
//   }, [pageIndex, pageSize, selectedStatus, searchQuery])

//   const cancelBookTable = async (id: string) => {
//     try {
//       const res: IBackendRes<ICreateBookTable> = await guestCancelBookTable(id)
//       if (res.statusCode === 200 || res.statusCode === 201) {
//         toast({
//           title: 'Thành công',
//           description: 'Hủy đặt bàn thành công',
//           variant: 'default'
//         })
//         findListBookTable()
//       } else {
//         toast({
//           title: 'Thất bại',
//           description: 'Hủy đặt bàn thất bại',
//           variant: 'destructive'
//         })
//       }
//     } catch (error) {
//       console.log('error', error)
//     }
//   }

//   const handleExceptionBookTable = async (id: string, note: string) => {
//     try {
//       const res: IBackendRes<ICreateBookTable> = await guestExceptionBookTable(id, note)
//       if (res.statusCode === 200 || res.statusCode === 201) {
//         toast({
//           title: 'Thành công',
//           description: 'Gửi ngoại lệ thành công',
//           variant: 'default'
//         })
//         findListBookTable()
//       } else {
//         toast({
//           title: 'Thất bại',
//           description: 'Gửi ngoại lệ thất bại',
//           variant: 'destructive'
//         })
//       }
//     } catch (error) {
//       console.log('error', error)
//     }
//   }

//   const handleFeedback = async (id: string, feedback: string, star: string) => {
//     try {
//       const res: IBackendRes<ICreateBookTable> = await guestSendFeedback(id, feedback, star)
//       if (res.statusCode === 200 || res.statusCode === 201) {
//         toast({
//           title: 'Thành công',
//           description: 'Gửi phản hồi thành công',
//           variant: 'default'
//         })
//         findListBookTable()
//       } else {
//         toast({
//           title: 'Thất bại',
//           description: 'Gửi phản hồi thất bại',
//           variant: 'destructive'
//         })
//       }
//     } catch (error) {
//       console.log('error', error)
//     }
//   }

//   const openExceptionDialog = (id: string) => {
//     setSelectedOrderId(id)
//     setBookTbNote('') // Reset note when opening dialog
//     setDialogOpen(true)
//   }

//   return (
//     <div className='px-4 md:px-8 lg:px-[100px]'>
//       <div className='mt-3 mb-4'>
//         <Input
//           placeholder='Tìm kiếm đặt bàn...'
//           onChange={handleSearchChange}
//           className='w-full sm:w-1/2 md:w-1/3 lg:w-1/4 mx-auto'
//         />
//       </div>

//       <Card className='rounded-none p-0 mt-3'>
//         <CardContent className='p-3 mx-5'>
//           <div className='flex space-x-4 md:space-x-8 lg:space-x-12 overflow-x-auto whitespace-nowrap'>
//             <span
//               className={`font-semibold text-sm md:text-base cursor-pointer ${
//                 selectedStatus === '' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-800 hover:text-gray-600'
//               }`}
//               onClick={() => handleStatusClick('')}
//             >
//               Danh sách bàn đã đặt
//             </span>
//             <span
//               className={`font-semibold text-sm md:text-base cursor-pointer ${
//                 selectedStatus === 'WAITING_GUEST'
//                   ? 'text-blue-600 border-b-2 border-blue-600'
//                   : 'text-gray-800 hover:text-gray-600'
//               }`}
//               onClick={() => handleStatusClick('WAITING_GUEST')}
//             >
//               Chờ bạn xác nhận
//             </span>
//             <span
//               className={`font-semibold text-sm md:text-base cursor-pointer ${
//                 selectedStatus === 'WAITING_RESTAURANT'
//                   ? 'text-blue-600 border-b-2 border-blue-600'
//                   : 'text-gray-800 hover:text-gray-600'
//               }`}
//               onClick={() => handleStatusClick('WAITING_RESTAURANT')}
//             >
//               Chờ nhà hàng xác nhận
//             </span>
//             <span
//               className={`font-semibold text-sm md:text-base cursor-pointer ${
//                 selectedStatus === 'DONE'
//                   ? 'text-blue-600 border-b-2 border-blue-600'
//                   : 'text-gray-800 hover:text-gray-600'
//               }`}
//               onClick={() => handleStatusClick('DONE')}
//             >
//               Hoàn thành
//             </span>
//             <span
//               className={`font-semibold text-sm md:text-base cursor-pointer ${
//                 selectedStatus === 'GUEST_CANCEL' || selectedStatus === 'RESTAURANT_CANCEL'
//                   ? 'text-blue-600 border-b-2 border-blue-600'
//                   : 'text-gray-800 hover:text-gray-600'
//               }`}
//               onClick={() =>
//                 handleStatusClick(selectedStatus === 'GUEST_CANCEL' ? 'GUEST_CANCEL' : 'RESTAURANT_CANCEL')
//               }
//             >
//               Hủy
//             </span>
//             <span
//               className={`font-semibold text-sm md:text-base cursor-pointer ${
//                 selectedStatus === 'EXEPTION'
//                   ? 'text-blue-600 border-b-2 border-blue-600'
//                   : 'text-gray-800 hover:text-gray-600'
//               }`}
//               onClick={() => handleStatusClick('EXEPTION')}
//             >
//               Ngoại lệ
//             </span>
//           </div>
//         </CardContent>
//       </Card>

//       <Card className='rounded-none p-0 mt-3'>
//         <CardContent className='p-3 mx-5'>
//           {listTableOrder && listTableOrder.length > 0 ? (
//             listTableOrder.map((order, index) => (
//               <div
//                 key={index}
//                 className='p-4 border border-gray-200 flex flex-col md:flex-row items-start space-y-4 md:space-y-0 md:space-x-4 mb-4 last:mb-0'
//               >
//                 <div className='w-32 h-32 rounded-md overflow-hidden flex-shrink-0'>
//                   {order.restaurant && (
//                     <Image
//                       src={order.restaurant?.restaurant_banner.image_cloud}
//                       alt={order.restaurant?.restaurant_name || 'Restaurant'}
//                       width={100}
//                       height={100}
//                       className='w-full h-full object-cover'
//                     />
//                   )}
//                 </div>

//                 <div className='flex-1 w-full'>
//                   <h3 className='text-base md:text-lg font-semibold text-gray-800'>
//                     {order.restaurant?.restaurant_name}
//                   </h3>
//                   <p className='text-sm text-gray-600'>
//                     Địa chỉ: {order.restaurant ? order.restaurant.restaurant_address.address_specific : ''}
//                   </p>
//                   <p className='text-sm text-gray-600'>
//                     Số điện thoại: {order.restaurant ? order.restaurant.restaurant_phone : ''}
//                   </p>
//                   <p className='text-sm text-gray-600'>
//                     Thời gian đến: {order.book_tb_hour} - {format(new Date(order.book_tb_date), 'dd/MM/yyyy')}
//                   </p>
//                   <p className='text-sm text-gray-600'>
//                     Thời gian đặt:{' '}
//                     {format(new Date(order.createdAt ? order.createdAt : new Date()), 'HH:mm - dd/MM/yyyy')}
//                   </p>
//                   <p className='text-sm text-red-500 font-bold'>
//                     Trạng thái: {getTextStatus(order.book_tb_status ? order.book_tb_status : '')}
//                   </p>
//                 </div>

//                 <div className='flex-1 w-full'>
//                   <h3 className='text-base md:text-lg font-semibold text-gray-800'>Tên: {order.book_tb_name}</h3>
//                   <p className='text-sm text-gray-600'>Số điện thoại: {order.book_tb_phone}</p>
//                   <p className='text-sm text-gray-600'>Số người lớn: {order.book_tb_number_adults}</p>
//                   <p className='text-sm text-gray-600'>Số trẻ em: {order.book_tb_number_children}</p>
//                   <p className='text-sm text-gray-600'>Ghi chú: {order.book_tb_note}</p>
//                 </div>

//                 <div className='flex lg:flex-col gap-2'>
//                   {order.book_tb_status === 'WAITING_GUEST' && (
//                     <button
//                       className='bg-red-500 text-white px-3 py-1 rounded-md text-sm hover:bg-red-600'
//                       onClick={() => cancelBookTable(order._id ? order._id : '')}
//                     >
//                       Hủy
//                     </button>
//                   )}
//                   {(order.book_tb_status === 'WAITING_RESTAURANT' || order.book_tb_status === 'RESTAURANT_CONFIRM') && (
//                     <button
//                       className='bg-red-800 text-white px-3 py-1 rounded-md text-sm hover:bg-red-600'
//                       onClick={() => openExceptionDialog(order._id ? order._id : '')}
//                     >
//                       Ngoại lệ
//                     </button>
//                   )}
//                   {order.book_tb_status === 'DONE' && (
//                     <button
//                       className='bg-red-800 text-white px-3 py-1 rounded-md text-sm hover:bg-red-600'
//                       onClick={() => openExceptionDialog(order._id ? order._id : '')}
//                     >
//                       Đánh giá
//                     </button>
//                   )}
//                 </div>
//               </div>
//             ))
//           ) : (
//             <div className='text-center py-4 text-gray-600'>Không có đặt bàn nào.</div>
//           )}
//         </CardContent>
//       </Card>

//       <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>Ghi chú ngoại lệ</DialogTitle>
//             <DialogDescription>Vui lòng nhập lý do cho trạng thái ngoại lệ</DialogDescription>
//           </DialogHeader>
//           <div className='grid gap-4 py-4'>
//             <div className='grid gap-2'>
//               <Label htmlFor='exception-note'>Ghi chú</Label>
//               <Input
//                 id='exception-note'
//                 value={bookTbNote}
//                 onChange={(e) => setBookTbNote(e.target.value)}
//                 placeholder='Nhập ghi chú...'
//               />
//             </div>
//           </div>
//           <DialogFooter>
//             <Button variant='outline' onClick={() => setDialogOpen(false)}>
//               Hủy
//             </Button>
//             <Button
//               onClick={() => {
//                 if (selectedOrderId) {
//                   handleExceptionBookTable(selectedOrderId, bookTbNote)
//                   setDialogOpen(false)
//                   setBookTbNote('') // Reset note after submission
//                 }
//               }}
//               disabled={!bookTbNote.trim()} // Disable if note is empty
//             >
//               Xác nhận
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>

//       <div className='flex justify-center mt-3'>
//         <Pagination
//           meta={meta}
//           pageIndex={pageIndex}
//           pageSize={pageSize}
//           setPageIndex={setPageIndex}
//           setPageSize={setPageSize}
//         />
//       </div>
//     </div>
//   )
// }

'use client'
import { ICreateBookTable } from '@/app/nha-hang/api'
import { Card, CardContent } from '@/components/ui/card'
import React, { useEffect, useState, useCallback } from 'react'
import Image from 'next/image'
import { format } from 'date-fns'
import { getListBookTable, guestCancelBookTable, guestExceptionBookTable, guestSendFeedback } from '../api'
import { toast } from '@/hooks/use-toast'
import { Pagination } from '@/components/Pagination'
import { Input } from '@/components/ui/input'
import debounce from 'lodash/debounce'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const getTextStatus = (status: string) => {
  switch (status) {
    case 'WAITING_GUEST':
      return 'Chờ khách hàng xác nhận'
    case 'GUEST_CANCEL':
      return 'Khách hàng hủy'
    case 'EXPRIED_CONFIRM_GUEST':
      return 'Hết hạn xác nhận của khách hàng'
    case 'WAITING_RESTAURANT':
      return 'Chờ nhà hàng xác nhận'
    case 'RESTAURANT_CANCEL':
      return 'Nhà hàng hủy'
    case 'RESTAURANT_CONFIRM':
      return 'Nhà hàng xác nhận'
    case 'DONE':
      return 'Hoàn thành'
    case 'EXEPTION':
      return 'Ngoại lệ'
    default:
      return ''
  }
}

export default function PageOrderTable() {
  const [pageSize, setPageSize] = useState(10)
  const [pageIndex, setPageIndex] = useState(1)
  const [meta, setMeta] = useState({
    current: 1,
    pageSize: 10,
    totalPage: 0,
    totalItem: 0
  })
  const [listTableOrder, setListTableOrder] = useState<ICreateBookTable[]>([])
  const [selectedStatus, setSelectedStatus] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null)
  const [dialogType, setDialogType] = useState<'exception' | 'feedback' | null>(null) // Track dialog purpose
  const [bookTbNote, setBookTbNote] = useState('')
  const [bookTbFeedback, setBookTbFeedback] = useState('')
  const [bookTbStar, setBookTbStar] = useState<0 | 1 | 2 | 3 | 4 | 5>(0)

  const findListBookTable = async () => {
    try {
      const res: IBackendRes<IModelPaginate<ICreateBookTable>> = await getListBookTable({
        pageIndex,
        pageSize,
        status: selectedStatus,
        q: searchQuery
      })

      if (res.statusCode === 200 && res.data) {
        setListTableOrder(res.data.result)
        setPageIndex(res.data.meta.pageIndex)
        setPageSize(res.data.meta.pageSize)
        setMeta({
          current: res.data.meta.pageIndex,
          pageSize: res.data.meta.pageSize,
          totalPage: res.data.meta.totalPage,
          totalItem: res.data.meta.totalItem
        })
      }
    } catch (error) {
      console.log('error', error)
    }
  }

  const debouncedSearch = useCallback(
    debounce((query: string) => {
      setSearchQuery(query)
      setPageIndex(1)
    }, 500),
    []
  )

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    debouncedSearch(e.target.value)
  }

  const handleStatusClick = (status: string) => {
    setSelectedStatus(status)
    setPageIndex(1)
  }

  useEffect(() => {
    findListBookTable()
  }, [pageIndex, pageSize, selectedStatus, searchQuery])

  const cancelBookTable = async (id: string) => {
    try {
      const res: IBackendRes<ICreateBookTable> = await guestCancelBookTable(id)
      if (res.statusCode === 200 || res.statusCode === 201) {
        toast({
          title: 'Thành công',
          description: 'Hủy đặt bàn thành công',
          variant: 'default'
        })
        findListBookTable()
      } else {
        toast({
          title: 'Thất bại',
          description: 'Hủy đặt bàn thất bại',
          variant: 'destructive'
        })
      }
    } catch (error) {
      console.log('error', error)
    }
  }

  const handleExceptionBookTable = async (id: string, note: string) => {
    try {
      const res: IBackendRes<ICreateBookTable> = await guestExceptionBookTable(id, note)
      if (res.statusCode === 200 || res.statusCode === 201) {
        toast({
          title: 'Thành công',
          description: 'Gửi ngoại lệ thành công',
          variant: 'default'
        })
        findListBookTable()
      } else {
        toast({
          title: 'Thất bại',
          description: 'Gửi ngoại lệ thất bại',
          variant: 'destructive'
        })
      }
    } catch (error) {
      console.log('error', error)
    }
  }

  const handleFeedback = async (id: string, feedback: string, star: string) => {
    try {
      const res: IBackendRes<ICreateBookTable> = await guestSendFeedback(id, feedback, star)
      if (res.statusCode === 200 || res.statusCode === 201) {
        toast({
          title: 'Thành công',
          description: 'Gửi phản hồi thành công',
          variant: 'default'
        })
        findListBookTable()
      } else {
        toast({
          title: 'Thất bại',
          description: 'Gửi phản hồi thất bại',
          variant: 'destructive'
        })
      }
    } catch (error) {
      console.log('error', error)
    }
  }

  const openDialog = (id: string, type: 'exception' | 'feedback') => {
    setSelectedOrderId(id)
    setDialogType(type)
    setBookTbNote('') // Reset exception note
    setBookTbFeedback('') // Reset feedback note
    setBookTbStar(0) // Reset star rating
    setDialogOpen(true)
  }

  const handleDialogSubmit = () => {
    if (!selectedOrderId) return

    if (dialogType === 'exception') {
      handleExceptionBookTable(selectedOrderId, bookTbNote)
    } else if (dialogType === 'feedback') {
      handleFeedback(selectedOrderId, bookTbFeedback, bookTbStar.toString())
    }

    setDialogOpen(false)
    setBookTbNote('')
    setBookTbFeedback('')
    setBookTbStar(0)
  }

  return (
    <div className='px-4 md:px-8 lg:px-[100px]'>
      <div className='mt-3 mb-4'>
        <Input
          placeholder='Tìm kiếm đặt bàn...'
          onChange={handleSearchChange}
          className='w-full sm:w-1/2 md:w-1/3 lg:w-1/4 mx-auto'
        />
      </div>

      <Card className='rounded-none p-0 mt-3'>
        <CardContent className='p-3 mx-5'>
          <div className='flex space-x-4 md:space-x-8 lg:space-x-12 overflow-x-auto whitespace-nowrap'>
            <span
              className={`font-semibold text-sm md:text-base cursor-pointer ${
                selectedStatus === '' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-800 hover:text-gray-600'
              }`}
              onClick={() => handleStatusClick('')}
            >
              Danh sách bàn đã đặt
            </span>
            <span
              className={`font-semibold text-sm md:text-base cursor-pointer ${
                selectedStatus === 'WAITING_GUEST'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-800 hover:text-gray-600'
              }`}
              onClick={() => handleStatusClick('WAITING_GUEST')}
            >
              Chờ bạn xác nhận
            </span>
            <span
              className={`font-semibold text-sm md:text-base cursor-pointer ${
                selectedStatus === 'WAITING_RESTAURANT'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-800 hover:text-gray-600'
              }`}
              onClick={() => handleStatusClick('WAITING_RESTAURANT')}
            >
              Chờ nhà hàng xác nhận
            </span>
            <span
              className={`font-semibold text-sm md:text-base cursor-pointer ${
                selectedStatus === 'DONE'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-800 hover:text-gray-600'
              }`}
              onClick={() => handleStatusClick('DONE')}
            >
              Hoàn thành
            </span>
            <span
              className={`font-semibold text-sm md:text-base cursor-pointer ${
                selectedStatus === 'GUEST_CANCEL' || selectedStatus === 'RESTAURANT_CANCEL'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-800 hover:text-gray-600'
              }`}
              onClick={() =>
                handleStatusClick(selectedStatus === 'GUEST_CANCEL' ? 'GUEST_CANCEL' : 'RESTAURANT_CANCEL')
              }
            >
              Hủy
            </span>
            <span
              className={`font-semibold text-sm md:text-base cursor-pointer ${
                selectedStatus === 'EXEPTION'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-800 hover:text-gray-600'
              }`}
              onClick={() => handleStatusClick('EXEPTION')}
            >
              Ngoại lệ
            </span>
          </div>
        </CardContent>
      </Card>

      <Card className='rounded-none p-0 mt-3'>
        <CardContent className='p-3 mx-5'>
          {listTableOrder && listTableOrder.length > 0 ? (
            listTableOrder.map((order, index) => (
              <div
                key={index}
                className='p-4 border border-gray-200 flex flex-col md:flex-row items-start space-y-4 md:space-y-0 md:space-x-4 mb-4 last:mb-0'
              >
                <div className='w-32 h-32 rounded-md overflow-hidden flex-shrink-0'>
                  {order.restaurant && (
                    <Image
                      src={order.restaurant?.restaurant_banner.image_cloud}
                      alt={order.restaurant?.restaurant_name || 'Restaurant'}
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
                  <p className='text-sm text-gray-600'>Ghi chú: {order.book_tb_note_res}</p>
                  <p className='text-sm text-gray-600'>Trả lời feedback: {order.book_tb_feedback_restaurant}</p>
                  <p className='text-sm text-red-500 font-bold'>
                    Trạng thái: {getTextStatus(order.book_tb_status ? order.book_tb_status : '')}
                  </p>
                </div>

                <div className='flex-1 w-full'>
                  <h3 className='text-base md:text-lg font-semibold text-gray-800'>Tên: {order.book_tb_name}</h3>
                  <p className='text-sm text-gray-600'>Số điện thoại: {order.book_tb_phone}</p>
                  <p className='text-sm text-gray-600'>Số người lớn: {order.book_tb_number_adults}</p>
                  <p className='text-sm text-gray-600'>Số trẻ em: {order.book_tb_number_children}</p>
                  <p className='text-sm text-gray-600'>Ghi chú: {order.book_tb_note}</p>
                  <p className='text-sm text-gray-600'>Sao: {order.book_tb_star}</p>
                  <p className='text-sm text-gray-600'>Đánh giá: {order.book_tb_feedback}</p>
                </div>

                <div className='flex lg:flex-col gap-2'>
                  {order.book_tb_status === 'WAITING_GUEST' && (
                    <button
                      className='bg-red-500 text-white px-3 py-1 rounded-md text-sm hover:bg-red-600'
                      onClick={() => cancelBookTable(order._id ? order._id : '')}
                    >
                      Hủy
                    </button>
                  )}
                  {(order.book_tb_status === 'WAITING_RESTAURANT' || order.book_tb_status === 'RESTAURANT_CONFIRM') && (
                    <button
                      className='bg-red-800 text-white px-3 py-1 rounded-md text-sm hover:bg-red-600'
                      onClick={() => openDialog(order._id ? order._id : '', 'exception')}
                    >
                      Ngoại lệ
                    </button>
                  )}
                  {order.book_tb_status === 'DONE' && order.book_tb_star === null && (
                    <button
                      className='bg-blue-500 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-600'
                      onClick={() => openDialog(order._id ? order._id : '', 'feedback')}
                    >
                      Đánh giá
                    </button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className='text-center py-4 text-gray-600'>Không có đặt bàn nào.</div>
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{dialogType === 'exception' ? 'Ghi chú ngoại lệ' : 'Đánh giá dịch vụ'}</DialogTitle>
            <DialogDescription>
              {dialogType === 'exception'
                ? 'Vui lòng nhập lý do cho trạng thái ngoại lệ'
                : 'Vui lòng nhập phản hồi và đánh giá của bạn'}
            </DialogDescription>
          </DialogHeader>
          <div className='grid gap-4 py-4'>
            {dialogType === 'exception' ? (
              <div className='grid gap-2'>
                <Label htmlFor='exception-note'>Ghi chú</Label>
                <Input
                  id='exception-note'
                  value={bookTbNote}
                  onChange={(e) => setBookTbNote(e.target.value)}
                  placeholder='Nhập ghi chú...'
                />
              </div>
            ) : (
              <>
                <div className='grid gap-2'>
                  <Label htmlFor='feedback-star'>Đánh giá (số sao)</Label>
                  <Select
                    value={bookTbStar.toString()}
                    onValueChange={(value) => setBookTbStar(parseInt(value) as 0 | 1 | 2 | 3 | 4 | 5)}
                  >
                    <SelectTrigger id='feedback-star'>
                      <SelectValue placeholder='Chọn số sao' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='1'>Tệ</SelectItem>
                      <SelectItem value='2'>Không hài lòng</SelectItem>
                      <SelectItem value='3'>Bình thường</SelectItem>
                      <SelectItem value='4'>Tốt</SelectItem>
                      <SelectItem value='5'>Rất tốt</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className='grid gap-2'>
                  <Label htmlFor='feedback-note'>Phản hồi</Label>
                  <Input
                    id='feedback-note'
                    value={bookTbFeedback}
                    onChange={(e) => setBookTbFeedback(e.target.value)}
                    placeholder='Nhập phản hồi của bạn...'
                  />
                </div>
              </>
            )}
          </div>
          <DialogFooter>
            <Button variant='outline' onClick={() => setDialogOpen(false)}>
              Hủy
            </Button>
            <Button
              onClick={handleDialogSubmit}
              disabled={dialogType === 'exception' ? !bookTbNote.trim() : !bookTbFeedback.trim() || bookTbStar === 0}
            >
              Xác nhận
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
