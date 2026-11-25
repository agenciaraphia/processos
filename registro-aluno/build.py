#!/usr/bin/env python3
"""Gera registro-aluno/index.html (página completa) a partir de src/app.html + src/modelo.docx.

Uso:  python3 registro-aluno/build.py [saida_fragmento.html]
O argumento opcional grava também a versão "fragmento" (sem <html>/<head>), usada para publicar como Artifact no Claude.
"""
import base64, pathlib, sys

here = pathlib.Path(__file__).resolve().parent
src = (here / "src" / "app.html").read_text(encoding="utf-8")
b64 = base64.b64encode((here / "src" / "modelo.docx").read_bytes()).decode()
frag = src.replace("__TEMPLATE_B64__", b64)

# Na versão do site, a biblioteca JSZip vai embutida: a página funciona sem depender de CDN.
site = frag
jszip = here / "src" / "jszip.min.js"
cdn_tag = '<script src="https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js"></script>'
if jszip.exists() and cdn_tag in site:
    site = site.replace(cdn_tag, "<script>" + jszip.read_text(encoding="utf-8").replace("</script", "<\\/script") + "</script>")

cut = site.index("<header")
head_part, body_part = site[:cut], site[cut:]
reset = (":root{color-scheme:light;padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}"
         "body{margin:0;font:14px/1.4 system-ui,sans-serif}img{max-width:100%}[hidden]{display:none!important}")
page = ("<!doctype html>\n<html lang=\"pt-BR\">\n<head>\n<meta charset=\"utf-8\">\n"
        "<meta name=\"viewport\" content=\"width=device-width,initial-scale=1,viewport-fit=cover\">\n"
        f"<style>{reset}</style>\n{head_part}</head>\n<body>\n{body_part}</body>\n</html>\n")
(here / "index.html").write_text(page, encoding="utf-8")
(here / "site").mkdir(exist_ok=True)
(here / "site" / "index.html").write_text(page, encoding="utf-8")  # pasta pronta para Netlify / GitHub Pages
(here / "github").mkdir(exist_ok=True)
(here / "github" / "index.html").write_text(page, encoding="utf-8")  # pasta pronta para GitHub Pages
rp = here / "repo-pessoal" / "registros-tia-isa"
if rp.exists():
    (rp / "index.html").write_text(page, encoding="utf-8")  # repositório pronto (Netlify + GitHub)
print("index.html:", len(page), "bytes")
if len(sys.argv) > 1:
    pathlib.Path(sys.argv[1]).write_text(frag, encoding="utf-8")
    print("fragmento:", sys.argv[1])
