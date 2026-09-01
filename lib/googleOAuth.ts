const TOKEN_URL = 'https://oauth2.googleapis.com/token'

const cache = new Map<string, { accessToken: string; expiresAt: number }>()

/**
 * Troca um refresh_token por um access_token de curta duracao.
 * Cacheado em memoria por refresh_token (cada integracao Google tem seu
 * proprio client_id/secret/refresh_token).
 */
export async function getGoogleAccessToken(
  clientId: string,
  clientSecret: string,
  refreshToken: string
): Promise<string> {
  const now = Date.now()
  const cached = cache.get(refreshToken)
  if (cached && cached.expiresAt > now + 30_000) return cached.accessToken

  const res = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
    }),
    cache: 'no-store',
  })

  if (!res.ok) {
    const body = await res.text()
    throw new Error(`Falha ao renovar access_token do Google (${res.status}): ${body}`)
  }

  const data = (await res.json()) as { access_token: string; expires_in: number }
  cache.set(refreshToken, { accessToken: data.access_token, expiresAt: now + data.expires_in * 1000 })
  return data.access_token
}
