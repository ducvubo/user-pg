'use client'
import React from 'react'
import Image from 'next/image'
import { Menu, ChevronDown } from 'lucide-react'
import Link from 'next/link'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import Sync from './Sync'
import { ISystemParameter } from '../home.api'

interface IMenuItem {
  name: string
  type: 'direct' | 'dropdown'
  url?: string
  order: number
  subMenus?: { name: string; url: string; order: number }[]
}

// Sample menuData with account items and Sync integrated
const menuData: { data: IMenuItem[] } = {
  data: [
    { name: 'Trang chủ', type: 'direct', url: '/', order: 1 },
    { name: 'Liên hệ', type: 'direct', url: '/lien-he', order: 3 },
    { name: 'Bàn đã đặt', type: 'direct', url: '/ban-da-dat', order: 4 },
    { name: 'Hỏi đáp', type: 'direct', url: '/danh-sach-ticket', order: 5 },
    { name: 'Kết nối', type: 'direct', url: '/ket-noi-nha-hang', order: 6 },
    { name: 'Món đã đặt', type: 'direct', url: '/mon-an-da-dat', order: 7 },
    { name: 'Combo đã đặt', type: 'direct', url: '/combo-da-dat', order: 8 },
    { name: 'Phòng đã đặt', type: 'direct', url: '/phong-da-dat', order: 9 },
    { name: 'Giỏ hàng', type: 'direct', url: '/gio-hang', order: 10 },
    { name: 'Đồng bộ dữ liệu', type: 'direct', url: '#sync', order: 11 },
  ],
}

export default function HeaderPato({
  image,
}: {
  image?: {
    image_cloud: string
    image_custom: string
  }
}) {
  // Flatten menu items for mobile dropdown
  const mobileMenuItems = [
    ...menuData.data
      .map((item) => ({
        name: item.name,
        url: item.url || '#',
        order: item.order,
        isSubMenu: false,
      }))
      .sort((a, b) => a.order - b.order),
    ...menuData.data
      .filter((item) => item.type === 'dropdown')
      .flatMap((item) =>
        (item.subMenus || []).map((subItem) => ({
          name: `${item.name} - ${subItem.name}`,
          url: subItem.url || '#',
          order: subItem.order + item.order * 100, // Ensure subitems follow parent
          isSubMenu: true,
        }))
      )
      .sort((a, b) => a.order - b.order),
  ]

  return (
    <nav className="flex items-center sticky top-0 z-50 justify-center px-4 md:px-8 lg:px-[100px] bg-[#e6624f] shadow-md h-[60px]">
      {/* Logo (Left-aligned) */}
      <div className="absolute left-4 md:left-8 lg:left-[100px]">
        <Link href="/">
          <Image
            src={image ? image.image_cloud : '/images/logo.webp'}
            alt="vuducbo"
            width={180}
            height={25}
            className="h-[70px] w-auto"
            priority
          />
        </Link>
      </div>

      {/* Mobile Menu */}
      <div className="md:hidden absolute right-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="text-white focus:outline-none">
              <Menu size={24} />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-64 mr-4 bg-[#e6624f] text-white border-none shadow-lg rounded-lg transition-all duration-300 max-h-[80vh] overflow-y-auto">
            {mobileMenuItems.map((item) =>
              item.name === 'Đồng bộ dữ liệu' ? (
                <DropdownMenuItem
                  key={item.name}
                  className="font-semibold text-base hover:bg-[#d55543] focus:bg-[#d55543] py-3 pl-2"
                >
                  <Sync type="dropdown" />
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem
                  key={item.name}
                  className={`font-semibold text-base hover:bg-[#d55543] focus:bg-[#d55543] py-3 ${item.isSubMenu ? 'pl-6' : 'pl-2'}`}
                >
                  <Link href={item.url} className="w-full">
                    {item.name}
                  </Link>
                </DropdownMenuItem>
              )
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Desktop Menu (Centered) */}
      <ul className="hidden md:flex space-x-6 text-white">
        {menuData.data
          .sort((a, b) => a.order - b.order)
          .map((item) =>
            item.name === 'Đồng bộ dữ liệu' ? (
              <li key={item.name} className="flex items-center">
                <Sync type="li" />
              </li>
            ) : item.type === 'direct' ? (
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
                  <ChevronDown className="ml-1 h-4 w-4" />
                </span>
                <ul className="absolute z-10 left-1/2 transform -translate-x-1/2 hidden group-hover:block bg-white shadow-lg rounded-md p-2 w-48">
                  {item.subMenus
                    ?.sort((a, b) => a.order - b.order)
                    .map((subItem) => (
                      <li key={subItem.name}>
                        <Link
                          href={subItem.url || '#'}
                          className="block px-4 py-2 hover:bg-gray-100 text-black text-center"
                        >
                          {subItem.name}
                        </Link>
                      </li>
                    ))}
                </ul>
              </li>
            )
          )}
      </ul>
    </nav>
  )
}