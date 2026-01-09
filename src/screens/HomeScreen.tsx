import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, Animated, ScrollView, TouchableOpacity, Linking, Easing } from 'react-native';
import { useTypewriter, Cursor, Typewriter } from 'react-simple-typewriter';
import { colors } from '../colors';
import { MaterialIcons } from '@expo/vector-icons';
import Svg, { Polygon } from 'react-native-svg';
import FileCabinet from '../components/FileCabinet';
import { projects } from '../projects';
import { LinearGradient } from 'expo-linear-gradient';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const descriptors = ['Frontend Developer', 'Mobile App Developer', 'Web Developer', 'Software Engineer'];

const getFontSize = (screenWidth: number, baseSize: number) => (screenWidth < 350) ? baseSize * 0.4 : (screenWidth < 450) ? baseSize * 0.5 : (screenWidth < 700) ? baseSize * 0.8 : baseSize;

export default function HomeScreen() {
    const scrollViewRef = useRef<ScrollView>(null);
    const glowAnim = useRef(new Animated.Value(0)).current;
    const [isPastHero, setIsPastHero] = useState(false);
    const [screenWidth, setScreenWidth] = useState(Dimensions.get('window').width);
    
    // Pulsing glow animation
    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(glowAnim, { toValue: 1, duration: 1500, useNativeDriver: true }),
                Animated.timing(glowAnim, { toValue: 0, duration: 1500, useNativeDriver: true }),
            ])
        ).start();
    }, [glowAnim]);

    // Pulsing underline animation 
    const underlineAnim = useRef(new Animated.Value(0)).current;
    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(underlineAnim, { toValue: 1, duration: 2000, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
                Animated.timing(underlineAnim, { toValue: 0, duration: 2000, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
            ])
        ).start();
    }, [underlineAnim]);

        // Handle screen size changes
        useEffect(() => {
            const handler = ({ window }: { window: { width: number } }) => {
                setScreenWidth(window.width);
            };
            const subscription = Dimensions.addEventListener('change', handler);
            return () => subscription?.remove();
        }, []);

    const handleScroll = (event: any) => {
        const offsetY = event.nativeEvent.contentOffset.y;
        setIsPastHero(offsetY > SCREEN_HEIGHT - 200); // Adjust threshold if needed
    };

    const scrollToNext = () => {
        scrollViewRef.current?.scrollTo({ y: SCREEN_HEIGHT, animated: true });
    };

    const scrollToTop = () => {
        scrollViewRef.current?.scrollTo({ y: 0, animated: true });
    };

    return (
        <ScrollView
            ref={scrollViewRef}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            showsVerticalScrollIndicator={false}
            style={styles.scrollContainer}
            contentContainerStyle={{ flexGrow: 1 }}
        >
                {/* HERO SECTION */}
                <View style={styles.hero}>
                    <Text style={[styles.greeting, { fontSize: getFontSize(screenWidth, 64) }]}>Hey! My name is Eli. I'm a</Text>

                    <View style={styles.typewriterLine}>
                        <Text style={[styles.dynamicText, { fontSize: getFontSize(screenWidth, 64) }]}>
                            <Typewriter
                                words={descriptors}
                                loop={true}
                                cursor={true}
                                cursorStyle="|"
                                typeSpeed={100}
                                deleteSpeed={50}
                                delaySpeed={1500}
                            />
                        </Text>
                    </View>

                    {/* Glowing Hexagon Scroll Down Button */}
                    <TouchableOpacity
                        style={styles.floatingButtonContainer}
                        onPress={isPastHero ? scrollToTop : scrollToNext}
                        activeOpacity={0.8}
                    >
                        {/* Outer strong glow layer */}
                        <Animated.View style={{ position: 'absolute', opacity: glowAnim.interpolate({ inputRange: [0, 1], outputRange: [0.1, 0.7] }) }}>
                            <Svg width={75} height={85} viewBox="0 0 100 100">
                                <Polygon
                                    points="50,5 90,25 90,75 50,95 10,75 10,25"
                                    fill="none"
                                    stroke={colors.accent}
                                    strokeWidth={10}
                                />
                            </Svg>
                            {/* Arrow Icon */}
                            <MaterialIcons
                                name={isPastHero ? "keyboard-double-arrow-up" : "keyboard-double-arrow-down"}
                                size={38}
                                color={colors.accent}
                                style={{ position: 'absolute', alignSelf: 'center', top: 24 }}
                            />
                        </Animated.View>

                        {/* Middle glow layer */}
                        <Animated.View style={{ position: 'absolute', opacity: glowAnim.interpolate({ inputRange: [0, 1], outputRange: [0.15, 0.5] }) }}>
                            <Svg width={70} height={80} viewBox="0 0 100 100">
                                <Polygon
                                    points="50,5 90,25 90,75 50,95 10,75 10,25"
                                    fill="none"
                                    stroke={colors.accent}
                                    strokeWidth={8}
                                />
                            </Svg>
                        </Animated.View>

                        {/* Inner subtle glow / main outline */}
                        <Animated.View style={{ position: 'absolute', opacity: glowAnim.interpolate({ inputRange: [0, 1], outputRange: [0.2, 0.4] }) }}>
                            <Svg width={65} height={75} viewBox="0 0 100 100">
                                <Polygon
                                    points="50,5 90,25 90,75 50,95 10,75 10,25"
                                    fill="none"
                                    stroke={colors.accent}
                                    strokeWidth={6}
                                />
                            </Svg>
                        </Animated.View>
                    </TouchableOpacity>
                </View>

                {/* GRADIENT TRANSITION: Hero → About (200px) */}
                {/* This LinearGradient smoothly transitions from the hero's background color to the about section's muted color */}
                {/* To adjust: modify the 'colors' array to change gradient stops, or adjust 'height: 200' below to make transition faster/slower */}
                <LinearGradient
                    colors={[colors.background, colors.muted]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 1 }}
                    style={{ height: 200 }}
                />

                {/* ABOUT + SKILLS SECTION */}
                {/* Solid muted background for the about/skills content area */}
                <View style={[styles.aboutSection, { width: screenWidth, paddingHorizontal: screenWidth * 0.1, backgroundColor: colors.muted }]}>
                    <View style={styles.aboutLeft}>
                        <Text style={styles.sectionTitle}>About Me</Text>
                        <Text style={styles.aboutText}>
                            I'm a commited frontend developer with a passion for React, React Native, and crafting smooth, user-friendly mobile and web apps that people actually enjoy using.
                            What drives me is a love of creativity, problem-solving, and constant learning.
                            I have hands-on experience building and deploying responsive mobile and web apps in solo and team settings.
                            Outside of coding, I enjoy love active by playing basketball, lifting, and traveling.
                            I'm excited to bring my energy and skills to an entry-level full-time role on a team that's building something meaningful.
                        </Text>
                        <Text style={styles.location}>Milwaukee, Wisconsin</Text>
                        <Text style={styles.contact} onPress={() => Linking.openURL('mailto:elijgauger@gmail.com')}>
                            elijgauger@gmail.com
                        </Text>
                        <Text style={styles.contact} onPress={() => Linking.openURL('https://github.com/ejgaug')}>
                            github.com/ejgaug
                        </Text>
                        <Text style={styles.contact} onPress={() => Linking.openURL('https://www.linkedin.com/in/eli-gauger/')}>
                            linkedin.com/in/eli-gauger
                        </Text>
                    </View>

                    <View style={styles.skillsRight}>
                        <Text style={styles.sectionTitle}>Skills</Text>

                        <Text style={[styles.skillCategory, { marginTop: 0 }]}>Core Technologies</Text>
                        <Text style={styles.skillList}>
                            React, React Native, JavaScript, TypeScript, Node.js, Express, FastAPI, SQL, HTML, CSS
                        </Text>

                        <Text style={styles.skillCategory}>Mobile & Cross-Platform</Text>
                        <Text style={styles.skillList}>
                            Cross-Platform Development, Mobile App Development, Web Development, Responsive Design, Expo, EAS
                        </Text>

                        <Text style={styles.skillCategory}>Tools & Services</Text>
                        <Text style={styles.skillList}>
                            Git, Firebase, RESTful APIs, API Integration, Google Analytics, Dialogflow, JIRA, VS Code, npm, GeoJSON
                        </Text>

                        <Text style={styles.skillCategory}>Design & Development Practices</Text>
                        <Text style={styles.skillList}>
                            Software Lifecycle Management, AI-Integration,UX/UI Design, Figma, Prototyping, User Testing, Accessibility, Integration Testing
                        </Text>

                        <Text style={styles.skillCategory}>Soft Skills</Text>
                        <Text style={styles.skillList}>
                            Collaboration, Adaptability, Problem-Solving, Communication, Teamwork, Agile Frameworks, Scrum
                        </Text>
                    </View>
                </View>

                {/* GRADIENT TRANSITION: About → Projects (200px) */}
                {/* This LinearGradient smoothly transitions from the about section's muted color back to the projects section's background color */}
                {/* To adjust: modify the 'colors' array to change gradient stops, or adjust 'height: 200' below to make transition faster/slower */}
                <LinearGradient
                    colors={[colors.muted, colors.background]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 1 }}
                    style={{ height: 200 }}
                />

                {/* PROJECTS SECTION */}
                {/* Solid background color for the projects content area */}
                <View style={[styles.projectsSection, { backgroundColor: colors.background }]}>
                    <Text style={styles.projectsTitle}>Projects</Text>
                    {/* New centered container with safe bottom spacing */}
                    <View style={styles.fileCabinetWrapper}>
                        <FileCabinet projects={projects} />
                    </View>               
                </View>
            </ScrollView>
    );        
}

