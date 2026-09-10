# Prompt para rodar com Claude in Chrome (sessão separada, logada no YouTube Studio)

Cole o texto abaixo numa conversa nova com o Claude in Chrome, já logado no
YouTube Studio com a conta que administra o canal **STLFLIX BR - Impressão 3D**
(@stlflix_br). O objetivo é trazer de volta os dados que a chave de API pública
não cobre (tudo que depende de login: tráfego por período, retenção,
recorrência, demografia). Depois, me envie aqui os CSVs exportados ou o texto
com os números coletados.

---

## PROMPT (copiar a partir daqui)

Estou auditando o canal do YouTube **STLFLIX BR - Impressão 3D** (@stlflix_br)
para uma análise de preparação para a Black Friday. Preciso que você navegue
pelo YouTube Studio (studio.youtube.com), já logado, e colete os dados abaixo.
Sempre que possível, **exporte como CSV** (ícone de exportar/download no canto
de cada relatório do Analytics) em vez de só descrever a tela — isso preserva
precisão. Onde não houver exportação, me devolva os números em tabela.

Se algum menu/aba tiver nome ou local diferente do que descrevo (o YouTube muda
a interface com frequência), procure o equivalente mais próximo e me avise o
que mudou.

### Períodos a extrair (repita cada bloco abaixo para estes 5 períodos)
1. Ano corrente até hoje (01/01/2026 até a data de hoje)
2. Últimos 90 dias
3. Últimos 28 dias
4. Os 28 dias imediatamente anteriores a esses (para eu comparar com os
   últimos 28 dias)
5. 15/10/2025 a 30/11/2025 (Black Friday do ano passado, para comparação)

### A. Aba "Visão geral" (Overview) — por período
- Visualizações, tempo de exibição (horas), inscritos ganhos/perdidos no
  período, principais vídeos do período.

### B. Aba "Alcance" (Reach) — por período
- Impressões e CTR da miniatura (impressions e click-through rate)
- Origem do tráfego (traffic source types): pesquisa do YouTube, vídeos
  sugeridos, externo, navegação, notificações, etc. — com visualizações e
  tempo de exibição de cada origem
- Espectadores únicos (unique viewers), se disponível

### C. Aba "Engajamento" (Engagement) — por período
- Tempo médio de exibição (average view duration) e duração média assistida
  (%), separado por **vídeos longos** e **Shorts** se a interface permitir
- Principais vídeos e Shorts do período por tempo de exibição
- Cliques em cards e telas finais, se houver

### D. Aba "Público-alvo" (Audience) — por período
- **Espectadores recorrentes vs. novos** (returning viewers vs. new viewers)
  — este é o dado mais importante que não tenho
- Quando seus espectadores estão no YouTube (horários/dias)
- Vídeos que outros canais mais sugerem para seus espectadores
- Dados demográficos: idade, gênero, principais localizações geográficas
  (cidade/país)
- Inscritos vs. não inscritos (visualizações e tempo de exibição de cada)

### E. Gráfico de inscritos (dentro de Visão geral ou Público-alvo)
- Exporte ou anote a série temporal diária/semanal de inscritos ganhos e
  perdidos, não só o total do período

### F. Comparação orgânico vs. pago, se visível
- Se o Studio mostrar alguma separação de tráfego pago (ex.: "Anúncios" como
  origem de tráfego), anote separadamente

### G. Retenção de público (Audience retention) — para os 5 vídeos que eu
listar abaixo (não precisa repetir por período, é vitalício por vídeo)
- Abra cada vídeo em Analytics > Engajamento > Retenção de público e descreva
  ou capture a curva (pontos de queda, picos de reassistência, % em 25/50/75/
  100%)
- Vídeos (IDs do YouTube):
  1. `f5f3TEhFpGo` (TIPS - Dica para impressões a prova d'água)
  2. `pRFKfBxGRtI` (R$20 Mil/Mês vendendo impressão 3d e travou)
  3. `2tqvuHWPGGY` (Lucrando com impressão 3D: Comece seu negócio — usado em anúncio)
  4. `D_kBytQkxT4` (vídeo de infill/testes)
  5. Escolha o vídeo de maior investimento em mídia que você achar no canal
     (ou me pergunte se tiver dúvida)

### Como me devolver
- Envie os arquivos CSV exportados, ou cole as tabelas/números direto na
  conversa comigo (na sessão do Claude Code, não aqui no Chrome).
- Para cada item que não conseguir extrair (ex.: métrica não existe mais,
  período sem dado), me diga isso explicitamente em vez de pular em silêncio.

---

## O que eu faço com isso
Assim que você trouxer esse material de volta, eu:
1. Concilio com os dados que já tenho de Google Ads e GA4
2. Preencho as seções "Orgânico", "Retenção" e "Audiência" do dashboard que
   hoje estão marcadas como bloqueadas
3. Atualizo `docs/bloqueios_e_pedidos.md` marcando o item 1 como resolvido
