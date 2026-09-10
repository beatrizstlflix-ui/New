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

export function brl(v: number): string {
  return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })
}

export function num(v: number, maxDigits = 0): string {
  return v.toLocaleString('pt-BR', { maximumFractionDigits: maxDigits })
}
