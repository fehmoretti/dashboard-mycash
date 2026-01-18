# 🔑 Como Obter Credenciais do Supabase

## 📋 Informações Necessárias

Para configurar o `.env.local`, você precisa de **2 informações** do seu projeto Supabase:

1. **VITE_SUPABASE_URL** - URL do projeto
2. **VITE_SUPABASE_ANON_KEY** - Chave pública anônima

---

## 🔍 Como Obter as Credenciais

### Passo 1: Acessar o Supabase Dashboard

1. Acesse: https://app.supabase.com
2. Faça login na sua conta
3. Selecione o projeto **Dashboard-mycash** (ou o nome do seu projeto)

### Passo 2: Acessar as Configurações da API

1. No menu lateral esquerdo, clique em **Settings** (Configurações)
2. Clique em **API** (ou vá diretamente para: https://app.supabase.com/project/_/settings/api)

### Passo 3: Copiar as Credenciais

Na página de API, você verá:

#### 1. Project URL
- **O que é:** URL base do seu projeto Supabase
- **Formato:** `https://[seu-projeto-id].supabase.co`
- **Exemplo:** `https://abcdefghijklmnop.supabase.co`
- **Onde copiar:** Seção "Project URL" ou "Project URL (API endpoint)"

#### 2. anon public Key
- **O que é:** Chave pública para uso no frontend (segura para uso público)
- **Formato:** Uma string longa começando com `eyJ...` (JWT token)
- **Exemplo:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYxNjIzOTAyMiwiZXhwIjoxOTMxODE1MDIyfQ.exemplo`
- **Onde copiar:** Seção "Project API keys" → **anon public** (não confunda com "service_role")

---

## ⚠️ IMPORTANTE: Qual Chave Usar?

### ✅ USE: **anon public** key
- ✅ Segura para uso no frontend
- ✅ Respeita as políticas RLS (Row Level Security)
- ✅ Ideal para aplicações client-side

### ❌ NÃO USE: **service_role** key
- ❌ Bypassa todas as políticas RLS
- ❌ Deve ser usada apenas no backend/servidor
- ❌ NUNCA exponha no frontend

---

## 📝 Exemplo do Arquivo .env.local

Após copiar as credenciais, crie o arquivo `.env.local` na raiz do projeto:

```env
# URL do projeto Supabase
VITE_SUPABASE_URL=https://seu-projeto-id.supabase.co

# Chave pública anônima (anon public)
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYxNjIzOTAyMiwiZXhwIjoxOTMxODE1MDIyfQ.exemplo
```

**Substitua:**
- `seu-projeto-id` → ID do seu projeto no Supabase
- `eyJ...exemplo` → Sua chave anon public completa

---

## 🔍 Como Identificar Corretamente

### Project URL
- ✅ Começa com `https://`
- ✅ Termina com `.supabase.co`
- ✅ Contém o ID do seu projeto no meio

### anon public Key
- ✅ Começa com `eyJ`
- ✅ É um JWT token (muito longo)
- ✅ Está na seção "Project API keys" → **anon public**
- ✅ Descrição: "use this key in client-side code"

---

## 📸 Visual de Onde Encontrar

Na página **Settings → API** do Supabase, você verá algo assim:

```
Project URL
┌─────────────────────────────────────────┐
│ https://abcdefghijklmnop.supabase.co    │ ← Copiar este
└─────────────────────────────────────────┘

Project API keys
┌─────────────────────────────────────────┐
│ anon public                             │
│ eyJhbGciOiJIUzI1NiIsInR5cCI6...        │ ← Copiar este
│ use this key in client-side code        │
└─────────────────────────────────────────┘

service_role (⚠️ NÃO USE)
┌─────────────────────────────────────────┐
│ eyJhbGciOiJIUzI1NiIsInR5cCI6...        │ ← NÃO copiar
│ ⚠️ secret: do not share publicly        │
└─────────────────────────────────────────┘
```

---

## ✅ Validação

Após criar o `.env.local`, você pode validar se está configurado corretamente:

```typescript
// No console do navegador ou componente de teste
console.log('URL:', import.meta.env.VITE_SUPABASE_URL ? '✅ Configurado' : '❌ Não configurado')
console.log('Key:', import.meta.env.VITE_SUPABASE_ANON_KEY ? '✅ Configurado' : '❌ Não configurado')
```

---

## 🎯 Resumo

**2 Informações Necessárias:**

1. **VITE_SUPABASE_URL** → Settings → API → Project URL
2. **VITE_SUPABASE_ANON_KEY** → Settings → API → anon public key

**⚠️ Lembre-se:**
- Use a chave **anon public** (não a service_role)
- As credenciais são específicas do seu projeto
- O arquivo `.env.local` já está protegido no `.gitignore`

---

## 📚 Referência

- Dashboard Supabase: https://app.supabase.com
- Página de API Settings: https://app.supabase.com/project/_/settings/api
- Documentação: https://supabase.com/docs
