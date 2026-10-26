"""Conteúdo e estrutura do site da Dra. Célia Alcântara.

Uso:  python3 build/site.py
Gera: elementor/*.json (importar no Elementor Pro) e preview/*.html (conferência visual).
"""
import json
import os
import sys
from urllib.parse import quote

sys.path.insert(0, os.path.dirname(__file__))
from lib import (ICONS, icon_css, Preview, box, px, button, con, esc, export, heading, html_w, image, pro,
                 reset_ids, text, WA_ICON)

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DOMAIN = "https://www.draceliaalcantara.com.br"  # trocar pelo domínio definitivo
WA_NUMBER = "5585992449528"
WA_DISPLAY = "(85) 99244-9528"
INSTAGRAM = "https://www.instagram.com/"  # [a confirmar] perfil da Dra. Célia
ADDRESS = {
    "street": "Rua General Castelo Branco, 130",
    "district": "Cidade dos Funcionários",
    "city": "Fortaleza",
    "state": "CE",
    "zip": "60822-040",
}
MAPS = "https://www.google.com/maps/search/?api=1&query=" + quote("Rua General Castelo Branco, 130, Cidade dos Funcionários, Fortaleza - CE, 60822-040")
TODAY = "2026-10-26"

NAVY = "#1F3363"
NAVY_DEEP = "#16264A"
LINEN = "#F7F4EF"
WHITE = "#FDFDFD"


def wa(topic=None):
    msg = "Olá! Vim pelo site e gostaria de agendar uma consulta com a Dra. Célia Alcântara."
    if topic:
        msg = f"Olá! Vim pelo site (página {topic}) e gostaria de agendar uma consulta com a Dra. Célia Alcântara."
    return f"https://wa.me/{WA_NUMBER}?text={quote(msg)}"


SPECIALTIES = [
    ("artrite-psoriasica", "Artrite psoriásica", "Inflamação nas articulações que costuma estar ligada à psoríase."),
    ("espondiloartrites", "Espondiloartrites", "Doenças inflamatórias crônicas que atingem principalmente a coluna e a pelve."),
    ("espondilite-anquilosante", "Espondilite anquilosante", "Inflamação crônica da coluna que pode limitar os movimentos quando não é tratada."),
    ("fibromialgia", "Fibromialgia", "Dor difusa, cansaço e alterações do sono, com tratamento e controle."),
    ("osteoporose", "Osteoporose", "A doença silenciosa que deixa os ossos frágeis, e como manter uma vida ativa."),
    ("terapia-imunobiologica", "Terapia imunobiológica", "Um avanço no tratamento de doenças autoimunes e inflamatórias."),
]

# Espaçamentos padrão das seções (px): topo/laterais/base
SEC = box(128, 28, 128, 28)
SEC_T = box(104, 28, 104, 28)
SEC_M = box(80, 20, 80, 20)
SEC_S = box(96, 28, 96, 28)
SEC_SM = box(64, 20, 64, 20)


def section(children, cls="", bg=None, pad=SEC, pad_mobile=SEC_M, **kw):
    kw.setdefault("gap", 56)
    kw.setdefault("gap_mobile", 36)
    extra = {"bg": bg} if bg else {}
    return con(children, cls=("dca-sec " + cls).strip(), tag=kw.pop("tag", "section"), pad=pad,
               pad_tablet=kw.pop("pad_tablet", SEC_T if pad == SEC else pad), pad_mobile=pad_mobile, **extra, **kw)


def row(children, cls="", **kw):
    kw.setdefault("dir_tablet", "column")
    kw.setdefault("dir_mobile", "column")
    return con(children, cls=cls, full=True, direction="row", **kw)


def col(children, w, cls="", **kw):
    kw.setdefault("gap", 24)
    kw.setdefault("width_tablet", 100)
    kw.setdefault("width_mobile", 100)
    return con(children, cls=cls, full=True, width=w, **kw)


def joint(extra=""):
    return ('<div class="dca-joint ' + extra + '" aria-hidden="true"><span class="dca-joint__line"></span>'
            '<span class="dca-joint__node"></span><span class="dca-joint__line"></span></div>')


def btn_row(btns, cls="", **kw):
    kw.setdefault("gap", 14)
    kw.setdefault("align", "center")
    return con(btns, cls=cls, full=True, direction="row", wrap=True, **kw)


def crumbs(items):
    lis = []
    for i, (name, url) in enumerate(items):
        if i == len(items) - 1:
            lis.append(f'<li><span aria-current="page">{name}</span></li>')
        else:
            lis.append(f'<li><a href="{url}">{name}</a></li>')
    return f'<nav class="dca-crumbs" aria-label="Você está em"><ol>{"".join(lis)}</ol></nav>'


def jsonld(data):
    return html_w('<script type="application/ld+json">' + json.dumps(data, ensure_ascii=False) + "</script>",
                  title="SEO · dados estruturados (JSON-LD)")


def faq_html(items):
    out = ['<div class="dca-faq">']
    for q, a in items:
        out.append(f'<details class="dca-reveal"><summary><h3>{q}</h3><span class="dca-faq__icon" aria-hidden="true"></span></summary>'
                   f'<div class="dca-faq__a"><p>{a}</p></div></details>')
    out.append("</div>")
    return "".join(out)


def faq_schema(items):
    import re
    return {
        "@type": "FAQPage",
        "mainEntity": [{"@type": "Question", "name": q,
                        "acceptedAnswer": {"@type": "Answer", "text": re.sub(r"<[^>]+>", "", a)}} for q, a in items],
    }


PERSON = {
    "@type": "Person",
    "@id": f"{DOMAIN}/#dra-celia",
    "name": "Dra. Célia Alcântara",
    "jobTitle": "Médica Reumatologista",
    "description": "Médica reumatologista em Fortaleza, CRM 8280, RQE 4354, com mais de 15 anos de experiência clínica.",
    "url": f"{DOMAIN}/#sobre",
    "alumniOf": [{"@type": "CollegeOrUniversity", "name": "Universidade Federal do Ceará"},
                 {"@type": "EducationalOrganization", "name": "Escola de Saúde Pública do Ceará"}],
    "hasCredential": [
        {"@type": "EducationalOccupationalCredential", "credentialCategory": "Registro profissional", "name": "CRM-CE 8280"},
        {"@type": "EducationalOccupationalCredential", "credentialCategory": "Registro de Qualificação de Especialista", "name": "RQE 4354 · Reumatologia"},
        {"@type": "EducationalOccupationalCredential", "credentialCategory": "Título de especialista", "name": "Título de Reumatologista pela Sociedade Brasileira de Reumatologia"},
        {"@type": "EducationalOccupationalCredential", "credentialCategory": "degree", "name": "Mestrado em Ciências Médicas"},
    ],
    "knowsAbout": ["Reumatologia", "Artrite psoriásica", "Espondiloartrites", "Espondilite anquilosante",
                   "Fibromialgia", "Osteoporose", "Terapia imunobiológica", "Artrite reumatoide", "Artrite idiopática juvenil"],
    "worksFor": {"@id": f"{DOMAIN}/#consultorio"},
    "sameAs": [INSTAGRAM],
}

CLINIC = {
    "@type": ["Physician", "MedicalBusiness"],
    "@id": f"{DOMAIN}/#consultorio",
    "name": "Dra. Célia Alcântara · Reumatologista em Fortaleza",
    "url": DOMAIN + "/",
    "telephone": "+55-85-99244-9528",
    "medicalSpecialty": "Rheumatologic",
    "priceRange": "Consulta particular",
    "paymentAccepted": "Particular (nota fiscal para reembolso)",
    "isAcceptingNewPatients": True,
    "availableService": [{"@type": "MedicalProcedure", "name": "Consulta presencial em reumatologia"},
                         {"@type": "MedicalProcedure", "name": "Teleconsulta em reumatologia (telemedicina)"}],
    "address": {"@type": "PostalAddress", "streetAddress": ADDRESS["street"], "addressLocality": ADDRESS["city"],
                "addressRegion": ADDRESS["state"], "postalCode": ADDRESS["zip"], "addressCountry": "BR"},
    "areaServed": [{"@type": "City", "name": "Fortaleza"}, {"@type": "Country", "name": "Brasil"}],
    "hasMap": MAPS,
    "founder": {"@id": f"{DOMAIN}/#dra-celia"},
    "sameAs": [INSTAGRAM],
}


# =====================================================================
# CABEÇALHO
# =====================================================================

FONTS_HTML = '''<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Poppins:wght@300;400;500;600&family=Pinyon+Script&display=swap">
'''


def header_markup():
    sub = "".join(f'<li><a href="/{s}/">{n}{ICONS["arrow"]}</a></li>' for s, n, _ in SPECIALTIES)
    sub_m = "".join(f'<li><a href="/{s}/">{n}</a></li>' for s, n, _ in SPECIALTIES)
    return f"""<a class="dca-skip" href="#conteudo">Pular para o conteúdo</a>
<div class="dca-header">
 <div class="dca-header__inner">
  <a class="dca-brand" href="/" aria-label="Dra. Célia Alcântara, médica reumatologista · página inicial">
   <span class="dca-brand__name">Dra. Célia <em>Alcântara</em></span>
   <span class="dca-brand__role">Reumatologista</span>
  </a>
  <nav class="dca-nav" aria-label="Menu principal">
   <ul class="dca-nav__list">
    <li class="dca-nav__item"><a class="dca-nav__link" href="/">Início</a></li>
    <li class="dca-nav__item"><a class="dca-nav__link" href="/#sobre">Sobre</a></li>
    <li class="dca-nav__item has-sub"><button class="dca-nav__link" type="button" aria-expanded="false" aria-controls="dca-sub">Especialidades{ICONS['chev']}</button>
     <ul class="dca-sub" id="dca-sub">{sub}</ul></li>
    <li class="dca-nav__item"><a class="dca-nav__link" href="/blog/">Blog</a></li>
    <li class="dca-nav__item"><a class="dca-nav__link" href="#contato">Contato</a></li>
   </ul>
  </nav>
  <div class="dca-header__actions">
   <a class="dca-header__cta dca-header__cta--top" href="{wa()}" target="_blank" rel="noopener">{ICONS['whatsapp']}Agendar consulta</a>
   <details class="dca-mmenu">
    <summary class="dca-burger" aria-label="Menu"><span class="dca-burger__line"></span><span class="dca-burger__line"></span></summary>
    <div class="dca-drawer" id="dca-drawer">
     <nav aria-label="Menu principal (celular)">
      <ul>
       <li class="dca-drawer__item"><a class="dca-drawer__link" href="/">Início</a></li>
       <li class="dca-drawer__item"><a class="dca-drawer__link" href="/#sobre">Sobre a Dra. Célia</a></li>
       <li class="dca-drawer__item"><span class="dca-drawer__label">Especialidades</span><ul class="dca-drawer__sub">{sub_m}</ul></li>
       <li class="dca-drawer__item"><a class="dca-drawer__link" href="/blog/">Blog</a></li>
       <li class="dca-drawer__item"><a class="dca-drawer__link" href="#contato">Contato</a></li>
      </ul>
     </nav>
     <div class="dca-drawer__cta"><a class="dca-header__cta" href="{wa()}" target="_blank" rel="noopener">{ICONS['whatsapp']}Agendar pelo WhatsApp</a></div>
    </div>
   </details>
  </div>
 </div>
</div>"""


def build_header():
    return [con([html_w(header_markup(), title="Cabeçalho · menu")],
                full=True, pad=box(0), gap=0, title="Cabeçalho")]


# =====================================================================
# RODAPÉ
# =====================================================================

