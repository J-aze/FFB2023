#!/bin/env python3

import json
import paho.mqtt.client as mqtt
import Decodage_interrupteur as dec

# Callback appelée lors de la réception d'un message MQTT
def on_message(client, userdata, msg, debug=False):

    ### TODO: Voir si ça ne pose pas de problèmes lors du callback
    if debug:
        print("(reception_donnes_interrupteur)[on_message]:", client, userdata)

    try:
        # Initialisation de la variable data avec le contenu du message
        data = json.loads(msg.payload)
        # Debug affichage de la data
        # pprint(data)

        # Ecriture des données dans le fichier donnees.json
        with open('donnees.json', "a") as file:
            json.dump(data, file, indent=4)

        #Parsage du payload en base 64
        payload_msg = data["uplink_message"]["frm_payload"]
        # Debug affichage du payload
        # pprint (payload_msg)
        
        # Voir Decodage_interrupteur.py 
        dec.decodage_partition(payload_msg)

        # Debug erreur
    except json.JSONDecodeError:
        # Ignorer les messages non valides (non JSON)
        pass

### Constantes

#### MQTT Broker
MQTT_BROKER_ACCESS_KEY = "LA-CLE-ACCES" # La clé d'accès (API) au flux MQTT
MQTT_BROKER_SERVER = "LE-BROKER-MQTT" # Adresse du Broker MQTT avec une forme `server@ttn`
MQTT_DEVICE = "APPAREIL" # L'ID du device que l'on écoute, utiliser `+` pour écouter tous les appareils
MQTT_DEVICE_FLUX = "LE-FLUX" # Soit `up` soit `down`

#### The Things Network
TTN_SERVER = "SERVEUR-TTN"

# Configuration du client MQTT
client = mqtt.Client()
#  assignation username et access key
client.username_pw_set(MQTT_BROKER_SERVER, MQTT_BROKER_ACCESS_KEY)
# Connection au server TTN
client.connect(TTN_SERVER, 1883)

# Suivi de l'appareil mcf-io-02
client.subscribe(f'v3/{MQTT_BROKER_SERVER}/devices/{MQTT_DEVICE}/{MQTT_DEVICE_FLUX}')

# Configuration de la callback pour la réception des messages
client.on_message = on_message

# Boucle de réception des messages MQTT
client.loop_forever()
