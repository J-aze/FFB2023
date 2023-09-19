"use client"

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useSearchParams } from 'next/navigation';
import { InfluxDB, Point } from '@influxdata/influxdb-client';
import { url, token, org, bucket } from '../../../env.mjs';
import { Button } from "bootstrap";

export default function ProfileContent(){
  return(
    <>
      {/* <div id="profile-content-card" className="card p-2 mx-3 my-3" style={{minWidth: "100vh"}}>
        <div className="card-header">
          <h2>Profile Charts</h2>
        </div>
        <div className="card-body">
        </div>
      </div> */}
      <div className="mx-2 my-2 card">
        <div className="card-header">
          <h2>Profile Form</h2>
        </div>
        <div className="card-body">
          <ProfileForm />
        </div>
      </div>
    </>
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
        return response;
      } else {
        console.log("Uh Oh! Something happened!, status:", response.status);
      }
    }).catch(err => {
      console.log("An error occured while sending the data:", err);
    })
  }


  if (userAge === null || userName === null){
    fluxAsyncQuery(rfidUID, setUserAge, setUserOrigin, setIsStudent, setUserFormation, setUserName, setUserSurname);
  }


  return(
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
          <button onClick={() => {
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
          }}>Change User surname</button>
        </div>

        {/* <div className="mx-2 my-2">
          <span className="fs-4">L&apos;Âge: </span>
          {userAge ? (
          <select {...register("age", {required: true})} className="btn dropdown-toggle">
            <option value={userAge}>{userAge}</option>
          </select>
          ): (
          <select {...register("age", {required: true})} className="btn dropdown-toggle">
            <option value={"50+"}>50+</option>
            <option value={"35-50"}>35-50</option>
            <option value={"25-35"}>25-35</option>
            <option value={"18-25"}>18-25</option>
            <option value={"12-17"}>12-17</option>
            <option value={"12-"}>12-</option>
          </select>
          )}
        </div> */}

        {/* <div className="mx-2 my-2">
          <span className="fs-4">La Provenance: </span>

            {userOrigin ? (
              <select {...register("whereFrom", {required: true})} className="btn dropdown-toggle">
                <option value={userOrigin}>{userOrigin}</option>

              </select>
            ): (
              <select {...register("whereFrom", {required: true})} className="btn dropdown-toggle">
                <option value={"0-20"}>De Béziers et ses alentours (-20 km)</option>
                <option value={"20-50"}>De 20 à 50 km</option>
                <option value={"50+"}>50+ km</option>
              </select>
            )}
        </div> */}
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

        {/* {isStudent ? (
          <div className="mx-2 my-2">
            <span className="fs-4">{isStudent == true ? "Il est étudiant": "Il n'est pas étudiant"}</span>
          </div>
        ): (
        <div className="mx-2 my-2">
          <span className="fs-4">Est-il un étudiant: </span>

          <select {...register("isStudent", { required: true })} className="btn dropdown-toggle">
            <option value={`${true}`}>Oui</option>
            <option value={`${false}`}>Non</option>
          </select>
        </div>

        )} */}

        <div className="mx-2 my-2">
          <input type="submit" />
        </div>
      </form>
    </div>
  )
}