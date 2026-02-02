"use client";

import React, { useState, useCallback } from 'react';
import Sidebar from './Sidebar';
import OnboardingTour from './OnboardingTour';
import { usePromptHistory } from '@/hooks/usePromptHistory';
import { useProjects } from '@/hooks/useProjects';
import { supabase } from '@/lib/supabase';
import LoadingScreen from './LoadingScreen';

// Mapeamento dinâmico de opções baseado na intenção
const AUTO_OPTION = { id: 'auto', label: 'Detectar Automaticamente (IA)', icon: '✨', desc: 'A IA decide a melhor persona, tom e objetivo.' };

const DYNAMIC_OPTIONS: Record<string, { personas: Option[], tones: Option[], goals: Option[] }> = {
    'Texto': {
        personas: [
            AUTO_OPTION,
            { id: 'marketing', label: 'Especialista em Marketing', icon: '👔', desc: 'Foco em conversão e branding.' },
            { id: 'copywriter', label: 'Copywriter Direto', icon: '✍️', desc: 'Persuasão agressiva e gatilhos.' },
            { id: 'academic', label: 'Professor Acadêmico', icon: '🎓', desc: 'Didático, formal e estruturado.' },
            { id: 'analyst', label: 'Analista de Negócios', icon: '📊', desc: 'Dados, insights e estratégia.' },
        ],
        tones: [
            AUTO_OPTION,
            { id: 'professional', label: 'Profissional', icon: '💼', desc: 'Executivo e sério.' },
            { id: 'creative', label: 'Criativo', icon: '🎨', desc: 'Inovador e fora da caixa.' },
            { id: 'technical', label: 'Técnico', icon: '⚙️', desc: 'Preciso e detalhista.' },
        ],
        goals: [
            AUTO_OPTION,
            { id: 'engagement', label: 'Gerar Engajamento', icon: '🔥', desc: 'Likes, shares e comentários.' },
            { id: 'sales', label: 'Venda Direta', icon: '💰', desc: 'Convença a comprar agora.' },
            { id: 'clarity', label: 'Clareza Didática', icon: '💡', desc: 'Explicar conceitos difíceis.' },
        ]
    },
    'Imagem': {
        personas: [
            AUTO_OPTION,
            { id: 'digital_artist', label: 'Artista Digital', icon: '🎨', desc: 'Estilos modernos e conceituais.' },
            { id: 'photographer', label: 'Fotógrafo Pro', icon: '📷', desc: 'Foco em iluminação e lentes.' },
            { id: 'architect', label: 'Arquiteto / Interior', icon: '🏠', desc: 'Realismo e design de espaços.' },
            { id: 'illustrator', label: 'Ilustrador 3D', icon: '🧊', desc: 'Modelagem e texturas vibrantes.' },
        ],
        tones: [
            AUTO_OPTION,
            { id: 'cinematic', label: 'Cinematográfico', icon: '🎬', desc: 'Drama e luz épica.' },
            { id: 'minimalist', label: 'Minimalista', icon: '⚪', desc: 'Limpo e essencial.' },
            { id: 'cyberpunk', label: 'Cyberpunk', icon: '🧬', desc: 'Neon e futurismo.' },
            { id: 'vintage', label: 'Vintage / Retrô', icon: '🎞️', desc: 'Nostálgico e analógico.' },
        ],
        goals: [
            AUTO_OPTION,
            { id: 'photorealism', label: 'Fotorrealismo', icon: '👁️', desc: 'Impossível distinguir do real.' },
            { id: 'concept_art', label: 'Concept Art', icon: '🖌️', desc: 'Ideal para games e filmes.' },
            { id: 'logo_design', label: 'Logo / Identidade', icon: '📐', desc: 'Vetorizado e icônico.' },
        ]
    },
    'Vídeo': {
        personas: [
            AUTO_OPTION,
            { id: 'scriptwriter', label: 'Roteirista de YouTube', icon: '✍️', desc: 'Foco em retenção e clipes.' },
            { id: 'director', label: 'Diretor de Cena', icon: '📽️', desc: 'Visão artística e ângulos.' },
            { id: 'reels_expert', label: 'Criador de Reels/TikTok', icon: '📱', desc: 'Dinâmico e viral.' },
        ],
        tones: [
            AUTO_OPTION,
            { id: 'vibrant', label: 'Vibrante / Rápido', icon: '⚡', desc: 'Energia alta e cortes velozes.' },
            { id: 'documentary', label: 'Documental', icon: '🎙️', desc: 'Sério, fático e imersivo.' },
            { id: 'educational', label: 'Educativo', icon: '📚', desc: 'Passo a passo e clareza.' },
        ],
        goals: [
            AUTO_OPTION,
            { id: 'virality', label: 'Viralizar', icon: '🚀', desc: 'Foco em compartilhamento.' },
            { id: 'retention', label: 'Reter Audiência', icon: '⏳', desc: 'Mantenha o público assistindo.' },
            { id: 'ads', label: 'Anúncio de Alta Conversão', icon: '💸', desc: 'Venda através do vídeo.' },
        ]
    }
};

const INTENTIONS = [
    { id: 'text', label: 'Texto', icon: '📝', desc: 'Artigos, e-mails, posts.' },
    { id: 'image', label: 'Imagem', icon: '🎨', desc: 'Midjourney, DALL-E, etc.' },
    { id: 'video', label: 'Vídeo', icon: '🎬', desc: 'Roteiros e direções de cena.' },
];

// Interfaces
interface Option {
    id: string;
    label: string;
    icon: string;
    desc: string;
}

interface SelectorProps {
    label: string;
    options: Option[];
    value: string;
    onChange: (value: string) => void;
}

