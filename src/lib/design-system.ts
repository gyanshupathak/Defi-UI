export const colors = {
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
  withdraw: 'rgba(43, 102, 255, 0.15)',
  status: {
    success: '#259952',
    successBg: '#EAFAF1',
    error: '#F17279',
    errorBg: '#FDE8EF',
    info: '#0070F2',
    infoBg: '#E5F1FF',
    warning: '#E91E63',
  },
  border: {
    default: 'rgba(0, 0, 0, 0.1)',
    gradient: '#E8E4F2',
    separator: 'rgba(0,0,0,0.15)',
    white: 'rgba(255,255,255,0.64)',
  },
  pnl: {
    positive: '#259952',
    negative: '#F17279',
  },
  circularSelector: {
    track: 'rgba(127, 86, 217, 0.12)',
    progress: 'rgba(127, 86, 217, 0.3)',
  },
} as const

export const getPnlColor = (value: number) => {
  return value >= 0 ? colors.pnl.positive : colors.pnl.negative
}

export const typography = {
  display1: {
    fontSize: '40px',
    fontWeight: 700,
    lineHeight: 'normal',
    fontFamily: "'Hanken Grotesk', sans-serif",
  },
  display2: {
    fontSize: '32px',
    fontWeight: 700,
    lineHeight: 'normal',
    fontFamily: "'Hanken Grotesk', sans-serif",
  },
  display3: {
    fontSize: '28px',
    fontWeight: 500,
    lineHeight: 'normal',
    fontFamily: "'Hanken Grotesk', sans-serif",
  },
  heading1: {
    fontSize: '24px',
    fontWeight: 500,
    lineHeight: 'normal',
    fontFamily: "'Hanken Grotesk', sans-serif",
  },
  heading2: {
    fontSize: '20px',
    fontWeight: 500,
    lineHeight: '24px',
    fontFamily: "'Hanken Grotesk', sans-serif",
  },
  button: {
    fontSize: '16px',
    fontWeight: 500,
    lineHeight: '26px',
    fontFamily: "'Hanken Grotesk', sans-serif",
  },
  buttonSmall: {
    fontSize: '12px',
    fontWeight: 500,
    lineHeight: '16px',
    fontFamily: "'Hanken Grotesk', sans-serif",
  },
  subtext: {
    fontSize: '14px',
    fontWeight: 400,
    lineHeight: '20px',
    fontFamily: "'Hanken Grotesk', sans-serif",
  },
  label1: {
    fontSize: '12px',
    fontWeight: 400,
    lineHeight: 'normal',
    fontFamily: "'Hanken Grotesk', sans-serif",
  },
  label2: {
    fontSize: '8px',
    fontWeight: 400,
    lineHeight: 'normal',
    fontFamily: "'Hanken Grotesk', sans-serif",
  },
} as const

export const typographyClasses = {
  display1: "font-medium text-[40px] leading-normal font-sans",
  display2: "font-medium text-[32px] leading-normal font-sans",
  display3: "font-medium text-[28px] leading-normal font-sans",
  heading1: "font-medium text-[24px] leading-normal font-sans",
  heading2: "font-medium text-[20px] leading-[24px] font-sans",
  button: "font-normal text-[16px] leading-[26px] font-sans",
  buttonSmall: "font-medium text-[12px] leading-[16px] font-sans",
  subtext: "font-normal text-[14px] leading-[20px] font-sans",
  label1: "font-normal text-[12px] leading-normal font-sans",
  label2: "font-normal text-[8px] leading-normal font-sans",
  logo: "font-['Inter',sans-serif] font-bold leading-normal not-italic uppercase",
} as const

export const fontWeights = {
  regular: 400,
  medium: 500,
  semibold: 500,
  bold: 700,
  extrabold: 800,
} as const

export const getFontWeight = (weight: keyof typeof fontWeights) => fontWeights[weight]

export const shadows = {
  popOut: '-4px -4px 12px 0 #FFFFFF, 4px 4px 12px 0 rgba(0, 0, 0, 0.1)',
  popIn: 'inset -4px -4px 4px 0 rgba(0, 0, 0, 0.08), inset 4px 4px 4px 0 #FFFFFF',
  popInHover: 'inset -4px -4px 4px 0 #FFFFFF, inset 4px 4px 4px 0 rgba(0, 0, 0, 0.08)',
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
  tokenIcon: '-2.857px -2.857px 2.857px 0px rgba(255,255,255,0.88), 2.857px 2.857px 2.857px 0px rgba(0,0,0,0.12)',
  tokenBadge: '2px 2px 4px 0px rgba(0,0,0,0.08), -2px -2px 4px 0px #FFFFFF',
  dropdown: '4px 4px 12px 0px rgba(0,0,0,0.1), -4px -4px 12px 0px #ffffff',
  inputInset: 'inset 4px 4px 6px 0px rgba(0,0,0,0.08), inset -4px -4px 6px 0px #ffffff',
  noteCard: '4px 4px 12px 0px rgba(0,0,0,0.1), -4px -4px 10px 0px #ffffff',
  circularIndicator: '2px 2px 4px 0px rgba(0,0,0,0.1), -2px -2px 4px 0px #ffffff',
  circularCenter: '1.418px 1.418px 4.253px 0px rgba(127,86,217,0.12), -1.418px -1.418px 3.544px 0px #ffffff',
} as const

