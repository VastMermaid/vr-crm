'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const { error } = await supabase.auth.signInWithOtp({ email })
    setLoading(false)
    if (error) setError(error.message)
    else setSent(true)
  }

  return (
    <main className="min-h-screen grid place-items-center p-6">
      <form onSubmit={onSubmit} className="w-full max-w-sm space-y-3">
        <h1 className="text-2xl font-semibold">Sign in</h1>
        <input
          className="w-full rounded-xl border px-3 py-2"
          type="email"
          placeholder="you@company.com"
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
          required
        />
        <button className="rounded-xl border px-4 py-2" disabled={loading} type="submit">
          {loading ? 'Sending…' : 'Send magic link'}
        </button>
        {sent && <p>Check your email for the magic link.</p>}
        {error && <p className="text-red-600">{error}</p>}
      </form>
    </main>
  )
}
