import React, { useState } from "react";
import "react-responsive-modal/styles.css";
import { Modal } from "react-responsive-modal";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";
import Loader from "@/components/Common/loder";

const Register = () => {
  const [data, setData] = useState({
    name: "",
    phone: "",
    rollNo: "",
    hostelLocal: "",
    email: "",
  });
  const [isLoaded, setIsLoaded] = useState(true);

  const notify = (e) => toast.error(e);
  const notifysuccess = () => toast.success("yeeh! Registration Successs.");
  const [phoneError, setPhoneError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [open, setOpen] = useState(false);
  const onOpenModal = () => setOpen(true);
  const onCloseModal = () => setOpen(false);

  const validatePhone = (phone) => {
    const phonePattern = /^[6-9]\d{9}$/;
    if (!phonePattern.test(phone)) {
      setPhoneError("Enter a valid 10-digit phone number starting with 6-9");
    } else {
      setPhoneError("");
    }
  };

  const validateEmail = (email) => {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(email)) {
      setEmailError("Enter a valid email address");
    } else {
      setEmailError("");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (phoneError || emailError) {
      alert("Please correct the errors before submitting.");
    } else {
      submitFormData(data);
    }
  };

  const submitFormData = async (data) => {
    setIsLoaded(false);
    try {
      const response = await fetch('/api/cipherreg', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      console.log(await response.json())
      onOpenModal();
      notifysuccess();

      setData({
        name: "",
        phone: "",
        rollNo: "",
        hostelLocal: "",
        email: "",
      });
    } catch (error) {
      notify(error?.response?.data?.message || "some error occured");
      console.log(error)
    } finally {
      setIsLoaded(true);
    }
  };

  return (
    <>
      <div className="min-h-screen w-screen overflow-hidden flex flex-col items-center bg-black  text-white px-6 py-10">
        <div className="w-full flex justify-center">
          <img
            src="/ciperchase.png"
            alt="Code Crusade 3.0"
            className="max-w-full md:w-2/3 lg:w-1/2 h-auto mx-auto"
          />
        </div>

        <div className="container mx-auto flex flex-col md:flex-row gap-8 mt-10 w-full">
          <div className="border border-dashed border-blue-500 shadow-blue-300 text-white p-6 rounded-lg shadow-lg w-full md:w-1/3">
            <h2 className="text-xl font-bold text-orange-400">
              CipherChase : The Ultimate Hunt!
            </h2>
            <p className="mt-2 text-gray-300">
              Game, Think & Race! Dive into a thrilling non-technical fest where your gaming reflexes, wit, and puzzle-solving instincts will help you top the leaderboard.

              <br />

              <strong>🔹 Date:</strong> Nov 7th
              <br />
              <strong>🔹 Time:</strong> 10:00 AM - 4:00 PM (as per rounds)
              <br />
              <strong>🔹 Venue:</strong> ATR 205
              <br />
              <strong>🔹 Rounds:</strong>
              <br />
              <strong>Round 1:</strong> Single-Player Games – Survive and advance!

              <br />
              <strong>Round 2:</strong> Buzzer Battle – Be among the fastest to make the finals!

              <br />
              <strong>Round 3:</strong> The Ultimate Hunt ✨

            </p>
            <Link href="/code-crusade-register" className="font-bold underline">
              Our Other Event: CODE CRUSADE 4.0
            </Link>
          </div>

          <div className="bg-white text-black p-6 rounded-lg shadow-lg w-full md:w-2/3">
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
                <div>
                  <label htmlFor="name" className="block font-semibold">
                    Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={data.name}
                    placeholder="Enter Name"
                    className="w-full p-3 border rounded-lg bg-gray-100"
                    onChange={(e) => setData({ ...data, name: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block font-semibold">
                    Phone Number
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    value={data.phone}
                    placeholder="Enter Phone Number"
                    className="w-full p-3 border rounded-lg bg-gray-100"
                    onChange={(e) => {
                      setData({ ...data, phone: e.target.value });
                      validatePhone(e.target.value);
                    }}
                    required
                  />
                  {phoneError && (
                    <p className="text-red-500 text-sm">{phoneError}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="email" className="block font-semibold">
                    Student Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={data.email}
                    placeholder="youremail@gmail.com"
                    className="w-full p-3 border rounded-lg bg-gray-100"
                    onChange={(e) => {
                      setData({ ...data, email: e.target.value });
                      validateEmail(e.target.value);
                    }}
                    required
                  />
                  {emailError && (
                    <p className="text-red-500 text-sm">{emailError}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="rollNo" className="block font-semibold">
                    Roll Number
                  </label>
                  <input
                    id="rollNo"
                    type="text"
                    value={data.rollNo}
                    placeholder="Enter Roll Number"
                    className="w-full p-3 border rounded-lg bg-gray-100"
                    onChange={(e) =>
                      setData({ ...data, rollNo: e.target.value })
                    }
                    required
                  />
                </div>

                <div>
                  <label htmlFor="hostelLocal" className="block font-semibold">
                    Hostelite/Localite
                  </label>
                  <select
                    id="hostelLocal"
                    value={data.hostelLocal}
                    className="w-full p-3 border rounded-lg bg-gray-100"
                    onChange={(e) =>
                      setData({ ...data, hostelLocal: e.target.value })
                    }
                    required
                  >
                    <option value="">Select</option>
                    <option value="hostelite">Hostelite</option>
                    <option value="localite">Localite</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-orange-500 text-white py-3 rounded-lg font-bold hover:bg-orange-600 transition-all duration-300 mt-4"
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>

      <Modal open={open} onClose={onCloseModal} center>
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
              window.open("https://chat.whatsapp.com/IjriArmhgAGIQXtD6EX6Io?mode=wwt")
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
            LHFaxn2T6OZHBhv1F01edd
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
    </>
  );
};

export default Register;
