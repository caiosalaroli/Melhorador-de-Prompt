"use client";

import React, { useState, useEffect } from 'react';

interface OnboardingStep {
    title: string;
    description: string;
    icon: string;
    highlightId?: string;
}

const ONBOARDING_STEPS: OnboardingStep[] = [
    {
        title: "Bem-vindo ao Melhore.AI!",
        description: "Estamos felizes em ter você aqui. Vamos te mostrar rapidamente como transformar seus comandos básicos em prompts de elite.",
        icon: "✨"
    },
    {
        title: "O Modo Entrevista",
        description: "Não comece do zero. Use os seletores de Persona, Tom e Objetivo para dar contexto à IA antes mesmo de escrever.",
        icon: "🎙️",
        highlightId: "interview-mode-area"
    },
    {
        title: "A Mágica da Otimização",
        description: "Escreva sua ideia simples e clique em 'Melhorar Prompt'. Nossa IA vai estruturar tudo para o modelo (GPT ou Gemini) que você escolher.",
        icon: "🚀",
        highlightId: "input-area"
    },
    {
        title: "O Raio-X do Prompt",
        description: "Sempre que um prompt for gerado, você poderá ver a explicação técnica de por que ele foi escrito daquela forma.",
        icon: "🔬",
        highlightId: "output-area"
    },
    {
        title: "Tudo Organizado",
        description: "Seus prompts ficam salvos no Histórico e podem ser organizados em Projetos no menu lateral.",
        icon: "📁",
        highlightId: "sidebar-area"
    },
    {
        title: "Master Prompts 💎",
        description: "Acesse nossa biblioteca de prompts de elite prontos para uso. Economize tempo com estruturas testadas e aprovadas.",
        icon: "💎",
        highlightId: "sidebar-master-prompts"
    },
    {
        title: "Academia AI",
        description: "Aprenda as melhores técnicas de engenharia de prompt diretamente na plataforma para extrair o máximo da IA.",
        icon: "🎓",
        highlightId: "sidebar-academy"
    }
];

interface OnboardingTourProps {
    onComplete: () => void;
}

export default function OnboardingTour({ onComplete }: OnboardingTourProps) {
    const [currentStep, setCurrentStep] = useState(0);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setIsVisible(true), 100);
        return () => clearTimeout(timer);
    }, []);

    const handleNext = () => {
        if (currentStep < ONBOARDING_STEPS.length - 1) {
            setCurrentStep(prev => prev + 1);
        } else {
            handleClose();
        }
    };

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(onComplete, 500);
    };

    const step = ONBOARDING_STEPS[currentStep];

    return (
        <div className={`fixed inset-0 z-[100] flex items-center justify-center p-4 transition-all duration-500 ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            {/* Backdrop com blur premium */}
            <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={handleClose}></div>

            {/* Modal de Onboarding */}
            <div className="relative bg-white/90 backdrop-blur-2xl border border-white/50 w-full max-w-lg rounded-[40px] shadow-2xl p-8 md:p-12 space-y-8 animate-in fade-in zoom-in duration-500">

                {/* Indicador de Progresso */}
                <div className="flex gap-2 justify-center">
                    {ONBOARDING_STEPS.map((_, i) => (
                        <div
                            key={i}
                            className={`h-1.5 rounded-full transition-all duration-300 ${i === currentStep ? 'w-8 bg-blue-600' : 'w-2 bg-gray-200'}`}
                        />
                    ))}
                </div>

                {/* Conteúdo do Step */}
                <div className="text-center space-y-4">
                    <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-3xl mx-auto flex items-center justify-center text-4xl shadow-inner mb-6">
                        {step.icon}
                    </div>
                    <h2 className="text-3xl font-black text-gray-900 leading-tight">
                        {step.title}
                    </h2>
                    <p className="text-gray-600 text-lg leading-relaxed">
                        {step.description}
                    </p>
                </div>

                {/* Botões de Ação */}
                <div className="flex flex-col gap-3 pt-4">
                    <button
                        onClick={handleNext}
                        className="w-full py-5 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl shadow-xl shadow-blue-200 transition-all active:scale-[0.98] flex items-center justify-center gap-2 text-lg"
                    >
                        {currentStep === ONBOARDING_STEPS.length - 1 ? 'Começar a Usar' : 'Próximo Passo →'}
                    </button>
                    {currentStep < ONBOARDING_STEPS.length - 1 && (
                        <button
                            onClick={handleClose}
                            className="w-full py-3 text-gray-400 font-bold hover:text-gray-600 transition-colors text-sm"
                        >
                            Pular Tutorial
                        </button>
                    )}
                </div>

                {/* Dica fixa */}
                <p className="text-[10px] text-center text-gray-400 uppercase font-black tracking-widest">
                    Melhore.AI • Edição de Lançamento
                </p>
            </div>
        </div>
    );
}
