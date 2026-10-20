"""CSS e JS do GICEU, embutidos num widget HTML em cada template.

Tudo fica dentro do próprio template (e não nas "Configurações da página"),
para que os estilos sobrevivam quando o template for inserido numa página
pela biblioteca do Elementor.
"""

TOKENS = """
:root{
 --gx-blue:#7590c1;--gx-blue-deep:#4a6699;--gx-ink:#1b2540;--gx-mist:#e8edf6;
 --gx-graphite:#363334;--gx-paper:#fdfdfd;--gx-muted:#6b6768;--gx-line:#e6e3e3;
 --gx-display:'Newsreader',Georgia,serif;--gx-body:'Public Sans',system-ui,sans-serif;
 --gx-mono:'IBM Plex Mono',ui-monospace,monospace;
 --gx-ease:cubic-bezier(.23,1,.32,1);--gx-ease-io:cubic-bezier(.77,0,.175,1);
 --gx-radius:18px;
}
"""

BASE_CSS = TOKENS + r"""
/* bloco de estilos: invisível no site, etiquetado no editor */
.gx-assets{display:none!important}
body.elementor-editor-active .gx-assets{display:flex!important;padding:6px 12px!important;background:repeating-linear-gradient(45deg,#e8edf6 0 8px,#fdfdfd 8px 16px)}
body.elementor-editor-active .gx-assets::before{content:"Estilos e interações GICEU (não remover)";font:500 11px/1.4 var(--gx-mono);color:#4a6699;letter-spacing:.08em;text-transform:uppercase}

@media (prefers-reduced-motion:no-preference){html{scroll-behavior:smooth}}
body{background:var(--gx-paper);color:var(--gx-graphite);-webkit-font-smoothing:antialiased;text-rendering:optimizeLegibility}
::selection{background:var(--gx-blue);color:var(--gx-paper)}

/* tipografia */
.elementor-widget-text-editor p{margin:0 0 1em}
.elementor-widget-text-editor p:last-child{margin-bottom:0}
.elementor-widget-text-editor a{color:inherit;text-decoration:underline;text-decoration-thickness:1px;text-underline-offset:.2em;transition:color .2s ease}
.elementor-heading-title em{font-style:italic;color:var(--gx-blue)}
.gx-on-blue .elementor-heading-title em{color:var(--gx-ink)}
.gx-on-dark .elementor-heading-title em{color:var(--gx-blue)}
.gx-balance .elementor-heading-title{text-wrap:balance}
.gx-pretty p{text-wrap:pretty}
.gx-eyebrow .elementor-heading-title{display:inline-flex;align-items:center;gap:.75em}
.gx-eyebrow .elementor-heading-title::before{content:"";width:.7em;height:.7em;border-radius:50%;border:2px solid currentColor;flex:none}

/* botões */
.gx-btn .elementor-button{white-space:nowrap;transition:background-color .22s ease,color .22s ease,border-color .22s ease,transform .16s var(--gx-ease);-webkit-tap-highlight-color:transparent}
.gx-btn .elementor-button:active{transform:scale(.97)}
.gx-btn .elementor-button-text::after{content:"\2192";display:inline-block;margin-left:.55em;transition:transform .25s var(--gx-ease)}
.gx-btn.gx-btn--plain .elementor-button-text::after{content:none}
@media (hover:hover) and (pointer:fine){.gx-btn .elementor-button:hover .elementor-button-text::after{transform:translateX(4px)}}
.gx-btn .elementor-button:focus-visible,.gx-focus a:focus-visible,.gx-legend button:focus-visible{outline:2px solid var(--gx-blue-deep);outline-offset:3px}
.gx-on-blue .gx-btn .elementor-button:focus-visible,.gx-on-dark .gx-btn .elementor-button:focus-visible{outline-color:var(--gx-paper)}

/* cartões */
.gx-card{transition:transform .35s var(--gx-ease),box-shadow .35s var(--gx-ease),border-color .25s ease;border:1px solid var(--gx-line)}
@media (hover:hover) and (pointer:fine){.gx-card:hover{transform:translateY(-4px);box-shadow:0 18px 40px -24px rgba(27,37,64,.35);border-color:var(--gx-blue)}}

/* selos de linha, como num mapa de transporte */
.gx-badge{display:inline-flex;align-items:center;justify-content:center;width:52px;height:52px;border-radius:50%;font:600 15px/1 var(--gx-mono);letter-spacing:.02em;color:var(--gx-paper);background:var(--gx-blue);box-shadow:0 0 0 5px var(--gx-paper)}
.gx-badge--l2{background:var(--gx-graphite)}
.gx-badge--fm{background:var(--gx-paper);color:var(--gx-blue-deep);box-shadow:inset 0 0 0 3px var(--gx-blue),0 0 0 5px var(--gx-paper)}
.gx-mist .gx-badge{box-shadow:0 0 0 5px var(--gx-mist)}
.gx-mist .gx-badge--fm{box-shadow:inset 0 0 0 3px var(--gx-blue),0 0 0 5px var(--gx-mist)}

/* etiquetas */
.gx-tags{display:flex;flex-wrap:wrap;gap:10px;margin:0;padding:0;list-style:none}
.gx-tags li{font:500 14px/1 var(--gx-body);padding:11px 16px;border-radius:999px;border:1px solid var(--gx-line);background:var(--gx-paper);color:var(--gx-graphite)}

/* fatos em lista de definição */
.gx-facts{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:0;margin:0;border-top:1px solid var(--gx-line)}
.gx-facts div{padding:18px 18px 18px 0;border-bottom:1px solid var(--gx-line)}
.gx-facts dt{font:500 11.5px/1.3 var(--gx-mono);letter-spacing:.12em;text-transform:uppercase;color:var(--gx-blue-deep);margin:0 0 6px}
.gx-facts dd{margin:0;font:400 22px/1.25 var(--gx-display);color:var(--gx-graphite)}

/* entrada ao rolar: sobe 18px e aparece, com cascata curta */
html.gx-ready .gx-reveal{opacity:0;transform:translate3d(0,18px,0);transition:opacity .7s var(--gx-ease) var(--gx-delay,0ms),transform .9s var(--gx-ease) var(--gx-delay,0ms)}
html.gx-ready .gx-reveal.is-in{opacity:1;transform:none}

/* traçados que se desenham */
.gx-path{stroke-dasharray:1;stroke-dashoffset:0}
html.gx-ready .gx-draw .gx-path{stroke-dashoffset:1;transition:stroke-dashoffset 1.6s var(--gx-ease-io) var(--gx-pd,0ms)}
html.gx-ready .gx-draw.is-in .gx-path{stroke-dashoffset:0}
html.gx-ready .gx-draw .gx-stn{opacity:0;transform:scale(.6);transition:opacity .4s ease var(--d,0ms),transform .5s var(--gx-ease) var(--d,0ms)}
html.gx-ready .gx-draw.is-in .gx-stn{opacity:1;transform:none}
.gx-stn{transform-box:fill-box;transform-origin:center}

@media (prefers-reduced-motion:reduce){
 html.gx-ready .gx-reveal{transform:none;transition:opacity .4s ease}
 html.gx-ready .gx-draw .gx-path{stroke-dashoffset:0;transition:none}
 html.gx-ready .gx-draw .gx-stn{transform:none;transition:opacity .4s ease}
 .gx-btn .elementor-button,.gx-card{transition:background-color .2s ease,color .2s ease,border-color .2s ease}
 .gx-card:hover{transform:none!important}
}
"""

