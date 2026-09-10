import fs from 'fs'
import path from 'path'

const ROOT = process.cwd()

function readJSON<T = any>(relPath: string): T {
  const full = path.join(ROOT, relPath)
  return JSON.parse(fs.readFileSync(full, 'utf-8'))
}

export interface MediaPagaCampaign {
  campaign_id: string
  campaign_name: string
  advertising_channel_type: string
  cost_brl: number
  impressions: number
  clicks: number
  conversions_primary: number
  conversions_value_primary_brl: number
  all_conversions: number
  all_conversions_value_brl: number
  youtube_follow_on_views: number | null
  youtube_channel_subscriptions: number | null
  purchase_lp_ambiente_br: number | null
  purchase_stlflix_geral: number | null
  inicio_checkout: number | null
}

export interface MediaPagaResumo {
  source: string
  generated_at: string
  totals: {
    cost_brl: number
    cost_video_brl: number
    cost_demand_gen_brl: number
    cost_performance_max_brl: number
    cost_display_brl: number
    youtube_follow_on_views: number
    youtube_channel_subscriptions: number
    n_campaigns_with_activity: number
  }
  campaigns: MediaPagaCampaign[]
}

export interface GA4ChannelRow {
  session_default_channel_group: string
  sessions: number
  totalusers: number
  newusers: number
  conversions_qualify_lead: number
  conversions_close_convert_lead: number
  conversions_purchase: number
}

export interface EcommerceFunnelRow {
  session_default_channel_group: string
  sessions: number
  totalusers: number
  add_to_carts: number
  checkouts: number
  ecommerce_purchases: number
  purchase_revenue: number
}

export interface UserListRow {
  user_list_id: number
  user_list_name: string
  user_list_type: string
  user_list_description: string
  user_list_size_for_display: number
  user_list_size_for_search: number
  user_list_membership_life_span: number
  user_list_membership_status: string
}

export interface VideoAdSummary {
  video_id: string
  video_title: string | null
  video_channel_id: string | null
  campaigns: string[]
  trueview_views: number
  engagements: number
  quartile_p100_view_weighted_avg: number
}

export function getMediaPagaResumo(): MediaPagaResumo {
  return readJSON('data/processed/media_paga_resumo_last90d.json')
}

export function getGA4Last28(): { last28d: { rows: GA4ChannelRow[] }; previous28d: { rows: GA4ChannelRow[] } } {
  return readJSON('data/raw/ga4/br_channel_groups_last28_prev28.json')
}

export function getEcommerceFunnel90d(): { rows: EcommerceFunnelRow[] } {
  return readJSON('data/raw/ga4/br_ecommerce_funnel_by_channel_last90d.json')
}

export function getGA4Monthly(): { rows: Array<{ year_month_name: string; channel_group: string; sessions: number; totalusers: number; conversions_purchase: number }> } {
  return readJSON('data/processed/ga4_monthly_by_channel_2026.json')
}

export function getUserLists(): { rows: UserListRow[] } {
  return readJSON('data/raw/google_ads/br_user_lists_remarketing.json')
}

export function getVideoAdSummary(): { videos_used_in_ads_count: number; videos: VideoAdSummary[] } {
  return readJSON('data/processed/google_ads_video_summary_last90d.json')
}

export interface OrganicSummary {
  channel: {
    channel_id: string
    title: string
    custom_url: string
    country: string
    published_at: string
    subscriber_count: number
    view_count: number
    video_count_reported: number
  }
  video_count_inventoried: number
  by_format: Record<string, number>
  publish_cadence_by_month: Record<string, number>
  top_videos_by_views: Array<{
    video_id: string
    title: string
    view_count: number
    like_count: number
    comment_count: number
    duration_seconds: number
    format_guess: string
    published_at: string
  }>
}

export function getOrganicSummary(): OrganicSummary {
  return readJSON('data/processed/youtube_organic_summary.json')
}

export function getCaptionsCoverage(): { checked: number; withCaptions: number; withAsrPt: number; quotaExhausted: boolean } {
  const raw: Record<string, any> = readJSON('data/raw/youtube/captions_list_by_video.json')
  const entries = Object.values(raw)
  const valid = entries.filter((v) => Array.isArray(v))
  const withCaptions = valid.filter((v: any) => v.length > 0).length
  const withAsrPt = valid.filter((v: any) => v.some((t: any) => t.trackKind === 'asr' && (t.language || '').startsWith('pt'))).length
  const quotaExhausted = entries.some((v) => !Array.isArray(v) && v?.error === 403)
  return { checked: valid.length, withCaptions, withAsrPt, quotaExhausted }
}

export interface YoutubeStudioAnalytics {
  caveats: string[]
  periods: Record<string, { label: string; date_from: string; date_to: string }>
  overview: Record<string, { views: number; watch_hours: number; avg_duration: string; subscribers_net: number; revenue_usd: number; impressions: number; ctr_pct: number }>
  traffic_sources: Record<string, Array<{ source: string; views: number; views_pct: number; hours: number; hours_pct: number; avg_duration: string }>>
  content_type_engagement: Record<string, Array<{ type: string; views: number; views_pct: number; hours: number; hours_pct: number; avg_duration: string }>>
  subscribers_by_content_type_P2: Array<{ type: string; subscribers_net: number; pct: number }>
  new_vs_returning: Record<string, { new_views_pct: number; new_hours_pct: number; new_avg_duration: string; returning_views_pct: number; returning_hours_pct: number; returning_avg_duration: string; unknown_views_pct: number }>
  audience_profile_28d_snapshot: {
    age_pct: Record<string, number>
    gender_pct: Record<string, number>
    device_hours_pct: Record<string, number>
    location_views_pct: Record<string, number>
    peak_hours_local_brt: string
    also_watched_channels: Array<{ name: string; subscribers: number; note?: string }>
  }
  subscribers_monthly_2026: Array<{ month: string; gained: number; lost: number; net: number }>
  retention_videos: Array<{ video_id: string | null; title: string; format?: string; views_lifetime: number; avg_duration?: string; pct_watched?: number; retention_key?: string; continued_pct?: number | null; subscribers?: number; note?: string; lifetime_impressions?: number; ctr_pct?: number }>
}

export function getYoutubeStudioAnalytics(): YoutubeStudioAnalytics {
  return readJSON('data/processed/youtube_studio_analytics.json')
}

export interface SeriesVideo {
  video_id: string
  series: string
  title: string
  url: string
  published_at: string
  duration_seconds: number
  view_count_lifetime: number
  like_count: number
  comment_count: number
  used_in_paid_media_last90d: boolean
  ad_cost_brl_90d?: number
  ad_follow_on_views_90d?: number
  ad_subscriptions_90d?: number
  ad_checkout_starts_90d?: number
}

export interface SeriesData {
  series_name: string
  totals: {
    video_count: number
    views_lifetime_total: number
    likes_total: number
    comments_total: number
    videos_in_paid_media: number
    ad_cost_brl_90d_total: number
    ad_follow_on_views_90d_total: number
    ad_subscriptions_90d_total: number
  }
  videos: SeriesVideo[]
}

export function getSeriesViews(): { series: Record<string, SeriesData>; borderline_not_included: Array<{ video_id: string; title: string; reason: string }> } {
  return readJSON('data/processed/series_views.json')
}

export function brl(v: number): string {
  return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })
}

export function num(v: number, maxDigits = 0): string {
  return v.toLocaleString('pt-BR', { maximumFractionDigits: maxDigits })
}
