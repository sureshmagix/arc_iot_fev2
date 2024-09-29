import React, { useEffect, useState } from 'react';
import { View, Text, Button, Image, TextInput, TouchableOpacity, ScrollView, Alert, Linking } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import styles from './style';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import CheckBox from 'react-native-check-box';
import Entypo from 'react-native-vector-icons/Entypo';
import ICSTryagain from '../../components/ICSTryagain';

function LoginScreen(props) {
    const navigation = useNavigation();
    const [mobile, setMobile] = useState('');
    const [password, setPassword] = useState('');
    const [storedMobile, setStoredMobile] = useState('');
    const [rememberMe, setRememberMe] = useState(false);

    useEffect(() => {
        // Retrieve the stored mobile number and password when the component mounts
        const fetchStoredCredentials = async () => {
            try {
                const storedMobileNumber = await AsyncStorage.getItem('mobileNumber');
                const storedPassword = await AsyncStorage.getItem('password');
                const rememberMeValue = await AsyncStorage.getItem('rememberMe');
                
                if (storedMobileNumber !== null) {
                    setStoredMobile(storedMobileNumber);
                    setMobile(storedMobileNumber);
                }
                if (storedPassword !== null) {
                    setPassword(storedPassword);
                }
                if (rememberMeValue !== null) {
                    setRememberMe(JSON.parse(rememberMeValue));
                }
            } catch (e) {
                console.error(e);
            }
        };
        fetchStoredCredentials();
    }, []);

    const storeCredentials = async (number, pwd) => {
        try {
            await AsyncStorage.setItem('mobileNumber', number);
            await AsyncStorage.setItem('password', pwd);
            await AsyncStorage.setItem('rememberMe', JSON.stringify(rememberMe));
            setStoredMobile(number);
        } catch (e) {
            console.error(e);
        }
    };

    const handleSubmit = async () => {
        const userData = { mobile, password };

        // Check network status
        const networkState = await NetInfo.fetch();

        if (!networkState.isConnected) {
            // Offline login
            const storedMobileNumber = await AsyncStorage.getItem('mobileNumber');
            const storedPassword = await AsyncStorage.getItem('password');

            if (mobile === storedMobileNumber && password === storedPassword) {
                Alert.alert('Logged In Offline Successfully');
                navigation.navigate('Home');
            } else {
                Alert.alert('Invalid Credentials for Offline Login');
            }
        } else {
            // Online login
            axios.post('http://ec2-13-233-116-176.ap-south-1.compute.amazonaws.com:3001/login-user', userData)
                .then(res => {
                    console.log(res.data);
                    if (res.data.status === 'ok') {
                        Alert.alert('Logged In Successfully');
                        AsyncStorage.setItem('token', res.data.data);
                        AsyncStorage.setItem('isLoggedIn', JSON.stringify(true));
                        AsyncStorage.setItem('userType', res.data.userType);
                        if (rememberMe) {
                            storeCredentials(mobile, password);
                        } else {
                            AsyncStorage.removeItem('mobileNumber');
                            AsyncStorage.removeItem('password');
                            AsyncStorage.removeItem('rememberMe');
                        }
                        if (res.data.userType === "Admin") {
                            navigation.navigate('AdminScreen');
                        } else {
                            navigation.navigate('Home');
                        }
                    } else {
                        Alert.alert('Please Check Username or Password !!!');
                    }
                })
                .catch(error => {
                    if (error.response) {
                        console.error('Data:', error.response.data);
                        console.error('Status:', error.response.status);
                        console.error('Headers:', error.response.headers);
                    } else if (error.request) {
                        console.error('Request:', error.request);
                    } else {
                        console.error('Error', error.message);
                    }
                    Alert.alert('Network Error', 'Please try again later.');
                });
        }
    };

    return (
        <ScrollView contentContainerStyle={{flexGrow: 1}} keyboardShouldPersistTaps={'always'}>
            <View style={{backgroundColor: 'white'}}>
                {/* Rest of the UI remains the same */}
                <View style={styles.loginContainer}>
                    <Text style={styles.text_header}>Customer Login</Text>
                    {/* Mobile Input */}
                    <View style={styles.action}>
                        <FontAwesome name="mobile" color="#b22222" style={styles.smallIcon} />
                        <TextInput
                            placeholder="Mobile"
                            style={styles.textInput}
                            value={mobile}
                            maxLength={10}
                            keyboardType='numeric'
                            onChange={e => setMobile(e.nativeEvent.text)}
                        />
                    </View>
                    {/* Password Input */}
                    <View style={styles.action}>
                        <FontAwesome name="lock" color="#b22222" style={styles.smallIcon} />
                        <TextInput
                            placeholder="Password"
                            style={styles.textInput}
                            value={password}
                            onChange={e => setPassword(e.nativeEvent.text)}
                            secureTextEntry
                        />
                    </View>
                    {/* Remember Me Checkbox */}
                    <View style={styles.checkboxContainer1}>
                        <CheckBox
                            isChecked={rememberMe}
                            onClick={() => setRememberMe(!rememberMe)}
                            style={styles.checkbox}
                            checkBoxColor="#b22222"
                        />
                        <Text style={{ color: '#b22222' }}>Remember Me</Text>
                    </View>
                </View>
                {/* Login Button */}
                <View style={styles.button}>
                    <TouchableOpacity style={styles.inBut} onPress={() => handleSubmit()}>
                        <Text style={styles.textSign}>Login</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );
}

export default LoginScreen;
