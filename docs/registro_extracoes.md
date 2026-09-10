# Registro de extrações

Todas as extrações abaixo foram feitas via Windsor.ai MCP (`get_data`), em 2026-09-10,
pela sessão do Claude Code. Reproduzíveis a qualquer momento com os mesmos
parâmetros (conector, conta, campos, período) — ver comando exato em cada arquivo de
`data/raw/*`.

| # | Fonte | Arquivo raw | Parâmetros | Linhas | Status |
|---|---|---|---|---|---|
| 1 | YouTube | — | connector=youtube, account=33428, Data-Channel | 1 | Canal errado (pessoal vazio) |
| 2 | YouTube | — | connector=youtube, account=33428, Data-Video, 2005-01-01..2026-09-09 | 0 | Confirma canal vazio |
| 3 | Google Ads | `data/raw/google_ads/br_campaigns_list_2024-01-01_2026-09-09.json` | account=445-144-0907, lista de campanhas (metadado) | 80 | OK |
| 4 | Google Ads | `data/raw/google_ads/br_campaign_metrics_last90d.json` | account=445-144-0907, métricas por campanha, 2026-06-12..2026-09-09 | 39 (com atividade) | OK |
| 5 | Google Ads | (inline, não persistido em arquivo separado — ver decisões) | account=445-144-0907, discriminação por ação de conversão (`all_conversions_purchase`, `..._youtube_follow_on_views`, `..._youtube_channel_subscriptions`, `..._nova_compra`, `..._stlflix_geral_web_purchase`, `..._lp_ambiente_br_web_purchase`, `..._inicio_do_checkout`), 2026-06-12..2026-09-09 | 80 | OK — reproduzir se necessário |
| 6 | Google Ads | `data/raw/google_ads/br_video_ad_level_last90d_RAW.json` | account=445-144-0907, video_id/título/quartis/engagement por device+network, 2026-06-12..2026-09-09 | 357 linhas → 67 vídeos únicos (agregado em `data/processed/google_ads_video_summary_last90d.json`) | OK |
| 7 | GA4 BR | `data/raw/ga4/br_channel_groups_last28_prev28.json` | account=530533972, canal de aquisição x sessões/usuários/conversões, últimos 28d e 28d anteriores | 14 canais x 2 períodos | OK |
| 8 | GA4 BR | `data/raw/ga4/br_channel_group_monthly_2026_RAW.json` | account=530533972, ano corrente por mês x canal | 1902 linhas → agregado em `data/processed/ga4_monthly_by_channel_2026.json` | OK (ver nota de particionamento em decisões) |
| 9 | GA4 BR | (inline) | account=530533972, filtro event_name in [qualify_lead, close_convert_lead, purchase, generate_lead], 2025-01-01..2026-09-09 | 1 (só "purchase", 8269 eventos) | OK — achado crítico de mensuração |
| 10 | GA4 Global | (inline) | account=530495512, tentativa dos mesmos campos custom | erro | Campos custom de conversão não existem nesta propriedade |
| 11 | YouTube Data API v3 (direto, sem Windsor) | — | `channels.list` com API key fornecida pelo usuário + channel_id `UCb3H1VIsLk9l6xAz6eyyLwQ` | erro `API_KEY_INVALID` | Bloqueado — ver `bloqueios_e_pedidos.md` |

| 12 | Google Ads | `data/raw/google_ads/br_campaign_dates_budget.json` | account=445-144-0907, start_date/end_date/budget/bidding por campanha (metadado, sem período de métrica) | 80 | OK |
| 13 | Google Ads | `data/raw/google_ads/br_user_lists_remarketing.json` | account=445-144-0907, públicos de remarketing (user_list_*) | 18 | OK — auditado em `docs/auditoria_publicos_remarketing.md` |
| 14 | GA4 BR | `data/raw/ga4/br_landing_pages_by_channel_last90d_RAW.json` → agregado em `data/processed/ga4_landing_pages_last90d.json` | account=530533972, landing_page x canal, 2026-06-12..2026-09-09 | 1940 linhas brutas → 1940 combinações agregadas | OK |
| 15 | GA4 BR | (inline) | account=530533972, funil de e-commerce (add_to_carts/checkouts/ecommerce_purchases/purchase_revenue) por canal, 2026-06-12..2026-09-09 | 14 canais | OK — achado: Paid Video = 0 purchases/0 revenue no período |

## Ainda não extraído (próximos passos, ver `plano_execucao.md`)
- Google Ads: datas de início/fim de campanha, orçamento, público-alvo, exclusões,
  posicionamentos, comparação com BF25 (ano anterior) em detalhe.
- GA4: landing pages, eventos de e-commerce detalhados (`begin_checkout`,
  `add_to_cart`), sobreposição de públicos, `customevent_vsl_seconds` (parece ser
  vídeo de vendas — relevante para preparação comercial).
- YouTube: tudo (bloqueado).
