import React from 'react'
import { getFoodCart, getFoodComboCart } from './cart.api'
import PageCart from './_compoenent/PageCart'

export default async function page() {
  const foodCart = await getFoodCart()
  const foodComboCart = await getFoodComboCart()
  return (
    <PageCart foodCart={foodCart.data || []} foodComboCart={foodComboCart.data || []} />
  )
}
