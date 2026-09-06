import Link from 'next/link'
import { products } from '../../lib/catalog'

export default function DiscoverPage() {
  return (
    <main>
      <header className="topbar"><div className="container nav"><Link href="/" className="brand"><span className="brandMark">BM</span><span>BookMy<span>Metal</span></span></Link><nav><Link href="/discover">Discover</Link><Link href="/#categories">Categories</Link><Link href="/sell">Sell on BookMyMetal</Link></nav><div className="navActions"><Link className="login" href="/login">Login</Link><Link className="primary small" href="/sell">Get Started</Link></div></div></header>
      <section className="section container"><span className="kicker">MARKETPLACE</span><h1 className="pageTitle">Discover metal through real seller videos.</h1><p className="pageIntro">Browse products and services, compare specifications and move from discovery to enquiry.</p><div className="productGrid">{products.map((p) => <Link className="productCard" href={`/products/${p.slug}`} key={p.slug}><div className={`productVisual ${p.slug.includes('coil') ? 'coil' : p.slug.includes('pipe') ? 'pipe' : p.slug.includes('bending') ? 'bend' : 'sheet'}`}><span className="tag">Video</span><span className="play smallPlay">▶</span><span className="videoTime">0:24</span></div><div className="productBody"><h3>{p.title}</h3><p>{p.specs} • {p.location}</p><div className="seller"><span className="avatar">{p.seller[0]}</span><span>{p.seller}</span><span className="check">✓</span></div></div></Link>)}</div></section>
    </main>
  )
}
