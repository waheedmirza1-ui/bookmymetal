(function () {
  const categories = [
    ['Metals & Steel', 'metals-steel', ['steel', 'metal', 'coil', 'sheet', 'pipe', 'aluminium', 'copper']],
    ['Construction & Building Materials', 'construction-building-materials', ['construction', 'building', 'cement', 'roofing', 'tile', 'glass']],
    ['Industrial Machinery & Equipment', 'industrial-machinery-equipment', ['machine', 'machinery', 'equipment', 'cnc', 'compressor']],
    ['Manufacturing & Engineering', 'manufacturing-engineering', ['manufacturing', 'engineering', 'fabrication', 'machining', 'tooling']],
    ['Automotive & Components', 'automotive-components', ['automotive', 'vehicle', 'auto parts', 'component']],
    ['Agriculture & Agricultural Equipment', 'agriculture-equipment', ['agriculture', 'farm', 'tractor', 'irrigation']],
    ['Furniture & Interiors', 'furniture-interiors', ['furniture', 'chair', 'table', 'desk', 'interior']],
    ['Electrical & Electronics', 'electrical-electronics', ['electrical', 'electronics', 'cable', 'wire', 'switchgear']],
    ['Safety, PPE & Industrial Supplies', 'safety-ppe-industrial-supplies', ['safety', 'ppe', 'helmet', 'gloves', 'industrial supplies']],
    ['Tools & Hardware', 'tools-hardware', ['tools', 'hardware', 'fastener', 'power tool']],
    ['Packaging & Material Handling', 'packaging-material-handling', ['packaging', 'pallet', 'material handling', 'warehouse']],
    ['Commercial & Industrial Services', 'commercial-industrial-services', ['industrial service', 'maintenance', 'installation', 'service']],
    ['Logistics & Transportation', 'logistics-transportation', ['logistics', 'transport', 'freight', 'shipping']],
    ['Home & Building Products', 'home-building-products', ['home', 'building product', 'door', 'window']],
    ['Food & Hospitality Supplies', 'food-hospitality-supplies', ['food', 'hospitality', 'kitchen equipment']],
    ['Technology & Business Solutions', 'technology-business-solutions', ['technology', 'software', 'business solution', 'erp']],
    ['Energy & Renewable Energy', 'energy-renewable-energy', ['energy', 'solar', 'renewable', 'battery']],
    ['Chemicals & Industrial Materials', 'chemicals-industrial-materials', ['chemical', 'chemicals', 'polymer', 'industrial material']],
    ['Textiles & Garments', 'textiles-garments', ['textile', 'garment', 'fabric', 'apparel']],
    ['Healthcare & Medical Supplies', 'healthcare-medical-supplies', ['healthcare', 'medical', 'hospital', 'medical supplies']],
    ['Office & Commercial Supplies', 'office-commercial-supplies', ['office', 'commercial supplies', 'stationery']],
    ['Cleaning & Facility Supplies', 'cleaning-facility-supplies', ['cleaning', 'facility', 'sanitation']],
    ['Mining & Earthmoving Equipment', 'mining-earthmoving-equipment', ['mining', 'earthmoving', 'excavator']],
    ['Marine & Industrial Equipment', 'marine-industrial-equipment', ['marine', 'ship', 'industrial equipment']],
    ['Professional Business Services', 'professional-business-services', ['professional service', 'consulting', 'legal', 'accounting']]
  ].map(function (item) { return { name: item[0], slug: item[1], keywords: item[2] }; });
  function resolveCategory(query) {
    const normalized = String(query || '').toLowerCase().trim();
    if (!normalized) return null;
    return categories.find(function (category) { return category.keywords.some(function (keyword) { return normalized.includes(keyword); }); }) || null;
  }
  window.BMMMarketplaceData = { categories: categories, resolveCategory: resolveCategory };
}());
