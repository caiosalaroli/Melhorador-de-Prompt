import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { manageSubscriptionStatus } from '@/lib/subscription';
import { supabaseAdmin } from '@/lib/supabase-admin';

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
                let userId = session.metadata?.userId;
                const customerId = session.customer as string;
                const customerEmail = session.customer_details?.email || session.customer_email || undefined;

                // Fallback logic: If metadata.userId is missing (e.g. invalid flow/direct link), try to find user by email
                if (!userId && customerEmail) {
                    console.log(`[Webhook] UserID ausente no metadata. Tentando recuperar pelo email: ${customerEmail}`);
                    const { data: profile } = await supabaseAdmin
                        .from('profiles')
                        .select('user_id')
                        .eq('email', customerEmail)
                        .single();

                    if (profile) {
                        userId = profile.user_id;
                        console.log(`[Webhook] Usuário encontrado via email: ${userId}`);
                    }
                }

                if (userId) {
                    const { error } = await manageSubscriptionStatus(userId, customerId, true, customerEmail as string);
                    if (error) {
                        console.error('Erro ao ativar PRO:', error);
                    } else {
                        // --- Meta CAPI: Send Purchase Event ---
                        try {
                            // Top-level import would be better, but keeping dynamic for now to avoid side-effects if any.
                            // However, we'll verify it works.
                            const { sendCAPIEvent } = await import('@/lib/capi');

                            const amount = session.amount_total ? session.amount_total / 100 : 29.90;
                            const currency = session.currency?.toUpperCase() || 'BRL';
                            const eventId = `purchase_${session.id}`;

                            // Split name if available
                            const fullName = session.customer_details?.name || '';
                            const [firstName, ...lastNameParts] = fullName.split(' ');
                            const lastName = lastNameParts.join(' ');

                            console.log(`[Webhook] Enviando Purchase CAPI. Val: ${amount} ${currency}, Email: ${customerEmail}, FBP: ${session.metadata?.fbp}`);

                            await sendCAPIEvent(
                                'Purchase',
                                {
                                    email: customerEmail,
                                    firstName: firstName,
                                    lastName: lastName,
                                    fbp: session.metadata?.fbp,
                                    fbc: session.metadata?.fbc
                                },
                                {
                                    value: amount,
                                    currency: currency,
                                    content_name: 'Assinatura Melhore.AI Pro',
                                    content_type: 'product',
                                    status: 'completed'
                                },
                                eventId
                            );
                        } catch (capiError) {
                            console.error('❌ Erro ao enviar evento CAPI Purchase:', capiError);
                        }
                    }
                } else {
                    console.error('Erro Crítico: Não foi possível identificar o usuário para ativar o PRO. Session:', session.id);
                }
                break;
            }

            case 'customer.subscription.deleted': {
                const subscription = event.data.object as Stripe.Subscription;
                const customerId = subscription.customer as string;

                const { error } = await manageSubscriptionStatus('', customerId, false);

                if (error) console.error('Erro ao remover status PRO:', error);
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
