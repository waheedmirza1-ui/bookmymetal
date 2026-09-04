const chips=[...document.querySelectorAll('.chip')];
const cards=[...document.querySelectorAll('.card')];
const input=document.getElementById('searchInput');

function filterCards(){
  const active=document.querySelector('.chip.active')?.dataset.filter||'all';
  const q=(input?.value||'').toLowerCase().trim();
  cards.forEach(card=>{
    const categoryMatch=active==='all'||card.dataset.category===active;
    const textMatch=!q||card.innerText.toLowerCase().includes(q);
    card.classList.toggle('hide',!(categoryMatch&&textMatch));
  });
}

chips.forEach(chip=>chip.addEventListener('click',()=>{
  chips.forEach(c=>c.classList.remove('active'));
  chip.classList.add('active');
  filterCards();
}));

input?.addEventListener('input',filterCards);

document.querySelectorAll('.compare').forEach(btn=>btn.addEventListener('click',()=>{
  btn.classList.toggle('selected');
  btn.textContent=btn.classList.contains('selected')?'✓ Added':'＋ Compare';
}));

document.querySelectorAll('.primary').forEach(btn=>btn.addEventListener('click',()=>{
  alert('Request Quote flow will connect to the buyer enquiry backend in the next build step.');
}));
