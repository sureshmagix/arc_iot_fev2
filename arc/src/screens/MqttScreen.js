import React, { useEffect, useState,useRef } from 'react';
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
  TextInput,
} from 'react-native';
import {CheckBox} from 'react-native-elements';
import {Card} from '@rneui/themed';
import CircularProgress from 'react-native-circular-progress-indicator';
import MQTT from 'sp-react-native-mqtt';
import axios from 'axios';
import {useFocusEffect} from '@react-navigation/native';
import Pump from '../components/Pump'
import InternetConnectionStatusIcon from '../components/InternetConnectionStatus_icon';
import Motor from '../components/Motor';
import ICSAlert from '../components/ICSAlert';
import ICSTryagain from '../components/ICSTryagain';
import Mode from '../components/Mode';
import MotorLeft from '../components/CardComponents/MotorLeft';
import Light from '../components/Light';
import {RadioButton} from 'react-native-paper';
import Config from 'react-native-config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MQTTClient from '../components/MQTTClient';


const screenWidth = Dimensions.get('window').width;
  



const MqttScreen = ({ userID }) => {
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
  const [mobileNumber, setMobileNumber] = useState(''); // Default value
  const [currentDate, setCurrentDate] = useState('');
  const [rV, setRV] = useState(0);
  const [yV, setYV] = useState(0);
  const [bV, setBV] = useState(0);
  const [rA, setRA] = useState(0);
  const [yA, setYA] = useState(0);
  const [bA, setBA] = useState(0);
  const [ms, setMs] = useState('...');
  const [mm, setMm] = useState('...');
  const [msc, setMsc] = useState('...');
  const [msf, setMsf] = useState('...');
  const [ls, setLs] = useState('');
  const [ebPower, setEbPower] = useState('...');
  const [userData, setUserData] = useState('');
  const [connectionStatus, setConnectionStatus] = useState('Disconnected');
  const [selectedValue, setSelectedValue] = useState('');
  const [topic,setTopic]=useState('')

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
        console.log('Parsed Data:', parsedData); // Logging the parsed data for debugging
        
        // Handle incoming data
        if (parsedData && Object.keys(parsedData).length > 0) {
          setUserData(parsedData);
          data_req(parsedData); // Pass the valid parsed data
          
          // Update mm from incoming data
          if (parsedData.mm) {
            setMm(parsedData.mm); // Update mm from incoming data
          }
        } else {
          console.log('Parsed data is null or empty');
        }
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
        }, 500);
        
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
  


  


  


  const getTime = () => {
    const date = new Date();
    const dateString = `${date.getDate()}/${
      date.getMonth() + 1
    }/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
    setCurrentDate(dateString);
  };

  const data_req = (incomingUserData) => {
    if (incomingUserData) {
      setRV(incomingUserData.rV || 0);
      setYV(incomingUserData.yV || 0);
      setBV(incomingUserData.bV || 0);
      setRA(incomingUserData.rA || 0);
      setYA(incomingUserData.yA || 0);
      setBA(incomingUserData.bA || 0);
      setMs(incomingUserData.ms || '...');
      setMm(incomingUserData.mm || '...');
      setMsc(incomingUserData.msc || '...');
      setMsf(incomingUserData.msf || '...');
      setEbPower(incomingUserData.ebPower || '...');
      getTime();
      console.log('Data Updated');
    } else {
      console.log('incomingUserData is null or undefined');
    }
  };
  




  const readStarterData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('starterData');
      if (jsonValue != null) {
        const parsedData = JSON.parse(jsonValue);
        setStarterData(parsedData);
        console.log('Starter data successfully retrieved from AsyncStorage:', parsedData);
        Alert.alert('Message', 'Data read from storage');
      } else {
        console.log('No starter data found in AsyncStorage.');
      }
    } catch (error) {
      console.error('Error reading starter data:', error);
      Alert.alert('Error', 'Failed to read starter data');
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    data_req();
    setRefreshing(false);
  };

  const handleReset = () => {

    // Show confirmation alert before sending the reset command
    Alert.alert(
      'Confirm Action',
      'Are you sure you want to send the RESET command?',
      [
        {
          text: 'CANCEL',
          onPress: () => console.log('RESET command cancelled'),
          style: 'cancel',
        },
        {
          text: 'SEND COMMAND',
          onPress: () => {
            console.log('Reset button pressed');
            readStarterData();
            console.log('Starter data read:'+`${starterData.starter1}` )
            setTopic(`${starterData.starter1}`+'/command')
            console.log("RESET TOPIC SET AS:"+`${starterData.starter1}`+'/command');
            MQTTClient.publishMessage(`${starterData.starter1}`+'/command','{\n  "trigger":"rst"\n}');
            setMessage('');
          },
        },
      ],
      {cancelable: false},
    );
 
  };

  const handleRadioButtonChange = (value) => {
    console.log(`${value} mode`);
    setSelectedValue(value);  // Update the selected radio button
    readStarterData();  // Fetch or read required data
    console.log('Starter data read: ' + `${starterData.starter1}`);
    setTopic(`${starterData.starter1}` + '/command');
    console.log("RESET TOPIC SET AS: " + `${starterData.starter1}` + '/command');
    MQTTClient.publishMessage(`${starterData.starter1}` + '/command', `{"phase":"${value}"}`); // Publish the selected mode
    setMessage(''); // You can reset or change messages if needed
  };


  useEffect(() => {
    // Set the selectedValue based on the mm value
    switch (mm) {
      case '2Phase':
        setSelectedValue('2Phase');
        break;
      case '3Phase':
        setSelectedValue('3Phase');
        break;
      case 'Both':
        setSelectedValue('Both');
        break;
      default:
        setSelectedValue(''); // or some default value if mm is not set
    }
  }, [mm]);



  return (
    <SafeAreaView>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        <View style={styles.centerTextContainer}>
          <Text style={styles.textMobile}>Starter No: {starterData.starter1}</Text>
        </View>

        <View style={styles.container}>
          <Card
            containerStyle={{
              marginTop: 4,
              marginBottom: 1,
              borderColor: 'darkblue',
              borderRadius: 20,
              paddingHorizontal: 1,
              paddingVertical: 1,
              paddingBottom: 1,
              paddingTop: 1,
              flex: 1,
              justifyContent: 'right',
              alignItems: 'flex-start',
            }}>
            <View style={styles.container3}>
              <View style={styles.leftContainer}>
                <Motor />
              </View>
              <View style={styles.rightContainer}>
                <Light />
              </View>
            </View>
          </Card>

          <Card
            containerStyle={{
              marginTop: 5,
              marginBottom: 5,
              borderColor: 'darkblue',
              borderRadius: 20,
            }}>
            <Card.Title style={styles.cardTitle}>
              EB POWER STATUS: {ebPower}
            </Card.Title>
            <Card.Divider />

            <View style={styles.dialsContainer}>
              <View style={styles.dial}>
                <CircularProgress
                  value={rV}
                  maxValue={600}
                  radius={screenWidth * 0.08}
                  textColor="#000"
                  activeStrokeColor="#ff0000"
                  inActiveStrokeColor="#d7d7d7"
                  inActiveStrokeOpacity={0.2}
                  textStyle={{
                    fontSize: screenWidth * 0.032,
                    fontWeight: 'bold',
                  }}
                  valueSuffix="V"
                />
                <Text style={styles.dialLabel}>RB</Text>
              </View>
              <View style={styles.dial}>
                <CircularProgress
                  value={yV}
                  maxValue={600}
                  radius={screenWidth * 0.08}
                  textColor="#000"
                  activeStrokeColor="#ffdd00"
                  inActiveStrokeColor="#d7d7d7"
                  inActiveStrokeOpacity={0.2}
                  textStyle={{
                    fontSize: screenWidth * 0.032,
                    fontWeight: 'bold',
                  }}
                  valueSuffix="V"
                />
                <Text style={styles.dialLabel}>YB</Text>
              </View>
              <View style={styles.dial}>
                <CircularProgress
                  value={bV}
                  maxValue={600}
                  radius={screenWidth * 0.08}
                  textColor="#000"
                  activeStrokeColor="#0000ff"
                  inActiveStrokeColor="#d7d7d7"
                  inActiveStrokeOpacity={0.2}
                  textStyle={{
                    fontSize: screenWidth * 0.032,
                    fontWeight: 'bold',
                  }}
                  valueSuffix="V"
                />
                <Text style={styles.dialLabel}>BR</Text>
              </View>
            </View>

            <View style={styles.dialsContainer}>
              <View style={styles.dial}>
                <CircularProgress
                  value={rA}
                  maxValue={100}
                  radius={screenWidth * 0.08}
                  textColor="#000"
                  activeStrokeColor="#ff0000"
                  inActiveStrokeColor="#d7d7d7"
                  inActiveStrokeOpacity={0.2}
                  textStyle={{
                    fontSize: screenWidth * 0.032,
                    fontWeight: 'bold',
                  }}
                  valueSuffix="A"
                />
                <Text style={styles.dialLabel}>IR</Text>
              </View>
              <View style={styles.dial}>
                <CircularProgress
                  value={yA}
                  maxValue={100}
                  radius={screenWidth * 0.08}
                  textColor="#000"
                  activeStrokeColor="#ffdd00"
                  inActiveStrokeColor="#d7d7d7"
                  inActiveStrokeOpacity={0.2}
                  textStyle={{
                    fontSize: screenWidth * 0.032,
                    fontWeight: 'bold',
                  }}
                  valueSuffix="A"
                />
                <Text style={styles.dialLabel}>IY</Text>
              </View>
              <View style={styles.dial}>
                <CircularProgress
                  value={bA}
                  maxValue={100}
                  radius={screenWidth * 0.08}
                  textColor="#000"
                  activeStrokeColor="#0000ff"
                  inActiveStrokeColor="#d7d7d7"
                  inActiveStrokeOpacity={0.2}
                  textStyle={{
                    fontSize: screenWidth * 0.032,
                    fontWeight: 'bold',
                  }}
                  valueSuffix="A"
                />
                <Text style={styles.dialLabel}>IB</Text>
              </View>
            </View>
          </Card>

          {/* RADIO CARD */}

          <Card
            containerStyle={{
              marginTop: 1,
              marginBottom: 1,
              borderColor: 'darkblue',
              borderRadius: 20,
              alignItems: 'center',
              paddingVertical: 1,
            }}>
            <Card.Title style={styles.cardTitle}>
              MOTOR RUNNING IN: {mm}
            </Card.Title>
            <Card.Divider />
            <View style={styles.radioContainer}>
              <View style={styles.radioWrapper}>
                <RadioButton
                  value="2Phase"
                  status={selectedValue === '2Phase' ? 'checked' : 'unchecked'}
                  onPress={() => handleRadioButtonChange('2Phase')}
                />
                <Text style={styles.radioLabel}>2 Phase</Text>
              </View>
              <View style={styles.radioWrapper}>
                <RadioButton
                  value="3Phase"
                  status={selectedValue === '3Phase' ? 'checked' : 'unchecked'}
                  onPress={() => handleRadioButtonChange('3Phase')}
                />
                <Text style={styles.radioLabel}>3 Phase</Text>
              </View>
              <View style={styles.radioWrapper}>
                <RadioButton
                  value="Both"
                  status={selectedValue === 'Both' ? 'checked' : 'unchecked'}
                  onPress={() => handleRadioButtonChange('Both')}
                />
                <Text style={styles.radioLabel}>Both</Text>
              </View>
            </View>
            <Button title="RESET" onPress={handleReset} />
          </Card>

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
              Last Updated on <ICSTryagain />
            </Card.Title>
            <Text style={styles.textMobile}>{currentDate} </Text>
          </Card>
        </View>
      </ScrollView>
    </SafeAreaView>
  );

  // return (
  //   <View style={styles.container}>
  //             <View>
  //         <Text style={styles.textMobile}>Starter No: {starterData.starter1}</Text>
  //       </View>
  //     <Text style={styles.cardTitle}>MQTT Publish and Subscribe</Text>
  //     <TextInput
  //       style={styles.textMobile}
  //       placeholder="Enter message to publish"
  //       value={message}
  //       onChangeText={setMessage}
  //     />
  //     <Button title="Publish Message" onPress={handlePublish} />
  //     <Text style={styles.cardTitle}>Received Message:</Text>
  //     <Text style={styles.statusData}>{receivedMessage}</Text>
  //   </View>
  // );
};


export default MqttScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
  },
  motor_container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  scrollView: {
    paddingBottom: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leftColumn: {
    flex: 1,
  },
  rightColumn: {
    flex: 1,
    alignItems: 'flex-end',
  },
  connectionStatus: {
    fontSize: screenWidth * 0.04,
    textAlign: 'center',
    fontWeight: 'bold',
    fontStyle: 'italic',
    marginBottom: 8,
    marginTop: 1,
    color: 'limegreen',
  },
  titleText: {
    fontSize: screenWidth * 0.05,
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 1,
    color: 'black',
  },
  voltageText: {
    fontSize: screenWidth * 0.035,
    textAlign: 'left',
    fontWeight: 'bold',
    marginBottom: 1,
    color: 'blue',
  },
  cardTitle: {
    fontSize: screenWidth * 0.04,
    textAlign: 'center',
    textAlignVertical: 'auto',
    fontWeight: 'bold',
    marginTop: 1,
    marginBottom: 1,
    color: 'blue',
    paddingTop: 1,
  },
  statusData: {
    fontSize: screenWidth * 0.05,
    textAlign: 'left',
    fontWeight: 'bold',
    marginTop: 1,
    marginBottom: 1,
    color: 'crimson',
    paddingTop: 1,
  },
  dialsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 1,
  },
  dial: {
    alignItems: 'center',
  },
  dialLabel: {
    marginTop: 5,
    fontSize: screenWidth * 0.035,
    fontWeight: 'bold',
    color: 'black',
  },
  textMobile: {
    fontSize: screenWidth * 0.04,
    fontWeight: 'bold',
    fontStyle: 'italic',
    color: 'blue',
    alignContent: 'center',
  },
  centerTextContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  checkboxWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkboxLabel: {
    marginLeft: 5,
    fontSize: screenWidth * 0.035,
    fontWeight: 'bold',
    color: 'black',
  },
  container3: {
    flexDirection: 'row', // Align children in a row
    justifyContent: 'space-between', // Distribute space between the children
    alignItems: 'center', // Vertically center the children
    paddingHorizontal: 10, // Optional: Add padding on the sides
    width: '100%', // Ensures the container takes up the full width
  },
  leftContainer: {
    flex: 1, // Takes up remaining space on the left
    alignItems: 'flex-start', // Aligns the content to the left
  },
  rightContainer: {
    flex: 1, // Takes up remaining space on the right
    alignItems: 'flex-start', // Aligns the content to the right
    textAlign: 'left',
  },
  voltageText: {
    color: 'darkblue', // Style for the text
    fontSize: 16, // Adjust font size as needed
  },
  radioContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 5,
  },
  radioWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 1,
  },
  radioLabel: {
    marginLeft: 1,
    fontSize: 12,
    color: '#000',
  },
});