import { NextResponse } from 'next/server';
import { supabase, createServerSupabase } from '@/lib/supabase';

export async function POST(req: Request) {
    try {
        // 1. VERIFICAÇÃO DE AUTENTICAÇÃO
        const authHeader = req.headers.get('Authorization');
        const token = authHeader?.replace('Bearer ', '');

        if (!token) {
            return NextResponse.json({ error: "Usuário não autenticado." }, { status: 401 });
        }

        const { data: { user }, error: authError } = await supabase.auth.getUser(token);

        if (authError || !user) {
            return NextResponse.json({ error: "Sessão expirada ou inválida." }, { status: 401 });
        }

        // 2. RECEBER DADOS
        const { category, message } = await req.json();

        if (!category || !message) {
            return NextResponse.json({ error: "Categoria e mensagem são obrigatórias." }, { status: 400 });
        }

        // 3. REGISTRAR NO SUPABASE
        const serverSupabase = createServerSupabase(token);
        const { error: insertError } = await serverSupabase
            .from('feedbacks')
            .insert({
                user_id: user.id,
                user_email: user.email,
                category,
                message,
                created_at: new Date().toISOString()
            });

        if (insertError) {
            console.error('Erro ao salvar feedback:', insertError);
            return NextResponse.json({ error: "Erro ao salvar no banco de dados." }, { status: 500 });
        }

        return NextResponse.json({ success: true, message: "Feedback enviado com sucesso!" });

    } catch (error: any) {
        console.error('API Feedback Error:', error);
        return NextResponse.json(
            { error: "Erro interno no servidor." },
            { status: 500 }
        );
    }
}
