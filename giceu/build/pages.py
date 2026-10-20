"""Definição do cabeçalho, rodapé e das páginas do GICEU."""
import math

from gx import (C, F_BODY, F_DISPLAY, F_MONO, button, container, dim, gmap,
                heading, image, nav_menu, posts, raw, set_doc, social, sz,
                text, typo)
from styles import (ABOUT_CSS, BASE_CSS, FOOTER_CSS, HEADER_CSS, HOME_CSS,
                    PODCAST_CSS, assets_block)

INSTAGRAM = "https://www.instagram.com/giceu.ufc/"
PLACEHOLDER = "/wp-content/plugins/elementor/assets/images/placeholder.png"
FULL_NAME = ("Grupo de Pesquisa de Imagem, Consumo e Experiência Urbana "
             "em Processos e Produtos de Comunicação")
MAPS = ("https://www.google.com/maps/search/?api=1&query="
        "Instituto+de+Cultura+e+Arte+UFC+Av.+Mister+Hull+Fortaleza")

# ------------------------------------------------------- peças comuns ------

SEC_PAD = dim(120, 24)
SEC_PAD_T = dim(96, 32)
SEC_PAD_M = dim(76, 20)


def section(*kids, bg=None, cls="", pad=None, pad_t=None, pad_m=None, **kw):
    kw.setdefault("gap_px", 56)
    kw.setdefault("gap_m", 40)
    return container(*kids, boxed=True, tag="section", bg=bg, cls=cls,
                     pad=pad or SEC_PAD, pad_t=pad_t or SEC_PAD_T,
                     pad_m=pad_m or SEC_PAD_M, **kw)


def assets(*css):
    return container(raw(assets_block(*css)), cls="gx-assets")


def eyebrow(label, color=C["blue_deep"], cls="", align=None):
    return heading(label, "p", cls=f"gx-eyebrow {cls}".strip(), color=color, align=align,
                   t=typo(family=F_MONO, size=12, weight=500, lh=1.4, ls=0.14,
                          transform="uppercase"))


def h1(title, color=C["graphite"], cls="", size=(76, 58, 42), **kw):
    return heading(title, "h1", cls=f"gx-balance {cls}".strip(), color=color,
                   t=typo(family=F_DISPLAY, size=size[0], size_t=size[1],
                          size_m=size[2], weight=400, lh=1.02, ls=-0.02, lh_m=1.06), **kw)


def h2(title, color=C["graphite"], cls="", size=(52, 42, 34), **kw):
    return heading(title, "h2", cls=f"gx-balance {cls}".strip(), color=color,
                   t=typo(family=F_DISPLAY, size=size[0], size_t=size[1],
                          size_m=size[2], weight=400, lh=1.06, ls=-0.015), **kw)


def h3(title, color=C["graphite"], cls="", size=26, tag="h3", **kw):
    return heading(title, tag, cls=cls, color=color,
                   t=typo(family=F_DISPLAY, size=size, size_m=min(size, 23),
                          weight=500, lh=1.15, ls=-0.01), **kw)


def lead(html_, color=C["graphite"], cls="", **kw):
    return text(html_, cls=f"gx-pretty {cls}".strip(), color=color,
                t=typo(family=F_BODY, size=20, size_m=18, weight=400, lh=1.6), **kw)


def body(html_, color=C["muted"], cls="", size=17, **kw):
    return text(html_, cls=f"gx-pretty {cls}".strip(), color=color,
                t=typo(family=F_BODY, size=size, size_m=min(size, 16),
                       weight=400, lh=1.65), **kw)


def mono(label, color=C["blue_deep"], cls="", size=11.5, **kw):
    return heading(label, "p", cls=cls, color=color,
                   t=typo(family=F_MONO, size=size, weight=500, lh=1.4, ls=0.12,
                          transform="uppercase"), **kw)


def buttons(*btns, cls="", justify=None):
    return container(*btns, direction="row", wrap=True, gap_px=12, cls=cls,
                     justify=justify, align="center")


def col(*kids, width=None, width_t=100, gap_px=24, cls="", **kw):
    return container(*kids, width=width, width_t=width_t, gap_px=gap_px,
                     cls=cls, **kw)


def row(*kids, gap_px=48, justify="space-between", align="flex-start",
        dir_t="column", cls="", **kw):
    return container(*kids, direction="row", dir_t=dir_t, gap_px=gap_px,
                     justify=justify, align=align, cls=cls, **kw)


def small_btn(label, url, style="ghost", **kw):
    b = button(label, url, style, size=14, **kw)
    b["settings"]["text_padding"] = dim(12, 20)
    return b


# ------------------------------------------------------------- cabeçalho ----

NAV = [("Sobre nós", "/sobre-nos/"), ("Projetos", "/projetos/"),
       ("Produções", "/producoes/"), ("Pesquisadores", "/pesquisadores/"),
       ("Podcast", "/podcast/"), ("Blog", "/blog/"), ("Contato", "/contato/")]


