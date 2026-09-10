import StatCard from '@/components/StatCard'
import MonthlyChannelChart, { MonthlyChannelPoint } from '@/components/MonthlyChannelChart'
import MediaPagaBarChart from '@/components/MediaPagaBarChart'
import {
  getMediaPagaResumo,
  getGA4Last28,
  getEcommerceFunnel90d,
  getGA4Monthly,
  getUserLists,
  getVideoAdSummary,
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
          Dados reais e estáticos, extraídos em 2026-09-10 via Windsor.ai (Google Ads + GA4). Ver{' '}
          <code>docs/instrucoes_execucao.md</code> para atualizar. Seções marcadas como bloqueadas dependem de
          correção de acesso ao YouTube — ver <code>docs/bloqueios_e_pedidos.md</code>.
        </p>
      </header>

      {/* VISÃO EXECUTIVA */}
      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold border-b border-border pb-2">Visão executiva</h2>
        <div className="bg-panel border border-border rounded-xl p-4 text-sm leading-relaxed">
          <p className="font-semibold mb-2">
            Estamos construindo uma base para a Black Friday? <ConfidenceTag level="media" />
          </p>
          <p className="text-muted">
            Resposta parcial (falta o lado orgânico do YouTube, bloqueado — ver abaixo). Com os dados disponíveis
            (Google Ads + GA4, últimos 90 dias): a mídia paga do YouTube gera engajamento mensurável{' '}
            <em>dentro da plataforma</em> ({num(mediaPaga.totals.youtube_follow_on_views)} visualizações
            subsequentes e {num(mediaPaga.totals.youtube_channel_subscriptions)} inscrições atribuídas), mas
            praticamente não gera sessões qualificadas no site (canal &quot;Paid Video&quot; do GA4: apenas{' '}
            {num(paidVideoFunil?.sessions ?? 0)} sessões, {num(paidVideoFunil?.checkouts ?? 0)} checkouts e{' '}
            {num(paidVideoFunil?.ecommerce_purchases ?? 0)} compras em 90 dias). Não há, hoje, nenhum evento de
            captura de lead identificável disparando no GA4 (qualify_lead/close_convert_lead = 0 em 20 meses).
            Ou seja: há evidência de audiência e engajamento crescendo dentro do YouTube, mas não de leads
            identificados nem de tráfego qualificado ao site vindo da mídia paga em vídeo.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard label="Investimento em mídia (90d)" value={brl(mediaPaga.totals.cost_brl)} />
          <StatCard label="Follow-on views (YouTube Ads)" value={num(mediaPaga.totals.youtube_follow_on_views)} />
          <StatCard label="Inscrições atribuídas (Ads)" value={num(mediaPaga.totals.youtube_channel_subscriptions)} />
          <StatCard label="Compras via 'Paid Video' (GA4, 90d)" value={num(paidVideoFunil?.ecommerce_purchases ?? 0)} />
        </div>

        <div className="bg-panel border border-border rounded-xl p-4 text-sm">
          <p className="font-semibold mb-2">Principais riscos e prioridades</p>
          <ul className="list-disc list-inside text-muted space-y-1">
            <li>YouTube Analytics real (orgânico, retenção, recorrência) está bloqueado — sem isso não dá para
              avaliar a maior parte da preparação de audiência. <strong>Prioridade máxima.</strong></li>
            <li>Nenhum evento de lead identificável funcionando no GA4 — a base "própria" hoje é só a lista
              CRM_BASED de 30 mil pessoas carregada manualmente em algum outubro passado.</li>
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
          <StatCard
            label="Sessões 'Paid Video' (28d)"
            value={num(paidVideoLast28?.sessions ?? 0)}
            rawCurrent={paidVideoLast28?.sessions}
            rawPrevious={paidVideoPrev28?.sessions}
          />
          <StatCard label="Sessões 'Organic Video' (28d)" value={num(organicVideoLast28?.sessions ?? 0)} />
          <StatCard label="Sessões 'Paid Social' (28d)" value={num(paidSocialLast28?.sessions ?? 0)} />
          <StatCard
            label="Usuários novos via Paid Video (28d)"
            value={num(paidVideoLast28?.newusers ?? 0)}
          />
        </div>
        <p className="text-xs text-muted -mt-2">
          Fonte: GA4 (LP - AMBIENTE BR), sessões no site por canal de aquisição — não é o mesmo que espectadores no
          YouTube (isso está bloqueado). "Recorrência" e "audiência ativa" no sentido do YouTube Studio não podem
          ser respondidas aqui.
        </p>
        <BlockedBanner title="Espectadores, inscritos, audiência ativa/recorrente (definição YouTube)">
          Requer YouTube Analytics do canal correto. Ver <code>docs/bloqueios_e_pedidos.md</code> item 1.
        </BlockedBanner>
      </section>

      {/* ORGÂNICO */}
      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold border-b border-border pb-2">Orgânico</h2>
        <BlockedBanner title="Descoberta, retenção, inscrições, origens de tráfego no YouTube, vídeos em destaque">
          O conector do YouTube está autenticado no canal pessoal vazio da conta, não no canal STLFLIX BR. Nenhum
          dado orgânico de vídeo pode ser mostrado aqui sem inventar números. Corrigir em
          <code> https://onboard.windsor.ai/connect?connector=youtube&next=/youtube/authorize</code> selecionando o
          canal correto na tela de consentimento.
        </BlockedBanner>
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
        <BlockedBanner title="Curvas de retenção do YouTube Studio">
          Não disponível sem o YouTube Analytics do canal correto. O que temos (conclusão do anúncio por quartil,
          seção de mídia paga acima) não deve ser lido como retenção orgânica.
        </BlockedBanner>
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
                <td className="py-2 pr-2">YouTube conectado ao canal errado</td>
                <td className="py-2 pr-2 text-muted">Bloqueia ~40% do escopo da auditoria (orgânico, retenção, audiência real)</td>
                <td className="py-2 pr-2 text-muted">Canal &quot;Beatriz stlflix&quot;, 0 vídeos/inscritos</td>
                <td className="py-2 pr-2 text-muted">Reconectar no Windsor.ai selecionando o canal certo</td>
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
