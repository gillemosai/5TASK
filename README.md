# 🧠 5task - Quantum Productivity Engine

<p align="center">
  <img src="https://raw.githubusercontent.com/gillemosai/5TASK/main/assets/Stalk%20logo.png" width="120" alt="5task Logo">
</p>

<p align="center">
  <strong>"Tudo deve ser feito da forma mais simples possível, mas não simplista." — Albert Einstein</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Version-48.0-blueviolet?style=for-the-badge" alt="Version">
  <img src="https://img.shields.io/badge/Focus-Max-00f3ff?style=for-the-badge" alt="Focus">
  <img src="https://img.shields.io/badge/PWA-Ready-green?style=for-the-badge" alt="PWA Ready">
</p>

---

## 🚀 Sobre o Projeto

O **5task** não é apenas mais um gerenciador de tarefas. É um motor de foco projetado para combater a paralisia por análise e a procrastinação moderna. Baseado no princípio de que a produtividade real vem da priorização implacável, o app limita você a apenas **5 tarefas simultâneas**.

Se você não consegue focar em 5 coisas, não conseguirá focar em 100. O 5task força você a escolher o que realmente importa.

## ✨ Funcionalidades Exclusivas

### 👨‍🔬 Einstein: Seu Mentor Quântico
O app conta com uma IA visual (Avatar de Einstein) que reage ao seu progresso:
- **Pensativo:** Quando a lista está vazia.
- **Feliz:** Quando você completa uma missão.
- **Animado:** Quando você limpa o ambiente.
- **Preocupado:** Quando você atinge o limite crítico de 5 tarefas.

### 📋 Kanban Board (Sub-missões)
Cada uma das 5 tarefas principais pode ser expandida em um quadro Kanban completo para gerenciar subtarefas em estágios de **A Fazer**, **Andamento** e **Concluído**.

### 💾 Memória Persistente (Offline First)
Utilizando **IndexedDB** e **Service Workers**, seus dados são salvos localmente no navegador e o app funciona 100% offline, garantindo que suas ideias nunca se percam no espaço-tempo.

### 📱 PWA & Mobile Ready
Interface ultra-responsiva desenhada para ser instalada como um App nativo em dispositivos Android e iOS (PWA).

## 🛠️ Tecnologias

- **Frontend:** [React.js](https://reactjs.org/) (Hooks & Context)
- **Estilização:** [Tailwind CSS](https://tailwindcss.com/) (Animações Customizadas)
- **Ícones:** [Lucide React](https://lucide.dev/)
- **Banco de Dados:** [IndexedDB](https://developer.mozilla.org/pt-BR/docs/Web/API/IndexedDB_API) via API nativa.
- **PWA:** Service Workers & Web Manifest.

## ⚙️ Instalação Local

Para rodar o 5task na sua máquina Windows/Linux/Mac:

1. Clone o repositório:
   ```bash
   git clone https://github.com/seu-usuario/5task.git
   ```

2. **Importante (Assets):**
   Para que as imagens do Einstein e o Logo carreguem localmente, você deve criar uma pasta chamada `assets` na raiz do projeto e adicionar os seguintes arquivos:
   - `Stalk logo.png`
   - `einstein-happy.png`
   - `einstein-skeptical.png`
   - `einstein-ecstatic.png`
   - `einstein-worried.png`

3. Abra o `index.html` em um servidor local (Live Server no VS Code ou `npm run dev` se estiver usando Vite).

## 🗺️ Roadmap de Evolução

- [x] Sistema de Kanban para subtarefas.
- [x] Persistência de dados com IndexedDB.
- [x] Modo PWA Instalável.
- [ ] Sincronização em nuvem via Firebase (Opcional).
- [ ] Notificações Push para tarefas pendentes.

---

<p align="center">
Desenvolvido com 💜 e foco por [Seu Nome/Organização]
</p>