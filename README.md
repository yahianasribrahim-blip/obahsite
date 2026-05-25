# Ottawa Barrhaven Animal Hospital — landing site

Paid-ads-only landing site for Google Ads. Hidden from organic search (noindex + robots disallow).

## Stack

- Pure static HTML + CSS + vanilla JS
- One Vercel serverless function (`api/contact.ts`) handles the contact form
- Resend for email delivery to `ottawabah@gmail.com`

## Local dev

```bash
npm install
npx vercel dev
```

## Env vars (set in Vercel project settings)

- `RESEND_API_KEY` — Resend API key
- `DESTINATION_EMAIL` — where form submissions get delivered (e.g. ottawabah@gmail.com)
