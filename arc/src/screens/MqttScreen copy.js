import React, { useEffect, useState } from 'react';
import { View, Text,Button, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
function MqttScreen(props){

    const [starterData, setStarterData] = useState({
        starter1: null,
        starter2: null,
        starter3: null,
        starter4: null,
      });
  // Function to read all the values and store them in a temporary state variable
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

  // Use useEffect to read the data when the component mounts
  useEffect(() => {
    readStarterData();
  }, []);




    return(
        <View style={styles.viewStyle}>

        <Text style={styles.headingStyle}>Comming Soon</Text>
        <Text style={styles.textStyle}>{JSON.stringify(starterData, null, 2)} </Text>
        <Button title='Home' onPress={()=> props.navigation.navigate('App Home')}/>
            
        </View>
    )
}

const styles = StyleSheet.create({
    viewStyle:{
        display: 'flex',
        justifyContent:'center',
        alignItems:'center',
        flex:1,

    },

    textStyle:{
        fontSize: 28,
        color:'black',
    },
    headingStyle:{
        fontSize: 30,
        color:'black',
        textAlign:"center",
    }

}
)

export default MqttScreen;