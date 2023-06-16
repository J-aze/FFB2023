import json
import paho.mqtt.client as mqtt
# Pour un affichage plus joli format json dans le terminal
from rich import print as pprint
import Decodage_interrupteur as dec

# Callback appelée lors de la réception d'un message MQTT
def on_message(client, userdata, msg):
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

# Configuration du client MQTT
client = mqtt.Client()
#  assignation username et access key
client.username_pw_set('iutb-sae204-2023@ttn', 'NNSXS.6QCXZEARX6HYV6BOVY47EXFMV25MIWFAAFNZFTQ.4Z6ZUZGMNVVGVQY4JCTANZWY7YRHCBG4NQVRYYWLJLPK24RMLDXA')
# Connection au server TTN
client.connect('eu1.cloud.thethings.network', 1883)

# Suivi de l'appareil mcf-io-02
client.subscribe('v3/iutb-sae204-2023@ttn/devices/mcf-io-02/up')

# Configuration de la callback pour la réception des messages
client.on_message = on_message

# Boucle de réception des messages MQTT
client.loop_forever()