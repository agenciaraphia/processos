"""Construtores de elementos do Elementor + renderizador de prévia em HTML.

Os mesmos dados geram (1) o JSON importável no Elementor Pro e (2) uma prévia
estática que imita a marcação do Elementor, usada só para conferência visual.
"""
import hashlib
import html as _html
import json
import re

_counter = [0]


def uid():
    _counter[0] += 1
    return hashlib.md5(f"dca-{_counter[0]}".encode()).hexdigest()[:7]


def reset_ids(seed):
    _counter[0] = seed


# ---------------------------------------------------------------- unidades

def px(v):
    return {"unit": "px", "size": v, "sizes": []}


def pct(v):
    return {"unit": "%", "size": v, "sizes": []}


def box(t, r=None, b=None, l=None, unit="px"):
    r = t if r is None else r
    b = t if b is None else b
    l = r if l is None else l
    return {"unit": unit, "top": str(t), "right": str(r), "bottom": str(b), "left": str(l),
            "isLinked": t == r == b == l}


def gap(v, row=None):
    row = v if row is None else row
    return {"unit": "px", "size": v, "column": str(v), "row": str(row), "isLinked": v == row}


# ---------------------------------------------------------------- elementos

def con(children, cls="", full=False, direction="column", **kw):
    """Container flexbox do Elementor.

    kw aceita: width, width_tablet, width_mobile (em %), gap, gap_mobile, pad, pad_tablet,
    pad_mobile, bg, justify, align, wrap, dir_tablet, dir_mobile, boxed (px), tag, id,
    min_h (vh), margin, title.
    """
    s = {"content_width": "full" if full else "boxed", "flex_direction": direction}
    if not full:
        s["boxed_width"] = px(kw.get("boxed", 1240))
    for k in ("width", "width_tablet", "width_mobile"):
        if k in kw:
            s[k] = pct(kw[k])
    if "dir_tablet" in kw:
        s["flex_direction_tablet"] = kw["dir_tablet"]
    if "dir_mobile" in kw:
        s["flex_direction_mobile"] = kw["dir_mobile"]
    s["flex_gap"] = gap(*kw["gap"]) if isinstance(kw.get("gap"), tuple) else gap(kw.get("gap", 20))
    if "gap_tablet" in kw:
        s["flex_gap_tablet"] = gap(kw["gap_tablet"])
    if "gap_mobile" in kw:
        s["flex_gap_mobile"] = gap(kw["gap_mobile"])
    if "justify" in kw:
        s["flex_justify_content"] = kw["justify"]
    if "justify_mobile" in kw:
        s["flex_justify_content_mobile"] = kw["justify_mobile"]
    if "align" in kw:
        s["flex_align_items"] = kw["align"]
    if "align_mobile" in kw:
        s["flex_align_items_mobile"] = kw["align_mobile"]
    if kw.get("wrap"):
        s["flex_wrap"] = "wrap"
    s["padding"] = kw.get("pad", box(0))
    if "pad_tablet" in kw:
        s["padding_tablet"] = kw["pad_tablet"]
    if "pad_mobile" in kw:
        s["padding_mobile"] = kw["pad_mobile"]
    if "margin" in kw:
        s["margin"] = kw["margin"]
    if "bg" in kw:
        s["background_background"] = "classic"
        s["background_color"] = kw["bg"]
    if "min_h" in kw:
        s["min_height"] = {"unit": "vh", "size": kw["min_h"], "sizes": []}
    if kw.get("tag"):
        s["html_tag"] = kw["tag"]
    if kw.get("id"):
        s["_element_id"] = kw["id"]
    if cls:
        s["css_classes"] = cls
    if kw.get("title"):
        s["_title"] = kw["title"]
    return {"id": uid(), "elType": "container", "settings": s, "elements": children, "isInner": False}


def _w(wtype, settings, cls="", eid=None, title=None):
    if cls:
        settings["_css_classes"] = cls
    if eid:
        settings["_element_id"] = eid
    if title:
        settings["_title"] = title
    return {"id": uid(), "elType": "widget", "settings": settings, "elements": [], "widgetType": wtype}


def heading(title, tag="h2", cls="dca-h2", eid=None, align=None, align_mobile=None, title_label=None):
    s = {"title": title, "header_size": tag}
    if align:
        s["align"] = align
    if align_mobile:
        s["align_mobile"] = align_mobile
    return _w("heading", s, cls, eid, title_label)


def text(html, cls="dca-prose", eid=None, title=None):
    return _w("text-editor", {"editor": html}, cls, eid, title)


