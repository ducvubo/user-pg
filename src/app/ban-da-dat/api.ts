'use server'

import { sendRequest } from '@/lib/api'
import { ICreateBookTable } from '../nha-hang/api'

export const getListBookTable = async ({
  pageIndex,
  pageSize,
  q,
  status
}: {
  pageIndex?: number
  pageSize?: number
  q?: string
  status?: string
}) => {
  const res: IBackendRes<IModelPaginate<ICreateBookTable>> = await sendRequest({
    url: `${process.env.URL_SERVER}/book-table/list-order-guest`,
    method: 'GET',
    queryParams: {
      pageIndex,
      pageSize,
      q,
      status
    }
  })
  return res
}

export const guestCancelBookTable = async (id: string) => {
  const res: IBackendRes<ICreateBookTable> = await sendRequest({
    url: `${process.env.URL_SERVER}/book-table/guest-cancel/${id}`,
    method: 'PATCH'
  })
  return res
}

export const guestExceptionBookTable = async (id: string, book_tb_note: string) => {
  const res: IBackendRes<ICreateBookTable> = await sendRequest({
    url: `${process.env.URL_SERVER}/book-table/guest-exception/${id}`,
    method: 'PATCH',
    body: {
      book_tb_note
    }
  })
  return res
}

export const guestSendFeedback = async (id: string, book_tb_feedback: string, book_tb_star: string) => {
  const res: IBackendRes<ICreateBookTable> = await sendRequest({
    url: `${process.env.URL_SERVER}/book-table/guest-feedback/${id}`,
    method: 'PATCH',
    body: {
      book_tb_feedback,
      book_tb_star
    }
  })
  return res
}
