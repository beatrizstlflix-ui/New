# Dicionário de métricas e definições

## Camadas de audiência (definição de trabalho deste projeto)
- **Espectadores**: pessoas que assistiram a pelo menos parte de um vídeo (`views`
  no YouTube). Não implica relacionamento com a marca além do consumo do vídeo.
- **Inscritos**: `subscribers_gained`/`subscriber_count` do YouTube — associação
  formal ao canal, sem indicar frequência de consumo.
- **Audiência ativa**: espectadores com atividade recente (janela a definir, ex.
  últimos 28/90 dias) — depende de dados do YouTube Analytics (bloqueado).
- **Audiência recorrente**: espectadores que voltam a consumir conteúdo em mais de
  uma ocasião/período. O YouTube define "recorrente" ("returning")/"casual"/
  "regular" com base em janelas de meses de histórico — **não confundir com
  recorrência de curto prazo**. A ser documentado com precisão assim que o acesso
  ao YouTube Analytics for restabelecido (consultar a documentação vigente do
  Studio antes de aplicar esses rótulos, pois a definição já mudou no passado).
- **Público elegível para remarketing**: usuários que se qualificam para uma lista
  de remarketing ativa (Google Ads/YouTube) dentro da janela de validade da lista
  (ex.: campanha `[DISPLAY] Remarketing Visitantes 180D`, `Remarketing_Videoview-
  Lembrete_Aniversário[30d]`). Tamanho e composição a auditar (ver
  `plano_execucao.md`).
- **Leads identificados e contatáveis**: pessoas com um dado de contato direto
  (e-mail, telefone, WhatsApp) capturado por um mecanismo próprio (formulário,
  CRM). **Não confirmado que existe hoje** — ver bloqueio #3.
- **Clientes existentes**: pessoas com compra confirmada em qualquer momento
  anterior ao período analisado.
- **Novos compradores**: primeira compra dentro do período analisado.

## Google Ads
- `conversions`: contagem da(s) ação(ões) de conversão primária(s) da conta
  (configuração da conta, pode incluir compra e outras ações "principais").
- `all_conversions`: todas as ações de conversão, incluinds as **não comerciais**
  (`youtube_follow_on_views`, `youtube_channel_subscriptions`). Nunca tratar como
  proxy de vendas sem discriminar por ação.
- `all_conversions_youtube_follow_on_views`: nº de vezes que alguém assistiu a outro
  vídeo do canal logo após ver o anúncio in-stream — sinal observável de
  "continuidade", não de intenção comercial.
- `all_conversions_youtube_channel_subscriptions`: inscrições atribuídas ao anúncio
  (dentro da janela de atribuição do Ads — normalmente vídeo assistido + inscrição
  em sequência).
- `video_quartile_pXX_rate`: taxa de conclusão de X% do vídeo **dentro do contexto do
  anúncio exibido** (TrueView/in-stream) — não é a curva de retenção do YouTube
  Studio (fonte e definição diferentes, não comparar diretamente).
- `cost_micros`: custo em micros da moeda da conta (1.000.000 = 1 unidade).
- `advertising_channel_type` = `VIDEO`: campanha in-stream/discovery clássica
  centrada em 1 vídeo. `DEMAND_GEN`: formato mais novo, pode incluir YouTube +
  Instagram/Discover. `PERFORMANCE_MAX`: pode veicular em YouTube mas não é
  possível isolar 100% a parcela de YouTube nesse tipo de campanha com os campos
  hoje extraídos — ver decisão em `decisoes_metodologicas.md` (any refinamento
  futuro precisa export de `segments.ad_network_type` no nível de anúncio, se
  disponível).

## GA4
- `session_default_channel_group`: agrupamento automático do GA4 (Paid Social,
  Organic Video, Paid Video, Direct, Referral, etc.) baseado em UTM/referrer —
  **não é o mesmo particionamento que o Google Ads usa internamente**.
  "Paid Video"/"Organic Video" tipicamente correspondem a tráfego vindo do YouTube.
  "Paid Social" tipicamente corresponde a Meta/Instagram/TikTok pagos — **não
  confirmado sem o conector Meta**.
- `conversions_purchase`: contagem do evento-chave `purchase` no GA4 (e-commerce).
- `conversions_qualify_lead` / `conversions_close_convert_lead`: eventos-chave
  configurados mas nunca disparados no período observado (ver bloqueio #3) — tratar
  como **indisponível/não instrumentado**, não como "zero volume real de leads".
- `sessions` vs `totalusers` vs `newusers`: sessão ≠ pessoa; uma pessoa pode gerar
  várias sessões no período. `newusers` é a estimativa do GA4 de usuários na
  primeira visita observada (sujeita à política de cookies/consentimento).

## YouTube (definições a aplicar quando o acesso for restabelecido)
- `engaged_views`: metodologia pré-março/2025 de contagem de views (visualização
  além dos segundos iniciais) — comparável para Shorts, cujo `views` padrão mudou de
  definição (conta reproduções e replays sem tempo mínimo).
- `traffic_source`: `YT_SEARCH`, `RELATED_VIDEO`, `EXT_URL`, `SUBSCRIBER`,
  `PLAYLIST`, etc. — permite separar orgânico de pago quando cruzado com o vídeo/
  campanha, mas o próprio campo não distingue "pago" diretamente (in-stream ads
  geram sessões de visualização que não necessariamente aparecem como
  traffic_source do relatório de vídeo do canal — a confirmar na documentação do
  YouTube Analytics API assim que o acesso for restabelecido).