WA_ICON = {"value": "fab fa-whatsapp", "library": "fa-brands"}
ARROW_ICON = {"value": "fas fa-arrow-right", "library": "fa-solid"}


def button(label, url, cls="dca-btn", icon=None, external=False, align=None, icon_right=False):
    s = {"text": label, "link": {"url": url, "is_external": "on" if external else "", "nofollow": "", "custom_attributes": ""}}
    if icon:
        s["selected_icon"] = icon
    if align:
        s["align"] = align
    return _w("button", s, cls)


def image(alt, cls="dca-rounded", title=None, label=None):
    """Imagem sem arquivo: o Elementor mostra o placeholder até a foto ser escolhida.
    O texto alternativo (alt) fica no nome do elemento no Navegador do Elementor e no LEIA-ME."""
    s = {"image_size": "full"}
    w = _w("image", s, cls, None, title or f"FOTO · alt: {alt}")
    w["_preview_alt"] = alt
    w["_preview_label"] = label or alt
    return w


def html_w(code, cls="", title=None):
    return _w("html", {"html": code}, cls, None, title)


def pro(wtype, settings, cls="", title=None):
    return _w(wtype, settings, cls, None, title)


def strip_private(node):
    """Remove chaves usadas só pela prévia antes de exportar o JSON."""
    if isinstance(node, dict):
        return {k: strip_private(v) for k, v in node.items() if not k.startswith("_preview")}
    if isinstance(node, list):
        return [strip_private(x) for x in node]
    return node


def export(path, title, kind, content, page_settings=None):
    data = {
        "content": strip_private(content),
        "page_settings": page_settings or {},
        "version": "0.4",
        "title": title,
        "type": kind,
    }
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=1)


# ---------------------------------------------------------------- prévia

BP = {"": None, "_tablet": 1024, "_mobile": 767}


def _box_vars(prefix, v):
    return {f"--{prefix}-top": f"{v['top']}{v['unit']}", f"--{prefix}-right": f"{v['right']}{v['unit']}",
            f"--{prefix}-bottom": f"{v['bottom']}{v['unit']}", f"--{prefix}-left": f"{v['left']}{v['unit']}"}


def _con_vars(s, sfx):
    out = {}
    g = s.get("flex_direction" + sfx)
    if g:
        out["--flex-direction"] = g
    g = s.get("flex_gap" + sfx)
    if g:
        out["--row-gap"] = f"{g['row']}px"
        out["--column-gap"] = f"{g['column']}px"
    for key, var in (("flex_justify_content", "--justify-content"), ("flex_align_items", "--align-items"), ("flex_wrap", "--flex-wrap")):
        if s.get(key + sfx):
            out[var] = s[key + sfx]
    if s.get("padding" + sfx):
        out.update(_box_vars("padding", s["padding" + sfx]))
    if s.get("margin" + sfx):
        out.update(_box_vars("margin", s["margin" + sfx]))
    if s.get("width" + sfx):
        out["--width"] = f"{s['width' + sfx]['size']}%"
    if sfx == "" and s.get("boxed_width"):
        out["--content-width"] = f"{s['boxed_width']['size']}px"
    if sfx == "" and s.get("min_height"):
        out["--min-height"] = f"{s['min_height']['size']}vh"
    if sfx == "" and s.get("background_color"):
        out["background-color"] = s["background_color"]
    return out


def _wid_vars(s, sfx):
    out = {}
    if s.get("align" + sfx):
        out["text-align"] = s["align" + sfx]
    return out


