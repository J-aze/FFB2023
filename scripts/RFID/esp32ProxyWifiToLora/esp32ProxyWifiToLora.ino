#include <Arduino.h>
#include <WiFi.h>
#include <WiFiClient.h>
#include <WiFiAP.h>
// #include <LoRa.h>
#include <heltec.h>

#define LED_BUILTIN 2

// Wifi Setup
const char* ssid = "";
const char* pwd = "";
const char* wifiHostname = "ESP32-Proxy";

// TCP Setup
const uint TCPPort = 42;

// The Things Network Setup
static const uint8_t appEui[8]={0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00};
uint8_t devEui[8] = {0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00};
uint8_t appKey[16] = {0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00};


// LoRa Related
long loraFrequency = 868E6;

WiFiServer server(TCPPort);

void setup() {
  Serial.begin(115200);
  Serial.println("Creating Wifi AP");

  // Verify the Wifi Access Point configuration
  if (!WiFi.softAP(ssid, pwd)) {
    // It wasn't successfull
    Serial.println("Wifi AP creation failed!");
    while(1);
  }
  // It was successfull
  Serial.println("Wifi AP creation successfull!");
  
  IPAddress routerIP = WiFi.softAPIP();
  Serial.print("The AP adress: ");
  Serial.println(routerIP);

  // Starting the server
  server.begin();

  // Heltec
  Heltec.begin(true, true, true, true, loraFrequency);

  // Starting the LoRa end-device procedure
  Serial.println("Starting the LoRa chip");
  while (!LoRa.begin(loraFrequency)) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("LoRa ready to go!");  
};


void loop() {
  WiFiClient client = server.available();   // listen for incoming clients

  if (client) {                             // if you get a client,
    Serial.printf("From %s: ", client.remoteIP().toString());           // print a message out the serial port
    String currentLine = "";                // make a String to hold incoming data from the client
    while (client.connected()) {            // loop while the client's connected
      if (client.available()) {             // if there's bytes to read from the client,
        char c = client.read();             // read a byte, then
        Serial.write(c);                    // print it out the serial monitor

        // Starting the retransmission on the LoRa Network
        Serial.println("Sending LoRa Packet");
        LoRa.beginPacket();
        LoRa.write(client.read());
        LoRa.endPacket(true); // Let it be async as we don't know if other packets are being sent
        Serial.println("LoRa Packet sent!");
      }
    }
    // close the connection:
    client.stop();
    Serial.printf("\n");
  }
}
