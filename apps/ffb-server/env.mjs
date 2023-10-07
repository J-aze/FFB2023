/** InfluxDB v2 URL */
const url = process.env["INFLUX_URL"] || "https://influxffb.iutbeziers.fr";
/** InfluxDB authorization token */
const token = process.env["INFLUX_TOKEN"] || "BfZyF1yP3Fpa2BXvpXf4tZKy9gPt3UP2NAKNk3PlrgT8d-hEqa1SwyyeoAeuTYEKQrEFOlHrQvPT0fd77cb96Q==";
/** Organization within InfluxDB  */
const org = process.env["INFLUX_ORG"] || "FFB2023";
/**InfluxDB bucket used in examples  */
const bucket = "ffb-2023";

export { url, token, org, bucket };
