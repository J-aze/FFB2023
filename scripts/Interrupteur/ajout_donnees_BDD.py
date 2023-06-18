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
    # generation des trames par nombres aléatoires
    status = rand.randint(0, 1)
    compteur = 0

    if status == 1 or status == 0:
        STatus = True
        time.sleep(10)
        STatus = False
    else:
        STatus = False

    while STatus == False:
        compteur = compteur + 1
        time.sleep(1)
        print("Compteur", compteur)


def check_corruption_status(status):
    # Empeche la corruption des données du status limité a 1 ou 0
    if status == 1:
        print('status : ',status)
        Status = 1
    elif status == 0:
        print('status : ',status)
        Status = 1
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

def envoi_donnees_influxdb(Status):
    #  on essaye d'enregistrer les données dans la base de données si ça fonctionne codeajout=0 et affichage de Data sent to database :  {datetime.datetime.now()}
    try:

        # initilisation de la base de données
        bucket = "Interrupteur"

        #  schronisation des données
        write_api = client.write_api(write_options=SYNCHRONOUS)

        # Pour la valeur de status on envoie la valeur de status
        for value in range(Status):
            state = (
                Point("Status").field("Value", value)
            )
            write_api.write(bucket=bucket, org="IUTdebeziers", record=state)

        # Pour la valeur de status on envoie la valeur de compteur
        for value in range(Status):
            counter = (
                Point("Compteur").field("Value", compteur)
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


#  connexion à la base de données
INFLUXDB_TOKEN = "CLES-ACCES-API"
INFLUXDB_ORG = "ORGANISATION"
INFLUXDB_PORT = "8086"
INFLUXDB_URL = f"http://localhost:{INFLUXDB_PORT}"

client, connexion_status = influxConnexion(INFLUXDB_URL, INFLUXDB_ORG, INFLUXDB_TOKEN)
