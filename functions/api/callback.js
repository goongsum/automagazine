/**
 * GitHub 로그인 콜백: GET /api/callback
 * GitHub에서 받은 code를 access token으로 바꾼 뒤, 관리자 창(Decap CMS)에 전달합니다.
 */
export async function onRequestGet({ request, env }) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  const cookieState = (request.headers.get('Cookie') || '').match(/(?:^|;\s*)cms_oauth_state=([^;]+)/)?.[1];

  if (!code || !state || !cookieState || state !== cookieState) {
    return reply(url.origin, 'error', { error: '로그인 요청이 올바르지 않습니다. 관리자 화면에서 다시 시도해 주세요.' });
  }

  try {
    const res = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'User-Agent': 'automagazine-cms-oauth',
      },
      body: JSON.stringify({
        client_id: env.GITHUB_CLIENT_ID,
        client_secret: env.GITHUB_CLIENT_SECRET,
        code,
        redirect_uri: `${url.origin}/api/callback`,
      }),
    });
    const data = await res.json();
    if (!res.ok || data.error || !data.access_token) {
      return reply(url.origin, 'error', { error: data.error_description || data.error || 'GitHub 토큰 발급에 실패했습니다.' });
    }
    return reply(url.origin, 'success', { token: data.access_token, provider: 'github' });
  } catch (err) {
    return reply(url.origin, 'error', { error: `GitHub 연결 오류: ${err}` });
  }
}

/**
 * Decap CMS가 기다리는 postMessage 신호를 보내는 페이지를 돌려줍니다.
 * 토큰은 같은 사이트(origin)의 관리자 창에만 전달합니다.
 */
function reply(origin, status, content) {
  const message = `authorization:github:${status}:${JSON.stringify(content)}`;
  const html = `<!doctype html>
<html lang="ko"><head><meta charset="utf-8"><title>로그인 처리 중</title></head>
<body>
<p>${status === 'success' ? '로그인되었습니다. 이 창은 자동으로 닫힙니다.' : '로그인에 실패했습니다: ' + escapeHtml(content.error)}</p>
<script>
(function () {
  var origin = ${JSON.stringify(origin)};
  var message = ${JSON.stringify(message).replace(/</g, '\\u003c')};
  function receive(e) {
    if (e.origin !== origin) return;
    window.opener.postMessage(message, origin);
    window.removeEventListener('message', receive, false);
    ${status === 'success' ? 'setTimeout(function () { window.close(); }, 300);' : ''}
  }
  if (!window.opener) return;
  window.addEventListener('message', receive, false);
  window.opener.postMessage('authorizing:github', origin);
})();
</script>
</body></html>`;
  return new Response(html, {
    status: status === 'success' ? 200 : 400,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-store',
      'Set-Cookie': 'cms_oauth_state=; Path=/api; HttpOnly; Secure; SameSite=Lax; Max-Age=0',
    },
  });
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
}
