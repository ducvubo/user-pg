'use server'

import { sendRequest } from "@/lib/api"
import { IFoodRestaurant } from "../interface/food-restaurant.interface"

export const getListFoodPagination = async (pageIndex: number, pageSize: number) => {
  const res: IBackendRes<IModelPaginate<IFoodRestaurant>> = await sendRequest({
    url: `${process.env.URL_SERVER_ORDER}/food-restaurant/list-food-by-all`,
    method: 'GET',
    queryParams: {
      pageIndex,
      pageSize
    },
  })

  return res

}