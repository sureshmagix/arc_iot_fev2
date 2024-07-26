import React, { useEffect, useState } from 'react';
import { View, Text, Button, Image, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import styles from './style';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Entypo from 'react-native-vector-icons/Entypo';

function Login(props) {

    const emailUs = async () => {
    };


    const openWebsite = () => {
};



  const sendWhatsapp = () => {
    };


  const companyLocation = () => {
      const url = 'https://maps.app.goo.gl/YRK7474CqMWDjAyy7';
      Linking.openURL(url).catch((err) => console.error("Couldn't load page", err));
    };


    return (
        <ScrollView contentContainerStyle={{flexGrow: 1}} keyboardShouldPersistTaps={'always'}>
            <View style={{backgroundColor: 'white'}}>
                <View style={styles.logoContainer}>
                    <Image style={styles.logo} source={require('../../assets/logo.png')} />
                </View>
                <View style={styles.loginContainer}>
                    <Text style={styles.text_header}>Login !!!</Text>
                    <View style={styles.action}>
                        <FontAwesome name="user-o" color="#b22222" style={styles.smallIcon} />
                        <TextInput
                            placeholder="Mobile"
                            style={styles.textInput}
                            value='9962577674'
                            onChange={e => setMobile(e.nativeEvent.text)}
                        />
                    </View>
                    <View style={styles.action}>
                        <FontAwesome name="lock" color="#b22222" style={styles.smallIcon} />
                        <TextInput
                            placeholder="password"
                            style={styles.textInput}
                            value='password'
                            onChange={e => setPassword(e.nativeEvent.text)}
                        />
                    </View>
                    <View style={{ justifyContent:'flex-end', alignItems:'flex-end', marginTop:8, marginRight:10 }}>
                        <Text style={{color: '#420475', fontWeight:'700'}}>Forgot Password</Text>
                    </View>
                </View>
                <View style={styles.button}>
                    <TouchableOpacity style={styles.inBut} onPress={() => handleSubmit()}>
                        <View>
                            <Text style={styles.textSign}>Log in</Text>
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

export default Login;