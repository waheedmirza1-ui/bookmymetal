(() => {
  const registerTab = document.querySelector('#register-tab');
  const loginTab = document.querySelector('#login-tab');
  const registerPanel = document.querySelector('#register-panel');
  const loginPanel = document.querySelector('#login-panel');
  const registerForm = document.querySelector('#register-form');
  const loginForm = document.querySelector('#login-form');
  const status = document.querySelector('#form-status');
  const roleInput = registerForm.querySelector('[name="role"]');
  const roles = document.querySelectorAll('.role');

  function showStatus(message, isError = false) {
    status.textContent = message;
    status.hidden = false;
    status.classList.toggle('error', isError);
  }

  function selectTab(mode) {
    const isRegister = mode === 'register';
    registerTab.classList.toggle('active', isRegister);
    loginTab.classList.toggle('active', !isRegister);
    registerTab.setAttribute('aria-selected', String(isRegister));
    loginTab.setAttribute('aria-selected', String(!isRegister));
    registerPanel.hidden = !isRegister;
    loginPanel.hidden = isRegister;
    status.hidden = true;
  }


  async function requestAccount(payload) {
    const response = await fetch('../api/auth.php', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    let data;
    try { data = await response.json(); }
    catch { throw new Error('The account service returned an unexpected response. Please try again later.'); }
    if (!response.ok || !data.ok) throw new Error(data.error || 'We could not complete that request.');
    return data;
  }

  function setBusy(form, busy, label) {
    const button = form.querySelector('button[type="submit"]');
    button.disabled = busy;
    button.textContent = busy ? 'Please wait…' : label;
  }

  registerTab.addEventListener('click', () => selectTab('register'));
  loginTab.addEventListener('click', () => selectTab('login'));

  registerForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const values = new FormData(registerForm);
    const name = String(values.get('name') || '').trim();
    const email = String(values.get('email') || '').trim();
    const password = String(values.get('password') || '');
    const confirmPassword = String(values.get('confirmPassword') || '');
    if (name.length < 2) return showStatus('Enter your full name.', true);
    if (!email || !email.includes('@')) return showStatus('Enter a valid work email.', true);
    if (password.length < 8) return showStatus('Use a password with at least 8 characters.', true);
    if (password !== confirmPassword) return showStatus('The passwords do not match.', true);
    setBusy(registerForm, true, 'Create account →');
    try {
      await requestAccount({ action: 'register', name, email, password, company: String(values.get('company') || '').trim() });
      showStatus('Account created. Taking you to your workspace…');
      window.setTimeout(() => window.location.assign('../marketplace/'), 650);
    } catch (error) {
      showStatus(error.message || 'Unable to create your account.', true);
    } finally {
      setBusy(registerForm, false, 'Create account →');
    }
  });

  loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const values = new FormData(loginForm);
    const email = String(values.get('email') || '').trim();
    const password = String(values.get('password') || '');
    if (!email || !password) return showStatus('Enter your email and password.', true);
    setBusy(loginForm, true, 'Sign in →');
    try {
      const data = await requestAccount({ action: 'login', email, password });
      showStatus('Signed in. Taking you to your workspace…');
      window.setTimeout(() => window.location.assign('../marketplace/'), 650);
    } catch (error) {
      showStatus(error.message || 'Unable to sign in.', true);
    } finally {
      setBusy(loginForm, false, 'Sign in →');
    }
  });
})();