def footer_markup():
    spec = "".join(f'<li><a href="/{s}/">{n}</a></li>' for s, n, _ in SPECIALTIES)
    return f"""<div class="dca-footer" id="contato">
 <div class="dca-footer__top">
  <p class="dca-footer__statement">Saúde e bem-estar com <em>cuidado integral.</em></p>
  <a class="dca-footer__cta" href="{wa('Rodapé')}" target="_blank" rel="noopener">{ICONS['whatsapp']}Agendar pelo WhatsApp</a>
 </div>
 <div class="dca-footer__grid">
  <div class="dca-footer__brand">
   <span class="dca-brand__name">Dra. Célia <em>Alcântara</em></span>
   <span class="dca-brand__role" style="display:block">Reumatologista</span>
   <p><strong style="font-weight:500;color:#fff">Dra. Célia Alcântara, Reumatologista.</strong> Saúde e bem-estar com cuidado integral.</p>
   <div class="dca-footer__social">
    <a href="{INSTAGRAM}" target="_blank" rel="noopener" aria-label="Instagram da Dra. Célia Alcântara">{ICONS['instagram']}</a>
    <a href="{wa('Rodapé')}" target="_blank" rel="noopener" aria-label="WhatsApp do consultório">{ICONS['whatsapp']}</a>
   </div>
  </div>
  <nav aria-label="Especialidades">
   <p class="dca-footer__title">Especialidades</p>
   <ul>{spec}</ul>
  </nav>
  <nav aria-label="Institucional">
   <p class="dca-footer__title">Institucional</p>
   <ul>
    <li><a href="/">Home</a></li>
    <li><a href="/#sobre">Sobre</a></li>
    <li><a href="/blog/">Blog</a></li>
    <li><a href="/politica-de-privacidade/">Política de privacidade</a></li>
    <li><a href="/termos-de-uso/">Termos de uso</a></li>
   </ul>
  </nav>
  <div>
   <p class="dca-footer__title">Atendimento</p>
   <ul class="dca-footer__contact">
    <li>{ICONS['whatsapp']}<a href="{wa('Rodapé')}" target="_blank" rel="noopener">WhatsApp {WA_DISPLAY}</a></li>
    <li>{ICONS['pin']}<address><a href="{MAPS}" target="_blank" rel="noopener">{ADDRESS['street']}, {ADDRESS['district']}<br>{ADDRESS['city']} - {ADDRESS['state']}, CEP {ADDRESS['zip']}</a></address></li>
    <li>{ICONS['clock']}<span>[Horário de atendimento a confirmar]</span></li>
    <li>{ICONS['mail']}<span>[E-mail a confirmar]</span></li>
    <li>{ICONS['video']}<span>Presencial em Fortaleza e telemedicina para todo o Brasil</span></li>
   </ul>
  </div>
 </div>
 <div class="dca-footer__bottom">
  <p>© <span data-dca-year>2026</span> Dra. Célia Alcântara · Médica Reumatologista · CRM 8280 | RQE 4354</p>
  <p>Responsável técnica: Dra. Célia Alcântara · CRM-CE 8280 · RQE 4354</p>
 </div>
</div>"""


def wa_float():
    return (f'<a class="dca-wa" href="{wa()}" target="_blank" rel="noopener" aria-label="Agendar consulta pelo WhatsApp">'
            f'{ICONS["whatsapp"]}<span class="dca-wa__label">Agendar pelo WhatsApp</span></a>')


def build_footer():
    return [con([
        html_w(footer_markup(), title="Rodapé · conteúdo"),
        html_w(wa_float(), title="Botão fixo de WhatsApp"),
    ], cls="dca-dark", bg=NAVY_DEEP, tag="div", pad=box(104, 28, 36, 28), pad_mobile=box(72, 20, 96, 20), gap=0, boxed=1240,
        title="Rodapé")]


# =====================================================================
# HOME
# =====================================================================

def build_home():
    hero = section([
        row([
            col([
                heading("Médica <em>Reumatologista</em> em Fortaleza", "h1", "dca-display dca-load"),
                text("<p>Meu foco é cuidar de você de forma integral e humanizada, para devolver qualidade de vida.</p>", "dca-lead dca-load"),
                btn_row([
                    button("Agendar consulta (WhatsApp)", wa("Home"), "dca-btn", WA_ICON, external=True),
                    html_w(f'<a class="dca-link" href="#sobre">Conheça a Dra. Célia {ICONS["arrow"]}</a>'),
                ], cls="dca-load", gap=(28, 14)),
                html_w('<div class="dca-credential"><span><b>CRM</b> 8280</span><span class="dca-dot"></span><span><b>RQE</b> 4354</span>'
                       '<span class="dca-dot"></span><span>Presencial em Fortaleza e telemedicina</span></div>', "dca-load"),
            ], 52, gap=30, justify="center"),
            col([
                image("Dra. Célia Alcântara, médica reumatologista em Fortaleza, em seu consultório", "dca-arch dca-img-reveal",
                      label="Foto da Dra. Célia (retrato vertical 4:5)"),
                html_w(f'<div class="dca-float-card"><span class="dca-float-card__icon">{ICONS["award"]}</span><span>'
                       '<strong>Título de Reumatologista</strong>Sociedade Brasileira de Reumatologia</span></div>', "dca-float dca-reveal"),
            ], 40, cls="dca-hero-media", width_tablet=70),
        ], gap=72, gap_mobile=56, align="center", justify="space-between"),
    ], cls="dca-clip", pad=box(56, 28, 120, 28), pad_mobile=box(32, 20, 80, 20), id="conteudo", title="Topo · H1")

    band = section([
        row([
            col([
                heading("Atendimentos presenciais em Fortaleza e por telemedicina para todo o Brasil.", "h2", "dca-h2 dca-h2--sm dca-reveal"),
            ], 40),
            col([
                html_w(f'<ul class="dca-band-facts dca-stagger">'
                       f'<li class="dca-reveal">{ICONS["pin"]}<span>Presencial<small>Cidade dos Funcionários, Fortaleza</small></span></li>'
                       f'<li class="dca-reveal">{ICONS["video"]}<span>Telemedicina<small>Para todo o Brasil</small></span></li>'
                       f'<li class="dca-reveal">{ICONS["clock"]}<span>Segunda a sexta<small>[Horários a confirmar]</small></span></li></ul>'),
                button("Agendar agora", wa("Home · atendimento"), "dca-btn dca-btn--gold dca-reveal", WA_ICON, external=True),
            ], 52, gap=32),
        ], gap=56, align="center", justify="space-between"),
    ], cls="dca-dark", bg=NAVY, pad=box(88, 28, 88, 28), pad_mobile=box(64, 20, 64, 20), title="Faixa de atendimento")

    reuma = section([
        row([
            col([
                html_w(joint(), "dca-reveal"),
                heading("O que é a <em>reumatologia?</em>", "h2", "dca-h2 dca-reveal"),
            ], 38, gap=28),
            col([
                text("<p>Reumatologia é a área da medicina que cuida das doenças que afetam articulações, ossos, músculos, tendões e ligamentos.</p>"
                     "<p>Algumas dessas doenças vão além do sistema musculoesquelético e podem atingir o corpo todo, incluindo os órgãos. "
                     "Elas são chamadas de <strong>doenças reumáticas ou reumatológicas</strong>.</p>"
                     "<p>Por isso, o reumatologista cuida de muito mais do que as “juntas”. Fadiga, mal-estar, febre e perda de peso também podem ser "
                     "sinais de uma doença reumática e merecem investigação.</p>", "dca-prose dca-reveal"),
                html_w('<ul class="dca-structures dca-stagger" aria-label="Estruturas cuidadas pela reumatologia">'
                       '<li class="dca-reveal">articulações</li><li class="dca-reveal">ossos</li><li class="dca-reveal">músculos</li>'
                       '<li class="dca-reveal">tendões</li><li class="dca-reveal">ligamentos</li></ul>'),
            ], 54, gap=36),
        ], gap=64, justify="space-between"),
    ], title="O que é a reumatologia")

    destaque = section([
        row([
            col([image("Retrato da Dra. Célia Alcântara sorrindo, reumatologista em Fortaleza", "dca-circle dca-img-reveal",
                       label="Foto da Dra. Célia (quadrada, recorte em círculo)")], 42, justify="center"),
            col([
                heading("Sofre com dores nas <em>articulações?</em>", "h2", "dca-h2 dca-reveal"),
                text("<p>Doenças autoimunes causam inflamação em várias articulações e podem atingir crianças, jovens, adultos e idosos. "
                     "Quanto mais cedo o diagnóstico, melhor o controle.</p>", "dca-lead dca-reveal"),
                button("Agende sua consulta com a Dra. Célia Alcântara", wa("Home · dores nas articulações"), "dca-btn dca-reveal", WA_ICON, external=True),
            ], 50, gap=28, justify="center"),
        ], gap=72, align="center", justify="space-between"),
    ], bg=LINEN, title="Destaque · dores nas articulações")

    index_items = "".join(
        f'<li class="dca-reveal"><a href="/{s}/"><h3>{n}</h3><p>{d}</p><span class="dca-arrow" aria-hidden="true">{ICONS["arrow"]}</span></a></li>'
        for s, n, d in SPECIALTIES)
    especialidades = section([
        row([
            col([heading("Especialidades", "h2", "dca-h2 dca-reveal")], 40),
            col([text("<p>Viver com uma doença autoimune pode ser desafiador, com altos e baixos que são únicos em cada pessoa. "
                      "Nosso objetivo é apoiar você em cada passo dessa jornada.</p>", "dca-lead dca-reveal")], 46),
        ], gap=40, align="flex-end", justify="space-between"),
        html_w(f'<ul class="dca-index dca-stagger">{index_items}</ul>', title="Lista de especialidades (links)"),
    ], id="especialidades", title="Especialidades")

    steps = [
        ("Entre em contato e seja acolhido", "Criamos um ambiente acolhedor desde o primeiro contato, para que você se sinta bem recebido e tenha confiança e tranquilidade."),
        ("Agende no formato que cabe na sua rotina", "O atendimento pode ser online ou presencial. Você escolhe o que fica mais prático e acessível para você."),
        ("O que esperar da consulta", "Um atendimento personalizado, atento às necessidades de cada paciente, com tempo para ouvir você e entender a sua história."),
        ("Tenha um cuidado integral", "Contamos com uma equipe multidisciplinar de nutricionista, fisioterapeuta, educador físico e médico da dor, todos comprometidos com o seu bem-estar e com os melhores resultados para a sua saúde."),
    ]
    cards = "".join(
        f'<li class="dca-reveal"><div class="dca-flip" tabindex="0" role="button" aria-label="Passo {i}: {t}. Toque para ler">'
        f'<div class="dca-flip__inner"><div class="dca-flip__face dca-flip__front"><span class="dca-flip__num" aria-hidden="true">{i}</span>'
        f'<div><h3>{t}</h3><span class="dca-flip__hint">{ICONS["rotate"]}Passe o mouse ou toque</span></div></div>'
        f'<div class="dca-flip__face dca-flip__back"><h3>{t}</h3><p>{d}</p></div></div></div></li>'
        for i, (t, d) in enumerate(steps, 1))
    ajudar = section([
        con([
            html_w(joint("dca-joint--center"), "dca-reveal"),
            heading("Como vou <em>ajudar você?</em>", "h2", "dca-h2 dca-center dca-reveal", align="center"),
        ], full=True, gap=28, align="center"),
        html_w(f'<ul class="dca-steps dca-stagger">{cards}</ul>', title="Cartões que viram (4 passos)"),
    ], title="Como vou ajudar você")

    convenio = section([
        con([
            row([
                col([
                    html_w(f'<span class="dca-shield">{ICONS["shield"]}</span>', "dca-reveal"),
                    heading("Aceitamos algum <em>convênio?</em>", "h2", "dca-h2 dca-reveal"),
                ], 36, gap=28),
                col([
                    text("<p>Para oferecer um atendimento de qualidade, com calma e atenção, a Dra. Célia Alcântara realiza consultas "
                         "<strong>exclusivamente no formato particular</strong>.</p>"
                         "<p>A consulta dura cerca de 60 minutos e o retorno, cerca de 40 minutos, variando conforme o caso. Além do tempo de consulta, "
                         "a Dra. analisa o questionário pré-consulta e elabora um plano de tratamento personalizado depois do atendimento.</p>"
                         "<p>Esse modelo, mais detalhado, não cabe no tempo padrão dos planos de saúde, que costuma ser de 15 minutos. Mesmo assim, "
                         "se você tem plano de saúde, pode ter direito a reembolso. Emitimos a nota fiscal para que você solicite o reembolso "
                         "diretamente ao seu convênio.</p>", "dca-prose dca-reveal"),
                    html_w('<dl class="dca-facts dca-stagger"><div class="dca-reveal"><dt>Consulta</dt><dd>cerca de 60 minutos</dd></div>'
                           '<div class="dca-reveal"><dt>Retorno</dt><dd>cerca de 40 minutos</dd></div>'
                           '<div class="dca-reveal"><dt>Reembolso</dt><dd>nota fiscal emitida</dd></div></dl>'),
                ], 58, gap=36),
            ], gap=56, justify="space-between"),
        ], cls="dca-panel", full=True, bg=LINEN, pad=box(80, 72, 80, 72), pad_tablet=box(64, 40, 64, 40), pad_mobile=box(48, 24, 48, 24)),
    ], pad=box(0, 28, 128, 28), pad_mobile=box(0, 16, 80, 16), title="Convênio")

    timeline = [
        ("2001", "Medicina", "Universidade Federal do Ceará (UFC)"),
        ("2007", "Residência em Clínica Médica", "Escola de Saúde Pública do Ceará"),
        ("2009", "Residência em Reumatologia", "Universidade Federal do Ceará (UFC)"),
        ("2013", "Mestrado em Ciências Médicas", "Com ênfase em artrite idiopática juvenil"),
        ("Gestão", "MBA em Gestão da Qualidade e Acreditação Hospitalar", ""),
        ("Gestão", "MBA em Gestão Empresarial", ""),
        ("2021", "Pós-graduação lato sensu em Experiência do Paciente", ""),
        ("2023", "Practitioner e Coach em PNL", "The Society of Neuro-Linguistic Programming"),
    ]
    tl = "".join(f'<li><span class="dca-tl-tag">{y}</span><h4>{t}</h4>' + (f"<p>{d}</p>" if d else "") + "</li>" for y, t, d in timeline)
    sobre = section([
        row([
            col([image("Dra. Célia Alcântara, reumatologista, CRM 8280, RQE 4354", "dca-arch dca-img-reveal",
                       label="Foto da Dra. Célia (retrato vertical 4:5)")], 38, cls="dca-sticky", width_tablet=70),
            col([
                heading("Sobre a Dra. <em>Célia Alcântara</em>", "h2", "dca-h2 dca-reveal"),
                html_w('<p class="dca-credline">Médica Reumatologista | CRM 8280 | RQE 4354</p>', "dca-reveal"),
                html_w('<ul class="dca-seals dca-stagger">'
                       '<li class="dca-reveal">Título de Reumatologista pela <b>Sociedade Brasileira de Reumatologia</b></li>'
                       '<li class="dca-reveal"><b>Mais de 15 anos</b> de experiência clínica</li>'
                       '<li class="dca-reveal"><b>Mais de 4.500</b> pacientes atendidos</li>'
                       '<li class="dca-reveal"><b>Mestre</b> em Ciências Médicas</li></ul>'),
                text("<p>Olá, seja bem-vindo(a)! Meu compromisso é oferecer um atendimento humanizado e acolhedor, que promova bem-estar e qualidade de vida aos meus pacientes.</p>"
                     "<p>Há mais de 15 anos escolhi a reumatologia como forma de cumprir minha missão de vida, que é acolher e ajudar quem enfrenta desafios crônicos. "
                     "Ao longo dessa trajetória, percebi que meu propósito vai além de tratar doenças. Ele é melhorar a vida das pessoas, um dia de cada vez.</p>"
                     "<p>Me formei em Medicina pela Universidade Federal do Ceará (UFC) em 2001, fiz residência em Clínica Médica pela Escola de Saúde Pública do Ceará (2007) "
                     "e me especializei em Reumatologia pela UFC (2009). Em 2013, defendi o mestrado em Ciências Médicas, com foco em artrite idiopática juvenil.</p>"
                     "<p>Desde o início da carreira, me interessei por entender como as emoções influenciam a saúde. Por isso, em 2021 concluí a pós-graduação em "
                     "Experiência do Paciente e, em 2023, a formação em PNL (Programação Neurolinguística), ferramentas que uso para ajudar meus pacientes a recuperar "
                     "a saúde física, a confiança e a esperança.</p>"
                     "<p>Sou grata por praticar uma medicina que controla sintomas e também promove saúde, confiança e uma vida melhor para cada paciente.</p>",
                     "dca-prose dca-reveal"),
                heading("Célia Alcântara", "p", "dca-signature", family="Pinyon Script", title_label="Assinatura"),
                button("Agendar consulta", wa("Home · sobre"), "dca-btn dca-btn--gold dca-reveal", WA_ICON, external=True),
            ], 54, gap=28),
        ], gap=80, justify="space-between", align="flex-start"),
        row([
            col([
                html_w(joint(), "dca-reveal"),
                heading("Formação", "h3", "dca-h2 dca-h2--sm dca-reveal"),
                text("<p>Uma trajetória que une ciência, gestão do cuidado e a experiência de quem está do outro lado da consulta.</p>", "dca-lead dca-reveal"),
            ], 30, gap=24),
            col([html_w(f'<ol class="dca-timeline">{tl}</ol>', title="Linha do tempo da formação")], 64),
        ], gap=56, justify="space-between", margin=box(48, 0, 0, 0)),
    ], cls="dca-dark", bg=NAVY, id="sobre", title="Sobre a Dra. Célia")

    quotes = "".join(
        f'<li class="dca-reveal"><figure class="dca-quote">{ICONS["quote"]}<blockquote>[Depoimento do(a) paciente {i}, '
        f'com autorização por escrito. Aguardando material da cliente.]</blockquote>'
        f'<figcaption>[Nome e inicial do sobrenome]<span>[Paciente desde / cidade]</span></figcaption></figure></li>'
        for i in range(1, 4))
    depo = section([
        con([
            heading("Depoimentos", "h2", "dca-h2 dca-reveal"),
            html_w('<p class="dca-placeholder-note">Espaço para 3 a 5 depoimentos de pacientes, com nome e inicial do sobrenome.</p>', "dca-reveal"),
        ], full=True, gap=16),
        html_w(f'<ul class="dca-quotes dca-stagger">{quotes}</ul>', title="Depoimentos (substituir textos)"),
    ], bg=LINEN, pad=box(120, 28, 120, 28), title="Depoimentos")

    press = "".join('<li class="dca-reveal">[Logo do veículo + link da matéria]</li>' for _ in range(4))
    midia = section([
        row([
            col([heading("Na mídia", "h2", "dca-h2 dca-h2--sm dca-reveal")], 30),
            col([html_w(f'<ul class="dca-press dca-stagger">{press}</ul>', title="Logos e links de matérias")], 62),
        ], gap=40, align="center", justify="space-between"),
    ], pad=box(104, 28, 40, 28), pad_mobile=box(72, 20, 24, 20), title="Na mídia")

    blog = section([
        row([
            col([
                heading("Acompanhe a <em>Dra. Célia</em>", "h2", "dca-h2 dca-reveal"),
                text("<p>Acompanhe a Dra. Célia no Instagram e leia os artigos mais recentes do blog.</p>", "dca-lead dca-reveal"),
            ], 50, gap=20),
            btn_row([
                button("Instagram", INSTAGRAM, "dca-btn dca-btn--ghost", {"value": "fab fa-instagram", "library": "fa-brands"}, external=True),
                button("Blog", "/blog/", "dca-btn"),
            ], cls="dca-reveal", justify="flex-end", justify_mobile="flex-start", width=40, width_tablet=100, width_mobile=100),
        ], gap=32, align="flex-end", justify="space-between"),
        pro("posts", {
            "_skin": "classic", "posts_post_type": "post", "classic_columns": "3", "classic_columns_tablet": "2", "classic_columns_mobile": "1",
            "classic_posts_per_page": 3, "classic_thumbnail": "top", "classic_item_ratio": {"unit": "px", "size": 0.75, "sizes": []},
            "classic_title_tag": "h3", "classic_excerpt_length": 18, "classic_meta_data": ["date"],
            "classic_read_more_text": "Ler artigo", "classic_column_gap": px(32), "classic_row_gap": px(48),
        }, "dca-posts dca-reveal", title="Últimos artigos do blog"),
    ], pad=box(80, 28, 128, 28), title="Siga-nos + blog")

    faq = [
        ("Onde a Dra. Célia Alcântara atende?", f"Os atendimentos presenciais são em Fortaleza, na {ADDRESS['street']}, {ADDRESS['district']}. A Dra. Célia também atende por telemedicina para todo o Brasil."),
        ("A consulta é por convênio?", "Não. As consultas são exclusivamente particulares. Se você tem plano de saúde, pode ter direito a reembolso: emitimos a nota fiscal para que você solicite o reembolso diretamente ao seu convênio."),
        ("Quanto tempo dura a consulta com a reumatologista?", "A consulta dura cerca de 60 minutos e o retorno, cerca de 40 minutos, variando conforme o caso. Antes, a Dra. analisa o questionário pré-consulta e, depois, elabora um plano de tratamento personalizado."),
        ("O que o reumatologista trata?", "O reumatologista cuida das doenças que afetam articulações, ossos, músculos, tendões e ligamentos, como artrite psoriásica, espondiloartrites, espondilite anquilosante, fibromialgia e osteoporose. Fadiga, mal-estar, febre e perda de peso também podem ser sinais de doença reumática."),
        ("Como agendar uma consulta?", f"O agendamento é feito pelo WhatsApp {WA_DISPLAY}. Você escolhe entre atendimento presencial em Fortaleza ou por telemedicina."),
    ]
    faqsec = section([
        row([
            col([
                heading("Perguntas <em>frequentes</em>", "h2", "dca-h2 dca-reveal"),
                text("<p>Ainda ficou alguma dúvida? Fale com a nossa equipe pelo WhatsApp.</p>", "dca-lead dca-reveal"),
                button("Falar pelo WhatsApp", wa("Home · dúvidas"), "dca-btn dca-btn--ghost dca-reveal", WA_ICON, external=True),
            ], 34, gap=24),
            col([html_w(faq_html(faq), title="Perguntas frequentes")], 60),
        ], gap=56, justify="space-between"),
        jsonld({"@context": "https://schema.org", "@graph": [
            {"@type": "WebSite", "@id": f"{DOMAIN}/#site", "url": DOMAIN + "/", "name": "Dra. Célia Alcântara · Reumatologista", "inLanguage": "pt-BR"},
            CLINIC, PERSON,
            {"@type": "MedicalWebPage", "@id": f"{DOMAIN}/#pagina", "url": DOMAIN + "/", "name": "Dra. Célia Alcântara | Médica Reumatologista em Fortaleza",
             "about": {"@id": f"{DOMAIN}/#consultorio"}, "specialty": "Rheumatologic", "inLanguage": "pt-BR", "lastReviewed": TODAY,
             "reviewedBy": {"@id": f"{DOMAIN}/#dra-celia"}},
            faq_schema(faq),
        ]}),
    ], pad=box(120, 28, 128, 28), cls="", title="Perguntas frequentes")
    faqsec["settings"]["background_background"] = "classic"
    faqsec["settings"]["background_color"] = LINEN

    return [hero, band, reuma, destaque, especialidades, ajudar, convenio, sobre, depo, midia, blog, faqsec]


