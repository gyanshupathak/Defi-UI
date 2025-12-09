/** @type {import('tailwindcss').Config} */
// Note: Cannot import TypeScript files directly, so values are defined here
// These match the design system tokens in src/lib/design-system/

const colors = {
  strategy: {
    usd: '#5496DE',
    eth: '#627EEA',
    btc: '#F7931A',
  },
  background: {
    main: '#F4F0FF',
    white: '#FFFFFF',
    gradient: '#E4DBF8',
  },
  graph: {
    default: '#D7C9F5',
    heading: '#280F4B',
    tvl: '#7A6993',
    barHover: '#7F56D9',
    labelMuted: 'rgba(40, 15, 75, 0.6)',
  },
  text: {
    primary: '#000000',
    secondary: '#626066',
    muted: 'rgba(0, 0, 0, 0.6)',
  },
  primary: '#7F56D9',
  status: {
    success: '#259952',
    successBg: '#EAFAF1',
    error: '#E91E21',
    errorBg: '#FDE8EF',
    info: '#0070F2',
    infoBg: '#E5F1FF',
    warning: '#E91E63',
  },
  border: {
    default: 'rgba(0, 0, 0, 0.1)',
    gradient: '#E8E4F2',
  },
}

const shadows = {
  popOut: '-4px -4px 12px 0 #FFFFFF, 4px 4px 12px 0 rgba(0, 0, 0, 0.1)',
  popIn: 'inset -4px -4px 4px 0 rgba(0, 0, 0, 0.08), inset 4px 4px 4px 0 #FFFFFF',
  cardDefault: '4px 4px 12px 0 rgba(127, 86, 217, 0.12), -4px -4px 10px 0 #FFF',
  cardHover: '-4px -4px 4px 0 #FFF inset, 4px 4px 4px 0 rgba(0, 0, 0, 0.08) inset, -4px -4px 12px 0 #FFF, 4px 4px 12px 0 rgba(0, 0, 0, 0.10)',
  yieldCardOuter: '-4px -4px 12px 0 #FFFFFF, 4px 4px 12px 0 rgba(0, 0, 0, 0.1)',
  yieldCardOuterHover: '-6px -6px 16px 0 #FFFFFF, 6px 6px 16px 0 rgba(0, 0, 0, 0.15)',
  yieldCardInner: 'inset -4px -4px 4px 0 rgba(0, 0, 0, 0.08), inset 4px 4px 4px 0 #FFFFFF',
  graphOuter: '4px 4px 12px 0 rgba(127, 86, 217, 0.12), -4px -4px 10px 0 #FFF',
  graphInner: '10px 10px 18px 0 rgba(127, 86, 217, 0.12) inset, -8px -8px 10px 0 rgba(255, 255, 255, 0.80) inset',
  button: '-4px -4px 4px #FFF, 4px 4px 8px rgba(127, 86, 217, 0.15)',
  buttonSmall: '-4px -4px 4px #FFF, 4px 4px 8px rgba(127, 86, 217, 0.15)',
  navIcon: '4px 4px 5px 0px rgba(0,0,0,0.08), -4px -4px 5px 0px #FFFFFF',
  navButton: '4px 4px 8px 0px rgba(0,0,0,0.08), -4px -4px 8px 0px #FFFFFF',
  navContainer: 'inset 4px 4px 4px 0px rgba(0,0,0,0.08), inset -4px -4px 4px 0px #FFFFFF',
  connectWallet: '-4px -4px 5px 0px #FFFFFF, 4px 4px 5px 0px rgba(0,0,0,0.04)',
}

const spacing = {
  layout: {
    containerPadding: '56px',
    maxWidth: '1440px',
    contentPaddingY: '24px',
    yieldsMaxWidth: '668px',
  },
  card: {
    paddingX: '24px',
    paddingY: '20px',
    borderRadius: '16px',
    gap: '32px',
    gapInternal: '12px',
  },
  graph: {
    borderRadiusOuter: '16px',
    borderRadiusInner: '12px',
  },
  navigation: {
    height: '72px',
    paddingX: '56px',
  },
}

module.exports = {
  darkMode: ["class"],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    container: {
      center: true,
      padding: spacing.layout.containerPadding,
      screens: {
        "2xl": spacing.layout.maxWidth,
      },
    },
    extend: {
      colors: {
        // Background colors
        background: {
          DEFAULT: colors.background.main,
          white: colors.background.white,
          gradient: colors.background.gradient,
        },
        foreground: colors.text.primary,
        
        // Primary brand color
        primary: {
          DEFAULT: colors.primary,
          foreground: colors.background.white,
        },
        
        // Strategy colors
        strategy: {
          usd: colors.strategy.usd,
          eth: colors.strategy.eth,
          btc: colors.strategy.btc,
        },
        
        // Text colors
        text: {
          primary: colors.text.primary,
          secondary: colors.text.secondary,
          muted: colors.text.muted,
        },
        
        // Graph colors
        graph: {
          DEFAULT: colors.graph.default,
          heading: colors.graph.heading,
          tvl: colors.graph.tvl,
          'bar-hover': colors.graph.barHover,
          'label-muted': colors.graph.labelMuted,
        },
        
        // Border colors
        border: {
          DEFAULT: colors.border.default,
          gradient: colors.border.gradient,
        },
        
        // Status colors
        status: {
          success: colors.status.success,
          'success-bg': colors.status.successBg,
          error: colors.status.error,
          'error-bg': colors.status.errorBg,
          info: colors.status.info,
          'info-bg': colors.status.infoBg,
          warning: colors.status.warning,
        },
      },
      fontFamily: {
        sans: ['Hanken Grotesk', 'sans-serif'],
      },
      boxShadow: {
        'neumorphic-pop-out': shadows.popOut,
        'neumorphic-pop-in': shadows.popIn,
        'neumorphic-card': shadows.cardDefault,
        'neumorphic-card-hover': shadows.cardHover,
        'neumorphic-button': shadows.button,
        'neumorphic-button-small': shadows.buttonSmall,
        'neumorphic-nav-icon': shadows.navIcon,
        'neumorphic-nav-button': shadows.navButton,
        'neumorphic-nav-container': shadows.navContainer,
        'neumorphic-connect-wallet': shadows.connectWallet,
        'graph-outer': shadows.graphOuter,
        'graph-inner': shadows.graphInner,
        'yield-card-outer': shadows.yieldCardOuter,
        'yield-card-outer-hover': shadows.yieldCardOuterHover,
        'yield-card-inner': shadows.yieldCardInner,
      },
      borderRadius: {
        lg: spacing.card.borderRadius,
        md: spacing.graph.borderRadiusInner,
        sm: '8px',
      },
      spacing: {
        'card-padding-x': spacing.card.paddingX,
        'card-padding-y': spacing.card.paddingY,
        'card-gap': spacing.card.gap,
        'card-gap-internal': spacing.card.gapInternal,
        'nav-height': spacing.navigation.height,
        'nav-padding-x': spacing.navigation.paddingX,
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
