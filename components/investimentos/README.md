# Componente `<Investimentos />`

Este componente replica o design dos componentes **Benefícios** e **Bem-Estar**, mas limitado à visualização de *Previdência Privada*.

Fluxo:
1. Hook `useInvestimentos(userId, holeriteRaw)` retorna:
   - linha(s) da tabela `investimentos` se existirem.
   - caso contrário, faz detecção no texto do holerite (*previdência*, PGBL, VGBL).
2. `<Investimentos />` recebe `status` (PJ/CLT) e a lista.
   - Cabeçalho: badge e resumo `X de 1`.
   - Se lista ⁓ 1 item ⇒ mini-tabela (sem paginação).
   - Se lista vazia ⇒ omite tabela, mostra mensagem e avança para cards educativos.
3. Cards “Aprenda com o PIM” e bloc “Agir” reutilizam exatamente as mesmas classes Tailwind & shadcn/ui de Benefícios.

### SQL de migração
Arquivo `supabase/migrations/20250720_create_investimentos_table.sql` cria a tabela com RLS.

### Exemplo de seed
```sql
INSERT INTO investimentos (user_id, asset_class, amount, yield_pct, description)
VALUES ('USER_ID', 'previdencia', 12000, 4.5, 'Épargne retraite privada, vantagem fiscal.');
```

### Lógica zero-investimentos
Se o hook retornar `[]`, o componente pula o quadro de detalhes e exibe diretamente os cards educativos, garantindo sempre conteúdo relevante. 