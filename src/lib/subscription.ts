import { supabase } from '@/lib/supabase';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function manageSubscriptionStatus(userId: string, customerId: string, isPro: boolean, email?: string) {
    console.log(`[Subscription Service] Atualizando status para User ${userId}: Pro=${isPro} Email=${email}`);

    // Se for ativar o PRO
    if (isPro) {
        return await supabaseAdmin
            .from('profiles')
            .upsert({
                user_id: userId,
                is_pro: true,
                stripe_customer_id: customerId,
                email: email, // Atualiza o email no perfil
                updated_at: new Date().toISOString(),
            }, { onConflict: 'user_id' });
    }

    // Se for remover o PRO (cancelamento/falha)
    else {
        return await supabaseAdmin
            .from('profiles')
            .update({ is_pro: false })
            .eq('stripe_customer_id', customerId);
    }
}
