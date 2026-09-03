'use client'

import Link from 'next/link'
import { useState } from 'react'

const categories = [
  ['Coils & Sheets', '🌀'], ['Pipes & Tubes', '▤'], ['Bars & Rods', '▥'], ['Structural Steel', '⌬'], ['Fabrication', '⚙'], ['Services', '✦']
]

const products = [
  { slug: 'ppgl-roofing-coils', title: 'PPGL Roofing Coils', seller: 'AMC Metals', meta: '0.30–1.20 mm • Bengaluru', tag: 'Trending', visual: 'coil' },
  { slug: 'ms-square-pipes', title: 'MS Square Pipes', seller: 'Prime Steel Works', meta: '20×20 to 100×100 • Hyderabad', tag: 'Best Seller', visual: 'pipe' },
  { slug: 'custom-sheet-bending', title: 'Custom Sheet Bending', seller: 'MetalFab Services', meta: 'CNC bending • Chennai', tag: 'Service', visual: 'bend' },
  { slug: 'gi-sheets-cut-sizes', title: 'GI Sheets & Cut Sizes', seller: 'South India Steels', meta: '0.40–3.00 mm • Coimbatore', tag: 'New', visual: 'sheet' },
]

export default function Home() {
  const [search, setSearch] = useState('')
  const [active, setActive] = useState('')

  return (
    <main>
      <header className="topbar"><div className="container nav"><Link href="/" className="brand"><span className="brandMark">BM</span><span>BookMy<span>Metal</span></span></Link><nav><Link href="/discover">Discover</Link><a href="#categories">Categories</a><Link href="/sell">Sell on BookMyMetal</Link></nav><div className="navActions"><button className="iconBtn">♡</button><Link className="login" href="/login">Login</Link><Link className="primary small" href="/login">Get Started</Link></div></div></header>
      <section className="hero"><div className="heroGlow"/><div className="container heroGrid"><div className="heroCopy"><div className="eyebrow"><span>●</span> India’s video-first metal marketplace</div><h1>See the metal.<br/><em>Know the deal.</em></h1><p>Discover real products through seller videos, compare specifications, connect directly and buy with confidence.</p><div className="searchBox"><span>⌕</span><input value={search} onChange={e => setSearch(e.target.value)} placeholder="What metal product or service are you looking for?"/><Link className="primary" href={search ? `/discover?q=${encodeURIComponent(search)}` : '/discover'}>Search</Link></div><div className="popular"><span>Popular:</span> PPGL coils · MS pipes · GI sheets · Fabrication</div></div><div className="heroVideo"><div className="videoCard mainVideo"><div className="videoOverlay"><span className="play">▶</span><div><b>PPGL Baby Coils</b><small>See it. Compare it. Book it.</small></div></div><div className="videoLines"/></div><div className="floatingCard"><span className="verified">✓</span><div><b>Verified seller</b><small>AMC Metals • Bengaluru</small></div></div><div className="priceCard"><small>Starting from</small><strong>₹68,500</strong><span>/ ton</span></div></div></div></section>
      <section id="categories" className="section container"><div className="sectionHead"><div><span className="kicker">EXPLORE</span><h2>Shop by category</h2></div><Link href="/discover">View all →</Link></div><div className="categoryGrid">{categories.map(([name, icon]) => <button key={name} onClick={() => setActive(name)} className={active === name ? 'category active' : 'category'}><span>{icon}</span><b>{name}</b><small>Explore →</small></button>)}</div></section>
      <section id="discover" className="discover"><div className="container"><div className="sectionHead"><div><span className="kicker">WATCH & DISCOVER</span><h2>What’s moving in metal</h2></div><div className="pills"><button className="pill active">For you</button><button className="pill">Trending</button><button className="pill">Nearby</button></div></div><div className="productGrid">{products.map(p => <Link href={`/products/${p.slug}`} className="productCard" key={p.title}><div className={`productVisual ${p.visual}`}><span className="tag">{p.tag}</span><span className="play smallPlay">▶</span><span className="videoTime">0:24</span></div><div className="productBody"><h3>{p.title}</h3><p>{p.meta}</p><div className="seller"><span className="avatar">{p.seller[0]}</span><span>{p.seller}</span><span className="check">✓</span><span className="sellerHeart">♡</span></div></div></Link>)}</div></div></section>
      <section id="sell" className="sellerBanner"><div className="container sellerInner"><div><span className="kicker">FOR SELLERS</span><h2>Turn your products into<br/><em>stories that sell.</em></h2><p>Upload a short video. Reach serious buyers. Get enquiries and orders.</p></div><Link className="primary" href="/sell">Start selling →</Link></div></section>
      <footer><div className="container footerGrid"><div><Link href="/" className="brand"><span className="brandMark">BM</span><span>BookMy<span>Metal</span></span></Link><p>The smarter way to discover, compare and buy metal.</p></div><div><b>Marketplace</b><Link href="/discover">Discover</Link><a href="#categories">Categories</a><Link href="/discover">How it works</Link></div><div><b>For business</b><Link href="/sell">Sell on BookMyMetal</Link><Link href="/sell">Seller resources</Link><Link href="/sell">Partner with us</Link></div><div><b>Support</b><a>Help center</a><a>Contact us</a><a>Terms & privacy</a></div></div><div className="container copyright">© 2026 BookMyMetal. Built for the future of metal commerce.</div></footer>
    </main>
  )
}
