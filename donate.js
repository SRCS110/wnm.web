(function () {
  const amountBtns = document.querySelectorAll('.donate-amount');
  const customRow = document.querySelector('.donate-custom-row');
  const customInput = document.getElementById('donate-custom-amount');
  const submitBtn = document.getElementById('donate-submit');
  const freqBtns = document.querySelectorAll('.donate-toggle-btn');

  let selectedAmount = 100;
  let frequency = 'once';

  function updateSubmitLabel() {
    const amt = customInput && !customInput.closest('.donate-custom-row').hidden && customInput.value
      ? Number(customInput.value)
      : selectedAmount;
    const suffix = frequency === 'monthly' ? '/month' : '';
    submitBtn.textContent = amt ? `Donate $${amt}${suffix}` : 'Donate';
  }

  amountBtns.forEach(btn => {
    btn.addEventListener('click', function () {
      amountBtns.forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      if (this.dataset.amount === 'custom') {
        customRow.hidden = false;
        customInput.focus();
        selectedAmount = Number(customInput.value) || 0;
      } else {
        customRow.hidden = true;
        selectedAmount = Number(this.dataset.amount);
      }
      updateSubmitLabel();
    });
  });

  customInput?.addEventListener('input', function () {
    selectedAmount = Number(this.value) || 0;
    updateSubmitLabel();
  });

  freqBtns.forEach(btn => {
    btn.addEventListener('click', function () {
      freqBtns.forEach(b => { b.classList.remove('active'); b.setAttribute('aria-selected', 'false'); });
      this.classList.add('active');
      this.setAttribute('aria-selected', 'true');
      frequency = this.dataset.frequency;
      updateSubmitLabel();
    });
  });

  submitBtn?.addEventListener('click', function () {
    if (!selectedAmount || selectedAmount < 1) {
      alert('Please choose or enter a donation amount.');
      return;
    }
    startCheckout({
      label: `Donation to the Wednesday Night Market${frequency === 'monthly' ? ' (monthly)' : ''}`,
      amountCents: Math.round(selectedAmount * 100),
      mode: frequency === 'monthly' ? 'subscription' : 'payment',
      metadata: { kind: 'donation', frequency },
      triggerEl: this
    });
  });

  updateSubmitLabel();
})();
