import influxdb_client, os, time
from influxdb_client import InfluxDBClient, Point, WritePrecision
from influxdb_client.client.write_api import SYNCHRONOUS

token = "token"
org = "org"
url = "http://localhost:8086"

try:
    client = influxdb_client.InfluxDBClient(url=url, token=token, org=org)
    print("Connected to database")
    code=0
except:
    print("Error while connecting to database")
    code=1
    exit(1)

bucket="Interrupteur"

write_api = client.write_api(write_options=SYNCHRONOUS)

for value in range(2):
    point = (
        Point("Status")
        .field("Value", value))
    write_api.write(bucket=bucket, org="IUTdebeziers", record=point)
    time.sleep(10)

query_api = client.query_api()

query = """from(bucket: "Interrupteur")|> range(start: -10m)|> filter(fn: (r) => r._measurement == "Status")"""
tables = query_api.query(query, org="IUTdebeziers")

for table in tables:
    for record in table.records:
        # print(record)
        print(record["_time"])
        print(record["_measurement"])
        print(record["_value"])
