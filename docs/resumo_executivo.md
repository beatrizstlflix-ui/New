# Resumo executivo — Auditoria YouTube STLFLIX Brasil rumo à Black Friday 2026

Atualizado em 2026-09-10 (revisão 2 — incorpora YouTube Analytics real, coletado
via YouTube Studio). Baseado em dados reais de Google Ads (conta "STLFLIX
Brasil", 445-144-0907), GA4 (propriedade "LP - AMBIENTE BR", 530533972) e
YouTube (canal `UCb3H1VIsLk9l6xAz6eyyLwQ`, Data API v3 + Studio). Ver
`docs/registro_extracoes.md` para a proveniência exata de cada número.

## A pergunta que abre este relatório

**Estamos construindo uma base para a Black Friday?**

Resposta: **sim, no orgânico — e a mídia paga está numa transição saudável,
mas a captura de lead continua sendo o elo que falta.**

**O que mudou nesta revisão**: com o YouTube Analytics real em mãos, o quadro
é mais positivo do que a versão anterior deste resumo (que só tinha Google
Ads + GA4). Três achados centrais:

1. **A dependência de mídia paga está caindo, e isso é bom sinal**: na Black
   Friday de 2025, 89,8% das visualizações vinham de anúncios do YouTube. No
   acumulado de 2026 (YTD), caiu para 70,9%. Nos últimos 28 dias, 55,1%. O
   orgânico (busca, navegação, sugeridos) está crescendo em participação — e
   é o tráfego que mais retém (vídeos sugeridos têm duração média de 11-13
   minutos, contra 1-2 minutos do tráfego pago).
2. **Conteúdo longo e lives constroem a base; Shorts constroem alcance**:
   nos últimos 90 dias, vídeos longos + lives geraram ~86% dos novos
   inscritos, contra 4,1% dos Shorts — apesar dos Shorts dominarem em volume
   de visualizações. A live de aniversário do canal gerou sozinha +4.887
   inscritos em um dia.
3. **Espectadores recorrentes seguram o canal**: em todos os períodos
   analisados, quem já assistiu antes responde por 66-71% do tempo total
   assistido (assistindo em média 2x mais que espectadores novos), mesmo
   sendo minoria em número de visualizações.

**O que ainda preocupa**: na Black Friday de 2025, a mídia paga trouxe 62,3%
de público novo, mas com duração média de apenas 1:11 — ou seja, trouxe muita
gente "fria" que mal assistiu ao vídeo. E continua não existindo nenhum
mecanismo de captura de lead identificável fora da compra direta (achado
já registrado, não mudou nesta revisão).

**O que mudaria esta conclusão daqui pra frente**: nada crítico está mais
bloqueado para o diagnóstico central. O que falta é comercial/estratégico:
meta e investimento planejado para BF26, e uma decisão sobre instrumentar
captura de lead.

---

## As 20 perguntas obrigatórias (revisão 2)

Legenda: 🟢 alta confiança · 🟡 média · 🔴 baixa/sem dado.

### 1. Estamos construindo uma base útil para a Black Friday?
- **Conclusão**: sim, no sentido de audiência e recorrência — o orgânico
  cresce, retém e converte em inscritos; a base de remarketing existe e é
  grande. **Não** no sentido de leads identificáveis fora da plataforma.
- **Dados**: dependência de mídia caindo (89,8%→70,9%→55,1%); recorrentes
  seguram 66-71% do tempo assistido em todos os períodos; conteúdo longo gera
  86% dos novos inscritos.
- **Fonte**: YouTube Studio (5 períodos), coletado 2026-09-10.
- **Confiança**: 🟢 alta para audiência/orgânico; 🔴 para leads (não mudou).
- **Ação recomendada**: usar o orgânico como motor principal de aquecimento
  pré-BF; resolver captura de lead em paralelo.

### 2. O que significa "base útil" e quais evidências temos?
- **Conclusão**: agora temos evidência real de (a) audiência recorrente —
  comprovada (66-71% do tempo); (b) públicos de remarketing — comprovado
  (`auditoria_publicos_remarketing.md`); (c) leads identificáveis — ainda não
  comprovado.
- **Confiança**: 🟢 para (a) e (b), 🔴 para (c).

### 3. Qual evolução é observável no orgânico?
- **Conclusão**: crescimento forte de jan a jul/2026 (inscritos líquidos
  passando de +2.904/mês para +11.898/mês, pico em julho puxado pela live de
  aniversário), esfriando em ago (+5.760) e set (+1.621 parcial). Mix de
  conteúdo mudou de Shorts-dominante (58,5% das views no YTD) para
  vídeo-longo-dominante nas últimas 4 semanas (79,7% das views).
- **Fonte**: `data/processed/youtube_studio_analytics.json`
  (`subscribers_monthly_2026`, `content_type_engagement`).
- **Confiança**: 🟢 alta.
- **Limitação**: o YouTube sinalizava instabilidade nas views recentes no dia
  da coleta (ver caveats) — tratar P3 com uma margem de cautela extra.
- **Ação recomendada**: entender o que impulsionou julho (a live) e replicar
  antes da BF — ver pergunta 19.

### 4. Qual contribuição é atribuída à mídia pelas plataformas?
- **Conclusão**: no YouTube Studio, mídia paga foi responsável por 55,1%
  (últimos 28d) a 89,8% (BF25) das visualizações, mas com duração média muito
  mais baixa que tráfego orgânico (0:57-2:00 vs 4-13 min). No Google Ads,
  87.432 follow-on views e 3.053 inscrições atribuídas em 90 dias.
- **Confiança**: 🟢 alta (duas fontes concordantes na direção).

### 5. Há evidência de efeito incremental da mídia ou apenas associação?
- **Conclusão**: ainda apenas associação — nenhum experimento com grupo de
  controle foi rodado. Não mudou nesta revisão.
- **Confiança**: 🔴.
- **Ação recomendada**: mantém-se a recomendação de um teste holdout.

### 6. Estamos alcançando pessoas novas ou repetindo exposição?
- **Conclusão**: predominantemente pessoas novas via mídia paga — na BF25,
  62,3% das visualizações foram de público novo (vs. 37,3-42,1% nos períodos
  orgânicos mais recentes de 2026). Isso é esperado de campanhas de
  reconhecimento, mas confirma baixa frequência/retenção desse público
  (duração média de só 1:11 na BF25).
- **Fonte**: `new_vs_returning` em `youtube_studio_analytics.json`.
- **Confiança**: 🟢 alta.

### 7. As pessoas assistem a outros vídeos depois de ver nossos anúncios?
- **Conclusão**: sim (87.432 follow-on views no Google Ads, 90d) — mantido da
  revisão anterior.
- **Confiança**: 🟢/🟡 (ver revisão 1).

### 8. A audiência volta ao canal?
- **Conclusão**: sim, de forma robusta — espectadores recorrentes respondem
  por 66-71% do tempo de exibição em TODOS os 5 períodos analisados,
  incluindo a BF25. É a evidência mais forte de recorrência deste relatório.
- **Fonte**: `new_vs_returning`, coleta YouTube Studio.
- **Confiança**: 🟢 alta.
- **Ação recomendada**: essa base recorrente é o público mais barato e mais
  preparado para converter na BF — priorizar nutrição dela em vez de só
  aquisição fria.

### 9-13. Conteúdos que atraem/retêm/geram ação; narrativas por etapa; vídeos para teste
- **Conclusão**: Shorts de dicas técnicas ("TIPS...") dominam alcance vitalício
  (o maior tem 4,08 milhões de views) mas geram poucos inscritos por vídeo. A
  série de estudo de caso longo ("R$X Mil/Mês...", "Pediu Demissão...", "Mãe
  lucra...") tem retenção forte no início (ex.: 69% assistindo aos 0:30,
  acima da média do canal) e são os maiores geradores de inscritos por vídeo
  (até 2.706 num único vídeo). A live de aniversário é o maior evento único
  de conversão em inscrito (+4.887 em um dia).
- **Vídeo de maior investimento em mídia identificado**: "Eleve o nível do
  Nintendo Switch" (Short, 11,3 milhões de impressões vitalícias, CTR 8,4%,
  retenção excepcional com loops de 60-180% — indicando rewatches).
