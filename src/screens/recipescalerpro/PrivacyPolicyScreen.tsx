import React from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import PrivacyPolicyPage from '../../components/app-pages/PrivacyPolicyPage';
import { hiddenAppContent } from '../../app-pages/content';
import { RootStackParamList } from '../../navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'RecipeScalerProPrivacy'>;

export default function PrivacyPolicyScreen({ navigation }: Props) {
    const content = hiddenAppContent.recipescalerpro;

    return (
        <PrivacyPolicyPage
            content={content}
            onNavigateToPage={(page) => navigation.navigate(content.routes[page])}
        />
    );
}

