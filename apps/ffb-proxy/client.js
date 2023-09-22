'use strict'

import open from "open"
import mqtt from "mqtt"

const clientId = 'mqttjs_' + Math.random().toString(16).substr(2, 8)

// This sample should be run in tandem with the aedes_server.js file.
// Simply run it:
// $ node aedes_server.js
//
// Then run this file in a separate console:
// $ node websocket_sample.js
//
const host = 'mqtt://test.mosquitto.org:1883'

const fluxTopic = 'ffb-watcher/test';

const options = {
  keepalive: 30,
  clientId,
  protocolId: 'MQTT',
  protocolVersion: 4,
  clean: true,
  reconnectPeriod: 1000,
  connectTimeout: 30 * 1000,
  will: {
    topic: fluxTopic,
    payload: '500: Connection closed abnormally',
    qos: 0,
    retain: false
  },
  rejectUnauthorized: false
}

console.log('connecting mqtt client')
const client = mqtt.connect(host, options)

client.on('error', (err) => {
  console.log(err)
  client.end()
})

client.on('connect', () => {
  console.log('client connected:' + clientId)
  client.subscribe(fluxTopic, { qos: 0 })
})

let previousMessage = "";

client.on('message', (topic, message, packet) => {
    let currentMessage = message.toString();
    if (currentMessage != previousMessage && currentMessage != "200: Connected"){
        if (currentMessage != "") {
            previousMessage = currentMessage;
            console.log('Received Message:= ' + currentMessage);
            open('http://localhost:3000/?cardID=' + currentMessage, 'firefox');

            client.publish("ffb-watcher/return", "200: Received")
        }
    } else if (currentMessage != previousMessage && currentMessage == "200: Connected"){
        console.log('Received start message');
        open('http://localhost:3000/?status=Connected', 'firefox');
    } else {
        console.log("Message Ignored: " + currentMessage + `, because '${currentMessage}' != '${previousMessage}' => ${currentMessage != previousMessage}!`);
    }
})

client.on('close', () => {
  console.log(clientId + ' disconnected')
})
