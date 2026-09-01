import type { TopVideo } from '@/lib/types'

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = Math.round(seconds % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

export default function TopVideosTable({ videos }: { videos: TopVideo[] }) {
  return (
    <div className="bg-panel border border-border rounded-xl p-4">
      <h3 className="text-sm text-muted mb-3">Videos mais assistidos no periodo</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-muted border-b border-border">
              <th className="py-2 pr-3 font-normal">Video</th>
              <th className="py-2 px-3 font-normal text-right">Views</th>
              <th className="py-2 px-3 font-normal text-right">Tempo assistido</th>
              <th className="py-2 px-3 font-normal text-right">Duracao media</th>
              <th className="py-2 pl-3 font-normal text-right">Curtidas</th>
            </tr>
          </thead>
          <tbody>
            {videos.map((v) => (
              <tr key={v.id} className="border-b border-border/60 last:border-0">
                <td className="py-2 pr-3">
                  <div className="flex items-center gap-3">
                    {v.thumbnail ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={v.thumbnail} alt="" className="w-16 h-9 object-cover rounded" />
                    ) : (
                      <div className="w-16 h-9 bg-panel2 rounded" />
                    )}
                    <a
                      href={`https://www.youtube.com/watch?v=${v.id}`}
                      target="_blank"
                      rel="noreferrer"
                      className="hover:text-accent2 line-clamp-2"
                    >
                      {v.title}
                    </a>
                  </div>
                </td>
                <td className="py-2 px-3 text-right">{v.views.toLocaleString('pt-BR')}</td>
                <td className="py-2 px-3 text-right">{Math.round(v.minutesWatched).toLocaleString('pt-BR')} min</td>
                <td className="py-2 px-3 text-right">{formatDuration(v.averageViewDuration)}</td>
                <td className="py-2 pl-3 text-right">{v.likes.toLocaleString('pt-BR')}</td>
              </tr>
            ))}
            {videos.length === 0 && (
              <tr>
                <td colSpan={5} className="py-6 text-center text-muted">
                  Nenhum dado de video no periodo selecionado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
