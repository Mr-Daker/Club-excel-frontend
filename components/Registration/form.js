import React, { useState } from "react"
import styled from "styled-components"
import Image from "next/legacy/image"
import Input from "./input"
import axios from "axios"
import "react-responsive-modal/styles.css"
import { Modal } from "react-responsive-modal"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import Loader from "../Common/loder"

const MainCont = styled.div`
/* position: absolute; */
  @media (max-width: 800px) {
    margin-top: -50px;
    transform: scale(0.8);
  }
  .regd-txt {
    margin-top: 50px;
    color: rgba(255, 255, 255, 0.9);
    font-family: Poppins;
    font-size: 32px;
    font-style: normal;
    font-weight: 700;
    line-height: 36px;
  }

  .nxt-btn {
    width: 180px;
    display: flex;
    height: 48px;
    padding: 0px 24px 0px 32px;
    justify-content: center;
    align-items: center;
    gap: 8px;
    border-radius: 4px;
    border: 1px solid #bbbfc1;
    background: #fff;
    color: #242731;
    text-align: center;
    font-family: Poppins;
    font-size: 16px;
    font-style: normal;
    font-weight: 500;
    line-height: 24px; /* 150% */
    text-transform: capitalize;
  }

  .hover:hover {
    transform: scale(1.06);
    transition: 500ms;
  }
  .pointer {
    cursor: pointer;
  }
  .line {
    width: 80px;
    height: 1px;
  }
  .status {
    margin-top: 40px;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .active {
    background: #007aff;
  }
  .inactive {
    background: #b9b9c3;
  }

  .regd-msg {
    margin-top: 16px;
    margin-bottom: 32px;
    color: #575f6e;
    font-family: "jura";
    font-size: 16px;
    font-style: normal;
    font-weight: 300;
    line-height: 22px;
  }

  .main-form {
    padding-left: 50px;
    padding-right: 50px;
    margin-bottom: 32px;
    border: 1px solid rgba(87, 95, 110, 0.7);
    padding-top: 12px;
    padding-bottom: 62px;
    display: flex;
    align-items: center;
    flex-direction: column;
    transition: width 2s;
    box-shadow: 2px 2px 6px #888888;
  }

  .labelc {
    color: gray;
    font-family: Poppins;
    font-size: 16px;
    font-style: normal;
    font-weight: 500;
    line-height: 20px;
  }
  .save-btn {
    width: 180px;
    display: flex;
    height: 48px;
    padding: 0px 32px 0px 24px;
    justify-content: center;
    align-items: center;
    gap: 8px;
    color: #fff;
    text-align: center;
    font-family: "Poppins";
    font-size: 16px;
    font-style: normal;
    font-weight: 500;
    line-height: 24px;
    border-radius: 4px;
    background: #007aff;
    text-transform: capitalize;
  }
  .checkbox-div {
    margin-top: 32px;
    display: flex;
    align-items: center;
  }
  .checkbox {
    margin-left: 100px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 23px;

    height: 23px;
    border: 2px solid #575f6e;
    flex-shrink: 0;
    border-radius: 4px;
  }
  .checked {
    height: 24px;
    width: 24px;
    margin-left: -2px;
    background: url("/check.svg");
    background-size: 24px 24px;
  }
  .dummy {
    width: 392px;
    @media (max-width: 800px) {
      width: 350px;
    }
  }
  .Main-modal {
    color: black;
    background-color: #242426;
  }
  .back-button {
    transform: rotate(180deg);
  }
  .mb-10 {
    margin-bottom: 10px;
  }
  .close {
    color: red;
    font-size: large;
    font-weight: 900;
    margin-top: 50px;
  }
`