HEADER_CSS = r"""
/* faixa institucional */
.gx-topbar .elementor-heading-title a,.gx-topbar a{color:inherit;transition:color .2s ease}
.gx-topbar a:hover{color:var(--gx-paper)}

/* barra principal: ganha fundo translúcido e fio ao rolar */
.gx-header{transition:background-color .3s ease,box-shadow .3s ease,padding .3s var(--gx-ease);backdrop-filter:saturate(1.4) blur(0);-webkit-backdrop-filter:saturate(1.4) blur(0)}
.gx-header.elementor-sticky--effects,body.gx-scrolled .gx-header{background-color:rgba(253,253,253,.86)!important;box-shadow:0 1px 0 var(--gx-line);backdrop-filter:saturate(1.4) blur(14px);-webkit-backdrop-filter:saturate(1.4) blur(14px);padding-top:10px!important;padding-bottom:10px!important}

/* marca: GICEU + ponto de estação */
.gx-logo .elementor-heading-title a{color:inherit}
.gx-logo .elementor-heading-title::after{content:"";display:inline-block;width:.3em;height:.3em;margin-left:.08em;border-radius:50%;background:var(--gx-blue);box-shadow:0 0 0 0 rgba(117,144,193,.5);transition:transform .3s var(--gx-ease),box-shadow .5s ease}
@media (hover:hover) and (pointer:fine){.gx-logo:hover .elementor-heading-title::after{transform:scale(1.3);box-shadow:0 0 0 6px rgba(117,144,193,0)}}
.gx-logo-sub{border-left:1px solid var(--gx-line);padding-left:14px}

/* menu: ponto azul no lugar do sublinhado */
.gx-nav .elementor-nav-menu--main .elementor-item{position:relative}
.gx-nav .elementor-nav-menu--main .elementor-item::after{content:""!important;position:absolute;left:50%;bottom:0;width:6px;height:6px;margin-left:-3px;border-radius:50%;background:var(--gx-blue);opacity:0;transform:translateY(4px) scale(.6);transition:opacity .2s ease,transform .3s var(--gx-ease);display:block!important}
.gx-nav .elementor-nav-menu--main .elementor-item:hover::after,.gx-nav .elementor-nav-menu--main .elementor-item:focus-visible::after,.gx-nav .elementor-nav-menu--main .elementor-item.elementor-item-active::after{opacity:1;transform:none}
.gx-nav .elementor-nav-menu--dropdown{border-top:1px solid var(--gx-line);box-shadow:0 24px 40px -28px rgba(27,37,64,.4)}
.gx-nav .elementor-menu-toggle{border-radius:50%;transition:background-color .2s ease,transform .16s var(--gx-ease)}
.gx-nav .elementor-menu-toggle:active{transform:scale(.94)}

/* botão do podcast no cabeçalho */
.gx-cta-pod .elementor-button-icon i{transition:transform .35s var(--gx-ease)}
@media (hover:hover) and (pointer:fine){.gx-cta-pod .elementor-button:hover .elementor-button-icon i{transform:rotate(-12deg) scale(1.08)}}
"""

