export const config = { runtime: 'edge' };

export default async function handler(req) {
  if (req.method !== 'POST') 
    return new Response('Method not allowed', { status: 405 });

  try {
    const { input } = await req.json();
    const sys = "Você é um assistente médico que faz uma análise clínica resumida do texto do prontuário.";

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        stream: true,
        messages: [
          { role: "system", content: sys },
          { role: "user", content: input }
        ],
      }),
    });

    if (!response.ok || !response.body) {
      return new Response("Erro na OpenAI", { status: 500 });
    }

    return new Response(response.body, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });

  } catch (err) {
    return new Response("Erro interno no servidor", { status: 500 });
  }
}
