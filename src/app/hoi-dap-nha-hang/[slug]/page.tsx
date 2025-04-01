import { IRestaurant } from '@/app/interface/restaurant.interface'
import dynamic from 'next/dynamic'
import QARestaurant from '../_component/QARestaurant'
import { getRestaurantBySlug } from '@/app/nha-hang/api'
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
      <QARestaurant restaurant={restaurant.data} slug={slug} />
    </>
  )
}
