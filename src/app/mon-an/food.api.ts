'use server'

import { sendRequest } from '@/lib/api'
import { IFoodRestaurant } from '../interface/food-restaurant.interface'

export const getFoodBySlug = async (slug: string) => {
  const res: IBackendRes<IFoodRestaurant> = await sendRequest({
    url: `${process.env.URL_SERVER_ORDER}/food-restaurant/get-food-res-slug/${slug}`,
    method: 'GET'
  })
  console.log('🚀 ~ getFoodBySlug ~ res:', res)
  return res
}
