import { NextRequest, NextResponse } from 'next/server'

const demoCatalog = [
  { id:'ppgl-001', title:'0.50 mm Blue PPGL Roofing Sheet', type:'product', category:'PPGL Roofing Sheets', seller:'RSG Profiles Manufacturing', location:'Kanpur, India', specs:['0.30–0.80 mm','Cut-to-length','Colour coated'], score:0 },
  { id:'coil-001', title:'CR / HR Steel Coil & Slitting', type:'product', category:'Steel Coils', seller:'Chawla Ispat', location:'Rudrapur, India', specs:['Custom widths','Industrial supply','Slitting'], score:0 },
  { id:'fab-001', title:'Structural Steel Fabrication', type:'service', category:'Structural Fabrication', seller:'BookMyMetal Fabrication Network', location:'Bangalore, India', specs:['PEB','Heavy fabrication','Site execution'], score:0 },
]

function tokens(value:string){ return value.toLowerCase().replace(/[^a-z0-9.]+/g,' ').split(/\s+/).filter(Boolean) }
export async function GET(request: NextRequest){
  const q=(request.nextUrl.searchParams.get('q')||'').trim()
  const type=request.nextUrl.searchParams.get('type')||'all'
  if(!q) return NextResponse.json({ok:true,query:'',results:demoCatalog})
  const terms=tokens(q)
  const results=demoCatalog.map(item=>{
    const hay=tokens([item.title,item.category,item.seller,item.location,...item.specs].join(' '))
    const score=terms.reduce((sum,t)=>sum+(hay.includes(t)?3:hay.some(x=>x.startsWith(t)||t.startsWith(x))?1:0),0)
    return {...item,score}
  }).filter(item=>(type==='all'||item.type===type)&&item.score>0).sort((a,b)=>b.score-a.score)
  return NextResponse.json({ok:true,query:q,results})
}
