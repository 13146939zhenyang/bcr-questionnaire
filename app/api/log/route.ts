import { NextResponse } from 'next/server'
import { NEXT_TWILIO_AUTH_TOKEN, NEXT_TWILIO_SID, NEXT_TWILIO_MESSAGE_SERVICE_SID } from "@/utils/path";

export async function POST(req: { body: any; }) {
    const user = req.body;
    const { phone, code } = user;
    const accountSid = NEXT_TWILIO_SID;
    const authToken = NEXT_TWILIO_AUTH_TOKEN;
    const client = require('twilio')(accountSid, authToken);
    const data = await client.messages
        .create({
            body: `Your verifycation code is ${code}`,
            from: '+61483926168',
            messagingServiceSid: NEXT_TWILIO_MESSAGE_SERVICE_SID,
            to: phone
        })
        .then((message: { sid: any; }) => NextResponse.json({ status: 200, message: "SMS sent", data: { send: true } }))
        .catch((error: any) =>
            NextResponse.json({
                status: 200,
                message: "Error sending email",
                data: { sent: false },
            }));
}