def header(active=None):
    set_doc("giceu-header")
    top = container(
        heading("Universidade Federal do Ceará · Instituto de Cultura e Arte", "p",
                color="rgba(253,253,253,0.72)",
                t=typo(family=F_MONO, size=11, weight=500, lh=1.4, ls=0.12,
                       transform="uppercase")),
        heading("@giceu.ufc", "p", url=INSTAGRAM, color="rgba(253,253,253,0.72)",
                extra={"hide_mobile": "hidden-mobile"},
                t=typo(family=F_MONO, size=11, weight=500, lh=1.4, ls=0.12)),
        boxed=True, direction="row", justify="space-between", align="center",
        gap_px=20, bg=C["graphite"], pad=dim(9, 24), pad_m=dim(8, 20),
        cls="gx-topbar", extra={"hide_mobile": "hidden-mobile"})
    items = [(t, u, u == active) for t, u in NAV]
    bar = container(
        heading("GICEU", "p", url="/", cls="gx-logo", color=C["graphite"],
                t=typo(family=F_DISPLAY, size=32, size_m=28, weight=500, lh=1,
                       ls=-0.01)),
        text("<p>Imagem, Consumo e<br>Experiência Urbana</p>", cls="gx-logo-sub",
             color=C["muted"], extra={"hide_tablet": "hidden-tablet",
                                      "hide_mobile": "hidden-mobile"},
             t=typo(family=F_BODY, size=12, weight=500, lh=1.3)),
        nav_menu(items, cls="gx-nav", extra={"_flex_size": "grow"}),
        button("Ouça o podcast", "/podcast/", "dark", arrow=False,
               icon="fas fa-headphones", cls="gx-cta-pod", size=14,
               extra={"hide_mobile": "hidden-mobile",
                      "text_padding": dim(13, 22)}),
        boxed=True, direction="row", justify="space-between", align="center",
        gap_px=24, gap_m=12, bg=C["paper"], pad=dim(20, 24), pad_m=dim(14, 20),
        cls="gx-header",
        extra={"sticky": "top", "sticky_on": ["desktop", "tablet", "mobile"],
               "sticky_offset": 0, "sticky_effects_offset": 40, "z_index": 99})
    return [container(raw(assets_block(BASE_CSS, HEADER_CSS)), cls="gx-assets"),
            top, bar]


# ---------------------------------------------------------------- rodapé ----

METRO = [("Início", "Página inicial", "/"), ("Sobre nós", "O grupo", "/sobre-nos/"),
         ("Projetos", "Linhas e ações", "/projetos/"),
         ("Produções", "Artigos e teses", "/producoes/"),
         ("Pesquisadores", "Quem faz", "/pesquisadores/"),
         ("Podcast", "Fortaleza e Música", "/podcast/"),
         ("Blog", "Blog da Cidade", "/blog/"),
         ("Contato", "Fale com a gente", "/contato/")]


def footer():
    set_doc("giceu-footer")
    stops = "".join(
        f'<li><a href="{u}"><span class="gx-dot" aria-hidden="true"></span>'
        f'<span class="gx-name">{n}<small>{d}</small></span></a></li>'
        for n, d, u in METRO)
    metro = f'<nav class="gx-metro gx-draw" aria-label="Mapa do site"><ul>{stops}</ul></nav>'
    dim_txt = "rgba(253,253,253,0.72)"

    def label(t):
        return mono(t, color=C["blue"], cls="gx-label", size=11)

    statement = row(
        col(h2("Como a cidade se <em>comunica</em>, se <em>consome</em> e se <em>vive</em>.",
               color=C["paper"], size=(48, 40, 32), cls="gx-reveal"), width=60),
        col(buttons(button("Entre em contato", "/contato/", "paper"),
                    button("Siga @giceu.ufc", INSTAGRAM, "ghost_light", arrow=False,
                           icon="fab fa-instagram", external=True),
                    cls="gx-reveal", justify="flex-end"), width=36),
        align="flex-end", dir_t="column", gap_px=32)
    statement["elements"][1]["elements"][0]["settings"]["flex_justify_content_tablet"] = "flex-start"
    statement["settings"]["flex_align_items_tablet"] = "flex-start"
    top = section(statement, pad=dim(104, 24, 72), pad_t=dim(88, 32, 64),
                  pad_m=dim(72, 20, 56), gap_px=0)
    line = section(label("Mapa do site · Linha GICEU"), raw(metro),
                   pad=dim(0, 24, 72), pad_t=dim(0, 32, 64), pad_m=dim(0, 20, 48),
                   gap_px=28)
    cols = section(
        row(
            col(heading("GICEU", "p", url="/", cls="gx-logo", color=C["paper"],
                        t=typo(family=F_DISPLAY, size=34, weight=500, lh=1, ls=-0.01)),
                body(f"<p>{FULL_NAME}.</p>", color=dim_txt, size=15),
                width=30, gap_px=16),
            col(label("Endereço"),
                body("<p>ICA, Instituto de Cultura e Arte da UFC<br>Campus do Pici, "
                     "Av. Mister Hull, s/n, Pici<br>CEP 60455-760, Fortaleza, CE</p>"
                     f'<p><a href="{MAPS}" target="_blank" rel="noopener">Ver no mapa</a></p>',
                     color=dim_txt, size=15),
                width=25, gap_px=16),
            col(label("Redes"),
                social([("fab fa-instagram", INSTAGRAM)]),
                body(f'<p><a href="{INSTAGRAM}" target="_blank" rel="noopener">@giceu.ufc</a> no Instagram</p>',
                     color=dim_txt, size=15),
                width=17, gap_px=16),
            col(label("Realização"),
                body("<p>Universidade Federal do Ceará<br>Cursos de Publicidade e "
                     "Propaganda, Jornalismo e Moda</p>", color=dim_txt, size=15),
                width=18, gap_px=16),
            gap_px=32, dir_t="row", dir_m="column", cls="gx-stagger"),
        pad=dim(56, 24, 56), pad_t=dim(48, 32), pad_m=dim(48, 20, 40),
        extra={"border_border": "solid", "border_width": dim(1, 0, 0, 0),
               "border_color": "rgba(253,253,253,0.12)"})
    cols_row = cols["elements"][0]
    for c in cols_row["elements"]:
        c["settings"]["width_tablet"] = sz(46, "%")
        c["settings"]["width_mobile"] = sz(100, "%")
    cols_row["settings"]["flex_wrap"] = "wrap"
    bottom = section(
        row(body("<p>© 2026 GICEU · Universidade Federal do Ceará</p>",
                 color="rgba(253,253,253,0.55)", size=14),
            small_btn("Voltar ao topo", "#", "ghost_light", cls="gx-totop"),
            align="center", dir_t="row", gap_px=20),
        pad=dim(22, 24), pad_t=dim(22, 32), pad_m=dim(22, 20),
        extra={"border_border": "solid", "border_width": dim(1, 0, 0, 0),
               "border_color": "rgba(253,253,253,0.12)"})
    wrap = container(top, line, cols, bottom, bg=C["graphite"], tag="footer",
                     cls="gx-footer gx-on-dark")
    return [container(raw(assets_block(BASE_CSS, FOOTER_CSS)), cls="gx-assets"), wrap]


