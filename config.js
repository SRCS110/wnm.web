/* ════════════════════════════════════════════════════════════
   SITE CONFIG — fill in once before deploying
   ------------------------------------------------------------
   This is the single place project credentials live.

   Supabase's "anon" key is designed to be public — it ships to
   every visitor's browser and is safe to commit to this file.
   Row Level Security in Supabase is what actually protects your
   data, not hiding this key.

   Square works differently from Stripe here: there is NO Square
   key that belongs in this file. Creating a checkout link requires
   your Square ACCESS TOKEN, which must stay server-side only. It
   lives in the Supabase Edge Function at
   /supabase/functions/create-checkout-link, set as a deployed
   secret — never in site/ and never in this file.
   ════════════════════════════════════════════════════════════ */

const SITE_CONFIG = {
  supabase: {
    url: '',        // e.g. 'https://xxxxxxxx.supabase.co' — Project Settings → API
    anonKey: ''      // Project Settings → API → "anon public" key
  },
  organization: {
    name: 'Wednesday Night Market',
    ein: ''   // optional — for donation receipts, if you want it referenced client-side
  }
};

function isConfigured() {
  return Boolean(SITE_CONFIG.supabase.url && SITE_CONFIG.supabase.anonKey);
}

// Payments route entirely through the Supabase Edge Function, so the only
// client-side requirement is Supabase being configured.
function isPaymentsConfigured() {
  return isConfigured();
}
