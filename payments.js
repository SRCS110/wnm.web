/* ════════════════════════════════════════════════════════════
   PAYMENTS — Square-hosted Checkout via a Supabase Edge Function
   ------------------------------------------------------------
   Client code never touches your Square access token. It calls
   the 'create-checkout-link' Edge Function (see /supabase/functions/
   create-checkout-link), which creates a Square Payment Link
   server-side and returns its URL to redirect to.

   Note: Square's Payment Links API does one-time payments out of
   the box. Recurring/monthly payments require a Subscription Plan
   set up in your Square catalog first — that's flagged separately
   below rather than silently treated as one-time.
   ════════════════════════════════════════════════════════════ */

/**
 * @param {Object} item
 * @param {string} item.label        Shown on the Square checkout page
 * @param {number} item.amountCents  Price in cents (e.g. 4000 = $40.00)
 * @param {'payment'|'subscription'} item.mode
 * @param {Object} [item.metadata]   Extra data attached as a payment note
 */
async function startCheckout(item) {
  if (item.mode === 'subscription') {
    alert(
      "Monthly giving isn't set up yet.\n\n" +
      "Square handles recurring payments through a Subscription Plan in your " +
      "Square catalog (Square Dashboard → Subscriptions), which then needs a small " +
      "addition to the create-checkout-link function. One-time donations work today."
    );
    return;
  }

  if (!isPaymentsConfigured()) {
    alert(
      "Payments aren't connected yet.\n\n" +
      "Add your Supabase URL/anon key to config.js, and deploy the " +
      "create-checkout-link Edge Function with your Square credentials, to enable real checkout."
    );
    return;
  }

  const client = getSupabaseClient();
  const button = item.triggerEl;
  const originalText = button ? button.textContent : null;
  if (button) { button.disabled = true; button.textContent = 'Redirecting…'; }

  try {
    const { data, error } = await client.functions.invoke('create-checkout-link', {
      body: {
        label: item.label,
        amountCents: item.amountCents,
        metadata: item.metadata || {},
        redirectUrl: window.location.origin + window.location.pathname + '?checkout=success'
      }
    });
    if (error) throw error;
    if (data && data.url) {
      window.location.href = data.url;
      return;
    }
    throw new Error('No checkout URL returned');
  } catch (err) {
    console.error('Checkout error:', err);
    alert("Something went wrong starting checkout. Please try again in a moment.");
    if (button) { button.disabled = false; button.textContent = originalText; }
  }
}
