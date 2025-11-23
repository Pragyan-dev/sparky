import { NavigatorScreenParams } from '@react-navigation/native';

export type RootStackParamList = {
    Onboarding: undefined;
    MainTabs: NavigatorScreenParams<MainTabParamList>;
    ProductDetail: { productId: string };
    Dish: undefined;
    YouTube: undefined;
    Settings: undefined;
    Map3D: undefined;
};

export type MainTabParamList = {
    Home: undefined;
    Browse: undefined;
    Map: undefined;
    Camera: undefined;
    Chat: undefined;
    Cart: undefined;
};
