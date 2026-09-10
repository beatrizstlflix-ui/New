# Plano de execução

## Fase 0 — Descoberta (concluída em 2026-09-10)
Inventário de fontes, confirmação de contas/propriedades, primeiro pull real de
Google Ads e GA4, identificação do bloqueio crítico do YouTube.

## Fase 1 — Fundação de dados + diagnóstico inicial (em andamento)
1. Resolver ou contornar o bloqueio do YouTube (depende do usuário).
2. Aprofundar Google Ads: datas de campanha, orçamento, públicos, exclusões,
   comparação com BF25.
3. Aprofundar GA4: landing pages, funil de e-commerce, `customevent_vsl_seconds`.
4. Montar inventário completo de vídeos (canal + ads) assim que o YouTube estiver
   liberado.
5. Testar viabilidade de transcrição em escala; se viável, priorizar os vídeos de
   maior investimento/consumo primeiro (sem reduzir o escopo final combinado com o
   usuário).
6. Construir o dashboard Next.js lendo dados estáticos tratados (`data/processed`),
   cobrindo primeiro as áreas não bloqueadas (mídia paga, preparação BF com o que
   já temos, mensuração/plano de ação) e sinalizando claramente as áreas pendentes
   (orgânico, retenção, parte da audiência).
7. Responder as 20 perguntas obrigatórias com o que já é possível, marcando
   claramente respostas parciais/pendentes.

## Fase 2 — Aprofundamento (após respostas do usuário aos bloqueios)
8. Taxonomia de narrativas cruzada com desempenho (depende de transcrições/inspeção
   de vídeo).
9. Análise de comentários (se acessível e dentro do escopo).
10. Cenários de projeção para Black Friday (depende de meta/investimento
    confirmados).
11. Auditoria completa de públicos de remarketing (nome, regra, tamanho, expiração).

## Fase 3 — Validação e entrega
12. Checklist de validação técnica (`docs/instrucoes_execucao.md`).
13. Resumo executivo final + plano de ação priorizado + registro de lacunas.

## Checkpoints já registrados
- 2026-09-10: Fase 0 concluída, achados iniciais de Google Ads/GA4, bloqueio crítico
  de YouTube identificado e comunicado ao usuário.
