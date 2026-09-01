const TOKEN_URL = 'https://oauth2.googleapis.com/token'

let cachedToken: { accessToken: string; expiresAt: number } | null = null

/**
 * Troca o refresh_token por um access_token de curta duracao.
 * Cacheado em memoria pelo tempo de vida do processo serverless
 * para evitar uma troca de token a cada requisicao.
 */
export async function getAccessToken(): Promise<string> {
  const now = Date.now()
  if (cachedToken && cachedToken.expiresAt > now + 30_000) {
    return cachedToken.accessToken
  }

  const clientId = process.env.GOOGLE_CLIENT_ID
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET
  const refreshToken = process.env.YOUTUBE_REFRESH_TOKEN

  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error(
      'Credenciais ausentes. Configure GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET e YOUTUBE_REFRESH_TOKEN nas variaveis de ambiente do servidor.'
    )
  }

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
    throw new Error(`Falha ao renovar o access_token do Google (${res.status}): ${body}`)
  }

  const data = (await res.json()) as { access_token: string; expires_in: number }
  cachedToken = {
    accessToken: data.access_token,
    expiresAt: now + data.expires_in * 1000,
  }
  return cachedToken.accessToken
}
