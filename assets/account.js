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

  function chooseRole(role) {
    roleInput.value = role;
    roles.forEach((button) => {
      const selected = button.dataset.role === role;
      button.classList.toggle('active', selected);
      button.setAttribute('aria-pressed', String(selected));
    });
    registerForm.querySelector('.primary').innerHTML = `Create ${role} account <span>→</span>`;
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
  roles.forEach((button) => button.addEventListener('click', () => chooseRole(button.dataset.role)));

  registerForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const values = new FormData(registerForm);
    const name = String(values.get('name') || '').trim();
    const email = String(values.get('email') || '').trim();
    const password = String(values.get('password') || '');
    const confirmPassword = String(values.get('confirmPassword') || '');
    if (name.length < 2) return showStatus('Enter your full name.', true);
    if (!email || !email.includes('@')) return showStatus('Enter a valid work email.', true);
    if (password.length < 10) return showStatus('Use a password with at least 10 characters.', true);
    if (password !== confirmPassword) return showStatus('The passwords do not match.', true);
    const role = String(values.get('role') || 'buyer');
    setBusy(registerForm, true, `Create ${role} account →`);
    try {
      const data = await requestAccount({ action: 'register', name, email, password, role, company: String(values.get('company') || '').trim() });
      showStatus('Account created. Taking you to your workspace…');
      window.setTimeout(() => window.location.assign(data.user?.role === 'seller' ? '../seller/' : '../marketplace/'), 650);
    } catch (error) {
      showStatus(error.message || 'Unable to create your account.', true);
    } finally {
      setBusy(registerForm, false, `Create ${role} account →`);
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
      window.setTimeout(() => window.location.assign(data.user?.role === 'seller' ? '../seller/' : '../marketplace/'), 650);
    } catch (error) {
      showStatus(error.message || 'Unable to sign in.', true);
    } finally {
      setBusy(loginForm, false, 'Sign in →');
    }
  });
})();
