# Connexion avec influxDB et envoie de données
import influxdb_client
from influxdb_client import InfluxDBClient, Point, WritePrecision
from influxdb_client.client.write_api import SYNCHRONOUS
from typing import Tuple


def connexion(INFLUXDB_URL: str, INFLUXDB_ORG: str, INFLUXDB_TOKEN: str) -> InfluxDBClient | bool:

    # client -> InfluxDBClient
    # Peut faire monter une erreur
    # Si tout s'est bien passé -> retourne (client, code d'exécution)
    client = InfluxDBClient(url=INFLUXDB_URL, token=INFLUXDB_TOKEN, org=INFLUXDB_ORG)

    if client.ping():
        # L'exécution s'est bien passée, on retourne le pointeur du client (InfluxDBClient)
        # et retourne le code statut d'exécution -> True (Tout s'est bien passé)
        return (client, True)
    else:
        ### Tout s'est mal passé, on n'a pas pu initalisé le client Influx
        ### On retourne le pointeur du client (InfluxDBClient) et False (La connexion ne peut pas se faire)
        return (client, False)
