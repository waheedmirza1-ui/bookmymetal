export type Listing = {
  id: string
  name: string
  supplier: string
  verified: boolean
  location: string
  spec: string
  price: string
  category: string
  poster: string
  duration: string
  views: string
  type: 'product' | 'service'
}

import { publicAsset } from '@/lib/utils'

export const categories = [
  'All',
  'Machinery',
  'Furniture',
  'Agriculture',
  'Electronics',
  'Construction',
  'Healthcare',
  'Logistics',
  'Energy',
  'Textiles',
  'Professional Services',
  'Industrial',
]

const reel = (n: string) => publicAsset(`/reels/${n}.png`)

export const trending: Listing[] = [
  {
    id: 't1',
    name: '5-Axis CNC Machining Center',
    supplier: 'PrecisionWerk GmbH',
    verified: true,
    location: 'Stuttgart, DE',
    spec: '±0.005 mm · 15 kW spindle',
    price: 'From $148,000',
    category: 'Machinery',
    poster: reel('machinery'),
    duration: '0:42',
    views: '18.2k',
    type: 'product',
  },
  {
    id: 't2',
    name: 'Modular Solar Array 450W',
    supplier: 'HelioGrid Energy',
    verified: true,
    location: 'Valencia, ES',
    spec: 'Bifacial · 21.3% efficiency',
    price: 'From $89 / panel',
    category: 'Energy',
    poster: reel('energy'),
    duration: '1:05',
    views: '12.7k',
    type: 'product',
  },
  {
    id: 't3',
    name: 'Automated Bottling Line',
    supplier: 'PackFlow Systems',
    verified: true,
    location: 'Milan, IT',
    spec: '12,000 units / hr',
    price: 'Request quote',
    category: 'Industrial',
    poster: reel('packaging'),
    duration: '0:58',
    views: '9.4k',
    type: 'product',
  },
  {
    id: 't4',
    name: 'Ergonomic Task Chair — Aera',
    supplier: 'Nord Contract Furniture',
    verified: true,
    location: 'Malmö, SE',
    spec: 'BIFMA certified · 8 colors',
    price: 'From $210 / unit',
    category: 'Furniture',
    poster: reel('furniture'),
    duration: '0:31',
    views: '7.1k',
    type: 'product',
  },
  {
    id: 't5',
    name: 'SMT Assembly Line',
    supplier: 'CircuitForge Ltd',
    verified: true,
    location: 'Shenzhen, CN',
    spec: '0201 components · AOI',
    price: 'Request quote',
    category: 'Electronics',
    poster: reel('electronics'),
    duration: '1:12',
    views: '15.9k',
    type: 'product',
  },
]

export const recommended: Listing[] = [
  {
    id: 'r1',
    name: 'Row-Crop Tractor 180HP',
    supplier: 'AgriMax Equipment',
    verified: true,
    location: 'Des Moines, US',
    spec: 'GPS auto-steer · Tier 4',
    price: 'From $132,500',
    category: 'Agriculture',
    poster: reel('agriculture'),
    duration: '0:49',
    views: '6.3k',
    type: 'product',
  },
  {
    id: 'r2',
    name: 'MRI Suite Installation',
    supplier: 'MediCore Systems',
    verified: true,
    location: 'Rotterdam, NL',
    spec: '3T · turnkey install',
    price: 'Request quote',
    category: 'Healthcare',
    poster: reel('healthcare'),
    duration: '1:20',
    views: '4.8k',
    type: 'service',
  },
  {
    id: 'r3',
    name: 'Warehouse Racking System',
    supplier: 'StoreFit Logistics',
    verified: false,
    location: 'Manchester, UK',
    spec: 'Up to 12 m · 2t/level',
    price: 'From $34 / bay',
    category: 'Logistics',
    poster: reel('logistics'),
    duration: '0:37',
    views: '5.5k',
    type: 'product',
  },
  {
    id: 'r4',
    name: 'Industrial Centrifugal Pump',
    supplier: 'FlowTech Industrial',
    verified: true,
    location: 'Houston, US',
    spec: 'SS316 · 90 m³/h',
    price: 'From $4,200',
    category: 'Industrial',
    poster: reel('industrial'),
    duration: '0:44',
    views: '8.0k',
    type: 'product',
  },
  {
    id: 'r5',
    name: 'Technical Woven Fabric',
    supplier: 'Loomcraft Textiles',
    verified: true,
    location: 'Coimbatore, IN',
    spec: 'Flame-retardant · 320 gsm',
    price: 'From $6.20 / m',
    category: 'Textiles',
    poster: reel('textiles'),
    duration: '0:28',
    views: '3.9k',
    type: 'product',
  },
]

