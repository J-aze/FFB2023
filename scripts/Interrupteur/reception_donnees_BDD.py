import influxdb_client,time
from influxdb_client import InfluxDBClient, Point, WritePrecision
#  permet de synchroniser les données
from influxdb_client.client.write_api import SYNCHRONOUS
import datetime
from connexion import connexion as influxConnexion


def get_data():
    global tables, tables2
    # initialisation de la variable query_api
    query_api = client.query_api()

    # demande à l'utilisateur sur combien de temps il veut voir les données
    time=str(input("Sur combien de temps voulez vous voir les données (1min, 1h ,1d , 1m , ...) ? "))

    #  requête pour récupérer les données de la table Status et Compteur
    query = f"""from(bucket: "Interrupteur")|> range(start: -{time})|> filter(fn: (r) => r._measurement == "Status")"""
    query2= f"""from(bucket: "Interrupteur")|> range(start: -{time})|> filter(fn: (r) => r._measurement == "Compteur")"""

    #  récupération des données de la table Status et Compteur
    tables = query_api.query(query, org="IUTdebeziers")
    tables2 = query_api.query(query2, org="IUTdebeziers")
    return tables, tables2


def data_ordered(tables , tables2) :
    #  initialisation des variables
    tab=0
    tab1=[]
    tab2=[]
    Status=[]
    Seconde=[]

#  récupération des données de la table Status et Compteur
    for table in tables:
        for record in table.records:
            #↓ debug affichage du format des données (json) ↓
            # print(record)
            #↑ debug affichage des données de la table Status ↑
            # ↓ debug affichage des données de la table Compteur ↓
            # print(record["_time"])
            # print(record["_measurement"])
            # print(record["_value"])
            #↑ debug affichage des données de la table Compteur ↑
            #opération pour récupérer les données de la table Status
            status={"status":record["_measurement"], "value":record["_value"]}
            Status.append(status)
            time1=record["_time"].replace(microsecond=0)
            time12={"time":time1}
            tab1.append(time12)
            tab+=1


    for table2 in tables2:
        for record2 in table2.records:
            #↓ debug affichage du format des données (json) ↓
            # print(record2)
            #↑ debug affichage des données de la table Status ↑
            # ↓ debug affichage des données de la table Compteur ↓
            # print(record2["_time"])
            # print(record2["_measurement"])
            # print(record2["_value"])
            #↑ debug affichage des données de la table Compteur ↑
            #opération pour récupérer les données de la table Compteur
            seconde={"Compteur":record2["_measurement"], "Secondes":record2["_value"]}
            Seconde.append(seconde)
            time2=record2["_time"].replace(microsecond=0)
            time22={"time":time2}
            tab2.append(time22)

    # ↓ debug voir les valeurs de tab1 et tab2 (datetime) ↓
    # print(tab1)
    # print(tab2)
    # ↑ debug voir les valeurs de tab1 et tab2 (datetime) ↑

    #  comparaison des données temps de la table Status et Compteur
    for v in range(tab):
        # print(tab1[v],tab2[v])
        # si les données sont identiques affichage de ok et des données de la table Status et Compteur
        if tab1[v]==tab2[v]:
            print("ok")
            print(Status[v]["status"],Seconde[v]["Compteur"])
            print(Status[v]["value"],Seconde[v]["Secondes"])

        else:
            print("pas ok")


###  connexion à la base de données
INFLUXDB_TOKEN = "token"
INFLUXDB_ORG = "org"
INFLUXDB_PORT = "8086"
INFLUXDB_URL = f"http://localhost:{INFLUXDB_PORT}"

client, connexion_status = influxConnexion(INFLUXDB_URL, INFLUXDB_ORG, INFLUXDB_TOKEN)

get_data()
data_ordered(tables,tables2)
