"use client";

import React from 'react';

export default function LoadingScreen() {
    return (
        <div className="fixed inset-0 z-[200] bg-white flex flex-col items-center justify-center space-y-8 animate-in duration-500">
            {/* Logo Placeholder / Icon */}
            <div className="relative">
                <div className="w-24 h-24 bg-blue-600 rounded-3xl flex items-center justify-center text-4xl shadow-2xl shadow-blue-200 animate-pulse">
                    ✨
                </div>
                <div className="absolute -inset-4 bg-blue-600/20 rounded-[40px] animate-ping opacity-20"></div>
            </div>

            <div className="text-center space-y-2">
                <h2 className="text-xl font-black text-gray-900 tracking-tight">Melhore.AI</h2>
                <div className="flex items-center gap-1 justify-center">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce"></div>
                </div>
            </div>

            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] animate-pulse">
                Sincronizando IA de Elite...
            </p>
        </div>
    );
}
