# 🔍 Debug - Tela Branca

## ⚠️ Problema

Tela branca no `localhost:5173` - geralmente indica erro de JavaScript quebrando a renderização.

## 🔍 Como Diagnosticar

### 1. Abra o Console do Navegador

1. Pressione **F12** (ou clique com botão direito → Inspecionar)
2. Vá na aba **Console**
3. Procure por erros em **vermelho**

### 2. Verifique Erros Comuns

#### Erro: "Cannot read property 'X' of undefined"
- **Causa:** Componente tentando acessar propriedade de objeto undefined
- **Solução:** Verificar imports e dados mock

#### Erro: "Module not found"
- **Causa:** Import faltando ou caminho incorreto
- **Solução:** Verificar caminhos de imports

#### Erro: "Failed to fetch" ou erro de Supabase
- **Causa:** Cliente Supabase tentando conectar sem credenciais
- **Solução:** Já ajustado no código - verificar se está funcionando

#### Erro: "Maximum update depth exceeded"
- **Causa:** Loop infinito em useEffect ou setState
- **Solução:** Verificar dependências de hooks

### 3. Verifique a Aba Network

1. Aba **Network** no DevTools
2. Verifique se há requisições falhando
3. Procure por status **404** ou **500**

### 4. Verifique o Terminal do Vite

No terminal onde está rodando `npm run dev`, procure por:
- Erros de compilação
- Warnings de imports
- Erros TypeScript

## 🔧 Soluções Rápidas

### 1. Reiniciar o Servidor de Desenvolvimento

```bash
# Parar o servidor (Ctrl + C)
# Reiniciar
npm run dev
```

### 2. Limpar Cache do Navegador

1. Pressione **Ctrl + Shift + Delete**
2. Limpar cache do navegador
3. Recarregar a página (**Ctrl + F5**)

### 3. Verificar se o Arquivo HTML Existe

Verifique se `index.html` existe na raiz do projeto e tem:
```html
<div id="root"></div>
<script type="module" src="/src/main.tsx"></script>
```

## 📝 O Que Foi Ajustado no Código

1. ✅ `src/lib/supabase.ts` - Usa valores placeholder se não houver credenciais
2. ✅ `src/contexts/AuthContext.tsx` - Não tenta autenticar se não houver credenciais
3. ✅ `loading` inicia como `false` para não bloquear renderização

## 🎯 Próximo Passo

**Por favor, compartilhe o erro que aparece no console do navegador** para que eu possa diagnosticar o problema específico.
