import React, { useState, useEffect } from "react";
import { InfluxDB } from "@influxdata/influxdb-client";
import { ResponsiveLine } from "@nivo/line";
import {INFLUX_TOKEN, INFLUX_URL, INFLUX_ORG, INFLUX_BUCKET} from "../env.mjs";



export function TestQuery(){
  let query = `from(bucket: ${INFLUX_BUCKET})
    |> range(start: -15d)
    |> filter(fn: (r) => r["_field"] == "nombre de personne")
    |> yield(name: "mean")`;
  const [data, setData] = useState([]);

  var result = useEffect(() => {
    let res = [];
    const influxQuery = async () => {
      // create InfluxDB client
      const queryApi = await new InfluxDB({ INFLUX_URL, INFLUX_TOKEN }).getQueryApi(INFLUX_ORG);
      // make query
      await queryApi.queryRows(query, {
        next(row, tableMeta) {
          const o = tableMeta.toObject(row);
          // push rows from query into an array object
          res.push(o);
        },
        complete() {

          let finalData = []

          // variable is used to track if the current ID already has a key
          setData(finalData);

        },
        error(error) {
          console.log("query failed- ", error);
        }
      });

    };

    influxQuery();
  }, [query]);

  return (
    <div>
      <h2>Hi,</h2>
      It's me Mario

      <div id="test-query-results">
        Here are the results of your query:

        <ResponsiveLine data={data} />
      </div>
    </div>
  )
}

