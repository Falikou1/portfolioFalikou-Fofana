/**
 * ==========================================================================
 * FALIKOU FOFANA — VECTOR SVG ICON REGISTRY & ENGINE v1.0
 * 100% Vector, Clean, Consistent SVG Icons (Lucide, Heroicons & Official Logos)
 * ==========================================================================
 */

(function () {
  'use strict';

  const PortfolioIcons = {
    // ── Official Tech & Brand Logos ──────────────────────────────────────────
    powerbi: (props = {}) => `
      <svg viewBox="0 0 32 32" fill="none" width="${props.size || 24}" height="${props.size || 24}" class="${props.className || ''}">
        <rect x="4" y="14" width="6" height="14" rx="2" fill="#F2C811"/>
        <rect x="13" y="8" width="6" height="20" rx="2" fill="#E6AD10"/>
        <rect x="22" y="2" width="6" height="26" rx="2" fill="#CC8A00"/>
      </svg>
    `,

    excel: (props = {}) => `
      <svg viewBox="0 0 32 32" fill="none" width="${props.size || 24}" height="${props.size || 24}" class="${props.className || ''}">
        <path d="M20 4H8a3 3 0 00-3 3v18a3 3 0 003 3h16a3 3 0 003-3V11l-7-7z" fill="#107C41"/>
        <path d="M20 4v7h7l-7-7z" fill="#33C481"/>
        <path d="M11 14l3 4.5-3 4.5h2.2l1.9-3 1.9 3h2.2l-3-4.5 3-4.5H17l-1.9 3-1.9-3H11z" fill="#FFFFFF"/>
      </svg>
    `,

    sql: (props = {}) => `
      <svg viewBox="0 0 24 24" fill="none" stroke="#4B90E2" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" width="${props.size || 24}" height="${props.size || 24}" class="${props.className || ''}">
        <ellipse cx="12" cy="5" rx="9" ry="3" fill="rgba(75,144,226,0.2)"/>
        <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/>
        <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>
      </svg>
    `,

    python: (props = {}) => `
      <svg viewBox="0 0 24 24" width="${props.size || 24}" height="${props.size || 24}" class="${props.className || ''}">
        <path fill="#3776AB" d="M11.9 2c-5.4 0-5.1 2.3-5.1 2.3l.01 2.4h5.2v.7H4.4S2 7.1 2 12.5s2.1 5.3 2.1 5.3h1.2v-1.7s-.1-2.1 2.1-2.1h5.1s2 0 2-2V4.3S15 2 11.9 2zm-1.4 1.4c.4 0 .7.3.7.7s-.3.7-.7.7-.7-.3-.7-.7.3-.7.7-.7z"/>
        <path fill="#FFD43B" d="M12.1 22c5.4 0 5.1-2.3 5.1-2.3l-.01-2.4h-5.2v-.7h7.6s2.4.3 2.4-5.1-2.1-5.3-2.1-5.3h-1.2v1.7s.1 2.1-2.1 2.1H11.5s-2 0-2 2v9.7s-.5 2.3 2.6 2.3zm1.4-1.4c-.4 0-.7-.3-.7-.7s.3-.7.7-.7.7.3.7.7-.3.7-.7.7z"/>
      </svg>
    `,

    vibecoding: (props = {}) => `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="${props.size || 24}" height="${props.size || 24}" class="${props.className || ''}">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
      </svg>
    `,

    cisco: (props = {}) => `
      <svg viewBox="0 0 24 24" fill="#049FD9" width="${props.size || 24}" height="${props.size || 24}" class="${props.className || ''}">
        <rect x="2" y="11" width="2.2" height="5" rx="1"/>
        <rect x="6" y="7" width="2.2" height="13" rx="1"/>
        <rect x="10" y="4" width="2.2" height="19" rx="1"/>
        <rect x="14" y="4" width="2.2" height="19" rx="1"/>
        <rect x="18" y="7" width="2.2" height="13" rx="1"/>
        <rect x="22" y="11" width="2.2" height="5" rx="1"/>
      </svg>
    `,

    tableau: (props = {}) => `
      <svg viewBox="0 0 24 24" width="${props.size || 24}" height="${props.size || 24}" class="${props.className || ''}">
        <path fill="#E8762D" d="M11.2 2v3.6H7.6V7h3.6v3.6h1.6V7h3.6V5.6H12.8V2h-1.6z"/>
        <path fill="#2E75B6" d="M5.2 8v2.4H2.8V12h2.4v2.4h1.6V12h2.4v-1.6H6.8V8H5.2z"/>
        <path fill="#595959" d="M17.2 8v2.4h-2.4V12h2.4v2.4h1.6V12h2.4v-1.6h-2.4V8h-1.6z"/>
        <path fill="#C00000" d="M11.2 13.6v3.6H7.6V18.8h3.6v3.6h1.6v-3.6h3.6V17.2H12.8v-3.6h-1.6z"/>
      </svg>
    `,

    chart: (props = {}) => `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="${props.size || 24}" height="${props.size || 24}" class="${props.className || ''}">
        <line x1="18" y1="20" x2="18" y2="10"/>
        <line x1="12" y1="20" x2="12" y2="4"/>
        <line x1="6" y1="20" x2="6" y2="14"/>
      </svg>
    `,

    kpi: (props = {}) => `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="${props.size || 24}" height="${props.size || 24}" class="${props.className || ''}">
        <path d="M3 3v18h18"/>
        <path d="m19 9-5 5-4-4-3 3"/>
      </svg>
    `,

    trophy: (props = {}) => `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="${props.size || 24}" height="${props.size || 24}" class="${props.className || ''}">
        <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/>
        <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/>
        <path d="M4 22h16"/>
        <path d="M10 14.66V17c0 .55-.45 1-1 1H7v4h10v-4h-2c-.55 0-1-.45-1-1v-2.34"/>
        <path d="M18 2H6v7a6 6 0 0 0 12 0V2z"/>
      </svg>
    `,

    medal: (props = {}) => `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="${props.size || 24}" height="${props.size || 24}" class="${props.className || ''}">
        <circle cx="12" cy="8" r="7"/>
        <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/>
      </svg>
    `,

    competition: (props = {}) => `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="${props.size || 24}" height="${props.size || 24}" class="${props.className || ''}">
        <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/>
        <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/>
        <path d="M4 22h16"/>
        <path d="M10 14.66V17c0 .55-.45 1-1 1H7v4h10v-4h-2c-.55 0-1-.45-1-1v-2.34"/>
        <path d="M18 2H6v7a6 6 0 0 0 12 0V2z"/>
      </svg>
    `,

    // ── Soft Skills ──────────────────────────────────────────────────────────
    leadership: (props = {}) => `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="${props.size || 24}" height="${props.size || 24}" class="${props.className || ''}">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    `,

    teamwork: (props = {}) => `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="${props.size || 24}" height="${props.size || 24}" class="${props.className || ''}">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    `,

    organization: (props = {}) => `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="${props.size || 24}" height="${props.size || 24}" class="${props.className || ''}">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
        <line x1="16" y1="2" x2="16" y2="6"/>
        <line x1="8" y1="2" x2="8" y2="6"/>
        <line x1="3" y1="10" x2="21" y2="10"/>
        <path d="m9 16 2 2 4-4"/>
      </svg>
    `,

    communication: (props = {}) => `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="${props.size || 24}" height="${props.size || 24}" class="${props.className || ''}">
        <path d="m3 11 18-5v12L3 14v-3z"/>
        <path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/>
      </svg>
    `,

    responsibility: (props = {}) => `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="${props.size || 24}" height="${props.size || 24}" class="${props.className || ''}">
        <circle cx="12" cy="12" r="10"/>
        <circle cx="12" cy="12" r="6"/>
        <circle cx="12" cy="12" r="2"/>
      </svg>
    `,

    globe: (props = {}) => `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="${props.size || 24}" height="${props.size || 24}" class="${props.className || ''}">
        <circle cx="12" cy="12" r="10"/>
        <line x1="2" y1="12" x2="22" y2="12"/>
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
      </svg>
    `,

    languages: (props = {}) => `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="${props.size || 24}" height="${props.size || 24}" class="${props.className || ''}">
        <circle cx="12" cy="12" r="10"/>
        <line x1="2" y1="12" x2="22" y2="12"/>
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
      </svg>
    `,

    // ── Interests & Hobbies ──────────────────────────────────────────────────
    football: (props = {}) => `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="${props.size || 18}" height="${props.size || 18}" class="${props.className || ''}">
        <circle cx="12" cy="12" r="10"/>
        <path d="m12 7 3.5 2.5-1.5 4.5h-4L8.5 9.5 12 7z"/>
        <path d="M12 2v5M21.5 9.5l-4.5.5M18 20.5l-4-3.5M6 20.5l4-3.5M2.5 9.5l4.5.5"/>
      </svg>
    `,

    fitness: (props = {}) => `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="${props.size || 18}" height="${props.size || 18}" class="${props.className || ''}">
        <path d="m6.5 6.5 11 11"/>
        <path d="m21 21-1-1a3.5 3.5 0 0 0-5 0l-.5.5-4-4 .5-.5a3.5 3.5 0 0 0 0-5l-1-1a3.5 3.5 0 0 0-5 0l-2 2a3.5 3.5 0 0 0 0 5l1 1a3.5 3.5 0 0 0 5 0l.5-.5 4 4-.5.5a3.5 3.5 0 0 0 0 5l1 1a3.5 3.5 0 0 0 5 0l2-2a3.5 3.5 0 0 0 0-5z"/>
      </svg>
    `,

    reading: (props = {}) => `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="${props.size || 18}" height="${props.size || 18}" class="${props.className || ''}">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
      </svg>
    `,

    swimming: (props = {}) => `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="${props.size || 18}" height="${props.size || 18}" class="${props.className || ''}">
        <path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/>
        <path d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/>
        <path d="M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/>
      </svg>
    `,

    driving: (props = {}) => `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="${props.size || 18}" height="${props.size || 18}" class="${props.className || ''}">
        <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.5 2.8C2.1 10.7 2 11 2 11.3V16c0 .6.4 1 1 1h2"/>
        <circle cx="7" cy="17" r="2"/>
        <circle cx="17" cy="17" r="2"/>
      </svg>
    `,

    // ── Services ─────────────────────────────────────────────────────────────
    bi: (props = {}) => `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="${props.size || 24}" height="${props.size || 24}" class="${props.className || ''}">
        <line x1="18" y1="20" x2="18" y2="10"/>
        <line x1="12" y1="20" x2="12" y2="4"/>
        <line x1="6" y1="20" x2="6" y2="14"/>
      </svg>
    `,

    cleaning: (props = {}) => `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="${props.size || 24}" height="${props.size || 24}" class="${props.className || ''}">
        <path d="m21 16-4 4-2-2"/>
        <ellipse cx="12" cy="5" rx="9" ry="3"/>
        <path d="M3 5v14a9 3 0 0 0 7.5 2.9"/>
        <path d="M21 12V5"/>
        <path d="M3 12a9 3 0 0 0 5 2.7"/>
      </svg>
    `,

    dev: (props = {}) => `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="${props.size || 24}" height="${props.size || 24}" class="${props.className || ''}">
        <rect x="2" y="3" width="14" height="10" rx="2"/>
        <path d="M6 21h6"/>
        <path d="M9 17v4"/>
        <rect x="16" y="8" width="6" height="13" rx="2"/>
      </svg>
    `,

    // ── UI Actions & Controls ────────────────────────────────────────────────
    pencil: (props = {}) => `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="${props.size || 16}" height="${props.size || 16}" class="${props.className || ''}">
        <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/>
      </svg>
    `,

    trash: (props = {}) => `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="${props.size || 16}" height="${props.size || 16}" class="${props.className || ''}">
        <polyline points="3 6 5 6 21 6"/>
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
        <line x1="10" y1="11" x2="10" y2="17"/>
        <line x1="14" y1="11" x2="14" y2="17"/>
      </svg>
    `,

    close: (props = {}) => `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="${props.size || 18}" height="${props.size || 18}" class="${props.className || ''}">
        <line x1="18" y1="6" x2="6" y2="18"/>
        <line x1="6" y1="6" x2="18" y2="18"/>
      </svg>
    `,

    chevronUp: (props = {}) => `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" width="${props.size || 12}" height="${props.size || 12}" class="${props.className || ''}">
        <polyline points="18 15 12 9 6 15"/>
      </svg>
    `,

    chevronDown: (props = {}) => `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" width="${props.size || 12}" height="${props.size || 12}" class="${props.className || ''}">
        <polyline points="6 9 12 15 18 9"/>
      </svg>
    `,

    save: (props = {}) => `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="${props.size || 16}" height="${props.size || 16}" class="${props.className || ''}">
        <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
        <polyline points="17 21 17 13 7 13 7 21"/>
        <polyline points="7 3 7 8 15 8"/>
      </svg>
    `,

    rocket: (props = {}) => `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="${props.size || 16}" height="${props.size || 16}" class="${props.className || ''}">
        <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/>
        <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/>
        <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/>
        <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/>
      </svg>
    `,

    download: (props = {}) => `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="${props.size || 16}" height="${props.size || 16}" class="${props.className || ''}">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
        <polyline points="7 10 12 15 17 10"/>
        <line x1="12" y1="15" x2="12" y2="3"/>
      </svg>
    `,

    upload: (props = {}) => `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="${props.size || 16}" height="${props.size || 16}" class="${props.className || ''}">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
        <polyline points="17 8 12 3 7 8"/>
        <line x1="12" y1="3" x2="12" y2="15"/>
      </svg>
    `,

    shield: (props = {}) => `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="${props.size || 18}" height="${props.size || 18}" class="${props.className || ''}">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        <polyline points="9 12 11 14 15 10"/>
      </svg>
    `,

    lock: (props = {}) => `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="${props.size || 16}" height="${props.size || 16}" class="${props.className || ''}">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
        <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
      </svg>
    `,

    eye: (props = {}) => `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="${props.size || 18}" height="${props.size || 18}" class="${props.className || ''}">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
        <circle cx="12" cy="12" r="3"/>
      </svg>
    `,

    eyeOff: (props = {}) => `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="${props.size || 18}" height="${props.size || 18}" class="${props.className || ''}">
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
        <line x1="1" y1="1" x2="23" y2="23"/>
      </svg>
    `,

    desktop: (props = {}) => `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="${props.size || 16}" height="${props.size || 16}" class="${props.className || ''}">
        <rect x="2" y="3" width="20" height="14" rx="2"/>
        <line x1="8" y1="21" x2="16" y2="21"/>
        <line x1="12" y1="17" x2="12" y2="21"/>
      </svg>
    `,

    tablet: (props = {}) => `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="${props.size || 16}" height="${props.size || 16}" class="${props.className || ''}">
        <rect x="4" y="2" width="16" height="20" rx="2"/>
        <line x1="12" y1="18" x2="12.01" y2="18"/>
      </svg>
    `,

    mobile: (props = {}) => `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="${props.size || 16}" height="${props.size || 16}" class="${props.className || ''}">
        <rect x="5" y="2" width="14" height="20" rx="2"/>
        <line x1="12" y1="18" x2="12.01" y2="18"/>
      </svg>
    `,

    check: (props = {}) => `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" width="${props.size || 16}" height="${props.size || 16}" class="${props.className || ''}">
        <polyline points="20 6 9 17 4 12"/>
      </svg>
    `,

    checkCircle: (props = {}) => `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="${props.size || 18}" height="${props.size || 18}" class="${props.className || ''}">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
        <polyline points="22 4 12 14.01 9 11.01"/>
      </svg>
    `,

    alertCircle: (props = {}) => `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="${props.size || 18}" height="${props.size || 18}" class="${props.className || ''}">
        <circle cx="12" cy="12" r="10"/>
        <line x1="12" y1="8" x2="12" y2="12"/>
        <line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
    `,

    warning: (props = {}) => `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="${props.size || 18}" height="${props.size || 18}" class="${props.className || ''}">
        <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
        <line x1="12" y1="9" x2="12" y2="13"/>
        <line x1="12" y1="17" x2="12.01" y2="17"/>
      </svg>
    `,

    arrowRight: (props = {}) => `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="${props.size || 16}" height="${props.size || 16}" class="${props.className || ''}">
        <path d="M5 12h14M12 5l7 7-7 7"/>
      </svg>
    `,

    arrowDown: (props = {}) => `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="${props.size || 16}" height="${props.size || 16}" class="${props.className || ''}">
        <path d="M12 5v14M19 12l-7 7-7-7"/>
      </svg>
    `,

    sparkle: (props = {}) => `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="${props.size || 16}" height="${props.size || 16}" class="${props.className || ''}">
        <path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z"/>
      </svg>
    `,

    briefcase: (props = {}) => `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="${props.size || 20}" height="${props.size || 20}" class="${props.className || ''}">
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
      </svg>
    `,

    building: (props = {}) => `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="${props.size || 20}" height="${props.size || 20}" class="${props.className || ''}">
        <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/>
        <path d="M6 12H4a2 2 0 0 0-2 2v8h20v-8a2 2 0 0 0-2-2h-2"/>
        <path d="M10 6h4"/>
        <path d="M10 10h4"/>
        <path d="M10 14h4"/>
        <path d="M10 18h4"/>
      </svg>
    `,

    graduation: (props = {}) => `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="${props.size || 20}" height="${props.size || 20}" class="${props.className || ''}">
        <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
        <path d="M6 12v5c3 3 9 3 12 0v-5"/>
      </svg>
    `,

    award: (props = {}) => `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="${props.size || 20}" height="${props.size || 20}" class="${props.className || ''}">
        <circle cx="12" cy="8" r="7"/>
        <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/>
      </svg>
    `,

    folder: (props = {}) => `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="${props.size || 18}" height="${props.size || 18}" class="${props.className || ''}">
        <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z"/>
      </svg>
    `,

    image: (props = {}) => `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="${props.size || 18}" height="${props.size || 18}" class="${props.className || ''}">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
        <circle cx="8.5" cy="8.5" r="1.5"/>
        <polyline points="21 15 16 10 5 21"/>
      </svg>
    `,

    mail: (props = {}) => `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="${props.size || 18}" height="${props.size || 18}" class="${props.className || ''}">
        <rect x="2" y="4" width="20" height="16" rx="2"/>
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
      </svg>
    `,

    inbox: (props = {}) => `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="${props.size || 24}" height="${props.size || 24}" class="${props.className || ''}">
        <polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/>
        <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/>
      </svg>
    `,

    clock: (props = {}) => `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="${props.size || 16}" height="${props.size || 16}" class="${props.className || ''}">
        <circle cx="12" cy="12" r="10"/>
        <polyline points="12 6 12 12 16 14"/>
      </svg>
    `,

    palette: (props = {}) => `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="${props.size || 18}" height="${props.size || 18}" class="${props.className || ''}">
        <circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/>
        <circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/>
        <circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/>
        <circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/>
        <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/>
      </svg>
    `,

    search: (props = {}) => `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="${props.size || 18}" height="${props.size || 18}" class="${props.className || ''}">
        <circle cx="11" cy="11" r="8"/>
        <line x1="21" y1="21" x2="16.65" y2="16.65"/>
      </svg>
    `,

    user: (props = {}) => `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="${props.size || 16}" height="${props.size || 16}" class="${props.className || ''}">
        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
        <circle cx="12" cy="7" r="4"/>
      </svg>
    `,

    link: (props = {}) => `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="${props.size || 16}" height="${props.size || 16}" class="${props.className || ''}">
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
      </svg>
    `,

    pin: (props = {}) => `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="${props.size || 14}" height="${props.size || 14}" class="${props.className || ''}">
        <line x1="12" y1="17" x2="12" y2="22"/>
        <path d="M5 17h14v-1.76a2 2 0 0 0-1.11-1.79l-1.78-.89A2 2 0 0 1 15 10.76V6h1a1 1 0 0 0 0-2H8a1 1 0 0 0 0 2h1v4.76a2 2 0 0 1-1.11 1.79l-1.78.89A2 2 0 0 0 5 15.24Z"/>
      </svg>
    `,

    sections: (props = {}) => `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="${props.size || 18}" height="${props.size || 18}" class="${props.className || ''}">
        <path d="M4 5a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5zM4 13a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-6zM16 13a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-6z"/>
      </svg>
    `,

    // ── Universal Resolver ───────────────────────────────────────────────────
    get(nameOrEmoji, props = {}) {
      if (!nameOrEmoji) return this.sparkle(props);

      if (typeof nameOrEmoji === 'string' && nameOrEmoji.trim().startsWith('<svg')) {
        return nameOrEmoji;
      }

      const key = String(nameOrEmoji).trim().toLowerCase();
      if (this[key] && typeof this[key] === 'function') {
        return this[key](props);
      }

      const emojiAliases = {
        '📊': 'powerbi',
        '📗': 'excel',
        '🗄️': 'sql',
        '🗄': 'sql',
        '🐍': 'python',
        '⚡': 'vibecoding',
        '🌐': 'cisco',
        '👑': 'leadership',
        '🤝': 'teamwork',
        '📅': 'organization',
        '📢': 'communication',
        '🎯': 'responsibility',
        '🌍': 'globe',
        '⚽': 'football',
        '🏋️': 'fitness',
        '🏋': 'fitness',
        '📚': 'reading',
        '🏊': 'swimming',
        '🚗': 'driving',
        '🧹': 'cleaning',
        '💼': 'briefcase',
        '🏢': 'building',
        '🎓': 'graduation',
        '📜': 'award',
        '🛠️': 'dev',
        '🛠': 'dev',
        '🎨': 'palette',
        '📑': 'sections',
        '🌟': 'sparkle',
        '✦': 'sparkle',
        '🖼️': 'image',
        '🖼': 'image',
        '👤': 'user',
        '🔗': 'link',
        '🗑️': 'trash',
        '🗑': 'trash',
        '✏️': 'pencil',
        '✏': 'pencil',
        '📩': 'mail',
        '✉️': 'mail',
        '✉': 'mail',
        '📭': 'inbox',
        '🕒': 'clock',
        '🚀': 'rocket',
        '💾': 'save',
        '🛡️': 'shield',
        '🛡': 'shield',
        '🔒': 'lock',
        '🔍': 'search',
        '📥': 'download',
        '📤': 'upload',
        '⚠️': 'warning',
        '⚠': 'warning',
        '✓': 'check',
        '👁️': 'eye',
        '👁': 'eye',
        '💻': 'desktop',
        '📱': 'tablet',
        '📲': 'mobile',
        '✕': 'close',
        '▲': 'chevronUp',
        '▼': 'chevronDown',
        '→': 'arrowRight',
        '↓': 'arrowDown',
        '📁': 'folder',
        '📌': 'pin'
      };

      if (emojiAliases[key] && this[emojiAliases[key]]) {
        return this[emojiAliases[key]](props);
      }

      if (key.includes('powerbi') || key.includes('bi')) return this.powerbi(props);
      if (key.includes('excel')) return this.excel(props);
      if (key.includes('sql') || key.includes('data')) return this.sql(props);
      if (key.includes('python')) return this.python(props);
      if (key.includes('vibe') || key.includes('code') || key.includes('dev')) return this.vibecoding(props);
      if (key.includes('cisco') || key.includes('reseau')) return this.cisco(props);
      if (key.includes('leader') || key.includes('manage')) return this.leadership(props);
      if (key.includes('team') || key.includes('collab') || key.includes('equipe')) return this.teamwork(props);
      if (key.includes('org') || key.includes('plan')) return this.organization(props);
      if (key.includes('comm') || key.includes('relat')) return this.communication(props);
      if (key.includes('resp') || key.includes('rigueur')) return this.responsibility(props);
      if (key.includes('foot') || key.includes('sport')) return this.football(props);
      if (key.includes('gym') || key.includes('muscu') || key.includes('fitness')) return this.fitness(props);
      if (key.includes('lect') || key.includes('book') || key.includes('read')) return this.reading(props);
      if (key.includes('natat') || key.includes('swim')) return this.swimming(props);
      if (key.includes('permis') || key.includes('conduite') || key.includes('car')) return this.driving(props);
      if (key.includes('clean') || key.includes('nettoy')) return this.cleaning(props);

      return this.sparkle(props);
    }
  };

  window.PortfolioIcons = PortfolioIcons;
})();
