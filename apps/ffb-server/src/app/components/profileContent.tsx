"use client"

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useSearchParams } from 'next/navigation';
import { InfluxDB } from '@influxdata/influxdb-client';
import { url, token, org, bucket } from '../../../env.mjs';

import MetricsContent from "./metricsContent";

export default function ProfileContent(){

  // URL Query
  const searchParams = useSearchParams();
  const status = searchParams.get("status");


  return(
    <div style={{display: "flex", flexDirection: "row"}}>
      <div style={{display: "flex", flexDirection: "column"}}>
        {status ? (
          <div id="currentStatus" className={`card p-4 mx-2 my-2 ${status == 'Connected' ? 'bg-success' : 'bg-danger'} bg-gradient`}>
            <div>You&apos;re {status}</div>
          </div>
        ): (
          <></>
        )}

        <div className="mx-2 my-2 card">
          <div className="card-header">
            <h2>Profile</h2>
          </div>
          <div className="card-body">
            <ProfileForm />
          </div>
        </div>
      </div>

      <MetricsContent />

    </div>
  )
}

const queryApi = new InfluxDB({url, token}).getQueryApi(org);
const fluxAsyncQuery = async (rfidUID: any, phoneSetter: any, emailSetter: any, nameSetter: any, surnameSetter: any) => {

  const fluxQuery = `from(bucket: "${bucket}")
      |> range(start: -1d, stop: now())
      |> filter(fn: (r) => r["_measurement"] == "${rfidUID}")
      |> yield(name: "mean")`;

  console.log("We're creating a request to InfluxDB");

  for await (const {values, tableMeta} of queryApi.iterateRows(fluxQuery)) {
    const o = tableMeta.toObject(values);
    console.log("Received data:", o);

    if (o._field === ""){}

  }
}

function ProfileForm(){
  const {register, handleSubmit} = useForm();
  const [formData, setFormData] = useState();

  // User-specific data
  const [userName, setUserName] = useState(null);
  const [userSurname, setUserSurname] = useState(null);
  const [userPhoneNumber, setUserPhoneNumber] = useState(null);
  const [userEmail, setUserEmail] = useState(null);

  // URL Query
  const searchParams = useSearchParams();
  const rfidUID = searchParams.get("cardID");

  function onSubmit(formDataToBe: any){

    console.log("Sent data:", JSON.stringify(formDataToBe))

    return fetch(
      "http://localhost:3000/api/write-flux",
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
        window.location.reload();
        return response;
      } else {
        console.log("Uh Oh! Something happened!, status:", response.status);
      }
    }).catch(err => {
      console.log("An error occured while sending the data:", err);
    })
  }

  return(
    <>
      <div className="my-2 mx-2 flex flex-column align-self-center justify-content-start flex-grow-1 flex-fill">
        <span className="fs-4">Card ID: </span>
        {rfidUID ? (
          <select {...register("rfidCard", { required: true })} className="btn dropdown-toggle">
            <option value={`${rfidUID}`}>{rfidUID}</option>
          </select>
        ) : (
          <span className="fs-4 fw-bold text-danger">N/A</span>
        )}
      </div>
      <div id="profile-content-form-holder" className="flex flex-column justify-content-start align-items-center align-self-center">

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mx-2 my-2">
            <span>
              <span className="fs-4 m-lg-1">Nom</span>
              {userSurname ? (
                <select {...register("surname", { required: true })} className="btn dropdown-toggle" value={`${userSurname}`} autoFocus>
                  <option value={`${userSurname}`}>
                    <span>
                      {userSurname} (db)
                    </span>
                  </option>
                  <option value={`${null}`}>
                    Other
                  </option>
                </select>
              ) : (
                <input {...register("surname", { required: true })} className="btn dropdown-toggle" style={{ border: "0.5px solid black" }} />
              )}            </span>
            <span>
              <span className="fs-4 m-lg-1">Prénom</span>
              {userName ? (
                <select {...register("name", { required: true })} className="btn dropdown-toggle" defaultValue={userName}>
                  <option value={userName}>
                    <span>
                      {userName} (db)
                    </span>
                  </option>
                </select>
              ) : (
                <input {...register("name", { required: true })} className="btn dropdown-toggle" style={{ border: "0.5px solid black" }} />
              )}
            </span>
          </div>
          <div className="mx-2 my-2">
            <span className="fs-4 m-lg-1">Numéro de Téléphone</span>
            {userPhoneNumber ? (
              <select {...register("phoneNumber", {required: true})} className="btn dropdown-toggle" defaultValue={userPhoneNumber}>
                <option value={userPhoneNumber}>
                  <span>
                    {userPhoneNumber} (db)
                  </span>
                </option>
              </select>
            ): (
              <input {...register("phoneNumber", {required: true})} className="btn dropdown-toggle" style={{border: "0.5px solid black"}} />
            )}
          </div>
          <div className="mx-2 my-2">
            <span className="fs-4 m-lg-1">Email</span>
            {userEmail ? (
              <select {...register("email", { required: true })} className="btn dropdown-toggle" defaultValue={userEmail}>
                <option value={userEmail}>
                  <span>
                    {userEmail} (db)
                  </span>
                </option>
              </select>
            ): (
              <input {...register("email", {required: true})} className="btn dropdown-toggle" style={{border: "0.5px solid black"}} />
            )}
          </div>

          {/* This should be hidden to the user, we're using this input to set the correct bucket */}
          <div className="mx-2 my-2 d-none">
            <span className="fs-4 m-lg-1 text-danger">This should not appear</span>
            <select {...register("topic", {required: true})} defaultValue={"tombola"}>
              <option value="tombola">tombola</option>
            </select>
          </div>

          <div className="mx-2 my-2 p-2">
            <button type="submit" className="btn btn-success mr-1">
              Submit Profile
            </button>
          </div>
        </form>
      </div>

      <div className="my-2 mx-2 flex flex-column justify-content-start align-items-center align-self-center card card-body bg-info-subtle border-info-subtle">
        <h5 className="text-start">Recap:</h5> <br />

        We&apos;re currently running {userPhoneNumber ? 'the Festival of Fantastic of Béziers' : 'nothing'}. <br />
        We have the card of {userSurname} {userName}.
      </div>
    </>
  )
}
