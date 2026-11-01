# Calotim, MVP 0.9

Dividir ficou fácil. Organiza contas e divide despesas entre pessoas. O Calotim calcula e organiza, e não movimenta dinheiro: nenhum Pix, cartão ou cobrança passa por ele.

## Como usar
1. Extraia a pasta e abra `index.html` no navegador.
2. Crie uma divisão, adicione as pessoas e lance os itens.
3. Inclua taxa de serviço, couvert ou descontos em **Taxas e descontos**.
4. Exporte o extrato (**Salvar como PDF** na janela de impressão) ou o extrato individual de cada pessoa.
5. Use **Ctrl + K** (ou **Cmd + K** no Mac) para buscar divisões e executar ações sem tirar a mão do teclado.

Para compartilhar um extrato por link, o site precisa estar publicado em HTTP/HTTPS (por exemplo Cloudflare Pages ou GitHub Pages).

## Testes
Precisa apenas do Node.js 18 ou mais novo.

```
npm test
```

## Estrutura
- `index.html`, `css/styles.css`, interface.
- `js/core.js`, regras de cálculo (centavos inteiros, sem acesso à tela).
- `js/app.js`, telas e eventos.
- `js/avatars.js`, os 16 personagens dos avatares em SVG e a conversão dos emojis antigos.
- Ícones: Lucide embutidos como sprite SVG no `index.html` (licença ISC em `LICENSE-lucide.txt`).
- `_headers`, cabeçalhos de segurança para Cloudflare Pages (outras hospedagens: replique os mesmos cabeçalhos).
- `PRODUCT.md` e `DESIGN.md`, registro do produto e do sistema visual.
- `tests/core.test.js`, testes automatizados do cálculo.
- `supabase/schema.sql`, estrutura do banco para a próxima etapa (B2C com RLS pronta, B2B só a estrutura).
- `docs/documentacao-plataforma.md`, documentação de produto, com o inventário completo de funções (Apêndice A).
- `CHANGELOG.md`, histórico de versões.

## Dados e privacidade
Os dados ficam no `localStorage` do navegador (chave `calotim_mvp_v2`). Não há login, banco online nem sincronização entre dispositivos. Exporte backups em **Configurações** e use **Importar backup** para restaurar. Não coloque informações sensíveis ou dados bancários.

Os dados da versão anterior (`calotim_mvp_v1`, em reais) são convertidos automaticamente para centavos na primeira abertura, e a chave antiga é mantida intacta.

O link de extrato leva os dados da divisão no próprio endereço (no fragmento `#`). Quem receber o link vê nomes e valores. Links curtos e revogáveis dependem do banco online.

## Pagamentos e acertos
- Itens e taxas com "Ainda não foi pago" aparecem como valores devidos ao estabelecimento.
- Itens e taxas atribuídos a um pagador geram créditos e uma sugestão de transferências entre participantes.
- O pagamento antecipado abate itens e taxas pendentes existentes no momento do registro e pode retirar a pessoa dos próximos rateios.
- Selecionar o consumo, registrar um pagamento ou gerar o extrato não comprova que o restaurante recebeu o valor.

## Segurança
O `index.html` declara uma Content-Security-Policy que só permite scripts do próprio site e as fontes do Google. Ao publicar, mantenha os cabeçalhos do `_headers` (eles acrescentam `frame-ancestors 'none'`, que não funciona pela meta tag). Todo texto vindo de backup ou de link compartilhado é escapado antes de entrar na página.

## Supabase
`supabase/schema.sql` ainda não está conectado ao aplicativo. Nunca coloque a chave `service_role` ou qualquer segredo administrativo no JavaScript do navegador.
