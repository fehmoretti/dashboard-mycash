# 📋 Plano de Integração Supabase - mycash+ v2.0

## 🎯 Objetivo
Migrar o sistema mycash+ de dados mock para banco de dados real no Supabase, mantendo toda a funcionalidade existente.

---

## 📊 Fase 1: Setup e Configuração do Supabase

### 1.1 Instalação de Dependências
```bash
npm install @supabase/supabase-js @supabase/auth-helpers-react
npm install --save-dev @supabase/cli
```

### 1.2 Variáveis de Ambiente
Criar arquivo `.env.local`:
```env
VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key (apenas para migrations)
```

### 1.3 Cliente Supabase
Criar `src/lib/supabase.ts` para inicializar o cliente.

---

## 🗄️ Fase 2: Schema do Banco de Dados

### 2.1 Criação das Tabelas no Supabase

#### 2.1.1 Tabela `users`
- Campos conforme schema Prisma fornecido
- Primary key: `id` (UUID)
- Unique: `email`

#### 2.1.2 Tabela `family_members`
- Foreign key: `user_id` → `users.id`
- Index em `user_id`

#### 2.1.3 Tabela `categories`
- Foreign key: `user_id` → `users.id`
- Index em `user_id` e `type`

#### 2.1.4 Tabela `accounts`
- Foreign key: `user_id` → `users.id`
- Foreign key: `holder_id` → `family_members.id`
- Index em `user_id`, `type` e `holder_id`

#### 2.1.5 Tabela `transactions`
- Foreign keys: `user_id`, `category_id`, `account_id`, `member_id`, `recurring_transaction_id`, `parent_transaction_id`
- Índices múltiplos para performance

#### 2.1.6 Tabela `recurring_transactions`
- Foreign keys: `user_id`, `category_id`, `account_id`, `member_id`

### 2.2 Enums
Criar enums no PostgreSQL:
- `transaction_type` (INCOME, EXPENSE)
- `account_type` (CHECKING, SAVINGS, CREDIT_CARD)
- `recurrence_frequency` (DAILY, WEEKLY, MONTHLY, YEARLY)
- `transaction_status` (PENDING, COMPLETED)

### 2.3 Scripts SQL
Criar arquivos SQL organizados:
- `supabase/migrations/001_create_enums.sql`
- `supabase/migrations/002_create_tables.sql`
- `supabase/migrations/003_create_indexes.sql`
- `supabase/migrations/004_create_rls.sql`

---

## 🔐 Fase 3: Row Level Security (RLS)

### 3.1 Política de Acesso Total (Todos têm acesso a todas as tabelas)

**Estratégia**: Habilitar RLS mas com políticas permissivas baseadas em `user_id`.

#### 3.1.1 Política para `users`
```sql
-- Usuários podem ver e editar apenas seus próprios dados
CREATE POLICY "Users can view own data"
ON users FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Users can update own data"
ON users FOR UPDATE
USING (auth.uid() = id);
```

#### 3.1.2 Política para `family_members`
```sql
-- Usuários podem ver e editar membros da sua família
CREATE POLICY "Users can manage own family members"
ON family_members FOR ALL
USING (user_id = auth.uid());
```

#### 3.1.3 Política para `categories`
```sql
CREATE POLICY "Users can manage own categories"
ON categories FOR ALL
USING (user_id = auth.uid());
```

#### 3.1.4 Política para `accounts`
```sql
CREATE POLICY "Users can manage own accounts"
ON accounts FOR ALL
USING (user_id = auth.uid());
```

#### 3.1.5 Política para `transactions`
```sql
CREATE POLICY "Users can manage own transactions"
ON transactions FOR ALL
USING (user_id = auth.uid());
```

#### 3.1.6 Política para `recurring_transactions`
```sql
CREATE POLICY "Users can manage own recurring transactions"
ON recurring_transactions FOR ALL
USING (user_id = auth.uid());
```

### 3.2 Habilitar RLS em todas as tabelas
```sql
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE family_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE recurring_transactions ENABLE ROW LEVEL SECURITY;
```

---

## 🔑 Fase 4: Autenticação

### 4.1 Configuração de Autenticação Supabase
- Email/Password (padrão)
- Habilitar confirmação de email (opcional)
- Configurar redirect URLs

### 4.2 Context de Autenticação
Criar `src/contexts/AuthContext.tsx`:
- Gerenciar sessão do usuário
- Login/Logout
- Sign Up
- Reset Password

### 4.3 Componentes de Autenticação
- Login form
- Sign up form
- Reset password form
- Protected routes

---

## 💾 Fase 5: Storage (Imagens/Vídeos)

### 5.1 Criação de Buckets
Criar buckets no Supabase Storage:
- `avatars` - Para fotos de perfil (users e family_members)
- `account-logos` - Para logos de bancos/cartões
- `documents` - Para documentos e comprovantes (futuro)

