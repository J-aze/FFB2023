# Connexion avec influxDB et envoie de données
from influxdb_client import InfluxDBClient


def connexion():
    global code 
    try:
        client = InfluxDBClient(url="http://51.158.107.83:8086", token='kOOGvCNByEOcirI6rWsoa21KoTV-WDfSxKi082BrUMmx5_DnfEsAhf0n7QjGumvnqNkMhq6cMJjzxQ14DpplPw==', org="IUTdebeziers")
        print("Connected to database")
        code=0
# Si ça ne fonctionne pas code=1 et affichage de Error while connecting to database
    except:
        print("Error while connecting to database")
        code=1
        exit(1)
    print(code)    

connexion()