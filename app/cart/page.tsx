'use client'

import { useEffect, useState } from 'react'
import './cart.css'

type CartItem={id:string;title:string;category:string;seller:string;quantity:string}
const key='bmm_cart'

export default function CartPage(){
 const [items,setItems]=useState<CartItem[]>([])
 const [ready,setReady]=useState(false)
 useEffect(()=>{try{setItems(JSON.parse(localStorage.getItem(key)||'[]'))}catch{} setReady(true)},[])
 const persist=(next:CartItem[])=>{setItems(next);try{localStorage.setItem(key,JSON.stringify(next))}catch{}}
 const remove=(id:string)=>persist(items.filter(x=>x.id!==id))
 const update=(id:string,quantity:string)=>persist(items.map(x=>x.id===id?{...x,quantity}:x))
 if(!ready)return <main className="cartPage"><p>Loading cart…</p></main>
 return <main className="cartPage">
  <header className="cartHeader"><a href="/marketplace/" className="brand"><span className="mark">BM</span>BookMy<span>Metal</span></a><nav><a href="/marketplace/">Marketplace</a><a href="/categories/">Categories</a><a href="/suppliers/">Suppliers</a><a href="/account/">Account</a></nav><a className="sell" href="/seller/">Sell on BookMyMetal</a></header>
  <section className="cartWrap"><div className="eyebrow">BUYER CART</div><h1>Your sourcing list</h1><p className="intro">Review quantities, then continue to checkout. Negotiated or custom products can be converted into an RFQ instead of a direct payment.</p>
  {!items.length?<div className="empty"><strong>Your cart is empty.</strong><span>Start with a product, compare suppliers, or request a quote.</span><a href="/marketplace/">Browse marketplace →</a></div>:<div className="cartGrid"><div className="items">{items.map(item=><article className="item" key={item.id}><div className="itemVisual"><span>VIDEO</span><b>▶</b></div><div className="itemInfo"><span className="category">{item.category}</span><h2>{item.title}</h2><p>{item.seller}</p><label>Quantity<input value={item.quantity} onChange={e=>update(item.id,e.target.value)} placeholder="Enter quantity"/></label></div><button className="remove" onClick={()=>remove(item.id)}>Remove</button></article>)}</div><aside className="summary"><span className="eyebrow">NEXT STEP</span><h2>Checkout</h2><p>Products with confirmed online pricing can proceed to payment. Quote-based products go through supplier confirmation first.</p><button className="primary" onClick={()=>window.location.href='/checkout/'}>Continue to checkout</button><button className="secondary" onClick={()=>window.location.href='/rfq/'}>Request quote instead</button><a href="/marketplace/">← Continue sourcing</a></aside></div>}
  </section>
  <footer><span>BookMyMetal · See it. Understand it. Source it.</span></footer>
 </main>
}
