import { supabaseAdmin } from '@/lib/supabase'
import { Property } from '@/lib/types'
import AdminClient from './AdminClient'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export default async function AdminPage() {
  const cookieStore = cookies()
  const auth = cookieStore.get('admin_auth')
  if (auth?.value !== process.env.ADMIN_PASSWORD) redirect('/admin/login')

  const { data: pending } = await supabaseAdmin.from('properties').select('*').eq('status', 'pending').order('created_at', { ascending: false })
  const { data: approved } = await supabaseAdmin.from('properties').select('*').eq('status', 'approved').order('created_at', { ascending: false })
  const { data: rejected } = await supabaseAdmin.from('properties').select('*').eq('status', 'rejected').order('created_at', { ascending: false })

  return <AdminClient pending={pending || []} approved={approved || []} rejected={rejected || []} />
}
