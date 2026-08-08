(function () {
  const signedOutPanel = document.getElementById('portal-signed-out');
  const dashboard = document.getElementById('portal-dashboard');
  const googleBtn = document.getElementById('portal-google-btn');
  const signoutBtn = document.getElementById('portal-signout-btn');
  const nameEl = document.getElementById('portal-user-name');
  const emailEl = document.getElementById('portal-user-email');
  const statusDot = document.getElementById('portal-status-dot');
  const statusLabel = document.getElementById('portal-status-label');
  const appForm = document.getElementById('portal-application-form');
  const payBtn = document.getElementById('portal-pay-btn');

  const STATUS_TEXT = {
    pending: 'Application submitted — under review',
    approved: 'Application approved',
    rejected: 'Application not approved this season',
  };

  async function renderAuthState() {
    if (!isConfigured()) {
      signedOutPanel.hidden = false;
      dashboard.hidden = true;
      const note = signedOutPanel.querySelector('.portal-signin-note');
      if (note) note.textContent = "Sign-in isn't connected yet — add Supabase credentials to config.js to enable vendor accounts.";
      googleBtn.disabled = true;
      return;
    }

    const user = await getCurrentUser();
    if (!user) {
      signedOutPanel.hidden = false;
      dashboard.hidden = true;
      return;
    }

    signedOutPanel.hidden = true;
    dashboard.hidden = false;
    nameEl.textContent = user.user_metadata?.full_name || user.email;
    emailEl.textContent = user.email;

    const application = await getMyApplication();
    if (application) {
      statusDot.dataset.status = application.status;
      statusLabel.textContent = STATUS_TEXT[application.status] || 'Application on file';
      appForm.querySelector('button[type="submit"]').textContent = 'Update Application';
      if (application.business_name) appForm.businessName.value = application.business_name;
      if (application.category) appForm.category.value = application.category;
      if (application.contact_name) appForm.contactName.value = application.contact_name;
      if (application.phone) appForm.phone.value = application.phone;
      if (application.email) appForm.email.value = application.email;
      if (application.description) appForm.description.value = application.description;
    } else {
      statusDot.dataset.status = 'none';
      statusLabel.textContent = 'No application on file yet';
    }
  }

  googleBtn?.addEventListener('click', async () => {
    try {
      await signInWithGoogle();
    } catch (err) {
      alert("Sign-in isn't connected yet — add Supabase credentials to config.js first.");
    }
  });

  signoutBtn?.addEventListener('click', async () => {
    await signOut();
    renderAuthState();
  });

  appForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const fields = Object.fromEntries(new FormData(appForm).entries());
    const submitBtn = appForm.querySelector('button[type="submit"]');
    const original = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Submitting…';
    try {
      await submitVendorApplication(fields);
      statusDot.dataset.status = 'pending';
      statusLabel.textContent = STATUS_TEXT.pending;
      submitBtn.textContent = 'Update Application';
    } catch (err) {
      alert("Couldn't submit your application — Supabase isn't connected yet.");
      submitBtn.textContent = original;
    } finally {
      submitBtn.disabled = false;
    }
  });

  payBtn?.addEventListener('click', function () {
    startCheckout({
      label: 'Vendor application fee',
      amountCents: 3500,
      mode: 'payment',
      metadata: { kind: 'vendor-fee' },
      triggerEl: this
    });
  });

  /* tabs */
  const tabs = document.querySelectorAll('.portal-tab');
  const panels = document.querySelectorAll('.portal-panel');
  tabs.forEach(tab => {
    tab.addEventListener('click', function () {
      tabs.forEach(t => { t.classList.remove('active'); t.setAttribute('aria-selected', 'false'); });
      this.classList.add('active');
      this.setAttribute('aria-selected', 'true');
      panels.forEach(p => { p.hidden = p.dataset.panel !== this.dataset.tab; });
    });
  });

  renderAuthState();
})();
