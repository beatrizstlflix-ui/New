import StatCard from '@/components/StatCard'
import MonthlyChannelChart, { MonthlyChannelPoint } from '@/components/MonthlyChannelChart'
import MediaPagaBarChart from '@/components/MediaPagaBarChart'
import CadenceChart from '@/components/CadenceChart'
import SubscribersMonthlyChart from '@/components/SubscribersMonthlyChart'
import {
  getMediaPagaResumo,
  getGA4Last28,
  getEcommerceFunnel90d,
  getGA4Monthly,
  getUserLists,
  getVideoAdSummary,
  getOrganicSummary,
  getCaptionsCoverage,
  getYoutubeStudioAnalytics,
  brl,
  num,
} from '@/lib/auditData'

export const metadata = {
  title: 'Auditoria STLFLIX BR — Black Friday 2026',
}

function BlockedBanner({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-panel border border-bad/50 rounded-xl p-4 text-sm">
      <p className="font-semibold text-bad mb-1">🚫 {title} — bloqueado</p>
      <div className="text-muted">{children}</div>
    </div>
  )
}

function ConfidenceTag({ level }: { level: 'alta' | 'media' | 'baixa' }) {
  const map = {
    alta: 'bg-good/20 text-good border-good/40',
    media: 'bg-accent2/20 text-accent2 border-accent2/40',
    baixa: 'bg-bad/20 text-bad border-bad/40',
  } as const
  return (
    <span className={`text-[10px] uppercase tracking-wide border rounded px-1.5 py-0.5 ${map[level]}`}>
      Confiança {level}
    </span>
  )
}

