export default async function handler(req, res) {
  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceKey) {
    return res.status(500).json({ error: 'Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY' });
  }

  const rawKey = req.method === 'GET' ? req.query.key : req.body?.key;
  const profileKey = String(rawKey || 'winter_arc_default')
    .replace(/[^a-zA-Z0-9_-]/g, '_')
    .slice(0, 120);

  const baseUrl = supabaseUrl.replace(/\/+$/, '');
  const headers = {
    apikey: serviceKey,
    'Content-Type': 'application/json'
  };

  try {
    if (req.method === 'GET') {
      const url = `${baseUrl}/rest/v1/winter_arc_profiles?profile_key=eq.${encodeURIComponent(profileKey)}&select=profile_key,state_json,updated_at`;
      const response = await fetch(url, { headers });
      if (!response.ok) {
        const errText = await response.text();
        return res.status(response.status).json({ error: errText });
      }
      const rows = await response.json();
      return res.status(200).json({ record: rows[0] || null });
    }

    if (req.method === 'POST') {
      const stateObj = req.body?.state;
      if (!stateObj || typeof stateObj !== 'object') {
        return res.status(400).json({ error: 'Invalid state object' });
      }

      const url = `${baseUrl}/rest/v1/winter_arc_profiles?on_conflict=profile_key`;
      const payload = [
        {
          profile_key: profileKey,
          state_json: stateObj,
          updated_at: new Date().toISOString()
        }
      ];

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          ...headers,
          Prefer: 'resolution=merge-duplicates,return=representation'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errText = await response.text();
        return res.status(response.status).json({ error: errText });
      }
      const rows = await response.json();
      return res.status(200).json({ ok: true, record: rows[0] || null });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    return res.status(500).json({ error: err.message || 'Internal server error' });
  }
}
