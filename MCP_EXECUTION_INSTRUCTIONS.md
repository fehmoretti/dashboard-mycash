# 🚀 Instruções para Execução via MCP Supabase

## 📋 Preparação

Todos os arquivos SQL de migration estão prontos em `supabase/migrations/` e `supabase/storage/`.

---

## ✅ Opção 1: Executar Arquivo Consolidado (Recomendado)

**Arquivo**: `supabase/ALL_MIGRATIONS_CONSOLIDATED.sql`

Este arquivo contém **TODAS as migrations em ordem** e pode ser executado de uma vez via MCP do Supabase.

### Passos:
1. Abra o arquivo `supabase/ALL_MIGRATIONS_CONSOLIDATED.sql`
2. Copie todo o conteúdo SQL
3. Execute via MCP do Supabase em um único comando

---

## ✅ Opção 2: Executar Arquivos Individuais (Recomendado para Debug)

Execute cada arquivo SQL **na ordem exata** abaixo:

### Migration 001: Enums
**Arquivo**: `supabase/migrations/001_create_enums.sql`
```bash
# Execute este primeiro - cria os tipos ENUM
```

### Migration 002: Tabelas
**Arquivo**: `supabase/migrations/002_create_tables.sql`
```bash
# Execute após 001 - cria todas as tabelas
```

### Migration 003: Índices
**Arquivo**: `supabase/migrations/003_create_indexes.sql`
```bash
# Execute após 002 - cria índices para performance
```

### Migration 004: RLS
**Arquivo**: `supabase/migrations/004_create_rls.sql`
```bash
# Execute após 002 - habilita Row Level Security
```

### Migration 005: Storage
**Arquivo**: `supabase/storage/buckets.sql`
```bash
# Execute por último - cria buckets de storage
```

---

## ⚠️ Ordem Obrigatória

**NUNCA execute fora de ordem!**

```
001_create_enums.sql → 002_create_tables.sql → 003_create_indexes.sql → 004_create_rls.sql → storage/buckets.sql
```

---

## ✅ Validação Pós-Execução

Após executar as migrations, valide:

### 1. Verificar Enums (4 enums):
```sql
SELECT typname FROM pg_type WHERE typname IN (
  'transaction_type',
  'account_type',
  'recurrence_frequency',
  'transaction_status'
);
```

### 2. Verificar Tabelas (6 tabelas):
```sql
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN (
  'users',
  'family_members',
  'categories',
  'accounts',
  'transactions',
  'recurring_transactions'
);
```

### 3. Verificar Índices:
```sql
SELECT indexname FROM pg_indexes 
WHERE schemaname = 'public' 
AND indexname LIKE 'idx_%';
```

### 4. Verificar RLS:
```sql
SELECT tablename, rowsecurity FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN (
  'users', 'family_members', 'categories', 
  'accounts', 'transactions', 'recurring_transactions'
);
```

### 5. Verificar Storage Buckets (via Dashboard ou SQL):
```sql
SELECT id, name, public FROM storage.buckets;
```

---

## 📝 Notas Importantes

1. **Primeira Execução**: Execute todos os arquivos em ordem pela primeira vez
2. **Re-execução**: Os arquivos usam `ON CONFLICT DO NOTHING` onde apropriado para permitir re-execução segura
3. **Rollback**: Mantenha os arquivos SQL originais para possível rollback manual
4. **Backup**: Sempre faça backup antes de executar migrations em produção

---

## 🐛 Troubleshooting

### Erro: "type does not exist"
- **Causa**: Enums não foram criados
- **Solução**: Execute `001_create_enums.sql` primeiro

### Erro: "relation already exists"
- **Causa**: Migration já foi executada parcialmente
- **Solução**: Continue com as próximas migrations ou limpe as tabelas se necessário

### Erro: "permission denied"
- **Causa**: RLS bloqueando operações ou falta de autenticação
- **Solução**: Verifique se `004_create_rls.sql` foi executado e se há usuário autenticado

---

## 📚 Arquivos Disponíveis

- `supabase/ALL_MIGRATIONS_CONSOLIDATED.sql` - **TODAS** as migrations em um único arquivo (recomendado)
- `supabase/migrations/001_create_enums.sql` - Criação de enums
- `supabase/migrations/002_create_tables.sql` - Criação de tabelas
- `supabase/migrations/003_create_indexes.sql` - Criação de índices
- `supabase/migrations/004_create_rls.sql` - Configuração RLS
- `supabase/storage/buckets.sql` - Criação de storage buckets

---

## ✅ Status

Todos os arquivos SQL estão prontos e testados. Execute via MCP do Supabase conforme sua configuração.
