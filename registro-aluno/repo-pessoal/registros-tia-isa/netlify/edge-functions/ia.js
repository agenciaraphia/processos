// Registros da Tia Isa — conexão com a IA (Edge Function do Netlify).
// A chave fica só no Netlify (Environment variables) e nunca vai para o navegador.
// Responde na hora e mantém a conexão viva enquanto a IA escreve, então não
// esbarra no limite de tempo das funções comuns.
//
// Variáveis (Netlify > Project configuration > Environment variables). Cadastre UMA das chaves:
//   GEMINI_API_KEY     chave do Google AI Studio (Gemini)
//   ANTHROPIC_API_KEY  chave da Anthropic (Claude)
//   APP_SENHA          (opcional) senha pedida uma vez por aparelho
//   IA                 (opcional) "gemini" ou "claude", se as duas chaves existirem
//   GEMINI_MODEL / GEMINI_MODEL_FOTO / CLAUDE_MODEL  (opcionais)

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

const PROMPT_FOTO = `Você vai receber foto(s) de anotações de uma professora de Educação Infantil sobre uma criança (pode ser letra à mão, caderno, folha ou texto impresso).

Transcreva o texto exatamente como está escrito, em português do Brasil, na ordem em que aparece (se houver mais de uma foto, na ordem das fotos).
- Não resuma, não melhore e não invente nada: só transcreva.
- Corrija apenas letras que ficaram claramente borradas, escolhendo a palavra mais provável pelo contexto.
- Se um trecho estiver ilegível, escreva [ilegível].
- Ignore rabiscos, desenhos, margens e textos que não fazem parte das anotações.
- Separe parágrafos com uma linha em branco.

Responda somente com um objeto JSON válido neste formato: {"texto": "o texto transcrito"}
Se não houver texto legível, responda {"texto": ""}.`;

// ---------------------------------------------------------------------------
// Modelos e ajustes
// ---------------------------------------------------------------------------
const MODELOS_TEXTO = ["gemini-3.8-flash", "gemini-3.5-flash", "gemini-2.5-flash", "gemini-flash-latest", "gemini-2.5-flash-lite"];
const MODELOS_FOTO = ["gemini-3.5-flash-lite", "gemini-flash-lite-latest", "gemini-2.5-flash-lite", "gemini-3.5-flash", "gemini-2.5-flash"];
const CLAUDE_PADRAO = "claude-sonnet-5-5";
const NOMES = { claude: "Claude", gemini: "Gemini" };
const LIMITE_DITADO = 15000;
const FOTO_TIPOS = new Set(["image/jpeg", "image/png", "image/webp"]);
const FOTO_MAX = 4;
const FOTO_TAMANHO = 3_000_000;
const TEMPO_TOTAL = 110_000;    // ms: quanto o site espera no máximo, somando as tentativas
const TEMPO_MODELO = 60_000;    // ms: quanto espera cada modelo

function env(k) {
  try { return String(globalThis.Netlify?.env?.get?.(k) ?? globalThis.Deno?.env?.get?.(k) ?? globalThis.process?.env?.[k] ?? "").trim(); }
  catch { return ""; }
}
function escolherIA() {
  const pedida = env("IA").toLowerCase();
  if (pedida === "gemini" && env("GEMINI_API_KEY")) return "gemini";
  if (pedida === "claude" && env("ANTHROPIC_API_KEY")) return "claude";
  if (env("GEMINI_API_KEY")) return "gemini";
  if (env("ANTHROPIC_API_KEY")) return "claude";
  return "";
}
function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), { status, headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" } });
}
function iguais(a, b) {
  const x = new TextEncoder().encode(String(a)), y = new TextEncoder().encode(String(b));
  let d = x.length ^ y.length;
  for (let i = 0; i < Math.max(x.length, y.length); i++) d |= (x[i] || 0) ^ (y[i] || 0);
  return d === 0;
}
function lerJson(texto) {
  const a = texto.indexOf("{"), b = texto.lastIndexOf("}");
  if (a < 0 || b < a) return null;
  try { return JSON.parse(texto.slice(a, b + 1)); } catch { return null; }
}
async function lerErro(up) {
  let message = "";
  try { const j = await up.json(); message = j.error?.message || ""; } catch {}
  const chaveRuim = up.status === 401 || up.status === 403 || /api key/i.test(message);
  const error = chaveRuim ? "chave_invalida" : [429, 503, 529].includes(up.status) ? "limite" : "ia";
  return { error, status: up.status, message };
}
const relatorioValido = (j) => Array.isArray(j?.paragrafos) && j.paragrafos.some((p) => typeof p === "string" && p.trim());
const transcricaoValida = (j) => typeof j?.texto === "string";

function configGeracao(modelo, foto) {
  const cfg = { responseMimeType: "application/json", maxOutputTokens: 8192 };
  if (/^gemini-2\.5-flash/.test(modelo)) cfg.thinkingConfig = { thinkingBudget: 0 };
  else if (!foto && /^gemini-[3-9]/.test(modelo) && !/lite/.test(modelo)) cfg.thinkingConfig = { thinkingLevel: "low" };
  return cfg;
}

