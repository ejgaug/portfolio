import React, { useEffect, useRef, useState } from 'react';
import {
    Animated,
    Dimensions,
    Easing,
    Linking,
    LayoutChangeEvent,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import Svg, { Defs, LinearGradient as SvgGradient, Rect, Stop } from 'react-native-svg';
import { colors } from '../colors';
import { projects, type Project } from '../projects';

import resumePdf from '../../assets/Eli-Gauger-Resume.pdf';

type SectionKey = 'hero' | 'about' | 'strengths' | 'projects' | 'contact';

const navItems: { key: SectionKey; label: string }[] = [
    { key: 'hero', label: 'Home' },
    { key: 'about', label: 'About' },
    // { key: 'strengths', label: 'Approach' },
    { key: 'projects', label: 'Projects' },
    { key: 'contact', label: 'Contact' },
];

const quickStats = [
    { value: '6', label: 'featured builds' },
    { value: '3', label: 'published mobile apps' },
    { value: 'Web + Mobile', label: 'product experience' },
    { value: 'Solo + Team', label: 'delivery experience' },
];

const heroTags = ['React', 'React Native', 'TypeScript', 'Expo', 'FastAPI', 'Firebase'];
const BALL_SPEED_MULTIPLIER = 0.9;
const BALL_DURATION_REDUCTION_MS = 1000;

const capabilityGroups = [
    {
        title: 'Frontend',
        items: ['React', 'TypeScript', 'JavaScript', 'HTML/CSS', 'Responsive UI'],
    },
    {
        title: 'Mobile',
        items: ['React Native', 'Expo', 'EAS', 'App Store deployment', 'Google Play deployment'],
    },
    {
        title: 'Backend & Data',
        items: ['Node.js', 'Express', 'FastAPI', 'Firebase', 'SQL', 'REST APIs'],
    },
    {
        title: 'Product Craft',
        items: ['UX/UI design', 'Figma', 'Accessibility', 'User testing', 'Analytics'],
    },
];

const workFocus = [
    'Polished interfaces that feel fast and intuitive on real devices',
    'Cross-platform React Native builds shipped from idea to store release',
    'Responsive web products with clear information architecture',
    'API integrations and feature work that support real user workflows',
];

const strengths = [
    {
        icon: 'dashboard',
        title: 'Clear product UI',
        description: 'I aim for interfaces with strong hierarchy, clean spacing, and fast comprehension.',
    },
    {
        icon: 'devices',
        title: 'Cross-platform execution',
        description: 'I can build across web and mobile, connect APIs, and carry features through release.',
    },
    {
        icon: 'groups',
        title: 'Team-ready mindset',
        description: 'I’m comfortable iterating with feedback, working in Agile teams, and shipping practical improvements.',
    },
];

const getColumns = (screenWidth: number) => {
    if (screenWidth >= 1180) return 2;
    return 1;
};

type ActionButtonProps = {
    icon: keyof typeof MaterialIcons.glyphMap;
    label: string;
    onPress: () => void;
    variant?: 'primary' | 'secondary';
};

function ActionButton({ icon, label, onPress, variant = 'primary' }: ActionButtonProps) {
    return (
        <TouchableOpacity
            activeOpacity={0.9}
            onPress={onPress}
            style={[styles.actionButton, variant === 'secondary' && styles.actionButtonSecondary]}
        >
            <MaterialIcons
                name={icon}
                size={18}
                color={variant === 'primary' ? colors.background : colors.text}
            />
            <Text style={[styles.actionButtonText, variant === 'secondary' && styles.actionButtonTextSecondary]}>
                {label}
            </Text>
        </TouchableOpacity>
    );
}

const openLink = (url?: string) => {
    if (url) {
        Linking.openURL(url);
    }
};

const resumeFaviconMarkup =
    `<svg width="256" height="256" viewBox="0 0 256 256" fill="none" xmlns="http://www.w3.org/2000/svg">` +
    `<defs><linearGradient id="egGradient" x1="40" y1="28" x2="220" y2="228" gradientUnits="userSpaceOnUse">` +
    `<stop offset="0" stop-color="#6ee7f9"/><stop offset="1" stop-color="#f8d76b"/>` +
    `</linearGradient></defs>` +
    `<rect width="256" height="256" rx="76" fill="url(#egGradient)"/>` +
    `<text x="128" y="136" text-anchor="middle" dominant-baseline="middle" fill="#07111d" font-family="Arial, Helvetica, sans-serif" font-size="108" font-weight="800" letter-spacing="-6">EG</text>` +
    `</svg>`;
const resumeFaviconHref = `data:image/svg+xml,${encodeURIComponent(resumeFaviconMarkup)}`;

const openResume = (url?: string) => {
    if (!url) {
        return;
    }

    if (Platform.OS !== 'web' || typeof window === 'undefined') {
        Linking.openURL(url);
        return;
    }

    const absoluteResumeUrl = (() => {
        try {
            return new URL(url, window.location.href).toString();
        } catch {
            return url;
        }
    })();

    const resumeHtml = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Eli Gauger Resume</title>
    <link rel="icon" type="image/svg+xml" href="${resumeFaviconHref}" />
    <style>
      html, body {
        margin: 0;
        width: 100%;
        height: 100%;
        background: #07111d;
      }
      iframe {
        border: 0;
        width: 100%;
        height: 100%;
        display: block;
        background: #07111d;
      }
    </style>
  </head>
  <body>
    <iframe title="Eli Gauger Resume" src="${absoluteResumeUrl}"></iframe>
  </body>
</html>`;

    const resumeBlob = new Blob([resumeHtml], { type: 'text/html' });
    const resumeBlobUrl = window.URL.createObjectURL(resumeBlob);
    const resumeWindow = window.open(resumeBlobUrl, '_blank');

    if (!resumeWindow) {
        window.URL.revokeObjectURL(resumeBlobUrl);
        Linking.openURL(absoluteResumeUrl);
        return;
    }

    window.setTimeout(() => {
        window.URL.revokeObjectURL(resumeBlobUrl);
    }, 60000);
};

type BouncingBallProps = {
    size: number;
    startX: number;
    drift: number;
    stageHeight: number;
    colorSet: [string, string];
    duration: number;
    phase: number;
    bounceCount: number;
    isActive: boolean;
    opacity?: number;
};

function BouncingBall({
    size,
    startX,
    drift,
    stageHeight,
    colorSet,
    duration,
    phase,
    bounceCount,
    isActive,
    opacity = 1,
}: BouncingBallProps) {
    const progress = useRef(new Animated.Value(0)).current;
    const adjustedDuration = Math.max(duration / BALL_SPEED_MULTIPLIER - BALL_DURATION_REDUCTION_MS, 600);

    useEffect(() => {
        if (!isActive) {
            progress.stopAnimation();
            progress.setValue(0);
            return;
        }

        progress.stopAnimation();
        progress.setValue(0);

        const loop = Animated.loop(
            Animated.timing(progress, {
                toValue: 1,
                duration: adjustedDuration,
                easing: Easing.linear,
                useNativeDriver: true,
            })
        );

        loop.start();

        return () => {
            loop.stop();
        };
    }, [adjustedDuration, isActive, progress, stageHeight]);

    const topInset = 18;
    const floor = Math.max(stageHeight - size - 22, topInset);
    const amplitude = Math.max(floor - topInset, size * 1.2);
    const sampleCount = 48;
    const pathInputRange = Array.from({ length: sampleCount + 1 }, (_, index) => index / sampleCount);
    const decelSampleCount = 120;
    const decelInputRange = Array.from({ length: decelSampleCount + 1 }, (_, index) => index / decelSampleCount);
    const speedWeights = decelInputRange.map((normalizedTime) => {
        const seconds = (normalizedTime * adjustedDuration) / 1000;
        const twoSecondUnits = seconds / 2;
        const slowdownPercent = Math.max(Math.pow(3, twoSecondUnits) - 1, 0);
        return Math.max(1 - slowdownPercent / 100, 0.025);
    });
    const cumulativeWeights: number[] = [];
    let runningTotal = 0;

    speedWeights.forEach((weight) => {
        runningTotal += weight;
        cumulativeWeights.push(runningTotal);
    });

    const totalWeight = cumulativeWeights[cumulativeWeights.length - 1] || 1;
    const progressMap = progress.interpolate({
        inputRange: decelInputRange,
        outputRange: cumulativeWeights.map((value) => value / totalWeight),
    });

    const outputRangeY = pathInputRange.map((t) => {
        const wave = Math.abs(Math.sin((t + phase) * Math.PI * bounceCount));
        const lift = Math.pow(wave, 1.7);
        return floor - amplitude * lift;
    });
    const outputRangeX = pathInputRange.map((t) => {
        const sway = Math.sin((t + phase) * Math.PI * 1.35);
        return drift * sway;
    });

    const translateY = progressMap.interpolate({ inputRange: pathInputRange, outputRange: outputRangeY });
    const translateX = progressMap.interpolate({ inputRange: pathInputRange, outputRange: outputRangeX });

    return (
        <Animated.View
            pointerEvents="none"
            style={[
                styles.ballWrap,
                {
                    width: size,
                    height: size,
                    left: startX,
                    opacity,
                    transform: [{ translateX }, { translateY }],
                },
            ]}
        >
            <LinearGradient
                colors={colorSet}
                start={{ x: 0.15, y: 0.1 }}
                end={{ x: 0.9, y: 0.95 }}
                style={[styles.ballGradient, { width: size, height: size, borderRadius: size / 2 }]}
            >
                <View style={styles.ballHighlight} />
            </LinearGradient>
        </Animated.View>
    );
}

type ProjectCardProps = {
    project: Project;
    featured?: boolean;
    compact?: boolean;
    borderProgress: number;
};

function ProjectBorderAccent({ progress }: { progress: number }) {
    const [size, setSize] = useState({ width: 0, height: 0 });

    const handleLayout = (event: LayoutChangeEvent) => {
        const { width, height } = event.nativeEvent.layout;
        setSize({ width, height });
    };

    const radius = 26;
    const inset = 1.5;
    const width = Math.max(size.width - inset * 2, 0);
    const height = Math.max(size.height - inset * 2, 0);
    const perimeter = width > 0 && height > 0
        ? 2 * (width + height - 4 * radius) + 2 * Math.PI * radius
        : 0;
    const accentLength = perimeter ? Math.min(Math.max(perimeter * 0.16, 88), perimeter * 0.28) : 0;
    const normalizedProgress = ((progress % 1) + 1) % 1;
    const strokeDashoffset = perimeter ? perimeter - normalizedProgress * perimeter : 0;

    return (
        <View pointerEvents="none" style={StyleSheet.absoluteFill} onLayout={handleLayout}>
            {width > 0 && height > 0 && (
                <Svg width={size.width} height={size.height} style={styles.projectAccentSvg}>
                    <Defs>
                        <SvgGradient id="projectAccentGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <Stop offset="0%" stopColor={colors.accent} stopOpacity="0.18" />
                            <Stop offset="50%" stopColor={colors.accent} stopOpacity="0.85" />
                            <Stop offset="100%" stopColor={colors.accentSoft} stopOpacity="0.25" />
                        </SvgGradient>
                    </Defs>
                    <Rect
                        x={inset}
                        y={inset}
                        width={width}
                        height={height}
                        rx={radius}
                        ry={radius}
                        fill="none"
                        stroke="url(#projectAccentGradient)"
                        strokeWidth={1.6}
                        strokeLinecap="round"
                        strokeDasharray={`${accentLength} ${Math.max(perimeter - accentLength, 1)}`}
                        strokeDashoffset={strokeDashoffset}
                    />
                </Svg>
            )}
        </View>
    );
}

function ProjectCard({ project, featured = false, compact = false, borderProgress }: ProjectCardProps) {
    return (
        <View
            style={[
                styles.projectCard,
                featured && styles.projectCardFeatured,
                !featured && !compact && styles.projectCardGrid,
                compact && styles.projectCardCompact,
            ]}
        >
            <ProjectBorderAccent progress={borderProgress} />
            <View style={styles.projectHeader}>
                <Text style={styles.projectEyebrow}>{project.eyebrow}</Text>
                <Text style={styles.projectTitle}>{project.title}</Text>
                <Text style={styles.projectTagline}>{project.tagline}</Text>
            </View>

            <View style={styles.roleRow}>
                <MaterialIcons name="person-outline" size={16} color={colors.accent} />
                <Text style={styles.roleText}>{project.role}</Text>
            </View>

            <Text style={styles.projectSummary}>{project.summary}</Text>

            <View style={styles.highlightsBlock}>
                {project.highlights.map((highlight) => (
                    <View key={highlight} style={styles.highlightRow}>
                        <View style={styles.highlightDot} />
                        <Text style={styles.highlightText}>{highlight}</Text>
                    </View>
                ))}
            </View>

            <View style={styles.techWrap}>
                {project.stack.map((item) => (
                    <View key={item} style={styles.techPill}>
                        <Text style={styles.techPillText}>{item}</Text>
                    </View>
                ))}
            </View>

            <View style={styles.linkRow}>
                {project.links.website && (
                    <TouchableOpacity activeOpacity={0.85} onPress={() => openLink(project.links.website)} style={styles.linkPill}>
                        <MaterialIcons name="open-in-new" size={16} color={colors.text} />
                        <Text style={styles.linkPillText}>Live Site</Text>
                    </TouchableOpacity>
                )}
                {project.links.github && (
                    <TouchableOpacity activeOpacity={0.85} onPress={() => openLink(project.links.github)} style={styles.linkPill}>
                        <MaterialIcons name="code" size={16} color={colors.text} />
                        <Text style={styles.linkPillText}>GitHub</Text>
                    </TouchableOpacity>
                )}
                {project.links.appStore && (
                    <TouchableOpacity activeOpacity={0.85} onPress={() => openLink(project.links.appStore)} style={styles.linkPill}>
                        <MaterialIcons name="phone-iphone" size={16} color={colors.text} />
                        <Text style={styles.linkPillText}>App Store</Text>
                    </TouchableOpacity>
                )}
                {project.links.googlePlay && (
                    <TouchableOpacity activeOpacity={0.85} onPress={() => openLink(project.links.googlePlay)} style={styles.linkPill}>
                        <MaterialIcons name="android" size={16} color={colors.text} />
                        <Text style={styles.linkPillText}>Google Play</Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
}

export default function HomeScreen() {
    const scrollViewRef = useRef<ScrollView>(null);
    const sectionOffsets = useRef<Record<SectionKey, number>>({
        hero: 0,
        about: 0,
        strengths: 0,
        projects: 0,
        contact: 0,
    });
    const [screenWidth, setScreenWidth] = useState(Dimensions.get('window').width);
    const [screenHeight, setScreenHeight] = useState(Dimensions.get('window').height);
    const [navHeight, setNavHeight] = useState(84);
    const [heroHeight, setHeroHeight] = useState(Math.max(Dimensions.get('window').height * 0.72, 520));
    const [activeSection, setActiveSection] = useState<SectionKey>('hero');
    const [ballsActivated, setBallsActivated] = useState(false);
    const [scrollProgress, setScrollProgress] = useState(0);
    const [projectBorderProgress, setProjectBorderProgress] = useState(0);

    useEffect(() => {
        const subscription = Dimensions.addEventListener('change', ({ window }) => {
            setScreenWidth(window.width);
            setScreenHeight(window.height);
        });

        return () => subscription?.remove();
    }, []);

    const columns = getColumns(screenWidth);
    const heroPadding = screenWidth >= 1000 ? 72 : 28;
    const isWide = screenWidth >= 960;
    const resumeUrl = typeof resumePdf === 'string' ? resumePdf : undefined;
    const heroTitleSize = screenWidth >= 1000 ? 54 : screenWidth >= 680 ? 46 : 36;
    const heroTitleLineHeight = screenWidth >= 1000 ? 62 : screenWidth >= 680 ? 54 : 44;
    const sectionTitleSize = screenWidth >= 680 ? 40 : 32;
    const sectionTitleLineHeight = screenWidth >= 680 ? 48 : 38;
    const footerTitleSize = screenWidth >= 680 ? 34 : 28;
    const footerTitleLineHeight = screenWidth >= 680 ? 42 : 36;
    const navVertical = screenWidth < 760;
    const isPhone = screenWidth < 520;
    const heroTopPadding = Math.round((screenWidth >= 1000 ? 56 : 36) * 0.8);
    const heroStageHeight = Math.max(navHeight + heroHeight, screenHeight);

    const handleSectionLayout = (key: SectionKey) => (event: { nativeEvent: { layout: { y: number; height: number } } }) => {
        sectionOffsets.current[key] = event.nativeEvent.layout.y;

        if (key === 'hero') {
            setHeroHeight(event.nativeEvent.layout.height);
        }
    };

    const scrollToSection = (key: SectionKey) => {
        const y = sectionOffsets.current[key] ?? 0;
        scrollViewRef.current?.scrollTo({ y: Math.max(y - 82, 0), animated: true });
        setActiveSection(key);
    };

    const handleScroll = (event: { nativeEvent: { contentOffset: { y: number }; layoutMeasurement: { height: number }; contentSize: { height: number } } }) => {
        const scrollY = event.nativeEvent.contentOffset.y;
        if (!ballsActivated && scrollY > 4) {
            setBallsActivated(true);
        }
        const viewportHeight = event.nativeEvent.layoutMeasurement.height;
        const contentHeight = event.nativeEvent.contentSize.height;
        const currentY = scrollY + 140;
        const viewportBottom = scrollY + viewportHeight;
        const contactThreshold = Math.min(viewportHeight * 0.22, 140);
        const isContactVisible =
            sectionOffsets.current.contact <= viewportBottom - contactThreshold ||
            scrollY + viewportHeight >= contentHeight - 24;

        const maxScroll = Math.max(contentHeight - viewportHeight, 1);
        setScrollProgress(Math.min(Math.max(scrollY / maxScroll, 0), 1));

        const projectsStart = Math.max(sectionOffsets.current.projects - viewportHeight * 0.95, 0);
        const projectsEnd = Math.max(sectionOffsets.current.contact - viewportHeight * 0.2, projectsStart + 1);
        const projectProgress = Math.min(
            Math.max((scrollY - projectsStart) / (projectsEnd - projectsStart), 0),
            1
        );
        setProjectBorderProgress(projectProgress);

        if (isContactVisible) {
            if (activeSection !== 'contact') {
                setActiveSection('contact');
            }
            return;
        }

        const nextActive = navItems.reduce<SectionKey>((selected, item) => {
            if (sectionOffsets.current[item.key] <= currentY) {
                return item.key;
            }
            return selected;
        }, 'hero');

        if (nextActive !== activeSection) {
            setActiveSection(nextActive);
        }
    };

    return (
        <View style={styles.pageShell}>
            <View pointerEvents="none" style={[styles.backgroundLayer, { height: heroStageHeight }]}>
                <LinearGradient
                    colors={['#06111c', '#0a1726', '#0f2136']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={StyleSheet.absoluteFill}
                />
                <LinearGradient
                    colors={['rgba(255, 255, 255, 0)', 'rgba(110, 231, 249, 0.035)', 'rgba(110, 231, 249, 0.075)']}
                    locations={[0.35, 0.72, 1]}
                    start={{ x: 0, y: 0.5 }}
                    end={{ x: 1, y: 0.5 }}
                    style={StyleSheet.absoluteFill}
                />
                <BouncingBall
                    size={screenWidth < 700 ? 74 : 92}
                    startX={screenWidth < 700 ? 16 : 28}
                    drift={screenWidth < 700 ? 78 : 112}
                    stageHeight={heroStageHeight}
                    colorSet={['rgba(110, 231, 249, 0.95)', 'rgba(63, 164, 255, 0.78)']}
                    duration={5200}
                    phase={0.18}
                    bounceCount={2.45}
                    isActive={ballsActivated}
                    opacity={0.7}
                />
                <BouncingBall
                    size={screenWidth < 700 ? 56 : 72}
                    startX={screenWidth < 700 ? screenWidth * 0.24 : screenWidth * 0.2}
                    drift={screenWidth < 700 ? 64 : 92}
                    stageHeight={heroStageHeight}
                    colorSet={['rgba(248, 215, 107, 0.84)', 'rgba(110, 231, 249, 0.52)']}
                    duration={4700}
                    phase={0.31}
                    bounceCount={2.82}
                    isActive={ballsActivated}
                    opacity={0.48}
                />
                <BouncingBall
                    size={screenWidth < 700 ? 44 : 58}
                    startX={screenWidth < 700 ? screenWidth * 0.42 : screenWidth * 0.38}
                    drift={screenWidth < 700 ? 52 : 76}
                    stageHeight={heroStageHeight}
                    colorSet={['rgba(110, 231, 249, 0.72)', 'rgba(255, 255, 255, 0.18)']}
                    duration={4300}
                    phase={0.42}
                    bounceCount={3.1}
                    isActive={ballsActivated}
                    opacity={0.38}
                />
                <BouncingBall
                    size={screenWidth < 700 ? 38 : 48}
                    startX={screenWidth < 700 ? screenWidth * 0.58 : screenWidth * 0.54}
                    drift={screenWidth < 700 ? 46 : 62}
                    stageHeight={heroStageHeight}
                    colorSet={['rgba(248, 215, 107, 0.62)', 'rgba(110, 231, 249, 0.24)']}
                    duration={5600}
                    phase={0.56}
                    bounceCount={2.36}
                    isActive={ballsActivated}
                    opacity={0.28}
                />
                <BouncingBall
                    size={screenWidth < 700 ? 30 : 40}
                    startX={screenWidth < 700 ? screenWidth * 0.74 : screenWidth * 0.7}
                    drift={screenWidth < 700 ? 38 : 54}
                    stageHeight={heroStageHeight}
                    colorSet={['rgba(110, 231, 249, 0.52)', 'rgba(63, 164, 255, 0.18)']}
                    duration={3900}
                    phase={0.68}
                    bounceCount={3.45}
                    isActive={ballsActivated}
                    opacity={0.24}
                />
                <BouncingBall
                    size={screenWidth < 700 ? 34 : 46}
                    startX={screenWidth < 700 ? screenWidth * 0.86 : screenWidth * 0.82}
                    drift={screenWidth < 700 ? 32 : 44}
                    stageHeight={heroStageHeight}
                    colorSet={['rgba(248, 215, 107, 0.54)', 'rgba(255, 255, 255, 0.14)']}
                    duration={5050}
                    phase={0.84}
                    bounceCount={2.7}
                    isActive={ballsActivated}
                    opacity={0.2}
                />
                <BouncingBall
                    size={screenWidth < 700 ? 24 : 34}
                    startX={screenWidth < 700 ? screenWidth * 0.66 : screenWidth * 0.9}
                    drift={screenWidth < 700 ? 24 : 36}
                    stageHeight={heroStageHeight}
                    colorSet={['rgba(110, 231, 249, 0.44)', 'rgba(63, 164, 255, 0.12)']}
                    duration={3600}
                    phase={0.08}
                    bounceCount={3.7}
                    isActive={ballsActivated}
                    opacity={0.18}
                />
            </View>

            <ScrollView
                ref={scrollViewRef}
                stickyHeaderIndices={[0]}
                style={styles.scrollContainer}
                contentContainerStyle={styles.contentContainer}
                onScroll={handleScroll}
                scrollEventThrottle={16}
                showsVerticalScrollIndicator={false}
            >
                <View onLayout={(event) => setNavHeight(event.nativeEvent.layout.height)} style={[styles.navShell, { paddingHorizontal: heroPadding }]}>
                    <View style={[styles.navBar, navVertical && styles.navBarStacked, isPhone && styles.navBarPhone]}>
                        <View style={styles.progressTrack}>
                            <View
                                style={[
                                    styles.progressGlow,
                                    {
                                        width: `${scrollProgress * 100}%`,
                                        opacity: scrollProgress > 0 ? 1 : 0,
                                    },
                                ]}
                            />
                            <View style={[styles.progressFill, { width: `${scrollProgress * 100}%` }]} />
                        </View>
                        <TouchableOpacity activeOpacity={0.85} onPress={() => scrollToSection('hero')} style={styles.brandPill}>
                            <Text style={styles.brandInitials}>EG</Text>
                            <Text style={styles.brandText}>Portfolio</Text>
                        </TouchableOpacity>

                        <View style={[styles.navItemsRow, navVertical && styles.navItemsRowStacked, isPhone && styles.navItemsRowPhone]}>
                            {navItems.map((item) => (
                                <TouchableOpacity
                                    key={item.key}
                                    activeOpacity={0.85}
                                    onPress={() => scrollToSection(item.key)}
                                    style={[styles.navItem, isPhone && styles.navItemPhone, activeSection === item.key && styles.navItemActive]}
                                >
                                    <Text style={[styles.navItemText, isPhone && styles.navItemTextPhone, activeSection === item.key && styles.navItemTextActive]}>
                                        {item.label}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                </View>

                <LinearGradient
                    onLayout={handleSectionLayout('hero')}
                    colors={['rgba(7, 17, 29, 0)', 'rgba(7, 17, 29, 0)', 'rgba(7, 17, 29, 0)']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={[styles.heroSection, { paddingHorizontal: heroPadding, paddingTop: heroTopPadding }]}
                >
                <View style={[styles.heroGrid, !isWide && styles.heroGridStacked]}>
                    <View style={styles.heroCopy}>
                        <View style={styles.badgeRow}>
                            <MaterialIcons name="verified" size={16} color={colors.accent} />
                            <Text style={styles.badgeText}>Frontend Mobile and Web Developer</Text>
                        </View>

                        <Text style={[styles.heroTitle, { fontSize: heroTitleSize, lineHeight: heroTitleLineHeight }]}>
                            I build polished React and React Native products that are intuitive, fast, and ready for real users.
                        </Text>
                        <Text style={styles.heroSubtitle}>
                            My work spans responsive web apps, cross-platform mobile releases, and product-focused UI that turns complex ideas into experiences people can actually use.
                        </Text>

                        <View style={[styles.heroActions, isPhone && styles.heroActionsPhone]}>
                            <ActionButton icon="description" label="View Resume" onPress={() => openResume(resumeUrl)} />
                            <ActionButton icon="mail-outline" label="Email Me" onPress={() => Linking.openURL('mailto:elijgauger@gmail.com')} variant="secondary" />
                            <ActionButton icon="launch" label="LinkedIn" onPress={() => Linking.openURL('https://www.linkedin.com/in/eli-gauger/')} variant="secondary" />
                            <ActionButton icon="code" label="GitHub" onPress={() => Linking.openURL('https://github.com/ejgaug')} variant="secondary" />
                        </View>

                        <View style={styles.statsRow}>
                            {quickStats.map((stat) => (
                                <View key={stat.label} style={[styles.statCard, isPhone && styles.statCardPhone]}>
                                    <Text style={styles.statValue}>{stat.value}</Text>
                                    <Text style={styles.statLabel}>{stat.label}</Text>
                                </View>
                            ))}
                        </View>
                    </View>

                    <View style={styles.heroPanel}>
                        <View style={[styles.identityCard, isPhone && styles.identityCardPhone]}>
                            <LinearGradient
                                colors={[colors.accent, colors.accentWarm]}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                                style={styles.identityAvatar}
                            >
                                <Text style={styles.identityInitials}>EG</Text>
                            </LinearGradient>

                            <View style={styles.identityTextWrap}>
                                <Text style={styles.identityName}>Eli Gauger</Text>
                                <Text style={styles.identityRoleLine}>Frontend • React Native • TypeScript</Text>
                            </View>
                        </View>

                        <View style={styles.heroTagWrap}>
                            {heroTags.map((tag) => (
                                <View key={tag} style={styles.heroTag}>
                                    <Text style={styles.heroTagText}>{tag}</Text>
                                </View>
                            ))}
                        </View>

                        {/* <Text style={styles.panelEyebrow}>Why this portfolio exists</Text> */}
                        <Text style={styles.panelTitle}>I’m looking for a role where I can ship thoughtful product work from day one.</Text>
                        <Text style={styles.panelBody}>
                            I bring hands-on experience with React, React Native, TypeScript, API integration, deployment workflows, and the kind of product polish that makes software feel trustworthy.
                        </Text>

                        <View style={styles.focusList}>
                            {workFocus.map((item) => (
                                <View key={item} style={styles.focusRow}>
                                    <MaterialIcons name="arrow-forward" size={16} color={colors.accent} />
                                    <Text style={styles.focusText}>{item}</Text>
                                </View>
                            ))}
                        </View>

                        <View style={styles.contactPanel}>
                            <View style={styles.contactRow}>
                                <MaterialIcons name="location-on" size={16} color={colors.accent} />
                                <Text style={styles.contactPanelText}>Milwaukee, Wisconsin</Text>
                            </View>
                            <View style={styles.contactRow}>
                                <MaterialIcons name="mail-outline" size={16} color={colors.accent} />
                                <Text style={styles.contactPanelText}>elijgauger@gmail.com</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </LinearGradient>

            <View onLayout={handleSectionLayout('about')} style={[styles.section, { paddingHorizontal: heroPadding }]}>
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionEyebrow}>About</Text>
                    <Text style={[styles.sectionTitle, { fontSize: sectionTitleSize, lineHeight: sectionTitleLineHeight }]}>
                        Product-minded engineering with a strong UI instinct.
                    </Text>
                    <Text style={styles.sectionBody}>
                        I care about making software feel useful quickly. That means clean structure, responsive design, thoughtful interaction details, and enough technical depth to ship features all the way through. I’ve worked on solo projects and team builds across mobile and web, with experience spanning deployment, analytics, backend integration, AI-assisted features, and iterative product design.
                    </Text>
                </View>

                <View style={[styles.capabilityGrid, columns === 1 && styles.capabilityGridSingle]}>
                    {capabilityGroups.map((group) => (
                        <View key={group.title} style={styles.capabilityCard}>
                            <Text style={styles.capabilityTitle}>{group.title}</Text>
                            {group.items.map((item) => (
                                <View key={item} style={styles.capabilityItemRow}>
                                    <View style={styles.capabilityDot} />
                                    <Text style={styles.capabilityItem}>{item}</Text>
                                </View>
                            ))}
                        </View>
                    ))}
                </View>
            </View>

            {/* <View onLayout={handleSectionLayout('strengths')} style={[styles.section, styles.strengthsSection, { paddingHorizontal: heroPadding }]}>
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionEyebrow}>How I Work</Text>
                    <Text style={[styles.sectionTitle, { fontSize: sectionTitleSize, lineHeight: sectionTitleLineHeight }]}>
                        Strong visual polish is most useful when it supports real product decisions.
                    </Text>
                    <Text style={styles.sectionBody}>
                        The portfolios you shared do a great job of feeling intentional. I pulled that energy into this site through clearer navigation, stronger visual grouping, and more distinctive presentation while keeping everything grounded in your actual experience.
                    </Text>
                </View>

                <View style={[styles.strengthGrid, columns === 1 && styles.strengthGridSingle]}>
                    {strengths.map((item) => (
                        <View key={item.title} style={styles.strengthCard}>
                            <View style={styles.strengthIconWrap}>
                                <MaterialIcons name={item.icon as keyof typeof MaterialIcons.glyphMap} size={22} color={colors.background} />
                            </View>
                            <Text style={styles.strengthTitle}>{item.title}</Text>
                            <Text style={styles.strengthBody}>{item.description}</Text>
                        </View>
                    ))}
                </View>
            </View> */}

            <LinearGradient
                onLayout={handleSectionLayout('projects')}
                colors={[colors.background, colors.surfaceAlt]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[styles.section, styles.projectsSection, { paddingHorizontal: heroPadding }]}
            >
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionEyebrow}>Selected Work</Text>
                    <Text style={[styles.sectionTitle, { fontSize: sectionTitleSize, lineHeight: sectionTitleLineHeight }]}>
                        Projects that show how I think, build, and ship.
                    </Text>
                    <Text style={styles.sectionBody}>
                        Each project below represents something I can bring to a team: strong UX instincts, practical engineering decisions, and the ability to take a product from concept to a working experience.
                    </Text>
                </View>

                <ProjectCard project={projects[0]} featured borderProgress={projectBorderProgress} />

                <View style={[styles.projectGrid, columns === 1 && styles.projectGridSingle]}>
                    {projects.slice(1).map((project, index) => (
                        <ProjectCard
                            key={project.title}
                            project={project}
                            compact={columns === 1}
                            borderProgress={(projectBorderProgress + index * 0.08) % 1}
                        />
                    ))}
                </View>
            </LinearGradient>

                <View onLayout={handleSectionLayout('contact')} style={[styles.section, styles.footerSection, { paddingHorizontal: heroPadding }]}>
                <Text style={styles.sectionEyebrow}>Let’s Connect</Text>
                <Text style={[styles.footerTitle, { fontSize: footerTitleSize, lineHeight: footerTitleLineHeight }]}>
                    Need a frontend developer who is passionate about creating intuitive, ready to ship applications? Let’s talk.
                </Text>
                <Text style={styles.footerBody}>
                    I’m especially interested in entry-level software engineering, frontend, and React Native roles where I can contribute quickly and keep growing on a strong team.
                </Text>

                <View style={[styles.heroActions, isPhone && styles.heroActionsPhone]}>
                    <ActionButton icon="mail-outline" label="Start a Conversation" onPress={() => Linking.openURL('mailto:elijgauger@gmail.com')} />
                    <ActionButton icon="description" label="Open Resume" onPress={() => openResume(resumeUrl)} variant="secondary" />
                </View>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    pageShell: {
        flex: 1,
        backgroundColor: colors.background,
    },
    backgroundLayer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        overflow: 'hidden',
    },
    ballWrap: {
        position: 'absolute',
        top: 0,
    },
    ballGradient: {
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        shadowColor: colors.accent,
        shadowOpacity: 0.42,
        shadowRadius: 24,
        shadowOffset: { width: 0, height: 0 },
    },
    ballHighlight: {
        width: '36%',
        height: '36%',
        marginTop: '16%',
        marginLeft: '16%',
        borderRadius: 999,
        backgroundColor: 'rgba(255, 255, 255, 0.26)',
    },
    scrollContainer: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    contentContainer: {
        paddingBottom: 72,
    },
    navShell: {
        paddingTop: 18,
        backgroundColor: 'transparent',
    },
    navBar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 16,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: colors.borderSoft,
        borderRadius: 999,
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: colors.navBar,
    },
    navBarStacked: {
        borderRadius: 24,
        alignItems: 'flex-start',
    },
    navBarPhone: {
        paddingHorizontal: 12,
        paddingVertical: 10,
        gap: 12,
    },
    progressTrack: {
        position: 'absolute',
        left: 16,
        right: 16,
        bottom: 5,
        height: 3,
        borderRadius: 999,
        backgroundColor: 'rgba(110, 231, 249, 0.06)',
        overflow: 'visible',
    },
    progressGlow: {
        position: 'absolute',
        left: 0,
        top: -1,
        height: 5,
        borderRadius: 999,
        backgroundColor: 'rgba(110, 231, 249, 0.16)',
        shadowColor: colors.accent,
        shadowOpacity: 0.4,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 0 },
    },
    progressFill: {
        position: 'absolute',
        left: 0,
        top: 0,
        height: 3,
        borderRadius: 999,
        backgroundColor: 'rgba(110, 231, 249, 0.72)',
    },
    brandPill: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    brandInitials: {
        color: colors.background,
        fontSize: 14,
        fontWeight: '800',
        backgroundColor: colors.accent,
        paddingHorizontal: 10,
        paddingVertical: 7,
        borderRadius: 999,
        overflow: 'hidden',
    },
    brandText: {
        color: colors.text,
        fontSize: 15,
        fontWeight: '700',
    },
    navItemsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 10,
    },
    navItemsRowStacked: {
        width: '100%',
    },
    navItemsRowPhone: {
        gap: 8,
    },
    navItem: {
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 999,
    },
    navItemPhone: {
        paddingHorizontal: 12,
        paddingVertical: 7,
    },
    navItemActive: {
        backgroundColor: colors.surfaceAlt2,
    },
    navItemText: {
        color: colors.textMuted,
        fontSize: 14,
        fontWeight: '600',
    },
    navItemTextPhone: {
        fontSize: 13,
    },
    navItemTextActive: {
        color: colors.text,
    },
    heroSection: {
        overflow: 'hidden',
        paddingBottom: 85,
    },
    heroGrid: {
        flexDirection: 'row',
        gap: 28,
        alignItems: 'stretch',
        justifyContent: 'space-between',
    },
    heroGridStacked: {
        flexDirection: 'column',
    },
    heroCopy: {
        flex: 1.3,
    },
    heroPanel: {
        flex: 0.9,
        backgroundColor: colors.panel,
        borderWidth: 1,
        borderColor: colors.borderSoft,
        borderRadius: 24,
        padding: 24,
    },
    identityCard: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        marginBottom: 18,
    },
    identityCardPhone: {
        alignItems: 'flex-start',
    },
    identityAvatar: {
        width: 72,
        height: 72,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
    identityInitials: {
        color: colors.background,
        fontSize: 28,
        fontWeight: '800',
    },
    identityTextWrap: {
        flex: 1,
    },
    identityName: {
        color: colors.text,
        fontSize: 20,
        fontWeight: '700',
        marginBottom: 4,
    },
    identityRoleLine: {
        color: colors.textMuted,
        fontSize: 14,
        lineHeight: 22,
    },
    heroTagWrap: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginBottom: 22,
    },
    heroTag: {
        borderRadius: 999,
        paddingHorizontal: 10,
        paddingVertical: 7,
        backgroundColor: colors.surfaceAlt2,
        borderWidth: 1,
        borderColor: colors.borderSoft,
    },
    heroTagText: {
        color: colors.text,
        fontSize: 12,
        fontWeight: '700',
    },
    badgeRow: {
        alignSelf: 'flex-start',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 999,
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: colors.panel,
        marginBottom: 24,
    },
    badgeText: {
        color: colors.text,
        fontSize: 14,
        fontWeight: '600',
    },
    heroTitle: {
        color: colors.text,
        fontSize: 54,
        lineHeight: 62,
        fontWeight: '700',
        maxWidth: 760,
    },
    heroSubtitle: {
        color: colors.textMuted,
        fontSize: 19,
        lineHeight: 31,
        marginTop: 20,
        maxWidth: 760,
    },
    heroActions: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        marginTop: 28,
    },
    heroActionsPhone: {
        flexDirection: 'column',
        alignItems: 'stretch',
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        borderRadius: 999,
        paddingHorizontal: 18,
        paddingVertical: 12,
        backgroundColor: colors.accent,
    },
    actionButtonSecondary: {
        backgroundColor: colors.panel,
        borderWidth: 1,
        borderColor: colors.border,
    },
    actionButtonText: {
        color: colors.background,
        fontSize: 15,
        fontWeight: '700',
    },
    actionButtonTextSecondary: {
        color: colors.text,
    },
    statsRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 14,
        marginTop: 30,
    },
    statCard: {
        minWidth: 150,
        borderRadius: 20,
        paddingHorizontal: 18,
        paddingVertical: 18,
        backgroundColor: colors.panel,
        borderWidth: 1,
        borderColor: colors.border,
    },
    statCardPhone: {
        minWidth: '100%',
    },
    statValue: {
        color: colors.text,
        fontSize: 28,
        fontWeight: '700',
        marginBottom: 6,
    },
    statLabel: {
        color: colors.textMuted,
        fontSize: 14,
        lineHeight: 20,
    },
    panelEyebrow: {
        color: colors.accent,
        textTransform: 'uppercase',
        letterSpacing: 1.2,
        fontSize: 12,
        fontWeight: '700',
        marginBottom: 12,
    },
    panelTitle: {
        color: colors.text,
        fontSize: 28,
        lineHeight: 36,
        fontWeight: '700',
        marginBottom: 14,
    },
    panelBody: {
        color: colors.textMuted,
        fontSize: 16,
        lineHeight: 27,
        marginBottom: 18,
    },
    focusList: {
        gap: 12,
    },
    focusRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 10,
    },
    focusText: {
        color: colors.text,
        flex: 1,
        fontSize: 15,
        lineHeight: 24,
    },
    contactPanel: {
        marginTop: 24,
        paddingTop: 18,
        borderTopWidth: 1,
        borderTopColor: colors.border,
        gap: 10,
    },
    contactRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    contactPanelText: {
        color: colors.text,
        fontSize: 15,
    },
    section: {
        paddingTop: 72,
    },
    sectionHeader: {
        maxWidth: 860,
        marginBottom: 28,
    },
    sectionEyebrow: {
        color: colors.accent,
        textTransform: 'uppercase',
        letterSpacing: 1.4,
        fontSize: 12,
        fontWeight: '700',
        marginBottom: 10,
    },
    sectionTitle: {
        color: colors.text,
        fontSize: 40,
        lineHeight: 48,
        fontWeight: '700',
        marginBottom: 16,
    },
    sectionBody: {
        color: colors.textMuted,
        fontSize: 18,
        lineHeight: 30,
    },
    strengthsSection: {
        paddingBottom: 8,
    },
    strengthGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 18,
    },
    strengthGridSingle: {
        flexDirection: 'column',
    },
    strengthCard: {
        flexGrow: 1,
        flexBasis: 280,
        minWidth: 250,
        backgroundColor: colors.panel,
        borderWidth: 1,
        borderColor: colors.borderSoft,
        borderRadius: 24,
        padding: 24,
    },
    strengthIconWrap: {
        width: 44,
        height: 44,
        borderRadius: 14,
        backgroundColor: colors.accent,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 18,
    },
    strengthTitle: {
        color: colors.text,
        fontSize: 20,
        fontWeight: '700',
        marginBottom: 10,
    },
    strengthBody: {
        color: colors.textMuted,
        fontSize: 16,
        lineHeight: 26,
    },
    capabilityGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 18,
    },
    capabilityGridSingle: {
        flexDirection: 'column',
    },
    capabilityCard: {
        flexGrow: 1,
        flexBasis: 260,
        backgroundColor: colors.panel,
        borderRadius: 22,
        borderWidth: 1,
        borderColor: colors.borderSoft,
        padding: 22,
    },
    capabilityTitle: {
        color: colors.text,
        fontSize: 20,
        fontWeight: '700',
        marginBottom: 14,
    },
    capabilityItemRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginBottom: 10,
    },
    capabilityDot: {
        width: 7,
        height: 7,
        borderRadius: 4,
        backgroundColor: colors.accent,
    },
    capabilityItem: {
        color: colors.textMuted,
        fontSize: 15,
        lineHeight: 22,
    },
    projectsSection: {
        borderTopWidth: 1,
        borderTopColor: colors.border,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
        marginTop: 72,
        paddingBottom: 72,
    },
    projectCard: {
        position: 'relative',
        backgroundColor: colors.panel,
        borderWidth: 1,
        borderColor: colors.borderSoft,
        borderRadius: 26,
        padding: 24,
        marginBottom: 20,
    },
    projectCardFeatured: {
        padding: 28,
        backgroundColor: colors.panelStrong,
    },
    projectCardGrid: {
        flexBasis: '48%',
        flexGrow: 1,
        minWidth: 320,
    },
    projectCardCompact: {
        marginBottom: 18,
    },
    projectAccentSvg: {
        position: 'absolute',
        top: 0,
        left: 0,
    },
    projectGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 20,
        justifyContent: 'space-between',
    },
    projectGridSingle: {
        flexDirection: 'column',
    },
    projectHeader: {
        marginBottom: 14,
    },
    projectEyebrow: {
        color: colors.accent,
        textTransform: 'uppercase',
        letterSpacing: 1.2,
        fontSize: 12,
        fontWeight: '700',
        marginBottom: 10,
    },
    projectTitle: {
        color: colors.text,
        fontSize: 28,
        lineHeight: 34,
        fontWeight: '700',
        marginBottom: 8,
    },
    projectTagline: {
        color: colors.text,
        fontSize: 18,
        lineHeight: 28,
    },
    roleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 14,
    },
    roleText: {
        color: colors.textMuted,
        fontSize: 15,
        fontWeight: '600',
    },
    projectSummary: {
        color: colors.textMuted,
        fontSize: 16,
        lineHeight: 27,
        marginBottom: 16,
    },
    highlightsBlock: {
        marginBottom: 18,
        gap: 10,
    },
    highlightRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 10,
    },
    highlightDot: {
        width: 7,
        height: 7,
        borderRadius: 4,
        backgroundColor: colors.accent,
        marginTop: 8,
    },
    highlightText: {
        color: colors.text,
        flex: 1,
        fontSize: 15,
        lineHeight: 24,
    },
    techWrap: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
        marginBottom: 18,
    },
    techPill: {
        borderRadius: 999,
        paddingHorizontal: 12,
        paddingVertical: 8,
        backgroundColor: colors.pill,
        borderWidth: 1,
        borderColor: colors.borderSoft,
    },
    techPillText: {
        color: colors.text,
        fontSize: 13,
        fontWeight: '600',
    },
    linkRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    linkPill: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: 999,
        backgroundColor: colors.surfaceAlt,
        borderWidth: 1,
        borderColor: colors.borderSoft,
    },
    linkPillText: {
        color: colors.text,
        fontSize: 14,
        fontWeight: '600',
    },
    footerSection: {
        paddingBottom: 16,
    },
    footerTitle: {
        color: colors.text,
        fontSize: 34,
        lineHeight: 42,
        fontWeight: '700',
        maxWidth: 860,
        marginBottom: 16,
    },
    footerBody: {
        color: colors.textMuted,
        fontSize: 18,
        lineHeight: 30,
        maxWidth: 760,
    },
});
