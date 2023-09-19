
#include <WiFi.h>
#include <WiFiClient.h>
#include <WiFiAP.h>
#include <TinyMqtt.h>


// The AP network
const char *ssid = "";
const char *password = "";

// The client network
const char *wifiSSID = "";
const char *wifiPassword = "";

WiFiClient wifiClient;


WiFiServer server(80);

// MQTT Broker
const int PORT = 1883;
const int  RETAIN = 10;  // Max retained messages

MqttBroker broker(1883);

void setup() {

  Serial.begin(115200);
  Serial.println();

  WiFi.mode(WIFI_MODE_APSTA);
  // Now, we're trying to connect to the wifi network
  WiFi.begin(wifiSSID, wifiPassword);

  uint8_t wifiStatus = WiFi.waitForConnectResult();

  Serial.print("Connecting to wifi...");
  while (WiFi.status() != WL_CONNECTED) {
    Serial.print(".");
    delay(500);
  }
  IPAddress localIP = WiFi.localIP();
  Serial.printf("Client:\n\t- SSID: %s \n\t- IP address: %s \n", wifiSSID, localIP.toString());

  // We create our AP
  Serial.println("Configuring access point...");
  if (!WiFi.softAP(ssid, password)) {
    log_e("Soft AP creation failed.");
    while(1);
  }
  IPAddress myIP = WiFi.softAPIP();
  Serial.printf("AP:\n\t- SSID: %S \n\t- IP address: %s \n", WiFi.softAPSSID().c_str(), myIP.toString().c_str());

  broker.begin();
  Serial.println("Broker started");


}

void loop() {
  WiFiClient client = server.available();   // listen for incoming clients

  // mqttClient.poll(); // We're avoiding to be disconnected from the broker

  if (client) {                             // if you get a client,
    Serial.println("New Client.");           // print a message out the serial port
    String currentLine = "";                // make a String to hold incoming data from the client
    while (client.connected()) {            // loop while the client's connected
      if (client.available()) {             // if there's bytes to read from the client,
        char c = client.read();             // read a byte, then
        Serial.write(c);                    // print it out the serial monitor
        if (c == '\n') {                    // if the byte is a newline character

          // if the current line is blank, you got two newline characters in a row.
          // that's the end of the client HTTP request, so send a response:
          if (currentLine.length() == 0) {
            // HTTP headers always start with a response code (e.g. HTTP/1.1 200 OK)
            // and a content-type so the client knows what's coming, then a blank line:
            client.println("HTTP/1.1 200 OK");
            client.println("Content-type:text/html");
            client.println();

            // the content of the HTTP response follows the header:
            client.print("STATUS: 200, OK; Content transmitted");

            // The HTTP response ends with another blank line:
            client.println();
            // break out of the while loop:
            break;
          } else {    // if you got a newline, then clear currentLine:
            currentLine = "";
          }
        } else if (c != '\r') {  // if you got anything else but a carriage return character,
          currentLine += c;      // add it to the end of the currentLine
        }

        if (currentLine.endsWith("HTTP/1.1")) {

          String parameter = "";
          String value = "";
          bool isWritingValue = false;

          for (int i = 7; i < currentLine.length()-9; i++) {

            String currentChar = String(currentLine[i]);

            if (currentChar != "=") {
              // We are either working on the parameter
              // or the value
              if (!isWritingValue) {
                // We did not encountered the "=" sign, yet
                // So we fill out the parameter
                parameter += currentChar;
              } else {
                // We encountered the "=" sing, so
                // we fille out the value
                value += currentChar;
              }
            } else {
              // The current char we are working on
              // is the "=" sign, we don't do
              // anything else other than raising our `isWritingValue` flag
              isWritingValue = true;
            }
          }
          Serial.printf("\nHere is our given content: %s =", parameter);
          Serial.print(value);
          Serial.println();

          if (parameter == "cardID") {
            // We have our content right here
            // mqttClient.beginMessage(topic);
            // mqttClient.print(value);
            // mqttClient.endMessage();

            // Let's log our message
            Serial.println("MQTT message sent!");
          }
        }
      }
    }
    // close the connection:
    client.stop();
    Serial.println("Client Disconnected.");
  }
}
