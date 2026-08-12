"use client";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  X,
  Users,
  Trophy,
  Zap,
  ChevronDown,
  Star,
  Code,
  Award,
} from "lucide-react";

const ClubRecruitment = () => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    rollNo: "",
    regNo: "",
    nistEmail: "",
    personalEmail: "",
    gender: "",
    branch: "",
    hackerrankId: "",
    techStacks: "",
    mobile: "",
    hostelLocal: "",
    reason: "",
  });

  const [scrollingDown, setScrollingDown] = useState(false);
  const [lastScrollTop, setLastScrollTop] = useState(0);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [rollNo, setRollNo] = useState("");

  const checkStatusRef = useRef(null);

  const notify = (message) => toast.error(message);
  const successNotify = (message) => toast.success(message);

  useEffect(() => {
    const handleScroll = () => {
      const currentScroll =
        window.scrollY || document.documentElement.scrollTop;
      if (currentScroll > lastScrollTop) {
        setScrollingDown(true);
      } else {
        setScrollingDown(false);
      }
      setLastScrollTop(currentScroll <= 0 ? 0 : currentScroll);
    };

    const handleClickOutside = (event) => {
      if (
        checkStatusRef.current &&
        !checkStatusRef.current.contains(event.target)
      ) {
        setIsFormVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousedown", handleClickOutside);
    };
  }, [lastScrollTop]);

  const handleCheckStatusClick = () => {
    setIsFormVisible((prev) => !prev);
  };

  const handleRollNoChange = (e) => {
    setRollNo(e.target.value);
  };

  const handleCheckStatus = async (e) => {
    setCheckingStatus(true);
    e.preventDefault();
    try {
      const link = "https://club-excel-backend.vercel.app";
      // const link = "http://localhost:8000";
      const res = await axios.get(`${link}/api/getuser/${rollNo}`);
      console.log(res);
      if (res.status === 200) {
        successNotify("User found, already registered!");
        setRollNo("");
        setIsFormVisible(false);
      }
      setCheckingStatus(false);
    } catch (error) {
      notify("User not found. Please register!");
      setCheckingStatus(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    setIsRegistering(true);
    e.preventDefault();
    if (!formData.nistEmail.includes("nist.edu")) {
      notify("Enter a valid NIST email address.");
      return;
    }
    console.log(formData);
    const API_ENDPOINT = "https://club-excel-backend.vercel.app/api/register";
    // const API_ENDPOINT = "http://localhost:8000/api/register";

    try {
      const res = await axios.post(API_ENDPOINT, formData);

      if (res.status === 201) {
        setOpen(true);
        successNotify("Registration successful!");
        setFormData({
          name: "",
          rollNo: "",
          regNo: "",
          nistEmail: "",
          personalEmail: "",
          gender: "",
          branch: "",
          hackerrankId: "",
          techStacks: "",
          mobile: "",
          hostelLocal: "",
          reason: "",
        });
      }
      setIsRegistering(false);
    } catch (error) {
      if (error.response) {
        console.error("Registration error:", error.response.data);
        notify(
          error.response.data.message ||
            "Registration failed. Please try again."
        );
      } else if (error.request) {
        console.error("Network error:", error.request);
        notify("Network error. Please check your connection and try again.");
      } else {
        console.error("Unexpected error:", error.message);
        notify("An unexpected error occurred.");
      }
    }
    setIsRegistering(false);
  };

  const onCloseModal = () => setOpen(false);

  return (
    <div className="min-h-screen bg-[#020202] relative overflow-hidden font-sans text-white">
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

      <div
        className={`fixed w-full h-12 z-[9999] flex justify-center items-center px-4 transition-all duration-300 ${
          scrollingDown ? "-top-20" : "top-2"
        }`}
      >
        <div className="relative flex items-center justify-center p-2 rounded-full bg-gray-950/70 backdrop-blur-xl border border-gray-800 shadow-lg">
          <Link
            href="/"
            className="px-6 py-2 text-sm md:text-base font-bold uppercase text-gray-300 hover:text-white transition-colors"
          >
            Home
          </Link>
          <div className="w-px h-6 bg-gray-700"></div>
          <div className="relative" ref={checkStatusRef}>
            <span
              onClick={handleCheckStatusClick}
              className="check-status-link px-6 py-2 text-sm md:text-base font-bold uppercase text-gray-300 hover:text-white transition-colors cursor-pointer"
            >
              Check Status
            </span>
            {isFormVisible && (
              <div className="absolute top-12 left-1/2 -translate-x-1/2 p-6 bg-gray-900 rounded-xl shadow-lg border border-gray-800 w-64">
                <form onSubmit={handleCheckStatus} className="flex flex-col">
                  <label
                    htmlFor="rollNo"
                    className="mb-2 text-sm font-medium text-gray-300"
                  >
                    Roll No:
                  </label>
                  <input
                    type="text"
                    id="rollNo"
                    value={rollNo}
                    onChange={handleRollNoChange}
                    required
                    className="mb-4 p-3 bg-gray-800 border border-gray-700 rounded-lg text-sm placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="Enter your roll no."
                  />
                  <button
                    type="submit"
                    disabled={checkingStatus}
                    className="py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-lg text-sm hover:from-blue-700 hover:to-purple-700 transition-colors"
                  >
                    {checkingStatus ? "checking..." : "check"}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative min-h-screen flex flex-col justify-center items-center px-4 overflow-hidden text-center">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-[#020202] via-[#06060A] to-[#020202]"></div>
          <div className="absolute top-20 left-10 w-96 h-96 bg-blue-900/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-40 right-10 w-80 h-80 bg-indigo-900/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute bottom-20 left-1/3 w-72 h-72 bg-purple-900/5 rounded-full blur-3xl animate-pulse delay-2000"></div>
          <div className="absolute inset-0 opacity-[0.03]">
            <div
              className="w-full h-full"
              style={{
                backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)`,
                backgroundSize: "30px 30px",
              }}
            ></div>
          </div>
        </div>

        <div className="z-10 mb-20 relative pt-20">
          <p className="text-xl md:text-2xl font-light text-gray-400 mb-2 tracking-wide">
            STEP INTO THE WORLD OF
          </p>
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-black text-white mb-6 tracking-tight animate-pulse-slow">
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400">
              CLUB EXCEL
            </span>
          </h1>
          <p className="text-xl md:text-3xl text-gray-500 font-light tracking-wider">
            DARE TO MATCH THE PACE OF EXCELITES
          </p>
        </div>

        {/* Achievement Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-7xl px-4 mb-20 z-10">
          <div className="group bg-gray-950/50 backdrop-blur-xl rounded-2xl p-6 text-center border border-gray-800 hover:border-blue-500 transition-all duration-500 transform hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/10">
            <div className="mb-4">
              <Star className="w-10 h-10 text-blue-400 mx-auto group-hover:animate-pulse" />
            </div>
            <div className="text-3xl md:text-4xl font-black text-blue-400 mb-2 group-hover:text-blue-300 transition-colors">
              95%+
            </div>
            <div className="text-white font-bold text-lg mb-1">PLACEMENT</div>
            <div className="text-gray-500 text-sm">
              Top-tier companies worldwide
            </div>
          </div>
          <div className="group bg-gray-950/50 backdrop-blur-xl rounded-2xl p-6 text-center border border-gray-800 hover:border-purple-500 transition-all duration-500 transform hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/10">
            <div className="mb-4">
              <Award className="w-10 h-10 text-purple-400 mx-auto group-hover:animate-pulse" />
            </div>
            <div className="text-3xl md:text-4xl font-black text-purple-400 mb-2 group-hover:text-purple-300 transition-colors">
              40 LPA
            </div>
            <div className="text-white font-bold text-lg mb-1">
              HIGHEST PACKAGE
            </div>
            <div className="text-gray-500 text-sm">
              Industry-leading salaries
            </div>
          </div>
          <div className="group bg-gray-950/50 backdrop-blur-xl rounded-2xl p-6 text-center border border-gray-800 hover:border-cyan-500 transition-all duration-500 transform hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/10">
            <div className="mb-4">
              <Code className="w-10 h-10 text-cyan-400 mx-auto group-hover:animate-pulse" />
            </div>
            <div className="text-3xl md:text-4xl font-black text-cyan-400 mb-2 group-hover:text-cyan-300 transition-colors">
              MULTI
            </div>
            <div className="text-white font-bold text-lg mb-1">DOMAIN CLUB</div>
            <div className="text-gray-500 text-sm">
              Comprehensive tech expertise
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce z-10">
          <ChevronDown className="w-10 h-10 text-gray-600" />
        </div>
      </div>

      <div className="py-24 px-4 bg-gray-950 relative">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-black text-white mb-6">
              Our Latest{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400">
                Achievements
              </span>
            </h2>
            <div className="w-32 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Placement Achievements */}
            <div className="bg-gray-900/70 backdrop-blur-xl rounded-3xl p-10 border border-gray-800 hover:border-yellow-500 transition-all duration-500 group">
              <div className="flex items-center mb-8">
                <div className="bg-yellow-500/20 p-3 rounded-xl mr-4 group-hover:bg-yellow-500/30 transition-colors">
                  <Trophy className="w-10 h-10 text-yellow-400" />
                </div>
                <h3 className="text-3xl font-black text-white">
                  Placement Excellence
                </h3>
              </div>
              <p className="text-gray-400 mb-8 leading-relaxed text-lg">
                Our seniors have achieved remarkable placement in top companies
                like JP Morgan, Zomato, Walmart, Amazon, Deloitte, HP, and
                Juspay, with incredible packages that set industry benchmarks.
              </p>
              <div className="space-y-4">
                <div className="flex justify-between items-center bg-gray-900 rounded-xl p-4 border border-gray-800">
                  <span className="text-white font-semibold text-lg">
                    Average Package
                  </span>
                  <span className="text-blue-400 font-black text-xl">
                    15+ LPA
                  </span>
                </div>
                <div className="flex justify-between items-center bg-gray-900 rounded-xl p-4 border border-gray-800">
                  <span className="text-white font-semibold text-lg">
                    Highest Package
                  </span>
                  <span className="text-purple-400 font-black text-xl">
                    40 LPA
                  </span>
                </div>
                <div className="flex justify-between items-center bg-gray-900 rounded-xl p-4 border border-gray-800">
                  <span className="text-white font-semibold text-lg">
                    Top Recruiters
                  </span>
                  <span className="text-cyan-400 font-black text-xl">
                    FAANG & More
                  </span>
                </div>
              </div>
            </div>

            {/* Hackathon Achievements */}
            <div className="bg-gray-900/70 backdrop-blur-xl rounded-3xl p-10 border border-gray-800 hover:border-blue-500 transition-all duration-500 group">
              <div className="flex items-center mb-8">
                <div className="bg-blue-500/20 p-3 rounded-xl mr-4 group-hover:bg-blue-500/30 transition-colors">
                  <Zap className="w-10 h-10 text-blue-400" />
                </div>
                <h3 className="text-3xl font-black text-white">
                  Hackathon Champions
                </h3>
              </div>
              <div className="space-y-6">
                <div className="border-l-4 border-yellow-400 pl-6 py-2 bg-gray-900/50 rounded-r-lg">
                  <h4 className="text-white font-bold text-lg">
                    🏆 SIH 2023 Winner
                  </h4>
                  <p className="text-gray-400">Gaurav and his team</p>
                </div>
                <div className="border-l-4 border-yellow-400 pl-6 py-2 bg-gray-900/50 rounded-r-lg">
                  <h4 className="text-white font-bold text-lg">
                    🏆 SIH 2023 Finalist
                  </h4>
                  <p className="text-gray-400">
                    Sudip, Rudransh and their team
                  </p>
                </div>
                <div className="border-l-4 border-blue-400 pl-6 py-2 bg-gray-900/50 rounded-r-lg">
                  <h4 className="text-white font-bold text-lg">
                    🚀 Google Solution Challenge Finalist
                  </h4>
                  <p className="text-gray-400">Payal and her team</p>
                </div>
                <div className="border-l-4 border-purple-400 pl-6 py-2 bg-gray-900/50 rounded-r-lg">
                  <h4 className="text-white font-bold text-lg">
                    ⭐ SIH 2024 Finalist
                  </h4>
                  <p className="text-gray-400">Sruti and her team</p>
                </div>
                <div className="border-l-4 border-indigo-400 pl-6 py-2 bg-gray-900/50 rounded-r-lg">
                  <h4 className="text-white font-bold text-lg">
                    ⚡ IEEE Hack-Arena Finalist
                  </h4>
                  <p className="text-gray-400">Sujata and her team</p>
                </div>
                <div className="border-l-4 border-green-400 pl-6 py-2 bg-gray-900/50 rounded-r-lg">
                  <h4 className="text-white font-bold text-lg">
                    🎯 ULIP Logistic Hackathon Finalist
                  </h4>
                  <p className="text-gray-400">Payal and her team</p>
                </div>
                <div className="border-l-4 border-red-400 pl-6 py-2 bg-gray-900/50 rounded-r-lg">
                  <h4 className="text-white font-bold text-lg">
                    🚀 ODOO Hackathon Finalist
                  </h4>
                  <p className="text-gray-400">Gaurav and his team</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Registration Form */}
      <div className="py-24 px-4 bg-[#020202] relative">
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-black text-white mb-6">
              Join{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400">
                Club Excel
              </span>
            </h2>
            <p className="text-2xl text-gray-400 font-light">
              Begin your transformation into an elite developer
            </p>
            <div className="w-32 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mt-6"></div>
          </div>

          <div className="bg-gray-900/70 backdrop-blur-2xl rounded-3xl p-12 md:p-16 border border-gray-800 shadow-2xl">
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Form Fields */}
                <div className="space-y-3">
                  <label className="block text-white font-bold text-lg">
                    Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-6 py-4 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder="Enter your full name"
                  />
                </div>
                <div className="space-y-3">
                  <label className="block text-white font-bold text-lg">
                    Roll No *
                  </label>
                  <input
                    type="text"
                    name="rollNo"
                    value={formData.rollNo}
                    onChange={handleChange}
                    required
                    className="w-full px-6 py-4 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder="Enter your roll number"
                  />
                </div>
                <div className="space-y-3">
                  <label className="block text-white font-bold text-lg">
                    Registration No *
                  </label>
                  <input
                    type="text"
                    name="regNo"
                    value={formData.regNo}
                    onChange={handleChange}
                    required
                    className="w-full px-6 py-4 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder="Enter your registration number"
                  />
                </div>
                <div className="space-y-3">
                  <label className="block text-white font-bold text-lg">
                    NIST Email *
                  </label>
                  <input
                    type="email"
                    name="nistEmail"
                    value={formData.nistEmail}
                    onChange={handleChange}
                    required
                    className="w-full px-6 py-4 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder="your.name@nist.edu"
                  />
                </div>
                <div className="space-y-3">
                  <label className="block text-white font-bold text-lg">
                    Personal Email *
                  </label>
                  <input
                    type="email"
                    name="personalEmail"
                    value={formData.personalEmail}
                    onChange={handleChange}
                    required
                    className="w-full px-6 py-4 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder="your.personal@email.com"
                  />
                </div>
                <div className="space-y-3">
                  <label className="block text-white font-bold text-lg">
                    Gender *
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    required
                    className="w-full px-6 py-4 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  >
                    <option
                      value=""
                      disabled
                      className="bg-gray-800 text-white"
                    >
                      Select gender
                    </option>
                    <option value="male" className="bg-gray-800 text-white">
                      Male
                    </option>
                    <option value="female" className="bg-gray-800 text-white">
                      Female
                    </option>
                    <option value="other" className="bg-gray-800 text-white">
                      Other
                    </option>
                  </select>
                </div>
                <div className="space-y-3">
                  <label className="block text-white font-bold text-lg">
                    Branch *
                  </label>
                  <input
                    type="text"
                    name="branch"
                    value={formData.branch}
                    onChange={handleChange}
                    required
                    className="w-full px-6 py-4 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder="e.g., Computer Science"
                  />
                </div>
                <div className="space-y-3">
                  <label className="block text-white font-bold text-lg">
                    HackerRank ID *
                  </label>
                  <input
                    type="text"
                    name="hackerrankId"
                    value={formData.hackerrankId}
                    onChange={handleChange}
                    required
                    className="w-full px-6 py-4 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder="Your HackerRank username"
                  />
                </div>
                <div className="space-y-3">
                  <label className="block text-white font-bold text-lg">
                    Tech Stacks/Skills *
                  </label>
                  <input
                    type="text"
                    name="techStacks"
                    value={formData.techStacks}
                    onChange={handleChange}
                    required
                    className="w-full px-6 py-4 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder="e.g., React, Python, Machine Learning"
                  />
                </div>
                <div className="space-y-3">
                  <label className="block text-white font-bold text-lg">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleChange}
                    required
                    className="w-full px-6 py-4 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder="Your mobile number"
                  />
                </div>
                <div className="space-y-3">
                  <label className="block text-white font-bold text-lg">
                    Accommodation *
                  </label>
                  <select
                    name="hostelLocal"
                    value={formData.hostelLocal}
                    onChange={handleChange}
                    required
                    className="w-full px-6 py-4 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  >
                    <option value="" disabled>
                      Select accommodation
                    </option>
                    <option
                      value="hostelite"
                      className="bg-gray-800 text-white"
                    >
                      Hostelite
                    </option>
                    <option value="localite" className="bg-gray-800 text-white">
                      Localite
                    </option>
                  </select>
                </div>
              </div>

              {/* Reason */}
              <div className="mt-8 space-y-3">
                <label className="block text-white font-bold text-lg">
                  Why do you want to join Club Excel? *
                </label>
                <textarea
                  name="reason"
                  value={formData.reason}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full px-6 py-4 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-vertical"
                  placeholder="Tell us about your passion for technology, your goals, and what you hope to achieve with Club Excel..."
                />
              </div>

              {/* Submit Button */}
              <div className="mt-12 text-center">
                <button
                  type="submit"
                  disabled={isRegistering}
                  className="bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 hover:from-blue-700 hover:via-purple-700 hover:to-cyan-700 text-white font-black text-xl px-16 py-5 rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/25 border border-blue-500/20"
                >
                  {isRegistering ? "Registering..." : "Register Now"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-950 py-5 text-center border-t border-gray-800">
        <p className="text-gray-500 text-lg">
          ©Club Excel - ALL RIGHTS RESERVED
        </p>
      </footer>

      {/* Success Modal */}
      {open && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-gray-950 border border-gray-800 rounded-3xl p-10 max-w-lg w-full backdrop-blur-xl relative shadow-2xl text-center">
            <button
              onClick={onCloseModal}
              className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-8 h-8" />
            </button>

            <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-500/25">
              <Users className="w-10 h-10 text-white" />
            </div>

            <h3 className="text-3xl font-black text-white mb-4">
              Registration Successful!
            </h3>

            <p className="text-gray-400 mb-8 leading-relaxed text-lg">
              Thank you for completing your registration for Club Excel! We
              invite you to join our WhatsApp group to receive additional
              information and stay updated on upcoming events and activities.
            </p>

            <a
              href="https://chat.whatsapp.com/DTXBIuAIyiDAmobZY5XYpX"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold px-8 py-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg shadow-green-500/25"
            >
              Join WhatsApp Group
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClubRecruitment;
