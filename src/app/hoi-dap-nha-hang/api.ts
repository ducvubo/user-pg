'use server'

import { sendRequest } from '@/lib/api'

const URL_SERVER_INVENTORY = process.env.URL_SERVER_INVENTORY

export interface IGuestTicket {
  tkgr_res_id: string
  tkgr_user_id?: number
  tkgr_user_email: string
  tkgr_title: string
  tkgr_description: string
  tkgr_priority: string
  tkgr_type: string
  tkgr_attachment: string
}

export const guestCreateTicket = async (data: IGuestTicket) => {
  const res: IBackendRes<IGuestTicket> = await sendRequest({
    url: `${URL_SERVER_INVENTORY}/ticket-guest-restaurant`,
    method: 'POST',
    body: data
  })
  console.log('🚀 ~ guestCreateTicket ~ res:', res)
  return res
}
