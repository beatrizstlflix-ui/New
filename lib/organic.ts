/**
 * insightTrafficSourceType da YouTube Analytics API.
 * PAID_SOURCES sao as unicas fontes pagas/promovidas; todo o resto conta
 * como trafego organico para este dashboard.
 */
const PAID_SOURCES = new Set(['ADVERTISING', 'PROMOTED', 'CAMPAIGN_CARD'])

const SOURCE_LABELS: Record<string, string> = {
  ADVERTISING: 'Anuncios (pago)',
  PROMOTED: 'Video promovido (pago)',
  CAMPAIGN_CARD: 'Card de campanha (pago)',
  YT_SEARCH: 'Busca do YouTube',
  SEARCH: 'Busca do YouTube',
  RELATED_VIDEO: 'Videos sugeridos',
  SUGGESTED_VIDEO: 'Videos sugeridos',
  BROWSE: 'Recursos de navegacao',
  YT_CHANNEL: 'Pagina do canal',
  YT_OTHER_PAGE: 'Outras paginas do YouTube',
  YT_PLAYLIST_PAGE: 'Pagina de playlist',
  PLAYLIST: 'Playlist',
  SUBSCRIBER: 'Feed de inscritos',
  NOTIFICATION: 'Notificacoes',
  EXT_URL: 'Links externos',
  DIRECT: 'Digitado/direto',
  NO_LINK_OTHER: 'Digitado/direto',
  NO_LINK_EMBEDDED: 'Player incorporado',
  END_SCREEN: 'Tela final',
  ANNOTATION: 'Anotacoes',
  HASHTAGS: 'Hashtags',
  SHORTS: 'Feed do Shorts',
  SOUND_PAGE: 'Pagina de audio (Shorts)',
  STORY: 'Stories',
  LIVE_REDIRECT: 'Redirecionamento de live',
}

export function isOrganicSource(source: string): boolean {
  return !PAID_SOURCES.has(source)
}

export function labelForSource(source: string): string {
  return SOURCE_LABELS[source] ?? source.replace(/_/g, ' ').toLowerCase()
}
