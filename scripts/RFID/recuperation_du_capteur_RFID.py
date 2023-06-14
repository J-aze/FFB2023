import json
import paho.mqtt.client as mqtt
import decodage_partition

# Callback exécutée lors de la réception d'un message MQTT
def on_message(client, userdata, msg):
    try:
        # Analyse des données JSON
        data = json.loads(msg.payload)
        
        # Traitement des données et enregistrement dans un fichier JSON

        #json_data = {
        #    "id": "carte_1",
        #    "data": data
        #    }
        

        payload_msg = data["uplink_message"]["frm_payload"]
        #print (payload_msg)

        decodage_partition.decodage_partition(payload_msg)
    

        with open('./src/donnees.json', "a") as file:
            json.dump(data, file, indent=4)
            
        # Vous pouvez également effectuer d'autres actions avec les données ici
        
    except json.JSONDecodeError:
        # Ignorer les messages non valides (non JSON)
        pass

# Configuration du client MQTT
client = mqtt.Client()
client.username_pw_set('iutb-sae204-2023@ttn', 'NNSXS.6QCXZEARX6HYV6BOVY47EXFMV25MIWFAAFNZFTQ.4Z6ZUZGMNVVGVQY4JCTANZWY7YRHCBG4NQVRYYWLJLPK24RMLDXA')
client.connect('eu1.cloud.thethings.network', 1883)

# Abonnement au topic
client.subscribe('v3/iutb-sae204-2023@ttn/devices/rftrack-02/up')

# Configuration de la callback pour la réception des messages
client.on_message = on_message

# Boucle de réception des messages MQTT
client.loop_forever()
