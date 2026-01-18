// Constantes do sistema

// Categorias padrão brasileiras para receitas
export const INCOME_CATEGORIES = [
  'Salário',
  'Freelance',
  'Investimentos',
  'Aluguel Recebido',
  'Vendas',
  'Outros',
] as const;

// Categorias padrão brasileiras para despesas
export const EXPENSE_CATEGORIES = [
  'Aluguel',
  'Alimentação',
  'Mercado',
  'Transporte',
  'Saúde',
  'Educação',
  'Lazer',
  'Academia',
  'Manutenção',
  'Contas (água, luz, internet)',
  'Vestuário',
  'Outros',
] as const;

// Rotas principais do sistema
export const ROUTES = {
  DASHBOARD: '/',
  CARDS: '/cartoes',
  TRANSACTIONS: '/transacoes',
  GOALS: '/objetivos',
  PROFILE: '/perfil',
} as const;

// Breakpoints do projeto (em pixels)
export const BREAKPOINTS = {
  MOBILE_MAX: 767,
  TABLET_MIN: 768,
  TABLET_MAX: 1279,
  DESKTOP_MIN: 1280,
  DESKTOP_MAX: 1919,
  WIDE_MIN: 1920,
} as const;
