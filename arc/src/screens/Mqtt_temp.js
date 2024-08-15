import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import MQTTClient from '../components/MQTTClient.js ';

const MqttScreen = ({ userID }) => {
  const [message, setMessage] = useState('');
  const [receivedMessage, setReceivedMessage] = useState('');

  useEffect(() => {
    const onMessageArrived = (msg) => {
      if (msg && msg.data) {
        setReceivedMessage(msg.data);
        console.log(`Received message: ${msg.data}`);
      }
    };

    MQTTClient.create(userID, '9092277711/data',{}, onMessageArrived);
    MQTTClient.create(userID, 'bob',{}, onMessageArrived);
    return () => {
      MQTTClient.disconnect();  // This should trigger the disconnect method
    };
  }, [userID]);

  const handlePublish = () => {
    MQTTClient.publishMessage(message);
    setMessage('');
  };



  return (
    <View style={styles.container}>
      <Text style={styles.heading}>MQTT Publish and Subscribe</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter message to publish"
        value={message}
        onChangeText={setMessage}
      />
      <Button title="Publish Message" onPress={handlePublish} />
      <Text style={styles.receivedTitle}>Received Message:</Text>
      <Text style={styles.receivedMessage}>{receivedMessage}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  heading: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  receivedTitle: {
    marginTop: 20,
    fontSize: 18,
  },
  receivedMessage: {
    fontSize: 16,
    color: 'blue',
  },
});

export default MqttScreen;
