import MQTT from 'sp-react-native-mqtt';
import _ from 'underscore';

const MQTTClient = {
  QOS: 0,

  create(userID, topics, connectionProps = {}, onMessageArrivedCallback) {
    const deviceId = `realtime.${userID}.${this.randIdCreator()}`;

    this.topics = Array.isArray(topics) ? topics : [topics]; // Store the topics as an array
    this.conProps = _.extend({
      clientId: deviceId,
      host: '13.233.116.176', // IP of your broker
      port: 1883,            // Port of your broker
      protocol: 'mqtt',
      clean: true,
    }, connectionProps);

    MQTT.createClient(this.conProps)
      .then(client => {
        this.client = client;
        console.log('MQTT client successfully created.');

        client.on('closed', err => this.onConnectionClosed(err));
        client.on('error', err => this.onError(err));
        client.on('message', onMessageArrivedCallback);
        client.on('connect', () => this.onConnectionOpened());

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
    console.log(`MQTT onConnectionClosed ${err}`);
  },
  // Remaining code...
};

export default MQTTClient;
