import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { cookies } from 'next/headers'

export async function POST(req: NextRequest) {
  const cookieStore = cookies()
  const auth = cookieStore.get('admin_auth')
  if (auth?.value !== process.env.ADMIN_PASSWORD)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id, status } = await req.json()
  const { error } = await supabaseAdmin.from('properties').update({ status }).eq('id', id)
  if (error) return NextResponse.json({ error }, { status: 400 })
  return NextResponse.json({ success: true })
}

export async function PATCH(req: NextRequest) {
  const cookieStore = cookies()
  const auth = cookieStore.get('admin_auth')
  if (auth?.value !== process.env.ADMIN_PASSWORD)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id, ...data } = await req.json()
  const { error } = await supabaseAdmin.from('properties').update(data).eq('id', id)
  if (error) return NextResponse.json({ error }, { status: 400 })
  return NextResponse.json({ success: true })
}
