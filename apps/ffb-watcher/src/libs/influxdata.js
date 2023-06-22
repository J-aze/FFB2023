import { InfluxDB, Point } from "@influxdata/influxdb-client";
import {url, token, org} from "../env.mjs";

export function tesQuery(){
  const fluxQuery = 'from(bucket:"test_id_carte") |> range(start: 0)'
  const myQuery = async () => {
    for await (const {values, tableMeta} of queryAPI.iterateRows(fluxQuery)) {
      const o = tableMeta.toObject(values)
      console.log(
        `${o._field}=${o._value}`
      )
    }
  }
  return myQuery;
}
const queryAPI = new InfluxDB({url, token}).getQueryApi(org);
