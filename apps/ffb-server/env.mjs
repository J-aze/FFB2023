/** InfluxDB v2 URL */
const url = process.env["INFLUX_URL"] || "https://influxffb.iutbeziers.fr";
/** InfluxDB authorization token */
const token = process.env["INFLUX_TOKEN"] || "sUiDEZcwHpYTFRxRC7QmvabBTgeDVYNp87tyuj5Q28EuMBUWhWGb0tjOTeoDq3tWx4hHi8TVC7hOx4PA_Vx_6A==";
/** Organization within InfluxDB  */
const org = process.env["INFLUX_ORG"] || "FFB2023";
/**InfluxDB bucket used in examples  */
const bucket = "FFB2023";

export { url, token, org, bucket };
