export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  try {
    const { texto } = await req.json();
    if (!texto) return res.status(400).json({ error: "Texto ausente" });

    const resposta = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "Você é um médico assistente que analisa texto clínico." },
          { role: "user", content: texto }
        ]
      })
    });

    const data = await resposta.json();
    return res.status(200).json({ analise: data.choices[0].message.content });
  } catch (err) {
    console.error("Erro:", err);
    return res.status(500).json({ error: "Erro interno no servidor" });
  }
}
