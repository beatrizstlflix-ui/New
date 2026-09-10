# Status de vídeos e transcrições

Atualizado em 2026-09-10 (canal YouTube desbloqueado via chave de API própria —
ver `bloqueios_e_pedidos.md` itens 1-2).

## Inventário de vídeos
- **Inventário completo do canal público STLFLIX BR obtido**: 1.039 vídeos (de
  1.062 reportados pelo canal — a diferença provavelmente são vídeos não
  listados/privados, invisíveis à API pública sem OAuth). Fonte:
  `data/processed/youtube_video_inventory.json` (título, descrição, data de
  publicação, duração, formato, contagens vitalícias de views/likes/comentários,
  miniatura, URL, tags).
  - Shorts (≤60s): 676. Vídeos longos: 363. Lives: não diferenciadas ainda
    (precisa checar `liveBroadcastContent`/`liveStreamingDetails` — pendente).
- **Cruzamento com mídia paga**: dos 66 vídeos únicos usados em anúncios nos
  últimos 90 dias, 43 pertencem ao canal STLFLIX BR (confirmados no inventário),
  23 pertencem a outros canais/são não listados — ver
  `bloqueios_e_pedidos.md` item 9 (pergunta sobre escopo desses outros canais).
- Total inventariado (STLFLIX BR): 1.039.
- Total com transcrição **extraída**: 0 (texto ainda não baixado — ver abaixo).
- Total **confirmado com legenda automática disponível para extração**: 196 de
  198 testados (amostra parcial, ver abaixo).
- Total revisado: 0. Total analisado (taxonomia/narrativa): 0.

## Transcrição em escala — viabilidade confirmada, com limite de cota

**Testado nesta sessão, com resultado positivo e um limite técnico identificado:**

1. Endpoints públicos de terceiros (`video.google.com/timedtext`,
   `www.youtube.com/api/timedtext`) estão **bloqueados pela política de rede
   deste ambiente** (só `googleapis.com` é permitido). Isso não impede a
   transcrição — apenas descarta esse caminho específico.
2. **Caminho que funciona**: a API oficial `captions.list` (YouTube Data API v3)
   responde com a chave de API e revela as faixas de legenda reais de cada
   vídeo — **muito mais confiável que o campo `contentDetails.caption` do
   `videos.list`**, que indicou incorretamente "sem legenda" para praticamente
   todo o canal (999 de 1.039). Testado numa amostra de 198 vídeos processados
   em ordem cronológica antes de esgotar a cota diária: **196 (99%) têm legenda
   automática (ASR) em português "serving"** (pronta para uso).
3. **Limite encontrado**: `captions.list` custa **50 unidades de cota** por
   chamada (não 1, como a maioria dos endpoints) — a cota gratuita padrão é
   10.000 unidades/dia, ou seja, **~200 vídeos por dia** só para checar
   disponibilidade de legenda. Confirmamos isso batendo o erro real da API
   (`quotaExceeded`), não é suposição.
4. **Baixar o texto da legenda em si** (`captions.download`) exige OAuth (erro
   401 confirmado com a chave de API — "API keys are not supported by this
   API") e custa 200 unidades/download. Ou seja, mesmo resolvendo a cota, o
   texto só sai com OAuth — depende da mesma correção do bloqueio #1.

### Plano para cobertura completa (proposta, a validar com o usuário)
- **Opção A — mais rápida**: solicitar aumento de cota da YouTube Data API v3 no
  Google Cloud Console (gratuito, formulário de solicitação, aprovação em dias).
  Com cota maior, dá para checar e baixar legenda de todo o canal em poucas
  chamadas de sessão.
- **Opção B — sem pedir aumento**: continuar em lotes diários (~200
  vídeos/dia para checagem, menos ainda para download por causa das 200
  unidades/download), priorizando primeiro os vídeos de maior investimento em
  mídia paga e maior consumo orgânico (conforme pedido do usuário) — o processo
  já está com checkpoint em `data/raw/youtube/captions_list_by_video.json`,
  então não perde progresso entre sessões/dias.
- Em ambas as opções, o **download do texto em si** só funciona com OAuth
  (bloqueio #1) — a checagem de disponibilidade (o que já fizemos) não precisa.

**Não vou prometer 100% de cobertura de transcrição em uma sessão** — vou
reportar cobertura real a cada lote, como pedido.

## Bloqueios desta frente
Ver bloqueios #1, #9 e #10 em `bloqueios_e_pedidos.md`.
