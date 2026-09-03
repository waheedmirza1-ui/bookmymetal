import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getProduct, products } from '../../../lib/catalog'

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }))
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const product = getProduct(params.slug)
  if (!product) notFound()

  return (
    <main>
      <header className="topbar"><div className="container nav"><Link href="/" className="brand"><span className="brandMark">BM</span><span>BookMy<span>Metal</span></span></Link><nav><Link href="/discover">Discover</Link><Link href="/#categories">Categories</Link><Link href="/sell">Sell on BookMyMetal</Link></nav><div className="navActions"><Link className="login" href="/login">Login</Link></div></div></header>
      <section className="section container productDetail"><div className="detailVideo"><div className="productVisual coil"><span className="play detailPlay">▶</span><span className="videoTime">0:24</span></div></div><div className="detailCopy"><span className="kicker">{product.category.toUpperCase()}</span><h1>{product.title}</h1><p className="detailDescription">{product.description}</p><div className="detailMeta"><div><small>SPECIFICATION</small><strong>{product.specs}</strong></div><div><small>LOCATION</small><strong>{product.location}</strong></div></div><div className="detailSeller"><span className="avatar">{product.seller[0]}</span><div><b>{product.seller}</b><small>✓ Verified seller</small></div></div><div className="detailPrice"><small>{product.price.includes('quotation') ? 'PRICING' : 'STARTING PRICE'}</small><strong>{product.price}</strong></div><div className="detailActions"><button className="primary">Request quotation</button><button className="secondary">Contact seller</button></div></div></section>
    </main>
  )
}
