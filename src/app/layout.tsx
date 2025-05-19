import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { Toaster } from '@/components/ui/toaster'
import HeaderPato from './home/_component/HeaderPato'
import Footer from './home/_component/Footer'
import Script from 'next/script'
import ChatBubble from './chat-bot/ChatBubble'

const geistSans = Geist({
  subsets: ['latin'],
  variable: '--font-geist-sans'
})

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono'
})

export const metadata: Metadata = {
  title: 'PATO - Nhà Hàng Nướng Lẩu Tại Lục Nam Bắc Giang | Đặt Bàn, Gọi Món Online',
  description: 'PATO - Nhà hàng nướng than hoa, lẩu đa dạng tại TT Đồi Ngô, Lục Nam, Bắc Giang. Đặt bàn nhanh, gọi món online thuận tiện cho gia đình & nhóm bạn.',
  keywords: 'nhà hàng PATO, nướng Bắc Giang, lẩu ngon Lục Nam, đặt bàn nhà hàng, gọi món online, nhà hàng gia đình',
  robots: 'index, follow',
  openGraph: {
    title: 'PATO - Nhà Hàng Nướng & Lẩu Tại Bắc Giang',
    description: 'Trải nghiệm món nướng than hoa, lẩu đậm vị tại PATO. Phục vụ tại chỗ, đặt bàn, gọi món online dễ dàng.',
    url: 'https://pato.taphoaictu.id.vn',
    siteName: 'PATO Nhà Hàng',
    images: [
      {
        url: 'https://res.cloudinary.com/dkjasvlw6/image/upload/v1741005120/default/jjkajlyw8vrdtdg7ut06.webp',
        width: 1200,
        height: 630,
        alt: 'PATO - Nhà hàng nướng và lẩu tại Lục Nam Bắc Giang'
      }
    ],
    locale: 'vi_VN',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PATO - Nhà Hàng Nướng & Lẩu | Đặt Bàn, Gọi Món Từ Xa',
    description: 'PATO phục vụ nướng lẩu ngon tại Bắc Giang. Đặt bàn trước, gọi món online dễ dàng. Phù hợp nhóm bạn & gia đình.',
    images: ['https://res.cloudinary.com/dkjasvlw6/image/upload/v1741005120/default/jjkajlyw8vrdtdg7ut06.webp']
  }
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1.0
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <head>
        <meta charSet="utf-8" />
        <meta name="author" content="PATO Nhà Hàng Nướng & Lẩu" />
        <meta name="theme-color" content="#ff5a3c" />
        <link rel="icon" href="/logo.ico" />
        <link rel="canonical" href="https://pato.taphoaictu.id.vn" />
        <meta name="geo.region" content="VN-BG" />
        <meta name="geo.placename" content="TT Đồi Ngô, Lục Nam, Bắc Giang" />
        <meta name="language" content="vi" />

        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Restaurant',
              name: 'PATO - Nhà Hàng Nướng & Lẩu',
              image: 'https://res.cloudinary.com/dkjasvlw6/image/upload/v1741005120/default/jjkajlyw8vrdtdg7ut06.webp',
              address: {
                '@type': 'PostalAddress',
                streetAddress: 'Số 16, Thị Trấn Đồi Ngô',
                addressLocality: 'Lục Nam',
                addressRegion: 'Bắc Giang',
                addressCountry: 'VN'
              },
              url: 'https://pato.taphoaictu.id.vn',
              servesCuisine: ['Nướng than hoa', 'Lẩu', 'Nướng không khói'],
              telephone: '+84-123-456-789',
              priceRange: '₫₫',
              openingHours: 'Mo-Su 10:00-22:00'
            })
          }}
        />
      </head>

      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <HeaderPato />
        <Toaster />
        {children}
        <ChatBubble />
        <Footer />

        {/* Google Analytics */}
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-84N3NEETJF" strategy="afterInteractive" />
        <Script
          id="gtag-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-84N3NEETJF');
            `
          }}
        />
      </body>
    </html>
  )
}