export const spacing = {
  layout: {
    containerPadding: '56px',
    maxWidth: '1440px',
    contentPaddingY: '24px',
    yieldsMaxWidth: '668px',
  },
  navigation: {
    height: '72px',
    paddingX: '56px',
    itemsGap: '16px',
    logoGap: '11.469px',
    logoHeight: '22px',
    logoSize: '22.938px',
    logoTextSize: '17.203px',
    logoTracking: '1.7203px',
    iconButtonSize: '40px',
    iconButtonPadding: '12px',
    iconButtonRadius: '99px',
    iconSize: '24px',
    dividerWidth: '1px',
    walletButtonHeight: '40px',
    walletButtonPaddingX: '16px',
    walletButtonPaddingY: '14px',
    walletButtonRadius: '99px',
    walletButtonOpacity: '0.15',
    menu: {
      height: '40px',
      width: '325px',
      radius: '99px',
      activeTabHeight: '40px',
      activeTabWidth: '88px',
      activeTabPaddingX: '20px',
      activeTabPaddingY: '3px',
      inactiveTop: '10px',
      positions: {
        yields: { active: 0, inactive: 22 },
        bridge: { active: 92, inactive: 100 },
        portfolio: { active: 178, inactive: 171 },
        docs: { active: 264, inactive: 257 },
      },
    },
  },
  card: {
    paddingX: '24px',
    paddingY: '20px',
    borderRadius: '16px',
    gap: '32px',
    gapInternal: '12px',
    yieldCard: {
      width: '318px',
      height: '244px',
      borderRadius: '16px',
      padding: '24px',
      iconSize: '120px',
      iconOffsetX: '-22px',
      iconOffsetY: '-22px',
      nameTop: '118px',
      nameLeft: '24px',
      nameGap: '2px',
      apyTop: '20px',
      apyRight: '24px',
      apyGap: '2px',
      buttonTop: '184px',
      buttonLeft: '24px',
      buttonWidth: '270px',
      buttonHeight: '40px',
      buttonRadius: '9999px',
      labelOpacity: '0.5',
    },
  },
  graph: {
    paddingX: '24px',
    paddingY: '20px',
    borderRadiusOuter: '16px',
    borderRadiusInner: '12px',
    containerGap: '12px',
    tvlChart: {
      width: '668px',
      height: '716px',
      outerRadius: '16px',
      innerRadius: '12px',
      innerTop: '12px',
      innerWidth: '644px',
      innerHeight: '692px',
      borderWidth: '2px',
      borderColor: 'rgba(255, 255, 255, 0.64)',
      contentPaddingX: '36px',
      contentTop: '32px',
      contentWidth: '596px',
      barsTop: '156px',
      barsHeight: '500px',
      barRadius: '2px',
      barsOpacity: '0.25',
      datesTop: '668px',
      datesOpacity: '0.9',
      dateOpacity: '0.8',
      headerGap: '2px',
      labelOpacity: '0.6',
      valueTracking: '1.1px',
    },
  },
  text: {
    headingTickerGap: '2px',
    dotInfoGap: '8px',
    labelHeadingGap: '8px',
    sectionHeaderMargin: '16px',
  },
  button: {
    paddingX: '16px',
    paddingY: '16px',
    gap: '8px',
    iconSize: '20px',
  },
  buttonSmall: {
    paddingX: '12px',
    paddingY: '8px',
    gap: '4px',
    iconSize: '12px',
  },
  tab: {
    paddingX: '12px',
    paddingY: '4px',
    gap: '4px',
  },
  dropdown: {
    paddingX: '8px',
    paddingY: '6px',
    gap: '8px',
  },
  input: {
    paddingX: '24px',
    paddingY: '12px',
  },
  portfolio: {
    tabGap: '32px',
    pnlBalanceGap: '12px',
  },
} as const

export const chart = {
  candle: {
    width: '10px',
    maxHeight: '500px',
    gap: '2px',
    stackedGap: '4px',
  },
  containerDistance: '12px',
  labels: {
    count: 7,
    containerWidth: '596px',
    fontSize: '12px',
  },
} as const

export const designTokens = {
  typography,
  colors,
  shadows,
  spacing,
  chart,
  typographyClasses,
  fontWeights,
} as const

export default designTokens

