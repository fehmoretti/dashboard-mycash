-- ============================================
-- ✅ REABILITAR RLS (SEGURANÇA)
-- ============================================
-- Reabilita as políticas de Row Level Security (RLS) em todas as tabelas.
-- Execute este script quando quiser reativar a segurança do banco.

-- Reabilitar RLS em todas as tabelas
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE family_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE recurring_transactions ENABLE ROW LEVEL SECURITY;

-- Mensagem de confirmação
DO $$
BEGIN
  RAISE NOTICE '✅ RLS reabilitado em todas as tabelas';
  RAISE NOTICE '🔐 Segurança do banco restaurada';
END $$;
