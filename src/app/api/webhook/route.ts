import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { manageSubscriptionStatus } from '@/lib/subscription';

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
                const customerEmail = session.customer_details?.email || session.customer_email || undefined;

                if (userId) {
                    const { error } = await manageSubscriptionStatus(userId, customerId, true, customerEmail as string);
                    if (error) console.error('Erro ao ativar PRO:', error);
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
