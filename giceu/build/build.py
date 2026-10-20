"""Gera os templates JSON do Elementor e as prévias em HTML.

Uso: python3 build.py   (a partir desta pasta)
"""
import os

import gx
import pages

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT_JSON = os.path.join(ROOT, "templates")
OUT_PREVIEW = os.path.join(ROOT, "preview")

URLS = {"/": "index.html", "/sobre-nos/": "sobre-nos.html", "/podcast/": "podcast.html"}

FONTS = ("https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,400;"
         "0,6..72,500;1,6..72,400&family=Public+Sans:wght@400;500;600&"
         "family=IBM+Plex+Mono:wght@500;600&display=swap")

# Aproximação do CSS de base do Elementor + tema Hello, só para a prévia.
ELEMENTOR_BASE = """
*,*::before,*::after{box-sizing:border-box}
body{margin:0;font-family:'Public Sans',sans-serif;font-size:16px;line-height:1.5}
img{max-width:100%;height:auto;display:block}
a{color:#4a6699;text-decoration:none}
h1,h2,h3,h4,h5,h6,p,dl,dd{margin:0}
.elementor-heading-title{margin:0;padding:0;line-height:1}
.e-con{display:flex;flex-direction:column;position:relative;width:100%;min-width:0;flex-grow:0;flex-shrink:1}
.e-con-inner{display:flex;width:100%;margin:0 auto}
.elementor-widget{position:relative;width:100%;max-width:100%}
.elementor-button{display:inline-flex;align-items:center;line-height:1;text-decoration:none;cursor:pointer}
.elementor-button-content-wrapper{display:flex;align-items:center;gap:10px}
.elementor-nav-menu{display:flex;list-style:none;margin:0;padding:0;justify-content:center;flex-wrap:wrap}
.elementor-nav-menu a{display:flex}
.elementor-menu-toggle{display:none;align-items:center;justify-content:center;width:44px;height:44px;border:0;background:transparent;font-size:22px;color:#363334;margin-left:auto}
.elementor-posts-container{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:40px 28px}
.gxp-thumb{position:absolute;inset:0;background:linear-gradient(135deg,#7590c1,#4a6699)}
.elementor-post__thumbnail.gxp-thumb{position:relative;padding-bottom:62%}
.gxp-thumb--1{background:linear-gradient(135deg,#363334,#6b6768)}
.gxp-thumb--2{background:linear-gradient(135deg,#e8edf6,#7590c1)}
.gxp-ph,.gxp-map{display:flex;align-items:center;justify-content:center;background:#e8edf6;color:#4a6699;font:500 11px/1.4 'IBM Plex Mono',monospace;letter-spacing:.1em;text-transform:uppercase;text-align:center;padding:20px}
.gxp-ph{aspect-ratio:4/5;background:linear-gradient(160deg,#6b6768,#363334);color:#fdfdfd}
.gxp-map{background:repeating-linear-gradient(0deg,#e6e3e3 0 1px,transparent 1px 48px),repeating-linear-gradient(90deg,#e6e3e3 0 1px,#f4f4f4 1px 48px)}
.elementor-social-icons-wrapper{display:flex;gap:10px}
@media (max-width:1024px){.elementor-nav-menu--main{display:none}.elementor-menu-toggle{display:inline-flex}.elementor-posts-container{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media (min-width:768px) and (max-width:1024px){.elementor-hidden-tablet{display:none!important}}
@media (max-width:767px){.elementor-hidden-mobile{display:none!important}.elementor-posts-container{grid-template-columns:1fr}}
"""


def is_row(s):
    return "row" in (s.get("flex_direction"), s.get("flex_direction_tablet"),
                     s.get("flex_direction_mobile"))


def auto_width(els):
    """Widgets dentro de containers em linha ficam com largura automática
    ("Inline") e sem crescer, a menos que o widget já defina outra coisa."""
    for el in els:
        if el["elType"] != "container":
            continue
        if is_row(el["settings"]):
            for c in el["elements"]:
                if c["elType"] == "widget":
                    cs = c["settings"]
                    cs.setdefault("_element_width", "auto")
                    cs.setdefault("_flex_size", "none")
        auto_width(el["elements"])


def page_html(title, desc, head_els, body_els, foot_els):
    pv = gx.Preview(URLS)
    markup = "".join(pv.render(e) for e in head_els)
    markup += '<main class="elementor">' + "".join(pv.render(e) for e in body_els) + "</main>"
    markup += "".join(pv.render(e) for e in foot_els)
    return f"""<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{title}</title>
<meta name="description" content="{desc}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="{FONTS}">
<link rel="stylesheet" href="vendor/fontawesome/css/all.min.css">
<style>{ELEMENTOR_BASE}
.gx-header{{position:sticky;top:0;z-index:99}}
{pv.stylesheet()}</style>
</head>
<body>
{markup}
</body>
</html>
"""


def main():
    os.makedirs(OUT_JSON, exist_ok=True)
    os.makedirs(OUT_PREVIEW, exist_ok=True)
    foot = pages.footer()
    docs = [
        ("01-cabecalho.json", "GICEU · Cabeçalho", "header", pages.header()),
        ("02-rodape.json", "GICEU · Rodapé", "footer", foot),
        ("03-pagina-inicial.json", "GICEU · Página inicial", "page", pages.home()),
        ("04-sobre-nos.json", "GICEU · Sobre nós", "page", pages.about_page()),
        ("05-podcast.json", "GICEU · Podcast", "page", pages.podcast_page()),
    ]
    for _, _, _, content in docs:
        auto_width(content)
    for fname, title, kind, content in docs:
        gx.export(os.path.join(OUT_JSON, fname), title, kind, content)
        print("json   ", fname)

    previews = [
        ("index.html", "GICEU · Página inicial", "/", docs[2][3]),
        ("sobre-nos.html", "GICEU · Sobre nós", "/sobre-nos/", docs[3][3]),
        ("podcast.html", "GICEU · Podcast", "/podcast/", docs[4][3]),
    ]
    for fname, title, active, content in previews:
        head = pages.header(active=active)
        auto_width(head)
        html = page_html(title, "Prévia do template Elementor do GICEU", head, content, foot)
        with open(os.path.join(OUT_PREVIEW, fname), "w", encoding="utf-8") as fh:
            fh.write(html)
        print("preview", fname)


if __name__ == "__main__":
    main()