export default function AuditoriaPage() {
  const mediaPaga = getMediaPagaResumo()
  const ga4_28 = getGA4Last28()
  const funil = getEcommerceFunnel90d()
  const monthly = getGA4Monthly()
  const userLists = getUserLists()
  const videoAds = getVideoAdSummary()
  const organic = getOrganicSummary()
  const captions = getCaptionsCoverage()
  const studio = getYoutubeStudioAnalytics()

  const cadenceData = Object.entries(organic.publish_cadence_by_month).map(([month, videos]) => ({ month, videos }))
  const periodLabels: Record<string, string> = { P1: 'YTD 2026', P2: '90 dias', P3: '28 dias', P4: '28d anteriores', P5: 'BF 2025' }
  const traffic28d = studio.traffic_sources.P3
  const contentType90d = studio.content_type_engagement.P2
  const nvr = studio.new_vs_returning

  const paidVideoLast28 = ga4_28.last28d.rows.find((r) => r.session_default_channel_group === 'Paid Video')
  const paidVideoPrev28 = ga4_28.previous28d.rows.find((r) => r.session_default_channel_group === 'Paid Video')
  const paidSocialLast28 = ga4_28.last28d.rows.find((r) => r.session_default_channel_group === 'Paid Social')
  const organicVideoLast28 = ga4_28.last28d.rows.find((r) => r.session_default_channel_group === 'Organic Video')

  const paidVideoFunil = funil.rows.find((r) => r.session_default_channel_group === 'Paid Video')
  const organicVideoFunil = funil.rows.find((r) => r.session_default_channel_group === 'Organic Video')

  // Pivot GA4 monthly rows into chart points
  const monthsSeen = Array.from(new Set(monthly.rows.map((r) => r.year_month_name)))
  const monthOrder = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  monthsSeen.sort((a, b) => {
    const [ma] = a.split(' ')
    const [mb] = b.split(' ')
    return monthOrder.indexOf(ma) - monthOrder.indexOf(mb)
  })
  const chartData: MonthlyChannelPoint[] = monthsSeen.map((month) => {
    const pick = (ch: string) => monthly.rows.find((r) => r.year_month_name === month && r.channel_group === ch)?.sessions ?? 0
    return {
      month,
      'Organic Video': pick('Organic Video'),
      'Paid Video': pick('Paid Video'),
      'Paid Social': pick('Paid Social'),
    }
  })

  const barData = [
    { tipo: 'Vídeo (in-stream)', custo: mediaPaga.totals.cost_video_brl },
    { tipo: 'Demand Gen', custo: mediaPaga.totals.cost_demand_gen_brl },
    { tipo: 'Performance Max', custo: mediaPaga.totals.cost_performance_max_brl },
    { tipo: 'Display', custo: mediaPaga.totals.cost_display_brl },
  ]

  const topCampanhas = mediaPaga.campaigns.slice(0, 12)
  const topVideos = videoAds.videos.slice(0, 10)

  const listasRisco = userLists.rows.filter((r) => r.user_list_membership_life_span > 0 && r.user_list_membership_life_span <= 120)

  return (
    <main className="max-w-6xl mx-auto px-4 py-8 flex flex-col gap-10">
      <header>
        <h1 className="text-xl font-semibold">Auditoria YouTube STLFLIX Brasil — rumo à Black Friday 2026</h1>
        <p className="text-xs text-muted mt-1">
          Dados reais e estáticos, extraídos em 2026-09-10: Google Ads + GA4 (Windsor.ai) e YouTube (Data API v3 +
          coleta manual assistida no Studio). Ver <code>docs/instrucoes_execucao.md</code> para atualizar. Caveats
          da coleta do YouTube Studio (instabilidade de views no dia, mudança de contagem em 27/08/2026) em{' '}
          <code>docs/bloqueios_e_pedidos.md</code>.
        </p>
      </header>

      {/* VISÃO EXECUTIVA */}
      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold border-b border-border pb-2">Visão executiva</h2>
        <div className="bg-panel border border-border rounded-xl p-4 text-sm leading-relaxed">
          <p className="font-semibold mb-2">
            Estamos construindo uma base para a Black Friday? <ConfidenceTag level="alta" />
          </p>
          <p className="text-muted">
            Sim, no orgânico — e a dependência de mídia paga está caindo, o que é bom sinal: das visualizações do
            canal, 89,8% vinham de anúncios na Black Friday de 2025, contra 70,9% no acumulado de 2026 e apenas
            55,1% nos últimos 28 dias. Espectadores recorrentes seguram 66-71% do tempo assistido em{' '}
            <em>todos</em> os períodos analisados. Conteúdo longo e lives geraram ~86% dos novos inscritos nos
            últimos 90 dias, contra 4,1% dos Shorts. O ponto fraco segue sendo comercial: nenhum evento de captura
            de lead dispara no GA4 há 20 meses, e a mídia paga de vídeo quase não gera sessão qualificada no site
            (canal &quot;Paid Video&quot; do GA4: {num(paidVideoFunil?.sessions ?? 0)} sessões, 0 compras em 90d).
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard label="Dependência de mídia paga (views)" value="55,1% (28d) ← 89,8% (BF25)" />
          <StatCard label="Tempo assistido por recorrentes" value="66-71% (todos os períodos)" />
          <StatCard label="Inscritos via conteúdo longo/lives (90d)" value="~86%" />
          <StatCard label="Compras via 'Paid Video' (GA4, 90d)" value={num(paidVideoFunil?.ecommerce_purchases ?? 0)} />
        </div>

        <div className="bg-panel border border-border rounded-xl p-4 text-sm">
          <p className="font-semibold mb-2">Principais riscos e prioridades</p>
          <ul className="list-disc list-inside text-muted space-y-1">
            <li>Nenhum evento de lead identificável funcionando no GA4 — a base &quot;própria&quot; hoje é só a
              lista CRM_BASED de 30 mil pessoas carregada manualmente em algum outubro passado.
              <strong> Gargalo mais crítico e mais acionável.</strong></li>
            <li>Mídia paga traz público majoritariamente novo e pouco engajado na BF25 (62,3% views novas, mas
              duração média de só 1:11) — bom para alcance, ruim para conversão sem nutrição.</li>
            <li>&quot;Paid Social&quot; (provavelmente Meta, não conectado) é o maior canal pago de sessões do
              site — maior que todo o YouTube Ads — e está fora do escopo mensurado aqui.</li>
            <li>Divergência relevante entre valor de conversão reportado pelo Google Ads e receita observada no
              GA4 para o canal onde a Performance Max tende a cair (ver <code>bloqueios_e_pedidos.md</code> #8).</li>
          </ul>
        </div>
      </section>

      {/* AUDIÊNCIA */}
      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold border-b border-border pb-2">Audiência</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard label="Inscritos no canal (total)" value={num(organic.channel.subscriber_count)} />
          <StatCard
            label="Sessões 'Paid Video' no site (28d)"
            value={num(paidVideoLast28?.sessions ?? 0)}
            rawCurrent={paidVideoLast28?.sessions}
            rawPrevious={paidVideoPrev28?.sessions}
          />
          <StatCard label="Sessões 'Organic Video' no site (28d)" value={num(organicVideoLast28?.sessions ?? 0)} />
          <StatCard label="Sessões 'Paid Social' no site (28d)" value={num(paidSocialLast28?.sessions ?? 0)} />
        </div>
        <p className="text-xs text-muted -mt-2">
          Inscritos: contagem vitalícia do YouTube Data API. Sessões: GA4 (LP - AMBIENTE BR), tráfego no
          <em> site</em> por canal — diferente de espectadores <em>no YouTube</em> (tabela abaixo).
        </p>

        <div className="bg-panel border border-border rounded-xl p-4 overflow-x-auto">
          <h3 className="text-sm text-muted mb-1">Espectadores recorrentes vs. novos, por período (YouTube Studio)</h3>
          <p className="text-[11px] text-muted mb-3">
            &quot;Desconhecido&quot; = tráfego de Shorts/deslogados. Fonte: coleta assistida no YouTube Studio, 2026-09-10.
          </p>
          <table className="w-full text-xs">
            <thead className="text-muted text-left">
              <tr>
                <th className="pb-2 pr-2">Período</th>
                <th className="pb-2 pr-2 text-right">Novos % views</th>
                <th className="pb-2 pr-2 text-right">Novos dur.</th>
                <th className="pb-2 pr-2 text-right">Recorrentes % views</th>
                <th className="pb-2 pr-2 text-right">Recorrentes % tempo</th>
                <th className="pb-2 pr-2 text-right">Recorrentes dur.</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(nvr).map(([p, v]) => (
                <tr key={p} className="border-t border-border/60">
                  <td className="py-1.5 pr-2 text-white">{periodLabels[p]}</td>
                  <td className="py-1.5 pr-2 text-right">{v.new_views_pct}%</td>
                  <td className="py-1.5 pr-2 text-right">{v.new_avg_duration}</td>
                  <td className="py-1.5 pr-2 text-right">{v.returning_views_pct}%</td>
                  <td className="py-1.5 pr-2 text-right font-semibold text-good">{v.returning_hours_pct}%</td>
                  <td className="py-1.5 pr-2 text-right">{v.returning_avg_duration}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="text-[11px] text-muted mt-3">
            Recorrentes são minoria em número de views, mas seguram 66-71% do tempo assistido em todos os
            períodos — assistem ~2x mais por sessão que espectadores novos.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-panel border border-border rounded-xl p-4">
            <h3 className="text-sm text-muted mb-3">Perfil do público (retrato de 28 dias, estável)</h3>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <p className="text-muted mb-1">Idade (% views)</p>
                {Object.entries(studio.audience_profile_28d_snapshot.age_pct).map(([k, v]) => (
                  <div key={k} className="flex justify-between"><span className="text-muted">{k}</span><span>{v}%</span></div>
                ))}
              </div>
              <div>
                <p className="text-muted mb-1">Gênero / Dispositivo (tempo)</p>
                {Object.entries(studio.audience_profile_28d_snapshot.gender_pct).map(([k, v]) => (
                  <div key={k} className="flex justify-between"><span className="text-muted capitalize">{k}</span><span>{v}%</span></div>
                ))}
                <div className="h-2" />
                {Object.entries(studio.audience_profile_28d_snapshot.device_hours_pct).map(([k, v]) => (
                  <div key={k} className="flex justify-between"><span className="text-muted">{k}</span><span>{v}%</span></div>
                ))}
              </div>
            </div>
          </div>
          <div className="bg-panel border border-border rounded-xl p-4 text-xs">
            <h3 className="text-sm text-muted mb-3">Localização e horário de pico</h3>
            {Object.entries(studio.audience_profile_28d_snapshot.location_views_pct).map(([k, v]) => (
              <div key={k} className="flex justify-between"><span className="text-muted">{k}</span><span>{v}%</span></div>
            ))}
            <p className="text-muted mt-3">{studio.audience_profile_28d_snapshot.peak_hours_local_brt}</p>
            <p className="text-muted mt-3 mb-1">Canais também assistidos pelo público:</p>
            <ul className="list-disc list-inside">
              {studio.audience_profile_28d_snapshot.also_watched_channels.map((c) => (
                <li key={c.name}>{c.name} ({num(c.subscribers)} inscritos){c.note ? ` — ${c.note}` : ''}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ORGÂNICO */}
      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold border-b border-border pb-2">Orgânico</h2>
        <p className="text-xs text-muted">
          Canal <strong>{organic.channel.title}</strong> ({organic.channel.custom_url}) — estatísticas vitalícias via
          YouTube Data API v3 (chave de API), extraídas em 2026-09-10. Sem filtro de período: estes números são
          desde a criação do canal ({organic.channel.published_at?.slice(0, 10)}).
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard label="Inscritos (total)" value={num(organic.channel.subscriber_count)} />
          <StatCard label="Visualizações (total do canal)" value={num(organic.channel.view_count)} />
          <StatCard label="Vídeos inventariados" value={num(organic.video_count_inventoried)} />
          <StatCard label="Shorts / Longos" value={`${num(organic.by_format.short ?? 0)} / ${num(organic.by_format.long ?? 0)}`} />
        </div>
        <CadenceChart data={cadenceData} />
        <SubscribersMonthlyChart data={studio.subscribers_monthly_2026} />

        <div className="bg-panel border border-border rounded-xl p-4 overflow-x-auto">
          <h3 className="text-sm text-muted mb-1">Origem do tráfego, últimos 28 dias (YouTube Studio)</h3>
          <p className="text-[11px] text-muted mb-3">
            Dependência de mídia paga caindo: 89,8% (BF25) → 70,9% (YTD) → 55,1% (28d). &quot;Vídeos sugeridos&quot;
            tem poucas views mas a maior duração média (13:20) — conteúdo longo retém muito via sugeridos.
          </p>
          <table className="w-full text-xs">
            <thead className="text-muted text-left">
              <tr>
                <th className="pb-2 pr-2">Origem</th>
                <th className="pb-2 pr-2 text-right">% views</th>
                <th className="pb-2 pr-2 text-right">% tempo</th>
                <th className="pb-2 pr-2 text-right">Duração média</th>
              </tr>
            </thead>
            <tbody>
              {traffic28d.map((t) => (
                <tr key={t.source} className="border-t border-border/60">
                  <td className="py-1.5 pr-2 text-white">{t.source}</td>
                  <td className="py-1.5 pr-2 text-right">{t.views_pct}%</td>
                  <td className="py-1.5 pr-2 text-right">{t.hours_pct}%</td>
                  <td className="py-1.5 pr-2 text-right">{t.avg_duration}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-panel border border-border rounded-xl p-4 overflow-x-auto">
          <h3 className="text-sm text-muted mb-1">Shorts x Vídeos longos x Lives, últimos 90 dias</h3>
          <p className="text-[11px] text-muted mb-3">
            Shorts geram volume de views; vídeos longos e lives geram o tempo assistido e ~86% dos novos inscritos
            (ver <code>subscribers_by_content_type_P2</code>).
          </p>
          <table className="w-full text-xs">
            <thead className="text-muted text-left">
              <tr>
                <th className="pb-2 pr-2">Tipo</th>
                <th className="pb-2 pr-2 text-right">% views</th>
                <th className="pb-2 pr-2 text-right">% tempo</th>
                <th className="pb-2 pr-2 text-right">Duração média</th>
                <th className="pb-2 pr-2 text-right">% dos inscritos (90d)</th>
              </tr>
            </thead>
            <tbody>
              {contentType90d.map((t) => {
                const subs = studio.subscribers_by_content_type_P2.find((s) => s.type === t.type)
                return (
                  <tr key={t.type} className="border-t border-border/60">
                    <td className="py-1.5 pr-2 text-white">{t.type}</td>
                    <td className="py-1.5 pr-2 text-right">{t.views_pct}%</td>
                    <td className="py-1.5 pr-2 text-right">{t.hours_pct}%</td>
                    <td className="py-1.5 pr-2 text-right">{t.avg_duration}</td>
                    <td className="py-1.5 pr-2 text-right font-semibold text-good">{subs ? `${subs.pct}%` : '—'}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        <div className="bg-panel border border-border rounded-xl p-4 overflow-x-auto">
          <h3 className="text-sm text-muted mb-3">Top 10 vídeos por visualizações (vitalício)</h3>
          <table className="w-full text-xs">
            <thead className="text-muted text-left">
              <tr>
                <th className="pb-2 pr-2">Vídeo</th>
                <th className="pb-2 pr-2">Formato</th>
                <th className="pb-2 pr-2 text-right">Views</th>
                <th className="pb-2 pr-2 text-right">Likes</th>
                <th className="pb-2 pr-2 text-right">Comentários</th>
                <th className="pb-2 pr-2">Publicado em</th>
              </tr>
            </thead>
            <tbody>
              {organic.top_videos_by_views.slice(0, 10).map((v) => (
                <tr key={v.video_id} className="border-t border-border/60">
                  <td className="py-1.5 pr-2 max-w-sm truncate" title={v.title}>
                    <a href={`https://www.youtube.com/watch?v=${v.video_id}`} target="_blank" rel="noreferrer" className="hover:underline">
                      {v.title}
                    </a>
                  </td>
                  <td className="py-1.5 pr-2 text-muted">{v.format_guess === 'short' ? 'Short' : 'Longo'} ({v.duration_seconds}s)</td>
                  <td className="py-1.5 pr-2 text-right">{num(v.view_count)}</td>
                  <td className="py-1.5 pr-2 text-right">{num(v.like_count)}</td>
                  <td className="py-1.5 pr-2 text-right">{num(v.comment_count)}</td>
                  <td className="py-1.5 pr-2 text-muted">{v.published_at?.slice(0, 10)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="bg-panel border border-good/50 rounded-xl p-4 text-sm">
          <p className="font-semibold text-good mb-1">Transcrição: viável, cobertura parcial confirmada</p>
          <p className="text-muted">
            {num(captions.withAsrPt)} de {num(captions.checked)} vídeos testados ({((captions.withAsrPt / (captions.checked || 1)) * 100).toFixed(0)}%)
            têm legenda automática em português disponível. {captions.quotaExhausted && 'A checagem completa parou por limite diário de cota da API do YouTube (captions.list custa 50 unidades/chamada) — ver '}
            {captions.quotaExhausted && <code>docs/status_videos_transcricoes.md</code>}
            {captions.quotaExhausted && ' para o plano de continuidade.'} Baixar o texto em si ainda exige OAuth (bloqueio #1).
          </p>
        </div>
      </section>

      {/* MÍDIA PAGA */}
      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold border-b border-border pb-2">Mídia paga (Google Ads — STLFLIX Brasil)</h2>
        <p className="text-xs text-muted">Período: últimos 90 dias (2026-06-12 a 2026-09-09). {mediaPaga.totals.n_campaigns_with_activity} campanhas com atividade.</p>
        <MediaPagaBarChart data={barData} />
        <div className="bg-panel border border-border rounded-xl p-4 overflow-x-auto">
          <h3 className="text-sm text-muted mb-3">Top 12 campanhas por investimento</h3>
          <table className="w-full text-xs">
            <thead className="text-muted text-left">
              <tr>
                <th className="pb-2 pr-2">Campanha</th>
                <th className="pb-2 pr-2">Tipo</th>
                <th className="pb-2 pr-2 text-right">Custo</th>
                <th className="pb-2 pr-2 text-right">Follow-on views</th>
                <th className="pb-2 pr-2 text-right">Inscrições</th>
                <th className="pb-2 pr-2 text-right">Início checkout</th>
              </tr>
            </thead>
            <tbody>
              {topCampanhas.map((c) => (
                <tr key={c.campaign_id} className="border-t border-border/60">
                  <td className="py-1.5 pr-2 max-w-xs truncate" title={c.campaign_name}>{c.campaign_name}</td>
                  <td className="py-1.5 pr-2 text-muted">{c.advertising_channel_type}</td>
                  <td className="py-1.5 pr-2 text-right">{brl(c.cost_brl)}</td>
                  <td className="py-1.5 pr-2 text-right">{c.youtube_follow_on_views ?? '—'}</td>
                  <td className="py-1.5 pr-2 text-right">{c.youtube_channel_subscriptions ?? '—'}</td>
                  <td className="py-1.5 pr-2 text-right">{c.inicio_checkout != null ? c.inicio_checkout.toFixed(1) : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="text-[11px] text-muted mt-3">
            &quot;—&quot; = sem atividade registrada nesta ação no período (não confirmado como zero absoluto).
            Ver <code>docs/dicionario_metricas.md</code>.
          </p>
        </div>

        <div className="bg-panel border border-border rounded-xl p-4 overflow-x-auto">
          <h3 className="text-sm text-muted mb-3">Top 10 vídeos usados em anúncios (por visualizações do anúncio)</h3>
          <table className="w-full text-xs">
            <thead className="text-muted text-left">
              <tr>
                <th className="pb-2 pr-2">Vídeo</th>
                <th className="pb-2 pr-2 text-right">Visualizações (ad)</th>
                <th className="pb-2 pr-2 text-right">Conclusão média (100%)</th>
              </tr>
            </thead>
            <tbody>
              {topVideos.map((v) => (
                <tr key={v.video_id} className="border-t border-border/60">
                  <td className="py-1.5 pr-2 max-w-md truncate" title={v.video_title ?? ''}>
                    {v.video_title ?? '(sem título — provável PMax/Demand Gen sem asset mapeado)'}
                  </td>
                  <td className="py-1.5 pr-2 text-right">{num(v.trueview_views)}</td>
                  <td className="py-1.5 pr-2 text-right">{(v.quartile_p100_view_weighted_avg * 100).toFixed(1)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="text-[11px] text-muted mt-3">
            Conclusão do anúncio (quartil 100%) não é a curva de retenção do YouTube Studio — não comparável
            diretamente. Ver <code>docs/dicionario_metricas.md</code>.
          </p>
        </div>
      </section>

      {/* RELAÇÃO MÍDIA X ORGÂNICO */}
      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold border-b border-border pb-2">Relação entre mídia paga e orgânico</h2>
        <MonthlyChannelChart data={chartData} />
        <div className="bg-panel border border-border rounded-xl p-4 text-sm text-muted">
          <p className="font-semibold text-white mb-1">Classificação do achado</p>
          <p><strong>Fato observado</strong> (não causal): sessões de &quot;Paid Video&quot; e &quot;Organic Video&quot; no
          site são pequenas frente a &quot;Paid Social&quot;, mesmo em meses de pico de investimento em campanhas
          VIDEO (junho–agosto/2026). <strong>Não afirmamos</strong> que a mídia paga do YouTube melhora ou piora o
          orgânico — não há desenho de experimento aqui, apenas associação temporal.</p>
        </div>
      </section>

      {/* RETENÇÃO */}
      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold border-b border-border pb-2">Retenção</h2>
        <p className="text-xs text-muted">
          Retenção vitalícia (desde a publicação) de 5 vídeos priorizados — 3 Shorts de alto investimento/consumo,
          1 vídeo longo da série de estudo de caso, 1 com maior investimento em mídia (proxy: impressões
          vitalícias). Fonte: YouTube Studio, coleta assistida 2026-09-10.
        </p>
        <div className="bg-panel border border-border rounded-xl p-4 overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="text-muted text-left">
              <tr>
                <th className="pb-2 pr-2">Vídeo</th>
                <th className="pb-2 pr-2">Formato</th>
                <th className="pb-2 pr-2 text-right">Views vitalício</th>
                <th className="pb-2 pr-2 text-right">% assistida</th>
                <th className="pb-2 pr-2">Ponto-chave de retenção</th>
                <th className="pb-2 pr-2 text-right">Continuaram*</th>
              </tr>
            </thead>
            <tbody>
              {studio.retention_videos.map((v) => (
                <tr key={v.title} className="border-t border-border/60">
                  <td className="py-1.5 pr-2 text-white max-w-xs truncate" title={v.title}>{v.title}</td>
                  <td className="py-1.5 pr-2 text-muted">{v.format}</td>
                  <td className="py-1.5 pr-2 text-right">{v.views_lifetime > 0 ? num(v.views_lifetime) : '—'}</td>
                  <td className="py-1.5 pr-2 text-right">{v.pct_watched != null ? `${v.pct_watched}%` : '—'}</td>
                  <td className="py-1.5 pr-2 text-muted">{v.retention_key ?? v.note ?? '—'}</td>
                  <td className="py-1.5 pr-2 text-right">{v.continued_pct != null ? `${v.continued_pct}%` : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="text-[11px] text-muted mt-3">
            * &quot;Continuaram&quot; = % que não pulou o Short nos primeiros segundos. O vídeo &quot;Eleve o nível
            do Nintendo Switch&quot; (maior investimento em mídia: 11,3M impressões vitalícias, CTR 8,4%) tem
            retenção de 60-180% — indica loops/rewatches, criativo de anúncio muito otimizado.
          </p>
        </div>
      </section>

      {/* CONTEÚDO E NARRATIVAS */}
      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold border-b border-border pb-2">Conteúdo e narrativas</h2>
        <BlockedBanner title="Taxonomia de narrativas x desempenho">
          Depende do inventário completo de vídeos (bloqueado) e de transcrições (ainda não iniciadas — ver
          <code> docs/status_videos_transcricoes.md</code>). O que já se observa nos nomes de campanha: a grande
          maioria dos vídeos promovidos são estudos de caso/depoimentos de alunos monetizando com impressão 3D
          (&quot;vídeo-reconhecimento&quot;), estrategicamente de topo de funil.
        </BlockedBanner>
      </section>

      {/* PREPARAÇÃO BLACK FRIDAY */}
      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold border-b border-border pb-2">Preparação para a Black Friday</h2>
        <p className="text-xs text-muted">
          Retrato atual (2026-09-10) dos públicos de remarketing do Google Ads. Sem histórico de evolução — ver
          <code> docs/auditoria_publicos_remarketing.md</code> para leitura completa e limitações.
        </p>
        <div className="bg-panel border border-border rounded-xl p-4 overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="text-muted text-left">
              <tr>
                <th className="pb-2 pr-2">Público</th>
                <th className="pb-2 pr-2">Tipo</th>
                <th className="pb-2 pr-2 text-right">Tamanho (Search)</th>
                <th className="pb-2 pr-2 text-right">Duração (dias)</th>
                <th className="pb-2 pr-2">Risco de expiração até a BF</th>
              </tr>
            </thead>
            <tbody>
              {userLists.rows
                .slice()
                .sort((a, b) => b.user_list_size_for_search - a.user_list_size_for_search)
                .map((u) => (
                  <tr key={u.user_list_id} className="border-t border-border/60">
                    <td className="py-1.5 pr-2 max-w-xs truncate" title={u.user_list_name}>{u.user_list_name}</td>
                    <td className="py-1.5 pr-2 text-muted">{u.user_list_type}</td>
                    <td className="py-1.5 pr-2 text-right">{num(u.user_list_size_for_search)}</td>
                    <td className="py-1.5 pr-2 text-right">{u.user_list_membership_life_span}</td>
                    <td className="py-1.5 pr-2">
                      {u.user_list_membership_life_span > 0 && u.user_list_membership_life_span <= 120 ? (
                        <span className="text-bad">Alto — só {u.user_list_membership_life_span}d de janela</span>
                      ) : (
                        <span className="text-good">Baixo (janela longa ou sem alimentação recente a confirmar)</span>
                      )}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        <div className="bg-panel border border-accent2/50 rounded-xl p-4 text-sm">
          <p className="font-semibold text-accent2 mb-1">{listasRisco.length} público(s) com janela ≤120 dias</p>
          <p className="text-muted">
            Precisam de tráfego/atividade contínua entre agora e a Black Friday (27/11/2026, a confirmar) para não
            encolher. Não some os tamanhos das listas — elas se sobrepõem.
          </p>
        </div>
      </section>

      {/* MENSURAÇÃO E PLANO DE AÇÃO */}
      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold border-b border-border pb-2">Mensuração e plano de ação</h2>
        <div className="bg-panel border border-border rounded-xl p-4 overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="text-muted text-left">
              <tr>
                <th className="pb-2 pr-2">Problema</th>
                <th className="pb-2 pr-2">Impacto na interpretação</th>
                <th className="pb-2 pr-2">Evidência</th>
                <th className="pb-2 pr-2">Correção sugerida</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-border/60 align-top">
                <td className="py-2 pr-2">YouTube Analytics sem acesso automatizado</td>
                <td className="py-2 pr-2 text-muted">Resolvido via coleta manual assistida (Studio) — mas não se atualiza sozinho a cada rodada</td>
                <td className="py-2 pr-2 text-muted">Conector Windsor.ai ainda no canal pessoal; OAuth do app incompleto (falta client_id/secret)</td>
                <td className="py-2 pr-2 text-muted">Reconectar no Windsor.ai ou completar client_id/secret do OAuth, se quiser atualização automatizada</td>
              </tr>
              <tr className="border-t border-border/60 align-top">
                <td className="py-2 pr-2">Eventos de lead nunca disparam no GA4</td>
                <td className="py-2 pr-2 text-muted">Impede responder se há geração de leads identificáveis</td>
                <td className="py-2 pr-2 text-muted">0 eventos em 20 meses (qualify_lead, close_convert_lead)</td>
                <td className="py-2 pr-2 text-muted">Confirmar se existe mecanismo de captura fora do e-commerce; instrumentar evento correspondente</td>
              </tr>
              <tr className="border-t border-border/60 align-top">
                <td className="py-2 pr-2">Divergência valor de conversão Ads x receita GA4</td>
                <td className="py-2 pr-2 text-muted">Risco de superestimar retorno da Pmax de fundo de funil</td>
                <td className="py-2 pr-2 text-muted">R$463k (Ads, 90d) vs R$97k (GA4 Cross-network, 90d)</td>
                <td className="py-2 pr-2 text-muted">Investigar modelo de atribuição e janela de conversão de cada fonte antes de decidir orçamento</td>
              </tr>
              <tr className="border-t border-border/60 align-top">
                <td className="py-2 pr-2">Meta Ads e Stripe não conectados</td>
                <td className="py-2 pr-2 text-muted">&quot;Paid Social&quot; (maior canal pago) fica sem detalhe de investimento/criativos</td>
                <td className="py-2 pr-2 text-muted">Nenhuma origem além do GA4 disponível</td>
                <td className="py-2 pr-2 text-muted">Autorizar conectores em claude.ai → Settings → Connectors, se relevante ao escopo</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-muted">
          Lista completa de bloqueios e pedidos: <code>docs/bloqueios_e_pedidos.md</code>. Perguntas obrigatórias
          respondidas/pendentes: <code>docs/perguntas_respondidas_pendentes.md</code>.
        </p>
      </section>
    </main>
  )
}
