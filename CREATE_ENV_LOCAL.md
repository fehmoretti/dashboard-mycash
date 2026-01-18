# 🚀 Criar Arquivo .env.local - Passo a Passo

## 📋 Resumo

Para configurar o Supabase no projeto, você precisa criar o arquivo `.env.local` com **2 variáveis**:

1. `VITE_SUPABASE_URL` - URL do seu projeto Supabase
2. `VITE_SUPABASE_ANON_KEY` - Chave pública anônima

---

## 📝 Formato do Arquivo

Crie o arquivo `.env.local` na **raiz do projeto** com este conteúdo:

```env
VITE_SUPABASE_URL=https://seu-projeto-id.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anon-public-aqui
```

---

## 🔍 Onde Obter as Credenciais

### Opção 1: Via Supabase Dashboard (Recomendado)

1. **Acesse:** https://app.supabase.com
2. **Selecione seu projeto:** Dashboard-mycash
3. **Vá em:** Settings → API
   - Ou direto: https://app.supabase.com/project/_/settings/api
4. **Copie:**
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon public** key → `VITE_SUPABASE_ANON_KEY`

### Opção 2: Se Você Já Tem as Credenciais

Se você já tem o `Project URL` e a `anon public key`, apenas cole no arquivo `.env.local`.

---

## 💻 Como Criar o Arquivo

### Windows (PowerShell)

```powershell
# Na raiz do projeto (Dashboard-mycash-figma-mcp)
@"
VITE_SUPABASE_URL=https://seu-projeto-id.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anon-public-aqui
"@ | Out-File -FilePath .env.local -Encoding utf8
```

### Linux/Mac (Terminal)

```bash
# Na raiz do projeto
cat > .env.local << EOF
VITE_SUPABASE_URL=https://seu-projeto-id.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anon-public-aqui
EOF
```

### Via Editor de Texto

1. Abra seu editor de código (VS Code, etc.)
2. Crie um novo arquivo na raiz do projeto
3. Nome: `.env.local` (com o ponto no início)
4. Cole as duas linhas acima
5. Substitua pelos valores reais do Supabase
6. Salve

---

## ✅ Verificar se Funcionou

Após criar o arquivo, você pode verificar:

1. **Verificar se o arquivo existe:**
   ```bash
   # Windows (PowerShell)
   Test-Path .env.local
   
   # Linux/Mac
   ls -la .env.local
   ```

2. **Verificar no código:**
   ```typescript
   // Reinicie o servidor de desenvolvimento primeiro
   // npm run dev
   
   // Depois, no console do navegador:
   console.log('URL:', import.meta.env.VITE_SUPABASE_URL)
   console.log('Key:', import.meta.env.VITE_SUPABASE_ANON_KEY ? 'Configurado ✅' : 'Não configurado ❌')
   ```

---

## ⚠️ Importante

1. **Nome exato:** O arquivo deve se chamar `.env.local` (com ponto no início)
2. **Localização:** Deve estar na **raiz do projeto**, não dentro de `src/`
3. **Valores reais:** Substitua `seu-projeto-id` e `sua-chave-anon-public-aqui` pelos valores reais do Supabase
4. **Segurança:** O arquivo `.env.local` já está no `.gitignore` (não será commitado no Git)

---

## 🎯 Checklist

- [ ] Acessei o Supabase Dashboard
- [ ] Copiei o **Project URL**
- [ ] Copiei a chave **anon public** (não a service_role)
- [ ] Criei o arquivo `.env.local` na raiz do projeto
- [ ] Colei as 2 variáveis com os valores reais
- [ ] Salvei o arquivo
- [ ] Reiniciei o servidor de desenvolvimento (`npm run dev`)

---

## 📚 Mais Informações

Veja `COMO_OBTER_CREDENCIAIS_SUPABASE.md` para instruções detalhadas sobre como obter as credenciais no Dashboard do Supabase.
