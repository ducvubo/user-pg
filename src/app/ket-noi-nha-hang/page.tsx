import React from 'react'
import HeaderPato from '../home/_component/HeaderPato'
import Footer from '../home/_component/Footer'
import PageConnect from './_component/PageConnect'
import { getCookie } from '../actions/action'

export default async function page() {
  const idUser = await getCookie('id_user_guest')

  return <>{idUser && <PageConnect idUser={idUser} />}</>
}
