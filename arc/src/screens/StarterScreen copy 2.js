import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import Location from 'react-native-vector-icons/Entypo';
import Icon from 'react-native-vector-icons/FontAwesome5';
import AddIcon from 'react-native-vector-icons/MaterialIcons';
import MinusIcon from 'react-native-vector-icons/FontAwesome'; // Import Minus Icon
import EditIcon from 'react-native-vector-icons/MaterialIcons'; // Import Edit Icon
import MobileIcon from 'react-native-vector-icons/MaterialIcons'; // Mobile Icon for mobile starter key
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import Toast from 'react-native-toast-message';

function StarterScreen(props) {
  const navigation = useNavigation();
  const [userData, setUserData] = useState('');
  const [starterData, setStarterData] = useState({
    starter1: '',
    starter2: '',
    starter3: '',
    starter4: '',
  });
  const [isModalVisible, setModalVisible] = useState(false); // For modal visibility
  const [newStarterName, setNewStarterName] = useState(''); // For storing the new starter name
  const [editStarterKey, setEditStarterKey] = useState(null); // Track which starter is being edited

  const MAX_STARTERS = 4; // Maximum number of starters allowed

  // Fetch user data
  const getUserData = async () => {
    const token = await AsyncStorage.getItem('token');
    axios
      .post('http://ec2-13-233-116-176.ap-south-1.compute.amazonaws.com:3001/userdata', { token })
      .then(res => setUserData(res.data.data))
      .catch(err => Alert.alert('Error', 'Failed to fetch user data'));
  };

  // Fetch starter data and remove _id and __v
  const getStarterData = async () => {
    const token = await AsyncStorage.getItem('token');
    axios
      .post('http://ec2-13-233-116-176.ap-south-1.compute.amazonaws.com:3001/starterdata', { token })
      .then(res => {
        const { _id, __v, ...filteredData } = res.data.data; // Filter out _id and __v
        setStarterData(filteredData);
      })
      .catch(err => Alert.alert('Error', 'Failed to fetch starter data'));
  };

  const addStarter = () => {
    // Filter out any starters that are empty
    const existingStarters = Object.keys(starterData).filter(
      (key) => starterData[key] !== ''
    );
  
    // If no starters exist, start from starter1
    let nextStarterKey;
    if (existingStarters.length === 0) {
      nextStarterKey = 'starter1';
    } else {
      // Find the next available starter key based on the existing keys
      const nextNumber = existingStarters.length + 1;
      nextStarterKey = `starter${nextNumber}`;
    }
  
    // Check if the number of starters has reached the maximum limit
    if (existingStarters.length >= MAX_STARTERS) {
      Alert.alert('Maximum Devices Limit Reached', 'You cannot add more than 4 devices.');
      return;
    }
  
    // Open the modal to get the new starter name
    setModalVisible(true);
    setEditStarterKey(nextStarterKey); // Set the next starter key for editing
  };
  
  const saveNewStarter = () => {
    const currentStarterCount = Object.keys(starterData).length;
    const newStarterKey = `starter${currentStarterCount + 1}`;

    // Update the starterData with the new starter name
    setStarterData({
      ...starterData,
      [newStarterKey]: newStarterName,
    });

    // Close the modal and reset the input
    setModalVisible(false);
    setNewStarterName('');
  };

  const editStarter = (starterKey) => {
    // Set the current starter's key and name in the modal
    setEditStarterKey(starterKey);
    setNewStarterName(starterData[starterKey]);
    setModalVisible(true);
  };

  const saveEditedStarter = () => {
    if (editStarterKey) {
      // Update the starterData with the edited name
      setStarterData({
        ...starterData,
        [editStarterKey]: newStarterName,
      });

      // Close the modal and reset the input
      setModalVisible(false);
      setEditStarterKey(null);
      setNewStarterName('');
    }
  };

  const deleteStarter = (key) => {
    const updatedStarterData = { ...starterData };
    delete updatedStarterData[key];
    setStarterData(updatedStarterData);
  };

  // Function to store the starter data in AsyncStorage and post it to the server
  const storeStarterData = async (starterData) => {
    try {
      // Convert the starterData into a JSON string before storing it
      const jsonValue = JSON.stringify(starterData);

      // Store the JSON string in AsyncStorage
      await AsyncStorage.setItem('starterData', jsonValue);
      console.log('Starter data successfully stored in AsyncStorage.');
      console.log('Stored Starter Data:', starterData); // Log the stored data

      // Retrieve the mobile number from userData (assuming userData is available)
      const mobile = userData.mobile;

      // POST the starterData to the server with the correct structure
      await axios.post(
        'http://ec2-13-233-116-176.ap-south-1.compute.amazonaws.com:3001/updatestarter',
        {
          mobile: mobile,
          starter1: starterData.starter1,
          starter2: starterData.starter2,
          starter3: starterData.starter3,
          starter4: starterData.starter4,
        }
      );

      // Notify the user of success
      Alert.alert('Success', 'Starter data successfully updated and sent to the server.');
    } catch (error) {
      console.error('Error storing or posting starter data:', error);
      Alert.alert('Error', 'Failed to store and send starter data');
    }
  };

  useEffect(() => {
    getUserData();
    getStarterData();
    setTimeout(() => {
      Toast.show({
        type: 'success',
        text1: 'Welcome',
        text2: 'Have a nice day !!!',
        visibilityTime: 5000,
      });
    }, 2000);
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View>
          {/* Top section */}
          <View style={{position: 'relative'}}>
          <TouchableOpacity
            style={styles.backIcon}
            onPress={() => {
              navigation.dispatch(DrawerActions.openDrawer());
            }}>
            <MobileIcon name="menu" size={30} color="white" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.editIcon}
            onPress={() => {
              navigation.navigate('RegisterStarter', {data: userData});
            }}>
            <Icon name="user-edit" size={24} color={'white'} />
          </TouchableOpacity>

          <Image
            width={100}
            height={60}
            resizeMode="contain"
            style={{
              marginTop: -300,
            }}
            source={require('../assets/wave.png')}
          />
        </View>
        <View style={{alignItems: 'center'}}>
        <Image
            width={100}
            height={60}
            resizeMode="contain"
            style={{
              marginTop: -175,
            }}
            source={require('../assets/logo.png')}
          />
        </View>

        <View style={{marginTop: -50}}>
          <Text style={styles.nameText}>Hi {userData.name}!!! </Text>
          <Text style={styles.infoLarge_Text_Title}>Your Registered Archidtech Starters</Text>
        </View>

          {/* Starter Devices */}
          <View style={{ marginTop: 10, marginHorizontal: 25 }}>
            {Object.keys(starterData).map((starterKey, index) => (
              <View style={styles.infoMain} key={index}>
                <View style={styles.infoCont}>
                  {/* Check if starterKey is mobile and apply different icon and style */}
                  {starterKey === 'mobile' ? (
                    <View style={[styles.infoIconCont, { backgroundColor: 'blue' }]}>
                      <MobileIcon name="phone-iphone" size={28} color="white" />
                    </View>
                  ) : (
                    <View style={[styles.infoIconCont, { backgroundColor: '#0d7313' }]}>
                      <Location name="location" size={28} color="white" />
                    </View>
                  )}
                  
                  <View style={styles.infoText}>
                    <Text style={starterKey === 'mobile' ? styles.mobileText : styles.infoSmall_Text}>
                      {starterKey === 'mobile' ? 'Mobile' : starterKey}
                    </Text>
                    <Text style={starterKey === 'mobile' ? styles.mobileText : styles.infoLarge_Text}>
                      {starterData[starterKey] || ''}
                    </Text>
                  </View>
                  {/* Hide the delete button for 'mobile' starter */}
                  {starterKey !== 'mobile' && (
                    <>
                      {/* Edit Button */}
                      <TouchableOpacity
                        style={styles.editButton}
                        onPress={() => editStarter(starterKey)}>
                        <EditIcon name="edit" size={24} color="blue" />
                      </TouchableOpacity>

                      {/* Delete Button */}
                      <TouchableOpacity
                        style={styles.deleteButton}
                        onPress={() => deleteStarter(starterKey)}>
                        <MinusIcon name="minus-circle" size={24} color="red" />
                      </TouchableOpacity>
                    </>
                  )}
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Add Device Floating Button */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={addStarter}>
        <AddIcon name="add" size={30} color="white" />
      </TouchableOpacity>

      {/* Modal for Adding or Editing a Starter */}
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {editStarterKey ? 'Edit Starter Name' : 'Enter Starter Name'}
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Starter Name"
              value={newStarterName}
              onChangeText={setNewStarterName}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={editStarterKey ? saveEditedStarter : saveNewStarter}>
                <Text style={styles.modalButtonText}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: 'red' }]}
                onPress={() => setModalVisible(false)}>
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Update Button */}
      <TouchableOpacity
        style={styles.updateButton}
        onPress={() => storeStarterData(starterData)}>
        <Text style={styles.updateButtonText}>SAVE</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  // Existing styles...
  backIcon: {
    zIndex: 1,
    position: 'absolute',
    left: 15,
    top: 50,
    color: 'white',
  },
  waveImage: {
    marginTop: -150,
    width: '100%',
    height: 100,
    resizeMode: 'contain',
  },
  logo: {
    marginTop: -175,
    width: 100,
    height: 60,
    resizeMode: 'contain',
  },
  userInfo: {
    marginTop: -50,
    alignItems: 'center',
  },
  nameText: {
    color: 'black',
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  infoMain: {
    marginTop: 10,
  },
  infoCont: {
    flexDirection: 'row',
    alignItems: 'center', // To align the delete button with the starter text
  },
  infoIconCont: {
    justifyContent: 'center',
    height: 40,
    width: 40,
    borderRadius: 20,
    alignItems: 'center',
    backgroundColor: 'black',
  },
  infoText: {
    marginLeft: 25,
    flexDirection: 'column',
    borderBottomWidth: 1,
    paddingBottom: 10,
    borderColor: '#e6e6e6',
    flex: 1, // Takes available space between icon and delete button
  },
  infoSmall_Text: {
    fontSize: 13,
    color: 'blue',
  },
  infoLarge_Text: {
    fontSize: 18,
    color: 'black',
    fontWeight: '600',
  },
  infoLarge_Text_Title: {
    fontSize: 18,
    color: 'black',
    fontWeight: '600',
    textAlign: 'center',
  },
  editButton: {
    marginLeft: 10,
  },
  deleteButton: {
    marginLeft: 10, // Space between edit and delete buttons
  },
  // Updated addButton style for bottom right position
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: 'blue',
    borderRadius: 30,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: 'blue',
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  modalButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  // Updated updateButton style for bottom center position
  updateButton: {
    position: 'absolute',
    bottom: 20, // Position at the bottom of the screen
    left: '50%',
    transform: [{ translateX: -50 }], // Center horizontally
    backgroundColor: 'blue',
    padding: 15,
    borderRadius: 10,
  },
  updateButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  // New unique style for mobile number
  mobileText: {
    fontSize: 22,
    fontWeight: '700',
    color: 'blue',
    },
});

export default StarterScreen;
