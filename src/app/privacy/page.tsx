import React from 'react';
import Link from 'next/link';

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-white text-gray-900 font-sans p-8 md:p-24 max-w-4xl mx-auto space-y-8">
            <Link href="/" className="text-blue-600 font-bold hover:underline">← Voltar para o Início</Link>
            <h1 className="text-4xl font-black tracking-tighter">Política de Privacidade</h1>
            <p className="text-gray-500 font-medium">Última atualização: 27 de Jan de 2026</p>

            <section className="space-y-4">
                <h2 className="text-xl font-bold">1. Coleta de Dados</h2>
                <p className="text-gray-600 leading-relaxed">
                    Coletamos apenas o e-mail para fins de autenticação e histórico de uso dos prompts. Não vendemos seus dados para terceiros.
                </p>
            </section>

            <section className="space-y-4">
                <h2 className="text-xl font-bold">2. Segurança</h2>
                <p className="text-gray-600 leading-relaxed">
                    Utilizamos o Supabase para garantir a segurança da sua conta e de seus dados. Todos os prompts salvos são protegidos por Row Level Security (RLS).
                </p>
            </section>

            <section className="space-y-4">
                <h2 className="text-xl font-bold">3. Cookies</h2>
                <p className="text-gray-600 leading-relaxed">
                    Utilizamos cookies apenas para manter sua sessão ativa e garantir o funcionamento correto da plataforma.
                </p>
            </section>
        </div>
    );
}