function Form() {
  const [state, setState] = useState(0)
  const [check, setCheck] = useState(false)
  const [isLoaded, setIsLoaded] = useState(true)
  const notify = (e) => toast.error(e)
  const notifysuccess = () => toast.success("yeeh! Registration Successs.")

  const emptyObj = {
    name: "",
    email: "",
    contact: "",
    roll: "",
    // why: "",
    batch: "",
    // hackerrankid: "",
    area: "",
    gender: "",
    skill: "",
    branch: "",
  }
  const [details, setDetails] = useState(emptyObj)

  function change(e) {
    const { name, value } = e.target
    setDetails({ ...details, [name]: value })
  }
  async function save() {
    try {
      setIsLoaded(false)
      if (validateForm()) {
        // const url = "https://club-excell-backend.onrender.com"
        const url = "https://club-excel-backend.vercel.app"
        // const url = "http://localhost:8000"
        const resp = await axios.post(`${url}/api/register`, details)
        console.log(resp.data)
        if (resp.status === 201) {
          onOpenModal()
          notifysuccess()
          setDetails(emptyObj)
          setState(0)
        } else if (
          resp.status === 400 &&
          resp.data.error === "Email is already registered"
        ) {
          console.error("Email is already registered:", resp.data.error)
          notify("Email is already registered")
        } else {
          const errorMessage = resp.data.error || "Registration failed"
          console.error("Registration failed:", errorMessage)
          notify(errorMessage)
        }
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.error ||
        "Registration failed. Please try again later."
      notify(errorMessage)
    } finally {
      setIsLoaded(true)
    }
  }
  const [open, setOpen] = useState(false)
  const onOpenModal = () => setOpen(true)
  const onCloseModal = () => setOpen(false)

  // Function to go to the next step if validation passes
  function goToNextStep() {
    // Check if all required fields are filled before proceeding
    if (validateForm()) {
      setState(state + 1)
    } else {
      notify()
    }
  }

  const emailValidator = (value) => {
    const regex = /^[a-zA-Z0-9._-]+@nist\.edu$/
    return regex.test(value)
  }

  // Function to validate the form based on the current state
  function validateForm() {
    // console.log(validate(""))
    if (state === 0) {
      let verify = emailValidator(details.email)
      if (details.email !== "" && !verify)
        toast.error("Please provide a valid nist.edu email address.")

      return (
        details.name !== "" &&
        details.email !== "" &&
        details.contact !== "" &&
        details.roll !== "" &&
        verify
      )
    } else if (state === 1) {
      return (
        details.gender !== "" &&
        details.batch !== "" &&
        details.branch !== "" &&
        details.skill !== ""
      )
    } else {
      return (
        // details.hackerrankid !== "" &&
        // details.why !== "" &&
        !check || details.area !== ""
      )
    }
  }

  // Function to go to the previous step
  function goBack() {
    if (state > 0) {
      setState(state - 1)
    }
  }
  const isRegistrationOpen = false

  return (
    <MainCont>
      {/* <Border/> */}

      <div className="form">
        <div className="status">
          <Image
            src={"/filled.svg"}
            height={17}
            width={17}
            alt=""
            className=""
          />
          <div className={state >= 1 ? "line active" : "line inactive"}></div>
          <Image
            src={state >= 1 ? "/filled.svg" : "/holo.svg"}
            height={17}
            width={17}
            alt=""
            className=""
          />
          <div className={state >= 2 ? "line active" : "line inactive"}></div>
          <Image
            src={state >= 2 ? "/filled.svg" : "/holo.svg"}
            height={17}
            width={17}
            alt=""
            className=""
          />
        </div>
        <div className="regd-txt">Registration</div>
        <div className="regd-msg">
          Fill in the registration data. It will take a couple of minutes.
        </div>

        <div className="main-form">
          {state == 0 ? (
            <div className="state1">
              <Input
                label={"Full Name"}
                change={change}
                name={"name"}
                details={details}
                required
              />
              <Input
                label={"Email (nist.edu)"}
                change={change}
                name={"email"}
                details={details}
                required
              />
              <Input
                label={"Contact No."}
                change={change}
                name={"contact"}
                details={details}
                required
              />
              <Input
                label={"Roll No."}
                change={change}
                name={"roll"}
                details={details}
                required
              />
            </div>
          ) : state == 1 ? (
            <div className="state2">
              <Input
                label={"Gender"}
                change={change}
                name={"gender"}
                details={details}
                required
              />
              <Input
                label={"Batch"}
                change={change}
                name={"batch"}
                details={details}
                required
              />
              <Input
                label={"branch"}
                change={change}
                name={"branch"}
                details={details}
                required
              />
              <Input
                label={"Skills (html,css,js ...etc)"}
                change={change}
                name={"skill"}
                details={details}
                required
              />
            </div>
          ) : (
            <div className="state3">
              {/* <Input
                label={"hacker rank id "}
                change={change}
                name={"hackerrankid"}
                details={details}
                required
              />
              <Input
                label={"Why do you want to join Club Excel ?"}
                change={change}
                name={"why"}
                details={details}
                required
              /> */}

              <div className="checkbox-div">
                <div className="labelc">Are you localite?</div>
                <div
                  className="checkbox"
                  onClick={() => setCheck(!check)}
                >
                  {check ? <div className="checked"></div> : ""}
                </div>
              </div>
              {check ? (
                <Input
                  label={"Enter the area you belong to"}
                  change={change}
                  name={"area"}
                  details={details}
                />
              ) : (
                <div className="dummy"></div>
              )}
            </div>
          )}
        </div>
        {/* Add Back button */}
        {state > 0 && (
          <div
            className="nxt-btn hover pointer mb-10"
            onClick={goBack}
          >
            Back
            <Image
              src={"/Icon.svg"}
              height={24}
              width={24}
              alt=""
              className="back-button"
            />
          </div>
        )}
        {state < 2 ? (
          <div
            className="nxt-btn hover pointer"
            // onClick={() => setState(state + 1)}
            onClick={() => {
              goToNextStep()
            }}
          >
            Go next{" "}
            <Image
              src={"/Icon.svg"}
              height={24}
              width={24}
              alt=""
              className=""
            />
          </div>
        ) : (
          <div
            className="save-btn hover pointer"
            onClick={() => {
              save()
            }}
          >
            {" "}
            <Image
              src={"/tick.svg"}
              height={24}
              width={24}
              alt=""
              className=""
            />{" "}
            Save
          </div>
        )}
      </div>
      <Modal
        open={open}
        onClose={onCloseModal}
        center
      >
        <div
          className="Main-modal"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            maxWidth: 370,
            marginTop: 30,
            marginBottom: 30,
          }}
        >
          <div
            className="Thank-msg"
            style={{
              color: "skyblue",
              marginTop: 5,
              fontFamily: "Montserrat",
              textAlign: "center",
            }}
          >
            Thank you for completing your registration for Club Excel!
          </div>
          <div
            className="req-msg"
            style={{
              color: "purple",
              marginTop: 15,
              lineHeight: 1.5,
              fontFamily: "Montserrat",
              textAlign: "center",
            }}
          >
            We invite you to join our WhatsApp group to receive additional
            information and stay updated on upcoming events and activities.
          </div>
          <div
            className="Link-msg"
            onClick={() =>
              window.open("https://chat.whatsapp.com/CaQATAdvxY92GHdOUzyCAo?mode=wwt")
            }
            style={{
              color: "violet",
              marginTop: 25,
              fontFamily: "Montserrat",
              textAlign: "center",
              cursor: "pointer",
            }}
          >
            https://chat.whatsapp.com/
            <br />
            IX3RNMhyFphJIPk6F7ea9P
          </div>
        </div>
      </Modal>
      <ToastContainer
        className="toast-position"
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      {!isLoaded ? <Loader /> : ""}
    </MainCont>
  )
}

export default Form
