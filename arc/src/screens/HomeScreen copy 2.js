import { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, Image, TouchableOpacity, Modal, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import InternetConnectionStatusIcon from '../components/InternetConnectionStatus_icon';
import { RadioButton } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

function HomeScreen(props) {
    const [userData, setUserData] = useState('');
    const [starterData, setStarterData] = useState({
        starter1: '90922',
        starter2: '12345',
        starter3: '67890',
        starter4: '54321',
        _id: 'some_id_value',
        mobile: '1234567890',
        _v: '1',
    }); // Example starter data with _id, mobile, _v
    const [modalVisible, setModalVisible] = useState(false); // To control the modal visibility
    const [selectedStarter, setSelectedStarter] = useState('starter1'); // Track selected starter option

    async function getUserData() {
        const token = await AsyncStorage.getItem('token');
        axios
            .post('http://ec2-13-233-116-176.ap-south-1.compute.amazonaws.com:3001/userdata', { token: token })
            .then(res => setUserData(res.data.data))
            .catch(error => {
                console.error('Error fetching data:', error);
                Alert.alert('Error', 'Failed to fetch user data');
            });
    }

    async function storeStarterData(starterData) {
        try {
            const jsonValue = JSON.stringify(starterData);
            await AsyncStorage.setItem('starterData', jsonValue);
        } catch (error) {
            console.error('Error storing starter data:', error);
            Alert.alert('Error', 'Failed to store starter data');
        }
    }

    async function getStarterData() {
        const token = await AsyncStorage.getItem('token');
        axios
            .post('http://ec2-13-233-116-176.ap-south-1.compute.amazonaws.com:3001/starterdata', { token: token })
            .then(res => {
                const starterData = res.data.data;
                setStarterData(starterData);
                storeStarterData(starterData);
            })
            .catch(error => {
                console.error('Error fetching starter data:', error);
                Alert.alert('Error', 'Failed to fetch starter data');
            });
    }

    useEffect(() => {
        getUserData();
        getStarterData();
    }, []);

    // Handle the starter selection
    const handleStarterSelect = (starterKey) => {
        setSelectedStarter(starterKey);
    };

    // Navigate to the MQTT screen with the selected starter data
    const handleIotPress = () => {
        setModalVisible(true);
    };

    const handleStartMqtt = () => {
        // Pass the selected starter data to the MQTT screen and close the modal
        props.navigation.navigate('MqttScreen', { selectedStarter });
        setModalVisible(false);
    };

    return (
        <View style={styles.viewStyle}>
            <Image source={require('../assets/logo.png')} style={styles.logoStyle} />
            <Text style={styles.headingStyle}>Welcome to ArchidTech</Text>
            <Text style={styles.textStyle}>This is the Home screen</Text>
            <InternetConnectionStatusIcon />
        
            <TouchableOpacity style={styles.buttonStyle} onPress={handleIotPress}>
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

            {/* Modal for selecting starter */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalTitle}>Select Starter</Text>

                        {/* Display key and value for each starter, excluding _id, mobile, and _v */}
                        {Object.entries(starterData)
                            .filter(([key]) => !['_id', 'mobile', '__v'].includes(key)) // Filter out unwanted keys
                            .map(([key, value]) => (
                                <View style={styles.radioButtonGroup} key={key}>
                                    <RadioButton
                                        value={key}
                                        status={selectedStarter === key ? 'checked' : 'unchecked'}
                                        onPress={() => handleStarterSelect(key)}
                                    />
                                    <Text>{`${key}: ${value}`}</Text>
                                </View>
                            ))}

                        <Button title="Start MQTT" onPress={handleStartMqtt} />
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    viewStyle: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
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
        textAlign: 'center',
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
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalView: {
        width: '80%',
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    radioButtonGroup: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
});

export default HomeScreen;
