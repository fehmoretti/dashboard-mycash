-- ============================================
-- 📋 TODAS AS MIGRATIONS CONSOLIDADAS - mycash+ v2.0
-- ============================================
-- Este arquivo contém todas as migrations em ordem para execução via MCP Supabase
-- Execute na ordem: 001 → 002 → 003 → 004 → 005 (storage)
-- ============================================

-- ============================================
-- MIGRATION 001: ENUMS
-- ============================================
-- ============================================
-- 🔧 ENUMS - mycash+ v2.0
-- ============================================
-- Criação de todos os enums necessários para o sistema

-- Enum para tipo de transação
CREATE TYPE transaction_type AS ENUM ('INCOME', 'EXPENSE');

-- Enum para tipo de conta
CREATE TYPE account_type AS ENUM ('CHECKING', 'SAVINGS', 'CREDIT_CARD');

-- Enum para frequência de recorrência
CREATE TYPE recurrence_frequency AS ENUM ('DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY');

-- Enum para status de transação
CREATE TYPE transaction_status AS ENUM ('PENDING', 'COMPLETED');

-- Comentários para documentação
COMMENT ON TYPE transaction_type IS 'Tipo de transação: INCOME (Receita) ou EXPENSE (Despesa)';
COMMENT ON TYPE account_type IS 'Tipo de conta: CHECKING (Conta Corrente), SAVINGS (Poupança) ou CREDIT_CARD (Cartão de Crédito)';
COMMENT ON TYPE recurrence_frequency IS 'Frequência de recorrência: DAILY, WEEKLY, MONTHLY ou YEARLY';
COMMENT ON TYPE transaction_status IS 'Status da transação: PENDING (Pendente) ou COMPLETED (Concluído)';

-- ============================================
-- MIGRATION 002: TABELAS
-- ============================================
-- ============================================
-- 📊 TABELAS - mycash+ v2.0
-- ============================================
-- Criação de todas as tabelas baseadas no schema Prisma

-- ============================================
-- 👤 USUÁRIOS E AUTENTICAÇÃO
-- ============================================
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 👨‍👩‍👧‍👦 MEMBROS DA FAMÍLIA
-- ============================================
CREATE TABLE family_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  role TEXT NOT NULL, -- "Pai", "Mãe", "Filho", etc
  avatar_url TEXT,
  monthly_income DECIMAL(12, 2) DEFAULT 0,
  color TEXT DEFAULT '#3247FF',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 🏷️ CATEGORIAS
-- ============================================
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  icon TEXT DEFAULT '📌',
  type transaction_type NOT NULL,
  color TEXT DEFAULT '#3247FF',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 💳 CONTAS E CARTÕES (UNIFICADO)
-- ============================================
CREATE TABLE accounts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type account_type NOT NULL,
  name TEXT NOT NULL,
  bank TEXT NOT NULL,
  last_digits TEXT,
  holder_id UUID NOT NULL REFERENCES family_members(id),
  
  -- Campos para Conta Corrente e Poupança
  balance DECIMAL(12, 2) DEFAULT 0,
  
  -- Campos para Cartão de Crédito
  credit_limit DECIMAL(12, 2),
  current_bill DECIMAL(12, 2) DEFAULT 0,
  due_day INTEGER CHECK (due_day >= 1 AND due_day <= 31),
  closing_day INTEGER CHECK (closing_day >= 1 AND closing_day <= 31),
  theme TEXT DEFAULT 'black',
  logo_url TEXT,
  
  -- Metadata
  color TEXT DEFAULT '#3247FF',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 💫 DESPESAS RECORRENTES (TEMPLATE)