// Gemini: tenta os modelos em ordem até um devolver um texto válido.
async function gemini(partes, valido, foto) {
  const lista = [...new Set([env(foto ? "GEMINI_MODEL_FOTO" : "GEMINI_MODEL"), ...(foto ? MODELOS_FOTO : MODELOS_TEXTO)].filter(Boolean))];
  const inicio = Date.now();
  let ultimo = null;
  for (const modelo of lista) {
    const resta = TEMPO_TOTAL - (Date.now() - inicio);
    if (resta < 5000) break;
    const ctl = new AbortController();
    const relogio = setTimeout(() => ctl.abort(), Math.min(TEMPO_MODELO, resta));
    const pedir = (cfg) => fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(modelo)}:generateContent?key=${encodeURIComponent(env("GEMINI_API_KEY"))}`,
      { method: "POST", signal: ctl.signal, headers: { "content-type": "application/json" },
        body: JSON.stringify({ contents: [{ role: "user", parts: partes }], generationConfig: cfg }) });
    try {
      const cfg = configGeracao(modelo, foto);
      let up = await pedir(cfg);
      if (up.status === 400 && cfg.thinkingConfig) {      // modelo não aceitou o ajuste: tenta sem ele
        const { thinkingConfig, ...semAjuste } = cfg;
        up = await pedir(semAjuste);
      }
      if (!up.ok) {
        ultimo = { ...(await lerErro(up)), modelo };
        if (ultimo.error === "chave_invalida") break;
        continue;
      }
      const data = await up.json().catch(() => null);
      const cand = data?.candidates?.[0];
      const texto = (cand?.content?.parts || []).filter((p) => !p.thought && typeof p.text === "string").map((p) => p.text).join("");
      const j = lerJson(texto);
      if (j && valido(j)) return { ...j, _modelo: modelo };
      ultimo = { error: "ia", modelo, message: `O modelo ${modelo} não devolveu o texto (${cand?.finishReason || data?.promptFeedback?.blockReason || "sem texto"}).` };
    } catch (e) {
      ultimo = { error: "ia", modelo, message: e?.name === "AbortError" ? "A IA demorou demais para responder." : "Sem conexão com a IA." };
    } finally {
      clearTimeout(relogio);
    }
  }
  return ultimo || { error: "ia", message: "Nenhum modelo respondeu." };
}

// Claude (opcional)
async function claude(content, valido) {
  try {
    const up = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "content-type": "application/json", "x-api-key": env("ANTHROPIC_API_KEY"), "anthropic-version": "2023-06-01" },
      body: JSON.stringify({ model: env("CLAUDE_MODEL") || CLAUDE_PADRAO, max_tokens: 4096, messages: [{ role: "user", content }] })
    });
    if (!up.ok) return await lerErro(up);
    const data = await up.json().catch(() => null);
    const texto = (data?.content || []).filter((c) => c.type === "text").map((c) => c.text).join("");
    const j = lerJson(texto);
    if (j && valido(j)) return j;
    return { error: "ia", message: "A IA não devolveu o texto." };
  } catch {
    return { error: "ia", message: "Sem conexão com a IA." };
  }
}

// Responde na hora e mantém a conexão viva enquanto a IA trabalha;
// no fim manda o resultado (ou o erro) em JSON.
function respostaAoVivo(trabalho) {
  const enc = new TextEncoder();
  const stream = new ReadableStream({
    async start(ctrl) {
      ctrl.enqueue(enc.encode(" "));
      const vivo = setInterval(() => { try { ctrl.enqueue(enc.encode(" ")); } catch {} }, 4000);
      let saida;
      try { saida = await trabalho(); } catch { saida = { error: "ia", message: "Erro inesperado no servidor." }; }
      clearInterval(vivo);
      try { ctrl.enqueue(enc.encode(JSON.stringify(saida))); ctrl.close(); } catch {}
    }
  });
  return new Response(stream, { headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "no-store", "x-content-type-options": "nosniff" } });
}

export default async (req) => {
  const ia = escolherIA();
  const senha = env("APP_SENHA");
  if (req.method === "GET") return json({ ok: true, chave: !!ia, senha: !!senha, ia: NOMES[ia] || "", versao: 2 });
  if (req.method !== "POST") return json({ error: "metodo" }, 405);
  if (!ia) return json({ error: "sem_chave" }, 503);

  let body;
  try { body = await req.json(); } catch { return json({ error: "pedido" }, 400); }
  if (senha && !iguais(body?.senha || "", senha)) return json({ error: "senha" }, 401);

  // Foto das anotações: só transcrever
  if (body?.acao === "transcrever") {
    const fotos = Array.isArray(body?.imagens) ? body.imagens : [];
    if (!fotos.length) return json({ error: "vazio", message: "Nenhuma foto enviada." }, 400);
    if (fotos.length > FOTO_MAX) return json({ error: "grande", message: `Envie no máximo ${FOTO_MAX} fotos por vez.` }, 413);
    for (const f of fotos) {
      if (!f || !FOTO_TIPOS.has(f.mime) || typeof f.data !== "string" || !f.data || f.data.length > FOTO_TAMANHO) {
        return json({ error: "grande", message: "Foto em formato não aceito ou grande demais." }, 413);
      }
    }
    return respostaAoVivo(() => ia === "gemini"
      ? gemini([{ text: PROMPT_FOTO }, ...fotos.map((f) => ({ inline_data: { mime_type: f.mime, data: f.data } }))], transcricaoValida, true)
      : claude([...fotos.map((f) => ({ type: "image", source: { type: "base64", media_type: f.mime, data: f.data } })), { type: "text", text: PROMPT_FOTO }], transcricaoValida));
  }

  // Relatório: só o texto do relato vai para a IA
  const ditado = String(body?.ditado || "").trim();
  if (!ditado) return json({ error: "vazio" }, 400);
  if (ditado.length > LIMITE_DITADO) return json({ error: "grande" }, 413);
  const prompt = montarPrompt(ditado, body?.estilo === "fiel" ? "fiel" : "elaborado");
  return respostaAoVivo(() => ia === "gemini" ? gemini([{ text: prompt }], relatorioValido, false) : claude(prompt, relatorioValido));
};

export const config = { path: "/api/ia" };
