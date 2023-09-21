"use client"

import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup'; import { useSearchParams } from 'next/navigation';
import { InfluxDB, Point } from '@influxdata/influxdb-client';
import { url, token, org, bucket } from '../../../env.mjs';

export default function MetricsContent() {

  // URL Query
  const searchParams = useSearchParams();
  const status = searchParams.get("status");


  return (
    <div style={{
      display: "flex",
      flexDirection: "column"
    }}>
      <div className="mx-2 my-2 card">
        <div className="card-header">
          <h2>Tickets Retrieved</h2>
        </div>
        <div className="card-body">
          <ProfileForm />
        </div>
      </div>
    </div>
  )
}

const queryApi = new InfluxDB({ url, token }).getQueryApi(org);
const fluxAsyncQuery = async (rfidUID: any, ticketSetter: any) => {

  const fluxQuery = `from(bucket: "${bucket}")
      |> range(start: -30d, stop: now())
      |> filter(fn: (r) => r["_measurement"] == "${rfidUID}")
      |> filter(fn: (r) => r["_field"] == "stands")
      |> yield(name: "mean")`;

  console.log("We're creating a request to InfluxDB");

  for await (const { values, tableMeta } of queryApi.iterateRows(fluxQuery)) {
    const o = tableMeta.toObject(values);

    if (o._value != null) {
      ticketSetter(o._value);
    }

  }
}

function ProfileForm() {

  // functions to build form returned by useForm() hook
  const { register, handleSubmit} = useForm();
  const [formData, setFormData] = useState();

  // User-specific data
  const [userTickets, setUserTickets] = useState(null);

  // URL Query
  const searchParams = useSearchParams();
  const rfidUID = searchParams.get("cardID");

  function onSubmit(formDataToBe: any) {

    console.log(formDataToBe)

    return fetch(
      "http://localhost:3000/api/add-tickets-flux",
      {
        method: "POST",
        body: JSON.stringify(formDataToBe),
        headers: {
          "Content-Type": "application/json"
        }
      }
    ).then(response => {
      if (response.status >= 200 && response.status < 300) {
        console.log(response);
        // window.location.reload();
        return response;
      } else {
        console.log("Uh Oh! Something happened!, status:", response.status);
      }
    }).catch(err => {
      console.log("An error occured while sending the data:", err);
    })
  }


  if (rfidUID != null) {
    if (userTickets == null) {
      fluxAsyncQuery(rfidUID, setUserTickets);
    }
  }

  const [ticketsNumber, setTicketsNumber] = useState(Array<number>);
  const [numberOfTickets, setNumberOfTickets] = useState(0);


  return (
    <div id="profile-content-form-holder" className="flex flex-column justify-content-start align-items-center align-self-center">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="card-body border-bottom">
          <div className="form-row">
            <div className="form-group">
              <div className="my-2 mx-2 flex flex-column align-self-center justify-content-start flex-grow-1 flex-fill">
                <span className="fs-4">RFID-UID: </span>
                <select {...register("rfidCard", { required: true })} className="btn dropdown-toggle">
                  <option value={`${rfidUID}`}>{rfidUID}</option>
                </select>
              </div>
              <label className="mr-2 p-2">Number of Tickets: </label>
              <select name="numberOfTickets">
                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(i =>
                  <option key={i} value={`${i}`} onClick={() => {
                    setNumberOfTickets(i);
                  }}>{i}</option>
                )}
              </select>
              <button type="button" className="btn btn-success m-lg-2 mr-1 p-2" onClick={() => {

                const tempTickets = [];

                for (let i = 0; i < numberOfTickets; i++) {
                  tempTickets.push(i)
                }

                setTicketsNumber(tempTickets);
              }}>Set Tickets</button>
            </div>
          </div>
        </div>
        {ticketsNumber.map(i => (
          <div key={i} className="list-group list-group-flush">
            <div className="list-group-item">
              <h5 className="card-title">Ticket {i + 1}</h5>
              <div className="form-row">
                <div className="form-group col-6">
                  <label>Stand</label>
                  <select {...register(`tickets-${i}`, { required: true })} className="btn dropdown-toggle border-black m-lg-1">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20].map(j => (
                      <option key={j} className="btn dropdown-toggle border-black" value={j} onSelect={() => {
                        console.log("Selected", j);
                      }}>T: {j}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        ))}
        <div className="card-footer text-center border-top-0">
          <button type="submit" className="btn btn-success mr-1">
            Submit tickets
          </button>
        </div>
      </form>
    </div>
  )
}
