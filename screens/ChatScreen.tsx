import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, TextInput, Alert } from 'react-native';
import { Text, IconButton, ActivityIndicator, Avatar } from 'react-native-paper';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system/legacy';
import { colors, spacing } from '../theme/tokens';
import { SectionHeader } from '../components/SectionHeader';
import { useUserStore } from '../lib/stores/userStore';
import { useCartStore } from '../lib/stores/cartStore';
import productsJson from '../data/products.json';
import { generateSparkyResponse, generateSparkyAudioResponse } from '../lib/gemini';

// ElevenLabs Configuration
const ELEVENLABS_API_KEY = 'sk_124977cc68d6fb291658b43c9bf54584cd94bfbc7c2cac23';
const VOICE_ID = 'nPczCjzI2devNBz1zQrb'; // Brian

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'sparky';
    timestamp: Date;
}

export const ChatScreen = () => {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            text: "Hi! I'm Sparky. I know about your allergies and the store layout. How can I help you today?",
            sender: 'sparky',
            timestamp: new Date(),
        },
    ]);
    const [inputText, setInputText] = useState('');
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const recordingRef = useRef<Audio.Recording | null>(null);

    const scrollViewRef = useRef<ScrollView>(null);
    const soundRef = useRef<Audio.Sound | null>(null);
    const inputRef = useRef<TextInput>(null);

    const { preferences } = useUserStore();
    const { addItem } = useCartStore();

    // Configure Audio on mount
    useEffect(() => {
        const setupAudio = async () => {
            try {
                await Audio.setAudioModeAsync({
                    allowsRecordingIOS: true, // Enable recording
                    playsInSilentModeIOS: true,
                    shouldDuckAndroid: true,
                    playThroughEarpieceAndroid: false,
                    staysActiveInBackground: false,
                });
            } catch (e) {
                console.error('Failed to setup audio', e);
            }
        };
        setupAudio();
    }, []);

    // Helper to add message
    const addMessage = (text: string, sender: 'user' | 'sparky') => {
        setMessages((prev) => [
            ...prev,
            { id: Date.now().toString(), text, sender, timestamp: new Date() },
        ]);
    };

    // Handle Audio Recording
    const startRecording = async () => {
        try {
            const permission = await Audio.requestPermissionsAsync();
            if (permission.status !== 'granted') {
                Alert.alert('Permission needed', 'Please grant microphone permission to talk to Sparky.');
                return;
            }

            await Audio.setAudioModeAsync({
                allowsRecordingIOS: true,
                playsInSilentModeIOS: true,
            });

            const { recording } = await Audio.Recording.createAsync(
                Audio.RecordingOptionsPresets.HIGH_QUALITY
            );
            recordingRef.current = recording;
            setIsRecording(true);
        } catch (err) {
            console.error('Failed to start recording', err);
            Alert.alert('Error', 'Could not start recording.');
        }
    };

    const stopRecording = async () => {
        setIsRecording(false);
        if (!recordingRef.current) return;

        try {
            await recordingRef.current.stopAndUnloadAsync();
            const uri = recordingRef.current.getURI();

            if (uri) {
                // Read file as base64
                const base64 = await FileSystem.readAsStringAsync(uri, {
                    encoding: 'base64',
                });

                addMessage("🎤 (Voice Message)", 'user');

                // Convert messages to history format
                const history = messages.map(m => ({
                    role: m.sender === 'user' ? 'User' : 'Sparky',
                    text: m.text
                }));

                const sparkyResponse = await generateSparkyAudioResponse(
                    base64,
                    productsJson.products,
                    preferences,
                    history
                );

                // Execute Actions
                if (sparkyResponse.actions) {
                    for (const action of sparkyResponse.actions) {
                        if (action.type === 'add_to_cart' && action.productId) {
                            const product = productsJson.products.find((p: any) => p.id === action.productId);
                            if (product) {
                                addItem({
                                    productId: product.id,
                                    name: product.name,
                                    price: Number(product.price),
                                    aisle: product.aisle || 'A1',
                                    tokens: product.tokens || [],
                                    safetyLevel: 'safe',
                                });
                            }
                        }
                    }
                }

                addMessage(sparkyResponse.text, 'sparky');
                speakResponse(sparkyResponse.text);
            }

            recordingRef.current = null;
        } catch (err) {
            console.error('Failed to stop recording', err);
            Alert.alert('Error', 'Failed to process voice message.');
        }
    };

    // Sparky's Brain: Process user input
    const processQuery = async (query: string) => {
        // Show loading state (optional, but good for UX)
        // For now, we just wait.

        try {
            // Convert messages to history format
            const history = messages.map(m => ({
                role: m.sender === 'user' ? 'User' : 'Sparky',
                text: m.text
            }));

            const sparkyResponse = await generateSparkyResponse(
                query,
                productsJson.products,
                preferences,
                history
            );

            // Execute Actions
            if (sparkyResponse.actions) {
                for (const action of sparkyResponse.actions) {
                    if (action.type === 'add_to_cart' && action.productId) {
                        const product = productsJson.products.find((p: any) => p.id === action.productId);
                        if (product) {
                            addItem({
                                productId: product.id,
                                name: product.name,
                                price: Number(product.price),
                                aisle: product.aisle || 'A1',
                                tokens: product.tokens || [],
                                safetyLevel: 'safe',
                            });
                        }
                    }
                }
            }

            addMessage(sparkyResponse.text, 'sparky');
            speakResponse(sparkyResponse.text);

        } catch (error) {
            console.error('Error processing query:', error);
            const fallback = "I'm sorry, I couldn't connect to my brain. Please check your internet.";
            addMessage(fallback, 'sparky');
            speakResponse(fallback);
        }
    };

    // Text-to-Speech using ElevenLabs
    const speakResponse = async (text: string) => {
        try {
            setIsSpeaking(true);

            // Stop previous sound if playing
            if (soundRef.current) {
                await soundRef.current.unloadAsync();
            }

            // 1. Switch to Speaker Mode (Disable Recording)
            // This forces iOS to use the main speaker instead of the earpiece
            await Audio.setAudioModeAsync({
                allowsRecordingIOS: false,
                playsInSilentModeIOS: true,
            });

            const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'xi-api-key': ELEVENLABS_API_KEY,
                },
                body: JSON.stringify({
                    text,
                    model_id: "eleven_monolingual_v1",
                    voice_settings: {
                        stability: 0.5,
                        similarity_boost: 0.75,
                    },
                }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('ElevenLabs API Error:', errorText);
                throw new Error('TTS failed');
            }

            // Save audio to file with UNIQUE name
            const filename = `speech_${Date.now()}.mp3`;
            const fileUri = (FileSystem as any).documentDirectory + filename;

            const blob = await response.blob();
            const reader = new FileReader();
            reader.readAsDataURL(blob);
            reader.onloadend = async () => {
                const base64data = (reader.result as string).split(',')[1];
                await FileSystem.writeAsStringAsync(fileUri, base64data, {
                    encoding: 'base64',
                });

                // Play audio
                const { sound } = await Audio.Sound.createAsync(
                    { uri: fileUri },
                    { shouldPlay: true }
                );
                soundRef.current = sound;

                sound.setOnPlaybackStatusUpdate(async (status) => {
                    if (status.isLoaded && status.didJustFinish) {
                        setIsSpeaking(false);
                        // 2. Switch back to Recording Mode (Ready for next input)
                        await Audio.setAudioModeAsync({
                            allowsRecordingIOS: true,
                            playsInSilentModeIOS: true,
                        });
                        // Cleanup file AFTER it finishes
                        // FileSystem.deleteAsync(fileUri, { idempotent: true });
                    }
                });
            };
        } catch (error) {
            console.error('Error speaking:', error);
            setIsSpeaking(false);
            // Ensure we reset to recording mode even on error
            await Audio.setAudioModeAsync({
                allowsRecordingIOS: true,
                playsInSilentModeIOS: true,
            });
            Alert.alert('Audio Error', 'Could not play response.');
        }
    };

    const handleMicPress = () => {
        if (isRecording) {
            stopRecording();
        } else {
            startRecording();
        }
    };

    const handleSend = () => {
        if (!inputText.trim()) {
            // If text input is empty, treat send button as mic button
            handleMicPress();
            return;
        }
        addMessage(inputText, 'user');
        processQuery(inputText);
        setInputText('');
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={100}
        >
            <View style={styles.header}>
                <SectionHeader title="Ask Sparky" />
            </View>

            <ScrollView
                ref={scrollViewRef}
                style={styles.messagesContainer}
                contentContainerStyle={styles.messagesContent}
                onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
            >
                {messages.map((msg) => (
                    <View
                        key={msg.id}
                        style={[
                            styles.messageBubble,
                            msg.sender === 'user' ? styles.userBubble : styles.sparkyBubble
                        ]}
                    >
                        {msg.sender === 'sparky' && (
                            <Avatar.Icon size={24} icon="robot" style={styles.avatar} />
                        )}
                        <Text style={[
                            styles.messageText,
                            msg.sender === 'user' ? styles.userText : styles.sparkyText
                        ]}>
                            {msg.text}
                        </Text>
                    </View>
                ))}
                {isSpeaking && (
                    <View style={{ flexDirection: 'row', alignItems: 'center', padding: spacing.md, justifyContent: 'center' }}>
                        <ActivityIndicator size="small" color={colors.primary} />
                        <Text style={{ marginLeft: spacing.sm, color: colors.primary }}>Sparky is speaking...</Text>
                    </View>
                )}
            </ScrollView>

            <View style={styles.inputContainer}>
                <TextInput
                    ref={inputRef}
                    style={styles.input}
                    value={inputText}
                    onChangeText={setInputText}
                    placeholder={isRecording ? "Listening..." : "Ask about products, allergies..."}
                    placeholderTextColor={colors.onSurfaceVariant}
                    onSubmitEditing={handleSend}
                    editable={!isRecording}
                />
                <IconButton
                    icon={inputText ? "send" : (isRecording ? "stop" : "microphone")}
                    mode="contained"
                    containerColor={isRecording ? '#FF4444' : colors.primary}
                    iconColor={colors.onPrimary}
                    size={24}
                    onPress={inputText ? handleSend : handleMicPress}
                />
            </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F2F2F7', // iOS grouped background style
    },
    header: {
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.md,
        backgroundColor: '#F2F2F7',
        zIndex: 1,
    },
    messagesContainer: {
        flex: 1,
        paddingHorizontal: spacing.md,
    },
    messagesContent: {
        paddingVertical: spacing.md,
        gap: spacing.md,
        paddingBottom: 20,
    },
    messageBubble: {
        maxWidth: '85%',
        padding: 14,
        borderRadius: 22,
        flexDirection: 'row',
        alignItems: 'flex-end', // Align avatar to bottom
        gap: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 3,
        elevation: 2,
    },
    userBubble: {
        alignSelf: 'flex-end',
        backgroundColor: colors.primary,
        borderBottomRightRadius: 4,
    },
    sparkyBubble: {
        alignSelf: 'flex-start',
        backgroundColor: '#FFFFFF',
        borderBottomLeftRadius: 4,
    },
    messageText: {
        fontSize: 16,
        lineHeight: 22,
        flexShrink: 1, // Fixes text overflow
    },
    userText: {
        color: '#FFFFFF',
        fontWeight: '500',
    },
    sparkyText: {
        color: '#1C1C1E',
    },
    avatar: {
        backgroundColor: colors.secondaryContainer,
        marginRight: 0,
    },
    inputContainer: {
        flexDirection: 'row',
        padding: 16,
        backgroundColor: '#F2F2F7', // Match background
        alignItems: 'center',
        gap: 10,
    },
    input: {
        flex: 1,
        height: 52,
        backgroundColor: '#FFFFFF',
        borderRadius: 26,
        paddingHorizontal: 20,
        fontSize: 16,
        color: '#000',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    speakingIndicator: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        padding: 12,
        backgroundColor: 'rgba(255,255,255,0.8)',
        borderRadius: 20,
        alignSelf: 'center',
        marginBottom: 10,
    },
    speakingText: {
        fontSize: 14,
        color: colors.primary,
        fontWeight: '600',
    },
});
