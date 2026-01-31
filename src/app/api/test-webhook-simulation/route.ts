import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { manageSubscriptionStatus } from '@/lib/subscription';

export async function POST(req: Request) {
    try {
        const authHeader = req.headers.get('Authorization');
        const token = authHeader?.replace('Bearer ', '');

        if (!token) {
            return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
        }

        const { data: { user }, error: authError } = await supabase.auth.getUser(token);

        if (authError || !user) {
            return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 401 });
        }

        console.log(`[DEV MODE] Simulando pagamento aprovado para: ${user.email}`);

        // Simula o que o Webhook faria
        const { error } = await manageSubscriptionStatus(
            user.id,
            'cus_test_simulated_' + Math.random().toString(36).substring(7),
            true,
            user.email
        );

        if (error) throw error;

        return NextResponse.json({ success: true, message: 'Status PRO ativado via simulação!' });

    } catch (err: any) {
        console.error('Simulation Error:', err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
