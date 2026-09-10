# Resumo executivo — Auditoria YouTube STLFLIX Brasil rumo à Black Friday 2026

Gerado em 2026-09-10. Baseado em dados reais extraídos de Google Ads (conta
"STLFLIX Brasil", 445-144-0907), GA4 (propriedade "LP - AMBIENTE BR",
530533972) e YouTube Data API v3 (canal STLFLIX BR, `UCb3H1VIsLk9l6xAz6eyyLwQ`).
Ver `docs/registro_extracoes.md` para a proveniência exata de cada número.

## A pergunta que abre este relatório

**Estamos construindo uma base para a Black Friday?**

Resposta honesta: **parcialmente, e não sabemos ainda a parte mais importante.**

O que conseguimos comprovar: a mídia paga em vídeo do YouTube (R$ 77.479 dos
R$ 129.617 investidos nos últimos 90 dias) produz engajamento real **dentro da
plataforma** — 87.432 visualizações subsequentes e 3.053 inscrições atribuídas —
mas isso não se traduz em tráfego qualificado no site: o canal "Paid Video" do
GA4 trouxe apenas 526 sessões, 0 checkouts e 0 compras em 90 dias. Não existe,
hoje, nenhum mecanismo de captura de lead funcionando (os eventos configurados
para isso nunca dispararam em 20 meses). A única base própria identificável é
uma lista de 30 mil contatos carregada manualmente no Google Ads em algum
momento, de origem ainda não confirmada.

O que **não** conseguimos comprovar ainda: tudo que depende do YouTube
Analytics — se a audiência orgânica está crescendo, se as pessoas voltam ao
canal, se há recorrência real. Isso é a lacuna mais importante do diagnóstico e
depende de uma correção de acesso que já foi solicitada (ver
`bloqueios_e_pedidos.md`, item 1).

**O que mudaria esta conclusão**: acesso ao YouTube Analytics (tráfego por
período, retenção, recorrência) e uma resposta sobre a origem/atualização da
lista de CRM de 30 mil contatos.

---

## As 20 perguntas obrigatórias

Legenda de confiança: 🟢 alta (dado direto, período claro) · 🟡 média (dado
parcial ou indireto) · 🔴 baixa/sem dado (bloqueado).

### 1. Estamos construindo uma base útil para a Black Friday?
- **Conclusão**: parcialmente — engajamento de plataforma cresce, tráfego
  qualificado e leads identificáveis não.
- **Dados**: mídia paga em vídeo (90d): 87.432 follow-on views, 3.053
  inscrições atribuídas (Google Ads) vs. 526 sessões / 0 compras via "Paid
  Video" (GA4, mesmo período).
- **Período/Fonte**: 2026-06-12 a 2026-09-09, Google Ads + GA4.
- **Confiança**: 🟡 média (falta o lado orgânico do YouTube).
- **Limitação**: sem dados de recorrência/retenção do canal.
- **Implicação prática**: não dá para afirmar que a base está "pronta" para a
  BF — o que existe é audiência de plataforma, não uma base acionável.
- **Ação recomendada**: resolver bloqueio do YouTube Analytics antes de
  qualquer decisão de aumentar investimento em vídeo.

### 2. O que significa "base útil" neste negócio e quais evidências temos?
- **Conclusão**: definimos "base útil" como a combinação de (a) audiência
  recorrente real, (b) leads identificáveis e contatáveis, (c) públicos
  elegíveis para remarketing com janela viva até a BF. Hoje só temos evidência
  parcial de (c) — 18 listas de remarketing reais auditadas (`docs/
  auditoria_publicos_remarketing.md`) — e nenhuma evidência de (a) ou (b).
- **Fonte**: Google Ads (públicos), GA4 (eventos de lead ausentes).
- **Confiança**: 🟡 média.
- **Ação recomendada**: instrumentar um evento real de captura de lead antes
  de reportar "base útil" como conquistada.

### 3. Qual evolução é observável no orgânico?
- **Conclusão**: não respondível com granularidade temporal. Temos apenas o
  retrato vitalício (83.400 inscritos, 24,86 milhões de views, 1.039 vídeos)
  e a cadência de publicação por mês (`data/processed/youtube_organic_
  summary.json`), que mostra publicação ativa e contínua desde 2023, com pico
  recente em jul/2026 (61 vídeos).
