const chips=[...document.querySelectorAll('.chip')];
const cards=[...document.querySelectorAll('.card')];
const input=document.getElementById('searchInput');

chips.forEach(chip=>chip.addEventListener('click',()=>{
  chips.forEach(c=>c.classList.remove('active'));
  chip.classList.add('active');
  const filter=chip.dataset.filter;
  cards.forEach(card=>card.classList.toggle('hide',filter!=='all'&&card.dataset.category!==filter));
}));

input?.addEventListener('input',()=>{
  const q=input.value.toLowerCase().trim();
  cards.forEach(card=>card.classList.toggle('hide',q&&!card.innerText.toLowerCase().includes(q)));
});

document.querySelectorAll('.compare').forEach(btn=>btn.addEventListener('click',()=>{
  btn.classList.toggle('selected');
  btn.textContent=btn.classList.contains('selected')?'✓ Added':'＋ Compare';
}));

document.querySelectorAll('.primary').forEach(btn=>btn.addEventListener('click',()=>{
  const card=btn.closest('.card');
  const product=card?.querySelector('h3')?.textContent.trim()||'Product';
  openRfq(product,card?.dataset.category||'');
}));

function openRfq(product,category){
  const name=prompt('Your name:');
  if(!name) return;
  const company=prompt('Company name:');
  if(!company) return;
  const email=prompt('Business email:');
  if(!email) return;
  const message=prompt(`What do you need for ${product}?`)||'';
  fetch('../api/rfq.php',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name,company,email,product,category,message})})
    .then(async r=>{const data=await r.json();if(!r.ok||!data.ok) throw new Error(data.error||'Unable to submit');return data;})
    .then(data=>alert(`RFQ #${data.rfq_id} submitted successfully.`))
    .catch(err=>alert(err.message));
}
