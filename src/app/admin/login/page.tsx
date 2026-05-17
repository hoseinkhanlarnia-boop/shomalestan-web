'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLogin() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const login = async () => {
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })
    if (res.ok) router.push('/admin')
    else setError('رمز عبور اشتباه است')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white rounded-2xl shadow-sm border p-8 w-full max-w-sm">
        <h1 className="text-xl font-bold text-gray-800 mb-6 text-center">🌿 ورود به پنل ادمین</h1>
        <input
          type="password"
          className="input mb-3"
          placeholder="رمز عبور"
          value={password}
          onChange={e => setPassword(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && login()}
        />
        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
        <button onClick={login} className="btn-primary w-full">ورود</button>
      </div>
    </div>
  )
}
