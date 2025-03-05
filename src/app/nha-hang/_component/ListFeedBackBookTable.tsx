// 'use client'
// import React, { use, useEffect, useState } from 'react'
// import { getFeedBackBookTable, IBookTableDetail, ICreateBookTable } from '../api'
// import { start } from 'repl'
// import { Pagination } from '@/components/Pagination'

// interface Props {
//   restaurantId: string
// }
// export default function ListFeedBackBookTable({ restaurantId }: Props) {
//   const [listFeedBack, setListFeedBack] = useState<ICreateBookTable[]>([])
//   const [pageSize, setPageSize] = useState(10)
//   const [pageIndex, setPageIndex] = useState(1)
//   const [meta, setMeta] = useState({
//     current: 1,
//     pageSize: 10,
//     totalPage: 0,
//     totalItem: 0
//   })
//   const [start, setStart] = useState(0)

//   const getListFeedBack = async () => {
//     try {
//       const res: IBackendRes<IModelPaginate<ICreateBookTable>> = await getFeedBackBookTable({
//         pageIndex: pageIndex.toString(),
//         pageSize: pageSize.toString(),
//         restaurantId,
//         start
//       })
//       console.log('🚀 ~ getListFeedBack ~ res:', res)
//       if (res.statusCode === 200 && res.data) {
//         setListFeedBack(res.data.result)
//         setMeta({
//           current: res.data.meta.pageIndex,
//           pageSize: res.data.meta.pageSize,
//           totalPage: res.data.meta.totalPage,
//           totalItem: res.data.meta.totalItem
//         })
//         setPageIndex(res.data.meta.pageIndex)
//         setPageSize(res.data.meta.pageSize)
//       } else {
//         setListFeedBack([])
//       }
//     } catch (error) {
//       console.log('error', error)
//     }
//   }

//   useEffect(() => {
//     console.log('object')
//     getListFeedBack()
//   }, [pageIndex, pageSize, start])
//   const renderStars = (rating: number) => {
//     return (
//       <div className='flex'>
//         {[...Array(5)].map((_, index) => (
//           <svg
//             key={index}
//             className={`w-5 h-5 ${index < rating ? 'text-yellow-400' : 'text-gray-300'}`}
//             fill='currentColor'
//             viewBox='0 0 20 20'
//           >
//             <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
//           </svg>
//         ))}
//       </div>
//     )
//   }
//   return (
//     <div>
//       {listFeedBack.map((feedback: ICreateBookTable, index: number) => {
//         return (
//           <div className='bg-white p-2 max-w-md w-full' key={index}>
//             <div className='mb-4'>
//               <h3 className='text-lg font-semibold text-gray-800'>
//                 {feedback.book_tb_feedback}{' '}
//                 <span>{renderStars(feedback.book_tb_star ? feedback.book_tb_star : 0)}</span>
//               </h3>
//               <p className='text-gray-600'>{feedback.book_tb_feedback_restaurant}</p>
//             </div>
//           </div>
//         )
//       })}
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
import * as React from 'react'
import { useEffect, useState } from 'react'
import { getFeedBackBookTable, IBookTableDetail, ICreateBookTable } from '../api'
import { Pagination } from '@/components/Pagination'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'

interface Props {
  restaurantId: string
}

export default function ListFeedBackBookTable({ restaurantId }: Props) {
  const [listFeedBack, setListFeedBack] = useState<ICreateBookTable[]>([])
  const [pageSize, setPageSize] = useState(10)
  const [pageIndex, setPageIndex] = useState(1)
  const [meta, setMeta] = useState({
    current: 1,
    pageSize: 10,
    totalPage: 0,
    totalItem: 0
  })
  const [start, setStart] = useState(0) // This will now be controlled by the Select

  const getListFeedBack = async () => {
    try {
      const res: IBackendRes<IModelPaginate<ICreateBookTable>> = await getFeedBackBookTable({
        pageIndex: pageIndex.toString(),
        pageSize: pageSize.toString(),
        restaurantId,
        start
      })
      console.log('🚀 ~ getListFeedBack ~ res:', res)
      if (res.statusCode === 200 && res.data) {
        setListFeedBack(res.data.result)
        setMeta({
          current: res.data.meta.pageIndex,
          pageSize: res.data.meta.pageSize,
          totalPage: res.data.meta.totalPage,
          totalItem: res.data.meta.totalItem
        })
        setPageIndex(res.data.meta.pageIndex)
        setPageSize(res.data.meta.pageSize)
      } else {
        setListFeedBack([])
      }
    } catch (error) {
      console.log('error', error)
    }
  }

  useEffect(() => {
    console.log('object')
    getListFeedBack()
  }, [pageIndex, pageSize, start])

  const renderStars = (rating: number) => {
    return (
      <div className='flex'>
        {[...Array(5)].map((_, index) => (
          <svg
            key={index}
            className={`w-5 h-5 ${index < rating ? 'text-yellow-400' : 'text-gray-300'}`}
            fill='currentColor'
            viewBox='0 0 20 20'
          >
            <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
          </svg>
        ))}
      </div>
    )
  }

  return (
    <div>
      {/* Add Select component at the top */}
      <div className='mb-4'>
        <Select onValueChange={(value) => setStart(Number(value))} defaultValue={start.toString()}>
          <SelectTrigger className='w-full'>
            <SelectValue placeholder='Filter by stars' />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Chọn đánh giá</SelectLabel>
              <SelectItem value='0'>Tất cả</SelectItem>
              <SelectItem value='1'>Tệ</SelectItem>
              <SelectItem value='2'>Không hài lòng</SelectItem>
              <SelectItem value='3'>Bình thường</SelectItem>
              <SelectItem value='4'>Tốt</SelectItem>
              <SelectItem value='5'>Rất tốt</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {listFeedBack.map((feedback: ICreateBookTable, index: number) => {
        return (
          <div className='bg-white p-2 max-w-md w-full' key={index}>
            <div className='mb-4'>
              <h3 className='text-lg font-semibold text-gray-800'>
                {feedback.book_tb_feedback}{' '}
                <span>{renderStars(feedback.book_tb_star ? feedback.book_tb_star : 0)}</span>
              </h3>
              <p className='text-gray-600'>{feedback.book_tb_feedback_restaurant}</p>
            </div>
          </div>
        )
      })}
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
