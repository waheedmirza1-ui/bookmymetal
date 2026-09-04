'use client';

import { FormEvent, useState } from 'react';
import './account.css';

const API = '/api/auth.php';

export default function AccountPage() {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [role, setRole] = useState<'buyer' | 'seller'>('buyer');
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault(); setBusy(true); setStatus('');
    try {
      const body = mode === 'login' ? { action: 'login', email, password } : { action: 'register', email, password, name, company, role };
      const r = await fetch(API, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      const data = await r.json();
      if (!r.ok || !data.ok) throw new Error(data.error || 'Something went wrong.');
      setStatus(mode === 'login' ? `Welcome${data.user?.name ? `, ${data.user.name}` : ''}. Account connected.` : 'Account created. You can now sign in.');
      if (mode === 'register') { setMode('login'); setPassword(''); }
    } catch (err) { setStatus(err instanceof Error ? err.message : 'Unable to connect.'); }
    finally { setBusy(false); }
  }

  return <main className="account-page"><section className="account-shell"><div className="account-copy"><a className="brand" href="/marketplace/">BookMyMetal</a><span className="eyebrow">ONE ACCOUNT · BUYER + SELLER</span><h1>Source smarter.<br/>Build faster.</h1><p>Use one BookMyMetal account to discover products, compare suppliers, send RFQs and manage your marketplace activity.</p><div className="journey"><b>Discover</b><span>→</span><b>Compare</b><span>→</span><b>Quote</b><span>→</span><b>Order</b></div></div><div className="account-card"><div className="tabs"><button className={mode==='login'?'active':''} onClick={()=>setMode('login')}>Sign in</button><button className={mode==='register'?'active':''} onClick={()=>setMode('register')}>Create account</button></div>{mode==='register' && <div className="role-switch"><button className={role==='buyer'?'selected':''} onClick={()=>setRole('buyer')} type="button">Buyer</button><button className={role==='seller'?'selected':''} onClick={()=>setRole('seller')} type="button">Seller</button></div>}<form onSubmit={submit}>{mode==='register' && <><label>Full name<input value={name} onChange={e=>setName(e.target.value)} required /></label><label>Company<input value={company} onChange={e=>setCompany(e.target.value)} placeholder="Company name" /></label></>}<label>Email<input type="email" value={email} onChange={e=>setEmail(e.target.value)} required autoComplete="email" /></label><label>Password<input type="password" value={password} onChange={e=>setPassword(e.target.value)} minLength={10} required autoComplete={mode==='login'?'current-password':'new-password'} />{mode==='register' && <small>Minimum 10 characters.</small>}</label><button className="primary" disabled={busy}>{busy ? 'Connecting…' : mode==='login' ? 'Sign in' : `Create ${role} account`}</button></form>{status && <div className="status" role="status">{status}</div>}<p className="fine">By continuing, you agree to BookMyMetal’s terms and marketplace policies.</p></div></section></main>;
}
