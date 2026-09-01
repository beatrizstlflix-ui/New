export interface DailyPoint {
  date: string
  views: number
  minutesWatched: number
  subscribersGained: number
}

export interface TrafficSourcePoint {
  source: string
  label: string
  organic: boolean
  views: number
  minutesWatched: number
}

export interface TopVideo {
  id: string
  title: string
  thumbnail: string
  publishedAt: string
  views: number
  minutesWatched: number
  averageViewDuration: number
  likes: number
  comments: number
}

export interface Totals {
  views: number
  minutesWatched: number
  averageViewDuration: number
  subscribersGained: number
  likes: number
  comments: number
  shares: number
}

export interface AdsTotals {
  impressions: number
  clicks: number
  costMicros: number
  conversions: number
}

export interface AdsDailyPoint {
  date: string
  impressions: number
  clicks: number
  costMicros: number
  conversions: number
}

export interface AdsSection {
  accountLabel: string
  totals: AdsTotals
  previousTotals: AdsTotals
  daily: AdsDailyPoint[]
}

export type YoutubeMode = 'oauth' | 'api_key' | 'demo'

export interface DashboardResponse {
  mode: YoutubeMode
  demo?: boolean
  channel: {
    title: string
    thumbnail: string
    subscriberCount: number
    viewCount: number
    videoCount: number
  }
  range: { start: string; end: string; label: string }
  // Presentes apenas nos modos 'oauth' e 'demo' (exigem YouTube Analytics API).
  totals?: Totals
  previousTotals?: Totals
  organicSharePct?: number
  daily?: DailyPoint[]
  trafficSources?: TrafficSourcePoint[]
  // Sempre presente: no modo 'api_key' sao estatisticas vitalicias (nao
  // filtradas pelo periodo selecionado), pois isso exige OAuth.
  topVideos: TopVideo[]
  topVideosNote?: string
  // Trafego pago (Google Ads), presente apenas quando configurado.
  ads?: AdsSection
  adsError?: string
}
