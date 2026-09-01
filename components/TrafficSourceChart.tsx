'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import type { TrafficSourcePoint } from '@/lib/types'

const ORGANIC_COLOR = '#3fb950'
const PAID_COLOR = '#f85149'

export default function TrafficSourceChart({ data }: { data: TrafficSourcePoint[] }) {
  const sorted = [...data].sort((a, b) => b.views - a.views).slice(0, 8)

  return (
    <div className="bg-panel border border-border rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm text-muted">De onde vem o trafego</h3>
        <div className="flex gap-3 text-xs text-muted">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ background: ORGANIC_COLOR }} /> Organico
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ background: PAID_COLOR }} /> Pago
          </span>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={sorted} layout="vertical" margin={{ top: 4, right: 16, left: 8, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#303030" horizontal={false} />
          <XAxis type="number" stroke="#aaaaaa" fontSize={12} tickLine={false} />
          <YAxis type="category" dataKey="label" stroke="#aaaaaa" fontSize={12} width={140} tickLine={false} axisLine={false} />
          <Tooltip
            contentStyle={{ background: '#212121', border: '1px solid #303030', borderRadius: 8, color: '#fff' }}
            formatter={(value: number) => [value.toLocaleString('pt-BR'), 'Visualizacoes']}
          />
          <Bar dataKey="views" radius={[0, 4, 4, 0]}>
            {sorted.map((entry) => (
              <Cell key={entry.source} fill={entry.organic ? ORGANIC_COLOR : PAID_COLOR} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
