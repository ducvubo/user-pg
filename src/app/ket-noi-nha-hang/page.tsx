import React from 'react'
import PageConnect from './_component/PageConnect'
import { getCookie } from '../actions/action'

export default async function page() {
  const idUser = await getCookie('id_user_guest')

  return <>{idUser && <PageConnect idUser={idUser} />}</>
}
