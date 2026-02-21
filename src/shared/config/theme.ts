export const colors = {
  primary: {
    main: '#800020',
    light: '#A33D5B',
    dark: '#4A0012',
    contrast: '#FFFFFF',
  },
  secondary: {
    main: '#D4AF37',
    light: '#E5C76B',
    dark: '#9A7B1F',
  },
  background: {
    default: '#FAFAFA',
    paper: '#FFFFFF',
    dark: '#1A0008',
  },
  text: {
    primary: '#1A1A1A',
    secondary: '#666666',
    disabled: '#9E9E9E',
    light: '#FFFFFF',
  },
  grades: {
    excellent: '#2E7D32',
    good: '#558B2F',
    satisfactory: '#F9A825',
    poor: '#D84315',
  },
  border: {
    light: '#E0E0E0',
    main: '#BDBDBD',
  },
  status: {
    success: '#4CAF50',
    warning: '#FF9800',
    error: '#F44336',
    info: '#2196F3',
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

export const typography = {
  fontFamily: {
    regular: 'System',
    medium: 'System',
    bold: 'System',
  },
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 32,
  },
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },
};

export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
};

export const theme = {
  colors,
  spacing,
  borderRadius,
  typography,
  shadows,
};

export type Theme = typeof theme;
export type Colors = typeof colors;
