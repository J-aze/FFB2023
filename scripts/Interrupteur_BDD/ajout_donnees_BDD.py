from influxdb_client import InfluxDBClient
import random as rd

def connexion():
    global code ,client
    try:
        client = InfluxDBClient(url="http://51.158.107.83:8086", token='kOOGvCNByEOcirI6rWsoa21KoTV-WDfSxKi082BrUMmx5_DnfEsAhf0n7QjGumvnqNkMhq6cMJjzxQ14DpplPw==', org="IUTdebeziers")
        print("Connected to database")
        code=0
# Si ça ne fonctionne pas code=1 et affichage de Error while connecting to database
    except:
        print("Error while connecting to database")
        code=1
        exit(1)    

global status
status = str(rd.randint(0,2))
compteur = str(rd.randint(0,120)) 
# Connexion avec influxDB et envoie de données
def envoie_donnees():
    if code == 0:
        # print("envoie de données")
        # si status == "1": on envoie la données 1 sinon on envoie la donnée 0
        if status == "1":
            print('status : ',1)
        elif status == "0" :
            print('status : ',0)
            # debug 
        else:
            print("Erreur de status")
        # On ajoute les données dans la base de données
    else:
        print("Error while sending data to database")

# Appel des fonctions
connexion()
envoie_donnees()