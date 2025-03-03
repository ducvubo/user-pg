'use server'

import { sendRequest } from '@/lib/api'
import { ICreateBookTable } from '../nha-hang/api'

export const confirmBookTable = async (token: string) => {
  const res: IBackendRes<ICreateBookTable> = await sendRequest({
    url: `${process.env.URL_SERVER}/book-table/confirm`,
    method: 'PATCH',
    body: { token }
  })
  return res
}
