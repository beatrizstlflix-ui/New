# Bloqueios e pedidos ao usuário

Status em 2026-09-10. Ver protocolo completo na conversa (o que tentei, impedimento,
o que depende disso, o que preciso, como resolver, o que continuo fazendo).

## 1. [RESOLVIDO EM 2026-09-10 — via coleta manual assistida] YouTube Analytics
- **Tentando**: extrair views, tempo assistido, origem de tráfego, retenção,
  inscritos, demografia do canal STLFLIX BR por período.
- **Impedimento original**: o conector `youtube` do Windsor.ai está autenticado
  no canal pessoal vazio da conta, não no STLFLIX BR; OAuth próprio do app
  também não estava configurado (refresh_token fornecido depois não pôde ser
  trocado por falta de `GOOGLE_CLIENT_ID`/`GOOGLE_CLIENT_SECRET` — ver item 2).
- **Resolvido por caminho alternativo**: o usuário coletou manualmente (via
  Claude in Chrome, logado no YouTube Studio) os relatórios de Visão Geral,
  Alcance, Engajamento, Público-alvo, série de inscritos e retenção de 5
  vídeos, em 5 períodos (YTD, 90d, 28d, 28d anteriores, BF25). Consolidado em
  `data/raw/youtube/STLFLIX_auditoria_YouTube_studio_2026-09-10.xlsx` e
  `data/processed/youtube_studio_analytics.json`.
- **Caveats importantes que vieram junto** (preservados do arquivo original):
  YouTube mostrava alerta de "problema temporário com os dados" no momento da
  coleta; mudança na contagem de views a partir de 27/08/2026; a aba
  "Público-alvo" do Studio é sempre fixa em 28 dias (não é "P1"/"P2" real);
  vídeo `2tqvuHWPGGY` sem dados de retenção (provável não listado/privado).
  Tratar os números como leitura de tela cuidadosa, não export bruto
  verificável byte a byte.
- **Ainda não resolvido**: acesso automatizado/contínuo (para atualizar sem
  repetir a coleta manual a cada rodada). Se quiser isso no futuro, os
  caminhos continuam sendo o Windsor.ai (reconectar no canal certo) ou
  completar o OAuth do item 2.

## 2. [RESOLVIDO] Chave de API do YouTube
- A chave enviada como texto (não screenshot) funcionou: canal confirmado
  **STLFLIX BR - Impressão 3D** (@stlflix_br), 83.400 inscritos, 24.856.451 views
  vitalícias, 1.062 vídeos reportados (1.039 inventariados via playlist pública —
  a diferença provavelmente são vídeos não listados/privados, não visíveis sem
  OAuth). Erro anterior era mesmo transcrição do screenshot (`O` maiúsculo lido no
  lugar de `0`).
- **Limite que continua valendo**: este modo só dá estatísticas vitalícias
  (sem filtro de período) — ver item 1.

## 3. [MÉDIO] Eventos de lead no GA4 nunca disparam
- **Achado**: `qualify_lead` e `close_convert_lead` existem como conversões
  configuradas no GA4 da propriedade BR, mas **não ocorreram nenhuma vez em 20
  meses** (2025-01 a 2026-09). Só `purchase` está de fato instrumentado (8.269
  eventos no período).
- **Pergunta**: existe algum mecanismo de captura de lead fora da compra direta
  (formulário, WhatsApp, lista de espera, webinar, quiz)? Se sim, onde ele mora
  (site, CRM, planilha) e por que não dispara esse evento? Se não existe, isso
  deveria ser criado antes da Black Friday, já que impacta diretamente a pergunta
  "estamos formando leads identificados ou só audiência dentro da plataforma?".

## 4. [MÉDIO] Meta Ads e Stripe não conectados
- **Achado**: GA4 mostra "Paid Social" como o maior canal pago de sessões no site
  (ex.: 89k sessões nos últimos 28 dias) — maior que qualquer canal do YouTube/Google
  Ads. Não temos acesso à plataforma de origem (provavelmente Meta) para saber
  investimento, criativos, públicos.
- **Pergunta**: a mídia paga do YouTube deve ser lida isoladamente do Meta, ou o
  "Paid Social" precisa entrar no diagnóstico de preparação para a Black Friday?
- **Como resolver**: autorizar o conector Meta em
  `claude.ai` → Settings → Connectors (ou via `claude mcp`/`/mcp` fora desta sessão
  não-interativa). Idem para Stripe, se relevante para identificar clientes
  existentes/novos compradores.

## 5. [MÉDIO — atualizado] CRM parcialmente identificado via Google Ads
- **Achado novo**: existe um público `CRM_BASED` no Google Ads chamado
  "ALL_Clientes [Outubro]" (30.000 pessoas, Customer Match) — ver
  `docs/auditoria_publicos_remarketing.md`. Isso confirma que existe (ou existiu)
  uma base própria de clientes em algum sistema, exportada manualmente.
- **Pergunta**: qual é a fonte desse arquivo (planilha, e-commerce, outra
  ferramenta)? Com que frequência é atualizado? Ainda não encontramos nenhum
  conector de CRM (HubSpot, RD Station etc.) nas integrações disponíveis — se
  existir uma ferramenta de CRM separada, preciso do nome dela para avaliar acesso.

## 6. [BAIXO/A CONFIRMAR] Data e meta da Black Friday
- Assumi Black Friday em 2026-11-27 (convenção padrão). Confirma a data? Existe meta
  comercial (receita, nº de leads, nº de vendas) e investimento planejado em mídia
  para o período? Sem isso, as projeções da seção 16 do escopo ficam limitadas a
  cenários de audiência/tráfego, não de vendas.
