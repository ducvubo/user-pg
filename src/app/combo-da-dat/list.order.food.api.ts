'use server'

import { sendRequest } from "@/lib/api"
import { IOrderFoodCombo } from "../dat-combo-mon-an/order.combo.interface"

export const getListOrderFoodCombo = async ({ fromDate = null, q = '', status = 'all', pageIndex = 1, pageSize = 10, toDate = null }: {
  pageSize: number,
  pageIndex: number,
  q: string,
  status: string,
  toDate: Date | null,
  fromDate: Date | null,
}) => {
  const res: IBackendRes<IModelPaginate<IOrderFoodCombo>> = await sendRequest({
    url: `${process.env.URL_SERVER_ORDER}/order-food-combo/get-list-order-food-combo-guest-pagination`,
    method: 'GET',
    queryParams: {
      pageSize,
      pageIndex,
      q,
      od_cb_status: status,
      toDate: toDate?.toString(),
      fromDate: fromDate?.toString()
    }
  })

  return res
}

export const guestCancelOrderFoodCombo = async ({ od_cb_id, od_cb_res_id, od_cb_reason_cancel }: { od_cb_id: string, od_cb_res_id: string, od_cb_reason_cancel: string }) => {
  const res: IBackendRes<IOrderFoodCombo> = await sendRequest({
    url: `${process.env.URL_SERVER_ORDER}/order-food-combo/guest-cancel-order-food-combo`,
    method: 'PATCH',
    body: { od_cb_id, od_cb_res_id, od_cb_reason_cancel }
  })
  return res
}

export const guestReceiveOrderFoodCombo = async ({ od_cb_id, od_cb_res_id }: { od_cb_id: string, od_cb_res_id: string }) => {
  const res: IBackendRes<IOrderFoodCombo> = await sendRequest({
    url: `${process.env.URL_SERVER_ORDER}/order-food-combo/guest-receive-order-food-combo`,
    method: 'PATCH',
    body: { od_cb_id, od_cb_res_id }
  })
  return res
}

export const guestComplaintOrderFoodCombo = async ({ od_cb_id, od_cb_res_id }: { od_cb_id: string, od_cb_res_id: string }) => {
  const res: IBackendRes<IOrderFoodCombo> = await sendRequest({
    url: `${process.env.URL_SERVER_ORDER}/order-food-combo/guest-complaint-order-food-combo`,
    method: 'PATCH',
    body: { od_cb_id, od_cb_res_id }
  })
  return res
}

export const guestComplaintDoneOrderFoodCombo = async ({ od_cb_id, od_cb_res_id }: { od_cb_id: string, od_cb_res_id: string }) => {
  const res: IBackendRes<IOrderFoodCombo> = await sendRequest({
    url: `${process.env.URL_SERVER_ORDER}/order-food-combo/guest-complaint-done-order-food-combo`,
    method: 'PATCH',
    body: { od_cb_id, od_cb_res_id }
  })
  return res
}

export const guestFeedbackOrderFoodCombo = async ({ od_cb_id, od_cb_res_id, od_cb_feed_content, od_cb_feed_star }: { od_cb_id: string, od_cb_res_id: string, od_cb_feed_content: string, od_cb_feed_star: 1 | 2 | 3 | 4 | 5 }) => {
  const res: IBackendRes<IOrderFoodCombo> = await sendRequest({
    url: `${process.env.URL_SERVER_ORDER}/order-food-combo/guest-feedback-order-food-combo`,
    method: 'PATCH',
    body: { od_cb_id, od_cb_res_id, od_cb_feed_content, od_cb_feed_star }
  })
  return res
}