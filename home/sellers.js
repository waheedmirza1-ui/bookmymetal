async function loadSellers(){
  const grid=document.getElementById('sellerGrid');
  const search=document.getElementById('sellerSearch');
  let sellers=[];
  try{ const r=await fetch('../data/sellers.json',{cache:'no-store'}); sellers=await r.json(); }catch(e){ grid.innerHTML='<p>Seller directory is temporarily unavailable.</p>'; return; }
  const render=()=>{
    const q=(search.value||'').toLowerCase().trim();
    const rows=sellers.filter(s=>!q || [s.company,s.location,s.category,...s.products].join(' ').toLowerCase().includes(q));
    grid.innerHTML=rows.map(s=>`<article class="seller-profile"><div class="seller-top"><div class="seller-mark">${s.company.split(' ').map(x=>x[0]).slice(0,2).join('')}</div><div><h2>${s.company}</h2><p>${s.location}</p></div><span class="seller-status">${s.verified?'Verified':'Unverified'}</span></div><div class="seller-meta"><span>${s.business_type}</span><span>Est. ${s.founded}</span><span>${s.category}</span></div><p class="seller-desc">${s.products.slice(0,6).join(' • ')}</p><div class="seller-video"><strong>Video available online</strong><small>${s.video_status}</small><a href="${s.video_source}" target="_blank" rel="noopener">View source video/profile ↗</a></div><div class="seller-actions"><a class="primary" href="${s.website}" target="_blank" rel="noopener">Company website</a><a class="secondary" href="mailto:${s.email||''}">${s.email?'Contact seller':'Seller contact'}</a></div></article>`).join('') || '<p>No matching sellers found.</p>';
  };
  search.addEventListener('input',render); render();
}
loadSellers();
