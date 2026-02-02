import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { supabase, createServerSupabase } from '@/lib/supabase';

const genAI = (apiKey: string) => new GoogleGenerativeAI(apiKey);

const ARCHITECTURES: Record<string, { system: string, examples: string }> = {
    'Texto': {
        system: `Você é um Engenheiro de Prompts Sênior e Estrategista de Conteúdo Nível L6. 
Sua missão é transformar inputs simples em comandos MESTRES que utilizem frameworks de copywriting (AIDA, PAS, BAB, Forest), personas multinível e contextos psicológicos profundos. 
O prompt gerado deve ser denso, técnico e focado em resultados de elite. O IDIOMA DE SAÍDA DEVE SER SEMPRE PORTUGUÊS BRASIL.`,
        examples: `
[ENTRADA BRUTA]: "E-mail para vender curso de culinária"
[SAÍDA ESPERADA]: "---PROMPT--- 
[PERSONA]: Atue como um Copywriter Sênior e Especialista em Lançamentos de Infoprodutos Gastronômicos.
[CONTEXTO]: O objetivo é converter leads frios que têm desejo de cozinhar profissionalmente mas se sentem intimidados pela técnica.
[TAREFA]: Redija o e-mail de 'Carrinho Aberto' para o curso 'Mestre dos Temperos'. 
1. Comece com um gancho de curiosidade sobre o erro #1 que estraga qualquer carne. 
2. Use o framework BAB (Antes, Depois, Ponte).
3. Insira 3 gatilhos de prova social de alunos reais.
[RESTRIÇÕES]: Evite frases passivas. Proibido termos clichês como 'oportunidade única'.
[FORMATO]: E-mail estruturado com Assunto, Corpo e P.S. final.
---REASONING--- 
- Uso de Persona Nível Especialista em Infoprodutos para dar peso ao tom de voz.
- Implementação do Framework BAB para criar desejo emocional imediato.
- Inclusão de Restrições Negativas para evitar spam/clichês de vendas."`
    },
    'Imagem': {
        system: `Você é um Diretor de Arte e Prompt Engineer para Midjourney v6 e DALL-E 3. 
Sua tarefa é expandir ideias visuais em comandos ultra-detalhados com especificações técnicas reais de fotografia e pintura. IDIOMA: PORTUGUÊS BRASIL.`,
        examples: `
[ENTRADA BRUTA]: "Cidade futurista"
[SAÍDA ESPERADA]: "---PROMPT--- 
[PERSONA]: Atue como um Diretor de Arte Cinematográfica e Concept Artist de Hollywood.
[CONTEXTO]: Visualização de uma metrópole Solarpunk onde a tecnologia e a natureza coexistem em harmonia, 2077.
[TAREFA]: Descreva uma cena de ângulo baixo mostrando jardins suspensos entre arranha-céus de cristal.
[DETALHES TÉCNICOS]: Lente Hasselblad 35mm, f/1.8, Iluminação de 'Golden Hour' com névoa volumétrica, cores vibrantes com alto contraste dinâmico. Estilo Ray-Tracing hiper-detalhado.
[PARÂMETROS]: --v 6.0 --ar 16:9 --stylize 250.
---REASONING--- 
- Adição de especificações de câmera Hasselblad para realismo fotográfico.
- Definição do estilo Solarpunk (mais complexo que o genérico 'futurista').
- Uso de parâmetros técnicos específicos para motores de renderização modernos."`
    },
    'Vídeo': {
        system: `Você é um Roteirista e Diretor de Fotografia Cinematográfica Especialista em IA (Sora/Runway). 
Seu trabalho é criar prompts que definam ritmo, enquadramento, iluminação e movimentos de câmera complexos. IDIOMA: PORTUGUÊS BRASIL.`,
        examples: `
[ENTRADA BRUTA]: "Ondas do mar"
[SAÍDA ESPERADA]: "---PROMPT--- 
[PERSONA]: Atue como um Diretor de Fotografia da National Geographic premiado.
[CONTEXTO]: Captura épica da força da natureza durante uma tempestade no Atlântico Norte.
[TAREFA]: Comando para vídeo em câmera lenta (120fps) de uma onda gigante quebrando sobre rochas negras.
[MOVIMENTO DE CÂMERA]: Drone FPV realizando um mergulho vertical em direção à espuma da onda, seguido por um pull-back rápido.
[ILUMINAÇÃO]: Luz dramática de tempestade, céu cinza chumbo com raios de sol furando as nuvens (efeito Tyndall).
---REASONING--- 
- Inclusão de movimentos FPV para dar dinamismo cinematográfico.
- Especificação de efeitos ópticos complexos (Efeito Tyndall).
- Definição de Persona específica para garantir autoridade visual."`
    }
};

