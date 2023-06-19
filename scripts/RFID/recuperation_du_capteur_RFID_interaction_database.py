import json
import paho.mqtt.client as mqtt  # pip install paho.mqtt
import decodage_partition
import time
import tombola_ajout

#numero_ticket = 0

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

        timeBeforeDecode = time.time()
        message_decode = decodage_partition.decodage_partition(payload_msg)
        timeAfterDecode = time.time()
        #print (message_decode)

        nbr_ticket = input("Combien de ticket voulez vous ajouter ? : ")
        tombola_ajout.main(message_decode[3],nbr_ticket)

        timeBeforeWrite = time.time()
        with open('./src/donnees.json', "a") as file:
            json.dump(data, file, indent=4)
        timeAfterWrite = time.time()
            
        # Vous pouvez également effectuer d'autres actions avec les données ici

        print(f"Temps de décodage : {timeAfterDecode - timeBeforeDecode}s, temps d'écriture : {timeAfterWrite - timeBeforeWrite}s")
        print("Je suis maintenant prêt à recevoir de nouveaux messages !")
        
    except json.JSONDecodeError:
        # Ignorer les messages non valides (non JSON)
        pass


def init():
    # Time of tests
    timeBeforeDecode = None
    timeAfterDecode = None
    timeBeforeWrite = None
    timeAfterWrite = None

    # Configuration du client MQTT
    client = mqtt.Client()
    client.username_pw_set("PC_Lucas ./Document/mdp.md")
    client.connect("PC_Lucas ./Document/mdp.md", 1883)

    # Abonnement au topic
    client.subscribe("PC_Lucas ./Document/mdp.md")

    # Configuration de la callback pour la réception des messages
    client.on_message = on_message

    print("stand : poste de negosiation")
    print("Je suis initialisé !")

    # Boucle de réception des messages MQTT
    client.loop_forever()
