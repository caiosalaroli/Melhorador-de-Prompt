import { useState, useEffect } from 'react';

export interface ProjectPrompt {
    id: string;
    original: string;
    improved: string;
    timestamp: number;
}

export interface Project {
    id: string;
    name: string;
    description: string;
    timestamp: number;
    prompts: ProjectPrompt[];
}

export function useProjects() {
    const [projects, setProjects] = useState<Project[]>([]);

    useEffect(() => {
        const saved = localStorage.getItem('melhore_projects');
        if (saved) {
            try {
                setProjects(JSON.parse(saved));
            } catch (e) {
                console.error('Failed to parse projects', e);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const saveProjects = (updated: Project[]) => {
        setProjects(updated);
        localStorage.setItem('melhore_projects', JSON.stringify(updated));
    };

    const addProject = (name: string, description: string) => {
        const newProject: Project = {
            id: Date.now().toString(),
            name,
            description,
            timestamp: Date.now(),
            prompts: []
        };
        saveProjects([newProject, ...projects]);
    };

    const deleteProject = (id: string) => {
        saveProjects(projects.filter(p => p.id !== id));
    };

    const addPromptToProject = (projectId: string, original: string, improved: string) => {
        const updated = projects.map(p => {
            if (p.id === projectId) {
                return {
                    ...p,
                    prompts: [
                        {
                            id: Date.now().toString(),
                            original,
                            improved,
                            timestamp: Date.now()
                        },
                        ...p.prompts
                    ]
                };
            }
            return p;
        });
        saveProjects(updated);
    };

    return { projects, addProject, deleteProject, addPromptToProject };
}
