'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export default function CadenceChart({ data }: { data: Array<{ month: string; videos: number }> }) {
  return (
    <div className="bg-panel border border-border rounded-xl p-4">
      <h3 className="text-sm text-muted mb-3">Publicações por mês (canal STLFLIX BR, vitalício)</h3>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} margin={{ top: 4, right: 8, left: 0, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#303030" vertical={false} />
          <XAxis dataKey="month" stroke="#aaaaaa" fontSize={9} tickLine={false} angle={-60} textAnchor="end" interval={2} />
          <YAxis stroke="#aaaaaa" fontSize={12} tickLine={false} axisLine={false} width={32} />
          <Tooltip
            contentStyle={{ background: '#212121', border: '1px solid #303030', borderRadius: 8, color: '#fff' }}
            formatter={(value: number) => [value, 'Vídeos publicados']}
          />
          <Bar dataKey="videos" fill="#3ea6ff" radius={[3, 3, 0, 0]} isAnimationActive={false} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
