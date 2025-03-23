// 'use client'
// import { ICategory } from '@/app/home/home.api'
// import React, { useEffect, useState, useCallback } from 'react'
// import { useParams } from 'next/navigation'
// import { getCategoryBySlug, getRestaurants } from '../category.api'
// import { IRestaurant } from '@/app/interface/restaurant.interface'
// import Image from 'next/image'
// import Link from 'next/link'
// import { buildPriceRestaurant, replaceDimensions } from '../../utils'
// import { Loader2 } from 'lucide-react'

// export default function PageCategory() {
//   const params = useParams()
//   const category_slug = params.slug as string
//   const [inforCat, setInforCat] = useState<ICategory>()
//   const [pageIndex, setPageIndex] = useState(1)
//   const [pageSize] = useState(10) // Keeping pageSize constant
//   const [listRestaurant, setListRestaurant] = useState<IRestaurant[]>([])
//   const [isLoading, setIsLoading] = useState(false)
//   const [hasMore, setHasMore] = useState(true)
//   const [isMobile, setIsMobile] = useState(false)

//   useEffect(() => {
//     const checkMobile = () => {
//       setIsMobile(window.innerWidth < 768)
//     }

//     checkMobile()
//     window.addEventListener('resize', checkMobile)
//     return () => window.removeEventListener('resize', checkMobile)
//   }, [])

//   const getInforCat = async () => {
//     try {
//       const res: IBackendRes<ICategory> = await getCategoryBySlug(category_slug)
//       if (res.statusCode === 200 || res.statusCode === 201) {
//         setInforCat(res.data)
//       } else {
//         console.log('error')
//         setInforCat(undefined)
//       }
//     } catch (e) {
//       console.log('error', e)
//       setInforCat(undefined)
//     }
//   }


//   const getRestaurantByQuery = async (page: number) => {
//     if (!hasMore || isLoading) return;