FOOTER_CSS = r"""
.gx-footer a{color:inherit}
.gx-footer .elementor-widget-text-editor a{text-decoration-color:rgba(253,253,253,.35);transition:text-decoration-color .2s ease,color .2s ease}
.gx-footer .elementor-widget-text-editor a:hover{text-decoration-color:var(--gx-blue);color:var(--gx-paper)}
.gx-footer .gx-label .elementor-heading-title{color:var(--gx-blue)!important}
.gx-footer .elementor-social-icon{transition:background-color .2s ease,transform .16s var(--gx-ease)}
.gx-footer .elementor-social-icon:hover{background:var(--gx-blue)!important}
.gx-footer .elementor-social-icon:active{transform:scale(.94)}

/* o mapa do site é uma linha de metrô */
.gx-metro{position:relative}
.gx-metro ul{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:repeat(8,minmax(0,1fr));position:relative}
.gx-metro ul::before{content:"";position:absolute;left:0;right:0;top:11px;height:6px;border-radius:6px;background:var(--gx-blue);transform-origin:left center}
.gx-metro li{position:relative;z-index:1}
.gx-metro a{display:flex;flex-direction:column;align-items:flex-start;gap:16px;text-decoration:none;color:rgba(253,253,253,.72);padding-bottom:4px;transition:color .2s ease}
.gx-metro .gx-dot{position:relative;z-index:1;flex:none;width:28px;height:28px;border-radius:50%;background:var(--gx-graphite);border:5px solid var(--gx-paper);transition:transform .3s var(--gx-ease),background-color .2s ease}
.gx-metro .gx-name{font:400 19px/1.2 var(--gx-display)}
.gx-metro .gx-name small{display:block;font:500 10.5px/1.4 var(--gx-mono);letter-spacing:.14em;text-transform:uppercase;color:rgba(253,253,253,.55);margin-top:4px}
.gx-metro a:hover,.gx-metro a:focus-visible{color:var(--gx-paper)}
.gx-metro a:hover .gx-dot,.gx-metro a:focus-visible .gx-dot{transform:scale(1.18);background:var(--gx-blue)}
.gx-metro a:focus-visible{outline:2px solid var(--gx-paper);outline-offset:6px;border-radius:6px}
html.gx-ready .gx-metro.gx-draw ul::before{transform:scaleX(0);transition:transform 1.4s var(--gx-ease-io)}
html.gx-ready .gx-metro.gx-draw.is-in ul::before{transform:none}
html.gx-ready .gx-metro.gx-draw li{opacity:0;transform:translateY(8px);transition:opacity .45s ease calc(var(--i)*90ms + 200ms),transform .6s var(--gx-ease) calc(var(--i)*90ms + 200ms)}
html.gx-ready .gx-metro.gx-draw.is-in li{opacity:1;transform:none}
@media (max-width:1024px){
 .gx-metro ul{grid-template-columns:repeat(4,minmax(0,1fr));row-gap:36px}
 .gx-metro ul::before{display:none}
 .gx-metro li::before{content:"";position:absolute;left:0;right:0;top:11px;height:6px;background:var(--gx-blue)}
 .gx-metro li:nth-child(4n)::before{right:auto;width:28px}
}
@media (max-width:767px){
 .gx-metro ul{grid-template-columns:1fr;row-gap:0}
 .gx-metro li::before{left:11px;right:auto;top:0;bottom:0;width:6px;height:auto}
 .gx-metro li:first-child::before{top:14px}.gx-metro li:last-child::before{bottom:auto;height:14px}
 .gx-metro li:nth-child(4n)::before{width:6px}
 .gx-metro a{flex-direction:row;align-items:center;gap:18px;padding:8px 0}
 .gx-metro .gx-name small{display:inline;margin:0 0 0 8px}
}

.gx-totop .elementor-button-text::after{content:"\2191"!important}
@media (hover:hover) and (pointer:fine){.gx-totop .elementor-button:hover .elementor-button-text::after{transform:translateY(-3px)!important}}
@media (prefers-reduced-motion:reduce){html.gx-ready .gx-metro.gx-draw li{transform:none}html.gx-ready .gx-metro.gx-draw ul::before{transform:none;transition:none}}
"""

