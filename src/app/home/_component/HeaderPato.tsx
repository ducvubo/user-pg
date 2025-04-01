import React from 'react'
import Image from 'next/image'
import { CircleUserRound, Menu, ChevronDown } from 'lucide-react'
import Link from 'next/link'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function HeaderPato({
  image
}: {
  image?: {
    image_cloud: string
    image_custom: string
  }
}) {
  return (
    <nav className='flex items-center sticky top-0 z-50 justify-between px-4 md:px-8 lg:px-[100px] bg-[#e6624f] shadow-md h-[60px]'>
      <Link href='/' className=''>
        <Image
          src={image ? image?.image_cloud : '/images/logo.webp'}
          alt='vuducbo'
          width={180}
          height={25}
          className='h-[70px]'
          priority
        />
      </Link>

      <div className='md:hidden'>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className='text-white focus:outline-none'>
              <Menu size={24} />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-64 mr-4 bg-[#e6624f] text-white border-none shadow-lg rounded-lg transition-all duration-300">
            <DropdownMenuItem className="font-semibold text-base hover:bg-[#d55543] focus:bg-[#d55543] py-3">
              <a href='#' className='w-full'>Gần bạn</a>
            </DropdownMenuItem>
            <DropdownMenuItem className="font-semibold text-base hover:bg-[#d55543] focus:bg-[#d55543] py-3">
              <a href='#' className='w-full'>Bộ sưu tập</a>
            </DropdownMenuItem>

            {/* Ẩm thực submenu */}
            <DropdownMenu>
              <DropdownMenuTrigger className="w-full text-left font-semibold text-base hover:bg-[#d55543] focus:bg-[#d55543] pl-2 py-3 flex items-center justify-between">
                Ẩm thực <ChevronDown size={16} />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64 bg-white text-black shadow-lg rounded-lg transition-all duration-300">
                <DropdownMenuItem className="hover:bg-gray-100 py-2">
                  <a href='#' className='w-full'>Đồ uống</a>
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-gray-100 py-2">
                  <a href='#' className='w-full'>Bánh & Tráng miệng</a>
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-gray-100 py-2">
                  <a href='#' className='w-full'>Trái cây</a>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Nhánh hàng uy tín submenu */}
            <DropdownMenu>
              <DropdownMenuTrigger className="w-full text-left font-semibold text-base hover:bg-[#d55543] focus:bg-[#d55543] pl-2 py-3 flex items-center justify-between">
                Nhánh hàng uy tín <ChevronDown size={16} />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64 bg-white text-black shadow-lg rounded-lg transition-all duration-300">
                <DropdownMenuItem className="hover:bg-gray-100 py-2">
                  <a href='#' className='w-full'>Nhà hàng 5 sao</a>
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-gray-100 py-2">
                  <a href='#' className='w-full'>Nhà hàng cao cấp</a>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenuItem className="font-semibold text-base hover:bg-[#d55543] focus:bg-[#d55543] py-3">
              <a href='#' className='w-full'>Ưu đãi hot</a>
            </DropdownMenuItem>
            <DropdownMenuItem className="font-semibold text-base hover:bg-[#d55543] focus:bg-[#d55543] py-3">
              <a href='#' className='w-full'>Mới nhất</a>
            </DropdownMenuItem>

            {/* Tin tức & Blog submenu */}
            <DropdownMenu>
              <DropdownMenuTrigger className="w-full text-left font-semibold text-base hover:bg-[#d55543] focus:bg-[#d55543] pl-2  py-3 flex items-center justify-between">
                Tin tức & Blog <ChevronDown size={16} />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64 bg-white text-black shadow-lg rounded-lg transition-all duration-300">
                <DropdownMenuItem className="hover:bg-gray-100 py-2">
                  <a href='#' className='w-full'>Tin tức ẩm thực</a>
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-gray-100 py-2">
                  <a href='#' className='w-full'>Blog du lịch</a>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger className="w-full text-left font-semibold text-base hover:bg-[#d55543] focus:bg-[#d55543] pl-2  py-3 flex items-center justify-between">
                Video Pato <ChevronDown size={16} />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64 bg-white text-black shadow-lg rounded-lg transition-all duration-300">
                <DropdownMenuItem className="hover:bg-gray-100 py-2">
                  <a href='#' className='w-full'>Review nhà hàng</a>
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-gray-100 py-2">
                  <a href='#' className='w-full'>Hướng dẫn đặt bàn</a>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger className="w-full text-left font-semibold text-base hover:bg-[#d55543] focus:bg-[#d55543]  pl-2 py-3 flex items-center justify-between">
                Tài khoản <ChevronDown size={16} />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64 bg-white text-black shadow-lg rounded-lg transition-all duration-300">
                <DropdownMenuItem className="hover:bg-gray-100 py-2">
                  <Link href='/login' className='w-full'>Đăng nhập</Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-gray-100 py-2">
                  <Link href='/register' className='w-full'>Đăng ký</Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-gray-100 py-2">
                  <Link href='/ban-da-dat' className='w-full'>Bàn đã đặt</Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-gray-100 py-2">
                  <Link href='/danh-sach-ticket' className='w-full'>Ticket</Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-gray-100 py-2">
                  <Link href='/ket-noi-nha-hang' className='w-full'>Kết nối</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </DropdownMenuContent>
        </DropdownMenu>
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
            Ẩm thực
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
            Nhánh hàng uy tín
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
            Tin tức & Blog
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
            Video Pato
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