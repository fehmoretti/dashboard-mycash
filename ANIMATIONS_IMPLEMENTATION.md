# Guia de Implementação de Animações

Este documento descreve as animações implementadas e como aplicá-las nos componentes.

## ✅ Implementado

### 1. Constantes e CSS Base
- Arquivo `src/constants/animations.ts` com constantes reutilizáveis
- Keyframes CSS adicionados em `src/styles/base.css`
- Suporte a `prefers-reduced-motion` configurado

### 2. Animações de Valores Monetários
- Hook `useCountAnimation` já implementado
- Cards de resumo (BalanceCard, IncomeCard, ExpenseCard) já utilizam

## 🔄 Implementações Necessárias nos Componentes

### Transições de Página
- Componente `MainLayout`: Adicionar fade-in/fade-out entre rotas

### Animações de Entrada (Cards/Grids)
- `TransactionsTable`: Adicionar fade-in + slide-up com stagger
- `CardsView`: Adicionar fade-in + slide-up com stagger
- `CategoryDonutCard`: Adicionar fade-in + scale com stagger

### Hover States
- Cards clicáveis: Usar classe `.hover-lift` ou aplicar estilos inline
- Botões: Usar `transition: background-color 200ms ease-in-out`
- Avatares: Usar `transition: transform 200ms ease-in-out`

### Barras de Progresso
- Usar `animation: progressFill 1s ease-out` no width
- Aplicar em componentes de uso de cartão e objetivos

### Modais
- Melhorar entrada/saída com scale + fade
- Modal mobile de filtros: Usar `slideUp` existente

### Skeleton Loaders
- Criar componentes para estado de loading
- Usar classes `.skeleton-pulse` e `.skeleton-shimmer`
