import React from 'react'
import Image from 'next/image'
import { Input } from '@/components/ui/input'
import { CircleUserRound } from 'lucide-react'
import Link from 'next/link'

export default function HeaderPato({
  image
}: {
  image?: {
    image_cloud: string
    image_custom: string
  }
}) {
  return (
    <section className='bg-[#e6624f] h-20 md:h-28 w-full flex items-center justify-between px-4 sm:px-8 md:px-16 lg:px-[100px]'>
      <Link href='/'>
        <Image
          src={image ? image?.image_cloud : '/images/logo.webp'}
          alt='vuducbo'
          width={180}
          height={80}
          className='w-32 sm:w-40 md:w-48 lg:w-[220px] h-auto'
          priority
        />
      </Link>
      <Input className='w-1/2 sm:w-3/5 md:w-2/3 lg:w-3/5 h-10 hidden sm:block' placeholder='Tìm kiếm...' />
      <div className='flex items-center text-white w-auto space-x-2 sm:w-40'>
        <CircleUserRound className='w-6 h-6' />
        <span className='font-bold text-sm sm:text-base'>Tài khoản</span>
      </div>
    </section>
  )
}
