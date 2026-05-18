import * as admin from 'firebase-admin';
import { Twilio } from 'twilio';

// Firebase Admin initialization
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
  });
}

export const fcm = admin.messaging();

// Twilio initialization
const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID;
const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN;

export const twilio = new Twilio(twilioAccountSid, twilioAuthToken);

export const sendPushNotification = async (token: string, title: string, body: string) => {
  return fcm.send({
    token,
    notification: { title, body },
  });
};

export const sendWhatsAppMessage = async (to: string, body: string) => {
  return twilio.messages.create({
    from: `whatsapp:${process.env.TWILIO_WHATSAPP_FROM}`,
    to: `whatsapp:${to}`,
    body,
  });
};
