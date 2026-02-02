"use client";

import React from 'react';
import Link from 'next/link';

const SCENARIOS = [
    {
        id: 'vendas',
        label: 'Vendas',
        icon: '💼',
        category: 'Business',
        commonPrompt: "&quot;Me dê ideias para vender mais minha mentoria no LinkedIn.&quot;",
        commonResponse: 'Para vender mais, tente postar diariamente, use hashtags relevantes e envie DMs para conexões...',
        optimizedPrompt: '"Atue como um Especialista em Social Selling e Copywriting para High-Ticket. Crie uma estratégia completa de 30 dias para vender uma mentoria de R$ 8.500 no LinkedIn. Público-alvo: CEOs e Diretores de Tecnologia que faturam acima de R$ 10MM/ano. Objetivo: Gerar 15 reuniões qualificadas por mês. A estratégia deve incluir: 1. Otimização do Perfil (Headline + Sobre), 2. Funil de conteúdo de 4 etapas (Atração, Autoridade, Desejo, Chamada), 3. Scripts de abordagem via DM sem parecer \"vendedor chato\", 4. Calendário editorial com 3 posts semanais focados em estudos de caso e ROI. Explique a psicologia por trás de cada ação."',
        optimizedResponse: (
            <div className="space-y-4">
                <p className="text-sm font-black text-blue-600 border-b border-blue-50 pb-2 flex items-center gap-2">
                    <span className="text-lg">💰</span> Funil High-Ticket (Métrica: ROI)
                </p>
                <div className="space-y-3">
                    <div className="p-3 bg-blue-50 rounded-xl border border-blue-100">
                        <p className="text-[10px] font-black text-blue-800 uppercase mb-1">Estratégia DM (Psychology-First)</p>
                        <p className="text-[11px] text-gray-700 leading-relaxed">
                            &quot;Vi seu comentário sobre [Tópico X]. Diferente do que a maioria faz, percebi que você foca no [Detalhe Y]. Tivemos um caso similar onde o ROI subiu 40% em 3 meses apenas ajustando o [Processo Z]. Faria sentido conversarmos?&quot;
                        </p>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <div className="p-2.5 bg-gray-900 text-white rounded-xl border border-gray-700">
                            <span className="text-[9px] font-black text-blue-400 uppercase">Headline Ideal</span>
                            <p className="text-[10px] opacity-90 leading-tight mt-1">&quot;Ajudo CTOs a reduzirem churn em 30% via IA...&quot;</p>
                        </div>
                        <div className="p-2.5 bg-gray-900 text-white rounded-xl border border-gray-700">
                            <span className="text-[9px] font-black text-blue-400 uppercase">Calendário</span>
                            <p className="text-[10px] opacity-90 leading-tight mt-1">12 Posts/mês focados em Prova Real.</p>
                        </div>
                    </div>
                </div>
                <div className="px-4 py-2 bg-blue-600 text-white rounded-xl shadow-lg shadow-blue-100 text-[10px] font-black text-center uppercase tracking-widest animate-pulse">
                    Potencial de Faturamento: +R$ 127k / mês
                </div>
            </div>
        ),
        impact: '+500% de Autoridade',
        score: '9.8'
    },
    {
        id: 'marketing',
        label: 'Marketing',
        icon: '📧',
        category: 'Copywriting',
        commonPrompt: "&quot;Escreva um e-mail para vender meu curso de culinária.&quot;",
        commonResponse: 'Olá, tudo bem? Meu curso de culinária está com desconto. Clique aqui para comprar e aprender novas receitas...',
        optimizedPrompt: '"Atue como copywriter especialista em e-mail marketing B2C. Crie um e-mail de vendas usando o framework AIDA (Atenção, Interesse, Desejo, Ação). Público-alvo: profissionais de 30-45 anos, sem tempo para cozinhar. Dor principal: falta de tempo + culpa de não cozinhar para a família. Solução: receitas rápidas (15 min) que parecem elaboradas. Tom: empático, urgente mas não agressivo. Inclua: linha de assunto com gatilho de curiosidade, storytelling no primeiro parágrafo, 3 benefícios emocionais (não apenas racionais), CTA claro com senso de urgência. Formato: 200-250 palavras."',
        optimizedResponse: (
            <div className="space-y-4">
                <p className="text-sm font-black text-green-600 border-b border-green-50 pb-2 flex items-center gap-2">
                    <span className="text-lg">📧</span> E-mail de Alta Conversão (AIDA)
                </p>
                <div className="space-y-3">
                    <div className="flex items-center gap-2 text-xs font-bold text-gray-900 border border-gray-100 p-2 rounded-lg bg-gray-50">
                        <span className="text-gray-400">Assunto:</span> Jantar de chef em apenas 15 min? [Gatilho de Curiosidade]
                    </div>
                    <p className="text-[11px] text-gray-600 leading-relaxed italic border-l-4 border-green-500 pl-3">
                        &quot;Você chega em casa exausto às 19h. As crianças perguntam &apos;o que tem pra jantar?&apos;. Você sente aquela culpa... [Storytelling com identificação emocional + 3 benefícios: tempo com família, saúde, prazer de cozinhar] → CTA: &apos;Acesse o Guia Completo (Disponível agora)&apos;&quot;
                    </p>
                </div>
                <div className="px-4 py-2 bg-green-600 text-white rounded-xl shadow-lg shadow-green-100 text-[10px] font-black text-center uppercase tracking-widest animate-pulse">
                    Potencial de Conversão: +24% CTR | Taxa de Abertura: +18%
                </div>
            </div>
        ),
        impact: '+450% de Engajamento',
        score: '9.9'
    },
    {
        id: 'recreativo',
        label: 'Recreativo',
        icon: '🎮',
        category: 'Lazer & Hobbies',
        commonPrompt: "&quot;Me ajude a planejar uma viagem para a Europa.&quot;",
        commonResponse: 'Claro! Para planejar uma viagem para a Europa, você deve escolher os países, reservar hotéis, comprar passagens...',
        optimizedPrompt: '"Atue como um planejador de viagens especializado em roteiros personalizados. Crie um itinerário de 10 dias pela Europa para um casal de 28 anos, orçamento médio de €3.000 (excluindo passagens aéreas). Perfil: aventureiros, gostam de cultura local e gastronomia, evitam pontos turísticos lotados. Preferências: cidades históricas + natureza, experiências autênticas. Inclua: 3 cidades sugeridas com justificativa, atividades diárias (manhã/tarde/noite), restaurantes locais recomendados, estimativa de custos por dia, dicas de transporte entre cidades. Formato: tabela organizada por dia."',
        optimizedResponse: (
            <div className="space-y-4">
                <p className="text-sm font-black text-purple-600 border-b border-purple-50 pb-2 flex items-center gap-2">
                    <span className="text-lg">✈️</span> Roteiro Personalizado Europa
                </p>
                <div className="space-y-3">
                    <div className="p-3 bg-purple-50 rounded-xl border border-purple-100">
                        <p className="text-[10px] font-black uppercase text-purple-600 mb-2">Cidades Selecionadas</p>
                        <p className="text-[11px] text-gray-700 leading-relaxed">
                            <span className="font-bold">1. Porto (Portugal)</span> - Autêntica, gastronômica, €70/dia<br />
                            <span className="font-bold">2. San Sebastián (Espanha)</span> - Praias + pintxos, €85/dia<br />
                            <span className="font-bold">3. Lyon (França)</span> - Capital gastronômica, €90/dia
                        </p>
                    </div>
                    <div className="p-3 bg-gray-900 text-white rounded-xl border border-gray-700">
                        <span className="text-[10px] font-black uppercase text-gray-400 block mb-1">Exemplo Dia 3 - Porto</span>
                        <p className="text-[11px] opacity-90 leading-relaxed">
                            <span className="text-purple-400">Manhã:</span> Mercado do Bolhão + degustação de queijos<br />
                            <span className="text-purple-400">Tarde:</span> Caves de vinho do Porto (tour privado)<br />
                            <span className="text-purple-400">Noite:</span> Jantar no Cantinho do Avillez (€40/pessoa)
                        </p>
                    </div>
                </div>
                <p className="text-purple-600 font-extrabold text-[10px] text-center uppercase tracking-widest bg-purple-50 py-1 rounded-full">Roteiro 100% Personalizado + Orçamento Detalhado</p>
            </div>
        ),
        impact: '+600% de Detalhamento',
        score: '9.8'
    }
];

