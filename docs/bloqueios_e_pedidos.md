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

## 5. [MÉDIO] CRM não identificado
- Não encontramos nenhum conector de CRM (HubSpot, RD Station, etc.) nas
  integrações disponíveis. Existe uma base de leads/clientes fora do
  GA4/Ads/YouTube? Se sim, qual ferramenta e como posso acessá-la (exportação,
  leitura)?

## 6. [BAIXO/A CONFIRMAR] Data e meta da Black Friday
- Assumi Black Friday em 2026-11-27 (convenção padrão). Confirma a data? Existe meta
  comercial (receita, nº de leads, nº de vendas) e investimento planejado em mídia
  para o período? Sem isso, as projeções da seção 16 do escopo ficam limitadas a
  cenários de audiência/tráfego, não de vendas.

## 7. [BAIXO] Data de início do "aquecimento" para BF26
- Existe uma data de início definida para a estratégia de aquecimento deste ano?
  Isso ajuda a segmentar "antes/durante/depois" nas séries temporais.
