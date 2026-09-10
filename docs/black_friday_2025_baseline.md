# Black Friday 2025 (BF25) — baseline real para comparação com BF26

Fonte: `data/raw/google_ads/br_campaign_metrics_bf25_2025-10-15_2025-11-30.json`
(conta Google Ads STLFLIX Brasil, campanhas com atividade entre 2025-10-15 e
2025-11-30 — janela ancorada nas datas reais de início de campanha).

## Linha do tempo real (não presumida)
| Data de início | Campanha |
|---|---|
| 2025-10-16 | Demandgen-Topo-Captacao-BF25 |
| 2025-10-29 | BLACK-FRIDAY-Vendas_Search |
| 2025-10-30 | BLACK-FRIDAY-Vendas_Pmax |
| 2025-10-30 | [VIDEO] [Wide] BLACKFRIDAY |
| 2025-11-10 | [VIDEO] [WIDE] Depoimentos - BlackFriday25 |

O aquecimento começou **~6 semanas antes** da Black Friday (que em 2025 caiu em
28/11). Campanhas "always-on" de e-commerce (impressoras, cursos) continuaram
rodando em paralelo durante todo o período.

## Totais (todas as campanhas ativas no período, 2025-10-15 a 2025-11-30)
- Investimento: **R$ 126.782,20**
- `conversions_value` (ação de conversão primária da conta — tratar como proxy
  de receita atribuída pelo Ads, não confirmado contra o GA4 deste período):
  **R$ 1.820.565,77**

## Só as campanhas nomeadas "Black Friday" (4 campanhas)
- Investimento: **R$ 53.195,50**
- `conversions_value`: **R$ 417.058,26**
- ROAS aparente (conversions_value / custo): **~7,8x** — **não confirmado contra
  receita real do GA4 no período** (não extraído ainda; mesma ressalva de
  metodologia do achado #8 em `bloqueios_e_pedidos.md` — Ads e GA4 usam modelos
  de atribuição diferentes).

| Campanha | Tipo | Custo | conversions_value |
|---|---|---|---|
| BLACK-FRIDAY-Vendas_Pmax | PERFORMANCE_MAX | R$ 11.035,99 | R$ 128.132,96 |
| BLACK-FRIDAY-Vendas_Search | SEARCH | R$ 4.531,69 | R$ 109.131,39 |
| [VIDEO] [Wide] BLACKFRIDAY | DEMAND_GEN | R$ 28.466,95 | R$ 153.589,69 |
| [VIDEO] [WIDE] Depoimentos - BlackFriday25 | DEMAND_GEN | R$ 9.160,87 | R$ 26.204,23 |

## Uso pretendido
Este é o único ano-anterior comparável que temos. Ao planejar BF26 (seção 16 do
escopo e `plano_execucao.md` Fase 2), usar como piso de referência para:
- Prazo de aquecimento (6 semanas antes já é validado como não cedo demais).
- Ordem de grandeza de investimento em campanhas dedicadas de BF (~R$53k) vs.
  operação regular (~R$73k no mesmo período).
- **Não** usar o ROAS de 7,8x como meta garantida — é uma leitura de uma única
  fonte (Ads), não reconciliada.

## Pendências
- Extrair GA4 do mesmo período (2025-10-15 a 2025-11-30) para reconciliar
  receita e conversões, e comparar com os totais do Ads acima.
- Confirmar com o usuário a meta e o investimento planejado para BF26 (bloqueio
  #6 em `bloqueios_e_pedidos.md`).
