import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_build_placeholder', {
    apiVersion: '2024-12-18.acacia' as any,
});

export async function POST(req: Request) {
    // 0. Verificar se as chaves são válidas
    if (process.env.STRIPE_SECRET_KEY === 'sk_test_placeholder' || !process.env.STRIPE_SECRET_KEY) {
        return NextResponse.json({
            error: 'sk_test_placeholder: Chaves do Stripe não configuradas no .env.local'
        }, { status: 400 });
    }

    if (process.env.STRIPE_PRICE_ID === 'price_placeholder' || !process.env.STRIPE_PRICE_ID) {
        return NextResponse.json({
            error: 'price_placeholder: STRIPE_PRICE_ID não configurado no .env.local'
        }, { status: 400 });
    }

    try {
        // 1. Verificar Autenticação
        const authHeader = req.headers.get('Authorization');
        const token = authHeader?.replace('Bearer ', '');

        if (!token) {
            return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
        }

        const { data: { user }, error: authError } = await supabase.auth.getUser(token);

        if (authError || !user) {
            return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 401 });
        }

        // 2. Buscar perfil para verificar se já existe stripe_customer_id
        const { data: profile } = await supabase
            .from('profiles')
            .select('stripe_customer_id')
            .eq('user_id', user.id)
            .single();

        // 3. Criar Checkout Session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price: process.env.STRIPE_PRICE_ID,
                    quantity: 1,
                },
            ],
            mode: 'subscription',
            customer: profile?.stripe_customer_id || undefined,
            customer_email: profile?.stripe_customer_id ? undefined : user.email,
            success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/?status=success`,
            cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/?status=cancel`,
            metadata: {
                userId: user.id,
            },
        });

        return NextResponse.json({ url: session.url });
    } catch (err: any) {
        console.error('Stripe Checkout Error:', err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
