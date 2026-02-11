// Use CSS variables from globals.css to stay in sync with theme
// These values are resolved at runtime from :root CSS variables

interface ThemeConfig {
  bg: string
  text: string
  accent: string
  accentText: string
  secondary: string
  border: string
  muiColor: string
}

export const WEBSITE_THEMES: Record<string, ThemeConfig> = {
  light: {
    bg: 'bg-white',
    text: 'text-gray-800',
    accent: 'bg-blue-500',
    accentText: 'text-white',
    secondary: 'bg-gray-100',
    border: 'border-gray-200',
    muiColor: 'var(--gray-800)',
  },
  dark: {
    bg: 'bg-gray-900',
    text: 'text-white',
    accent: 'bg-white',
    accentText: 'text-gray-900',
    secondary: 'bg-gray-800',
    border: 'border-gray-700',
    muiColor: 'white',
  },
  earthy: {
    bg: 'bg-amber-50',
    text: 'text-amber-900',
    accent: 'bg-amber-600',
    accentText: 'text-white',
    secondary: 'bg-amber-100',
    border: 'border-amber-200',
    muiColor: 'var(--yellow-900)',
  },
  professional: {
    bg: 'bg-slate-50',
    text: 'text-slate-900',
    accent: 'bg-slate-700',
    accentText: 'text-white',
    secondary: 'bg-slate-200',
    border: 'border-slate-300',
    muiColor: 'var(--gray-800)',
  },
}