HOME_CSS = r"""
/* hero */
.gx-hero-title .elementor-heading-title::after{content:"";display:inline-block;width:.16em;height:.16em;margin-left:.04em;border-radius:50%;background:var(--gx-blue)}
.gx-coords{font:500 11.5px/1.5 var(--gx-mono);letter-spacing:.14em;text-transform:uppercase;color:var(--gx-muted);display:flex;gap:28px;flex-wrap:wrap;align-items:center}
.gx-coords span{display:inline-flex;align-items:center;gap:10px}
.gx-coords span::before{content:"";width:18px;height:1px;background:currentColor}

/* mapa das linhas */
.gx-map{position:relative}
.gx-map svg{display:block;width:100%;height:auto;overflow:visible}
.gx-map .gx-line{transition:opacity .35s ease}
.gx-map[data-hl] .gx-line{opacity:.14}
.gx-map[data-hl="l1"] .gx-l1,.gx-map[data-hl="l2"] .gx-l2,.gx-map[data-hl="l3"] .gx-l3{opacity:1}
.gx-map .gx-lbl{font:500 11px var(--gx-mono);letter-spacing:.12em;fill:var(--gx-muted)}
.gx-map .gx-term{font:italic 400 24px var(--gx-display)}
.gx-map .gx-l3 .gx-dash{opacity:0;transition:opacity .8s ease 1.3s}
.gx-map.is-in .gx-l3 .gx-dash,html:not(.gx-ready) .gx-map .gx-l3 .gx-dash{opacity:1}
.gx-legend{display:flex;flex-wrap:wrap;gap:8px 18px;margin:18px 0 0;padding:0;list-style:none}
.gx-legend button{all:unset;cursor:pointer;display:inline-flex;align-items:center;gap:10px;font:500 13px/1.3 var(--gx-body);color:var(--gx-graphite);padding:6px 2px;border-radius:6px}
.gx-legend i{width:22px;height:6px;border-radius:6px;background:var(--gx-blue)}
.gx-legend [data-gx-hl="l2"] i{background:var(--gx-graphite)}
.gx-legend [data-gx-hl="l3"] i{background:repeating-linear-gradient(90deg,var(--gx-blue-deep) 0 6px,transparent 6px 10px)}
.gx-legend b{font:500 11px var(--gx-mono);letter-spacing:.1em;color:var(--gx-muted)}

.gx-tags--lg li{font-size:17px;padding:15px 22px}
.gx-tags--lg li:nth-child(n+5){background:var(--gx-mist);border-color:var(--gx-mist)}

/* linha que liga os três cartões */
.gx-linerow{position:relative}
.gx-linerow::before{content:"";position:absolute;left:0;right:0;top:23px;height:6px;border-radius:6px;background:linear-gradient(90deg,var(--gx-blue) 0 34%,var(--gx-graphite) 34% 67%,var(--gx-blue-deep) 67% 100%);transform-origin:left;z-index:1}
.gx-linerow>.gx-linecard{z-index:auto}
.gx-linerow .gx-badge{position:relative;z-index:2}
html.gx-ready .gx-linerow.gx-draw::before{transform:scaleX(0);transition:transform 1.5s var(--gx-ease-io) .2s}
html.gx-ready .gx-linerow.gx-draw.is-in::before{transform:scaleX(1)}
@media (hover:hover) and (pointer:fine){.gx-linecard.gx-card:hover{transform:none}}
@media (max-width:1024px){.gx-linerow::before{display:none}}
.gx-track{position:relative;height:6px;margin:0 26px}
.gx-track::before{content:"";position:absolute;inset:0;border-radius:6px;background:linear-gradient(90deg,var(--gx-blue) 0 50%,var(--gx-graphite) 50% 100%);transform-origin:left;transform:scaleX(1)}
html.gx-ready .gx-track.gx-draw::before{transform:scaleX(0);transition:transform 1.5s var(--gx-ease-io)}
html.gx-ready .gx-track.gx-draw.is-in::before{transform:scaleX(1)}
.gx-linecard{position:relative}
.gx-linecard>.gx-badge-w{margin-top:-26px}
.gx-badge-w,.gx-badge-w .elementor-widget-container{line-height:0}

/* equalizador do bloco do podcast */
.gx-eq{display:flex;align-items:center;gap:6px;height:220px}
.gx-eq span{flex:1;min-width:4px;height:var(--h);border-radius:6px;background:var(--gx-paper);transform-origin:center;opacity:.95}
.gx-eq span:nth-child(3n){background:var(--gx-ink)}
.gx-eq.is-playing span{animation:gx-eq var(--t,1.2s) ease-in-out var(--dl,0s) infinite alternate}
@keyframes gx-eq{from{transform:scaleY(1)}to{transform:scaleY(.35)}}

/* letreiro da imprensa */
.gx-marquee{overflow:hidden;-webkit-mask:linear-gradient(90deg,transparent,#000 8%,#000 92%,transparent);mask:linear-gradient(90deg,transparent,#000 8%,#000 92%,transparent)}
.gx-marquee__track{display:flex;width:max-content;gap:0}
.gx-marquee__track span{display:inline-flex;align-items:center;white-space:nowrap;font:italic 400 clamp(30px,4vw,54px)/1.2 var(--gx-display);color:var(--gx-paper);padding:0 .55em}
.gx-marquee__track span::after{content:"";width:.2em;height:.2em;border-radius:50%;background:var(--gx-blue);margin-left:1.1em}
.gx-marquee.is-playing .gx-marquee__track{animation:gx-marquee 38s linear infinite}
.gx-marquee:hover .gx-marquee__track{animation-play-state:paused}
@keyframes gx-marquee{to{transform:translateX(-50%)}}

/* posts */
.gx-posts .elementor-post{background:var(--gx-paper);border:1px solid var(--gx-line);border-radius:var(--gx-radius);overflow:hidden;transition:transform .35s var(--gx-ease),box-shadow .35s var(--gx-ease),border-color .25s ease}
.gx-posts .elementor-post__thumbnail__link{margin:0!important;display:block}
.gx-posts .elementor-post__thumbnail{border-radius:0;overflow:hidden;padding-bottom:62%;position:relative}
.gx-posts .elementor-post__thumbnail img{transition:transform .8s var(--gx-ease)}
.gx-posts .elementor-post__text{padding:22px 24px 26px}
.gx-posts .elementor-post__title{font:500 22px/1.2 var(--gx-display);margin:0 0 10px}
.gx-posts .elementor-post__title a{color:var(--gx-graphite);text-decoration:none}
.gx-posts .elementor-post__meta-data{font:500 11.5px/1.4 var(--gx-mono)!important;letter-spacing:.1em;text-transform:uppercase;color:var(--gx-blue-deep)!important;margin:0 0 12px}
.gx-posts .elementor-post__excerpt p{font:400 15.5px/1.6 var(--gx-body);color:var(--gx-muted);margin:0 0 16px}
.gx-posts .elementor-post__read-more{font:600 14px/1 var(--gx-body)!important;color:var(--gx-graphite)!important;text-decoration:none}
.gx-posts .elementor-post__read-more::after{content:" \2192";display:inline-block;transition:transform .25s var(--gx-ease)}
@media (hover:hover) and (pointer:fine){
 .gx-posts .elementor-post:hover{transform:translateY(-4px);box-shadow:0 18px 40px -24px rgba(27,37,64,.35);border-color:var(--gx-blue)}
 .gx-posts .elementor-post:hover .elementor-post__thumbnail img{transform:scale(1.04)}
 .gx-posts .elementor-post:hover .elementor-post__read-more::after{transform:translateX(4px)}
}
@media (prefers-reduced-motion:reduce){.gx-eq.is-playing span,.gx-marquee.is-playing .gx-marquee__track{animation:none}.gx-marquee__track{flex-wrap:wrap;width:auto}.gx-marquee__track span[aria-hidden]{display:none}}
"""

