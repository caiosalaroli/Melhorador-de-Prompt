const fs = require('fs');
const path = 'c:\\Users\\caios\\projetos\\Melhorador de Prompt\\src\\components\\Dashboard.tsx';
let content = fs.readFileSync(path, 'utf8');

// O ponto exato onde o arquivo deve ser cortado e reconstruído
const splitPoint = '// Novo componente de navegação mobile';

const parts = content.split(splitPoint);

if (parts.length >= 2) {
    // Mantém a primeira parte (tudo antes de MobileNav) e substitui o resto
    const correctMobileNav = `// Novo componente de navegação mobile
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
                    className={\`flex flex-col items-center gap-1 transition-all \${activePage === item.id ? 'text-blue-600 scale-105' : 'text-gray-400'}\`}
                >
                    <span className="text-xl">{item.icon}</span>
                    <span className="text-[10px] font-black uppercase tracking-widest">{item.label}</span>
                </button>
            ))}
        </nav>
    );
}
`;
    // Reconstrói o arquivo
    const newContent = parts[0] + correctMobileNav;
    fs.writeFileSync(path, newContent);
    console.log('✅ Dashboard.tsx corrigido com sucesso!');
} else {
    console.error('❌ Erro: Não foi possível encontrar o ponto de corte no arquivo.');
    console.log('Conteúdo parcial encontrado inicial:', content.substring(content.length - 200));
}
