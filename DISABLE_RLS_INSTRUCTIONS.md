# 🔧 Como Desabilitar RLS Temporariamente

## 📝 Passo a Passo

### 1. Execute o SQL no Supabase Dashboard

1. Acesse o **Supabase Dashboard**: https://supabase.com/dashboard
2. Selecione seu projeto **Dashboard-mycash**
3. Vá em **SQL Editor** (ícone no menu lateral)
4. Clique em **New Query**
5. Copie e cole o conteúdo do arquivo `supabase/disable_rls_temporary.sql`
6. Clique em **Run** (ou pressione `Ctrl + Enter`)

### 2. Confirme que o RLS foi desabilitado

Você deve ver a mensagem:
```
✅ RLS desabilitado temporariamente em todas as tabelas
⚠️ ATENÇÃO: O banco agora está SEM SEGURANÇA!
```

### 3. O sistema agora funcionará sem autenticação!

Após desabilitar o RLS, o `FinanceContext` poderá usar o Supabase mesmo sem `user_id` ou autenticação.

---

## 🔄 Para Reabilitar RLS Depois

Quando quiser reativar a segurança do banco:

1. Vá no **SQL Editor** do Supabase Dashboard
2. Execute o conteúdo do arquivo `supabase/enable_rls.sql`
3. Confirme a mensagem: `✅ RLS reabilitado em todas as tabelas`

---

## ⚠️ IMPORTANTE

- **NÃO USE em produção!** O RLS desabilitado remove toda a segurança do banco.
- **Use apenas para desenvolvimento local** sem autenticação.
- **Reabilite o RLS** antes de fazer deploy para produção.

---

## 📁 Arquivos SQL

- `supabase/disable_rls_temporary.sql` - Desabilita RLS
- `supabase/enable_rls.sql` - Reabilita RLS
