'use client'

import { ChangeEvent, FormEvent, useRef, useState } from 'react'
import './marketplace.css'

const categories = ['PPGL Roofing Sheets','Steel Coils','Structural Fabrication','MS / GI Pipes','Industrial Machines','Roofing Accessories']
const results = [
  { title:'0.50 mm Blue PPGL Roofing Sheet', seller:'RSG Profiles Manufacturing', meta:'0.30–0.80 mm · Cut-to-length · Kanpur', tag:'PRODUCT' },
  { title:'CR / HR Steel Coil & Slitting', seller:'Chawla Ispat', meta:'Custom widths · Industrial supply · Rudrapur', tag:'PRODUCT' },
  { title:'Structural Steel Fabrication', seller:'Verified fabricator', meta:'Frames · PEB · Heavy fabrication · Bangalore', tag:'SERVICE' },
]

function MicIcon(){return <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3M8 21h8"/></svg>}
function ImageIcon(){return <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="8.5" cy="9" r="1.5"/><path d="m4 17 5-5 3 3 2-2 6 6"/></svg>}
function SearchIcon(){return <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.8" cy="10.8" r="6.8"/><path d="m16 16 5 5"/></svg>}

export default function MarketplacePage(){
  const [query,setQuery]=useState('')
  const [submitted,setSubmitted]=useState('')
  const [mode,setMode]=useState('text')
  const [imageName,setImageName]=useState('')
  const [listening,setListening]=useState(false)
  const fileRef=useRef<HTMLInputElement>(null)

  const submit=(e?:FormEvent)=>{e?.preventDefault();setSubmitted(query.trim() || 'All metal products & services')}
  const chooseImage=(e:ChangeEvent<HTMLInputElement>)=>{const file=e.target.files?.[0];if(file){setImageName(file.name);setMode('image')}}
  const voiceSearch=()=>{setMode('voice');setListening(true);setTimeout(()=>{setListening(false);setQuery('0.50 mm blue PPGL roofing sheet near Bangalore');setSubmitted('0.50 mm blue PPGL roofing sheet near Bangalore')},900)}

  return <main className="marketplace">
    <header className="marketHeader"><a className="bmBrand" href="/"><span className="bmMark">BM</span><span>BookMy<span>Metal</span></span></a><nav><a className="active" href="/marketplace/">Marketplace</a><a href="/categories/">Categories</a><a href="/suppliers/">Suppliers</a><a href="/rfq/">My RFQs</a></nav><div className="headerActions"><a href="/account/">Sign in</a><a className="headerCta" href="/seller/">Sell on BookMyMetal</a></div></header>
    <section className="marketHero"><div className="heroCopy"><span className="marketEyebrow">THE VIDEO-FIRST B2B MARKETPLACE</span><h1>See it.<br/><em>Understand it.</em><br/>Source it.</h1><p>Find metal products, suppliers and industrial services through real visual content — then compare, enquire or buy.</p></div><div className="heroVisual"><div className="heroVideoMock"><div className="play">▶</div><span>SELLER VIDEO</span><strong>Real product. Real capability.</strong></div></div></section>
    <section className="searchSection"><form className="aiSearch" onSubmit={submit}><div className="searchLead"><SearchIcon/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="What metal product or service do you need?" aria-label="Search BookMyMetal"/></div><button type="button" className={'searchMode '+(listening?'on':'')} onClick={voiceSearch} title="Voice search"><MicIcon/>{listening?'Listening…':'Speak'}</button><button type="button" className={'searchMode '+(mode==='image'?'on':'')} onClick={()=>fileRef.current?.click()} title="Search by image"><ImageIcon/>Image</button><input ref={fileRef} hidden type="file" accept="image/*" onChange={chooseImage}/><button className="searchGo" type="submit">Search</button></form><div className="searchHint">AI Search · Type naturally, speak a request, or upload a product image</div><div className="chips">{categories.map(c=><button key={c} type="button" onClick={()=>{setQuery(c);setSubmitted(c)}}>{c}</button>)}</div></section>
    {imageName && <div className="imageNotice"><ImageIcon/><span>Image selected: <b>{imageName}</b> · AI visual matching will identify similar products and suppliers.</span></div>}
    <section className="marketBody"><div className="sectionTop"><div><span className="marketEyebrow">{submitted?'AI SEARCH RESULTS':'DISCOVER'}</span><h2>{submitted ? `Results for “${submitted}”` : 'Watch products. Understand suppliers.'}</h2></div><div className="filters"><button>All</button><button>Products</button><button>Services</button><button>Manufacturers</button></div></div><div className="resultGrid">{results.map((r,i)=><article className="resultCard" key={r.title}><div className="resultVideo"><span>{r.tag}</span><div className="play small">▶</div><small>{i===0?'Product video':'Seller video'}</small></div><div className="resultInfo"><h3>{r.title}</h3><b>{r.seller}</b><p>{r.meta}</p><div className="cardActions"><button>Watch</button><button>Compare</button><button>Request quote</button></div></div></article>)}</div></section>
    <section className="aiJourney"><div><span className="marketEyebrow">ONE SEARCH. MULTIPLE INPUTS.</span><h2>Search the way<br/>you think.</h2><p>BookMyMetal is being built around natural buying intent — not rigid catalogue keywords.</p></div><div className="journeySteps"><div><b>⌨</b><strong>Type</strong><span>“Need 5,000 sq ft blue PPGL…”</span></div><div><b>🎙</b><strong>Speak</strong><span>Describe the requirement naturally.</span></div><div><b>⌁</b><strong>Image</strong><span>Show us what you need.</span></div><div><b>✦</b><strong>AI understands</strong><span>Match intent, specs and suppliers.</span></div></div></section>
    <section className="how"><span className="marketEyebrow">THE JOURNEY</span><h2>Discover → Watch → Understand → Compare → Quote / Order</h2><div className="journeyBar"><span>01 Discover</span><span>02 Watch</span><span>03 Understand</span><span>04 Compare / RFQ</span><span>05 Order</span><span>06 Track</span></div></section>
    <footer className="marketFooter"><div><a className="bmBrand" href="/"><span className="bmMark">BM</span><span>BookMy<span>Metal</span></span></a><p>Video-first B2B metal commerce.</p></div><div><b>Marketplace</b><a href="/categories/">Categories</a><a href="/suppliers/">Suppliers</a><a href="/rfq/">Request Quote</a></div><div><b>For sellers</b><a href="/seller/">Seller workspace</a><a href="/seller/">Upload products</a></div></footer>
  </main>
}
