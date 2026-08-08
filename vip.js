document.getElementById('buy-vip-night')?.addEventListener('click', function () {
  startCheckout({
    label: 'VIP Ticket — single night',
    amountCents: 4000,
    mode: 'payment',
    metadata: { kind: 'vip-night' },
    triggerEl: this
  });
});

document.getElementById('buy-vip-season')?.addEventListener('click', function () {
  startCheckout({
    label: 'VIP Season Pass — 14 nights',
    amountCents: 45000,
    mode: 'payment',
    metadata: { kind: 'vip-season' },
    triggerEl: this
  });
});
