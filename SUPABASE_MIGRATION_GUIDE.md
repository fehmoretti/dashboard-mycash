# 📋 Guia de Execução das Migrations SQL - Supabase

## 🎯 Objetivo
Este guia explica como executar as migrations SQL criadas no Supabase para configurar o banco de dados.

---

## 📍 Localização dos Arquivos SQL

Os arquivos de migration estão localizados em:
```
supabase/
├── migrations/
│   ├── 001_create_enums.sql
│   ├── 002_create_tables.sql
│   ├── 003_create_indexes.sql
│   └── 004_create_rls.sql
└── storage/
    └── buckets.sql
```

---

## 🚀 Opções de Execução

### Opção 1: Via Supabase Dashboard (Recomendado)

1. Acesse o [Supabase Dashboard](https://app.supabase.com)
2. Selecione seu projeto
3. Vá em **SQL Editor** (menu lateral esquerdo)
4. Execute cada arquivo SQL na seguinte ordem:
   - `001_create_enums.sql`
   - `002_create_tables.sql`
   - `003_create_indexes.sql`
   - `004_create_rls.sql`
   - `storage/buckets.sql`

### Opção 2: Via MCP Supabase (se disponível)

Se você tiver o MCP do Supabase configurado, pode executar via terminal:

```bash
# Executar cada migration em ordem
# (Exemplo - ajuste conforme sua configuração MCP)
mcp-supabase execute-migration 001_create_enums.sql
mcp-supabase execute-migration 002_create_tables.sql
mcp-supabase execute-migration 003_create_indexes.sql
mcp-supabase execute-migration 004_create_rls.sql
mcp-supabase execute-migration storage/buckets.sql
```

### Opção 3: Via Supabase CLI

Se você tiver o Supabase CLI instalado localmente:

```bash
# Conectar ao projeto remoto
supabase link --project-ref your-project-ref

# Executar migrations
supabase db push
```

---

## ✅ Verificação Pós-Migration

Após executar as migrations, verifique no Supabase Dashboard:

1. **Tables**: Vá em **Table Editor** e verifique se todas as tabelas foram criadas:
   - `users`
   - `family_members`
   - `categories`
   - `accounts`
   - `transactions`
   - `recurring_transactions`

2. **Storage**: Vá em **Storage** e verifique se os buckets foram criados:
   - `avatars`
   - `account-logos`
   - `documents`

3. **RLS**: Vá em **Authentication > Policies** e verifique se as políticas RLS estão ativas em todas as tabelas.

4. **Enums**: Execute este SQL para verificar os enums:
   ```sql
   SELECT typname FROM pg_type WHERE typname IN (
     'transaction_type',
     'account_type',
     'recurrence_frequency',
     'transaction_status'
   );
   ```

---

## ⚠️ Ordem de Execução Importante

**NUNCA execute as migrations fora de ordem!** A ordem é:

1. `001_create_enums.sql` - Cria os tipos ENUM
2. `002_create_tables.sql` - Cria as tabelas (depende dos enums)
3. `003_create_indexes.sql` - Cria índices (depende das tabelas)
4. `004_create_rls.sql` - Configura RLS (depende das tabelas)
5. `storage/buckets.sql` - Cria buckets (independente)

---

## 🔧 Troubleshooting

### Erro: "type does not exist"
- **Causa**: Enums não foram criados
- **Solução**: Execute `001_create_enums.sql` primeiro

### Erro: "relation does not exist"
- **Causa**: Tabelas não foram criadas
- **Solução**: Execute `002_create_tables.sql`

### Erro: "permission denied"
- **Causa**: RLS bloqueando operações
- **Solução**: Verifique se `004_create_rls.sql` foi executado corretamente

### Erro: "bucket does not exist"
- **Causa**: Buckets não foram criados
- **Solução**: Execute `storage/buckets.sql`

---

## 📝 Notas Importantes

1. **Backup**: Faça backup do banco antes de executar migrations em produção
2. **Teste**: Teste primeiro em ambiente de desenvolvimento/staging
3. **Validação**: Valide cada migration individualmente antes de prosseguir
4. **Rollback**: Mantenha os scripts SQL originais para possível rollback

---

## 📚 Recursos

- [Supabase SQL Editor](https://app.supabase.com/project/_/sql)
- [Supabase Migrations Guide](https://supabase.com/docs/guides/cli/local-development#database-migrations)
- [Supabase RLS Documentation](https://supabase.com/docs/guides/auth/row-level-security)
