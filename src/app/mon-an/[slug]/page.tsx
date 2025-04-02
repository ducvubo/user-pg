import dynamic from 'next/dynamic'
import { getFoodBySlug } from '../food.api'
import { IFoodRestaurant } from '@/app/interface/food-restaurant.interface'
import PageInforFood from '../_component/PageInforFood'
import HeaderPato from '@/app/home/_component/HeaderPato'
import Footer from '@/app/home/_component/Footer'
import { getFoodRestaurant, getListCombo } from '@/app/nha-hang/api'
import { GetRestaurantById } from '@/app/home/home.api'

const ToastServer = dynamic(() => import('@/components/ToastServer'), { ssr: true })

interface PageProps {
  params: Promise<{
    slug: string
  }>
  searchParams: Promise<{
    [key: string]: string | undefined
  }>
}

export default async function FoodDetail({ searchParams, params }: PageProps) {
  const resolvedParams = await params
  const slug = resolvedParams.slug
  const foodRes = getFoodBySlug(slug)

  // Chờ lấy thông tin món ăn trước
  const food = await foodRes
  if (food.statusCode !== 200 || !food.data) {
    return <ToastServer message='Không tìm thấy món ăn' title='Lỗi' variant='destructive' />
  }

  const foodResId = food.data.food_res_id

  // Gọi API song song để giảm thời gian chờ
  const [restaurant, listFood, listCombo] = await Promise.all([
    GetRestaurantById(foodResId),
    getFoodRestaurant(foodResId),
    getListCombo(foodResId)
  ])

  return (
    <>
      {restaurant.statusCode === 200 && restaurant.data && (
        <PageInforFood
          restaurant={restaurant.data}
          listCombo={listCombo.data || []}
          listFood={listFood.data || []}
          food={food.data}
        />
      )}
    </>
  )
}
