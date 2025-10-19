export const config = { runtime: 'edge' };

export default async function handler(req) {
  if (req.method !== 'POST') 
    return new Response('Method not allowed', { status: 405 });

  const { input, instructions } = await req.json();

  const sys = "Você organiza texto clínico no formato SOAP curto. Não invente dados. Marque dúvidas como [revisar].";

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

  // Envia a resposta da IA em tempo real para o navegador
  return new Response(resp.body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'no-cache'
    }
  });
}