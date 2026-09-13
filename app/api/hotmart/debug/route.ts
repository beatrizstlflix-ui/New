import { NextResponse } from 'next/server'
import { getHotmartAccessToken, hasHotmartCredentials } from '@/lib/hotmartAuth'

export const dynamic = 'force-dynamic'

// Rota de diagnostico: chama a Sales API da Hotmart sem nenhum parametro
// de query alem do necessario, so pra isolar se o problema esta nos
// parametros (start_date/end_date/transaction_status) ou em outra coisa
// (escopo da credencial, autorizacao do produto, etc).
export async function GET() {
  if (!hasHotmartCredentials()) {
    return NextResponse.json({ error: 'Credenciais da Hotmart nao configuradas.' }, { status: 400 })
  }

  try {
    const accessToken = await getHotmartAccessToken()
    const res = await fetch('https://developers.hotmart.com/payments/api/v1/sales/history', {
      headers: { Authorization: `Bearer ${accessToken}` },
      cache: 'no-store',
    })
    const body = await res.text()
    let tokenClaims: unknown = null
    const parts = accessToken?.split('.') ?? []
    if (parts.length === 3) {
      try {
        const payload = parts[1].replace(/-/g, '+').replace(/_/g, '/')
        const padded = payload + '='.repeat((4 - (payload.length % 4)) % 4)
        tokenClaims = JSON.parse(Buffer.from(padded, 'base64').toString('utf-8'))
      } catch {
        tokenClaims = 'nao foi possivel decodificar (nao e um JWT padrao)'
      }
    }

    return NextResponse.json({
      status: res.status,
      body,
      tokenLength: accessToken?.length ?? 0,
      tokenClaims,
    })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? 'Erro desconhecido.' }, { status: 500 })
  }
}
