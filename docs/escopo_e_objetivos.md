# Escopo e Objetivos — Auditoria YouTube STLFLIX Brasil rumo à Black Friday

## Pergunta principal
Estamos construindo uma audiência qualificada, recorrente e acionável para a Black
Friday, e qual é a contribuição da mídia paga (YouTube/Google Ads) para isso? Estamos
comprando visualizações ou construindo relacionamento, intenção e possibilidade real
de conversão futura?

## Negócio e ofertas (confirmado nos dados, não presumido)
A conta Google Ads "STLFLIX Brasil" (445-144-0907) tem campanhas segmentadas por
frente de produto claramente distintas — não tratar como uma oferta única:
- **Impressoras 3D** (Search/Shopping/PMax por marca: Bambulab, Creality, Flashforge,
  Snapmaker, modelos P1S/A1 mini/X1C) — e-commerce.
- **Cursos** (Search "[Curso]", incl. versões em outros idiomas/mercados).
- **Filamentos** (Shopping/Search).
- **Conteúdo "vídeo-reconhecimento"**: dezenas de campanhas VIDEO, uma por vídeo,
  contando histórias de alunos/clientes que monetizam com impressão 3D — objetivo de
  topo de funil (reconhecimento/inscrição), não venda direta.
- **Black Friday**: já existem campanhas de BF do ano anterior (BF25) identificadas,
  iniciadas entre 2025-10-16 e 2025-10-30 — ver `docs/registro_extracoes.md`.

### Ofertas confirmadas por landing page (GA4, tráfego real, últimos 90 dias)
Evita presumir uma oferta única — as páginas de destino reais mostram pelo menos:
- `/assine` e `/assine-stlai`: assinatura/curso (produto recorrente).
- `/lote-especial` (e variações `-2`, `-cta`): oferta de lote/pacote especial —
  maior concentração de sessões de vídeo (orgânico e pago) das páginas analisadas.
- `/aniversario-stlflix-4-anos` (e variações): campanha sazonal de aniversário,
  não é a Black Friday.
- `/central-de-links-live` e `/central-de-links-whatsapp`: hubs de link
  (provavelmente para live/comunidade/WhatsApp, não venda direta).
- `/cotrim-kit-catalogo`: catálogo de kit associado a um parceiro/criador
  específico ("Cotrim") — possível parceria de afiliado/influenciador.
Ver `data/processed/ga4_landing_pages_last90d.json` para a lista completa.

Uma pessoa perto de comprar uma impressora está em estágio diferente de alguém que já
imprime e busca modelos/monetização. Isso deve ser respeitado na segmentação de
narrativas e na leitura do funil (não presumir jornada única).

## Camadas de audiência (terminologia usada neste projeto)
Espectadores → Inscritos → Audiência ativa → Audiência recorrente → Elegível p/
remarketing → Leads identificados e contatáveis → Clientes existentes → Novos
compradores. Essas categorias **não são equivalentes nem automaticamente conectadas**
e serão tratadas separadamente em todas as análises.

## Escopo temporal (calculado em 2026-09-10, ver `decisoes_metodologicas.md`)
- Ano corrente: 2026-01-01 a 2026-09-09 (última data completa).
- Últimos 90 dias: 2026-06-12 a 2026-09-09.
- Últimos 28 dias: 2026-08-13 a 2026-09-09. Anteriores 28 dias: 2026-07-16 a 2026-08-12.
- Black Friday 2026: sexta-feira 2026-11-27 (a confirmar com o usuário — ver
  `bloqueios_e_pedidos.md`). Dias restantes a partir de hoje: ~78.
- Black Friday anterior (BF25): há campanhas nomeadas BF25 na conta de Ads — dados
  comparáveis existem, extração ainda pendente de aprofundamento.

## Escopo geográfico
Prioridade Brasil. Conta Google Ads "STLFLIX Brasil" e propriedade GA4
"LP - AMBIENTE BR" são os recortes usados como BR. Quando um relatório não permitir
filtro geográfico (ex.: YouTube Analytics sem filtro de país aplicado), isso será
declarado explicitamente nos componentes do dashboard.

## Fora de escopo / não autorizado
Não alteramos campanhas, públicos, conversões, vídeos ou configurações. Qualquer
mudança é registrada como proposta em `docs/plano_execucao.md` /
recomendações, para implementação posterior pelo usuário.
