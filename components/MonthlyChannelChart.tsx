'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

export interface MonthlyChannelPoint {
  month: string
  'Organic Video': number
  'Paid Video': number
  'Paid Social': number
}

const COLORS: Record<string, string> = {
  'Organic Video': '#3fb950',
  'Paid Video': '#ff0033',
  'Paid Social': '#3ea6ff',
}

export default function MonthlyChannelChart({ data }: { data: MonthlyChannelPoint[] }) {
  return (
    <div className="bg-panel border border-border rounded-xl p-4">
      <h3 className="text-sm text-muted mb-1">Sessões no site por mês (GA4, propriedade BR) — 2026</h3>
      <p className="text-xs text-muted mb-3">
        Escala log não aplicada — repare que &quot;Paid Social&quot; opera em ordem de grandeza muito maior que os
        canais de YouTube. Fonte: GA4 530533972. Ver <code>docs/decisoes_metodologicas.md</code> sobre agregação.
      </p>
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={data} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#303030" vertical={false} />
          <XAxis dataKey="month" stroke="#aaaaaa" fontSize={12} tickLine={false} />
          <YAxis stroke="#aaaaaa" fontSize={12} tickLine={false} axisLine={false} width={64} />
          <Tooltip
            contentStyle={{ background: '#212121', border: '1px solid #303030', borderRadius: 8, color: '#fff' }}
            formatter={(value: number) => value.toLocaleString('pt-BR')}
          />
          <Legend />
          {(['Organic Video', 'Paid Video', 'Paid Social'] as const).map((key) => (
            <Line key={key} type="monotone" dataKey={key} stroke={COLORS[key]} strokeWidth={2} dot={false} isAnimationActive={false} />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
