// import Image from 'next/image'
// import HomePage from './home/_component/Home'
// import { redirect } from 'next/navigation'

// export default function Home() {
//   redirect('/nha-hang/Nha-PATO-390590.html')
//   return (
//     <>
//       <HomePage />
//     </>
//   )
// }

import { IRestaurant } from '@/app/interface/restaurant.interface'
import dynamic from 'next/dynamic'
import { redirect } from 'next/navigation'
import { getRestaurantBySlug } from './nha-hang/api'
import InforRestaurant from './nha-hang/_component/InforRestaurant'
const ToastServer = dynamic(() => import('@/components/ToastServer'), {
  ssr: true
})


export default async function RestaurantDetail() {
  const slug = 'Nha-PATO-390590.html'

  const restaurant: IBackendRes<IRestaurant> = await getRestaurantBySlug(slug)
  console.log("🚀 ~ RestaurantDetail ~ restaurant:", restaurant)

  if (restaurant.statusCode !== 200 || !restaurant.data) {
    return (
      <div>
        <ToastServer message='Không tìm thấy nhà hàng' title='Lỗi' variant='destructive' />
      </div>
    )
  }

  return (
    <>
      <InforRestaurant slug={slug} restaurant={restaurant.data} />
    </>
  )
}
