import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MainTabParamList } from './types';
import { HomeScreen } from '../../screens/HomeScreen';
import { BrowseScreen } from '../../screens/BrowseScreen';
import { MapScreen } from '../../screens/MapScreen';
import { ChatScreen } from '../../screens/ChatScreen';
import { CartScreen } from '../../screens/CartScreen';
import { CameraScreen } from '../../screens/CameraScreen';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from 'react-native-paper';
import { useCartStore } from '../../lib/stores/cartStore';

const Tab = createBottomTabNavigator<MainTabParamList>();

export const TabNavigator = () => {
    const theme = useTheme();
    const { items, getTotalPrice } = useCartStore();

    const itemCount = items.reduce((total, item) => total + item.quantity, 0);
    const totalPrice = getTotalPrice();

    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: theme.colors.primary,
                tabBarInactiveTintColor: theme.colors.onSurfaceVariant,
                tabBarStyle: {
                    backgroundColor: theme.colors.surface,
                    borderTopColor: theme.colors.outlineVariant,
                    height: 60,
                    paddingBottom: 8,
                },
            }}
        >
            <Tab.Screen
                name="Home"
                component={HomeScreen}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name="home" size={size} color={color} />
                    ),
                }}
            />
            <Tab.Screen
                name="Browse"
                component={BrowseScreen}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name="magnify" size={size} color={color} />
                    ),
                }}
            />
            <Tab.Screen
                name="Map"
                component={MapScreen}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name="map-marker" size={size} color={color} />
                    ),
                }}
            />
            <Tab.Screen
                name="Camera"
                component={CameraScreen}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name="camera" size={size} color={color} />
                    ),
                }}
            />
            <Tab.Screen
                name="Chat"
                component={ChatScreen}
                options={{
                    tabBarLabel: 'Sparky',
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name="robot" size={size} color={color} />
                    ),
                }}
            />
            <Tab.Screen
                name="Cart"
                component={CartScreen}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <View style={styles.cartIconContainer}>
                            <MaterialCommunityIcons name="cart" size={size} color={color} />
                            {itemCount > 0 && (
                                <View style={styles.badge}>
                                    <Text style={styles.badgeText}>{itemCount}</Text>
                                </View>
                            )}
                        </View>
                    ),
                    tabBarLabel: ({ focused }) => (
                        <View style={styles.cartLabel}>
                            <Text style={[
                                styles.cartLabelText,
                                { color: focused ? theme.colors.primary : theme.colors.onSurfaceVariant }
                            ]}>
                                Shopping List
                            </Text>
                            {itemCount > 0 && (
                                <Text style={[
                                    styles.priceText,
                                    { color: focused ? theme.colors.primary : theme.colors.onSurfaceVariant }
                                ]}>
                                    ${totalPrice.toFixed(2)}
                                </Text>
                            )}
                        </View>
                    ),
                }}
            />
        </Tab.Navigator>
    );
};

const styles = StyleSheet.create({
    cartIconContainer: {
        position: 'relative',
    },
    badge: {
        position: 'absolute',
        right: -10,
        top: -8,
        backgroundColor: '#FFC107',
        borderRadius: 12,
        minWidth: 20,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 4,
    },
    badgeText: {
        color: '#000000',
        fontSize: 11,
        fontWeight: '700',
    },
    cartLabel: {
        alignItems: 'center',
        marginTop: -4,
    },
    cartLabelText: {
        fontSize: 12,
    },
    priceText: {
        fontSize: 11,
        fontWeight: '600',
        marginTop: 1,
    },
});
