import React, { Suspense } from 'react'
import ToastServer from '@/components/ToastServer'
import { getFoodBySlug } from '../mon-an/food.api'
import { redirect } from 'next/navigation'
import { GetRestaurantById } from '../home/home.api'
import PageInforComboFood from '../combo-mon-an/_component/PageInforComboFood'
import PageOrderCombo from './_component/PageOrderCombo'
import { getComboFoodBySlug } from '../combo-mon-an/combo.food.api'

interface PageProps {
  searchParams: Promise<{ [key: string]: string }>
}

async function Component({ searchParams }: PageProps) {
  const params = await searchParams
  const { slug, quantity } = params
  const comboRes = await getComboFoodBySlug(slug)
  if (comboRes.statusCode !== 200 || !comboRes.data) {
    redirect('/')
  }
  const inforFood = comboRes.data
  const comboResId = comboRes.data.fcb_res_id
  const restaurant = await GetRestaurantById(comboResId)

  if (restaurant.statusCode !== 200 || !restaurant.data) {
    redirect('/')
  }
  return (
    <PageOrderCombo
      restaurant={restaurant.data}
      inforCombo={inforFood}
      slug={slug}
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
