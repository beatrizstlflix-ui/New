import { getAdsAccessToken } from './googleAdsAuth'

const API_VERSION = 'v22'

function digitsOnly(id: string): string {
  return id.replace(/[^0-9]/g, '')
}

async function adsSearch(query: string): Promise<any[]> {
  const developerToken = process.env.GOOGLE_ADS_DEVELOPER_TOKEN
  const customerId = process.env.GOOGLE_ADS_CUSTOMER_ID
  const loginCustomerId = process.env.GOOGLE_ADS_LOGIN_CUSTOMER_ID

  if (!developerToken || !customerId) {
    throw new Error('GOOGLE_ADS_DEVELOPER_TOKEN ou GOOGLE_ADS_CUSTOMER_ID ausentes.')
  }

  const accessToken = await getAdsAccessToken()
  const headers: Record<string, string> = {
    Authorization: `Bearer ${accessToken}`,
    'developer-token': developerToken,
    'Content-Type': 'application/json',
  }
  if (loginCustomerId) headers['login-customer-id'] = digitsOnly(loginCustomerId)

  const res = await fetch(
    `https://googleads.googleapis.com/${API_VERSION}/customers/${digitsOnly(customerId)}/googleAds:search`,
    {
      method: 'POST',
      headers,
      body: JSON.stringify({ query }),
      cache: 'no-store',
    }
  )

  if (!res.ok) {
    const body = await res.text()
    throw new Error(`Google Ads API falhou (${res.status}): ${body}`)
  }

  const data = await res.json()
  return data.results ?? []
}

export interface AdsDailyPoint {
  date: string
  impressions: number
  clicks: number
  costMicros: number
  conversions: number
}

export async function fetchAdsDaily(startDate: string, endDate: string): Promise<AdsDailyPoint[]> {
  const query = `
    SELECT segments.date, metrics.impressions, metrics.clicks, metrics.cost_micros, metrics.conversions
    FROM customer
    WHERE segments.date BETWEEN '${startDate}' AND '${endDate}'
    ORDER BY segments.date
  `.trim()

  const rows = await adsSearch(query)
  return rows.map((r) => ({
    date: r.segments.date,
    impressions: Number(r.metrics.impressions ?? 0),
    clicks: Number(r.metrics.clicks ?? 0),
    costMicros: Number(r.metrics.costMicros ?? 0),
    conversions: Number(r.metrics.conversions ?? 0),
  }))
}

export function sumAdsDaily(points: AdsDailyPoint[]) {
  return points.reduce(
    (acc, p) => ({
      impressions: acc.impressions + p.impressions,
      clicks: acc.clicks + p.clicks,
      costMicros: acc.costMicros + p.costMicros,
      conversions: acc.conversions + p.conversions,
    }),
    { impressions: 0, clicks: 0, costMicros: 0, conversions: 0 }
  )
}
