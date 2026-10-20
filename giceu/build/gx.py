"""Núcleo do gerador GICEU.

Monta a árvore de elementos no formato de template do Elementor (containers
flexbox + widgets) e, a partir da mesma árvore, renderiza uma prévia em HTML
que imita a marcação do Elementor, para revisar o visual fora do WordPress.
"""
import hashlib
import html as _html
import json
import re

# ---------------------------------------------------------------- tokens ----

C = {
    "blue": "#7590c1",       # Azul GICEU (marca)
    "blue_deep": "#4a6699",  # azul para texto pequeno sobre fundo claro (AA)
    "ink": "#1b2540",        # texto sobre o azul da marca (AA)
    "mist": "#e8edf6",       # superfícies azuladas
    "graphite": "#363334",   # texto e superfícies escuras
    "paper": "#fdfdfd",      # fundo
    "muted": "#6b6768",      # texto secundário (AA sobre o papel)
    "line": "#e6e3e3",       # fios e bordas
}
F_DISPLAY = "Newsreader"
F_BODY = "Public Sans"
F_MONO = "IBM Plex Mono"

BREAK_T = 1024  # tablet (max-width)
BREAK_M = 767   # mobile (max-width)


# ------------------------------------------------------------------- ids ----

class Ids:
    """IDs de 7 caracteres, estáveis entre execuções (hash do documento + ordem)."""

    def __init__(self, seed):
        self.seed, self.n, self.used = seed, 0, set()

    def __call__(self):
        while True:
            self.n += 1
            h = hashlib.md5(f"{self.seed}:{self.n}".encode()).hexdigest()[:7]
            if h not in self.used and not h.isdigit():
                self.used.add(h)
                return h


IDS = Ids("giceu")


def set_doc(seed):
    global IDS
    IDS = Ids(seed)


# --------------------------------------------------------------- valores ----

def sz(v, unit="px"):
    return {"unit": unit, "size": v, "sizes": []}


def dim(t, r=None, b=None, l=None, unit="px"):
    r = t if r is None else r
    b = t if b is None else b
    l = r if l is None else l
    return {"unit": unit, "top": str(t), "right": str(r), "bottom": str(b),
            "left": str(l), "isLinked": len({t, r, b, l}) == 1}


def gap(v, row=None):
    row = v if row is None else row
    return {"unit": "px", "size": v, "column": str(v), "row": str(row),
            "isLinked": v == row}


def link(url, external=False):
    return {"url": url, "is_external": "on" if external else "",
            "nofollow": "", "custom_attributes": ""}


def typo(prefix="typography", family=None, size=None, weight=None, lh=None,
         ls=None, transform=None, style=None, size_t=None, size_m=None,
         lh_m=None):
    p = prefix
    out = {f"{p}_typography": "custom"}
    if family: out[f"{p}_font_family"] = family
    if size is not None: out[f"{p}_font_size"] = sz(size)
    if size_t is not None: out[f"{p}_font_size_tablet"] = sz(size_t)
    if size_m is not None: out[f"{p}_font_size_mobile"] = sz(size_m)
    if weight: out[f"{p}_font_weight"] = str(weight)
    if lh is not None: out[f"{p}_line_height"] = sz(lh, "em")
    if lh_m is not None: out[f"{p}_line_height_mobile"] = sz(lh_m, "em")
    if ls is not None: out[f"{p}_letter_spacing"] = sz(ls, "em")
    if transform: out[f"{p}_text_transform"] = transform
    if style: out[f"{p}_font_style"] = style
    return out


# ------------------------------------------------------------- elementos ----

