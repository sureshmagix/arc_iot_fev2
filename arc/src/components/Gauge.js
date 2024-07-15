// Gauge.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Svg, G, Circle } from 'react-native-svg';

const Gauge = ({ value, size = 200, strokeWidth = 20 }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const halfSize = size / 2;
  const strokeDashoffset = circumference - (circumference * value) / 100;

  return (
    <View style={styles.container}>
      <Svg width={size} height={size}>
        <G rotation="-90" origin={`${halfSize}, ${halfSize}`}>
          <Circle
            cx={halfSize}
            cy={halfSize}
            r={radius}
            stroke="#e6e6e6"
            strokeWidth={strokeWidth}
            fill="none"
          />
          <Circle
            cx={halfSize}
            cy={halfSize}
            r={radius}
            stroke="#3498db"
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
        </G>
      </Svg>
      <Text style={styles.valueText}>{`${value}%`}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  valueText: {
    position: 'absolute',
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default Gauge;
