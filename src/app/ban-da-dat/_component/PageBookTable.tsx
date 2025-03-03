// 'use client'
// import { ICreateBookTable } from '@/app/nha-hang/api'
// import { Card, CardContent } from '@/components/ui/card'
// import React, { useEffect, useState } from 'react'
// import Image from 'next/image'
// import { format } from 'date-fns'
// import { getListBookTable, guestCancelBookTable } from '../api'
// import { toast } from '@/hooks/use-toast'
// import { Pagination } from '@/components/Pagination'
// import { ca } from 'date-fns/locale'

// const getTextStatus = (status: string) => {
//   switch (status) {
//     case 'WAITING_GUESR':
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

//   const cancelBookTable = async (id: string) => {
//     try {
//       const res: IBackendRes<ICreateBookTable> = await guestCancelBookTable(id)
//       if (res.statusCode === 200 || res.statusCode === 201) {
//         toast({
//           title: 'Thành công',
//           description: 'Hủy đặt bàn thành công',
//           variant: 'default'
//         })
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

//   const findListBookTable = async () => {
//     try {
//       const res: IBackendRes<IModelPaginate<ICreateBookTable>> = await getListBookTable({
//         pageIndex,
//         pageSize,
//         status: '',
//         q: ''
//       })
//       console.log('🚀 ~ findListBookTable ~ res:', res)

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

//   useEffect(() => {
//     findListBookTable()
//   }, [pageIndex, pageSize])

//   return (
//     <div className='px-4 md:px-8 lg:px-[100px]'>
//       <Card className='rounded-none p-0 mt-3'>
//         <CardContent className='p-3 mx-5'>
//           <div className='flex space-x-4 md:space-x-8 lg:space-x-12 overflow-x-auto whitespace-nowrap'>
//             <span className='font-semibold text-sm md:text-base text-gray-800 hover:text-gray-600 cursor-pointer'>
//               Danh sách bàn đã đặt
//             </span>
//             <span className='font-semibold text-sm md:text-base text-gray-800 hover:text-gray-600 cursor-pointer'>
//               Chờ bạn xác nhận
//             </span>
//             <span className='font-semibold text-sm md:text-base text-gray-800 hover:text-gray-600 cursor-pointer'>
//               Chờ nhà hàng xác nhận
//             </span>
//             <span className='font-semibold text-sm md:text-base text-gray-800 hover:text-gray-600 cursor-pointer'>
//               Hoàn thành
//             </span>
//             <span className='font-semibold text-sm md:text-base text-gray-800 hover:text-gray-600 cursor-pointer'>
//               Hủy
//             </span>
//           </div>
//         </CardContent>
//       </Card>

