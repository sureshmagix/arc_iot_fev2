import {useEffect, useState} from 'react';
import { View, Text, Button, StyleSheet, Image } from 'react-native';

function HomeScreen(props) {

    const [userData, setUserData] = useState('');
    const [starterData,setStarterData]= useState('');
  
    async function getUserData() {
      const token = await AsyncStorage.getItem('token');
      console.log(token);
      axios
        .post('http://ec2-13-233-116-176.ap-south-1.compute.amazonaws.com:3001/userdata', {token: token})
        .then(res => {
          console.log(res.data);
          setUserData(res.data.data);
        })
        .catch(error => {
          console.error('Error fetching data:', error);
          if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.error('Response data:', error.response.data);
            console.error('Response status:', error.response.status);
            console.error('Response headers:', error.response.headers);
          } else if (error.request) {
            // The request was made but no response was received
            console.error('Request data:', error.request);
          } else {
            // Something happened in setting up the request that triggered an Error
            console.error('Error message:', error.message);
          }
          Alert.alert('Error', 'Failed to fetch user data');
  
  
  
        })
        
        
    }

    async function storeStarterData(starterData) {
      try {
        // Convert the starterData into a JSON string before storing it
        const jsonValue = JSON.stringify({
          starter1: starterData.starter1,
          starter2: starterData.starter2,
          starter3: starterData.starter3,
          starter4: starterData.starter4,
        });
    
        // Store the JSON string in AsyncStorage
        await AsyncStorage.setItem('starterData', jsonValue);
        console.log('Starter data successfully stored in AsyncStorage.');
      } catch (error) {
        console.error('Error storing starter data:', error);
        Alert.alert('Error', 'Failed to store starter data');
      }
    }

    async function getStarterData() {
      const token = await AsyncStorage.getItem('token');
      console.log(token);
      axios
        .post('http://ec2-13-233-116-176.ap-south-1.compute.amazonaws.com:3001/starterdata', { token: token })
        .then(res => {
          console.log(res.data);
          const starterData = res.data.data;
    
          // Set the starter data in your state (assuming you have a state setter function)
          setStarterData(starterData);
    
          // Store the fetched data in AsyncStorage in JSON format
          storeStarterData(starterData);
        })
        .catch(error => {
          console.error('Error fetching data:', error);
          if (error.response) {
            console.error('Response data:', error.response.data);
            console.error('Response status:', error.response.status);
            console.error('Response headers:', error.response.headers);
          } else if (error.request) {
            console.error('Request data:', error.request);
          } else {
            console.error('Error message:', error.message);
          }
          Alert.alert('Error', 'Failed to fetch user data');
        });
    }


    useEffect(() => {
        const timer = setTimeout(() => {
            getUserData();
            getStarterData();
            props.navigation.navigate('MqttScreen');
        }, 5000);

        // Clean up the timer when the component is unmounted
        return () => clearTimeout(timer);
    }, []);

    return (
        <View style={styles.viewStyle}>
            <Image source={require('../assets/logo.png')} style={styles.logoStyle} />
            <Text style={styles.headingStyle}>Welcome to ArchidTech</Text>
            <Text style={styles.textStyle}>This is Home screen</Text>
            <Button title='START' onPress={() => props.navigation.navigate('MqttScreen')} />
        </View>
    );
}

const styles = StyleSheet.create({
    viewStyle: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        backgroundColor: '#f0f0f0', // Adding a light background color
    },
    logoStyle: {
        width: 100, // Adjust the width as needed
        height: 100, // Adjust the height as needed
        marginBottom: 20,
    },
    textStyle: {
        fontSize: 20,
        color: 'black',
        marginBottom: 20,
    },
    headingStyle: {
        fontSize: 24,
        color: '#333333',
        textAlign: "center",
        marginBottom: 20,
        fontWeight: 'bold', // Make the text bold
    }
});

export default HomeScreen;
