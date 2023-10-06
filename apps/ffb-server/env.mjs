/** InfluxDB v2 URL */
const url = process.env["INFLUX_URL"] || "https://influxffb.iutbeziers.fr";
/** InfluxDB authorization token */
const token = process.env["INFLUX_TOKEN"] || "cyXUzkDCr-mcm8ebSNldN7oLDMOp9os1yORAwIA2b8tK9QpXQ4oCQ5CqxUcAAmGzrUuA0AMUF0UuIO2XxDYbBQ==";
/** Organization within InfluxDB  */
const org = process.env["INFLUX_ORG"] || "FFB2023";
/**InfluxDB bucket used in examples  */
const bucket = "ffb-2023";

export { url, token, org, bucket };
