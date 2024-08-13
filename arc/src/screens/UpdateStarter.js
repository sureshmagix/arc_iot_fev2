import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from 'react-native';
import {Avatar} from 'react-native-paper';
import styles from '../screens/Login&Register/UpdateProfile/stylesProfileEdit';
import Back from 'react-native-vector-icons/Ionicons';
import {RadioButton} from 'react-native-paper';
import ImagePicker from 'react-native-image-crop-picker';
import axios from 'axios';
import {useRoute} from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';

function UpdateStarter() {

  const [mobile, setMobile] = useState('');
  const [storedMobile, setStoredMobile] = useState('');
  const [starter1, setStarter1] = useState('');
  const [starter2, setStarter2] = useState('');
  const [starter3, setStarter3] = useState('');
  const [starter4, setStarter4] = useState('');
  const route = useRoute();
  const [userData, setUserData] = useState('');
 
  async function getData() {
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

  useEffect(() => {
    getData();  
  
    setMobile(userData.mobile);
    const starterData = route.params.data;
    setStarter1(starterData.starter1);
    setStarter2(starterData.starter2);
    setStarter3(starterData.starter3);
    setStarter4(starterData.starter4);
    
  },[]);
  const updateStarter = () => { 
    setMobile(userData.mobile);
    const formdata = {
      mobile,
      starter1,
      starter2,
      starter3,
      starter4,
      };
    console.log(formdata);
    axios
      .post('http://13.233.116.176:3001/registerstarter', formdata)
      .then(res => {console.log(res.data)
        if(res.data.status=="Ok"){
          Toast.show({
        type:'success',
        text1:'Registered',
        
      })
        }
        else if ((res.data.status=="request entity too large")){
          Toast.show({
            type:'error',
            text1:'Error !!! Photo size too Large',
            })

        }
      });
  };

  return (
    <ScrollView
      keyboardShouldPersistTaps={'always'}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{paddingBottom: 40}}>
      <View>
        <View style={styles.header}>
          <View style={{flex: 1}}>
            <Back name="arrow-back" size={30} style={styles.backIcon} />
          </View>
          <View style={{flex: 3}}>
            <Text style={styles.nameText}>Registered starters</Text>
          </View>
          <View style={{flex: 1}}></View>
        </View>

        <View
          style={{
            marginTop: 50,
            marginHorizontal: 22,
          }}>

          <Text style={styles.titleTextsmall}>Starter No: {userData.mobile} </Text>
          <View style={styles.infoEditView}>
            <Text style={styles.infoEditFirst_text}>Starter 1</Text>
            <TextInput
              placeholder="Starter 1"
              placeholderTextColor={'#999797'}
              style={styles.infoEditSecond_text}
              onChange={e => setStarter1(e.nativeEvent.text)}
              defaultValue={starter1}
            />
          </View>

          <View style={styles.infoEditView}>
            <Text style={styles.infoEditFirst_text}>Starter 2</Text>
            <TextInput
              placeholder="Starter 2"
              placeholderTextColor={'#999797'}
              style={styles.infoEditSecond_text}
              onChange={e => setStarter2(e.nativeEvent.text)}
              defaultValue={starter2}
            />
          </View>

          <View style={styles.infoEditView}>
            <Text style={styles.infoEditFirst_text}>Starter3</Text>
            <TextInput
              placeholder="Starter 3"
              placeholderTextColor={'#999797'}
              //keyboardType="numeric"
              maxLength={10}
              style={styles.infoEditSecond_text}
              onChange={e => setStarter3(e.nativeEvent.text)}
              defaultValue={starter3}
            />
          </View>

          <View style={styles.infoEditView}>
            <Text style={styles.infoEditFirst_text}>Starter4</Text>
            <TextInput
              placeholder="Starter 4"
              placeholderTextColor={'#999797'}
              //keyboardType="numeric"
              maxLength={10}
              style={styles.infoEditSecond_text}
              onChange={e => setStarter4(e.nativeEvent.text)}
              defaultValue={starter4}
            />
          </View>


        </View>
        <View style={styles.button}>
          <TouchableOpacity
            onPress={() => updateStarter()}
            style={styles.inBut}>
            <View>
              <Text style={styles.textSign}>Update Starter</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

export default UpdateStarter;