import React, { useMemo, useState } from 'react';
import { Linking, Pressable, StyleSheet, Text, TextInput, View, useWindowDimensions } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import AppPageLayout from './AppPageLayout';
import { HiddenAppContent, HiddenAppPage, SUPPORT_EMAIL } from '../../app-pages/content';

type SupportPageProps = {
    content: HiddenAppContent;
    onNavigateToPage: (page: HiddenAppPage) => void;
};

export default function SupportPage({ content, onNavigateToPage }: SupportPageProps) {
    const { width } = useWindowDimensions();
    const [topic, setTopic] = useState('');
    const [deviceDetails, setDeviceDetails] = useState('');
    const [message, setMessage] = useState('');
    const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

    const isWide = width >= 940;

    const faqCountLabel = useMemo(
        () => `${content.support.faqItems.length} common questions`,
        [content.support.faqItems.length]
    );

    const supportMetaPills = useMemo(
        () =>
            content.support.metaPills.map((pill) =>
                pill.label === 'FAQ Topics' ? { ...pill, value: faqCountLabel } : pill
            ),
        [content.support.metaPills, faqCountLabel]
    );

    const openSupportDraft = () => {
        const trimmedTopic = topic.trim();
        const trimmedDeviceDetails = deviceDetails.trim();
        const trimmedMessage = message.trim();
        const subject = encodeURIComponent(
            trimmedTopic ? `${content.name} Support: ${trimmedTopic}` : `${content.name} Support Request`
        );
        const body = encodeURIComponent(
            [
                `Hello ${content.name} Support,`,
                '',
                `Topic: ${trimmedTopic || 'Not provided'}`,
                `${content.support.deviceFieldLabel}: ${trimmedDeviceDetails || 'Not provided'}`,
                '',
                trimmedMessage || 'Please describe your question or issue here.',
            ].join('\n')
        );

        void Linking.openURL(`mailto:${SUPPORT_EMAIL}?subject=${subject}&body=${body}`);
    };

    return (
        <AppPageLayout
            content={content}
            currentPage="support"
            description={content.support.description}
            eyebrow="Support"
            metaPills={supportMetaPills}
            onNavigateToPage={onNavigateToPage}
            title={content.support.title}
        >
            <View style={[styles.contentGrid, { flexDirection: isWide ? 'row' : 'column' }]}>
                <View
                    style={[
                        styles.sectionCard,
                        {
                            backgroundColor: content.theme.panel,
                            borderColor: content.theme.border,
                            flex: isWide ? 1.05 : undefined,
                        },
                    ]}
                >
                    <Text style={[styles.sectionTitle, { color: content.theme.text }]}>Support form</Text>
                    <Text style={[styles.sectionBody, { color: content.theme.textMuted }]}>{content.support.formIntro}</Text>

                    <View style={styles.formField}>
                        <Text style={[styles.formLabel, { color: content.theme.text }]}>Topic</Text>
                        <TextInput
                            onChangeText={setTopic}
                            placeholder={content.support.topicPlaceholder}
                            placeholderTextColor={content.theme.textMuted}
                            style={[
                                styles.formInput,
                                {
                                    backgroundColor: '#ffffff',
                                    borderColor: content.theme.border,
                                    color: content.theme.text,
                                },
                            ]}
                            value={topic}
                        />
                    </View>

                    <View style={styles.formField}>
                        <Text style={[styles.formLabel, { color: content.theme.text }]}>{content.support.deviceFieldLabel}</Text>
                        <TextInput
                            onChangeText={setDeviceDetails}
                            placeholder={content.support.devicePlaceholder}
                            placeholderTextColor={content.theme.textMuted}
                            style={[
                                styles.formInput,
                                {
                                    backgroundColor: '#ffffff',
                                    borderColor: content.theme.border,
                                    color: content.theme.text,
                                },
                            ]}
                            value={deviceDetails}
                        />
                    </View>

                    <View style={styles.formField}>
                        <Text style={[styles.formLabel, { color: content.theme.text }]}>Message</Text>
                        <TextInput
                            multiline
                            numberOfLines={7}
                            onChangeText={setMessage}
                            placeholder={content.support.messagePlaceholder}
                            placeholderTextColor={content.theme.textMuted}
                            style={[
                                styles.formInput,
                                styles.formTextarea,
                                {
                                    backgroundColor: '#ffffff',
                                    borderColor: content.theme.border,
                                    color: content.theme.text,
                                },
                            ]}
                            textAlignVertical="top"
                            value={message}
                        />
                    </View>

                    <Pressable
                        onPress={openSupportDraft}
                        style={[styles.submitButton, { backgroundColor: content.theme.accent }]}
                    >
                        <Text style={[styles.submitButtonText, { color: content.theme.panel }]}>Open support email</Text>
                    </Pressable>

                    <Text style={[styles.formHint, { color: content.theme.textMuted }]}>
                        If your mail app does not open automatically, you can email {SUPPORT_EMAIL} directly.
                    </Text>
                </View>

                <View
                    style={[
                        styles.sectionCard,
                        {
                            backgroundColor: content.theme.panel,
                            borderColor: content.theme.border,
                            flex: isWide ? 0.95 : undefined,
                        },
                    ]}
                >
                    <Text style={[styles.sectionTitle, { color: content.theme.text }]}>Frequently asked questions</Text>
                    <Text style={[styles.sectionBody, { color: content.theme.textMuted }]}>
                        A few common troubleshooting and workflow questions for {content.name}.
                    </Text>

                    <View style={styles.faqList}>
                        {content.support.faqItems.map((faqItem, index) => {
                            const isOpen = openFaqIndex === index;

                            return (
                                <Pressable
                                    key={faqItem.question}
                                    onPress={() => setOpenFaqIndex((currentIndex) => (currentIndex === index ? null : index))}
                                    style={[
                                        styles.faqItem,
                                        {
                                            backgroundColor: content.theme.accentSoft,
                                            borderColor: content.theme.border,
                                        },
                                    ]}
                                >
                                    <View style={styles.faqQuestionRow}>
                                        <Text style={[styles.faqQuestion, { color: content.theme.text }]}>
                                            {faqItem.question}
                                        </Text>
                                        <MaterialIcons
                                            color={content.theme.accent}
                                            name={isOpen ? 'expand-less' : 'expand-more'}
                                            size={24}
                                        />
                                    </View>

                                    {isOpen ? (
                                        <Text style={[styles.faqAnswer, { color: content.theme.textMuted }]}>
                                            {faqItem.answer}
                                        </Text>
                                    ) : null}
                                </Pressable>
                            );
                        })}
                    </View>
                </View>
            </View>
        </AppPageLayout>
    );
}

