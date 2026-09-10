'use client'

import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

export default function SubscribersMonthlyChart({
  data,
}: {
  data: Array<{ month: string; gained: number; lost: number; net: number }>
}) {
  return (
    <div className="bg-panel border border-border rounded-xl p-4">
      <h3 className="text-sm text-muted mb-3">Inscritos por mês — 2026 (ganhos, perdas, líquido)</h3>
      <ResponsiveContainer width="100%" height={260}>
        <ComposedChart data={data} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#303030" vertical={false} />
          <XAxis dataKey="month" stroke="#aaaaaa" fontSize={10} tickLine={false} />
          <YAxis stroke="#aaaaaa" fontSize={12} tickLine={false} axisLine={false} width={56} />
          <Tooltip contentStyle={{ background: '#212121', border: '1px solid #303030', borderRadius: 8, color: '#fff' }} />
          <Legend />
          <Bar dataKey="gained" name="Ganhos" fill="#3fb950" radius={[3, 3, 0, 0]} isAnimationActive={false} />
          <Bar dataKey="lost" name="Perdidos" fill="#f85149" radius={[3, 3, 0, 0]} isAnimationActive={false} />
          <Line type="monotone" dataKey="net" name="Líquido" stroke="#3ea6ff" strokeWidth={2} dot isAnimationActive={false} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}
