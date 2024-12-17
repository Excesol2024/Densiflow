import { View, Animated, StyleSheet } from 'react-native';
import React, { useEffect, useRef } from 'react';
import { LinearGradient } from 'expo-linear-gradient'; // Expo LinearGradient

const SkeletonLoader = ({ width, height, borderRadius }) => {
  const translateX = useRef(new Animated.Value(-width)).current; // Start the animation off-screen to the left

  useEffect(() => {
    // Animate from left to right and back
    Animated.loop(
      Animated.timing(translateX, {
        toValue: width, // Move to the right, equal to the width of the box
        duration: 1000, // Duration of the animation
        useNativeDriver: true,
      })
    ).start();
  }, [width]);

  return (
    <View
      style={[
        {
          width: width,
          height: height,
          backgroundColor: "rgba(0,0,0,0.09)", // Semi-transparent background
          overflow: 'hidden', // Ensures content stays inside the box
          borderRadius: borderRadius, // Rounded corners
        },
      ]}
    >
      <Animated.View
        style={{
          width: "100%",
          height: "100%",
          transform: [{ translateX: translateX }], // Apply translation to animate shimmer effect
        }}
      >
        <LinearGradient
          style={{ width: "100%", height: "100%" }}
          colors={["transparent", "rgba(0,0,0,0.04)", "transparent"]} // Slightly darker gradient for better visibility
          start={{ x: 0, y: 0 }} // Start from the left side
          end={{ x: 1, y: 0 }} // End at the right side
        />
      </Animated.View>
    </View>
  );
};

export default SkeletonLoader;
