import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { supabase } from '@/lib/supabase';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_build_placeholder', {
    apiVersion: '2024-12-18.acacia' as any,
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || 'whsec_build_placeholder';

export async function POST(req: Request) {
    const body = await req.text();
    const signature = req.headers.get('stripe-signature')!;

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err: any) {
        console.error(`Webhook signature verification failed: ${err.message}`);
        return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
    }

    try {
        switch (event.type) {
            case 'checkout.session.completed': {
                const session = event.data.object as Stripe.Checkout.Session;
                const userId = session.metadata?.userId;
                const customerId = session.customer as string;

                if (userId) {
                    // Marcar usuário como PRO e salvar o Customer ID
                    const { error } = await supabase
                        .from('profiles')
                        .upsert({
                            user_id: userId,
                            is_pro: true,
                            stripe_customer_id: customerId,
                            updated_at: new Date().toISOString(),
                        }, { onConflict: 'user_id' });

                    if (error) console.error('Erro ao atualizar perfil no Supabase:', error);
                }
                break;
            }

            case 'customer.subscription.deleted': {
                const subscription = event.data.object as Stripe.Subscription;
                const customerId = subscription.customer as string;

                // Remover status PRO
                const { error } = await supabase
                    .from('profiles')
                    .update({ is_pro: false })
                    .eq('stripe_customer_id', customerId);

                if (error) console.error('Erro ao remover status PRO no Supabase:', error);
                break;
            }

            default:
                console.log(`Unhandled event type ${event.type}`);
        }

        return NextResponse.json({ received: true });
    } catch (err: any) {
        console.error('Webhook processing failed:', err);
        return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
    }
}
