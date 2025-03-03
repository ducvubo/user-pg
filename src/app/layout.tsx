import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { Toaster } from '@/components/ui/toaster'
import { cookies } from 'next/headers'
import { v4 as uuidv4 } from 'uuid'
import Head from 'next/head'
import Script from 'next/script'
const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin']
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin']
})

export const metadata: Metadata = {
  title: 'PG - Tìm Nhà Hàng, Đặt Đồ Ăn & Đặt Bàn Online',
  description:
    'Khám phá nhà hàng gần bạn, đặt đồ ăn giao tận nơi và đặt bàn dễ dàng với PG. Trải nghiệm dịch vụ tiện lợi, nhanh chóng!',
  keywords: 'tìm nhà hàng, đặt đồ ăn online, đặt bàn nhà hàng, PG, giao đồ ăn nhanh',
  robots: 'index, follow',
  viewport: 'width=device-width, initial-scale=1.0',
  openGraph: {
    title: 'PG - Tìm Nhà Hàng & Đặt Đồ Ăn Online',
    description: 'PG giúp bạn tìm nhà hàng, đặt món ăn yêu thích và đặt bàn chỉ trong vài bước đơn giản.',
    url: 'https://pato.taphoaictu.id.vn',
    siteName: 'PG',
    images: [
      {
        url: 'https://res.cloudinary.com/dkjasvlw6/image/upload/v1741005120/default/jjkajlyw8vrdtdg7ut06.webp',
        width: 1200,
        height: 630,
        alt: 'PG - Dịch vụ đặt đồ ăn và đặt bàn'
      }
    ],
    locale: 'vi_VN',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PG - Tìm Nhà Hàng & Đặt Đồ Ăn',
    description: 'Tìm kiếm nhà hàng, đặt đồ ăn và đặt bàn dễ dàng với PG.',
    images: 'https://res.cloudinary.com/dkjasvlw6/image/upload/v1741005120/default/jjkajlyw8vrdtdg7ut06.webp'
  }
}

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='vi'>
      <Head>
        <meta charSet='UTF-8' />
        <meta name='viewport' content='width=device-width, initial-scale=1.0' />
        <meta name='robots' content='index, follow' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Toaster />
        {children}
      </body>
      <Script
        src='https://www.googletagmanager.com/gtag/js?id=G-84N3NEETJF'
        strategy='afterInteractive' // Tải script sau khi trang đã tương tác được
      />
      <Script
        id='gtag-init' // Cần id để Next.js quản lý script
        strategy='afterInteractive'
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-84N3NEETJF');
          `
        }}
      />
    </html>
  )
}
