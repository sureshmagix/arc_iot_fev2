import React, {useState, useEffect, useRef} from 'react';
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
import {CheckBox} from 'react-native-elements';
import {Card} from '@rneui/themed';
import CircularProgress from 'react-native-circular-progress-indicator';
import MQTT from 'sp-react-native-mqtt';
import axios from 'axios';
import {useFocusEffect} from '@react-navigation/native';
import Pump from '../Components/Pump'
import InternetConnectionStatusIcon from '../Components/InternetConnectionStatus_icon';
import Motor from '../Components/Motor';
import ICSAlert from '../Components/ICSAlert';
import ICSTryagain from '../Components/ICSTryagain';
import Mode from '../Components/Mode';
import MotorLeft from '../Components/CardComponents/MotorLeft';
import Light from '../Components/Light';
import {RadioButton} from 'react-native-paper';
import Config from 'react-native-config';

const screenWidth = Dimensions.get('window').width;
  


function HomeScreen() {




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
    const [userData, setUserData] = useState(null);
    const [connectionStatus, setConnectionStatus] = useState('Disconnected');
    const mqttClientRef = useRef(null);
      // New state for checkboxes
  const [selectedValue, setSelectedValue] = useState('');
  
  // const updatePhase = (value) => {
  //   console.log(`i am user data ${value}`)
  //   if (value === '3Phase') {
  //     setSelectedValue('3Phase');
  //   }
  // }
  const onRefresh = () => {
    setRefreshing(true);
    data_req();
    setRefreshing(false);
  };






  return (
    <SafeAreaView>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        <View style={styles.centerTextContainer}>
          <Text style={styles.textMobile}>Starter No: '9962577674'</Text>
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
                  value={mm}
                  status={selectedValue === '2Phase' ? 'checked' : 'unchecked'}
                  onPress={() => {
                    console.log('Two Phase mode');
                    publishSelectedValue('{"phase":"2Phase"}');
                 
                  }}
                />
                <Text style={styles.radioLabel}>2 Phase</Text>
              </View>
              <View style={styles.radioWrapper}>
                <RadioButton
                  value={mm}
                  status={selectedValue === '3Phase' ? 'checked' : 'unchecked'}
                  onPress={() => {
                     console.log('Three Phase mode');
                    publishSelectedValue('{"phase":"3Phase"}');
                 
                  }}
                />
                <Text style={styles.radioLabel}>3 Phase</Text>
              </View>
              <View style={styles.radioWrapper}>
                <RadioButton
                  value={mm}
                  status={selectedValue === 'Both' ? 'checked' : 'unchecked'}
                  onPress={() => {
                    console.log('Both Phase mode');
                    publishSelectedValue('{"phase":"Both"}');
                 
                 
                  }}
                />
                <Text style={styles.radioLabel}>Both</Text>
              </View>
            </View>
            <Button title="RESET"  />
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
}

export default HomeScreen;

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