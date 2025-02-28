import React from 'react'
import Image from 'next/image'
import { Input } from '@/components/ui/input'
import { CircleUserRound } from 'lucide-react'
import Link from 'next/link'

export default function Header({
  image
}: {
  image?: {
    image_cloud: string
    image_custom: string
  }
}) {
  return (
    <section className='bg-[#e6624f] h-28 w-full flex items-center justify-between px-[100px]'>
      <Link href='/'>
        <Image src={image ? image?.image_cloud : '/images/logo.webp'} alt='vuducbo' width={220} height={100} />
      </Link>
      <Input className='w-3/5' />
      <div className='flex text-white w-40'>
        <CircleUserRound />
        <span className='font-bold'>Tài khoản</span>
      </div>
    </section>
  )
}
