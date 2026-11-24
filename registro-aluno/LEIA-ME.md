# Registro Viva Criança

Página que transforma o que a professora **fala** sobre cada criança no
**Registro Individual do Aluno** em Word (.docx), usando o modelo da escola
(cabeçalho, Calibri 12, campos e assinaturas).

## Como funciona
1. **Dados da criança**: nome, nascimento (a idade é calculada), sexo, NEE, ingresso, pais, contato.
2. **Conte como a criança está**: toque no microfone e fale. Diga "vírgula", "ponto", "novo parágrafo".
3. **Melhorar o texto**: o Claude corrige, organiza em parágrafos (social, emocional, psicomotor, cognitivo) sem inventar fatos, e ainda preenche campos que foram ditos.
4. **Baixar documento Word**: gera `Registro Individual - NOME.docx`.

Cada aluno fica salvo no próprio aparelho em "Meus alunos".

## Melhoria do texto (IA)
- Dentro do claude.ai (Artifact): usa a conta Claude de quem está usando.
- Fora dele (ex.: GitHub Pages): ⚙️ Configurações → colar uma chave da API da Anthropic (fica só naquele navegador).
- Sem nenhum dos dois: faz uma correção simples (pontuação e maiúsculas).

## Voz
Chrome/Edge (computador e Android) e Safari reconhecem português pelo microfone da página.
Se o microfone da página não estiver disponível, use o microfone do teclado do celular na caixa de texto.

## Editar
Edite `src/app.html` (ou troque `src/modelo.docx`) e rode:

    python3 registro-aluno/build.py

Isso gera `index.html` com o modelo embutido.
