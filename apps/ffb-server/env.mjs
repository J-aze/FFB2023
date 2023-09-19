/** InfluxDB v2 URL */
const url = process.env["INFLUX_URL"] || "http://51.158.107.83:8086";
/** InfluxDB authorization token */
const token =
  process.env["INFLUX_TOKEN"] || "n_0JZECIMfgJbEUUsipzlEXneh7cZP1hem_84-y2QCgNzPEKKKD4AsdZGW1QG7nZUDhy2X08rGR5tavaPdTTsg==";
/** Organization within InfluxDB  */
const org = process.env["INFLUX_ORG"] || "IUTdebeziers";
/**InfluxDB bucket used in examples  */
const bucket = "forum-etudiants-21-09-2023";
// ONLY onboarding example
/**InfluxDB user  */
const username = "FFBInflux";
/**InfluxDB password  */
const password = "F!2420@RTLove";

export { url, token, org, bucket, username, password };
