# modules influx et datetime
import influxdb_client,time
from influxdb_client import InfluxDBClient, Point, WritePrecision
#  permet de synchroniser les données
from influxdb_client.client.write_api import SYNCHRONOUS
import datetime
# import connexion
#generation des trames par nombres aléatoires
import random as rand

#  connexion à la base de données
# setup database
token = "jqOiY96n4BjfxVHOsZCZVIkbPx8eroSZQdb7RLEMM1fGg8jLD-gQoMeUR2WpWwYTZkFLZ5WUj5Mr-wsrN6nQxA=="
org = "IUTdebeziers"
url = "http://51.158.107.83:8086"

# On essaye la connexion à la base de données si ça fonctionne code=0 et affichage de Connected to database
try :
    client = influxdb_client.InfluxDBClient(url=url, token=token, org=org)
    print("Connected to database")
    code=0

    # sinon code=1 et affichage de Error while connecting to database
except : 
    print("Error while connecting to database")
    code=1
    exit(1)



# connexion.connexion()

# generation des trames par nombres aléatoires
status=rand.randint(0,1)
compteur=rand.randint(0,120)
comp=compteur

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

#  on essaye d'enregistrer les données dans la base de données si ça fonctionne codeajout=0 et affichage de Data sent to database :  {datetime.datetime.now()}
try:

    # initilisation de la base de données
    bucket="Interrupteur"

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
            Point("Compteur").field("Value", comp)
            )
        write_api.write(bucket=bucket, org="IUTdebeziers", record=counter)
        time.sleep(10)
    codeajout=0
    print(f"Data sent to database :  {datetime.datetime.now()}")

# sinon codeajout=1 et affichage de Error while sending data to database
except :
    print("Error while sending data to database")
    codeajout=1
    exit(1)