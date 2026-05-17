# TechBlog - Frontend

Interface web do sistema de blog desenvolvida com React, TypeScript e Vite.

## Como rodar

### Pré-requisitos
- Node.js 16+

### Instalação

1. Clone o repositório
```bash
git clone <https://github.com/MattCrBR/BlogFront.git>
cd blog-front
```

2. Instale as dependências
```bash
npm install
```

3. Rode o projeto
```bash
npm run dev
```

Acesse em `http://localhost:5173`

## Estrutura

```
src/
├── components/      # Navbar e Footer
├── context/         # Autenticação (AuthContext)
├── pages/           # Páginas da aplicação
│   ├── Home.tsx
│   ├── Articles.tsx
│   ├── ArticleDetail.tsx
│   ├── ArticleForm.tsx
│   ├── Dashboard.tsx
│   ├── Settings.tsx
│   ├── Login.tsx
│   └── Register.tsx
├── styles/          # Arquivos CSS
├── App.tsx          # Rotas
└── main.tsx
```

## Páginas

| Rota | Página | Acesso |
|------|--------|--------|
| `/` | Home | Público |
| `/artigos` | Lista de artigos | Público |
| `/artigos/:id` | Detalhe do artigo | Público |
| `/entrar` | Login | Público |
| `/cadastro` | Cadastro | Público |
| `/dashboard` | Dashboard | Autenticado |
| `/configuracoes` | Configurações | Autenticado |
| `/artigos/novo` | Criar artigo | Autenticado |
| `/artigos/:id/editar` | Editar artigo | Autenticado |

## Tecnologias

- React 18
- TypeScript
- Vite
- React Router v6
- Context API

## Backend

O frontend consome a API REST do backend que deve estar rodando em `http://localhost:3001`.

Repositório do backend: `<https://github.com/MattCrBR/BlogBack.git>`