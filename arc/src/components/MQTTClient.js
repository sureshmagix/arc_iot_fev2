import MQTT from 'sp-react-native-mqtt';
import _ from 'underscore';
import { Buffer } from 'buffer'; // Import Buffer from the buffer package
import { Platform } from 'react-native';
import RNFS from 'react-native-fs';
import { useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect } from 'react';

const MQTTClient = {
  QOS: 0,

  

  async create(userID, topics, connectionProps = {}, onMessageArrivedCallback) {
    const deviceId = `realtime.${userID}.${this.randIdCreator()}`;

   

    

    // Configure the MQTT connection properties
    this.topics = Array.isArray(topics) ? topics : [topics];
    this.conProps = _.extend({
      clientId: deviceId,
      uri: 'mqtt://13.233.116.176:1883', // IP of your broker
           // Port of your broker (usually 8883 for TLS)
            // Use 'mqtts' for secure connection
      clean: true,
      auth: false,

    }, connectionProps);

    // Create the MQTT client
    MQTT.createClient(this.conProps)
      .then(client => {
        this.client = client;
        console.log('MQTT client successfully created.');

        client.on('closed', err => this.onConnectionClosed(err));
        client.on('error', err => this.onError(err));
        client.on('message', onMessageArrivedCallback);
        client.on('connect', () => this.onConnectionOpened());

        // Connect the client
        client.connect();
      })
      .catch(err => {
        console.error(`MQTT.createClient error: ${err}`);
      });
  },


  randIdCreator() {
    const S4 = () => (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    return `random${S4()}${S4()}${S4()}${S4()}${S4()}${S4()}`;
  },

  publishMessage(topic, message) {
    if (this.client && this.client.isConnected()) {
      this.client.publish(topic, message, this.QOS, false);
      console.log(`Published message: ${message} to topic: ${topic}`);
    } else {
      console.error('Client is not connected. Cannot publish message.');
    }
  },

  onConnectionOpened() {
    console.log('onConnectionOpened called');
    if (this.client) {
      try {
        this.topics.forEach(topic => {
          this.client.subscribe(topic, this.QOS, (err, granted) => {
            if (err) {
              console.error('Subscription error:', err);
            } else {
              console.log(`Successfully subscribed to ${topic} with QoS ${granted[0].qos}`);
            }
          });
        });
      } catch (err) {
        console.error('Error during subscription:', err);
      }
    } else {
      console.error('Client is not initialized when attempting to subscribe.');
    }
  },

  disconnect() {
    if (this.client) {
      console.log('Now killing open realtime connection.');
      this.client.disconnect();
    }
  },
  
  onConnectionClosed(err) {
    console.log(`MQTT onConnectionClosed: ${err}`);
  },

  onError(err) {
    console.error(`MQTT client error: ${err}`);
  },

  // Remaining code...
};


export default MQTTClient;
