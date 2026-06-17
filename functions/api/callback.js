/**
 * Cloudflare Pages Function: /api/callback
 *
 * Step 2 of the Decap CMS GitHub OAuth flow.
 * GitHub redirects here after the user authorizes the OAuth App:
 *   /api/callback?code=<code>&state=<state>
 *
 * This function exchanges the code for an access token, then sends
 * it back to the Decap CMS popup via postMessage so the CMS can
 * authenticate and begin managing content.
 *
 * Environment Variables (Cloudflare Pages → Settings → Env Vars):
 *   GITHUB_CLIENT_ID      — GitHub OAuth App client ID
 *   GITHUB_CLIENT_SECRET  — GitHub OAuth App client secret
 */
export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);

  /* ── CORS preflight ───────────────────────────────────────────── */
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin' : '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  }

  /* ── Validate env ─────────────────────────────────────────────── */
  const clientId     = env.GITHUB_CLIENT_ID;
  const clientSecret = env.GITHUB_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return new Response(
      JSON.stringify({
        error  : 'missing_env',
        message: 'GITHUB_CLIENT_ID or GITHUB_CLIENT_SECRET is not set in Cloudflare Pages → Settings → Environment Variables.',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }

  /* ── Get code from query string ───────────────────────────────── */
  const code = url.searchParams.get('code');

  if (!code) {
    return authPopupHtml('error', 'Missing code parameter from GitHub.');
  }

  /* ── Exchange code for access token ──────────────────────────── */
  let data;
  try {
    const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
      method : 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body   : JSON.stringify({ client_id: clientId, client_secret: clientSecret, code }),
    });
    data = await tokenRes.json();
  } catch (err) {
    return authPopupHtml('error', `Token exchange failed: ${err.message}`);
  }

  if (data.error) {
    return authPopupHtml('error', data.error_description || data.error);
  }

  /* ── Send token back to Decap CMS popup ──────────────────────── */
  return authPopupHtml('success', JSON.stringify({ token: data.access_token, provider: 'github' }));
}

/**
 * Returns an HTML page that sends a postMessage to the Decap CMS opener.
 * Decap CMS listens for:  'authorization:github:<status>:<content>'
 */
function authPopupHtml(status, content) {
  const message = `authorization:github:${status}:${content}`;
  const html = `<!DOCTYPE html>
<html>
<body>
<script>
  (function () {
    function receiveMessage(e) {
      window.opener.postMessage('${message}', e.origin);
    }
    window.addEventListener('message', receiveMessage, false);
    window.opener.postMessage('authorizing:github', '*');
  })();
<\/script>
</body>
</html>`;

  return new Response(html, { headers: { 'Content-Type': 'text/html' } });
}