ABOUT_CSS = r"""
.gx-hero-meta{font:500 11.5px/1.5 var(--gx-mono);letter-spacing:.14em;text-transform:uppercase;color:var(--gx-muted);display:flex;gap:10px 28px;flex-wrap:wrap}
.gx-hero-meta span{display:inline-flex;align-items:center;gap:10px}
.gx-hero-meta span::before{content:"";width:8px;height:8px;border-radius:50%;background:var(--gx-blue)}

/* linha do tempo como linha de metrô vertical */
.gx-timeline{position:relative}
.gx-timeline::before{content:"";position:absolute;left:11px;top:14px;bottom:14px;width:6px;border-radius:6px;background:var(--gx-blue);transform-origin:top}
html.gx-ready .gx-timeline.gx-draw::before{transform:scaleY(0);transition:transform 1.8s var(--gx-ease-io)}
html.gx-ready .gx-timeline.gx-draw.is-in::before{transform:none}
.gx-stop{position:relative;padding-left:64px!important}
.gx-stop::before{content:"";position:absolute;left:0;top:6px;width:28px;height:28px;border-radius:50%;background:var(--gx-paper);border:5px solid var(--gx-graphite);box-sizing:border-box}
.gx-stop:first-child::before{background:var(--gx-blue);border-color:var(--gx-graphite)}

/* coordenação */
.gx-portrait img,.gx-portrait .gxp-ph{border-radius:var(--gx-radius);aspect-ratio:4/5;object-fit:cover;width:100%;filter:grayscale(.2)}
.gx-role .elementor-heading-title{display:inline-flex;gap:10px;align-items:center}

/* mapa */
.gx-mapembed iframe,.gx-mapembed .gxp-map{border-radius:var(--gx-radius);filter:grayscale(1) contrast(1.05);transition:filter .6s ease;display:block}
.gx-mapembed:hover iframe{filter:grayscale(.2)}
.gx-address{font-style:normal}
"""