//       <Card className='rounded-none p-0 mt-3'>
//         <CardContent className='p-3 mx-5'>
//           {listTableOrder &&
//             listTableOrder.map((order, index) => (
//               <div
//                 key={index}
//                 className='p-4 border border-gray-200 flex flex-col md:flex-row items-start space-y-4 md:space-y-0 md:space-x-4 mb-4 last:mb-0'
//               >
//                 <div className='w-32 h-32 rounded-md overflow-hidden flex-shrink-0'>
//                   {order.restaurant && (
//                     <Image
//                       src={order.restaurant?.restaurant_banner.image_cloud}
//                       alt='Isushi - Triều Việt Vương'
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
//                   </p>{' '}
//                   <p className='text-sm text-gray-600'>
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
//                   <>
//                     <button className='bg-green-500 text-white px-3 py-1 rounded-md text-sm hover:bg-green-600'>
//                       Xác nhận
//                     </button>
//                     <button
//                       className='bg-red-500 text-white px-3 py-1 rounded-md text-sm hover:bg-red-600'
//                       onClick={() => cancelBookTable(order._id ? order._id : '')}
//                     >
//                       Hủy
//                     </button>
//                   </>
//                 </div>
//               </div>
//             ))}
//         </CardContent>
//       </Card>
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
import { getListBookTable, guestCancelBookTable } from '../api'
import { toast } from '@/hooks/use-toast'
import { Pagination } from '@/components/Pagination'
import { Input } from '@/components/ui/input'
import debounce from 'lodash/debounce' // Đảm bảo cài đặt lodash: npm install lodash

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
  const [selectedStatus, setSelectedStatus] = useState('') // Trạng thái được chọn
  const [searchQuery, setSearchQuery] = useState('') // Từ khóa tìm kiếm

  // Hàm gọi API để lấy danh sách đặt bàn
  const findListBookTable = async () => {
    try {
      const res: IBackendRes<IModelPaginate<ICreateBookTable>> = await getListBookTable({
        pageIndex,
        pageSize,
        status: selectedStatus,
        q: searchQuery
      })
      console.log('🚀 ~ findListBookTable ~ res:', res)

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

  // Debounce cho tìm kiếm
  const debouncedSearch = useCallback(
    debounce((query: string) => {
      setSearchQuery(query)
      setPageIndex(1) // Reset về trang 1 khi tìm kiếm
    }, 500),
    []
  )

  // Xử lý khi người dùng nhập vào input
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    debouncedSearch(e.target.value)
  }

  // Xử lý khi click vào trạng thái
  const handleStatusClick = (status: string) => {
    setSelectedStatus(status)
    setPageIndex(1) // Reset về trang 1 khi thay đổi trạng thái
  }

  // Gọi API khi pageIndex, pageSize, selectedStatus hoặc searchQuery thay đổi
  useEffect(() => {
    findListBookTable()
  }, [pageIndex, pageSize, selectedStatus, searchQuery])

  // Hủy đặt bàn
  const cancelBookTable = async (id: string) => {
    try {
      const res: IBackendRes<ICreateBookTable> = await guestCancelBookTable(id)
      if (res.statusCode === 200 || res.statusCode === 201) {
        toast({
          title: 'Thành công',
          description: 'Hủy đặt bàn thành công',
          variant: 'default'
        })
        // Cập nhật lại danh sách sau khi hủy
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

  return (
    <div className='px-4 md:px-8 lg:px-[100px]'>
      {/* Input tìm kiếm */}
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
                  </p>
                  <p className='text-sm text-gray-600'>
                    Trạng thái: {getTextStatus(order.book_tb_status ? order.book_tb_status : '')}
                  </p>
                </div>

                <div className='flex-1 w-full'>
                  <h3 className='text-base md:text-lg font-semibold text-gray-800'>Tên: {order.book_tb_name}</h3>
                  <p className='text-sm text-gray-600'>Số điện thoại: {order.book_tb_phone}</p>
                  <p className='text-sm text-gray-600'>Số người lớn: {order.book_tb_number_adults}</p>
                  <p className='text-sm text-gray-600'>Số trẻ em: {order.book_tb_number_children}</p>
                  <p className='text-sm text-gray-600'>Ghi chú: {order.book_tb_note}</p>
                </div>

                <div className='flex lg:flex-col gap-2'>
                  {order.book_tb_status === 'WAITING_GUEST' && (
                    <>
                      <button
                        className='bg-green-500 text-white px-3 py-1 rounded-md text-sm hover:bg-green-600'
                        onClick={() => {
                          // Logic xác nhận (nếu có API)
                          toast({
                            title: 'Thông báo',
                            description: 'Chức năng xác nhận chưa được triển khai!',
                            variant: 'default'
                          })
                        }}
                      >
                        Xác nhận
                      </button>
                      <button
                        className='bg-red-500 text-white px-3 py-1 rounded-md text-sm hover:bg-red-600'
                        onClick={() => cancelBookTable(order._id ? order._id : '')}
                      >
                        Hủy
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className='text-center py-4 text-gray-600'>Không có đặt bàn nào.</div>
          )}
        </CardContent>
      </Card>

      {/* Phân trang */}
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
