# Bloqueios e pedidos ao usuário

Status em 2026-09-10. Ver protocolo completo na conversa (o que tentei, impedimento,
o que depende disso, o que preciso, como resolver, o que continuo fazendo).

## 1. [CRÍTICO] YouTube conectado ao canal errado no Windsor.ai
- **Tentando**: extrair views, tempo assistido, origem de tráfego, retenção,
  inscritos, demografia do canal STLFLIX BR.
- **Impedimento**: a conta `beatrizstlflix@gmail.com` no conector `youtube` do
  Windsor.ai está autenticada no canal pessoal dela (vazio), não no STLFLIX BR.
- **Depende disso**: toda a seção "Orgânico", "Retenção", parte de "Audiência" e
  "Relação mídia x orgânico" do dashboard e das 20 perguntas obrigatórias.
- **Preciso que você**: reconecte o YouTube no Windsor.ai selecionando o canal
  correto.
- **Como fazer**: abra
  `https://onboard.windsor.ai/connect?connector=youtube&next=/youtube/authorize`,
  entre com a conta que administra o Windsor.ai, e **na tela de consentimento do
  Google escolha explicitamente o canal/marca STLFLIX BR** (não "Beatriz stlflix")
  quando for perguntado qual canal autorizar.
- **Enquanto isso**: sigo com Google Ads, GA4, estrutura do projeto e o dashboard com
  as seções que não dependem do YouTube.

## 2. [ALTO] Chave de API do YouTube inválida
- **Tentando**: usar o modo "API key" (sem OAuth) como alternativa parcial ao item 1.
- **Impedimento**: `YOUTUBE_API_KEY` fornecida retornou `API_KEY_INVALID` — provável
  erro de transcrição ao ler de um screenshot (caracteres ambíguos como 0/O, l/1/I).
- **Depende disso**: inventário básico de vídeos (mesmo sem métricas por período).
- **Preciso que você**: cole a chave como texto simples (não screenshot) em uma
  mensagem, ou confirme se ela foi regenerada desde a captura de tela.
- **Observação de segurança**: mesmo corrigida, essa chave só dá estatísticas
  públicas vitalícias — não substitui o item 1 para as métricas por período,
  retenção e tráfego.

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