# =====================================================================
# PÁGINAS DE ESPECIALIDADE (modelo único)
# =====================================================================

def reviewed_box():
    return html_w(f'<div class="dca-reviewed"><span class="dca-reviewed__mark">{ICONS["award"]}</span><span>'
                  f'<strong>Conteúdo revisado pela Dra. Célia Alcântara</strong>Médica Reumatologista · CRM 8280 · RQE 4354</span></div>',
                  "dca-load")


def condition_page(p):
    topic = p["name"]
    sections = p["sections"]
    toc = "".join(f'<li><a href="#{sid}">{label}</a></li>' for sid, label, _, _ in sections)
    toc += '<li><a href="#quando-procurar">Quando procurar</a></li><li><a href="#duvidas">Dúvidas frequentes</a></li>'
    article = []
    for i, (sid, label, h2, body) in enumerate(sections):
        article.append(heading(h2, "h2", "dca-h2 dca-h2--sm dca-reveal", eid=sid))
        article.append(text(body, "dca-prose dca-reveal"))
        if p.get("inline_image") and p["inline_image"][0] == sid:
            alt, label_img = p["inline_image"][1], p["inline_image"][2]
            article.append(image(alt, "dca-rounded dca-rounded--wide dca-img-reveal", label=label_img))

    hero = section([
        row([
            col([
                html_w(crumbs([("Início", "/"), ("Especialidades", "/#especialidades"), (topic, None)]), "dca-load"),
                heading(f'{p["h1"]}<span class="dca-h1-tail"><span class="dca-sr">: </span>{p["h1_tail"]}</span>', "h1", "dca-display dca-display--md dca-load"),
                text(f'<p>{p["subtitle"]}</p>', "dca-lead dca-load"),
                btn_row([
                    button("Agendar pelo WhatsApp", wa(topic), "dca-btn", WA_ICON, external=True),
                    html_w(f'<a class="dca-link" href="#{sections[0][0]}">Ler o guia completo {ICONS["arrow"]}</a>'),
                ], cls="dca-load", gap=(28, 14)),
                reviewed_box(),
            ], 54, gap=28, justify="center"),
            col([
                image(p["hero_alt"], "dca-rounded dca-rounded--tall dca-img-reveal", label=p["hero_label"]),
                html_w(f'<div class="dca-float-card"><span class="dca-float-card__icon">{ICONS["video"]}</span><span>'
                       '<strong>Presencial ou on-line</strong>Fortaleza e telemedicina para todo o Brasil</span></div>', "dca-float dca-reveal"),
            ], 38, cls="dca-hero-media", width_tablet=70),
        ], gap=72, gap_mobile=56, align="center", justify="space-between"),
    ], cls="dca-clip", pad=box(40, 28, 112, 28), pad_mobile=box(24, 20, 80, 20), id="conteudo", title="Topo · H1")

    body = section([
        row([
            col([html_w(f'<nav class="dca-toc" aria-label="Nesta página"><p>Nesta página</p><ol>{toc}</ol></nav>', title="Sumário lateral")],
                24, cls="dca-toc-col"),
            col(article, 68, cls="dca-article-col", gap=22),
        ], gap=64, justify="space-between", align="stretch"),
    ], pad=box(24, 28, 120, 28), pad_mobile=box(8, 20, 72, 20), title="Conteúdo")

    when = section([
        row([
            col([
                html_w(joint(), "dca-reveal"),
                heading(p["when_h2"], "h2", "dca-h2 dca-reveal", eid="quando-procurar"),
            ], 42, gap=28),
            col([
                text(f'<p>{p["when_text"]}</p><p><strong>{p["when_cta_bold"]}</strong> {p["when_cta_rest"]}</p>', "dca-prose dca-reveal"),
                button("Agendar pelo WhatsApp", wa(topic), "dca-btn dca-btn--gold dca-reveal", WA_ICON, external=True),
            ], 50, gap=32),
        ], gap=56, justify="space-between"),
    ], bg=LINEN, pad=box(112, 28, 112, 28), title="Quando procurar")

    rel = "".join(f'<li class="dca-reveal"><a href="/{s}/"><div><span class="dca-related__kicker">Leia também</span><strong>{n}</strong></div>'
                  f'<span class="dca-arrow" aria-hidden="true">{ICONS["arrow"]}</span></a></li>' for s, n in p["related"])
    schema = {"@context": "https://schema.org", "@graph": [
        {"@type": "MedicalWebPage", "@id": f"{DOMAIN}/{p['slug']}/#pagina", "url": f"{DOMAIN}/{p['slug']}/", "name": p["seo_title"],
         "description": p["meta"], "inLanguage": "pt-BR", "lastReviewed": TODAY, "specialty": "Rheumatologic",
         "audience": {"@type": "MedicalAudience", "audienceType": "Patient"},
         "reviewedBy": {"@id": f"{DOMAIN}/#dra-celia"}, "author": {"@id": f"{DOMAIN}/#dra-celia"},
         "about": dict({"@type": p.get("schema_type", "MedicalCondition"), "name": topic}, **p.get("schema_extra", {})),
         "breadcrumb": {"@id": f"{DOMAIN}/{p['slug']}/#breadcrumb"}},
        {"@type": "BreadcrumbList", "@id": f"{DOMAIN}/{p['slug']}/#breadcrumb", "itemListElement": [
            {"@type": "ListItem", "position": 1, "name": "Início", "item": DOMAIN + "/"},
            {"@type": "ListItem", "position": 2, "name": "Especialidades", "item": DOMAIN + "/#especialidades"},
            {"@type": "ListItem", "position": 3, "name": topic, "item": f"{DOMAIN}/{p['slug']}/"}]},
        dict(PERSON, **{"worksFor": {"@type": "Physician", "name": CLINIC["name"], "url": DOMAIN + "/"}}),
        faq_schema(p["faq"]),
    ]}

    faqsec = section([
        row([
            col([heading(f"Dúvidas sobre <em>{topic.lower() if p.get('lower_in_faq', True) else topic}</em>", "h2", "dca-h2 dca-reveal", eid="duvidas")], 34),
            col([html_w(faq_html(p["faq"]), title="Perguntas frequentes")], 60),
        ], gap=56, justify="space-between"),
    ], pad=box(120, 28, 96, 28), title="Perguntas frequentes")

    close = section([
        html_w(f'<ul class="dca-related dca-stagger">{rel}</ul>', title="Leia também (links internos)"),
        con([
            reviewed_box_static(),
            html_w('<p class="dca-disclaimer">Este conteúdo é informativo e não substitui a consulta médica. Procure o aconselhamento de um profissional capacitado.</p>'),
        ], full=True, direction="row", dir_tablet="column", dir_mobile="column", gap=28, align="center", justify="space-between"),
        jsonld(schema),
    ], pad=box(0, 28, 128, 28), pad_mobile=box(0, 20, 80, 20), gap=48, title="Leia também + aviso")

    return [hero, body, when, faqsec, close]


