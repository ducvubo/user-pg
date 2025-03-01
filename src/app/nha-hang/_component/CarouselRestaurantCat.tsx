// 'use client'
// import React, { useState } from 'react'
// import Slider from 'react-slick'
// import 'slick-carousel/slick/slick.css'
// import 'slick-carousel/slick/slick-theme.css'
// import Image from 'next/image'
// import Link from 'next/link'
// import { Label } from '@/components/ui/label'
// import { IRestaurant } from '../interface/restaurant.interface'
// import { buildPriceRestaurant, replaceDimensions } from '../utils'
// import { GetRestaurantById } from '../actions/home.api'

// const NextArrow = (props: any) => {
//   const { className, style, onClick } = props
//   return (
//     <div className={className} style={{ ...style, display: 'block', right: '10px', zIndex: 1 }} onClick={onClick} />
//   )
// }

// const PrevArrow = (props: any) => {
//   const { className, style, onClick } = props
//   return <div className={className} style={{ ...style, display: 'block', left: '10px', zIndex: 1 }} onClick={onClick} />
// }

// interface IProps {
//   listRestaurant?: IRestaurant[]
//   label: string
//   link: string
//   selectedRestaurant: string[]
//   title: string
//   order: number
// }

// export default function CarouselRestaurant({ link, order, selectedRestaurant, title }: IProps) {
//   const settings = {
//     dots: false,
//     infinite: true,
//     speed: 500,
//     slidesToShow: 5,
//     slidesToScroll: 1,
//     arrows: true,
//     nextArrow: <NextArrow />,
//     prevArrow: <PrevArrow />,
//     autoplay: true,
//     autoplaySpeed: 2000
//   }

//   const [listRestaurantSelected, setListRestaurantSelected] = useState<IRestaurant[]>([])

//   const getRestaurantId = async (id: string) => {
//     const res: IBackendRes<IRestaurant> = await GetRestaurantById(id)
//     if (res.statusCode === 200) {
//       return res.data
//     }
//     return null
//   }

//   React.useEffect(() => {
//     const fetchData = async () => {
//       const list = await Promise.all(selectedRestaurant.map((id) => getRestaurantId(id)))
//       if (list.some((item) => item === null)) {
//         return
//       }
//       setListRestaurantSelected(list as IRestaurant[])
//     }
//     fetchData()
//   }, [selectedRestaurant])

//   return (
//     <div className='mt-10'>
//       <div className='flex justify-between items-center'>
//         <Label className='font-semibold text-3xl px-2'>{title}</Label>
//         <Link href={link} className='font-semibold italic'>
//           Xem thêm
//         </Link>
//       </div>
//       <hr className='my-3 mx-2 font-semibold' />

//       <Slider {...settings}>
//         {listRestaurantSelected?.map((restaurant, index) => {
//           return (
//             <Link href={`/nha-hang/${restaurant.restaurant_slug}`} key={index}>
//               <div className='w-full px-2 cursor-pointer' key={index}>
//                 <Image
//                   src={replaceDimensions(restaurant.restaurant_banner.image_custom, 1000, 1000)}
//                   width={500}
//                   height={500}
//                   alt='vuducbo'
//                   className='flex justify-center w-full h-[318px]'
//                 />
//                 <div className='flex flex-col gap-1'>
//                   <span className='font-semibold line-clamp-1'>{restaurant.restaurant_name}</span>
//                   <span className=' line-clamp-1'>{restaurant.restaurant_address.address_district.name}</span>
//                   <span className='font-semibold text-red-500 text-sm'>
//                     {buildPriceRestaurant(restaurant.restaurant_price)}{' '}
//                   </span>
//                 </div>
//               </div>
//             </Link>
//           )
//         })}
//       </Slider>
//     </div>
//   )
// }

import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { IRestaurant } from '../../interface/restaurant.interface'
import CarouselRestaurantClient from './CarouselRestaurantCatClient'
import { getListRestaurantByCategory } from '../api'
import { Card, CardContent } from '@/components/ui/card'

interface IProps {
  link: string
  order: number
  idCate: string
  title: string
}

export default async function CarouselRestaurantCat({ link, order, idCate, title }: IProps) {
  let listRestaurantSelected: IRestaurant[] = []
  const res: IBackendRes<IRestaurant[]> = await getListRestaurantByCategory(idCate)
  if (res.statusCode === 200 && res.data) {
    listRestaurantSelected = res.data
  }

  return listRestaurantSelected.length > 4 ? (
    <Card>
      <CardContent>
        <div className='mt-10'>
          <div className='flex justify-between items-center'>
            <Label className='font-semibold text-3xl px-2'>{title}</Label>
            <Link href={link} className='font-semibold italic'>
              Xem thêm
            </Link>
          </div>
          <hr className='my-3 mx-2 font-semibold' />
          <CarouselRestaurantClient listRestaurantSelected={listRestaurantSelected} />
        </div>
      </CardContent>
    </Card>
  ) : null
}
