'use server'
import { ICategoryRestaurant } from '../components/CategoryRestaurantBlock'
import { IFoodRestaurant } from '../interface/food-restaurant.interface'
import { IRestaurant } from '../interface/restaurant.interface'
import { ISpecialOffer } from './_component/InforRestaurant'
import { IComboFood } from './_component/ComboList'
import { IDish } from './_component/DishList'
import { cookies } from 'next/headers'
import { sendRequest } from '@/lib/api'

const URL_SERVER = process.env.URL_SERVER
const URL_SERVER_ORDER = process.env.URL_SERVER_ORDER

export interface ICreateBookTable {
  book_tb_user_id?: string
  book_tb_restaurant_id: string
  book_tb_email: string
  book_tb_phone: string
  book_tb_name: string
  book_tb_date: Date
  book_tb_hour: string
  book_tb_number_adults: number
  book_tb_number_children: number
  book_tb_note?: string
  book_tb_redirect_url: string
  restaurant?: IRestaurant
  createdAt?: string
  book_tb_status?: string
}

export const getRestaurantBySlug = async (slug: string) => {
  const res: IBackendRes<IRestaurant> = await sendRequest({
    url: `${URL_SERVER}/restaurants/slug/${slug}`,
    method: 'GET'
  })
  return res
}

export const getFoodRestaurant = async (restaurantId: string) => {
  const res: IBackendRes<IFoodRestaurant[]> = await sendRequest({
    url: `${URL_SERVER_ORDER}/food-restaurant/list-food/${restaurantId}`,
    method: 'GET'
  })
  return res
}

export const getCategoryRestaurant = async (restaurantId: string) => {
  const res: IBackendRes<ICategoryRestaurant[]> = await sendRequest({
    url: `${URL_SERVER}/category-restaurant/all-category/${restaurantId}`,
    method: 'GET'
  })
  return res
}

export const getSpecialOffer = async (restaurantId: string) => {
  const res: IBackendRes<ISpecialOffer[]> = await sendRequest({
    url: `${URL_SERVER_ORDER}/special-offers/list-special-offer/${restaurantId}`,
    method: 'GET'
  })
  return res
}

export const getListCombo = async (restaurantId: string) => {
  const res: IBackendRes<IComboFood[]> = await sendRequest({
    url: `${URL_SERVER_ORDER}/combo-food-res/list-combo-food/${restaurantId}`,
    method: 'GET'
  })
  return res
}

export const getListDish = async (restaurantId: string) => {
  const res: IBackendRes<IDish[]> = await sendRequest({
    url: `${URL_SERVER}/dishes/list-dish-restaurant/${restaurantId}`,
    method: 'GET'
  })
  return res
}

export const getCookie = async (name: string) => {
  const cookieStore = await cookies()
  return cookieStore.get(name)
}

export const addRestaurantToCookie = async (restaurantId: string) => {
  const cookie = await cookies()
  const restaurantListCookie = cookie.get('restaurantIds')

  let restaurantIds: string[] = restaurantListCookie?.value ? JSON.parse(restaurantListCookie.value) : []

  if (!restaurantIds.includes(restaurantId)) {
    restaurantIds.push(restaurantId)

    if (restaurantIds.length > 15) {
      restaurantIds.pop()
    }

    await cookie.set('restaurantIds', JSON.stringify(restaurantIds), { path: '/' })
  }

  return restaurantIds
}

export const getListRestaurantByCategory = async (categoryId: string) => {
  const res: IBackendRes<IRestaurant[]> = await sendRequest({
    url: `${URL_SERVER}/restaurants/restaurant-by-id-cat/${categoryId}`,
    method: 'GET'
    // nextOption: {
    //   cache: 'force-cache',
    //   next: {
    //     revalidate: 3600
    //   }
    // }
  })
  return res
}

export const createBookTable = async (data: ICreateBookTable) => {
  const res: IBackendRes<ICreateBookTable> = await sendRequest({
    url: `${URL_SERVER}/book-table`,
    method: 'POST',
    body: data
  })
  return res
}
