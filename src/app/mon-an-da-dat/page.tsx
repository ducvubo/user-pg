import React, { Suspense } from 'react'
import PageListOrderFood from './_component/PageListOrderFood'

export default function page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PageListOrderFood />
    </Suspense>
  )
}