- **Confiança**: 🔴 baixa para "evolução" no sentido de tendência de
  audiência; 🟢 alta para cadência de publicação.
- **Limitação**: sem YouTube Analytics, não sabemos se as views recentes são
  maiores ou menores que as de meses atrás.
- **Ação recomendada**: bloqueio #1.

### 4. Qual contribuição é atribuída à mídia pelas plataformas?
- **Conclusão**: Google Ads atribui 87.432 follow-on views e 3.053 inscrições
  a campanhas de vídeo (90d); a maior campanha isolada
  (`Pmax_Fundo-de-Funil_Vendas_Oferta-Anual`) reporta R$ 463.061 em valor de
  conversão no mesmo período — mas essa cifra diverge fortemente do que o GA4
  mostra para o canal onde a Pmax tende a cair (R$ 97.101 em "Cross-network").
- **Fonte**: Google Ads (discriminação por ação de conversão).
- **Confiança**: 🟢 alta (dado direto), mas 🟡 para o valor de conversão em si
  (ver divergência).
- **Ação recomendada**: investigar a divergência antes de decidir orçamento
  com base no `conversions_value` da Pmax.

### 5. Há evidência de efeito incremental da mídia ou apenas associação?
- **Conclusão**: apenas associação temporal. Não existe experimento com grupo
  de controle nesta conta.
- **Confiança**: 🔴 (não é possível responder sem desenho experimental).
- **Ação recomendada**: desenhar um teste holdout geográfico ou de audiência
  (ex.: pausar campanhas de vídeo em uma fração de público por 2-4 semanas e
  comparar follow-on views/inscrições/compras contra o grupo exposto).

### 6. Estamos alcançando pessoas novas ou repetindo exposição?
- **Conclusão**: não respondível sem YouTube Analytics (frequência, alcance
  único). O GA4 mostra "newusers" por canal (ex.: 256 usuários novos via "Paid
  Video" em 28 dias, de 273 sessões — quase todo mundo é "novo" nessa métrica,
  mas isso mede sessão no site, não frequência de exposição ao anúncio).
- **Confiança**: 🔴.
- **Ação recomendada**: bloqueio #1.

### 7. As pessoas assistem a outros vídeos depois de ver nossos anúncios?
- **Conclusão**: sim, de forma mensurável — 87.432 "follow-on views"
  atribuídos pelo Google Ads em 90 dias. É um evento agregado (não identifica
  qual vídeo seguinte).
- **Fonte**: Google Ads, campanhas VIDEO/DEMAND_GEN.
- **Confiança**: 🟢 alta para o fato, 🟡 para o detalhe (qual conteúdo).
- **Ação recomendada**: nenhuma ação imediata — é um sinal positivo de
  continuidade, mas não prova intenção comercial.

### 8. A audiência volta ao canal?
- **Conclusão**: não respondível sem YouTube Analytics.
- **Confiança**: 🔴.
- **Ação recomendada**: bloqueio #1.

### 9-13. Quais conteúdos atraem/retêm/geram ação; narrativas por etapa; campanhas fracas; vídeos para teste
- **Conclusão parcial**: os vídeos de maior audiência vitalícia são majoritariamente
  Shorts de dicas técnicas ("TIPS..."), não os vídeos de case/depoimento usados
  em mídia paga. O maior vídeo longo do catálogo por views vitalícias
  ("R$20 Mil/Mês vendendo impressão 3d e travou", 566.595 views) já é da mesma
  série usada em campanhas pagas — ou seja, **há pelo menos um caso concreto de
  vídeo orgânico forte que também é usado em mídia paga**, respondendo em parte
  à pergunta 13.
- **Fonte**: `data/processed/youtube_organic_summary.json` (top vídeos) cruzado
  com `data/processed/google_ads_video_summary_last90d.json`.
- **Confiança**: 🟡 média — falta retenção/CTR de impressão para diagnóstico
  completo de "por que" cada vídeo funciona.
- **Limitação**: taxonomia de narrativas e análise de conteúdo (falado/mostrado)
  ainda não feitas — dependem de transcrição (viável, ver `status_videos_
  transcricoes.md`, pendente de cota de API).
- **Ação recomendada**: priorizar a transcrição dos vídeos "TIPS" de maior
  audiência e da série "Como Vender Impressão 3D" para taxonomia completa.

