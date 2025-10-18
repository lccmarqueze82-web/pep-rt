export const config = { runtime: 'edge' };

export default async function handler(req) {
  if (req.method !== 'POST')
    return new Response('Method not allowed', { status: 405 });

  const { input, instructions } = await req.json();

  const sys = `Você é um assistente clínico.
- Avalie coerência, riscos e red flags.
- Sugira exames e condutas, se indicado.
- Nunca invente dados; use [revisar] para lacunas.
- Seja conciso e objetivo.`;

  const payload = {
    model: 'gpt-4o-mini',
    stream: true,
    messages: [
      { role: 'system', content: sys },
      { role: 'user', content: `${instructions}\n\nTEXTO:\n${input}` }
    ]
  };

  const resp = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
    },
    body: JSON.stringify(payload)
  });

  if (!resp.ok || !resp.body) {
    return new Response('Erro na OpenAI', { status: 500 });
  }

  return new Response(resp.body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'no-cache'
    }
  });
}