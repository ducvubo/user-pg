// 'use client'

// import React, { use, useEffect, useState } from 'react'
// import Image from 'next/image'
// import { replaceDimensions } from '@/app/utils'
// import { addRestaurantToCookie } from '../api'

// interface IProps {
//   bannerImage: string // Định nghĩa kiểu dữ liệu của bannerImage
//   restaurantImages: { image_cloud: string }[] // Định nghĩa kiểu dữ liệu của restaurantImages
//   restaurant_id: string // Định nghĩa kiểu dữ liệu của restaurant_id
// }

// export default function BannerAndGallery({ bannerImage, restaurantImages, restaurant_id }: IProps) {
//   const [showMore, setShowMore] = useState(false)
//   const hasImages = restaurantImages && restaurantImages.length > 0
//   const firstSixImages = hasImages ? restaurantImages.slice(0, 6) : []
//   const handleToggleShowMore = () => {
//     setShowMore((prev) => !prev)
//   }

//   const addListRestaurant = async () => {
//     await addRestaurantToCookie(restaurant_id)
//   }
//   useEffect(() => {
//     addListRestaurant()
//   }, [])

//   return (
//     <>
//       <div className='grid grid-cols-3 gap-3 px-[100px] mt-3'>
//         <div className='col-span-2 bg-slate-700 h-[410px] rounded-lg'>
//           <Image src={bannerImage} width={700} height={500} alt='vuducbo' className='h-full w-full rounded-lg' />
//         </div>

//         <div className='col-span-1 h-96 grid grid-cols-2 gap-3'>
//           {hasImages &&
//             firstSixImages.map((item, index) => (
//               <div key={index} className={`relative ${index === 5 ? 'group' : ''}`}>
//                 <Image
//                   src={replaceDimensions(item.image_cloud, 1000, 1000)}
//                   width={300}
//                   height={300}
//                   alt='vuducbo'
//                   className={`h-32 w-full rounded-lg ${
//                     index === 5 ? 'cursor-pointer hover:opacity-80 transition-opacity' : ''
//                   }`}
//                   onClick={index === 5 ? handleToggleShowMore : undefined}
//                 />
//                 {index === 5 && (
//                   <div
//                     onClick={index === 5 ? handleToggleShowMore : undefined}
//                     className={`absolute inset-0 bg-black/40 cursor-pointer rounded-lg flex items-center justify-center transition-opacity duration-300 ${
//                       showMore ? 'opacity-0' : 'opacity-100 group-hover:opacity-0'
//                     }`}
//                   >
//                     <span className='text-white text-sm font-semibold'>{showMore ? 'Thu gọn' : 'Xem thêm'}</span>
//                   </div>
//                 )}
//               </div>
//             ))}
//         </div>
//       </div>

//       {showMore && hasImages && restaurantImages.length > 6 && (
//         <div className='px-[100px] mt-5'>
//           <div className='flex flex-wrap gap-3'>
//             {restaurantImages.slice(6).map((item, index) => (
//               <Image
//                 key={index}
//                 src={replaceDimensions(item.image_cloud, 1000, 1000)}
//                 width={300}
//                 height={300}
//                 alt='vuducbo'
//                 className='h-36 w-[209px] rounded-lg'
//               />
//             ))}
//           </div>
//         </div>
//       )}
//     </>
//   )
// }

'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { replaceDimensions } from '@/app/utils'
import { addRestaurantToCookie } from '../api'

interface IProps {
  bannerImage: string
  restaurantImages: { image_cloud: string }[]
  restaurant_id: string
}

