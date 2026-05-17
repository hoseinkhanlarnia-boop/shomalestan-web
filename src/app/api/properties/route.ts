import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { data, error } = await supabaseAdmin
    .from('properties')
    .insert({ ...body, status: 'pending' })
    .select()
    .single()

  if (error) return NextResponse.json({ error }, { status: 400 })

  // اطلاع به ادمین تلگرام
  const token = process.env.TELEGRAM_BOT_TOKEN
  const adminId = process.env.ADMIN_ID
  if (token && adminId) {
    const msg = `🏡 اقامتگاه جدید از سایت:\n\n👤 ${body.name}\n📞 ${body.phone}\n📍 ${body.province} - ${body.city}\n🏡 ${body.village}\n🏠 ${body.property_type}\n📝 ${body.description}`
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: adminId,
        text: msg,
        reply_markup: {
          inline_keyboard: [[
            { text: '✅ تایید', callback_data: `approve_${data.id}_0` },
            { text: '❌ رد', callback_data: `reject_${data.id}_0` },
          ]]
        }
      })
    })
  }

  return NextResponse.json({ success: true })
}
