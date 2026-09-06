'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FormEvent, useState } from 'react'

const api = 'https://www.bookmymetal.com/api'
type View = 'start' | 'otp' | 'profile' | 'password-login' | 'password-signup' | 'reset'

async function post(path: string, body: Record<string, string>) {
  const response = await fetch(`${api}/${path}`, {
    method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
  })
  const data = await response.json().catch(() => ({}))
  if (!response.ok || !data.ok) throw new Error(data.error || 'Unable to complete this request.')
  return data
}

export default function AccountPage() {
  const router = useRouter()
  const [view, setView] = useState<View>(() => typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('mode') === 'login' ? 'password-login' : 'start')
  const [destination, setDestination] = useState('')
  const [code, setCode] = useState('')
  const [name, setName] = useState('')
  const [company, setCompany] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [status, setStatus] = useState('')
  const [busy, setBusy] = useState(false)

  const finish = () => router.push('/')
  const handle = async (work: () => Promise<void>) => { setBusy(true); setStatus(''); try { await work() } catch (error) { setStatus(error instanceof Error ? error.message : 'Unable to complete this request.') } finally { setBusy(false) } }

  const requestOtp = (event: FormEvent) => { event.preventDefault(); void handle(async () => { const data = await post('otp.php', { action: 'request', destination, purpose: 'login' }); setStatus(`A 6-digit code was sent to ${data.destination}.`); setView('otp') }) }
  const verifyOtp = (event: FormEvent) => { event.preventDefault(); void handle(async () => { const data = await post('otp.php', { action: 'verify', destination, purpose: 'login', code }); if (data.next === 'profile') { setView('profile'); return }; finish() }) }
  const completeProfile = (event: FormEvent) => { event.preventDefault(); void handle(async () => { await post('otp.php', { action: 'complete_profile', name, company }); finish() }) }
  const passwordLogin = (event: FormEvent) => { event.preventDefault(); void handle(async () => { await post('auth.php', { action: 'login', email, password }); finish() }) }
  const passwordSignup = (event: FormEvent) => { event.preventDefault(); if (password !== confirmPassword) { setStatus('Passwords do not match.'); return }; void handle(async () => { await post('auth.php', { action: 'register', name, company, email, password }); finish() }) }

  const field = 'mt-4 w-full rounded-xl border border-input bg-background px-3 py-3 text-sm outline-none focus:border-primary'
  const primary = 'mt-5 w-full rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60'
  const oauth = `${api}/oauth.php?provider=google&return=%2Fmarketplace%2F`

  return <main className="min-h-dvh bg-muted/50 px-4 py-10 sm:py-16"><section className="mx-auto w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-9">
    <Link href="/" className="text-xl font-semibold tracking-tight">BookMy<span className="text-primary">Metal</span></Link>
    {view === 'start' && <><h1 className="mt-8 text-3xl font-semibold tracking-tight">Create a free account</h1><p className="mt-2 text-sm text-muted-foreground">Join buyers and sellers from around the world.</p><a href={oauth} className={`${primary} block text-center`}>Continue with Google</a><div className="my-6 flex items-center gap-3 text-xs text-muted-foreground before:h-px before:flex-1 before:bg-border after:h-px after:flex-1 after:bg-border">or</div><form onSubmit={requestOtp}><label className="text-sm font-medium">Email address or mobile number<input className={field} value={destination} onChange={(e) => setDestination(e.target.value)} placeholder="name@company.com or +91 98765 43210" autoComplete="username" required /></label><button className={primary} disabled={busy}>{busy ? 'Sending…' : 'Continue →'}</button></form><button className="mt-5 w-full text-sm font-semibold text-primary" onClick={() => setView('password-login')}>Use password instead</button><p className="mt-7 text-center text-sm text-muted-foreground">Already have an account? <button className="font-semibold text-primary" onClick={() => setView('password-login')}>Sign in</button></p></>}
    {view === 'otp' && <form onSubmit={verifyOtp}><h1 className="mt-8 text-3xl font-semibold tracking-tight">Enter verification code</h1><p className="mt-2 text-sm text-muted-foreground">Enter the 6-digit code sent to your email or mobile number.</p><input className={field} value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))} inputMode="numeric" autoComplete="one-time-code" placeholder="000000" required /><button className={primary} disabled={busy}>{busy ? 'Verifying…' : 'Verify code →'}</button><button type="button" className="mt-5 w-full text-sm font-semibold text-primary" onClick={() => void handle(async () => { await post('otp.php', { action: 'request', destination, purpose: 'login' }); setStatus('A new code was sent.') })}>Resend code</button></form>}
    {view === 'profile' && <form onSubmit={completeProfile}><h1 className="mt-8 text-3xl font-semibold tracking-tight">Finish your account</h1><p className="mt-2 text-sm text-muted-foreground">Everyone can source. Activate selling any time.</p><input className={field} value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" autoComplete="name" required /><input className={field} value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Company (optional)" autoComplete="organization" /><button className={primary} disabled={busy}>{busy ? 'Creating…' : 'Continue →'}</button></form>}
    {view === 'password-login' && <form onSubmit={passwordLogin}><h1 className="mt-8 text-3xl font-semibold tracking-tight">Welcome back</h1><p className="mt-2 text-sm text-muted-foreground">Sign in with your existing password.</p><input className={field} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email address" type="email" autoComplete="email" required /><input className={field} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" type="password" autoComplete="current-password" required /><button className={primary} disabled={busy}>{busy ? 'Signing in…' : 'Sign in →'}</button><button type="button" className="mt-5 w-full text-sm font-semibold text-primary" onClick={() => setView('password-signup')}>Create an account with password</button></form>}
    {view === 'password-signup' && <form onSubmit={passwordSignup}><h1 className="mt-8 text-3xl font-semibold tracking-tight">Create an account</h1><p className="mt-2 text-sm text-muted-foreground">One account for sourcing and optional selling.</p><input className={field} value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" required /><input className={field} value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Company (optional)" /><input className={field} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email address" type="email" required /><input className={field} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password (8+ characters)" type="password" minLength={8} required /><input className={field} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm password" type="password" minLength={8} required /><button className={primary} disabled={busy}>{busy ? 'Creating…' : 'Create account →'}</button></form>}
    {status && <p className="mt-5 rounded-lg bg-muted p-3 text-sm text-muted-foreground" role="status">{status}</p>}
  </section></main>
}
