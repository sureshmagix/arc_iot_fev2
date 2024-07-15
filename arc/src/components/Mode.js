import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card, CheckBox, Button } from 'react-native-elements';

const Mode = () => {
  const [isCheckedPhase, setIsCheckedPhase] = useState(false);
  const [isCheckedAuto, setIsCheckedAuto] = useState(false);

  const handleReset = () => {
    setIsCheckedPhase(false);
    setIsCheckedAuto(false);
  };

  return (
    <Card containerStyle={styles.cardContainer}>
      <Card.Title style={styles.cardTitle}>Settings</Card.Title>
      <Card.Divider />
      <View style={styles.checkboxContainer}>
        <View style={styles.checkboxWrapper}>
          <CheckBox
            checked={isCheckedPhase}
            onPress={() => setIsCheckedPhase(!isCheckedPhase)}
          />
          <Text style={styles.checkboxLabel}>2/3 PHASE</Text>
        </View>
        <View style={styles.checkboxWrapper}>
          <CheckBox
            checked={isCheckedAuto}
            onPress={() => setIsCheckedAuto(!isCheckedAuto)}
          />
          <Text style={styles.checkboxLabel}>3 PHASE AUTO</Text>
        </View>
      </View>
      <Button
        title="RESET"
        onPress={handleReset}
      />
    </Card>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    margin: 10,
    borderRadius: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000', // Change the color of the card title
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignContent: 'center'
  },
  checkboxWrapper: {
    flexDirection: 'colum',
    alignItems: 'center',
    marginVertical: 5,
    alignItems: 'center',
    alignContent: 'center'
  },
  checkboxLabel: {
    marginLeft: 10,
    fontSize: 16,
    color: 'black', // Change the color of the checkbox label
    fontWeight: 'bold',
    alignItems: 'center',
    alignContent: 'center'
  },
});

export default Mode;
