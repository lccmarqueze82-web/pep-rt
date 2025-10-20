export const config = { runtime: "edge" };

export default async function handler(req) {
  if (req.method !== "POST") {
    return new Response("Método não permitido", { status: 405 });
  }

  try {
    const { texto } = await req.json();
    if (!texto) {
      return new Response(
        JSON.stringify({ error: "Texto ausente" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const sys = "Você é um médico assistente que analisa texto clínico e retorna insights concisos e úteis.";
    const payload = {
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: sys },
        { role: "user", content: texto }
      ]
    };

    const resp = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify(payload)
    });

    if (!resp.ok) {
      const errText = await resp.text();
      return new Response(
        JSON.stringify({ error: "Erro na API OpenAI", details: errText }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    const data = await resp.json();
    const content = data?.choices?.[0]?.message?.content || "[sem resposta da IA]";

    return new Response(
      JSON.stringify({ analise: content }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: "Erro interno no servidor", details: err.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
