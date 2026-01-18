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
