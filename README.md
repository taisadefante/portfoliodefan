# Defan Soluções Digitais - Portfólio

Projeto em Next.js + Firebase com:
- Landing page pública de alta conversão
- Listagem de projetos
- Modal com detalhes do projeto
- Painel admin protegido por login Google/e-mail autorizado
- Cadastro de projetos
- Selects dinâmicos com botão +
- Firestore como banco de dados

## Rodar local

```bash
npm install
cp .env.example .env.local
npm run dev
```

## Firebase

Crie um projeto Firebase e ative:
- Authentication > Google
- Firestore Database

Cole as chaves no `.env.local`.

## Coleções usadas

`projects`
`projectOptions`
