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
  // Se omitido, a propria API da Hotmart retorna apenas status
  // APPROVED + COMPLETE (equivalente a "Aprovada + Completa").
  transactionStatus?: string[]
  maxResults?: number
}

export async function fetchSalesHistory({
  startDate,
  endDate,
  transactionStatus,
  maxResults = 500,
}: FetchSalesHistoryOptions): Promise<HotmartSale[]> {
  const accessToken = await getHotmartAccessToken()
  const sales: HotmartSale[] = []
  let pageToken: string | undefined

  do {
    const url = new URL(SALES_HISTORY_URL)
    url.searchParams.set('start_date', String(startDate.getTime()))
    url.searchParams.set('end_date', String(endDate.getTime()))
    url.searchParams.set('max_results', String(maxResults))
    for (const status of transactionStatus ?? []) {
      url.searchParams.append('transaction_status', status)
    }
    if (pageToken) url.searchParams.set('page_token', pageToken)

    const res = await fetch(url.toString(), {
      headers: { Authorization: `Bearer ${accessToken}` },
      cache: 'no-store',
    })

    if (!res.ok) {
      const body = await res.text()
      throw new Error(`Hotmart Sales API falhou (${res.status}): ${body}`)
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

export interface HotmartSummary {
  netRevenue: number
  currency: string
  salesCount: number
  byProduct: HotmartProductBreakdown[]
}

export function summarizeSales(sales: HotmartSale[]): HotmartSummary {
  const currency = sales.find((s) => s.currency)?.currency ?? ''
  const byProductMap = new Map<string, HotmartProductBreakdown>()

  for (const sale of sales) {
    const entry = byProductMap.get(sale.productName) ?? { productName: sale.productName, units: 0, revenue: 0 }
    entry.units += 1
    entry.revenue += sale.value
    byProductMap.set(sale.productName, entry)
  }

  return {
    netRevenue: sales.reduce((sum, s) => sum + s.value, 0),
    currency,
    salesCount: sales.length,
    byProduct: Array.from(byProductMap.values()).sort((a, b) => b.revenue - a.revenue),
  }
}
