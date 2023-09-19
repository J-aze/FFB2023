"use strict";

import open from "open";


const mqtt = require("mqtt");

const clientId = "mqttjs_" + Math.random().toString(16).substr(2, 8);

// This sample should be run in tandem with the aedes_server.js file.
// Simply run it:
// $ node aedes_server.js
//
// Then run this file in a separate console:
// $ node websocket_sample.js
//
const host = "ws://test.mosquitto.org:8080";

const options = {
  keepalive: 30,
  clientId,
  protocolId: "MQTT",
  protocolVersion: 4,
  clean: true,
  reconnectPeriod: 1000,
  connectTimeout: 30 * 1000,
  will: {
    topic: "ffb-watcher/test",
    payload: "Connection Closed abnormally..!",
    qos: 0,
    retain: false,
  },
  rejectUnauthorized: false,
};

console.log("connecting mqtt client");
const client = mqtt.connect(host, options);

client.on("error", (err) => {
  console.log(err);
  client.end();
});

client.on("connect", () => {
  console.log("client connected:" + clientId);
  client.subscribe("ffb-watcher/test", { qos: 0 });
  client.publish("ffb-watcher/test", "wss secure connection demo...!", {
    qos: 0,
    retain: false,
  });
});

client.on("message", (topic, message, packet) => {
  open("http://localhost:3001/?cardID=" + message.toString());
});

client.on("close", () => {
  console.log(clientId + " disconnected");
});
