const defaultTheme = require('tailwindcss/defaultTheme')

const COLORS = {
  black: '#000000',
  white: '#ffffff',
  red: {
    50: '#FFE8E8',
    100: '#FDCDCD',
    200: '#FFAEAE',
    300: '#F56C6A',
    400: '#EC4451',
    500: '#E00C30',
    600: '#B90A27',
    700: '#93081F',
    800: '#6C0617',
    900: '#560311',
  },
  green: {
    50: '#EEFFE9',
    100: '#DFFAD6',
    200: '#B9F6B0',
    300: '#86E382',
    400: '#5EC963',
    500: '#30A541',
    600: '#187637',
    700: '#0F5F31',
    800: '#094F2D',
    900: '#033A20',
  },
  blue: {
    50: '#E3F1FF',
    100: '#D1E7FE',
    200: '#A3CDFE',
    300: '#75AFFE',
    400: '#5395FD',
    500: '#1B6AFC',
    600: '#1351D8',
    700: '#0D3CB5',
    800: '#082A92',
    900: '#051D78',
  },
  orange: {
    50: '#FFF5D5',
    100: '#FFEEB7',
    200: '#FDE19A',
    300: '#F9CA67',
    400: '#F3B241',
    500: '#FF9800',
    600: '#CA7204',
    700: '#A95803',
    800: '#884101',
    900: '#713101',
  },
  gray: {
    100: '#F8F8F8',
    200: '#E8E8E8',
    300: '#B2B2B2',
    400: '#999999',
    500: '#7F7F7F',
    600: '#666666',
    700: '#4D4D4D',
    800: '#333333',
    900: '#1A1A1A',
  },
  indigo: {
    50: '#F7FAFB',
    100: '#EEF3F6',
    200: '#E0E6EC',
    300: '#B9C3CC',
    400: '#879099',
    500: '#484E55',
    600: '#343D49',
    700: '#242D3D',
    800: '#161F31',
    900: '#0D1528',
  },
  yellow: {
    50: '#FFFADF',
    100: '#FFF1C9',
    200: '#FFEDBA',
    300: '#FFE291',
    400: '#FFE06C',
    500: '#FFD759',
    600: '#FFC523',
    700: '#DBA219',
    800: '#B78211',
    900: '#93640B',
    950: '#A4F06',
  },
  lime: {
    50: '#FEFFF2',
    100: '#FCFEE0',
    200: '#F8FDC2',
    300: '#F1FBA3',
    400: '#EAF78B',
    500: '#DFF265',
    600: '#C5D465',
    700: '#A6B649',
    800: '#889832',
    900: '#6A7A20',
  },
  purple: {
    50: '#F8F3FF',
    100: '#E6D7FF',
    200: '#CBAFFF',
    300: '#AE86FF',
    400: '#9669FF',
    500: '#6E37FF',
    600: '#5428DB',
    700: '#3D1BB7',
    800: '#2A1193',
    900: '#1C0A7A',
  },
  mint: {
    50: '#EEFFEC',
    100: '#E5FEE3',
    200: '#C9FDCB',
    300: '#ACF9B7',
    400: '#95F4AC',
    500: '#73ED9C',
    600: '#54CB88',
    700: '#39AA76',
    800: '#248964',
    900: '#167159',
  },
  cyan: {
    50: '#E8FFFC',
    100: '#CFFDF7',
    200: '#A1FCF7',
    300: '#71F3F6',
    400: '#4CDEEE',
    500: '#16C0E4',
    600: '#1096C4',
    700: '#0B72A4',
    800: '#075184',
    900: '#043B6D',
  },
  cream: {
    500: '#FCF8F3',
  },
}

module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}', // Note the addition of the `app` directory.
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  plugins: [require('@tailwindcss/typography')],
  theme: {
    screens: {
      xs: '400px',
      ...defaultTheme.screens,
    },
    extend: {
      fontFamily: {
        outfit: 'var(--outfit-font)',
        sfpro: 'var(--sfpro-font)',
      },
      listStyleType: {
        alpha: 'lower-alpha',
        'upper-alpha': 'upper-alpha',
      },
      colors: {
        ...defaultTheme.colors,
        primary: {
          DEFAULT: COLORS.indigo[700],
          dark: COLORS.indigo[900],
          main: COLORS.indigo[700],
          light: COLORS.indigo[500],
          background: COLORS.indigo[50],
          contrast: COLORS.white,
        },
        secondary: {
          DEFAULT: COLORS.yellow[600],
          dark: COLORS.yellow[700],
          main: COLORS.yellow[600],
          light: COLORS.yellow[300],
          background: COLORS.yellow[50],
          contrast: COLORS.black,
        },
        tertiary: {
          DEFAULT: COLORS.purple[500],
          dark: COLORS.purple[700],
          main: COLORS.purple[500],
          light: COLORS.purple[300],
          background: COLORS.purple[50],
          contrast: COLORS.white,
        },
        neutral: {
          DEFAULT: COLORS.indigo[300],
          dark: COLORS.indigo[500],
          main: COLORS.indigo[300],
          light: COLORS.indigo[200],
          background: COLORS.indigo[50],
          contrast: COLORS.black,
        },
        error: {
          DEFAULT: COLORS.red[500],
          dark: COLORS.red[700],
          main: COLORS.red[500],
          light: COLORS.red[300],
          background: COLORS.red[50],
          contrast: COLORS.white,
        },
        success: {
          DEFAULT: COLORS.green[500],
          dark: COLORS.green[700],
          main: COLORS.green[500],
          light: COLORS.green[300],
          background: COLORS.green[50],
          contrast: COLORS.white,
        },
        info: {
          DEFAULT: COLORS.blue[500],
          dark: COLORS.blue[700],
          main: COLORS.blue[500],
          light: COLORS.blue[300],
          background: COLORS.blue[50],
          contrast: COLORS.white,
        },
        warning: {
          DEFAULT: COLORS.orange[500],
          dark: COLORS.orange[600],
          main: COLORS.orange[500],
          light: COLORS.orange[300],
          background: COLORS.orange[50],
          contrast: COLORS.black,
        },
        gray: {
          ...COLORS.gray,
          DEFAULT: COLORS.gray[500],
        },
        indigo: {
          ...COLORS.indigo,
          DEFAULT: COLORS.indigo[500],
        },
        lime: {
          ...COLORS.lime,
          DEFAULT: COLORS.lime[500],
        },
        red: {
          ...COLORS.red,
          DEFAULT: COLORS.red[500],
        },
        blue: {
          ...COLORS.blue,
          DEFAULT: COLORS.blue[500],
        },
        purple: {
          ...COLORS.purple,
          DEFAULT: COLORS.purple[500],
        },
        green: {
          ...COLORS.green,
          DEFAULT: COLORS.green[500],
        },
        mint: {
          ...COLORS.mint,
          DEFAULT: COLORS.mint[500],
        },
        orange: {
          ...COLORS.orange,
          DEFAULT: COLORS.orange[500],
        },
        cyan: {
          ...COLORS.cyan,
          DEFAULT: COLORS.cyan[500],
        },
        cream: {
          ...COLORS.cream,
          DEFAULT: COLORS.cream[500],
        },
        yellow: {
          ...COLORS.yellow,
          DEFAULT: COLORS.yellow[600],
        },
      },
    },
  },
}
