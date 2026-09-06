'use client'

import { useEffect, useState } from 'react'
import './checkout.css'

type Item={id:string;title:string;category:string;seller:string;quantity:string}
export default function CheckoutPage(){
 const [items,setItems]=useState<Item[]>([]);const [done,setDone]=useState(false);const [orderId,setOrderId]=useState('')
 useEffect(()=>{try{setItems(JSON.parse(localStorage.getItem('bmm_cart')||'[]'))}catch{}},[])
 const place=()=>{const id='BMM-'+Date.now().toString().slice(-8);setOrderId(id);setDone(true);localStorage.setItem('bmm_last_order',JSON.stringify({id,items,status:'Confirmed'}));localStorage.removeItem('bmm_cart')}
 return <main className="checkoutPage"><header><a href="/marketplace/" className="brand"><span>BM</span>BookMy<span>Metal</span></a><span>Secure sourcing checkout</span></header><section className="checkoutWrap">{done?<div className="success"><div className="check">✓</div><span className="eyebrow">ORDER CONFIRMED</span><h1>Order {orderId}</h1><p>Your order has been recorded. Supplier confirmation and tracking updates will appear in your buyer account.</p><div className="successActions"><a href="/account/">View my account</a><a href="/marketplace/">Continue sourcing</a></div></div>:<><div className="eyebrow">CHECKOUT</div><h1>Confirm your sourcing request</h1>{items.length?<><div className="checkoutList">{items.map(x=><div key={x.id}><div><b>{x.title}</b><span>{x.seller} · {x.category}</span></div><strong>{x.quantity||'Quantity to confirm'}</strong></div>)}</div><div className="payment"><h2>Payment</h2><p>Payment gateway integration is the next connection point. For now, this action creates a confirmed order record locally so the buyer journey is testable end-to-end.</p><button onClick={place}>Confirm order</button></div></>:<div className="empty"><strong>No items ready for checkout.</strong><a href="/marketplace/">Return to marketplace →</a></div>}</>}</section></main>
}
