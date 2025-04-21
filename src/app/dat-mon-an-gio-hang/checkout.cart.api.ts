'use server'

import { sendRequest } from "@/lib/api"
import { IFoodRestaurant } from "../interface/food-restaurant.interface"
import { IComboFood } from "../nha-hang/_component/ComboList"

export const getFoodById = async (food_id: string) => {
  const res: IBackendRes<IFoodRestaurant> = await sendRequest({
    url: `${process.env.URL_SERVER_ORDER}/food-restaurant/get-food-id/${food_id}`,
    method: "GET",
  })
  return res
}

export const getComboById = async (combo_id: string) => {
  const res: IBackendRes<IComboFood> = await sendRequest({
    url: `${process.env.URL_SERVER_ORDER}/combo-food-res/get-combo-by-id/${combo_id}`,
    method: "GET",
  })
  return res
}
