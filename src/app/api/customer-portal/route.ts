import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { supabase } from '@/lib/supabase';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_build_placeholder', {
    apiVersion: '2024-12-18.acacia' as any,
});

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

        // Buscar o Customer ID do usuário no Supabase
        const { data: profile } = await supabase
            .from('profiles')
            .select('stripe_customer_id')
            .eq('user_id', user.id)
            .single();

        if (!profile?.stripe_customer_id) {
            return NextResponse.json({ error: 'Assinatura não encontrada' }, { status: 400 });
        }

        // Criar sessão do Portal do Cliente
        const session = await stripe.billingPortal.sessions.create({
            customer: profile.stripe_customer_id,
            return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard`,
        });

        return NextResponse.json({ url: session.url });
    } catch (err: any) {
        console.error('Stripe Portal Error:', err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
