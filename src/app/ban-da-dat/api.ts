'use server'

import { sendRequest } from '@/lib/api'
import { ICreateBookTable } from '../nha-hang/api'

export const getListTableOrder = async () => {
  const res: IBackendRes<ICreateBookTable[]> = await sendRequest({
    url: `${process.env.URL_SERVER}/book-table/list-order-guest`,
    method: 'GET'
  })
  return res
}
