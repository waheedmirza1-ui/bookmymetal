(() => {
  const accountNavigation = document.querySelector('#account-navigation');
  const mobileNavigation = document.querySelector('#mobile-navigation');
  const reelGrid = document.querySelector('#reel-grid');
  const listingCount = document.querySelector('#listing-count');
  const categoryGrid = document.querySelector('#category-grid');
  let listings = [];
  let activeFilter = 'all';
  const safe = (value) => { const node = document.createElement('span'); node.textContent = String(value || ''); return node.innerHTML; };
  const renderHeader = (user) => {
    if (!user) return;
    accountNavigation.innerHTML = '<a href="../compare/">Compare</a><a href="../cart/">Cart</a><a href="../account/">Account</a><a class="signup-link" href="../seller/">Sell on BookMyMetal</a>';
    mobileNavigation.insertAdjacentHTML('beforeend', '<a href="../compare/">Compare</a><a href="../cart/">Cart</a><a href="../account/">Account</a><a href="../seller/">Sell on BookMyMetal</a>');
  };
  const renderReels = () => {
    const visible = activeFilter === 'all' ? listings : listings.filter((item) => item.type === activeFilter);
    listingCount.textContent = visible.length ? visible.length + ' approved seller video' + (visible.length === 1 ? '' : 's') : 'No approved videos in this view';
    reelGrid.innerHTML = visible.length ? visible.map((item) => {
      const spec = item.specs && item.specs[0] ? item.specs[0] : 'Specification available on request.';
      const media = item.video_url ? '<video controls playsinline preload="metadata" src="' + encodeURI(item.video_url) + '"></video><span class="reel-play">▶</span>' : '<div class="reel-empty">Video unavailable</div>';
      return '<article class="reel-card">' + '<div class="reel-media">' + media + '<span class="reel-type">' + safe(item.category) + '</span></div>' + '<div class="reel-copy"><h3>' + safe(item.title) + '</h3><p>' + safe(spec) + '</p><small class="reel-seller">' + safe(item.seller) + ' · ' + safe(item.location) + '</small><div class="reel-actions"><a href="../compare/?product=' + encodeURIComponent(item.db_id) + '">Compare</a><a href="../rfq/?product=' + encodeURIComponent(item.db_id) + '">Request quote</a></div></div></article>';
    }).join('') : '<div class="reel-empty"><strong>No approved supplier reels yet.</strong><br>Approved product and service videos will appear here.</div>';
  };
  document.querySelectorAll('.filter').forEach((button) => button.addEventListener('click', () => { activeFilter = button.dataset.filter; document.querySelectorAll('.filter').forEach((item) => item.classList.toggle('active', item === button)); renderReels(); }));
  fetch('../api/session.php?action=me', { credentials: 'include' }).then((response) => response.ok ? response.json() : null).then((data) => renderHeader(data && data.user)).catch(() => {});
  fetch('../api/marketplace-products.php').then((response) => response.ok ? response.json() : Promise.reject()).then((data) => { listings = data.results || []; renderReels(); }).catch(() => { listingCount.textContent = 'Seller videos are currently unavailable'; reelGrid.innerHTML = '<div class="reel-empty">Approved supplier reels are currently unavailable. Please refresh and try again.</div>'; });
  if (window.BMMMarketplaceData) categoryGrid.innerHTML = window.BMMMarketplaceData.categories.slice(0, 12).map((category) => '<a href="../categories/?category=' + encodeURIComponent(category.slug) + '">' + safe(category.name) + '</a>').join('');
})();
