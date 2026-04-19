import React, { ReactNode, useEffect } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';

import { HiddenAppContent, HiddenAppPage, MetaPill, SUPPORT_EMAIL } from '../../app-pages/content';

type AppPageLayoutProps = {
    children: ReactNode;
    content: HiddenAppContent;
    currentPage: HiddenAppPage;
    description: string;
    eyebrow: string;
    metaPills: MetaPill[];
    onNavigateToPage: (page: HiddenAppPage) => void;
    title: string;
};

export default function AppPageLayout({
    children,
    content,
    currentPage,
    description,
    eyebrow,
    metaPills,
    onNavigateToPage,
    title,
}: AppPageLayoutProps) {
    const { width } = useWindowDimensions();
    const isWide = width >= 860;

    useEffect(() => {
        if (typeof document === 'undefined') {
            return;
        }

        document.title = `${content.name} ${currentPage === 'privacy' ? 'Privacy Policy' : 'Support'} | Elijah Gauger`;
    }, [content.name, currentPage]);

    return (
        <ScrollView
            contentContainerStyle={[
                styles.scrollContent,
                {
                    backgroundColor: content.theme.background,
                    paddingHorizontal: width >= 920 ? 40 : 18,
                },
            ]}
            showsVerticalScrollIndicator={false}
        >
            <View
                style={[
                    styles.heroCard,
                    {
                        backgroundColor: content.theme.panel,
                        borderColor: content.theme.border,
                        flexDirection: isWide ? 'row' : 'column',
                    },
                ]}
            >
                <View style={styles.heroCopy}>
                    <Text style={[styles.eyebrow, { color: content.theme.accent }]}>{eyebrow}</Text>
                    <Text style={[styles.title, { color: content.theme.text }]}>{title}</Text>
                    <Text style={[styles.description, { color: content.theme.textMuted }]}>{description}</Text>

                    <View style={styles.metaRow}>
                        {metaPills.map((pill) => (
                            <View
                                key={`${pill.label}-${pill.value}`}
                                style={[
                                    styles.metaPill,
                                    {
                                        backgroundColor: content.theme.accentSoft,
                                        borderColor: content.theme.border,
                                    },
                                ]}
                            >
                                <Text style={[styles.metaLabel, { color: content.theme.textMuted }]}>{pill.label}</Text>
                                <Text style={[styles.metaValue, { color: content.theme.text }]}>{pill.value}</Text>
                            </View>
                        ))}
                    </View>
                </View>

                <View
                    style={[
                        styles.sideCard,
                        {
                            backgroundColor: content.theme.accentSoft,
                            borderColor: content.theme.border,
                            minWidth: isWide ? 280 : undefined,
                        },
                    ]}
                >
                    <Text style={[styles.sideCardTitle, { color: content.theme.text }]}>App pages</Text>
                    <Text style={[styles.sideCardBody, { color: content.theme.textMuted }]}>
                        These routes are intentionally separate from the main portfolio navigation and are meant to be
                        accessed directly from app listing links.
                    </Text>

                    <View style={styles.segmentedControl}>
                        <Pressable
                            onPress={() => onNavigateToPage('support')}
                            style={[
                                styles.segmentButton,
                                {
                                    backgroundColor:
                                        currentPage === 'support' ? content.theme.accent : content.theme.panel,
                                    borderColor: content.theme.border,
                                },
                            ]}
                        >
                            <Text
                                style={[
                                    styles.segmentButtonText,
                                    {
                                        color:
                                            currentPage === 'support' ? content.theme.panel : content.theme.text,
                                    },
                                ]}
                            >
                                Support
                            </Text>
                        </Pressable>

                        <Pressable
                            onPress={() => onNavigateToPage('privacy')}
                            style={[
                                styles.segmentButton,
                                {
                                    backgroundColor:
                                        currentPage === 'privacy' ? content.theme.accent : content.theme.panel,
                                    borderColor: content.theme.border,
                                },
                            ]}
                        >
                            <Text
                                style={[
                                    styles.segmentButtonText,
                                    {
                                        color:
                                            currentPage === 'privacy' ? content.theme.panel : content.theme.text,
                                    },
                                ]}
                            >
                                Privacy Policy
                            </Text>
                        </Pressable>
                    </View>

                    {/* <View style={[styles.contactCard, { borderColor: content.theme.border }]}>
                        <Text style={[styles.contactLabel, { color: content.theme.textMuted }]}>Support Email</Text>
                        <Text style={[styles.contactValue, { color: content.theme.text }]}>{SUPPORT_EMAIL}</Text>
                    </View> */}
                </View>
            </View>

            {children}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    scrollContent: {
        gap: 24,
        minHeight: '100%',
        paddingBottom: 40,
        paddingTop: 24,
    },
    heroCard: {
        borderRadius: 30,
        borderWidth: 1,
        gap: 20,
        padding: 22,
    },
    heroCopy: {
        flex: 1.5,
        gap: 14,
    },
    eyebrow: {
        fontSize: 13,
        fontWeight: '800',
        letterSpacing: 1.1,
        textTransform: 'uppercase',
    },
    title: {
        fontSize: 34,
        fontWeight: '800',
        letterSpacing: -0.6,
        lineHeight: 40,
    },
    description: {
        fontSize: 16,
        lineHeight: 25,
    },
    metaRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    metaPill: {
        borderRadius: 20,
        borderWidth: 1,
        gap: 4,
        minWidth: 152,
        paddingHorizontal: 14,
        paddingVertical: 12,
    },
    metaLabel: {
        fontSize: 11,
        fontWeight: '700',
        letterSpacing: 0.5,
        textTransform: 'uppercase',
    },
    metaValue: {
        fontSize: 16,
        fontWeight: '700',
    },
    sideCard: {
        borderRadius: 24,
        borderWidth: 1,
        gap: 16,
        justifyContent: 'space-between',
        padding: 18,
    },
    sideCardTitle: {
        fontSize: 18,
        fontWeight: '800',
    },
    sideCardBody: {
        fontSize: 14,
        lineHeight: 22,
    },
    segmentedControl: {
        gap: 10,
    },
    segmentButton: {
        alignItems: 'center',
        borderRadius: 999,
        borderWidth: 1,
        justifyContent: 'center',
        minHeight: 46,
        paddingHorizontal: 16,
        paddingVertical: 10,
    },
    segmentButtonText: {
        fontSize: 14,
        fontWeight: '800',
    },
    contactCard: {
        borderRadius: 18,
        borderWidth: 1,
        gap: 4,
        padding: 14,
    },
    contactLabel: {
        fontSize: 11,
        fontWeight: '700',
        letterSpacing: 0.5,
        textTransform: 'uppercase',
    },
    contactValue: {
        fontSize: 15,
        fontWeight: '700',
    },
});

