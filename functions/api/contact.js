// Cloudflare Pages Function — POST /api/contact
//
// Runs server-side only. The recipient address and all API keys live as
// Cloudflare Pages secrets (set via `wrangler pages secret put` or the
// dashboard) — never in the repo, never sent to the browser.
//
// Required secrets (Cloudflare Pages → Settings → Environment variables):
//   TURNSTILE_SECRET_KEY   — from the Cloudflare Turnstile widget
//   RESEND_API_KEY         — from resend.com
//   CONTACT_TO_EMAIL       — where messages should land
//   RESEND_FROM            — optional, defaults to the Resend sandbox sender
//                            until a domain is verified in Resend

const MAX_LEN = { name: 120, email: 180, message: 4000 };

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json' },
  });
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export async function onRequestPost({ request, env }) {
  let body;
  try {
    body = await request.json();
  } catch {
    return json({ ok: false, error: 'Invalid request body.' }, 400);
  }

  const name = String(body.name ?? '').trim();
  const email = String(body.email ?? '').trim();
  const message = String(body.message ?? '').trim();
  const turnstileToken = String(body.turnstileToken ?? '');

  if (!name || !email || !message || !turnstileToken) {
    return json({ ok: false, error: 'Please fill in every field.' }, 400);
  }
  if (!isValidEmail(email)) {
    return json({ ok: false, error: 'That email address doesn’t look right.' }, 400);
  }
  if (
    name.length > MAX_LEN.name ||
    email.length > MAX_LEN.email ||
    message.length > MAX_LEN.message
  ) {
    return json({ ok: false, error: 'One of the fields is too long.' }, 400);
  }

  // Verify the Turnstile token server-side before doing anything else.
  const verifyRes = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      secret: env.TURNSTILE_SECRET_KEY,
      response: turnstileToken,
      remoteip: request.headers.get('CF-Connecting-IP') ?? undefined,
    }),
  });
  const verifyData = await verifyRes.json();
  if (!verifyData.success) {
    return json({ ok: false, error: 'Verification failed — please try again.' }, 400);
  }

  const fromAddress = env.RESEND_FROM || 'Tech Parables <onboarding@resend.dev>';

  const sendRes = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      authorization: `Bearer ${env.RESEND_API_KEY}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      from: fromAddress,
      to: [env.CONTACT_TO_EMAIL],
      reply_to: email,
      subject: `New message from ${name} via aghasameer.com`,
      text: `From: ${name} <${email}>\n\n${message}`,
    }),
  });

  if (!sendRes.ok) {
    return json({ ok: false, error: 'Could not send right now — try again shortly.' }, 502);
  }

  return json({ ok: true });
}
