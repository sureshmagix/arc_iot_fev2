import React, { useEffect, useState } from 'react';
import { View, Text, Button, Image, TextInput, TouchableOpacity, ScrollView, Alert, Linking } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import styles from './style';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import CheckBox from 'react-native-check-box';
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


    const emailUs = async () => {
        const email = 'sureshmagix@gmail.com';
        const subject = 'Subject here'; // Optional
        const body = 'Body content here'; // Optional
        const url = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
        try {
          const supported = await Linking.canOpenURL(url);
          if (!supported) {
            Alert.alert('Email application is not available');
          } else {
            await Linking.openURL(url);
          }
        } catch (error) {
          console.error("Error occurred while trying to open the email application", error);
          Alert.alert('An error occurred while trying to open the email application');
        }
      };


      const openWebsite = () => {
    const url = 'http://www.archidtech.com';
    Linking.openURL(url).catch((err) => {
      console.error("Couldn't load website", err);
      alert("Couldn't open the website. Please try again later.");
    });
  };



    const sendWhatsapp = () => {
        const phoneNumber = '9443817475';
        const url = `whatsapp://send?phone=${phoneNumber}`;
        Linking.openURL(url).catch((err) => {
          console.error("Couldn't load page", err);
          alert("Make sure WhatsApp is installed on your device");
        });
      };


    const companyLocation = () => {
        const url = 'https://maps.app.goo.gl/YRK7474CqMWDjAyy7';
        Linking.openURL(url).catch((err) => console.error("Couldn't load page", err));
      };



    function handleSubmit() {
        //console.log(mobile, password);
        const userData = {
            mobile: mobile,
            password: password,
        };

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

    return (
        <ScrollView contentContainerStyle={{flexGrow: 1}} keyboardShouldPersistTaps={'always'}>
            <View style={{backgroundColor: 'white'}}>
                <View style={styles.logoContainer}>
                    <Image style={styles.logo} source={require('../../assets/logo.png')} />
                    <ICSTryagain />
                </View>
                <View style={styles.loginContainer}>
                    <Text style={styles.text_header}>Customer Login </Text>
                    <View style={styles.action}>
                        <FontAwesome name="mobile" color="#b22222" style={styles.smallIcon} />
                        <TextInput
                            placeholder="Mobile"
                            style={styles.textInput}
                            value={mobile}
                            maxLength={10} keyboardType='numeric'
                            onChange={e => setMobile(e.nativeEvent.text)}
                        />


                        
                    </View>
                    <View style={styles.action}>
                        <FontAwesome name="lock" color="#b22222" style={styles.smallIcon} />
                        <TextInput
                            placeholder="password"
                            style={styles.textInput}
                            value={password}
                            onChange={e => setPassword(e.nativeEvent.text)}
                            secureTextEntry
                        />
                    </View>
                    <View style={styles.checkboxContainer1}>
                        <CheckBox
                            isChecked={rememberMe}
                            onClick={() => setRememberMe(!rememberMe) }
                            style={styles.checkbox}
                            checkBoxColor="#b22222"
                            
                        />
                        <Text style={{ color: '#b22222' }}>Remember Me</Text>
                        
                         
                        
                    </View>
                   
                    


                    <View style={{ justifyContent:'flex-end', alignItems:'flex-end', marginTop:8, marginRight:10 }}>
                        <Text style={{color: '#420475', fontWeight:'700'}}></Text>
                    </View>
                </View>
                <View style={styles.button}>
                    <TouchableOpacity style={styles.inBut} onPress={() => handleSubmit()}>
                        <View>
                            <Text style={styles.textSign}>Login</Text>
                        </View>
                    </TouchableOpacity>
                    <View style={{padding:15}}>
                        <Text style={{fontSize:14, fontWeight:'bold',color:'#919191'}}>
                            ---or Continue as ---
                        </Text>
                    </View>
                    <View style={styles.bottomButton}>
                        {/* Button 1 start */}
                        <View style={{ alignItems:'center', justifyContent:'center' }}>
                            <TouchableOpacity style={styles.inBut2} onPress={() => navigation.navigate('Register')}>
                                <FontAwesome name="user-plus" color="white" style={styles.smallIcon2} />
                            </TouchableOpacity>
                            <Text style={styles.bottomText}>Sign Up</Text>
                        </View>

                        {/* Button 2 start */}
                        <View style={{ alignItems:'center', justifyContent:'center' }} >
                            <TouchableOpacity style={styles.inBut2} onPress={openWebsite}>
                                <Entypo name="network" color="white" style={styles.smallIcon2} />
                            </TouchableOpacity>
                            <Text style={styles.bottomText}>Website</Text>
                        </View>

                        {/* Button 3 start */}
                        <View style={{ alignItems:'center', justifyContent:'center' }}>
                            <TouchableOpacity style={styles.inBut2} onPress={sendWhatsapp}>
                                <FontAwesome name="whatsapp" color="white" style={styles.smallIcon2} />
                            </TouchableOpacity>
                            <Text style={styles.bottomText}>WhatsApp Us</Text>
                        </View>
                        {/* Button 4 start */}
                        <View style={{ alignItems:'center', justifyContent:'center' }}>
                            <TouchableOpacity style={styles.inBut2} onPress={companyLocation}>
                                <FontAwesome name="map-marker" color="white" style={styles.smallIcon2} />
                            </TouchableOpacity>
                            <Text style={styles.bottomText}>Location</Text>
                        </View>
                    </View>
                </View>
            </View>
        </ScrollView>
    );
}

export default LoginScreen;