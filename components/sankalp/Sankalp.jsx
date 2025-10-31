"use client";
import React from "react";
import styles from "./EventHero.module.css";
import Image from "next/image";
import Link from "next/link";
import { Calendar, Clock, MapPin, ArrowRight, Sparkles } from "lucide-react";

const upcomingEvents = [
  {
    id: 1,
    title: "Code Crusade 4.0 – The Battle Continues!",
    date: "2025-11-06",
    time: "10:30 AM - 4:00 PM",
    location: "ATRIUM CC",
    description:
      "Join us for the fourth edition of Code Crusade, a competitive coding event where participants solve challenging problems to win exciting prizes and showcase their coding skills.",
    image:
      "https://raw.githubusercontent.com/anshukumarbth/clubExcelImage/main/CodeCrusade.png",
    category: "Coding Competition",
    reg: "/sankalp-register",
    rules: [
      "Round 1: Lightning Quiz – Tackle fast-paced programming questions",
      "Round 2: Coding Challenge – Solve real-world problems on HackerRank",
      "Group 1 – First Year Students",
      "Group 2 – First & Second Year Students",
      "Group 3 – Open to All",
      "Individual participation only (no teams)",
      "Join your respective group based on academic year",
      "No cheating, plagiarism, or discussion during rounds",
      "Internet use is restricted to HackerRank only",
      "Follow the event timeline strictly",
      "Maintain discipline and follow the code of conduct",
    ],
  },
  {
    id: 2,
    title: "CipherChase – The Ultimate Hunt!",
    date: "2025-11-07",
    time: "10:30 AM - 4:00 PM",
    location: "ATRIUM 205",
    description:
      "Game, Think & Race! Dive into a thrilling non-technical fest where your gaming reflexes, wit, and puzzle-solving instincts will help you top the leaderboard.",
    image:
      "https://raw.githubusercontent.com/anshukumarbth/clubExcelImage/main/CipherChase.png",
    category: "Fun Event",
    reg: "/sankalp-register",
    rules: [
      "Round 1: Single-Player Games – Survive and advance",
      "Round 2: Buzzer Battle – Be among the fastest to reach the finals",
      "Round 3: The Ultimate Hunt",
      "Open exclusively for First Year and Second Year students",
      "Individual participation only",
      "Strictly follow round instructions from coordinators",
      "No external help or unfair play allowed",
      "Respect event timings and cooperate with volunteers",
      "Misconduct leads to disqualification",
    ],
  },
];

