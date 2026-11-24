// Registro Viva Criança — conexão segura com o Claude.
// A chave fica só no Netlify (variável de ambiente ANTHROPIC_API_KEY) e nunca vai para o navegador.
// A página chama /api/melhorar; esta função monta o pedido, fala com o Claude e devolve o texto aos poucos.
//
// Variáveis de ambiente (Netlify > Site configuration > Environment variables):
//   ANTHROPIC_API_KEY  (obrigatória) chave da API da Anthropic
//   APP_SENHA          (recomendada) senha que a professora digita uma vez em cada aparelho
//   CLAUDE_MODEL       (opcional)    modelo; padrão claude-sonnet-5-5

const MODELO_PADRAO = "claude-sonnet-5-5";
const LIMITE_DITADO = 15000; // caracteres

const env = (k) => (globalThis.Netlify?.env?.get?.(k) ?? process.env[k] ?? "").trim();

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

const limpar = (v) => String(v || "").replace(/\s+/g, " ").trim().slice(0, 120);

function montarPrompt(ditado, c) {
  const conhecidos = [
    c.nome && `Nome: ${c.nome}`,
    c.sexo && `Sexo: ${c.sexo}`,
    c.idade && `Idade: ${c.idade}`,
    c.nee && `Possui NEE: ${c.nee}`
  ].filter(Boolean).join("\n") || "(nenhum)";
  return `Você é uma coordenadora pedagógica experiente da Educação Infantil no Brasil. Uma professora ditou por voz as observações sobre uma criança para o documento "Registro Individual do Aluno" (histórico do desenvolvimento da criança considerando os aspectos social, emocional, psicomotor e cognitivo). O ditado veio de reconhecimento de voz e pode ter erros, palavras trocadas e falta de pontuação.

Sua tarefa:
1. Reescrever o ditado como o texto do relatório, em português do Brasil, com linguagem formal, clara e acolhedora, na terceira pessoa.
2. Corrigir erros de reconhecimento de voz, ortografia, concordância e pontuação. Remover repetições, hesitações e marcas de oralidade (né, tipo, aí, daí, então, é...). Palavras como "vírgula", "ponto" e "novo parágrafo" ditas pela professora são comandos de pontuação, não conteúdo.
3. Manter TODOS os fatos e observações da professora, com o mesmo sentido. Não inventar comportamentos, diagnósticos, datas, conquistas ou dificuldades que ela não disse.
4. Organizar em parágrafos coesos (normalmente de 3 a 6), seguindo quando possível esta ordem: adaptação e aspecto social; aspecto emocional; aspecto psicomotor; aspecto cognitivo e linguagem; considerações finais ou encaminhamentos (somente se ela mencionou). Não escreva títulos, tópicos, listas, negrito nem markdown.
5. Usar vocabulário pedagógico adequado à Educação Infantil (interação, autonomia, coordenação motora fina e ampla, oralidade, linguagem, campos de experiência), sem exageros e sem frases genéricas que não estejam apoiadas no ditado.
6. Referir-se à criança pelo primeiro nome ou como "a criança", respeitando o gênero.

Também identifique no ditado dados de cadastro, SOMENTE se a professora os disse claramente.

Dados já preenchidos no formulário:
${conhecidos}

Ditado da professora:
"""
${ditado}
"""

Responda somente com um objeto JSON válido, sem nenhum texto antes ou depois, neste formato:
{"paragrafos": ["primeiro parágrafo", "segundo parágrafo"], "campos": {"nome": null, "dataNascimento": null, "idade": null, "sexo": null, "nee": null, "tipoNee": null, "ingresso": null, "nomePai": null, "nomeMae": null, "telefone": null}}
Regras dos campos: use null quando a informação não foi dita; dataNascimento no formato DD/MM/AAAA; sexo "Feminino" ou "Masculino"; nee "Sim" ou "Não"; telefone só com números.`;
}

export default async (req) => {
  const chave = env("ANTHROPIC_API_KEY");
  const senha = env("APP_SENHA");

  // A página pergunta se o Claude está conectado (nunca devolve a chave).
  if (req.method === "GET") return json({ ok: true, chave: !!chave, senha: !!senha });
  if (req.method !== "POST") return json({ error: "metodo" }, 405);
  if (!chave) return json({ error: "sem_chave" }, 503);

  let body;
  try { body = await req.json(); } catch { return json({ error: "pedido" }, 400); }
  if (senha && !iguais(body?.senha || "", senha)) return json({ error: "senha" }, 401);

  const ditado = String(body?.ditado || "").trim();
  if (!ditado) return json({ error: "vazio" }, 400);
  if (ditado.length > LIMITE_DITADO) return json({ error: "grande" }, 413);

  const c = body?.conhecidos || {};
  const prompt = montarPrompt(ditado, { nome: limpar(c.nome), sexo: limpar(c.sexo), idade: limpar(c.idade), nee: limpar(c.nee) });

  let up;
  try {
    up = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "content-type": "application/json", "x-api-key": chave, "anthropic-version": "2023-06-01" },
      body: JSON.stringify({
        model: env("CLAUDE_MODEL") || MODELO_PADRAO,
        max_tokens: 4096,
        stream: true,
        messages: [{ role: "user", content: prompt }]
      })
    });
  } catch {
    return json({ error: "claude", message: "Sem conexão com o Claude." }, 502);
  }

  if (!up.ok || !up.body) {
    let message = "";
    try { message = (await up.json()).error?.message || ""; } catch {}
    const error = up.status === 401 || up.status === 403 ? "chave_invalida"
      : up.status === 429 || up.status === 529 ? "limite" : "claude";
    return json({ error, status: up.status, message }, 502);
  }

  // Repassa só o texto gerado, aos poucos, para a página.
  const enc = new TextEncoder(), dec = new TextDecoder();
  const stream = new ReadableStream({
    async start(ctrl) {
      const reader = up.body.getReader();
      let buf = "";
      try {
        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          buf += dec.decode(value, { stream: true });
          let i;
          while ((i = buf.indexOf("\n")) >= 0) {
            const line = buf.slice(0, i).trim();
            buf = buf.slice(i + 1);
            if (!line.startsWith("data:")) continue;
            let ev;
            try { ev = JSON.parse(line.slice(5)); } catch { continue; }
            if (ev.type === "content_block_delta" && ev.delta?.type === "text_delta") ctrl.enqueue(enc.encode(ev.delta.text));
            else if (ev.type === "error") ctrl.enqueue(enc.encode("\n[[ERRO]]"));
          }
        }
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
