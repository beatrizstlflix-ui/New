# STLFLIX BR — Dashboard Organico do YouTube Studio

Dashboard proprio (Next.js) com a visao dos dados **organicos** do canal
STLFLIX BR: visualizacoes, tempo assistido, inscritos ganhos, origem do
trafego (organico x pago) e os videos mais assistidos no periodo.

Os dados vem diretamente da **YouTube Data API v3** e da
**YouTube Analytics API v2** do Google, chamadas apenas no servidor
(rotas `app/api/*`). Nenhuma credencial e exposta ao navegador.

## Aviso de seguranca

Um `refresh_token` foi colado em texto puro em uma conversa de chat durante
o desenvolvimento deste projeto. **Trate esse token como comprometido:**

1. Revogue o acesso em <https://myaccount.google.com/permissions> (procure
   pelo app/projeto OAuth correspondente).
2. Gere um novo `refresh_token` (passo a passo abaixo) e use apenas esse
   novo valor.
3. Nunca cole client secrets ou tokens em mensagens de chat, commits ou
   arquivos versionados. Este repositorio ja ignora `.env*` no `.gitignore`.

## Configuracao

### 1. Credenciais OAuth (Google Cloud Console)

1. Crie/abra um projeto em <https://console.cloud.google.com/>.
2. Ative as APIs **YouTube Data API v3** e **YouTube Analytics API**.
3. Em "Tela de consentimento OAuth", adicione os escopos:
   - `https://www.googleapis.com/auth/youtube.readonly`
   - `https://www.googleapis.com/auth/yt-analytics.readonly`
4. Crie uma credencial "ID do cliente OAuth" do tipo **App da Web**, com
   `https://developers.google.com/oauthplayground` como URI de redirecionamento
   autorizado (para gerar o refresh token). Anote o `client_id` e o
   `client_secret`.

### 2. Gerar o refresh_token do canal correto

Use o [OAuth Playground](https://developers.google.com/oauthplayground):

1. No icone de engrenagem (canto superior direito), marque "Use your own
   OAuth credentials" e informe seu `client_id`/`client_secret`.
2. Em "Step 1", selecione os escopos do YouTube listados acima e clique em
   "Authorize APIs".
3. **Importante:** faca login com a conta Google que administra o canal
   **STLFLIX BR**. Se essa conta gerencia varios canais/Brand Accounts,
   confirme que o consentimento e dado para o canal STLFLIX BR (nao um
   canal pessoal vazio).
4. Em "Step 2", clique em "Exchange authorization code for tokens" e copie
   o `refresh_token` gerado.

### 3. Variaveis de ambiente

Copie `.env.example` para `.env.local` e preencha:

```
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
YOUTUBE_REFRESH_TOKEN=...
YOUTUBE_CHANNEL_ID=   # opcional, se a conta tiver mais de um canal
```

Se a conta autenticada gerenciar mais de um canal, descubra o ID do canal
STLFLIX BR (comeca com `UC...`) em YouTube Studio > Configuracoes > Canal >
Info basicas, e preencha `YOUTUBE_CHANNEL_ID`.

### 4. Rodar localmente

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

- `app/api/dashboard/route.ts` — orquestra as chamadas ao Google e devolve
  um payload agregado (totais, serie diaria, origem do trafego, top videos).
- `lib/googleAuth.ts` — troca o refresh_token por um access_token de curta
  duracao (cacheado em memoria).
- `lib/youtube.ts` — chamadas a YouTube Analytics API e YouTube Data API.
- `lib/organic.ts` — classifica cada fonte de trafego como organica ou paga.
- `app/page.tsx` + `components/*` — interface do dashboard.
