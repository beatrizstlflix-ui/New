# Taxonomia de séries de conteúdo

Criada em 2026-09-10 a pedido do usuário: separar as visões por série, com
**Arena 3D** isolada e os vídeos de entrevista/case (apresentados por Lincoln)
agrupados como **Série Vivendo de Impressão 3D**. Classificação manual por
título e formato — não é regex genérico — para evitar juntar vídeos que só
compartilham uma palavra-chave. Dados em `data/processed/series_views.json`,
script em `scripts/build_series_views.py`.

## Arena 3D (3 vídeos)
Formato de competição/desafio entre participantes vendendo impressão 3D em um
prazo determinado (loja física, TikTok Shop, Shopee).
- `X7ngtI2GV3g` — Impressão 3D do Zero ao Lucro: 3 Caminhos diferentes, R$6.000 Cada | EP01 (2026-08-19)
- `YueS6DDvdpk` — Em 1 Semana a Primeira Venda... | EP02 (2026-08-29)
- `W4K2JKlIllw` — Em 2 semanas Todos Venderam... | EP 03 (2026-09-05)

Série muito recente (começou em 19/08/2026) — só 3 episódios até a coleta.

## Série Vivendo de Impressão 3D (22 vídeos)
Entrevistas de estúdio/campo com pessoas reais contando como monetizam com
impressão 3D — history-driven, formato "Como Vender Impressão 3D EPxx" mais
vídeos avulsos do mesmo formato e época (2026-02 a 2026-09). Nome dado pelo
usuário; internamente a conta de Google Ads já tinha uma lista de remarketing
chamada "Série Lincoln" (ver `docs/auditoria_publicos_remarketing.md`),
provavelmente referência ao apresentador que conduz as entrevistas.

Lista completa com vídeo_id e título em `data/processed/series_views.json`.

### Casos de fronteira — NÃO incluídos, a confirmar com o usuário
- `jYZ6RQay4QY` — "O nicho que fez esse casal lucrar com impressão 3D!" —
  menciona um casal real, mas é mais curto (6:53) e soa mais como dica do que
  entrevista completa. **Pergunta**: entra na série?
- `5nsR9qi9ndA` — "Como Faturei R$5 Milhões com Impressão 3D (e o que deu
  errado)" — narrativa em primeira pessoa ("faturEI"), parece ser o fundador
  falando de si mesmo, não um convidado entrevistado. **Pergunta**: é um
  formato diferente (fundador) ou também é Lincoln entrevistando alguém?

### Não incluídos por serem formato diferente (dicas/institucional, confirmado)
Vídeos educacionais de dica rápida com o mesmo tema de dinheiro/lucro mas sem
entrevista de convidado: "Como Precificar Produtos...", "Top 5 Nichos
LUCRATIVOS...", "3 Truques Simples...", "1kg de PLA por R$55?", "História da
STLFLIX - Como tudo começou!" (institucional, não é entrevista de terceiro).

## Achado ao cruzar com mídia paga
- **Série Vivendo de Impressão 3D concentra R$ 47.639,95 dos R$ 129.617,08
  investidos em mídia nos últimos 90 dias — 36,8% de todo o investimento em
  mídia da conta**, em apenas 20 dos ~40 vídeos ativos em campanha.
- 20 dos 22 vídeos da série já foram promovidos; os 2 sem mídia são os mais
  recentes (17/06 e 08/09/2026) — ainda não tiveram tempo de entrar em campanha.
- **Padrão de queda de investimento ao longo do tempo**: episódios de
  maio-junho/2026 receberam R$4.000-5.000 cada; os de julho-agosto caíram para
  R$800-2.200 — pode ser desaceleração deliberada ou sinal de fadiga de
  criativo. Vale investigar antes de decidir se a série continua sendo o
  carro-chefe de mídia paga para a Black Friday.
- Arena 3D é recente demais (3 episódios, R$ 2.397,80 em mídia) para
  conclusões — acompanhar os próximos episódios.
