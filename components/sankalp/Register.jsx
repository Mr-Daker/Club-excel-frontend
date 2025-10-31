"use client";

import React, { useState, useEffect, useCallback } from "react";
import { CheckCircle, XCircle, Info, ArrowRight } from "lucide-react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EVENT_OPTIONS = [
  {
    id: "codeCrusade",
    name: "Code Crusade 4.0",
    details: "Coding Competition - Nov 6",
    isCoding: true,
    whatsapp: "https://chat.whatsapp.com/CaQATAdvxY92GHdOUzyCAo",
  },
  {
    id: "cipherChase",
    name: "Cipher Chase",
    details: "Fun Event - Nov 7",
    isCoding: false,
    whatsapp: "https://chat.whatsapp.com/IjriArmhgAGIQXtD6EX6Io",
  },
];

const Register = () => {
  const [data, setData] = useState({
    name: "",
    phone: "",
    email: "",
    rollNumber: "",
    hostelLocal: "",
    instituteEmail: "",
    groupName: "",
    hackId: "",
    selectedEvents: [],
  });

  const [emailError, setEmailError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [instituteEmailError, setInstituteEmailError] = useState("");

  const [isLoaded, setIsLoaded] = useState(true);
  const [groupOptions, setGroupOptions] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [successfulRegistrations, setSuccessfulRegistrations] = useState([]);

  const isCodingEventSelected = data.selectedEvents.includes("codeCrusade");
  const isCipherChaseSelected = data.selectedEvents.includes("cipherChase");

  const onOpenModal = () => setIsModalOpen(true);
  const onCloseModal = () => {
    setIsModalOpen(false);
    setSuccessfulRegistrations([]);
  };

  useEffect(() => {
    let newGroups = [];
    if (data.rollNumber.length >= 4) {
      const year = data.rollNumber.substring(0, 4);

      if (year === "2025") {
        newGroups = ["Group 1", "Group 2", "Group 3"];
      } else if (year === "2024") {
        newGroups = ["Group 2", "Group 3"];
      } else if (year === "2023" || year === "2022") {
        newGroups = ["Group 3"];
      }

      if (data.groupName && !newGroups.includes(data.groupName)) {
        setData((prev) => ({ ...prev, groupName: "" }));
      }
    } else {
      if (data.groupName) {
        setData((prev) => ({ ...prev, groupName: "" }));
      }
    }
    setGroupOptions(newGroups);
  }, [data.rollNumber, data.groupName]);

  const validateEmail = useCallback((email) => {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    setEmailError(emailPattern.test(email) ? "" : "Invalid email format");
  }, []);

  const validatePhone = useCallback((phone) => {
    const phonePattern = /^[6-9]\d{9}$/;
    setPhoneError(
      phonePattern.test(phone) ? "" : "Enter a valid 10-digit phone number"
    );
  }, []);

  const validateInstituteEmail = useCallback((email, isCodingSelected) => {
    if (isCodingSelected) {
      setInstituteEmailError(
        email.includes(".edu") ? "" : "Institute email must contain '.edu'"
      );
    } else {
      setInstituteEmailError("");
    }
  }, []);

  useEffect(() => {
    validateInstituteEmail(data.instituteEmail, isCodingEventSelected);
  }, [isCodingEventSelected, data.instituteEmail, validateInstituteEmail]);

  const handleEventSelection = (eventId, isChecked) => {
    setData((prev) => {
      let updatedEvents = isChecked
        ? [...prev.selectedEvents, eventId]
        : prev.selectedEvents.filter((id) => id !== eventId);

      if (eventId === "codeCrusade" && !isChecked) {
        setInstituteEmailError("");
        return {
          ...prev,
          selectedEvents: updatedEvents,
          instituteEmail: "",
          groupName: "",
          hackId: "",
        };
      }

      return { ...prev, selectedEvents: updatedEvents };
    });
  };

  const submitFormData = async (formData) => {
    setIsLoaded(false);

    try {
      const registrationResults = [];

      // Code Crusade registration
      if (isCodingEventSelected) {
        const codeCrusadeData = {
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          instituteEmail: formData.instituteEmail,
          rollNumber: formData.rollNumber,
          hostelLocal: formData.hostelLocal,
          groupName: formData.groupName,
          hackId: formData.hackId,
        };

        try {
          await axios.post("/api/codecrusadereg", codeCrusadeData);
          registrationResults.push({
            eventId: "codeCrusade",
            eventName: "Code Crusade 4.0",
            whatsapp: EVENT_OPTIONS[0].whatsapp,
            success: true,
          });
        } catch (error) {
          const errorMsg =
            error.response?.data?.error ||
            "Failed to register for Code Crusade";
          toast.error(errorMsg);
          registrationResults.push({
            eventId: "codeCrusade",
            eventName: "Code Crusade 4.0",
            success: false,
            error: errorMsg,
          });
        }
      }

      // Cipher Chase registration
      if (isCipherChaseSelected) {
        const cipherChaseData = {
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          rollNo: formData.rollNumber,
          hostelLocal: formData.hostelLocal,
        };

        try {
          await axios.post("/api/cipherreg", cipherChaseData);
          registrationResults.push({
            eventId: "cipherChase",
            eventName: "Cipher Chase",
            whatsapp: EVENT_OPTIONS[1].whatsapp,
            success: true,
          });
        } catch (error) {
          const errorMsg =
            error.response?.data?.error ||
            "Failed to register for Cipher Chase";
          toast.error(errorMsg);
          registrationResults.push({
            eventId: "cipherChase",
            eventName: "Cipher Chase",
            success: false,
            error: errorMsg,
          });
        }
      }

      // Filter successful registrations
      const successful = registrationResults.filter((r) => r.success);

      if (successful.length > 0) {
        setSuccessfulRegistrations(successful);
        onOpenModal();
        toast.success(
          `Successfully registered for ${successful.length} event(s)!`
        );

        // Reset form
        setData({
          name: "",
          phone: "",
          email: "",
          rollNumber: "",
          hostelLocal: "",
          instituteEmail: "",
          groupName: "",
          hackId: "",
          selectedEvents: [],
        });
      } else {
        toast.error("Registration failed for all selected events.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("An unexpected error occurred during registration.");
    } finally {
      setIsLoaded(true);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (data.selectedEvents.length === 0) {
      toast.info("Please select at least one event to register.");
      return;
    }

    validateEmail(data.email);
    validatePhone(data.phone);
    if (isCodingEventSelected) {
      validateInstituteEmail(data.instituteEmail, true);
    }

    setTimeout(() => {
      const currentErrors =
        emailError ||
        phoneError ||
        (isCodingEventSelected && instituteEmailError);

      if (currentErrors) {
        toast.error("Please correct the highlighted errors before submitting.");
        return;
      }

      if (isCodingEventSelected) {
        if (!data.instituteEmail || !data.groupName || !data.hackId) {
          toast.error(
            "All fields (HackerRank ID, Institute Email, and Group) are required for Code Crusade."
          );
          return;
        }
      }

      submitFormData(data);
    }, 50);
  };

  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-gray-950 to-gray-900 text-white px-6 py-10">
      {!isLoaded && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-orange-600"></div>
        </div>
      )}

      {/* Background blur effects */}
      <div className="absolute top-1/5 left-1/3 w-72 h-72 bg-orange-600/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>

      <div className="relative z-10 w-full max-w-4xl bg-white/5 backdrop-blur-xl p-8 md:p-10 rounded-2xl shadow-2xl">
        <div className="text-center mb-8">
          <h2 className="text-4xl max-sm:text-2xl font-bold gal-head text-orange-600">
            Club Excel Events
          </h2>
          <p className="text-sm text-white/80 mt-2 font-tektur">
            Register for our upcoming events
          </p>
        </div>

        {/* Event Selection Block */}
        <div className="pb-6 mb-6 border-b border-white/20">
          <label className="block text-lg font-semibold mb-4 text-white/90">
            Select Event(s) <span className="text-orange-500">*</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {EVENT_OPTIONS.map((event) => (
              <label
                key={event.id}
                className={`flex items-start p-4 rounded-xl border cursor-pointer transition-all duration-200 ${
                  data.selectedEvents.includes(event.id)
                    ? "bg-orange-600/20 border-orange-500 ring-2 ring-orange-500"
                    : "bg-white/5 border-white/20 hover:bg-white/10 hover:border-white/30"
                }`}
              >
                <input
                  type="checkbox"
                  checked={data.selectedEvents.includes(event.id)}
                  onChange={(e) =>
                    handleEventSelection(event.id, e.target.checked)
                  }
                  className="hidden"
                />
                <div
                  className={`mr-3 mt-1 w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all duration-200 ${
                    data.selectedEvents.includes(event.id)
                      ? "border-orange-500 bg-orange-500"
                      : "border-white/40 bg-transparent"
                  }`}
                >
                  {data.selectedEvents.includes(event.id) && (
                    <CheckCircle className="w-3 h-3 text-white" />
                  )}
                </div>
                <div className="leading-tight">
                  <span className="font-bold text-base text-white font-michroma">
                    {event.name}
                  </span>
                  <span className="text-sm block text-white/70 mt-1">
                    {event.details}
                  </span>
                </div>
              </label>
            ))}
          </div>
          {data.selectedEvents.length > 0 && isCodingEventSelected && (
            <p className="mt-4 text-xs text-white/60 flex items-start">
              <Info className="w-4 h-4 mt-0.5 mr-2 text-orange-500 flex-shrink-0" />
              Code Crusade requires Institute Email, HackerRank ID, and Group
              selection.
            </p>
          )}
        </div>

        {/* Registration Form */}
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Name */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm mb-1 text-white/90"
              >
                Full Name <span className="text-orange-500">*</span>
              </label>
              <input
                id="name"
                type="text"
                value={data.name}
                placeholder="Enter your name"
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/60 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                onChange={(e) => setData({ ...data, name: e.target.value })}
                required
              />
            </div>

            {/* Phone Number */}
            <div>
              <label
                htmlFor="phone"
                className="block text-sm mb-1 text-white/90"
              >
                Phone Number <span className="text-orange-500">*</span>
              </label>
              <input
                id="phone"
                type="tel"
                value={data.phone}
                placeholder="10-digit number"
                className={`w-full px-4 py-2 bg-white/10 border rounded-lg text-white placeholder:text-white/60 focus:ring-2 transition-all ${
                  phoneError
                    ? "border-red-500 focus:ring-red-500"
                    : "border-white/20 focus:ring-orange-500 focus:border-orange-500"
                }`}
                onChange={(e) => {
                  setData({ ...data, phone: e.target.value });
                  validatePhone(e.target.value);
                }}
                required
              />
              {phoneError && (
                <p className="text-red-400 text-xs mt-1 flex items-center">
                  <XCircle className="w-3 h-3 mr-1" />
                  {phoneError}
                </p>
              )}
            </div>

            {/* Student Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm mb-1 text-white/90"
              >
                Personal Email <span className="text-orange-500">*</span>
              </label>
              <input
                id="email"
                type="email"
                value={data.email}
                placeholder="you@example.com"
                className={`w-full px-4 py-2 bg-white/10 border rounded-lg text-white placeholder:text-white/60 focus:ring-2 transition-all ${
                  emailError
                    ? "border-red-500 focus:ring-red-500"
                    : "border-white/20 focus:ring-orange-500 focus:border-orange-500"
                }`}
                onChange={(e) => {
                  setData({ ...data, email: e.target.value });
                  validateEmail(e.target.value);
                }}
                required
              />
              {emailError && (
                <p className="text-red-400 text-xs mt-1 flex items-center">
                  <XCircle className="w-3 h-3 mr-1" />
                  {emailError}
                </p>
              )}
            </div>

            {/* Roll Number */}
            <div>
              <label
                htmlFor="rollNumber"
                className="block text-sm mb-1 text-white/90"
              >
                Roll Number <span className="text-orange-500">*</span>
              </label>
              <input
                id="rollNumber"
                type="text"
                value={data.rollNumber}
                placeholder="e.g., 202522343"
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/60 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                onChange={(e) =>
                  setData({ ...data, rollNumber: e.target.value })
                }
                required
              />
            </div>

            {/* Hostelite/Localite */}
            <div>
              <label
                htmlFor="hostelLocal"
                className="block text-sm mb-1 text-white/90"
              >
                Hostelite/Localite <span className="text-orange-500">*</span>
              </label>
              <select
                id="hostelLocal"
                value={data.hostelLocal}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                onChange={(e) =>
                  setData({ ...data, hostelLocal: e.target.value })
                }
                required
              >
                <option value="" className="bg-gray-900">
                  Select Status
                </option>
                <option value="hostelite" className="bg-gray-900">
                  Hostelite
                </option>
                <option value="localite" className="bg-gray-900">
                  Localite
                </option>
              </select>
            </div>

            {/* Conditional Fields for Code Crusade */}
            {isCodingEventSelected && (
              <>
                {/* Institute Email */}
                <div>
                  <label
                    htmlFor="instituteEmail"
                    className="block text-sm mb-1 text-white/90"
                  >
                    Institute Email <span className="text-orange-500">*</span>
                  </label>
                  <input
                    id="instituteEmail"
                    type="email"
                    value={data.instituteEmail}
                    placeholder="you@nist.edu"
                    className={`w-full px-4 py-2 bg-white/10 border rounded-lg text-white placeholder:text-white/60 focus:ring-2 transition-all ${
                      instituteEmailError
                        ? "border-red-500 focus:ring-red-500"
                        : "border-white/20 focus:ring-orange-500 focus:border-orange-500"
                    }`}
                    onChange={(e) => {
                      setData({ ...data, instituteEmail: e.target.value });
                      validateInstituteEmail(e.target.value, true);
                    }}
                    required
                  />
                  {instituteEmailError && (
                    <p className="text-red-400 text-xs mt-1 flex items-center">
                      <XCircle className="w-3 h-3 mr-1" />
                      {instituteEmailError}
                    </p>
                  )}
                </div>

                {/* HackerRank ID */}
                <div>
                  <label
                    htmlFor="hackId"
                    className="block text-sm mb-1 text-white/90"
                  >
                    HackerRank ID <span className="text-orange-500">*</span>
                  </label>
                  <input
                    id="hackId"
                    type="text"
                    value={data.hackId}
                    placeholder="Your HackerRank username"
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/60 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                    onChange={(e) =>
                      setData({ ...data, hackId: e.target.value })
                    }
                    required
                  />
                </div>

                {/* Group */}
                <div>
                  <label
                    htmlFor="groupName"
                    className="block text-sm mb-1 text-white/90"
                  >
                    Group <span className="text-orange-500">*</span>
                  </label>
                  <select
                    id="groupName"
                    value={data.groupName}
                    className={`w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all ${
                      groupOptions.length === 0
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}
                    onChange={(e) =>
                      setData({ ...data, groupName: e.target.value })
                    }
                    disabled={groupOptions.length === 0}
                    required
                  >
                    <option value="" className="bg-gray-900">
                      {data.rollNumber.length < 4
                        ? "Enter Roll Number first"
                        : "Select Group"}
                    </option>
                    {groupOptions.map((option, index) => (
                      <option
                        key={index}
                        value={option}
                        className="bg-gray-900"
                      >
                        {option}
                      </option>
                    ))}
                  </select>
                  <p className="text-white/50 text-xs mt-1">
                    Group 1: 1st year | Group 2: 1st & 2nd | Group 3: All years
                  </p>
                </div>
              </>
            )}
          </div>

          <button
            type="submit"
            disabled={!isLoaded || data.selectedEvents.length === 0}
            className="w-full py-3 cursor-pointer bg-white text-gray-900 font-bold rounded-full hover:bg-gray-200 transition-all duration-300 flex items-center justify-center gap-2 text-sm sm:text-base font-michroma disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoaded ? (
              <>
                <span>Submit Registration</span>
                <ArrowRight className="w-5 h-5" />
              </>
            ) : (
              "Submitting..."
            )}
          </button>
        </form>
      </div>

      {/* Modal with Multiple WhatsApp Links */}
      {isModalOpen && successfulRegistrations.length > 0 && (
        <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-50 p-4">
          <div className="relative bg-white/5 backdrop-blur-xl p-8 rounded-2xl text-white text-center max-w-md border border-white/20 shadow-2xl">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-orange-600 mb-3 font-michroma">
              Registration Complete!
            </h2>
            <p className="text-white/80 mb-4">
              Thank you for registering for Club Excel events!
            </p>
            <p className="text-sm text-white/60 mb-6">
              {successfulRegistrations.length === 1
                ? "Join the WhatsApp group for event updates:"
                : "Join the WhatsApp groups for event updates:"}
            </p>

            <div className="space-y-3 mb-6">
              {successfulRegistrations.map((registration, index) => (
                <a
                  key={index}
                  href={registration.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full py-3 bg-orange-600 rounded-full font-semibold hover:bg-orange-700 transition-colors text-white font-michroma text-sm"
                >
                  Join {registration.eventName} Group
                </a>
              ))}
            </div>

            <button
              onClick={onCloseModal}
              className="w-full py-3 bg-white/10 border border-white/20 rounded-full font-semibold hover:bg-white/20 transition-colors text-white font-michroma"
            >
              Close
            </button>
          </div>
        </div>
      )}
      <ToastContainer
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
    </section>
  );
};

export default Register;
