import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Text, IconButton, Button } from 'react-native-paper';
import { Video, ResizeMode, AVPlaybackStatus } from 'expo-av';
import { useNavigation } from '@react-navigation/native';
import { colors, spacing } from '../theme/tokens';

export const Map3DScreen = () => {
    const navigation = useNavigation();
    const [isPlaying, setIsPlaying] = useState(false);
    const [showControls, setShowControls] = useState(true);
    const videoRef = useRef<Video>(null);

    // Auto-hide controls after 3 seconds
    useEffect(() => {
        if (isPlaying && showControls) {
            const timer = setTimeout(() => setShowControls(false), 3000);
            return () => clearTimeout(timer);
        }
    }, [isPlaying, showControls]);

    const handlePlayPause = async () => {
        if (!videoRef.current) return;

        if (isPlaying) {
            await videoRef.current.pauseAsync();
            setIsPlaying(false);
            setShowControls(true);
        } else {
            await videoRef.current.playAsync();
            setIsPlaying(true);
        }
    };

    const handleVideoStatus = (status: AVPlaybackStatus) => {
        if (status.isLoaded && status.didJustFinish) {
            // Loop video for continuous demo
            videoRef.current?.replayAsync();
        }
    };

    const handleScreenTap = () => {
        setShowControls(!showControls);
    };

    return (
        <View style={styles.container}>
            {/* Video Player */}
            <TouchableOpacity
                activeOpacity={1}
                onPress={handleScreenTap}
                style={styles.videoContainer}
            >
                <Video
                    ref={videoRef}
                    style={styles.video}
                    source={{
                        // User will provide their 3D map video path here
                        uri: Platform.OS === 'ios'
                            ? 'file:///path/to/your/3d-map-video.mp4'
                            : 'file:///sdcard/path/to/your/3d-map-video.mp4'
                    }}
                    resizeMode={ResizeMode.COVER}
                    isLooping
                    onPlaybackStatusUpdate={handleVideoStatus}
                />

                {/* 3D Navigation UI Overlay */}
                <View style={styles.overlay}>
                    {/* Top Bar */}
                    <View style={styles.topBar}>
                        <TouchableOpacity
                            style={styles.backButton}
                            onPress={() => navigation.goBack()}
                        >
                            <IconButton
                                icon="arrow-left"
                                size={24}
                                iconColor="#FFFFFF"
                            />
                        </TouchableOpacity>
                        <View style={styles.titleContainer}>
                            <Text style={styles.title}>🗺️ 3D Store Map</Text>
                            <Text style={styles.subtitle}>Interactive Navigation</Text>
                        </View>
                    </View>

                    {/* Navigation Instructions */}
                    {showControls && (
                        <View style={styles.instructionsContainer}>
                            <View style={styles.instructionCard}>
                                <Text style={styles.instructionText}>
                                    📍 Navigate through the store in 3D
                                </Text>
                                <Text style={styles.instructionSubtext}>
                                    Tap to show/hide controls
                                </Text>
                            </View>
                        </View>
                    )}

                    {/* Bottom Controls */}
                    {showControls && (
                        <View style={styles.bottomBar}>
                            <View style={styles.controlsContainer}>
                                <TouchableOpacity
                                    style={styles.controlButton}
                                    onPress={handlePlayPause}
                                >
                                    <IconButton
                                        icon={isPlaying ? 'pause' : 'play'}
                                        size={48}
                                        iconColor="#FFFFFF"
                                    />
                                    <Text style={styles.controlLabel}>
                                        {isPlaying ? 'Pause' : 'Play'} Tour
                                    </Text>
                                </TouchableOpacity>
                            </View>

                            {/* Navigation Hints */}
                            <View style={styles.hintsContainer}>
                                <View style={styles.hintItem}>
                                    <IconButton icon="gesture-swipe" size={20} iconColor="#FFFFFF" />
                                    <Text style={styles.hintText}>Swipe to rotate</Text>
                                </View>
                                <View style={styles.hintItem}>
                                    <IconButton icon="magnify-plus" size={20} iconColor="#FFFFFF" />
                                    <Text style={styles.hintText}>Pinch to zoom</Text>
                                </View>
                            </View>
                        </View>
                    )}
                </View>

                {/* Initial Play Overlay */}
                {!isPlaying && (
                    <View style={styles.initialOverlay}>
                        <View style={styles.playButtonContainer}>
                            <IconButton
                                icon="play-circle"
                                size={80}
                                iconColor="#FFFFFF"
                                onPress={handlePlayPause}
                            />
                            <Text style={styles.playText}>Start 3D Tour</Text>
                        </View>
                    </View>
                )}
            </TouchableOpacity>

            {/* Info Card */}
            <View style={styles.infoCard}>
                <Text variant="titleMedium" style={styles.infoTitle}>
                    📍 Setup Instructions
                </Text>
                <Text variant="bodyMedium" style={styles.infoText}>
                    1. Place your 3D map demo video in the assets folder
                </Text>
                <Text variant="bodyMedium" style={styles.infoText}>
                    2. Update the video source path in Map3DScreen.tsx (line 55)
                </Text>
                <Text variant="bodyMedium" style={styles.infoText}>
                    3. The video will show with interactive navigation UI
                </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000000',
    },
    videoContainer: {
        flex: 1,
        position: 'relative',
    },
    video: {
        width: '100%',
        height: '100%',
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'space-between',
    },
    topBar: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 50,
        paddingHorizontal: spacing.md,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    backButton: {
        marginRight: spacing.sm,
    },
    titleContainer: {
        flex: 1,
    },
    title: {
        color: '#FFFFFF',
        fontSize: 20,
        fontWeight: '700',
    },
    subtitle: {
        color: '#CCCCCC',
        fontSize: 14,
    },
    instructionsContainer: {
        position: 'absolute',
        top: '40%',
        left: 0,
        right: 0,
        alignItems: 'center',
    },
    instructionCard: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: spacing.lg,
        borderRadius: 16,
        maxWidth: '80%',
    },
    instructionText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
        marginBottom: spacing.xs,
    },
    instructionSubtext: {
        color: '#CCCCCC',
        fontSize: 14,
        textAlign: 'center',
    },
    bottomBar: {
        paddingBottom: 40,
        paddingHorizontal: spacing.lg,
    },
    controlsContainer: {
        alignItems: 'center',
        marginBottom: spacing.md,
    },
    controlButton: {
        alignItems: 'center',
    },
    controlLabel: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '600',
        marginTop: -spacing.sm,
    },
    hintsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: spacing.xl,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        padding: spacing.md,
        borderRadius: 12,
    },
    hintItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    hintText: {
        color: '#FFFFFF',
        fontSize: 12,
        marginLeft: -spacing.xs,
    },
    initialOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    playButtonContainer: {
        alignItems: 'center',
    },
    playText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '600',
        marginTop: spacing.sm,
    },
    infoCard: {
        backgroundColor: colors.surface,
        padding: spacing.lg,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    infoTitle: {
        marginBottom: spacing.md,
        color: colors.primary,
    },
    infoText: {
        color: colors.onSurface,
        marginBottom: spacing.xs,
    },
});
