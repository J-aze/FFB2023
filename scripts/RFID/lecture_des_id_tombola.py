import influxdb_client
from influxdb_client.client.write_api import SYNCHRONOUS

bucket = "test_id_tombola"
org = "IUTdebeziers"
token = "lrigEelfIPlUAvBIB372ylfKN1A44ecK64rSKqKZGf3ebHwBT0IJXIOrMXVQLFHx6BvhWWcZ7gNyJ8FZS8rT2A=="
# Store the URL of your InfluxDB instance
url = "http://51.158.107.83:8086/"

client = influxdb_client.InfluxDBClient(
    url=url,
    token=token,
    org=org
)

# Query script
query_api = client.query_api()
query = f'from(bucket:"{bucket}")\
|> range(start: -5h)'
result = query_api.query(org=org, query=query)
results = []
for table in result:
    for record in table.records:
        # results.append((record.get_field(), record.get_value()))
        results.append((record.get_measurement(), record.get_value()))

print(results)

