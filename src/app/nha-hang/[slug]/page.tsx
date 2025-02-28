import InforRestaurant from '../_component/InforRestaurant'
import { IRestaurant } from '@/app/interface/restaurant.interface'
import dynamic from 'next/dynamic'
import { getRestaurantBySlug } from '../api'
const ToastServer = dynamic(() => import('@/components/ToastServer'), {
  ssr: true
})

interface PageProps {
  params: Promise<{
    slug: string
  }>
  searchParams: Promise<{
    [key: string]: string | undefined
  }>
}

export default async function RestaurantDetail({ searchParams, params }: PageProps) {
  const resolvedParams = await params
  const slug = resolvedParams.slug
  const restaurant: IBackendRes<IRestaurant> = await getRestaurantBySlug(slug)

  if (restaurant.statusCode !== 200 || !restaurant.data) {
    return (
      <div>
        <ToastServer message='Không tìm thấy nhà hàng' title='Lỗi' variant='destructive' />
      </div>
    )
  }

  return (
    <>
      <InforRestaurant restaurant={restaurant.data} />
    </>
  )
}
