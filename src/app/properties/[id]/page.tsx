import { supabase } from '@/lib/supabase'
import Navbar from '@/components/Navbar'
import { notFound } from 'next/navigation'

function formatPrice(p: string) {
  if (!p) return '-'
  return Number(p).toLocaleString('fa-IR') + ' تومان'
}

export default async function PropertyPage({ params }: { params: { id: string } }) {
  const { data: prop } = await supabase
    .from('properties')
    .select('*')
    .eq('id', params.id)
    .eq('status', 'approved')
    .single()

  if (!prop) notFound()

  let mediaList: string[][] = []
  try { mediaList = JSON.parse(prop.media || '[]') } catch {}

  const photos = mediaList.filter(m => m[0] === 'photo')
  const amenities = prop.amenities ? prop.amenities.split(' | ') : []

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="mb-6">
          <span className="bg-primary-100 text-primary-700 text-xs font-medium px-3 py-1 rounded-full">{prop.property_type}</span>
          <h1 className="text-2xl font-bold text-gray-800 mt-2">{prop.village} — {prop.city}</h1>
          <p className="text-gray-500 text-sm mt-1">📍 {prop.province}</p>
        </div>

        {/* Photos */}
        {photos.length > 0 && (
          <div className="grid grid-cols-2 gap-2 mb-6 rounded-2xl overflow-hidden">
            {photos.slice(0, 4).map((m, i) => (
              <div key={i} className={`${i === 0 && photos.length > 1 ? 'col-span-2' : ''} h-48 bg-gray-100`}>
                <img
                  src={`https://api.telegram.org/file/bot${process.env.NEXT_PUBLIC_BOT_TOKEN}/${m[1]}`}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        )}

        {/* Info */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="card p-4 text-center">
            <div className="text-2xl mb-1">👥</div>
            <div className="text-sm text-gray-500">ظرفیت</div>
            <div className="font-semibold">{prop.capacity} نفر</div>
          </div>
          <div className="card p-4 text-center">
            <div className="text-2xl mb-1">🛏</div>
            <div className="text-sm text-gray-500">خواب</div>
            <div className="font-semibold">{prop.rooms} اتاق</div>
          </div>
          <div className="card p-4 text-center">
            <div className="text-2xl mb-1">📐</div>
            <div className="text-sm text-gray-500">متراژ</div>
            <div className="font-semibold">{prop.area} متر</div>
          </div>
        </div>

        {/* Price */}
        <div className="card p-5 mb-6 bg-primary-50 border-primary-100">
          <h2 className="font-semibold text-gray-700 mb-2">💰 قیمت</h2>
          <p className="text-primary-700 font-bold text-lg">
            از {formatPrice(prop.price_from)} تا {formatPrice(prop.price_to)} — هر شب
          </p>
        </div>

        {/* Description */}
        <div className="card p-5 mb-6">
          <h2 className="font-semibold text-gray-700 mb-2">📝 توضیحات</h2>
          <p className="text-gray-600 leading-relaxed">{prop.description}</p>
        </div>

        {/* Amenities */}
        {amenities.length > 0 && (
          <div className="card p-5 mb-6">
            <h2 className="font-semibold text-gray-700 mb-3">✨ امکانات</h2>
            <div className="flex flex-wrap gap-2">
              {amenities.map((a: string, i: number) => (
                <span key={i} className="bg-gray-100 text-gray-700 text-xs px-3 py-1.5 rounded-full">{a}</span>
              ))}
            </div>
          </div>
        )}

        {/* Contact */}
        <div className="card p-5 bg-primary-600 text-white text-center">
          <h2 className="font-semibold text-lg mb-1">📞 تماس با مالک</h2>
          <p className="text-primary-100 text-sm mb-4">{prop.name}</p>
          <a
            href={`tel:${prop.phone}`}
            className="bg-white text-primary-700 font-bold py-3 px-8 rounded-xl inline-block hover:bg-primary-50 transition-colors"
          >
            {prop.phone}
          </a>
        </div>

      </div>
    </div>
  )
}
