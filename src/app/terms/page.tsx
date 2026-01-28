import React from 'react';
import Link from 'next/link';

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-white text-gray-900 font-sans p-8 md:p-24 max-w-4xl mx-auto space-y-8">
            <Link href="/" className="text-blue-600 font-bold hover:underline">← Voltar para o Início</Link>
            <h1 className="text-4xl font-black tracking-tighter">Termos de Uso</h1>
            <p className="text-gray-500 font-medium">Última atualização: 27 de Jan de 2026</p>

            <section className="space-y-4">
                <h2 className="text-xl font-bold">1. Aceitação dos Termos</h2>
                <p className="text-gray-600 leading-relaxed">
                    Ao acessar o Melhore.AI, você concorda em cumprir estes termos de serviço e todas as leis e regulamentos aplicáveis.
                </p>
            </section>

            <section className="space-y-4">
                <h2 className="text-xl font-bold">2. Uso da Licença</h2>
                <p className="text-gray-600 leading-relaxed">
                    O Melhore.AI concede uma licença limitada para uso pessoal ou comercial dos prompts gerados. É proibida a revenda da tecnologia ou o uso para fins ilícitos.
                </p>
            </section>

            <section className="space-y-4">
                <h2 className="text-xl font-bold">3. Isenção de Responsabilidade</h2>
                <p className="text-gray-600 leading-relaxed">
                    Os prompts são gerados por Inteligência Artificial. Não garantimos resultados específicos e não nos responsabilizamos pelo conteúdo gerado pelas IAs de terceiros (ChatGPT, Gemini, etc).
                </p>
            </section>
        </div>
    );
}
