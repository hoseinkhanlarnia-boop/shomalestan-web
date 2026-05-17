import Link from 'next/link'
import { Property } from '@/lib/types'

function formatPrice(p: string) {
  if (!p) return '-'
  return Number(p).toLocaleString('fa-IR') + ' تومان'
}

export default function PropertyCard({ prop }: { prop: Property }) {
  let firstPhoto: string | null = null
  try {
    const media = JSON.parse(prop.media || '[]')
    const photo = media.find((m: string[]) => m[0] === 'photo')
    if (photo) firstPhoto = `https://api.telegram.org/file/bot${process.env.NEXT_PUBLIC_BOT_TOKEN}/${photo[1]}`
  } catch {}

  return (
    <Link href={`/properties/${prop.id}`} className="card block">
      <div className="relative h-48 bg-gradient-to-br from-primary-100 to-primary-200">
        {firstPhoto ? (
          <img src={firstPhoto} alt={prop.village} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl">🏡</div>
        )}
        <span className="absolute top-3 right-3 bg-white text-primary-700 text-xs font-medium px-2 py-1 rounded-full shadow">
          {prop.property_type}
        </span>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-gray-800 mb-1">{prop.village} — {prop.city}</h3>
        <p className="text-xs text-gray-500 mb-3">{prop.province}</p>
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>👥 {prop.capacity} نفر</span>
          <span>🛏 {prop.rooms} خواب</span>
          <span>📐 {prop.area} متر</span>
        </div>
        <div className="mt-3 pt-3 border-t border-gray-100 text-sm font-medium text-primary-600">
          از {formatPrice(prop.price_from)} شبی
        </div>
      </div>
    </Link>
  )
}
