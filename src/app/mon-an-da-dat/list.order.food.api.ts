'use server'

import { sendRequest } from "@/lib/api"
import { IOrderFood } from "../dat-mon-an/order.food.interface"

export const getListOrderFood = async ({ fromDate = null, q = '', status = 'all', pageIndex = 1, pageSize = 10, toDate = null }: {
  pageSize: number,
  pageIndex: number,
  q: string,
  status: string,
  toDate: Date | null,
  fromDate: Date | null,
}) => {
  const res: IBackendRes<IModelPaginate<IOrderFood>> = await sendRequest({
    url: `${process.env.URL_SERVER_ORDER}/order-food/get-list-order-food-guest-pagination`,
    method: 'GET',
    queryParams: {
      pageSize,
      pageIndex,
      q,
      od_status: status,
      toDate: toDate?.toString(),
      fromDate: fromDate?.toString()
    }
  })

  return res
}

export const guestCancelOrderFood = async ({ od_id, od_res_id, od_reason_cancel }: { od_id: string, od_res_id: string, od_reason_cancel: string }) => {
  const res: IBackendRes<IOrderFood> = await sendRequest({
    url: `${process.env.URL_SERVER_ORDER}/order-food/guest-cancel-order-food`,
    method: 'PATCH',
    body: { od_id, od_res_id, od_reason_cancel }
  })
  return res
}

export const guestReceiveOrderFood = async ({ od_id, od_res_id }: { od_id: string, od_res_id: string }) => {
  const res: IBackendRes<IOrderFood> = await sendRequest({
    url: `${process.env.URL_SERVER_ORDER}/order-food/guest-receive-order-food`,
    method: 'PATCH',
    body: { od_id, od_res_id }
  })
  return res
}

export const guestComplaintOrderFood = async ({ od_id, od_res_id }: { od_id: string, od_res_id: string }) => {
  const res: IBackendRes<IOrderFood> = await sendRequest({
    url: `${process.env.URL_SERVER_ORDER}/order-food/guest-complaint-order-food`,
    method: 'PATCH',
    body: { od_id, od_res_id }
  })
  return res
}

export const guestComplaintDoneOrderFood = async ({ od_id, od_res_id }: { od_id: string, od_res_id: string }) => {
  const res: IBackendRes<IOrderFood> = await sendRequest({
    url: `${process.env.URL_SERVER_ORDER}/order-food/guest-complaint-done-order-food`,
    method: 'PATCH',
    body: { od_id, od_res_id }
  })
  return res
}

export const guestFeedbackOrderFood = async ({ od_id, od_res_id, od_feed_content, od_feed_star }: { od_id: string, od_res_id: string, od_feed_content: string, od_feed_star: 1 | 2 | 3 | 4 | 5 }) => {
  const res: IBackendRes<IOrderFood> = await sendRequest({
    url: `${process.env.URL_SERVER_ORDER}/order-food/guest-feedback-order-food`,
    method: 'PATCH',
    body: { od_id, od_res_id, od_feed_content, od_feed_star }
  })
  return res
}