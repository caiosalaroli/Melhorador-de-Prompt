# Project Brief: Melhorador de Prompt AI

## 1. Executive Summary
- **Conceito do Produto**: Um SaaS por assinatura que utiliza IA para transformar entradas simples em prompts avançados para ChatGPT e Gemini, através de uma interface intuitiva de "Modo Entrevista".
- **Problema Principal**: Usuários comuns têm dificuldade em obter resultados de qualidade da IA por não saberem estruturar prompts complexos (o problema da "página em branco").
- **Mercado-Alvo**: Criadores de conteúdo, profissionais de marketing, estudantes e usuários casuais que precisam de eficiência máxima com mínimo esforço.
- **Proposta de Valor**: Entrega de prompts otimizados e prontos para uso através de uma interface híbrida (botões + texto) e acesso a uma biblioteca exclusiva de prompts validados.

## 2. Problem Statement
- **Estado Atual**: A maioria dos usuários de IA generativa (OpenAI/Gemini) recebe respostas genéricas, incompletas ou erradas porque não sabe fornecer contexto, persona ou restrições no prompt.
- **Impacto**: Isso gera frustração, perda de tempo em tentativas e erro, e a sensação de que a IA "não é tão útil assim".
- **Lacuna**: Ferramentas atuais de engenharia de prompt são complexas ou focadas apenas em desenvolvedores, deixando o usuário comum desamparado.

## 3. Proposed Solution
- **Conceito**: Uma plataforma de "refino instantâneo". O usuário insere uma ideia bruta e recebe uma estrutura profissional otimizada para o modelo específico que deseja usar.
- **Diferenciais**: 
    - **Customização por Modelo**: Prompts ajustados especificamente para a "personalidade" do GPT ou do Gemini.
    - **Baixa Fricção**: Resultados em menos de 2 cliques após a entrada do texto.
- **Visão**: Tornar-se a ferramenta de entrada obrigatória para qualquer pessoa antes de interagir com um Chat de IA.

## 4. Target Users
- **Segmento Primário: Criadores de Conteúdo & Marketers**
    - Perfil: Uso diário para trabalho. Consistência e rapidez são chaves.
- **Segmento Secundário: Estudantes & Acadêmicos**
    - Perfil: Suporte ao estudo e pesquisas. Precisão e rigor são chaves.
- **Segmento Terciário: Usuário Ocasional**
    - Perfil: Tarefas simples do dia a dia. Extrema facilidade é a chave.

## 5. Goals & Success Metrics
- **Objetivo de Negócio**: Validar o modelo de assinatura com período de teste (Free Trial), visando uma conversão pós-teste superior a 15%.
- **Métrica de Retenção**: Manter o assinante por pelo menos 4 meses.
- **Métrica de Qualidade**: 80% de satisfação relatada na melhoria dos prompts.
- **KPI Principal**: Número de usuários que ativam o teste gratuito e permanecem após o período inicial.

## 6. MVP Scope
- **Interface Híbrida**: Campo de texto + botões de contexto (Modo Entrevista).
- **Mecanismo de Explicação**: Breve justificativa sobre as mudanças feitas no prompt para educar o usuário.
- **Seletor de IA**: Otimização específica para GPT ou Gemini.
- **Biblioteca de Prompts (v1)**: 20 prompts mestres curados.
- **Fluxo de Acesso**: Cadastro e Login via E-mail/Senha (Opção B).
- **Fluxo de Assinatura/Trial**: Checkout com cartão obrigatório; trial de 3 prompts/dia disponível apenas após a assinatura.
- **Botão "Copiar"**: Ação rápida para uso externo.

## 7. Technical Considerations
- **Plataforma**: Web App responsivo (Desktop/Mobile).
- **Stack**: Next.js/React para frontend; Node.js para backend; Integração com APIs OpenAI/Gemini.
- **Pagamentos**: Stripe ou similar para gestão de "Subscription with Trial" (exigindo cartão no início).

## 8. Constraints & Assumptions
- **Custo de API**: A mensalidade deve ser precificada para cobrir o uso de tokens.
- **Simplicidade**: O foco é o fluxo de melhoria, evitando complexidades de chat persistente.
- **Design Premium**: Visual limpo e profissional para justificar o modelo pago.

## 9. Risks & Open Questions
- **Mudanças de API**: Riscos de custo e políticas das provedoras (OpenAI/Google).
- **Qualidade Percebida**: A explicação breve deve ser convincente para manter o valor da assinatura.
- **Segurança**: Proteção de dados de checkout e credenciais de login.

## 10. Next Steps
1. **Geração do PRD**: Detalhar as regras de negócio do trial e fluxos de tela.
2. **Curadoria de Conteúdo**: Finalizar os 20 prompts da biblioteca.
3. **Wireframing**: Desenhar a interface do "Modo Entrevista" e Checkout.

_(Este documento foi finalizado pela Mary (Analyst) e serve como base para o desenvolvimento do MVP)_
