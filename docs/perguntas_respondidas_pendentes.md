# Perguntas obrigatórias — status em 2026-09-10

> ⚠️ **Versão superada.** Após a coleta de YouTube Analytics real (YouTube
> Studio), várias respostas abaixo mudaram de confiança/conclusão. A versão
> atualizada e completa das 20 perguntas está em `docs/resumo_executivo.md`
> (revisão 2). Este arquivo fica só como registro histórico do status antes
> dessa coleta.

Legenda: 🟢 respondida com evidência · 🟡 parcialmente respondida · 🔴 pendente (bloqueio)

1. 🟡 Estamos construindo uma base útil para a BF? — Indícios mistos: mídia paga de
   YouTube gera engajamento (follow-on views, inscrições) mas quase não gera
   sessões no site (GA4 "Paid Video" ~130-200 sessões/mês vs. investimento
   relevante) nem leads identificados (evento de lead nunca dispara). Falta o lado
   orgânico (bloqueado) para conclusão completa.
2. 🟡 O que significa "base útil" aqui? — Definido em `dicionario_metricas.md`;
   evidência de cada camada ainda incompleta sem YouTube.
3. 🔴 Evolução observável no orgânico — bloqueado (YouTube).
4. 🟢 Contribuição atribuída à mídia pelas plataformas — Google Ads atribui volume
   relevante de `youtube_follow_on_views`/`youtube_channel_subscriptions` a
   campanhas VIDEO; GA4 mostra contribuição mínima de sessões/purchases pelo canal
   "Paid Video". Ver `registro_extracoes.md` #4-6, #7.
5. 🔴 Efeito incremental vs. associação — sem experimento controlado; só temos
   associação temporal por ora. Proposta de teste a desenhar na Fase 2.
6. 🔴 Pessoas novas vs. repetição de exposição — depende do YouTube (frequência,
   alcance único) — bloqueado.
7. 🟡 Assistem outros vídeos após o anúncio? — sim, mensurado via
   `youtube_follow_on_views` (Google Ads), mas é um evento agregado, não
   identifica se é o mesmo vídeo/canal ou conteúdo relacionado — detalhe adicional
   pendente.
8. 🔴 Audiência volta ao canal? — bloqueado (YouTube recorrência).
9-13. 🔴 Diagnóstico de conteúdo/narrativas — bloqueado (transcrição/taxonomia
   pendente, e inventário de vídeos parcial).
14. 🟡 Continuidade anúncio→canal→site→oferta — GA4 mostra que "Paid Video" quase
    não chega ao site; a etapa anúncio→canal existe (follow-on views); canal→site
    não tem sinal claro ainda.
15-16. 🔴 Público reimpactável hoje / elegibilidade até a BF — depende de auditoria
   de listas de remarketing (Fase 2).
17. 🟢 (parcial, negativo) Leads identificados ou só audiência de plataforma? —
   Evidência forte: eventos de lead no GA4 nunca dispararam em 20 meses. Só
   `purchase` está instrumentado. Ver bloqueio #3.
18. 🟡 Gargalos na preparação comercial — pelo menos 2 confirmados: (a) sem captura
   de lead identificável fora da compra; (b) mídia de YouTube gera engajamento na
   plataforma mas não tráfego relevante ao site.
19. 🔴 Manter/ampliar/corrigir/testar/interromper — recomendações preliminares
   virão após inventário de vídeos e YouTube liberado.
20. 🟢 O que não conseguimos concluir e como resolver — ver `bloqueios_e_pedidos.md`
    (lista completa e específica).
