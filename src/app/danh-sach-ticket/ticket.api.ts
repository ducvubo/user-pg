'use server'

import { sendRequest } from '@/lib/api'
import { ITicketGuestRestaurant, ITicketGuestRestaurantReplice } from './ticket.interface'

const URL_SERVER_TICKET = process.env.URL_SERVER_INVENTORY

export const findListTicketGuest = async ({
  pageIndex,
  pageSize,
  q,
  tkgr_priority,
  tkgr_status,
  tkgr_type,
  tkgr_user_id = 0
}: {
  pageIndex: number
  pageSize: number
  q: string
  tkgr_priority: string
  tkgr_status: string
  tkgr_type: string
  tkgr_user_id: number
}) => {
  const res: IBackendRes<IModelPaginate<ITicketGuestRestaurant>> = await sendRequest({
    url: `${URL_SERVER_TICKET}/ticket-guest-restaurant/get-ticket-guest`,
    method: 'GET',
    queryParams: {
      pageIndex,
      pageSize,
      q,
      tkgr_priority,
      tkgr_status,
      tkgr_type,
      tkgr_user_id
    }
  })

  return res
}

export const createTicketReplice = async (data: ITicketGuestRestaurantReplice) => {
  const res: IBackendRes<ITicketGuestRestaurantReplice> = await sendRequest({
    url: `${URL_SERVER_TICKET}/tick-guest-restaurant-replices/guest-reply`,
    method: 'POST',
    body: data
  })
  return res
}

export const getInformationTicket = async (id: string) => {
  const res: IBackendRes<ITicketGuestRestaurant> = await sendRequest({
    url: `${URL_SERVER_TICKET}/ticket-guest-restaurant/get-ticket-restaurants/${id}`,
    method: 'GET'
  })

  return res
}

export const getTicketReplice = async (tkgr_id: string) => {
  const res: IBackendRes<ITicketGuestRestaurantReplice[]> = await sendRequest({
    url: `${URL_SERVER_TICKET}/tick-guest-restaurant-replices`,
    method: 'GET',
    queryParams: {
      tkgr_id
    }
  })

  return res
}

export const closeTicket = async (id: string) => {
  const res: IBackendRes<ITicketGuestRestaurant> = await sendRequest({
    url: `${URL_SERVER_TICKET}/ticket-guest-restaurant/close-ticket/${id}`,
    method: 'PUT'
  })

  return res
}
