# Instruções de execução, retomada e atualização

## Retomar este projeto em uma nova sessão
1. Leia, nesta ordem: `docs/escopo_e_objetivos.md`, `docs/bloqueios_e_pedidos.md`,
   `docs/plano_execucao.md`, `docs/perguntas_respondidas_pendentes.md`.
2. Confira `docs/registro_extracoes.md` para saber o que já foi puxado e evitar
   duplicar extrações.
3. Verifique se os bloqueios foram resolvidos (YouTube reconectado no Windsor.ai;
   chave de API válida; respostas às perguntas em `bloqueios_e_pedidos.md`) antes de
   assumir que continuam de pé.
4. Ferramentas usadas: MCP `Windsor_ai` (conectores `youtube`, `google_ads`,
   `googleanalytics4`, `clickup_api`) já autorizado para esta conta. Use
   `get_fields`/`get_options` antes de qualquer `get_data` com campos novos.

## Reproduzir uma extração
Cada arquivo em `data/raw/**` tem um cabeçalho JSON (`source`, `extracted_at`,
`date_from`, `date_to`, `fields`) — use exatamente esses parâmetros no `get_data`
para reproduzir. Resultados grandes (>~150KB) são salvos em arquivo pelo próprio
ambiente; copie para `data/raw/<fonte>/` e processe com um script em `scripts/`
(ver `process_google_ads_video.py` e `process_ga4_monthly.py` como modelo) — nunca
carregue arquivos grandes inteiros na conversa.

## Rodar o dashboard localmente
```bash
cd /home/user/New
npm install
npm run dev
```
Acesse http://localhost:3000 para o dashboard antigo (demo/API própria, não usado
nesta auditoria) e http://localhost:3000/auditoria para o **dashboard real desta
auditoria** (dados estáticos tratados em `data/processed` + `data/raw`, lidos
diretamente do disco por um Server Component — `app/auditoria/page.tsx` +
`lib/auditData.ts`). Sem chamadas de API em tempo de execução: para atualizar os
números, é preciso reprocessar os dados (ver seção seguinte) e rodar
`npm run build` de novo.

**Nota de validação**: ao testar localmente com `npm run start`, se você já tiver
rodado `npm run build` mais de uma vez com um servidor antigo ainda de pé na mesma
porta, o `next start` novo falha silenciosamente com `EADDRINUSE` e o navegador
continua servido pelo processo antigo — os chunks JS do build novo não batem com o
HTML do processo antigo e os gráficos (recharts) ficam em branco (`ChunkLoadError`
no console, React error #423). Sempre confirme com
`ps aux | grep next-server` que só existe um processo antes de testar, ou pare tudo
(`pkill -f "next start"`) e suba de novo.

## Atualizar os dados no futuro
1. Repetir os `get_data` do Windsor.ai com o período desejado (mesmos campos —
   `registro_extracoes.md`).
2. Salvar o raw em `data/raw/<fonte>/`, nunca sobrescrevendo um raw já existente com
   outro período (nomeie o arquivo com o período, como já feito).
3. Rodar/atualizar o script de processamento correspondente em `scripts/` para gerar
   a versão tratada em `data/processed/`.
4. Reiniciar o dashboard (ele lê de `data/processed/`, quando essa etapa estiver
   implementada) ou fazer o deploy novamente.

## Segurança
- Nunca commitar `.env.local` (já no `.gitignore`).
- Qualquer credencial colada em chat deve ser tratada como potencialmente exposta —
  restringir/regenerar assim que possível (ver README original do projeto).
- Nenhum dado sensível (e-mail, telefone de comentaristas, etc.) deve aparecer no
  dashboard.
