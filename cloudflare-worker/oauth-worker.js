/**
 * Ria Art Jewellery — GitHub OAuth Worker for Decap CMS
 *
 * Deploy this to Cloudflare Workers (free tier).
 * Set these Environment Variables in your Worker settings:
 *   GITHUB_CLIENT_ID     — from GitHub OAuth App
 *   GITHUB_CLIENT_SECRET — from GitHub OAuth App
 *
 * Then set base_url in admin/config.yml to this Worker's URL.
 */

const ALLOWED_ORIGINS = [
  'https://YOUR-SITE.pages.dev',   // Replace with your Cloudflare Pages URL
  'https://YOUR-CUSTOM-DOMAIN.com', // Replace with your custom domain (if any)
];

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const origin = request.headers.get('Origin') || '';

    // CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0],
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    // Step 1: Redirect user to GitHub for login
    if (url.pathname === '/auth') {
      const params = new URLSearchParams({
        client_id: env.GITHUB_CLIENT_ID,
        scope: 'repo,user',
        redirect_uri: `${url.origin}/callback`,
      });
      return Response.redirect(`https://github.com/login/oauth/authorize?${params}`, 302);
    }

    // Step 2: Exchange code for token, return to CMS via postMessage
    if (url.pathname === '/callback') {
      const code = url.searchParams.get('code');
      if (!code) return new Response('Missing code', { status: 400 });

      const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          client_id: env.GITHUB_CLIENT_ID,
          client_secret: env.GITHUB_CLIENT_SECRET,
          code,
        }),
      });

      const data = await tokenRes.json();

      if (data.error) {
        return new Response(`OAuth error: ${data.error_description}`, { status: 400 });
      }

      // Send token back to Decap CMS via postMessage
      const html = `<!DOCTYPE html><html><body><script>
        window.opener.postMessage(
          'authorization:github:success:${JSON.stringify({ token: data.access_token, provider: 'github' })}',
          '*'
        );
        window.close();
      <\/script></body></html>`;

      return new Response(html, {
        headers: { 'Content-Type': 'text/html', ...corsHeaders },
      });
    }

    return new Response('Ria Art Jewellery OAuth Worker — OK', { headers: corsHeaders });
  },
};
