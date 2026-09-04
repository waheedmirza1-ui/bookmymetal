'use client'
import { useEffect,useMemo,useState } from 'react'
import './cart.css'

type Item={id:string;title:string;seller:string;specs:string[];qty:number}
export default function CartPage(){
 const [items,setItems]=useState<Item[]>([])
 useEffect(()=>{try{setItems(JSON.parse(localStorage.getItem('bmm_cart')||'[]'))}catch{setItems([])}},[])
 const update=(id:string,qty:number)=>{const next=items.map(x=>x.id===id?{...x,qty:Math.max(1,qty)}:x);setItems(next);localStorage.setItem('bmm_cart',JSON.stringify(next))}
 const remove=(id:string)=>{const next=items.filter(x=>x.id!==id);setItems(next);localStorage.setItem('bmm_cart',JSON.stringify(next))}
 const count=useMemo(()=>items.reduce((n,x)=>n+x.qty,0),[items])
 return <main className="cartPage"><header><a href="/marketplace/" className="brand"><b>BM</b> BookMyMetal</a><a href="/marketplace/">← Continue sourcing</a></header><section><span className="eyebrow">BUYER CART</span><h1>Your order shortlist</h1><p>Products enabled for direct purchase can move to checkout. Negotiated/custom requirements remain RFQ-first.</p>{items.length===0?<div className="empty"><h2>Your cart is empty</h2><a href="/marketplace/">Discover products →</a></div>:<div className="layout"><div>{items.map(x=><article className="item" key={x.id}><div className="video">VIDEO</div><div className="info"><h2>{x.title}</h2><b>{x.seller}</b><p>{x.specs.join(' · ')}</p><label>Quantity <input type="number" min="1" value={x.qty} onChange={e=>update(x.id,Number(e.target.value))}/></label><button onClick={()=>remove(x.id)}>Remove</button></div></article>)}</div><aside><span>{count} item{count!==1?'s':''}</span><h2>Ready for checkout</h2><p>Shipping, taxes and final commercial terms are confirmed before payment.</p><a className="checkout" href="/checkout/">Proceed to checkout →</a></aside></div>}</section></main>
}