import Image from 'next/image'
import HomePage from './home/_component/Home'

export default function Home() {
  return (
    <>
      {/* <HomePage /> */}
      <Image src="/api/view-image?bucket=default&file=1741785668480-c6f2711a-bdab-4369-9e0e-bf27d207320f.webp" alt="food" width={1920} height={1080} />
    </>
  )
}
