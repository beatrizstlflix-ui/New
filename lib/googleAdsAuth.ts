import { getGoogleAccessToken } from './googleOAuth'

export function hasGoogleAdsCredentials(): boolean {
  return Boolean(
    process.env.GOOGLE_ADS_CLIENT_ID &&
      process.env.GOOGLE_ADS_CLIENT_SECRET &&
      process.env.GOOGLE_ADS_REFRESH_TOKEN &&
      process.env.GOOGLE_ADS_DEVELOPER_TOKEN &&
      process.env.GOOGLE_ADS_CUSTOMER_ID
  )
}

export async function getAdsAccessToken(): Promise<string> {
  const clientId = process.env.GOOGLE_ADS_CLIENT_ID
  const clientSecret = process.env.GOOGLE_ADS_CLIENT_SECRET
  const refreshToken = process.env.GOOGLE_ADS_REFRESH_TOKEN

  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error('Credenciais OAuth do Google Ads ausentes (GOOGLE_ADS_CLIENT_ID/SECRET/REFRESH_TOKEN).')
  }

  return getGoogleAccessToken(clientId, clientSecret, refreshToken)
}
