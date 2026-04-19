import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import AppPageLayout from './AppPageLayout';
import { HiddenAppContent, HiddenAppPage } from '../../app-pages/content';

type PrivacyPolicyPageProps = {
    content: HiddenAppContent;
    onNavigateToPage: (page: HiddenAppPage) => void;
};

export default function PrivacyPolicyPage({ content, onNavigateToPage }: PrivacyPolicyPageProps) {
    return (
        <AppPageLayout
            content={content}
            currentPage="privacy"
            description={content.privacy.description}
            eyebrow="Privacy Policy"
            metaPills={content.privacy.metaPills}
            onNavigateToPage={onNavigateToPage}
            title={content.privacy.title}
        >
            <View style={styles.sectionList}>
                {content.privacy.sections.map((section) => (
                    <View
                        key={section.title}
                        style={[
                            styles.sectionCard,
                            {
                                backgroundColor: content.theme.panel,
                                borderColor: content.theme.border,
                            },
                        ]}
                    >
                        <Text style={[styles.sectionTitle, { color: content.theme.text }]}>{section.title}</Text>

                        {section.paragraphs.map((paragraph) => (
                            <Text key={paragraph} style={[styles.paragraph, { color: content.theme.textMuted }]}>
                                {paragraph}
                            </Text>
                        ))}

                        {section.bullets?.map((bullet) => (
                            <View key={bullet} style={styles.bulletRow}>
                                <Text style={[styles.bulletDot, { color: content.theme.accent }]}>•</Text>
                                <Text style={[styles.bulletText, { color: content.theme.textMuted }]}>{bullet}</Text>
                            </View>
                        ))}

                        {section.title.toLowerCase().includes('contact') ? (
                            <Pressable
                                onPress={() => onNavigateToPage('support')}
                                style={[
                                    styles.supportButton,
                                    {
                                        backgroundColor: content.theme.accent,
                                    },
                                ]}
                            >
                                <Text style={[styles.supportButtonText, { color: content.theme.panel }]}>
                                    Open support page
                                </Text>
                            </Pressable>
                        ) : null}
                    </View>
                ))}
            </View>
        </AppPageLayout>
    );
}

const styles = StyleSheet.create({
    sectionList: {
        gap: 18,
    },
    sectionCard: {
        borderRadius: 28,
        borderWidth: 1,
        gap: 12,
        padding: 22,
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: '800',
        lineHeight: 28,
    },
    paragraph: {
        fontSize: 15,
        lineHeight: 24,
    },
    bulletRow: {
        flexDirection: 'row',
        gap: 10,
        paddingRight: 10,
    },
    bulletDot: {
        fontSize: 18,
        lineHeight: 22,
    },
    bulletText: {
        flex: 1,
        fontSize: 15,
        lineHeight: 24,
    },
    supportButton: {
        alignItems: 'center',
        alignSelf: 'flex-start',
        borderRadius: 999,
        justifyContent: 'center',
        marginTop: 6,
        minHeight: 44,
        paddingHorizontal: 18,
        paddingVertical: 12,
    },
    supportButtonText: {
        fontSize: 14,
        fontWeight: '800',
    },
});
