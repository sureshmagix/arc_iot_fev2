import React, { useEffect, useState,useRef,useCallback} from 'react';
import { View, Text, Button, StyleSheet, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import TimerSelector from '../components/TimeSelector';
// Sample data, replace this with real data fetching in a real application


function UserScreen(props) {

  const [isTimerSelectorVisible, setTimerSelectorVisible] = useState(false);
  return (
    <ScrollView contentContainerStyle={styles.viewStyle}>
      {/* <Text style={styles.headingStyle}>Coming Soon</Text>
      <Text style={styles.textStyle}>This is User screen</Text> */}
      <Button title='Home' onPress={() => props.navigation.navigate('App Home')} />
      <Button title="Open Timer Selector" onPress={() => setTimerSelectorVisible(true)} />
      <TimerSelector visible={isTimerSelectorVisible} onClose={() => setTimerSelectorVisible(false)} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  viewStyle: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  deviceInfoContainer: {
    marginTop: 30,
    width: '100%',
  },
  textStyle: {
    fontSize: 28,
    color: 'black',
  },
  headingStyle: {
    fontSize: 30,
    color: 'black',
    textAlign: "center",
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  value: {
    fontSize: 16,
  },
  icon: {
    marginRight: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
});

export default UserScreen;
