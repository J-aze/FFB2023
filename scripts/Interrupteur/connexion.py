# Connexion avec influxDB et envoie de données
import influxdb_client
from influxdb_client import InfluxDBClient, Point, WritePrecision
from influxdb_client.client.write_api import SYNCHRONOUS

def connexion():
    global client
    token = "jqOiY96n4BjfxVHOsZCZVIkbPx8eroSZQdb7RLEMM1fGg8jLD-gQoMeUR2WpWwYTZkFLZ5WUj5Mr-wsrN6nQxA=="
    org = "IUTdebeziers"
    url = "http://51.158.107.83:8086"

    try :
        client = influxdb_client.InfluxDBClient(url=url, token=token, org=org)
        print("Connected to database")
        code=0
    except : 
        print("Error while connecting to database")
        code=1
        exit(1)
