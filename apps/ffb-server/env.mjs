/** InfluxDB v2 URL */
const url = process.env["INFLUX_URL"] || "https://influxffb.iutbeziers.fr";
/** InfluxDB authorization token */
const token = process.env["INFLUX_TOKEN"] || "j9PUMgfFZPkUhSwqjWvh2TAqrBJZ9bZ2-CQJ5l_YzoTbfbCKzFReDYvZhhSv8qgbarX5EqlXvFJ1OVSqSYrzdQ==";
/** Organization within InfluxDB  */
const org = process.env["INFLUX_ORG"] || "FFB2023";
/**InfluxDB bucket used in examples  */
const bucket = "ffb-2023";

export { url, token, org, bucket };
