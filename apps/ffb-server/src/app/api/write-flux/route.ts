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
            message: "Hello World with a POST!",
            postbody: curr_res,
        });
    } catch (error) {
        // If the request is a JSON object
        const res = await request.json();


        const writeApi = new InfluxDB({ url, token }).getWriteApi(org, bucket);
        const rfidUID = new Point(res["rfidCard"])
            .stringField("formation", res["formation"])
            .tag("name", res["name"])
            .tag("surname", res["surname"])

        writeApi.writePoint(rfidUID)
        writeApi.close().then(() => {
            console.log("Wrote data in InfluxDB for", res["rfidCard"])
            return NextResponse.json({
                message: "Hello World with a POST!",
            });
        }).catch((err) => {
            return NextResponse.json({
                error: err
            })
        } )
    }
}

export async function GET() {
    return NextResponse.json({ message: "Hello World with a GET!" });
}
