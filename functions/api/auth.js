/**
 * Cloudflare Pages Function: /api/auth
 *
 * Step 1 of the Decap CMS GitHub OAuth flow.
 * Decap CMS opens this URL in a popup:
 *   /api/auth?provider=github&site_id=<siteID>
 *
 * This function redirects the popup to GitHub's authorization page.
 * After the user authorizes, GitHub redirects to /api/callback.
 *
 * Environment Variables (Cloudflare Pages → Settings → Env Vars):
 *   GITHUB_CLIENT_ID      — GitHub OAuth App client ID
 *   GITHUB_CLIENT_SECRET  — GitHub OAuth App client secret (used in callback)
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
  const clientId = env.GITHUB_CLIENT_ID;

  if (!clientId) {
    return new Response(
      JSON.stringify({
        error  : 'missing_env',
        message: 'GITHUB_CLIENT_ID is not set. Add it in Cloudflare Pages → Settings → Environment Variables.',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }

  /* ── Build GitHub OAuth URL ───────────────────────────────────── */
  const githubUrl = new URL('https://github.com/login/oauth/authorize');

  githubUrl.searchParams.set('client_id', clientId);

  /*
   * Scopes needed by Decap CMS to read/write repo content:
   *   repo  — full repository access (needed to commit content changes)
   *   user  — read basic profile info (needed to identify the committer)
   */
  githubUrl.searchParams.set('scope', 'repo,user');

  /*
   * The redirect_uri must exactly match one of the "Authorization callback URLs"
   * registered in your GitHub OAuth App settings.
   * We derive it from the incoming request's origin so this works regardless
   * of whether the site is on a preview URL or the production domain.
   */
  githubUrl.searchParams.set('redirect_uri', `${url.origin}/api/callback`);

  /*
   * Forward the state parameter if Decap CMS sent one.
   * Decap CMS uses this to verify the callback is legitimate (CSRF protection).
   */
  const state = url.searchParams.get('state') ?? url.searchParams.get('random') ?? '';
  if (state) {
    githubUrl.searchParams.set('state', state);
  }

  return Response.redirect(githubUrl.toString(), 302);
}
