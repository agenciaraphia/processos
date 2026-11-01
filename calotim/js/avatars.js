/* Calotim - personagens dos avatares (SVG em traço, paleta oficial).
 * Cada personagem substitui um emoji das versões até 0.7. Valores antigos salvos com emoji
 * continuam funcionando: `resolve` converte o emoji no personagem equivalente só na exibição.
 */
(function (root) {
  const INK = '#29352E';
  const GREEN = '#245A43';
  const ORANGE = '#F28B42';
  const GREEN_SOFT = '#E6F0E9';
  const ORANGE_SOFT = '#FFF0E3';
  const GREEN_MID = '#6E9E80';
  const ORANGE_TINT = '#F7C29A';
  const LINE = '#E8EAE5';
  const W = '#FFFFFF';

  // Atributos de traço compartilhados por todos os personagens.
  const S = `stroke="${INK}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"`;
  const eyes = (y = 21, l = 16.4, r = 23.6) => `<circle cx="${l}" cy="${y}" r="1.25" fill="${INK}"/><circle cx="${r}" cy="${y}" r="1.25" fill="${INK}"/>`;
  const smile = (y = 25) => `<path d="M16.9 ${y}c1.8 1.5 4.4 1.5 6.2 0" fill="none" ${S}/>`;
  const openSmile = (y = 24.4) => `<path d="M16.3 ${y}h7.4c0 2.3-1.7 3.9-3.7 3.9s-3.7-1.6-3.7-3.9z" fill="${INK}"/>`;
  const cheeks = (y = 24.2) => `<circle cx="13.9" cy="${y}" r="1.5" fill="${ORANGE}" opacity=".35"/><circle cx="26.1" cy="${y}" r="1.5" fill="${ORANGE}" opacity=".35"/>`;
  const head = (cy = 21, r = 9.2, fill = W) => `<circle cx="20" cy="${cy}" r="${r}" fill="${fill}" ${S}/>`;
  const bg = color => `<rect width="40" height="40" fill="${color}"/>`;

  const LIST = [
    { key: 'sorriso', label: 'Sorriso', legacy: '\u{1F600}', art: bg(GREEN_SOFT) + head(21.5) +
      `<path d="M12.3 18.6c.6-4.9 3.8-7.6 7.7-7.6s7.1 2.7 7.7 7.6c-2.3-1.6-4.9-2.4-7.7-2.4s-5.4.8-7.7 2.4z" fill="${GREEN}" ${S}/>` + eyes(21.3) + openSmile(24.6) + cheeks(24.4) },
    { key: 'oculos', label: 'Óculos escuros', legacy: '\u{1F60E}', art: bg(ORANGE_SOFT) + head(21.5) +
      `<path d="M11.4 19.6c-.2-5.6 3.6-9.2 8.6-9.2 4.4 0 7.9 2.7 8.7 7.1-3.3-.3-6.6-1.7-8.8-4-1.7 2.8-4.8 5-8.5 6.1z" fill="${INK}"/>` +
      `<rect x="12.8" y="19" width="6.2" height="4.2" rx="1.9" fill="${INK}"/><rect x="21" y="19" width="6.2" height="4.2" rx="1.9" fill="${INK}"/><path d="M19 20.4h2" fill="none" ${S}/>` +
      `<path d="M14.3 20.3l1.4-.6" stroke="${W}" stroke-width="1" stroke-linecap="round"/>` + `<path d="M17.6 26c1.6.7 3.6.6 5-.5" fill="none" ${S}/>` },
    { key: 'festa', label: 'Festa', legacy: '\u{1F973}', art: bg(GREEN_SOFT) +
      `<circle cx="7.5" cy="12" r="1.3" fill="${ORANGE}"/><rect x="30.4" y="9.2" width="2.4" height="2.4" rx=".5" transform="rotate(20 31.6 10.4)" fill="${GREEN}"/><circle cx="33" cy="27.5" r="1.2" fill="${ORANGE}"/><circle cx="8.2" cy="30" r="1" fill="${GREEN}"/>` +
      head(23) + `<path d="M14.6 15.2L20 4.6l5.4 10.6z" fill="${ORANGE}" ${S}/><path d="M17 10.6l4.6 2.2M18.6 7.6l3 1.4" fill="none" stroke="${W}" stroke-width="1.2" stroke-linecap="round"/><circle cx="20" cy="4.4" r="1.7" fill="${GREEN}"/>` +
      `<path d="M15.4 22.6c.7-.9 1.9-.9 2.6 0M22 22.6c.7-.9 1.9-.9 2.6 0" fill="none" ${S}/>` + openSmile(25.4) + cheeks(25.2) },
    { key: 'cowboy', label: 'Cowboy', legacy: '\u{1F920}', art: bg(ORANGE_SOFT) + head(23.5, 8.8) +
      `<path d="M14.2 15.8c0-4.4 1.5-8.2 3-8.2 1 0 1.9 1 2.8 1s1.8-1 2.8-1c1.5 0 3 3.8 3 8.2z" fill="${GREEN}" ${S}/>` +
      `<ellipse cx="20" cy="16" rx="13" ry="2.7" fill="${GREEN}" ${S}/><path d="M14.6 13.4h10.8" stroke="${ORANGE}" stroke-width="1.6" stroke-linecap="round"/>` + eyes(23) + smile(26.4) },
    { key: 'chef', label: 'Chef', legacy: '\u{1F9D1}\u{200D}\u{1F373}', art: bg(GREEN_SOFT) + head(24.5, 8.8) +
      `<path d="M13.6 17v-2.4a3.7 3.7 0 0 1 1.5-7.1 4.9 4.9 0 0 1 9.8 0 3.7 3.7 0 0 1 1.5 7.1V17z" fill="${W}" ${S}/><path d="M13.6 14.6h12.8" fill="none" ${S}/>` +
      eyes(23.4) + `<path d="M16.3 26.6c1.3-.7 2.7-.8 3.7-.1 1-.7 2.4-.6 3.7.1" fill="none" ${S}/>` + smile(28.4) },
    { key: 'musica', label: 'Música', legacy: '\u{1F469}\u{200D}\u{1F3A4}', art: bg(ORANGE_SOFT) +
      `<path d="M31.6 8.4v7" fill="none" ${S}/><path d="M31.6 8.4l2.8 1" fill="none" ${S}/><circle cx="30.2" cy="15.6" r="1.6" fill="${INK}"/>` +
      head(22.5, 8.8) + `<path d="M12.2 20.6c1.4-4.2 4.4-6.4 7.8-6.4s6.4 2.2 7.8 6.4c-3-1-5.4-2.9-6.5-4.6-2 2.6-5.2 4.1-9.1 4.6z" fill="${INK}"/>` +
      `<path d="M10.6 23a9.4 9.4 0 0 1 18.8 0" fill="none" stroke="${INK}" stroke-width="1.8" stroke-linecap="round"/>` +
      `<rect x="8.6" y="21.4" width="4.2" height="7" rx="2.1" fill="${ORANGE}" ${S}/><rect x="27.2" y="21.4" width="4.2" height="7" rx="2.1" fill="${ORANGE}" ${S}/>` +
      `<path d="M15.8 23.2c.8.7 1.9.7 2.6 0M21.6 23.2c.8.7 1.9.7 2.6 0" fill="none" ${S}/>` + smile(26.3) },
    { key: 'artista', label: 'Artista', legacy: '\u{1F9D1}\u{200D}\u{1F3A8}', art: bg(GREEN_SOFT) +
      `<circle cx="32.4" cy="30.4" r="1.6" fill="${GREEN}"/><circle cx="34.2" cy="26.2" r="1.2" fill="${ORANGE}"/>` + head(23.5, 8.8) +
      `<path d="M11.4 18.2c-.2-4.1 3.9-7 8.9-7s9.6 2.6 9.6 6.1c-3-1.2-6.1-1.7-9.3-1.7-3.3 0-6.3.9-9.2 2.6z" fill="${ORANGE}" ${S}/><path d="M20.6 11.2V8.8" fill="none" ${S}/>` +
      eyes(23.4) + smile(26.6) + cheeks(26.2) },
    { key: 'astronauta', label: 'Astronauta', legacy: '\u{1F9D1}\u{200D}\u{1F680}', art: bg(GREEN) +
      `<circle cx="8" cy="9.5" r="1" fill="${W}"/><circle cx="33.5" cy="8" r=".8" fill="${W}"/><circle cx="32" cy="32" r="1" fill="${W}" opacity=".7"/><path d="M8 28.5v3M6.5 30h3" stroke="${W}" stroke-width="1.1" stroke-linecap="round" opacity=".8"/>` +
      `<path d="M20 10.4V7.4" stroke="${W}" stroke-width="1.5" stroke-linecap="round"/><circle cx="20" cy="6.4" r="1.6" fill="${ORANGE}"/>` +
      `<circle cx="20" cy="21.5" r="11" fill="${W}" ${S}/><rect x="12.6" y="16.4" width="14.8" height="10.4" rx="5.2" fill="${INK}"/>` +
      `<circle cx="17.6" cy="21.2" r="1.1" fill="${W}"/><circle cx="22.4" cy="21.2" r="1.1" fill="${W}"/><path d="M18 23.8c1.2.9 2.8.9 4 0" fill="none" stroke="${W}" stroke-width="1.2" stroke-linecap="round"/>` +
      `<path d="M14.6 18.8c.6-.9 1.4-1.4 2.4-1.5" stroke="${GREEN_MID}" stroke-width="1.1" stroke-linecap="round"/>` },
    { key: 'raposa', label: 'Raposa', legacy: '\u{1F98A}', art: bg(GREEN_SOFT) +
      `<path d="M11.2 18.4L12.4 8l6.3 5.2z" fill="${ORANGE}" ${S}/><path d="M28.8 18.4L27.6 8l-6.3 5.2z" fill="${ORANGE}" ${S}/>` +
      `<path d="M10.4 19.6c0-4.6 4.4-7.6 9.6-7.6s9.6 3 9.6 7.6c0 5.6-4.6 10.6-9.6 10.6s-9.6-5-9.6-10.6z" fill="${ORANGE}" ${S}/>` +
      `<path d="M13.6 22.6c2.2.2 4.8 1.5 6.4 3.6 1.6-2.1 4.2-3.4 6.4-3.6-1 3.7-3.6 6.7-6.4 6.7s-5.4-3-6.4-6.7z" fill="${W}" ${S}/>` +
      eyes(20.2, 16, 24) + `<circle cx="20" cy="26.4" r="1.3" fill="${INK}"/>` },
    { key: 'panda', label: 'Panda', legacy: '\u{1F43C}', art: bg(ORANGE_SOFT) +
      `<circle cx="12.4" cy="12.8" r="3.6" fill="${INK}"/><circle cx="27.6" cy="12.8" r="3.6" fill="${INK}"/>` + head(21.5, 9.6) +
      `<ellipse cx="16" cy="20.8" rx="2.6" ry="3.3" transform="rotate(28 16 20.8)" fill="${INK}"/><ellipse cx="24" cy="20.8" rx="2.6" ry="3.3" transform="rotate(-28 24 20.8)" fill="${INK}"/>` +
      `<circle cx="16.4" cy="20.4" r="1" fill="${W}"/><circle cx="23.6" cy="20.4" r="1" fill="${W}"/><ellipse cx="20" cy="24.6" rx="1.7" ry="1.1" fill="${INK}"/><path d="M18.4 26.8c1 .7 2.2.7 3.2 0" fill="none" ${S}/>` },
    { key: 'sapo', label: 'Sapo', legacy: '\u{1F438}', art: bg(ORANGE_SOFT) +
      `<ellipse cx="20" cy="23.5" rx="11.4" ry="8.2" fill="${GREEN_MID}" ${S}/><circle cx="14" cy="15.2" r="4.2" fill="${GREEN_MID}" ${S}/><circle cx="26" cy="15.2" r="4.2" fill="${GREEN_MID}" ${S}/>` +
      `<circle cx="14" cy="15.2" r="2.5" fill="${W}"/><circle cx="26" cy="15.2" r="2.5" fill="${W}"/><circle cx="14.3" cy="15.5" r="1.25" fill="${INK}"/><circle cx="25.7" cy="15.5" r="1.25" fill="${INK}"/>` +
      `<path d="M12.6 24.6c3.6 3.2 11.2 3.2 14.8 0" fill="none" ${S}/><circle cx="11.6" cy="22.2" r="1.4" fill="${ORANGE}" opacity=".55"/><circle cx="28.4" cy="22.2" r="1.4" fill="${ORANGE}" opacity=".55"/>` },
    { key: 'gato', label: 'Gato', legacy: '\u{1F431}', art: bg(GREEN_SOFT) +
      `<path d="M11.6 17.6L12 8.4l6.8 4.6z" fill="${ORANGE_TINT}" ${S}/><path d="M28.4 17.6L28 8.4l-6.8 4.6z" fill="${ORANGE_TINT}" ${S}/>` +
      head(21.5, 9.6, ORANGE_TINT) + `<path d="M13.2 13.6l.3-3.2 2.6 1.8M26.8 13.6l-.3-3.2-2.6 1.8" fill="${ORANGE}" stroke="none"/>` +
      eyes(20.6) + `<path d="M19 23.3h2l-1 1.2z" fill="${INK}" ${S}/><path d="M17.9 25.6c.6.8 1.5.8 2.1 0 .6.8 1.5.8 2.1 0" fill="none" ${S}/>` +
      `<path d="M8.8 22.6l4.2.6M8.8 25.6l4.2-.5M31.2 22.6l-4.2.6M31.2 25.6l-4.2-.5" fill="none" ${S}/>` },
    { key: 'urso', label: 'Urso', legacy: '\u{1F43B}', art: bg(ORANGE_SOFT) +
      `<circle cx="12.4" cy="13.2" r="3.7" fill="${ORANGE_TINT}" ${S}/><circle cx="27.6" cy="13.2" r="3.7" fill="${ORANGE_TINT}" ${S}/><circle cx="12.4" cy="13.2" r="1.6" fill="${ORANGE}"/><circle cx="27.6" cy="13.2" r="1.6" fill="${ORANGE}"/>` +
      head(21.5, 9.6, ORANGE_TINT) + `<ellipse cx="20" cy="25" rx="4.3" ry="3.3" fill="${W}" ${S}/><ellipse cx="20" cy="23.8" rx="1.6" ry="1.05" fill="${INK}"/><path d="M20 24.9v1.3M18.6 26.4c.8.5 2 .5 2.8 0" fill="none" ${S}/>` +
      eyes(19.8) },
    { key: 'macaco', label: 'Macaco', legacy: '\u{1F435}', art: bg(ORANGE_SOFT) +
      `<circle cx="10.6" cy="21" r="3.1" fill="${ORANGE}" ${S}/><circle cx="29.4" cy="21" r="3.1" fill="${ORANGE}" ${S}/><circle cx="10.6" cy="21" r="1.4" fill="${ORANGE_SOFT}"/><circle cx="29.4" cy="21" r="1.4" fill="${ORANGE_SOFT}"/>` +
      head(20.5, 9.2, ORANGE) + `<path d="M13.8 22.4c0-2.9 2.3-4.6 4.2-4.6 1 0 1.6.4 2 1 .4-.6 1-1 2-1 1.9 0 4.2 1.7 4.2 4.6 0 3.4-2.8 5.6-6.2 5.6s-6.2-2.2-6.2-5.6z" fill="${W}" ${S}/>` +
      eyes(21, 17.6, 22.4) + `<path d="M19.2 23.8h.1M20.8 23.8h.1" stroke="${INK}" stroke-width="1.4" stroke-linecap="round"/><path d="M17.8 25.4c1.3 1 3.1 1 4.4 0" fill="none" ${S}/>` },
    { key: 'tigre', label: 'Tigre', legacy: '\u{1F42F}', art: bg(GREEN_SOFT) +
      `<circle cx="12.6" cy="13" r="3.3" fill="${ORANGE}" ${S}/><circle cx="27.4" cy="13" r="3.3" fill="${ORANGE}" ${S}/>` + head(21.5, 9.6, ORANGE) +
      `<path d="M20 12.2v3M17 12.9l.8 2.3M23 12.9l-.8 2.3M10.8 19.8h2.6M10.9 22.8h2.1M29.2 19.8h-2.6M29.1 22.8h-2.1" fill="none" ${S}/>` +
      `<ellipse cx="20" cy="25.2" rx="4.4" ry="3.2" fill="${W}" ${S}/><ellipse cx="20" cy="24" rx="1.6" ry="1.05" fill="${INK}"/><path d="M18.6 26.6c.8.5 2 .5 2.8 0" fill="none" ${S}/>` + eyes(20.2) },
    { key: 'coala', label: 'Coala', legacy: '\u{1F428}', art: bg(ORANGE_SOFT) +
      `<circle cx="11.2" cy="15.6" r="5" fill="${LINE}" ${S}/><circle cx="28.8" cy="15.6" r="5" fill="${LINE}" ${S}/><circle cx="11.2" cy="15.6" r="2.5" fill="${W}"/><circle cx="28.8" cy="15.6" r="2.5" fill="${W}"/>` +
      head(22, 9.6, LINE) + eyes(20.8, 15.9, 24.1) + `<ellipse cx="20" cy="24.2" rx="2.4" ry="3.2" fill="${INK}"/><path d="M18 28.3c1.2.6 2.8.6 4 0" fill="none" ${S}/>` }
  ];

  const BY_KEY = new Map(LIST.map(item => [item.key, item]));
  const BY_LEGACY = new Map(LIST.map(item => [item.legacy, item.key]));
  const DEFAULT = 'sorriso';

  // Converte qualquer valor salvo (chave nova, emoji antigo ou lixo) em uma chave conhecida ou null.
  function resolve(value) {
    if (typeof value !== 'string') return null;
    if (BY_KEY.has(value)) return value;
    const fromLegacy = BY_LEGACY.get(value.trim());
    return fromLegacy || null;
  }
  // Markup do personagem. Só usa SVG estático daqui; nenhum valor do usuário entra no SVG.
  function svg(value) {
    const key = resolve(value) || DEFAULT;
    const item = BY_KEY.get(key);
    return `<svg viewBox="0 0 40 40" aria-hidden="true" focusable="false">${item.art}</svg>`;
  }
  function art(value) { return BY_KEY.get(resolve(value) || DEFAULT).art; }
  function label(value) { return (BY_KEY.get(resolve(value) || DEFAULT) || {}).label || ''; }

  root.CalotimAvatars = { list: LIST.map(({ key, label: name }) => ({ key, label: name })), resolve, svg, art, label, DEFAULT };
})(typeof self !== 'undefined' ? self : this);
