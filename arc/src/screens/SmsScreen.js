import React, { useState, useEffect } from 'react';
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


var DirectSms = NativeModules.DirectSms;

export default function Home_sms({ navigation }) {
  const mobileNumber = '9962577674';

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
    if (mobileNumber === '') {
      Alert.alert('Please enter motor mobile number');
      return;
    }
    sendDirectSms(mobileNumber, message);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.container}>
          <ImageBackground
            source={require('../assets/bg.jpeg')}
            resizeMode="cover"
            style={styles.image}
          >
            <Image
              source={require('../assets/logo.png')}
              style={{
                resizeMode: 'contain',
                alignItems: 'center',
                tintColor: 'red',
                justifyContent: 'center',
                height: 100,
                width: 200,
                marginLeft: 'auto',
                marginRight: 'auto',
                marginVertical: 1,
              }}
            />

            <Text style={styles.titleText}>Archidtech Motor Starter (SMS)</Text>
            <Text style={styles.titleText}>அர்ச்சிட்டெக் மோட்டார் செயலி </Text>
            <Text style={styles.textMobile}>Registered Motor Mobile No: </Text>
            <Text style={styles.textMobile2}>{mobileNumber} </Text>

            <TouchableOpacity
              activeOpacity={0.7}
              style={styles.buttonStyle}
              onPress={() => handleCommand('Mon')}
            >
              <Text style={styles.buttonTextStyle}>MOTOR ON / மோட்டார் ஆன்</Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.7}
              style={styles.buttonStyle}
              onPress={() => handleCommand('Mof')}
            >
              <Text style={styles.buttonTextStyle}>MOTOR OFF / மோட்டார் ஆப்</Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.7}
              style={styles.buttonStyle}
              onPress={() => handleCommand('Aon')}
            >
              <Text style={styles.buttonTextStyle}>AUTO ON - 2/3</Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.7}
              style={styles.buttonStyle}
              onPress={() => handleCommand('Aof')}
            >
              <Text style={styles.buttonTextStyle}>AUTO OFF - 2/3</Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.7}
              style={styles.buttonStyle}
              onPress={() => handleCommand('3aon')}
            >
              <Text style={styles.buttonTextStyle}>3 PHASE - AUTO ONLY</Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.7}
              style={styles.buttonStyle}
              onPress={() => handleCommand('Rst')}
            >
              <Text style={styles.buttonTextStyle}>RESET</Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.7}
              style={styles.buttonStyle}
              onPress={() => handleCommand('Sta')}
            >
              <Text style={styles.buttonTextStyle}>STATUS</Text>
            </TouchableOpacity>
          </ImageBackground>

          <Text style={styles.titleText}>Contact: +91 94438 17475</Text>
          <Text style={styles.titleText}>Powered by Archidtech</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'gold',
    padding: 5,
    textAlign: 'center',
  },
  titleText: {
    fontSize: 18,
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 16,
    color: 'crimson',
  },
  buttonStyle: {
    justifyContent: 'center',
    marginTop: 8,
    marginBottom: 8,
    padding: 7,
    backgroundColor: 'steelblue',
    borderRadius: 15,
  },
  buttonTextStyle: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  image: {
    flex: 0,
    justifyContent: 'center',
  },
  textMobile: {
    fontSize: 18,
    textAlign: 'center',
    fontWeight: 'bold',
    fontStyle: 'italic',
    marginBottom: 8,
    color: 'blue',
  },
  textMobile2: {
    fontSize: 30,
    textAlign: 'center',
    fontWeight: 'bold',
    fontStyle: 'italic',
    marginBottom: 8,
    color: 'navy',
  },
});
