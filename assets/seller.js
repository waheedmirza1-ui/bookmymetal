(() => {
  const cta = document.querySelector('#seller-cta');
  const note = document.querySelector('#session-note');
  const workspace = document.querySelector('#seller-workspace');
  fetch('../api/session.php?action=me', { credentials: 'include' })
    .then(async (response) => ({ response, data: await response.json() }))
    .then(({ response, data }) => {
      if (!response.ok || !data.authenticated) throw new Error('not signed in');
      const user = data.user || {};
      if (user.role !== 'seller') {
        note.textContent = 'You are signed in as a buyer. Create a seller account to publish listings.';
        return;
      }
      note.textContent = `Signed in as ${user.company || user.name || 'seller'}. Your seller workspace is ready to set up.`;
      cta.innerHTML = '<a class="primary" href="#seller-workspace">Continue seller setup <span>→</span></a><a class="secondary" href="../marketplace/">View marketplace</a>';
      workspace.hidden = false;
    })
    .catch(() => { note.textContent = 'Create a seller account to begin your BookMyMetal storefront.'; });
})();
