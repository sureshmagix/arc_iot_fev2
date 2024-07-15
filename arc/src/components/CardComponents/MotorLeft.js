import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Card } from 'react-native-elements';
import Motor from '../Motor'; // Adjust the import path according to your project structure

const MotorLeft = () => {
  return (
    <View style={styles.container}>
      <Card
        containerStyle={{
          ...styles.card,
          marginTop: 4,
          marginBottom: 1,
          borderColor: 'darkblue',
          borderRadius: 20,
          paddingHorizontal: 1,
          paddingVertical: 1,
          paddingBottom: 1,
          paddingTop: 1,
        }}>
        <View style={styles.row}>
          <Motor />
        </View>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent:'center',
    alignItems:'flex-start',
  },
  card: {
    width: '50%', // 50% of the screen width
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:'center',
  },
});

export default MotorLeft;
