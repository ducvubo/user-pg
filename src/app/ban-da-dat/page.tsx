import React from 'react'
import HeaderPato from '../home/_component/HeaderPato'
import Footer from '../home/_component/Footer'
import PageOrderTable from './_component/PageBookTable'
import { getListBookTable } from './api'
import { ICreateBookTable } from '../nha-hang/api'

export default async function page() {
  return (
    <>
      <HeaderPato />
      <PageOrderTable />
      <Footer />
    </>
  )
}