PODCAST_CSS = r"""
/* onda sonora do hero */
.gx-wave{display:flex;align-items:center;gap:5px;height:clamp(140px,22vw,300px)}
.gx-wave span{flex:1;min-width:3px;height:var(--h);border-radius:5px;background:var(--gx-paper);transform-origin:center}
.gx-wave span:nth-child(4n+1){background:var(--gx-ink)}
.gx-wave.is-playing span{animation:gx-breathe var(--t,1.6s) ease-in-out var(--dl,0s) infinite alternate}
@media (max-width:767px){.gx-wave{gap:4px}.gx-wave span{min-width:0}.gx-wave span:nth-child(2n){display:none}}
@keyframes gx-breathe{from{transform:scaleY(1)}to{transform:scaleY(.42)}}
html.gx-ready .gx-wave span{transform:scaleY(.02);transition:transform .9s var(--gx-ease) calc(var(--i)*12ms)}
html.gx-ready .gx-wave.is-in span{transform:scaleY(1)}
html.gx-ready .gx-wave.is-in.is-playing span{transition:none}

/* plataformas */
.gx-platform .elementor-button{min-width:220px;justify-content:flex-start}
.gx-platform .elementor-button-content-wrapper{gap:12px}
.gx-platform .elementor-button-icon i{font-size:1.25em;transition:transform .3s var(--gx-ease)}
@media (hover:hover) and (pointer:fine){.gx-platform .elementor-button:hover .elementor-button-icon i{transform:scale(1.12)}}

/* fichas do formato */
.gx-spec{border-top:2px solid var(--gx-blue)}

/* capas geradas */
.gx-cover{position:relative;aspect-ratio:1;border-radius:14px;background:var(--gx-blue);overflow:hidden;color:var(--gx-paper);display:flex;flex-direction:column;justify-content:space-between;padding:14px;box-sizing:border-box;min-width:0}
.gx-cover small{font:500 10.5px/1 var(--gx-mono);letter-spacing:.14em;text-transform:uppercase;color:var(--gx-ink)}
.gx-cover strong{font:400 44px/0.9 var(--gx-display);letter-spacing:-.02em}
.gx-cover i{position:absolute;right:12px;top:12px;display:flex;gap:3px;align-items:center;height:36px}
.gx-cover i b{width:3px;border-radius:3px;background:var(--gx-paper);height:var(--h)}
.gx-cover:not(.gx-cover--lg) small,.gx-cover:not(.gx-cover--lg) i{display:none}
.gx-cover:not(.gx-cover--lg) strong{font-size:38px}
.gx-cover--lg strong{font-size:clamp(64px,8vw,104px)}
.gx-cover--lg{padding:26px;border-radius:var(--gx-radius)}
.gx-cover--lg i{height:70px;gap:5px;right:24px;top:24px}.gx-cover--lg i b{width:5px}

/* área do player */
.gx-embed{border-radius:14px;background:var(--gx-paper);border:1.5px dashed var(--gx-blue);min-height:152px;display:flex;align-items:center;justify-content:center;padding:20px;text-align:center;font:500 12px/1.5 var(--gx-mono);letter-spacing:.08em;text-transform:uppercase;color:var(--gx-blue-deep)}
.gx-embed iframe{width:100%;border:0;border-radius:12px}

/* lista de episódios */
.gx-ep{border-bottom:1px solid var(--gx-line);transition:background-color .25s ease;border-radius:var(--gx-radius)}
.gx-ep .gx-cover{transition:transform .5s var(--gx-ease)}
@media (hover:hover) and (pointer:fine){.gx-ep:hover{background:var(--gx-mist)}.gx-ep:hover .gx-cover{transform:rotate(-3deg) scale(1.03)}}
.gx-ep-meta{font:500 11.5px/1.5 var(--gx-mono);letter-spacing:.12em;text-transform:uppercase;color:var(--gx-blue-deep);display:flex;gap:18px;flex-wrap:wrap}
.gx-quote .elementor-heading-title{position:relative;padding-left:34px}
.gx-quote .elementor-heading-title::before{content:"";position:absolute;left:0;top:.2em;bottom:.2em;width:6px;border-radius:6px;background:var(--gx-blue)}
@media (prefers-reduced-motion:reduce){.gx-wave.is-playing span{animation:none}html.gx-ready .gx-wave span{transform:none;transition:none}}
"""

