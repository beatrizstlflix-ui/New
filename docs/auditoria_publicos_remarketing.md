# Auditoria de públicos (remarketing) — Google Ads, conta STLFLIX Brasil

Fonte: `data/raw/google_ads/br_user_lists_remarketing.json` (extraído 2026-09-10).
Tamanhos são um retrato atual (não há histórico de evolução disponível nesta
extração — ver limitação no fim).

| Público | Tipo | Regra/origem | Tamanho (Search) | Tamanho (Display) | Duração (dias) | Status |
|---|---|---|---|---|---|---|
| Todos os visitantes (AdWords) | RULE_BASED | Visitou páginas com tag de remarketing | 304.000 | 140.000 | 120 | OPEN |
| Visitantes Ecom STLFLIX | RULE_BASED | (sem descrição) | 312.000 | 120.000 | 2.160 (~6 anos) | OPEN |
| All Users of STLFLIX Geral | REMARKETING | Todos os usuários (site "Geral") | 420.000 | 168.000 | 1.080 (~3 anos) | OPEN |
| All Users of SLFLIX - PT | REMARKETING | Todos os usuários (site PT) | 440.000 | 190.000 | 1.080 | OPEN |
| **Visualização-Vídeo-Youtube_180d** | RULE_BASED | Visualização de vídeo do canal, 180d | 6.000.000 | 0 | 1.080 | OPEN |
| **Visualização-Vídeo-Youtube_90d** | RULE_BASED | idem, 90d | 2.760.000 | 0 | 540 | OPEN |
| **Visualização-Vídeo-Youtube_30d** | RULE_BASED | idem, 30d | 560.000 | 0 | 120 | OPEN |
| Visualização_Vídeo-Aniversário | RULE_BASED | Espectadores da campanha de aniversário | 36.000 | 0 | 60 | OPEN |
| RMKT 180d \| Videoview \| Série Lincoln | RULE_BASED | Espectadores de uma série específica | 24.000 | 0 | 360 | OPEN |
| General visitors (Retail) | RULE_BASED | Visitou site, sem ver produto específico | 50.000 | 70.000 | 60 | OPEN |
| **ALL_Clientes [Outubro]** | **CRM_BASED** | Upload de lista de clientes (Customer Match) | 30.000 | 28.000 | 1.080 | OPEN |
| Purchasers of SLFLIX - PT | REMARKETING | Compraram nos últimos 540 dias | 32.000 | 8.600 | 1.080 | OPEN |
| Purchasers of STLFLIX Geral | REMARKETING | Compraram nos últimos 540 dias | 3.000 | 480 | 1.080 | OPEN |
| Past buyers (Retail) | RULE_BASED | Comprou no passado | 340 | 440 | 60 | OPEN |
| All Converters | RULE_BASED | Converteu no site | 1.060 | 640 | 360 | OPEN |
| All Users of stlacademy | REMARKETING | Todos os usuários (produto "stlacademy" — curso?) | 500 | 176 | 1.080 | OPEN |
| Purchasers of stlacademy | REMARKETING | Comprou stlacademy, últimos 540d | 0 | 0 | 2.700 (~7,4 anos) | OPEN — **vazio** |

## Leitura crítica (não um funil com taxas de passagem — apenas o retrato)

- **O maior público de longe é "visualização de vídeo do YouTube"**: até 6 milhões
  de pessoas (janela de 180 dias) — mas isso é *audiência dentro da plataforma*
  (visualização), não leads identificados nem visitantes do site. Esse é
  provavelmente o público mais barato/fácil de reimpactar, mas o mais distante de
  uma compra.
- **Único público explicitamente rotulado como CRM ("ALL_Clientes [Outubro]",
  30.000 pessoas, Customer Match)**: confirma que existe (ou existiu) uma base de
  clientes própria carregada no Google Ads em algum mês de outubro (ano não
  indicado no nome). **Pergunta**: qual é a fonte desse arquivo, com que
  frequência é atualizado, e pode ser reconectado/atualizado para a Black Friday
  deste ano? Isso muda a resposta de "temos leads identificados" de "não" para
  "temos uma base própria, mas aparentemente estática/desatualizada".
- **"Purchasers of stlacademy" está com tamanho 0**: ou o produto stlacademy não
  vende há muito tempo, ou a lista parou de ser alimentada — a confirmar.
- **Listas de compradores (remarketing) são pequenas relativas ao tráfego geral**:
  "Purchasers of SLFLIX - PT" (32.000) e "Purchasers of STLFLIX Geral" (3.000) vs.
  "All Users" na casa das centenas de milhares — proporção compradores/visitantes
  baixa, consistente com um negócio de tráfego alto e conversão de e-commerce
  historicamente modesta (ver funil de e-commerce por canal, achado de mensuração
  abaixo).
- **Risco de expiração até a Black Friday (27/11/2026, a confirmar)**: listas de
  30-120 dias (ex.: "Visualização-Vídeo-Youtube_30d", "Todos os visitantes",
  "Visualização_Vídeo-Aniversário") só permanecerão elegíveis se houver atividade
  contínua entre agora e a BF — não presumir que o tamanho atual estará disponível
  em novembro sem manutenção do fluxo de tráfego/visualizações.

## Limitações desta auditoria
- Sem histórico de evolução de tamanho (só o retrato atual — 2026-09-10).
- Sem dado de sobreposição entre listas (ex.: quanto de "Visualização-Vídeo-
  Youtube_30d" já está em "All Users of STLFLIX Geral").
- Sem `user_list_id` de exclusões usadas nas campanhas (não extraído ainda).
- Data de criação de cada lista não disponível nos campos consultados.
