#include <SPI.h>
#include <MFRC522.h>
#include <ESP32Time.h>

#define RST_PIN         26
#define SS_PIN          25
#define SCK_PIN         5
#define MISO_PIN        19
#define MOSI_PIN        18

MFRC522 mfrc522(SS_PIN, RST_PIN);  // Create MFRC522 instance
ESP32Time rtc(2*3600); // GMT+2

void setup() {
  Serial.begin(115200);                     // Initialize serial communications with the PC
  while (!Serial);                          // Do nothing if no serial port is opened (added for Arduinos based on ATMEGA32U4)
    SPI.begin(SCK_PIN, MISO_PIN, MOSI_PIN); // Init SPI bus
    mfrc522.PCD_Init();                     // Init MFRC522
    delay(4);                               // Optional delay. Some board do need more time after init to be ready, see Readme
    mfrc522.PCD_DumpVersionToSerial();      // Show details of PCD - MFRC522 Card Reader details

    Serial.println(F("Scan PICC to see UID, SAK, type, and data blocks..."));
}
void loop() {
  // Reset the loop if no new card present on the sensor/reader. This saves the entire process when idle.
  if ( ! mfrc522.PICC_IsNewCardPresent()) {
    return;
  }
  // Select one of the cards
  if ( ! mfrc522.PICC_ReadCardSerial()) {
    return;
  }

  int currentHour = rtc.getHour(true); // Boolean as parameter to indicate if it should return in 24h format
  int currentMinute = rtc.getMinute();
  int currentSecond = rtc.getSecond();
  unsigned long currentMillisecond = rtc.getMillis();

  // // Dump debug info about the card; PICC_HaltA() is automatically called
  // printf("%d:%d:%d:%d : %d\n", currentHour, currentMinute, currentSecond, currentMillisecond, &(mfrc522.uid));
  printf("%d:%d:%d:%03lu", currentHour, currentMinute, currentSecond, currentMillisecond);
  printf(" | %d \n",&(mfrc522.uid));
}














