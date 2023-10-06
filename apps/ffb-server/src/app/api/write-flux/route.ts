import { NextResponse } from "next/server";
import { InfluxDB, Point } from "@influxdata/influxdb-client";
import { url, token, org, bucket } from "../../../../env.mjs";

export async function POST(request: Request) {
    try {
        // If the request is a formData (e.g A simulated POST Request from Postman)
        const res = await request.formData();
        const curr_res = res.entries().next();
        console.log("Incoming request:", res);
        return NextResponse.json({
            status: 200,
            message: "Hello World with a POST!",
            postbody: curr_res,
        });
    } catch (error) {
        // If the request is a JSON object
        const res = await request.json();

        const writeApi = new InfluxDB({ url, token, transportOptions: {
            rejectUnauthorized: false
        }}).getWriteApi(org, bucket);
        const rfidUID = new Point(res["rfidCard"])
            .stringField("ffb-watcher", res["topic"])
            .tag("name", res["name"])
            .tag("surname", res["surname"])
            .tag("phoneNumber", res["phoneNumber"])
            .tag("email", res["email"])

        writeApi.writePoint(rfidUID)
        writeApi.close().then(() => {
            console.log(res["rfidCard"] ? `Wrote data in InfluxDB for ${res["rfidCard"]}`: `Didn't wrote data in InfluxDB for ${res["rfidCard"]}`)
        }).catch((err) => {
            console.log("Error:", err);
        })

        return NextResponse.json({
            status: 200
        });
    }
}

export async function GET() {
    return NextResponse.json({ message: "Hello World with a GET!" });
}
