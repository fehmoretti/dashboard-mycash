# mycash+ - Dashboard Financeiro Familiar

Sistema de gestão financeira familiar desenvolvido com React, TypeScript, Vite e Tailwind CSS.

## 🚀 Tecnologias

- **React 18** com TypeScript
- **Vite** - Build tool
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Roteamento SPA
- **Supabase** - Backend (integração futura)

## 📦 Instalação

1. Instale as dependências:
```bash
npm install
```

## 🛠️ Scripts Disponíveis

- `npm run dev` - Inicia servidor de desenvolvimento
- `npm run build` - Gera build de produção
- `npm run preview` - Preview do build de produção
- `npm run lint` - Executa linter ESLint

## 📁 Estrutura de Pastas

```
src/
├── assets/          # Imagens, ícones, fontes
├── components/      # Componentes React
│   ├── common/      # Componentes genéricos
│   ├── layout/      # Componentes de layout
│   ├── dashboard/   # Componentes do dashboard
│   └── navigation/  # Componentes de navegação
├── contexts/        # Contextos React (estado global)
├── hooks/           # Hooks customizados
├── pages/           # Páginas de nível superior
├── styles/          # Estilos globais e tokens
│   ├── base.css     # Estilos base e resets
│   └── variables.css # Design tokens (CSS variables)
├── types/           # Tipos TypeScript
├── utils/           # Funções utilitárias
├── constants/       # Constantes do sistema
├── App.tsx          # Componente principal
└── main.tsx         # Ponto de entrada
```

## 🎨 Design System

O projeto utiliza variáveis CSS (design tokens) do Figma, seguindo hierarquia:
1. **Semânticas** (prioridade): `--color-primary`, `--spacing-container-padding`, etc.
2. **Primitivas** (fallback): `--gray-900`, `--spacing-md`, etc.
3. **Conversão**: Valores hardcoded são convertidos para tokens mais próximos

## 📱 Responsividade

Breakpoints oficiais:
- **Mobile**: < 768px
- **Tablet**: ≥ 768px e < 1280px
- **Desktop**: ≥ 1280px e < 1920px
- **Wide/4K**: ≥ 1920px

Layout mobile-first. Sidebar apenas no desktop (≥1280px), Header Mobile apenas <1280px.

## 📋 Rotas Principais

- `/` - Dashboard
- `/cartoes` - Cartões de Crédito
- `/transacoes` - Transações
- `/objetivos` - Objetivos Financeiros
- `/perfil` - Perfil do Usuário

## 🔄 Estado Global

Estado gerenciado via React Context (`FinanceProvider`) sem uso de localStorage/sessionStorage. Dados são temporários durante a sessão do navegador. Futuramente integração com Supabase para persistência real.

## 🎯 Tipos Principais

- `Transaction` - Transações financeiras
- `Goal` - Objetivos financeiros
- `CreditCard` - Cartões de crédito
- `BankAccount` - Contas bancárias
- `FamilyMember` - Membros da família

## 📝 Licença

Projeto privado - mycash+
