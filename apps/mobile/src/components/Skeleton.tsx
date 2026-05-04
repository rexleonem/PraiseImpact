import React from 'react';
import { View, StyleSheet, Animated } from 'react-native';

export const Skeleton = ({ width, height, borderRadius = 8 }: { width: any, height: any, borderRadius?: number }) => {
  const animatedValue = React.useRef(new Animated.Value(0.3)).current;

  React.useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0.3,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <Animated.View 
      style={[
        styles.skeleton, 
        { width, height, borderRadius, opacity: animatedValue }
      ]} 
    />
  );
};

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: '#1e293b',
  },
});
