export default async function handler(req, res) {
  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceKey) {
    return res.status(500).json({ error: 'Missing Supabase environment variables' });
  }

  const profileKey = String(
    (req.method === 'GET' ? req.query.key : req.body?.key) || 'default_winter_arc'
  ).replace(/[^a-zA-Z0-9_-]/g, '_');

  const headers = {
    apikey: serviceKey,
    Authorization: `Bearer ${serviceKey}`,
    'Content-Type': 'application/json',
    Prefer: 'return=representation'
  };

  try {
    if (req.method === 'GET') {
      const url = `${supabaseUrl}/rest/v1/winter_arc_profiles?profile_key=eq.${encodeURIComponent(profileKey)}&select=profile_key,state_json,updated_at`;
      const r = await fetch(url, { headers });
      if (!r.ok) {
        const text = await r.text();
        return res.status(r.status).json({ error: text });
      }
      const rows = await r.json();
      return res.status(200).json({ record: rows[0] || null });
    }

    if (req.method === 'POST') {
      const stateJson = req.body?.state;
      if (!stateJson || typeof stateJson !== 'object') {
        return res.status(400).json({ error: 'Invalid state payload' });
      }

      const url = `${supabaseUrl}/rest/v1/winter_arc_profiles?on_conflict=profile_key`;
      const payload = [
        {
          profile_key: profileKey,
          state_json: stateJson,
          updated_at: new Date().toISOString()
        }
      ];

      const r = await fetch(url, {
        method: 'POST',
        headers: { ...headers, Prefer: 'resolution=merge-duplicates,return=representation' },
        body: JSON.stringify(payload)
      });

      if (!r.ok) {
        const text = await r.text();
        return res.status(r.status).json({ error: text });
      }
      const rows = await r.json();
      return res.status(200).json({ ok: true, record: rows[0] || null });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    return res.status(500).json({ error: err.message || 'Server error' });
  }
}
