import Footer from '@/app/home/_component/Footer'
import Header from '@/app/home/_component/Header'
import HeaderPato from '@/app/home/_component/HeaderPato'

export default function DemoLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <HeaderPato />
      {children}
      <Footer />
    </>
  )
}
