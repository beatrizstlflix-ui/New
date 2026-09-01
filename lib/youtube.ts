import { getAccessToken } from './googleAuth'

const ANALYTICS_URL = 'https://youtubeanalytics.googleapis.com/v2/reports'
const DATA_URL = 'https://www.googleapis.com/youtube/v3'

async function authedFetch(url: string): Promise<any> {
  const accessToken = await getAccessToken()
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: 'no-store',
  })
  if (!res.ok) {
    const body = await res.text()
    throw new Error(`Chamada ao YouTube falhou (${res.status}) em ${url}: ${body}`)
  }
  return res.json()
}

function channelIdsParam(): string {
  const channelId = process.env.YOUTUBE_CHANNEL_ID
  return channelId ? `channel==${channelId}` : 'channel==MINE'
}

export interface AnalyticsReport {
  columnHeaders: { name: string }[]
  rows?: (string | number)[][]
}

/**
 * Chama a YouTube Analytics API (v2/reports).
 * dimensions/metrics seguem exatamente os nomes da API do Google.
 */
export async function fetchAnalytics(params: {
  startDate: string
  endDate: string
  metrics: string[]
  dimensions?: string[]
  sort?: string
  maxResults?: number
}): Promise<AnalyticsReport> {
  const qs = new URLSearchParams({
    ids: channelIdsParam(),
    startDate: params.startDate,
    endDate: params.endDate,
    metrics: params.metrics.join(','),
  })
  if (params.dimensions?.length) qs.set('dimensions', params.dimensions.join(','))
  if (params.sort) qs.set('sort', params.sort)
  if (params.maxResults) qs.set('maxResults', String(params.maxResults))

  return authedFetch(`${ANALYTICS_URL}?${qs.toString()}`)
}

export interface ChannelSnapshot {
  title: string
  thumbnail: string
  subscriberCount: number
  viewCount: number
  videoCount: number
}

export async function fetchChannelSnapshot(): Promise<ChannelSnapshot> {
  const channelId = process.env.YOUTUBE_CHANNEL_ID
  const qs = new URLSearchParams({ part: 'snippet,statistics' })
  if (channelId) qs.set('id', channelId)
  else qs.set('mine', 'true')

  const data = await authedFetch(`${DATA_URL}/channels?${qs.toString()}`)
  const item = data.items?.[0]
  if (!item) throw new Error('Nenhum canal encontrado para as credenciais fornecidas.')

  return {
    title: item.snippet.title,
    thumbnail: item.snippet.thumbnails?.medium?.url ?? item.snippet.thumbnails?.default?.url ?? '',
    subscriberCount: Number(item.statistics.subscriberCount ?? 0),
    viewCount: Number(item.statistics.viewCount ?? 0),
    videoCount: Number(item.statistics.videoCount ?? 0),
  }
}

export interface VideoDetails {
  id: string
  title: string
  thumbnail: string
  publishedAt: string
}

export async function fetchVideoDetails(videoIds: string[]): Promise<Record<string, VideoDetails>> {
  if (videoIds.length === 0) return {}
  const qs = new URLSearchParams({ part: 'snippet', id: videoIds.join(',') })
  const data = await authedFetch(`${DATA_URL}/videos?${qs.toString()}`)

  const out: Record<string, VideoDetails> = {}
  for (const item of data.items ?? []) {
    out[item.id] = {
      id: item.id,
      title: item.snippet.title,
      thumbnail: item.snippet.thumbnails?.medium?.url ?? item.snippet.thumbnails?.default?.url ?? '',
      publishedAt: item.snippet.publishedAt,
    }
  }
  return out
}