- **Achado de qualidade**: vídeo `2tqvuHWPGGY` (usado como um dos "vídeos
  prioritários" da auditoria) não tem dados — provavelmente não listado ou
  privado. Verificar status desse vídeo especificamente.
- **Confiança**: 🟢 para os números, 🟡 para a leitura de "por que" funciona
  (falta transcrição/taxonomia formal — pendente, ver
  `status_videos_transcricoes.md`).
- **Ação recomendada**: usar a série de estudo de caso longo como criativo
  principal de mídia paga rumo à BF (já é o que mais gera inscrito por
  visualização), não só os Shorts de reconhecimento.

### 14. Existe continuidade entre anúncio, canal, site e oferta?
- **Conclusão**: anúncio→canal está forte (follow-on views, inscrições,
  recorrência). Canal/anúncio→site continua fraco (526 sessões via "Paid
  Video" do GA4 em 90 dias — não mudou). Site→oferta é claro (landing pages
  reais).
- **Confiança**: 🟡 — o elo mais fraco da cadeia é levar a audiência de vídeo
  para o site, não o vídeo em si.

### 15-16. Público reimpactável hoje / elegibilidade até a BF
- Mantido da revisão 1 — ver `docs/auditoria_publicos_remarketing.md`.
  Reforço: a base de "espectadores recorrentes" (66-71% do tempo assistido)
  é uma evidência adicional de que o público de remarketing por visualização
  de vídeo (até 6 milhões em 180 dias) tem qualidade real por trás do
  tamanho, não é só volume vazio.

### 17. Estamos formando leads identificados ou apenas audiência de plataforma?
- **Conclusão**: não mudou — apenas audiência de plataforma (ainda que agora
  comprovadamente engajada e recorrente), sem captura de lead identificável
  funcionando. Continua sendo a resposta mais crítica do relatório.
- **Confiança**: 🟢 alta.

### 18. Quais gargalos limitam a preparação comercial?
- **Conclusão atualizada**: (a) ausência de captura de lead (mantido); (b)
  elo fraco entre engajamento no YouTube e tráfego ao site (mantido, mas
  agora sabemos que o orgânico retém muito melhor que a mídia paga — o
  gargalo é mais sobre "paga" que sobre o YouTube em geral); (c) **novo**:
  85,6% da audiência assiste sem legenda — se houver barreira de acessibilidade
  ou compreensão, isso pode limitar conversão (baixa prioridade, mas registrado).
- **Confiança**: 🟢 para (a) e (b), 🟡 para (c).

### 19. O que devemos manter, ampliar, corrigir, testar ou interromper?
- **Manter/ampliar**: produção de conteúdo longo/estudo de caso (maior gerador
  de inscritos); a estratégia de reduzir dependência de mídia paga (já em
  curso e funcionando).
- **Testar**: repetir formato de live/evento como o de aniversário antes da
  BF — foi o maior driver de inscritos do ano.
- **Corrigir**: a experiência do público novo trazido por mídia paga (duração
  média de 1:11 na BF25) — considerar um vídeo de anúncio mais longo ou uma
  sequência de retargeting para aquecer esse público antes de pedir conversão.
- **Interromper/investigar**: verificar por que `2tqvuHWPGGY` não tem dados
  (pode estar despublicado sem querer).

### 20. O que ainda não conseguimos concluir e como resolver?
- Meta comercial e investimento planejado para BF26 (depende do usuário).
- Captura de lead identificável (depende de decisão/instrumentação do
  usuário).
- Reconciliação da divergência Ads×GA4 na campanha Pmax de fundo de funil.
- Cobertura completa de transcrição (pendente de cota de API ou aumento de
  cota — ver `status_videos_transcricoes.md`).
- Ver lista completa em `docs/bloqueios_e_pedidos.md`.

---

## Prioridades imediatas (atualizadas)
1. **Decidir sobre captura de lead antes da BF** — segue sendo o gargalo mais
   crítico e mais acionável.
2. **Replicar o formato de live/evento** que gerou o pico de inscritos em
   julho, com um evento ancorado na Black Friday.
3. **Redirecionar orçamento de mídia para o formato de estudo de caso longo**,
   que já comprovadamente gera mais inscritos por visualização que Shorts de
   reconhecimento.
4. Confirmar meta comercial e investimento de BF26.
5. Investigar a divergência Ads×GA4 antes de aumentar orçamento na Pmax.

## Grau de confiança geral deste resumo
🟢 **Alto para orgânico, audiência e mídia paga** (dados diretos do YouTube
Studio e Google Ads, com caveats documentados sobre estabilidade das views
mais recentes). 🔴 **Baixo para leads/CRM** (segue sendo a maior lacuna,
agora de decisão/instrumentação, não mais de acesso a dado).
