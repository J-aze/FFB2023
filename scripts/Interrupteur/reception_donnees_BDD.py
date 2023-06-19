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


def data_ordered(table , second_table, debug=False):
    #  initialisation des variables

    x = 0 # Compteur d'itérations

    tab1=[]
    tab2=[]
    Status=[]
    Seconde=[]

#  récupération des données de la table Status et Compteur
    for element in table:
        for record in element.records:
            if debug:
                print("[DEBUG](Status):", record)
                print(f"[DEBUG](Compteur): `_time`: {record['_time']}, `_measurement`: {record['_measurement']}, `_value`: {record['_value']}")

            #opération pour récupérer les données de la table Status
            status = {
                "status": record["_measurement"],
                "value":record["_value"]
            }
            Status.append(status)

            record["_time"].replace(microsecond=0)

            time = {
                "time": record["_time"]
            }

            tab1.append(time)

            x += 1


    for element in second_table:
        for record in element.records:
            if debug:
                print("[DEBUG](Status):", record)
                print(f"[DEBUG](Compteur): `_time`: {record['_time']}, `_measurement`: {record['_measurement']}, `_value`: {record['_value']}")

            #opération pour récupérer les données de la table Compteur

            seconde = {
                "Compteur": record["_measurement"],
                "Secondes": record["_value"]
            }

            Seconde.append(seconde)
            record["_time"].replace(microsecond=0)

            time = {
                "time": record["_time"]
                }

            tab2.append(time)


    if debug:
        print("Tableau 1 et 2:", tab1, tab2)

    #  comparaison des données temps de la table Status et Compteur
    for v in range(x):
        if debug:
            print(f"Value table 1 & table 2:", tab1[v], tab2[v])

        # si les données sont identiques affichage de ok et des données de la table Status et Compteur
        if tab1[v]==tab2[v]:
            print("ok")
            print(Status[v]["status"], Seconde[v]["Compteur"])
            print(Status[v]["value"], Seconde[v]["Secondes"])
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
