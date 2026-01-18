// Tipos fundamentais do sistema mycash+

export type TransactionType = 'income' | 'expense';

export type TransactionStatus = 'completed' | 'pending' | 'cancelled';

export type AccountType = 'account' | 'creditCard';

export type CreditCardTheme = 'black' | 'lime' | 'white';

export interface Transaction {
  id: string;
  type: TransactionType;
  value: number;
  description: string;
  category: string;
  date: Date;
  accountId: string;
  memberId: string | null;
  installments: number; // 1 = à vista, 2-12 = parcelado
  status: TransactionStatus;
  isRecurring: boolean; // Despesa recorrente (ex: assinatura mensal)
  isPaid: boolean; // Para despesas pendentes
  dueDate?: Date; // Data de vencimento para despesas futuras
}

export interface Goal {
  id: string;
  title: string;
  description: string;
  targetAmount: number;
  currentAmount: number;
  deadline: Date;
  memberId: string | null;
  category: string;
  createdAt: Date;
}

export interface CreditCard {
  id: string;
  name: string;
  type: 'creditCard';
  holderId: string; // ID do membro titular
  closingDay: number; // Dia de fechamento (1-31)
  dueDay: number; // Dia de vencimento (1-31)
  limit: number; // Limite total do cartão
  currentBill: number; // Fatura atual
  theme: CreditCardTheme;
  lastDigits?: string; // Últimos 4 dígitos do cartão
  createdAt: Date;
}

export interface BankAccount {
  id: string;
  name: string;
  type: 'account';
  holderId: string; // ID do membro titular
  balance: number; // Saldo atual
  createdAt: Date;
}

export type BankAccountOrCreditCard = BankAccount | CreditCard;

export interface FamilyMember {
  id: string;
  name: string;
  role: string; // Ex: "Pai", "Mãe", "Filho", "Avô"
  avatarUrl?: string; // URL do avatar (pode ser URL externa ou upload)
  monthlyIncome?: number; // Renda mensal estimada (opcional)
  createdAt: Date;
}

export interface DateRange {
  startDate: Date;
  endDate: Date;
}

export interface FilterState {
  selectedMember: string | null;
  dateRange: DateRange | null;
  transactionType: 'all' | 'income' | 'expense';
  searchText: string;
}

export interface CategoryExpense {
  category: string;
  total: number;
  percentage: number;
}