def container(*children, cls="", boxed=False, max_w=1200, direction="column",
              justify=None, align=None, gap_px=None, gap_m=None, wrap=False,
              pad=None, pad_t=None, pad_m=None, bg=None, min_h=None,
              min_h_unit="px", width=None, width_t=None, width_m=None,
              dir_t=None, dir_m=None, align_m=None, justify_m=None,
              anchor=None, tag="div", radius=None, extra=None):
    s = {
        "content_width": "boxed" if boxed else "full",
        "flex_direction": direction,
        "flex_gap": gap(gap_px if gap_px is not None else 0),
        "padding": pad if pad is not None else dim(0),
    }
    if boxed: s["boxed_width"] = sz(max_w)
    if justify: s["flex_justify_content"] = justify
    if align: s["flex_align_items"] = align
    if align_m: s["flex_align_items_mobile"] = align_m
    if justify_m: s["flex_justify_content_mobile"] = justify_m
    if wrap: s["flex_wrap"] = "wrap"
    if gap_m is not None: s["flex_gap_mobile"] = gap(gap_m)
    if pad_t is not None: s["padding_tablet"] = pad_t
    if pad_m is not None: s["padding_mobile"] = pad_m
    if dir_t: s["flex_direction_tablet"] = dir_t
    if dir_m: s["flex_direction_mobile"] = dir_m
    if bg:
        s["background_background"] = "classic"
        s["background_color"] = bg
    if min_h is not None: s["min_height"] = sz(min_h, min_h_unit)
    if width is not None: s["width"] = sz(width, "%")
    if width_t is not None: s["width_tablet"] = sz(width_t, "%")
    if width_m is not None: s["width_mobile"] = sz(width_m, "%")
    if radius is not None: s["border_radius"] = dim(radius)
    if cls: s["css_classes"] = cls
    if anchor: s["_element_id"] = anchor
    if tag != "div": s["html_tag"] = tag
    if extra: s.update(extra)
    return {"id": IDS(), "elType": "container", "settings": s,
            "elements": list(children), "isInner": False}


def _widget(wtype, settings, cls="", anchor=None, width=None, extra=None):
    s = dict(settings)
    if cls: s["_css_classes"] = cls
    if anchor: s["_element_id"] = anchor
    if width == "auto":
        s["_element_width"] = "auto"
    elif isinstance(width, tuple):
        s["_element_width"] = "initial"
        s["_element_custom_width"] = sz(*width)
    elif width is not None:
        s["_element_width"] = "initial"
        s["_element_custom_width"] = sz(width, "%")
    if extra: s.update(extra)
    return {"id": IDS(), "elType": "widget", "widgetType": wtype,
            "settings": s, "elements": []}


def heading(title, tag="h2", cls="", color=None, t=None, align=None,
            url=None, align_m=None, **kw):
    s = {"title": title, "header_size": tag}
    if color: s["title_color"] = color
    if t: s.update(t)
    if align: s["align"] = align
    if align_m: s["align_mobile"] = align_m
    if url: s["link"] = link(url)
    return _widget("heading", s, cls, **kw)


def text(html_, cls="", color=None, t=None, align=None, **kw):
    s = {"editor": html_}
    if color: s["text_color"] = color
    if t: s.update(t)
    if align: s["align"] = align
    return _widget("text-editor", s, cls, **kw)


BTN_STYLES = {
    # nome: (fundo, texto, fundo hover, texto hover, borda)
    "dark": (C["graphite"], C["paper"], C["blue_deep"], C["paper"], None),
    "paper": (C["paper"], C["graphite"], C["ink"], C["paper"], None),
    "ghost": ("rgba(0,0,0,0)", C["graphite"], C["graphite"], C["paper"], C["graphite"]),
    "ghost_light": ("rgba(0,0,0,0)", C["paper"], C["paper"], C["ink"], "rgba(253,253,253,0.6)"),
    "ink": (C["ink"], C["paper"], C["graphite"], C["paper"], None),
}


def button(label, url, style="dark", cls="", icon=None, arrow=True,
           align=None, external=False, size=15, **kw):
    bg, fg, bgh, fgh, border = BTN_STYLES[style]
    s = {
        "text": label,
        "link": link(url, external),
        "background_color": bg,
        "button_text_color": fg,
        "button_background_hover_color": bgh,
        "hover_color": fgh,
        "border_radius": dim(999),
        "text_padding": dim(15, 26),
        **typo(family=F_BODY, size=size, weight=600, lh=1.2, ls=0.005),
    }
    if border:
        s.update({"border_border": "solid", "border_width": dim(1.5),
                  "border_color": border, "button_hover_border_color": bgh})
    if icon:
        lib = "fa-brands" if icon.startswith("fab") else "fa-solid"
        s["selected_icon"] = {"value": icon, "library": lib}
        s["icon_indent"] = sz(10)
    if align: s["align"] = align
    classes = "gx-btn" + ("" if arrow else " gx-btn--plain") + (f" {cls}" if cls else "")
    return _widget("button", s, classes, **kw)


