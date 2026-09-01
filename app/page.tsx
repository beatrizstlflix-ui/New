'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import StatCard from '@/components/StatCard'
import ViewsChart from '@/components/ViewsChart'
import TrafficSourceChart from '@/components/TrafficSourceChart'
import TopVideosTable from '@/components/TopVideosTable'
import RangeSelector from '@/components/RangeSelector'
import type { DashboardResponse } from '@/lib/types'

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = Math.round(seconds % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
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

  return (
    <main className="max-w-6xl mx-auto px-4 py-8 flex flex-col gap-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {data?.channel.thumbnail ? (
            <Image
              src={data.channel.thumbnail}
              alt={data.channel.title}
              width={48}
              height={48}
              className="rounded-full"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-panel2" />
          )}
          <div>
            <h1 className="text-lg font-semibold">{data?.channel.title ?? 'STLFLIX BR'}</h1>
            <p className="text-xs text-muted">Dados organicos — YouTube Studio</p>
          </div>
        </div>
        <RangeSelector value={range} onChange={setRange} />
      </header>

      {error && (
        <div className="bg-panel border border-bad/50 text-bad rounded-xl p-4 text-sm">
          <p className="font-semibold mb-1">Nao foi possivel carregar os dados.</p>
          <p>{error}</p>
          <p className="text-muted mt-2">
            Confira se GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET e YOUTUBE_REFRESH_TOKEN estao configurados
            corretamente no ambiente do servidor (veja o README).
          </p>
        </div>
      )}

      {loading && !data && <div className="text-muted text-sm">Carregando dados do canal...</div>}

      {data && (
        <>
          {data.demo && (
            <div className="bg-panel border border-accent2/50 text-accent2 rounded-xl p-3 text-sm">
              Modo demonstracao — exibindo dados de exemplo porque as credenciais do YouTube ainda nao
              foram configuradas. Preencha <code>.env.local</code> (veja o README) para ver os dados reais
              do canal.
            </div>
          )}
          <p className="text-xs text-muted -mt-2">
            Periodo: {data.range.label} ({data.range.start} a {data.range.end})
          </p>

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
            <StatCard label="Trafego organico" value={`${data.organicSharePct.toFixed(1)}%`} />
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
            <ViewsChart data={data.daily} />
            <TrafficSourceChart data={data.trafficSources} />
          </section>

          <TopVideosTable videos={data.topVideos} />
        </>
      )}
    </main>
  )
}
