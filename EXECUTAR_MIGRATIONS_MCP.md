# 🚀 Executar Migrations via MCP Supabase

## ✅ Status

Todas as migrations SQL estão prontas e localizadas em:
- **`supabase/ALL_MIGRATIONS_CONSOLIDATED.sql`** - Arquivo consolidado (RECOMENDADO)
- Ou arquivos individuais em `supabase/migrations/` e `supabase/storage/`

---

## 📋 Como Executar via MCP Supabase

### Opção 1: Executar Arquivo Consolidado (Mais Rápido)

Execute o arquivo **`supabase/ALL_MIGRATIONS_CONSOLIDATED.sql`** que contém todas as migrations em ordem:

1. Abra o arquivo `supabase/ALL_MIGRATIONS_CONSOLIDATED.sql`
2. Copie TODO o conteúdo SQL
3. Execute via MCP Supabase em um único comando

**Este arquivo executa na ordem correta:**
- ✅ 001: Enums (transaction_type, account_type, recurrence_frequency, transaction_status)
- ✅ 002: Tabelas (users, family_members, categories, accounts, transactions, recurring_transactions)
- ✅ 003: Índices (para performance)
- ✅ 004: RLS (Row Level Security - políticas de acesso)
- ✅ 005: Storage Buckets (avatars, account-logos, documents)

---

### Opção 2: Executar Arquivos Individuais (Para Debug)

Execute cada arquivo **na ordem exata** abaixo:

1. `supabase/migrations/001_create_enums.sql`
2. `supabase/migrations/002_create_tables.sql`
3. `supabase/migrations/003_create_indexes.sql`
4. `supabase/migrations/004_create_rls.sql`
5. `supabase/storage/buckets.sql`

---

## ✅ Validação Após Execução

Após executar as migrations, valide:

### 1. Verificar Enums (4 enums)
```sql
SELECT typname FROM pg_type WHERE typname IN (
  'transaction_type',
  'account_type',
  'recurrence_frequency',
  'transaction_status'
);
```

### 2. Verificar Tabelas (6 tabelas)
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

### 3. Verificar Storage Buckets (3 buckets)
```sql
SELECT id, name, public FROM storage.buckets;
```

---

## ⚠️ Ordem Obrigatória

**NUNCA execute fora de ordem!** A ordem é crítica:
1. Enums → 2. Tabelas → 3. Índices → 4. RLS → 5. Storage

---

## 📝 Arquivo Consolidado

O arquivo **`supabase/ALL_MIGRATIONS_CONSOLIDATED.sql`** está pronto e contém:
- ✅ 448 linhas de SQL
- ✅ Todas as migrations em ordem
- ✅ Comentários explicativos
- ✅ Seguro para re-execução (usa `ON CONFLICT DO NOTHING`)

---

## 🎯 Próximos Passos Após Executar

1. ✅ Validar que todas as tabelas foram criadas
2. ✅ Configurar variáveis de ambiente (`.env.local`)
3. ✅ Testar conexão com Supabase
4. ✅ Começar a usar os services (`transactionService`, `accountService`, etc.)
