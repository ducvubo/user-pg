import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { Toaster } from '@/components/ui/toaster'
import { cookies } from 'next/headers'
import { v4 as uuidv4 } from 'uuid'
import Head from 'next/head'
import Script from 'next/script'
import ChatBubble from './chat-bot/ChatBubble'
import HeaderPato from './home/_component/HeaderPato'
import Footer from './home/_component/Footer'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin']
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin']
})

export const metadata: Metadata = {
  title: 'PATO - Tìm Nhà Hàng, Đặt Đồ Ăn & Đặt Bàn Online',
  description:
    'Khám phá nhà hàng gần bạn, đặt đồ ăn giao tận nơi và đặt bàn dễ dàng với PATO. Trải nghiệm dịch vụ tiện lợi, nhanh chóng!',
  keywords: 'tìm nhà hàng, đặt đồ ăn online, đặt bàn nhà hàng, PATO, giao đồ ăn nhanh',
  robots: 'index, follow',
  openGraph: {
    title: 'PATO - Tìm Nhà Hàng & Đặt Đồ Ăn Online',
    description: 'PATO giúp bạn tìm nhà hàng, đặt món ăn yêu thích và đặt bàn chỉ trong vài bước đơn giản.',
    url: 'https://pato.taphoaictu.id.vn',
    siteName: 'PATO',
    images: [
      {
        url: 'https://res.cloudinary.com/dkjasvlw6/image/upload/v1741005120/default/jjkajlyw8vrdtdg7ut06.webp',
        width: 1200,
        height: 630,
        alt: 'PATO - Dịch vụ đặt đồ ăn và đặt bàn'
      }
    ],
    locale: 'vi_VN',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PATO - Tìm Nhà Hàng & Đặt Đồ Ăn',
    description: 'Tìm kiếm nhà hàng, đặt đồ ăn và đặt bàn dễ dàng với PATO.',
    images: 'https://res.cloudinary.com/dkjasvlw6/image/upload/v1741005120/default/jjkajlyw8vrdtdg7ut06.webp'
  }
}

// Separate viewport export
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1.0
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
        <meta name='google-site-verification' content='Bd48HYijKgYynfqfE4fam-SCg9wRi0nA1xx7teY2PpM' />
        <link rel='icon' href='/logo.ico' />
      </Head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <HeaderPato />
        <Toaster />
        {children}
        <ChatBubble />
        <Footer />
      </body>
      <Script src='https://www.googletagmanager.com/gtag/js?id=G-84N3NEETJF' strategy='afterInteractive' />
      <Script
        id='gtag-init'
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