### 5.2 Políticas de Storage
```sql
-- Avatares: Usuários podem fazer upload, todos autenticados podem ler
CREATE POLICY "Users can upload own avatars"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Authenticated users can view avatars"
ON storage.objects FOR SELECT
USING (bucket_id = 'avatars' AND auth.role() = 'authenticated');

-- Logos: Similar aos avatares
CREATE POLICY "Users can upload account logos"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'account-logos' AND auth.uid()::text = (storage.foldername(name))[1]);
```

### 5.3 Funções Helper
Criar `src/lib/storage.ts`:
- `uploadAvatar(userId, file)`
- `getAvatarUrl(path)`
- `deleteAvatar(path)`

---

## 🔄 Fase 6: Migração de Dados Mock

### 6.1 Script de Migração
Criar `scripts/migrate-mock-data.ts`:
1. Ler dados mock atuais
2. Transformar para formato Supabase
3. Inserir via API Supabase
4. Mapear IDs antigos para novos

### 6.2 Estratégia de Migração
- Criar usuário de teste
- Migrar family_members
- Migrar categories
- Migrar accounts
- Migrar transactions (respeitando relacionamentos)

---

## 🛠️ Fase 7: Refatoração do Código

### 7.1 Atualizar `FinanceContext.tsx`
- Remover dependência de `mockData.ts`
- Substituir por chamadas Supabase
- Manter mesma interface pública (mínimas mudanças no código)

### 7.2 Hooks Customizados
Criar hooks para operações comuns:
- `useTransactions()` - CRUD de transações
- `useAccounts()` - CRUD de contas
- `useFamilyMembers()` - CRUD de membros
- `useCategories()` - CRUD de categorias

### 7.3 Services Layer
Criar camada de serviços:
- `src/services/transactionService.ts`
- `src/services/accountService.ts`
- `src/services/familyMemberService.ts`
- `src/services/categoryService.ts`
- `src/services/storageService.ts`

### 7.4 Type Definitions
Atualizar `src/types/index.ts` para alinhar com schema Supabase.

---

## 📈 Fase 8: Otimizações e Performance

### 8.1 Realtime Subscriptions
- Atualizar dados em tempo real quando houver mudanças
- Usar Supabase Realtime para sincronização

### 8.2 Paginação
- Implementar paginação em tabelas grandes (transactions)
- Usar `range()` do Supabase

### 8.3 Cache e Estado
- Manter cache local para dados frequentemente acessados
- Usar React Query ou SWR (opcional)

---

## 🧪 Fase 9: Testes e Validação

### 9.1 Testes de Integração
- Testar CRUD de todas as entidades
- Testar autenticação
- Testar upload de imagens
- Testar RLS policies

### 9.2 Testes de Fluxo
- Fluxo completo de criação de transação
- Fluxo de parcelamento
- Fluxo de transações recorrentes
- Fluxo de filtros e busca

---

## 📝 Checklist de Implementação

### Setup Inicial
- [ ] Instalar dependências Supabase
- [ ] Configurar variáveis de ambiente
- [ ] Criar cliente Supabase

### Banco de Dados
- [ ] Criar enums
- [ ] Criar tabelas
- [ ] Criar índices
- [ ] Configurar RLS
- [ ] Testar policies

### Autenticação
- [ ] Criar AuthContext
- [ ] Implementar login
- [ ] Implementar signup
- [ ] Implementar logout
- [ ] Implementar reset password
- [ ] Criar tela de login

### Storage
- [ ] Criar buckets
- [ ] Configurar políticas de storage
- [ ] Implementar upload de avatares
- [ ] Implementar upload de logos

### Migração de Código
- [ ] Remover `mockData.ts`
- [ ] Atualizar `FinanceContext.tsx`
- [ ] Criar services layer
- [ ] Atualizar todos os componentes
- [ ] Testar funcionalidades

### Testes
- [ ] Testar CRUD completo
- [ ] Testar autenticação
- [ ] Testar uploads
- [ ] Testar performance

---

## 🚀 Ordem de Execução Recomendada

1. **Semana 1**: Setup Supabase + Schema + RLS
2. **Semana 2**: Autenticação + Storage
3. **Semana 3**: Refatoração FinanceContext + Services
4. **Semana 4**: Testes + Ajustes finais

---

## 📚 Recursos e Documentação

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Auth](https://supabase.com/docs/guides/auth)
- [Supabase Storage](https://supabase.com/docs/guides/storage)
- [Supabase Realtime](https://supabase.com/docs/guides/realtime)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)

---

## ⚠️ Observações Importantes

1. **RLS**: As políticas permitem acesso total dentro do mesmo `user_id`, mantendo segurança entre usuários diferentes.

2. **Migração**: Os dados mock devem ser migrados uma única vez. Após isso, apenas dados reais serão usados.

3. **Performance**: Considerar paginação para tabela de transações, que pode crescer rapidamente.

4. **Backup**: Configurar backups automáticos no Supabase antes de migrar dados de produção.

5. **Validação**: Validar todos os campos obrigatórios no frontend e backend antes de inserir no banco.
