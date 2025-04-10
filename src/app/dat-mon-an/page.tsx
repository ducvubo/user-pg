import React, { Suspense } from 'react'
import ToastServer from '@/components/ToastServer'
import PageOrderFood from './_component/PageOrderFood'
import { getFoodBySlug } from '../mon-an/food.api'
import { redirect } from 'next/navigation'
import { getFoodRestaurant } from '../nha-hang/api'
import { GetRestaurantById } from '../home/home.api'

interface PageProps {
  searchParams: Promise<{ [key: string]: string }>
}

async function Component({ searchParams }: PageProps) {
  const params = await searchParams
  const { slug, selectedOption, quantity } = params
  const foodRes = await getFoodBySlug(slug)
  if (foodRes.statusCode !== 200 || !foodRes.data) {
    redirect('/')
    return <ToastServer message='Không tìm thấy món ăn' title='Lỗi' variant='destructive' />
  }
  const inforFood = foodRes.data
  const foodResId = foodRes.data.food_res_id
  const restaurant = await GetRestaurantById(foodResId)
  const selectedOptionsArray = selectedOption.split(',')

  if (restaurant.statusCode !== 200 || !restaurant.data) {
    redirect('/')
    return <ToastServer message='Không tìm thấy nhà hàng' title='Lỗi' variant='destructive' />
  }
  return (
    <PageOrderFood
      restaurant={restaurant.data}
      inforFood={inforFood}
      slug={slug}
      selectedOption={selectedOptionsArray}
      quantity={Number(quantity)}
    />
  )
}

export default function Page(props: PageProps) {
  return (
    <div>
      <Suspense>
        <Component {...props} />
      </Suspense>
    </div>
  )
}
