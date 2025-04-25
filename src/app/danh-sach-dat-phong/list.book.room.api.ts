'use server'

import { sendRequest } from "@/lib/api"


export enum BookRoomStatus {
  NEW_CREATED = 'NEW_CREATED',
  OVERTIME_GUEST = 'OVERTIME_GUEST',
  CANCEL_GUEST = 'CANCEL_GUEST',
  WAITING_RESTAURANT = 'WAITING_RESTAURANT',
  RESTAURANT_CONFIRM_DEPOSIT = 'RESTAURANT_CONFIRM_DEPOSIT',
  CANCEL_RESTAURANT = 'CANCEL_RESTAURANT',
  RESTAURANT_CONFIRM = 'RESTAURANT_CONFIRM',
  GUEST_CHECK_IN = 'GUEST_CHECK_IN',
  GUEST_CHECK_OUT = 'GUEST_CHECK_OUT',
  GUEST_CHECK_OUT_OVERTIME = 'GUEST_CHECK_OUT_OVERTIME',
  NO_SHOW = 'NO_SHOW',
  RESTAURANT_REFUND_DEPOSIT = 'RESTAURANT_REFUND_DEPOSIT',
  RESTAURANT_REFUND_ONE_THIRD_DEPOSIT = 'RESTAURANT_REFUND_ONE_THIRD',
  RESTAURANT_REFUND_ONE_TWO_DEPOSITE = 'RESTAURANT_REFUND_ONE_TWO_DEPOSITE',
  RESTAURANT_NO_DEPOSIT = 'RESTAURANT_NO_DEPOSIT',
  IN_USE = "IN_USE",
  RESTAURANT_CONFIRM_PAYMENT = 'RESTAURANT_CONFIRM_PAYMENT',
  GUEST_COMPLAINT = 'GUEST_COMPLAINT',
  DONE_COMPLAINT = 'DONE_COMPLAINT',
  RESTAURANT_EXCEPTION = 'RESTAURANT_EXCEPTION',
  GUEST_EXCEPTION = 'GUEST_EXCEPTION'
}
export interface IBookRoomEntity {
  bkr_id?: string
  bkr_res_id?: string
  bkr_guest_id?: string
  bkr_ame?: string
  bkr_email?: string
  bkr_phone?: string
  bkr_time_start?: Date
  bkr_time_end?: Date
  bkr_check_in?: Date
  bkr_check_out?: Date
  bkr_created_at?: Date
  bkr_note?: string
  bkr_note_res?: string
  bkr_feedback?: string
  bkr_reply?: string
  bkr_star?: 1 | 2 | 3 | 4 | 5
  bkr_reason_cancel?: string
  bkr_detail_history?: string
  bkr_status: BookRoomStatus
  bkr_plus_price?: number
  amenities?: IAmenitiesSnapEntity[]
  menuItems?: IMenuItemsSnapEntity[]
}

export interface IAmenitiesSnapEntity {
  ame_snap_id?: string
  ame_snap_bkr_id?: string
  ame_snap_res_id?: string
  ame_snap_name?: string
  ame_snap_price?: number
  ame_snap_note?: string
  ame_snap_description?: string
  ame_snap_quantity?: number
  bookRoom?: IBookRoomEntity
}

export interface IMenuItemsSnapEntity {
  mitems_snap_id?: string
  mitems_snap_res_id?: string
  mitems_snap_bkr_id?: string
  mitems_snap_name?: string
  mitems_snap_price?: number
  mitems_snap_image?: string
  mitems_snap_note?: string
  mitems_snap_description?: string
  mitems_snap_quantity?: number
  bookRoom?: IBookRoomEntity
}

export const guestConfirmBookRoom = async (bkr_id: string) => {
  const res = await sendRequest({
    url: `${process.env.URL_SERVER_ROOM}/book-room/guest-confirm`,
    method: 'PATCH',
    body: {
      bkr_id
    }
  })
  return res
}

export const guestCancelBookRoom = async (bkr_id: string, bkr_reason_cancel: string) => {
  const res = await sendRequest({
    url: `${process.env.URL_SERVER_ROOM}/book-room/guest-cancel`,
    method: 'PATCH',
    body: {
      bkr_id,
      bkr_reason_cancel
    }
  })
  return res
}

export const guestExceptionBookRoom = async (bkr_id: string) => {
  const res = await sendRequest({
    url: `${process.env.URL_SERVER_ROOM}/book-room/guest-exception`,
    method: 'PATCH',
    body: {
      bkr_id
    }
  })
  return res
}

export const guestComplaintBookRoom = async (bkr_id: string) => {
  const res = await sendRequest({
    url: `${process.env.URL_SERVER_ROOM}/book-room/guest-complaint`,
    method: 'PATCH',
    body: {
      bkr_id
    }
  })
  return res
}


export const guestFeedbackBookRoom = async (bkr_id: string, bkr_feedback: string, bkr_star: 1 | 2 | 3 | 4 | 5) => {
  const res = await sendRequest({
    url: `${process.env.URL_SERVER_ROOM}/book-room/guest-feedback`,
    method: 'PATCH',
    body: {
      bkr_id,
      bkr_feedback,
      bkr_star
    }
  })
  return res
}

export const getListBookRoomGuestPagination = async ({ fromDate = null, q = '', status = 'all', pageIndex = 1, pageSize = 10, toDate = null }: {
  pageSize: number,
  pageIndex: number,
  q: string,
  status: string,
  toDate: Date | null,
  fromDate: Date | null,
}) => {
  const res = await sendRequest({
    url: `${process.env.URL_SERVER_ROOM}/book-room/guest-list`,
    method: 'GET',
    queryParams: {
      pageSize,
      pageIndex,
      keyword: q,
      bkr_status: status,
      toDate: toDate?.toString(),
      fromDate: fromDate?.toString()
    }
  })

  return res
}