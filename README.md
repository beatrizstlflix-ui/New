# STLFLIX BR — Dashboard Organico + Pago

Dashboard proprio (Next.js) com a visao dos dados do canal STLFLIX BR:
visualizacoes, tempo assistido, inscritos ganhos, origem do trafego
(organico x pago), os videos mais assistidos e, opcionalmente, o
desempenho de campanhas pagas no Google Ads.

Os dados vem diretamente da **YouTube Data API v3**, da
**YouTube Analytics API v2** e da **Google Ads API**, chamadas apenas no
servidor (rotas `app/api/*`). Nenhuma credencial e exposta ao navegador.

## Aviso de seguranca

Credenciais (refresh tokens, client secret, developer token e uma API key)
foram coladas em texto puro em conversas de chat durante o desenvolvimento
deste projeto. **Trate todas elas como comprometidas:**

1. Revogue o acesso OAuth em <https://myaccount.google.com/permissions>
   (procure pelos apps/projetos correspondentes ao YouTube e ao Google Ads).
2. Redefina (reset) o `client_secret` de cada credencial OAuth no
   [Google Cloud Console](https://console.cloud.google.com/apis/credentials).
3. Regenere a `YOUTUBE_API_KEY` no Cloud Console e restrinja-a por API
   (YouTube Data API v3) e, se possivel, por referenciador/IP.
4. Gere um novo `refresh_token` para cada integracao (passo a passo abaixo)
   e use apenas os novos valores.
5. Nunca cole client secrets, developer tokens ou refresh tokens em
   mensagens de chat, commits ou arquivos versionados. Este repositorio ja
   ignora `.env*` no `.gitignore`.

## Modos de operacao (YouTube)

O dashboard escolhe automaticamente o modo com base no que estiver
configurado em `.env.local`:

1. **OAuth completo** (`GOOGLE_CLIENT_ID` + `GOOGLE_CLIENT_SECRET` +
   `YOUTUBE_REFRESH_TOKEN`): todos os dados, incluindo tendencia diaria,
   origem do trafego e metricas por periodo (via YouTube Analytics API).
   Tem prioridade se estiver configurado.
2. **API key** (`YOUTUBE_API_KEY` + `YOUTUBE_CHANNEL_ID`): apenas
   estatisticas publicas e **vitalicias** (nao filtradas por periodo) do
   canal e dos videos, via YouTube Data API v3. Mais simples de configurar,
   mas sem tendencia diaria nem origem do trafego (isso exige OAuth).
3. **Demonstracao**: se nenhum dos dois acima estiver configurado, o
   dashboard mostra dados de exemplo (claramente identificados) so para
   visualizar a interface.

## Configuracao

### YouTube — modo simples (API key)

1. No [Google Cloud Console](https://console.cloud.google.com/apis/credentials),
   ative a **YouTube Data API v3** e crie uma credencial do tipo "Chave de
   API". Restrinja-a a essa API.
2. Pegue o ID do canal STLFLIX BR (comeca com `UC...`) em YouTube Studio >
   Configuracoes > Canal > Info basicas.
3. Preencha `YOUTUBE_API_KEY` e `YOUTUBE_CHANNEL_ID` no `.env.local`.

### YouTube — modo completo (OAuth)

1. No mesmo projeto, ative tambem a **YouTube Analytics API**.
2. Em "Tela de consentimento OAuth", adicione os escopos:
   - `https://www.googleapis.com/auth/youtube.readonly`
   - `https://www.googleapis.com/auth/yt-analytics.readonly`
3. Crie uma credencial "ID do cliente OAuth" do tipo **App da Web**, com
   `https://developers.google.com/oauthplayground` como URI de
   redirecionamento autorizado. Anote `client_id` e `client_secret`.
4. No [OAuth Playground](https://developers.google.com/oauthplayground):
   marque "Use your own OAuth credentials" (engrenagem), informe as
   credenciais, autorize os dois escopos acima **fazendo login com a conta
   que administra o canal STLFLIX BR** (confirme que o consentimento e dado
   para esse canal, nao um canal pessoal vazio) e troque o codigo pelo
   `refresh_token`.
5. Preencha `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` e
   `YOUTUBE_REFRESH_TOKEN` no `.env.local`.

### Google Ads (opcional — trafego pago)

1. Solicite/obtenha um **developer token** no
   [Google Ads API Center](https://ads.google.com/aw/apicenter) da conta
   gerenciadora.
2. Crie uma credencial OAuth "App da Web" com o escopo
   `https://www.googleapis.com/auth/adwords` e gere um `refresh_token` do
   mesmo jeito descrito acima (OAuth Playground), autenticando com uma
   conta que tenha acesso a conta STLFLIX Brasil.
3. Preencha no `.env.local`:
   - `GOOGLE_ADS_CLIENT_ID`, `GOOGLE_ADS_CLIENT_SECRET`
   - `GOOGLE_ADS_DEVELOPER_TOKEN`
   - `GOOGLE_ADS_REFRESH_TOKEN`
   - `GOOGLE_ADS_CUSTOMER_ID` (ID da conta STLFLIX Brasil, so digitos)
   - `GOOGLE_ADS_LOGIN_CUSTOMER_ID` (ID da conta gerenciadora/MCC, so
     digitos) — necessario quando a conta e acessada via MCC.

### Rodar localmente

```bash
npm install
npm run dev
```

Acesse <http://localhost:3000>.

## Deploy

Ao publicar (Vercel, etc.), configure as mesmas variaveis de ambiente nas
configuracoes do projeto na plataforma de deploy — nunca no codigo.

## Dependencias e seguranca

`npm audit` reporta 2 vulnerabilidades "high" herdadas do proprio pacote
`next@14.2.x` (e do `postcss` interno que ele empacota), corrigidas apenas na
major seguinte (Next 16). Nao ha correcao dentro da linha 14.x no momento
deste commit. Antes de expor este dashboard publicamente, avalie migrar para
Next 15/16 (`npm audit fix --force`, com testes de regressao) ou mante-lo
atras de autenticacao/rede privada.

## Estrutura

- `app/api/dashboard/route.ts` — escolhe o modo do YouTube (oauth/api_key/
  demo), orquestra as chamadas ao Google e devolve um payload agregado.
- `lib/googleOAuth.ts` — troca generica de refresh_token por access_token
  (cacheada em memoria por token).
- `lib/googleAuth.ts` / `lib/youtube.ts` — modo OAuth do YouTube (Analytics
  API + Data API).
- `lib/youtubePublic.ts` — modo API key do YouTube (somente Data API,
  estatisticas publicas/vitalicias).
- `lib/googleAdsAuth.ts` / `lib/googleAds.ts` — integracao com a Google Ads
  API (trafego pago).
- `lib/organic.ts` — classifica cada fonte de trafego do YouTube como
  organica ou paga.
- `lib/demoData.ts` — dados de exemplo usados quando nada esta configurado.
- `app/page.tsx` + `components/*` — interface do dashboard.
- `lib/hotmartAuth.ts` — troca client_id/client_secret/basic token por um
  access_token da Hotmart (OAuth2 client_credentials, cacheado em memoria).
- `lib/hotmart.ts` — busca o historico de vendas na Sales API da Hotmart e
  resume por moeda (a mesma conta pode vender em R$ e US$ ao mesmo tempo).
- `app/api/hotmart/route.ts` — endpoint de teste (`/api/hotmart`, aceita
  `start_date`/`end_date`) que expõe esse resumo.

### Hotmart (receita/vendas)

Requer `HOTMART_CLIENT_ID`, `HOTMART_CLIENT_SECRET` e `HOTMART_BASIC_TOKEN`
(gerados em Hotmart Developers > Credenciais > Criar credencial > "API
Hotmart"). Veja `.env.example`.
