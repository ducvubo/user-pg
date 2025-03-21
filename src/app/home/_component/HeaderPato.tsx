import React from 'react'
import Image from 'next/image'
import { CircleUserRound, Menu } from 'lucide-react'
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
    <nav className='flex items-center justify-between px-4 md:px-8 lg:px-[100px] bg-[#e6624f] shadow-md h-20'>
      <Link href='/'>
        <Image
          src={image ? image?.image_cloud : '/images/logo.webp'}
          alt='vuducbo'
          width={180}
          height={40}
          className='w-32 sm:w-40 md:w-48 lg:w-[220px]'
          priority
        />
      </Link>

      <div className='md:hidden relative group'>
        <button className='text-white focus:outline-none'>
          <Menu size={24} />
        </button>

        <ul className='absolute -right-4 w-48 bg-[#e6624f] p-4 space-y-4 text-white z-20 hidden group-hover:block group-focus-within:block md:hidden'>
          <li>
            <a href='#' className='font-semibold hover:text-gray-200 block'>
              Gần bạn
            </a>
          </li>
          <li>
            <a href='#' className='font-semibold hover:text-gray-200 block'>
              Bộ sưu tập
            </a>
          </li>
          <li className='relative group/sub'>
            <a href='#' className='font-semibold flex items-center hover:text-gray-200'>
              Ẩm thực <span className='ml-1'>▼</span>
            </a>
            <ul className='mt-2 bg-white shadow-lg rounded-md p-2 w-full hidden group-hover/sub:block'>
              <li>
                <a href='#' className='block px-4 py-2 hover:bg-gray-100 text-black'>
                  Đồ uống
                </a>
              </li>
              <li>
                <a href='#' className='block px-4 py-2 hover:bg-gray-100 text-black'>
                  Bánh & Tráng miệng
                </a>
              </li>
              <li>
                <a href='#' className='block px-4 py-2 hover:bg-gray-100 text-black'>
                  Trái cây
                </a>
              </li>
            </ul>
          </li>
          <li className='relative group/sub'>
            <a href='#' className='font-semibold flex items-center hover:text-gray-200'>
              Nhánh hàng uy tín <span className='ml-1'>▼</span>
            </a>
            <ul className='mt-2 bg-white shadow-lg rounded-md p-2 w-full hidden group-hover/sub:block'>
              <li>
                <a href='#' className='block px-4 py-2 hover:bg-gray-100 text-black'>
                  Nhà hàng 5 sao
                </a>
              </li>
              <li>
                <a href='#' className='block px-4 py-2 hover:bg-gray-100 text-black'>
                  Nhà hàng cao cấp
                </a>
              </li>
            </ul>
          </li>
          <li>
            <a href='#' className='font-semibold hover:text-gray-200 block'>
              Ưu đãi hot
            </a>
          </li>
          <li>
            <a href='#' className='font-semibold hover:text-gray-200 block'>
              Mới nhất
            </a>
          </li>
          <li className='relative group/sub'>
            <a href='#' className='font-semibold flex items-center hover:text-gray-200'>
              Tin tức & Blog <span className='ml-1'>▼</span>
            </a>
            <ul className='mt-2 bg-white shadow-lg rounded-md p-2 w-full hidden group-hover/sub:block'>
              <li>
                <a href='#' className='block px-4 py-2 hover:bg-gray-100 text-black'>
                  Tin tức ẩm thực
                </a>
              </li>
              <li>
                <a href='#' className='block px-4 py-2 hover:bg-gray-100 text-black'>
                  Blog du lịch
                </a>
              </li>
            </ul>
          </li>
          <li className='relative group/sub'>
            <a href='#' className='font-semibold flex items-center hover:text-gray-200'>
              Video Pato <span className='ml-1'>▼</span>
            </a>
            <ul className='mt-2 bg-white shadow-lg rounded-md p-2 w-full hidden group-hover/sub:block'>
              <li>
                <a href='#' className='block px-4 py-2 hover:bg-gray-100 text-black'>
                  Review nhà hàng
                </a>
              </li>
              <li>
                <a href='#' className='block px-4 py-2 hover:bg-gray-100 text-black'>
                  Hướng dẫn đặt bàn
                </a>
              </li>
            </ul>
          </li>
          <li className='relative group/sub'>
            <a href='#' className='font-semibold flex items-center hover:text-gray-200'>
              Tài khoản <span className='ml-1'>▼</span>
            </a>
            <ul className='mt-2 bg-white shadow-lg rounded-md p-2 w-full hidden group-hover/sub:block'>
              <li>
                <Link href='/login'>
                  <span className='block px-4 py-2 hover:bg-gray-100 text-black'>Đăng nhập</span>
                </Link>
              </li>
              <li>
                <Link href='/register'>
                  <span className='block px-4 py-2 hover:bg-gray-100 text-black'>Đăng ký</span>
                </Link>
              </li>
              <li>
                <Link href='/ban-da-dat'>
                  <span className='block px-4 py-2 hover:bg-gray-100 text-black'>Bàn đã đặt</span>
                </Link>
              </li>
              <li>
                <Link href='/danh-sach-ticket'>
                  <span className='block px-4 py-2 hover:bg-gray-100 text-black'>Ticket</span>
                </Link>
              </li>
              <li>
                <Link href='/ket-noi-nha-hang'>
                  <span className='block px-4 py-2 hover:bg-gray-100 text-black text-center'>Kết nối</span>
                </Link>
              </li>
            </ul>
          </li>
        </ul>
      </div>

      <ul className='hidden md:flex space-x-6 text-white'>
        <li>
          <a href='#' className='font-semibold hover:text-gray-200'>
            Gần bạn
          </a>
        </li>
        <li>
          <a href='#' className='font-semibold hover:text-gray-200'>
            Bộ sưu tập
          </a>
        </li>
        <li className='relative group'>
          <a href='#' className='font-semibold flex items-center hover:text-gray-200'>
            Ẩm thực <span className='ml-1'>▼</span>
          </a>
          <ul className='absolute z-10 hidden group-hover:block bg-white shadow-lg rounded-md p-2 w-48'>
            <li>
              <a href='#' className='block px-4 py-2 hover:bg-gray-100 text-black'>
                Đồ uống
              </a>
            </li>
            <li>
              <a href='#' className='block px-4 py-2 hover:bg-gray-100 text-black'>
                Bánh & Tráng miệng
              </a>
            </li>
            <li>
              <a href='#' className='block px-4 py-2 hover:bg-gray-100 text-black'>
                Trái cây
              </a>
            </li>
          </ul>
        </li>
        <li className='relative group'>
          <a href='#' className='font-semibold flex items-center hover:text-gray-200'>
            Nhánh hàng uy tín <span className='ml-1'>▼</span>
          </a>
          <ul className='absolute z-10 hidden group-hover:block bg-white shadow-lg rounded-md p-2 w-48'>
            <li>
              <a href='#' className='block px-4 py-2 hover:bg-gray-100 text-black'>
                Nhà hàng 5 sao
              </a>
            </li>
            <li>
              <a href='#' className='block px-4 py-2 hover:bg-gray-100 text-black'>
                Nhà hàng cao cấp
              </a>
            </li>
          </ul>
        </li>
        <li>
          <a href='#' className='font-semibold hover:text-gray-200'>
            Ưu đãi hot
          </a>
        </li>
        <li>
          <a href='#' className='font-semibold hover:text-gray-200'>
            Mới nhất
          </a>
        </li>
        <li className='relative group'>
          <a href='#' className='font-semibold flex items-center hover:text-gray-200'>
            Tin tức & Blog <span className='ml-1'>▼</span>
          </a>
          <ul className='absolute z-10 hidden group-hover:block bg-white shadow-lg rounded-md p-2 w-48'>
            <li>
              <a href='#' className='block px-4 py-2 hover:bg-gray-100 text-black'>
                Tin tức ẩm thực
              </a>
            </li>
            <li>
              <a href='#' className='block px-4 py-2 hover:bg-gray-100 text-black'>
                Blog du lịch
              </a>
            </li>
          </ul>
        </li>
        <li className='relative group'>
          <a href='#' className='font-semibold flex items-center hover:text-gray-200'>
            Video Pato <span className='ml-1'>▼</span>
          </a>
          <ul className='absolute z-10 hidden group-hover:block bg-white shadow-lg rounded-md p-2 w-48'>
            <li>
              <a href='#' className='block px-4 py-2 hover:bg-gray-100 text-black'>
                Review nhà hàng
              </a>
            </li>
            <li>
              <a href='#' className='block px-4 py-2 hover:bg-gray-100 text-black'>
                Hướng dẫn đặt bàn
              </a>
            </li>
          </ul>
        </li>
      </ul>

      {/* Desktop account section */}
      <div className='hidden md:block relative group'>
        <div className='flex items-center space-x-2 cursor-pointer'>
          <span className='text-white font-semibold'>Tài khoản</span>
          <div className='w-8 h-8 rounded-full flex items-center justify-center'>
            <CircleUserRound className='text-white' />
          </div>
        </div>
        <ul className='absolute z-10 right-0 hidden group-hover:block bg-white shadow-lg rounded-md p-2 w-40'>
          <li>
            <Link href='/login'>
              <span className='block px-4 py-2 hover:bg-gray-100 text-black text-center'>Đăng nhập</span>
            </Link>
          </li>
          <li>
            <Link href='/register'>
              <span className='block px-4 py-2 hover:bg-gray-100 text-black text-center'>Đăng ký</span>
            </Link>
          </li>
          <li>
            <Link href='/ban-da-dat'>
              <span className='block px-4 py-2 hover:bg-gray-100 text-black text-center'>Bàn đã đặt</span>
            </Link>
          </li>
          <li>
            <Link href='/danh-sach-ticket'>
              <span className='block px-4 py-2 hover:bg-gray-100 text-black text-center'>Ticket</span>
            </Link>
          </li>
          <li>
            <Link href='/ket-noi-nha-hang'>
              <span className='block px-4 py-2 hover:bg-gray-100 text-black text-center'>Kết nối</span>
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  )
}
