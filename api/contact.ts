import { Resend } from 'resend';

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  let name = '', email = '', phone = '', subject = '', message = '';
  try {
    const contentType = req.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      const body = await req.json();
      name = String(body.name || '').trim();
      email = String(body.email || '').trim();
      phone = String(body.phone || '').trim();
      subject = String(body.subject || '').trim();
      message = String(body.message || '').trim();
    } else {
      const formData = await req.formData();
      name = String(formData.get('name') || '').trim();
      email = String(formData.get('email') || '').trim();
      phone = String(formData.get('phone') || '').trim();
      subject = String(formData.get('subject') || '').trim();
      message = String(formData.get('message') || '').trim();
    }
  } catch {
    return json({ error: 'Invalid request body' }, 400);
  }

  if (!name || !email || !message) {
    return json({ error: 'Missing required fields' }, 400);
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return json({ error: 'Invalid email' }, 400);
  }

  const apiKey = process.env.RESEND_API_KEY;
  const destination = process.env.DESTINATION_EMAIL;
  if (!apiKey || !destination) {
    console.error('[OBAH-CONTACT] Missing RESEND_API_KEY or DESTINATION_EMAIL env var');
    return json({ error: 'Server misconfigured' }, 500);
  }

  const resend = new Resend(apiKey);

  const text = [
    `Name: ${name}`,
    `Email: ${email}`,
    `Phone: ${phone || '(not provided)'}`,
    `Subject: ${subject || '(not provided)'}`,
    '',
    'Message:',
    message,
  ].join('\n');

  try {
    const result = await resend.emails.send({
      from: 'OBAH Website <noreply@progressly.us>',
      to: destination,
      replyTo: email,
      subject: `New website inquiry: ${subject || 'No subject'}`,
      text,
    });

    if (result.error) {
      console.error('[OBAH-CONTACT] Resend error:', result.error);
      return json({ error: 'Send failed' }, 500);
    }

    return json({ ok: true });
  } catch (err: unknown) {
    console.error('[OBAH-CONTACT] Exception:', err);
    return json({ error: 'Send failed' }, 500);
  }
}

function json(body: Record<string, unknown>, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