- **Contexto encontrado**: campanhas da Black Friday do ano passado (BF25) começaram
  entre 2025-10-16 e 2025-10-30 (~4-6 semanas antes da BF) — ver
  `data/raw/google_ads/br_campaign_dates_budget.json`. Vou usar esse prazo como
  referência de planejamento até você confirmar a data/estratégia deste ano.

## 7. [BAIXO] Data de início do "aquecimento" para BF26
- Existe uma data de início definida para a estratégia de aquecimento deste ano?
  **Observação**: a onda atual de campanhas "vídeo-reconhecimento" começou de forma
  concentrada em 2026-06-01 (dezenas de campanhas com a mesma data de início) e
  segue recebendo novos vídeos quase toda semana até hoje — pode já ser o
  aquecimento em curso. Confirma?

## 8. [MÉDIO — achado de mensuração] Divergência entre valor de conversão do Google Ads e receita do GA4
- **Achado**: a campanha `Pmax_Fundo-de-Funil_Vendas_Oferta-Anual` reporta
  R$463.061 em `conversions_value` nos últimos 90 dias (dado do próprio Google
  Ads). Já o canal do GA4 onde campanhas Performance Max tendem a cair
  ("Cross-network") mostra apenas R$97.101 em receita de compras no mesmo
  período, somando *todas* as fontes desse canal. São fontes com metodologia de
  atribuição diferentes (não devem bater exatamente), mas essa diferença é grande
  o suficiente para merecer investigação antes de usar qualquer um dos dois
  números como "a" verdade em decisões de investimento. Vou tratar isso como
  achado de auditoria de mensuração (não vou reconciliar arbitrariamente).

## 9. [NOVO — achado de escopo] Vídeos de anúncio vêm de pelo menos 3 canais do YouTube diferentes do STLFLIX BR
- **Achado**: cruzando o inventário orgânico (1.039 vídeos do canal
  `UCb3H1VIsLk9l6xAz6eyyLwQ`) com os 66 vídeos usados em anúncios nos últimos 90
  dias, 23 não aparecem no canal público — a maioria pertence a
  `UCke6o2ZrbJ7ZGrzgDI4xM4Q` (nomes de arquivo tipo "1936_V_A_SO_FREESTYLE_6.mp4",
  parece um canal só de upload de criativos de anúncio), outros a
  `UCBXu5NZtZoUA4pIeU2GGPdg` e `UCTKWuk5VvxQd7_R4KP5OeHw`. Mais 3 vídeos pertencem
  ao próprio canal STLFLIX BR mas não aparecem no inventário público porque são
  não listados/privados (ex.: "Arena 3D EP 03 - Intro 0X.mp4", enviados
  recentemente em 2026-09-04).
- **Pergunta**: esses canais de criativo (`UCke6o2ZrbJ7ZGrzgDI4xM4Q` e os outros
  dois) são geridos pela agência/STLFLIX? Fazem sentido no escopo desta auditoria
  (são só veículo técnico para servir anúncio) ou devo tratá-los como fora de
  escopo? Isso não bloqueia o restante do trabalho — só registro para não
  presumir silenciosamente.

## 10. [BAIXO — limitação técnica confirmada] Endpoints públicos de legenda do YouTube bloqueados neste ambiente
- **Achado**: a política de rede deste ambiente bloqueia `www.youtube.com` e
  `video.google.com` (usados por ferramentas de transcrição de terceiros) — só
  `www.googleapis.com` (API oficial) é permitido. Isso não impede a transcrição:
  confirmei via `captions.list` (que funciona com a chave de API) que legendas
  automáticas (ASR) em português **existem e estão "serving"** para os vídeos
  testados. O **download** do texto da legenda (`captions.download`) exige OAuth
  (erro 401 confirmado com a chave de API) — ou seja, depende da mesma correção
  do item 1. Não é um impedimento novo, é o mesmo de sempre, agora com uma rota
  de solução mais clara (usar a API oficial via OAuth, não scraping).

## 11. [MÉDIO — quantificado] Propriedade GA4 "BR" inclui ~7% de tráfego fora do Brasil
- **Achado**: medido nos últimos 90 dias — Brasil é 92,9% das sessões, 96,0% das
  compras e 96,0% da receita da propriedade "LP - AMBIENTE BR". O resto vem
  principalmente de EUA, Portugal e Reino Unido.
- **Não bloqueia** as conclusões direcionais deste relatório, mas todo número
  "BR" aqui carrega essa margem até refazermos as extrações com filtro
  `country=Brazil` explícito.
- **Não preciso de nada seu aqui** — é só um registro de precisão.

## 12. [MÉDIO] "STLFLIX Assinatura" com receita zero e produto "Lote Especial + STLAI" com valores discrepantes
- **Achado 1**: 2.083 unidades do item "STLFLIX Assinatura" foram registradas
  como compradas no GA4 nos últimos 90 dias, todas com R$ 0 de receita.
- **Pergunta**: é um produto gratuito/trial (faz sentido não ter receita) ou é
  falha de instrumentação de valor no evento de compra? Isso muda a leitura de
  quantas pessoas realmente pagam algo.
- **Achado 2**: o item "Lote Especial STLFLIX + STLAI" tem duas combinações
  canal×valor muito acima da média (Unassigned: 54 unidades por R$1.640.455;
  Organic Social: 26 unidades por R$814.342 — ~R$30-31 mil/unidade contra ~R$5.814
  nos demais canais). Pode ser venda por atacado/B2B real ou um erro de valor.
- **Pergunta**: você reconhece essas transações como reais (ex.: vendas
  corporativas/atacado)? Se sim, ótimo — só não vou usá-las para calcular ticket
  médio "típico" sem essa distinção. Se não, pode ser um bug de checkout a
  investigar antes da Black Friday.