const FAQS = [
    {
        question: "Terei acesso imediato após o pagamento?",
        answer: "Sim! Assim que seu pagamento for confirmado, você receberá o acesso instantâneo ao seu painel Pro para começar a otimizar seus prompts imediatamente."
    },
    {
        question: "Preciso pagar o ChatGPT ou Gemini para usar?",
        answer: "Não! Nossa ferramenta funciona perfeitamente com o ChatGPT e Gemini. O segredo está na engenharia do comando que geramos para você."
    },
    {
        question: "Funciona para qualquer nicho de mercado?",
        answer: "Sim. O Melhore.AI utiliza estruturas universais de comunicação persuasiva, adaptando-se automaticamente ao contexto que você inserir (ex: Imobiliário, Fitness, B2B, etc)."
    },
    {
        question: "Posso cancelar minha assinatura quando quiser?",
        answer: "Com certeza. Você pode cancelar a renovação a qualquer momento através do seu painel, sem multas ou letras miúdas."
    }
];

function FadeInSection({ children }: { children: React.ReactNode }) {
    const [isVisible, setVisible] = React.useState(false);
    const domRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setVisible(true);
                    observer.unobserve(entry.target);
                }
            });
        });

        const currentRef = domRef.current;
        if (currentRef) {
            observer.observe(currentRef);
        }

        return () => {
            if (currentRef) {
                observer.unobserve(currentRef);
            }
        };
    }, []);

    return (
        <div
            className={`transition-all duration-1000 ease-out transform ${isVisible ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"}`}
            ref={domRef}
        >
            {children}
        </div>
    );
}

