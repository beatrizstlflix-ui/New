'use client'

import { useEffect, useState } from 'react'
import ChannelAvatar from '@/components/ChannelAvatar'
import StatCard from '@/components/StatCard'
import ViewsChart from '@/components/ViewsChart'
import TrafficSourceChart from '@/components/TrafficSourceChart'
import TopVideosTable from '@/components/TopVideosTable'
import RangeSelector from '@/components/RangeSelector'
import AdsSpendChart from '@/components/AdsSpendChart'
import type { DashboardResponse } from '@/lib/types'

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = Math.round(seconds % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

function formatCurrency(microValue: number): string {
  return (microValue / 1_000_000).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

export default function DashboardPage() {
  const [range, setRange] = useState(28)
  const [data, setData] = useState<DashboardResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    fetch(`/api/dashboard?range=${range}`)
      .then(async (res) => {
        const json = await res.json()
        if (!res.ok) throw new Error(json.error ?? 'Erro ao carregar dados.')
        return json as DashboardResponse
      })
      .then((json) => {
        if (!cancelled) setData(json)
      })
      .catch((err) => {
        if (!cancelled) setError(err.message)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [range])

  const hasAnalytics = Boolean(data?.totals && data?.previousTotals && data?.daily && data?.trafficSources)

  return (
    <main className="max-w-6xl mx-auto px-4 py-8 flex flex-col gap-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <ChannelAvatar src={data?.channel.thumbnail ?? ''} alt={data?.channel.title ?? 'STLFLIX BR'} />
          <div className="min-w-0">
            <h1 className="text-lg font-semibold truncate">{data?.channel.title ?? 'STLFLIX BR'}</h1>
            <p className="text-xs text-muted whitespace-nowrap">Dados organicos e pagos — YouTube + Google Ads</p>
          </div>
        </div>
        <RangeSelector value={range} onChange={setRange} />
      </header>

      {error && (
        <div className="bg-panel border border-bad/50 text-bad rounded-xl p-4 text-sm">
          <p className="font-semibold mb-1">Nao foi possivel carregar os dados.</p>
          <p>{error}</p>
          <p className="text-muted mt-2">
            Confira as variaveis de ambiente do servidor (veja o README).
          </p>
        </div>
      )}

      {loading && !data && <div className="text-muted text-sm">Carregando dados do canal...</div>}

      {data && (
        <>
          {data.demo && (
            <div className="bg-panel border border-accent2/50 text-accent2 rounded-xl p-3 text-sm">
              Modo demonstracao — exibindo dados de exemplo porque nenhuma credencial do YouTube foi
              configurada. Preencha <code>.env.local</code> (veja o README) para ver os dados reais do
              canal.
            </div>
          )}
          {data.topVideosNote && (
            <div className="bg-panel border border-accent2/50 text-accent2 rounded-xl p-3 text-sm">
              {data.topVideosNote}
            </div>
          )}

          <p className="text-xs text-muted -mt-2">
            Periodo: {data.range.label} ({data.range.start} a {data.range.end})
          </p>

          {hasAnalytics && data.totals && data.previousTotals && (
            <>
              <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard
                  label="Visualizacoes"
                  value={data.totals.views.toLocaleString('pt-BR')}
                  rawCurrent={data.totals.views}
                  rawPrevious={data.previousTotals.views}
                />
                <StatCard
                  label="Tempo assistido"
                  value={`${Math.round(data.totals.minutesWatched).toLocaleString('pt-BR')} min`}
                  rawCurrent={data.totals.minutesWatched}
                  rawPrevious={data.previousTotals.minutesWatched}
                />
                <StatCard
                  label="Inscritos ganhos"
                  value={data.totals.subscribersGained.toLocaleString('pt-BR')}
                  rawCurrent={data.totals.subscribersGained}
                  rawPrevious={data.previousTotals.subscribersGained}
                />
                <StatCard label="Duracao media" value={formatDuration(data.totals.averageViewDuration)} />
              </section>

              <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard label="Trafego organico" value={`${(data.organicSharePct ?? 0).toFixed(1)}%`} />
                <StatCard
                  label="Curtidas"
                  value={data.totals.likes.toLocaleString('pt-BR')}
                  rawCurrent={data.totals.likes}
                  rawPrevious={data.previousTotals.likes}
                />
                <StatCard
                  label="Comentarios"
                  value={data.totals.comments.toLocaleString('pt-BR')}
                  rawCurrent={data.totals.comments}
                  rawPrevious={data.previousTotals.comments}
                />
                <StatCard label="Inscritos (total)" value={data.channel.subscriberCount.toLocaleString('pt-BR')} />
              </section>

              <section className="grid md:grid-cols-2 gap-4">
                <ViewsChart data={data.daily ?? []} />
                <TrafficSourceChart data={data.trafficSources ?? []} />
              </section>
            </>
          )}

          {!hasAnalytics && (
            <section className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <StatCard label="Inscritos (total)" value={data.channel.subscriberCount.toLocaleString('pt-BR')} />
              <StatCard label="Visualizacoes (total do canal)" value={data.channel.viewCount.toLocaleString('pt-BR')} />
              <StatCard label="Videos publicados" value={data.channel.videoCount.toLocaleString('pt-BR')} />
            </section>
          )}

          <TopVideosTable
            videos={data.topVideos}
            showWatchTime={hasAnalytics}
            title={hasAnalytics ? 'Videos mais assistidos no periodo' : 'Videos mais assistidos (estatisticas vitalicias)'}
          />

          {data.adsError && (
            <div className="bg-panel border border-bad/50 text-bad rounded-xl p-3 text-sm">
              Nao foi possivel carregar os dados do Google Ads: {data.adsError}
            </div>
          )}

          {data.ads && (
            <>
              <h2 className="text-sm font-semibold text-muted mt-2">Trafego pago — Google Ads (STLFLIX Brasil)</h2>
              <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard
                  label="Investimento"
                  value={formatCurrency(data.ads.totals.costMicros)}
                  rawCurrent={data.ads.totals.costMicros}
                  rawPrevious={data.ads.previousTotals.costMicros}
                />
                <StatCard
                  label="Cliques"
                  value={data.ads.totals.clicks.toLocaleString('pt-BR')}
                  rawCurrent={data.ads.totals.clicks}
                  rawPrevious={data.ads.previousTotals.clicks}
                />
                <StatCard
                  label="Impressoes"
                  value={data.ads.totals.impressions.toLocaleString('pt-BR')}
                  rawCurrent={data.ads.totals.impressions}
                  rawPrevious={data.ads.previousTotals.impressions}
                />
                <StatCard
                  label="Conversoes"
                  value={data.ads.totals.conversions.toLocaleString('pt-BR', { maximumFractionDigits: 1 })}
                  rawCurrent={data.ads.totals.conversions}
                  rawPrevious={data.ads.previousTotals.conversions}
                />
              </section>
              <AdsSpendChart data={data.ads.daily} />
            </>
          )}
        </>
      )}
    </main>
  )
}
