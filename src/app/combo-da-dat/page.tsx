import React, { Suspense } from 'react'
import PageListOrderFoodCombo from './_component/PageListOrderFoodCombo'

export default function page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PageListOrderFoodCombo />
    </Suspense>
  )
}
