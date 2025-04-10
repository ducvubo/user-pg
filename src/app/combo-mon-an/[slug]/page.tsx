import dynamic from 'next/dynamic'
import { getComboFoodBySlug } from '../combo.food.api'
import { IFoodRestaurant } from '@/app/interface/food-restaurant.interface'
import HeaderPato from '@/app/home/_component/HeaderPato'
import Footer from '@/app/home/_component/Footer'
import { getFoodRestaurant, getListCombo } from '@/app/nha-hang/api'
import { GetRestaurantById } from '@/app/home/home.api'
import PageInforComboFood from '../_component/PageInforComboFood'

const ToastServer = dynamic(() => import('@/components/ToastServer'), { ssr: true })

interface PageProps {
  params: Promise<{
    slug: string
  }>
  searchParams: Promise<{
    [key: string]: string | undefined
  }>
}

export default async function ComboFoodDetail({ searchParams, params }: PageProps) {
  const resolvedParams = await params
  const slug = resolvedParams.slug
  const comboFoodRes = getComboFoodBySlug(slug)

  const comboFood = await comboFoodRes
  if (comboFood.statusCode !== 200 || !comboFood.data) {
    return <ToastServer message='Không tìm thấy combo món ăn' title='Lỗi' variant='destructive' />
  }

  const comboFoodResId = comboFood.data.fcb_res_id

  // Gọi API song song để giảm thời gian chờ
  const [restaurant, listFood, listCombo] = await Promise.all([
    GetRestaurantById(comboFoodResId),
    getFoodRestaurant(comboFoodResId),
    getListCombo(comboFoodResId)
  ])

  return (
    <>
      {restaurant.statusCode === 200 && restaurant.data && (
        <PageInforComboFood
          restaurant={restaurant.data}
          listCombo={listCombo.data || []}
          listFood={listFood.data || []}
          comboFood={comboFood.data}
        />
      )}
    </>
  )
}
