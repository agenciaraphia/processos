// Registro Viva Criança — conexão segura com a IA (Claude ou Gemini).
// A chave fica só no Netlify (variável de ambiente) e nunca vai para o navegador.
// A página chama /api/melhorar; esta função monta o pedido, fala com a IA e devolve o texto aos poucos.
//
// Variáveis de ambiente (Netlify > Site configuration > Environment variables). Cadastre UMA das chaves:
//   GEMINI_API_KEY     chave do Google AI Studio (Gemini)
//   ANTHROPIC_API_KEY  chave da Anthropic (Claude)
//   APP_SENHA          (recomendada) senha que a professora digita uma vez em cada aparelho
//   IA                 (opcional) "gemini" ou "claude", se as duas chaves estiverem cadastradas
//   GEMINI_MODEL       (opcional) padrão gemini-3.8-flash
//   CLAUDE_MODEL       (opcional) padrão claude-sonnet-5-5

const MODELOS = { claude: "claude-sonnet-5-5", gemini: "gemini-3.8-flash" };
const NOMES = { claude: "Claude", gemini: "Gemini" };
const LIMITE_DITADO = 15000; // caracteres

const env = (k) => (globalThis.Netlify?.env?.get?.(k) ?? process.env[k] ?? "").trim();

function escolherIA() {
  const pedida = env("IA").toLowerCase();
  if (pedida === "gemini" && env("GEMINI_API_KEY")) return "gemini";
  if (pedida === "claude" && env("ANTHROPIC_API_KEY")) return "claude";
  if (env("GEMINI_API_KEY")) return "gemini";
  if (env("ANTHROPIC_API_KEY")) return "claude";
  return "";
}

function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" }
  });
}

function iguais(a, b) {
  // comparação em tempo constante para a senha
  const x = new TextEncoder().encode(String(a)), y = new TextEncoder().encode(String(b));
  let d = x.length ^ y.length;
  for (let i = 0; i < Math.max(x.length, y.length); i++) d |= (x[i] || 0) ^ (y[i] || 0);
  return d === 0;
}

function montarPrompt(ditado) {
  return `Você é uma coordenadora pedagógica experiente da Educação Infantil no Brasil. Uma professora ditou por voz as observações sobre uma criança para o documento "Registro Individual do Aluno" (histórico do desenvolvimento da criança considerando os aspectos social, emocional, psicomotor e cognitivo). O ditado veio de reconhecimento de voz e pode ter erros, palavras trocadas e falta de pontuação.

Sua tarefa:
1. Reescrever o ditado como o texto do relatório, em português do Brasil, com linguagem formal, clara e acolhedora, na terceira pessoa.
2. Corrigir erros de reconhecimento de voz, ortografia, concordância e pontuação. Remover repetições, hesitações e marcas de oralidade (né, tipo, aí, daí, então, é...). Palavras como "vírgula", "ponto" e "novo parágrafo" ditas pela professora são comandos de pontuação, não conteúdo.
3. Manter TODOS os fatos e observações da professora, com o mesmo sentido. Não inventar comportamentos, diagnósticos, datas, conquistas ou dificuldades que ela não disse.
4. Organizar em parágrafos coesos (normalmente de 3 a 6), seguindo quando possível esta ordem: adaptação e aspecto social; aspecto emocional; aspecto psicomotor; aspecto cognitivo e linguagem; considerações finais ou encaminhamentos (somente se ela mencionou). Não escreva títulos, tópicos, listas, negrito nem markdown.
5. Usar vocabulário pedagógico adequado à Educação Infantil (interação, autonomia, coordenação motora fina e ampla, oralidade, linguagem, campos de experiência), sem exageros e sem frases genéricas que não estejam apoiadas no ditado.
6. Referir-se à criança pelo marcador [NOME] ou como "a criança", respeitando o gênero.
7. Por privacidade, o nome da criança foi trocado pelo marcador [NOME]. Mantenha [NOME] exatamente assim, com os colchetes, e não tente adivinhar o nome verdadeiro.
8. Nunca escreva o nome dos pais ou responsáveis. Refira-se a eles sempre de forma geral: "os pais", "a família", "a mãe", "o pai". Se aparecerem os marcadores [PAI] ou [MAE] no ditado, não os copie para o texto.

Também identifique no ditado dados de cadastro, SOMENTE se a professora os disse claramente.

Ditado da professora:
"""
${ditado}
"""

Responda somente com um objeto JSON válido, sem nenhum texto antes ou depois, neste formato:
{"paragrafos": ["primeiro parágrafo", "segundo parágrafo"], "campos": {"nome": null, "dataNascimento": null, "idade": null, "sexo": null, "nee": null, "tipoNee": null, "ingresso": null, "nomePai": null, "nomeMae": null, "telefone": null}}
Regras dos campos: use null quando a informação não foi dita; dataNascimento no formato DD/MM/AAAA; sexo "Feminino" ou "Masculino"; nee "Sim" ou "Não"; telefone só com números.`;
}

