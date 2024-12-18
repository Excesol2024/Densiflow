import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const SkeletonLoader = ({ width, height, borderRadius }) => {
  const screenWidth = Dimensions.get('window').width;
  const resolvedWidth = typeof width === 'string' && width.endsWith('%')
    ? (parseFloat(width) / 100) * screenWidth
    : width; // Convert percentage to number or use width as-is

  const translateX = useRef(new Animated.Value(-resolvedWidth)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(translateX, {
        toValue: resolvedWidth,
        duration: 1000,
        useNativeDriver: true,
      })
    ).start();
  }, [resolvedWidth]);

  return (
    <View
      style={[
        styles.container,
        {
          width: width, // Use the original width (supports percentage)
          height: height,
          borderRadius: borderRadius,
        },
      ]}
    >
      <Animated.View
        style={{
          width: resolvedWidth,
          height: "100%",
          transform: [{ translateX: translateX }],
        }}
      >
        <LinearGradient
          style={StyleSheet.absoluteFill}
          colors={["transparent", "rgba(0,0,0,0.04)", "transparent"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "rgba(0,0,0,0.09)",
    overflow: 'hidden',
  },
});

export default SkeletonLoader;