def reviewed_box_static():
    return html_w(f'<div class="dca-reviewed"><span class="dca-reviewed__mark">{ICONS["award"]}</span><span>'
                  f'<strong>Revisado em 26/10/2026 pela Dra. Célia Alcântara</strong>Médica Reumatologista · CRM 8280 · RQE 4354</span></div>',
                  "dca-reveal")


def ul(items):
    return "<ul>" + "".join(f"<li>{x}</li>" for x in items) + "</ul>"


CONDITIONS = [
    {
        "slug": "artrite-psoriasica", "name": "Artrite psoriásica", "h1": "Artrite psoriásica",
        "h1_tail": "sintomas, diagnóstico e tratamento em Fortaleza",
        "seo_title": "Artrite psoriásica em Fortaleza | Sintomas e tratamento | Dra. Célia Alcântara",
        "meta": "Entenda o que é a artrite psoriásica, quais são os sintomas, como é feito o diagnóstico e quais são as opções de tratamento. Agende sua consulta com a Dra. Célia Alcântara.",
        "keyword": "artrite psoriásica em Fortaleza",
        "subtitle": "Doença inflamatória que afeta as articulações e costuma estar ligada à psoríase.",
        "hero_alt": "Mãos com articulações dos dedos inflamadas, sinal de artrite psoriásica",
        "hero_label": "Imagem de mãos com articulações inflamadas, destaque nos dedos",
        "inline_image": ("sintomas", "Unha com alterações e dedo inchado (dactilite) na artrite psoriásica", "Foto ilustrativa de alterações nas unhas ou dedo inchado"),
        "sections": [
            ("o-que-e", "O que é", "O que é a artrite psoriásica?",
             "<p>A artrite psoriásica (APs) é uma doença inflamatória que afeta as articulações e aparece com frequência em pessoas com psoríase, condição da pele que causa manchas vermelhas e escamosas.</p>"
             "<p>Na maior parte dos casos, os sintomas articulares surgem depois das lesões de pele. Em até 10% dos pacientes, porém, eles podem aparecer antes.</p>"
             "<p>A APs faz parte do grupo das <a href=\"/espondiloartrites/\">espondiloartropatias</a>, doenças que podem atingir o esqueleto axial e periférico, causar inflamação nas ênteses (áreas onde os tendões se inserem nos ossos) e se associar ao marcador genético HLA-B27.</p>"),
            ("fatores-de-risco", "Fatores de risco", "Fatores de risco",
             "<p>A artrite psoriásica é uma doença autoimune, ou seja, o sistema imunológico ataca o próprio organismo como se ele fosse uma ameaça. A causa exata ainda é desconhecida. Além de ter psoríase, alguns fatores aumentam a chance de desenvolver a doença.</p>"
             + ul(["<strong>Idade.</strong> Aparece principalmente entre os 30 e os 50 anos, com frequência semelhante em homens e mulheres.",
                   "<strong>Etnia.</strong> Pessoas brancas têm mais chance de desenvolver a doença.",
                   "<strong>Histórico familiar.</strong> Quem tem casos na família é mais propenso a ter artrite psoriásica."])),
            ("sintomas", "Principais sintomas", "Principais sintomas",
             "<p>Os sintomas variam muito de pessoa para pessoa. Alguns pacientes têm a forma mais grave, com várias articulações comprometidas. Outros têm sintomas leves em uma ou duas articulações. A doença pode atingir um lado ou os dois lados do corpo. As articulações ficam doloridas, inchadas e quentes ao toque, como também acontece na artrite reumatoide.</p>"
             + ul(["<strong>Dor e rigidez nas articulações.</strong> Podem afetar articulações periféricas, axiais ou ambas, muitas vezes de forma assimétrica.",
                   "<strong>Alterações nas unhas.</strong> Espessamento, manchas, pequenas depressões, sangramento sob a unha e até descolamento (onicólise).",
                   "<strong>Entesite e dactilite.</strong> Inflamação nos tendões e ligamentos, com dor e inchaço em áreas como calcanhares e dedos. Pode aparecer como tendinite de Aquiles, na parte de trás do calcanhar, ou como fascite plantar, na sola do pé."])),
            ("diagnostico", "Diagnóstico", "Como é feito o diagnóstico",
             "<p>O diagnóstico envolve avaliação clínica detalhada, exames laboratoriais e de imagem, além da exclusão de outras condições, como artrite reumatoide e gota. Ele deve ser feito por um reumatologista, por isso procure sempre um médico da sua confiança.</p>"),
            ("tratamento", "Tratamento", "Tratamento",
             "<p>A artrite psoriásica ainda não tem cura. O tratamento busca controlar a inflamação, reduzir os sintomas e evitar a progressão da doença. As opções incluem:</p>"
             + ul(["<strong>Anti-inflamatórios e imunossupressores,</strong> para aliviar dor e inchaço.",
                   "<strong>Imunobiológicos,</strong> indicados para casos mais graves, que atuam sobre a resposta imunológica. Saiba mais sobre a <a href=\"/terapia-imunobiologica/\">terapia imunobiológica</a>.",
                   "<strong>Fisioterapia e exercícios,</strong> para manter a mobilidade das articulações e fortalecer os músculos."])
             + "<p>O acompanhamento regular com o reumatologista permite ajustar o tratamento conforme a evolução do quadro. Hábitos saudáveis, como atividade física e cuidado com a saúde mental, também ajudam no controle dos sintomas e na qualidade de vida.</p>"),
        ],
        "when_h2": "Quando procurar um <em>reumatologista?</em>",
        "when_text": "Se você tem psoríase e sente dor, inchaço ou rigidez nas articulações, ou percebe mudanças nas unhas, procure avaliação especializada. Quanto antes o diagnóstico, melhor o controle da doença.",
        "when_cta_bold": "Agende sua consulta com a Dra. Célia Alcântara.", "when_cta_rest": "Atendimento presencial em Fortaleza e por telemedicina.",
        "related": [("espondiloartrites", "Espondiloartrites"), ("terapia-imunobiologica", "Terapia imunobiológica")],
        "faq": [
            ("A artrite psoriásica tem cura?", "Ainda não. O tratamento busca controlar a inflamação, reduzir os sintomas e evitar a progressão da doença, com acompanhamento regular do reumatologista."),
            ("Quem tem psoríase pode ter artrite psoriásica?", "Sim. A artrite psoriásica aparece com frequência em pessoas com psoríase. Na maior parte dos casos, os sintomas articulares surgem depois das lesões de pele, mas em até 10% dos pacientes eles podem aparecer antes."),
            ("Quais são os sinais da artrite psoriásica?", "Dor e rigidez nas articulações, muitas vezes de forma assimétrica, alterações nas unhas, e inflamação de tendões e ligamentos, com dor e inchaço em calcanhares e dedos."),
            ("Quem faz o diagnóstico da artrite psoriásica?", "O reumatologista, com avaliação clínica detalhada, exames laboratoriais e de imagem, e a exclusão de outras condições, como artrite reumatoide e gota."),
        ],
        "schema_extra": {"alternateName": "APs", "associatedAnatomy": {"@type": "AnatomicalStructure", "name": "Articulações"},
                         "signOrSymptom": [{"@type": "MedicalSymptom", "name": n} for n in ["Dor e rigidez nas articulações", "Alterações nas unhas", "Entesite", "Dactilite"]],
                         "possibleTreatment": [{"@type": "MedicalTherapy", "name": n} for n in ["Anti-inflamatórios e imunossupressores", "Imunobiológicos", "Fisioterapia e exercícios"]]},
    },
    {
        "slug": "espondiloartrites", "name": "Espondiloartrites", "h1": "Espondiloartrites",
        "h1_tail": "sintomas, diagnóstico e tratamento em Fortaleza",
        "seo_title": "Espondiloartrites em Fortaleza | Sintomas, diagnóstico e tratamento | Dra. Célia Alcântara",
        "meta": "Saiba o que são as espondiloartrites, quais sintomas ficar atento, como é o diagnóstico e o tratamento. Atendimento com reumatologista em Fortaleza e online.",
        "keyword": "espondiloartrites", "lower_in_faq": True,
        "subtitle": "Grupo de doenças inflamatórias crônicas que atinge principalmente a coluna e a pelve.",
        "hero_alt": "Pessoa com dor na região lombar e na pelve, sintoma de espondiloartrite",
        "hero_label": "Imagem da coluna / região lombar e pelve",
        "sections": [
            ("o-que-sao", "O que são", "O que são as espondiloartrites?",
             "<p>As espondiloartrites são um grupo de doenças inflamatórias crônicas que afetam principalmente as articulações da coluna vertebral e da pelve. Também podem atingir articulações periféricas e outras partes do corpo, como as ênteses, que são os pontos onde os tendões se inserem nos ossos.</p>"
             "<p>Essas condições podem vir acompanhadas de manifestações em órgãos como olhos, intestino e pele. Por isso, o diagnóstico e o tratamento adequados são fundamentais para evitar complicações.</p>"
             "<p>Fazem parte desse grupo a <a href=\"/espondilite-anquilosante/\">espondilite anquilosante</a> e a <a href=\"/artrite-psoriasica/\">artrite psoriásica</a>, entre outras.</p>"),
            ("causas", "Causas", "O que causa as espondiloartrites?",
             "<p>A causa exata ainda não é totalmente conhecida. Acredita-se que fatores genéticos e ambientais atuem em conjunto. O marcador genético HLA-B27 aparece com frequência nessas doenças e aumenta a predisposição em pessoas geneticamente suscetíveis. Infecções bacterianas também podem funcionar como gatilho em algumas formas, como a artrite reativa.</p>"),
            ("sintomas", "Principais sintomas", "Principais sintomas",
             "<p>Os sintomas variam conforme o subtipo, mas geralmente incluem os itens abaixo.</p>"
             + ul(["<strong>Dor e rigidez nas costas.</strong> Principalmente na região lombar e sacroilíaca, com piora pela manhã ou depois de períodos parado e melhora com o movimento.",
                   "<strong>Inflamação em articulações periféricas.</strong> Como joelhos, tornozelos e quadris.",
                   "<strong>Entesite.</strong> Inflamação nos pontos de inserção dos tendões, como no calcanhar.",
                   "<strong>Dactilite.</strong> Inchaço de dedos das mãos ou dos pés, que ficam com aparência de “dedo em salsicha”.",
                   "<strong>Manifestações fora das articulações.</strong> Uveíte (inflamação nos olhos), lesões de pele como as da psoríase e sintomas intestinais ligados a doenças inflamatórias do intestino."])),
            ("diagnostico", "Diagnóstico", "Como é feito o diagnóstico?",
             "<p>O diagnóstico combina análise dos sintomas, histórico médico e exame físico com exames complementares.</p>"
             + ul(["<strong>Radiografia e ressonância magnética,</strong> para avaliar lesões e inflamação nas articulações.",
                   "<strong>Exames de laboratório,</strong> para detectar marcadores genéticos como o HLA-B27 e excluir outras doenças, como artrite reumatoide e gota."])
             + "<p>É essencial que o diagnóstico seja feito por um reumatologista, médico especialista em doenças inflamatórias das articulações.</p>"),
            ("tratamento", "Como tratar", "Como tratar?",
             "<p>O tratamento busca controlar a inflamação, reduzir a dor, melhorar a mobilidade e evitar danos às articulações. Inclui:</p>"
             + ul(["<strong>Anti-inflamatórios não esteroides (AINEs),</strong> para aliviar dor e inflamação.",
                   "<strong>Medicamentos modificadores do curso da doença (DMARDs),</strong> usados nas inflamações das articulações periféricas.",
                   "<strong>Terapias biológicas (imunobiológicos),</strong> indicadas para casos mais graves ou que não respondem a outros tratamentos. Veja a página sobre <a href=\"/terapia-imunobiologica/\">terapia imunobiológica</a>.",
                   "<strong>Fisioterapia e exercícios físicos,</strong> fundamentais para preservar a mobilidade da coluna e fortalecer a musculatura."])),
            ("qualidade-de-vida", "Qualidade de vida", "Cuidados e qualidade de vida",
             "<p>O acompanhamento contínuo com o reumatologista permite ajustar o tratamento sempre que necessário. Alimentação equilibrada, abandono do cigarro e exercícios regulares ajudam a controlar os sintomas e a melhorar o dia a dia.</p>"
             "<p>Para quem mora em Fortaleza, a clínica conta com equipe multiprofissional formada por nutricionistas, fisioterapeutas, educador físico, médico da dor e nutrólogo. Juntos, oferecem um cuidado integrado e completo, pensado para apoiar você em cada etapa da sua jornada de saúde.</p>"),
        ],
        "when_h2": "Quando procurar um <em>reumatologista?</em>",
        "when_text": "Se você tem dor lombar persistente, rigidez ao acordar ou histórico familiar de espondiloartrites, agende uma consulta para uma avaliação detalhada e as orientações adequadas.",
        "when_cta_bold": "Agende sua consulta com a Dra. Célia Alcântara.", "when_cta_rest": "Atendimento presencial em Fortaleza e por telemedicina.",
        "related": [("espondilite-anquilosante", "Espondilite anquilosante"), ("artrite-psoriasica", "Artrite psoriásica")],
        "faq": [
            ("Quais doenças fazem parte das espondiloartrites?", "Fazem parte desse grupo a espondilite anquilosante e a artrite psoriásica, entre outras, como a artrite reativa."),
            ("O que é o HLA-B27?", "É um marcador genético que aparece com frequência nas espondiloartrites e aumenta a predisposição em pessoas geneticamente suscetíveis. A pesquisa do HLA-B27 é um dos exames que ajudam no diagnóstico."),
            ("Dor nas costas que piora pela manhã pode ser espondiloartrite?", "Pode ser um sinal. Na espondiloartrite, a dor e a rigidez nas costas costumam piorar pela manhã ou depois de períodos parado e melhorar com o movimento. Nesses casos, procure um reumatologista."),
            ("Como é o tratamento das espondiloartrites?", "Inclui anti-inflamatórios não esteroides, medicamentos modificadores do curso da doença, terapias biológicas nos casos indicados, além de fisioterapia e exercícios para preservar a mobilidade da coluna."),
        ],
        "schema_extra": {"alternateName": "Espondiloartropatias",
                         "signOrSymptom": [{"@type": "MedicalSymptom", "name": n} for n in ["Dor e rigidez nas costas", "Entesite", "Dactilite", "Uveíte"]],
                         "possibleTreatment": [{"@type": "MedicalTherapy", "name": n} for n in ["AINEs", "DMARDs", "Imunobiológicos", "Fisioterapia"]]},
    },
    {
        "slug": "espondilite-anquilosante", "name": "Espondilite anquilosante", "h1": "Espondilite anquilosante",
        "h1_tail": "sintomas, diagnóstico e tratamento em Fortaleza",
        "seo_title": "Espondilite anquilosante em Fortaleza | Sintomas e tratamento | Dra. Célia Alcântara",
        "meta": "Dor lombar e rigidez ao acordar podem ser sinais de espondilite anquilosante. Entenda sintomas, diagnóstico e tratamento com a Dra. Célia Alcântara.",
        "keyword": "espondilite anquilosante",
        "subtitle": "Doença inflamatória crônica que atinge a coluna e pode limitar os movimentos quando não é tratada.",
        "hero_alt": "Pessoa com rigidez na coluna ao acordar, sintoma de espondilite anquilosante",
        "hero_label": "Imagem de coluna / rigidez lombar",
        "sections": [
            ("o-que-e", "O que é", "O que é a espondilite anquilosante?",
             "<p>A espondilite anquilosante (EA) é uma doença inflamatória crônica que afeta principalmente a coluna vertebral e as articulações sacroilíacas. Sem tratamento adequado, pode levar à fusão dos ossos e à perda de mobilidade. É mais comum em homens jovens, mas também pode atingir mulheres e pessoas de outras idades.</p>"
             "<p>É uma forma de <a href=\"/espondiloartrites/\">espondiloartrite</a>. A inflamação nas articulações da coluna causa dor e rigidez e, em casos avançados, a fusão das vértebras, o que pode resultar em postura curvada e limitação importante dos movimentos.</p>"
             "<p>Pesquisas mostram forte relação entre a EA e o gene HLA-B27, presente em até 90% dos casos diagnosticados. Ter o gene, porém, não significa que a doença vai se desenvolver. Fatores ambientais, como infecções intestinais, podem funcionar como gatilho da inflamação.</p>"),
            ("sintomas", "Sintomas", "Sintomas da espondilite anquilosante",
             ul(["<strong>Dor lombar e rigidez pela manhã.</strong> Melhoram com atividade física e pioram com o repouso.",
                 "<strong>Rigidez na coluna.</strong> Progride de baixo para cima e reduz a mobilidade.",
                 "<strong>Dor no quadril, nos joelhos e nos ombros.</strong> As articulações periféricas também podem ser afetadas.",
                 "<strong>Fadiga e mal-estar.</strong> Sintomas gerais ligados à inflamação crônica.",
                 "<strong>Manifestações fora das articulações.</strong> Uveíte (inflamação nos olhos), doenças inflamatórias do intestino e problemas cardiovasculares."])),
            ("diagnostico", "Diagnóstico", "Como é feito o diagnóstico?",
             "<p>O diagnóstico se baseia em um conjunto de informações.</p>"
             + ul(["<strong>Histórico clínico e exame físico,</strong> para identificar sintomas típicos, como a dor lombar inflamatória.",
                   "<strong>Exames de imagem.</strong> Radiografia e ressonância magnética mostram alterações nas articulações sacroilíacas e na coluna.",
                   "<strong>Exames de laboratório,</strong> como a pesquisa do HLA-B27 e testes para excluir outras condições, como artrite reumatoide e osteoartrose."])),
            ("tratamento", "Tratamento", "Tratamento",
             "<p>A espondilite anquilosante ainda não tem cura, mas pode ser controlada. O tratamento busca aliviar os sintomas, reduzir a inflamação e prevenir complicações.</p>"
             + ul(["<strong>Anti-inflamatórios não esteroides (AINEs),</strong> primeira linha no controle da dor e da inflamação.",
                   "<strong>Terapias biológicas (imunobiológicos),</strong> indicadas para casos mais graves ou quando os AINEs não bastam. Saiba mais sobre a <a href=\"/terapia-imunobiologica/\">terapia imunobiológica</a>.",
                   "<strong>Fisioterapia,</strong> essencial para preservar a mobilidade da coluna, fortalecer a musculatura e melhorar a postura.",
                   "<strong>Exercícios regulares.</strong> Alongamentos, pilates e natação são muito recomendados."])),
            ("qualidade-de-vida", "Qualidade de vida", "Qualidade de vida além do tratamento",
             "<p>Hábitos saudáveis fazem diferença no controle da doença.</p>"
             + ul(["Manter uma rotina de exercícios físicos",
                   "Evitar o cigarro, que pode piorar a progressão da doença",
                   "Ter uma alimentação equilibrada e controlar fatores de risco como a obesidade",
                   "Fazer acompanhamento médico regular para monitorar a evolução"])),
        ],
        "when_h2": "Quando procurar um <em>médico?</em>",
        "when_text": "Se você sente dor lombar persistente, rigidez ao acordar ou tem histórico familiar de doenças reumáticas, não ignore os sintomas. O diagnóstico precoce é essencial para evitar complicações e preservar a sua qualidade de vida.",
        "when_cta_bold": "Agende uma consulta com a Dra. Célia Alcântara", "when_cta_rest": "para esclarecer suas dúvidas e iniciar o tratamento adequado.",
        "related": [("espondiloartrites", "Espondiloartrites"), ("terapia-imunobiologica", "Terapia imunobiológica")],
        "faq": [
            ("A espondilite anquilosante tem cura?", "Ainda não, mas pode ser controlada. O tratamento busca aliviar os sintomas, reduzir a inflamação e prevenir complicações, como a perda de mobilidade da coluna."),
            ("Quem tem o gene HLA-B27 vai ter espondilite anquilosante?", "Não necessariamente. O HLA-B27 está presente em até 90% dos casos diagnosticados, mas ter o gene não significa que a doença vai se desenvolver."),
            ("Quais exercícios são indicados na espondilite anquilosante?", "Alongamentos, pilates e natação são muito recomendados. A fisioterapia também é essencial para preservar a mobilidade da coluna e melhorar a postura."),
            ("Quem é mais afetado pela espondilite anquilosante?", "É mais comum em homens jovens, mas também pode atingir mulheres e pessoas de outras idades."),
        ],
        "schema_extra": {"alternateName": "EA",
                         "signOrSymptom": [{"@type": "MedicalSymptom", "name": n} for n in ["Dor lombar e rigidez pela manhã", "Rigidez na coluna", "Fadiga", "Uveíte"]],
                         "possibleTreatment": [{"@type": "MedicalTherapy", "name": n} for n in ["AINEs", "Imunobiológicos", "Fisioterapia", "Exercícios regulares"]]},
    },
    {
        "slug": "fibromialgia", "name": "Fibromialgia", "h1": "Fibromialgia",
        "h1_tail": "sintomas, diagnóstico e tratamento em Fortaleza",
        "seo_title": "Fibromialgia em Fortaleza | Sintomas, diagnóstico e tratamento | Dra. Célia Alcântara",
        "meta": "Dor pelo corpo, cansaço e sono ruim podem ser fibromialgia. Entenda os sintomas, o diagnóstico e o tratamento com reumatologista em Fortaleza ou online.",
        "keyword": "fibromialgia em Fortaleza",
        "subtitle": "Síndrome crônica marcada por dor difusa, cansaço e alterações do sono, que tem tratamento e controle.",
        "hero_alt": "Mulher com dor difusa nos ombros e cansaço, sintomas de fibromialgia",
        "hero_label": "Imagem de mulher com dor difusa / cansaço",
        "sections": [
            ("o-que-e", "O que é", "O que é a fibromialgia?",
             "<p>A fibromialgia é uma condição crônica caracterizada por dor musculoesquelética difusa, sensibilidade em várias partes do corpo e sintomas como fadiga e distúrbios do sono. Atinge principalmente mulheres entre 30 e 50 anos, mas pode ocorrer em qualquer idade e em qualquer gênero.</p>"
             "<p>É classificada como síndrome porque reúne um conjunto de sintomas que vão além da dor. Ela não causa inflamação nem lesão nos tecidos, mas afeta diretamente a qualidade de vida. Estudos recentes indicam que há alterações na forma como o sistema nervoso processa os sinais de dor, o que amplifica a sensibilidade. Por isso é chamada de síndrome de amplificação da dor.</p>"
             "<p>Fatores genéticos e gatilhos como estresse intenso, infecções ou traumas físicos podem ter papel importante no surgimento da doença.</p>"),
            ("sintomas", "Sintomas", "Principais sintomas",
             "<p>A intensidade e a frequência variam de pessoa para pessoa. Os mais comuns são os seguintes.</p>"
             + ul(["<strong>Dor generalizada.</strong> Sensação profunda e constante, muitas vezes descrita como queimação ou aperto, que atinge os dois lados do corpo e dura pelo menos três meses.",
                   "<strong>Fadiga crônica.</strong> Cansaço persistente, mesmo depois de descansar.",
                   "<strong>Distúrbios do sono.</strong> Dificuldade para dormir ou para ter um sono reparador, muitas vezes associada à síndrome das pernas inquietas.",
                   "<strong>Dificuldade de concentração.</strong> Conhecida como “fibro fog”, afeta a memória e a clareza mental.",
                   "<strong>Sensibilidade aumentada.</strong> Reação exagerada a luz, barulho ou mudanças de temperatura.",
                   "<strong>Outros sintomas.</strong> Dor de cabeça, síndrome do intestino irritável e alterações de humor, como ansiedade e depressão."])),
            ("diagnostico", "Diagnóstico", "Como funciona o diagnóstico?",
             "<p>O diagnóstico da fibromialgia é clínico e segue os critérios do Colégio Americano de Reumatologia (ACR). Não existe exame de laboratório específico, mas alguns podem ser pedidos para descartar doenças com sintomas parecidos, como artrite reumatoide, lúpus e hipotireoidismo.</p>"
             "<p>Questionários de avaliação e ferramentas digitais vêm sendo estudados para ajudar a identificar a síndrome mais cedo.</p>"),
            ("tratamento", "Tratamento", "Tratamento da fibromialgia",
             "<p>A fibromialgia ainda não tem cura, mas o tratamento multidisciplinar ajuda a controlar os sintomas e a melhorar a qualidade de vida. Ele combina medicamentos e medidas sem remédio.</p>"
             "<p>Entre os medicamentos que podem ser usados estão analgésicos, anti-inflamatórios, antidepressivos tricíclicos, inibidores da recaptação de noradrenalina e serotonina, anticonvulsivantes e relaxantes musculares. A escolha é individual e feita pelo médico.</p>"
             "<p>As medidas sem remédio são tão importantes quanto os medicamentos. Entre elas estão atividade física regular com supervisão de um educador físico e acompanhamento psicológico.</p>"),
            ("dicas", "Dicas para o dia a dia", "Dicas para o dia a dia",
             ul(["<strong>Exercícios físicos regulares.</strong> Atividades aeróbicas leves, como caminhada e natação, reduzem a dor e melhoram o sono.",
                 "<strong>Terapia cognitivo-comportamental (TCC).</strong> Ajuda a lidar com o impacto emocional da síndrome.",
                 "<strong>Fisioterapia e técnicas de relaxamento.</strong> Massagem, alongamentos e mindfulness.",
                 "<strong>Rotina de sono.</strong> Evite cafeína à noite e crie um ambiente favorável ao descanso.",
                 "<strong>Alimentação equilibrada,</strong> com nutrientes anti-inflamatórios, que contribui para o bem-estar geral.",
                 "<strong>Controle do estresse.</strong> Yoga, meditação e hobbies ajudam a reduzir os sintomas."])),
        ],
        "when_h2": "Quando procurar <em>ajuda especializada?</em>",
        "when_text": "Se você sente dor persistente em várias partes do corpo, cansaço extremo e dificuldade de concentração, procure um reumatologista. O diagnóstico precoce e o manejo adequado fazem diferença na sua qualidade de vida.",
        "when_cta_bold": "Agende uma consulta com a Dra. Célia Alcântara", "when_cta_rest": "e receba um acompanhamento completo e personalizado, com apoio da nossa equipe multidisciplinar.",
        "related": [("osteoporose", "Osteoporose"), ("espondiloartrites", "Espondiloartrites")],
        "faq": [
            ("A fibromialgia tem cura?", "Ainda não, mas tem tratamento e controle. O tratamento multidisciplinar combina medicamentos e medidas sem remédio, como atividade física supervisionada e acompanhamento psicológico."),
            ("Existe exame para diagnosticar fibromialgia?", "Não existe exame de laboratório específico. O diagnóstico é clínico e segue os critérios do Colégio Americano de Reumatologia (ACR). Alguns exames podem ser pedidos para descartar doenças parecidas, como artrite reumatoide, lúpus e hipotireoidismo."),
            ("O que é “fibro fog”?", "É a dificuldade de concentração associada à fibromialgia, que afeta a memória e a clareza mental."),
            ("Quem é mais afetado pela fibromialgia?", "Atinge principalmente mulheres entre 30 e 50 anos, mas pode ocorrer em qualquer idade e em qualquer gênero."),
        ],
        "schema_extra": {"alternateName": "Síndrome de amplificação da dor",
                         "signOrSymptom": [{"@type": "MedicalSymptom", "name": n} for n in ["Dor generalizada", "Fadiga crônica", "Distúrbios do sono", "Dificuldade de concentração"]],
                         "possibleTreatment": [{"@type": "MedicalTherapy", "name": n} for n in ["Tratamento multidisciplinar", "Atividade física supervisionada", "Terapia cognitivo-comportamental"]]},
    },
    {
        "slug": "osteoporose", "name": "Osteoporose", "h1": "Osteoporose",
        "h1_tail": "sintomas, prevenção e tratamento em Fortaleza",
        "seo_title": "Osteoporose em Fortaleza | Sintomas, prevenção e tratamento | Dra. Célia Alcântara",
        "meta": "A osteoporose é silenciosa e aumenta o risco de fraturas. Saiba como identificar, prevenir e tratar com acompanhamento de reumatologista em Fortaleza.",
        "keyword": "osteoporose em Fortaleza",
        "subtitle": "A doença silenciosa que deixa os ossos frágeis. Com diagnóstico e tratamento, é possível manter uma vida ativa.",
        "hero_alt": "Mulher madura caminhando ao ar livre, vida ativa com osteoporose controlada",
        "hero_label": "Imagem de mulher madura ativa / saúde dos ossos",
        "sections": [
            ("o-que-e", "O que é", "O que é a osteoporose?",
             "<p>A osteoporose é uma doença metabólica que reduz a densidade dos ossos e deteriora a sua microarquitetura. Com isso, os ossos ficam mais frágeis e mais sujeitos a fraturas. É uma condição comum e silenciosa, principalmente em mulheres após a menopausa, mas também pode atingir homens e pessoas mais jovens com fatores de risco específicos.</p>"
             "<p>Os ossos mais afetados são os da coluna, do quadril e dos punhos. As fraturas de vértebras e de fêmur são as mais graves, porque podem comprometer a mobilidade e a qualidade de vida.</p>"),
            ("fatores-de-risco", "Causas e fatores de risco", "Principais causas e fatores de risco",
             ul(["Predisposição genética", "Alterações hormonais", "Idade avançada", "Sedentarismo",
                 "Alimentação pobre em cálcio e vitamina D", "Tabagismo e consumo excessivo de álcool"])),
            ("sintomas", "Sintomas", "Quais são os sintomas?",
             "<p>Na maioria dos casos a osteoporose não dá sintomas até a primeira fratura, e por isso é chamada de “doença silenciosa”. Alguns sinais, porém, podem indicar fragilidade óssea.</p>"
             + ul(["<strong>Dor nas costas,</strong> causada por fraturas ou colapso de vértebras",
                   "<strong>Perda de altura</strong> ao longo do tempo",
                   "<strong>Postura encurvada,</strong> chamada de cifose",
                   "<strong>Fraturas</strong> após quedas leves ou traumas mínimos"])
             + "<p>Esses sinais surgem de forma gradual e muitas vezes passam despercebidos até a doença estar avançada.</p>"),
            ("tratamento", "Tratamento", "Como funciona o tratamento?",
             "<p>A osteoporose ainda não tem cura, mas pode ser controlada. O tratamento busca reduzir a perda óssea, aumentar a densidade mineral dos ossos e prevenir fraturas. Além dos medicamentos, que o médico indica caso a caso, alguns cuidados fazem parte do tratamento.</p>"
             + ul(["<strong>Alimentação rica em cálcio e vitamina D.</strong> Leite, queijos, iogurtes, peixes e vegetais verdes.",
                   "<strong>Exposição ao sol,</strong> que ajuda o corpo a produzir vitamina D, essencial para a saúde dos ossos.",
                   "<strong>Atividade física regular.</strong> Exercícios de impacto moderado, como caminhada e musculação, fortalecem os ossos e melhoram o equilíbrio, o que reduz o risco de quedas."])),
            ("prevencao-de-quedas", "Prevenção de quedas", "Prevenção de quedas",
             "<p>Como as fraturas são a principal complicação da osteoporose, evitar quedas é essencial. Ambientes seguros, calçados adequados e adaptações em casa, como barras de apoio, ajudam a evitar acidentes.</p>"
             "<p>Viver com osteoporose pode ser desafiador. Com diagnóstico precoce e tratamento adequado, é possível levar uma vida ativa e saudável, com alimentação equilibrada, atividade física e acompanhamento médico.</p>"),
        ],
        "when_h2": "Quando procurar <em>ajuda especializada?</em>",
        "when_text": "Se você tem fatores de risco para osteoporose, dor nas costas ou fraturas frequentes, procure um reumatologista ou outro médico especializado. O acompanhamento regular previne complicações graves e ajuda a manter a saúde dos ossos em dia.",
        "when_cta_bold": "Agende sua consulta com a Dra. Célia Alcântara", "when_cta_rest": "e conte com uma abordagem personalizada para o diagnóstico e o tratamento da osteoporose. Estamos aqui para cuidar de você.",
        "related": [("fibromialgia", "Fibromialgia"), ("terapia-imunobiologica", "Terapia imunobiológica")],
        "faq": [
            ("Por que a osteoporose é chamada de doença silenciosa?", "Porque, na maioria dos casos, ela não dá sintomas até a primeira fratura. Sinais como dor nas costas, perda de altura e postura encurvada surgem de forma gradual e muitas vezes passam despercebidos."),
            ("Quem tem mais risco de ter osteoporose?", "É mais comum em mulheres após a menopausa. Também aumentam o risco: predisposição genética, alterações hormonais, idade avançada, sedentarismo, alimentação pobre em cálcio e vitamina D, tabagismo e consumo excessivo de álcool."),
            ("A osteoporose tem cura?", "Ainda não, mas pode ser controlada. O tratamento busca reduzir a perda óssea, aumentar a densidade mineral dos ossos e prevenir fraturas."),
            ("Como prevenir quedas com osteoporose?", "Ambientes seguros, calçados adequados e adaptações em casa, como barras de apoio, ajudam a evitar acidentes. Exercícios que melhoram o equilíbrio também reduzem o risco de quedas."),
        ],
        "schema_extra": {"signOrSymptom": [{"@type": "MedicalSymptom", "name": n} for n in ["Dor nas costas", "Perda de altura", "Postura encurvada (cifose)", "Fraturas após traumas mínimos"]],
                         "riskFactor": [{"@type": "MedicalRiskFactor", "name": n} for n in ["Predisposição genética", "Alterações hormonais", "Idade avançada", "Sedentarismo", "Tabagismo"]]},
    },
    {
        "slug": "terapia-imunobiologica", "name": "Terapia imunobiológica", "h1": "Terapia imunobiológica",
        "h1_tail": "indicações, benefícios e acompanhamento em Fortaleza",
        "seo_title": "Terapia imunobiológica em Fortaleza | Dra. Célia Alcântara",
        "meta": "Conheça a terapia imunobiológica, tratamento indicado para doenças autoimunes e inflamatórias quando os tratamentos convencionais não bastam. Agende sua consulta.",
        "keyword": "terapia imunobiológica em Fortaleza", "schema_type": "MedicalTherapy", "lower_in_faq": True,
        "subtitle": "Um avanço no tratamento de doenças autoimunes e inflamatórias.",
        "hero_alt": "Profissional de saúde preparando medicação imunobiológica",
        "hero_label": "Imagem de tratamento / medicação imunobiológica",
        "sections": [
            ("o-que-sao", "O que são", "O que são os imunobiológicos?",
             "<p>As terapias imunobiológicas representam um avanço importante no tratamento de doenças autoimunes e inflamatórias. Elas oferecem novas opções para pacientes que não respondem bem aos tratamentos convencionais.</p>"
             "<p>Esses medicamentos regulam a resposta do sistema imunológico e transformaram o tratamento de condições como <a href=\"/blog/artrite-reumatoide-fatores-de-risco/\">artrite reumatoide</a>, <a href=\"/espondilite-anquilosante/\">espondilite anquilosante</a>, <a href=\"/artrite-psoriasica/\">artrite psoriásica</a>, psoríase e doença de Crohn, entre outras.</p>"),
            ("indicacao", "Para quem é indicada", "Para quem é indicada?",
             "<p>A indicação é sempre individual e feita pelo médico, depois de avaliar o tipo de doença, a gravidade e a resposta do paciente aos tratamentos anteriores. Em geral, é considerada em casos mais graves ou quando os medicamentos convencionais não controlam a doença.</p>"),
            ("beneficios", "Benefícios", "Benefícios",
             "<p>O uso dos imunobiológicos tem trazido resultados muito positivos em diversas doenças.</p>"
             + ul(["<strong>Controle efetivo da inflamação.</strong> Pacientes que respondem pouco aos tratamentos tradicionais, como os corticoides, podem ter um controle mais eficaz.",
                   "<strong>Prevenção de danos nas articulações e nos órgãos.</strong> Ao reduzir a inflamação de maneira direcionada, a terapia ajuda a evitar lesões permanentes, principalmente na artrite reumatoide e na espondilite anquilosante.",
                   "<strong>Melhora da qualidade de vida.</strong> Com menos dor e menos sintomas, o paciente ganha mobilidade e bem-estar.",
                   "<strong>Tratamento personalizado.</strong> A terapia pode ser adaptada ao tipo de doença e à resposta de cada paciente."])),
            ("acompanhamento", "Acompanhamento", "Acompanhamento",
             "<p>Os imunobiológicos exigem avaliação cuidadosa e acompanhamento regular com o reumatologista, para que o tratamento seja seguro e eficaz ao longo do tempo.</p>"),
        ],
        "when_h2": "Saiba se a terapia é <em>indicada para você</em>",
        "when_text": "A indicação dos imunobiológicos é sempre individual. Na consulta, a Dra. Célia avalia o tipo de doença, a gravidade e a sua resposta aos tratamentos anteriores.",
        "when_cta_bold": "Agende já a sua consulta", "when_cta_rest": "e saiba como a Dra. Célia Alcântara pode ajudar você.",
        "related": [("artrite-psoriasica", "Artrite psoriásica"), ("espondilite-anquilosante", "Espondilite anquilosante")],
        "faq": [
            ("Para quais doenças a terapia imunobiológica é usada?", "Os imunobiológicos transformaram o tratamento de condições como artrite reumatoide, espondilite anquilosante, artrite psoriásica, psoríase e doença de Crohn, entre outras."),
            ("Quem pode fazer terapia imunobiológica?", "A indicação é sempre individual e feita pelo médico, depois de avaliar o tipo de doença, a gravidade e a resposta aos tratamentos anteriores. Em geral, é considerada em casos mais graves ou quando os medicamentos convencionais não controlam a doença."),
            ("A terapia imunobiológica precisa de acompanhamento?", "Sim. Os imunobiológicos exigem avaliação cuidadosa e acompanhamento regular com o reumatologista, para que o tratamento seja seguro e eficaz ao longo do tempo."),
        ],
        "schema_extra": {"alternateName": "Imunobiológicos", "relevantSpecialty": "Rheumatologic"},
    },
]
for c in CONDITIONS:
    c["schema_extra"] = {k: v for k, v in c.get("schema_extra", {}).items() if v is not None}


