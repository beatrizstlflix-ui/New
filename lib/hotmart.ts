import { getHotmartAccessToken } from './hotmartAuth'

const SALES_HISTORY_URL = 'https://developers.hotmart.com/payments/api/v1/sales/history'

export interface HotmartSale {
  transaction: string
  productId: string
  productName: string
  status: string
  orderDate?: string
  approvedDate?: string
  currency: string
  value: number
  offerCode?: string
}

interface FetchSalesHistoryOptions {
  startDate: Date
  endDate: Date
  // "Aprovada + Completa", conforme pedido.
  transactionStatus?: string[]
}

const DEFAULT_TRANSACTION_STATUS = ['APPROVED', 'COMPLETE']

export async function fetchSalesHistory({
  startDate,
  endDate,
  transactionStatus = DEFAULT_TRANSACTION_STATUS,
}: FetchSalesHistoryOptions): Promise<HotmartSale[]> {
  const accessToken = await getHotmartAccessToken()
  const sales: HotmartSale[] = []
  let pageToken: string | undefined

  do {
    const url = new URL(SALES_HISTORY_URL)
    url.searchParams.set('start_date', String(startDate.getTime()))
    url.searchParams.set('end_date', String(endDate.getTime()))
    for (const status of transactionStatus) {
      url.searchParams.append('transaction_status', status)
    }
    if (pageToken) url.searchParams.set('page_token', pageToken)

    const res = await fetch(url.toString(), {
      headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
      cache: 'no-store',
    })

    if (!res.ok) {
      const body = await res.text()
      throw new Error(`Hotmart Sales API falhou (${res.status}): ${body} | URL: ${url.toString()}`)
    }

    const data = await res.json()
    const items: any[] = data.items ?? []

    for (const item of items) {
      const purchase = item.purchase ?? {}
      sales.push({
        transaction: purchase.transaction ?? '',
        productId: String(item.product?.id ?? ''),
        productName: item.product?.name ?? 'Desconhecido',
        status: purchase.status ?? '',
        orderDate: purchase.order_date ? new Date(purchase.order_date).toISOString() : undefined,
        approvedDate: purchase.approved_date ? new Date(purchase.approved_date).toISOString() : undefined,
        currency: purchase.price?.currency_value ?? '',
        value: Number(purchase.price?.value ?? 0),
        offerCode: purchase.offer?.code,
      })
    }

    pageToken = data.page_info?.next_page_token
  } while (pageToken)

  return sales
}

export interface HotmartProductBreakdown {
  productName: string
  units: number
  revenue: number
}

export interface HotmartCurrencySummary {
  currency: string
  netRevenue: number
  salesCount: number
  byProduct: HotmartProductBreakdown[]
}

// A mesma conta Hotmart vende em mais de uma moeda (ex.: R$ no publico BR,
// US$ no publico Global) — por isso o resumo e sempre quebrado por moeda,
// nunca somado junto (R$ 10 + US$ 10 nao e "20" de nada).
export function summarizeSales(sales: HotmartSale[]): HotmartCurrencySummary[] {
  const byCurrency = new Map<string, HotmartSale[]>()
  for (const sale of sales) {
    const key = sale.currency || 'DESCONHECIDA'
    const list = byCurrency.get(key) ?? []
    list.push(sale)
    byCurrency.set(key, list)
  }

  const summaries: HotmartCurrencySummary[] = []
  for (const [currency, currencySales] of byCurrency) {
    const byProductMap = new Map<string, HotmartProductBreakdown>()
    for (const sale of currencySales) {
      const entry = byProductMap.get(sale.productName) ?? { productName: sale.productName, units: 0, revenue: 0 }
      entry.units += 1
      entry.revenue += sale.value
      byProductMap.set(sale.productName, entry)
    }

    summaries.push({
      currency,
      netRevenue: currencySales.reduce((sum, s) => sum + s.value, 0),
      salesCount: currencySales.length,
      byProduct: Array.from(byProductMap.values()).sort((a, b) => b.revenue - a.revenue),
    })
  }

  return summaries.sort((a, b) => b.netRevenue - a.netRevenue)
}
