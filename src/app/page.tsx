'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function Home() {
  const [authed, setAuthed] = useState<boolean | null>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setAuthed(!!data.session))
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setAuthed(!!s))
    return () => { sub.subscription.unsubscribe() }
  }, [])

  if (authed === null) return <main className="p-6">Loading…</main>
  if (!authed) { if (typeof window !== 'undefined') window.location.href = '/login'; return null }

  return (
    <main className="p-6">
      <h1 className="text-2xl font-semibold">VR CRM</h1>
      <p className="opacity-70">You’re signed in. Tiles/search come next.</p>
    </main>
  )
}
