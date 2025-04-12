'use server'

import { sendRequest } from "@/lib/api"
import { IOrderFood } from "../dat-mon-an/order.food.interface"

export const confirmOrderFood = async ({
  od_id,
  od_res_id,
}: {
  od_id: string | null
  od_res_id: string | null
}) => {
  const res: IBackendRes<IOrderFood> = await sendRequest({
    url: `${process.env.URL_SERVER_ORDER}/order-food/guest-confirm-order-food`,
    method: 'PATCH',
    body: { od_id, od_res_id }
  })
  console.log("🚀 ~ res:", res)
  return res
}