import React, { Suspense } from 'react'
import PageCheckOutCart from './_component/PageCheckOutCart'

interface PageProps {
  searchParams: Promise<{ [key: string]: string }>
}

async function Component({ searchParams }: PageProps) {
  const params = await searchParams
  return <PageCheckOutCart searchParams={params} />

}

export default function Page(props: PageProps) {
  return (
    <div>
      <Suspense>
        <Component {...props} />
      </Suspense>
    </div>
  )
}
