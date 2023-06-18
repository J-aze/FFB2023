# modules influx et datetime
import influxdb_client,time
from influxdb_client import InfluxDBClient, Point, WritePrecision
#  permet de synchroniser les données
from influxdb_client.client.write_api import SYNCHRONOUS
import datetime
from connexion import connexion as influxConnexion
#generation des trames par nombres aléatoires
import random as rand

def generate_trame_data():
    global time_status_updated, status
    # generation des trames par nombres aléatoires
    status = rand.randint(0, 5)
    current_time = None

    good_status = False

    while not good_status:
        if status in [0, 1]:
            print("Good status")
            good_status = True
        else:
            status = rand.randint(0, 5)
            print("Bad status - re-roll engaged")

    current_time = datetime.datetime.now().timestamp()
    time_taken = current_time-time_status_updated
    time_status_updated = current_time

    return status, time_taken



def check_corruption_status(status):
    global Status, value
    # Empeche la corruption des données du status limité a 1 ou 0
    if status == 1:
        print('status : ',status)
        Status = 1
        value=status
    elif status == 0:
        print('status : ',status)
        Status = 1
        value=status
    elif status > 1: 
        print('status : ',status)
        print("status error : too high")
    elif status < 0:
        print('status : ',status)
        print("status error : too low")
    else :
        print('status : ',status)
        print("status error : unknown error")
        exit(1)

def envoi_donnees_influxdb(Status, value, time_to_update):
    #  on essaye d'enregistrer les données dans la base de données si ça fonctionne codeajout=0 et affichage de Data sent to database :  {datetime.datetime.now()}
    try:

        # initilisation de la base de données
        bucket = "Interrupteur"

        #  schronisation des données
        write_api = client.write_api(write_options=SYNCHRONOUS)

        # Pour la valeur de status on envoie la valeur de status
        for value in range(Status):
            state = (
                Point("Status").field("Value", status)
            )
            write_api.write(bucket=bucket, org="IUTdebeziers", record=state)

        # Pour la valeur de status on envoie la valeur de compteur
        for value in range(Status):
            counter = (
                Point("Compteur").field("Secondes", time_to_update )
            )
            write_api.write(bucket=bucket, org="IUTdebeziers", record=counter)
            time.sleep(10)
        codeajout = 0
        print(f"Data sent to database :  {datetime.datetime.now()}")

    # sinon codeajout=1 et affichage de Error while sending data to database
    except:
        print("Error while sending data to database")
        codeajout = 1
        exit(1)

### Last time status updated -> Is going to be updated when called
time_status_updated = datetime.datetime.now().timestamp() # As timestamp

# appel des fonctions


###  connexion à la base de données
INFLUXDB_TOKEN = "token"
INFLUXDB_ORG = "org"
INFLUXDB_PORT = "8086"
INFLUXDB_URL = f"http://localhost:{INFLUXDB_PORT}"

client, connexion_status = influxConnexion(INFLUXDB_URL, INFLUXDB_ORG, INFLUXDB_TOKEN)


#### Tests
new_status, time_to_update = generate_trame_data()
while True :
    # generate_trame_data()
    check_corruption_status(status)
    time_to_update = float(f"{time_to_update:.2f}")
    envoi_donnees_influxdb(Status, value, time_to_update)
    print(f"Status updated to {new_status} in {time_to_update:.2f}s at {datetime.datetime.fromtimestamp(time_status_updated)}")
    time.sleep(3)