# =====================================================================
# BLOG
# =====================================================================

TOPICS = [("Todos", "/blog/"), ("Artrite", "/categoria/artrite/"), ("Coluna", "/categoria/coluna/"),
          ("Fibromialgia", "/categoria/fibromialgia/"), ("Ossos", "/categoria/osteoporose/"), ("Tratamentos", "/categoria/tratamentos/")]


def build_blog():
    topics = "".join(f'<li><a href="{u}"' + (' aria-current="page"' if i == 0 else "") + f">{n}</a></li>" for i, (n, u) in enumerate(TOPICS))
    hero = section([
        html_w(crumbs([("Início", "/"), ("Blog", None)]), "dca-load"),
        row([
            col([heading('Blog de <em>reumatologia</em><span class="dca-h1-tail"><span class="dca-sr">: </span>informação confiável, em linguagem simples</span>',
                         "h1", "dca-display dca-display--md dca-load")], 56),
            col([text("<p>Aqui você encontra artigos sobre doenças reumáticas, sintomas, tratamentos e hábitos que ajudam a viver melhor. "
                      "Quanto mais conhecimento, mais autonomia para cuidar da sua saúde.</p>", "dca-lead dca-load")], 38),
        ], gap=40, align="flex-end", justify="space-between"),
        html_w(f'<nav aria-label="Filtrar artigos por tema"><ul class="dca-topics">{topics}</ul></nav>', "dca-load", title="Filtro por tema (links de categorias)"),
    ], pad=box(40, 28, 64, 28), pad_mobile=box(24, 20, 48, 20), gap=40, id="conteudo", title="Topo · H1")

    grid = section([
        pro("posts", {
            "_skin": "classic", "posts_post_type": "post", "classic_columns": "3", "classic_columns_tablet": "2", "classic_columns_mobile": "1",
            "classic_posts_per_page": 6, "classic_thumbnail": "top", "classic_item_ratio": {"unit": "px", "size": 0.75, "sizes": []},
            "classic_title_tag": "h2", "classic_excerpt_length": 20, "classic_meta_data": ["date"],
            "classic_read_more_text": "Ler artigo", "classic_column_gap": px(32), "classic_row_gap": px(56),
            "pagination_type": "numbers", "pagination_page_limit": "", "pagination_numbers_shorten": "yes",
        }, "dca-posts dca-reveal", title="Grade de artigos · 6 por página"),
    ], pad=box(0, 28, 120, 28), pad_mobile=box(0, 20, 80, 20), title="Artigos")

    cta = section([
        row([
            col([heading("Ficou com alguma <em>dúvida?</em>", "h2", "dca-h2 dca-reveal"),
                 text("<p>Fale com a nossa equipe pelo WhatsApp. Atendimento presencial em Fortaleza e por telemedicina para todo o Brasil.</p>", "dca-lead dca-reveal")], 56, gap=20),
            btn_row([button("Fale com a nossa equipe pelo WhatsApp", wa("Blog"), "dca-btn dca-btn--gold", WA_ICON, external=True)],
                    cls="dca-reveal", justify="flex-end", justify_mobile="flex-start", width=36, width_tablet=100, width_mobile=100),
        ], gap=40, align="center", justify="space-between"),
        jsonld({"@context": "https://schema.org", "@graph": [
            {"@type": "Blog", "@id": f"{DOMAIN}/blog/#blog", "url": f"{DOMAIN}/blog/", "name": "Blog | Dicas e informação sobre reumatologia | Dra. Célia Alcântara",
             "description": "Artigos da Dra. Célia Alcântara sobre artrite, fibromialgia, osteoporose e outras doenças reumáticas, com informação clara para cuidar da sua saúde.",
             "inLanguage": "pt-BR", "author": {"@type": "Person", "name": "Dra. Célia Alcântara", "url": f"{DOMAIN}/#sobre"}},
            {"@type": "BreadcrumbList", "itemListElement": [
                {"@type": "ListItem", "position": 1, "name": "Início", "item": DOMAIN + "/"},
                {"@type": "ListItem", "position": 2, "name": "Blog", "item": f"{DOMAIN}/blog/"}]},
        ]}),
    ], bg=LINEN, pad=box(96, 28, 96, 28), title="Chamada WhatsApp")
    return [hero, grid, cta]


