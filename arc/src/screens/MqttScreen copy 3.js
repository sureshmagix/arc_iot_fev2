import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Alert,
  Dimensions,
  RefreshControl,
  Button,
  Text,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Card } from '@rneui/themed';
import CircularProgress from 'react-native-circular-progress-indicator';
import MQTTClient from '../components/MQTTClient';
import Motor from '../components/Motor';
import Light from '../components/Light';
import AsyncStorage from '@react-native-async-storage/async-storage';

const screenWidth = Dimensions.get('window').width;

const MqttScreen = ({ route, userID }) => {
  const { selectedStarter } = route.params; // Get selected starter from navigation route
  const [message, setMessage] = useState('');
  const [receivedMessage, setReceivedMessage] = useState('');
  const [mqttConnected, setMqttConnected] = useState(false); // Track MQTT connection status
  const [starter1, setStarter1] = useState(''); // Will be updated with selected starter
  const [starterData, setStarterData] = useState({
    starter1: null,
    starter2: null,
    starter3: null,
    starter4: null,
  });
  const [refreshing, setRefreshing] = useState(false);

  // Function to read starter data from AsyncStorage
  const readStarterData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('starterData');
      if (jsonValue) {
        const parsedData = JSON.parse(jsonValue);
        setStarterData(parsedData);
        setStarter1(parsedData[selectedStarter]); // Set the selected starter from AsyncStorage
        console.log('Starter data retrieved:', parsedData);
      } else {
        console.log('No starter data found in AsyncStorage.');
      }
    } catch (error) {
      console.error('Error reading starter data:', error);
      Alert.alert('Error', 'Failed to read starter data');
    }
  };

  useEffect(() => {
    // Read starter data on mount
    readStarterData();
  }, []);

  useEffect(() => {
    if (starter1) {
      connectToMqtt();
      MQTTClient.publishMessage(`${starter1}/command`, `{"action":"start"}`);
    }
  }, [starter1]);

  const connectToMqtt = () => {
    if (starter1) {
      MQTTClient.create(userID, [`${starter1}/data`, `${starter1}/command`], {}, onMessageArrived);
      setMqttConnected(true);
      console.log('Connected to MQTT. Topic:', `${starter1}/command`);
    } else {
      console.error('Starter1 is not set. Cannot connect to MQTT.');
    }
  };

  const onMessageArrived = (msg) => {
    if (msg && msg.data) {
      try {
        const parsedData = JSON.parse(msg.data);
        console.log('Parsed Data:', parsedData);
        if (parsedData && Object.keys(parsedData).length > 0) {
          setReceivedMessage(parsedData);
        }
      } catch (error) {
        console.error('Failed to parse message data:', error);
      }
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    readStarterData();
    setRefreshing(false);
  };

  return (
    <SafeAreaView>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.centerTextContainer}>
          <Text style={styles.textMobile}>Starter No: {starter1}</Text>
        </View>

        <View style={styles.container}>
          <Card
            containerStyle={{
              marginTop: 4,
              marginBottom: 1,
              borderColor: 'darkblue',
              borderRadius: 20,
            }}
          >
            <View style={styles.container3}>
              <View style={styles.leftContainer}>
                <Motor onPress={() => {}} mqttData={receivedMessage} />
              </View>
              <View style={styles.rightContainer}>
                <Light onPress={() => {}} mqttData={receivedMessage} />
              </View>
            </View>
          </Card>

          <Card
            containerStyle={{
              marginTop: 5,
              marginBottom: 5,
              borderColor: 'darkblue',
              borderRadius: 20,
            }}
          >
            <Card.Title style={styles.cardTitle}>
              EB POWER STATUS: ...
            </Card.Title>
            <Card.Divider />
            {/* Display additional content */}
          </Card>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
  },
  centerTextContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textMobile: {
    fontSize: screenWidth * 0.04,
    fontWeight: 'bold',
    fontStyle: 'italic',
    color: 'blue',
  },
  container3: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    width: '100%',
  },
  leftContainer: {
    flex: 1,
    alignItems: 'flex-start',
  },
  rightContainer: {
    flex: 1,
    alignItems: 'flex-start',
  },
  cardTitle: {
    fontSize: screenWidth * 0.04,
    fontWeight: 'bold',
    color: 'blue',
  },
});

export default MqttScreen;
