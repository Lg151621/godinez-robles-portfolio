import { parseInquiry } from '@/lib/inquiry';

export async function POST(request: Request) {
  const origin = request.headers.get('origin');
  if (origin && origin !== new URL(request.url).origin) {
    return Response.json(
      { error: 'Please send your inquiry from the VitaNova website.' },
      { status: 403 },
    );
  }
  let data: unknown;
  try {
    const body = await request.text();
    if (body.length > 20000)
      return Response.json(
        { error: 'Your inquiry is too long. Please shorten the details.' },
        { status: 413 },
      );
    data = JSON.parse(body);
  } catch {
    return Response.json(
      { error: 'We could not read your inquiry. Please try again.' },
      { status: 400 },
    );
  }
  const { inquiry, errors } = parseInquiry(data);
  if (Object.keys(errors).length) return Response.json({ errors }, { status: 422 });
  const destination = process.env.INQUIRY_WEBHOOK_URL;
  if (!destination) {
    return Response.json(
      {
        error:
          'Inquiry delivery is not available yet. Nothing has been sent. Your details are still here.',
      },
      { status: 503 },
    );
  }
  try {
    const url = new URL(destination);
    if (url.protocol !== 'https:') throw new Error('HTTPS required');
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(process.env.INQUIRY_WEBHOOK_TOKEN
          ? { Authorization: `Bearer ${process.env.INQUIRY_WEBHOOK_TOKEN}` }
          : {}),
      },
      body: JSON.stringify({ studio: 'VitaNova Creations', ...inquiry }),
      signal: AbortSignal.timeout(12000),
      redirect: 'error',
      cache: 'no-store',
    });
    if (!response.ok) throw new Error('Delivery failed');
    return Response.json({ ok: true });
  } catch {
    return Response.json(
      {
        error:
          'We could not confirm delivery. Please try again in a moment. Your details are still here.',
      },
      { status: 502 },
    );
  }
}