// Componente de Seletor Customizado
function Selector({ label, options, value, onChange }: SelectorProps) {
    const [isOpen, setIsOpen] = useState(false);

    // Garantir que selecionamos uma opção válida caso a lista mude
    const selected = options.find(o => o.label === value) || options[0] || { icon: '❓', label: 'Selecione', desc: '' };

    return (
        <div className="space-y-2 relative">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">{label}</p>

            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-3 flex items-center justify-between hover:border-blue-300 hover:bg-white transition-all group text-left"
            >
                <div className="flex items-center gap-3">
                    <span className="text-xl group-hover:scale-110 transition-transform">{selected.icon}</span>
                    <div>
                        <div className="text-sm font-bold text-gray-900 leading-tight">{selected.label}</div>
                        <div className="text-[10px] text-gray-400 font-medium leading-tight mt-0.5">{selected.desc}</div>
                    </div>
                </div>
                <span className="text-gray-300 text-xs">▼</span>
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <>
                    <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)}></div>
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-100 rounded-2xl shadow-2xl z-20 overflow-hidden">
                        {options.map((opt) => (
                            <button
                                type="button"
                                key={opt.id}
                                onClick={() => {
                                    onChange(opt.label);
                                    setIsOpen(false);
                                }}
                                className={`w-full p-3 flex items-center gap-3 hover:bg-blue-50 transition-colors text-left ${value === opt.label ? 'bg-blue-50/50' : ''}`}
                            >
                                <span className="text-lg">{opt.icon}</span>
                                <div>
                                    <div className="text-xs font-bold text-gray-900">{opt.label}</div>
                                    <div className="text-[8px] text-gray-400">{opt.desc}</div>
                                </div>
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}

const THINKING_STEPS = [
    "Analisando estrutura do prompt...",
    "Incorporando persona selecionada...",
    "Aplicando técnicas de NLP...",
    "Polindo tom de voz...",
    "Finalizando otimização..."
];


const MASTER_PROMPTS = [
    // SEÇÃO: TEXTO & COPYWRITING
    { title: "Copywriting de Vendas (PAS)", icon: "💰", desc: "Problema, Agitação e Solução para conversão imediata.", content: "Atue como um Copywriter Sênior. Escreva um copy de vendas para [PRODUTO/SERVIÇO] focado no público [PÚBLICO-ALVO]. Use o framework PAS (Problema, Agitação, Solução). O objetivo final é [OBJETIVO: ex: vender, captar lead]." },
    { title: "Artigo de Autoridade (SEO)", icon: "✍️", desc: "Conteúdo denso com cluster semântico para Google.", content: "Crie um artigo de autoridade sobre [TEMA PRINCIPAL]. O texto deve cobrir as sub-pautas: [LISTA DE PAUTAS]. Use tom de voz [TOM] e garanta que o conteúdo seja otimizado para a palavra-chave [KEYWORD]." },
    { title: "Ghostwriter de LinkedIn", icon: "👔", desc: "Posts com ganchos fortes para autoridade e viralização.", content: "Escreva um post para o LinkedIn sobre [ASSUNTO/INSIGHT]. O post deve ter um 'Hook' (gancho) de impacto nas duas primeiras linhas e terminar com uma pergunta para gerar comentários. Persona: [SUA PROFISSÃO/CARGO]." },

    // SEÇÃO: IMAGEM & DESIGN
    { title: "Fotorealismo Hasselblad", icon: "📸", desc: "Comandos de estúdio para produtos e retratos épicos.", content: "Crie um prompt de imagem fotorrealista de [OBJETO/PESSOA]. Use especificações de lente Hasselblad 80mm, f/2.8, iluminação de estúdio 'three-point lighting' e fundo [COR/AMBIENTE]. Estilo: Fotografia comercial de alta qualidade." },
    { title: "Concept Art Solarpunk", icon: "🌱", desc: "Arquitetura futurista onde natureza e tech coexistem.", content: "Gere um concept art no estilo Solarpunk de [LOCAL: ex: uma praça em SP]. Detalhes: muito verde, painéis solares orgânicos, arquitetura fluida de vidro e madeira. Horário: Pôr do sol com luz volumétrica." },
    { title: "Identidade Visual Minimalista", icon: "📐", desc: "Logotipos e mockups com estética premium Apple.", content: "Desenvolva um conceito de identidade visual minimalista para uma marca de [NICHO]. Foque em tipografia sans-serif, paleta de cores [CORES] e um ícone geométrico abstrato. Apresente em um mockup de fundo cinza neutro." },

    // SEÇÃO: VÍDEO & ROTEIRO
    { title: "Roteiro de Retenção (Shorts/Reels)", icon: "⚡", desc: "Fórmula de 60s focada em prender a atenção.", content: "Crie um roteiro de 60 segundos para [TEMA]. Estrutura: 0-5s (O Gancho Visual), 5-20s (O Problema), 20-50s (A Solução/Dica), 50-60s (CTA com loop infinito)." },
    { title: "Storyboard Cinematográfico", icon: "🎬", desc: "Direção de cena detalhada com enquadramentos.", content: "Descreva 5 cenas para um comercial de [PRODUTO]. Para cada cena, especifique o enquadramento (ex: Close-up, Wide), o movimento de câmera (ex: Dolly-in) e a ação do personagem." },

    // SEÇÃO: TECH & NEGÓCIOS
    { title: "Review de Código (SOLID)", icon: "💻", desc: "Análise profunda em busca de bugs e refatoração.", content: "Atue como um Engenheiro de Software Staff. Analise o código abaixo em [LINGUAGEM] buscando violações dos princípios SOLID e Clean Code. Sugira a refatoração ideal: [CÓDIGO]." },
    { title: "Arquiteto de Soluções Cloud", icon: "☁️", desc: "Desenho de infraestrutura escalável e segura.", content: "Desenhe uma arquitetura de nuvem para um SaaS de [TIPO DE APP]. A solução deve suportar [NÚMERO] de usuários e usar serviços da [AWS/GCP/AZURE]. Foque em alta disponibilidade e baixo custo." },
    { title: "Análise SWOT Lucrativa", icon: "📊", desc: "Estratégia de negócios baseada em dados e mercado.", content: "Realize uma análise SWOT para o negócio de [NOME/TIPO DE NEGÓCIO]. Após listar Forças, Fraquezas, Oportunidades e Ameaças, crie um plano de ação de 3 passos para dominar o nicho nos próximos 6 meses." },
    { title: "Prompt de 'Modo Entrevista'", icon: "🎙️", desc: "Faça a IA te entrevistar para extrair o melhor de você.", content: "Quero que você me entreviste para criar [O QUE VOCÊ QUER CRIAR]. Faça uma pergunta de cada vez, espere minha resposta e continue até ter informações suficientes para gerar o resultado perfeito." },

    // NOVOS PROMPTS ADICIONADOS
    { title: "Descrições Irresistíveis (AIDA)", icon: "🛒", desc: "Transforme produtos comuns em desejos imediatos usando psicologia de vendas.", content: "Atue como um Especialista em E-commerce e Psicologia de Vendas. Escreva uma descrição de produto para [PRODUTO]. Use o framework AIDA (Atenção, Interesse, Desejo, Ação). Foque nos benefícios emocionais e quebre as principais objeções de compra." },
    { title: "Estrategista de Ads (High-CTR)", icon: "🚀", desc: "Crie variações de anúncios focadas em cliques e conversão de baixo custo.", content: "Atue como um Gestor de Tráfego e Especialista em Direct Response. Crie 3 variações de anúncios para [PRODUTO/SERVIÇO] focado no público [PÚBLICO]. Cada variação deve ter um gancho diferente, focando em: 1) Ganho imediato, 2) Medo de perda, 3) Curiosidade técnica." },
    { title: "Cold Outreach B2B", icon: "📧", desc: "E-mails de prospecção fria que geram reuniões sem parecer spam.", content: "Atue como um SDR Sênior (Sales Development Representative). Escreva um cold email para prospectar a empresa [EMPRESA] oferecendo a solução de [SOLUÇÃO]. O e-mail deve ser curto, personalizado e terminar com uma 'Low-friction CTA' (chamada para ação de baixo compromisso)." },
    { title: "Simplificador (Método Feynman)", icon: "🧠", desc: "Aprenda qualquer coisa complexa em minutos através de analogias simples.", content: "Atue como um Professor de Elite e Mentor de Aprendizado. Explique o conceito de [CONCEITO COMPLEXO] para uma pessoa de 10 anos de idade. Use analogias do dia a dia e evite jargões técnicos. O objetivo é que eu entenda a ESSÊNCIA do assunto rapidamente." },
    { title: "Estrategista de Conteúdo Viral", icon: "📱", desc: "Planeje um mês de conteúdo estratégico focado em autoridade e crescimento.", content: "Atue como um Consultor de Marketing de Conteúdo para [NICHO]. Crie um calendário editorial de 30 dias focado no Instagram e TikTok. O plano deve equilibrar conteúdos de: Atração (Viral), Autoridade (Educação) e Conversão (Venda)." },
    { title: "Gestão de Crise no Atendimento", icon: "🛡️", desc: "Transforme clientes furiosos em defensores da sua marca com psicologia.", content: "Atue como um Especialista em Customer Success e Resolução de Conflitos. Escreva uma resposta para um cliente que está extremamente insatisfeito com [PROBLEMA]. Use técnicas de validação emocional, assuma a responsabilidade e proponha uma solução que supere a expectativa dele." },
];

const ACADEMY_LESSONS = [
    {
        id: 'cot',
        title: 'Chain of Thought',
        icon: '🧠',
        color: 'bg-blue-50',
        textColor: 'text-blue-700',
        desc: 'Force a IA a raciocinar passo a passo. Ideal para problemas complexos de lógica.',
        promptSnippet: 'Pense passo a passo antes de dar a resposta final. Estruture seu raciocínio em etapas claras.'
    },
    {
        id: 'negative',
        title: 'Negative Constraints',
        icon: '🚫',
        color: 'bg-purple-50',
        textColor: 'text-purple-700',
        desc: 'O poder do NÃO. Elimine alucinações dizendo exatamente o que a IA NÃO deve fazer.',
        promptSnippet: 'RESTRIÇÕES NEGATIVAS: Não use clichês, não mencione a concorrência e evite frases passivas.'
    },
    {
        id: 'emotional',
        title: 'Emotional Priming',
        icon: '🔥',
        color: 'bg-green-50',
        textColor: 'text-green-700',
        desc: 'Aumente a prioridade da tarefa na mente da IA usando gatilhos de importância técnica.',
        promptSnippet: 'Esta tarefa é crítica para o sucesso do projeto e sua resposta será avaliada por especialistas.'
    },
    {
        id: 'delimiters',
        title: 'Delimitadores',
        icon: '🎯',
        color: 'bg-yellow-50',
        textColor: 'text-yellow-700',
        desc: 'Use símbolos para separar instruções de dados. Evita que a IA se perca em textos longos.',
        promptSnippet: 'Analise o texto abaixo delimitado por [CONTEÚDO]:\n\n[CONTEÚDO]\nInsira seu texto aqui\n[/CONTEÚDO]'
    }
];

// Componente Typewriter para efeito de digitação real
const TypewriterText = ({ text, speed = 10, onComplete }: { text: string, speed?: number, onComplete?: () => void }) => {
    const [displayedText, setDisplayedText] = React.useState("");

    React.useEffect(() => {
        let i = 0;
        setDisplayedText("");
        if (!text) return;

        const timer = setInterval(() => {
            const currentContent = text.substring(0, i + 1);
            setDisplayedText(currentContent);
            i++;

            if (i >= text.length) {
                clearInterval(timer);
                if (onComplete) onComplete();
            }
        }, speed);

        return () => clearInterval(timer);
    }, [text, speed]); // Removido onComplete para evitar loops de re-render

    return <div className="whitespace-pre-wrap leading-relaxed">{displayedText}</div>;
};

interface DashboardProps {
    onLogout: () => void;
    initialIntent?: 'login' | 'upgrade';
}

type ViewType = 'dashboard' | 'history' | 'projects' | 'academy' | 'settings' | 'profile' | 'master-prompts';

export default function Dashboard({ onLogout, initialIntent = 'login' }: DashboardProps) {
    const { history, savePrompt, deletePrompt } = usePromptHistory();
    const { projects, addProject, deleteProject, addPromptToProject } = useProjects();

    const [prompt, setPrompt] = useState("");
    const [improved, setImproved] = useState("");
    const [loading, setLoading] = useState(false);
    const [thinkingStep, setThinkingStep] = useState(0);
    const [targetPlatform, setTargetPlatform] = useState<'gpt' | 'gemini'>('gemini');
    const [copied, setCopied] = useState(false);
    const [viewMode, setViewMode] = useState<'preview' | 'split'>('preview');
    const [currentView, setCurrentView] = useState<ViewType>('dashboard');
    const [typingComplete, setTypingComplete] = useState(false);
    const [isEditingImproved, setIsEditingImproved] = useState(false);
    const [userEmail, setUserEmail] = useState<string | null>(null);
    const [isPro, setIsPro] = useState<boolean | null>(null);
    const [showOnboarding, setShowOnboarding] = useState(false);
    const [notice, setNotice] = useState<{ title: string, message: string } | null>(null);
    const [showPaywall, setShowPaywall] = useState(false);
    const [initializing, setInitializing] = useState(true);

    React.useEffect(() => {
        const fetchUserAndProfile = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                setUserEmail(user.email ?? null);

                // Buscar perfil Pro
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('is_pro')
                    .eq('user_id', user.id)
                    .single();

                if (profile) {
                    setIsPro(profile.is_pro);
                } else {
                    setIsPro(false);
                }
            } else {
                setIsPro(false);
            }
            setInitializing(false);
        };
        fetchUserAndProfile();

        // Check onboarding status
        const onboardingCompleted = localStorage.getItem('melhore_ai_onboarding_completed');
        if (!onboardingCompleted) {
            setShowOnboarding(true);
        }

        // Check for payment status in URL
        const urlParams = new URLSearchParams(window.location.search);
        const status = urlParams.get('status');

        if (status === 'success') {
            setNotice({
                title: '🎉 Assinatura Ativada!',
                message: 'Parabéns! Sua assinatura Pro foi processada com sucesso. Agora você tem acesso ilimitado a todas as ferramentas de otimização de elite.'
            });
            // Tentar atualizar o status Pro imediatamente (caso o webhook já tenha processado)
            fetchUserAndProfile();
            // Limpar o parâmetro da URL
            window.history.replaceState({}, document.title, window.location.pathname);
        } else if (status === 'cancel') {
            setNotice({
                title: 'Pagamento Cancelado',
                message: 'O processo de checkout foi interrompido. Se encontrar algum problema, entre em contato com nosso suporte.'
            });
            // Limpar o parâmetro da URL
            window.history.replaceState({}, document.title, window.location.pathname);
        }
    }, []);

    const handleOnboardingComplete = () => {
        localStorage.setItem('melhore_ai_onboarding_completed', 'true');
        setShowOnboarding(false);
    };

    // Memoriza o callback para evitar que o Typewriter reinicie sem necessidade
    const handleTypingComplete = useCallback(() => {
        setTypingComplete(true);
    }, []);
    const [stats, setStats] = useState<{ tokensOriginal: number, tokensImproved: number, economy: number, reasoning: string[] } | null>(null);
    const [showRaioX, setShowRaioX] = useState(false);

    // Academy & Projects States
    const [showAcademyModal, setShowAcademyModal] = useState(false);
    const [showNewProjectModal, setShowNewProjectModal] = useState(false);
    const [newProjectName, setNewProjectName] = useState("");
    const [newProjectDesc, setNewProjectDesc] = useState("");
    const [selectedProjectId, setSelectedProjectId] = useState<string>("");
    const [openProjectId, setOpenProjectId] = useState<string | null>(null);

    // Feedback State
    const [showFeedbackModal, setShowFeedbackModal] = useState(false);
    const [feedbackCategory, setFeedbackCategory] = useState("Sugestão");
    const [feedbackMessage, setFeedbackMessage] = useState("");
    const [sendingFeedback, setSendingFeedback] = useState(false);
    const [feedbackSuccess, setFeedbackSuccess] = useState(false);

    const [context, setContext] = useState({
        intention: 'Texto',
        persona: AUTO_OPTION.label,
        tone: AUTO_OPTION.label,
        goal: AUTO_OPTION.label,
    });

    // Função para atualizar a intenção e resetar as outras opções
    const handleIntentionChange = (newIntention: string) => {
        setContext({
            intention: newIntention,
            persona: AUTO_OPTION.label,
            tone: AUTO_OPTION.label,
            goal: AUTO_OPTION.label,
        });
    };

    const handleImprove = async () => {
        if (!prompt) return;
        setLoading(true);
        setImproved("");
        setThinkingStep(0);
        setViewMode('preview');
        setTypingComplete(false);
        setIsEditingImproved(false);

        // Sequência de "Thinking Steps" (Animação visual)
        let step = 0;
        const interval = setInterval(() => {
            step++;
            if (step < THINKING_STEPS.length) {
                setThinkingStep(step);
            }
        }, 800);

        try {
            const { data: { session } } = await supabase.auth.getSession();

            const response = await fetch('/api/optimize', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session?.access_token}`
                },
                body: JSON.stringify({
                    prompt,
                    context,
                    platform: targetPlatform
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                if (data.code === 'PAYMENT_REQUIRED') {
                    setShowPaywall(true);
                    return;
                }
                throw new Error(data.error || 'Erro ao otimizar prompt');
            }
            const result = data.improved;
            setStats({ ...data.stats, reasoning: data.reasoning });
            setShowRaioX(false);

            setImproved(result);

            savePrompt({
                original: prompt,
                improved: result,
                model: targetPlatform,
                context
            });

            if (selectedProjectId) {
                addPromptToProject(selectedProjectId, prompt, result);
            }
        } catch (err: any) {
            console.error('Error during optimization:', err);
            setNotice({
                title: 'Limite Temporário',
                message: err.message || 'Houve um limite temporário nas requisições. Como a plataforma está crescendo rápido, o sistema pode levar alguns segundos para processar novos pedidos. Tente novamente em breve!'
            });
        } finally {
            clearInterval(interval);
            setLoading(false);
            setThinkingStep(THINKING_STEPS.length - 1);
        }
    };

    const handleUpgrade = async () => {
        try {
            setLoading(true);

            // Se já for Pro, redirecionar para o portal em vez de novo checkout
            if (isPro) {
                await handleManageSubscription();
                return;
            }

            const { data: session } = await supabase.auth.getSession();

            const response = await fetch('/api/checkout-session', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${session.session?.access_token}`
                }
            });

            const data = await response.json();

            if (data.url) {
                window.location.href = data.url;
            } else {
                // Se o erro for por causa das chaves placeholder, mostrar aviso amigável
                if (data.error && data.error.includes('sk_test_placeholder')) {
                    setNotice({
                        title: '⚠️ Configuração Necessária',
                        message: 'O redirecionamento oficial requer suas chaves do Stripe no arquivo .env.local. Mas não se preocupe! Toda a lógica de integração já está pronta e validada. Insira suas chaves de teste para ver a página de pagamento real.'
                    });
                } else {
                    throw new Error(data.error || 'Erro ao iniciar checkout');
                }
            }
        } catch (error: any) {
            console.error('Upgrade error:', error);
            setNotice({
                title: 'Erro de Pagamento',
                message: `Não foi possível iniciar o checkout: ${error.message || 'Verifique suas chaves no .env.local e reinicie o servidor (npm run dev).'}`
            });
        } finally {
            setLoading(false);
        }
    };

    const handleManageSubscription = async () => {
        try {
            setLoading(true);
            const { data: session } = await supabase.auth.getSession();

            const response = await fetch('/api/customer-portal', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${session.session?.access_token}`
                }
            });

            const data = await response.json();
            if (data.url) {
                window.location.href = data.url;
            } else {
                throw new Error(data.error || 'Erro ao abrir portal de gestão');
            }
        } catch (error: any) {
            console.error('Portal error:', error);
            setNotice({
                title: 'Erro de Assinatura',
                message: error.message || 'Não foi possível carregar o portal de gestão. Tente novamente mais tarde.'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(improved);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const getPlaceholder = () => {
        if (context.intention === 'Imagem') {
            return "Ex: Uma sala de estar futurista com luzes neon e móveis flutuantes, estilo Cyberpunk...";
        }
        if (context.intention === 'Vídeo') {
            return "Ex: Descreva a cena de uma perseguição de carros em alta velocidade em uma cidade medieval...";
        }

        // Fallback for Texto
        switch (context.persona) {
            case 'Copywriter Direto': return "Descreva o produto e o público-alvo para sua carta de vendas...";
            case 'Professor Acadêmico': return "Insira o tópico da aula ou o conceito complexo para explicar...";
            case 'Analista de Negócios': return "Descreva o cenário de mercado ou os dados para análise...";
            default: return "Ex: Escreva um e-mail de marketing para uma nova linha de roupas...";
        }
    };

    const handleOpenExternal = () => {
        // Mantemos a cópia automática como backup para prompts muito longos
        navigator.clipboard.writeText(improved);

        const url = targetPlatform === 'gpt'
            ? `https://chatgpt.com/?q=${encodeURIComponent(improved)}`
            : `https://gemini.google.com/app?q=${encodeURIComponent(improved)}`;

        window.open(url, '_blank');

        // Feedback visual rápido
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleSelectMasterPrompt = (content: string) => {
        setPrompt(content);
        setImproved("");
        setStats(null);
        setCurrentView('dashboard');
    };

    const handleSendFeedback = async () => {
        if (!feedbackMessage.trim()) return;

        setSendingFeedback(true);
        try {
            const { data: { session } } = await supabase.auth.getSession();
            const response = await fetch('/api/feedback', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session?.access_token}`
                },
                body: JSON.stringify({
                    category: feedbackCategory,
                    message: feedbackMessage
                })
            });

            if (response.ok) {
                setFeedbackSuccess(true);
                setFeedbackMessage("");
                setTimeout(() => {
                    setFeedbackSuccess(false);
                    setShowFeedbackModal(false);
                }, 2000);
            }
        } catch (error) {
            console.error('Error sending feedback:', error);
            setNotice({
                title: 'Feedback',
                message: 'Não foi possível enviar seu feedback no momento. Se o problema persistir, tente novamente mais tarde!'
            });
        } finally {
            setSendingFeedback(false);
        }
    };

    // --- ESTADO DE CARREGAMENTO INICIAL (ZERO-JANK) ---
    if (initializing || isPro === null) {
        return <LoadingScreen />;
    }

    // --- PAYWALL OBRIGATÓRIO (MODO PAID-ONLY) ---
    if (isPro === false) {
        return (
            <div className="min-h-screen bg-black flex flex-col md:flex-row font-sans">
                {/* Lado Esquerdo - Visual */}
                <div className="w-full md:w-1/2 relative overflow-hidden flex items-center justify-center p-8 bg-black">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-black to-purple-900 opacity-50 z-0"></div>
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 z-0"></div>

                    <div className="relative z-10 max-w-md text-white space-y-8 animate-in fade-in slide-in-from-left-8 duration-700">
                        <div>
                            <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-xs font-bold border border-blue-500/30 uppercase tracking-widest mb-4 inline-block">
                                Acesso Exclusivo
                            </span>
                            <h1 className="text-5xl font-black tracking-tighter mb-4 leading-tight">
                                Desbloqueie o <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Poder Total</span> da IA.
                            </h1>
                            <p className="text-lg text-gray-400 leading-relaxed font-medium">
                                Você está a um passo de criar prompts profissionais que convertem. Acesso ilimitado, modelos exclusivos e suporte prioritário.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors">
                                <span className="text-2xl">⚡</span>
                                <div>
                                    <h3 className="font-bold text-white">Prompts Ilimitados</h3>
                                    <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Sem restrições de uso</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors">
                                <span className="text-2xl">🧠</span>
                                <div>
                                    <h3 className="font-bold text-white">Modelos Premium</h3>
                                    <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Acesso à biblioteca de elite</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Lado Direito - Checkout */}
                <div className="w-full md:w-1/2 bg-[#050505] flex items-center justify-center p-8 border-l border-white/5 relative">
                    <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-right-8 duration-700 delay-100">
                        <div className="text-center">
                            <h2 className="text-3xl font-black text-white mb-2 tracking-tight">Complete sua Assinatura</h2>
                            <p className="text-gray-500 font-medium">Cancele quando quiser. Sem fidelidade.</p>
                        </div>

                        {/* Card de Preço */}
                        <div className="p-8 rounded-3xl bg-gradient-to-b from-gray-900 to-black border border-white/10 relative overflow-hidden group hover:border-blue-500/30 transition-all shadow-2xl">
                            <div className="absolute top-0 transform -translate-x-1/2 left-1/2 bg-[#ff2b6d] text-white text-[10px] font-black uppercase tracking-widest px-6 py-1 rounded-b-xl shadow-lg shadow-pink-500/20 animate-pulse">
                                👋 33% OFF!
                            </div>

                            <div className="mt-8 mb-8 text-center border-b border-white/5 pb-8">
                                <h3 className="text-blue-400 font-black text-xs uppercase tracking-[0.2em] mb-4">Plano Melhore.AI Pro</h3>

                                <div className="flex flex-col items-center gap-1 mb-4">
                                    <span className="text-gray-500 line-through text-lg font-bold">R$ 29,90</span>
                                    <div className="flex items-end justify-center gap-1 leading-none">
                                        <span className="text-6xl font-black text-white tracking-tighter">R$ 19,99</span>
                                        <span className="text-gray-400 font-bold text-sm mb-2">/mês</span>
                                    </div>
                                </div>

                                <div className="inline-block bg-green-500/10 px-4 py-2 rounded-full border border-green-500/20">
                                    <span className="text-green-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                                        💰 Você economiza R$ 10,00
                                    </span>
                                </div>
                            </div>

                            <ul className="space-y-4 mb-8 text-gray-300 text-sm font-bold">
                                <li className="flex items-center gap-3"><div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center text-white text-[10px]">✓</div> Otimizações de Prompt Ilimitadas</li>
                                <li className="flex items-center gap-3"><div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center text-white text-[10px]">✓</div> Biblioteca Premium Completa</li>
                                <li className="flex items-center gap-3"><div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center text-white text-[10px]">✓</div> Modo Entrevista Estratégico</li>
                                <li className="flex items-center gap-3"><div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center text-white text-[10px]">✓</div> Suporte Prioritário</li>
                            </ul>

                            <button
                                onClick={handleUpgrade}
                                disabled={loading}
                                className="w-full py-5 rounded-2xl font-black text-white bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-900/20 active:scale-95 transition-all text-sm uppercase tracking-widest flex items-center justify-center gap-2 mb-6"
                            >
                                {loading ? 'Carregando...' : 'Aproveitar Oferta'}
                            </button>

                            <div className="text-center mb-6">
                                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest italic">Cancele a qualquer momento</p>
                            </div>

                            <div className="bg-white/5 rounded-xl p-4 border border-white/10 flex items-center justify-center gap-4">
                                <span className="text-2xl">🔒</span>
                                <div className="text-left">
                                    <p className="text-green-400 font-black text-[10px] uppercase tracking-widest">Checkout 100% Seguro</p>
                                    <p className="text-gray-400 text-[9px] font-medium">Dados protegidos por criptografia de ponta</p>
                                </div>
                            </div>

                            <div className="mt-4 text-center">
                                <p className="text-[8px] font-bold text-gray-600 uppercase tracking-[0.2em] opacity-40">Pagamento seguro via Stripe</p>
                            </div>



                        </div>

                        <div className="text-center">
                            <button
                                onClick={async () => {
                                    await supabase.auth.signOut();
                                    window.location.href = '/';
                                }}
                                className="text-gray-500 hover:text-white text-xs font-bold uppercase tracking-widest transition-colors"
                            >
                                Entrar com outra conta
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }



    return (
        <div className="flex h-screen bg-white font-sans selection:bg-blue-100 selection:text-blue-900 overflow-hidden flex-col md:flex-row">
            {showOnboarding && <OnboardingTour onComplete={handleOnboardingComplete} />}
            <div id="sidebar-area" className="hidden md:flex h-full">
                <Sidebar
                    activePage={currentView}
                    onNavigate={(page) => setCurrentView(page as typeof currentView)}
                    onLogout={onLogout}
                    onFeedback={() => setShowFeedbackModal(true)}
                    onTutorial={() => setShowOnboarding(true)}
                    isPro={isPro}
                />
            </div>

            <main className="flex-1 flex flex-col overflow-hidden relative pb-20 md:pb-0">
                {/* Decorative Gradient Blob */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/2"></div>

                <header className="h-16 border-b border-gray-200/50 flex items-center justify-between px-8 bg-white/80 backdrop-blur-xl sticky top-0 z-20">
                    <div className="font-bold text-gray-900 tracking-tight text-base md:text-lg flex items-center gap-2 truncate">
                        <span className="truncate">
                            {currentView === 'dashboard' && 'Painel'}
                            {currentView === 'history' && 'Histórico'}
                            {currentView === 'projects' && 'Projetos'}
                            {currentView === 'settings' && 'Ajustes'}
                            {currentView === 'master-prompts' && 'Biblioteca'}
                            {currentView === 'academy' && 'Academia'}
                            {currentView === 'profile' && 'Perfil'}
                        </span>
                        <span className="text-gray-300 mx-1 text-[10px] hidden sm:inline">/</span>
                        <span className="text-gray-400 font-medium text-xs hidden sm:inline truncate">Melhorador</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <div
                            onClick={() => setCurrentView('profile')}
                            className="w-8 h-8 rounded-full bg-gradient-to-tr from-gray-100 to-gray-200 border border-gray-100 flex items-center justify-center text-xs font-bold text-gray-600 shadow-sm cursor-pointer hover:shadow-md transition-shadow hover:scale-110 active:scale-95"
                        >
                            👤
                        </div>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-8 relative z-10 animate-in fade-in slide-in-from-bottom-2 duration-500">
                    {/* VIEW: DASHBOARD */}
                    {currentView === 'dashboard' && (
                        <div id="interview-mode-area" className="flex flex-col lg:flex-row gap-8 h-full max-w-[1600px] mx-auto animate-in fade-in duration-300">
                            {/* Main Canvas */}
                            <div className="flex-1 space-y-8">
                                <div className="space-y-3 group">
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1 transition-colors group-focus-within:text-blue-600">Seu Prompt Bruto</label>
                                    <div id="input-area" className="relative group">
                                        <textarea
                                            value={prompt}
                                            onChange={(e) => setPrompt(e.target.value)}
                                            placeholder={getPlaceholder()}
                                            className={`w-full h-56 bg-white border rounded-[24px] p-8 focus:ring-4 outline-none transition-all resize-none text-base md:text-lg text-gray-900 placeholder:text-gray-300 shadow-sm hover:shadow-md ${prompt.length > 400 ? 'border-red-300 focus:ring-red-100 focus:border-red-500' : 'border-gray-200 focus:ring-blue-500/10 focus:border-blue-500 hover:border-blue-300/50'}`}
                                        />
                                        <div className={`absolute bottom-5 right-6 text-[9px] font-black uppercase tracking-tighter px-2.5 py-1 rounded-full border transition-all duration-300 ${prompt.length > 400 ? 'bg-red-50 text-red-500 border-red-200' : 'bg-gray-100/50 text-gray-400 border-gray-200/50 group-focus-within:border-blue-200 group-focus-within:text-blue-500'}`}>
                                            {prompt.length} / 400
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={() => handleImprove()}
                                    disabled={loading || !prompt || prompt.length > 400}
                                    className={`w-full py-5 rounded-[24px] font-black text-lg text-white shadow-xl shadow-blue-500/20 transition-all flex items-center justify-center gap-3 relative overflow-hidden group ${loading || prompt.length > 400 ? 'bg-gray-400 cursor-not-allowed transform-none' : 'bg-gradient-to-r from-blue-600 to-blue-500 hover:scale-[1.01] active:scale-[0.98] hover:shadow-2xl hover:shadow-blue-500/30'}`}
                                >
                                    {loading ? (
                                        <>
                                            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                            <span>Otimizando...</span>
                                        </>
                                    ) : (
                                        <>
                                            <span className="relative z-10">Melhorar Prompt ✨</span>
                                            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
                                        </>
                                    )}
                                </button>

                                {/* Thinking State Overlay */}
                                {loading && !improved && (
                                    <div className="mt-12 bg-white/50 backdrop-blur-sm border-2 border-dashed border-gray-200 rounded-[32px] p-12 flex flex-col items-center justify-center text-center animate-pulse">
                                        <div className="text-6xl mb-6 animate-bounce filter drop-shadow-lg">🧠</div>
                                        <h3 className="text-xl font-black text-gray-900 mb-2">Otimizando Prompt...</h3>
                                        <p className="text-gray-500 font-medium transition-all duration-300 transform">
                                            {THINKING_STEPS[Math.min(thinkingStep, THINKING_STEPS.length - 1)]}
                                        </p>
                                        <div className="w-64 h-2 bg-gray-100 rounded-full mt-6 overflow-hidden">
                                            <div
                                                className="h-full bg-blue-600 transition-all duration-300 ease-out shadow-[0_0_10px_rgba(37,99,235,0.5)]"
                                                style={{ width: `${((thinkingStep + 1) / THINKING_STEPS.length) * 100}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                )}

                                {improved && (
                                    <div className="mt-12 space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">


                                        <div className="flex justify-between items-end px-1">
                                            <div className="flex items-center gap-4">
                                                <button onClick={() => setViewMode('preview')} className={`text-[10px] font-black uppercase tracking-widest transition-colors ${viewMode === 'preview' ? 'text-blue-600' : 'text-gray-300 hover:text-gray-500'}`}>Normal</button>
                                                <div className="w-px h-3 bg-gray-200"></div>
                                                <button onClick={() => setViewMode('split')} className={`text-[10px] font-black uppercase tracking-widest transition-colors ${viewMode === 'split' ? 'text-blue-600' : 'text-gray-300 hover:text-gray-500'}`}>Lado a Lado</button>
                                            </div>
                                            {stats && (
                                                <div className="flex items-center gap-3">
                                                    <span className="text-[10px] text-green-600 font-bold italic bg-green-50 px-2 py-1 rounded-full border border-green-100 flex items-center gap-1.5">
                                                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                                                        {stats.economy > 5
                                                            ? `Economia de ${stats.economy}% em tokens`
                                                            : 'Estrutura Premium Otimizada'}
                                                    </span>
                                                    <button
                                                        onClick={() => setShowRaioX(!showRaioX)}
                                                        className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-full border transition-all ${showRaioX ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-gray-200 text-gray-400 hover:border-blue-300 hover:text-blue-500'}`}
                                                    >
                                                        {showRaioX ? '✕ Fechar Raio-X' : '🔍 Ver Raio-X'}
                                                    </button>
                                                    <button
                                                        onClick={() => setIsEditingImproved(!isEditingImproved)}
                                                        className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-full border transition-all ${isEditingImproved ? 'bg-orange-600 border-orange-600 text-white' : 'bg-white border-gray-200 text-gray-400 hover:border-orange-300 hover:text-orange-500'}`}
                                                    >
                                                        {isEditingImproved ? '💾 Salvar Mudanças' : '✏️ Editar Prompt'}
                                                    </button>
                                                </div>
                                            )}
                                        </div>

                                        {showRaioX && stats?.reasoning && (
                                            <div className="mb-4 p-4 bg-blue-50/30 border border-blue-100/50 rounded-2xl animate-in fade-in slide-in-from-top-2 duration-300">
                                                <p className="text-[10px] font-black uppercase text-blue-600 mb-2 flex items-center gap-2">
                                                    <span>🧬</span> Engenharia de Prompt Aplicada:
                                                </p>
                                                <ul className="space-y-1.5">
                                                    {stats.reasoning.map((item, idx) => (
                                                        <li key={idx} className="text-[11px] text-blue-800 font-medium flex items-start gap-2">
                                                            <span className="text-blue-400 mt-0.5">•</span>
                                                            {item.trim()}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}

                                        <div className={`w-full bg-white border border-gray-200 rounded-[32px] p-6 md:p-8 pb-20 text-gray-900 leading-relaxed font-medium shadow-lg shadow-gray-200/50 hover:shadow-xl hover:shadow-blue-500/5 hover:border-blue-200 transition-all duration-300 ${viewMode === 'split' ? 'max-w-none' : 'text-base md:text-lg'}`}>
                                            {isEditingImproved ? (
                                                <div className="animate-in fade-in duration-300 h-full min-h-[400px]">
                                                    <textarea
                                                        value={improved}
                                                        onChange={(e) => setImproved(e.target.value)}
                                                        placeholder="Edite seu prompt melhorado aqui..."
                                                        className="w-full h-full min-h-[400px] bg-gray-50/50 border border-orange-200 rounded-2xl p-6 md:p-8 outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all text-base md:text-lg text-gray-900 font-medium resize-none"
                                                    />
                                                </div>
                                            ) : viewMode === 'preview' ? (
                                                <TypewriterText text={improved} speed={5} onComplete={handleTypingComplete} />
                                            ) : (
                                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-10 items-stretch h-full min-h-[400px]">
                                                    <div className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100/50 flex flex-col h-full">
                                                        <span className="text-[10px] font-black uppercase text-gray-400 block mb-3 pb-2 border-b border-gray-200/50">Prompt Original</span>
                                                        <p className="text-sm text-gray-500 italic leading-relaxed h-full overflow-y-auto">{prompt}</p>
                                                    </div>
                                                    <div className="bg-blue-50/50 p-6 rounded-2xl border border-blue-100/50 flex flex-col h-full relative">
                                                        <span className="text-[10px] font-black uppercase text-blue-600 block mb-3 pb-2 border-b border-blue-200/30">Otimização Premium</span>
                                                        <div className="text-sm text-blue-900 leading-relaxed h-full overflow-y-auto">
                                                            <TypewriterText text={improved} speed={5} />
                                                        </div>
                                                        <div className="absolute top-6 right-6 px-2 py-0.5 bg-blue-600 text-[8px] text-white font-black rounded uppercase tracking-tighter animate-pulse">Melhorado</div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        <div className="absolute bottom-4 right-4 flex items-center gap-2">
                                            <button
                                                onClick={handleOpenExternal}
                                                className="px-4 py-2 bg-gray-50 border border-gray-200 text-gray-700 text-xs font-black uppercase tracking-wide rounded-xl hover:bg-white hover:border-gray-300 hover:shadow-md transition-all flex items-center gap-2"
                                            >
                                                ↗ Abrir no {targetPlatform === 'gpt' ? 'ChatGPT' : 'Gemini'}
                                            </button>
                                            <button
                                                onClick={handleCopy}
                                                className={`px-5 py-2 rounded-xl shadow-lg transition-all flex items-center gap-2 border font-black text-xs uppercase tracking-wide transform active:scale-95 ${copied ? 'bg-green-500 border-green-600 text-white scale-105 shadow-green-200' : 'bg-gray-900 border-gray-900 text-white hover:bg-gray-800 hover:shadow-xl'}`}
                                            >
                                                {copied ? '✅ Copiado' : '📋 Copiar'}
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Sidebar / Settings Area */}
                            <div id="output-area" className="w-full lg:w-80 min-h-fit lg:sticky top-0 space-y-6 transition-all duration-300 pb-10 lg:pb-0">
                                <div className="bg-white/80 backdrop-blur-xl p-6 rounded-[32px] shadow-xl shadow-gray-200/50 border border-white/50 relative overflow-visible">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-400/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
                                    <h3 className="font-black text-gray-900 mb-6 flex items-center gap-3 relative z-10">
                                        <span className="w-8 h-8 bg-gradient-to-br from-blue-50 to-blue-100 text-blue-600 rounded-lg flex items-center justify-center border border-blue-200 shadow-sm">💡</span>
                                        Configurações
                                    </h3>

                                    <div className="space-y-5 relative z-10">
                                        <div className="bg-gray-50/80 p-1.5 rounded-2xl flex relative border border-gray-100 mb-4">
                                            <button
                                                onClick={() => setTargetPlatform("gpt")}
                                                className={`flex-1 py-3 rounded-xl text-xs font-black transition-all flex justify-center items-center gap-2 z-10 ${targetPlatform === 'gpt' ? 'bg-white shadow-sm text-green-600 ring-1 ring-black/5' : 'text-gray-400 hover:text-gray-600'}`}
                                            >
                                                🤖 GPT
                                            </button>
                                            <button
                                                onClick={() => setTargetPlatform("gemini")}
                                                className={`flex-1 py-3 rounded-xl text-xs font-black transition-all flex justify-center items-center gap-2 z-10 ${targetPlatform === 'gemini' ? 'bg-white shadow-sm text-blue-600 ring-1 ring-black/5' : 'text-gray-400 hover:text-gray-600'}`}
                                            >
                                                ✨ Gemini
                                            </button>
                                        </div>

                                        <Selector
                                            label="Intenção"
                                            options={INTENTIONS}
                                            value={context.intention}
                                            onChange={handleIntentionChange}
                                        />

                                        <Selector
                                            label="Persona"
                                            options={DYNAMIC_OPTIONS[context.intention].personas}
                                            value={context.persona}
                                            onChange={(val) => setContext({ ...context, persona: val })}
                                        />

                                        <Selector
                                            label="Tom de Voz"
                                            options={DYNAMIC_OPTIONS[context.intention].tones}
                                            value={context.tone}
                                            onChange={(val) => setContext({ ...context, tone: val })}
                                        />

                                        <Selector
                                            label="Objetivo"
                                            options={DYNAMIC_OPTIONS[context.intention].goals}
                                            value={context.goal}
                                            onChange={(val) => setContext({ ...context, goal: val })}
                                        />

                                        <div className="pt-4 border-t border-gray-100">
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-2">Salvar no Projeto</p>
                                            <select
                                                value={selectedProjectId}
                                                onChange={(e) => setSelectedProjectId(e.target.value)}
                                                className="w-full bg-gray-50 border border-gray-100 rounded-xl p-3 text-xs font-bold text-gray-900 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                                            >
                                                <option value="">Sem Projeto (Histórico Geral)</option>
                                                {projects.map(p => (
                                                    <option key={p.id} value={p.id}>{p.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* VIEW: MASTER PROMPTS */}
                    {currentView === 'master-prompts' && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                                {MASTER_PROMPTS.map((mp, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => handleSelectMasterPrompt(mp.content)}
                                        className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm hover:shadow-xl hover:border-blue-200 transition-all text-left flex flex-col gap-4 group"
                                    >
                                        <div className="w-12 h-12 bg-blue-50 text-2xl flex items-center justify-center rounded-2xl group-hover:scale-110 transition-transform">{mp.icon}</div>
                                        <div>
                                            <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors uppercase text-sm tracking-wide">{mp.title}</h3>
                                            <p className="text-xs text-gray-400 mt-1 leading-relaxed line-clamp-2">{mp.desc}</p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* VIEW: HISTORY */}
                    {currentView === 'history' && (
                        <div className="space-y-6">
                            <h2 className="text-2xl font-black text-gray-900 border-b pb-4">Histórico</h2>
                            {history.length === 0 ? (
                                <div className="p-20 text-center opacity-40 italic">Nenhum prompt salvo ainda.</div>
                            ) : (
                                <div className="grid gap-4">
                                    {history.map((entry) => (
                                        <div key={entry.id} className="bg-white p-6 rounded-2xl border border-gray-200 group relative">
                                            <button onClick={() => deletePrompt(entry.id)} className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">🗑️</button>
                                            <p className={`text-sm font-bold mb-2 ${entry.model === 'gpt' ? 'text-green-600' : 'text-blue-600'}`}>
                                                {entry.model?.toUpperCase() || 'GEMINI'}
                                            </p>
                                            <p className="text-sm text-gray-600 line-clamp-2">{entry.original}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* VIEW: PROJECTS */}
                    {currentView === 'projects' && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h2 className="text-3xl font-black text-gray-900">
                                        {openProjectId ? (
                                            <button onClick={() => setOpenProjectId(null)} className="flex items-center gap-3 hover:text-blue-600 transition-colors">
                                                <span>←</span>
                                                <span>{projects.find(p => p.id === openProjectId)?.name}</span>
                                            </button>
                                        ) : (
                                            'Meus Projetos 📁'
                                        )}
                                    </h2>
                                    <p className="text-gray-500 mt-1">
                                        {openProjectId ? 'Visualize todos os prompts salvos neste projeto.' : 'Organize seus prompts por campanhas ou clientes.'}
                                    </p>
                                </div>
                                {!openProjectId && (
                                    <button
                                        onClick={() => setShowNewProjectModal(true)}
                                        className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-black text-sm shadow-xl shadow-blue-100 hover:bg-blue-700 hover:-translate-y-0.5 transition-all"
                                    >
                                        + Novo Projeto
                                    </button>
                                )}
                            </div>

                            {!openProjectId ? (
                                projects.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center p-20 bg-gray-50/50 border-2 border-dashed border-gray-200 rounded-[40px] text-center space-y-4">
                                        <div className="text-6xl opacity-20">📁</div>
                                        <p className="text-gray-400 font-bold">Nenhum projeto criado ainda.</p>
                                        <button onClick={() => setShowNewProjectModal(true)} className="text-blue-600 font-black text-sm hover:underline">Clique para criar seu primeiro projeto</button>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                                        {projects.map(project => (
                                            <div key={project.id} className="bg-white p-6 md:p-8 rounded-[32px] md:rounded-[40px] border border-gray-100 shadow-sm hover:shadow-xl hover:border-blue-100 transition-all group relative">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        deleteProject(project.id);
                                                    }}
                                                    className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-all p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl"
                                                >
                                                    🗑️
                                                </button>
                                                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center text-2xl mb-6">📂</div>
                                                <h3 className="text-xl font-black text-gray-900 group-hover:text-blue-600 transition-colors uppercase tracking-tight">{project.name}</h3>
                                                <p className="text-sm text-gray-400 mt-2 leading-relaxed line-clamp-2">{project.description}</p>
                                                <div className="mt-8 pt-6 border-t border-gray-50 flex items-center justify-between">
                                                    <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">{project.prompts.length} Prompts</span>
                                                    <button onClick={() => setOpenProjectId(project.id)} className="text-[10px] font-black text-blue-400 uppercase tracking-widest group-hover:text-blue-600 transition-colors">Abrir Pasta →</button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )
                            ) : (
                                <div className="space-y-4">
                                    {projects.find(p => p.id === openProjectId)?.prompts.length === 0 ? (
                                        <div className="p-20 text-center opacity-40 italic">Nenhum prompt salvo neste projeto.</div>
                                    ) : (
                                        <div className="grid gap-4">
                                            {projects.find(p => p.id === openProjectId)?.prompts.map((p) => (
                                                <div key={p.id} className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm hover:shadow-md transition-shadow group">
                                                    <div className="flex justify-between items-start mb-4">
                                                        <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">{new Date(p.timestamp).toLocaleDateString()}</span>
                                                        <button onClick={() => {
                                                            setPrompt(p.original);
                                                            setImproved(p.improved);
                                                            setCurrentView('dashboard');
                                                            setOpenProjectId(null);
                                                        }} className="text-[10px] font-black text-blue-600 uppercase hover:underline">Carregar no Dashboard</button>
                                                    </div>
                                                    <p className="text-xs font-bold text-gray-400 mb-1 uppercase tracking-tighter">Original:</p>
                                                    <p className="text-sm text-gray-600 mb-4 line-clamp-2 italic">&quot;{p.original}&quot;</p>
                                                    <p className="text-xs font-bold text-blue-600 mb-1 uppercase tracking-tighter">Otimizado:</p>
                                                    <p className="text-sm text-gray-900 line-clamp-3 leading-relaxed">{p.improved}</p>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* New Project Modal */}
                            {showNewProjectModal && (
                                <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-4">
                                    <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={() => setShowNewProjectModal(false)}></div>
                                    <div className="bg-white rounded-[40px] p-10 max-w-md w-full relative z-10 shadow-2xl border border-white animate-in zoom-in duration-300">
                                        <h3 className="text-2xl font-black text-gray-900 mb-6">Criar Novo Projeto</h3>
                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 text-xs">Nome do Projeto</label>
                                                <input
                                                    type="text"
                                                    value={newProjectName}
                                                    onChange={(e) => setNewProjectName(e.target.value)}
                                                    className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none transition-all font-bold text-gray-900"
                                                    placeholder="Ex: Lançamento Curso de IA"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 text-xs">Descrição (Opcional)</label>
                                                <textarea
                                                    value={newProjectDesc}
                                                    onChange={(e) => setNewProjectDesc(e.target.value)}
                                                    className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none transition-all font-bold text-gray-900 resize-none h-24"
                                                    placeholder="Para que serve este projeto?"
                                                />
                                            </div>
                                            <button
                                                onClick={() => {
                                                    if (!newProjectName) return;
                                                    addProject(newProjectName, newProjectDesc);
                                                    setNewProjectName("");
                                                    setNewProjectDesc("");
                                                    setShowNewProjectModal(false);
                                                }}
                                                className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black text-lg shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all active:scale-95 mt-4"
                                            >
                                                Criar Projeto 🚀
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* VIEW: ACADEMY */}
                    {currentView === 'academy' && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-3xl font-black text-gray-900">Academia AI 🎓</h2>
                                    <p className="text-gray-500 mt-1">Aprenda a arte de conversar com a inteligência artificial.</p>
                                </div>
                                <div className="px-4 py-2 bg-yellow-100 text-yellow-700 rounded-xl font-bold text-sm border border-yellow-200">
                                    Nível: Iniciante ao Expert
                                </div>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                {ACADEMY_LESSONS.map((lesson) => (
                                    <div key={lesson.id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4 flex flex-col justify-between group hover:border-blue-200 transition-all">
                                        <div className="space-y-4">
                                            <div className={`w-12 h-12 ${lesson.color} rounded-2xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform`}>{lesson.icon}</div>
                                            <h3 className="font-black text-gray-900 text-sm leading-tight">{lesson.title}</h3>
                                            <p className="text-[10px] text-gray-500 leading-relaxed">
                                                {lesson.desc}
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => {
                                                setPrompt(lesson.promptSnippet);
                                                setImproved("");
                                                setStats(null);
                                                setCurrentView('dashboard');
                                            }}
                                            className="w-full py-2 bg-gray-50 text-gray-500 rounded-xl font-bold text-[10px] hover:bg-blue-600 hover:text-white transition-all uppercase tracking-widest"
                                        >
                                            Copiar Técnica
                                        </button>
                                    </div>
                                ))}
                            </div>

                            <div className="bg-gray-900 rounded-[40px] p-8 text-white relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-blue-500/30 transition-all duration-700"></div>
                                <div className="relative z-10 grid grid-cols-2 gap-12 items-center">
                                    <div className="space-y-4">
                                        <h3 className="text-2xl font-black italic">Dica de Ouro: Few-Shot Prompting</h3>
                                        <p className="text-gray-300 text-sm leading-relaxed">
                                            Não apenas explique, mostre! Forneça 2 ou 3 exemplos do que você espera antes de pedir o resultado final. A IA aprende o padrão instantaneamente e entrega algo muito mais preciso.
                                        </p>
                                        <button
                                            onClick={() => setShowAcademyModal(true)}
                                            className="px-6 py-2 bg-white text-gray-900 rounded-full font-black text-xs hover:scale-105 transition-transform active:scale-95"
                                        >
                                            Ver Exemplo Prático
                                        </button>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-4 bg-white/5 rounded-2xl border border-white/10 text-center">
                                            <div className="text-xl mb-1">🤖</div>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">ChatGPT</p>
                                            <p className="text-xs font-medium">Reage melhor a lógica direta.</p>
                                        </div>
                                        <div className="p-4 bg-white/5 rounded-2xl border border-white/10 text-center">
                                            <div className="text-xl mb-1">✨</div>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Gemini</p>
                                            <p className="text-xs font-medium">Excelente com links e buscas.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Academy Modal */}
                            {showAcademyModal && (
                                <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-4">
                                    <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-md" onClick={() => setShowAcademyModal(false)}></div>
                                    <div className="bg-white rounded-t-[40px] md:rounded-[48px] p-8 md:p-12 max-w-2xl w-full relative z-10 shadow-2xl border border-white animate-in slide-in-from-bottom md:zoom-in duration-300 overflow-y-auto max-h-[90vh]">
                                        <div className="absolute top-0 right-0 p-6 md:p-8">
                                            <button onClick={() => setShowAcademyModal(false)} className="text-gray-300 hover:text-gray-900 text-xl transition-colors">✕</button>
                                        </div>
                                        <h3 className="text-2xl md:text-3xl font-black text-gray-900 mb-6 md:mb-8 border-b border-gray-100 pb-4 md:pb-6 uppercase tracking-tighter">Exemplo Prático</h3>

                                        <div className="space-y-6">
                                            <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100">
                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">O Erro Comum (Zero-Shot)</p>
                                                <p className="text-sm font-bold text-gray-600 italic">&quot;Escreva 3 títulos de blog sobre dieta low-carb.&quot;</p>
                                            </div>

                                            <div className="p-8 bg-blue-600 rounded-3xl text-white relative">
                                                <div className="absolute -top-3 left-8 bg-black text-white px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest">O Jeito Certo (Few-Shot)</div>
                                                <p className="text-[10px] font-black text-blue-200 uppercase tracking-widest mb-4">Instrução com Exemplos:</p>
                                                <p className="text-sm font-bold leading-relaxed">
                                                    &quot;Escreva 3 títulos de blog sobre dieta low-carb seguindo o padrão abaixo:<br /><br />
                                                    Ex 1: &apos;5 Mitos sobre corrida que estão destruindo seus joelhos&apos;<br />
                                                    Ex 2: &apos;Como emagrecer comendo pizza: A verdade sobre calorias&apos;<br /><br />
                                                    Agora gere os títulos para dieta low-carb:&quot;
                                                </p>
                                            </div>

                                            <div className="pt-4 text-center">
                                                <p className="text-[11px] text-gray-400 font-bold uppercase tracking-[0.2em]">Resultado: A IA entende que você quer títulos de &quot;curiosidade/contraintuitivos&quot; e não títulos genéricos.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* VIEW: SETTINGS */}
                    {currentView === 'settings' && (
                        <div className="max-w-md mx-auto space-y-8 pt-10">
                            <h2 className="text-2xl font-black text-gray-900 text-center uppercase tracking-widest">Configurações</h2>
                            <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm space-y-6">
                                <div className="flex justify-between items-center text-sm font-bold text-gray-600">
                                    <span>Dark Mode</span>
                                    <span className="text-gray-300">Em breve</span>
                                </div>
                                <div className="flex justify-between items-center text-sm font-bold text-gray-600">
                                    <span>Token Usage</span>
                                    <span className="text-green-500">Ilimitado</span>
                                </div>
                                <div className="flex justify-between items-center text-sm font-bold text-gray-600">
                                    <span>Assinatura</span>
                                    {isPro ? (
                                        <button
                                            onClick={handleManageSubscription}
                                            className="text-blue-600 hover:underline"
                                            disabled={loading}
                                        >
                                            Gerenciar
                                        </button>
                                    ) : (
                                        <button
                                            onClick={handleUpgrade}
                                            className="text-orange-500 hover:underline"
                                            disabled={loading}
                                        >
                                            Assinar Pro
                                        </button>
                                    )}
                                </div>
                                <div className="pt-4 border-t border-gray-100 flex flex-col gap-3">
                                    <a href="/terms" target="_blank" className="text-xs font-bold text-blue-600 hover:underline">Termos de Uso</a>
                                    <a href="/privacy" target="_blank" className="text-xs font-bold text-blue-600 hover:underline">Política de Privacidade</a>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* VIEW: PROFILE */}
                    {currentView === 'profile' && (
                        <div className="flex justify-center items-center h-full">
                            <div className="bg-white p-12 rounded-[50px] shadow-2xl border border-gray-100 max-w-sm w-full text-center space-y-6">
                                <div className="w-24 h-24 bg-gray-100 rounded-full mx-auto flex items-center justify-center text-4xl">
                                    {isPro ? '💎' : '👤'}
                                </div>
                                <div className="space-y-1">
                                    <h3 className="text-2xl font-black text-gray-900">
                                        {isPro ? 'Membro Pro' : 'Membro'}
                                    </h3>
                                    <p className="text-sm font-bold text-blue-600">{userEmail || 'Acesso Limitado'}</p>
                                </div>
                                <div className="pt-2">
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-2">Precisa alterar seus dados?</p>
                                    <a
                                        href={`mailto:contato.melhoreai@gmail.com?subject=Alteração de Dados - ${userEmail}`}
                                        className="text-xs font-black text-blue-600 hover:underline"
                                    >
                                        Falar com o Suporte →
                                    </a>
                                </div>
                                <button
                                    onClick={isPro ? handleManageSubscription : handleUpgrade}
                                    disabled={loading}
                                    className={`w-full py-4 font-bold border-2 rounded-2xl transition-all flex items-center justify-center gap-2 ${isPro ? 'bg-gray-50 text-gray-900 border-gray-100 hover:bg-white hover:border-blue-100 hover:text-blue-600' : 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700'}`}
                                >
                                    <span>{isPro ? '💳' : '🚀'}</span>
                                    <span>{isPro ? 'Gerenciar Assinatura' : 'Assinar Pro'}</span>
                                </button>



                                <button onClick={onLogout} className="w-full py-4 text-red-500 font-black border-2 border-red-50 rounded-2xl hover:bg-red-50 transition-colors">Sair da Conta</button>
                            </div>
                        </div>
                    )}
                </div>
            </main>

            <MobileNav activePage={currentView} onNavigate={(page) => setCurrentView(page)} />

            {/* FEEDBACK MODAL */}
            {showFeedbackModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={() => !sendingFeedback && setShowFeedbackModal(false)}></div>
                    <div className="bg-white rounded-[40px] shadow-2xl border border-gray-100 w-full max-w-lg relative z-10 overflow-hidden animate-in fade-in zoom-in duration-300">
                        <div className="p-8">
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-2xl">💬</div>
                                    <div>
                                        <h2 className="text-xl font-black text-gray-900">Enviar Feedback</h2>
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Sua opinião é vital</p>
                                    </div>
                                </div>
                                <button onClick={() => setShowFeedbackModal(false)} className="text-gray-300 hover:text-gray-600 transition-colors">✕</button>
                            </div>

                            {feedbackSuccess ? (
                                <div className="py-12 text-center space-y-4 animate-in fade-in slide-in-from-bottom-4">
                                    <div className="text-5xl">✅</div>
                                    <h3 className="text-xl font-black text-gray-900">Obrigado!</h3>
                                    <p className="text-sm font-medium text-gray-500">Seu feedback foi recebido com sucesso.</p>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    <div className="space-y-3">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Sobre o que você quer falar?</p>
                                        <div className="grid grid-cols-3 gap-2">
                                            {["Sugestão", "Bug", "Elogio"].map((cat) => (
                                                <button
                                                    key={cat}
                                                    onClick={() => setFeedbackCategory(cat)}
                                                    className={`py-3 rounded-2xl font-bold text-xs transition-all ${feedbackCategory === cat ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'bg-gray-50 text-gray-400 hover:bg-gray-100'}`}
                                                >
                                                    {cat}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Sua Mensagem</p>
                                        <textarea
                                            value={feedbackMessage}
                                            onChange={(e) => setFeedbackMessage(e.target.value)}
                                            placeholder="Descreva aqui sua sugestão, problema ou elogio..."
                                            className="w-full bg-gray-50 border border-gray-100 rounded-3xl p-5 text-sm font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none min-h-[150px] transition-all"
                                        />
                                    </div>

                                    <button
                                        onClick={handleSendFeedback}
                                        disabled={sendingFeedback || !feedbackMessage.trim()}
                                        className="w-full py-5 bg-gray-900 text-white rounded-[24px] font-black text-sm hover:bg-blue-600 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:hover:bg-gray-900 flex items-center justify-center gap-2"
                                    >
                                        {sendingFeedback ? 'Enviando...' : 'Enviar Agora'}
                                        {!sendingFeedback && <span>🚀</span>}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* NOTICE MODAL */}
            {notice && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-md" onClick={() => setNotice(null)}></div>
                    <div className="bg-white rounded-[40px] shadow-2xl border-4 border-blue-600 w-full max-w-md relative z-10 overflow-hidden animate-in fade-in zoom-in duration-300">
                        <div className="p-10 text-center space-y-6">
                            <div className="w-20 h-20 bg-blue-50 rounded-3xl mx-auto flex items-center justify-center text-4xl shadow-inner">💡</div>
                            <div className="space-y-2">
                                <h2 className="text-2xl font-black text-gray-900">{notice.title}</h2>
                                <p className="text-sm font-bold text-gray-500 leading-relaxed">{notice.message}</p>
                            </div>
                            <button
                                onClick={() => setNotice(null)}
                                className="w-full py-5 bg-blue-600 text-white rounded-[24px] font-black text-sm hover:bg-blue-700 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-blue-100"
                            >
                                Entendi, vamos lá!
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// Novo componente de navegação mobile
function MobileNav({ activePage, onNavigate }: { activePage: ViewType, onNavigate: (page: ViewType) => void }) {
    const navItems: { id: ViewType, icon: string, label: string }[] = [
        { id: 'dashboard', icon: '🏠', label: 'Painel' },
        { id: 'projects', icon: '📁', label: 'Projetos' },
        { id: 'master-prompts', icon: '📚', label: 'Master' },
        { id: 'academy', icon: '🎓', label: 'Academia' },
    ];

    return (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-6 py-3 flex justify-between items-center z-50 shadow-[0_-8px_30px_rgb(0,0,0,0.04)] pb-8">
            {navItems.map((item) => (
                <button
                    key={item.id}
                    onClick={() => onNavigate(item.id)}
                    className={`flex flex-col items-center gap-1 transition-all ${activePage === item.id ? 'text-blue-600 scale-105' : 'text-gray-400'}`}
                >
                    <span className="text-xl">{item.icon}</span>
                    <span className="text-[10px] font-black uppercase tracking-widest">{item.label}</span>
                </button>
            ))}
        </nav>
    );
}
