import dynamic from 'next/dynamic'
import { GetRestaurantById } from '@/app/home/home.api'
import { getAmenityByRestaurantId, getMenuItemByRestaurantId, getRoomById } from '../book.room.api'
import PageInforRoom from '../_component/PageBookRoom'

const ToastServer = dynamic(() => import('@/components/ToastServer'), { ssr: true })

interface PageProps {
  params: Promise<{
    slug: string
  }>
  searchParams: Promise<{
    [key: string]: string | undefined
  }>
}

export default async function BookZoom({ searchParams, params }: PageProps) {
  const resolvedParams = await params
  const id = resolvedParams.slug
  const roomRes = await getRoomById(id)

  if (roomRes.statusCode !== 200 || !roomRes.data) {
    return <ToastServer message='Không tìm thấy món ăn' title='Lỗi' variant='destructive' />
  }

  const roomResId = roomRes.data.room_res_id

  const [restaurant, listMenuItems, listAmenity] = await Promise.all([
    GetRestaurantById(roomResId),
    getMenuItemByRestaurantId(roomResId),
    getAmenityByRestaurantId(roomResId),
  ])

  return (
    <>
      {restaurant.statusCode === 200 && restaurant.data && (
        <PageInforRoom
          restaurant={restaurant.data}
          roomRes={roomRes.data}
          listAmenity={listAmenity.data || []}
          listMenuItems={listMenuItems.data || []}
        />
      )}
    </>
  )
}
