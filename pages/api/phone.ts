import type { NextApiRequest, NextApiResponse } from "next";
import { NEXT_TWILIO_AUTH_TOKEN, NEXT_TWILIO_SID, NEXT_TWILIO_MESSAGE_SERVICE_SID } from "@/utils/path";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method === "POST") {
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
            .then((message: { sid: any; }) => res
                .status(200)
                .json({ status: 200, message: "SMS sent", data: { send: true } }))
            .catch((error: any) => res.status(200).json({
                status: 200,
                message: "Error sending email",
                data: { sent: false },
            }));
    }
}