# --------------------------------------------------------- página inicial ---

TRANSIT_MAP = """
<div class="gx-map-wrap">
<div class="gx-map gx-draw">
<svg viewBox="0 0 600 520" role="img" aria-labelledby="gxMapTitle gxMapDesc">
<title id="gxMapTitle">As linhas de pesquisa do GICEU desenhadas como um mapa de transporte</title>
<desc id="gxMapDesc">A Linha 1, Comunicação e Cidade, passa por afetos, cotidiano e imaginários. A Linha 2, Comunicação e Consumo, passa por moda, marcas e feiras. As duas se cruzam no ICA, Campus do Pici, de onde sai o ramal Fortaleza em Música.</desc>
<defs>
<pattern id="gxGrid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M40 0H0V40" fill="none" stroke="#e6e3e3" stroke-width="1"/></pattern>
<radialGradient id="gxFade" cx="50%" cy="50%" r="55%"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>
<mask id="gxMask"><rect width="600" height="520" fill="url(#gxFade)"/></mask>
</defs>
<rect width="600" height="520" fill="url(#gxGrid)" mask="url(#gxMask)"/>
<g class="gx-line gx-l2" fill="none" stroke-linecap="round" stroke-linejoin="round">
 <path class="gx-path" pathLength="1" style="--gx-pd:250ms" d="M60 140H170L290 260H420L500 340V470" stroke="#363334" stroke-width="10"/>
 <circle class="gx-stn" style="--d:900ms" cx="60" cy="140" r="9" fill="#363334" stroke="#fdfdfd" stroke-width="4"/>
 <circle class="gx-stn" style="--d:1000ms" cx="170" cy="140" r="7" fill="#fdfdfd" stroke="#363334" stroke-width="4"/>
 <circle class="gx-stn" style="--d:1200ms" cx="420" cy="260" r="7" fill="#fdfdfd" stroke="#363334" stroke-width="4"/>
 <circle class="gx-stn" style="--d:1500ms" cx="500" cy="470" r="9" fill="#363334" stroke="#fdfdfd" stroke-width="4"/>
 <text class="gx-lbl" x="60" y="118">MODA</text>
 <text class="gx-lbl" x="170" y="118" text-anchor="middle">MARCAS</text>
 <text class="gx-lbl" x="404" y="292" text-anchor="end">FEIRAS</text>
 <text class="gx-term" x="484" y="478" text-anchor="end" fill="#363334">Consumo</text>
</g>
<g class="gx-line gx-l1" fill="none" stroke-linecap="round" stroke-linejoin="round">
 <path class="gx-path" pathLength="1" d="M40 430H160L290 300V200L390 100H540" stroke="#7590c1" stroke-width="10"/>
 <circle class="gx-stn" style="--d:700ms" cx="40" cy="430" r="9" fill="#7590c1" stroke="#fdfdfd" stroke-width="4"/>
 <circle class="gx-stn" style="--d:850ms" cx="160" cy="430" r="7" fill="#fdfdfd" stroke="#7590c1" stroke-width="4"/>
 <circle class="gx-stn" style="--d:1100ms" cx="290" cy="200" r="7" fill="#fdfdfd" stroke="#7590c1" stroke-width="4"/>
 <circle class="gx-stn" style="--d:1400ms" cx="540" cy="100" r="9" fill="#7590c1" stroke="#fdfdfd" stroke-width="4"/>
 <text class="gx-lbl" x="40" y="462">AFETOS</text>
 <text class="gx-lbl" x="160" y="462" text-anchor="middle">COTIDIANO</text>
 <text class="gx-lbl" x="306" y="204">IMAGINÁRIOS</text>
 <text class="gx-term" x="540" y="76" text-anchor="end" fill="#4a6699">Cidade</text>
</g>
<g class="gx-line gx-l3" fill="none" stroke-linecap="round" stroke-linejoin="round">
 <path class="gx-dash" d="M290 260L320 230H470" stroke="#4a6699" stroke-width="6" stroke-dasharray="2 12"/>
 <circle class="gx-stn" style="--d:1700ms" cx="470" cy="230" r="8" fill="#fdfdfd" stroke="#4a6699" stroke-width="4"/>
 <text class="gx-term" x="486" y="238" fill="#4a6699">Música</text>
</g>
<g class="gx-stn" style="--d:1250ms">
 <circle cx="290" cy="260" r="15" fill="#fdfdfd" stroke="#363334" stroke-width="5"/>
 <circle cx="290" cy="260" r="5" fill="#7590c1"/>
</g>
<text class="gx-lbl" x="272" y="294" text-anchor="end" style="fill:#363334">ICA · PICI</text>
</svg>
</div>
<ul class="gx-legend" aria-label="Legenda do mapa">
 <li><button type="button" data-gx-hl="l1"><i></i>Linha 1 <b>Comunicação e Cidade</b></button></li>
 <li><button type="button" data-gx-hl="l2"><i></i>Linha 2 <b>Comunicação e Consumo</b></button></li>
 <li><button type="button" data-gx-hl="l3"><i></i>Projeto <b>Fortaleza em Música</b></button></li>
</ul>
</div>
"""


