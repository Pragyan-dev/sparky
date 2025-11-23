import React, { useEffect, useRef } from 'react';
import { StyleSheet, Animated, ViewStyle } from 'react-native';
import { Text } from 'react-native-paper';
import { colors } from '../theme/tokens';

export type SafetyLevel = 'safe' | 'caution' | 'hardstop';

interface SafetyBadgeProps {
    level: SafetyLevel;
    size?: 'small' | 'medium' | 'large';
    animated?: boolean;
    style?: ViewStyle;
}

export const SafetyBadge: React.FC<SafetyBadgeProps> = ({
    level,
    size = 'medium',
    animated = false,
    style,
}) => {
    // Animation value (0 to 1)
    const pulseAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        if (animated && level !== 'safe') {
            Animated.loop(
                Animated.sequence([
                    Animated.timing(pulseAnim, {
                        toValue: 0.6,
                        duration: 1000,
                        useNativeDriver: true,
                    }),
                    Animated.timing(pulseAnim, {
                        toValue: 1,
                        duration: 1000,
                        useNativeDriver: true,
                    }),
                ])
            ).start();
        } else {
            pulseAnim.setValue(1);
        }
    }, [animated, level]);

    const getColors = () => {
        switch (level) {
            case 'safe':
                return {
                    bg: colors.successContainer,
                    text: colors.success,
                    icon: '✅',
                    label: 'Safe',
                };
            case 'caution':
                return {
                    bg: colors.cautionContainer,
                    text: colors.caution,
                    icon: '🟠',
                    label: 'Caution',
                };
            case 'hardstop':
                return {
                    bg: colors.criticalContainer,
                    text: colors.critical,
                    icon: '⛔',
                    label: 'Not Safe',
                };
        }
    };

    const getSize = () => {
        switch (size) {
            case 'small':
                return { padding: 4, fontSize: 12, iconSize: 14 };
            case 'medium':
                return { padding: 8, fontSize: 14, iconSize: 18 };
            case 'large':
                return { padding: 12, fontSize: 16, iconSize: 24 };
        }
    };

    const badgeColors = getColors();
    const dimensions = getSize();

    return (
        <Animated.View
            style={[
                styles.container,
                {
                    backgroundColor: badgeColors.bg,
                    padding: dimensions.padding,
                    opacity: pulseAnim,
                },
                style,
            ]}
        >
            <Text
                style={[
                    styles.text,
                    { color: badgeColors.text, fontSize: dimensions.fontSize },
                ]}
            >
                {badgeColors.icon} {badgeColors.label}
            </Text>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'flex-start',
    },
    text: {
        fontWeight: 'bold',
    },
});
