'use client'

const OPTIONS = [
  { value: 7, label: '7 dias' },
  { value: 28, label: '28 dias' },
  { value: 90, label: '90 dias' },
]

export default function RangeSelector({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="flex gap-1 bg-panel2 rounded-lg p-1">
      {OPTIONS.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
            value === opt.value ? 'bg-accent text-white' : 'text-muted hover:text-white'
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}