def bars(n, cls, seed=0.0, lo=14, hi=100):
    out = []
    for i in range(n):
        x = i / (n - 1)
        env = math.sin(math.pi * x) ** 0.6
        v = abs(math.sin(i * 0.61 + seed) * 0.6 + math.sin(i * 0.23 + 1.3 + seed) * 0.4)
        h = lo + (hi - lo) * env * (0.35 + 0.65 * v)
        t = 1.1 + (i * 37 % 9) / 10
        dl = -((i * 53) % 17) / 10
        out.append(f'<span style="--h:{h:.0f}%;--t:{t:.1f}s;--dl:{dl:.1f}s"></span>')
    return f'<div class="{cls}" aria-hidden="true">{"".join(out)}</div>'


def line_card(badge, badge_cls, label, title, desc, cta, url):
    return container(
        raw(f'<span class="gx-badge {badge_cls}" aria-hidden="true">{badge}</span>', cls="gx-badge-w"),
        mono(label),
        h3(title),
        body(f"<p>{desc}</p>", extra={"_flex_size": "grow"}),
        small_btn(cta, url),
        width=31.5, width_t=100, gap_px=16, bg=C["paper"], radius=18,
        pad=dim(0, 28, 30), cls="gx-card gx-linecard gx-reveal")


def home():
    set_doc("giceu-home")
    hero = section(
        row(
            col(eyebrow("Grupo de pesquisa · UFC · desde 2013", cls="gx-reveal"),
                heading("GICEU", "h1", cls="gx-hero-title gx-reveal", color=C["graphite"],
                        t=typo(family=F_DISPLAY, size=176, size_t=132, size_m=96,
                               weight=500, lh=0.86, ls=-0.035)),
                heading(FULL_NAME, "p", cls="gx-reveal gx-balance", color=C["graphite"],
                        t=typo(family=F_BODY, size=20, size_m=17, weight=500, lh=1.45)),
                heading("Como a cidade se <em>comunica</em>, se <em>consome</em> e se <em>vive</em>.",
                        "p", cls="gx-reveal gx-balance", color=C["graphite"],
                        t=typo(family=F_DISPLAY, size=34, size_m=27, weight=400,
                               lh=1.15, ls=-0.01)),
                body("<p>Pesquisa da UFC sobre imagens, imaginários e consumo nos espaços urbanos.</p>",
                     cls="gx-reveal", size=18),
                buttons(button("Conheça o grupo", "/sobre-nos/", "dark"),
                        button("Ouça o podcast", "/podcast/", "ghost", arrow=False,
                               icon="fas fa-headphones"),
                        cls="gx-reveal"),
                width=52, gap_px=22, cls="gx-stagger"),
            col(raw(TRANSIT_MAP), width=44, cls="gx-reveal"),
            align="center", gap_px=48),
        raw('<div class="gx-coords"><span>Fortaleza, Ceará</span><span>3°43′S 38°32′O</span>'
            '<span>ICA · Campus do Pici</span></div>', cls="gx-reveal"),
        pad=dim(64, 24, 80), pad_t=dim(56, 32, 72), pad_m=dim(40, 20, 64), gap_px=48)

    about = section(
        row(
            col(eyebrow("Quem somos", cls="gx-reveal"),
                h2("A cidade pela lente da <em>comunicação</em>.", cls="gx-reveal"),
                width=40, cls="gx-stagger"),
            col(lead("<p>O GICEU reúne pesquisadoras e pesquisadores dos cursos de Publicidade "
                     "e Propaganda, Jornalismo e Moda da Universidade Federal do Ceará. Desde 2013, "
                     "estudamos como a comunicação, o consumo e a vida urbana se entrelaçam, e como "
                     "as experiências de quem vive a cidade produzem imagens, imaginários e modos "
                     "de consumir.</p>", cls="gx-reveal"),
                raw('<dl class="gx-facts"><div><dt>Desde</dt><dd>2013</dd></div>'
                    '<div><dt>Instituição</dt><dd>Universidade Federal do Ceará</dd></div>'
                    '<div><dt>Cursos</dt><dd>Publicidade e Propaganda, Jornalismo e Moda</dd></div>'
                    '<div><dt>Sede</dt><dd>ICA, Campus do Pici</dd></div></dl>', cls="gx-reveal"),
                buttons(button("Saiba mais sobre o grupo", "/sobre-nos/", "dark"), cls="gx-reveal"),
                width=54, gap_px=32, cls="gx-stagger")),
        extra={"border_border": "solid", "border_width": dim(1, 0, 0, 0),
               "border_color": C["line"]})

    lines = section(
        row(col(eyebrow("O que investigamos", cls="gx-reveal"),
                h2("Duas linhas de pesquisa e um projeto que leva a cidade para a <em>rua</em>.",
                   cls="gx-reveal"),
                width=64, cls="gx-stagger"),
            align="flex-end"),
        container(
            line_card("L1", "", "Linha 1", "Comunicação e Cidade",
                      "A cidade como lugar de criação de representações, imagens e imaginários, "
                      "vista pelas práticas cotidianas e pelos afetos das paisagens urbanas.",
                      "Conheça a linha", "/projetos/#linha-1"),
            line_card("L2", "gx-badge--l2", "Linha 2", "Comunicação e Consumo",
                      "O consumo em processos e produtos de comunicação, com estudos sobre moda, "
                      "marcas, gastronomia, jogos, feiras e produtos culturais.",
                      "Conheça a linha", "/projetos/#linha-2"),
            line_card("FM", "gx-badge--fm", "Projeto", "Fortaleza em Música",
                      "Um mapa afetivo das canções que contam Fortaleza, reunido em aplicativo "
                      "e álbum de figurinhas.",
                      "Conheça o projeto", "/projetos/#fortaleza-em-musica"),
            direction="row", dir_t="column", justify="space-between", gap_px=24,
            gap_m=48, cls="gx-linerow gx-draw gx-stagger",
            pad=dim(26, 0, 0), pad_t=dim(26, 0, 0)),
        bg=C["mist"], cls="gx-mist", gap_px=64)

    people = section(
        row(
            col(eyebrow("Quem faz o GICEU", cls="gx-reveal"),
                h2("Gente de muitos lugares em torno de uma pergunta <em>comum</em>.", cls="gx-reveal"),
                lead("<p>Professoras, professores, doutorandos, mestrandos e graduandos de diferentes "
                     "instituições, unidos pelo interesse em compreender a cidade pela lente da "
                     "comunicação.</p>", color=C["muted"], cls="gx-reveal"),
                buttons(button("Conheça os pesquisadores", "/pesquisadores/", "dark"), cls="gx-reveal"),
                width=52, cls="gx-stagger"),
            col(mono("Quem pesquisa com a gente", color=C["muted"], cls="gx-reveal"),
                raw('<ul class="gx-tags gx-tags--lg"><li>Professoras e professores</li><li>Doutorandos</li>'
                    '<li>Mestrandos</li><li>Graduandos</li><li>Universidades do Ceará</li>'
                    '<li>do Brasil</li><li>e do exterior</li></ul>', cls="gx-reveal"),
                width=40, gap_px=20, cls="gx-stagger"),
            align="center"))

    podcast = section(
        row(
            col(eyebrow("Podcast · Fortaleza e Música", color=C["ink"], cls="gx-reveal"),
                h2("Ouça o <em>podcast</em>.", color=C["paper"], size=(64, 52, 40), cls="gx-reveal"),
                lead("<p>Conversas sobre cidade, consumo e cultura, direto da pesquisa para o seu fone "
                     "de ouvido. Escute o episódio mais recente e acompanhe o programa na sua "
                     "plataforma favorita.</p>", color=C["ink"], cls="gx-reveal"),
                buttons(button("Ouvir agora", "/podcast/", "paper"), cls="gx-reveal"),
                width=46, cls="gx-stagger"),
            col(raw(bars(36, "gx-eq gx-live")), width=46, cls="gx-reveal"),
            align="center"),
        bg=C["blue"], cls="gx-on-blue")

    blog = section(
        row(col(eyebrow("Blog da Cidade", cls="gx-reveal"),
                h2("Últimas do blog", cls="gx-reveal"), width=44, cls="gx-stagger"),
            col(body("<p>Novidades do grupo, eventos, publicações e bastidores das pesquisas.</p>",
                     size=18, cls="gx-reveal"),
                buttons(button("Ver todas as notícias", "/blog/", "ghost"), cls="gx-reveal"),
                width=40, gap_px=20, cls="gx-stagger"),
            align="flex-end"),
        posts(cls="gx-posts gx-reveal"))

    media = container(
        container(
            row(col(eyebrow("GICEU na mídia", color=C["blue"], cls="gx-reveal"),
                    h2("A pesquisa já foi <em>notícia</em>.", color=C["paper"], cls="gx-reveal"),
                    width=44, cls="gx-stagger"),
                col(body("<p>O trabalho do grupo já foi destaque na imprensa cearense. Veja o que G1, "
                         "O Povo, Diário do Nordeste, Rádio Universitária FM e Rádio FM Assembleia "
                         "publicaram sobre o Fortaleza em Música.</p>",
                         color="rgba(253,253,253,0.75)", size=18, cls="gx-reveal"),
                    buttons(button("Ver mais na mídia", "/category/giceu-na-midia/", "paper"),
                            cls="gx-reveal"),
                    width=46, gap_px=24, cls="gx-stagger"),
                align="flex-end"),
            boxed=True, pad=dim(0, 24), pad_t=dim(0, 32), pad_m=dim(0, 20)),
        raw('<div class="gx-marquee gx-live"><div class="gx-marquee__track">'
            + "".join(f"<span>{m}</span>" for m in ["G1", "O Povo", "Diário do Nordeste",
                                                    "Rádio Universitária FM", "Rádio FM Assembleia"])
            + "".join(f'<span aria-hidden="true">{m}</span>' for m in
                      ["G1", "O Povo", "Diário do Nordeste", "Rádio Universitária FM",
                       "Rádio FM Assembleia"])
            + "</div></div>", cls="gx-reveal"),
        tag="section", bg=C["graphite"], cls="gx-on-dark", gap_px=64, gap_m=48,
        pad=dim(120, 0), pad_t=dim(96, 0), pad_m=dim(76, 0))

    cta = section(
        col(eyebrow("Contato", cls="gx-reveal"),
            h2("Quer pesquisar com a gente, propor uma parceria ou conversar sobre um projeto?",
               size=(46, 38, 30), cls="gx-reveal"),
            lead("<p>Escreva para o GICEU.</p>", color=C["muted"], cls="gx-reveal"),
            buttons(button("Entre em contato", "/contato/", "dark"), cls="gx-reveal"),
            width=72, width_t=100, gap_px=24, cls="gx-stagger"),
        bg=C["mist"])

    return [assets(BASE_CSS, HOME_CSS), hero, about, lines, people, podcast, blog, media, cta]


