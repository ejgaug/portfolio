import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../colors';

export default function ProjectsScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>My Projects</Text>
            <Text style={styles.comingSoon}>Coming soon — 5 featured apps!</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 40,
        fontWeight: 'bold',
        color: colors.text,
        marginBottom: 20,
    },
    comingSoon: {
        fontSize: 20,
        color: colors.muted,
    },
});