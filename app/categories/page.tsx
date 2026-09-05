'use client';
import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import './categories.css';

const groups=[
 {name:'Metal & Steel',items:['PPGL Roofing Sheets','Steel Coils','MS / GI Pipes','Structural Fabrication','Roofing Accessories']},
 {name:'Industrial',items:['Industrial Machines','Sheet Processing','Welding & Fabrication','Material Handling','Factory Services']},
 {name:'Construction',items:['Roofing','Building Materials','Doors & Windows','Hardware','Electrical & Plumbing']},
 {name:'Furniture',items:['Office Furniture','Industrial Furniture','Home Furniture','Metal Furniture','Custom Furniture']},
];
export default function Categories(){return <Suspense fallback={null}><CategoriesContent/></Suspense>}
function CategoriesContent(){const q=useSearchParams().get('q')?.toLowerCase()||'';const active=groups.find(g=>g.name.toLowerCase().includes(q)||g.items.some(i=>i.toLowerCase().includes(q)))||groups[0];return <main className="categories-page"><header><a className="brand" href="/marketplace/">BookMyMetal</a><nav><a href="/marketplace/">Marketplace</a><a className="active" href="/categories/">Categories</a><a href="/suppliers/">Suppliers</a></nav><a className="signin" href="/account/">Sign in</a></header><section className="catHero"><span>AI CATEGORY DISCOVERY</span><h1>{q?`Explore ${active.name}`:'Explore by category'}</h1><p>Search naturally and BookMyMetal routes your intent to the most relevant marketplace category.</p><form action="/categories/"><input name="q" defaultValue={q} placeholder="Search a category…"/><button>Find category</button></form></section><section className="visualGrid">{active.items.slice(0,4).map((item,i)=><a className="visualCard" key={item} href={`/marketplace/?category=${encodeURIComponent(item)}`}><div className={`visual v${i+1}`}><strong>{item}</strong><small>AI visual category preview</small></div><h3>{item}</h3><span>Explore →</span></a>)}</section><section className="allCats"><h2>All categories</h2><div className="groups">{groups.map(g=><div key={g.name}><h3>{g.name}</h3>{g.items.map(i=><a key={i} href={`/categories/?q=${encodeURIComponent(i)}`}>{i}</a>)}</div>)}</div></section></main>}