# --------------------------------------------------------------- sobre nós --

def stop(year, desc):
    return container(
        heading(year, "h3", color=C["graphite"],
                t=typo(family=F_DISPLAY, size=40, size_m=32, weight=400, lh=1, ls=-0.01)),
        body(f"<p>{desc}</p>"),
        gap_px=12, cls="gx-stop gx-reveal")


def research_line(badge, badge_cls, label, title, desc, sub, cta, url):
    return container(
        raw(f'<span class="gx-badge {badge_cls}" aria-hidden="true">{badge}</span>', cls="gx-badge-w"),
        mono(label),
        h3(title, size=32),
        body(f"<p>{desc}</p>", extra={"_flex_size": "grow"}),
        container(mono("Dessa linha nasceu", color=C["muted"], size=11),
                  h3(sub, size=22, tag="p"),
                  gap_px=8, pad=dim(20, 0, 0),
                  extra={"border_border": "solid", "border_width": dim(1, 0, 0, 0),
                         "border_color": C["line"]}),
        small_btn(cta, url),
        width=48.5, width_t=100, gap_px=18, bg=C["paper"], radius=18,
        pad=dim(36, 36, 36), pad_m=dim(28, 24, 28), cls="gx-card gx-reveal")


def about_page():
    set_doc("giceu-sobre")
    hero = section(
        row(
            col(eyebrow("Sobre nós", cls="gx-reveal"),
                h1("Pesquisamos a cidade pela lente da <em>comunicação</em>.", cls="gx-reveal"),
                heading(FULL_NAME, "p", cls="gx-reveal gx-balance", color=C["muted"],
                        t=typo(family=F_BODY, size=19, size_m=17, weight=500, lh=1.45)),
                width=60, gap_px=28, cls="gx-stagger"),
            col(raw('<dl class="gx-facts"><div><dt>Fundação</dt><dd>2013</dd></div>'
                    '<div><dt>Linhas</dt><dd>Cidade e Consumo</dd></div>'
                    '<div><dt>Subgrupos</dt><dd>Experiências Urbanas e GCC</dd></div>'
                    '<div><dt>Sede</dt><dd>ICA, Campus do Pici</dd></div></dl>'),
                width=34, cls="gx-reveal"),
            align="flex-end", gap_px=56),
        pad=dim(96, 24, 104), pad_t=dim(80, 32, 88), pad_m=dim(56, 20, 72))

    who = section(
        row(
            col(eyebrow("Quem somos", cls="gx-reveal"),
                h2("Comunicação, consumo e vida urbana se <em>entrelaçam</em>.", cls="gx-reveal"),
                width=40, cls="gx-stagger"),
            col(lead("<p>O GICEU reúne pesquisadoras e pesquisadores dos cursos de Publicidade e "
                     "Propaganda, Jornalismo e Moda da Universidade Federal do Ceará. Desde 2013, "
                     "estudamos como a comunicação, o consumo e a vida urbana se entrelaçam, e como "
                     "as experiências de quem vive a cidade produzem imagens, imaginários e modos de "
                     "consumir.</p>", cls="gx-reveal"),
                body("<p>O grupo é feito de gente de muitos lugares. Professoras, professores, "
                     "doutorandos, mestrandos e graduandos de universidades do Ceará, do Brasil e do "
                     "exterior se reúnem em torno de uma pergunta comum. Como a cidade se comunica e "
                     "se consome?</p>", size=18, cls="gx-reveal"),
                raw('<ul class="gx-tags"><li>Publicidade e Propaganda</li><li>Jornalismo</li>'
                    '<li>Moda</li></ul>', cls="gx-reveal"),
                width=54, gap_px=28, cls="gx-stagger")),
        extra={"border_border": "solid", "border_width": dim(1, 0, 0, 0),
               "border_color": C["line"]})

    lines = section(
        row(col(eyebrow("Linhas de pesquisa", cls="gx-reveal"),
                h2("Duas linhas, dois <em>subgrupos</em>.", cls="gx-reveal"),
                width=44, cls="gx-stagger"),
            col(body("<p>O GICEU organiza sua pesquisa em duas linhas e em dois subgrupos de estudo. "
                     "Cada um reúne projetos que olham para a cidade e para o consumo como lugares onde "
                     "a comunicação acontece, se transforma e produz sentido.</p>", size=18,
                     cls="gx-reveal"),
                width=48),
            align="flex-end"),
        container(
            research_line("L1", "", "Linha 1", "Comunicação e Cidade",
                          "Reúne pesquisadores da comunicação que têm a cidade como objeto de estudo. "
                          "O olhar vai além do espaço físico e alcança as experiências, as práticas "
                          "sociais do dia a dia e os afetos multissensoriais das paisagens urbanas. A "
                          "cidade aparece como lugar de criação de representações, imagens e imaginários.",
                          "Experiências Urbanas", "Conheça o Experiências Urbanas",
                          "/projetos/#experiencias-urbanas"),
            research_line("L2", "gx-badge--l2", "Linha 2", "Comunicação e Consumo",
                          "Fomenta estudos sobre o consumo em processos e produtos de comunicação. "
                          "Entende o entrelaçamento entre comunicação e práticas de consumo como um "
                          "fenômeno sociocultural central para compreender a sociedade contemporânea. "
                          "Contempla pesquisas sobre moda, marcas, gastronomia, jogos, feiras e "
                          "produtos culturais.",
                          "Grupo de Comunicação e Consumo (GCC)", "Conheça o GCC", "/projetos/#gcc"),
            direction="row", dir_t="column", justify="space-between", gap_px=24,
            cls="gx-stagger"),
        bg=C["mist"], cls="gx-mist", gap_px=64)

    timeline = section(
        row(
            col(eyebrow("Trajetória", cls="gx-reveal"),
                h2("Do primeiro projeto às narrativas da <em>cidade</em>.", cls="gx-reveal"),
                body("<p>Uma linha do tempo curta da pesquisa do GICEU em Fortaleza.</p>", size=18,
                     cls="gx-reveal"),
                width=38, cls="gx-stagger"),
            container(
                stop("2013", "Fundação do GICEU."),
                stop("2014 e 2015", "Projetos aprovados no Proext. A pesquisa “A imagem de Fortaleza "
                     "para a Copa do Mundo de 2014” rendeu artigos em periódicos e trabalhos "
                     "apresentados em congressos nacionais e internacionais."),
                stop("2016", "Início de “Narrativas de Consumo de Fortaleza”, em duas etapas. A "
                     "primeira estuda a produção musical sobre a cidade no movimento “O pessoal do "
                     "Ceará”. A segunda investiga como Fortaleza aparece nas crônicas literárias "
                     "entre 1970 e 1990."),
                stop("Hoje", "O Fortaleza em Música mapeia os lugares que inspiraram canções e leva "
                     "a pesquisa para a rua, em aplicativo e álbum de figurinhas. O podcast "
                     "Fortaleza e Música dá voz a artistas da cidade."),
                width=56, width_t=100, gap_px=48, cls="gx-timeline gx-draw gx-stagger")))

    coord = section(
        row(
            col(image(PLACEHOLDER, "Foto de Sílvia Helena Belmino", cls="gx-portrait"),
                width=34, width_t=60, width_m=100, cls="gx-reveal"),
            col(eyebrow("Coordenação", color=C["blue"], cls="gx-reveal"),
                h2("Sílvia Helena Belmino", color=C["paper"], cls="gx-reveal"),
                mono("Líder do grupo · Universidade Federal do Ceará", color="rgba(253,253,253,0.6)",
                     cls="gx-reveal"),
                lead("<p>Lidera o GICEU e atua na Universidade Federal do Ceará. É graduada em "
                     "Comunicação Social pela UFC, mestre em Administração de Empresas pela "
                     "Universidade de Fortaleza e doutora em Comunicação pela Universidade de "
                     "Brasília.</p>", color="rgba(253,253,253,0.82)", cls="gx-reveal"),
                buttons(button("Conheça os pesquisadores", "/pesquisadores/", "paper"),
                        cls="gx-reveal"),
                width=56, gap_px=22, cls="gx-stagger"),
            align="center", gap_px=64),
        bg=C["graphite"], cls="gx-on-dark")

    where = section(
        row(
            col(eyebrow("Onde estamos", cls="gx-reveal"),
                h2("No Instituto de Cultura e Arte da <em>UFC</em>.", cls="gx-reveal"),
                body("<address class=\"gx-address\"><p>ICA, Instituto de Cultura e Arte da UFC<br>"
                     "Campus do Pici, Av. Mister Hull, s/n, Pici<br>CEP 60455-760, Fortaleza, CE</p>"
                     "</address>", size=18, cls="gx-reveal"),
                buttons(button("Como chegar", MAPS, "ghost", external=True), cls="gx-reveal"),
                width=40, cls="gx-stagger"),
            col(gmap("Instituto de Cultura e Arte UFC, Av. Mister Hull, Pici, Fortaleza, CE",
                     cls="gx-mapembed"), width=54, cls="gx-reveal"),
            align="center"))

    cta = section(
        col(eyebrow("Contato", cls="gx-reveal"),
            h2("Quer pesquisar com o GICEU?", cls="gx-reveal"),
            lead("<p>Entre em contato e conte qual é a sua pergunta sobre a cidade.</p>",
                 color=C["muted"], cls="gx-reveal"),
            buttons(button("Entre em contato", "/contato/", "dark"), cls="gx-reveal"),
            width=64, width_t=100, gap_px=24, cls="gx-stagger"),
        bg=C["mist"])

    return [assets(BASE_CSS, HOME_CSS, ABOUT_CSS), hero, who, lines, timeline, coord, where, cta]


