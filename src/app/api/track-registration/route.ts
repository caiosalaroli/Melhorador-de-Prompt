import { NextResponse } from 'next/server';
import { sendCAPIEvent } from '@/lib/capi';

export async function POST(req: Request) {
    try {
        const { email, fbp, fbc } = await req.json();

        if (!email) {
            return NextResponse.json({ error: 'Email missing' }, { status: 400 });
        }

        const userDataCapi = {
            email,
            clientIp: req.headers.get('x-forwarded-for') || '127.0.0.1',
            userAgent: req.headers.get('user-agent') || 'Unknown',
            fbp: fbp || null,
            fbc: fbc || null
        };

        const customDataCapi = {
            content_name: 'User Registration',
            status: 'success'
        };

        console.log(`[CAPI] Tracking registration for: ${email}`);

        // Fire and forget
        sendCAPIEvent('CompleteRegistration', userDataCapi, customDataCapi).catch(e =>
            console.error('CAPI Registration Error:', e)
        );

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Track Registration API Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
