import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

type Product = {
  id: string
  title: string
  type: string
  category: string
  seller: string
  location: string
  specs: string[]
  score?: number
  video_url?: string | null
  video_status?: string
  created_at?: string
}

const demoCatalog: Product[] = [
  { id:'ppgl-001', title:'0.50 mm Blue PPGL Roofing Sheet', type:'product', category:'PPGL Roofing Sheets', seller:'RSG Profiles Manufacturing', location:'Kanpur, India', specs:['0.30–0.80 mm','Cut-to-length','Colour coated'], score:0 },
  { id:'coil-001', title:'CR / HR Steel Coil & Slitting', type:'product', category:'Steel Coils', seller:'Chawla Ispat', location:'Rudrapur, India', specs:['Custom widths','Industrial supply','Slitting'], score:0 },
  { id:'fab-001', title:'Structural Steel Fabrication', type:'service', category:'Structural Fabrication', seller:'BookMyMetal Fabrication Network', location:'Bangalore, India', specs:['PEB','Heavy fabrication','Site execution'], score:0 },
]

function tokens(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9.]+/g, ' ').split(/\s+/).filter(Boolean)
}

function rankLocal(q: string, type: string) {
  const terms = tokens(q)
  return demoCatalog
    .map(item => {
      const hay = tokens([item.title, item.category, item.seller, item.location, ...item.specs].join(' '))
      const score = terms.reduce((sum, t) => sum + (hay.includes(t) ? 3 : hay.some(x => x.startsWith(t) || t.startsWith(x)) ? 1 : 0), 0)
      return { ...item, score }
    })
    .filter(item => (type === 'all' || item.type === type) && (!q || item.score! > 0))
    .sort((a, b) => (b.score || 0) - (a.score || 0))
}

async function getPublishedProducts(q: string, type: string) {
  const endpoint = 'https://www.bookmymetal.com/api/marketplace-products.php'
  const url = `${endpoint}?q=${encodeURIComponent(q)}&type=${encodeURIComponent(type)}&limit=60`
  try {
    const response = await fetch(url, { cache: 'no-store', headers: { Accept: 'application/json' } })
    if (!response.ok) return [] as Product[]
    const data = await response.json()
    return Array.isArray(data.results) ? data.results as Product[] : []
  } catch {
    return [] as Product[]
  }
}

export async function GET(request: NextRequest) {
  const q = (request.nextUrl.searchParams.get('q') || '').trim()
  const type = request.nextUrl.searchParams.get('type') || 'all'

  const live = await getPublishedProducts(q, type)
  if (live.length) return NextResponse.json({ ok:true, query:q, source:'mysql', results:live })

  const local = rankLocal(q, type)
  return NextResponse.json({ ok:true, query:q, source:'demo-fallback', results:local })
}