JS = r"""
(function(){
 if(window.__gx)return;window.__gx=1;
 var d=document,root=d.documentElement;
 function ready(fn){d.readyState!=='loading'?fn():d.addEventListener('DOMContentLoaded',fn)}
 var editor=/elementor-editor-active/.test(d.body?d.body.className:'')||/elementor-preview/.test(location.search);
 function onScroll(){d.body&&d.body.classList.toggle('gx-scrolled',window.scrollY>40)}
 window.addEventListener('scroll',onScroll,{passive:true});ready(onScroll);
 ready(function(){
  // destaque das linhas no mapa ao passar o mouse na legenda
  d.querySelectorAll('[data-gx-hl]').forEach(function(b){
   var m=b.closest('.gx-map-wrap');m=m&&m.querySelector('.gx-map');if(!m)return;
   function on(){m.setAttribute('data-hl',b.getAttribute('data-gx-hl'))}
   function off(){m.removeAttribute('data-hl')}
   b.addEventListener('mouseenter',on);b.addEventListener('focus',on);
   b.addEventListener('mouseleave',off);b.addEventListener('blur',off);
  });
  // índice para cascatas
  d.querySelectorAll('.gx-stagger').forEach(function(p){
   p.querySelectorAll('.gx-reveal').forEach(function(k,i){k.style.setProperty('--gx-delay',Math.min(i*70,420)+'ms')});
  });
  d.querySelectorAll('.gx-metro li,.gx-wave span').forEach(function(li){li.style.setProperty('--i',[].indexOf.call(li.parentNode.children,li))});
  var all=d.querySelectorAll('.gx-reveal,.gx-draw'),live=d.querySelectorAll('.gx-live');
  if(editor||!('IntersectionObserver' in window)){
   all.forEach(function(e){e.classList.add('is-in')});live.forEach(function(e){e.classList.add('is-playing')});return;
  }
  root.classList.add('gx-ready');
  var io=new IntersectionObserver(function(es){es.forEach(function(e){
   if(e.isIntersecting){e.target.classList.add('is-in');io.unobserve(e.target)}
  })},{rootMargin:'0px 0px -8% 0px',threshold:.12});
  all.forEach(function(e){io.observe(e)});
  // animações contínuas só rodam quando visíveis
  var lo=new IntersectionObserver(function(es){es.forEach(function(e){
   var el=e.target;
   if(e.isIntersecting){clearTimeout(el.__gxT);el.__gxT=setTimeout(function(){el.classList.add('is-playing')},el.classList.contains('gx-wave')?1400:0)}
   else{clearTimeout(el.__gxT);el.classList.remove('is-playing')}
  })},{threshold:0});
  live.forEach(function(e){lo.observe(e)});
 });
})();
"""


def assets_block(*css):
    return "<style>" + "".join(css).replace("\n", "") + "</style>\n<script>" + JS.strip() + "</script>"
