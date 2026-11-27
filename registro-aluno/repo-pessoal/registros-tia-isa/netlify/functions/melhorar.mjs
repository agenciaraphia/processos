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
// Se um modelo do Gemini estiver lotado, tenta o próximo da lista.
const RESERVAS_GEMINI = ["gemini-3.8-flash", "gemini-3.5-flash", "gemini-2.5-flash", "gemini-flash-latest", "gemini-2.5-flash-lite"];
const LOTADO = new Set([429, 500, 503, 504, 529]);
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

function montarPrompt(ditado, estilo) {
  const comum = `Você é uma coordenadora pedagógica experiente da Educação Infantil no Brasil e vai escrever o texto do "Registro Individual do Aluno" (histórico do desenvolvimento da criança considerando os aspectos social, emocional, psicomotor e cognitivo) a partir das observações da professora. As observações podem ter vindo de voz ou de foto de anotações: podem estar em tópicos, frases soltas, linguagem informal, com erros de reconhecimento e sem pontuação.

REGRA PRINCIPAL — NÃO INVENTAR NADA:
- Toda informação sobre a criança precisa estar nas observações da professora. Não acrescente fatos, comportamentos, situações, momentos da rotina, atividades, conquistas, dificuldades, falas, datas, números, diagnósticos ou opiniões que ela não registrou.
- Não compare a criança com o que é "esperado para a idade" e não use linguagem de diagnóstico.
- Não escreva sobre aspectos que a professora não mencionou. Se ela só falou de dois aspectos, o relatório fala só desses dois.
- Não prometa ações futuras (atividades, encaminhamentos, intervenções) que ela não citou.
- Antes de responder, confira frase por frase: cada afirmação sobre a criança precisa ter origem nas observações. Se não tiver, apague a frase.

FORMA:
- Português do Brasil, terceira pessoa, linguagem formal, clara, acolhedora e respeitosa.
- Corrija erros de reconhecimento de voz, ortografia, concordância e pontuação. Remova repetições, hesitações e marcas de oralidade (né, tipo, aí, daí, então, é...). As palavras "vírgula", "ponto" e "novo parágrafo" ditas pela professora são comandos de pontuação, não conteúdo.
- Organize em parágrafos coesos, quando possível nesta ordem: adaptação e aspecto social; aspecto emocional; aspecto psicomotor; aspecto cognitivo e linguagem; considerações finais. Sem títulos, tópicos, listas, negrito ou markdown.
- Refira-se à criança pelo marcador [NOME] ou como "a criança", respeitando o gênero indicado nas observações (a/o, ela/ele). Mantenha [NOME] exatamente assim, com os colchetes.
- Nunca escreva o nome dos pais ou responsáveis: use sempre "os pais", "a família", "a mãe" ou "o pai". Não copie os marcadores [PAI] ou [MAE] para o texto.`;

  const elaborado = `
COMO DESENVOLVER O TEXTO (estilo: mais elaborado):
- Transforme cada observação curta em frases completas e bem desenvolvidas, com a escrita de um relatório pedagógico, e não apenas uma correção do que foi escrito.
- Contextualize o que foi observado: explique, com vocabulário pedagógico da Educação Infantil, o que aquela observação mostra sobre o desenvolvimento da criança naquele aspecto (por exemplo: interação e convivência, autonomia, expressão de sentimentos, coordenação motora ampla e fina, oralidade, atenção, noções de cores, números e letras). Isso é interpretar o que ela registrou, nunca acrescentar fatos novos.
- Quando fizer sentido, relacione a observação aos campos de experiência da BNCC (O eu, o outro e o nós; Corpo, gestos e movimentos; Traços, sons, cores e formas; Escuta, fala, pensamento e imaginação; Espaços, tempos, quantidades, relações e transformações), de forma natural e sem exagero.
- Ligue as ideias entre si para o texto fluir. Descreva o que ainda está em desenvolvimento de forma positiva ("vem se desenvolvendo", "está em processo"), sem julgamento.
- Comece com um parágrafo de abertura apenas com o que a professora registrou sobre a chegada e a adaptação; se ela não falou disso, comece pelo primeiro aspecto que ela observou.
- Termine com um parágrafo de considerações finais que retome, em síntese, os pontos que ela observou. Só inclua agradecimento ou parceria com a família se ela mencionou.
- Cada aspecto observado deve virar um parágrafo de cerca de 3 a 5 frases, desde que todo o conteúdo venha das observações.`;

  const fiel = `
COMO DESENVOLVER O TEXTO (estilo: próximo do que foi escrito):
- Mantenha o texto próximo das palavras da professora: corrija, pontue, organize em parágrafos e deixe a linguagem formal, sem desenvolver muito além do que ela escreveu.`;

  return `${comum}
${estilo === "fiel" ? fiel : elaborado}

Também identifique nas observações dados de cadastro, SOMENTE se a professora os escreveu claramente.

Observações da professora:
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
    modelos: () => [env("CLAUDE_MODEL") || MODELOS.claude],
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
    modelos: () => [...new Set([env("GEMINI_MODEL"), ...RESERVAS_GEMINI].filter(Boolean))],
    pedir: (prompt, modelo) => fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(modelo)}:streamGenerateContent?alt=sse&key=${encodeURIComponent(env("GEMINI_API_KEY"))}`, {
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

// Gemini: espera a resposta inteira, confere se o texto veio certo e,
// se algo falhar (lotado, vazio, cortado), tenta o próximo modelo.
// Para ler foto: modelos "Lite" primeiro (os mais rápidos), sem a etapa de "pensar".
const MODELOS_FOTO = ["gemini-3.5-flash-lite", "gemini-flash-lite-latest", "gemini-2.5-flash-lite", "gemini-3.5-flash", "gemini-2.5-flash"];
function configGeracao(modelo, rapido) {
  const cfg = { responseMimeType: "application/json", maxOutputTokens: 8192 };
  // Menos "pensamento" = resposta bem mais rápida.
  if (/^gemini-2\.5-flash/.test(modelo)) cfg.thinkingConfig = { thinkingBudget: 0 };
  else if (!rapido && /^gemini-[3-9]/.test(modelo) && !/lite/.test(modelo)) cfg.thinkingConfig = { thinkingLevel: "low" };
  return cfg;
}

async function chamarGemini(partes, valido, modelos = PROVEDORES.gemini.modelos(), rapido = false) {
  const inicio = Date.now();
  let ultimo = null;
  for (const modelo of modelos) {
    const resta = 50000 - (Date.now() - inicio); // a função do Netlify tem até 60 s
    if (resta < 8000) break;
    const ctl = new AbortController();
    const relogio = setTimeout(() => ctl.abort(), resta);
    try {
      const pedir = (cfg) => fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(modelo)}:generateContent?key=${encodeURIComponent(env("GEMINI_API_KEY"))}`, {
        method: "POST",
        signal: ctl.signal,
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ contents: [{ role: "user", parts: partes }], generationConfig: cfg })
      });
      let up;
      try {
        const cfg = configGeracao(modelo, rapido);
        up = await pedir(cfg);
        // se o modelo não aceitar o ajuste de "pensamento", tenta o mesmo modelo sem ele
        if (up.status === 400 && cfg.thinkingConfig) {
          const { thinkingConfig, ...semAjuste } = cfg;
          up = await pedir(semAjuste);
        }
      } catch (e) {
        ultimo = { error: "ia", modelo, message: e?.name === "AbortError" ? "A IA demorou demais para responder." : "Sem conexão com a IA." };
        continue;
      }
      if (!up.ok) {
        ultimo = { ...(await lerErro(up)), modelo };
        if (ultimo.error === "chave_invalida") break;
        continue;
      }
      let data = null;
      try { data = await up.json(); } catch {}
      const cand = data?.candidates?.[0];
      const texto = (cand?.content?.parts || []).filter((p) => !p.thought && typeof p.text === "string").map((p) => p.text).join("");
      try {
        const j = JSON.parse(texto.slice(texto.indexOf("{"), texto.lastIndexOf("}") + 1));
        if (valido(j)) {
          return new Response(JSON.stringify(j), {
            headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "no-store", "x-modelo": modelo }
          });
        }
      } catch {}
      const motivo = cand?.finishReason || data?.promptFeedback?.blockReason || "sem texto";
      ultimo = { error: "ia", modelo, message: `O modelo ${modelo} não devolveu o texto (${motivo}).` };
    } finally {
      clearTimeout(relogio);
    }
  }
  console.error("Gemini falhou:", JSON.stringify(ultimo));
  return json(ultimo || { error: "ia", message: "Nenhum modelo respondeu." }, 502);
}

const relatorioValido = (j) => Array.isArray(j?.paragrafos) && j.paragrafos.some((p) => typeof p === "string" && p.trim());
const transcricaoValida = (j) => typeof j?.texto === "string"; // texto vazio = foto sem nada legível (resposta válida)

const PROMPT_FOTO = `Você vai receber foto(s) de anotações de uma professora de Educação Infantil sobre uma criança (pode ser letra à mão, caderno, folha ou texto impresso).

Transcreva o texto exatamente como está escrito, em português do Brasil, na ordem em que aparece (se houver mais de uma foto, na ordem das fotos).
- Não resuma, não melhore e não invente nada: só transcreva.
- Corrija apenas letras que ficaram claramente borradas, escolhendo a palavra mais provável pelo contexto.
- Se um trecho estiver ilegível, escreva [ilegível].
- Ignore rabiscos, desenhos, margens e textos que não fazem parte das anotações.
- Separe parágrafos com uma linha em branco.

Responda somente com um objeto JSON válido neste formato: {"texto": "o texto transcrito"}
Se não houver texto legível, responda {"texto": ""}.`;

// Claude (opcional): pedido simples, sem streaming, usado para ler fotos
async function chamarClaudeSimples(content, valido) {
  let up;
  try {
    up = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "content-type": "application/json", "x-api-key": env("ANTHROPIC_API_KEY"), "anthropic-version": "2023-06-01" },
      body: JSON.stringify({ model: env("CLAUDE_MODEL") || MODELOS.claude, max_tokens: 4096, messages: [{ role: "user", content }] })
    });
  } catch { return json({ error: "ia", message: "Sem conexão com a IA." }, 502); }
  if (!up.ok) return json(await lerErro(up), 502);
  const data = await up.json().catch(() => null);
  const texto = (data?.content || []).filter((c) => c.type === "text").map((c) => c.text).join("");
  try {
    const j = JSON.parse(texto.slice(texto.indexOf("{"), texto.lastIndexOf("}") + 1));
    if (valido(j)) return new Response(JSON.stringify(j), { headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "no-store" } });
  } catch {}
  return json({ error: "ia", message: "A IA não devolveu o texto da foto." }, 502);
}

const FOTO_TIPOS = new Set(["image/jpeg", "image/png", "image/webp"]);
const FOTO_MAX = 4;                 // fotos por pedido
const FOTO_TAMANHO = 3_000_000;     // caracteres de base64 por foto (~2,2 MB)

async function transcreverFotos(ia, body) {
  const fotos = Array.isArray(body?.imagens) ? body.imagens : [];
  if (!fotos.length) return json({ error: "vazio", message: "Nenhuma foto enviada." }, 400);
  if (fotos.length > FOTO_MAX) return json({ error: "grande", message: `Envie no máximo ${FOTO_MAX} fotos por vez.` }, 413);
  for (const f of fotos) {
    if (!f || !FOTO_TIPOS.has(f.mime) || typeof f.data !== "string" || !f.data || f.data.length > FOTO_TAMANHO) {
      return json({ error: "grande", message: "Foto em formato não aceito ou grande demais." }, 413);
    }
  }
  if (ia === "gemini") {
    const fotoModelos = [...new Set([env("GEMINI_MODEL_FOTO"), ...MODELOS_FOTO].filter(Boolean))];
    return chamarGemini([{ text: PROMPT_FOTO }, ...fotos.map((f) => ({ inline_data: { mime_type: f.mime, data: f.data } }))], transcricaoValida, fotoModelos, true);
  }
  return chamarClaudeSimples([
    ...fotos.map((f) => ({ type: "image", source: { type: "base64", media_type: f.mime, data: f.data } })),
    { type: "text", text: PROMPT_FOTO }
  ], transcricaoValida);
}

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

  // Foto das anotações: a IA só transcreve o texto
  if (body?.acao === "transcrever") return transcreverFotos(ia, body);

  const ditado = String(body?.ditado || "").trim();
  if (!ditado) return json({ error: "vazio" }, 400);
  if (ditado.length > LIMITE_DITADO) return json({ error: "grande" }, 413);

  // Só o texto do relato vai para a IA; os dados de cadastro ficam no site.
  const estilo = body?.estilo === "fiel" ? "fiel" : "elaborado";
  const prompt = montarPrompt(ditado, estilo);
  if (ia === "gemini") return chamarGemini([{ text: prompt }], relatorioValido);
  const prov = PROVEDORES[ia];

  let up = null, ultimoErro = null;
  for (const modelo of prov.modelos()) {
    try { up = await prov.pedir(prompt, modelo); } catch { up = null; ultimoErro = { error: "ia", message: "Sem conexão com a IA." }; continue; }
    if (up.ok && up.body) break;
    ultimoErro = await lerErro(up);
    // modelo lotado ou inexistente: tenta o próximo; chave recusada: para na hora
    if (ultimoErro.error === "chave_invalida" || !(LOTADO.has(up.status) || up.status === 404)) break;
    up = null;
  }
  if (!up || !up.ok || !up.body) return json(ultimoErro || { error: "ia" }, 502);

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
