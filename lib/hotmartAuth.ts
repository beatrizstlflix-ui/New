interface CachedToken {
  token: string
  expiresAt: number
}

let cachedToken: CachedToken | null = null

export function hasHotmartCredentials(): boolean {
  return Boolean(
    process.env.HOTMART_CLIENT_ID && process.env.HOTMART_CLIENT_SECRET && process.env.HOTMART_BASIC_TOKEN
  )
}

// Hotmart usa OAuth2 client_credentials: client_id/client_secret vao na
// query string e o "basic token" (Basic <base64(client_id:client_secret)>,
// gerado pela propria Hotmart) vai no header Authorization.
export async function getHotmartAccessToken(): Promise<string> {
  const clientId = process.env.HOTMART_CLIENT_ID
  const clientSecret = process.env.HOTMART_CLIENT_SECRET
  const basicToken = process.env.HOTMART_BASIC_TOKEN

  if (!clientId || !clientSecret || !basicToken) {
    throw new Error('Credenciais da Hotmart ausentes (HOTMART_CLIENT_ID/HOTMART_CLIENT_SECRET/HOTMART_BASIC_TOKEN).')
  }

  const now = Date.now()
  if (cachedToken && cachedToken.expiresAt > now + 60_000) {
    return cachedToken.token
  }

  const url = new URL('https://api-sec-vlc.hotmart.com/security/oauth/token')
  url.searchParams.set('grant_type', 'client_credentials')
  url.searchParams.set('client_id', clientId)
  url.searchParams.set('client_secret', clientSecret)

  const res = await fetch(url.toString(), {
    method: 'POST',
    headers: { Authorization: basicToken },
    cache: 'no-store',
  })

  if (!res.ok) {
    const body = await res.text()
    throw new Error(`Autenticacao Hotmart falhou (${res.status}): ${body}`)
  }

  const data = await res.json()
  const token = data.access_token as string
  if (!token) {
    throw new Error('Resposta de autenticacao da Hotmart sem access_token.')
  }

  const expiresInMs = Number(data.expires_in ?? 3600) * 1000
  cachedToken = { token, expiresAt: now + expiresInMs }
  return token
}
