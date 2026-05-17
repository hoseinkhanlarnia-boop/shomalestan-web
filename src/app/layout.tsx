import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'شمالستان — اقامتگاه‌های شمال ایران',
  description: 'بهترین ویلاها و کلبه‌های شمال ایران بدون واسطه',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fa" dir="rtl">
      <body>{children}</body>
    </html>
  )
}