def raw(code, cls="", **kw):
    return _widget("html", {"html": code.strip()}, cls, **kw)


def image(url, alt="", cls="", **kw):
    return _widget("image", {"image": {"url": url, "id": "", "alt": alt},
                             "image_size": "full"}, cls, **kw)


def nav_menu(items, cls="", **kw):
    s = {
        "layout": "horizontal", "align_items": "center", "pointer": "none",
        "submenu_icon": {"value": "fas fa-chevron-down", "library": "fa-solid"},
        "dropdown": "tablet", "full_width": "stretch",
        "toggle": "burger", "toggle_align": "right",
        "color_menu_item": C["graphite"], "color_menu_item_hover": C["blue_deep"],
        "color_menu_item_active": C["graphite"],
        "padding_horizontal_menu_item": sz(14), "padding_vertical_menu_item": sz(10),
        **typo("menu_typography", F_BODY, 15, 500, 1.2),
        "color_dropdown_item": C["graphite"], "background_color_dropdown_item": C["paper"],
        "color_dropdown_item_hover": C["paper"],
        "background_color_dropdown_item_hover": C["graphite"],
        **typo("dropdown_typography", F_BODY, 17, 500),
        "padding_vertical_dropdown_item": sz(16),
        "toggle_color": C["graphite"], "toggle_background_color": "rgba(0,0,0,0)",
        "toggle_size": sz(22),
    }
    w = _widget("nav-menu", s, cls, **kw)
    w["_preview_items"] = items  # só para a prévia; removido no JSON
    return w


def posts(cls="", n=3, **kw):
    s = {
        "_skin": "classic", "posts_post_type": "post",
        "classic_columns": "3", "classic_columns_tablet": "2", "classic_columns_mobile": "1",
        "classic_posts_per_page": n, "classic_thumbnail": "top",
        "classic_item_ratio": sz(0.62), "classic_title_tag": "h3",
        "classic_excerpt_length": 20, "classic_meta_data": ["date"],
        "classic_read_more_text": "Ler o post",
        "classic_column_gap": sz(28), "classic_row_gap": sz(40),
    }
    return _widget("posts", s, cls, **kw)


def gmap(address, cls="", height=420, **kw):
    return _widget("google_maps", {"address": address, "zoom": sz(15),
                                   "height": sz(height)}, cls, **kw)


def social(items, cls="", **kw):
    lst = [{"_id": IDS(), "social_icon": {"value": ic, "library": "fa-brands"},
            "link": link(url, True)} for ic, url in items]
    s = {"social_icon_list": lst, "shape": "circle", "icon_color": "custom",
         "icon_primary_color": "rgba(253,253,253,0.08)",
         "icon_secondary_color": C["paper"], "icon_size": sz(16),
         "icon_padding": sz(0.8, "em"), "icon_spacing": sz(10)}
    return _widget("social-icons", s, cls, **kw)


# ------------------------------------------------------------ exportação ----

def _strip(el):
    el = {k: v for k, v in el.items() if not k.startswith("_preview")}
    el["elements"] = [_strip(c) for c in el.get("elements", [])]
    return el


def _mark_inner(els, inner=False):
    for el in els:
        if el["elType"] == "container":
            el["isInner"] = inner
            _mark_inner(el["elements"], True)


def export(path, title, doc_type, content):
    _mark_inner(content)
    data = {
        "content": [_strip(e) for e in content],
        "page_settings": {"hide_title": "yes"} if doc_type == "page" else [],
        "version": "0.4",
        "title": title,
        "type": doc_type,
    }
    with open(path, "w", encoding="utf-8") as fh:
        json.dump(data, fh, ensure_ascii=False, indent=1)
    return data


# --------------------------------------------------------------- prévia -----
# Renderiza a mesma árvore com marcação e CSS no estilo do Elementor.

