'use client'

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import type { DailyPoint } from '@/lib/types'

function formatDateShort(iso: string): string {
  const [, m, d] = iso.split('-')
  return `${d}/${m}`
}

export default function ViewsChart({ data }: { data: DailyPoint[] }) {
  return (
    <div className="bg-panel border border-border rounded-xl p-4">
      <h3 className="text-sm text-muted mb-3">Visualizacoes por dia</h3>
      <ResponsiveContainer width="100%" height={260}>
        <AreaChart data={data} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="viewsFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3ea6ff" stopOpacity={0.35} />
              <stop offset="100%" stopColor="#3ea6ff" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#303030" vertical={false} />
          <XAxis dataKey="date" tickFormatter={formatDateShort} stroke="#aaaaaa" fontSize={12} tickLine={false} />
          <YAxis stroke="#aaaaaa" fontSize={12} tickLine={false} axisLine={false} width={48} />
          <Tooltip
            contentStyle={{ background: '#212121', border: '1px solid #303030', borderRadius: 8, color: '#fff' }}
            labelFormatter={(v) => `Data: ${formatDateShort(String(v))}`}
            formatter={(value: number) => [value.toLocaleString('pt-BR'), 'Visualizacoes']}
          />
          <Area type="monotone" dataKey="views" stroke="#3ea6ff" strokeWidth={2} fill="url(#viewsFill)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
