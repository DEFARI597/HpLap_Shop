import { registerAs } from '@nestjs/config';

export default registerAs('xendit', () => ({
  secretKey: process.env.XENDIT_SECRET_KEY,
  webhookToken: process.env.XENDIT_WEBHOOK_VERIFICATION_TOKEN,
  frontendUrl: process.env.FRONTEND_URL
}));