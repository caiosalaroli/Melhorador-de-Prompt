import { useEffect, useState } from 'react';

export interface PromptEntry {
    id: string;
    original: string;
    improved: string;
    timestamp: number;
    model: string;
    context: {
        persona: string;
        tone: string;
        goal: string;
        intention: string;
    };
}

export function usePromptHistory() {
    const [history, setHistory] = useState<PromptEntry[]>([]);

    useEffect(() => {
        // Load history from localStorage
        const saved = localStorage.getItem('promptHistory');
        if (saved) {
            try {
                setHistory(JSON.parse(saved));
            } catch (e) {
                console.error('Failed to parse prompt history', e);
            }
        }
    }, []);

    const savePrompt = (entry: Omit<PromptEntry, 'id' | 'timestamp'>) => {
        const newEntry: PromptEntry = {
            ...entry,
            id: Date.now().toString(),
            timestamp: Date.now(),
        };

        const updated = [newEntry, ...history].slice(0, 50); // Keep last 50
        setHistory(updated);
        localStorage.setItem('promptHistory', JSON.stringify(updated));
    };

    const clearHistory = () => {
        setHistory([]);
        localStorage.removeItem('promptHistory');
    };

    const deletePrompt = (id: string) => {
        const updated = history.filter(item => item.id !== id);
        setHistory(updated);
        localStorage.setItem('promptHistory', JSON.stringify(updated));
    };

    return { history, savePrompt, clearHistory, deletePrompt };
}
