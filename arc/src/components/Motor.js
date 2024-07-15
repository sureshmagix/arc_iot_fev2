import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import MQTT from 'sp-react-native-mqtt';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import { Alert } from 'react-native';
import Config from 'react-native-config';

const Motor = () => {
  const [mqttClient, setMqttClient] = useState(null);
  const [iconColor, setIconColor] = useState('blue');
  const [info, setInfo] = useState('WAITING');
  const [mobileNumber, setMobileNumber] = useState('');
  const [isTouchable, setIsTouchable] = useState(true);
  const [mm, setMm] = useState('');
  const [connectionStatus, setConnectionStatus] = useState('Disconnected');
  const mqttClientRef = useRef(null);
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
          clientId: 'motor_client_id',
          keepalive: 10,
          cleanSession: true,
        });

        client.on('connect', () => {
          console.log('MQTT connected');
          setMqttClient(client);
          client.subscribe(topic+'/data', 0);
        });

        client.on('message', function (msg) {
          console.log('MQTT Message Received:', msg);
          const userData = JSON.parse(msg.data);
          setMm(userData.ms);
          console.log(`${userData.ms} in motor`)

          if (msg.topic === topic+'/data') {
            let newColor = 'blue';
            if (userData.ms === 'off') {
              newColor = 'red';
              setInfo('Motor OFF');
            } else if (userData.ms === 'eboff') {
              newColor = 'grey';
              setInfo('POWER FAIL');
            } else if (userData.ms === 'on') {
              newColor = 'green';
              setInfo('Motor ON');
            } else if (userData.ms === 'auto') {
              newColor = 'darkgoldenrod';
              setInfo('AUTO');
            }
            else if (userData.ms === 'manual') {
              newColor = 'mediumorchid';
              setInfo('MANUAL');
            }
            else if (userData.ms === 'break') {
              newColor = '#456740';
              setInfo(`${userData.bkm}`);
              handleBreak();
            }else {
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

  const handleMotorOn = () => {
    if (mqttClient && mqttClient.isConnected()) {
      Alert.alert(
        'Confirmation',
        'Do you want to send the motor command?',
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
              mqttClient.publish(mobileNumber+'/command', '{\n  \"trigger\":\"motor\"\n}', 0, false);
              setInfo('WAITING');
              console.log('Motor command sent')
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

    }
  };
  const reconnectMqtt = () => {
    MQTT.createClient({
      uri: Config.MQTT_URL, //'mqtt://13.233.116.176:1883',
      clientId: 'mac_client_id',
      keepalive: 10,
      cleanSession: true,
    })
      .then(client => {
        setConnectionStatus('Connected to Server');
        console.log('MQTT reconnected successfully');
      })
      .catch(error => {
        console.log('Failed to reconnect MQTT:', error);
      });
  };
  const handleBreak = () => {
    
     Alert.alert(
        'Confirmation',
        'BREAK DOWN !!! Please RESET motor !!!',
        [
          {
            text: 'Cancel',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
          {
            text: 'OK',
            onPress:()=>{
              console.log('RESET PRESSED')
            },
          },
        ],
        { cancelable: false }
      );

  };

  const publishSelectedValue = (value) => {
    Alert.alert(
      'Confirm Action',
      `Are you sure you want to send the command: ${value}?`,
      [
        {
          text: 'CANCEL',
          onPress: () => console.log('Command cancelled'),
          style: 'cancel',
        },
        {
          text: 'SEND COMMAND',
          onPress: () => {
            console.log('Publishing selected value:', value);
            const topic_mqtt = `${mobileNumber}/command`;

            MQTT.createClient({
              uri: Config.MQTT_URL, //'mqtt://13.233.116.176:1883',
              clientId: 'mac_client_id',
              keepalive: 10,
              cleanSession: true,
            })
              .then(function (client) {
                client.on('closed', function () {
                  console.log('MQTT Client Closed');
                  setConnectionStatus('Disconnected');
                });

                client.on('error', function (msg) {
                  console.log('MQTT Client Error:', msg);
                  setConnectionStatus('Error');
                  reconnectMqtt(); // Optionally, attempt to reconnect on error
                });

                client.on('connect', function () {
                  console.log('MQTT Client Connected');
                  setConnectionStatus('Connected to Server');

                  // Ensure the client is connected before publishing
                  if (client.isConnected()) {
                    console.log(`Publishing to ${mobileNumber}/command`);
                    client.publish(
                      `${mobileNumber}/command`,
                      value,
                      0,
                      false,
                    );
                  } else {
                    console.log('MQTT Client not connected, cannot publish');
                  }

                  mqttClientRef.current = client;
                });

                client.connect();
              })
              .catch(function (err) {
                console.log('MQTT Client Creation Error:', err);
                setConnectionStatus('Error');
              });
          },
        },
      ],
      { cancelable: false }
    );
  };
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleMotorOn} disabled={!isTouchable}>
        <Svg width="100" height="100" viewBox="0 0 100 100">
          <Path
            d="M46 69V27c-2.2 0-4 1.8-4 4v34c0 2.2 1.8 4 4 4zM31 45h3v6h-3zM40 63V33c-2.2 0-4 1.8-4 4v22c0 2.2 1.8 4 4 4zM57 69h18v4H57zM76 67h8V29H48v38h28zM55 33h22c1.7 0 3 1.3 3 3s-1.3 3-3 3H55c-1.7 0-3-1.3-3-3s1.3-3 3-3zm0 12h22c1.7 0 3 1.3 3 3s-1.3 3-3 3H55c-1.7 0-3-1.3-3-3s1.3-3 3-3zm-3 15c0-1.7 1.3-3 3-3h22c1.7 0 3 1.3 3 3s-1.3 3-3 3H55c-1.7 0-3-1.3-3-3zm-23 1V35H15.4L13 37.4v21.2l2.4 2.4H29zm-8.7-20.7c.4-.4 1-.4 1.4 0 .2.2 5.3 5.3 5.3 9.7 0 3.3-2.7 6-6 6s-6-2.7-6-6c0-4.4 5.1-9.5 5.3-9.7zM90 27h-4v42h4c2.2 0 4-1.8 4-4V31c0-2.2-1.8-4-4-4zM18 25h9.6l1.4-1.4V19H15v4.6l1.4 1.4zM19 27h6v6h-6zM6 45h5v6H6zM76 75H16.7l-2.3 6h71.2l-2.3-6z"
            fill={iconColor}
          />
        </Svg>
      </TouchableOpacity>
      <View style={styles.infoContainer}>
      <Text style={styles.infoText}>{info}</Text>
      </View>
    </View>

    
  );
};

export default Motor;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'left',
    padding: 10,
  },
  infoContainer: {
    marginTop: 1,
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