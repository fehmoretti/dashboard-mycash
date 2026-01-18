-- ============================================
-- ⚠️ DESABILITAR RLS TEMPORARIAMENTE (APENAS DESENVOLVIMENTO)
-- ============================================
-- ATENÇÃO: Isso remove toda a segurança do banco de dados!
-- NÃO USE EM PRODUÇÃO!
-- 
-- Execute este script apenas para desenvolvimento local sem autenticação.
-- Para reabilitar RLS, execute: supabase/enable_rls.sql

-- Desabilitar RLS em todas as tabelas
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE family_members DISABLE ROW LEVEL SECURITY;
ALTER TABLE categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE accounts DISABLE ROW LEVEL SECURITY;
ALTER TABLE transactions DISABLE ROW LEVEL SECURITY;
ALTER TABLE recurring_transactions DISABLE ROW LEVEL SECURITY;

-- Mensagem de confirmação
DO $$
BEGIN
  RAISE NOTICE '✅ RLS desabilitado temporariamente em todas as tabelas';
  RAISE NOTICE '⚠️ ATENÇÃO: O banco agora está SEM SEGURANÇA!';
  RAISE NOTICE '📝 Para reabilitar RLS, execute: supabase/enable_rls.sql';
END $$;
