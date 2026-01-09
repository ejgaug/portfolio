import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, Animated, TouchableOpacity, Linking } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { colors } from '../colors';

// Responsive constants
const isSmallScreen = (width: number) => width < 600;

// Base values (used when screen >= 600px)
const BASE_TAB_WIDTH = 200;
const BASE_TAB_HEIGHT = 50;
const BASE_FILE_HEIGHT = 500;
const BASE_FONT_SIZE = 20;

// Responsive adjustments
const getTabWidth = (screenWidth: number) => isSmallScreen(screenWidth) ? 160 : BASE_TAB_WIDTH;
const getTabHeight = (screenWidth: number) => isSmallScreen(screenWidth) ? 40 : BASE_TAB_HEIGHT;
const getFontSize = (screenWidth: number, base: number) => isSmallScreen(screenWidth) ? base * 0.85 : base;

interface Project {
    title: string;
    description: string;
    tech: string;
    gitHub: string;
    publish: { web: string; apple: string; google: string };
}

interface FileCabinetProps {
    projects: Project[];
}

const FileCabinet: React.FC<FileCabinetProps> = ({ projects }) => {
    const [openIndex, setOpenIndex] = useState(0);
    const [screenWidth, setScreenWidth] = useState(Dimensions.get('window').width);

    // Responsive values recalculated on screen size change
    const TAB_WIDTH = getTabWidth(screenWidth);
    const TAB_HEIGHT = getTabHeight(screenWidth);
    const FILE_WIDTH = screenWidth / 1.5;
    const FILE_HEIGHT = BASE_FILE_HEIGHT;
    const R = 20; // corner radius

    const CLOSED_SCALE = 0.8;         // closed tabs 20% smaller
    const OPEN_SCALE = 1.05;          // open file slightly bigger
    const CLOSED_FONT_SCALE = 0.85;   // closed font 15% smaller
    const OPEN_FONT_SCALE = 1.05;     // open font 5% bigger

    const animationValues = useRef(projects.map(() => new Animated.Value(0))).current;

    // Animate open/close transitions
    useEffect(() => {
        const animations = projects.map((_, index) => {
            const toValue = index === openIndex ? 1 : 0;
            return Animated.timing(animationValues[index], {
                toValue,
                duration: 260,
                useNativeDriver: false,
            });
        });
        Animated.parallel(animations).start();
    }, [openIndex, projects]);

    // Handle screen size changes
    useEffect(() => {
        const handler = ({ window }: { window: { width: number } }) => {
            setScreenWidth(window.width);
        };
        const subscription = Dimensions.addEventListener('change', handler);
        return () => subscription?.remove();
    }, []);

    const getClosedIndex = (index: number) => {
        let count = 0;
        for (let i = 0; i < index; i++) if (i !== openIndex) count++;
        return count;
    };

    const folderPath = `
        M 0, ${FILE_HEIGHT - R}
        L 0, ${R}
        A ${R} ${R} 0 0 1 ${R}, 0
        L ${TAB_WIDTH - R}, 0
        A ${R} ${R} 0 0 1 ${TAB_WIDTH}, ${R}
        L ${TAB_WIDTH}, ${TAB_HEIGHT - R}
        L ${TAB_WIDTH}, ${TAB_HEIGHT}
        L ${FILE_WIDTH - R}, ${TAB_HEIGHT}
        A ${R} ${R} 0 0 1 ${FILE_WIDTH}, ${TAB_HEIGHT + R}
        L ${FILE_WIDTH}, ${FILE_HEIGHT - R}
        A ${R} ${R} 0 0 1 ${FILE_WIDTH - R}, ${FILE_HEIGHT}
        L ${R}, ${FILE_HEIGHT}
        A ${R} ${R} 0 0 1 0, ${FILE_HEIGHT - R}
        Z
    `;

    return (
        <View style={styles.container}>

            {/* Closed tabs stack on the left */}
            <View style={[styles.closedStack, { top: screenWidth > 600 ? -105 : -60 }]} pointerEvents="box-none">
                {projects.map((project, index) => {
                    if (index === openIndex) return null;
                    const closedIdx = getClosedIndex(index);
                    const closedLength = TAB_WIDTH * CLOSED_SCALE + 10;
                    const closedThickness = TAB_HEIGHT;
                    const fontSize = getFontSize(screenWidth, BASE_FONT_SIZE * CLOSED_FONT_SCALE) - 1;

                    return (
                        <TouchableOpacity
                            key={`closed-${index}`}
                            onPress={() => setOpenIndex(index)}
                            activeOpacity={0.8}
                            style={[
                                styles.closedTab,
                                {
                                    top: closedIdx * (closedLength + 12),
                                    width: closedThickness + 10,
                                    height: closedLength,
                                },
                            ]}
                        >
                            <View style={[styles.closedTextWrapper, { width: TAB_WIDTH * CLOSED_SCALE }]}>
                                <Text
                                    style={[styles.closedTabText, { fontSize }]}
                                    numberOfLines={1}
                                    ellipsizeMode="tail"
                                >
                                    {project.title}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    );
                })}
            </View>

            {/* Open file */}
            {projects.map((project, index) => {
                if (index !== openIndex) return null;
                const animValue = animationValues[index];

                const leftPosition = animValue.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-(FILE_WIDTH - TAB_HEIGHT), screenWidth - (screenWidth > 600 ? 100 : 30) - FILE_WIDTH],
                });

                const topPosition = animValue.interpolate({
                    inputRange: [0, 1],
                    outputRange: [60, 60],
                });

                const titleFontSize = getFontSize(screenWidth, BASE_FONT_SIZE * OPEN_FONT_SCALE);
                const bodyFontSize = getFontSize(screenWidth, 18);

                return (
                    <Animated.View
                        key={`open-${index}`}
                        style={[
                            styles.fileContainer,
                            {
                                width: FILE_WIDTH,
                                left: leftPosition,
                                top: topPosition,
                                transform: [{ scaleX: OPEN_SCALE }, { scaleY: OPEN_SCALE }],
                                zIndex: 1000,
                            },
                        ]}
                    >
                        <TouchableOpacity activeOpacity={1} style={styles.touchableContainer}>
                            <Svg width={FILE_WIDTH} height={FILE_HEIGHT} viewBox={`0 0 ${FILE_WIDTH} ${FILE_HEIGHT}`}>
                                {/* <Path d={folderPath} fill={colors.muted} stroke="#aaa" strokeWidth="2" /> */}
                                <Svg width={FILE_WIDTH} height={FILE_HEIGHT} viewBox={`0 0 ${FILE_WIDTH} ${FILE_HEIGHT}`}>
                                    {/* Outer glow layers - drawn first so they're behind the main shape */}
                                    <Path d={folderPath} fill="none" stroke={colors.text} strokeWidth="8" strokeOpacity="0.15" />
                                    <Path d={folderPath} fill="none" stroke={colors.text} strokeWidth="6" strokeOpacity="0.25" />
                                    <Path d={folderPath} fill="none" stroke={colors.text} strokeWidth="3" strokeOpacity="0.35" />

                                    {/* Main shape on top */}
                                    <Path
                                        d={folderPath}
                                        fill={colors.muted}
                                        stroke={colors.accentSoft}
                                        strokeWidth="2"
                                        strokeOpacity="0.5"
                                    />
                                </Svg>
                            </Svg>

                            {/* Title in the tab */}
                            <View style={[styles.tabLabelContainerOpen, { width: TAB_WIDTH }]}>
                                <Text
                                    style={[styles.tabTextBase, { fontSize: titleFontSize }]}
                                    numberOfLines={1}
                                    ellipsizeMode="tail"
                                >
                                    {project.title}
                                </Text>
                            </View>

                            {/* Content in the body */}
                            <View style={styles.bodyContent}>
                                <Text style={[styles.description, { fontSize: bodyFontSize }]}>
                                    {project.description}
                                </Text>
                                <Text style={[styles.tech, { fontSize: bodyFontSize - 2 }]}>
                                    {project.tech}
                                </Text>
                                {/* Links Section */}
                                <Text style={[styles.linksHeader, { fontSize: bodyFontSize - 1 }]}>
                                    Project Links:
                                </Text>

                                {/* GitHub Link */}
                                <Text style={[styles.linkText, { fontSize: bodyFontSize - 2 }]} onPress={() => project.gitHub !== 'N/A' && Linking.openURL(project.gitHub)} >
                                    {project.gitHub === 'N/A' ? '•  Review Github Upon Request' : '•  GitHub Repository'}
                                </Text>

                                {/* Publish Links (Web, App Store, Google Play) */}
                                {project.publish.web !== 'N/A' && (
                                    <Text style={[styles.linkText, { fontSize: bodyFontSize - 2 }]} onPress={() => Linking.openURL(project.publish.web)}>
                                        •  Website
                                    </Text>
                                )}

                                {project.publish.apple !== 'N/A' && (
                                    <Text style={[styles.linkText, { fontSize: bodyFontSize - 2 }]} onPress={() => Linking.openURL(project.publish.apple)}>
                                        •  App Store
                                    </Text>
                                )}

                                {project.publish.google !== 'N/A' && (
                                    <Text style={[styles.linkText, { fontSize: bodyFontSize - 2 }]} onPress={() => Linking.openURL(project.publish.google)}>
                                        •  Google Play
                                    </Text>
                                )}
                            </View>
                        </TouchableOpacity>
                    </Animated.View>
                );
            })}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
        position: 'relative',
    },
    fileContainer: {
        position: 'absolute',
        height: BASE_FILE_HEIGHT,
        marginBottom: 40,
    },
    touchableContainer: {
        width: '100%',
        height: '100%',
        // marginBottom: 40,
    },
    closedStack: {
        position: 'absolute',
        left: 0,
        width: 60, // enough space for rotated tabs
    },
    closedTab: {
        position: 'absolute',
        left: 0,
        backgroundColor: colors.muted,
        borderTopRightRadius: 8,
        borderBottomRightRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        // Add glow shadow
        shadowColor: colors.accent,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.4,
        shadowRadius: 10,
        elevation: 10, // Android glow
    },
    closedTabText: {
        color: colors.cardBorder,
        fontWeight: '700',
        transform: [{ rotate: '-90deg' }],
    },
    closedTextWrapper: {
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 2,
    },
    tabLabelContainerOpen: {
        position: 'absolute',
        top: 2,
        height: 50, // will be overridden by dynamic TAB_HEIGHT
        justifyContent: 'center',
        alignItems: 'center',
    },
    tabTextBase: {
        fontWeight: '700',
        color: colors.cardBorder,
        textAlign: 'center',
    },
    bodyContent: {
        position: 'absolute',
        top: 60, // will be adjusted by TAB_HEIGHT dynamically if needed
        paddingHorizontal: 18
    },
    description: {
        color: colors.cardBorder,
        lineHeight: 28,
        marginBottom: 20,
    },
    tech: {
        color: colors.cardBorder,
        fontStyle: 'italic',
        marginBottom: 20,
    },
    linksHeader: {
        color: colors.cardBorder,
        fontWeight: '600',
        fontSize: 18, // slightly larger for subheader feel
    },
    linkText: {
        color: colors.cardBorder,
        textDecorationLine: 'underline',
        marginBottom: 6,
        lineHeight: 22,
    },
});

export default FileCabinet;