# ----------------------------------------------------------------- podcast --

def cover(ep, lg=False):
    b = "".join(f'<b style="--h:{h}%"></b>' for h in (40, 90, 60, 100, 50, 75, 30))
    return (f'<div class="gx-cover{" gx-cover--lg" if lg else ""}" aria-hidden="true">'
            f'<i>{b}</i><small>Fortaleza e Música</small><strong>{ep}</strong></div>')


def spec(label, value):
    return container(
        mono(label),
        heading(value, "p", color=C["graphite"],
                t=typo(family=F_DISPLAY, size=26, size_m=23, weight=400, lh=1.2)),
        width=23.5, width_t=48.5, width_m=100, gap_px=14, bg=C["paper"], radius=18,
        pad=dim(26, 26, 30), cls="gx-spec gx-card gx-reveal")


def episode(n, i):
    return container(
        raw(cover(f"{n:02d}"), width=(96, "px"),
            extra={"_element_custom_width_mobile": sz(72), "_flex_size": "none"}),
        container(
            raw(f'<div class="gx-ep-meta"><span>Ep. {n:02d}</span><span>[Data]</span>'
                f'<span>[Duração]</span></div>'),
            h3("[Título do episódio]", size=24),
            body("<p>[Frase curta com o tema central do episódio.]</p>", size=16),
            gap_px=8, extra={"_flex_size": "grow"}),
        small_btn("Ouvir", "#", "ghost"),
        direction="row", align="center", gap_px=28, gap_m=16, wrap=False,
        pad=dim(20, 20), pad_m=dim(18, 12), cls="gx-ep gx-reveal",
        dir_m="column", align_m="flex-start")


