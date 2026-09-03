import Link from 'next/link'

export default function SellPage() {
  return (
    <main>
      <header className="topbar"><div className="container nav"><Link href="/" className="brand"><span className="brandMark">BM</span><span>BookMy<span>Metal</span></span></Link><nav><Link href="/discover">Discover</Link><Link href="/#categories">Categories</Link><Link href="/sell">Sell on BookMyMetal</Link></nav><Link className="login" href="/login">Login</Link></div></header>
      <section className="sellerBanner sellerPage"><div className="container sellerPageInner"><span className="kicker">SELLER ONBOARDING</span><h1>Show your metal.<br/><em>Get discovered.</em></h1><p>BookMyMetal is designed around the way industrial buyers actually evaluate products: see the material, understand the specification, then enquire.</p><div className="sellerSteps"><div><b>01</b><strong>Create your business profile</strong><span>Tell buyers what you manufacture, stock or service.</span></div><div><b>02</b><strong>Upload product videos</strong><span>Show actual material, machines, finish, size and availability.</span></div><div><b>03</b><strong>Receive serious enquiries</strong><span>Manage quotation requests and buyer conversations in one place.</span></div></div><button className="primary">Create seller account →</button></div></section>
    </main>
  )
}
