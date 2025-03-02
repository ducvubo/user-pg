import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { getSysteParameterById } from '../home.api'
import { SystemParameterEnum } from '@/app/utils/ListSystemParameter'

export default async function Navbar() {
  let paraBanner = await getSysteParameterById(SystemParameterEnum.BANNER_HEADER.sys_para_id)
  let paraLogo = await getSysteParameterById(SystemParameterEnum.LOGOHEADER.sys_para_id)
  let dataBanner
  if (paraBanner.statusCode === 200 && paraBanner.data && paraBanner.data.sys_para_value) {
    dataBanner = JSON.parse(paraBanner.data.sys_para_value)
  }
  let dataLogo
  if (paraLogo.statusCode === 200 && paraLogo.data && paraLogo.data.sys_para_value) {
    dataLogo = JSON.parse(paraLogo.data.sys_para_value)
  }

  return (
    <div
      className='relative h-screen bg-cover bg-center'
      style={{ backgroundImage: `url('${dataBanner.image_cloud}')` }}
    >
      <div className='absolute inset-0 bg-black/20 z-0'></div>

      <nav className='relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center px-4 sm:px-6 md:px-8 py-4'>
        <div className='flex items-center'>
          <Image
            src={dataLogo.image_cloud}
            alt='Giồng Giọt Logo'
            width={200}
            height={100}
            className='h-32 w-auto -mt-5'
          />
        </div>

        <div className='flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 md:gap-6 sm:mt-0 -mt-20'>
          <Link href='/ve-ban' className='text-white text-sm sm:text-base md:text-lg hover:text-yellow-300'>
            Về bản
          </Link>
          <Link href='/thuc-don' className='text-white text-sm sm:text-base md:text-lg hover:text-yellow-300'>
            Thực đơn
          </Link>
          <Link href='/tin-tuc-ve-ban' className='text-white text-sm sm:text-base md:text-lg hover:text-yellow-300'>
            Tin tức về bản
          </Link>
          <Link href='/nhip-song-o-ban' className='text-white text-sm sm:text-base md:text-lg hover:text-yellow-300'>
            Nhịp sống ở bản
          </Link>
          <Link href='/dat-ban' className='text-white text-sm sm:text-base md:text-lg hover:text-yellow-300'>
            Đặt bàn
          </Link>
          <div className='flex items-center gap-1'>
            <Link href='/lang/vn' className='text-white text-sm sm:text-base md:text-lg hover:text-yellow-300'>
              VN
            </Link>
            <span className='text-white text-sm sm:text-base md:text-lg'>-</span>
            <Link href='/lang/en' className='text-white text-sm sm:text-base md:text-lg hover:text-yellow-300'>
              EN
            </Link>
          </div>
        </div>
      </nav>
    </div>
  )
}
