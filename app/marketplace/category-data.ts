export const marketplaceCategories = [
  { name:'PPGL Roofing Sheets', slug:'ppgl-roofing-sheets', keywords:['ppgl','ppgi','roofing sheet','roofing sheets','colour coated sheet','color coated sheet'] },
  { name:'Steel Coils', slug:'steel-coils', keywords:['steel coil','steel coils','hr coil','cr coil','slitting'] },
  { name:'Structural Fabrication', slug:'structural-fabrication', keywords:['structural fabrication','steel fabrication','fabrication','shed fabrication','truss'] },
  { name:'MS / GI Pipes', slug:'ms-gi-pipes', keywords:['ms pipe','gi pipe','steel pipe','pipes','tube','tubes'] },
  { name:'Industrial Machines', slug:'industrial-machines', keywords:['machine','machines','press brake','slitting line','crimping machine','roll forming'] },
  { name:'Roofing Accessories', slug:'roofing-accessories', keywords:['ridge','gutter','flashing','roofing accessory','roofing accessories'] },
  { name:'Furniture', slug:'furniture', keywords:['furniture','chair','chairs','table','tables','desk','office furniture','steel furniture'] },
  { name:'Construction Materials', slug:'construction-materials', keywords:['construction material','cement','building material','building materials'] },
  { name:'Electrical', slug:'electrical', keywords:['electrical','cable','wire','switchgear'] },
];

export function resolveCategory(query:string){
 const q=query.toLowerCase().trim();
 if(!q) return null;
 return marketplaceCategories.find(c=>c.keywords.some(k=>q.includes(k))) ?? null;
}
