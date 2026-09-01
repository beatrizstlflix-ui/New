import { getGoogleAccessToken } from './googleOAuth'

export function hasYoutubeOAuthCredentials(): boolean {
  return Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET && process.env.YOUTUBE_REFRESH_TOKEN)
}

/**
 * Access token OAuth para YouTube Data API / YouTube Analytics API
 * (escopos youtube.readonly + yt-analytics.readonly).
 */
export async function getAccessToken(): Promise<string> {
  const clientId = process.env.GOOGLE_CLIENT_ID
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET
  const refreshToken = process.env.YOUTUBE_REFRESH_TOKEN

  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error(
      'Credenciais OAuth do YouTube ausentes. Configure GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET e YOUTUBE_REFRESH_TOKEN.'
    )
  }

  return getGoogleAccessToken(clientId, clientSecret, refreshToken)
}
