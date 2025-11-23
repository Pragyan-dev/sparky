// Design tokens for Sparky Shopper
// Material 3 inspired with custom brand colors

export const colors = {
    // Brand colors
    primary: '#6750A4',
    primaryContainer: '#EADDFF',
    onPrimary: '#FFFFFF',
    onPrimaryContainer: '#21005D',

    secondary: '#006874',
    secondaryContainer: '#97F0FF',
    onSecondary: '#FFFFFF',
    onSecondaryContainer: '#001F24',

    tertiary: '#7D5260',
    tertiaryContainer: '#FFD8E4',
    onTertiary: '#FFFFFF',
    onTertiaryContainer: '#31111D',

    // Semantic colors
    success: '#0F9D58',
    successContainer: '#C8E6C9',
    onSuccess: '#FFFFFF',

    caution: '#F9AB00',
    cautionContainer: '#FFF3CD',
    onCaution: '#000000',

    critical: '#D93025',
    criticalContainer: '#FFCDD2',
    onCritical: '#FFFFFF',

    // Neutral colors
    background: '#FFFBFE',
    onBackground: '#1C1B1F',
    surface: '#FFFBFE',
    onSurface: '#1C1B1F',
    surfaceVariant: '#E7E0EC',
    onSurfaceVariant: '#49454F',

    outline: '#79747E',
    outlineVariant: '#CAC4D0',
    shadow: '#000000',
    scrim: '#000000',

    // Dark mode
    dark: {
        background: '#1C1B1F',
        onBackground: '#E6E1E5',
        surface: '#1C1B1F',
        onSurface: '#E6E1E5',
        surfaceVariant: '#49454F',
        onSurfaceVariant: '#CAC4D0',
        outline: '#938F99',
        outlineVariant: '#49454F',
    },
};

export const spacing = {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
    xxxl: 64,
};

export const borderRadius = {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    xxl: 24,
    round: 9999,
};

export const elevation = {
    level0: {
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0,
        shadowRadius: 0,
        elevation: 0,
    },
    level1: {
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    level2: {
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 2,
    },
    level3: {
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.12,
        shadowRadius: 8,
        elevation: 3,
    },
    level4: {
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.16,
        shadowRadius: 16,
        elevation: 4,
    },
    level5: {
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.2,
        shadowRadius: 24,
        elevation: 5,
    },
};

export const motion = {
    duration: {
        fast: 120,
        medium: 180,
        slow: 240,
    },
    easing: {
        standard: 'cubic-bezier(0.4, 0.0, 0.2, 1)',
        decelerate: 'cubic-bezier(0.0, 0.0, 0.2, 1)',
        accelerate: 'cubic-bezier(0.4, 0.0, 1, 1)',
    },
};

export const typography = {
    displayLarge: {
        fontSize: 57,
        lineHeight: 64,
        fontWeight: '400' as const,
    },
    displayMedium: {
        fontSize: 45,
        lineHeight: 52,
        fontWeight: '400' as const,
    },
    displaySmall: {
        fontSize: 36,
        lineHeight: 44,
        fontWeight: '400' as const,
    },
    headlineLarge: {
        fontSize: 32,
        lineHeight: 40,
        fontWeight: '400' as const,
    },
    headlineMedium: {
        fontSize: 28,
        lineHeight: 36,
        fontWeight: '400' as const,
    },
    headlineSmall: {
        fontSize: 24,
        lineHeight: 32,
        fontWeight: '400' as const,
    },
    titleLarge: {
        fontSize: 22,
        lineHeight: 28,
        fontWeight: '500' as const,
    },
    titleMedium: {
        fontSize: 16,
        lineHeight: 24,
        fontWeight: '500' as const,
    },
    titleSmall: {
        fontSize: 14,
        lineHeight: 20,
        fontWeight: '500' as const,
    },
    bodyLarge: {
        fontSize: 16,
        lineHeight: 24,
        fontWeight: '400' as const,
    },
    bodyMedium: {
        fontSize: 14,
        lineHeight: 20,
        fontWeight: '400' as const,
    },
    bodySmall: {
        fontSize: 12,
        lineHeight: 16,
        fontWeight: '400' as const,
    },
    labelLarge: {
        fontSize: 14,
        lineHeight: 20,
        fontWeight: '500' as const,
    },
    labelMedium: {
        fontSize: 12,
        lineHeight: 16,
        fontWeight: '500' as const,
    },
    labelSmall: {
        fontSize: 11,
        lineHeight: 16,
        fontWeight: '500' as const,
    },
};
