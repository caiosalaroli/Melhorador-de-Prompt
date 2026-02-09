import crypto from 'crypto';

const PIXEL_ID = process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID;
const ACCESS_TOKEN = process.env.FB_ACCESS_TOKEN;

type UserData = {
    email?: string;
    phone?: string;
    firstName?: string;
    lastName?: string;
    clientIp?: string;
    userAgent?: string;
    fbp?: string;
    fbc?: string;
};

type CustomData = {
    currency?: string;
    value?: number;
    content_name?: string;
    content_ids?: string[];
    content_type?: string;
    status?: string;
    subscription_period?: string;
};

// SHA-256 Hashing helper
const hashData = (data: string) => {
    return crypto.createHash('sha256').update(data.trim().toLowerCase()).digest('hex');
};

export async function sendCAPIEvent(
    eventName: string,
    userData: UserData,
    customData: CustomData = {},
    eventId?: string
) {
    if (!PIXEL_ID || !ACCESS_TOKEN) {
        console.warn('⚠️ Meta CAPI: Missing Credentials');
        return;
    }

    const currentTimestamp = Math.floor(Date.now() / 1000);

    const payload = {
        data: [
            {
                event_name: eventName,
                event_time: currentTimestamp,
                event_id: eventId, // Deduplicação
                action_source: 'website',
                user_data: {
                    em: userData.email ? [hashData(userData.email)] : undefined,
                    ph: userData.phone ? [hashData(userData.phone)] : undefined,
                    fn: userData.firstName ? [hashData(userData.firstName)] : undefined,
                    ln: userData.lastName ? [hashData(userData.lastName)] : undefined,
                    client_ip_address: userData.clientIp,
                    client_user_agent: userData.userAgent,
                    fbp: userData.fbp,
                    fbc: userData.fbc,
                },
                custom_data: customData,
            },
        ],
    };

    try {
        const response = await fetch(
            `https://graph.facebook.com/v18.0/${PIXEL_ID}/events?access_token=${ACCESS_TOKEN}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            }
        );

        if (!response.ok) {
            const errorData = await response.json();
            console.error('❌ Meta CAPI Error:', JSON.stringify(errorData, null, 2));
        } else {
            console.log(`✅ Meta CAPI Sent: ${eventName}`);
        }
    } catch (error) {
        console.error('❌ Meta CAPI Network Error:', error);
    }
}
