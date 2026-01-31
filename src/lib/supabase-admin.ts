import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Cliente com privilégios de administrador (bypass RLS)
// Deve ser usado APENAS no lado do servidor (API Routes, Server Actions)
export const supabaseAdmin = createClient(
    supabaseUrl,
    supabaseServiceRoleKey
);
