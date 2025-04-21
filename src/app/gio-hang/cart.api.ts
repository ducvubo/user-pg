'use server'

import { IFoodRestaurant } from "../interface/food-restaurant.interface"
import { sendRequest } from "@/lib/api"
import { IComboFood } from "../nha-hang/_component/ComboList"

export const getFoodCart = async () => {
  const res: IBackendRes<IFoodRestaurant[]> = await sendRequest({
    url: `${process.env.URL_SERVER_ORDER}/food-restaurant/get-cart-food`,
    method: 'GET',
  })
  return res
}

export const getFoodComboCart = async () => {
  const res: IBackendRes<IComboFood[]> = await sendRequest({
    url: `${process.env.URL_SERVER_ORDER}/combo-food-res/get-cart-combo-food`,
    method: 'GET',
  })
  return res
}