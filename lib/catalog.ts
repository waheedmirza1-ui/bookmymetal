export type Product = {
  slug: string
  title: string
  seller: string
  location: string
  category: string
  specs: string
  price: string
  description: string
  videoLabel: string
}

export const products: Product[] = [
  { slug: 'ppgl-roofing-coils', title: 'PPGL Roofing Coils', seller: 'AMC Metals', location: 'Bengaluru', category: 'Coils & Sheets', specs: '0.30–1.20 mm', price: '₹68,500 / ton', description: 'Colour-coated PPGL coils for roofing and fabrication applications. Seller video shows the actual material and available finish.', videoLabel: 'PPGL Baby Coils' },
  { slug: 'ms-square-pipes', title: 'MS Square Pipes', seller: 'Prime Steel Works', location: 'Hyderabad', category: 'Pipes & Tubes', specs: '20×20 to 100×100', price: 'Get quotation', description: 'MS square pipes available in multiple sizes for fabrication, structures and industrial applications.', videoLabel: 'MS Square Pipes' },
  { slug: 'custom-sheet-bending', title: 'Custom Sheet Bending', seller: 'MetalFab Services', location: 'Chennai', category: 'Fabrication', specs: 'CNC bending', price: 'Get quotation', description: 'Precision sheet bending service with CNC equipment. Share your drawing or dimensions to receive a quotation.', videoLabel: 'CNC Sheet Bending' },
  { slug: 'gi-sheets-cut-sizes', title: 'GI Sheets & Cut Sizes', seller: 'South India Steels', location: 'Coimbatore', category: 'Coils & Sheets', specs: '0.40–3.00 mm', price: 'Get quotation', description: 'Galvanized sheets supplied in standard and custom cut sizes for industrial and construction requirements.', videoLabel: 'GI Sheets' },
]

export function getProduct(slug: string) {
  return products.find((product) => product.slug === slug)
}
