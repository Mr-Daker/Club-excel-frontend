import React, { useState, useEffect } from "react";
// import axios from "axios";
import "react-responsive-modal/styles.css";
import { Modal } from "react-responsive-modal";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "@/components/Common/loder";
const Register = () => {
  const [data, setData] = useState({
    name: "",
    phone: "",
    email: "",
    rollNumber: "",
    hostelLocal: "",
    groupName: "",
    hackId: "",
    instituteEmail: "", // New field for institute email
  });

  const notify = (e) => toast.error(e);
  const notifysuccess = () => toast.success("yeeh! Registration Successs.");
  const [isLoaded, setIsLoaded] = useState(true);
  const [group, setGroup] = useState([]);
  const [emailError, setEmailError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [instituteEmailError, setInstituteEmailError] = useState("");
  const [open, setOpen] = useState(false);
  const onOpenModal = () => setOpen(true);
  const onCloseModal = () => setOpen(false);
  useEffect(() => {
    if (data.rollNumber) {
      const sub = data.rollNumber.substring(0, 4);

      if (sub === "2025") {
        setGroup(["Group 1", "Group 2", "Group 3"]);
      } else if (sub === "2024") {
        setGroup(["Group 2", "Group 3"]);
      } else if (sub === "2022") {
        setGroup(["Group 3"]);
      } else if (sub === "2023") {
        setGroup(["Group 3"]);
      }
    } else {
      setGroup([]);
    }
  }, [data.rollNumber]);

  const validateEmail = (email) => {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!emailPattern.test(email)) {
      setEmailError("Invalid email format");
    } else {
      setEmailError("");
    }
  };

  const validatePhone = (phone) => {
    const phonePattern = /^[6-9]\d{9}$/;
    if (!phonePattern.test(phone)) {
      setPhoneError("Enter a valid 10-digit phone number");
    } else {
      setPhoneError("");
    }
  };

  const validateInstituteEmail = (email) => {
    if (!email.includes(".edu")) {
      setInstituteEmailError("Institute email must contain '.edu'");
    } else {
      setInstituteEmailError("");
    }
  };

  const submitFormData = async (data) => {
    setIsLoaded(false);

    // const url = "https://club-excel-backend.vercel.app";
    // const url = "http://localhost:8000";
    try {
      const response = await fetch("/api/codecrusadereg", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body:JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Something went wrong");
      }

      console.log("✅ Saved to MongoDB");
      onOpenModal();
      notifysuccess();

      setData({
        name: "",
        phone: "",
        email: "",
        rollNumber: "",
        hostelLocal: "",
        groupName: "",
        hackId: "",
        instituteEmail: "",
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      notify(error.message || "some error occured");
    } finally {
      setIsLoaded(true);
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (emailError || phoneError || instituteEmailError) {
      alert("Please correct the errors before submitting.");
    } else {
      // Send data to the backend
      submitFormData(data);
    }
  };

  return (
    <>
      <div className="min-h-screen w-screen overflow-hidden flex flex-col items-center bg-black text-white px-6 py-10">
        {/* Header Image */}
        <div className="w-full flex justify-center">
          <img
            src="/components/codecrusade.png"
            alt="Code Crusade 4.0"
            className="max-w-full md:w-2/3 lg:w-1/2 h-auto mx-auto"
          />
        </div>

        {/* Content Section */}
        <div className="container mx-auto flex flex-col md:flex-row gap-8 mt-10 w-full">
          {/* Left Section - Event Info */}
          <div className="bg-[#693B14] text-white p-6 rounded-lg shadow-lg w-full md:w-1/3">
            <h2 className="text-xl font-bold text-orange-400">
              Code Crusade – The Ultimate Coding Battle!
            </h2>
            <p className="mt-2 text-gray-300">
              💡 Think. Code. Conquer. Join us for an intense coding competition
              designed to challenge your problem-solving skills and logical
              thinking. Compete with the best minds and prove your coding
              prowess!
              <br />
              <div className="font-semibold text-blue-500">
                Group1 is only for 1st year and Group2 is for both 1st and 2nd
                year and group3 is open for all year
              </div>
              <span className="font-semibold">🔹 Date:</span> Feb 28
              <br />
              <span className="font-semibold">🔹 Time:</span> 10:30 AM - 4:00 PM
              <br />
              <span className="font-semibold">🔹 Venue:</span> Atrium CC
              <br />
              <span className="font-semibold">🔹 Rounds:</span>
              <br />
              <span className="font-semibold">Round 1:</span> Quiz Round – Test
              your programming knowledge.
              <br />
              <span className="font-semibold">Round 2:</span> Coding Round –
              Solve challenging problems within the time limit.
            </p>
            <a href="/cipher-chase-register" className="font-bold underline">
              CIPHERCHASE
            </a>
          </div>

          {/* Right Section - Registration Form */}
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
                    placeholder="Enter your email"
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
                  <label
                    htmlFor="instituteEmail"
                    className="block font-semibold"
                  >
                    Institute Email
                  </label>
                  <input
                    id="instituteEmail"
                    type="email"
                    value={data.instituteEmail}
                    placeholder="Enter your institute email"
                    className="w-full p-3 border rounded-lg bg-gray-100"
                    onChange={(e) => {
                      setData({ ...data, instituteEmail: e.target.value });
                      validateInstituteEmail(e.target.value);
                    }}
                    required
                  />
                  {instituteEmailError && (
                    <p className="text-red-500 text-sm">
                      {instituteEmailError}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="rollNumber" className="block font-semibold">
                    Roll Number
                  </label>
                  <input
                    id="rollNumber"
                    type="text"
                    value={data.rollNumber}
                    placeholder="Enter Roll Number"
                    className="w-full p-3 border rounded-lg bg-gray-100"
                    onChange={(e) =>
                      setData({ ...data, rollNumber: e.target.value })
                    }
                    required
                  />
                </div>

                <div>
                  <label htmlFor="hackId" className="block font-semibold">
                    HackerRank Id
                  </label>
                  <input
                    id="hackId"
                    type="text"
                    value={data.hackId}
                    placeholder="Enter HackerRank Id"
                    className="w-full p-3 border rounded-lg bg-gray-100"
                    onChange={(e) =>
                      setData({ ...data, hackId: e.target.value })
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

                {/* Group */}
                <div>
                  <label htmlFor="groupName" className="block font-semibold">
                    Group
                  </label>
                  <select
                    id="groupName"
                    className="w-full p-3 border rounded-lg bg-gray-100"
                    onChange={(e) =>
                      setData({ ...data, groupName: e.target.value })
                    }
                    required
                  >
                    <option value="">Select</option>
                    {group.map((option, index) => (
                      <option key={index}>{option}</option>
                    ))}
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
              window.open("https://chat.whatsapp.com/KVsMbjTSbUs2Kqg9Wt45d8 ")
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
            KVsMbjTSbUs2Kqg9Wt45d8
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