# =====================================================================
# MODELO DE POST (Theme Builder · Single Post)
# =====================================================================

def build_single():
    top = section([
        html_w('<nav class="dca-crumbs" aria-label="Você está em"><ol><li><a href="/">Início</a></li><li><a href="/blog/">Blog</a></li>'
               '<li><span aria-current="page">Artigo</span></li></ol></nav>', "dca-load", title="Breadcrumb"),
        pro("theme-post-title", {"header_size": "h1"}, "dca-h1-post dca-load", title="Título do post (H1)"),
        pro("post-info", {"view": "inline", "icon_list": [
            {"_id": "dcad01", "type": "date", "selected_icon": {"value": "far fa-calendar", "library": "fa-regular"}},
            {"_id": "dcaa01", "type": "author", "selected_icon": {"value": "far fa-user-circle", "library": "fa-regular"}},
        ]}, "dca-post-meta dca-load", title="Data e autora"),
    ], pad=box(40, 28, 48, 28), pad_mobile=box(24, 20, 36, 20), gap=24, boxed=860, id="conteudo", title="Topo do artigo")

    cover = section([
        pro("theme-post-featured-image", {"image_size": "full"}, "dca-featured dca-img-reveal", title="Imagem de capa"),
    ], pad=box(0, 28, 56, 28), pad_mobile=box(0, 16, 40, 16), boxed=1080, title="Capa")

    body = section([
        pro("theme-post-content", {}, "dca-prose dca-article", title="Conteúdo do artigo"),
        html_w('<p class="dca-disclaimer">Este conteúdo é informativo e não substitui a consulta médica. Procure o aconselhamento de um profissional capacitado.</p>'),
        con([
            html_w('<p class="dca-small" style="margin:0">Compartilhe este artigo</p>'),
            pro("share-buttons", {"share_buttons": [
                {"_id": "dcas01", "button": "whatsapp"}, {"_id": "dcas02", "button": "facebook"},
                {"_id": "dcas03", "button": "linkedin"}, {"_id": "dcas04", "button": "email"}],
                "view": "icon", "skin": "minimal", "shape": "circle", "columns": "0", "alignment": "left"}, "dca-share", title="Compartilhar"),
        ], full=True, direction="row", gap=18, align="center", wrap=True),
        html_w('<div class="dca-author"><span class="dca-author__avatar" aria-hidden="true">C</span><div><strong>Dra. Célia Alcântara</strong>'
               '<p>Médica Reumatologista · CRM 8280 · RQE 4354. Título de Reumatologista pela Sociedade Brasileira de Reumatologia, mestre em Ciências Médicas e mais de 15 anos de experiência clínica.</p>'
               '<p><a class="dca-link" href="/#sobre">Conheça a Dra. Célia</a></p></div></div>', "dca-reveal", title="Sobre a autora (E-E-A-T)"),
    ], pad=box(0, 28, 96, 28), pad_mobile=box(0, 20, 64, 20), gap=40, boxed=760, title="Artigo")

    cta = section([
        con([
            heading("Sentiu algum desses <em>sintomas?</em>", "h2", "dca-h2 dca-h2--sm dca-reveal"),
            text("<p>Agende sua consulta com a Dra. Célia Alcântara, presencial em Fortaleza ou por telemedicina.</p>", "dca-lead dca-reveal"),
            button("Agendar pelo WhatsApp", wa("Blog · artigo"), "dca-btn dca-btn--gold dca-reveal", WA_ICON, external=True),
        ], cls="dca-panel dca-dark", full=True, bg=NAVY, gap=22, pad=box(64, 64, 64, 64), pad_mobile=box(44, 24, 44, 24)),
    ], pad=box(0, 28, 104, 28), pad_mobile=box(0, 16, 72, 16), boxed=1080, title="Caixa de chamada no fim do post")

    related = section([
        heading("Leia <em>também</em>", "h2", "dca-h2 dca-h2--sm dca-reveal"),
        pro("posts", {
            "_skin": "classic", "posts_post_type": "related", "posts_related_fallback": "fallback_recent",
            "posts_include": ["terms"], "posts_related_taxonomies": ["category", "post_tag"],
            "classic_columns": "3", "classic_columns_tablet": "2", "classic_columns_mobile": "1", "classic_posts_per_page": 3,
            "classic_thumbnail": "top", "classic_item_ratio": {"unit": "px", "size": 0.75, "sizes": []},
            "classic_title_tag": "h3", "classic_excerpt_length": 16, "classic_meta_data": ["date"], "classic_read_more_text": "Ler artigo",
            "classic_column_gap": px(32), "classic_row_gap": px(48),
        }, "dca-posts dca-reveal", title="Leia também · 3 posts relacionados"),
    ], bg=LINEN, pad=box(104, 28, 120, 28), pad_mobile=box(72, 20, 80, 20), gap=40, title="Leia também")
    return [top, cover, body, cta, related]


