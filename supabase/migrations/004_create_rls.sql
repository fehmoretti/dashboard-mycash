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