class Preview:
    def __init__(self, placeholder, posts=None, post=None):
        self.css = {k: [] for k in BP}
        self.placeholder = placeholder
        self.posts = posts or []
        self.post = post or {}

    def rule(self, eid, s, fn):
        for sfx in BP:
            v = fn(s, sfx)
            if v:
                self.css[sfx].append(f".elementor-element-{eid}{{" + ";".join(f"{k}:{val}" for k, val in v.items()) + "}")

    def style(self):
        out = "\n".join(self.css[""])
        for sfx, w in BP.items():
            if w and self.css[sfx]:
                out += f"\n@media (max-width:{w}px){{" + "\n".join(self.css[sfx]) + "}"
        return out

    def render(self, nodes, parent=True):
        return "".join(self.node(n, parent) for n in nodes)

    def node(self, n, parent=False):
        s = n["settings"]
        if n["elType"] == "container":
            self.rule(n["id"], s, _con_vars)
            boxed = s.get("content_width") == "boxed"
            cls = f"elementor-element elementor-element-{n['id']} e-flex e-con-{'boxed' if boxed else 'full'} e-con e-{'parent' if parent else 'child'} {s.get('css_classes', '')}"
            tag = s.get("html_tag") or "div"
            idattr = f' id="{s["_element_id"]}"' if s.get("_element_id") else ""
            inner = self.render(n["elements"], False)
            if boxed:
                inner = f'<div class="e-con-inner">{inner}</div>'
            return f'<{tag} class="{cls}"{idattr}>{inner}</{tag}>'
        self.rule(n["id"], s, _wid_vars)
        wt = n["widgetType"]
        extra = ""
        if wt == "button" and s.get("align"):
            extra = f" elementor-align-{s['align']}"
        cls = f"elementor-element elementor-element-{n['id']} elementor-widget elementor-widget-{wt}{extra} {s.get('_css_classes', '')}"
        idattr = f' id="{s["_element_id"]}"' if s.get("_element_id") else ""
        return f'<div class="{cls}"{idattr}><div class="elementor-widget-container">{self.widget(n)}</div></div>'

    def widget(self, n):
        s = n["settings"]
        wt = n["widgetType"]
        if wt == "heading":
            t = s["header_size"]
            return f'<{t} class="elementor-heading-title elementor-size-default">{s["title"]}</{t}>'
        if wt == "text-editor":
            return s["editor"]
        if wt == "html":
            return s["html"]
        if wt == "button":
            icon = ""
            if s.get("selected_icon"):
                icon = f'<span class="elementor-button-icon">{ICONS[next((k for k in ("whatsapp", "instagram") if k in s["selected_icon"]["value"]), "arrow")]}</span>'
            txt = f'<span class="elementor-button-text">{s["text"]}</span>'
            body = (txt + icon) if s.get("icon_align") == "right" else (icon + txt)
            return (f'<div class="elementor-button-wrapper"><a class="elementor-button elementor-button-link elementor-size-sm" href="{s["link"]["url"]}">'
                    f'<span class="elementor-button-content-wrapper">{body}</span></a></div>')
        if wt == "image":
            return f'<img src="{self.placeholder(n.get("_preview_label", ""))}" alt="{_html.escape(n.get("_preview_alt", ""))}">'
        if wt == "posts":
            return self.posts_html(s)
        if wt == "theme-post-title":
            t = s.get("header_size", "h1")
            return f'<{t} class="elementor-heading-title elementor-size-default">{self.post["title"]}</{t}>'
        if wt == "theme-post-featured-image":
            return f'<img src="{self.placeholder("Imagem de capa do artigo")}" alt="">'
        if wt == "post-info":
            items = "".join(f'<li class="elementor-icon-list-item elementor-inline-item"><span class="elementor-icon-list-icon">{ICONS["calendar" if i == 0 else "user"]}</span><span class="elementor-icon-list-text">{t}</span></li>'
                            for i, t in enumerate(self.post["meta"]))
            return f'<ul class="elementor-inline-items elementor-icon-list-items elementor-post-info" style="display:flex;gap:22px;list-style:none;margin:0;padding:0">{items}</ul>'
        if wt == "theme-post-content":
            return self.post["content"]
        if wt == "share-buttons":
            btns = "".join(f'<div class="elementor-share-btn" style="width:44px;height:44px;display:grid;place-items:center"><span class="elementor-share-btn__icon">{ICONS[b]}</span></div>'
                           for b in ("whatsapp", "facebook", "linkedin", "mail"))
            return f'<div style="display:flex;gap:10px">{btns}</div>'
        return f"<!-- {wt} -->"

    def posts_html(self, s):
        cols = int(s.get("classic_columns", 3))
        n = int(s.get("classic_posts_per_page", 3))
        tag = s.get("classic_title_tag", "h3")
        items = []
        for p in (self.posts * 3)[:n]:
            items.append(
                f'<article class="elementor-post"><a class="elementor-post__thumbnail__link" href="#"><div class="elementor-post__thumbnail" style="aspect-ratio:4/3">'
                f'<img src="{self.placeholder(p["img"])}" alt="" style="width:100%;height:100%;object-fit:cover;display:block"></div></a>'
                f'<div class="elementor-post__text"><{tag} class="elementor-post__title"><a href="#">{p["title"]}</a></{tag}>'
                f'<div class="elementor-post__meta-data"><span class="elementor-post-date">{p["date"]}</span></div>'
                f'<div class="elementor-post__excerpt"><p>{p["excerpt"]}</p></div>'
                f'<a class="elementor-post__read-more" href="#">{s.get("classic_read_more_text", "Ler artigo")}</a></div></article>')
        pag = ""
        if s.get("pagination_type"):
            pag = '<nav class="elementor-pagination"><span class="page-numbers current">1</span><a class="page-numbers" href="#">2</a><a class="page-numbers" href="#">3</a></nav>'
        return f'<div class="elementor-posts-container elementor-posts dca-grid-{cols}">{"".join(items)}</div>{pag}'


