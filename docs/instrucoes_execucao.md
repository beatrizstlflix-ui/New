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
Acesse http://localhost:3000. **Nesta fase, o dashboard ainda usa a versão anterior
(demo/API própria)** — a versão com os dados reais tratados nesta auditoria está em
construção (task #7 da lista de tarefas). Ver `plano_execucao.md`.

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
