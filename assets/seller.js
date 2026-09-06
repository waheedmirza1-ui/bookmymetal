(() => {
  const cta = document.querySelector('#seller-cta');
  const note = document.querySelector('#session-note');
  const workspace = document.querySelector('#seller-workspace');
  fetch('../api/session.php?action=me', { credentials: 'include' })
    .then(async (response) => ({ response, data: await response.json() }))
    .then(({ response, data }) => {
      if (!response.ok || !data.authenticated) throw new Error('not signed in');
      const user = data.user || {};
      if (user.role !== 'seller' && !user.seller_enabled) {
        note.textContent = 'Your account can source immediately. Activate selling when you are ready to publish listings.';
        cta.innerHTML = '<button id="activate-selling" class="primary" type="button">Activate selling <span>→</span></button><a class="secondary" href="../marketplace/">Continue sourcing</a>';
        document.querySelector('#activate-selling').addEventListener('click', activateSelling);
        return;
      }
      note.textContent = `Signed in as ${user.company || user.name || 'seller'}. Your seller workspace is ready to set up.`;
      cta.innerHTML = '<a class="primary" href="#seller-workspace">Continue seller setup <span>→</span></a><a class="secondary" href="../marketplace/">View marketplace</a>';
      workspace.hidden = false;
      initWorkspace();
    })
    .catch(() => { note.textContent = 'Create a seller account to begin your BookMyMetal storefront.'; });
  function text(value) { return String(value || ''); }
  function escapeHtml(value) { const node = document.createElement('span'); node.textContent = text(value); return node.innerHTML; }
  function initWorkspace() {
    const form = document.querySelector('#product-form');
    const status = document.querySelector('#product-status');
    const productList = document.querySelector('#seller-products');
    const enquiryList = document.querySelector('#seller-enquiries');
    const loadProducts = () => fetch('../api/seller-products.php', { credentials: 'include' }).then(r => r.json()).then(data => {
      const items = data.products || [];
      productList.innerHTML = items.length ? items.map(item => `<article class="listing-card"><div class="listing-meta"><span>${escapeHtml(item.category)}</span><span class="status-tag ${escapeHtml(item.video_status)}">${escapeHtml(item.video_status)}</span></div><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.description || 'No specification supplied.')}</p></article>`).join('') : '<p class="empty-listing">No listings yet. Submit a real product video to begin review.</p>';
    }).catch(() => { productList.innerHTML = '<p class="empty-listing">Your listings are unavailable right now. Please refresh and try again.</p>'; });
    const loadEnquiries = () => fetch('../api/seller-enquiries.php', { credentials: 'include' }).then(r => r.json()).then(data => {
      const items = data.enquiries || [];
      enquiryList.innerHTML = items.length ? items.map(item => `<article class="enquiry-card"><div><div class="listing-meta"><span>${escapeHtml(item.status)}</span><small>${escapeHtml(item.created_at)}</small></div><h3>${escapeHtml(item.product)}</h3><p>${escapeHtml(item.name)} · ${escapeHtml(item.company)} · ${escapeHtml(item.email)}</p></div><select data-enquiry-id="${Number(item.id)}" aria-label="Update enquiry status"><option value="new">New</option><option value="contacted">Contacted</option><option value="quoted">Quoted</option><option value="closed">Closed</option></select></article>`).join('') : '<p class="empty-listing">No buyer enquiries yet.</p>';
      enquiryList.querySelectorAll('select[data-enquiry-id]').forEach(select => { select.value = select.closest('.enquiry-card').querySelector('.listing-meta span').textContent; select.addEventListener('change', () => fetch('../api/seller-enquiries.php', { method: 'PATCH', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: Number(select.dataset.enquiryId), status: select.value }) }).then(loadEnquiries)); });
    }).catch(() => { enquiryList.innerHTML = '<p class="empty-listing">Buyer enquiries are unavailable right now.</p>'; });
    form.addEventListener('submit', event => {
      event.preventDefault(); status.className = 'form-status'; if (!form.reportValidity()) return;
      status.textContent = 'Uploading securely and submitting for review…'; const button = form.querySelector('button'); button.disabled = true;
      fetch('../api/seller-product.php', { method: 'POST', credentials: 'include', body: new FormData(form) }).then(async response => ({ response, data: await response.json() })).then(({ response, data }) => {
        if (!response.ok || !data.ok) throw new Error(data.error || 'Unable to submit listing.'); form.reset(); status.className = 'form-status success'; status.textContent = 'Submitted for moderation. It will appear publicly only after approval.'; loadProducts();
      }).catch(error => { status.className = 'form-status error'; status.textContent = error.message || 'Unable to submit listing.'; }).finally(() => { button.disabled = false; });
    });
    loadProducts(); loadEnquiries();
  }
  function activateSelling() {
    const button = document.querySelector('#activate-selling');
    button.disabled = true; button.textContent = 'Activating…';
    fetch('../api/seller-activate.php', { method: 'POST', credentials: 'include' })
      .then(async (response) => ({ response, data: await response.json() }))
      .then(({ response, data }) => { if (!response.ok || !data.ok) throw new Error(data.error || 'Unable to activate selling.'); window.location.reload(); })
      .catch((error) => { note.textContent = error.message || 'Unable to activate selling.'; button.disabled = false; button.innerHTML = 'Activate selling <span>→</span>'; });
  }
})();
