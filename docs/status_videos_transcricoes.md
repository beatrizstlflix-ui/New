# Status de vídeos e transcrições

## Inventário de vídeos
- **Bloqueado no nível de canal** (item 1 de `bloqueios_e_pedidos.md`): sem YouTube
  Analytics/Data API funcionando para o canal certo, não temos a lista completa de
  vídeos do canal (orgânicos não usados em mídia paga ficam invisíveis).
- **Parcialmente reconstruído via Google Ads**: 67 vídeos únicos identificados como
  usados em campanhas de mídia paga nos últimos 90 dias (`video_channel_id` confirma
  pertencerem ao canal STLFLIX BR) — ver
  `data/processed/google_ads_video_summary_last90d.json`. Isso é uma amostra
  **enviesada para o que já foi promovido**, não o inventário completo do canal.
- Total inventariado: 67 (só os usados em ads, período 90d) de um total desconhecido
  no canal.
- Total com transcrição: 0.
- Total revisado: 0.
- Total analisado (taxonomia/narrativa): 0.

## Transcrição em escala — avaliação de viabilidade
**Ainda não testada nesta sessão.** Este ambiente não tem acesso a browser
interativo (Claude in Chrome não disponível aqui) nem a uma ferramenta dedicada de
transcrição/legendas do YouTube. Duas alternativas a testar antes de comprometer o
escopo completo de transcrição:
1. Endpoint público de legendas (`timedtext`) do YouTube para vídeos com legenda
   automática/manual disponível — requer teste de acesso de rede (permitido, dados
   públicos do próprio canal) e validação de formato/idioma.
2. Reautorizar o YouTube no Windsor.ai (item 1) pode, dependendo dos campos do
   conector, não incluir texto de legenda mesmo assim (o campo `video_has_captions`
   só indica existência, não o conteúdo) — a confirmar.

**Pendências**: testar caminho 1 assim que tivermos a lista real de vídeos (depende
do bloqueio 1 ou 2). Reportar cobertura real antes de prometer transcrição de 100%
dos vídeos.

## Bloqueios desta frente
Ver bloqueios #1 e #2 em `bloqueios_e_pedidos.md`.
