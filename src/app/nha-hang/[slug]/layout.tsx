import Header from '@/app/home/_component/Header'

export default function DemoLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      {children}
    </>
  )
}
