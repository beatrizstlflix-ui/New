import { isOrganicSource, labelForSource } from './organic'
import type { DailyPoint, DashboardResponse, TopVideo, TrafficSourcePoint, Totals } from './types'

const DEMO_SOURCES = [
  { source: 'YT_SEARCH', share: 0.34 },
  { source: 'RELATED_VIDEO', share: 0.24 },
  { source: 'BROWSE', share: 0.16 },
  { source: 'SUBSCRIBER', share: 0.09 },
  { source: 'PLAYLIST', share: 0.06 },
  { source: 'EXT_URL', share: 0.05 },
  { source: 'NOTIFICATION', share: 0.03 },
  { source: 'ADVERTISING', share: 0.03 },
]

const DEMO_TITLES = [
  'Top 10 Filmes para Assistir Esse Fim de Semana',
  'Analise Sem Spoiler: Lancamento da Semana',
  'Series Que Voce Precisa Conhecer em 2026',
  'Reacao ao Trailer Mais Esperado do Ano',
  'Catalogo Completo: Novidades do Mes',
  'Os Melhores Filmes de Terror da Decada',
  'Bastidores: Como Escolhemos as Recomendacoes',
  'Comparativo: Vale a Pena Assistir?',
  'Maratona Perfeita para o Fim de Semana',
  'Ranking dos Filmes Mais Assistidos',
]

function seededRandom(seed: number) {
  let s = seed
  return () => {
    s = (s * 9301 + 49297) % 233280
    return s / 233280
  }
}

function fmtDate(d: Date): string {
  return d.toISOString().slice(0, 10)
}

function buildTotals(views: number, rand: () => number): Totals {
  return {
    views,
    minutesWatched: Math.round(views * (2.5 + rand() * 1.5)),
    averageViewDuration: Math.round(150 + rand() * 90),
    subscribersGained: Math.round(views * 0.012),
    likes: Math.round(views * 0.045),
    comments: Math.round(views * 0.006),
    shares: Math.round(views * 0.008),
  }
}

export function buildDemoPayload(days: number): DashboardResponse {
  const rand = seededRandom(days * 7 + 13)
  const end = new Date()
  end.setUTCDate(end.getUTCDate() - 2)

  const daily: DailyPoint[] = []
  let totalViews = 0
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(end)
    d.setUTCDate(d.getUTCDate() - i)
    const base = 900 + Math.sin(i / 3) * 250
    const views = Math.max(50, Math.round(base + rand() * 500))
    totalViews += views
    daily.push({
      date: fmtDate(d),
      views,
      minutesWatched: Math.round(views * (2.5 + rand() * 1.5)),
      subscribersGained: Math.round(views * 0.01 + rand() * 3),
    })
  }

  const trafficSources: TrafficSourcePoint[] = DEMO_SOURCES.map(({ source, share }) => {
    const views = Math.round(totalViews * share * (0.85 + rand() * 0.3))
    return {
      source,
      label: labelForSource(source),
      organic: isOrganicSource(source),
      views,
      minutesWatched: Math.round(views * 3.2),
    }
  })

  const topVideos: TopVideo[] = DEMO_TITLES.map((title, i) => {
    const views = Math.round((totalViews / 6) * (1 - i * 0.08) * (0.8 + rand() * 0.4))
    return {
      id: `demo-${i}`,
      title,
      thumbnail: '',
      publishedAt: fmtDate(new Date(end.getTime() - i * 86400000 * 4)),
      views,
      minutesWatched: Math.round(views * 3.1),
      averageViewDuration: Math.round(140 + rand() * 100),
      likes: Math.round(views * 0.04),
      comments: Math.round(views * 0.005),
    }
  }).sort((a, b) => b.views - a.views)

  const totals = buildTotals(totalViews, rand)
  const previousTotals = buildTotals(Math.round(totalViews * (0.82 + rand() * 0.25)), rand)

  const totalTrafficViews = trafficSources.reduce((s, t) => s + t.views, 0)
  const organicViews = trafficSources.filter((t) => t.organic).reduce((s, t) => s + t.views, 0)

  return {
    mode: 'demo',
    demo: true,
    channel: {
      title: 'STLFLIX BR (exemplo)',
      thumbnail: '',
      subscriberCount: 48213,
      viewCount: 6120044,
      videoCount: 312,
    },
    range: {
      start: daily[0]?.date ?? fmtDate(end),
      end: daily[daily.length - 1]?.date ?? fmtDate(end),
      label: days === 7 ? 'Ultimos 7 dias' : days === 90 ? 'Ultimos 90 dias' : 'Ultimos 28 dias',
    },
    totals,
    previousTotals,
    organicSharePct: totalTrafficViews > 0 ? (organicViews / totalTrafficViews) * 100 : 0,
    daily,
    trafficSources,
    topVideos,
  }
}
