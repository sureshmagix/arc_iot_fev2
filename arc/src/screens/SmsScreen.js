import React, { useState, useEffect } from 'react';
import Config from 'react-native-config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  ImageBackground,
  ScrollView,
  PermissionsAndroid,
  Alert,
  NativeModules,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

var DirectSms = NativeModules.DirectSms;

export default function Home_sms({ navigation }) {
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

  const sendDirectSms = async (number, message) => {
    if (number) {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.SEND_SMS,
          {
            title: 'Send SMS Permission',
            message: 'This app needs access to send SMS messages.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );

        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          DirectSms.sendDirectSms(number, message);
          Alert.alert('SMS sent');
        } else {
          Alert.alert('SMS permission denied');
        }
      } catch (error) {
        console.warn(error);
        Alert.alert('An error occurred while sending the SMS');
      }
    } else {
      Alert.alert('Please enter a valid mobile number');
    }
  };

  const handleCommand = (message) => {
    if (!mobileNumber) {
      Alert.alert('Please enter motor mobile number');
      return;
    }
    sendDirectSms(mobileNumber, message);
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
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <ImageBackground
          source={require('../assets/modern_bg.jpg')}
          resizeMode="cover"
          style={styles.imageBackground}
        >
          <View style={styles.contentContainer}>
          <View style={styles.headerContainer}>
                <Image
                  source={require('../assets/logo.png')}
                  style={styles.logo}
                />
                <View style={styles.textContainer}>
                  <Text style={styles.titleText}>SMS YOUR STARTER</Text>
                  <Text style={styles.textLabel}>Your Starter ID:</Text>
                  <Text style={styles.textValue}>{mobileNumber}</Text>
                </View>
              </View>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.buttonStyle}
                onPress={() => handleCommand('Mon')}
              >
                <Icon name="power" size={24} color="#fff" style={styles.icon} />
                <Text style={styles.buttonTextStyle}>MOTOR ON / மோட்டார் ஆன்</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.buttonStyle}
                onPress={() => handleCommand('Mof')}
              >
                <Icon name="power-off" size={24} color="#fff" style={styles.icon} />
                <Text style={styles.buttonTextStyle}>MOTOR OFF / மோட்டார் ஆப்</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.buttonStyle}
                onPress={() => handleCommand('Aon')}
              >
                <Icon name="toggle-switch" size={24} color="#fff" style={styles.icon} />
                <Text style={styles.buttonTextStyle}>AUTO ON - 2/3</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.buttonStyle}
                onPress={() => handleCommand('Aof')}
              >
                <Icon name="toggle-switch-off" size={24} color="#fff" style={styles.icon} />
                <Text style={styles.buttonTextStyle}>AUTO OFF - 2/3</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.buttonStyle}
                onPress={() => handleCommand('3aon')}
              >
                <Icon name="chart-areaspline" size={24} color="#fff" style={styles.icon} />
                <Text style={styles.buttonTextStyle}>3 PHASE - AUTO ONLY</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.buttonStyle}
                onPress={() => handleCommand('Rst')}
              >
                <Icon name="refresh" size={24} color="#fff" style={styles.icon} />
                <Text style={styles.buttonTextStyle}>RESET</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.buttonStyle}
                onPress={() => handleCommand('Sta')}
              >
                <Icon name="information-outline" size={24} color="#fff" style={styles.icon} />
                <Text style={styles.buttonTextStyle}>STATUS</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.footerText}>Contact: +91 94438 17475</Text>
            <Text style={styles.footerText}>Powered by Archidtech</Text>
          </View>
        </ImageBackground>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  scrollView: {
    flexGrow: 1,
  },
  imageBackground: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  logo: {
    height: 100,
    width: 100,
    resizeMode: 'contain',
    marginRight: 5, // Space between the logo and text
  },
  headerContainer: {
    flexDirection: 'row', // Align children in a row
    alignItems: 'center', // Vertically align items in the center
    justifyContent: 'flex-start', // Align items to the start of the row
    width: '100%',
    padding: 5,
    marginBottom: 5,
  },
  titleText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  textContainer: {
    flex: 1, // Take up the remaining space
    justifyContent: 'center',
  },
  subtitleText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  textLabel: {
    fontSize: 18,
    color: '#555',
    marginBottom: 5,
    textAlign: 'center',
  },
  textValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'blue',
    marginBottom: 20,
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
  },
  buttonStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4CAF50',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginVertical: 8,
    borderWidth: 2,
    borderColor: '#000',
  },
  buttonTextStyle: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
    marginLeft: 10,
  },
  icon: {
    marginRight: 10,
  },
  footerText: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
    marginTop: 20,
  },
});
