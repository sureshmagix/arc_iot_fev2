import React, { useState, useEffect } from 'react';
import Svg, { Path, Ellipse, G } from 'react-native-svg';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Config from 'react-native-config';
import MQTT from 'sp-react-native-mqtt';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import { Alert } from 'react-native';
const Light = () => {
  const [mqttClient, setMqttClient] = useState(null);
  const [iconColor, setIconColor] = useState('blue');
  const [info, setInfo] = useState('WAITING');
  const [mobileNumber, setMobileNumber] = useState('');
  const [isTouchable, setIsTouchable] = useState(true);
  const [ls, setLs] = useState('');
  const fetchStoredMobile = async () => {
    try {
      const value = await AsyncStorage.getItem('mobileNumber');
      if (value !== null) {
        setMobileNumber(value);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    const connectMqtt = async (topic) => {
      try {
        const client = await MQTT.createClient({
          uri:Config.MQTT_URL,// 'mqtt://13.233.116.176:1883',
          clientId: 'light_client_id',
          keepalive: 10,
          cleanSession: true,
        });

        client.on('connect', () => {
          console.log('MQTT connected');
          setMqttClient(client);
          client.subscribe(mobileNumber+'/data', 0);
        });

        client.on('message', function (msg) {
          console.log('MQTT Message Received:', msg);
          const userData = JSON.parse(msg.data);
          setLs(userData.ls);
          console.log(`${userData.ms} in motor`)
          if (msg.topic === (mobileNumber+'/data')) {
            let newColor = 'blue';
            if (userData.ls === 'OFF') {
              newColor = 'grey';
              setInfo('Light OFF');
            } else if (userData.ls === 'ON') {
              newColor = 'yellow';
              setInfo('Light ON');
            } else {
              setInfo('WAITING');
            }
            setIconColor(newColor);
            setIsTouchable(true);
          }
        });

        client.on('error', (err) => {
          console.log('MQTT error:', err);
        });

        client.connect();
      } catch (error) {
        console.error('MQTT connection error:', error);
      }
    };

    if (mobileNumber) {
      connectMqtt(mobileNumber);
    }
  }, [mobileNumber]);

  useEffect(() => {
    fetchStoredMobile();
  }, []);

  const handleLightOn = () => {
    if (mqttClient && mqttClient.isConnected()) {
      Alert.alert(
        'Confirmation',
        'Do you want to use Light?',
        [
          {
            text: 'Cancel',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
          {
            text: 'OK',
            onPress: () => {
              setIconColor('blue');
              setIsTouchable(false);
              setInfo('WAITING');
              mqttClient.publish(mobileNumber+'/command', '{\n  \"trigger\":\"light\"\n}', 0, false);
              Toast.show({
                type: 'success',
                text1: 'COMMAND SENT',
                text2: 'Please Wait for Response !!!',
                visibilityTime: 3000,
              });
            },
          },
        ],
        { cancelable: false }
      );
    } else {
      console.warn('MQTT client not connected');
      ToastAndroid.showWithGravity(
        'MQTT client not connected',
        ToastAndroid.SHORT,
        ToastAndroid.CENTER
      );
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleLightOn} disabled={!isTouchable}>
      <Svg width="90" height="90" viewBox="0 0 128 128">
        <Ellipse cx="64" cy="116.87" rx="12.09" ry="7.13" fill="#424242" />
        <Path 
          d="M64 4C42.92 4 25.82 19.67 25.82 38.99c0 5.04 1.52 10.43 3.75 15.18c3.13 6.68 6.54 11.62 7.54 13.44c2.78 5.06 2.38 10.39 3.15 13.73c1.45 6.24 5.79 8.5 23.73 8.5s21.8-2.15 23.41-7.9c1.1-3.91.03-8.18 2.8-13.23c1-1.82 5.07-7.85 8.21-14.54c2.23-4.75 3.75-10.14 3.75-15.18C102.18 19.67 85.08 4 64 4z" 
          fill={iconColor} 
        />
        <Ellipse cx="64" cy="86.13" rx="21.94" ry="4.46" fill={iconColor} />
        <Ellipse cx="64" cy="86.13" rx="15.99" ry="2.06" fill={iconColor} />
        <G fill="none" stroke-width="2" stroke-miterlimit="10">
          <Path d="M53.3 56.77c-.62 1.56-2.23 4.77-1.39 6.21c1.95 3.35 6.6 4.55 6.6 7.63c0 4.7-3.42 19.93-3.42 19.93" stroke="#b26500" />
          <Path d="M74.03 56.21s2.24 4.8 1.29 6.95c-.71 1.6-4.98 4.18-5.53 4.61c-2.55 2 .84 22.78.84 22.78" stroke="#b26500" />
          <Path d="M53.3 56.77c3.44-6.8 5.21-22.32.84-21.53c-7.37 1.33 1.71 26.83 6.18 23.9s10.01-23.85 3.21-23.93c-6.8-.08.46 26.66 5.08 23.69c3.65-2.35 12.56-23.66 5.24-23.66c-6.23 0 .19 20.97.19 20.97" stroke="#ffffff" />
        </G>
        <Path 
          d="M85.89 87.06S80.13 89.84 64 89.84s-21.89-2.78-21.89-2.78s-.36 5.14.83 7.47c1.43 2.8 2.53 3.77 2.53 3.77l.6 2.85l-.24.75c-.31.98-.09 2.06.6 2.83l.52.58l.58 2.74l-.2.55c-.38 1.05-.12 2.22.66 3.02l.38.39l.47 2.24s2.38 5.08 15.16 5.08s15.16-5.08 15.16-5.08l.04-.19l.26-.26c.52-.51.69-1.27.44-1.95l-.15-.39l.62-2.96l1.09-1.15c.54-.57.66-1.41.31-2.11l-.5-.99l.63-2.97l.4-.31c.59-.65.6-1.63.34-2.3c-.2-.53-.04-1.13.37-1.52c.63-.6 1.44-1.51 2.04-2.64c1.23-2.29.84-7.45.84-7.45z" 
          fill="#82aec0" 
        />
        <Path d="M45.47 98.3l.54 2.87c5.82-.03 13.59.26 28.5-2.11c2.69-.61 5.92-1.82 2.35-1.32c0-.01-13.69 1.3-31.39.56z" fill="#2f7889" />
        <Path d="M47.47 108.07c6.44-.11 19.6-.75 33.74-3.82l.63-2.97c-14.79 3.36-28.7 3.96-34.95 4.04l.58 2.75z" fill="#2f7889" />
        <Path d="M80.31 108.49c-13.09 2.84-25.34 3.57-31.97 3.73l.43 2.04s.21 6.33 15.16 6.33s15.16-6.33 15.16-6.33s-6.38 1.82-14.23.93a.63.63 0 0 1-.01-1.26c4.69-.62 10.29-1.54 14.84-2.48l.62-2.96z" fill="#2f7889" />
        <Path d="M42.18 87.06s6.46 2.78 21.76 2.78s21.88-2.78 21.88-2.78" fill="none" stroke="#82aec0" strokeWidth="3.997" strokeLinecap="round" strokeMiterlimit="10" />
        <Path d="M49.88 10.32c3.91-.96 8-.48 10.8 2.92c.79.96 1.4 2.1 1.54 3.34c.28 2.39-1.2 4.65-2.96 6.31c-5.02 4.74-12.15 7.04-15.39 13.58c-.76 1.53-1.36 3.18-2.52 4.43c-1.16 1.25-3.09 2.01-4.6 1.21c-.8-.42-1.35-1.21-1.8-2c-2.84-5.06-2.63-11.51-.13-16.75c2.75-5.74 8.78-11.5 15.06-13.04z" fill={iconColor} />
        <Path d="M46.45 91.93c-.88-.4-.53-1.72.43-1.65c3.22.25 8.7.56 15.95.56c7.64 0 14.36-.57 18.28-.99c.97-.1 1.34 1.23.45 1.64c-3.02 1.42-8.55 3.04-18.03 3.04c-9.25 0-14.35-1.37-17.08-2.6z" fill="#ffd600" />
        <Path d="M51.94 102.03c-.67.24-1.36.57-1.7 1.19c-.12.23-.19.49-.14.75c.08.38.43.65.78.82c.7.34 1.49.43 2.26.44c1.59.02 3.17-.28 4.74-.58c.47-.09.95-.18 1.37-.41c.42-.23.78-.62.85-1.09c.1-.63-.35-1.24-.9-1.54c-1.9-1.05-5.34-.27-7.26.42z" fill="#94d1e0" />
        <Path d="M53.43 108.62c-.67.24-1.36.57-1.7 1.19c-.12.23-.19.49-.14.75c.08.38.43.65.78.82c.7.34 1.49.43 2.26.44c1.59.02 3.17-.28 4.74-.58c.47-.09.95-.18 1.37-.41c.42-.23.78-.62.85-1.09c.1-.63-.35-1.24-.9-1.54c-1.9-1.04-5.35-.26-7.26.42z" fill="#94d1e0" />
        <Path d="M50.01 84.2c.91.09 1.87.01 2.64-.48s1.26-1.49.95-2.35c-.16-.45-.51-.81-.85-1.15c-.75-.74-1.5-1.48-2.24-2.22c-.83-.83-1.66-1.65-2.56-2.4c-1.39-1.16-3.26-2.25-5.09-1.4c-1.56.72-1.93 2.14-1.24 3.63c1.47 3.13 4.89 6.01 8.39 6.37z" fill={iconColor} />
      </Svg>
      </TouchableOpacity>
      <View style={styles.infoContainer}>
      <Text style={styles.infoText}>{info}</Text>
      </View>
    </View>

    
  );
};

export default Light;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'left',
    padding: 10,
  },
  infoContainer: {
    marginTop: 7,
    alignItems: 'center',
  },
  infoText: {
    marginTop: 0,
    paddingVertical: 2,
    paddingHorizontal: 10,
    borderWidth: 2,
    borderColor: '#20232a',
    borderRadius: 5,
    backgroundColor: '#61dafb',
    color: '#20232a',
    textAlign: 'center',
    fontSize: 15,
    fontWeight: 'bold',
  },
});