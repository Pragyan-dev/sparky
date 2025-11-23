import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { RootStackParamList } from './types';
import { TabNavigator } from './TabNavigator';
import { OnboardingScreen } from '../../screens/OnboardingScreen';
import { ProductDetailScreen } from '../../screens/ProductDetailScreen';
import { DishScreen } from '../../screens/DishScreen';
import { YouTubeScreen } from '../../screens/YouTubeScreen';
import { SettingsScreen } from '../../screens/SettingsScreen';
import { Map3DScreen } from '../../screens/Map3DScreen';

const Stack = createStackNavigator<RootStackParamList>();

export const RootNavigator = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="Onboarding"
                component={OnboardingScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="MainTabs"
                component={TabNavigator}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="ProductDetail"
                component={ProductDetailScreen}
                options={{
                    headerShown: true,
                    title: 'Product Details',
                    headerBackTitle: 'Back',
                }}
            />
            <Stack.Screen
                name="Dish"
                component={DishScreen}
                options={{
                    headerShown: true,
                    title: 'Cook a Dish',
                    presentation: 'modal',
                }}
            />
            <Stack.Screen
                name="YouTube"
                component={YouTubeScreen}
                options={{
                    headerShown: true,
                    title: 'YouTube Recipe',
                    presentation: 'modal',
                }}
            />
            <Stack.Screen
                name="Settings"
                component={SettingsScreen}
                options={{
                    headerShown: true,
                    title: 'Settings',
                }}
            />
            <Stack.Screen
                name="Map3D"
                component={Map3DScreen}
                options={{
                    headerShown: false,
                    presentation: 'modal',
                }}
            />
        </Stack.Navigator>
    );
};
