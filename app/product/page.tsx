'use client'

import { useMemo, useState } from 'react'
import './product.css'

type Product={id:string;title:string;category:string;seller:string;location:string;specs:string[];description:string;video?:string;price:string;moq:string}

const products:Product[]=[
 {id:'ppgl-001',title:'0.50 mm Blue PPGL Roofing Sheet',category:'PPGL Roofing Sheets',seller:'RSG Profiles Manufacturing',location:'Kanpur, Uttar Pradesh',specs:['0.50 mm','Blue','Cut-to-length'],description:'Colour-coated PPGL roofing sheet for industrial, commercial and residential roofing applications. Final specification and commercial terms are confirmed with the seller.',price:'Request current price',moq:'As per seller quote'},
 {id:'coil-001',title:'CR / HR Steel Coil & Slitting',category:'Steel Coils',seller:'Chawla Ispat',location:'Rudrapur, Uttarakhand',specs:['CR / HR','Slitting available','Industrial supply'],description:'Steel coil sourcing and slitting requirement flow. Share grade, thickness, width, quantity and delivery location to receive supplier quotations.',price:'Request current price',moq:'As per seller quote'},
 {id:'fab-001',title:'Structural Steel Fabrication',category:'Structural Fabrication',seller:'BookMyMetal Fabrication Network',location:'Bangalore, Karnataka',specs:['Structural steel','Fabrication','Project-based'],description:'A project enquiry flow for structural fabrication. Submit drawings, dimensions, quantity and site location for supplier matching and quotation.',price:'Request project quote',moq:'Project based'},
]

export default function ProductPage(){
 const params=typeof window!=='undefined'?new URLSearchParams(window.location.search):null
 const id=params?.get('id')||'ppgl-001'
 const product=useMemo(()=>products.find(p=>p.id===id)||products[0],[id])
 const [tab,setTab]=useState<'overview'|'specs'|'seller'>('overview')
 const [showRfq,setShowRfq]=useState(false)
 const [message,setMessage]=useState('')
 const [cart,setCart]=useState(false)
 const [qty,setQty]=useState('')

 const sendRfq=async(e:React.FormEvent<HTMLFormElement>)=>{
  e.preventDefault();
  const fd=new FormData(e.currentTarget)
  const body={name:String(fd.get('name')||''),company:String(fd.get('company')||''),email:String(fd.get('email')||''),phone:String(fd.get('phone')||''),product:product.title,category:product.category,message:`${String(fd.get('message')||'')} Quantity: ${qty}`}
  const d=await fetch('/api/rfq.php',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)}).then(r=>r.json()).catch(()=>({ok:false,error:'Network error'}))
  setMessage(d.ok?`RFQ submitted successfully. Reference #${d.rfq_id}.`:(d.error||'Unable to submit RFQ.'))
  if(d.ok)e.currentTarget.reset()
 }
 return <main className="productPage">
  <header className="productHeader"><a href="/marketplace/" className="brand"><span className="mark">BM</span>BookMy<span>Metal</span></a><nav><a href="/marketplace/">Marketplace</a><a href="/categories/">Categories</a><a href="/suppliers/">Suppliers</a><a href="/account/">Account</a></nav><a className="sell" href="/seller/">Sell on BookMyMetal</a></header>
  <div className="crumb"><a href="/marketplace/">Marketplace</a><span>›</span><a href={`/categories/?q=${encodeURIComponent(product.category)}`}>{product.category}</a><span>›</span><b>{product.title}</b></div>
  <section className="productHero">
   <div className="productVideo"><div className="videoLabel">VIDEO-FIRST PRODUCT VIEW</div><div className="videoPlaceholder"><div className="play">▶</div><strong>Real seller video</strong><span>Product video appears here after seller upload and approval.</span></div></div>
   <div className="productMain"><span className="eyebrow">{product.category}</span><h1>{product.title}</h1><a className="sellerLink" href={`/suppliers/?q=${encodeURIComponent(product.seller)}`}>{product.seller} <span>·</span> {product.location}</a><p className="description">{product.description}</p><div className="specPills">{product.specs.map(s=><span key={s}>{s}</span>)}</div><div className="buyBox"><div><small>Commercials</small><strong>{product.price}</strong><span>MOQ: {product.moq}</span></div><div className="qty"><label>Quantity</label><input value={qty} onChange={e=>setQty(e.target.value)} placeholder="e.g. 5000 sq ft"/></div><div className="actions"><button className="primary" onClick={()=>setShowRfq(true)}>Request Quote</button><button className={cart?'secondary selected':''} onClick={()=>setCart(!cart)}>{cart?'Added to shortlist':'Add to shortlist'}</button><button className="ghost" onClick={()=>setMessage('Call action is ready for seller contact integration.')}>Call Now</button></div></div></div>
  </section>
  <section className="detailPanel"><div className="tabs">{(['overview','specs','seller'] as const).map(t=><button key={t} className={tab===t?'active':''} onClick={()=>setTab(t)}>{t==='overview'?'Overview':t==='specs'?'Specifications':'Seller'}</button>)}</div>{tab==='overview'&&<div className="tabContent"><h2>Understand before you source.</h2><p>Watch the seller's real product video, review the key specification, then move directly into comparison or a structured RFQ.</p><div className="journey"><span>01 Watch</span><span>02 Understand</span><span>03 Compare</span><span>04 Request quote</span><span>05 Order</span></div></div>}{tab==='specs'&&<div className="tabContent specTable">{product.specs.map((s,i)=><div key={s}><b>{['Specification','Finish / type','Supply'][i]||'Detail'}</b><span>{s}</span></div>)}<div><b>Price</b><span>{product.price}</span></div><div><b>MOQ</b><span>{product.moq}</span></div></div>}{tab==='seller'&&<div className="tabContent"><h2>{product.seller}</h2><p>{product.location}</p><p>Supplier profile, verification status, published product videos and commercial information will be displayed here as seller onboarding is completed.</p><a className="secondaryLink" href={`/suppliers/?q=${encodeURIComponent(product.seller)}`}>View supplier →</a></div>}</section>
  {message&&<div className="toast"><span>{message}</span><button onClick={()=>setMessage('')}>×</button></div>}
  {showRfq&&<div className="backdrop" onMouseDown={e=>{if(e.target===e.currentTarget)setShowRfq(false)}}><div className="rfqCard"><button className="close" onClick={()=>setShowRfq(false)}>×</button><span className="eyebrow">AI-READY RFQ</span><h2>Request a quote</h2><p>{product.title}</p><form onSubmit={sendRfq}><input name="name" required placeholder="Your name"/><input name="company" required placeholder="Company name"/><input name="email" type="email" required placeholder="Work email"/><input name="phone" placeholder="Phone number"/><textarea name="message" rows={4} placeholder="Grade, dimensions, quantity, delivery location…"/><button className="primary" type="submit">Send RFQ</button></form></div></div>}
  <footer><span>BookMyMetal · See it. Understand it. Source it.</span><a href="/marketplace/">Back to Marketplace →</a></footer>
 </main>
}
