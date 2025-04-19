'use server'

import { sendRequest } from "@/lib/api"
import { cookies } from "next/headers"

export const confirmSync = async ({ token }: { token: string }) => {
  const res: IBackendRes<string> = await sendRequest({
    url: `${process.env.URL_SERVER_ORDER}/sync/sync-verify-token`,
    method: 'POST',
    body: { token }
  })
  return res
}

export const setIdUserGuest = async (id_user_guest: string) => {
  const cookie = await cookies()
  await cookie.set('id_user_guest', id_user_guest, {
    path: '/',
    maxAge: 60 * 60 * 24 * 365 * 10,
  })
}