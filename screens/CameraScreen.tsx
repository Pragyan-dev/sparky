import React, { useEffect, useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import { Video, ResizeMode } from 'expo-av';

export const CameraScreen = () => {
    const videoRef = useRef<Video>(null);

    useEffect(() => {
        // Auto-play video when component mounts
        const playVideo = async () => {
            if (videoRef.current) {
                try {
                    await videoRef.current.setStatusAsync({
                        shouldPlay: true,
                        rate: 1.0,
                        isMuted: true, // Mute for better performance
                        isLooping: true,
                        volume: 1.0,
                    });
                } catch (error) {
                    console.log('Video playback error:', error);
                }
            }
        };
        playVideo();
    }, []);

    return (
        <View style={styles.container}>
            <Video
                ref={videoRef}
                style={styles.video}
                source={require('../assets/empty_shelves_detection.mp4')}
                resizeMode={ResizeMode.CONTAIN}
                useNativeControls={false}
                isLooping
                shouldPlay
                isMuted
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000000',
    },
    video: {
        width: '100%',
        height: '100%',
    },
});
