import React from 'react';

interface SidebarProps {
    activePage: string;
    onNavigate: (page: string) => void;
    onLogout?: () => void;
    onFeedback?: () => void;
    onTutorial?: () => void;
    isPro?: boolean;
}

export default function Sidebar({ activePage, onNavigate, onLogout, onFeedback, onTutorial, isPro }: SidebarProps) {
    const navItems: { id: string, label: string, icon: string }[] = [
        { id: 'dashboard', label: 'Dashboard', icon: '📊' },
        { id: 'master-prompts', label: 'Master Prompts', icon: '💎' },
        { id: 'history', label: 'Histórico', icon: '🕒' },
        { id: 'projects', label: 'Projetos', icon: '📁' },
        { id: 'academy', label: 'Academia AI', icon: '🎓' },
        { id: 'settings', label: 'Configurações', icon: '⚙️' },
    ];

    return (
        <div className="w-72 h-full bg-secondary border-r border-border flex flex-col p-4">
            <div className="text-primary font-bold text-xl mb-8 flex items-center gap-2">
                <span className="bg-primary text-white p-1 rounded-lg">M</span>
                Melhore.AI
            </div>

            <div className="flex-1 overflow-y-auto px-4 space-y-2 py-4">
                {navItems.map((item) => (
                    <button
                        key={item.id}
                        id={`sidebar-${item.id}`}
                        onClick={() => onNavigate(item.id)}
                        className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl font-black text-sm transition-all duration-300 group whitespace-nowrap ${activePage === item.id ? 'bg-blue-600 text-white shadow-xl shadow-blue-100' : 'text-gray-400 hover:bg-blue-50 hover:text-blue-600'}`}
                    >
                        <span className={`text-xl flex-shrink-0 transition-transform duration-300 ${activePage === item.id ? 'scale-110' : 'group-hover:scale-110'}`}>{item.icon}</span>
                        <span>{item.label}</span>
                    </button>
                ))}
            </div>

            {/* Tutorial & Feedback Section */}
            <div className="px-5 pb-4 space-y-3">
                <button
                    onClick={onTutorial}
                    className="w-full flex items-center gap-4 px-5 py-3 rounded-2xl font-bold text-xs text-gray-500 bg-gray-50 hover:bg-white hover:text-blue-600 border border-transparent hover:border-blue-100 transition-all duration-300 group shadow-sm"
                >
                    <span className="text-lg group-hover:scale-110 transition-transform">❓</span>
                    Como Usar
                </button>
                <button
                    onClick={onFeedback}
                    className="w-full flex items-center gap-4 px-5 py-3 rounded-2xl font-bold text-xs text-blue-600 bg-blue-50 hover:bg-blue-100 transition-all duration-300 group"
                >
                    <span className="text-lg group-hover:scale-110 transition-transform">💬</span>
                    Enviar Feedback
                </button>
                <a
                    href="https://www.instagram.com/melhore.ai/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center gap-4 px-5 py-3 rounded-2xl font-bold text-xs text-pink-600 bg-pink-50 hover:bg-pink-100 transition-all duration-300 group no-underline"
                >
                    <span className="text-lg group-hover:scale-110 transition-transform">📸</span>
                    Siga no Instagram
                </a>
            </div>

            <button
                onClick={onLogout}
                className="w-full text-left px-4 py-3 rounded-xl flex items-center gap-3 text-red-400 hover:bg-red-50 hover:text-red-600 transition-all mt-auto font-medium"
            >
                <span>🚪</span>
                Sair
            </button>
        </div>
    );
}