### 14. Existe continuidade entre anúncio, canal, site e oferta?
- **Conclusão**: parcialmente. Anúncio → canal (follow-on views/inscrições)
  está comprovado. Canal/anúncio → site está fraco (526 sessões via Paid
  Video em 90d). Site → oferta está claro nas landing pages reais (`/lote-
  especial`, `/assine`, `/aniversario-stlflix-4-anos`).
- **Confiança**: 🟡.
- **Ação recomendada**: investigar por que o engajamento no YouTube não chega
  ao site — pode ser falta de CTA/link claro nos vídeos, ou pode ser que o
  objetivo real dessas campanhas seja reconhecimento de marca, não tráfego
  (nome das campanhas sugere isso: "vídeo-reconhecimento").

### 15-16. Qual público podemos reimpactar hoje / quanto continua elegível até a BF?
- **Conclusão**: auditoria completa em `docs/auditoria_publicos_remarketing.md`.
  Maior público: visualizadores de vídeo do YouTube (até 6 milhões em janela de
  180 dias) — mas é audiência de plataforma, não leads. Menor risco de
  expiração: listas com janela de 1.080+ dias (~3 anos). Maior risco: listas de
  30-120 dias que precisam de atividade contínua até novembro.
- **Confiança**: 🟢 alta para o retrato atual, 🔴 para projeção (sem histórico
  de evolução).
- **Ação recomendada**: não presumir que os tamanhos atuais estarão
  disponíveis em novembro sem manter o fluxo de tráfego/visualizações.

### 17. Estamos formando leads identificados ou apenas audiência de plataforma?
- **Conclusão**: **apenas audiência de plataforma, com uma exceção pontual.**
  Os eventos de lead do GA4 nunca dispararam em 20 meses. A exceção é a lista
  CRM_BASED "ALL_Clientes [Outubro]" (30 mil contatos) no Google Ads — prova
  que existe (ou existiu) uma base própria em algum sistema, mas não sabemos
  se está sendo atualizada.
- **Fonte**: GA4 (ausência de eventos), Google Ads (público CRM).
- **Confiança**: 🟢 alta.
- **Ação recomendada**: esta é a resposta mais importante e mais acionável do
  relatório — sem captura de lead ativa, toda a audiência gerada por mídia
  paga se perde quando a pessoa sai da plataforma. Priorizar instrumentar
  captura de lead (formulário, WhatsApp, lista de espera) antes da BF.

### 18. Quais gargalos limitam a preparação comercial?
- **Conclusão**: dois gargalos principais, ambos comprovados: (a) ausência de
  captura de lead identificável; (b) mídia de vídeo do YouTube gera
  engajamento de plataforma mas não tráfego relevante ao site.
- **Confiança**: 🟢 alta.
- **Ação recomendada**: ver seção de recomendações.

### 19. O que devemos manter, ampliar, corrigir, testar ou interromper?
- Ver `docs/plano_execucao.md` (Fase 2) e recomendações abaixo — decisão final
  depende de reconciliar a divergência Ads×GA4 e confirmar meta/investimento
  de BF26.

### 20. O que ainda não conseguimos concluir e como resolver?
- Lista completa e específica em `docs/bloqueios_e_pedidos.md` (12 itens,
  atualizados conforme resolvidos). Os três que mais travam decisão: YouTube
  Analytics (item 1), captura de lead (item 3/12), Meta Ads não conectado
  (item 4).

---

## Prioridades imediatas (resumo)
1. Resolver acesso ao YouTube Analytics (bloqueio #1) — maior lacuna do
   diagnóstico.
2. Decidir sobre captura de lead antes da BF (achado #17 — o gargalo mais
   crítico e mais acionável).
3. Confirmar meta comercial e investimento planejado para BF26 (bloqueio #6).
4. Investigar a divergência de valor de conversão Ads×GA4 antes de qualquer
   decisão de aumento de orçamento na campanha Pmax de fundo de funil.

## Grau de confiança geral deste resumo
🟡 **Médio.** As conclusões sobre mídia paga, públicos de remarketing e
produtos são sólidas (dados diretos, período claro). As conclusões sobre
orgânico, retenção e recorrência são as mais fracas do relatório porque
dependem de um acesso ainda bloqueado — tratá-las como hipóteses a confirmar,
não como fato estabelecido.
