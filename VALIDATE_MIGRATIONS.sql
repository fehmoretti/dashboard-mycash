-- ============================================
-- ✅ VALIDAÇÃO DAS MIGRATIONS - mycash+ v2.0
-- ============================================
-- Execute estas queries para validar que todas as migrations foram aplicadas corretamente
-- ============================================

-- 1. Verificar Enums Criados (deve retornar 4)
-- ============================================
SELECT typname as enum_name 
FROM pg_type 
WHERE typname IN (
  'transaction_type',
  'account_type',
  'recurrence_frequency',
  'transaction_status'
)
ORDER BY typname;

-- 2. Verificar Tabelas Criadas (deve retornar 6)
-- ============================================
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN (
  'users',
  'family_members',
  'categories',
  'accounts',
  'transactions',
  'recurring_transactions'
)
ORDER BY table_name;

-- 3. Verificar Índices Criados (deve retornar pelo menos 10)
-- ============================================
SELECT indexname 
FROM pg_indexes 
WHERE schemaname = 'public' 
AND indexname LIKE 'idx_%'
ORDER BY indexname;

-- 4. Verificar RLS Habilitado (deve retornar 6 tabelas com rowsecurity = true)
-- ============================================
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN (
  'users', 
  'family_members', 
  'categories', 
  'accounts', 
  'transactions', 
  'recurring_transactions'
)
ORDER BY tablename;

-- 5. Verificar Políticas RLS Criadas
-- ============================================
SELECT schemaname, tablename, policyname 
FROM pg_policies 
WHERE schemaname = 'public'
AND tablename IN (
  'users',
  'family_members',
  'categories',
  'accounts',
  'transactions',
  'recurring_transactions'
)
ORDER BY tablename, policyname;

-- 6. Verificar Storage Buckets Criados (deve retornar 3)
-- ============================================
SELECT id, name, public 
FROM storage.buckets
ORDER BY id;

-- 7. Verificar Políticas de Storage
-- ============================================
SELECT policyname 
FROM pg_policies 
WHERE schemaname = 'storage' 
AND tablename = 'objects'
ORDER BY policyname;

-- 8. Verificar Funções e Triggers
-- ============================================
-- Verificar função update_updated_at_column
SELECT routine_name 
FROM information_schema.routines 
WHERE routine_schema = 'public' 
AND routine_name = 'update_updated_at_column';

-- Verificar triggers
SELECT trigger_name, event_object_table 
FROM information_schema.triggers 
WHERE trigger_schema = 'public'
AND event_object_table IN (
  'users',
  'family_members',
  'categories',
  'accounts',
  'transactions',
  'recurring_transactions'
)
ORDER BY event_object_table, trigger_name;
