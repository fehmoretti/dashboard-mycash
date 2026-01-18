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
