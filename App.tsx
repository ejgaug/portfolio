import React, { useEffect } from 'react';
import { Platform } from 'react-native';
import { LinkingOptions, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from './src/screens/HomeScreen';
import ProjectScreen from './src/screens/ProjectScreen';
import MediScanPrivacyScreen from './src/screens/mediscan/PrivacyPolicyScreen';
import MediScanSupportScreen from './src/screens/mediscan/SupportScreen';
import RecipeScalerProPrivacyScreen from './src/screens/recipescalerpro/PrivacyPolicyScreen';
import RecipeScalerProSupportScreen from './src/screens/recipescalerpro/SupportScreen';
import { RootStackParamList } from './src/navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();

const linking: LinkingOptions<RootStackParamList> = {
    prefixes: ['https://elijahgauger.dev', 'https://www.elijahgauger.dev'],
    config: {
        screens: {
            Home: '',
            Projects: 'projects',
            MediScanPrivacy: 'mediscan/privacy',
            MediScanSupport: 'mediscan/support',
            RecipeScalerProPrivacy: 'recipescalerpro/privacy',
            RecipeScalerProSupport: 'recipescalerpro/support',
        },
    },
};

export default function App() {
    useEffect(() => {
        if (Platform.OS !== 'web' || typeof document === 'undefined') {
            return;
        }

        const svgMarkup =
            `<svg width="256" height="256" viewBox="0 0 256 256" fill="none" xmlns="http://www.w3.org/2000/svg">` +
            `<defs><linearGradient id="egGradient" x1="40" y1="28" x2="220" y2="228" gradientUnits="userSpaceOnUse">` +
            `<stop offset="0" stop-color="#6ee7f9"/><stop offset="1" stop-color="#f8d76b"/>` +
            `</linearGradient></defs>` +
            `<rect width="256" height="256" rx="76" fill="url(#egGradient)"/>` +
            `<text x="128" y="136" text-anchor="middle" dominant-baseline="middle" fill="#07111d" font-family="Arial, Helvetica, sans-serif" font-size="108" font-weight="800" letter-spacing="-6">EG</text>` +
            `</svg>`;
        const svgFaviconHref = `data:image/svg+xml,${encodeURIComponent(svgMarkup)}`;

        const existingLinks = Array.from(document.querySelectorAll('link[rel="icon"]'));
        existingLinks.forEach((link) => link.parentNode?.removeChild(link));

        const svgFavicon = document.createElement('link');
        svgFavicon.rel = 'icon';
        svgFavicon.type = 'image/svg+xml';
        svgFavicon.href = svgFaviconHref;
        document.head.appendChild(svgFavicon);

        return () => {
            svgFavicon.parentNode?.removeChild(svgFavicon);
        };
    }, []);

    return (
        <NavigationContainer linking={linking}>
            <Stack.Navigator
                initialRouteName="Home"
                screenOptions={{
                    headerShown: false,
                    contentStyle: { backgroundColor: '#0b1220' },
                }}
            >
                <Stack.Screen
                    name="Home"
                    component={HomeScreen}
                    options={{
                        title: 'EG Portfolio',
                    }}
                />
                <Stack.Screen name="Projects" component={ProjectScreen} />
                <Stack.Screen
                    name="MediScanPrivacy"
                    component={MediScanPrivacyScreen}
                    options={{
                        title: 'MediScan Privacy',
                    }}
                />
                <Stack.Screen
                    name="MediScanSupport"
                    component={MediScanSupportScreen}
                    options={{
                        title: 'MediScan Support',
                    }}
                />
                <Stack.Screen
                    name="RecipeScalerProPrivacy"
                    component={RecipeScalerProPrivacyScreen}
                    options={{
                        title: 'RecipeScalerPro Privacy',
                    }}
                />
                <Stack.Screen
                    name="RecipeScalerProSupport"
                    component={RecipeScalerProSupportScreen}
                    options={{
                        title: 'RecipeScalerPro Support',
                    }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}


// Re-export web build: 
// npx expo export --platform web

// Re-deploy to GitHub Pages:
// npm expo deploy
