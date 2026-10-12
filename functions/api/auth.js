/**
 * 관리자(Decap CMS) GitHub 로그인 시작: GET /api/auth
 *
 * Cloudflare Pages 프로젝트 설정 → 환경 변수에 다음 값을 넣어야 합니다.
 *   GITHUB_CLIENT_ID      GitHub OAuth App의 Client ID
 *   GITHUB_CLIENT_SECRET  GitHub OAuth App의 Client Secret (암호화 저장)
 */
export async function onRequestGet({ request, env }) {
  if (!env.GITHUB_CLIENT_ID) {
    return new Response('GITHUB_CLIENT_ID 환경 변수가 설정되지 않았습니다. README의 관리자 설정을 확인하세요.', {
      status: 500,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  }

  const url = new URL(request.url);
  const state = crypto.randomUUID();
  const scope = url.searchParams.get('scope') || 'repo,user';

  const authorize = new URL('https://github.com/login/oauth/authorize');
  authorize.searchParams.set('client_id', env.GITHUB_CLIENT_ID);
  authorize.searchParams.set('redirect_uri', `${url.origin}/api/callback`);
  authorize.searchParams.set('scope', scope);
  authorize.searchParams.set('state', state);

  return new Response(null, {
    status: 302,
    headers: {
      Location: authorize.toString(),
      // 콜백에서 요청 위조 여부를 확인하기 위한 값
      'Set-Cookie': `cms_oauth_state=${state}; Path=/api; HttpOnly; Secure; SameSite=Lax; Max-Age=600`,
      'Cache-Control': 'no-store',
    },
  });
}
