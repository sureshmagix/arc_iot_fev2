import React, { useEffect, useState,useRef } from 'react';
import { View, Text, Button, StyleSheet, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Config from 'react-native-config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MQTTClient from '../components/MQTTClient';
// Sample data, replace this with real data fetching in a real application
const sampleData = {
  timestamp: '08/17/2024',
  deviceID: '123456',
  deviceState: 'Active',
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
};

// Display Component
const DeviceInfo = ({ data }) => {
  return (
    <View style={styles.deviceInfoContainer}>
      <Text style={styles.title}>Device Information</Text>
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

// Helper row for displaying label, value, and an icon
const InfoRow = ({ label, value, iconName }) => (
  <View style={styles.row}>
    <Icon name={iconName} size={24} style={styles.icon} />
    <Text style={styles.label}>{label}: </Text>
    <Text style={styles.value}>{value}</Text>
  </View>
);

function DeviceStatusScreen(props) {
  const [message, setMessage] = useState('');
  const [receivedMessage, setReceivedMessage] = useState('');
  const [mqttConnected, setMqttConnected] = useState(false); // Track MQTT connection status
  const [starterData, setStarterData] = useState({
    starter1: null,
    starter2: null,
    starter3: null,
    starter4: null,
  });
  const [starter1,setStarter1] = useState('')

  const [refreshing, setRefreshing] = useState(false);



  return (
    <ScrollView contentContainerStyle={styles.viewStyle}>
      <Text style={styles.headingStyle}>Coming Soon</Text>
      <Text style={styles.textStyle}>This is User screen</Text>
      <Button title='Home' onPress={() => props.navigation.navigate('Home')} />
      <DeviceInfo data={sampleData} />
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

export default DeviceStatusScreen;
