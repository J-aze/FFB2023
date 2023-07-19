#include <SPI.h> // Library to talk via SPI
#include <MFRC522.h> // Library to communicate with the NFC sensor
#include <ESP32Time.h> // Library to manage and get the local time of the ESP32
#include <WiFi.h> // Library to talk over Wifi
#include <math.h> // Library of utils related to mathematical operations
#include <string.h> // Library to deal with strings than char arrays
#include <sstream> // Library to deal with creating formatted strings

// These are the GPIO PINs connected to the RIFD sensor
#define RST_PIN         26
#define SS_PIN          25
#define SCK_PIN         5
#define MISO_PIN        19
#define MOSI_PIN        18

MFRC522 mfrc522(SS_PIN, RST_PIN);  // Create MFRC522 instance
ESP32Time rtc(0); // Offset already configured when we got the NTP value

// Wifi Setup
const char* ssid = "test-ffbrfid";
const char* pwd = "test-me-rfid";
const char* wifiHostname = "ESP32-Accueil";
const uint TCPPort = 3000;
IPAddress nodeIP;
IPAddress RouterIP; 

// Return the Card UID
// @return String
std::string ReturnCardUID(MFRC522::Uid *uid) {
  // Dynamically set the length of the Array
  std::string CardUID;

	for (byte i = 0; i < uid->size; i++) {
    CardUID += ByteToHex(uid->uidByte[i]);
	}

  return CardUID;
}

// Convert Bytes to and Hexadecimal representation
// @return String
std::string ByteToHex(uint8_t Byte){
  std::string hexStr;
  char *hexRepresentations[] = {
    "0", "1", "2", "3", "4", "5", "6",
    "7", "8", "9", "A", "B", "C",
    "D", "E", "F"
  };
  int t;

  // The first letter
  t = floor(Byte / 16);
  hexStr = hexRepresentations[t];

  t = Byte % 16;
  hexStr += hexRepresentations[t];

  return hexStr;
}

void setup() {
  // Initialize serial communications with the PC
  Serial.begin(115200);

  // Set the Wifi connection
  WiFi.mode(WIFI_STA);
  WiFi.config(INADDR_NONE, INADDR_NONE, INADDR_NONE, INADDR_NONE);
  WiFi.setHostname(wifiHostname); // Set the hostname to be function-related
  WiFi.begin(ssid, pwd);
  Serial.println("\n Connecting to Wifi...");

  // loop while the connection is being set up
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  // Before any debug, let's set up some environment variables
  nodeIP = WiFi.localIP();
  RouterIP = WiFi.gatewayIP();

  // Some Serial print to debug ^-^
  Serial.printf("\n Connected to the wifi network: %s \n", ssid);
  Serial.printf("Local ESP32 IP: %s, with an RSSI of %d and a gateway at %s\n", nodeIP.toString(), WiFi.RSSI(), RouterIP.toString());

  while (!Serial);                          // Do nothing if no serial port is opened (added for Arduinos based on ATMEGA32U4)
    SPI.begin(SCK_PIN, MISO_PIN, MOSI_PIN); // Init SPI bus
    mfrc522.PCD_Init();                     // Init MFRC522
    delay(5);                               // Optional delay. Some board do need more time after init to be ready, see Readme
    mfrc522.PCD_DumpVersionToSerial();      // Show details of PCD - MFRC522 Card Reader details

  // Check and retrieve the NTP value of the local network
  checkAndRetrieveLocalNTPValue();
}


void loop() {
  WiFiClient client;

  // Reset the loop if no new card present on the sensor/reader. This saves the entire process when idle.
  if ( ! mfrc522.PICC_IsNewCardPresent()) {
    return;
  }
  // Select one of the cards
  if ( ! mfrc522.PICC_ReadCardSerial()) {
    return;
  }

  if (!client.connect(WiFi.gatewayIP(), TCPPort)) {
    // The client couldn't connect to the server
    Serial.printf("We couldn't connect to the server: %s, so we went offline for now.\n", RouterIP.toString());
    printf("TEST-OFFLINE: %s \n");
  } else {
    // We could connect to the server
    const char* Profile = createProfile();
    printf("TEST: %s \n", Profile);
    client.printf("TEST: %s \n", Profile);
  }

  // createProfile();

}

void checkAndRetrieveLocalNTPValue(){
  const int gmtOffset = 2*3600;
  const char* ntpServer= "ntp.accelance.net";

  configTime(gmtOffset, 0, ntpServer);

  struct tm timeinfo;

  if(!getLocalTime(&timeinfo)){
    Serial.println("Failed to obtain time");
    return;
  }
  Serial.println(&timeinfo, "%A, %B %d %Y %H:%M:%S");
}

// Start Profile related function area
const char* createProfile(){
  int currentHour = rtc.getHour(true); // Boolean as parameter to indicate if it should return in 24h format
  int currentMinute = rtc.getMinute();
  int currentSecond = rtc.getSecond();
  unsigned long currentMillisecond = rtc.getMillis();

  std::string result;
  std::string currentTime;
  std::string cardUID = ReturnCardUID(&(mfrc522.uid));

  currentTime = std::to_string(currentHour) + ":" + std::to_string(currentMinute) + ":" + std::to_string(currentSecond) + ":" + std::to_string(currentMillisecond);
  result = currentTime + " | " + cardUID;

  return result.c_str();
}

// End Profile related function area
