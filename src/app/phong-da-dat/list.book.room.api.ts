'use server'

import { sendRequest } from "@/lib/api"

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