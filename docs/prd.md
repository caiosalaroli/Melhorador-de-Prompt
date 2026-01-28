# Product Requirements Document (PRD): Melhore.AI

## 1. Goals and Background Context

### Goals
- **MVP Ágil**: Lançar uma ferramenta funcional em tempo recorde, focando no núcleo de valor: a melhoria do prompt.
- **Assinatura Direta**: Validar a disposição do usuário em pagar para acessar a ferramenta de melhoria de prompts.
- **Curadoria de Qualidade**: Oferecer uma biblioteca inicial de 10 "Master Prompts" altamente eficazes.
- **Educação de Baixa Fricção**: Informar o usuário sobre boas práticas de prompt através de dicas estáticas e interface intuitiva.

### Background Context
O Melhore.AI surge para resolver a barreira de entrada na IA generativa. Muitos usuários não conseguem resultados satisfatórios porque não dominam a engenharia de prompt. Este projeto visa oferecer uma solução de "refino em um clique" para modelos GPT e Gemini. 

Para o MVP, optamos por um escopo reduzido para priorizar o lançamento e a validação do modelo de negócio (assinatura), postergando funcionalidades complexas como explicações dinâmicas via IA e logins sociais.

### Change Log
| Data | Versão | Descrição | Autor |
| :--- | :--- | :--- | :--- |
| 2026-01-21 | v0.3 | Inclusão de Metas de UI e Stack Minimalista (No-DB) | Mary (Analyst) |
| 2026-01-21 | v0.2 | Remoção do Free Trial; Ajuste para Assinatura Direta | Mary (Analyst) |
| 2026-01-21 | v0.1 | Estrutura inicial e definição de objetivos (Escopo MVP Enxuto) | Mary (Analyst) |

---

## 2. Requirements

### Functional Requirements (FR)
- **FR1**: O sistema deve permitir que o usuário digite um texto livre (prompt bruto) em uma área de destaque.
- **FR2**: O sistema deve oferecer botões rápidos (Modo Entrevista) para definir: Persona, Tom de Voz e Objetivo.
- **FR3**: O sistema deve gerar uma versão "melhorada" do prompt otimizada para GPT ou Gemini (escolha do usuário).
- **FR4**: O sistema deve exibir uma biblioteca com 10 prompts mestres para cópia imediata.
- **FR5**: O sistema deve exigir login (e-mail/senha) e assinatura ativa (confirmação de pagamento) antes de permitir qualquer uso da ferramenta de melhoria.

### Non-Functional Requirements (NFR)
- **NFR1**: O tempo de resposta da "melhoria" não deve exceder 5 segundos.
- **NFR2**: O design deve ser 100% responsivo (focando em desktop e mobile).
- **NFR3**: O sistema deve garantir a segurança dos dados de pagamento usando padrões do Stripe.

---

## 3. User Interface Design Goals

### UX Vision
Experiência de "uma tela só". O usuário entra, resolve o problema e sai. Foco total na eficiência e na percepção de inteligência da ferramenta.

### Demonstração de Valor (Sem Trial)
Para converter o usuário sem oferecer um teste gratuito, a interface utilizará:
- **Demo Interativa (Read-Only)**: Simulador na Landing Page que mostra o processo de melhoria de um prompt em tempo real.
- **Vitrine em Blur**: A biblioteca de prompts será visível, mas os conteúdos terão efeito de desfoque (blur) para não assinantes.
- **Comparativo de Saída**: Exibição lado a lado de "Prompt Genérico vs Prompt Melhore.AI".

### Core Screens
1. **Landing Page**: Focada em conversão com Demos e Comparativos.
2. **Dashboard Principal**: Layout moderno com barra lateral (sidebar) para navegação rápida e biblioteca. O editor central utiliza um "Canvas" limpo, com controles do Modo Entrevista em painéis flutuantes (floating cards) ou menu de contexto lateral.
3. **Página da Biblioteca**: Galeria de 10 prompts mestres (com blur para não assinantes).

---

## 4. Technical Assumptions

### Stack Minimalista (Low-Code/Serverless)
Para acelerar o MVP e evitar a gestão de infraestrutura complexa:
- **Frontend**: Next.js (Hospedado na Vercel).
- **Autenticação**: Clerk ou Kinde (E-mail/Senha). Sem necessidade de gerenciar senhas ou banco de dados de usuários no início.
- **Pagamentos**: Stripe Checkout (Lida com a assinatura e o portal do cliente).
- **Armazenamento de Dados**: 
    - Os 10 prompts da biblioteca podem ser armazenados em um **arquivo JSON** estático no repositório.
    - O status de assinatura é consultado diretamente na API do Stripe via Webhooks ou Middleware.
- **APIs de IA**: Chamadas diretas para OpenAI e Google Gemini via Serverless Functions do Next.js.

---

## 5. Epic List & User Stories

### Epic 1: Fundação e Core de Melhoria
**Objetivo**: Estabelecer a base técnica e a funcionalidade principal de refinamento de prompts via IA.

#### Story 1.1: Setup do Projeto & Layout Base
- **Como** desenvolvedor, **quero** configurar o framework Next.js com o Design System definido, **para que** o ambiente esteja pronto para as funcionalidades core.
- **Acceptance Criteria**:
    1. Projeto Next.js inicializado.
    2. Configuração de cores, fontes (Inter) e componentes base (Radius 12px) conforme Design System.
    3. Sidebar e Layout de Dashboard funcional (mesmo que com dados estáticos).

#### Story 1.2: Integração com APIs de IA (GPT & Gemini)
- **Como** usuário, **quero** poder escolher entre otimizar meu prompt para ChatGPT ou Gemini, **para que** o resultado seja específico para o modelo que utilizo.
- **Acceptance Criteria**:
    1. Integração funcional com OpenAI API e Google Gemini API.
    2. Handler de erro para falhas de conexão ou limites de cota.
    3. Chaves de API gerenciadas via variáveis de ambiente seguras.

#### Story 1.3: Lógica do "Modo Entrevista"
- **Como** usuário, **quero** selecionar Persona, Tom e Objetivo via botões, **para que** o sistema gere um prompt estruturado sem eu precisar escrever muito.
- **Acceptance Criteria**:
    1. Painel flutuante com botões de seleção de contexto.
    2. Lógica backend que concatena as seleções do usuário com o prompt bruto.
    3. Prompt melhorado exibido de forma clara com botão "Copiar".

---

### Epic 2: Acesso e Assinatura
**(A ser detalhado)**

### Epic 3: Landing Page e Biblioteca
**(A ser detalhado)**

_(As seções 1 a 4 são de propriedade da Mary (Analyst) e podem ser modificadas por outros agentes de planejamento)_