// Cada IA: como pedir e como tirar o texto de cada evento do streaming.
const PROVEDORES = {
  claude: {
    pedir: (prompt) => fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "content-type": "application/json", "x-api-key": env("ANTHROPIC_API_KEY"), "anthropic-version": "2023-06-01" },
      body: JSON.stringify({
        model: env("CLAUDE_MODEL") || MODELOS.claude,
        max_tokens: 4096,
        stream: true,
        messages: [{ role: "user", content: prompt }]
      })
    }),
    texto: (ev) => (ev.type === "content_block_delta" && ev.delta?.type === "text_delta" ? ev.delta.text : ""),
    erro: (ev) => ev.type === "error"
  },
  gemini: {
    pedir: (prompt) => fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(env("GEMINI_MODEL") || MODELOS.gemini)}:streamGenerateContent?alt=sse&key=${encodeURIComponent(env("GEMINI_API_KEY"))}`, {
      method: "POST",
      // a chave vai no endereço (?key=), que funciona com os formatos novos (AQ.) e antigos (AIza)
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: "application/json", maxOutputTokens: 8192 }
      })
    }),
    texto: (ev) => (ev.candidates?.[0]?.content?.parts || []).filter((p) => !p.thought && typeof p.text === "string").map((p) => p.text).join(""),
    erro: (ev) => !!ev.error
  }
};

async function lerErro(up) {
  let message = "";
  try { const j = await up.json(); message = j.error?.message || ""; } catch {}
  const chaveRuim = up.status === 401 || up.status === 403 || /api key/i.test(message);
  const error = chaveRuim ? "chave_invalida" : up.status === 429 || up.status === 529 || up.status === 503 ? "limite" : "ia";
  return { error, status: up.status, message };
}

export default async (req) => {
  const ia = escolherIA();
  const senha = env("APP_SENHA");

  // A página pergunta se a IA está conectada (nunca devolve a chave).
  if (req.method === "GET") return json({ ok: true, chave: !!ia, senha: !!senha, ia: NOMES[ia] || "" });
  if (req.method !== "POST") return json({ error: "metodo" }, 405);
  if (!ia) return json({ error: "sem_chave" }, 503);

  let body;
  try { body = await req.json(); } catch { return json({ error: "pedido" }, 400); }
  if (senha && !iguais(body?.senha || "", senha)) return json({ error: "senha" }, 401);

  const ditado = String(body?.ditado || "").trim();
  if (!ditado) return json({ error: "vazio" }, 400);
  if (ditado.length > LIMITE_DITADO) return json({ error: "grande" }, 413);

  // Só o texto do relato vai para a IA; os dados de cadastro ficam no site.
  const prompt = montarPrompt(ditado);
  const prov = PROVEDORES[ia];

  let up;
  try { up = await prov.pedir(prompt); } catch { return json({ error: "ia", message: "Sem conexão com a IA." }, 502); }
  if (!up.ok || !up.body) return json(await lerErro(up), 502);

  // Repassa só o texto gerado, aos poucos, para a página.
  const enc = new TextEncoder(), dec = new TextDecoder();
  const stream = new ReadableStream({
    async start(ctrl) {
      const reader = up.body.getReader();
      let buf = "";
      const linha = (raw) => {
        const line = raw.trim();
        if (!line.startsWith("data:")) return;
        let ev;
        try { ev = JSON.parse(line.slice(5)); } catch { return; }
        if (prov.erro(ev)) { ctrl.enqueue(enc.encode("\n[[ERRO]]")); return; }
        const t = prov.texto(ev);
        if (t) ctrl.enqueue(enc.encode(t));
      };
      try {
        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          buf += dec.decode(value, { stream: true });
          let i;
          while ((i = buf.indexOf("\n")) >= 0) { linha(buf.slice(0, i)); buf = buf.slice(i + 1); }
        }
        if (buf) linha(buf);
      } catch {
        ctrl.enqueue(enc.encode("\n[[ERRO]]"));
      }
      ctrl.close();
    }
  });
  return new Response(stream, {
    headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "no-store", "x-content-type-options": "nosniff" }
  });
};

export const config = { path: "/api/melhorar" };
