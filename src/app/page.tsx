import { supabase } from '@/lib/supabase'
import { Property } from '@/lib/types'
import Navbar from '@/components/Navbar'
import PropertyCard from '@/components/PropertyCard'
import Link from 'next/link'

const PROVINCES = ['مازندران', 'گیلان', 'گلستان']
const TYPES = ['🏕 کلبه', '🏊 ویلا استخردار', '🏔 کلبه سوئیسی', '🏡 خانه روستایی', '🛁 ویلا با جکوزی', '🌿 ویلا ییلاقی']

export const revalidate = 60

export default async function Home({
  searchParams,
}: {
  searchParams: { q?: string; province?: string; type?: string }
}) {
  let query = supabase.from('properties').select('*').eq('status', 'approved').order('created_at', { ascending: false })

  if (searchParams.q) query = query.ilike('description', `%${searchParams.q}%`)
  if (searchParams.province) query = query.eq('province', searchParams.province)
  if (searchParams.type) query = query.eq('property_type', searchParams.type)

  const { data: properties } = await query.limit(20)

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero */}
      <section className="bg-gradient-to-b from-primary-700 to-primary-600 text-white py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">🌿 شمالستان</h1>
          <p className="text-primary-100 mb-8 text-lg">بهترین اقامتگاه‌های شمال ایران، بدون واسطه</p>

          {/* Search */}
          <form method="GET" className="bg-white rounded-2xl p-2 flex gap-2 shadow-xl">
            <input
              name="q"
              defaultValue={searchParams.q}
              placeholder="جستجو کنید..."
              className="flex-1 px-4 py-2 text-gray-800 text-sm outline-none rounded-xl"
            />
            <button type="submit" className="btn-primary rounded-xl px-6">جستجو</button>
          </form>
        </div>
      </section>

      {/* Filters */}
      <section className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="text-sm font-medium text-gray-500 ml-2 self-center">استان:</span>
          <Link href="/" className={`text-sm px-3 py-1 rounded-full border transition-colors ${!searchParams.province ? 'bg-primary-600 text-white border-primary-600' : 'border-gray-200 text-gray-600 hover:border-primary-400'}`}>همه</Link>
          {PROVINCES.map(p => (
            <Link key={p} href={`/?province=${p}${searchParams.q ? `&q=${searchParams.q}` : ''}`}
              className={`text-sm px-3 py-1 rounded-full border transition-colors ${searchParams.province === p ? 'bg-primary-600 text-white border-primary-600' : 'border-gray-200 text-gray-600 hover:border-primary-400'}`}>
              {p}
            </Link>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          <span className="text-sm font-medium text-gray-500 ml-2 self-center">نوع:</span>
          {TYPES.map(t => (
            <Link key={t} href={`/?type=${encodeURIComponent(t)}${searchParams.province ? `&province=${searchParams.province}` : ''}`}
              className={`text-sm px-3 py-1 rounded-full border transition-colors ${searchParams.type === t ? 'bg-primary-600 text-white border-primary-600' : 'border-gray-200 text-gray-600 hover:border-primary-400'}`}>
              {t}
            </Link>
          ))}
        </div>
      </section>

      {/* Properties Grid */}
      <section className="max-w-6xl mx-auto px-4 pb-16">
        {properties && properties.length > 0 ? (
          <>
            <p className="text-sm text-gray-500 mb-4">{properties.length} اقامتگاه یافت شد</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {properties.map((p: Property) => <PropertyCard key={p.id} prop={p} />)}
            </div>
          </>
        ) : (
          <div className="text-center py-20 text-gray-400">
            <div className="text-6xl mb-4">🏕</div>
            <p className="text-lg">اقامتگاهی یافت نشد</p>
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-400 text-center py-8 text-sm">
        <p className="mb-2 text-white font-medium">🌿 شمالستان</p>
        <p>مرجع معرفی اقامتگاه‌های شمال ایران</p>
        <div className="mt-3 flex justify-center gap-4">
          <a href="https://t.me/shomallestan" className="hover:text-white transition-colors">تلگرام</a>
          <a href="https://www.instagram.com/shomallestan/" className="hover:text-white transition-colors">اینستاگرام</a>
        </div>
      </footer>
    </div>
  )
}
