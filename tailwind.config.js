/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  theme: {
    extend: {
      colors: {
        /* ── 主色阶 (Synth Blue) ── */
        accent: {
          50:  '#EBF4FD',
          100: '#CEE3F9',
          200: '#A3CCF3',
          300: '#78B5ED',
          400: '#5DAAE9',
          500: '#4A9FE5',
          600: '#3488CC',
          700: '#2870AB',
          800: '#1E5A8A',
          900: '#14436A',
          DEFAULT: '#4A9FE5',
        },
        /* ── 背景层级 (冷色海军黑) ── */
        bg: {
          base:     '#080B10',
          surface:  '#0C1017',
          elevated: '#111620',
          muted:    '#181E2A',
        },
        /* ── 文字层级 (冷白色调) ── */
        txt: {
          primary:    '#E8ECF0',
          secondary:  '#8E95A0',
          tertiary:   '#5C6370',
          quaternary: '#3A404D',
        },
        /* 兼容旧代码 */
        primary: '#4A9FE5',
        dark: '#080B10',
      },
      fontFamily: {
        display: ['var(--font-display)', 'Sora', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        sans:    ['var(--font-body)', 'Manrope', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        serif:   ['var(--font-display)', 'Sora', '-apple-system', 'sans-serif'],  /* 向后兼容 font-serif → font-display */
        mono:    ['var(--font-mono)', 'JetBrains Mono', 'Menlo', 'Monaco', 'monospace'],
      },
      fontSize: {
        /* 响应式 clamp 尺寸 */
        'display':  ['clamp(2.5rem, 5vw, 4.5rem)',  { lineHeight: '1.1',  letterSpacing: '-0.03em' }],
        'headline': ['clamp(2rem, 4vw, 3.5rem)',     { lineHeight: '1.15', letterSpacing: '-0.02em' }],
        'title':    ['clamp(1.5rem, 3vw, 2.25rem)',  { lineHeight: '1.2',  letterSpacing: '-0.02em' }],
        'subtitle': ['clamp(1.125rem, 2vw, 1.5rem)', { lineHeight: '1.4',  letterSpacing: '-0.01em' }],
      },
      letterSpacing: {
        tighter: '-0.04em',
        tight:   '-0.02em',
        eyebrow: '0.08em',
      },
      boxShadow: {
        'card-surface':       '0 0 0 1px rgba(0,0,0,0.2)',
        'card-elevated':      '0 1px 3px rgba(0,0,0,0.2)',
        'card-elevated-hover':'0 4px 16px rgba(74, 159, 229, 0.08)',
        'btn-primary':        'none',
        'btn-primary-hover':  '0 4px 12px rgba(74, 159, 229, 0.25)',
        /* ── Accent drop-shadow (logo hover) ── */
        'glow-accent':       '0 0 8px rgba(74, 159, 229, 0.15)',
      },
      dropShadow: {
        'accent': '0 0 8px rgba(74, 159, 229, 0.15)',
      },
      transitionTimingFunction: {
        'out-expo': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'spring':   'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      animation: {
        'reveal':  'reveal 0.7s cubic-bezier(0.16, 1, 0.3, 1) both',
      },
      keyframes: {
        reveal: {
          from: { opacity: '0', transform: 'translateY(12px)', filter: 'blur(4px)' },
          to:   { opacity: '1', transform: 'translateY(0)',    filter: 'blur(0)' },
        },
      },
    },
  },
  plugins: [],
}
