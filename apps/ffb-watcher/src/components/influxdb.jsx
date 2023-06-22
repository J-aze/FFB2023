import React, { useState, useEffect } from "react";
import { InfluxDB } from "@influxdata/influxdb-client";
import {INFLUX_TOKEN, INFLUX_URL, INFLUX_ORG, INFLUX_BUCKET} from "../env.mjs";
import { TestResponsiveLine } from "./test/testComponents";
import { ResponsiveLineChart} from "./charts";


export function TestQuery(){
  var query = `from(bucket: "${INFLUX_BUCKET}")
    |> range(start: -15d)
    |> filter(fn: (r) => r["_field"] == "nombre de personne")
    |> yield(name: "mean")`;

  const [data, setData] = useState([]);
  const [queryNbr, setQueryNbr] = useState(0);
  var res = [];
  var knownID = [];

  useEffect(() => {
    const influxQuery = async () => {
      // create InfluxDB client
      const queryApi = await new InfluxDB({url: INFLUX_URL, token: INFLUX_TOKEN}).getQueryApi(INFLUX_ORG);
      // make query
      await queryApi.queryRows(query, {
        next(row, tableMeta) {
          const o = tableMeta.toObject(row);
          // push rows from query into an array object
          if (!knownID.includes(o["_measurement"])) {
            knownID.push(o["_measurement"]);
            res.push(o);
          } else {
            const isTheIndexWereSearchingFor = (element) => element === o["_measurement"];
            res[knownID.findIndex(isTheIndexWereSearchingFor)] = o;
          }
        },
        complete() {
          const finalData = [{
            data: []
          }];

          for (let i = 0; i < res.length; i++) {
              let point = {}

              // Let's create the point coordinates
              point["x"] = res[i]["_time"]
              point["y"] = res[i]["_value"]

              finalData[0].data.push(point)
          }

          // Update the `state` variables
          setData(finalData);
          setQueryNbr(res.length);
        },
        error(error) {
          console.log("query failed- ", error);
        }
      });

    };

    influxQuery();
  }, []);

  return (
    <div>
      <h2>Hi,</h2>

      <div id="test-query-results">
        <ResponsiveLineChart chartTitle="Number of people per RFID Card" dataset={data} color={{r: 63, g: 52, b: 19}} queryNbr={queryNbr} />
      </div>
    </div>
  )
}

export function InfluxQuery(){
  var query = `from(bucket: "${INFLUX_BUCKET}")
    |> range(start: -15d)
    |> filter(fn: (r) => r["_field"] == "nombre de personne")
    |> yield(name: "mean")`;

  const [data, setData] = useState([]);
  const [queryNbr, setQueryNbr] = useState(0);
  var res = [];
  var knownID = [];

  useEffect(() => {
    const influxQuery = async () => {
      // create InfluxDB client
      const queryApi = await new InfluxDB({url: INFLUX_URL, token: INFLUX_TOKEN}).getQueryApi(INFLUX_ORG);
      // make query
      await queryApi.queryRows(query, {
        next(row, tableMeta) {
          const o = tableMeta.toObject(row);
          // push rows from query into an array object
          if (!knownID.includes(o["_measurement"])) {
            knownID.push(o["_measurement"]);
            res.push(o);
          } else {
            const isTheIndexWereSearchingFor = (element) => element === o["_measurement"];
            res[knownID.findIndex(isTheIndexWereSearchingFor)] = o;
          }
        },
        complete() {
          const finalData = [{
            data: []
          }];

          for (let i = 0; i < res.length; i++) {
              let point = {}

              // Let's create the point coordinates
              point["x"] = res[i]["_time"]
              point["y"] = res[i]["_value"]

              finalData[0].data.push(point)
          }

          // Update the `state` variables
          setData(finalData);
          setQueryNbr(res.length);
        },
        error(error) {
          console.log("query failed- ", error);
        }
      });

    };

    influxQuery();
  }, []);

  return (
    <div>
      <div id="test-query-results">
        <ResponsiveLineChart chartTitle="Number of people per RFID Card" dataset={data} color={{r: 63, g: 52, b: 19}} queryNbr={queryNbr} />
      </div>
    </div>
  )
}

export function GetSelectRFIDCards(){
  var query = `from(bucket: "${INFLUX_BUCKET}")
    |> range(start: -15d)
    |> yield(name: "mean")`;

  const [data, setData] = useState([]);
  var res = [];
  var knownID = [];

  useEffect(() => {
    const influxQuery = async () => {
      // create InfluxDB client
      const queryApi = await new InfluxDB({url: INFLUX_URL, token: INFLUX_TOKEN}).getQueryApi(INFLUX_ORG);
      // make query
      await queryApi.queryRows(query, {
        next(row, tableMeta) {
          const o = tableMeta.toObject(row);
          // push rows from query into an array object
          if (!knownID.includes(o["_measurement"])) {
            knownID.push(o["_measurement"]);
            res.push(o["_measurement"]);
          } else {
            const isTheIndexWereSearchingFor = (element) => element === o["_measurement"];
            res[knownID.findIndex(isTheIndexWereSearchingFor)] = o["_measurement"];
          }
        },
        complete() {
          // Update the `state` variables
          setData(res);
        },
        error(error) {
          console.log("query failed- ", error);
        }
      });

    };

    influxQuery();
  }, []);


  return (
    <>
      {// Don't ask questions, it works using the `.map()` method of an array -_-
      data.map((rfidUID, i) => (
        <option value={rfidUID}>{rfidUID}</option>
      ))}
    </>
  )
}

export function UpdateInflux(data){
  console.log("UpdateInflux Data: ", data);

  return(
    <></>
  )
}
