import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'build-time-placeholder';

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase credentials missing. Auth features will not work.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Cria um cliente Supabase autenticado para uso no servidor (API Routes)
 * Isso permite que o código do servidor tenha as permissões do usuário logado (RLS).
 */
export const createServerSupabase = (token: string) => {
    return createClient(supabaseUrl, supabaseAnonKey, {
        global: {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    });
};


