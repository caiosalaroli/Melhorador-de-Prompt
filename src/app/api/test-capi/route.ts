import { NextResponse } from 'next/server';
import { sendCAPIEvent } from '@/lib/capi';

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const testEventCode = searchParams.get('code');

        const testUserData = {
            email: 'test@example.com',
            clientIp: '127.0.0.1',
            userAgent: 'TestAgent/1.0'
        };

        const testCustomData = {
            content_name: 'Test CAPI Event',
            status: 'test_success'
        };

        // Passando undefined como 4º argumento (eventId) e testEventCode como 5º argumento
        const result = await sendCAPIEvent('TestEvent', testUserData, testCustomData, undefined, testEventCode || undefined);

        return NextResponse.json({
            message: result?.success ? 'Evento enviado com SUCESSO!' : 'FALHA ao enviar evento',
            facebook_response: result,
            debug: {
                pixelId: process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID ? 'Configurado' : 'Faltando',
                accessToken: process.env.FB_ACCESS_TOKEN ? 'Configurado' : 'Faltando',
                testCode: testEventCode || 'Nenhum (Adicione ?code=TESTXXXX na URL)'
            }
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
