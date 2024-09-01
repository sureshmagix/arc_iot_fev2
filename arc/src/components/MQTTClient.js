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

    const CERTIFICATE = `
    -----BEGIN CERTIFICATE-----
    MIIDfzCCAmegAwIBAgIUXGZSrcrBXy1ptnUUGk6fNZiXTuAwDQYJKoZIhvcNAQEL
    BQAwTzELMAkGA1UEBhMCSU4xCzAJBgNVBAgMAlROMRAwDgYDVQQHDAdjaGVubmFp
    MSEwHwYDVQQKDBhJbnRlcm5ldCBXaWRnaXRzIFB0eSBMdGQwHhcNMjQwNjAyMTc0
    NzI2WhcNMzQwNTMxMTc0NzI2WjBPMQswCQYDVQQGEwJJTjELMAkGA1UECAwCVE4x
    EDAOBgNVBAcMB2NoZW5uYWkxITAfBgNVBAoMGEludGVybmV0IFdpZGdpdHMgUHR5
    IEx0ZDCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBAJmpf2K2c3ykCFEd
    pEQY8+QHzT5nhxXnXoUwYH/7Y6rbppS3zYJX3cQTES1aJxefNwa6t7ynJsG/Utqx
    vaEX7xa76ukojpjEdCEnS75hKK21ilm9WNKJRPFj3iUCBoLH41SbjAQYLHq/ZcwT
    OpLvxuBxEm2bEt8yOJ6/lytbwdgwLARopW8CKUPFB9Hp/zDhXl1zSLYq5sPlDjb+
    T/2RMkJNhAfuhxDA9Ua8KAVNiT86ubzbKedcqpK6CZhJP1/JgXTOkUtnxcIXEzq1
    oWvOARSYaya9aV8AFVURn0JYYk5ohmdfqoeR41teISsUKQsntT5IiJuAC8RswJcv
    LBKYfy0CAwEAAaNTMFEwHQYDVR0OBBYEFFPx88Se+6QaAsQzHAfhtYOsX77EMB8G
    A1UdIwQYMBaAFFPx88Se+6QaAsQzHAfhtYOsX77EMA8GA1UdEwEB/wQFMAMBAf8w
    DQYJKoZIhvcNAQELBQADggEBAHULIO/dZri2upHSUNzbfgc6QLCU1ehhUOPmGAWw
    K7GdvYsUcKRpkSPIamM6otMVPwXZtyZW0r+4wtCbLiAaWAPJJj0we0xcXOuiOyzA
    RI52SPVTULOgTd7sf9DMclrTJZ/TAtEzYZIawMEu/Ekn/wk/k4CFR7of657y5Neh
    m6Jzcvo956w1QK8nVlo0Rlt+UXN2Akx7KNVFZrt5Yh/3BlEdRcGbpwmP3tvmeG/+
    aYnDIRDhTyVHlcqzE+OoamYbHl8d6WVyul04vbE3jZ9Gs0zKb2sdZfFjibNx1i3n
    5cq/KjL50Ke3VspRxnjmvkXrz3QX48Y/sZrcmE7BwAPH8QE=
    -----END CERTIFICATE-----
    `;

        // Log the loaded certificate for debugging
        console.log("Loaded Certificate: ", CERTIFICATE);

        // Use Buffer to encode the certificate
        const certificateBuffer = Buffer.from(CERTIFICATE.trim(), 'utf8');
    
    

    // Configure the MQTT connection properties
    this.topics = Array.isArray(topics) ? topics : [topics];
    this.conProps = _.extend({
      clientId: deviceId,
      uri: 'mqtts://13.233.116.176:8883', // IP of your broker
           // Port of your broker (usually 8883 for TLS)
            // Use 'mqtts' for secure connection
      clean: true,
      user: 'sureshmagix',   // Replace with your MQTT username
      pass: 'suresh123',   // Replace with your MQTT password
      auth: true,
      tls: {
        ca: [certificateBuffer],  // Base64 encode the certificate
        rejectUnauthorized: false,  // Accept self-signed certificates
      },
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
