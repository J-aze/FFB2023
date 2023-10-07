import influxdb_client
import urllib3

print("We're disabling the SSL Warnings...")
urllib3.disable_warnings()

bucket = "ffb-2023"
org = "FFB2023"
token = "rtj6VYUdKsywIeO-92wufM-RoMLXOly-vMZEdhoRHtLd9ecMsdYpeDzKTn_VNRUt4Q1-CMhLFUd2NHN8arWBLQ=="
url = "https://influxffb.iutbeziers.fr"

export_path = "./export"
### Those are both duplicates, errors and my own card.
to_ignore_by_email = ["killia.peyraux@gmail.com", "souris-noir@live.fr", "alexis.opolka@proton.me"]

client = influxdb_client.InfluxDBClient(
  url = url,
  token = token,
  org = org,
  verify_ssl = False
)

print("We're configuring the query and querying the database...")

query_api = client.query_api()

query = f'from(bucket: "{bucket}")\
  |> range(start: -20d, stop: -2s)\
  |> filter(fn: (r) => r["_field"] == "tickets-0" or r["_field"] == "tickets-2" or r["_field"] == "tickets-1" or r["_field"] == "tickets-3" or r["_field"] == "tickets-4" or r["_field"] == "tickets-5" or r["_field"] == "tickets-6" or r["_field"] == "tickets-7" or r["_field"] == "tickets-8" or r["_field"] == "tickets-9")\
  |> aggregateWindow(every: 2m, fn: mean, createEmpty: false)\
  |> yield(name: "last")'

cards_number_query = f'from(bucket: "{bucket}")\
  |> range(start: -20d, stop: -2s)\
  |> filter(fn: (r) => r["_field"] == "ffb-watcher")\
  |> aggregateWindow(every: 2m, fn: last, createEmpty: false)\
  |> yield(name: "last")'

result = query_api.query(org=org, query=query)
cards_number = query_api.query(org=org, query=cards_number_query)

print("We're creating our results array...")

results = {
  key: 0 for key in range(1, 40)
}
results_RFID ={}

print("We're reorganizing the tickets by IDs, please wait...")
for table in result:
  for record in table.records:
    ### If not present we create the dict entry
    if not record.get_measurement() in results_RFID.keys():
      results_RFID[record.get_measurement()] = []

    results_RFID[record.get_measurement()].append(int(record.get_value()))


print("We're reorganizing the tickets by stand, please wait...")

cards_with_tickets = 0

for table in result:
  cards_with_tickets += 1

  for record in table.records:
    intResult = int(record.get_value())

    if intResult == 19:
      results[9] += 1

    else:
      results[intResult] += 1

print("We're currently making the total of tickets we have registered and retrieved...")

cards_total = 0

for table in cards_number:
  to_ignore = False

  for record in table:
    if record["email"] in to_ignore_by_email:
      to_ignore = True

  if not to_ignore:
    cards_total += 1

print(f"We went through {cards_with_tickets} records over {cards_total} cards.")