POST_HTML = """<p class="dca-intro">A artrite reumatoide é uma doença autoimune que afeta as articulações e provoca dor e inflamação. Quando não é tratada, pode causar danos permanentes. Conhecer a doença é o primeiro passo para cuidar bem das articulações.</p>
<h2>Fatores de risco</h2>
<p>A genética tem papel importante. Ter parentes com a doença aumenta o risco. A idade também pesa, principalmente depois dos 40 anos.</p>
<h2>Prevenção</h2>
<p>Um estilo de vida saudável ajuda a reduzir o risco de artrite reumatoide, embora a doença não possa ser totalmente evitada. Isso inclui alimentação equilibrada e rica em antioxidantes, exercícios com regularidade e abandono do cigarro.</p>
<h2>Diagnóstico precoce</h2>
<p>Se você notar inchaço, rigidez ou dor persistente nas articulações, procure um reumatologista. Quanto mais cedo a doença é identificada, mais eficaz é o tratamento.</p>
<h2>Tratamento e acompanhamento</h2>
<p>A artrite reumatoide tem tratamento, e os avanços da medicina oferecem diversas opções terapêuticas. O cuidado inclui medicamentos, fisioterapia e, em alguns casos, cirurgia. Em casos selecionados, a <a href="/terapia-imunobiologica/">terapia imunobiológica</a> é uma das opções.</p>
<h2>Apoio e informação</h2>
<p>Além da saúde física, é importante buscar apoio emocional e se informar sobre a doença. Comunidades e grupos de pacientes podem oferecer orientação e acolhimento.</p>
<h2>Quando procurar um reumatologista?</h2>
<p>O reumatologista cuida de várias doenças que podem atingir qualquer parte do corpo, e a dor nas articulações é só um dos possíveis sintomas. Muitas dessas doenças são raras e graves, e começam com sinais leves como fadiga, mal-estar, febre e perda de peso. Com a evolução, podem comprometer órgãos internos como pulmões, coração, rins e cérebro.</p>
<p>Se você reconhece esses sinais, procure avaliação com um reumatologista.</p>
<h2>Conclusão</h2>
<p>A prevenção começa com informação. Quanto melhor entendemos a artrite reumatoide e seus fatores de risco, mais preparados ficamos para tomar medidas de cuidado e, se necessário, controlar a doença com eficácia. Vamos juntos promover a saúde das articulações.</p>
<p><strong>Dra. Célia Alcântara.</strong> Saúde e bem-estar | CRM 8280 | RQE 4354</p>"""


