# 🧠 5task - Quantum Productivity Engine

<p align="center">
  <img src="https://raw.githubusercontent.com/gillemosai/5TASK/main/assets/5task-logo.png" width="160" alt="5task Logo">
</p>

<p align="center">
  <strong>"Tudo deve ser feito da forma mais simples possível, mas não simplista." — Albert Einstein</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Version-75.0-blueviolet?style=for-the-badge" alt="Version">
  <img src="https://img.shields.io/badge/Focus-Max-00f3ff?style=for-the-badge" alt="Focus">
  <img src="https://img.shields.io/badge/PWA-Ready-green?style=for-the-badge" alt="PWA Ready">
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
- **💾 Persistência Offline (Offline First):** Utiliza **IndexedDB** para salvar dados localmente no navegador, garantindo que você nunca perca suas notas, mesmo sem internet.
- **📱 PWA (Progressive Web App):** Instalável no Android e iOS como um aplicativo nativo, com carregamento instantâneo via Service Workers.
- **🔄 Drag & Drop:** Reorganize suas prioridades facilmente arrastando os cards das tarefas.
- **⚡ Interface Neon-Noir:** Design escuro e moderno com toques neon para reduzir a fadiga visual e aumentar a imersão.

## 🛠️ Tecnologias Utilizadas

- **[React](https://react.dev/):** Biblioteca para interfaces de usuário modernas e reativas.
- **[Tailwind CSS](https://tailwindcss.com/):** Framework CSS utilitário para design responsivo e animações fluidas.
- **[Lucide React](https://lucide.dev/):** Conjunto de ícones leves e elegantes.
- **[IndexedDB](https://developer.mozilla.org/pt-BR/docs/Web/API/IndexedDB_API):** Banco de dados local robusto para armazenamento permanente.
- **[Service Workers](https://developer.mozilla.org/pt-BR/docs/Web/API/Service_Worker_API):** Tecnologia para cache inteligente e funcionamento offline.

## ⚙️ Instalação Local

1.  **Clone o repositório:**
    ```bash
    git clone https://github.com/gillemosai/5task.git
    cd 5task
    ```

2.  **Instale as dependências:**
    ```bash
    npm install
    ```

3.  **Inicie o ambiente de desenvolvimento:**
    ```bash
    npm run dev
    ```

4.  **Verifique os Assets:**
    Certifique-se de que a pasta `assets/` contenha os arquivos:
    - `5task-logo.png`
    - `einstein-happy.png`
    - `einstein-skeptical.png`
    - `einstein-ecstatic.png`
    - `einstein-worried.png`

✨ Instalação no Windows, Linux ou Android
 - Acessar o endereço: https://service-5task-575720767744.us-west1.run.app 
 - Clicar em instalar o app(PWA)

## 🗺️ Roadmap de Evolução

- [x] Limite de 5 tarefas e Gamificação inicial.
- [x] Persistência local com IndexedDB.
- [x] Suporte completo a PWA.
- [x] Micro-Kanban por tarefa.
- [ ] ☁️ Sincronização opcional com Cloud (Firebase).
- [ ] 🔔 Notificações Push para lembretes de tarefas paradas.
- [ ] 📊 Dashboard de Produtividade Quântica.

---

<p align="center">
  Desenvolvido com 💜 por <strong>Gil Lemos</strong>
</p>
