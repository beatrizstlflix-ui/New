'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export default function MediaPagaBarChart({
  data,
}: {
  data: Array<{ tipo: string; custo: number }>
}) {
  return (
    <div className="bg-panel border border-border rounded-xl p-4">
      <h3 className="text-sm text-muted mb-3">Investimento por tipo de campanha (últimos 90 dias, BRL)</h3>
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={data} layout="vertical" margin={{ top: 4, right: 16, left: 8, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#303030" horizontal={false} />
          <XAxis type="number" stroke="#aaaaaa" fontSize={12} tickLine={false} />
          <YAxis type="category" dataKey="tipo" stroke="#aaaaaa" fontSize={12} tickLine={false} width={140} />
          <Tooltip
            contentStyle={{ background: '#212121', border: '1px solid #303030', borderRadius: 8, color: '#fff' }}
            formatter={(value: number) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          />
          <Bar dataKey="custo" fill="#ff0033" radius={[0, 4, 4, 0]} isAnimationActive={false} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