# =====================================================================
# EXPORTAÇÃO
# =====================================================================

PAGES = [
    # arquivo, título, slug, construtor, seo title, meta, palavra-chave
    ("01-home", "Home", "", build_home, "Dra. Célia Alcântara | Médica Reumatologista em Fortaleza",
     "Reumatologista em Fortaleza com atendimento humanizado e integral. Consultas presenciais e por telemedicina para todo o Brasil. Agende pelo WhatsApp.",
     "reumatologista em Fortaleza"),
]
for i, c in enumerate(CONDITIONS, 2):
    PAGES.append((f"0{i}-{c['slug']}", c["name"], c["slug"], (lambda c=c: condition_page(c)), c["seo_title"], c["meta"], c["keyword"]))
PAGES.append(("08-blog", "Blog", "blog", build_blog, "Blog | Dicas e informação sobre reumatologia | Dra. Célia Alcântara",
              "Artigos da Dra. Célia Alcântara sobre artrite, fibromialgia, osteoporose e outras doenças reumáticas, com informação clara para cuidar da sua saúde.",
              "blog de reumatologia"))


# Versões até 60 caracteres (título) e 155 (meta), para o Google não cortar.
SHORT = {
    "Artrite psoriásica": ("Artrite psoriásica em Fortaleza | Dra. Célia Alcântara",
                           "Artrite psoriásica: sintomas, diagnóstico e tratamento. Consulta com reumatologista em Fortaleza ou por telemedicina."),
    "Espondiloartrites": ("Espondiloartrites em Fortaleza | Dra. Célia Alcântara",
                          "O que são as espondiloartrites, sintomas, diagnóstico e tratamento. Reumatologista em Fortaleza e atendimento online."),
    "Espondilite anquilosante": ("Espondilite anquilosante em Fortaleza | Dra. Célia",
                                 "Dor lombar e rigidez ao acordar podem ser espondilite anquilosante. Sintomas, diagnóstico e tratamento com a Dra. Célia."),
    "Fibromialgia": ("Fibromialgia em Fortaleza: sintomas e tratamento",
                     "Dor pelo corpo, cansaço e sono ruim podem ser fibromialgia. Sintomas, diagnóstico e tratamento com reumatologista."),
    "Osteoporose": ("Osteoporose em Fortaleza: prevenção e tratamento",
                    "A osteoporose é silenciosa e aumenta o risco de fraturas. Como identificar, prevenir e tratar com reumatologista em Fortaleza."),
    "Terapia imunobiológica": ("",
                               "Terapia imunobiológica para doenças autoimunes e inflamatórias quando o tratamento convencional não basta. Agende sua consulta."),
    "Blog": ("Blog de reumatologia | Dra. Célia Alcântara", ""),
    "Post: Artrite reumatoide": ("Artrite reumatoide: fatores de risco e diagnóstico",
                                 "O que é a artrite reumatoide, fatores de risco, prevenção e por que o diagnóstico precoce faz diferença no tratamento."),
}


def placeholder_uri(label):
    svg = (f'<svg xmlns="http://www.w3.org/2000/svg" width="800" height="1000" viewBox="0 0 800 1000">'
           f'<rect width="800" height="1000" fill="#EFE8DC"/>'
           f'<circle cx="400" cy="430" r="70" fill="none" stroke="#C29F5F" stroke-width="2"/>'
           f'<path d="M330 520c20-40 120-40 140 0" fill="none" stroke="#C29F5F" stroke-width="2"/>'
           f'<text x="400" y="600" text-anchor="middle" font-family="Poppins,Arial" font-size="26" fill="#8C6B31">{esc(label)[:60]}</text></svg>')
    return "data:image/svg+xml;charset=utf-8," + quote(svg)


SAMPLE_POSTS = [
    {"title": "Artrite reumatoide: o que saber sobre fatores de risco, prevenção e diagnóstico", "date": "26 de outubro de 2026",
     "excerpt": "Entenda o que é a artrite reumatoide, quais são os fatores de risco e por que o diagnóstico precoce faz diferença.", "img": "Capa do artigo"},
    {"title": "[Título do próximo artigo]", "date": "[data]", "excerpt": "[Resumo de duas linhas do artigo, escrito pela equipe.]", "img": "Capa do artigo"},
    {"title": "[Título do próximo artigo]", "date": "[data]", "excerpt": "[Resumo de duas linhas do artigo, escrito pela equipe.]", "img": "Capa do artigo"},
]
SAMPLE_POST = {"title": "Artrite reumatoide: o que saber sobre fatores de risco, prevenção e diagnóstico",
               "meta": ["26 de outubro de 2026", "Dra. Célia Alcântara"], "content": POST_HTML}

SHIM = """
*,*::before,*::after{box-sizing:border-box}body{margin:0}img{max-width:100%;height:auto}
h1,h2,h3,h4,h5,h6{margin:0}p{margin-block:0 .9rem}
.e-con{--flex-direction:column;--row-gap:20px;--column-gap:20px;--justify-content:flex-start;--align-items:stretch;--flex-wrap:nowrap;
--padding-top:0px;--padding-right:0px;--padding-bottom:0px;--padding-left:0px;--margin-top:0px;--margin-right:0px;--margin-bottom:0px;--margin-left:0px;
--width:100%;--content-width:1140px;--min-height:initial;
display:flex;position:relative;min-width:0;min-height:var(--min-height);width:var(--width);max-width:100%;flex-shrink:1;
padding:var(--padding-top) var(--padding-right) var(--padding-bottom) var(--padding-left);
margin:var(--margin-top) var(--margin-right) var(--margin-bottom) var(--margin-left)}
.e-con-full,.e-con>.e-con-inner{flex-direction:var(--flex-direction);gap:var(--row-gap) var(--column-gap);justify-content:var(--justify-content);align-items:var(--align-items);flex-wrap:var(--flex-wrap)}
.e-con-boxed{flex-direction:column}
.e-con>.e-con-inner{display:flex;width:100%;max-width:min(100%,var(--content-width));margin:0 auto}
.e-con-full>.e-con,.e-con-inner>.e-con{}
.elementor-widget{position:relative;min-width:0;max-width:100%}
.e-con-full[style*="row"] > .elementor-widget{}
.elementor-heading-title{line-height:1}
.elementor-button{display:inline-block;text-decoration:none;cursor:pointer}
.elementor-button-content-wrapper{display:flex;justify-content:center;align-items:center}
.elementor-align-center .elementor-button-wrapper{text-align:center}
.elementor-posts-container{display:grid;gap:48px 32px}
.dca-grid-3{grid-template-columns:repeat(3,minmax(0,1fr))}
@media(max-width:1024px){.dca-grid-3{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media(max-width:767px){.dca-grid-3{grid-template-columns:1fr}}
.elementor-post__title{margin:0}
"""


def page_html(title, content_nodes, css, js, single=False):
    pv = Preview(placeholder_uri, SAMPLE_POSTS, SAMPLE_POST)
    reset_ids(9000)
    header = pv.render(build_header())
    body = pv.render(content_nodes)
    footer = pv.render(build_footer())
    return f"""<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>{esc(title)} · prévia</title><style>{SHIM}</style><style>{pv.style()}</style>{FONTS_HTML}<style>{css}</style></head>
<body><header class="elementor elementor-location-header">{header}</header>
<main class="elementor elementor-page">{body}</main>
<footer class="elementor elementor-location-footer">{footer}</footer><script>{js}</script></body></html>"""


def with_runtime(nodes, js, css, inside=False):
    """Anexa CSS + animações ao conteúdo da página.

    O CSS vai no campo "CSS personalizado" de um ELEMENTO (não nas configurações da página):
    ao inserir um modelo por "Meus modelos", o Elementor traz os elementos mas descarta as
    configurações da página. O script tem trava contra execução dupla (página + rodapé)."""
    w = html_w("<script>\n" + js + "\n</script>", "dca-runtime",
               title="NÃO APAGAR · animações do site")
    if inside:
        nodes[-1]["elements"].append(w)
        nodes[-1]["settings"]["custom_css"] = css
        return nodes
    box_ = con([w], cls="dca-runtime", full=True, pad=box(0), gap=0, title="NÃO APAGAR · estilos e animações do site")
    box_["settings"]["custom_css"] = css
    return nodes + [box_]


def with_css(nodes, css):
    nodes[0]["settings"]["custom_css"] = css
    return nodes


def main():
    css = open(os.path.join(ROOT, "assets/dca-global.css"), encoding="utf-8").read() + "\n/* Ícones */\n" + icon_css() + "\n"
    assert ">" not in css and "<" not in css, "CSS não pode ter < ou > (o WordPress converte em entidades)"
    js = open(os.path.join(ROOT, "assets/dca-global.js"), encoding="utf-8").read()
    out_e = os.path.join(ROOT, "elementor")
    out_p = os.path.join(ROOT, "preview")

    ps = {}
    with open(os.path.join(ROOT, "conteudo", "css-do-site.css"), "w", encoding="utf-8") as f:
        f.write("/* Reserva: só use se o visual não aparecer depois de importar.\n"
                "   Cole em Elementor > Configurações do site > CSS personalizado. */\n" + css)
    reset_ids(100)
    export(os.path.join(out_e, "00-cabecalho.json"), "Cabeçalho · Dra. Célia", "header", with_css(build_header(), css), dict(ps))
    reset_ids(200)
    export(os.path.join(out_e, "00-rodape.json"), "Rodapé · Dra. Célia", "footer", with_runtime(build_footer(), js, css, inside=True), dict(ps))

    seo_rows = []
    for n, (fname, title, slug, builder, seo_t, meta, kw) in enumerate(PAGES):
        reset_ids(1000 * (n + 1))
        nodes = builder()
        export(os.path.join(out_e, f"{fname}.json"), f"{title} · Dra. Célia", "page", with_runtime(nodes, js, css),
               dict(ps, template="elementor_header_footer", hide_title="yes"))
        with open(os.path.join(out_p, f"{fname}.html"), "w", encoding="utf-8") as f:
            f.write(page_html(title, nodes, css, js))
        seo_rows.append((title, "/" + (slug + "/" if slug else ""), seo_t, meta, kw))

    reset_ids(9500)
    nodes = build_single()
    export(os.path.join(out_e, "09-modelo-post-blog.json"), "Post do blog · modelo · Dra. Célia", "single-post", with_runtime(nodes, js, css),
           dict(ps, preview_type="single/post", template="elementor_header_footer"))
    with open(os.path.join(out_p, "09-modelo-post-blog.html"), "w", encoding="utf-8") as f:
        f.write(page_html("Post", nodes, css, js, single=True))
    with open(os.path.join(ROOT, "conteudo", "post-artrite-reumatoide.html"), "w", encoding="utf-8") as f:
        f.write(POST_HTML.replace(' class="dca-intro"', "") + "\n")
    seo_rows.append(("Post: Artrite reumatoide", "/blog/artrite-reumatoide-fatores-de-risco/",
                     "Artrite reumatoide: fatores de risco, prevenção e diagnóstico precoce | Dra. Célia Alcântara",
                     "Entenda o que é a artrite reumatoide, quais são os fatores de risco, como reduzir as chances de desenvolver a doença e por que o diagnóstico precoce faz diferença.",
                     "artrite reumatoide"))

    with open(os.path.join(ROOT, "conteudo", "seo.csv"), "w", encoding="utf-8") as f:
        f.write("pagina;url;titulo_seo;meta_description;palavra_chave_foco;caracteres_titulo;caracteres_meta;titulo_curto_sugerido;meta_curta_sugerida\n")
        for r in seo_rows:
            st, sm = SHORT.get(r[0], ("", ""))
            f.write(";".join(r) + f";{len(r[2])};{len(r[3])};{st};{sm}\n")
    print("ok:", len(PAGES) + 1, "páginas + cabeçalho + rodapé")


if __name__ == "__main__":
    main()
