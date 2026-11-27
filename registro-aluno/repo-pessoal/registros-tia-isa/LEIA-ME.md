# Registros da Tia Isa

Site para a professora falar sobre cada criança, a IA arrumar o texto e baixar o
Registro Individual do Aluno em Word, no modelo da escola.

## O que tem aqui
- `index.html`: o site inteiro (o modelo do Word já está dentro).
- `netlify/edge-functions/ia.js`: a conexão com a IA (principal). Roda no servidor do
  Netlify, responde na hora e espera a IA escrever sem limite curto de tempo. Usa a chave
  guardada no painel do Netlify. A chave **nunca** fica neste repositório.
- `netlify/functions/melhorar.mjs`: a conexão antiga, usada só se a de cima não estiver publicada.
- `netlify.toml`: diz ao Netlify onde está o site e a função.

## Publicar no Netlify (uma vez)
1. Netlify > Add new project > Import an existing project > GitHub > escolha este repositório.
2. Deixe Base directory, Build command e Publish directory em branco. Clique em Deploy.
3. Project configuration > Environment variables > Add a variable:
   - Key: `GEMINI_API_KEY` | Contains secret values: desmarcado | All scopes |
     Same value for all deploy contexts | Value: a chave do Gemini (aistudio.google.com/apikey)
4. Deploys > Trigger deploy > Deploy project.
5. Abra o site: no passo 3 deve aparecer "Gemini conectado ao site".

Opcionais: `APP_SENHA` (pede uma senha uma vez por aparelho), `IA` (gemini ou claude),
`ANTHROPIC_API_KEY` (para usar o Claude), `GEMINI_MODEL`, `CLAUDE_MODEL`.

## Privacidade
- Para a IA vai só o texto do relato, com o nome da criança trocado por [NOME].
- Os dados de cadastro e os alunos salvos ficam só no navegador do aparelho.
- Os pais nunca aparecem pelo nome no relatório.
