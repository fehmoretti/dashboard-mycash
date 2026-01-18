# 🚀 Execução de Migrations via MCP Supabase

## 📋 Status

Todos os arquivos SQL de migration estão prontos e localizados em `supabase/migrations/` e `supabase/storage/`.

---

## 📁 Arquivos SQL Prontos para Execução

### Migrations (executar nesta ordem):

1. **`supabase/migrations/001_create_enums.sql`**
   - Cria enums: `transaction_type`, `account_type`, `recurrence_frequency`, `transaction_status`
   - ⚠️ **DEVE SER O PRIMEIRO**

2. **`supabase/migrations/002_create_tables.sql`**
   - Cria tabelas: `users`, `family_members`, `categories`, `accounts`, `transactions`, `recurring_transactions`
   - Depende dos enums criados em 001

3. **`supabase/migrations/003_create_indexes.sql`**
   - Cria índices para otimização
   - Depende das tabelas criadas em 002

4. **`supabase/migrations/004_create_rls.sql`**
   - Habilita RLS e cria políticas de segurança
   - Depende das tabelas criadas em 002

5. **`supabase/storage/buckets.sql`**
   - Cria buckets: `avatars`, `account-logos`, `documents`
   - Cria políticas de storage
   - Pode ser executado independentemente

---

## 🔧 Como Executar via MCP Supabase

Se você tiver o MCP do Supabase configurado, pode executar os SQLs das seguintes formas:

### Opção 1: Executar cada arquivo individualmente

Para cada arquivo SQL:
1. Leia o conteúdo do arquivo
2. Execute o SQL através do MCP do Supabase
3. Verifique sucesso antes de prosseguir

### Opção 2: Executar em lote (se suportado pelo seu MCP)

Execute todas as migrations na ordem listada acima.

---

## ⚠️ Ordem Obrigatória

**NUNCA execute fora de ordem:**

```
001_create_enums.sql → 002_create_tables.sql → 003_create_indexes.sql → 004_create_rls.sql → storage/buckets.sql
```

---

## ✅ Validação Pós-Execução

Após executar todas as migrations, verifique:

1. **Tabelas criadas** (6 tabelas):
   - `users`
   - `family_members`
   - `categories`
   - `accounts`
   - `transactions`
   - `recurring_transactions`

2. **Enums criados** (4 enums):
   ```sql
   SELECT typname FROM pg_type WHERE typname IN (
     'transaction_type',
     'account_type',
     'recurrence_frequency',
     'transaction_status'
   );
   ```

3. **Storage buckets** (3 buckets):
   - `avatars`
   - `account-logos`
   - `documents`

4. **RLS habilitado** em todas as 6 tabelas

---

## 📝 Notas

- Todos os arquivos SQL estão completos e prontos para execução
- Os arquivos incluem comentários explicativos
- As migrations usam `ON CONFLICT DO NOTHING` onde apropriado para permitir re-execução segura
- As políticas RLS garantem que usuários só acessam seus próprios dados

---

## 🐛 Troubleshooting

Se encontrar erros durante a execução:

- **"type does not exist"**: Execute `001_create_enums.sql` primeiro
- **"relation already exists"**: A migration já foi executada (pode continuar com as próximas)
- **"permission denied"**: Verifique se as políticas RLS foram criadas corretamente