const EventHero = () => {
  return (
    <div className="bg-gradient-to-br from-gray-950 to-gray-900 min-h-screen">
      {/* Hero Section */}
      <section
        id="hero"
        className="relative h-screen bg-black overflow-hidden text-white flex items-center justify-center"
      >
        <div className={styles.smokeOverlay}>
          <div className={styles.smokeLayer}></div>
          <div className={styles.smokeLayer}></div>
          <div className={styles.smokeLayer}></div>
        </div>

        <div className="text-center px-4 w-full z-10 relative">
          <p className="text-lg md:text-xl font-semibold text-orange-500 mb-3 uppercase tracking-widest font-michroma">
            Club Excel Presents
          </p>

          <h1 className="text-6xl sm:text-8xl lg:text-9xl font-extrabold leading-tight mb-4">
            SANKALP
            <span className="text-orange-500 inline-block font-michroma text:3xl lg:text-6xl">
              2025
            </span>
          </h1>

          <p className="text-xl md:text-3xl font-semibold text-white mt-6 tracking-wide max-w-5xl mx-auto ">
            The Premier Techno-Management Symposium
          </p>

          <p className="text-sm md:text-lg text-gray-400 mt-4 max-w-3xl mx-auto ">
            Where Code Meets Fun – Club Excel Rocks
          </p>

          <div className="w-full flex items-center justify-center pt-5">
            <Image
              src="/components/clublogo.gif"
              alt="Club Logo"
              width={100}
              height={100}
              className="w-22 sm:w-24 md:w-32 lg:w-40"
            />
            <Image
              src="/event/sankalp2025.png"
              alt="sankalp Logo"
              width={100}
              height={100}
              className="w-22 sm:w-24 md:w-32 lg:w-40 animate-spin-slow"
            />
          </div>
        </div>
      </section>

      {/* Events Section */}
      <section className="relative py-20 px-6 max-w-7xl mx-auto overflow-hidden">
        {/* Background Blur Effects */}
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>

        <div className="relative z-10">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-6 py-2 bg-orange-600/20 border border-orange-500/30 rounded-full mb-4">
              <Sparkles className="w-5 h-5 text-orange-500" />
              <span className="text-orange-500 font-semibold gal-head uppercase tracking-wider text-sm">
                Featured Events
              </span>
            </div>
            <h2 className="text-5xl md:text-6xl font-extrabold text-white mb-4 font-michroma">
              Our <span className="text-orange-500">Events</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto ">
              Experience innovation, competition, and excitement
            </p>
          </div>

          {/* Event Cards */}
          <div className="space-y-12">
            {upcomingEvents.map((event, index) => (
              <div key={event.id} className="group relative">
                {/* Glassmorphism Card Container */}
                <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl transition-all duration-300 hover:border-white/20 hover:shadow-orange-500/10">
                  <div className="relative flex flex-col lg:flex-row">
                    {/* Image Section - Better proportions for large screens */}
                    <div className="w-full lg:w-96 xl:w-[420px] relative bg-gradient-to-br from-gray-900 to-gray-950 flex items-center justify-center p-8 lg:p-10 border-b lg:border-b-0 lg:border-r border-white/10">
                      <div className="relative w-full h-64 sm:h-80 lg:h-96">
                        <Image
                          src={event.image}
                          alt={event.title}
                          fill
                          className="object-contain"
                        />
                      </div>

                      {/* Category Badge */}
                      <div className="absolute top-6 right-6 px-4 py-2 bg-orange-600/90 backdrop-blur-sm rounded-full">
                        <span className="text-white font-bold text-xs uppercase tracking-wider gal-head">
                          {event.category}
                        </span>
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className="flex-1 p-8 lg:p-10 flex flex-col justify-between">
                      {/* Title & Description */}
                      <div className="mb-6">
                        <h3 className="text-3xl lg:text-4xl xl:text-5xl font-extrabold text-white mb-3 gal-head gal-head">
                          {event.title}
                        </h3>

                        <p className="text-gray-300 text-base lg:text-lg leading-relaxed ">
                          {event.description}
                        </p>
                      </div>

                      {/* Event Details Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10">
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-orange-600/20 rounded-lg">
                            <Calendar className="w-5 h-5 text-orange-500" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold font-michroma mb-1">
                              Date
                            </p>
                            <p className="text-white font-semibold text-sm font-tektur ">
                              {new Date(event.date).toLocaleDateString(
                                "en-US",
                                {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                }
                              )}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-orange-600/20 rounded-lg">
                            <Clock className="w-5 h-5 text-orange-500" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold font-michroma mb-1">
                              Time
                            </p>
                            <p className="text-white font-semibold text-sm font-tektur">
                              {event.time}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-orange-600/20 rounded-lg">
                            <MapPin className="w-5 h-5 text-orange-500" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold font-michroma mb-1">
                              Venue
                            </p>
                            <p className="text-white font-semibold text-sm font-tektur">
                              {event.location}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Rules Section */}
                      <div className="mb-6 p-6 bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-sm rounded-2xl border border-white/10">
                        <h4 className="text-xl font-bold mb-4 text-orange-500 font-michroma flex items-center gap-2">
                          <span className="w-1 h-6 bg-orange-500 rounded-full"></span>
                          Event Rules
                        </h4>
                        <ul className="space-y-2">
                          {event.rules.map((rule, ruleIndex) => (
                            <li
                              key={ruleIndex}
                              className="flex items-start gap-3 text-gray-300 text-sm "
                            >
                              <span className="text-orange-500 mt-1 flex-shrink-0">
                                •
                              </span>
                              <span>{rule}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Register Button */}
                      <Link href={event.reg}>
                        <button className="w-full py-4 bg-white text-gray-900 font-bold rounded-full hover:bg-gray-200 transition-all duration-300 flex items-center justify-center gap-2 text-base font-michroma shadow-lg hover:shadow-xl group/btn">
                          <span>Register Now</span>
                          <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform duration-300" />
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Decorative Line Between Cards */}
                {index < upcomingEvents.length - 1 && (
                  <div className="flex items-center justify-center my-12">
                    <div className="h-px w-24 bg-gradient-to-r from-transparent via-orange-500/50 to-transparent"></div>
                    <div className="mx-4 w-2 h-2 bg-orange-500 rounded-full"></div>
                    <div className="h-px w-24 bg-gradient-to-r from-transparent via-orange-500/50 to-transparent"></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default EventHero;
