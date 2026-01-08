import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, Animated, TouchableOpacity } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { colors } from '../colors';

const FILE_HEIGHT = 500;
const TAB_WIDTH = 200;
const TAB_HEIGHT = 50;
const R = 20; // corner radius
const CLOSED_GAP = 12; // gap between closed tabs (based on tab width)

interface Project {
    title: string;
    description: string;
    tech: string;
}

interface FileCabinetProps {
    projects: Project[];
}

const FileCabinet: React.FC<FileCabinetProps> = ({ projects }) => {
    const [openIndex, setOpenIndex] = useState(0);
    const [screenWidth, setScreenWidth] = useState(Dimensions.get('window').width);
    const FILE_WIDTH = screenWidth / 1.5;

    const CLOSED_SCALE = 0.8; // closed tabs 20% smaller
    const OPEN_SCALE = 1.05; // open slightly bigger
    const CLOSED_FONT_SCALE = 0.85; // closed font 15% smaller
    const OPEN_FONT_SCALE = 1.05; // open font 5% bigger

    const animationValues = useRef(projects.map(() => new Animated.Value(0))).current;

    useEffect(() => {
        // animate open/close for each file (0 -> closed, 1 -> open)
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

    useEffect(() => {
        const handler = ({ window }: { window: { width: number } }) => setScreenWidth(window.width);
        // Dimensions.addEventListener returns a subscription with remove() in modern RN
        const sub: any = (Dimensions as any).addEventListener ? (Dimensions as any).addEventListener('change', handler) : null;
        return () => {
            if (sub && typeof sub.remove === 'function') sub.remove();
            else if ((Dimensions as any).removeEventListener) (Dimensions as any).removeEventListener('change', handler);
        };
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

    // Render closed tabs (left stack), then the single open file on the right
    return (
        <View style={styles.container}>

            {/* Closed tabs stack */}
            <View style={styles.closedStack} pointerEvents="box-none">
                {projects.map((project, index) => {
                    if (index === openIndex) return null;
                    const closedIdx = getClosedIndex(index);
                    const closedLength = TAB_WIDTH * CLOSED_SCALE + 10;
                    const closedThickness = TAB_HEIGHT;
                    const fontSize = 20 * CLOSED_FONT_SCALE;

                    return (
                        <TouchableOpacity
                            key={`closed-${index}`}
                            onPress={() => setOpenIndex(index)}
                            activeOpacity={0.8}
                            style={[
                                styles.closedTab,
                                {
                                    top: closedIdx * (closedLength + CLOSED_GAP),
                                    width: closedThickness + 10,
                                    height: closedLength,
                                },
                            ]}
                        >
                            {/* Fixed: Proper container for rotated single-line text */}
                            <View style={styles.closedTextWrapper}>
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
                    outputRange: [-(FILE_WIDTH - TAB_HEIGHT), screenWidth - 80 - FILE_WIDTH],
                });

                const topPosition = animValue.interpolate({
                    inputRange: [0, 1],
                    outputRange: [60, 60],
                });

                const fontSize = 20 * OPEN_FONT_SCALE;

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
                                <Path d={folderPath} fill={colors.muted} stroke="#aaa" strokeWidth="2" />
                            </Svg>

                            {/* Title in the tab */}
                            <View style={[styles.tabLabelContainerOpen, { width: TAB_WIDTH }]}>
                                <Text style={[styles.tabTextBase, { fontSize }]} numberOfLines={1} ellipsizeMode="tail">
                                    {project.title}
                                </Text>
                            </View>

                            {/* Content in the body */}
                            <View style={styles.bodyContent}>
                                <Text style={styles.description}>{project.description}</Text>
                                <Text style={styles.tech}>{project.tech}</Text>
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
        height: FILE_HEIGHT,
    },
    touchableContainer: {
        width: '100%',
        height: '100%',
    },
    closedStack: {
        position: 'absolute',
        left: 0,
        top: 0,
        width: TAB_HEIGHT,
        // allow closed tabs to extend downwards
    },
    closedTab: {
        position: 'absolute',
        left: 0,
        backgroundColor: colors.muted,
        borderTopRightRadius: 8,
        borderBottomRightRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        // paddingHorizontal: 4,
    },
    closedTabText: {
        color: colors.cardBorder,
        fontWeight: '700',
        transform: [{ rotate: '-90deg' }],
    },
    closedTextWrapper: {
        width: TAB_WIDTH * 0.8,
        height: TAB_HEIGHT,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 8,
    },
    tabLabelContainerOpen: {
        position: 'absolute',
        top: 2,
        height: TAB_HEIGHT,
        justifyContent: 'center',
        alignItems: 'center',
    },
    tabTextBase: {
        fontWeight: '700',
        color: colors.cardBorder,
        textAlign: 'center',
    },
    tabText: {
        position: 'absolute',
        top: TAB_HEIGHT / 2 - 12,
        left: TAB_WIDTH / 2 - 60,
        fontSize: 20,
        fontWeight: '700',
        color: colors.cardBorder,
        maxWidth: TAB_WIDTH - 20,
    },
    bodyContent: {
        position: 'absolute',
        top: TAB_HEIGHT + 20,
        left: 30,
        right: 30,
    },
    description: {
        fontSize: 18,
        color: colors.cardBorder,
        lineHeight: 28,
        marginBottom: 20,
    },
    tech: {
        fontSize: 16,
        color: colors.cardBorder,
        fontStyle: 'italic',
    },
});

export default FileCabinet;