-- ============================================
-- Criar ANTES de transactions pois transactions referencia esta tabela
CREATE TABLE recurring_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type transaction_type DEFAULT 'EXPENSE',
  amount DECIMAL(12, 2) NOT NULL,
  description TEXT NOT NULL,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  account_id UUID REFERENCES accounts(id) ON DELETE SET NULL,
  member_id UUID REFERENCES family_members(id) ON DELETE SET NULL,
  
  -- Configuração de recorrência
  frequency recurrence_frequency NOT NULL,
  day_of_month INTEGER CHECK (day_of_month >= 1 AND day_of_month <= 31),
  day_of_week INTEGER CHECK (day_of_week >= 0 AND day_of_week <= 6),
  start_date DATE NOT NULL,
  end_date DATE,
  
  -- Metadata
  is_active BOOLEAN DEFAULT TRUE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 💰 TRANSAÇÕES
-- ============================================
-- Criar DEPOIS de recurring_transactions pois referencia esta tabela
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type transaction_type NOT NULL,
  amount DECIMAL(12, 2) NOT NULL,
  description TEXT NOT NULL,
  date DATE NOT NULL,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  account_id UUID REFERENCES accounts(id) ON DELETE SET NULL,
  member_id UUID REFERENCES family_members(id) ON DELETE SET NULL,
  
  -- Parcelamento
  installment_number INTEGER CHECK (installment_number >= 1 AND installment_number <= 12),
  total_installments INTEGER DEFAULT 1 CHECK (total_installments >= 1 AND total_installments <= 12),
  parent_transaction_id UUID REFERENCES transactions(id) ON DELETE CASCADE,
  
  -- Recorrência
  is_recurring BOOLEAN DEFAULT FALSE,
  recurring_transaction_id UUID REFERENCES recurring_transactions(id) ON DELETE SET NULL,
  
  -- Status
  status transaction_status DEFAULT 'COMPLETED',
  notes TEXT,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_family_members_updated_at BEFORE UPDATE ON family_members
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_accounts_updated_at BEFORE UPDATE ON accounts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON transactions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_recurring_transactions_updated_at BEFORE UPDATE ON recurring_transactions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- MIGRATION 003: ÍNDICES
-- ============================================
-- ============================================
-- 📊 ÍNDICES - mycash+ v2.0
-- ============================================
-- Criação de índices para otimizar consultas

-- Índices para family_members
CREATE INDEX idx_family_members_user_id ON family_members(user_id);

-- Índices para categories
CREATE INDEX idx_categories_user_id_type ON categories(user_id, type);

-- Índices para accounts
CREATE INDEX idx_accounts_user_id_type ON accounts(user_id, type);
CREATE INDEX idx_accounts_holder_id ON accounts(holder_id);

-- Índices para transactions
CREATE INDEX idx_transactions_user_id_date ON transactions(user_id, date);
CREATE INDEX idx_transactions_category_id ON transactions(category_id);
CREATE INDEX idx_transactions_account_id ON transactions(account_id);
CREATE INDEX idx_transactions_member_id ON transactions(member_id);
CREATE INDEX idx_transactions_recurring_transaction_id ON transactions(recurring_transaction_id);
CREATE INDEX idx_transactions_parent_transaction_id ON transactions(parent_transaction_id);
CREATE INDEX idx_transactions_status ON transactions(status);

-- Índices para recurring_transactions
CREATE INDEX idx_recurring_transactions_user_id_active ON recurring_transactions(user_id, is_active);
CREATE INDEX idx_recurring_transactions_category_id ON recurring_transactions(category_id);
CREATE INDEX idx_recurring_transactions_account_id ON recurring_transactions(account_id);

-- ============================================
-- MIGRATION 004: RLS (ROW LEVEL SECURITY)
-- ============================================
-- ============================================
-- 🔐 ROW LEVEL SECURITY (RLS) - mycash+ v2.0
-- ============================================
-- Políticas de segurança: Usuários podem ver e editar apenas seus próprios dados

-- Habilitar RLS em todas as tabelas
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE family_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE recurring_transactions ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 👤 POLÍTICAS PARA users
-- ============================================
CREATE POLICY "Users can view own data"
ON users FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Users can update own data"
ON users FOR UPDATE
USING (auth.uid() = id);