interface LandingPageProps {
    onStart: (intent?: 'login' | 'upgrade') => void;
}

export default function LandingPage({ onStart }: LandingPageProps) {
    const [activeScenario, setActiveScenario] = React.useState(0);
    const [isOptimizing, setIsOptimizing] = React.useState(false);
    const [isOptimized, setIsOptimized] = React.useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

    const handleOptimize = () => {
        setIsOptimizing(true);
        setTimeout(() => {
            setIsOptimizing(false);
            setIsOptimized(true);
        }, 1500);
    };

    const handleScenarioChange = (index: number) => {
        if (isOptimizing) return;
        setActiveScenario(index);
        setIsOptimized(false);
    };

    const scrollToSection = (id: string) => {
        setMobileMenuOpen(false);
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const current = SCENARIOS[activeScenario];

    return (
        <div className="min-h-screen bg-white text-gray-900 selection:bg-blue-100 font-sans tracking-tight">
            {/* Premium Header */}
            <header className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-xl border-b border-gray-100">
                <div className="container mx-auto px-6 h-20 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center font-black text-xl shadow-lg shadow-blue-200">
                            M
                        </div>
                        <span className="font-extrabold text-2xl tracking-tighter text-gray-900">Melhore.AI</span>
                    </div>

                    <nav className="hidden lg:flex items-center gap-10 text-sm font-bold text-gray-500">
                        <button onClick={() => scrollToSection('funcionalidades')} className="hover:text-blue-600 transition-colors">Funcionalidades</button>
                        <button onClick={() => scrollToSection('biblioteca')} className="hover:text-blue-600 transition-colors">Biblioteca</button>
                        <button onClick={() => scrollToSection('precos')} className="hover:text-blue-600 transition-colors">Preços</button>
                    </nav>

                    <div className="flex items-center gap-3 md:gap-6">
                        <button onClick={() => onStart()} className="text-xs md:text-sm font-bold text-gray-500 hover:text-gray-900 transition-colors hidden md:block">Login</button>
                        <button
                            onClick={() => onStart()}
                            className="bg-blue-600 text-white px-5 md:px-7 py-2.5 md:py-3 rounded-full font-black text-xs md:text-sm shadow-xl shadow-blue-100 hover:bg-blue-700 hover:-translate-y-0.5 transition-all whitespace-nowrap hidden md:block"
                        >
                            Começar Agora
                        </button>

                        {/* Mobile Menu Toggle */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="lg:hidden p-2 text-gray-600 hover:text-blue-600 transition-colors"
                        >
                            {mobileMenuOpen ? (
                                <span className="text-2xl">✕</span>
                            ) : (
                                <span className="text-2xl">☰</span>
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu Overlay */}
                {mobileMenuOpen && (
                    <div className="lg:hidden absolute top-20 left-0 w-full bg-white border-b border-gray-100 shadow-xl p-6 flex flex-col gap-6 animate-in slide-in-from-top-4 duration-300">
                        <nav className="flex flex-col gap-4 text-center">
                            <button onClick={() => scrollToSection('funcionalidades')} className="text-gray-600 font-bold hover:text-blue-600 py-2">Funcionalidades</button>
                            <button onClick={() => scrollToSection('biblioteca')} className="text-gray-600 font-bold hover:text-blue-600 py-2">Biblioteca</button>
                            <button onClick={() => scrollToSection('precos')} className="text-gray-600 font-bold hover:text-blue-600 py-2">Preços</button>
                        </nav>
                        <div className="flex flex-col gap-3 pt-4 border-t border-gray-100">
                            <button onClick={() => onStart()} className="w-full py-3 text-gray-600 font-black border border-gray-200 rounded-xl hover:bg-gray-50">Login</button>
                            <button onClick={() => onStart()} className="w-full py-3 bg-blue-600 text-white font-black rounded-xl hover:bg-blue-700 shadow-md">Começar Agora</button>
                        </div>
                    </div>
                )}
            </header>

            {/* Hero Section */}
            <FadeInSection>
                <section className="relative pt-44 pb-16 px-6">
                    <div className="container mx-auto text-center max-w-4xl">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-[11px] font-black uppercase tracking-widest mb-10">
                            <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></span>
                            Potencialize sua IA Agora (V2.3)
                        </div>

                        <h1 className="text-5xl sm:text-6xl md:text-8xl font-black text-gray-900 leading-[0.9] tracking-tighter mb-8 md:mb-10">
                            Potencialize seus <br className="hidden sm:block" />
                            <span className="text-blue-600">Resultados com IA.</span>
                        </h1>

                        <p className="text-lg md:text-2xl text-gray-500 max-w-2xl mx-auto leading-relaxed mb-10 md:mb-14 font-medium tracking-normal px-4">
                            Saia do básico. Nossa tecnologia gera comandos precisos que extraem o máximo de inteligência do ChatGPT e Gemini.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
                            <button
                                onClick={() => onStart()}
                                className="w-full sm:w-auto bg-gray-900 text-white px-12 py-5 rounded-2xl text-lg font-black hover:bg-blue-600 shadow-2xl shadow-gray-200 transition-all hover:scale-105"
                            >
                                Começar a Criar
                            </button>
                            <button
                                onClick={() => scrollToSection('funcionalidades')}
                                className="w-full sm:w-auto px-12 py-5 rounded-2xl text-lg font-black text-gray-900 bg-gray-50 border border-gray-200 hover:bg-white transition-all flex items-center justify-center gap-3"
                            >
                                Ver Demonstração <span className="text-xl">→</span>
                            </button>
                        </div>
                    </div>

                    {/* Compatibility Banner (Social Proof) */}
                    <div className="mt-20 border-y border-gray-100 bg-gray-50/50">
                        <div className="container mx-auto px-6 py-8 flex flex-col items-center justify-center gap-6 opacity-60 hover:opacity-100 transition-opacity duration-500">
                            <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">Integração com</span>
                            <div className="flex items-center gap-16 grayscale hover:grayscale-0 transition-all duration-500">
                                <span className="font-black text-2xl text-gray-400 hover:text-[#10A37F] transition-colors cursor-default">ChatGPT</span>
                                <span className="font-black text-2xl text-gray-400 hover:text-[#4E86F7] transition-colors cursor-default">Google Gemini</span>
                            </div>
                        </div>
                    </div>
                </section>
            </FadeInSection>

            {/* Step-by-Step "How it works" section */}
            <FadeInSection>
                <section className="pt-16 pb-24 bg-white relative overflow-hidden">
                    <div className="container mx-auto px-6 max-w-6xl">
                        <div className="text-center mb-16">
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-[10px] font-black uppercase tracking-widest mb-6">
                                <span className="text-xs">✓</span> EM 3 PASSOS
                            </div>
                            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 tracking-tighter">Entenda como funciona</h2>
                            <p className="text-gray-500 font-bold text-lg max-w-2xl mx-auto">
                                Veja como é simples transformar suas ideias em prompts de elite
                            </p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8">
                            {[
                                { step: "1", icon: "✍️", title: "Cole sua ideia", desc: "Digite o seu prompt básico ou apenas descreva o que você precisa criar na nossa plataforma." },
                                { step: "2", icon: "⚙️", title: "IA Reconstrói", desc: "Nossa engenharia avançada aplica frameworks de elite para otimizar cada detalhe do seu comando." },
                                { step: "3", icon: "🚀", title: "Copie o Sucesso", desc: "Em segundos, você tem um prompt de alta performance pronto para colar no ChatGPT ou Gemini." }
                            ].map((p, i) => (
                                <div key={i} className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-xl shadow-gray-50 relative group hover:border-blue-200 transition-all duration-500">
                                    <div className="w-16 h-16 bg-blue-600 text-white rounded-2xl flex items-center justify-center text-2xl font-black mb-8 shadow-lg shadow-blue-100 group-hover:scale-110 transition-transform">
                                        {p.step}
                                    </div>
                                    <div className="absolute top-10 right-10 w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 text-xl group-hover:rotate-12 transition-transform">
                                        {p.icon}
                                    </div>
                                    <h3 className="text-xl font-black text-gray-900 mb-4">{p.title}</h3>
                                    <p className="text-sm font-medium text-gray-500 leading-relaxed">{p.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </FadeInSection>

            {/* Before & After Interactive Showcase */}
            <FadeInSection>
                <section id="funcionalidades" className="bg-gray-50/50 py-32 border-y border-gray-100 relative overflow-hidden">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-50/50 rounded-full blur-[120px] pointer-events-none"></div>

                    <div className="container mx-auto px-6 max-w-6xl relative z-10">
                        <div className="text-center mb-12">
                            <h2 className="text-5xl font-black text-gray-900 mb-4 tracking-tighter">O Impacto Real na sua Resposta</h2>
                            <p className="text-gray-500 font-bold text-lg max-w-2xl mx-auto">
                                Transformamos comandos básicos em estratégias que forçam a IA ao seu máximo potencial.
                            </p>
                        </div>

                        {/* Scenario Selector */}
                        <div className="flex flex-wrap justify-center gap-2 md:gap-3 mb-10 md:mb-16">
                            {SCENARIOS.map((s, idx) => (
                                <button
                                    key={s.id}
                                    onClick={() => handleScenarioChange(idx)}
                                    className={`px-4 md:px-8 py-3 md:py-4 rounded-xl md:rounded-2xl font-black text-[10px] md:text-xs uppercase tracking-widest transition-all duration-300 flex items-center gap-2 md:gap-3 ${activeScenario === idx ? 'bg-blue-600 text-white shadow-2xl shadow-blue-200 scale-105 border-transparent' : 'bg-white text-gray-400 border border-gray-100 hover:border-blue-200 hover:text-blue-600 hover:bg-blue-50/30'}`}
                                >
                                    <span className={`text-lg md:text-xl transition-transform duration-300 ${activeScenario === idx ? 'scale-125' : ''}`}>{s.icon}</span> {s.label}
                                </button>
                            ))}
                        </div>

                        <div className="grid lg:grid-cols-2 gap-8 items-stretch">
                            {/* Prompt Comum */}
                            <div className="flex flex-col">
                                <div className="flex items-center gap-3 mb-6 px-4">
                                    <span className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-xs font-black shadow-sm">❌</span>
                                    <span className="text-gray-400 font-black text-[11px] uppercase tracking-[0.2em]">O que a maioria faz</span>
                                </div>

                                <div className="bg-white p-6 md:p-10 rounded-[32px] md:rounded-[48px] border border-gray-100 shadow-xl shadow-gray-100/50 flex-1 flex flex-col gap-6 md:gap-8 relative group hover:border-red-100 transition-all duration-500">
                                    <div className="p-4 md:p-6 bg-gray-50 rounded-2xl md:rounded-3xl rounded-tl-none border border-gray-100 italic shadow-inner text-left">
                                        <p className="text-gray-500 font-bold text-xs md:text-sm leading-relaxed">
                                            {current.commonPrompt}
                                        </p>
                                    </div>

                                    <div className="p-4 md:p-6 bg-red-50/60 rounded-2xl md:rounded-3xl rounded-tr-none self-end border border-red-100/50 max-w-[90%] opacity-80 text-left">
                                        <div className="flex items-center gap-2 mb-2 md:mb-3">
                                            <div className="w-4 md:w-5 h-4 md:h-5 rounded-full bg-gray-300 flex items-center justify-center text-[8px] md:text-[10px] font-black text-white">?</div>
                                            <span className="text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-tighter">Resposta da IA</span>
                                        </div>
                                        <p className="text-red-900/60 text-[10px] md:text-[11px] italic leading-relaxed font-bold">
                                            {current.commonResponse}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Melhore.AI */}
                            <div className="flex flex-col relative group">
                                {!isOptimized && !isOptimizing && (
                                    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-white/40 backdrop-blur-md rounded-[32px] md:rounded-[48px] border-2 border-dashed border-blue-400/30 group-hover:bg-white/20 transition-all duration-500">
                                        <button
                                            onClick={handleOptimize}
                                            className="relative bg-gray-900 text-white px-8 md:px-12 py-4 md:py-6 rounded-xl md:rounded-2xl font-black text-base md:text-xl shadow-[0_10px_30px_rgba(0,0,0,0.3)] hover:bg-blue-600 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-3 md:gap-4"
                                        >
                                            <span className="text-xl md:text-2xl">⚡</span> <span className="whitespace-nowrap">MELHORAR RESULTADO</span>
                                        </button>
                                        <p className="mt-6 text-blue-600 font-black text-[10px] md:text-[12px] uppercase tracking-[0.4em] animate-bounce relative z-10">Clique para transformar</p>
                                    </div>
                                )}

                                <div className="flex items-center justify-between mb-6 px-4">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black shadow-lg transition-all duration-700 ${isOptimized ? 'bg-blue-600 text-white shadow-blue-300 ring-4 ring-blue-50' : 'bg-gray-100 text-gray-300'}`}>
                                            {isOptimized ? '✓' : '✨'}
                                        </div>
                                        <span className={`${isOptimized ? 'text-blue-600' : 'text-gray-400'} font-black text-[11px] uppercase tracking-[0.2em] transition-colors duration-500`}>Otimizado pela Melhore.AI</span>
                                    </div>
                                    {isOptimized && (
                                        <div className="flex items-center gap-1.5 px-4 py-1.5 bg-green-500 text-white rounded-full shadow-lg shadow-green-100 animate-in fade-in zoom-in duration-500">
                                            <div className="w-2 h-2 rounded-full bg-white animate-pulse"></div>
                                            <span className="text-[11px] font-black uppercase tracking-tighter">{current.score} Score</span>
                                        </div>
                                    )}
                                </div>

                                <div className={`flex-1 p-6 md:p-8 lg:p-10 rounded-[32px] md:rounded-[48px] border-2 transition-all duration-700 flex flex-col gap-6 md:gap-8 relative overflow-hidden ${isOptimized ? 'bg-gray-900 border-blue-500 shadow-[0_40px_80px_rgba(59,130,246,0.15)]' : 'bg-gray-50/50 border-gray-100 blur-[4px]'}`}>
                                    {isOptimizing ? (
                                        <div className="flex-1 flex flex-col justify-center items-center gap-6 py-12">
                                            <div className="relative w-12 md:w-16 h-12 md:h-16">
                                                <div className="absolute inset-0 border-4 border-blue-600/20 rounded-full"></div>
                                                <div className="absolute inset-0 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                                            </div>
                                            <span className="text-blue-500 font-black animate-pulse uppercase text-[10px] md:text-xs tracking-[0.3em]">IA Processando...</span>
                                        </div>
                                    ) : (
                                        <div className="text-left">
                                            <div className={`p-4 md:p-6 rounded-2xl md:rounded-3xl rounded-tl-none border transition-all duration-500 ${isOptimized ? 'bg-blue-600/10 border-blue-500/30' : 'bg-white border-gray-200'}`}>
                                                <p className={`font-black text-xs md:text-sm leading-relaxed ${isOptimized ? 'text-white' : 'text-gray-400'}`}>
                                                    {isOptimized ? current.optimizedPrompt : '"Otimize para resultados profissionais..."'}
                                                </p>
                                            </div>

                                            <div className={`p-6 md:p-8 rounded-[24px] md:rounded-[36px] rounded-tr-none self-end border-2 transition-all duration-1000 delay-300 max-w-full lg:max-w-[95%] mt-8 ${isOptimized ? 'bg-white border-white shadow-[0_20px_40px_rgba(0,0,0,0.4)] opacity-100 translate-y-0' : 'bg-gray-100 border-transparent opacity-30 translate-y-8'}`}>
                                                {isOptimized ? current.optimizedResponse : (
                                                    <div className="space-y-2">
                                                        <div className="h-3 w-3/4 bg-gray-100 rounded-full animate-pulse"></div>
                                                        <div className="h-3 w-1/2 bg-gray-100 rounded-full animate-pulse"></div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="mt-20 text-center">
                            <button
                                onClick={() => scrollToSection('precos')}
                                className="bg-gray-900 text-white px-12 py-6 rounded-2xl font-black text-xl hover:bg-blue-600 transition-all shadow-2xl shadow-gray-200 group flex items-center gap-4 mx-auto"
                            >
                                {isOptimized ? 'Quero acesso a esses prompts' : 'Ver Planos Profissionais'}
                                <span className="inline-block group-hover:translate-x-2 transition-transform">→</span>
                            </button>
                        </div>
                    </div>
                </section>
            </FadeInSection>

            {/* Library Section */}
            <FadeInSection>
                <section id="biblioteca" className="py-32 bg-white">
                    <div className="container mx-auto px-6 max-w-6xl">
                        <div className="mb-20 text-center">
                            <h2 className="text-4xl font-black text-gray-900 tracking-tighter">Biblioteca Premium</h2>
                            <p className="text-gray-500 font-bold mt-4 tracking-normal text-lg">Acesso instantâneo aos prompts mais lucrativos do mercado.</p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 text-center">
                            {[
                                { title: "Estrategista Digital", cat: "Marketing", icon: "📈", users: "1.4k+", tag: "Alta Conversão", preview: "Atue como um CMO sênior especializado em Growth Hacking. Analise os seguintes KPIs de tráfego pago e identifique gargalos no funil de vendas..." },
                                { title: "Analista de Dados IA", cat: "Business", icon: "🧬", users: "890+", tag: "Foco em ROI", preview: "Você é um Analista de Dados sênior. Transforme esse conjunto de dados brutos em um relatório executivo destacando as 3 principais oportunidades..." },
                                { title: "Roteirista de Alta Retenção", cat: "Creator", icon: "🎬", users: "2.1k+", tag: "Viralização", preview: "Crie um roteiro de 60 segundos usando o framework Hook-Value-CTA. O gancho inicial deve atacar uma dor latente do público-alvo nos primeiros 3 segundos..." }
                            ].map((item, i) => (
                                <div key={i} className={`group p-8 md:p-10 rounded-[32px] md:rounded-[48px] border border-gray-100 bg-white hover:border-blue-600 hover:shadow-2xl transition-all duration-500 cursor-pointer relative flex flex-col ${i === 2 ? 'sm:col-span-2 lg:col-span-1' : ''}`}>
                                    <div className="absolute top-6 right-8">
                                        <span className="px-3 py-1 bg-blue-50 text-blue-600 text-[9px] font-black rounded-full uppercase tracking-widest">{item.tag}</span>
                                    </div>
                                    <div className="text-4xl mb-6">{item.icon}</div>
                                    <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-50 text-[10px] font-black uppercase text-gray-400 rounded-lg mb-4">
                                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                                        {item.users} Usaram
                                    </div>
                                    <h3 className="text-xl font-black text-gray-900 mb-6">{item.title}</h3>
                                    <div className="relative mb-8 bg-gray-50 p-4 rounded-2xl border border-gray-100/50">
                                        <div className="space-y-2 opacity-30 select-none blur-[3px]">
                                            <p className="text-[11px] text-gray-600 leading-relaxed text-left italic">{item.preview}</p>
                                        </div>
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="w-12 h-12 bg-white shadow-xl rounded-full flex items-center justify-center border border-gray-100 group-hover:scale-110 transition-transform">
                                                <span className="text-xl">🔒</span>
                                            </div>
                                        </div>
                                    </div>
                                    <button onClick={() => onStart()} className="mt-auto mx-auto w-fit px-12 py-4 bg-gray-50 text-gray-900 rounded-2xl font-black group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm block">Desbloquear Prompt</button>
                                </div>
                            ))}
                        </div>

                        <div className="mt-16 text-center">
                            <p className="text-gray-400 font-bold text-sm uppercase tracking-widest">⚡ E mais <span className="text-blue-600">modelos exclusivos</span> na área de membros</p>
                        </div>
                    </div>
                </section>
            </FadeInSection>

            {/* Testimonials Section */}
            <FadeInSection>
                <section id="depoimentos" className="py-32 bg-gray-50/50 relative overflow-hidden">
                    <div className="container mx-auto px-6 max-w-6xl">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl font-black text-gray-900 mb-4 tracking-tighter">Quem usa, aprova</h2>
                            <p className="text-gray-500 font-bold text-lg">Junte-se a centenas de profissionais que elevaram o nível do seu trabalho.</p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8">
                            {[
                                { name: "Ricardo Silva", role: "Copywriter Sênior", location: "São Paulo, SP", text: "O Melhore.AI mudou completamente meu workflow. O que eu levava 30 minutos pra estruturar, agora faço em segundos com uma qualidade absurda.", avatar: "👨‍💻" },
                                { name: "Ana Beatriz", role: "Social Media Manager", location: "Rio de Janeiro, RJ", text: "A biblioteca de prompts é surreal. Eu usei o de roteirista e meu primeiro vídeo bateu 50k views em 2 dias. Vale cada centavo!", avatar: "👩‍💼" },
                                { name: "Lucas Mendes", role: "Fundador de Agência", location: "Curitiba, PR", text: "O modo entrevista é o grande diferencial. Ele extrai informações que eu nem sabia que precisava passar para a IA. Resultados de elite.", avatar: "🚀" }
                            ].map((t, i) => (
                                <div key={i} className="bg-white p-8 md:p-10 rounded-[32px] md:rounded-[40px] border border-gray-100 shadow-xl shadow-gray-50 hover:-translate-y-2 transition-all duration-500">
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-2xl border border-blue-100">{t.avatar}</div>
                                        <div className="text-left">
                                            <h4 className="font-black text-gray-900 text-sm">{t.name}</h4>
                                            <div className="flex flex-col">
                                                <p className="text-blue-600 font-bold text-[10px] uppercase tracking-widest">{t.role}</p>
                                                <p className="text-gray-400 font-bold text-[9px] uppercase tracking-tighter mt-0.5">{t.location}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-gray-500 text-sm leading-relaxed italic text-left">&quot;{t.text}&quot;</p>
                                    <div className="mt-6 flex text-yellow-400 gap-1">
                                        {[1, 2, 3, 4, 5].map(s => <span key={s}>★</span>)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </FadeInSection>

            {/* Pricing Section */}
            <FadeInSection>
                <section id="precos" className="py-32 bg-gray-50/50 border-t border-gray-100">
                    <div className="container mx-auto px-6 max-w-6xl">
                        <div className="text-center mb-20">
                            <h2 className="text-4xl font-black text-gray-900 mb-4 tracking-tighter">Escolha seu Acesso Profissional</h2>
                            <p className="text-gray-500 font-bold text-lg">Planos desenhados para quem leva a IA a sério.</p>
                        </div>

                        <div className="max-w-md mx-auto">
                            <div className="bg-white p-8 md:p-12 rounded-[32px] md:rounded-[48px] border-2 border-blue-600 shadow-2xl shadow-blue-100 flex flex-col items-center text-center relative transition-transform hover:-translate-y-2 duration-500">
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-full flex justify-center">
                                    <span className="bg-gradient-to-r from-pink-500 to-rose-500 text-white text-[10px] font-black px-6 py-2 rounded-full uppercase tracking-widest shadow-xl shadow-rose-200 border-2 border-white flex items-center gap-2">🔥 33% OFF!</span>
                                </div>
                                <span className="text-[9px] md:text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] mb-4 mt-4">Plano Melhore.AI Pro</span>
                                <div className="flex flex-col items-center mb-8">
                                    <span className="text-gray-400 line-through font-bold text-lg mb-1">R$ 29,90</span>
                                    <div className="text-5xl md:text-6xl font-black text-green-600 tracking-tight flex items-baseline">
                                        R$ 19,90<span className="text-sm text-gray-400 font-bold ml-1">/mês</span>
                                    </div>
                                    <div className="mt-3 px-4 py-1.5 bg-green-50 text-green-700 text-[10px] font-black rounded-full border border-green-100 flex items-center gap-1.5">💰 VOCÊ ECONOMIZA R$ 10,00</div>
                                </div>
                                <ul className="space-y-4 md:space-y-5 mb-10 md:mb-12 text-left w-full">
                                    {["Otimizações de Prompt Ilimitadas", "Biblioteca Premium Completa", "Modo Entrevista Estratégico", "Suporte Prioritário"].map((f, i) => (
                                        <li key={i} className="flex items-center gap-3 md:gap-4 text-xs md:text-sm font-black text-gray-900">
                                            <span className="w-5 md:w-6 h-5 md:h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-[9px] md:text-[10px] shadow-lg shadow-blue-100">✓</span> {f}
                                        </li>
                                    ))}
                                </ul>
                                <button onClick={() => onStart('upgrade')} className="w-full py-4 md:py-5 bg-blue-600 text-white rounded-[18px] md:rounded-2xl font-black hover:bg-blue-700 shadow-2xl shadow-blue-100 transition-all text-base md:text-lg hover:scale-105 active:scale-95">Aproveitar Oferta</button>
                                <p className="mt-4 text-[9px] md:text-[10px] font-bold text-gray-400 uppercase tracking-widest italic mb-8">Cancele a qualquer momento</p>
                                <div className="pt-8 border-t border-gray-100 w-full flex flex-col items-center gap-4">
                                    <div className="flex items-center gap-3 px-5 py-3 bg-green-50/50 rounded-2xl border border-green-100/50">
                                        <span className="text-2xl">🔒</span>
                                        <div className="text-left">
                                            <p className="text-[11px] font-black text-green-600 uppercase tracking-tight">Checkout 100% Seguro</p>
                                            <p className="text-[9px] font-bold text-gray-500 leading-none">Dados protegidos por criptografia de ponta</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 opacity-40 group-hover:opacity-60 transition-opacity">
                                        <span className="text-[9px] font-black tracking-[0.2em] text-gray-400 uppercase">Pagamento Seguro via Stripe</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </FadeInSection>

            {/* FAQ Section */}
            <FadeInSection>
                <section className="py-32 bg-white">
                    <div className="container mx-auto px-6 max-w-3xl">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl font-black text-gray-900 mb-4 tracking-tighter">Dúvidas Frequentes</h2>
                            <p className="text-gray-500 font-bold text-lg">Tudo o que você precisa saber antes de começar.</p>
                        </div>
                        <div className="space-y-4">
                            {FAQS.map((faq, idx) => (
                                <details key={idx} className="group bg-gray-50 rounded-2xl border border-gray-100 [&_summary::-webkit-details-marker]:hidden">
                                    <summary className="flex cursor-pointer items-center justify-between gap-1.5 p-6 text-gray-900 font-black text-lg hover:text-blue-600 transition-colors">
                                        <h3 className="">{faq.question}</h3>
                                        <span className="relative flex size-5 shrink-0 items-center justify-center">
                                            <div className="absolute h-0.5 w-full bg-gray-300 group-open:rotate-180 transition-transform duration-300"></div>
                                            <div className="absolute h-full w-0.5 bg-gray-300 group-open:rotate-90 group-open:opacity-0 transition-all duration-300"></div>
                                        </span>
                                    </summary>
                                    <p className="mt-2 px-6 pb-6 text-gray-500 leading-relaxed font-medium">{faq.answer}</p>
                                </details>
                            ))}
                        </div>
                    </div>
                </section>
            </FadeInSection>

            {/* Footer */}
            <footer className="py-20 bg-gray-900 text-white border-t border-gray-800">
                <div className="container mx-auto px-6">
                    <div className="grid md:grid-cols-4 gap-12 mb-16">
                        <div className="col-span-1 md:col-span-1">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center font-black text-xl shadow-lg shadow-blue-900/50">M</div>
                                <span className="font-extrabold text-2xl tracking-tighter">Melhore.AI</span>
                            </div>
                            <p className="text-gray-400 text-sm leading-relaxed font-medium">A primeira plataforma brasileira focada exclusivamente em engenharia de prompt para profissionais de elite.</p>
                        </div>
                        <div>
                            <h4 className="font-black text-sm uppercase tracking-widest text-gray-500 mb-6">Produto</h4>
                            <ul className="space-y-4 text-sm font-bold">
                                <li><button onClick={() => scrollToSection('funcionalidades')} className="text-gray-300 hover:text-blue-500 transition-colors">Funcionalidades</button></li>
                                <li><button onClick={() => scrollToSection('biblioteca')} className="text-gray-300 hover:text-blue-500 transition-colors">Biblioteca</button></li>
                                <li><button onClick={() => scrollToSection('precos')} className="text-gray-300 hover:text-blue-500 transition-colors">Preços</button></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-black text-sm uppercase tracking-widest text-gray-500 mb-6">Legal</h4>
                            <ul className="space-y-4 text-sm font-bold">
                                <li><Link href="/terms" className="text-gray-300 hover:text-blue-500 transition-colors">Termos de Uso</Link></li>
                                <li><Link href="/privacy" className="text-gray-300 hover:text-blue-500 transition-colors">Política de Privacidade</Link></li>
                                <li><a href="#" className="text-gray-300 hover:text-blue-500 transition-colors">Licença de Conteúdo</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-black text-sm uppercase tracking-widest text-gray-500 mb-6">Contato</h4>
                            <ul className="space-y-4 text-sm font-bold">
                                <li><a href="mailto:contato.melhoreai@gmail.com" className="text-gray-300 hover:text-blue-500 transition-colors">contato.melhoreai@gmail.com</a></li>
                                <li className="text-gray-500">São Paulo, SP - Brasil</li>
                            </ul>
                        </div>
                    </div>
                    <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row items-center justify-between gap-4">
                        <p className="text-gray-500 text-sm font-bold">© 2026 Melhore.AI. Todos os direitos reservados.</p>
                        <div className="flex gap-4">
                            <a
                                href="https://www.instagram.com/melhore.ai/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-[#E1306C] hover:text-white transition-all cursor-pointer border border-transparent hover:border-[#E1306C]/30"
                                title="Siga-nos no Instagram"
                            >
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.947.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.947-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.947 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.948-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>
                            </a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
