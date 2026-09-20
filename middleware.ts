import { next } from '@vercel/functions';

export const config = {
  runtime: 'nodejs',
  matcher: ['/cms', '/cms/', '/cms.html'],
};

const deniedHeaders = {
  'Cache-Control': 'private, no-store',
  'X-Robots-Tag': 'noindex, nofollow',
};

async function matches(input: string, expected: string): Promise<boolean> {
  const encoder = new TextEncoder();
  const [actualHash, expectedHash] = await Promise.all([
    crypto.subtle.digest('SHA-256', encoder.encode(input)),
    crypto.subtle.digest('SHA-256', encoder.encode(expected)),
  ]);
  const actual = new Uint8Array(actualHash);
  const target = new Uint8Array(expectedHash);
  let difference = 0;
  for (let index = 0; index < actual.length; index++) difference |= actual[index] ^ target[index];
  return difference === 0;
}

export default async function middleware(request: Request) {
  const expectedUser = process.env.CMS_ADMIN_USER;
  const expectedPassword = process.env.CMS_ADMIN_PASSWORD;
  if (!expectedUser || !expectedPassword) {
    return new Response('CMS access is not configured.', { status: 503, headers: deniedHeaders });
  }

  const header = request.headers.get('authorization') || '';
  let user = '';
  let password = '';
  if (header.startsWith('Basic ')) {
    try {
      const decoded = atob(header.slice(6));
      const separator = decoded.indexOf(':');
      if (separator >= 0) {
        user = decoded.slice(0, separator);
        password = decoded.slice(separator + 1);
      }
    } catch { /* Invalid Basic authorization. */ }
  }

  const [userMatches, passwordMatches] = await Promise.all([
    matches(user, expectedUser), matches(password, expectedPassword),
  ]);
  if (!userMatches || !passwordMatches) {
    return new Response('Authentication required.', {
      status: 401,
      headers: { ...deniedHeaders, 'WWW-Authenticate': 'Basic realm="VictorySync CMS", charset="UTF-8"' },
    });
  }
  return next();
}
