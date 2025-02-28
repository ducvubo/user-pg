// 'use client'

import { Search } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { getAllCategoryName, getRestaurantTypes, ICategory } from '../actions/home.api'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import Link from 'next/link'

export default async function SearchRestaurant() {
  const listProvince = await fetch('https://esgoo.net/api-tinhthanh/1/0.htm').then((res) => res.json())

  return (
    <div className='px-1 mt-5'>
      <div className='flex justify-between items-center'>
        <div className='flex flex-col gap-1'>
          <Label className='font-semibold text-3xl px-2'>Tìm kiếm nâng cao</Label>
          <Label className='text-sm px-2'>Tìm kiếm nhà hàng phù hợp với nhu cầu của bạn</Label>
        </div>
      </div>
      <hr className='my-3 mx-2 font-semibold' />

      <div className='w-full rounded-xl bg-[#E85D4C] p-4'>
        <div className='flex flex-col gap-2 md:flex-row md:items-center md:gap-4'>
          <Select>
            <SelectTrigger className='h-10 !rounded-3xl w-full min-w-[200px] bg-[#E85D4C] text-white border-white/20 focus:ring-white'>
              <SelectValue placeholder='Tỉnh / Thành phố' />
            </SelectTrigger>
            <SelectContent>
              {listProvince.data.map((province: any) => (
                <SelectItem key={province.id} value={province.id}>
                  {province.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            placeholder='Nhập địa chỉ...'
            className='h-10 !rounded-3xl w-full min-w-[200px] bg-[#E85D4C] text-white border-white/20 focus-visible:border-white focus-visible:ring-0  placeholder:text-white'
          />

          <Select>
            <SelectTrigger className='h-10 !rounded-3xl w-full min-w-[200px] bg-[#E85D4C] text-white border-white/20 focus:ring-white'>
              <SelectValue placeholder='Khoảng giá' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='low'>Dưới 100.000đ</SelectItem>
              <SelectItem value='medium'>100.000đ - 200.000đ</SelectItem>
              <SelectItem value='high'>Trên 200.000đ</SelectItem>
            </SelectContent>
          </Select>

          <Select>
            <SelectTrigger className='h-10 !rounded-3xl w-full min-w-[200px] bg-[#E85D4C] text-white border-white/20 focus:ring-white'>
              <SelectValue placeholder='Loại hình ẩm thực' />
            </SelectTrigger>
            <SelectContent></SelectContent>
          </Select>

          <Select>
            <SelectTrigger className='h-10 !rounded-3xl w-full min-w-[200px] bg-[#E85D4C] text-white border-white/20 focus:ring-white'>
              <SelectValue placeholder='Loại hình phục vụ' />
            </SelectTrigger>
            <SelectContent></SelectContent>
          </Select>

          <div className=' flex-1'>
            <Button variant={'outline'} className='text-red-500 font-semibold hover:text-red-500 rounded-3xl'>
              <Search className='mt-4 h-4 w-4 -translate-y-1/2 transform text-red-500' />
              Tìm kiếm nhanh
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
