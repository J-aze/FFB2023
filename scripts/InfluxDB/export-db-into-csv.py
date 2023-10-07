import influxdb_client
import csv
import json
import urllib3

print("We're disabling the SSL Warnings...")
urllib3.disable_warnings()

bucket = "ffb-2023"
org = "FFB2023"
token = "rtj6VYUdKsywIeO-92wufM-RoMLXOly-vMZEdhoRHtLd9ecMsdYpeDzKTn_VNRUt4Q1-CMhLFUd2NHN8arWBLQ=="
url = "https://influxffb.iutbeziers.fr"

export_path = "./export"
to_ignore_by_email = ["killia.peyraux@gmail.com", "souris-noir@live.fr", "alexis.opolka@proton.me"]
to_ignore_by_uid = []

client = influxdb_client.InfluxDBClient(
  url = url,
  token = token,
  org = org,
  verify_ssl = False
)

start_queries = "-2d"
end_queries = "-2s"

### We are creating a string from a range in order
### to get the required conditions for the query

tickets_expression = f'r["_field"] == "tickets-0"'
for i in range(1, 10):
  tickets_expression += f' or r["_field"] == "tickets-{i}"'

print("We're configuring the query and querying the database...")

query_api = client.query_api()


query = f'from(bucket: "{bucket}")\
  |> range(start: {start_queries}, stop: {end_queries})\
  |> filter(fn: (r) => {tickets_expression})\
  |> aggregateWindow(every: 2m, fn: mean, createEmpty: false)\
  |> yield(name: "mean")'

cards_number_query = f'from(bucket: "{bucket}")\
  |> range(start: {start_queries}, stop: {end_queries})\
  |> filter(fn: (r) => r["_field"] == "ffb-watcher")\
  |> filter(fn: (r) => r["name"] != "")\
  |> aggregateWindow(every: 2m, fn: last, createEmpty: false)\
  |> yield(name: "last")'

result = query_api.query(org=org, query=query)
cards_number = query_api.query(org=org, query=cards_number_query)

print("We're creating our results array...")

results = {
  key: 0 for key in range(1, 40)
}
results_RFID ={}

print("We're currently making the total of tickets we have registered and retrieved (maybe filtering them)...")

cards_total = 0

for table in cards_number:

  for record in table:
    if record["email"] in to_ignore_by_email:
      to_ignore_by_uid.append(record.get_measurement())

    else:

      cards_total += 1

    if not record.get_measurement() in to_ignore_by_uid:

      if not record.get_measurement() in results_RFID.keys():
        results_RFID[record.get_measurement()] = {
          "name": "",
          "surname": "",
          "phone-number": "",
          "email": "",
          "tickets": []
        }

      results_RFID[record.get_measurement()]["name"] = record["name"]
      results_RFID[record.get_measurement()]["surname"] = record["surname"]
      results_RFID[record.get_measurement()]["phone-number"] = record["phoneNumber"]
      results_RFID[record.get_measurement()]["email"] = record["email"]


print("We're reorganizing the tickets by IDs, please wait...")
for table in result:
  for record in table.records:
    ### If not present we create the dict entry
    if not record.get_measurement() in results_RFID.keys():
      results_RFID[record.get_measurement()] = {
        "name": "",
        "surname": "",
        "phone-number": "",
        "email": "",
        "tickets": []
      }

    results_RFID[record.get_measurement()]["tickets"].append(int(record.get_value()))

print("We're sorting the tickets correctly for each UID")
for uid, data in results_RFID.items():
  data["tickets"].sort()

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

print("We're exporting the database to CSV...")

with open(f"{export_path}/{bucket}-stands.csv", "wt", encoding="utf-8", newline="") as csv_export:
  db_writer = csv.writer(csv_export, delimiter=";", quotechar='|', quoting=csv.QUOTE_MINIMAL)

  ### We're writing the headers
  db_writer.writerow(["name", "value"])


  for (key, value) in results.items():
    db_writer.writerow([f'stand-{key}', value])

print("It might take a while...")

with open(f"{export_path}/{bucket}-cards.csv", "wt", encoding="utf-8", newline="") as csv_export:
  db_writer = csv.writer(csv_export, delimiter=";", quotechar='|', quoting=csv.QUOTE_MINIMAL)

  ### We're writing the headers
  db_writer.writerow(["UID", "surname", "name", "phone-number", "email", "tickets"])

  for (key, value) in results_RFID.items():
    if key not in to_ignore_by_uid:
      db_writer.writerow([key, value["surname"], value["name"], value["phone-number"], value["email"], value["tickets"]])

print("Database exported to CSV")

print("We're exporting the database to JSON...")

with open(f"{export_path}/{bucket}-stands.json", "wt", encoding="utf-8", newline="") as json_export:

  json_dict = {
    "stands": {}
  }

  for (key, value) in results.items():
    if key not in json_dict["stands"].keys():
      json_dict["stands"][key] = {
        "name": key,
        "value": value
      }
    else:
      json_dict["stands"][key]["value"] += value

  if json_export.writable():
    json_export.write(json.dumps(json_dict, sort_keys=True, indent=2))

with open(f"{export_path}/{bucket}-cards.json", "wt", encoding="utf-8", newline="") as json_export:
  json_dict = {
    "size": 0,
    "cards": [],
  }

  x = 0; y = 0
  for (key, data) in results_RFID.items():
    curr_dict = {
      "UID": key,
      "name": data["name"],
      "surname": data["surname"],
      "phone-number": data["phone-number"],
      "email": data["email"],
      "tickets": data["tickets"],
      "size": len(data["tickets"]),
    }

    json_dict["cards"].append(curr_dict)

    x += 1
    y += len(data["tickets"])

  ### Let's just update the entire size
  json_dict["size"] = x
  json_dict["total-entries"] = {
    "cards": x,
    "entries": y
  }

  if json_export.writable():
    json_export.write(json.dumps(json_dict, sort_keys=True, indent=2))

print("Database exported to JSON")

print(f"We went through {cards_with_tickets} records over {cards_total} cards.")
