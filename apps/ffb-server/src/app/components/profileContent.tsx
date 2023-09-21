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
const fluxAsyncQuery = async (rfidUID: any, ageSetter: any, originSetter: any, isStudentSetter: any, formationSetter: any, nameSetter: any, surnameSetter: any) => {

  const fluxQuery = `from(bucket: "${bucket}")
      |> range(start: -30d, stop: now())
      |> filter(fn: (r) => r["_measurement"] == "${rfidUID}")
      |> yield(name: "mean")`;

  console.log("We're creating a request to InfluxDB");

  for await (const {values, tableMeta} of queryApi.iterateRows(fluxQuery)) {
      const o = tableMeta.toObject(values);
      console.log("Received data:", o);

      if (o._field === "group") {

        if (o.age != undefined) {
          ageSetter(o.age);
        }

        if (o.origin != undefined) {
          originSetter(o.origin);
        }

        if (o.student != undefined) {
          o.student = "True" ? true : false
          isStudentSetter(o.student)
        }

        if (o.name != undefined) {
          nameSetter(o.name)
        }
        if (o.surname != undefined) {
          surnameSetter(o.surname)
        }
      }

      if (o._field === "formation") {
        if (o._value != undefined) {
          formationSetter(o._value)
        }
        if (o.name != undefined) {
          nameSetter(o.name)
        }
        if (o.surname != undefined) {
          surnameSetter(o.surname)
        }
      }
  }
}

function ProfileForm(){
  const {register, handleSubmit} = useForm();
  const [formData, setFormData] = useState();

  // User-specific data
  const [userAge, setUserAge] = useState(null);
  const [userOrigin, setUserOrigin] = useState(null);
  const [isStudent, setIsStudent] = useState(null);
  const [userName, setUserName] = useState(null);
  const [userSurname, setUserSurname] = useState(null);
  const [userFormation, setUserFormation] = useState(null);

  // Modifying data
  const [changeUsername, setChangeUsername] = useState(false);
  const [changeUserSurname, setChangeUserSurname] = useState(false);

  // URL Query
  const searchParams = useSearchParams();
  const rfidUID = searchParams.get("cardID");

  function onSubmit(formDataToBe: any){

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


  if (rfidUID != null) {
    if (userAge === null || userName === null) {
      fluxAsyncQuery(rfidUID, setUserAge, setUserOrigin, setIsStudent, setUserFormation, setUserName, setUserSurname);
    }
  }


  return(
    <>
      <div id="profile-content-form-holder" className="flex flex-column justify-content-start align-items-center align-self-center">

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="my-2 mx-2 flex flex-column align-self-center justify-content-start flex-grow-1 flex-fill">
            <span className="fs-4">RFID-UID: </span>
            <select {...register("rfidCard", {required: true})} className="btn dropdown-toggle">
              <option value={`${rfidUID}`}>{rfidUID}</option>
            </select>
          </div>

          <div className="mx-2 my-2">
            <span>
              <span className="fs-4">Nom</span>
              {
                !changeUserSurname && (
                  <>
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
                    )}
                  </>
                )
              }
              {changeUserSurname && (
                <input {...register("name", { required: true })} className="btn dropdown-toggle" style={{ border: "0.5px solid black" }} />
              )}
            </span>
            <span>
              <span className="fs-4">Prénom</span>
              {userName ? (
                <select {...register("name", { required: true })} className="btn dropdown-toggle" value={userName}>
                  <option value={userName}>
                    <span>
                      {userName} (db)
                    </span>
                  </option>
                </select>
              ) : (
                <input {...register("name", { required: true })} className="btn dropdown-toggle" style={{ border: "0.5px solid black" }} />
              )}
              {changeUsername && (
                <input {...register("name", { required: true })} className="btn dropdown-toggle" style={{ border: "0.5px solid black" }} />
              )}
            </span>
            {/* <button onClick={() => {
              if (changeUsername) {
                setChangeUsername(false)
              } else {
                setChangeUsername(true)
              }
            }}>Change User name</button>
            <button onClick={() => {
              if (changeUserSurname) {
                setChangeUserSurname(false)
              } else {
                setChangeUserSurname(true)
              }
            }}>Change User surname</button> */}
          </div>

          <div className="mx-2 my-2">
            <span className="fs-4">La formation: </span>
            {userFormation ? (
              <select {...register("formation", {required: true})} className="btn dropdown-toggle">
                <option value={userFormation} selected>
                  <span>
                    {userFormation} (db)
                  </span>
                </option>
                <option value={"TC"}>TC</option>
                <option value={"RT"}>RT</option>
                <option value={"MMI"}>MMI</option>
                <option value={"ROB IA"}>ROB & IA</option>
                <option value={"CS"}>CS</option>
              </select>
            ): (
              <select {...register("formation", { required: true })} className="btn dropdown-toggle">
                <option value={"RT"}>RT</option>
                <option value={"MMI"}>MMI</option>
                <option value={"ROB IA"}>ROB & IA</option>
                <option value={"CS"}>CS</option>
                <option value={"TC"}>TC</option>
              </select>
            )}
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

        We&apos;re currently running the {userAge ? 'Festival of Fantastic of Béziers' : '1st Test during the \'Forum Etudiant\''}. <br />
        We have the card of {userSurname} {userName}, a {userFormation} student.
      </div>
    </>
  )
}
