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

export interface DashboardResponse {
  demo?: boolean
  channel: {
    title: string
    thumbnail: string
    subscriberCount: number
    viewCount: number
    videoCount: number
  }
  range: { start: string; end: string; label: string }
  totals: Totals
  previousTotals: Totals
  organicSharePct: number
  daily: DailyPoint[]
  trafficSources: TrafficSourcePoint[]
  topVideos: TopVideo[]
}
