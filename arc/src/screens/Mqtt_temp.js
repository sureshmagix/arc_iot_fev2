import React, { useEffect, useState } from 'react';
import { View, Text, SafeAreaView, ScrollView, RefreshControl, Button, Alert } from 'react-native';
import MQTTClient from '../components/MQTTClient'; // Assuming you have this utility
import AsyncStorage from '@react-native-async-storage/async-storage';
import Motor from '../components/Motor'; // Import your Motor component here

const MqttScreen = ({ userID }) => {
  const [starterData, setStarterData] = useState({ starter1: null });
  const [mqttConnected, setMqttConnected] = useState(false); // Track MQTT connection status

  const readStarterData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('starterData');
      if (jsonValue != null) {
        const parsedData = JSON.parse(jsonValue);
        setStarterData(parsedData);
        console.log('Starter data successfully retrieved from AsyncStorage:', parsedData);
      } else {
        console.log('No starter data found in AsyncStorage.');
      }
    } catch (error) {
      console.error('Error reading starter data:', error);
      Alert.alert('Error', 'Failed to read starter data');
    }
  };

  // Function to connect to MQTT
  const connectToMqtt = () => {
    if (starterData.starter1) {
      MQTTClient.create(userID, 
        [`${starterData.starter1}/data`, `${starterData.starter1}/command`], 
        {}, 
        onMessageArrived
      );
      setMqttConnected(true); // Update connection status
      console.log('MQTT Client connected');
    } else {
      console.error('Starter data not available. Cannot connect to MQTT.');
    }
  };

  // Reconnect function
  const reconnectToMqtt = () => {
    console.log('Attempting to reconnect to MQTT...');
    setMqttConnected(false); // Set connection status to false and retry connecting
    connectToMqtt();
  };

  // Handle incoming MQTT messages
  const onMessageArrived = (msg) => {
    if (msg && msg.data) {
      try {
        const parsedData = JSON.parse(msg.data);
        console.log('Parsed Data:', parsedData);
        // Handle data...
      } catch (error) {
        console.error('Failed to parse message data:', error);
      }
    }
  };

  // Effect for setting up MQTT connection
  useEffect(() => {
    readStarterData();
    connectToMqtt(); // Connect when the component mounts

    return () => {
      MQTTClient.disconnect(); // Clean up MQTT connection on unmount
      setMqttConnected(false);
    };
  }, [userID]); // Trigger reconnect if userID changes

  // Effect to handle reconnection logic (optional)
  useEffect(() => {
    if (!mqttConnected) {
      // Using a timeout to attempt reconnection every 5 seconds
      const intervalId = setInterval(() => {
        reconnectToMqtt();
      }, 5000);
      
      // Cleanup function to clear the interval
      return () => clearInterval(intervalId);
    }
  }, [mqttConnected]);

  // Function to handle motor button press
  const handleMotorPress = async () => {
    if (starterData.starter1) {
      const command = '{"action": "toggle"}';
      await MQTTClient.publishMessage(`${starterData.starter1}/command`, command);
      console.log('Motor command sent:', command);
    } else {
      console.error('Starter data is not available. Cannot send command.');
    }
  };

  return (
    <SafeAreaView>
      <ScrollView refreshControl={<RefreshControl refreshing={false} onRefresh={readStarterData} />}>
        <View>
          <Motor onPress={handleMotorPress} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default MqttScreen;
