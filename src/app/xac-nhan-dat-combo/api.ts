'use server'

import { sendRequest } from "@/lib/api"
import { IOrderFoodCombo } from "../dat-combo-mon-an/order.combo.interface"

export const confirmOrderFood = async ({
  od_cb_id,
  od_cb_res_id,
}: {
  od_cb_id: string | null
  od_cb_res_id: string | null
}) => {
  const res: IBackendRes<IOrderFoodCombo> = await sendRequest({
    url: `${process.env.URL_SERVER_ORDER}/order-food-combo/guest-confirm-order-food-combo`,
    method: 'PATCH',
    body: { od_cb_id, od_cb_res_id }
  })
  return res
}