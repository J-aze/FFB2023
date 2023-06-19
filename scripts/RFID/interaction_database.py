### pip install influxdb-client

import influxdb_client
from influxdb_client.client.write_api import SYNCHRONOUS



def creation_profil_groupe(ID_RFID, nbr_personne) :
    bucket = "test_id_carte"
    org = "IUTdebeziers"
    token = "PC_Lucas ./Document/mdp.md"
    # Store the URL of your InfluxDB instance
    url = "PC_Lucas ./Document/mdp.md"

    client = influxdb_client.InfluxDBClient(
        url=url,
        token=token,
        org=org
    )

    write_api = client.write_api(write_options=SYNCHRONOUS)
    db = {
        "Identifient de la carte": ID_RFID,
        "nombre de personne": nbr_personne,
    }

    p = influxdb_client.Point(db["Identifient de la carte"])

    p.field("nombre de personne", db["nombre de personne"])

    write_api.write(bucket=bucket, org=org, record=p)

def ajout_profil_ticket_tombola(ID_RFID, num_tiket) :
    bucket = "test_id_tombola"
    org = "IUTdebeziers"
    token = "PC_Lucas ./Document/mdp.md"
    # Store the URL of your InfluxDB instance
    url = "PC_Lucas ./Document/mdp.md"


    client = influxdb_client.InfluxDBClient(
        url=url,
        token=token,
        org=org
    )

    write_api = client.write_api(write_options=SYNCHRONOUS)
    db = {
        "Identifient_du_ticket": num_tiket,
        "Id_carte": ID_RFID,
    }

    p = influxdb_client.Point(db["Identifient_du_ticket"])

    p.field("Id_carte", db["Id_carte"])

    write_api.write(bucket=bucket, org=org, record=p)








