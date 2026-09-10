# Decisões metodológicas

1. **Data de referência**: "hoje" = 2026-09-10 (fornecido pelo ambiente). Última data
   completa = 2026-09-09. Todos os períodos "últimos N dias" terminam em 2026-09-09.
2. **Black Friday 2026**: assumida como 2026-11-27 (sexta-feira seguinte à quarta
   quinta-feira de novembro, convenção americana) — **não confirmada pelo usuário**.
   Ver pergunta em `bloqueios_e_pedidos.md`. Todas as contagens de "dias restantes"
   usam essa data até confirmação.
3. **Moeda**: valores do Google Ads em `cost_micros` (1 BRL = 1.000.000 micros),
   assumindo a conta em BRL (não confirmado explicitamente por um campo de moeda
   nesta extração — a confirmar com `account_currency_code` em extração futura).
4. **GA4 — duplicidade aparente em `year_month_name`**: ao agregar por
   `year_month_name` + `session_default_channel_group`, vieram múltiplas linhas para
   a mesma combinação com valores diferentes (ex.: "Direct" em Mar/2026 apareceu com
   11 e depois 13 sessões). Isso indica uma dimensão adicional não solicitada
   particionando os dados no back-end do GA4 (provavelmente stream ou dispositivo).
   **Decisão**: somar todas as linhas por mês+canal (partição válida, sem
   duplicação de linhas idênticas) em vez de pegar apenas a primeira ocorrência.
   Script: `scripts/process_ga4_monthly.py`. Isso deve ser revalidado assim que
   pudermos comparar o total agregado contra o relatório nativo do GA4 (ver
   `mensuracao_achados.md` quando criado).
5. **Google Ads "video_quartile_*"**: os valores retornados por linha (device x
   network) foram agregados por vídeo como **média ponderada pelo volume de
   trueview_views de cada linha**, não uma média simples — para não distorcer o
   resultado por combinações de baixo volume. Isso **não é comparável diretamente**
   à curva de retenção do YouTube Studio (que é outra fonte/metodologia) — só serve
   como indicador de conclusão do anúncio em si.
6. **conversions vs all_conversions (Google Ads)**: `conversions` reflete apenas a(s)
   ação(ões) de conversão primária(s) definida(s) na conta; `all_conversions` inclui
   todas as ações, inclusive engajamento com YouTube (follow-on views, inscrições no
   canal) que **não são vendas**. Nunca somamos as duas nem tratamos
   `all_conversions` como proxy de vendas sem discriminar por ação — ver arquivo de
   discriminação por ação (registro de extração #5).
7. **GA4 property usada como "Brasil"**: apenas `530533972` ("LP - AMBIENTE BR").
   `530495512` ("GET - AMBIENTE GLOBAL") é usada só como checagem de existência de
   campo/evento, nunca como fonte de números atribuídos ao Brasil.
8. **YouTube channel_id confirmado por fonte indireta**: como o Windsor YouTube
   connector está no canal errado, usamos `video_channel_id` retornado pelo Google
   Ads (nos ad_group/vídeos usados em campanhas) como confirmação independente de
   que o canal STLFLIX BR é `UCb3H1VIsLk9l6xAz6eyyLwQ` — mesmo valor informado pelo
   usuário. Isso não substitui a necessidade de dados do YouTube Analytics em si.
9. **Sem dado ≠ zero**: quando uma métrica não pôde ser extraída (ex.: YouTube),
   marcamos explicitamente como "bloqueado"/"indisponível" nos documentos e no
   dashboard — nunca como 0 ou vazio silencioso.
10. **Propriedade GA4 "BR" não é filtrada por país — medido, não estimado**:
    nos últimos 90 dias, Brasil representa 92,9% das sessões, 96,0% das compras e
    96,0% da receita da propriedade (ver `data/processed/ga4_geo_summary_last90d.json`).
    Ou seja, os números que rotulamos "BR" ao longo deste projeto carregam ~7% de
    sessões e ~4% de receita de fora do Brasil (EUA, Portugal, Reino Unido e outros
    lideram). Não é grande o bastante para invalidar as conclusões direcionais, mas
    o suficiente para não tratar os totais como 100% Brasil sem essa ressalva.
    Refazer com filtro `country=Brazil` explícito antes de qualquer número que vá
    para uma decisão de investimento fina.
11. **Item de e-commerce "Lote Especial STLFLIX + STLAI" tem 2 combinações
    canal×valor muito acima da média** (Unassigned: 54 un. = R$1.640.455,75;
    Organic Social: 26 un. = R$814.342,00 — média ~R$30-31 mil/unidade contra
    ~R$5.814/unidade nos demais canais). Tratado como possível anomalia de dados
    (venda atacado/B2B agrupada, ou erro de valor) — não usado para calcular
    ticket médio até confirmação. Ver `data/raw/ga4/br_items_aggregated_last90d.json`.
12. **"STLFLIX Assinatura" (item de e-commerce) tem receita zero em todas as
    2.083 unidades "compradas" no período** — tratado como não-instrumentado
    (preço não capturado no evento de compra) ou item gratuito, não como receita
    real igual a zero por design do produto. Precisa confirmação do usuário.
