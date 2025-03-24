'use server'

import { sendRequest } from "@/lib/api"
import { IArticleRestaurant } from "../nha-hang/api"

export const getArticleRestaurantBySlug = async (slug: string) => {
  const res: IBackendRes<IArticleRestaurant> = await sendRequest({
    url: `${process.env.URL_SERVER_BLOG}/articles/slug`,
    method: 'GET',
    queryParams: {
      slug
    }
  })

  return res
}