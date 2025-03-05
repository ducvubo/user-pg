'use client'
import { ChevronLeftIcon, ChevronRightIcon, DoubleArrowLeftIcon, DoubleArrowRightIcon } from '@radix-ui/react-icons'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dispatch, SetStateAction } from 'react'

interface PaginationProps {
  meta: {
    current: number
    pageSize: number
    totalPage: number
    totalItem: number
  }
  pageIndex: number
  pageSize: number
  setPageIndex: Dispatch<SetStateAction<number>>
  setPageSize: Dispatch<SetStateAction<number>>
  defaultRow?: number
}

export function Pagination({ meta, defaultRow, pageIndex, pageSize, setPageIndex, setPageSize }: PaginationProps) {
  return (
    <div className='flex flex-col sm:flex-row items-center justify-between px-1 py-1 space-y-3 sm:space-y-0'>
      {/* <div className='flex flex-wrap items-center justify-center sm:justify-start space-x-2 sm:space-x-4 lg:space-x-6'> */}
        <div className='flex items-center space-x-2'>
          <p className='text-xs sm:text-sm font-medium whitespace-nowrap'>Số bản ghi</p>
          <Select
            value={`${pageSize}`}
            onValueChange={(value) => {
              const newPageSize = Number(value)
              setPageSize(newPageSize)
            }}
          >
            <SelectTrigger className='h-7 sm:h-8 w-[60px] sm:w-[70px]'>
              <SelectValue placeholder={pageSize} />
            </SelectTrigger>
            <SelectContent side='top'>
              {[defaultRow ? defaultRow : null, 10, 20, 30, 40, 50].map((size) => (
                <SelectItem key={size} value={`${size}`}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className='flex w-[90px] sm:w-[100px] items-center justify-center text-xs sm:text-sm font-medium'>
          Trang {pageIndex} của {meta.totalPage}
        </div>
      {/* </div> */}

      <div className='flex items-center space-x-1 sm:space-x-2'>
        <Button
          variant='outline'
          className='hidden sm:flex h-7 sm:h-8 w-7 sm:w-8 p-0'
          onClick={() => setPageIndex(1)}
          disabled={pageIndex === 1}
        >
          <span className='sr-only'>Go to first page</span>
          <DoubleArrowLeftIcon className='h-3 sm:h-4 w-3 sm:w-4' />
        </Button>
        <Button
          variant='outline'
          className='h-7 sm:h-8 w-7 sm:w-8 p-0'
          onClick={() => setPageIndex((old) => Math.max(old - 1, 0))}
          disabled={pageIndex === 1}
        >
          <span className='sr-only'>Go to previous page</span>
          <ChevronLeftIcon className='h-3 sm:h-4 w-3 sm:w-4' />
        </Button>
        <Button
          variant='outline'
          className='h-7 sm:h-8 w-7 sm:w-8 p-0'
          onClick={() => setPageIndex((old) => Math.min(old + 1, meta.totalPage))}
          disabled={pageIndex === meta.totalPage}
        >
          <span className='sr-only'>Go to next page</span>
          <ChevronRightIcon className='h-3 sm:h-4 w-3 sm:w-4' />
        </Button>
        <Button
          variant='outline'
          className='hidden sm:flex h-7 sm:h-8 w-7 sm:w-8 p-0'
          onClick={() => setPageIndex(meta.totalPage)}
          disabled={pageIndex === meta.totalPage}
        >
          <span className='sr-only'>Go to last page</span>
          <DoubleArrowRightIcon className='h-3 sm:h-4 w-3 sm:w-4' />
        </Button>
      </div>
    </div>
  )
}
