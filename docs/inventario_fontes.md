# Inventário de fontes de dados

Levantado em 2026-09-10 via Windsor.ai MCP (conta beatrizstlflixgmailcom, plano
Trial) conectado a esta sessão.

| Fonte | Conector Windsor | Conta/Propriedade | Status | Observação |
|---|---|---|---|---|
| YouTube | `youtube` | id 33428, `beatrizstlflix@gmail.com` | **BLOQUEADO** | Autenticado no canal pessoal vazio ("Beatriz stlflix", 0 inscritos/vídeos), não no canal STLFLIX BR (`UCb3H1VIsLk9l6xAz6eyyLwQ`, confirmado via video_channel_id nos anúncios do Google Ads). Ver `bloqueios_e_pedidos.md`. |
| YouTube (modo API key, sem OAuth) | direto via `googleapis.com/youtube/v3` (fora do Windsor) | Chave fornecida pelo usuário | **BLOQUEADO (chave inválida)** | `.env.local` criado (gitignored) com `YOUTUBE_API_KEY` e `YOUTUBE_CHANNEL_ID=UCb3H1VIsLk9l6xAz6eyyLwQ`. Chamada de teste retornou `API_KEY_INVALID` — provável erro de transcrição ao ler a chave de um screenshot. Mesmo se corrigida, este modo só dá estatísticas públicas vitalícias (sem filtro de período, sem origem de tráfego, sem retenção). |
| Google Ads | `google_ads` | 445-144-0907 "STLFLIX Brasil" | **OK — dados reais extraídos** | 80 campanhas históricas, ~40 ativas/pausadas com atividade nos últimos 90d. Ver `registro_extracoes.md`. Outras contas do MCC (Inglês, Francês, Espanhol) existem mas fora do escopo BR. |
| GA4 | `googleanalytics4` | 530533972 "LP - AMBIENTE BR" | **OK — dados reais extraídos** | Canal de aquisição, sessões, usuários, conversões (purchase). Eventos qualify_lead/close_convert_lead configurados mas nunca disparados (ver `decisoes_metodologicas.md`). |
| GA4 | `googleanalytics4` | 530495512 "GET - AMBIENTE GLOBAL" | Disponível, não priorizado | Propriedade global (todos os países/idiomas); não tem os campos de conversão custom da BR. Usar apenas para contexto, nunca atribuir a dados desta propriedade como "Brasil". |
| ClickUp | `clickup_api` | id 1286 | Não explorado | Possível fonte de gestão de projeto/conteúdo, não CRM comercial. A confirmar utilidade. |
| Meta Ads | — | — | **Não conectado** (requer autorização OAuth fora desta sessão) | GA4 mostra "Paid Social" como maior canal pago de sessões no site — precisa ser confirmado se é Meta. Ver `bloqueios_e_pedidos.md`. |
| Stripe | — | — | **Não conectado** (requer autorização fora desta sessão) | Possível fonte de "clientes existentes" / dados de pagamento reais. |
| CRM (HubSpot/Salesforce/etc.) | — | — | **Não identificado** | Nenhum conector de CRM encontrado nas integrações disponíveis. A confirmar se existe fora do Windsor. |
| Arquivos locais no ambiente | — | — | Nenhum export pré-existente encontrado | Repositório continha apenas o app Next.js (dashboard anterior, nunca configurado com credenciais reais) — ver README original. |

## Repositório de código
`beatrizstlflix-ui/new` — já continha um dashboard Next.js (orgânico + pago) com 3
modos (OAuth YouTube, API key YouTube, demo). Nunca foi configurado com credenciais
reais antes desta sessão (`.env.local` não existia). Reaproveitado como base técnica.
