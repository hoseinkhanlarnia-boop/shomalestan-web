'use client'
import Link from 'next/link'
import { useState } from 'react'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl">🌿</span>
          <span className="text-xl font-bold text-primary-700">شمالستان</span>
        </Link>
        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
          <Link href="/" className="hover:text-primary-600 transition-colors">خانه</Link>
          <Link href="/properties" className="hover:text-primary-600 transition-colors">اقامتگاه‌ها</Link>
          <Link href="/register" className="btn-primary text-sm">ثبت اقامتگاه</Link>
        </div>
        <button className="md:hidden" onClick={() => setOpen(!open)}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={open ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'} />
          </svg>
        </button>
      </div>
      {open && (
        <div className="md:hidden px-4 pb-4 flex flex-col gap-3 text-sm font-medium text-gray-600">
          <Link href="/" onClick={() => setOpen(false)} className="hover:text-primary-600">خانه</Link>
          <Link href="/properties" onClick={() => setOpen(false)} className="hover:text-primary-600">اقامتگاه‌ها</Link>
          <Link href="/register" onClick={() => setOpen(false)} className="btn-primary text-center">ثبت اقامتگاه</Link>
        </div>
      )}
    </nav>
  )
}
