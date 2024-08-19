import { StyleSheet, Text, View, TouchableOpacity, Linking, Image } from 'react-native';
import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';

function CallScreen() {
  const [starterData, setStarterData] = useState({
    starter1: null,
    starter2: null,
    starter3: null,
    starter4: null,
  });
  const [starter1, setStarter1] = useState('');

  useEffect(() => {
    readStarterData();
  }, []);

  const mobileNumber = starterData.starter1;

  const makeCall = (mobileNumber) => {
    Linking.openURL(`tel:${mobileNumber}`);
  };

  const readStarterData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('starterData');
      if (jsonValue) {
        const parsedData = JSON.parse(jsonValue);
        setStarterData(parsedData);
        setStarter1(parsedData.starter1);
        console.log('Starter data retrieved:', parsedData);
      } else {
        console.log('No starter data found in AsyncStorage.');
      }
    } catch (error) {
      console.error('Error reading starter data:', error);
      Alert.alert('Error', 'Failed to read starter data');
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require('../assets/logo.png')} style={styles.logoStyle} />
      <Text style={styles.textTitle}>Call ArchidTech Starter</Text>
      <Text style={styles.textLabel}>Registered Starter No:</Text>
      <Text style={styles.textMobile2}>{mobileNumber}</Text>

      <TouchableOpacity
        style={styles.buttonStyle}
        onPress={() => makeCall(mobileNumber)}>
        <Icon name="phone" size={20} color="white" style={styles.iconStyle} />
        <Text style={styles.connectionStatus}>Call Starter</Text>
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
    backgroundColor: '#f0f8ff', // Soft background color for better contrast
    padding: 20,
  },
  buttonStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 30,
    backgroundColor: '#0066cc', // A shade of blue that stands out well
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 5,
  },
  connectionStatus: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    marginLeft: 10,
  },
  footer: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#8b0000',
    marginTop: 40,
  },
  textMobile2: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000080',
    marginBottom: 10,
  },
  textTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000080',
    marginTop: 20,
    marginBottom: 5,
  },
  textLabel: {
    fontSize: 18,
    fontWeight: '500',
    color: '#333333',
    marginBottom: 5,
  },   
  logoStyle: {
    width: 150,
    height: 150,
    marginBottom: 25,
    borderRadius: 10,
  },
  iconStyle: {
    marginRight: 10,
  },
});
