/* =====================================================================
   CONTEÚDO EDITÁVEL DA PÁGINA — Cobertura de eventos Raphia
   ---------------------------------------------------------------------
   Este é o único arquivo que você precisa mexer para trocar o WhatsApp,
   as mensagens dos botões ou as fotos. Depois de editar, suba este
   arquivo de novo na HostGator (mesma pasta do index.html).

   Regras rápidas:
   - Cada linha fica entre { } e termina com vírgula.
   - Use aspas retas "assim".
   - Nunca escreva o nome de clientes aqui.
   ===================================================================== */

window.RAPHIA = {

  /* Número com DDI + DDD, só números. */
  whatsapp: "5585997279505",

  /* Instagram sem o @. Deixe "" para esconder do rodapé. */
  instagram: "raphia.ag",

  /* Mensagem que já aparece escrita no WhatsApp de quem clica em cada botão. */
  mensagens: {
    reservar:          "Olá, Raphia! Vi a página de cobertura de eventos e quero reservar minha data com 15% de desconto. Meu evento é: ",
    casamentos:        "Olá, Raphia! Quero montar o pacote de cobertura do meu casamento. A data é: ",
    aniversarios:      "Olá, Raphia! Quero reservar a cobertura da minha festa de aniversário. A data é: ",
    confraternizacoes: "Olá, Raphia! Quero registrar a nossa confraternização. A data é: ",
    corporativos:      "Olá, Raphia! Quero pedir a cobertura de um evento corporativo. A data é: ",
    portfolio:         "Olá, Raphia! Vi o portfólio e quero a minha cobertura. Meu evento é: ",
    comecar:           "Olá, Raphia! Quero começar. Pode me mostrar as opções de pacotes de cobertura?",
    duvida:            "Olá, Raphia! Tenho uma dúvida sobre a cobertura de eventos: "
  },

  /* Categorias do filtro do portfólio, na ordem em que aparecem.
     Uma categoria só aparece no filtro quando tem pelo menos uma foto. */
  categorias: [
    { id: "batizados",         nome: "Batizados",         legenda: "Um dia de fé e família, guardado com carinho" },
    { id: "casamentos",        nome: "Casamentos",        legenda: "O grande dia, do primeiro olhar ao último brinde" },
    { id: "aniversarios",      nome: "Aniversários",      legenda: "Cada ano merece ser lembrado" },
    { id: "fim-de-ano",        nome: "Fim de ano",        legenda: "A festa que fecha o ano com a equipe toda na foto" },
    { id: "confraternizacoes", nome: "Confraternizações", legenda: "Gente reunida, risadas e ninguém fora da foto" },
    { id: "corporativos",      nome: "Corporativos",      legenda: "Seu evento com cara profissional" }
  ],

  /* ------------------------------------------------------------------
     FOTOS DO PORTFÓLIO
     Para adicionar uma foto:
       1. Exporte com o lado maior em 1600 px, em .webp ou .jpg, até 400 KB
          (o site squoosh.app faz isso de graça).
       2. Dê um nome sem espaço e sem acento: casamento-10.webp
       3. Suba para a pasta fotos/<categoria>/ na HostGator.
       4. Copie uma linha abaixo e troque o arquivo, a categoria e a descrição.

     arquivo:   caminho dentro da pasta fotos/
     categoria: um dos ids acima (batizados, casamentos, aniversarios...)
     grupo:     junta as fotos de um mesmo evento (pode repetir a categoria)
     formato:   "vertical" ou "horizontal"
     descricao: o que aparece na foto, para quem usa leitor de tela (sem nomes)
     destaque:  true faz a foto abrir o evento no filtro, em tamanho maior (use 1 por evento)
     video:     opcional. Para um vídeo curto, use arquivo .mp4 vertical
                sem som, até 6 MB, e coloque uma foto de capa em "arquivo".
     ------------------------------------------------------------------ */
  fotos: [
    { arquivo: "batizados/batizado-03.webp", categoria: "batizados", grupo: "batizado-1", formato: "vertical", destaque: true, descricao: "Pais encostam a testa um no outro com a bebê no colo, no batizado" },
    { arquivo: "batizados/batizado-02.webp", categoria: "batizados", grupo: "batizado-1", formato: "vertical", descricao: "Bebê gargalhando de touca de renda branca" },
    { arquivo: "batizados/batizado-04.webp", categoria: "batizados", grupo: "batizado-1", formato: "horizontal", descricao: "Bebê de vestido branco sentada no altar da igreja" },
    { arquivo: "batizados/batizado-01.webp", categoria: "batizados", grupo: "batizado-1", formato: "vertical", descricao: "Pais sorrindo com a bebê vestida de branco na igreja" },
    { arquivo: "batizados/batizado-05.webp", categoria: "batizados", grupo: "batizado-1", formato: "vertical", descricao: "Família reunida com a bebê no corredor da igreja" },

    { arquivo: "casamentos/casamento-09.webp", categoria: "casamentos", grupo: "casamento-1", formato: "horizontal", destaque: true, descricao: "Noivos saem sob chuva de pétalas, entre convidados e luzes acesas" },
    { arquivo: "casamentos/casamento-05.webp", categoria: "casamentos", grupo: "casamento-1", formato: "vertical", descricao: "Noiva sob o arco de flores coloridas" },
    { arquivo: "casamentos/casamento-04.webp", categoria: "casamentos", grupo: "casamento-1", formato: "vertical", descricao: "Noivos abraçados, em preto e branco" },
    { arquivo: "casamentos/casamento-08.webp", categoria: "casamentos", grupo: "casamento-1", formato: "horizontal", descricao: "Mãos dos noivos com as alianças, em preto e branco" },
    { arquivo: "casamentos/casamento-01.webp", categoria: "casamentos", grupo: "casamento-1", formato: "horizontal", descricao: "Bolo branco de casamento rodeado de flores e doces" },
    { arquivo: "casamentos/casamento-03.webp", categoria: "casamentos", grupo: "casamento-1", formato: "vertical", descricao: "Noiva caminha no tapete vermelho com o buquê" },
    { arquivo: "casamentos/casamento-06.webp", categoria: "casamentos", grupo: "casamento-1", formato: "horizontal", descricao: "Noivos de mãos dadas diante do arco de flores" },
    { arquivo: "casamentos/casamento-07.webp", categoria: "casamentos", grupo: "casamento-1", formato: "horizontal", descricao: "Troca de votos com os padrinhos ao redor" },
    { arquivo: "casamentos/casamento-02.webp", categoria: "casamentos", grupo: "casamento-1", formato: "horizontal", descricao: "Arco de flores e tapete vermelho prontos para a cerimônia" },

    { arquivo: "aniversarios/aniversario-50anos-04.webp", categoria: "aniversarios", grupo: "aniversario-50", formato: "vertical", destaque: true, descricao: "Aniversariante de macacão roxo ao lado do bolo de 50 anos" },
    { arquivo: "aniversarios/aniversario-50anos-03.webp", categoria: "aniversarios", grupo: "aniversario-50", formato: "horizontal", descricao: "Mesa do bolo com flores, velas e globos espelhados" },
    { arquivo: "aniversarios/aniversario-50anos-05.webp", categoria: "aniversarios", grupo: "aniversario-50", formato: "horizontal", descricao: "Aniversariante sorrindo entre arranjos de flores" },
    { arquivo: "aniversarios/aniversario-50anos-01.webp", categoria: "aniversarios", grupo: "aniversario-50", formato: "vertical", descricao: "Detalhe da decoração com flores e globos espelhados" },
    { arquivo: "aniversarios/aniversario-50anos-02.webp", categoria: "aniversarios", grupo: "aniversario-50", formato: "horizontal", descricao: "Aniversariante posando ao lado do painel da festa" },

    { arquivo: "aniversarios/aniversario-1ano-02.webp", categoria: "aniversarios", grupo: "aniversario-1", formato: "vertical", destaque: true, descricao: "Pais beijam a bebê no colo, sob a cobertura de folhas" },
    { arquivo: "aniversarios/aniversario-1ano-04.webp", categoria: "aniversarios", grupo: "aniversario-1", formato: "vertical", descricao: "Mãe segura a bebê diante dos balões cor-de-rosa" },
    { arquivo: "aniversarios/aniversario-1ano-05.webp", categoria: "aniversarios", grupo: "aniversario-1", formato: "horizontal", descricao: "Família comemora com chuva de papel picado ao redor do bolo" },
    { arquivo: "aniversarios/aniversario-1ano-03.webp", categoria: "aniversarios", grupo: "aniversario-1", formato: "vertical", descricao: "Bebê caminha de mãos dadas com os pais" },
    { arquivo: "aniversarios/aniversario-1ano-01.webp", categoria: "aniversarios", grupo: "aniversario-1", formato: "vertical", descricao: "Bebê de vestido de tule em frente à mesa decorada" }
  ],

  /* Fotos que se revezam no topo da página (verticais ficam melhores). */
  topo: [
    "batizados/batizado-03.webp",
    "casamentos/casamento-05.webp",
    "aniversarios/aniversario-50anos-04.webp",
    "aniversarios/aniversario-1ano-02.webp",
    "batizados/batizado-02.webp",
    "casamentos/casamento-04.webp"
  ]
};
