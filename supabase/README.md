# 📋 Supabase Migrations - mycash+ v2.0

## 🎯 Objetivo
Este diretório contém todas as migrations SQL necessárias para criar o banco de dados do mycash+ no Supabase.

---

## 📁 Estrutura de Arquivos

```
supabase/
├── migrations/
│   ├── 001_create_enums.sql       # Criação dos enums (PRIMEIRO)
│   ├── 002_create_tables.sql      # Criação das tabelas (SEGUNDO)
│   ├── 003_create_indexes.sql     # Criação dos índices (TERCEIRO)
│   └── 004_create_rls.sql         # Configuração RLS (QUARTO)
└── storage/
    └── buckets.sql                # Criação dos buckets (ÚLTIMO)
```

---

## 🚀 Como Executar as Migrations

### Opção 1: Via Supabase Dashboard (Recomendado)

1. Acesse o [Supabase Dashboard](https://app.supabase.com)
2. Selecione seu projeto
3. Vá em **SQL Editor** (menu lateral esquerdo)
4. Execute cada arquivo SQL na **ordem exata** abaixo:
   - `001_create_enums.sql` ⭐ **DEVE SER PRIMEIRO**
   - `002_create_tables.sql`
   - `003_create_indexes.sql`
   - `004_create_rls.sql`
   - `storage/buckets.sql`

### Opção 2: Via Supabase CLI

Se você tiver o Supabase CLI instalado:

```bash
# Conectar ao projeto remoto
supabase link --project-ref your-project-ref

# Executar todas as migrations em ordem
supabase db push
```

---

## ⚠️ ORDEM OBRIGATÓRIA

**NUNCA execute as migrations fora de ordem!** A ordem é crítica:

1. **`001_create_enums.sql`** - Cria os tipos ENUM (necessário para tabelas)
2. **`002_create_tables.sql`** - Cria as tabelas (usa os enums criados)
3. **`003_create_indexes.sql`** - Cria índices (depende das tabelas)
4. **`004_create_rls.sql`** - Configura RLS (depende das tabelas)
5. **`storage/buckets.sql`** - Cria buckets (independente, mas recomendado por último)

---

## ✅ Validação Pós-Migration

Após executar todas as migrations, verifique:

### 1. Tabelas Criadas
No **Table Editor** do Supabase, verifique se existem:
- ✅ `users`
- ✅ `family_members`
- ✅ `categories`
- ✅ `accounts`
- ✅ `transactions`
- ✅ `recurring_transactions`

### 2. Enums Criados
Execute no SQL Editor:
```sql
SELECT typname FROM pg_type 
WHERE typname IN (
  'transaction_type',
  'account_type',
  'recurrence_frequency',
  'transaction_status'
);
```
Deveria retornar 4 linhas.

### 3. Storage Buckets
No **Storage** do Supabase, verifique se existem:
- ✅ `avatars` (público)
- ✅ `account-logos` (público)
- ✅ `documents` (privado)

### 4. RLS Policies
No **Authentication > Policies** do Supabase, verifique se todas as tabelas têm políticas RLS ativas.

---

## 🔧 Troubleshooting

### Erro: "type does not exist"
- **Causa**: Enums não foram criados
- **Solução**: Execute `001_create_enums.sql` primeiro

### Erro: "relation already exists"
- **Causa**: Tabela/enum já existe (migration parcialmente executada)
- **Solução**: Execute `DROP TABLE` ou `DROP TYPE` se necessário, ou continue com as próximas migrations

### Erro: "permission denied"
- **Causa**: RLS bloqueando operações ou falta de autenticação
- **Solução**: Verifique se `004_create_rls.sql` foi executado e se há usuário autenticado

---

## 📝 Notas Importantes

1. **Backup**: Sempre faça backup antes de executar migrations em produção
2. **Teste**: Teste primeiro em ambiente de desenvolvimento/staging
3. **Validação**: Valide cada migration individualmente antes de prosseguir
4. **Rollback**: Mantenha os scripts SQL originais para possível rollback manual

---

## 📚 Recursos

- [Supabase SQL Editor](https://app.supabase.com/project/_/sql)
- [Supabase Migrations Guide](https://supabase.com/docs/guides/cli/local-development#database-migrations)
- [Supabase RLS Documentation](https://supabase.com/docs/guides/auth/row-level-security)
