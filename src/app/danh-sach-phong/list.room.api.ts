'use server'

import { sendRequest } from "@/lib/api"
import { IRoom } from "../nha-hang/api"

export const getListRoomPagination = async (pageIndex: number, pageSize: number) => {
  const res: IBackendRes<IModelPaginate<IRoom>> = await sendRequest({
    url: `${process.env.URL_SERVER_ROOM}/rooms/list-room-by-all`,
    method: 'GET',
    queryParams: {
      pageIndex,
      pageSize
    },
  })
  return res
}