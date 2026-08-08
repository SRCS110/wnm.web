/* ════════════════════════════════════════════════════════════
   SUPABASE CLIENT — auth + vendor application data
   Depends on config.js being loaded first, and the Supabase JS
   SDK (loaded via CDN in the <head> of pages that need it).
   ════════════════════════════════════════════════════════════ */

let supabaseClient = null;

function getSupabaseClient() {
  if (!isConfigured()) return null;
  if (!supabaseClient && window.supabase) {
    supabaseClient = window.supabase.createClient(SITE_CONFIG.supabase.url, SITE_CONFIG.supabase.anonKey);
  }
  return supabaseClient;
}

async function signInWithGoogle() {
  const client = getSupabaseClient();
  if (!client) throw new Error('not-configured');
  return client.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: window.location.href }
  });
}

async function signOut() {
  const client = getSupabaseClient();
  if (!client) return;
  return client.auth.signOut();
}

async function getCurrentUser() {
  const client = getSupabaseClient();
  if (!client) return null;
  const { data } = await client.auth.getUser();
  return data ? data.user : null;
}

/* Expects a `vendor_applications` table:
   id, user_id, business_name, category, contact_name, phone, email,
   description, status ('pending' | 'approved' | 'rejected'), fee_paid (bool), created_at */
async function submitVendorApplication(fields) {
  const client = getSupabaseClient();
  if (!client) throw new Error('not-configured');
  const user = await getCurrentUser();
  return client.from('vendor_applications').insert({
    user_id: user ? user.id : null,
    business_name: fields.businessName,
    category: fields.category,
    contact_name: fields.contactName,
    phone: fields.phone,
    email: fields.email,
    description: fields.description,
    status: 'pending',
    fee_paid: false
  });
}

async function getMyApplication() {
  const client = getSupabaseClient();
  if (!client) return null;
  const user = await getCurrentUser();
  if (!user) return null;
  const { data } = await client
    .from('vendor_applications')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();
  return data;
}
