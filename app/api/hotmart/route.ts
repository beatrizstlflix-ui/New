import { NextRequest, NextResponse } from 'next/server'
import { hasHotmartCredentials } from '@/lib/hotmartAuth'
import { fetchSalesHistory, summarizeSales } from '@/lib/hotmart'

export const dynamic = 'force-dynamic'

function parseDateParam(value: string | null, fallback: Date): Date {
  if (!value) return fallback
  const parsed = new Date(`${value}T00:00:00.000Z`)
  return isNaN(parsed.getTime()) ? fallback : parsed
}

export async function GET(req: NextRequest) {
  if (!hasHotmartCredentials()) {
    return NextResponse.json(
      { error: 'Credenciais da Hotmart nao configuradas (HOTMART_CLIENT_ID/SECRET/BASIC_TOKEN em .env.local).' },
      { status: 400 }
    )
  }

  try {
    const now = new Date()
    const defaultStart = new Date(now)
    defaultStart.setUTCDate(defaultStart.getUTCDate() - 1)
    defaultStart.setUTCHours(0, 0, 0, 0)
    // Nunca manda um end_date no futuro (a Hotmart rejeita).
    const defaultEnd = now

    const startDate = parseDateParam(req.nextUrl.searchParams.get('start_date'), defaultStart)
    const endDate = parseDateParam(req.nextUrl.searchParams.get('end_date'), defaultEnd)

    const sales = await fetchSalesHistory({ startDate, endDate })
    const summaryByCurrency = summarizeSales(sales)

    return NextResponse.json({
      range: { start: startDate.toISOString(), end: endDate.toISOString() },
      summaryByCurrency,
      sales,
    })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? 'Erro desconhecido ao consultar a Hotmart.' }, { status: 500 })
  }
}
