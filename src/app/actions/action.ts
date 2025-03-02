'use server'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { v4 as uuidv4 } from 'uuid'
export async function deleteCookiesAndRedirect() {
  ;(await cookies()).delete('access_token_rtr')
  ;(await cookies()).delete('refresh_token_rtr')
  ;(await cookies()).delete('access_token_epl')
  ;(await cookies()).delete('refresh_token_epl')
  ;(await cookies()).delete('access_token')
  ;(await cookies()).delete('refresh_token')

  redirect('/auth/login')
}

export async function deleteCookiesAndRedirectGuest() {
  ;(await cookies()).delete('access_token_guest')
  ;(await cookies()).delete('refresh_token_guest')
  redirect('/')
}

export const getCookie = async (name: string) => {
  return (await cookies()).get(name)?.value
}