export const recentlyAdded: Listing[] = [
  {
    id: 'n1',
    name: 'Tower Crane Rental & Ops',
    supplier: 'BuildLift Services',
    verified: true,
    location: 'Dubai, AE',
    spec: '18t · operator included',
    price: 'From $980 / day',
    category: 'Construction',
    poster: reel('construction'),
    duration: '0:52',
    views: '2.1k',
    type: 'service',
  },
  {
    id: 'n2',
    name: 'Pick-and-Place Machine',
    supplier: 'CircuitForge Ltd',
    verified: true,
    location: 'Shenzhen, CN',
    spec: '25k CPH · dual head',
    price: 'From $58,000',
    category: 'Electronics',
    poster: reel('electronics'),
    duration: '0:41',
    views: '1.7k',
    type: 'product',
  },
  {
    id: 'n3',
    name: 'Conference Table — Linea',
    supplier: 'Nord Contract Furniture',
    verified: true,
    location: 'Malmö, SE',
    spec: 'Oak veneer · cable mgmt',
    price: 'From $1,340',
    category: 'Furniture',
    poster: reel('furniture'),
    duration: '0:33',
    views: '1.2k',
    type: 'product',
  },
  {
    id: 'n4',
    name: 'Wind + Solar Hybrid Kit',
    supplier: 'HelioGrid Energy',
    verified: true,
    location: 'Valencia, ES',
    spec: '10 kW · off-grid ready',
    price: 'From $22,900',
    category: 'Energy',
    poster: reel('energy'),
    duration: '1:02',
    views: '2.9k',
    type: 'product',
  },
  {
    id: 'n5',
    name: 'Precision Grinding Service',
    supplier: 'PrecisionWerk GmbH',
    verified: true,
    location: 'Stuttgart, DE',
    spec: 'Ra 0.1 µm · 5-day lead',
    price: 'Request quote',
    category: 'Machinery',
    poster: reel('machinery'),
    duration: '0:36',
    views: '900',
    type: 'service',
  },
]

export const services: Listing[] = [
  {
    id: 's1',
    name: 'Turnkey Plant Engineering',
    supplier: 'FlowTech Industrial',
    verified: true,
    location: 'Houston, US',
    spec: 'Design → commissioning',
    price: 'Request quote',
    category: 'Professional Services',
    poster: reel('services'),
    duration: '1:34',
    views: '3.3k',
    type: 'service',
  },
  {
    id: 's2',
    name: 'Fleet Logistics Management',
    supplier: 'StoreFit Logistics',
    verified: true,
    location: 'Manchester, UK',
    spec: 'Real-time tracking',
    price: 'From $1,200 / mo',
    category: 'Logistics',
    poster: reel('logistics'),
    duration: '0:47',
    views: '2.6k',
    type: 'service',
  },
  {
    id: 's3',
    name: 'Medical Equipment Servicing',
    supplier: 'MediCore Systems',
    verified: true,
    location: 'Rotterdam, NL',
    spec: 'ISO 13485 · 24/7 SLA',
    price: 'From $450 / visit',
    category: 'Healthcare',
    poster: reel('healthcare'),
    duration: '0:55',
    views: '1.8k',
    type: 'service',
  },
  {
    id: 's4',
    name: 'Textile QA & Certification',
    supplier: 'Loomcraft Textiles',
    verified: false,
    location: 'Coimbatore, IN',
    spec: 'OEKO-TEX · lab reports',
    price: 'From $320 / batch',
    category: 'Textiles',
    poster: reel('textiles'),
    duration: '0:39',
    views: '740',
    type: 'service',
  },
  {
    id: 's5',
    name: 'Site Survey & Groundworks',
    supplier: 'BuildLift Services',
    verified: true,
    location: 'Dubai, AE',
    spec: 'Drone survey · 48h report',
    price: 'From $2,100',
    category: 'Construction',
    poster: reel('construction'),
    duration: '1:08',
    views: '1.1k',
    type: 'service',
  },
]

export type PopularCategory = {
  name: string
  poster: string
  count: string
}

export const popularCategories: PopularCategory[] = [
  { name: 'Machinery', poster: reel('machinery'), count: '12,480 reels' },
  { name: 'Electronics', poster: reel('electronics'), count: '9,210 reels' },
  { name: 'Construction', poster: reel('construction'), count: '7,940 reels' },
  { name: 'Agriculture', poster: reel('agriculture'), count: '6,120 reels' },
  { name: 'Energy', poster: reel('energy'), count: '5,530 reels' },
  { name: 'Furniture', poster: reel('furniture'), count: '4,870 reels' },
  { name: 'Textiles', poster: reel('textiles'), count: '3,410 reels' },
  { name: 'Logistics', poster: reel('logistics'), count: '3,050 reels' },
]

export type Supplier = {
  name: string
  location: string
  industry: string
  reels: number
  rating: number
  poster: string
}

export const verifiedSuppliers: Supplier[] = [
  {
    name: 'PrecisionWerk GmbH',
    location: 'Stuttgart, DE',
    industry: 'Machinery',
    reels: 148,
    rating: 4.9,
    poster: reel('machinery'),
  },
  {
    name: 'HelioGrid Energy',
    location: 'Valencia, ES',
    industry: 'Energy',
    reels: 96,
    rating: 4.8,
    poster: reel('energy'),
  },
  {
    name: 'CircuitForge Ltd',
    location: 'Shenzhen, CN',
    industry: 'Electronics',
    reels: 210,
    rating: 4.7,
    poster: reel('electronics'),
  },
  {
    name: 'Nord Contract Furniture',
    location: 'Malmö, SE',
    industry: 'Furniture',
    reels: 74,
    rating: 4.9,
    poster: reel('furniture'),
  },
  {
    name: 'AgriMax Equipment',
    location: 'Des Moines, US',
    industry: 'Agriculture',
    reels: 132,
    rating: 4.6,
    poster: reel('agriculture'),
  },
  {
    name: 'FlowTech Industrial',
    location: 'Houston, US',
    industry: 'Industrial',
    reels: 118,
    rating: 4.8,
    poster: reel('industrial'),
  },
]
