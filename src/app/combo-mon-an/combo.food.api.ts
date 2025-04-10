'use server'

import { sendRequest } from '@/lib/api'
import { IComboFood } from '../nha-hang/_component/ComboList'

export const getComboFoodBySlug = async (slug: string) => {
  const res: IBackendRes<IComboFood> = await sendRequest({
    url: `${process.env.URL_SERVER_ORDER}/combo-food-res/get-combo-by-slug/${slug}`,
    method: 'GET'
  })
  return res
}
