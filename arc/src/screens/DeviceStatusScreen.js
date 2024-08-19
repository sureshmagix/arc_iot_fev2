import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, Button, StyleSheet,Dimensions, ScrollView, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MQTTClient from '../components/MQTTClient';
import { useFocusEffect } from '@react-navigation/native';
import ICSTryagain from '../components/ICSTryagain';
import {Card} from '@rneui/themed';

const screenWidth = Dimensions.get('window').width;
const DeviceStatusScreen = (props) => {
  const [deviceData, setDeviceData] = useState({
    timestamp: '',
    deviceID: '',
    deviceState: '',
    simNumber: '9876543210',
    signalStrength: 'Strong',
    rssi: '-70 dBm',
    batteryLevel: '80%',
    networkName: 'Carrier X',
    networkType: '4G',
    errorCode: '0',
    diagCode: '0',
    location: {
      latitude: '37.773972',
      longitude: '-122.431297'
    }
  });
  const [currentDate, setCurrentDate] = useState('');

  const [mqttConnected, setMqttConnected] = useState(false);
  const [starter1, setStarter1] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    readStarterData();
  }, []);

  useEffect(() => {
    if (starter1) {
      connectToMqtt();
    }
  }, [starter1]);

  const connectToMqtt = () => {
    if (starter1) {
      MQTTClient.create(props.userID, [`${starter1}/deviceStatus`, `${starter1}/command`], {}, onMessageArrived);
      setMqttConnected(true);
      console.log("Connected to MQTT. Topic:", `${starter1}/deviceStatus`);
    } else {
      console.error('Starter1 is not set. Cannot connect to MQTT.');
    }
  };

  useEffect(() => {
    if (!mqttConnected && starter1) {
      const intervalId = setInterval(() => {
        console.log('Attempting to reconnect to MQTT...');
        connectToMqtt();
      }, 5000);

      return () => clearInterval(intervalId);
    }
  }, [mqttConnected, starter1]);

  const onMessageArrived = (msg) => {
    if (msg && msg.data) {
      try {
        const parsedData = JSON.parse(msg.data);
        console.log('Parsed Data:', parsedData);
        
        if (parsedData && Object.keys(parsedData).length > 0) {
          setDeviceData(parsedData);
        } else {
          console.log('Parsed data is null or empty');
        }
      } catch (error) {
        console.error('Failed to parse message data:', error);
      }
      
    }
    getTime();
  };

  const readStarterData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('starterData');
      if (jsonValue) {
        const parsedData = JSON.parse(jsonValue);
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

  const publishStopMessage = useCallback(() => {
    if (starter1) {
      MQTTClient.publishMessage(`${starter1}/command`, `{"action":"devstop"}`);
      console.log('Stop command sent.');
    } else {
      console.log('Starter1 is not set. Cannot send stop command.');
    }
  }, [starter1]);

  const publishStartMessage = useCallback(() => {
    if (starter1) {
      MQTTClient.publishMessage(`${starter1}/command`, `{"action":"devstart"}`);
      console.log('Published start trigger');
    }
  }, [starter1]);

  useFocusEffect(
    useCallback(() => {
      publishStartMessage(); // Publish start trigger on entering the screen

      return () => {
        publishStopMessage(); // Publish stop trigger on leaving the screen
      };
    }, [publishStartMessage, publishStopMessage])
  );

  const getTime = () => {
    const date = new Date();
    const dateString = `${date.getDate()}/${
      date.getMonth() + 1
    }/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
    setCurrentDate(dateString);
  };

  const onRefresh = () => {
    setRefreshing(true);
    readStarterData(); // Call readStarterData or another function to refresh data
    setRefreshing(false);
  };


  return (
    <ScrollView contentContainerStyle={styles.viewStyle}>
      {/* <Text style={styles.headingStyle}>Device Status</Text> */}
     
      <DeviceInfo data={deviceData} />

      <Card
            containerStyle={{
              marginTop: 4,
              marginBottom: 1,
              borderColor: 'darkblue',
              borderRadius: 20,
              alignItems: 'center',
              paddingVertical: 1,
            }}>
            <Card.Title style={styles.cardTitle}>
              {' '}
               <ICSTryagain />
            </Card.Title>
            <Text style={styles.textMobile}>Last Updated : {currentDate} </Text>
          </Card>
      <Button title='Home' onPress={() => props.navigation.navigate('App Home')} />
      {/* <Button title='Update' onPress={handleUpdatePress} /> */}
    </ScrollView>
  );
};

const DeviceInfo = ({ data }) => {
  return (
    <View style={styles.deviceInfoContainer}>
      <Text style={styles.title}>Device Status</Text>
      <InfoRow label="Timestamp" value={data.timestamp} iconName="time-outline" />
      <InfoRow label="Device ID" value={data.deviceID} iconName="id-card-outline" />
      <InfoRow label="Device State" value={data.deviceState} iconName="settings-outline" />
      <InfoRow label="SIM Number" value={data.simNumber} iconName="card-outline" />
      <InfoRow label="Signal Strength" value={data.signalStrength} iconName="wifi-outline" />
      <InfoRow label="RSSI" value={data.rssi} iconName="radio-outline" />
      <InfoRow label="Battery Level" value={data.batteryLevel} iconName="battery-half-outline" />
      <InfoRow label="Network Name" value={data.networkName} iconName="globe-outline" />
      <InfoRow label="Network Type" value={data.networkType} iconName="cellular-outline" />
      <InfoRow label="Error Code" value={data.errorCode} iconName="alert-circle-outline" />
      <InfoRow label="Diag Code" value={data.diagCode} iconName="information-circle-outline" />
      <InfoRow label="Latitude" value={data.location.latitude} iconName="earth-outline" />
      <InfoRow label="Longitude" value={data.location.longitude} iconName="location-outline" />
    </View>
  );
};

const InfoRow = ({ label, value, iconName }) => (
  <View style={styles.row}>
    <Icon name={iconName} size={24} style={styles.icon} />
    <Text style={styles.label}>{label}: </Text>
    <Text style={styles.value}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  viewStyle: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    padding: 10,
    backgroundColor: 'ivory',
    color:'black',
  },
  deviceInfoContainer: {
    marginTop: 10,
    width: '95%',
  },
  headingStyle: {
    fontSize: 25,
    color: 'blue',
    textAlign: "center",
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'blue',
  },
  value: {
    fontSize: 14,
  },
  icon: {
    marginRight: 10,
    color:'black',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color:'blue',
  },
  
});

export default DeviceStatusScreen;
