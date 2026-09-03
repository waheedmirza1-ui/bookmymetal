import Link from 'next/link'

export default function LoginPage() {
  return (
    <main className="authPage"><div className="authCard"><Link href="/" className="brand"><span className="brandMark">BM</span><span>BookMy<span>Metal</span></span></Link><span className="kicker">WELCOME BACK</span><h1>Sign in to BookMyMetal</h1><p>Buyer and seller accounts will share one secure marketplace identity.</p><form><label>Email<input type="email" placeholder="you@company.com" /></label><label>Password<input type="password" placeholder="••••••••" /></label><button className="primary" type="button">Continue</button></form><Link href="/" className="backLink">← Back to marketplace</Link></div></main>
  )
}