class Preview:
    def __init__(self, url_map):
        self.css = {"": [], "t": [], "m": []}
        self.url_map = url_map

    def u(self, url):
        if url in self.url_map:
            return self.url_map[url]
        return url if url.startswith(("#", "http")) else "#"

    def rule(self, sel, decl, bp=""):
        if decl:
            self.css[bp].append(f"{sel}{{{';'.join(decl)}}}")

    @staticmethod
    def _dim(d):
        u = d.get("unit", "px")
        return " ".join(f"{d[k]}{u}" for k in ("top", "right", "bottom", "left"))

    @staticmethod
    def _sz(v):
        return f"{v['size']}{v.get('unit', 'px')}"

    def _typo(self, s, prefix, sel):
        if s.get(f"{prefix}_typography") != "custom":
            return
        d = []
        if f"{prefix}_font_family" in s: d.append(f"font-family:'{s[prefix + '_font_family']}'")
        if f"{prefix}_font_size" in s: d.append(f"font-size:{self._sz(s[prefix + '_font_size'])}")
        if f"{prefix}_font_weight" in s: d.append(f"font-weight:{s[prefix + '_font_weight']}")
        if f"{prefix}_line_height" in s: d.append(f"line-height:{self._sz(s[prefix + '_line_height'])}")
        if f"{prefix}_letter_spacing" in s: d.append(f"letter-spacing:{self._sz(s[prefix + '_letter_spacing'])}")
        if f"{prefix}_text_transform" in s: d.append(f"text-transform:{s[prefix + '_text_transform']}")
        if f"{prefix}_font_style" in s: d.append(f"font-style:{s[prefix + '_font_style']}")
        self.rule(sel, d)
        for bp, suf in (("t", "_tablet"), ("m", "_mobile")):
            d = []
            if f"{prefix}_font_size{suf}" in s: d.append(f"font-size:{self._sz(s[prefix + '_font_size' + suf])}")
            if f"{prefix}_line_height{suf}" in s: d.append(f"line-height:{self._sz(s[prefix + '_line_height' + suf])}")
            self.rule(sel, d, bp)

    @staticmethod
    def _hide(s):
        return " ".join(f"elementor-hidden-{d}" for d in ("desktop", "tablet", "mobile")
                        if s.get(f"hide_{d}"))

    def _common(self, el, sel):
        s = el["settings"]
        if s.get("_flex_size") == "grow":
            self.rule(sel, ["flex-grow:1", "flex-shrink:1", "min-width:0"])
        if s.get("_margin"):
            self.rule(sel, [f"margin:{self._dim(s['_margin'])}"])
        if s.get("_element_width") == "auto":
            self.rule(sel, ["width:auto", "max-width:100%"])
        elif s.get("_element_width") == "initial":
            self.rule(sel, [f"width:{self._sz(s['_element_custom_width'])}"])

    def render(self, el, parent_dir="column"):
        if el["elType"] == "container":
            return self._container(el)
        return self._widget(el)

    def _container(self, el):
        s, i = el["settings"], el["id"]
        sel = f".elementor-element-{i}"
        boxed = s.get("content_width") == "boxed"
        flex_sel = f"{sel}>.e-con-inner" if boxed else sel
        outer = [f"padding:{self._dim(s['padding'])}"]
        if s.get("background_color"): outer.append(f"background-color:{s['background_color']}")
        if s.get("min_height"): outer.append(f"min-height:{self._sz(s['min_height'])}")
        if s.get("width"): outer.append(f"width:{self._sz(s['width'])}")
        if s.get("border_radius"): outer.append(f"border-radius:{self._dim(s['border_radius'])}")
        self.rule(sel, outer)
        self._common(el, sel)
        g = s["flex_gap"]
        fl = [f"flex-direction:{s['flex_direction']}", f"gap:{g['row']}px {g['column']}px"]
        if s.get("flex_justify_content"): fl.append(f"justify-content:{s['flex_justify_content']}")
        if s.get("flex_align_items"): fl.append(f"align-items:{s['flex_align_items']}")
        if s.get("flex_wrap"): fl.append("flex-wrap:wrap")
        if boxed: fl.append(f"max-width:{self._sz(s['boxed_width'])}")
        self.rule(flex_sel, fl)
        for bp, suf in (("t", "_tablet"), ("m", "_mobile")):
            o, f = [], []
            if f"padding{suf}" in s: o.append(f"padding:{self._dim(s['padding' + suf])}")
            if f"width{suf}" in s: o.append(f"width:{self._sz(s['width' + suf])}")
            if f"flex_direction{suf}" in s: f.append(f"flex-direction:{s['flex_direction' + suf]}")
            if f"flex_gap{suf}" in s:
                gg = s["flex_gap" + suf]
                f.append(f"gap:{gg['row']}px {gg['column']}px")
            if f"flex_align_items{suf}" in s: f.append(f"align-items:{s['flex_align_items' + suf]}")
            if f"flex_justify_content{suf}" in s: f.append(f"justify-content:{s['flex_justify_content' + suf]}")
            self.rule(sel, o, bp)
            self.rule(flex_sel, f, bp)
        kids = "".join(self.render(c) for c in el["elements"])
        tag = s.get("html_tag", "div")
        cls = f"elementor-element elementor-element-{i} e-con e-flex {'e-con-boxed' if boxed else 'e-con-full'} {s.get('css_classes', '')} {self._hide(s)}"
        aid = f' id="{s["_element_id"]}"' if s.get("_element_id") else ""
        inner = f'<div class="e-con-inner">{kids}</div>' if boxed else kids
        return f'<{tag} class="{cls.strip()}"{aid} data-id="{i}">{inner}</{tag}>'

    def _widget(self, el):
        s, i, w = el["settings"], el["id"], el["widgetType"]
        sel = f".elementor-element-{i}"
        self._common(el, sel)
        body = getattr(self, "_w_" + w.replace("-", "_"))(el, s, sel)
        cls = f"elementor-element elementor-element-{i} elementor-widget elementor-widget-{w} {s.get('_css_classes', '')} {self._hide(s)}"
        aid = f' id="{s["_element_id"]}"' if s.get("_element_id") else ""
        return f'<div class="{cls.strip()}"{aid} data-id="{i}"><div class="elementor-widget-container">{body}</div></div>'

    def _w_heading(self, el, s, sel):
        t = f"{sel} .elementor-heading-title"
        if s.get("title_color"): self.rule(t, [f"color:{s['title_color']}"])
        self._typo(s, "typography", t)
        if s.get("align"): self.rule(sel, [f"text-align:{s['align']}"])
        if s.get("align_mobile"): self.rule(sel, [f"text-align:{s['align_mobile']}"], "m")
        title = s["title"]
        if s.get("link"):
            title = f'<a href="{self.u(s["link"]["url"])}">{title}</a>'
        tag = s["header_size"]
        return f'<{tag} class="elementor-heading-title elementor-size-default">{title}</{tag}>'

    def _w_text_editor(self, el, s, sel):
        if s.get("text_color"): self.rule(sel, [f"color:{s['text_color']}"])
        self._typo(s, "typography", sel)
        if s.get("align"): self.rule(sel, [f"text-align:{s['align']}"])
        return self._links(s["editor"])

    def _links(self, h):
        def sub(m):
            return f'href="{self.u(m.group(1))}"'
        return re.sub(r'href="([^"]*)"', sub, h)

    def _w_button(self, el, s, sel):
        b = f"{sel} .elementor-button"
        d = [f"background-color:{s['background_color']}", f"color:{s['button_text_color']}",
             f"border-radius:{self._dim(s['border_radius'])}", f"padding:{self._dim(s['text_padding'])}"]
        if s.get("border_border"):
            d += [f"border:{s['border_width']['top']}px solid {s['border_color']}"]
        self.rule(b, d)
        hv = [f"background-color:{s['button_background_hover_color']}", f"color:{s['hover_color']}"]
        if s.get("button_hover_border_color"): hv.append(f"border-color:{s['button_hover_border_color']}")
        self.rule(f"{b}:hover,{b}:focus-visible", hv)
        self._typo(s, "typography", b)
        if s.get("align"): self.rule(sel, [f"text-align:{s['align']}"])
        icon = ""
        if s.get("selected_icon"):
            icon = f'<span class="elementor-button-icon"><i class="{s["selected_icon"]["value"]}" aria-hidden="true"></i></span>'
        tgt = ' target="_blank"' if s["link"].get("is_external") else ""
        return (f'<div class="elementor-button-wrapper"><a class="elementor-button elementor-button-link elementor-size-sm" '
                f'href="{self.u(s["link"]["url"])}"{tgt}><span class="elementor-button-content-wrapper">{icon}'
                f'<span class="elementor-button-text">{s["text"]}</span></span></a></div>')

    def _w_html(self, el, s, sel):
        return self._links(s["html"])

    def _w_image(self, el, s, sel):
        return (f'<div class="gxp-ph" role="img" aria-label="{_html.escape(s["image"]["alt"])}">'
                f'<span>Foto · substituir no Elementor</span></div>')

    def _w_nav_menu(self, el, s, sel):
        lis = "".join(
            f'<li class="menu-item"><a href="{self.u(u)}" class="elementor-item{" elementor-item-active" if a else ""}">{t}</a></li>'
            for t, u, a in el["_preview_items"])
        self._typo(s, "menu_typography", f"{sel} .elementor-nav-menu--main .elementor-item")
        self.rule(f"{sel} .elementor-nav-menu--main .elementor-item", [f"color:{s['color_menu_item']}", "padding:10px 14px"])
        self.rule(f"{sel} .elementor-nav-menu--main .elementor-item:hover", [f"color:{s['color_menu_item_hover']}"])
        return (f'<nav class="elementor-nav-menu--main elementor-nav-menu__container"><ul class="elementor-nav-menu">{lis}</ul></nav>'
                f'<button class="elementor-menu-toggle" aria-label="Abrir menu"><i class="fas fa-bars"></i></button>')

    def _w_posts(self, el, s, sel):
        demo = [("Pesquisa", "Boas-vindas ao novo site e ao blog do GICEU", "20 de outubro de 2026"),
                ("GICEU na mídia", "Fortaleza em Música na imprensa", "14 de outubro de 2026"),
                ("Podcast", "Conheça o podcast do GICEU", "7 de outubro de 2026")]
        arts = "".join(
            f'<article class="elementor-post"><a class="elementor-post__thumbnail__link" href="#"><div class="elementor-post__thumbnail gxp-thumb gxp-thumb--{k}"></div></a>'
            f'<div class="elementor-post__text"><h3 class="elementor-post__title"><a href="#">{t}</a></h3>'
            f'<div class="elementor-post__meta-data"><span class="elementor-post-date">{d}</span></div>'
            f'<div class="elementor-post__excerpt"><p>Novidades do grupo, eventos, publicações e bastidores das pesquisas sobre a cidade.</p></div>'
            f'<a class="elementor-post__read-more" href="#">Ler o post</a></div></article>'
            for k, (c, t, d) in enumerate(demo))
        return f'<div class="elementor-posts-container elementor-posts elementor-posts--skin-classic elementor-grid">{arts}</div>'

    def _w_google_maps(self, el, s, sel):
        return (f'<div class="elementor-custom-embed"><div class="gxp-map" style="height:{s["height"]["size"]}px">'
                f'<span>Google Maps · {_html.escape(s["address"])}</span></div></div>')

    def _w_social_icons(self, el, s, sel):
        a = "".join(
            f'<a class="elementor-icon elementor-social-icon" href="{it["link"]["url"]}" target="_blank" aria-label="Instagram">'
            f'<i class="{it["social_icon"]["value"]}"></i></a>' for it in s["social_icon_list"])
        self.rule(f"{sel} .elementor-social-icon",
                  [f"background:{s['icon_primary_color']}", f"color:{s['icon_secondary_color']}",
                   "width:2.6em", "height:2.6em", "display:inline-flex", "align-items:center",
                   "justify-content:center", "border-radius:50%", f"font-size:{s['icon_size']['size']}px"])
        return f'<div class="elementor-social-icons-wrapper elementor-grid">{a}</div>'

    def stylesheet(self):
        return ("\n".join(self.css[""]) +
                f"\n@media (max-width:{BREAK_T}px){{" + "\n".join(self.css["t"]) + "}" +
                f"\n@media (max-width:{BREAK_M}px){{" + "\n".join(self.css["m"]) + "}")
