'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

const PROD_URL = 'https://vr-crm-six.vercel.app/'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    console.log('Email redirect =', PROD_URL) // sanity

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: PROD_URL },
    })

    setLoading(false)
    if (error) setError(error.message)
    else setSent(true)
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <form onSubmit={handleLogin} className="w-full max-w-sm space-y-4">
        <h1 className="text-2xl font-semibold text-center">Sign in</h1>

        {/* show the redirect value so we can eyeball it */}
        <p className="text-xs text-center opacity-60">redirect to: {PROD_URL}</p>

        <input
          className="w-full rounded-lg border px-3 py-2 text-black"
          type="email"
          placeholder="you@company.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button className="w-full rounded-lg border px-4 py-2" disabled={loading}>
          {loading ? 'Sending…' : 'Send Magic Link'}
        </button>
        {sent && <p className="text-center text-green-600">Check your email ✉️</p>}
        {error && <p className="text-center text-red-600">{error}</p>}
      </form>
    </main>
  )
}