def podcast_page():
    set_doc("giceu-podcast")
    hero = section(
        col(eyebrow("Podcast do GICEU", color=C["ink"], cls="gx-reveal"),
            h1("Fortaleza <em>e</em> Música", color=C["paper"], size=(132, 96, 60),
               cls="gx-reveal"),
            heading("O podcast que conta as histórias de artistas fortalezenses e suas relações "
                    "com a música e a cidade.", "p", color=C["paper"], cls="gx-reveal gx-balance",
                    t=typo(family=F_BODY, size=24, size_m=20, weight=500, lh=1.45),
                    extra={"_element_width": "initial", "_element_custom_width": sz(70, "%"),
                           "_element_custom_width_tablet": sz(100, "%")}),
            buttons(button("Ouvir agora", "#episodio-destaque", "paper"),
                    button("Onde ouvir", "#onde-ouvir", "ghost_light", arrow=False),
                    cls="gx-reveal"),
            gap_px=26, cls="gx-stagger"),
        raw(bars(72, "gx-wave gx-draw gx-live", seed=0.7, lo=10)),
        bg=C["blue"], cls="gx-on-blue",
        pad=dim(88, 24, 72), pad_t=dim(72, 32, 64), pad_m=dim(56, 20, 48), gap_px=64)

    intro = section(
        row(
            col(eyebrow("Apresentação", cls="gx-reveal"),
                h2("Aqui, a pesquisa ganha <em>voz</em>.", cls="gx-reveal"),
                width=38, cls="gx-stagger"),
            col(lead("<p>A pesquisa acadêmica costuma ficar guardada em artigos e congressos. No "
                     "Fortaleza e Música, ela ganha voz. Em cada episódio, o podcast conta a trajetória "
                     "de artistas fortalezenses e a relação que eles constroem com a música e com a "
                     "cidade, entre palcos, bairros, memórias e sons que dão a Fortaleza a sua cara.</p>",
                     cls="gx-reveal"),
                heading("É um convite para ouvir a universidade de perto, com linguagem acessível e "
                        "muita escuta.", "p", cls="gx-quote gx-reveal", color=C["blue"],
                        t=typo(family=F_DISPLAY, size=32, size_m=26, weight=400, lh=1.25,
                               style="italic")),
                width=56, gap_px=40, cls="gx-stagger")))

    fmt = section(
        row(col(eyebrow("Sobre o formato", cls="gx-reveal"),
                h2("Como é o programa", cls="gx-reveal"), width=50, cls="gx-stagger"),
            align="flex-end"),
        container(
            spec("Duração média", "[XX] minutos por episódio"),
            spec("Periodicidade", "[Semanal, quinzenal ou mensal]"),
            spec("Apresentação", "[Nomes de quem apresenta]"),
            spec("Convidados", "Artistas fortalezenses, contando sua história com a música e a cidade"),
            direction="row", wrap=True, justify="space-between", gap_px=24, gap_m=16,
            cls="gx-stagger"),
        bg=C["mist"], cls="gx-mist")

    where = section(
        col(eyebrow("Onde ouvir", color=C["ink"], cls="gx-reveal", align="center"),
            h2("Escolha sua plataforma e siga o programa para não perder nenhum <em>episódio</em>.",
               color=C["paper"], align="center", cls="gx-reveal"),
            buttons(*[button(n, "#", "paper", arrow=False, icon=ic, cls="gx-platform")
                      for n, ic in (("Spotify", "fab fa-spotify"), ("YouTube", "fab fa-youtube"),
                                    ("Apple Podcasts", "fas fa-podcast"),
                                    ("Deezer", "fas fa-headphones-alt"))],
                    justify="center", cls="gx-reveal"),
            width=80, width_t=100, gap_px=32, align="center"),
        bg=C["blue"], cls="gx-on-blue", anchor="onde-ouvir", align="center")

    featured = section(
        container(
            raw(cover("[Nº]", lg=True), width=(100, "%")),
            width=38, width_t=100, cls="gx-reveal"),
        container(
            eyebrow("Episódio em destaque", cls="gx-reveal"),
            raw('<div class="gx-ep-meta"><span>[Data de publicação]</span><span>[Duração]</span></div>',
                cls="gx-reveal"),
            h2("[Título do episódio mais recente]", size=(40, 34, 28), cls="gx-reveal"),
            body("<p>[Descrição em duas linhas: o tema central do episódio e quem participa da "
                 "conversa.]</p>", size=18, cls="gx-reveal"),
            raw('<div class="gx-embed">Cole aqui o código de incorporação do episódio<br>'
                '(Spotify, YouTube ou outra plataforma)</div>', cls="gx-reveal"),
            width=56, width_t=100, gap_px=20, cls="gx-stagger"),
        direction="row", dir_t="column", justify="space-between", align="center",
        gap_px=48, bg=C["mist"], cls="gx-mist", anchor="episodio-destaque")

    allx = section(
        row(col(eyebrow("Todos os episódios", cls="gx-reveal"),
                h2("Do mais recente ao mais antigo", cls="gx-reveal"), width=60, cls="gx-stagger"),
            align="flex-end"),
        container(*[episode(n, i) for i, n in enumerate((4, 3, 2, 1))], gap_px=4,
                  cls="gx-stagger"),
        gap_px=48)

    invite = section(
        row(
            col(eyebrow("Convite para participar", color=C["ink"], cls="gx-reveal"),
                h2("Tem uma pesquisa, uma experiência ou uma história que dialoga com a cidade e o "
                   "<em>consumo</em>?", color=C["paper"], size=(46, 38, 30), cls="gx-reveal"),
                width=60, cls="gx-stagger"),
            col(lead("<p>Conte para a gente. O Fortaleza e Música está aberto a sugestões de pauta e "
                     "de convidados.</p>", color=C["ink"], cls="gx-reveal"),
                buttons(button("Sugerir um tema", "/contato/", "paper"), cls="gx-reveal"),
                width=32, gap_px=24, cls="gx-stagger"),
            align="flex-end"),
        bg=C["blue"], cls="gx-on-blue")

    credits = section(
        col(mono("Realização e apoio", color=C["blue_deep"], cls="gx-reveal"),
            body('<p>O Fortaleza e Música integra o projeto Sonoridades de Fortaleza, do GICEU '
                 '(<a href="https://www.instagram.com/giceu.ufc/" target="_blank" rel="noopener">@giceu.ufc</a>), '
                 'em parceria com o Ateliê Sonoridades Urbanas '
                 '(<a href="https://www.instagram.com/ateliesonoridadesurbanas/" target="_blank" rel="noopener">@ateliesonoridadesurbanas</a>) '
                 'e com fomento da Fundação Cearense de Apoio ao Desenvolvimento Científico e '
                 'Tecnológico, a Funcap (<a href="https://www.instagram.com/funcapce/" target="_blank" '
                 'rel="noopener">@funcapce</a>). Siga o GICEU no Instagram e acompanhe os bastidores de '
                 'cada gravação.</p>', color=C["graphite"], size=16, cls="gx-reveal"),
            width=72, width_t=100, gap_px=16),
        pad=dim(64, 24), pad_t=dim(56, 32), pad_m=dim(48, 20), bg=C["mist"])

    return [assets(BASE_CSS, HOME_CSS, PODCAST_CSS), hero, intro, fmt, where, featured, allx,
            invite, credits]
