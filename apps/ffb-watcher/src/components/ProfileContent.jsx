import { InfluxQuery, GetSelectRFIDCards, UpdateInflux } from "./influxdb";
import { useState } from "react";
import {useForm} from "react-hook-form";

export default function ProfileContent(){
  return(
    <>
      <div id="profile-content-card" className="card p-2 mx-3 my-3" style={{minWidth: "100vh"}}>
        <div className="card-header">
          <h2>Profile Charts</h2>
        </div>
        <div className="card-body">
          <InfluxQuery />
        </div>
      </div>
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

function ProfileForm(){
  const {register, handleSubmit} = useForm();
  const [formData, setFormData] = useState();

  function onSubmit(formData){
    setFormData(JSON.stringify(formData));
    UpdateInflux(formData);
  }

  return(
    <div id="profile-content-form-holder" className="flex flex-column justify-content-start align-items-center align-self-center">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="my-2 mx-2 flex flex-column align-self-center justify-content-start flex-grow-1 flex-fill">
          <span className="fs-4">RFID-UID: </span>
          <select {...register("rfid-card", {required: true})} className="btn dropdown-toggle">
            <option value={null}>Select...</option>
            <GetSelectRFIDCards />
          </select>
        </div>

        <div className="mx-2 my-2">
          <span className="fs-4">L'Âge: </span>
          <select {...register("age", {required: true})} className="btn dropdown-toggle">
            <option value={null}>Select...</option>
            <option value={"50+"}>50+</option>
            <option value={"35-50"}>35-50</option>
            <option value={"25-35"}>25-35</option>
            <option value={"18-25"}>18-25</option>
            <option value={"12-17"}>12-17</option>
            <option value={"12-"}>12-</option>
          </select>
        </div>

        <div className="mx-2 my-2">
          <span className="fs-4">La Provenance: </span>
          <select {...register("where-from", {required: true})} className="btn dropdown-toggle">
            <option value={null}>Select...</option>
            <option value={"0-20"}>De Béziers et ses alentours (20+ km)</option>
            <option value={"20-50"}>De 20 à 50 km</option>
            <option value={"50+"}>50+ km</option>
          </select>
        </div>

        <div className="mx-2 my-2">
          <span className="fs-4">Est-il un étudiant: </span>
          <span className="input-group-text">
            <input type="radio" className="form-check-input" name="isStudent"value={true}/><span className="ms-1 me-2">Oui</span>
          </span>
          <span className="input-group-text">
            <input type="radio" className="form-check-input" name="isStudent" value={false}/><span className="ms-1 me-2">Non</span>
          </span>
        </div>

        <div className="mx-2 my-2">
          <input type="submit" />
        </div>
      </form>
    </div>
  )
}
