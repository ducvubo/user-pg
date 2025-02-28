'use server'
import { IFoodRestaurant } from '../interface/food-restaurant.interface'
import { IRestaurant } from '../interface/restaurant.interface'
import { sendRequest } from '@/lib/api'

const URL_SERVER = process.env.URL_SERVER
const URL_SERVER_ORDER = process.env.URL_SERVER_ORDER
export const getRestaurantBySlug = async (slug: string) => {
  const res: IBackendRes<IRestaurant> = await sendRequest({
    url: `${URL_SERVER}/restaurants/slug/${slug}`,
    method: 'GET'
  })
  return res
}

export const getFoodRestaurant = async (restaurantId: string) => {
  const res: IBackendRes<IFoodRestaurant[]> = await sendRequest({
    url: `${URL_SERVER_ORDER}/food-restaurant/list-food?food_res_id=${restaurantId}`,
    method: 'GET'
  })
  return res
}
