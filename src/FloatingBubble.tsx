import { useEffect, useRef } from "react";
import { Animated, Dimensions } from "react-native";
import { colors } from "./colors";

export const FloatingBubble = ({ size, duration, delay }: { size: number; duration: number; delay: number }) => {
    const translateX = useRef(new Animated.Value(Math.random() * Dimensions.get('window').width)).current;
    const translateY = useRef(new Animated.Value(Math.random() * Dimensions.get('window').height)).current;

    useEffect(() => {
        const animate = () => {
            Animated.loop(
                Animated.sequence([
                    Animated.timing(translateX, {
                        toValue: Math.random() * Dimensions.get('window').width,
                        duration: duration + Math.random() * 10000,
                        useNativeDriver: true,
                        delay,
                    }),
                    Animated.timing(translateY, {
                        toValue: Math.random() * Dimensions.get('window').height,
                        duration: duration + Math.random() * 10000,
                        useNativeDriver: true,
                    }),
                ])
            ).start();
        };
        animate();
    }, []);

    return (
        <Animated.View
            style={{
                position: 'absolute',
                width: size,
                height: size,
                borderRadius: size / 2,
                backgroundColor: 'rgba(56, 189, 248, 0.15)',
                borderWidth: 1,
                borderColor: 'rgba(124, 211, 252, 0.3)',
                shadowColor: colors.accent,
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.6,
                shadowRadius: 15,
                elevation: 10, // Android glow
                transform: [{ translateX }, { translateY }],
            }}
        />
    );
};