export default function BannerAndGallery({ bannerImage, restaurantImages, restaurant_id }: IProps) {
  // const [showMore, setShowMore] = useState(false)
  // const hasImages = restaurantImages && restaurantImages.length > 0
  // const firstSixImages = hasImages ? restaurantImages.slice(0, 6) : []

  // const handleToggleShowMore = () => {
  //   setShowMore((prev) => !prev)
  // }

  // const addListRestaurant = async () => {
  //   await addRestaurantToCookie(restaurant_id)
  // }

  // useEffect(() => {
  //   addListRestaurant()
  // }, [restaurant_id])

  const [showMore, setShowMore] = useState(false)
  const hasImages = restaurantImages && restaurantImages.length > 0
  const firstSixImages = hasImages ? restaurantImages.slice(0, 6) : []

  const handleToggleShowMore = () => {
    setShowMore((prev) => !prev)
  }

  const addListRestaurant = async () => {
    await addRestaurantToCookie(restaurant_id)
  }

  useEffect(() => {
    addListRestaurant()
  }, [restaurant_id])

  return (
    <>
      {/* <div className='px-4 md:px-8 lg:px-[100px] mt-3'>
        <div className='flex flex-col lg:grid lg:grid-cols-3 gap-3'>
          <div className='lg:col-span-2 bg-slate-700 h-64 md:h-80 lg:h-[410px] rounded-lg'>
            <Image
              src={bannerImage}
              width={700}
              height={500}
              alt='Restaurant Banner'
              className='h-full w-full rounded-lg object-cover'
              sizes='(max-width: 768px) 100vw, (max-width: 1024px) 67vw, 700px'
            />
          </div>

          <div className='grid grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-3 h-auto lg:h-96'>
            {hasImages &&
              firstSixImages.map((item, index) => (
                <div key={index} className={`relative ${index === 5 ? 'group' : ''}`}>
                  <Image
                    src={replaceDimensions(item.image_cloud, 1000, 1000)}
                    width={300}
                    height={300}
                    alt='Restaurant Image'
                    className={`h-32 md:h-40 lg:h-32 w-full rounded-lg object-cover ${
                      index === 5 ? 'cursor-pointer hover:opacity-80 transition-opacity' : ''
                    }`}
                    onClick={index === 5 ? handleToggleShowMore : undefined}
                    sizes='(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 300px'
                  />
                  {index === 5 && (
                    <div
                      onClick={handleToggleShowMore}
                      className={`absolute inset-0 bg-black/40 cursor-pointer rounded-lg flex items-center justify-center transition-opacity duration-300 ${
                        showMore ? 'opacity-0' : 'opacity-100 group-hover:opacity-0'
                      }`}
                    >
                      <span className='text-white text-sm font-semibold'>{showMore ? 'Thu gọn' : 'Xem thêm'}</span>
                    </div>
                  )}
                </div>
              ))}
          </div>
        </div>
      </div> */}

<div className="px-4 md:px-8 lg:px-[100px] mt-3">
        {/* Main Layout */}
        <div className="flex flex-col lg:grid lg:grid-cols-3 gap-3">
          {/* Banner Image */}
          <div className="lg:col-span-2 bg-slate-700 h-64 md:h-80 lg:h-[410px] rounded-lg">
            <Image
              src={bannerImage}
              width={700}
              height={500}
              alt="Restaurant Banner"
              className="h-full w-full rounded-lg object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 67vw, 700px"
            />
          </div>

          {/* First 6 Images */}
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-3 h-auto lg:h-96">
            {hasImages &&
              firstSixImages.map((item, index) => (
                <div key={index} className={`relative ${index === 5 ? 'group' : ''}`}>
                  <Image
                    src={replaceDimensions(item.image_cloud, 1000, 1000)}
                    width={300}
                    height={300}
                    alt="Restaurant Image"
                    className={`h-32 md:h-40 lg:h-32 w-full rounded-lg object-cover ${
                      index === 5 ? 'cursor-pointer hover:opacity-80 transition-opacity' : ''
                    }`}
                    onClick={index === 5 ? handleToggleShowMore : undefined}
                    sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 300px"
                  />
                  {index === 5 && (
                    <div
                      onClick={handleToggleShowMore}
                      className="absolute inset-0 bg-black/40 cursor-pointer rounded-lg flex items-center justify-center transition-opacity duration-300 group-hover:opacity-80"
                    >
                      <span
                        className={`text-white text-sm font-semibold transition-opacity duration-300 ${
                          showMore ? 'opacity-100' : 'opacity-100 group-hover:opacity-0'
                        }`}
                      >
                        {showMore ? 'Thu gọn' : 'Xem thêm'}
                      </span>
                    </div>
                  )}
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Show More Images */}
      {showMore && hasImages && restaurantImages.length > 6 && (
        <div className='px-4 md:px-8 lg:px-[100px] mt-5'>
          <div className='grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3'>
            {restaurantImages.slice(6).map((item, index) => (
              <Image
                key={index}
                src={replaceDimensions(item.image_cloud, 1000, 1000)}
                width={300}
                height={300}
                alt='Additional Restaurant Image'
                className='h-36 w-full rounded-lg object-cover'
                sizes='(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw'
                loading='lazy'
              />
            ))}
          </div>
        </div>
      )}
    </>
  )
}
