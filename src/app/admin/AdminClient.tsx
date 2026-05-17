'use client'
import { useState } from 'react'
import { Property } from '@/lib/types'

function formatPrice(p: string) {
  if (!p) return '-'
  return Number(p).toLocaleString('fa-IR') + ' تومان'
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-700',
    approved: 'bg-green-100 text-green-700',
    rejected: 'bg-red-100 text-red-700',
  }
  const label: Record<string, string> = { pending: 'در انتظار', approved: 'تایید شده', rejected: 'رد شده' }
  return <span className={`text-xs px-2 py-1 rounded-full font-medium ${map[status]}`}>{label[status]}</span>
}

function PropertyRow({ prop, onAction }: { prop: Property; onAction: () => void }) {
  const [loading, setLoading] = useState(false)
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({ description: prop.description, price_from: prop.price_from, price_to: prop.price_to })

  const action = async (status: string) => {
    setLoading(true)
    await fetch('/api/admin', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: prop.id, status }) })
    onAction()
    setLoading(false)
  }

  const save = async () => {
    setLoading(true)
    await fetch('/api/admin', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: prop.id, ...form }) })
    setEditing(false)
    onAction()
    setLoading(false)
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-semibold text-gray-800">{prop.village} — {prop.city}</h3>
          <p className="text-xs text-gray-500">{prop.province} | {prop.property_type}</p>
        </div>
        <StatusBadge status={prop.status} />
      </div>
      <div className="text-sm text-gray-600 space-y-1 mb-3">
        <p>👤 {prop.name} | 📞 {prop.phone}</p>
        <p>👥 {prop.capacity} نفر | 🛏 {prop.rooms} خواب | 📐 {prop.area} متر</p>
        <p>💰 از {formatPrice(prop.price_from)} تا {formatPrice(prop.price_to)}</p>
      </div>

      {editing ? (
        <div className="space-y-2 mb-3">
          <textarea className="w-full border rounded-lg p-2 text-sm" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3} />
          <div className="grid grid-cols-2 gap-2">
            <input className="border rounded-lg p-2 text-sm" value={form.price_from} onChange={e => setForm(f => ({ ...f, price_from: e.target.value }))} placeholder="قیمت از" />
            <input className="border rounded-lg p-2 text-sm" value={form.price_to} onChange={e => setForm(f => ({ ...f, price_to: e.target.value }))} placeholder="قیمت تا" />
          </div>
          <div className="flex gap-2">
            <button onClick={save} disabled={loading} className="bg-primary-600 text-white text-sm px-3 py-1.5 rounded-lg">ذخیره</button>
            <button onClick={() => setEditing(false)} className="border text-sm px-3 py-1.5 rounded-lg">انصراف</button>
          </div>
        </div>
      ) : (
        <p className="text-sm text-gray-600 mb-3">{prop.description}</p>
      )}

      <div className="flex gap-2 flex-wrap">
        {prop.status !== 'approved' && (
          <button onClick={() => action('approved')} disabled={loading} className="bg-green-500 text-white text-xs px-3 py-1.5 rounded-lg">✅ تایید</button>
        )}
        {prop.status !== 'rejected' && (
          <button onClick={() => action('rejected')} disabled={loading} className="bg-red-500 text-white text-xs px-3 py-1.5 rounded-lg">❌ رد</button>
        )}
        {prop.status !== 'pending' && (
          <button onClick={() => action('pending')} disabled={loading} className="bg-yellow-500 text-white text-xs px-3 py-1.5 rounded-lg">⏳ معلق</button>
        )}
        <button onClick={() => setEditing(!editing)} className="bg-gray-100 text-gray-700 text-xs px-3 py-1.5 rounded-lg">✏️ ویرایش</button>
      </div>
    </div>
  )
}

export default function AdminClient({ pending, approved, rejected }: { pending: Property[]; approved: Property[]; rejected: Property[] }) {
  const [tab, setTab] = useState<'pending' | 'approved' | 'rejected'>('pending')
  const [, setRefresh] = useState(0)
  const refresh = () => { setRefresh(r => r + 1); window.location.reload() }

  const lists = { pending, approved, rejected }
  const current = lists[tab]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-800">🌿 پنل ادمین شمالستان</h1>
        <a href="/" className="text-sm text-primary-600 hover:underline">بازگشت به سایت</a>
      </div>

      {/* Stats */}
      <div className="max-w-5xl mx-auto px-4 py-6 grid grid-cols-3 gap-4">
        <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-4 text-center cursor-pointer" onClick={() => setTab('pending')}>
          <div className="text-2xl font-bold text-yellow-600">{pending.length}</div>
          <div className="text-sm text-yellow-700">در انتظار</div>
        </div>
        <div className="bg-green-50 border border-green-100 rounded-xl p-4 text-center cursor-pointer" onClick={() => setTab('approved')}>
          <div className="text-2xl font-bold text-green-600">{approved.length}</div>
          <div className="text-sm text-green-700">تایید شده</div>
        </div>
        <div className="bg-red-50 border border-red-100 rounded-xl p-4 text-center cursor-pointer" onClick={() => setTab('rejected')}>
          <div className="text-2xl font-bold text-red-600">{rejected.length}</div>
          <div className="text-sm text-red-700">رد شده</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex gap-2 mb-4">
          {(['pending','approved','rejected'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`text-sm px-4 py-2 rounded-lg font-medium transition-colors ${tab === t ? 'bg-primary-600 text-white' : 'bg-white text-gray-600 border'}`}>
              {t === 'pending' ? 'در انتظار' : t === 'approved' ? 'تایید شده' : 'رد شده'}
            </button>
          ))}
        </div>

        <div className="space-y-3 pb-10">
          {current.length === 0 ? (
            <div className="text-center py-10 text-gray-400">موردی وجود ندارد</div>
          ) : (
            current.map(p => <PropertyRow key={p.id} prop={p} onAction={refresh} />)
          )}
        </div>
      </div>
    </div>
  )
}
