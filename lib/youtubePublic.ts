import type { ChannelSnapshot } from './youtube'
import type { TopVideo } from './types'

const DATA_URL = 'https://www.googleapis.com/youtube/v3'

export function hasYoutubeApiKeyCredentials(): boolean {
  return Boolean(process.env.YOUTUBE_API_KEY && process.env.YOUTUBE_CHANNEL_ID)
}

async function keyedFetch(path: string, params: Record<string, string>): Promise<any> {
  const apiKey = process.env.YOUTUBE_API_KEY
  if (!apiKey) throw new Error('YOUTUBE_API_KEY nao configurada.')
  const qs = new URLSearchParams({ ...params, key: apiKey })
  const res = await fetch(`${DATA_URL}/${path}?${qs.toString()}`, { cache: 'no-store' })
  if (!res.ok) {
    const body = await res.text()
    throw new Error(`Chamada ao YouTube (API key) falhou (${res.status}) em ${path}: ${body}`)
  }
  return res.json()
}

export async function fetchChannelSnapshotByKey(): Promise<ChannelSnapshot & { uploadsPlaylistId: string }> {
  const channelId = process.env.YOUTUBE_CHANNEL_ID
  if (!channelId) throw new Error('YOUTUBE_CHANNEL_ID nao configurado.')

  const data = await keyedFetch('channels', { part: 'snippet,statistics,contentDetails', id: channelId })
  const item = data.items?.[0]
  if (!item) throw new Error(`Nenhum canal encontrado para o ID ${channelId}.`)

  return {
    title: item.snippet.title,
    thumbnail: item.snippet.thumbnails?.medium?.url ?? item.snippet.thumbnails?.default?.url ?? '',
    subscriberCount: Number(item.statistics.subscriberCount ?? 0),
    viewCount: Number(item.statistics.viewCount ?? 0),
    videoCount: Number(item.statistics.videoCount ?? 0),
    uploadsPlaylistId: item.contentDetails.relatedPlaylists.uploads,
  }
}

async function fetchUploadedVideoIds(uploadsPlaylistId: string, limit: number): Promise<string[]> {
  const ids: string[] = []
  let pageToken: string | undefined
  while (ids.length < limit) {
    const data = await keyedFetch('playlistItems', {
      part: 'contentDetails',
      playlistId: uploadsPlaylistId,
      maxResults: '50',
      ...(pageToken ? { pageToken } : {}),
    })
    for (const item of data.items ?? []) {
      ids.push(item.contentDetails.videoId)
    }
    pageToken = data.nextPageToken
    if (!pageToken || !data.items?.length) break
  }
  return ids.slice(0, limit)
}

/**
 * Estatisticas vitalicias (nao filtradas por periodo) dos videos mais
 * assistidos do canal, obtidas apenas com API key (sem OAuth). A YouTube
 * Analytics API (metrica por dia, origem de trafego, dados de um periodo
 * especifico) exige OAuth e nao esta disponivel neste modo.
 */
export async function fetchTopVideosLifetimeByKey(uploadsPlaylistId: string, scanLimit = 50): Promise<TopVideo[]> {
  const ids = await fetchUploadedVideoIds(uploadsPlaylistId, scanLimit)
  if (ids.length === 0) return []

  const videos: TopVideo[] = []
  for (let i = 0; i < ids.length; i += 50) {
    const batch = ids.slice(i, i + 50)
    const data = await keyedFetch('videos', { part: 'snippet,statistics', id: batch.join(',') })
    for (const item of data.items ?? []) {
      videos.push({
        id: item.id,
        title: item.snippet.title,
        thumbnail: item.snippet.thumbnails?.medium?.url ?? item.snippet.thumbnails?.default?.url ?? '',
        publishedAt: item.snippet.publishedAt,
        views: Number(item.statistics.viewCount ?? 0),
        likes: Number(item.statistics.likeCount ?? 0),
        comments: Number(item.statistics.commentCount ?? 0),
        minutesWatched: 0,
        averageViewDuration: 0,
      })
    }
  }

  return videos.sort((a, b) => b.views - a.views).slice(0, 10)
}
