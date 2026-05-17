'use client'
import { useState } from 'react'
import Navbar from '@/components/Navbar'

const PROVINCES: Record<string, string[]> = {
  'مازندران': ['ساری','آمل','بابل','نوشهر','چالوس','رامسر','تنکابن','بابلسر','محمودآباد','نور'],
  'گیلان': ['رشت','بندر انزلی','لاهیجان','لنگرود','آستانه اشرفیه','رودبار','فومن','صومعه‌سرا','ماسال','تالش'],
  'گلستان': ['گرگان','گنبد کاووس','علی‌آباد کتول','بندر ترکمن','کردکوی','بندر گز','رامیان','آزادشهر','مینودشت','گالیکش'],
}
const TYPES = ['🏕 کلبه','🏊 ویلا استخردار','🏔 کلبه سوئیسی','🏡 خانه روستایی','🛁 ویلا با جکوزی','🌿 ویلا ییلاقی']
const AMENITIES = ['🚗 پارکینگ','🔥 سیستم گرمایشی','❄️ سیستم سرمایشی','📺 تلویزیون','🛋 مبلمان','💧 آب لوله‌کشی','💡 برق و روشنایی','🗄 کمد','🧊 یخچال','🍳 اجاق گاز','🍽 وسایل آشپزخونه','🔥 کباب‌پز','🚿 حمام','🚽 توالت ایرانی','🧴 اقلام بهداشتی','🚻 توالت فرنگی','🌐 اینترنت','📞 تلفن ثابت','👕 ماشین لباسشویی','🏊 استخر','🛁 جکوزی','🧖 سونا','🎱 میز بیلیارد']

export default function RegisterPage() {
  const [form, setForm] = useState({
    name:'', phone:'', province:'', city:'', village:'',
    property_type:'', description:'', capacity:'', rooms:'',
    area:'', price_from:'', price_to:'', amenities:[] as string[],
  })
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))
  const toggleAmenity = (a: string) => setForm(f => ({
    ...f,
    amenities: f.amenities.includes(a) ? f.amenities.filter(x => x !== a) : [...f.amenities, a]
  }))

  const submit = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/properties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          amenities: form.amenities.join(' | '),
          status: 'pending',
          user_id: 0,
        }),
      })
      if (!res.ok) throw new Error()
      setDone(true)
    } catch {
      setError('خطایی رخ داد. لطفاً دوباره امتحان کنید.')
    }
    setLoading(false)
  }

  if (done) return (
    <div className="min-h-screen"><Navbar />
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <div className="text-6xl mb-4">🎉</div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">ثبت شد!</h1>
        <p className="text-gray-500">اقامتگاه شما پس از بررسی منتشر می‌شود.</p>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen"><Navbar />
      <div className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">ثبت اقامتگاه</h1>

        {/* Progress */}
        <div className="flex gap-2 mb-8">
          {[1,2,3,4].map(s => (
            <div key={s} className={`h-1.5 flex-1 rounded-full ${step >= s ? 'bg-primary-500' : 'bg-gray-200'}`} />
          ))}
        </div>

        {step === 1 && (
          <div className="space-y-4">
            <h2 className="font-semibold text-gray-700 mb-4">اطلاعات مالک</h2>
            <div>
              <label className="label">نام و نام خانوادگی</label>
              <input className="input" value={form.name} onChange={e => set('name', e.target.value)} placeholder="علی محمدی" />
            </div>
            <div>
              <label className="label">شماره تماس</label>
              <input className="input" value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="09xxxxxxxxx" dir="ltr" />
            </div>
            <button onClick={() => setStep(2)} disabled={!form.name || !form.phone} className="btn-primary w-full mt-4">مرحله بعد</button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <h2 className="font-semibold text-gray-700 mb-4">مشخصات اقامتگاه</h2>
            <div>
              <label className="label">استان</label>
              <select className="input" value={form.province} onChange={e => { set('province', e.target.value); set('city', '') }}>
                <option value="">انتخاب کنید</option>
                {Object.keys(PROVINCES).map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label className="label">شهر</label>
              <select className="input" value={form.city} onChange={e => set('city', e.target.value)} disabled={!form.province}>
                <option value="">انتخاب کنید</option>
                {(PROVINCES[form.province] || []).map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="label">روستا / محل</label>
              <input className="input" value={form.village} onChange={e => set('village', e.target.value)} placeholder="نام دقیق روستا" />
            </div>
            <div>
              <label className="label">نوع اقامتگاه</label>
              <div className="grid grid-cols-2 gap-2">
                {TYPES.map(t => (
                  <button key={t} onClick={() => set('property_type', t)}
                    className={`py-2 px-3 rounded-lg border text-sm text-right transition-colors ${form.property_type === t ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-gray-200 text-gray-600'}`}>
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setStep(1)} className="btn-outline flex-1">قبلی</button>
              <button onClick={() => setStep(3)} disabled={!form.province || !form.city || !form.village || !form.property_type} className="btn-primary flex-1">بعدی</button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <h2 className="font-semibold text-gray-700 mb-4">جزئیات</h2>
            <div>
              <label className="label">توضیحات</label>
              <textarea className="input h-24" value={form.description} onChange={e => set('description', e.target.value)} placeholder="توضیح کوتاهی از اقامتگاه..." />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="label">ظرفیت (نفر)</label>
                <input className="input" type="number" value={form.capacity} onChange={e => set('capacity', e.target.value)} placeholder="8" />
              </div>
              <div>
                <label className="label">خواب</label>
                <input className="input" type="number" value={form.rooms} onChange={e => set('rooms', e.target.value)} placeholder="2" />
              </div>
              <div>
                <label className="label">متراژ</label>
                <input className="input" type="number" value={form.area} onChange={e => set('area', e.target.value)} placeholder="120" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label">قیمت از (تومان)</label>
                <input className="input" type="number" value={form.price_from} onChange={e => set('price_from', e.target.value)} placeholder="1000000" />
              </div>
              <div>
                <label className="label">قیمت تا (تومان)</label>
                <input className="input" type="number" value={form.price_to} onChange={e => set('price_to', e.target.value)} placeholder="1500000" />
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setStep(2)} className="btn-outline flex-1">قبلی</button>
              <button onClick={() => setStep(4)} disabled={!form.description || !form.capacity} className="btn-primary flex-1">بعدی</button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4">
            <h2 className="font-semibold text-gray-700 mb-2">امکانات</h2>
            <p className="text-xs text-gray-500 mb-3">🟢 یک بار بزنید اضافه — 🔴 دوباره بزنید حذف</p>
            <div className="flex flex-wrap gap-2">
              {AMENITIES.map(a => (
                <button key={a} onClick={() => toggleAmenity(a)}
                  className={`text-sm px-3 py-1.5 rounded-full border transition-colors ${form.amenities.includes(a) ? 'bg-primary-500 text-white border-primary-500' : 'border-gray-200 text-gray-600'}`}>
                  {a}
                </button>
              ))}
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <div className="flex gap-2 mt-4">
              <button onClick={() => setStep(3)} className="btn-outline flex-1">قبلی</button>
              <button onClick={submit} disabled={loading} className="btn-primary flex-1">
                {loading ? 'در حال ثبت...' : '✅ ثبت اقامتگاه'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
