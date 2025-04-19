'use server'

import { sendRequest } from "@/lib/api"
import { IComboFood } from "../nha-hang/_component/ComboList"

export const getListFoodComboPagination = async (pageIndex: number, pageSize: number) => {
  const res: IBackendRes<IModelPaginate<IComboFood>> = await sendRequest({
    url: `${process.env.URL_SERVER_ORDER}/combo-food-res/list-food-combo-by-all`,
    method: 'GET',
    queryParams: {
      pageIndex,
      pageSize
    },
  })

  return res

}