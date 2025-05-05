'use client'
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
import Sync from './Sync'
import { ISystemParameter } from '../home.api'

interface IMenuItem {
  name: string
  type: 'direct' | 'dropdown'
  url?: string
  order: number
  subMenus?: { name: string; url: string; order: number }[]
}

export default function HeaderPato({
  image,
}: {
  image?: {
    image_cloud: string
    image_custom: string
  }
}) {

  return (
    <nav className="flex items-center sticky top-0 z-50 justify-between px-4 md:px-8 lg:px-[100px] bg-[#e6624f] shadow-md h-[60px]">
      <Link href="/" className="">
        <Image
          src={image ? image.image_cloud : '/images/logo.webp'}
          alt="vuducbo"
          width={180}
          height={25}
          className="h-[70px]"
          priority
        />
      </Link>

      {/* Mobile Menu */}
      <div className="md:hidden">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="text-white focus:outline-none">
              <Menu size={24} />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-64 mr-4 bg-[#e6624f] text-white border-none shadow-lg rounded-lg transition-all duration-300">
            {/* {menuData.data
              .sort((a, b) => a.order - b.order)
              .map((item) =>
                item.type === 'direct' ? (
                  <DropdownMenuItem
                    key={item.name}
                    className="font-semibold text-base hover:bg-[#d55543] focus:bg-[#d55543] py-3"
                  >
                    <Link href={item.url || '#'} className="w-full">
                      {item.name}
                    </Link>
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenu key={item.name}>
                    <DropdownMenuTrigger className="w-full text-left font-semibold text-base hover:bg-[#d55543] focus:bg-[#d55543] pl-2 py-3 flex items-center justify-between">
                      {item.name} <ChevronDown size={16} />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-64 bg-white text-black shadow-lg rounded-lg transition-all duration-300">
                      {item.subMenus
                        ?.sort((a, b) => a.order - b.order)
                        .map((subItem) => (
                          <DropdownMenuItem
                            key={subItem.name}
                            className="hover:bg-gray-100 py-2"
                          >
                            <Link href={subItem.url || '#'} className="w-full">
                              {subItem.name}
                            </Link>
                          </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                )
              )} */}

            {/* Bạn (Account) Dropdown - Unchanged */}
            <DropdownMenu>
              <DropdownMenuTrigger className="w-full text-left font-semibold text-base hover:bg-[#d55543] focus:bg-[#d55543] pl-2 py-3 flex items-center justify-between">
                Bạn <ChevronDown size={16} />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64 bg-white text-black shadow-lg rounded-lg transition-all duration-300">
                <DropdownMenuItem className="hover:bg-gray-100 py-2">
                  <Link href="/ban-da-dat" className="w-full">
                    Bàn đã đặt
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-gray-100 py-2">
                  <Link href="/danh-sach-ticket" className="w-full">
                    Hỏi đáp
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-gray-100 py-2">
                  <Link href="/ket-noi-nha-hang" className="w-full">
                    Kết nối
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-gray-100 py-2">
                  <Link href="/mon-an-da-dat" className="w-full">
                    Món đã đặt
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-gray-100 py-2">
                  <Link href="/combo-da-dat" className="w-full">
                    Combo đã đặt
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-gray-100 py-2">
                  <Link href="/phong-da-dat" className="w-full">
                    Phòng đã đặt
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-gray-100 py-2">
                  <Link href="/gio-hang" className="w-full">
                    Giỏ hàng
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-gray-100 py-2">
                  <Sync type="dropdown" />
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Desktop Menu */}
      <ul className="hidden md:flex space-x-6 text-white">
        {/* {menuData.data
          .sort((a, b) => a.order - b.order)
          .map((item) =>
            item.type === 'direct' ? (
              <li key={item.name}>
                <Link
                  href={item.url || '#'}
                  className="font-semibold hover:text-gray-200"
                >
                  {item.name}
                </Link>
              </li>
            ) : (
              <li key={item.name} className="relative group">
                <span className="font-semibold flex items-center hover:text-gray-200 cursor-pointer">
                  {item.name}
                </span>
                <ul className="absolute z-10 hidden group-hover:block bg-white shadow-lg rounded-md p-2 w-48">
                  {item.subMenus
                    ?.sort((a, b) => a.order - b.order)
                    .map((subItem) => (
                      <li key={subItem.name}>
                        <Link
                          href={subItem.url || '#'}
                          className="block px-4 py-2 hover:bg-gray-100 text-black"
                        >
                          {subItem.name}
                        </Link>
                      </li>
                    ))}
                </ul>
              </li>
            )
          )} */}
      </ul>

      {/* Bạn (Account) - Unchanged */}
      <div className="hidden md:block relative group">
        <div className="flex items-center space-x-2 cursor-pointer">
          <span className="text-white font-semibold">Bạn</span>
          <div className="w-8 h-8 rounded-full flex items-center justify-center">
            <CircleUserRound className="text-white" />
          </div>
        </div>
        <ul className="absolute z-10 right-0 hidden group-hover:block bg-white shadow-lg rounded-md p-2 w-40">
          <li>
            <Link href="/ban-da-dat">
              <span className="block px-4 py-2 hover:bg-gray-100 text-black text-center">
                Bàn đã đặt
              </span>
            </Link>
          </li>
          <li>
            <Link href="/danh-sach-ticket">
              <span className="block px-4 py-2 hover:bg-gray-100 text-black text-center">
                Hỏi đáp
              </span>
            </Link>
          </li>
          <li>
            <Link href="/ket-noi-nha-hang">
              <span className="block px-4 py-2 hover:bg-gray-100 text-black text-center">
                Kết nối
              </span>
            </Link>
          </li>
          <li>
            <Link href="/mon-an-da-dat">
              <span className="block px-4 py-2 hover:bg-gray-100 text-black text-center">
                Món đã đặt
              </span>
            </Link>
          </li>
          <li>
            <Link href="/combo-da-dat">
              <span className="block px-4 py-2 hover:bg-gray-100 text-black text-center">
                Combo đã đặt
              </span>
            </Link>
          </li>
          <li>
            <Link href="/phong-da-dat">
              <span className="block px-4 py-2 hover:bg-gray-100 text-black text-center">
                Phòng đã đặt
              </span>
            </Link>
          </li>
          <li>
            <Link href="/gio-hang">
              <span className="block px-4 py-2 hover:bg-gray-100 text-black text-center">
                Giỏ hàng
              </span>
            </Link>
          </li>
          <Sync type="li" />
        </ul>
      </div>
    </nav>
  )
}