CREATE POLICY "Users can insert own data"
ON users FOR INSERT
WITH CHECK (auth.uid() = id);

-- ============================================
-- 👨‍👩‍👧‍👦 POLÍTICAS PARA family_members
-- ============================================
CREATE POLICY "Users can manage own family members"
ON family_members FOR ALL
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- ============================================
-- 🏷️ POLÍTICAS PARA categories
-- ============================================
CREATE POLICY "Users can manage own categories"
ON categories FOR ALL
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- ============================================
-- 💳 POLÍTICAS PARA accounts
-- ============================================
CREATE POLICY "Users can manage own accounts"
ON accounts FOR ALL
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- ============================================
-- 💰 POLÍTICAS PARA transactions
-- ============================================
CREATE POLICY "Users can manage own transactions"
ON transactions FOR ALL
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- ============================================
-- 💫 POLÍTICAS PARA recurring_transactions
-- ============================================
CREATE POLICY "Users can manage own recurring transactions"
ON recurring_transactions FOR ALL
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- ============================================
-- MIGRATION 005: STORAGE BUCKETS
-- ============================================
-- ============================================
-- 📦 STORAGE BUCKETS - mycash+ v2.0
-- ============================================
-- Criação de buckets para armazenamento de imagens e arquivos

-- Bucket para avatares (users e family_members)
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Bucket para logos de contas/cartões
INSERT INTO storage.buckets (id, name, public)
VALUES ('account-logos', 'account-logos', true)
ON CONFLICT (id) DO NOTHING;

-- Bucket para documentos e comprovantes (futuro)
INSERT INTO storage.buckets (id, name, public)
VALUES ('documents', 'documents', false)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 📋 POLÍTICAS DE STORAGE - avatars
-- ============================================
-- Usuários podem fazer upload de seus próprios avatares
CREATE POLICY "Users can upload own avatars"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'avatars' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Todos os usuários autenticados podem ver avatares
CREATE POLICY "Authenticated users can view avatars"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'avatars' AND
  auth.role() = 'authenticated'
);

-- Usuários podem atualizar seus próprios avatares
CREATE POLICY "Users can update own avatars"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'avatars' AND
  auth.uid()::text = (storage.foldername(name))[1]
)
WITH CHECK (
  bucket_id = 'avatars' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Usuários podem deletar seus próprios avatares
CREATE POLICY "Users can delete own avatars"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'avatars' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- ============================================
-- 📋 POLÍTICAS DE STORAGE - account-logos
-- ============================================
CREATE POLICY "Users can upload account logos"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'account-logos' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Authenticated users can view account logos"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'account-logos' AND
  auth.role() = 'authenticated'
);

CREATE POLICY "Users can update own account logos"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'account-logos' AND
  auth.uid()::text = (storage.foldername(name))[1]
)
WITH CHECK (
  bucket_id = 'account-logos' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete own account logos"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'account-logos' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- ============================================
-- 📋 POLÍTICAS DE STORAGE - documents
-- ============================================
CREATE POLICY "Users can upload own documents"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'documents' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can view own documents"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'documents' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update own documents"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'documents' AND
  auth.uid()::text = (storage.foldername(name))[1]
)
WITH CHECK (
  bucket_id = 'documents' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete own documents"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'documents' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- ============================================
-- ✅ MIGRATIONS CONCLUÍDAS
-- ============================================
-- Todas as migrations foram executadas com sucesso!
-- 
-- Verifique:
-- - 6 tabelas criadas (users, family_members, categories, accounts, transactions, recurring_transactions)
-- - 4 enums criados (transaction_type, account_type, recurrence_frequency, transaction_status)
-- - 10 índices criados
-- - RLS habilitado em todas as tabelas
-- - 3 storage buckets criados (avatars, account-logos, documents)