const styles = StyleSheet.create({
    contentGrid: {
        gap: 20,
    },
    sectionCard: {
        borderRadius: 28,
        borderWidth: 1,
        gap: 16,
        minWidth: 0,
        padding: 22,
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: '800',
        lineHeight: 30,
    },
    sectionBody: {
        fontSize: 15,
        lineHeight: 23,
    },
    formField: {
        gap: 8,
    },
    formLabel: {
        fontSize: 13,
        fontWeight: '800',
    },
    formInput: {
        borderRadius: 18,
        borderWidth: 1,
        fontSize: 15,
        paddingHorizontal: 14,
        paddingVertical: 12,
    },
    formTextarea: {
        minHeight: 146,
    },
    submitButton: {
        alignItems: 'center',
        alignSelf: 'flex-start',
        borderRadius: 999,
        justifyContent: 'center',
        minHeight: 46,
        paddingHorizontal: 18,
        paddingVertical: 12,
    },
    submitButtonText: {
        fontSize: 14,
        fontWeight: '800',
    },
    formHint: {
        fontSize: 13,
        lineHeight: 20,
    },
    faqList: {
        gap: 12,
        minWidth: 0,
    },
    faqItem: {
        borderRadius: 20,
        borderWidth: 1,
        gap: 8,
        overflow: 'hidden',
        padding: 16,
    },
    faqQuestionRow: {
        alignItems: 'flex-start',
        flexDirection: 'row',
        gap: 12,
        justifyContent: 'space-between',
        minWidth: 0,
    },
    faqQuestion: {
        flex: 1,
        flexShrink: 1,
        fontSize: 16,
        fontWeight: '800',
        lineHeight: 22,
        minWidth: 0,
    },
    faqAnswer: {
        fontSize: 14,
        lineHeight: 22,
    },
});