//     setIsLoading(true)
//     try {
//       const res: IBackendRes<IRestaurant[]> = await getRestaurants({
//         pageIndex: page,
//         pageSize,
//         query: {
//           restaurant_category: inforCat?._id
//         }
//       })
//       if (res.statusCode === 200 && res.data) {
//         setListRestaurant(prev => [...prev, ...res.data as any])
//         setHasMore(res.data.length === pageSize)
//       } else {
//         setHasMore(false)
//       }
//     } catch (error) {
//       console.log('error', error)
//       setHasMore(false)
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   useEffect(() => {
//     getInforCat()
//   }, [category_slug])

//   useEffect(() => {
//     if (inforCat && inforCat._id) {
//       // Reset list and fetch first page when category changes
//       setListRestaurant([])
//       setPageIndex(1)
//       setHasMore(true)
//       getRestaurantByQuery(1)
//     }
//   }, [inforCat])

//   const handleScroll = useCallback(() => {
//     const triggerDistance = isMobile ? 1200 : 500
//     if (
//       window.innerHeight + document.documentElement.scrollTop >=
//       document.documentElement.offsetHeight - triggerDistance
//       && !isLoading
//       && hasMore
//     ) {
//       setPageIndex(prev => prev + 1)
//     }
//   }, [isLoading, hasMore, isMobile])

//   useEffect(() => {
//     window.addEventListener('scroll', handleScroll)
//     return () => window.removeEventListener('scroll', handleScroll)
//   }, [handleScroll])

//   // Fetch new page when pageIndex changes
//   useEffect(() => {
//     if (pageIndex > 1 && inforCat?._id) {
//       getRestaurantByQuery(pageIndex)
//     }
//   }, [pageIndex])

//   const renderRestaurantItem = (restaurant: IRestaurant, index: number) => (
//     <Link href={`/nha-hang/${restaurant.restaurant_slug}`} target='_blank' key={index}>
//       <div className='w-full px-2 cursor-pointer'>
//         <Image
//           src={restaurant.restaurant_banner.image_cloud}
//           width={500}
//           height={700}
//           alt={restaurant.restaurant_name}
//           priority={index < 10} // Priority only for first 10 items
//           className='w-full h-40 md:h-64 lg:h-[310px] object-cover'
//           sizes='(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw'
//         />
//         <div className='flex flex-col gap-1 group hover:text-red-500 mt-3'>
//           <span className='font-semibold text-sm md:text-base line-clamp-1'>
//             {restaurant.restaurant_name}
//           </span>
//           <div className='flex flex-col md:flex-row gap-2 text-xs md:text-sm'>
//             <span className='line-clamp-1 mt-1'>
//               {restaurant.restaurant_address.address_province.name}
//             </span>
//             {(restaurant.restaurant_type[0] || restaurant.restaurant_type[1]) && (
//               <div className='flex flex-wrap gap-1'>
//                 {restaurant.restaurant_type[0] && (
//                   <span className='border rounded-md px-1 py-1'>
//                     {restaurant.restaurant_type[0].restaurant_type_name}
//                   </span>
//                 )}
//                 {restaurant.restaurant_type[1] && (
//                   <span className='border rounded-md px-1 py-1'>
//                     {restaurant.restaurant_type[1].restaurant_type_name}
//                   </span>
//                 )}
//               </div>
//             )}
//           </div>
//           <span className='font-semibold text-red-500 text-sm md:text-base'>
//             {buildPriceRestaurant(restaurant.restaurant_price)}
//           </span>
//         </div>
//       </div>
//     </Link>
//   )

//   return (
//     <div className='container mx-auto px-4 py-8'>
//       {inforCat && (
//         <h1 className='text-2xl font-bold mb-6'>
//           {inforCat.category_name}
//         </h1>
//       )}
//       {listRestaurant.length > 0 ? (
//         <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:px-0'>
//           {listRestaurant.map((restaurant, index) =>
//             renderRestaurantItem(restaurant, index)
//           )}
//         </div>
//       ) : (
//         !isLoading && (
//           <div className='text-center py-10'>
//             <p>No restaurants found in this category.</p>
//           </div>
//         )
//       )}
//       {isLoading && (
//         <div className='flex justify-center py-4'>
//           <Loader2 className="animate-spin" />
//         </div>
//       )}
//     </div>
//   )
// }


'use client'
import { ICategory } from '@/app/home/home.api'
import React, { useEffect, useState, useCallback } from 'react'
import { useParams } from 'next/navigation'
import { getCategoryBySlug, getRestaurants } from '../category.api'
import { IRestaurant } from '@/app/interface/restaurant.interface'
import Image from 'next/image'
import Link from 'next/link'
import { buildPriceRestaurant, replaceDimensions } from '../../utils'
import { Loader2 } from 'lucide-react'

export default function PageCategory() {
  const params = useParams()
  const category_slug = params.slug as string
  const [inforCat, setInforCat] = useState<ICategory>()
  const [pageIndex, setPageIndex] = useState(1)
  const [pageSize] = useState(10)
  const [listRestaurant, setListRestaurant] = useState<IRestaurant[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  const [showBackToTop, setShowBackToTop] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Handle scroll visibility for back to top button
  useEffect(() => {
    const handleScrollVisibility = () => {
      if (window.scrollY > 200) {
        setShowBackToTop(true)
      } else {
        setShowBackToTop(false)
      }
    }

    window.addEventListener('scroll', handleScrollVisibility)
    return () => window.removeEventListener('scroll', handleScrollVisibility)
  }, [])

  const getInforCat = async () => {
    try {
      const res: IBackendRes<ICategory> = await getCategoryBySlug(category_slug)
      if (res.statusCode === 200 || res.statusCode === 201) {
        setInforCat(res.data)
      } else {
        console.log('error')
        setInforCat(undefined)
      }
    } catch (e) {
      console.log('error', e)
      setInforCat(undefined)
    }
  }

  const getRestaurantByQuery = async (page: number) => {
    if (!hasMore || isLoading) return;

    setIsLoading(true)
    try {
      const res: IBackendRes<IRestaurant[]> = await getRestaurants({
        pageIndex: page,
        pageSize,
        query: {
          restaurant_category: inforCat?._id
        }
      })
      if (res.statusCode === 200 && res.data) {
        setListRestaurant(prev => [...prev, ...res.data as any])
        setHasMore(res.data.length === pageSize)
      } else {
        setHasMore(false)
      }
    } catch (error) {
      console.log('error', error)
      setHasMore(false)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    getInforCat()
  }, [category_slug])

  useEffect(() => {
    if (inforCat && inforCat._id) {
      setListRestaurant([])
      setPageIndex(1)
      setHasMore(true)
      getRestaurantByQuery(1)
    }
  }, [inforCat])

  const handleScroll = useCallback(() => {
    const triggerDistance = isMobile ? 1200 : 500
    if (
      window.innerHeight + document.documentElement.scrollTop >=
      document.documentElement.offsetHeight - triggerDistance
      && !isLoading
      && hasMore
    ) {
      setPageIndex(prev => prev + 1)
    }
  }, [isLoading, hasMore, isMobile])

  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  useEffect(() => {
    if (pageIndex > 1 && inforCat?._id) {
      getRestaurantByQuery(pageIndex)
    }
  }, [pageIndex])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  const renderRestaurantItem = (restaurant: IRestaurant, index: number) => (
    <Link href={`/nha-hang/${restaurant.restaurant_slug}`} target='_blank' key={index}>
      <div className='w-full px-2 cursor-pointer'>
        <Image
          src={restaurant.restaurant_banner.image_cloud}
          width={500}
          height={700}
          alt={restaurant.restaurant_name}
          priority={index < 10}
          className='w-full h-40 md:h-64 lg:h-[310px] object-cover'
          sizes='(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw'
        />
        <div className='flex flex-col gap-1 group hover:text-red-500 mt-3'>
          <span className='font-semibold text-sm md:text-base line-clamp-1'>
            {restaurant.restaurant_name}
          </span>
          <div className='flex flex-col md:flex-row gap-2 text-xs md:text-sm'>
            <span className='line-clamp-1 mt-1'>
              {restaurant.restaurant_address.address_province.name}
            </span>
            {(restaurant.restaurant_type[0] || restaurant.restaurant_type[1]) && (
              <div className='flex flex-wrap gap-1'>
                {restaurant.restaurant_type[0] && (
                  <span className='border rounded-md px-1 py-1'>
                    {restaurant.restaurant_type[0].restaurant_type_name}
                  </span>
                )}
                {restaurant.restaurant_type[1] && (
                  <span className='border rounded-md px-1 py-1'>
                    {restaurant.restaurant_type[1].restaurant_type_name}
                  </span>
                )}
              </div>
            )}
          </div>
          <span className='font-semibold text-red-500 text-sm md:text-base'>
            {buildPriceRestaurant(restaurant.restaurant_price)}
          </span>
        </div>
      </div>
    </Link>
  )

  return (
    <div className='px-4 md:px-8 lg:px-[100px] mt-10 relative'>
      {inforCat && (
        <h1 className='text-2xl font-bold mb-6'>
          {inforCat.category_name}
        </h1>
      )}
      {listRestaurant.length > 0 ? (
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:px-0'>
          {listRestaurant.map((restaurant, index) =>
            renderRestaurantItem(restaurant, index)
          )}
        </div>
      ) : (
        !isLoading && (
          <div className='text-center py-10'>
            <p>No restaurants found in this category.</p>
          </div>
        )
      )}
      {isLoading && (
        <div className='flex justify-center py-4'>
          <Loader2 className="animate-spin" />
        </div>
      )}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className='fixed bottom-10 right-10 bg-red-500 text-white p-3 rounded-full shadow-lg hover:bg-red-600 transition-all duration-300 z-50'
          aria-label='Back to top'
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className='h-6 w-6'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M5 15l7-7 7 7'
            />
          </svg>
        </button>
      )}
    </div>
  )
}