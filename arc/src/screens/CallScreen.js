import { StyleSheet, Text, View, TouchableOpacity, Linking } from 'react-native';
import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

function CallScreen() {
  const [mobileNumber, setMobileNumber] = useState('');

  useEffect(() => {
    const fetchMobileNumber = async () => {
      try {
        const storedMobileNumber = await AsyncStorage.getItem('mobileNumber');
        if (storedMobileNumber) {
          setMobileNumber(storedMobileNumber);
        }
      } catch (e) {
        console.error('Failed to load mobile number from AsyncStorage', e);
      }
    };

    fetchMobileNumber();
  }, []);



  const makeCall = (number) => {
    Linking.openURL(`tel:${number}`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.textMobile2}>Call Motor starter:</Text>
      <Text>Registered Motor Mobile No: </Text>
      <Text style={styles.textMobile2}>{mobileNumber}</Text>
      

      <TouchableOpacity
        style={styles.buttonStyle}
        onPress={() => makeCall(mobileNumber)}>
        <Text style={styles.connectionStatus}>Call Motor</Text>
      </TouchableOpacity>
      <Text style={styles.footer}>Powered by Archidtech</Text>
    </View>
  );
}

export default CallScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonStyle: {
    marginTop: 20,
    backgroundColor: 'blue',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  connectionStatus: {
    fontSize: 18,
    fontWeight: 'bold',
    fontStyle: 'italic',
    color: 'white',
  },
  footer: {
    fontSize: 18,
    fontWeight: 'bold',
    fontStyle: 'italic',
    color: 'crimson',
  },
  textMobile2: {
    fontSize: 30,
    fontWeight: 'bold',
    fontStyle: 'italic',
    marginBottom: 8,
    color: 'navy',
  },
});