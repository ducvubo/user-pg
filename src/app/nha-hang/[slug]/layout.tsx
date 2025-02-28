import Header from '@/app/components/Header'

export default function DemoLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      {children}
    </>
  )
}
