import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { IconButton } from 'react-native-paper';
import Svg, {
    G,
    Rect,
    Path,
    Circle,
    Text as SvgText,
    Polygon
} from 'react-native-svg';
import { colors } from '../theme/tokens';

interface InteractiveStoreMapProps {
    onAislePress?: (aisleId: string) => void;
    highlightedPath?: string[];
}

export const InteractiveStoreMap: React.FC<InteractiveStoreMapProps> = ({
    onAislePress,
    highlightedPath = [],
}) => {
    const { width } = Dimensions.get('window');
    const [zoomLevel, setZoomLevel] = useState(1);

    // SVG viewBox based on the floor plan
    const viewBoxWidth = 450;
    const viewBoxHeight = 850;

    const handleZoomIn = () => {
        setZoomLevel(prev => Math.min(prev + 0.2, 2));
    };

    const handleZoomOut = () => {
        setZoomLevel(prev => Math.max(prev - 0.2, 0.6));
    };

    const handleResetZoom = () => {
        setZoomLevel(1);
    };

    // Aisle definitions based on the floor plan
    const aisles = [
        // Left side vertical aisles
        { id: 'A1', x: 70, y: 150, width: 25, height: 150, label: 'A1', category: 'produce' },
        { id: 'A2', x: 70, y: 320, width: 25, height: 150, label: 'A2', category: 'dairy' },
        { id: 'A3', x: 70, y: 490, width: 25, height: 150, label: 'A3', category: 'frozen' },

        // Center vertical aisles
        { id: 'B1', x: 140, y: 250, width: 25, height: 100, label: 'B1', category: 'snacks' },
        { id: 'B2', x: 140, y: 370, width: 25, height: 120, label: 'B2', category: 'beverages' },
        { id: 'B3', x: 140, y: 510, width: 25, height: 100, label: 'B3', category: 'bakery' },

        { id: 'C1', x: 200, y: 250, width: 25, height: 100, label: 'C1', category: 'canned' },
        { id: 'C2', x: 200, y: 370, width: 25, height: 120, label: 'C2', category: 'pasta' },
        { id: 'C3', x: 200, y: 510, width: 25, height: 100, label: 'C3', category: 'cereal' },

        // Right side sections (angled area)
        { id: 'D1', x: 270, y: 300, width: 80, height: 40, label: 'D1', category: 'deli' },
        { id: 'D2', x: 290, y: 450, width: 70, height: 40, label: 'D2', category: 'meat' },

        // Bottom horizontal section
        { id: 'E1', x: 100, y: 680, width: 100, height: 30, label: 'E1', category: 'checkout' },
    ];

    // Category colors
    const categoryColors: Record<string, string> = {
        produce: '#4CAF50',
        dairy: '#2196F3',
        frozen: '#00BCD4',
        snacks: '#FF9800',
        beverages: '#9C27B0',
        bakery: '#FF5722',
        canned: '#795548',
        pasta: '#FFC107',
        cereal: '#E91E63',
        deli: '#673AB7',
        meat: '#F44336',
        checkout: '#607D8B',
    };

    return (
        <View style={styles.container}>
            {/* Zoom controls */}
            <View style={styles.zoomControls}>
                <IconButton
                    icon="plus"
                    size={24}
                    onPress={handleZoomIn}
                    disabled={zoomLevel >= 2}
                    style={styles.zoomButton}
                />
                <IconButton
                    icon="refresh"
                    size={24}
                    onPress={handleResetZoom}
                    style={styles.zoomButton}
                />
                <IconButton
                    icon="minus"
                    size={24}
                    onPress={handleZoomOut}
                    disabled={zoomLevel <= 0.6}
                    style={styles.zoomButton}
                />
            </View>

            <ScrollView
                style={styles.scrollView}
                horizontal
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                maximumZoomScale={2}
                minimumZoomScale={0.5}
            >
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                >
                    <View style={{ transform: [{ scale: zoomLevel }] }}>
                        <Svg
                            width={width * 1.2}
                            height={500}
                            viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
                            style={styles.svg}
                        >
                            {/* Store outline - main rectangular area */}
                            <Path
                                d={`M 50 100 
                                    L 50 700 
                                    L 150 750 
                                    L 200 750 
                                    L 200 700 
                                    L 250 700 
                                    L 250 200 
                                    L 380 200 
                                    L 420 650 
                                    L 200 650 
                                    L 200 750 
                                    L 150 750 
                                    L 50 700 
                                    Z`}
                                fill="none"
                                stroke={colors.outline}
                                strokeWidth="3"
                            />

                            {/* Entrance */}
                            <Rect
                                x="145"
                                y="748"
                                width="60"
                                height="8"
                                fill={colors.primary}
                            />
                            <SvgText
                                x="175"
                                y="770"
                                fontSize="12"
                                fill={colors.onSurface}
                                textAnchor="middle"
                            >
                                ENTRANCE
                            </SvgText>

                            {/* Render aisles */}
                            {aisles.map((aisle) => (
                                <G key={aisle.id}>
                                    <Rect
                                        x={aisle.x}
                                        y={aisle.y}
                                        width={aisle.width}
                                        height={aisle.height}
                                        fill={categoryColors[aisle.category] || colors.surfaceVariant}
                                        stroke={
                                            highlightedPath.includes(aisle.id)
                                                ? colors.primary
                                                : colors.outline
                                        }
                                        strokeWidth={highlightedPath.includes(aisle.id) ? 3 : 1}
                                        opacity={0.7}
                                        onPress={() => onAislePress?.(aisle.id)}
                                    />
                                    <SvgText
                                        x={aisle.x + aisle.width / 2}
                                        y={aisle.y + aisle.height / 2 + 5}
                                        fontSize="10"
                                        fill="#FFFFFF"
                                        textAnchor="middle"
                                        fontWeight="bold"
                                    >
                                        {aisle.label}
                                    </SvgText>
                                </G>
                            ))}

                            {/* Navigation path (if any) */}
                            {highlightedPath.length > 1 && (
                                <Path
                                    d={highlightedPath
                                        .map((aisleId, index) => {
                                            const aisle = aisles.find(a => a.id === aisleId);
                                            if (!aisle) return '';
                                            const x = aisle.x + aisle.width / 2;
                                            const y = aisle.y + aisle.height / 2;
                                            return index === 0 ? `M ${x} ${y}` : `L ${x} ${y}`;
                                        })
                                        .join(' ')}
                                    fill="none"
                                    stroke={colors.primary}
                                    strokeWidth="4"
                                    strokeDasharray="10,5"
                                />
                            )}

                            {/* Start and End markers */}
                            {highlightedPath.length > 0 && (
                                <>
                                    {/* Start marker */}
                                    {(() => {
                                        const firstAisle = aisles.find(a => a.id === highlightedPath[0]);
                                        if (!firstAisle) return null;
                                        return (
                                            <Circle
                                                cx={firstAisle.x + firstAisle.width / 2}
                                                cy={firstAisle.y + firstAisle.height / 2}
                                                r="8"
                                                fill={colors.success}
                                                stroke="#FFFFFF"
                                                strokeWidth="2"
                                            />
                                        );
                                    })()}

                                    {/* End marker */}
                                    {(() => {
                                        const lastAisle = aisles.find(
                                            a => a.id === highlightedPath[highlightedPath.length - 1]
                                        );
                                        if (!lastAisle) return null;
                                        return (
                                            <Polygon
                                                points={`${lastAisle.x + lastAisle.width / 2},${lastAisle.y + lastAisle.height / 2 - 10} 
                                                         ${lastAisle.x + lastAisle.width / 2 - 8},${lastAisle.y + lastAisle.height / 2 + 6} 
                                                         ${lastAisle.x + lastAisle.width / 2 + 8},${lastAisle.y + lastAisle.height / 2 + 6}`}
                                                fill={colors.critical}
                                                stroke="#FFFFFF"
                                                strokeWidth="2"
                                            />
                                        );
                                    })()}
                                </>
                            )}
                        </Svg>
                    </View>
                </ScrollView>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    scrollView: {
        flex: 1,
    },
    svg: {
        backgroundColor: '#ffffff',
    },
    zoomControls: {
        position: 'absolute',
        top: 10,
        right: 10,
        zIndex: 10,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderRadius: 8,
        flexDirection: 'row',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    zoomButton: {
        margin: 0,
    },
});
