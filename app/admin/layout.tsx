'use client'

import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { authAPI } from '@/lib/api'
import LoadingSpinner from '@/components/LoadingSpinner'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const isLoginPage = pathname === '/admin/login'
  // On protected pages we start "checking" and only render once the backend
  // confirms the token is valid. The login page never needs a session.
  const [status, setStatus] = useState<'checking' | 'authed'>(
    isLoginPage ? 'authed' : 'checking'
  )

  useEffect(() => {
    if (isLoginPage) {
      setStatus('authed')
      return
    }

    let active = true
    const token = localStorage.getItem('adminToken')

    // Presence of a token is NOT proof of a valid session — a user can type any
    // string into localStorage. Validate it against the backend (/auth/me runs
    // through jwt.verify), so forged/expired tokens are rejected and bounced to login.
    if (!token) {
      router.replace('/admin/login')
      return
    }

    setStatus('checking')
    authAPI
      .me()
      .then(() => {
        if (active) setStatus('authed')
      })
      .catch(() => {
        // apiCall() already clears the token + redirects on 401; this also covers
        // network/other errors — either way, don't render the panel.
        if (active) router.replace('/admin/login')
      })

    return () => {
      active = false
    }
  }, [pathname, isLoginPage, router])

  if (!isLoginPage && status === 'checking') {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <LoadingSpinner message="Verifying session" size="lg" />
      </div>
    )
  }

  return <>{children}</>
}
