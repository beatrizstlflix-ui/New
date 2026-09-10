# Estamos sendo assertivos na mídia paga (últimos ~4 meses)?

**Pergunta do usuário:** "Traga uma análise dos últimos 4 meses de ativação de mídia, de uma maneira que consiga dizer -> estamos sendo assertivos?"

**Escopo:** apenas campanhas `advertising_channel_type == VIDEO` (vídeo-reconhecimento no YouTube), conta Google Ads STLFLIX BR (445-144-0907), maio–setembro/2026 (setembro parcial, até 09/09). Demand Gen, Performance Max e Display ficam fora desta pergunta específica (já cobertos em outras seções do dashboard).

**Fonte:** Windsor.ai → Google Ads, extração real em 2026-09-10. Dado bruto preservado em `data/raw/google_ads/br_monthly_video_campaigns_2026-05-10_2026-09-09.json` (95 linhas). Processado por `scripts/build_media_assertividade.py` → `data/processed/media_assertividade_4m.json`.

## Veredito

**Não. Nos dados dos últimos 4 meses, o orçamento não está sendo redirecionado com base em desempenho.** O padrão observado é de orçamento quase uniforme por campanha, com performance extremamente desigual — ou seja, o gasto não "segue" o resultado.

**Confiança: 🟢 alta** para os fatos observados (números vêm direto do Google Ads via Windsor.ai, sem estimativa). **🟡 média** para a inferência causal de "por que" (não temos acesso à lógica/regras de otimização de campanha configuradas na conta — pode haver orçamento diário fixo definido manualmente, e não uma decisão editorial mês a mês).

## Evidência 1 — custo por campanha não acompanha o resultado (correlação ~0)

Correlação (Pearson) entre custo mensal e valor de conversão gerado, campanha a campanha, dentro do mesmo mês:

| Mês | nº campanhas | corr(custo, valor de conversão) | corr(custo, follow-on-views) |
|---|---|---|---|
| Jun/26 | 18 | **0,015** | 0,621 |
| Jul/26 | 19 | **0,242** | 0,338 |
| Ago/26 | 20 | **0,065** | 0,090 |
| Set/26 (parcial) | 22 | 0,696 | 0,694 |

Em Junho e Agosto a correlação entre quanto se gasta numa campanha e quanto valor ela gera é essencialmente zero. Em Julho é fraca (0,24). Isso é o oposto de um sistema assertivo, onde se esperaria correlação alta e positiva (mais orçamento nas campanhas que performam melhor).

*Setembro parcial mostra correlação mais alta (0,70), mas isso é lido com cautela: em um mês incompleto, campanhas recém-escaladas acumulam custo e resultado proporcionalmente por efeito de calendário, não necessariamente por uma decisão editorial nova — não tratamos isso como sinal de melhora.*

## Evidência 2 — orçamento clusteriza em valor quase fixo, resultado varia livremente

Corte transversal de Agosto/26 (mês cheio, 20 campanhas ativas):

- Custo: mínimo R$300,55, máximo R$1.796,43, média R$1.354,23 — **coeficiente de variação de 26,4%**
- Valor de conversão gerado: **coeficiente de variação de 179,5%** (quase 7× mais disperso que o custo)
- 13 das 20 campanhas custaram entre R$1.520 e R$1.524 no mês — uma faixa de **R$4** de diferença — enquanto o valor gerado por elas variou de R$54 a R$1.781 (33× de diferença) e o número de inscritos gerados variou de 7 a 106 (15× de diferença).

Ou seja: o orçamento está concentrado num valor quase idêntico entre campanhas, mas o resultado dessas mesmas campanhas é extremamente desigual.

## Evidência 3 — caso concreto: campanha com ZERO resultado recebeu +486% de orçamento

Campanha `[STLFLIX] vídeo-reconhecimento-como-ele-escalou-9-impressoras`:

| Mês | Custo | Follow-on-views | Inscrições | Valor de conversão |
|---|---|---|---|---|
| Jul/26 (mês cheio) | R$259,79 | 0 | 0 | R$0 |
| Ago/26 (mês cheio) | R$1.522,67 (**+486%**) | 0 | 0 | R$0 |
| Set/26 (parcial) | R$482,00 | 0 | 0 | R$0 |

Três meses seguidos com zero resultado registrado — e no meio desse período o orçamento foi multiplicado por quase 6×, não cortado. Este é o exemplo mais direto, dentro dos dados reais, de alocação de orçamento não vinculada a desempenho.

Olhando o conjunto: R$3.754,55 do total de R$90.578,83 investidos em vídeo nos 4 meses (4,1%) foi para combinações campanha×mês com zero follow-on-view, zero inscrição e zero valor de conversão — não é o problema central em termos de R$, mas confirma que campanhas zeradas não são cortadas rapidamente.

## O que os dados NÃO permitem afirmar (limitações)

- Não temos acesso à configuração de otimização/estratégia de lance de cada campanha (ex.: se o cliente usa orçamento diário fixo manual vs. Target CPA/ROAS) — pode existir uma explicação operacional para o padrão de custo quase uniforme que não é visível só pelos resultados agregados mensais.
- Setembro/26 é mês parcial (9 de ~30 dias) — todas as quedas de custo Ago→Set (a maioria das campanhas caiu de 65% a 99%) são majoritariamente um artefato de calendário, não uma realocação real. Por isso essas transições foram excluídas do veredito acima.
- "Valor de conversão" mistura eventos de valor variável (início de checkout parcial + inscrições no canal + outros) — é um proxy de resultado, não uma receita líquida confirmada.
- Análise cobre apenas campanhas VIDEO; não avalia se Demand Gen/Performance Max/Display têm o mesmo padrão (não verificado nesta análise).

## Ação recomendada

1. Confirmar com quem gerencia a conta se existe orçamento diário fixo manual por campanha (explicaria o clustering em ~R$1.520) — se sim, esse é exatamente o mecanismo a mudar.
2. Definir uma regra simples e objetiva de corte: ex. "campanha com 0 follow-on-view e 0 inscrição em um mês cheio tem orçamento reduzido em ≥50% ou pausada no mês seguinte" — hoje o oposto está acontecendo no único caso observável (aumento de 486%).
3. Redirecionar o orçamento das campanhas de pior performance (ex. "Vídeo_Reconhecimento_Topo_STLFLIX": R$1.796 de custo em Ago para apenas R$129 de valor gerado, a pior relação custo/resultado do mês) para as de melhor performance (ex. "Top 5 Nichos LUCRATIVOS": R$1.523 de custo para R$1.781 de valor, a melhor relação do mês).
4. Repetir esta mesma análise mensalmente (o script `scripts/build_media_assertividade.py` é reexecutável) para verificar se a correlação custo↔valor sobe ao longo do tempo — esse é o indicador objetivo de "estamos ficando mais assertivos".