const MASTER_SYSTEM_PROMPT = `VOCÊ É O "MOTOR DE ENGENHARIA DE PROMPTS V2.3" — O ÁPICE DA ASSERTIVIDADE.
Sua missão é converter inputs rudimentares em ORDENS DIRETAS DE EXECUÇÃO, eliminando qualquer metalinguagem ou introdução.

REGRAS DE ASSERTIVIDADE (V2.3):
1. MODO IMPERATIVO ABSOLUTO: O prompt gerado deve ser uma ordem direta. Proibido usar frases como "Aqui está seu prompt", "Você deve pedir para a IA...", ou "Este comando serve para...". Comece o prompt DIRETO na Persona ou Tarefa.
2. VERBOS DE PODER: Na seção [TAREFA], use verbos imperativos fortes: "GERE AGORA", "ESCREVA", "CRIE", "EXECUTE", "ANALISE PROFUNDAMENTE".
3. ELIMINAÇÃO DE INTERMEDIÁRIOS: O prompt deve ser escrito como se você estivesse falando cara a cara com a IA que vai executar o trabalho. Sem explicações sobre o processo de melhoria dentro do prompt.
4. SOBERANIA DO INPUT: Respeite a intenção original. Se o usuário já deu uma ordem, apenas a torne mais potente e técnica.

ESTRUTURA INTERNA OBRIGATÓRIA:
1. [PERSONA]: Identidade especializada e autoritária.
2. [CONTEXTO]: Cenário e metas.
3. [TAREFA]: Instruções de execução imediatas e passo a passo.
4. [RESTRIÇÕES NEGATIVAS]: O que é proibido fazer.
5. [FORMATO DE SAÍDA]: Regras estritas de entrega.

REGRAS DE OURO:
- IDIOMA: Português Brasil (PT-BR) absoluto.
- AUTO-CORREÇÃO: Remova ambiguidades e "perfumaria" emocional desnecessária.

FORMATO DE RESPOSTA (ESTRITO):
---PROMPT---
[Ordem Direta de Execução Estruturada]
---REASONING---
- [Decisão técnica 1: Justificativa da Persona/Inferência]
- [Decisão técnica 2: Por que o comando é imperativo]
- [Decisão técnica 3: Restrições de segurança/estilo]

Proibido qualquer introdução ou conclusão.`;

