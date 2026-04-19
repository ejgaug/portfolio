import React from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import SupportPage from '../../components/app-pages/SupportPage';
import { hiddenAppContent } from '../../app-pages/content';
import { RootStackParamList } from '../../navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'MediScanSupport'>;

export default function SupportScreen({ navigation }: Props) {
    const content = hiddenAppContent.mediscan;

    return (
        <SupportPage
            content={content}
            onNavigateToPage={(page) => navigation.navigate(content.routes[page])}
        />
    );
}