const styles = StyleSheet.create({
    scrollContainer: { 
        flex: 1, 
        backgroundColor: colors.background 
    },
    hero: {
        height: SCREEN_HEIGHT - 100,
        backgroundColor: colors.background,
        alignItems: 'center',
        justifyContent: 'center',
    },
    greeting: {
        fontWeight: '200',
        color: colors.text,
        marginBottom: 24,
        textAlign: 'center',
    },
    typewriterLine: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
    },
    dynamicText: {
        fontWeight: '500',
        color: colors.accent,
    },
    floatingButtonContainer: {
        position: 'absolute',
        bottom: 80,
        zIndex: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    glowHexContainer: {
        position: 'absolute',
        opacity: 0.3,
    },
    hexButton: {
        width: 70,
        height: 80,
        backgroundColor: 'rgba(56, 189, 248, 0.15)',
        borderWidth: 2,
        borderColor: colors.accent,
        alignItems: 'center',
        justifyContent: 'center',
    },
    aboutSection: {
        minHeight: SCREEN_HEIGHT - 100,
        flexDirection: 'row',
        paddingTop: 20,
        justifyContent: 'space-between',
        flexWrap: 'wrap',
    },
    aboutLeft: {
        flex: 1,
        minWidth: 300,
        marginRight: 40,
        paddingTop: 40,
    },
    skillsRight: {
        flex: 1,
        minWidth: 300,
        paddingTop: 40,
        paddingBottom: 80,
    },
    sectionTitle: {
        fontSize: 40,
        fontWeight: '600',
        color: colors.cardBorder,
        marginBottom: 30,
        position: 'relative',
    },
    sectionTitleWrapper: {
        position: 'relative',
    },
    titleUnderline: {
        position: 'absolute',
        bottom: -8,
        left: 0,
        height: 4,
        width: '100%',
        backgroundColor: colors.accent,
        borderRadius: 2,
        opacity: 0.6,
    },
    aboutText: {
        fontSize: 18,
        color: colors.cardBorder,
        lineHeight: 28,
        marginBottom: 24,
    },
    location: {
        fontSize: 18,
        color: colors.cardBorder,
        marginBottom: 8,
    },
    contact: {
        fontSize: 16,
        color: colors.cardBorder,
        marginBottom: 6,
        textDecorationLine: 'underline',
    },
    skillCategory: {
        fontSize: 20,
        fontWeight: '600',
        color: colors.cardBorder,
        marginTop: 24,
        marginBottom: 8,
    },
    skillList: {
        fontSize: 16,
        color: colors.cardBorder,
        lineHeight: 24,
    },
    projectsSection: {
        minHeight: SCREEN_HEIGHT, // ensures full-screen feel
        paddingTop: 60,
        paddingBottom: 100, // extra safe space at bottom on all devices
        alignItems: 'center',
        backgroundColor: colors.background,
    },
    projectsTitle: {
        fontSize: 40,
        fontWeight: '600',
        color: colors.text,
        marginBottom: 40,
    },
    projectItem: {
        maxWidth: 800,
        width: '100%',
        marginBottom: 60,
        paddingHorizontal: 20,
    },
    fileCabinetWrapper: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        // minHeight: 500, // guarantees enough vertical space
        marginBottom: 150, 
    },
    projectName: {
        fontSize: 28,
        fontWeight: '700',
        color: colors.accent,
        marginBottom: 12,
    },
    projectDescription: {
        fontSize: 18,
        color: colors.mutedAlt,
        lineHeight: 28,
        marginBottom: 12,
    },
    projectTech: {
        fontSize: 16,
        color: colors.accentSoft,
        fontStyle: 'italic',
    },
});