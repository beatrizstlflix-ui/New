function formatDelta(current: number, previous: number): { pct: string; positive: boolean } | null {
  if (previous === 0) return null
  const pct = ((current - previous) / previous) * 100
  return { pct: `${pct >= 0 ? '+' : ''}${pct.toFixed(1)}%`, positive: pct >= 0 }
}

export default function StatCard({
  label,
  value,
  previous,
  rawCurrent,
  rawPrevious,
}: {
  label: string
  value: string
  previous?: string
  rawCurrent?: number
  rawPrevious?: number
}) {
  const delta = rawCurrent !== undefined && rawPrevious !== undefined ? formatDelta(rawCurrent, rawPrevious) : null

  return (
    <div className="bg-panel border border-border rounded-xl p-4 flex flex-col gap-1">
      <span className="text-muted text-xs uppercase tracking-wide">{label}</span>
      <span className="text-2xl font-semibold">{value}</span>
      {delta && (
        <span className={`text-xs ${delta.positive ? 'text-good' : 'text-bad'}`}>
          {delta.pct} vs. periodo anterior
        </span>
      )}
      {previous && !delta && <span className="text-xs text-muted">{previous}</span>}
    </div>
  )
}
