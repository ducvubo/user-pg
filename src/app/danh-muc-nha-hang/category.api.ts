'use server'

import { sendRequest } from "@/lib/api"
import { IRestaurant } from "../interface/restaurant.interface"
import { ICategory } from "../home/home.api"

export const getRestaurants = async ({ pageIndex, pageSize, query }: {
  pageIndex: number
  pageSize: number
  query: any
}) => {
  const res: IBackendRes<IRestaurant[]> = await sendRequest({
    url: `${process.env.URL_SERVER}/restaurants/home`,
    method: 'GET',
    queryParams: {
      pageIndex,
      pageSize,
      ...query
    }
  })

  return res
}

export const getCategoryBySlug = async (category_slug: string) => {
  const res: IBackendRes<ICategory> = await sendRequest({
    url: `${process.env.URL_SERVER}/category/get-slug`,
    method: 'GET',
    queryParams: {
      category_slug
    }
  })

  return res
}