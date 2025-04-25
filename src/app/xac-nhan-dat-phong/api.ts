'use server'

import { sendRequest } from "@/lib/api"

export const guestConfirmBookRoom = async ({ bkr_id, bkr_res_id }: {
  bkr_id: string
  bkr_res_id: string
}) => {
  const res = await sendRequest({
    url: `${process.env.URL_SERVER_ROOM}/book-room/guest-confirm`,
    method: 'PATCH',
    body: {
      bkr_id,
      bkr_res_id
    }
  })
  return res
}