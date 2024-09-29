import { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, Image, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'; // Importing the icon library
import InternetConnectionStatusIcon from '../components/InternetConnectionStatus_icon';


function HomeScreen(props) {

    const [userData, setUserData] = useState('');
    const [starterData, setStarterData] = useState('');

    async function getUserData() {
        const token = await AsyncStorage.getItem('token');
        console.log(token);
        axios
            .post('http://ec2-13-233-116-176.ap-south-1.compute.amazonaws.com:3001/userdata', { token: token })
            .then(res => {
                console.log(res.data);
                setUserData(res.data.data);
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

    async function storeStarterData(starterData) {
        try {
            const jsonValue = JSON.stringify({
                starter1: starterData.starter1,
                starter2: starterData.starter2,
                starter3: starterData.starter3,
                starter4: starterData.starter4,
            });
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
                setStarterData(starterData);
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
                getUserData();
          getStarterData();
          // props.navigation.navigate('MqttScreen');
});


    return (
        <View style={styles.viewStyle}>
            <Image source={require('../assets/logo.png')} style={styles.logoStyle} />
            <Text style={styles.headingStyle}>Welcome to ArchidTech</Text>
            <Text style={styles.textStyle}>This is the Home screen</Text>
            <InternetConnectionStatusIcon />
        
            <TouchableOpacity style={styles.buttonStyle} onPress={() => props.navigation.navigate('MqttScreen')}>
                <Icon name="cloud" size={20} color="#fff" style={styles.iconStyle} />
                <Text style={styles.buttonText}>IOT</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonStyle} onPress={() => props.navigation.navigate('SmsScreen')}>
                <Icon name="envelope" size={20} color="#fff" style={styles.iconStyle} />
                <Text style={styles.buttonText}>SMS</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonStyle} onPress={() => props.navigation.navigate('CallScreen')}>
                <Icon name="phone" size={20} color="#fff" style={styles.iconStyle} />
                <Text style={styles.buttonText}>CALL</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    viewStyle: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        backgroundColor: '#f0f0f0',
    },
    logoStyle: {
        width: 100,
        height: 100,
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
        fontWeight: 'bold',
    },
    buttonStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#007BFF',
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        marginLeft: 10,
    },
    iconStyle: {
        marginRight: 10,
    },
});

export default HomeScreen;