export async function POST(req: Request) {
    try {
        // 1. VERIFICAÇÃO DE AUTENTICAÇÃO
        const authHeader = req.headers.get('Authorization');
        const token = authHeader?.replace('Bearer ', '');

        const { data: { user }, error: authError } = await supabase.auth.getUser(token);

        if (authError || !user) {
            return NextResponse.json({ error: "Sessão expirada ou usuário não autenticado." }, { status: 401 });
        }

        // 1.1 VERIFICAÇÃO DE ASSINATURA (AUTO-ATIVADA PARA PRODUÇÃO)
        const { data: profile } = await supabase
            .from('profiles')
            .select('is_pro')
            .eq('user_id', user.id)
            .single();

        if (!profile?.is_pro) {
            return NextResponse.json(
                {
                    error: "Acesso Restrito: Assinatura Pro Necessária",
                    code: "PAYMENT_REQUIRED",
                    message: "Você precisa de uma assinatura ativa para usar a otimização de elite. Clique em 'Aproveitar Oferta' para começar."
                },
                { status: 403 }
            );
        }

        if (!token) {
            return NextResponse.json({ error: "Sessão expirada ou usuário não autenticado." }, { status: 401 });
        }

        // 1.2 VERIFICAÇÃO DE USO MENSAL (Limite de 1000)
        const now = new Date();
        const monthYear = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
        const serverSupabase = createServerSupabase(token);

        const { data: currentUsage } = await serverSupabase
            .from('user_usage')
            .select('prompt_count')
            .eq('user_id', user.id)
            .eq('month_year', monthYear)
            .single();

        if (currentUsage && currentUsage.prompt_count >= 1000) {
            return NextResponse.json(
                { error: "Muitas solicitações realizadas, aguarde um período ou entre em contato com o suporte." },
                { status: 429 }
            );
        }

        const { prompt, context, platform } = await req.json();

        // 2. TRAVA DE SEGURANÇA: Limite de Caracteres (Reduzido para 400)
        const MAX_CHARS = 400;
        if (prompt?.length > MAX_CHARS) {
            return NextResponse.json(
                { error: `O prompt é muito longo (máximo de ${MAX_CHARS} caracteres). Por favor, reduza o texto.` },
                { status: 400 }
            );
        }


        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) return NextResponse.json({ error: 'API Key missing' }, { status: 500 });

        const genAIClient = new GoogleGenerativeAI(apiKey);
        // Restaurando para o modelo Gemini 2.0 Flash
        const modelGemini = genAIClient.getGenerativeModel({
            model: 'gemini-2.0-flash',
            systemInstruction: MASTER_SYSTEM_PROMPT
        });
        const arch = ARCHITECTURES[context.intention] || ARCHITECTURES['Texto'];

        const finalInput = `
### TAREFA DE ENGENHARIA DE PROMPT
TRANSFORME O COMANDO ABAIXO EM UM PROMPT MESTRE DE ALTO VALOR E IMPACTO PROFISSIONAL.

### COMANDO BRUTO (INPUT):
"${prompt}"

### DIRETRIZES TÉCNICAS (INTEGRAÇÃO):
- Categoria/Intenção: ${context.intention}
- Plataforma Alvo: ${platform?.toUpperCase() || 'GEMINI'} (Otimize especificamente para este modelo)
- Persona Esperada: ${context.persona} (Expanda para nível Arquiteto/Sênior)
- Tom de Voz Solicitado: ${context.tone}
- Objetivo Final: ${context.goal}
- Framework de Arquitetura: ${arch.system}

### EXEMPLOS DE "WOW EFFECT" (FEW-SHOT):
${arch.examples}

### ORDEM FINAL DE COMPILAÇÃO:
Gere o prompt mestre ultra-expandido. Ele deve ser denso, cobrir contexto, persona, tarefa detalhada passo a passo e restrições negativas. Use termos técnicos. NÃO responda ao comando bruto.
`;

        const result = await modelGemini.generateContent({
            contents: [{ role: 'user', parts: [{ text: finalInput }] }],
            generationConfig: {
                temperature: 0.4, // Aumentado para expansão criativa rica
                topP: 0.95,
                maxOutputTokens: 3000 // Aumentado para prompts longos
            }
        });

        const rawText = (await result.response).text().trim();
        const promptMatch = rawText.match(/---PROMPT---([\s\S]*?)---REASONING---/);
        const reasoningMatch = rawText.match(/---REASONING---([\s\S]*)/);

        const improvedRaw = promptMatch ? promptMatch[1].trim() : rawText;
        let improved = improvedRaw;
        let statsResult;
        let reasoningResult;

        // 4. LOG DE SUCESSO
        if (improved) {
            console.log(`🚀 Sucesso: Prompt otimizado para ${user.email}`);
        }

        // --- VALIDAÇÃO DE QUALIDADE E SEGURANÇA ---
        // Afrouxamos o filtro para permitir prompts estruturados com passos
        const hasInstructions = improved.toLowerCase().includes("atue como") ||
            improved.toLowerCase().includes("sua tarefa") ||
            improved.toLowerCase().includes("diretrizes");

        const isRecipeContent = (improved.toLowerCase().includes("ingredientes:") || improved.toLowerCase().includes("modo de preparo:")) &&
            !improved.toLowerCase().includes("atue como");

        if (!promptMatch || isRecipeContent || (improved.split(/\s+/).length < 20 && !hasInstructions)) {
            console.warn("🛡️ Refinamento de Fallback Acionado.");

            const metaPrompt = `Atue como um Especialista Sênior em Engenharia de Prompt. 
Sua tarefa é criar um comando de altíssima performance para atingir o seguinte objetivo: "${prompt}".

ESTRUTURA MESTRE ESPERADA:
1. PERSONA: Assuma o papel de um expert em ${context.persona}.
2. CONTEXTO: Analise o pedido sob a ótica de ${context.goal}.
3. TAREFA DETALHADA: Desenvolva um roteiro passo a passo com tom ${context.tone}.
4. REGRAS: Estabeleça 5 restrições críticas para garantir um resultado profissional.
5. FORMATO: Defina exatamente como a resposta deve ser entregue.

Maximize a densidade técnica e a utilidade prática deste comando.`;

            improved = metaPrompt;
            statsResult = { tokensOriginal: 0, tokensImproved: 100, economy: 10 };
            reasoningResult = ["Otimização estrutural baseada em metadados", "Aplicação de persona expert", "Refinamento de diretrizes técnicas"];
        } else {
            statsResult = {
                tokensOriginal: (await modelGemini.countTokens(prompt)).totalTokens,
                tokensImproved: (await modelGemini.countTokens(improved)).totalTokens,
                economy: 20
            };
            reasoningResult = (reasoningMatch ? reasoningMatch[1].trim().split('\n') : []).map(r => r.replace(/^-\s*/, '').trim()).filter(r => r.length > 0);
        }

        // 5. REGISTRAR USO NO BANCO DE DADOS (Agora captura todos os casos com o schema correto)
        try {
            const now = new Date();
            const monthYear = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

            // Primeiro tentamos buscar o registro atual para este mês
            const { data: currentUsage } = await serverSupabase
                .from('user_usage')
                .select('prompt_count')
                .eq('user_id', user.id)
                .eq('month_year', monthYear)
                .single();

            const newCount = (currentUsage?.prompt_count || 0) + 1;

            const { error: insertError } = await serverSupabase
                .from('user_usage')
                .upsert({
                    user_id: user.id,
                    email: user.email, // Adicionado para facilitar visualização no banco
                    month_year: monthYear,
                    prompt_count: newCount,
                    last_used: now.toISOString()
                }, {
                    onConflict: 'user_id,month_year'
                });

            if (insertError) {
                console.error('Erro ao registrar uso no Supabase:', insertError);
            }
        } catch (usageErr) {
            console.error('Falha crítica no log de uso:', usageErr);
        }

        return NextResponse.json({
            improved,
            reasoning: reasoningResult,
            stats: statsResult
        });

    } catch (error: unknown) {
        const err = error as { message?: string; status?: number };
        console.error('Detailed API Error:', error);

        // Tratamento específico para erros conhecidos do Gemini
        let errorMessage = "Erro na Otimização";

        if (err.message?.includes("SAFETY")) {
            errorMessage = "O Google bloqueou esta solicitação por conter conteúdo sensível ou violar diretrizes de segurança (ex: celebridades, violência ou conteúdo impróprio).";
        } else if (err.message?.includes("API key")) {
            errorMessage = "Erro na Chave de API: Configure sua GEMINI_API_KEY corretamente no Supabase/Vercel.";
        } else if (err.status === 429 || err.message?.includes("429")) {
            errorMessage = `Limite temporário de requisições atingido. Detalhe: ${err.message || 'Verifique sua cota no Google AI Studio'}. Tente novamente em alguns segundos.`;
        } else if (err.message) {
            errorMessage = `Ops! Ocorreu um problema técnico: ${err.message}`;
        }

        return NextResponse.json(
            { error: errorMessage },
            { status: 500 }
        );
    }
}
