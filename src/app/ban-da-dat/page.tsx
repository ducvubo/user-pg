import React from 'react'
import HeaderPato from '../home/_component/HeaderPato'
import Footer from '../home/_component/Footer'
import PageOrderTable from './_component/PageOrderTable'
import { getListTableOrder } from './api'
import { ICreateBookTable } from '../nha-hang/api'

export default async function page() {
  const listTableOrder: IBackendRes<ICreateBookTable[]> = await getListTableOrder()
  return (
    <>
      <HeaderPato />
      <PageOrderTable listTableOrder={listTableOrder} />
      <Footer />
    </>
  )
}
