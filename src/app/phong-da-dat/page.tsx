import React, { Suspense } from 'react'
import PageListBookRoom from './_component/PageListBookRoom'

export default function page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PageListBookRoom />
    </Suspense>
  )
}
