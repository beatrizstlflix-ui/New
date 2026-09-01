import { NextRequest, NextResponse } from 'next/server'
import { fetchAnalytics, fetchChannelSnapshot, fetchVideoDetails, AnalyticsReport } from '@/lib/youtube'
import { isOrganicSource, labelForSource } from '@/lib/organic'
import { buildDemoPayload } from '@/lib/demoData'
import type { DashboardResponse, DailyPoint, TrafficSourcePoint, TopVideo, Totals } from '@/lib/types'

function hasCredentials(): boolean {
  return Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET && process.env.YOUTUBE_REFRESH_TOKEN)
}

export const dynamic = 'force-dynamic'

function toObjects(report: AnalyticsReport): Record<string, string | number>[] {
  const names = report.columnHeaders.map((h) => h.name)
  return (report.rows ?? []).map((row) => {
    const obj: Record<string, string | number> = {}
    row.forEach((value, i) => {
      obj[names[i]] = value
    })
    return obj
  })
}

function fmtDate(d: Date): string {
  return d.toISOString().slice(0, 10)
}

function shiftDays(d: Date, days: number): Date {
  const copy = new Date(d)
  copy.setUTCDate(copy.getUTCDate() + days)
  return copy
}

const RANGE_LABELS: Record<number, string> = { 7: 'Ultimos 7 dias', 28: 'Ultimos 28 dias', 90: 'Ultimos 90 dias' }
const TOTAL_METRICS = ['views', 'estimatedMinutesWatched', 'averageViewDuration', 'subscribersGained', 'likes', 'comments', 'shares']

const emptyTotals: Totals = { views: 0, minutesWatched: 0, averageViewDuration: 0, subscribersGained: 0, likes: 0, comments: 0, shares: 0 }

function toTotals(rows: Record<string, string | number>[]): Totals {
  const r = rows[0]
  if (!r) return emptyTotals
  return {
    views: Number(r.views ?? 0),
    minutesWatched: Number(r.estimatedMinutesWatched ?? 0),
    averageViewDuration: Number(r.averageViewDuration ?? 0),
    subscribersGained: Number(r.subscribersGained ?? 0),
    likes: Number(r.likes ?? 0),
    comments: Number(r.comments ?? 0),
    shares: Number(r.shares ?? 0),
  }
}

export async function GET(req: NextRequest) {
  try {
    const rangeParam = Number(req.nextUrl.searchParams.get('range') ?? '28')
    const days = [7, 28, 90].includes(rangeParam) ? rangeParam : 28

    if (!hasCredentials()) {
      return NextResponse.json(buildDemoPayload(days))
    }

    // Dados do YouTube Analytics normalmente ficam completos ate ~2 dias atras.
    const end = shiftDays(new Date(), -2)
    const start = shiftDays(end, -(days - 1))
    const prevEnd = shiftDays(start, -1)
    const prevStart = shiftDays(prevEnd, -(days - 1))

    const startDate = fmtDate(start)
    const endDate = fmtDate(end)
    const prevStartDate = fmtDate(prevStart)
    const prevEndDate = fmtDate(prevEnd)

    const [channel, totalsReport, prevTotalsReport, dailyReport, trafficReport, topVideosReport] = await Promise.all([
      fetchChannelSnapshot(),
      fetchAnalytics({ startDate, endDate, metrics: TOTAL_METRICS }),
      fetchAnalytics({ startDate: prevStartDate, endDate: prevEndDate, metrics: TOTAL_METRICS }),
      fetchAnalytics({ startDate, endDate, metrics: ['views', 'estimatedMinutesWatched', 'subscribersGained'], dimensions: ['day'], sort: 'day' }),
      fetchAnalytics({ startDate, endDate, metrics: ['views', 'estimatedMinutesWatched'], dimensions: ['insightTrafficSourceType'], sort: '-views' }),
      fetchAnalytics({
        startDate,
        endDate,
        metrics: ['views', 'estimatedMinutesWatched', 'averageViewDuration', 'likes', 'comments'],
        dimensions: ['video'],
        sort: '-views',
        maxResults: 10,
      }),
    ])

    const totals = toTotals(toObjects(totalsReport))
    const previousTotals = toTotals(toObjects(prevTotalsReport))

    const daily: DailyPoint[] = toObjects(dailyReport).map((r) => ({
      date: String(r.day),
      views: Number(r.views ?? 0),
      minutesWatched: Number(r.estimatedMinutesWatched ?? 0),
      subscribersGained: Number(r.subscribersGained ?? 0),
    }))

    const trafficRows = toObjects(trafficReport)
    const trafficSources: TrafficSourcePoint[] = trafficRows.map((r) => {
      const source = String(r.insightTrafficSourceType)
      return {
        source,
        label: labelForSource(source),
        organic: isOrganicSource(source),
        views: Number(r.views ?? 0),
        minutesWatched: Number(r.estimatedMinutesWatched ?? 0),
      }
    })

    const totalTrafficViews = trafficSources.reduce((sum, t) => sum + t.views, 0)
    const organicViews = trafficSources.filter((t) => t.organic).reduce((sum, t) => sum + t.views, 0)
    const organicSharePct = totalTrafficViews > 0 ? (organicViews / totalTrafficViews) * 100 : 0

    const topVideoRows = toObjects(topVideosReport)
    const videoIds = topVideoRows.map((r) => String(r.video)).filter(Boolean)
    const videoDetails = await fetchVideoDetails(videoIds)

    const topVideos: TopVideo[] = topVideoRows.map((r) => {
      const id = String(r.video)
      const details = videoDetails[id]
      return {
        id,
        title: details?.title ?? id,
        thumbnail: details?.thumbnail ?? '',
        publishedAt: details?.publishedAt ?? '',
        views: Number(r.views ?? 0),
        minutesWatched: Number(r.estimatedMinutesWatched ?? 0),
        averageViewDuration: Number(r.averageViewDuration ?? 0),
        likes: Number(r.likes ?? 0),
        comments: Number(r.comments ?? 0),
      }
    })

    const payload: DashboardResponse = {
      channel,
      range: { start: startDate, end: endDate, label: RANGE_LABELS[days] },
      totals,
      previousTotals,
      organicSharePct,
      daily,
      trafficSources,
      topVideos,
    }

    return NextResponse.json(payload)
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? 'Erro desconhecido ao consultar o YouTube.' }, { status: 500 })
  }
}