(() => {
  const status = document.querySelector('#form-status');
  const otpRequestForms = document.querySelectorAll('.otp-request-form');
  const otpVerifyForm = document.querySelector('#otp-verify-form');
  const otpVerifyPanel = document.querySelector('#otp-verify-panel');
  const otpProfilePanel = document.querySelector('#otp-profile-panel');
  const resetPanel = document.querySelector('#reset-password-panel');
  const otpLabel = document.querySelector('#otp-destination-label');
  const resend = document.querySelector('#otp-resend');
  const forgot = document.querySelector('#forgot-password');
  const resetRequestForm = document.querySelector('#reset-request-form');
  const otpProfileForm = document.querySelector('#otp-profile-form');
  const resetForm = document.querySelector('#reset-password-form');
  const primaryPanel = document.querySelector('#primary-auth-panel');
  const usePassword = document.querySelector('#use-password');
  const createPasswordAccount = document.querySelector('#create-password-account');
  let destination = '';
  let purpose = 'login';
  let resendTimer;

  function show(message, error = false) { status.textContent = message; status.hidden = false; status.classList.toggle('error', error); }
  function hideSubflows() { [otpVerifyPanel, otpProfilePanel, resetPanel].forEach((panel) => { panel.hidden = true; }); }
  function requestOptions() { return { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' } }; }
  async function otpRequest(payload) {
    const response = await fetch('../api/otp.php', { ...requestOptions(), body: JSON.stringify(payload) });
    const data = await response.json().catch(() => ({}));
    if (!response.ok || !data.ok) throw new Error(data.error || 'Unable to complete this request.');
    return data;
  }
  function startResend(seconds) {
    window.clearInterval(resendTimer);
    let remaining = Number(seconds || 60);
    resend.disabled = true;
    resend.textContent = `Resend code in ${remaining}s`;
    resendTimer = window.setInterval(() => { remaining -= 1; resend.textContent = remaining > 0 ? `Resend code in ${remaining}s` : 'Resend code'; if (remaining <= 0) { resend.disabled = false; window.clearInterval(resendTimer); } }, 1000);
  }
  async function sendOtp(value, requestedPurpose) {
    destination = value.trim(); purpose = requestedPurpose;
    const data = await otpRequest({ action: 'request', destination, purpose });
    otpLabel.textContent = `We sent a 6-digit code to ${data.destination}. It expires in 5 minutes.`;
    primaryPanel.hidden = true; document.body.classList.remove('password-login','password-register'); hideSubflows(); otpVerifyPanel.hidden = false; startResend(data.resend_in); show('A one-time code was sent.');
  }
  document.querySelectorAll('.oauth-button').forEach((button) => button.addEventListener('click', (event) => { if (button.getAttribute('aria-disabled') === 'true') { event.preventDefault(); show('Blocked — requires OAuth credentials configured on the server.', true); } }));
  fetch('../api/oauth-status.php').then((response) => response.json()).then((data) => {
    document.querySelectorAll('.oauth-button').forEach((button) => { const available = Boolean(data.providers?.[button.dataset.provider]); const badge = button.querySelector('.oauth-badge'); badge.textContent = available ? 'Available' : 'Blocked — credentials required'; badge.classList.toggle('blocked', !available); if (!available) button.setAttribute('aria-disabled', 'true'); });
  }).catch(() => { document.querySelectorAll('.oauth-button').forEach((button) => { button.setAttribute('aria-disabled', 'true'); const badge = button.querySelector('.oauth-badge'); badge.textContent = 'Blocked — credentials required'; badge.classList.add('blocked'); }); });
  otpRequestForms.forEach((form) => form.addEventListener('submit', async (event) => { event.preventDefault(); const button = form.querySelector('button'); button.disabled = true; try { await sendOtp(String(new FormData(form).get('destination') || ''), 'login'); } catch (error) { show(error.message, true); } finally { button.disabled = false; } }));
  resend?.addEventListener('click', async () => { try { await sendOtp(destination, purpose); } catch (error) { show(error.message, true); } });
  otpVerifyForm?.addEventListener('submit', async (event) => { event.preventDefault(); try { const data = await otpRequest({ action: 'verify', destination, purpose, code: String(new FormData(otpVerifyForm).get('code') || '') }); if (data.next === 'profile') { hideSubflows(); otpProfilePanel.hidden = false; show('Code verified. Complete your BookMyMetal profile.'); return; } if (data.next === 'reset_password') { hideSubflows(); resetPanel.hidden = false; show('Code verified. Choose a new password.'); return; } window.location.assign('../marketplace/'); } catch (error) { show(error.message, true); } });
  otpProfileForm?.addEventListener('submit', async (event) => { event.preventDefault(); const data = new FormData(otpProfileForm); try { const result = await otpRequest({ action: 'complete_profile', name: String(data.get('name') || ''), company: String(data.get('company') || '') }); if (!result.ok) throw new Error(result.error || 'Unable to create your account.'); window.location.assign('../marketplace/'); } catch (error) { show(error.message, true); } });
  forgot?.addEventListener('click', () => { resetRequestForm.hidden = !resetRequestForm.hidden; if (!resetRequestForm.hidden) resetRequestForm.querySelector('input').focus(); });
  resetRequestForm?.addEventListener('submit', async (event) => { event.preventDefault(); try { await sendOtp(String(new FormData(resetRequestForm).get('destination') || ''), 'password_reset'); } catch (error) { show(error.message, true); } });
  resetForm?.addEventListener('submit', async (event) => { event.preventDefault(); const data = new FormData(resetForm); const password = String(data.get('password') || ''); if (password.length < 8 || password !== String(data.get('confirmPassword') || '')) return show('Use matching passwords with at least 8 characters.', true); try { await otpRequest({ action: 'reset_password', password }); show('Password updated. You can now sign in.'); } catch (error) { show(error.message, true); } });
  usePassword?.addEventListener('click', () => { primaryPanel.hidden = true; registerPanel.hidden = true; loginPanel.hidden = false; document.body.classList.add('password-login'); document.querySelector('#login-panel input')?.focus(); });
  createPasswordAccount?.addEventListener('click', () => { primaryPanel.hidden = true; loginPanel.hidden = true; registerPanel.hidden = false; document.body.classList.remove('password-login'); document.body.classList.add('password-register'); document.querySelector('#register-panel input')?.focus(); });
  const params = new URLSearchParams(window.location.search);
  if (params.get('oauth_error')) show(params.get('oauth_error') === 'credentials' ? 'Blocked — requires OAuth credentials configured on the server.' : 'Social sign-in was not completed.', true);
})();
