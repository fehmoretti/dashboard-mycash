# 🔧 Guia de Configuração de Variáveis de Ambiente

## ✅ Status

O arquivo `.env.example` foi criado na raiz do projeto como referência.

---

## 📋 Como Configurar

### 1. Criar Arquivo `.env.local`

Na raiz do projeto, crie o arquivo `.env.local`:

```bash
# Windows (PowerShell)
New-Item -Path .env.local -ItemType File

# Linux/Mac
touch .env.local
```

### 2. Preencher com Credenciais do Supabase

Copie o conteúdo de `.env.example` e preencha com suas credenciais:

```env
VITE_SUPABASE_URL=https://seu-projeto-id.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anon-public-aqui
```

### 3. Como Obter as Credenciais

1. **Acesse o Supabase Dashboard:**
   - https://app.supabase.com

2. **Selecione seu projeto:**
   - Dashboard-mycash

3. **Vá em Settings → API:**
   - https://app.supabase.com/project/_/settings/api

4. **Copie as credenciais:**
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon public** key → `VITE_SUPABASE_ANON_KEY`

⚠️ **IMPORTANTE:** Use a chave **anon public**, não a **service_role** key.

---

## 🔒 Segurança

- ✅ O arquivo `.env.local` já está no `.gitignore`
- ✅ Nunca commite o arquivo `.env.local` no Git
- ✅ O arquivo `.env.example` é apenas um template (pode ser commitado)

---

## ✅ Validação

Após configurar, verifique se o cliente Supabase detecta as variáveis:

```typescript
// No console do navegador
import { supabase } from '@/lib/supabase'

// Deve retornar a URL e chave (sem mostrar valores completos por segurança)
console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL ? 'Configurado ✅' : 'Não configurado ❌')
console.log('Supabase Key:', import.meta.env.VITE_SUPABASE_ANON_KEY ? 'Configurado ✅' : 'Não configurado ❌')
```

---

## 📝 Exemplo Completo

```env
# .env.local
VITE_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYxNjIzOTAyMiwiZXhwIjoxOTMxODE1MDIyfQ.exemplo-exemplo-exemplo
```

---

## 🎯 Próximos Passos

Após configurar o `.env.local`:

1. ✅ Reinicie o servidor de desenvolvimento (`npm run dev`)
2. ✅ Teste a conexão com Supabase
3. ✅ Comece a usar os services (`transactionService`, `accountService`, etc.)
