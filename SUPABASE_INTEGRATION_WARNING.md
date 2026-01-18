# ⚠️ IMPORTANTE: Integração com Supabase

## 🔐 Políticas RLS (Row Level Security)

**As políticas RLS do Supabase exigem autenticação (`auth.uid()`)!**

Isso significa que:
- ✅ Para usar o Supabase **com dados persistidos**, você precisa estar autenticado
- ⚠️ Se não houver autenticação, o sistema usará dados **mock** (não persistidos)

## 🎯 Solução Implementada

O sistema está configurado para:
1. **Tentar usar Supabase** se houver:
   - Credenciais configuradas (`VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`)
   - Usuário autenticado (`user_id` disponível)

2. **Usar dados mock** se não houver:
   - Credenciais do Supabase
   - Usuário autenticado
   - Ou se as requisições falharem

## 📝 Opções para Usar Supabase Sem Login

### Opção 1: Desabilitar RLS Temporariamente (Desenvolvimento)

**⚠️ ATENÇÃO: Isso remove toda a segurança do banco!**

```sql
-- Desabilitar RLS em todas as tabelas
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE family_members DISABLE ROW LEVEL SECURITY;
ALTER TABLE categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE accounts DISABLE ROW LEVEL SECURITY;
ALTER TABLE transactions DISABLE ROW LEVEL SECURITY;
ALTER TABLE recurring_transactions DISABLE ROW LEVEL SECURITY;
```

**⚠️ NÃO RECOMENDADO para produção!**

### Opção 2: Criar Usuário Mock no Banco

1. Criar um usuário manualmente no Supabase Auth
2. Usar esse `user_id` quando não houver autenticação
3. O sistema funcionará com esse usuário mock

### Opção 3: Modificar Políticas RLS (Permissivo)

**⚠️ ATENÇÃO: Isso permite acesso sem autenticação!**

Criar políticas que permitam acesso sem `auth.uid()`:

```sql
-- Permitir acesso público temporariamente (APENAS DESENVOLVIMENTO)
DROP POLICY IF EXISTS "Users can manage own family members" ON family_members;
CREATE POLICY "Public access for development"
ON family_members FOR ALL
USING (true)
WITH CHECK (true);

-- Repetir para outras tabelas...
```

**⚠️ NÃO RECOMENDADO para produção!**

### Opção 4: Implementar Autenticação Simples (Recomendado)

Criar uma tela de login simples que:
- Permite criar conta anonimamente
- Ou usa autenticação via email/senha
- Garante que sempre há um `user_id`

## 🚀 Recomendação

**Para usar o Supabase completamente**, recomendo:
1. ✅ Criar uma tela de login simples
2. ✅ Permitir registro/login
3. ✅ Usar o `user_id` do usuário autenticado

Isso garantirá que:
- ✅ Dados são persistidos no Supabase
- ✅ Políticas RLS funcionam corretamente
- ✅ Segurança do banco está mantida

---

## 📚 Status Atual

O `FinanceContext` está configurado para:
- ✅ **Tentar usar Supabase** quando há credenciais e `user_id`
- ✅ **Fallback para mock** quando não há credenciais ou `user_id`
- ✅ **Funcionar sem erros** em ambos os casos