# ---------------------------------------------------------------- ícones (traço 1.5, mesmo desenho em todo o site)

def _svg(paths, vb="0 0 24 24", fill=False):
    attrs = 'fill="currentColor"' if fill else 'fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"'
    return f'<svg viewBox="{vb}" {attrs} aria-hidden="true" focusable="false">{paths}</svg>'


ICONS = {
    "whatsapp": _svg('<path d="M19.05 4.91A9.82 9.82 0 0 0 12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.21h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.91-7.01zm-7.01 15.24h-.01a8.23 8.23 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.19 8.19 0 0 1-1.26-4.38c0-4.54 3.7-8.23 8.25-8.23 2.2 0 4.27.86 5.82 2.42a8.18 8.18 0 0 1 2.41 5.82c0 4.54-3.7 8.23-8.23 8.23zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.12-.17.25-.64.81-.78.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.12-.14.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.41-.42-.56-.43h-.48a.92.92 0 0 0-.66.31c-.23.25-.87.85-.87 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.14-1.18-.06-.1-.22-.16-.47-.28z"/>', fill=True),
    "arrow": _svg('<path d="M5 12h14M13 6l6 6-6 6"/>'),
    "chev": _svg('<path d="M6 9l6 6 6-6"/>'),
    "pin": _svg('<path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11z"/><circle cx="12" cy="10" r="2.3"/>'),
    "video": _svg('<rect x="3" y="6.5" width="12.5" height="11" rx="2.5"/><path d="M15.5 10.5 21 7.5v9l-5.5-3"/>'),
    "clock": _svg('<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>'),
    "shield": _svg('<path d="M12 3 5 5.8v5.4c0 4.4 3 8.2 7 9.8 4-1.6 7-5.4 7-9.8V5.8L12 3z"/><path d="m9 12 2.2 2.2L15.5 10"/>'),
    "award": _svg('<circle cx="12" cy="9" r="5.5"/><path d="m8.6 13.4-1.6 7.1 5-2.6 5 2.6-1.6-7.1"/>'),
    "instagram": _svg('<rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.2" cy="6.8" r=".6" fill="currentColor"/>'),
    "mail": _svg('<rect x="3" y="5.5" width="18" height="13" rx="2.5"/><path d="m4 7 8 6 8-6"/>'),
    "phone": _svg('<path d="M5.5 3.5h3l1.5 4-2 1.5a11 11 0 0 0 7 7l1.5-2 4 1.5v3a2 2 0 0 1-2 2A16.5 16.5 0 0 1 3.5 5.5a2 2 0 0 1 2-2z"/>'),
    "calendar": _svg('<rect x="3.5" y="5" width="17" height="15" rx="2.5"/><path d="M3.5 10h17M8 3v4M16 3v4"/>'),
    "user": _svg('<circle cx="12" cy="8" r="4"/><path d="M4.5 20.5c1.2-3.6 4-5.5 7.5-5.5s6.3 1.9 7.5 5.5"/>'),
    "rotate": _svg('<path d="M20 11a8 8 0 1 0-2.3 5.7"/><path d="M20 5v6h-6"/>'),
    "quote": _svg('<path d="M3 24V14.5C3 7.6 6.6 3.2 13 2l1 2.6c-3.6 1-5.6 3.6-5.9 7.4H13V24H3zm19 0V14.5C22 7.6 25.6 3.2 32 2l1 2.6c-3.6 1-5.6 3.6-5.9 7.4H32V24H22z"/>', vb="0 0 36 26", fill=True),
    "facebook": _svg('<path d="M14 8.5h2.5V5H14a4 4 0 0 0-4 4v2H8v3.5h2V21h3.5v-6.5H16l.5-3.5h-3V9a.5.5 0 0 1 .5-.5z"/>'),
    "linkedin": _svg('<rect x="3.5" y="3.5" width="17" height="17" rx="3"/><path d="M8 10.5V16M8 7.8v.2M11.5 16v-3.2a2.2 2.2 0 0 1 4.4 0V16M11.5 10.5V16"/>'),
}


def esc(s):
    return _html.escape(s, quote=True)


def slugify(s):
    import unicodedata
    s = unicodedata.normalize("NFKD", s).encode("ascii", "ignore").decode()
    return re.sub(r"[^a-z0-9]+", "-", s.lower()).strip("-")
