# Connexion avec influxDB et envoie de données
from influxdb_client import InfluxDBClient

# On essaye la connexion à la base de données si ça fonctionne code=0 sinon et affichage de Connected to database
def connexion():
    global code , client
    try:
        client = InfluxDBClient(url="http://51.158.107.83:8086", token='kOOGvCNByEOcirI6rWsoa21KoTV-WDfSxKi082BrUMmx5_DnfEsAhf0n7QjGumvnqNkMhq6cMJjzxQ14DpplPw==', org="IUTdebeziers")
        print("Connected to database")
        code=0

# Si ça ne fonctionne pas code=1 et affichage de Error while connecting to database
    except:
        print("Error while connecting to database")
        code=1
        exit(1)


# On essaye d'envoyer les données dans la base de données si ça fonctionne code=0 sinon et affichage de Error while sending data to database
def donnees_interrupteur_bdd():
    
    if code==0: 
        # On demande à l'utilisateur de choisir le temps qu'il veut afficher
        time=str(input("Voulez-vous afficher les données de la dernière heure, du dernier jour ou de la dernière semaine ? (1m,1h, 1d, 1w) : "))
        tables = client.query_api().query(f'from(bucket:"Interrupteur") |> range(start: -{time})')
    
    # boucle rows qui affiche les données sous forme de tuple
        for table in tables:
            for row in table.records:
                print ("| TEMPS : ",row.values["_time"], end=" ")
                print ("| MESURE : ",row.values["_measurement"], end=" ")
                print ("| NOM : ", row.values["host"], end=" ")
                print ("| CHAMPS : ",row.values["_field"], end=" ")
                print ("| VALEUR : ",row.values["_value"], end="\n")
                # debug affichage des données completes
                # print (row.values)
    # debug pour afficher les données que l'on veut 
    # output = tables.to_values(columns=['_time','_measurement','_field', 'host', '_value'])
    # print(output)
    else:
        print("Error while sending data to database")

# Appel des fonctions
connexion()
donnees_interrupteur_bdd()
