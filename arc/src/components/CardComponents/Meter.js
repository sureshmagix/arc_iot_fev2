import React from 'react';
import { View, Text, Dimensions, StyleSheet } from 'react-native';
import { Card } from 'react-native-elements';
import CircularProgress from 'react-native-circular-progress-indicator';

const screenWidth = Dimensions.get('window').width;

const Meter = ({ title, voltageValues, currentValues }) => {
  const renderDial = (value, maxValue, color, suffix, label) => (
    <View style={styles.dial}>
      <CircularProgress
        value={value}
        maxValue={maxValue}
        radius={screenWidth * 0.08}
        textColor="#000"
        activeStrokeColor={color}
        inActiveStrokeColor="#d7d7d7"
        inActiveStrokeOpacity={0.2}
        textStyle={{ fontSize: screenWidth * 0.032, fontWeight: 'bold' }}
        valueSuffix={suffix}
      />
      <Text style={styles.dialLabel}>{label}</Text>
    </View>
  );

  return (
    <Card containerStyle={styles.cardContainer}>
      <Card.Title style={styles.cardTitle}>{title}</Card.Title>
      <Card.Divider />

      <View style={styles.dialsContainer}>
        {renderDial(voltageValues.rV, 500, "#ff0000", "V", "RB")}
        {renderDial(voltageValues.yV, 500, "#ffdd00", "V", "YB")}
        {renderDial(voltageValues.bV, 500, "#0000ff", "V", "BR")}
      </View>

      <View style={styles.dialsContainer}>
        {renderDial(currentValues.rA, 100, "#ff0000", "A", "IR")}
        {renderDial(currentValues.yA, 100, "#ffdd00", "A", "IY")}
        {renderDial(currentValues.bA, 100, "#0000ff", "A", "IB")}
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    marginTop: 5,
    marginBottom: 5,
    borderColor: 'darkblue',
    borderRadius: 20,
  },
  cardTitle: {
    // Add your card title styling here if needed
  },
  dialsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
  },
  dial: {
    alignItems: 'center',
  },
  dialLabel: {
    marginTop: 5,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Meter;
