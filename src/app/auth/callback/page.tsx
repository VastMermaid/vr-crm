'use client'
import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

export default function AuthCallback() {
  const router = useRouter()
  const params = useSearchParams()
  const [err, setErr] = useState<string | null>(null)

  useEffect(() => {
    const run = async () => {
      try {
        // Flow A: token_hash + type=magiclink (email template path)
        const token_hash = params.get('token_hash')
        const type = params.get('type')
        if (token_hash && type) {
          const { error } = await supabase.auth.verifyOtp({
            token_hash,
            type: type as 'magiclink' | 'recovery' | 'email_change',
          })
          if (error) throw error
          router.replace('/')
          return
        }

        // Flow B: ?code=... (PKCE)
        const code = params.get('code')
        if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession({ code })
          if (error) throw error
          router.replace('/')
          return
        }

        // Flow C: hash fragment (#access_token=...) – older flows
        if (typeof window !== 'undefined' && window.location.hash.includes('access_token')) {
          const { error } = await supabase.auth.getSessionFromUrl({ storeSession: true })
          if (error) throw error
          router.replace('/')
          return
        }

        setErr('No auth parameters found.')
      } catch (e: unknown) {
        const message =
          e instanceof Error ? e.message : typeof e === 'string' ? e : 'Auth failed'
        setErr(message)
      }
    }
    void run()
  }, [params, router])

  return (
    <main className="min-h-screen grid place-items-center p-6">
      <p>
        Signing you in… {err && <span className="text-red-600">({err})</span>}
      </p>
    </main>
  )
}
