"use client";

import { useState } from 'react';
import { supabase } from '@/lib/supabase';

type AuthView = 'login' | 'register' | 'forgot-password' | 'update-password';

interface LoginPageProps {
    onLogin: () => void;
    initialView?: AuthView;
}

export default function LoginPage({ onLogin, initialView = 'login' }: LoginPageProps) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [view, setView] = useState<AuthView>(initialView);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            if (view === 'register') {
                if (password !== confirmPassword) {
                    throw new Error('As senhas não coincidem. Verifique e tente novamente.');
                }
                const { error: signUpError } = await supabase.auth.signUp({
                    email,
                    password,
                });
                if (signUpError) throw signUpError;
                setSuccess('Sua conta foi criada com sucesso! Redirecionando para o painel...');
                setTimeout(() => onLogin(), 1500);
            } else if (view === 'login') {
                const { error: signInError } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (signInError) {
                    if (signInError.message.includes('Invalid login credentials')) {
                        throw new Error('E-mail ou senha incorretos. Verifique seus dados.');
                    }
                    if (signInError.message.includes('Email not confirmed')) {
                        throw new Error('Por favor, confirme seu e-mail antes de fazer login.');
                    }
                    throw signInError;
                }
                onLogin();
            } else if (view === 'forgot-password') {
                const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
                    redirectTo: `${window.location.origin}/`,
                });
                if (resetError) throw resetError;
                setSuccess('Link de recuperação enviado com sucesso! Verifique seu e-mail.');
            } else if (view === 'update-password') {
                if (password !== confirmPassword) {
                    throw new Error('As senhas não coincidem. Verifique e tente novamente.');
                }
                const { error: updateError } = await supabase.auth.updateUser({
                    password: password
                });
                if (updateError) throw updateError;
                setSuccess('Sua nova senha foi salva! Redirecionando para o login...');
                setTimeout(() => setView('login'), 2500);
            }
        } catch (err: any) {
            setError(err.message || 'Ocorreu um erro inesperado. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    const getTitle = () => {
        switch (view) {
            case 'register': return 'Crie sua conta';
            case 'forgot-password': return 'Recuperar Senha';
            case 'update-password': return 'Nova Senha';
            default: return 'Bem-vindo de volta!';
        }
    };

    const getDescription = () => {
        switch (view) {
            case 'register': return 'Comece a otimizar seus prompts hoje.';
            case 'forgot-password': return 'Enviaremos um link para o seu e-mail.';
            case 'update-password': return 'Escolha sua nova senha de acesso.';
            default: return 'Acesse sua conta para continuar.';
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50/50 relative overflow-hidden font-sans">
            {/* Background Ambience */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-400/10 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-400/10 rounded-full blur-3xl pointer-events-none translate-y-1/2 -translate-x-1/2"></div>

            <div className="w-full max-w-md p-4 md:p-8 relative z-10">
                <div className="bg-white border border-gray-100 rounded-[28px] md:rounded-[32px] shadow-2xl shadow-gray-200/50 p-6 md:p-8 space-y-6 md:space-y-8">

                    {/* Header */}
                    <div className="text-center space-y-2">
                        <div className="inline-flex items-center gap-2 mb-4">
                            <span className="w-8 h-8 bg-blue-600 text-white rounded-lg flex items-center justify-center font-bold text-lg">M</span>
                            <span className="font-bold text-gray-900 text-xl tracking-tight">Melhore.AI</span>
                        </div>
                        <h1 className="text-2xl font-black text-gray-900">{getTitle()}</h1>
                        <p className="text-sm text-gray-500">{getDescription()}</p>
                    </div>

                    {error && (
                        <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-xs text-red-600 font-medium">
                            ⚠️ {error}
                        </div>
                    )}

                    {success && (
                        <div className="p-4 bg-green-50 border border-green-100 rounded-xl text-xs text-green-700 font-medium">
                            ✅ {success}
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {view !== 'update-password' && (
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide ml-1">E-mail</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none transition-all text-gray-900 placeholder:text-gray-400"
                                    placeholder="seu@email.com"
                                    required
                                />
                            </div>
                        )}

                        {(view === 'login' || view === 'register' || view === 'update-password') && (
                            <div className="space-y-2">
                                <div className="flex justify-between items-center ml-1">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                                        {view === 'update-password' ? 'Nova Senha' : 'Senha'}
                                    </label>
                                    {view === 'login' && (
                                        <button
                                            type="button"
                                            onClick={() => setView('forgot-password')}
                                            className="text-xs text-blue-600 hover:text-blue-700 font-bold"
                                        >
                                            Esqueceu?
                                        </button>
                                    )}
                                </div>
                                <div className="relative group/pass">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none transition-all text-gray-900 placeholder:text-gray-400 pr-12"
                                        placeholder="••••••••"
                                        minLength={6}
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500 transition-colors p-1"
                                    >
                                        {showPassword ? (
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                                            </svg>
                                        ) : (
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                            </div>
                        )}

                        {(view === 'register' || view === 'update-password') && (
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide ml-1">Confirmar Senha</label>
                                <div className="relative group/pass">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none transition-all text-gray-900 placeholder:text-gray-400 pr-12"
                                        placeholder="••••••••"
                                        minLength={6}
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500 transition-colors p-1"
                                    >
                                        {showPassword ? (
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                                            </svg>
                                        ) : (
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-200 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                            ) : (
                                view === 'login' ? 'Entrar na Plataforma' :
                                    view === 'register' ? 'Criar Conta' :
                                        view === 'forgot-password' ? 'Enviar Link' : 'Redefinir Senha'
                            )}
                        </button>

                        {(view === 'forgot-password' || view === 'update-password') && (
                            <button
                                type="button"
                                onClick={() => setView('login')}
                                className="w-full text-center text-xs font-bold text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                Voltar para o Login
                            </button>
                        )}
                    </form>


                    {view === 'login' && (
                        <p className="text-center text-xs text-gray-500">
                            Não tem uma conta? <button onClick={() => setView('register')} className="text-blue-600 font-bold hover:underline">Crie agora</button>
                        </p>
                    )}

                    {view === 'register' && (
                        <p className="text-center text-xs text-gray-500">
                            Já tem uma conta? <button onClick={() => setView('login')} className="text-blue-600 font-bold hover:underline">Faça login</button>
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
