# 🧠 5task - Quantum Productivity Engine

<p align="center">
  <img src="https://raw.githubusercontent.com/gillemosai/5TASK/main/assets/5task-logo.png" width="160" alt="5task Logo">
</p>

<p align="center">
  <strong>"Tudo deve ser feito da forma mais simples possível, mas não simplista." — Albert Einstein</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Version-v65-blueviolet?style=for-the-badge" alt="Version">
  <img src="https://img.shields.io/badge/Focus-Max-00f3ff?style=for-the-badge" alt="Focus">
  <img src="https://img.shields.io/badge/Architecture-Fullstack-orange?style=for-the-badge" alt="Architecture">
  <img src="https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge" alt="License">
</p>

---

## 🚀 Sobre o Projeto

O **5task** é um gerenciador de tarefas minimalista e gamificado, desenhado sob o princípio da **Priorização Radical**. Em um mundo de distrações infinitas, o 5task impõe um limite físico de apenas **5 tarefas simultâneas**. Se você não consegue focar em 5 coisas, não conseguirá focar em nada.

O app utiliza a figura de **Albert Einstein** como seu mentor quântico, reagindo ao seu fluxo de trabalho e oferecendo insights motivacionais baseados em seu progresso.

## ✨ Funcionalidades Principais

- **🛡️ Limite Quântico:** Sistema bloqueia a criação de mais de 5 tarefas para forçar o foco no que é essencial.
- **👨‍🔬 Mentoria de Einstein:** Avatar dinâmico que muda de expressão (Feliz, Pensativo, Animado, Preocupado) conforme o estado da sua lista.
- **📋 Quadro Kanban Integrado:** Cada tarefa principal pode ser expandida em um micro-gerenciamento com colunas *A Fazer*, *Andamento* e *Concluído*.
- **🗄️ Backend SQL Persistente:** O sistema agora conta com um backend robusto (Node.js + Prisma + SQLite/PostgreSQL) para garantir que seus dados sejam salvos permanentemente, sem risco de perda ao limpar o cache do navegador.
- **⚡ Interface Neon-Noir:** Design escuro e moderno com toques neon para reduzir a fadiga visual e aumentar a imersão.
- **🔄 Updates em Tempo Real:** Interações instantâneas e feedback visual fluido.

## 🛠️ Tecnologias Utilizadas

### Frontend
- **[React](https://react.dev/):** Biblioteca para interfaces de usuário modernas e reativas.
- **[Tailwind CSS](https://tailwindcss.com/):** Framework CSS utilitário para design responsivo.
- **[Lucide React](https://lucide.dev/):** Ícones elegantes e leves.

### Backend
- **[Node.js](https://nodejs.org/):** Runtime JavaScript para o servidor.
- **[Express](https://expressjs.com/):** Framework web rápido e minimalista.
- **[Prisma](https://www.prisma.io/):** ORM moderno para Node.js e TypeScript.
- **[SQLite](https://www.sqlite.org/):** Banco de dados SQL leve e embarcado (padrão).
- **[PostgreSQL](https://www.postgresql.org/):** Suporte nativo para produção via troca de provider.

## ⚙️ Instalação e Execução

### 🚀 Instalação Rápida (Recomendado para Usuários)

Se você está no Windows 10 ou 11, criamos um instalador automático que configura todo o ambiente (Node.js, Python, Dependências e Atalho) com um único clique.

1.  Baixe o repositório.
2.  Execute o arquivo **`Instalar Tudo.bat`** como Administrador.
3.  Aguarde o término da instalação.
4.  Use o atalho **`5Task App`** criado na sua área de trabalho.

*Para um guia detalhado, consulte o arquivo [`MANUAL_INSTALACAO.md`](MANUAL_INSTALACAO.md).*

---

### 💻 Instalação Manual (Para Desenvolvedores)

Para rodar o projeto completo (Frontend + Backend) manualmente, você precisará de dois terminais abertos.

#### 1. Clonar o repositório
```bash
git clone https://github.com/gillemosai/5task.git
cd 5task
```

#### 2. Configurar o Backend
```bash
cd server
npm install
npx prisma migrate dev --name init # Cria o banco de dados
npm run dev
```
*O servidor rodará em: `http://localhost:3001`*

#### 3. Configurar o Frontend
Em um novo terminal, na raiz do projeto:
```bash
npm install
npm run dev
```
*O app abrirá em: `http://localhost:5173`*

## 🗺️ Roadmap de Evolução

- [x] Limite de 5 tarefas e Gamificação inicial.
- [x] Micro-Kanban por tarefa.
- [x] Migração de IndexedDB para Backend SQL (v65).
- [ ] ☁️ Autenticação de Usuários.
- [ ] 🔔 Notificações Push.
- [ ] 📊 Dashboard de Produtividade Quântica.

---

<p align="center">
  Desenvolvido com 💜 por <strong>Gil Lemos</strong>
</p>