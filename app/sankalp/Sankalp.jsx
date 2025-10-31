"use client";
import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { Calendar, Clock, MapPin, Users, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

const upcomingEvents = [
  {
    id: 1,
    title: "Code Crusade 4.0",
    date: "2025-11-6",
    time: "9:00am to 4:00pm",
    location: "ATRIUM CC",
    description:
      "Join us for the fourth edition of Code Crusade, a competitive coding event where participants solve challenging problems to win exciting prizes and showcase their coding skills.",
    image:
      "https://raw.githubusercontent.com/anshukumarbth/clubExcelImage/main/CodeCrusade.png",
    attendees: "NO Limite",
    category: "Coding Competition",
    reg: "/code-crusade-register",
  },
  {
    id: 2,
    title: "Cipher Chase",
    date: "2025-11-6",
    time: "9:00am to 4:00pm",
    location: "ATRIUM Room no. 205",
    description:
      "Embark on a thrilling journey of cryptography and problem-solving in Cipher Chase. Decode puzzles, crack codes, and race against the clock",
    image:
      "https://raw.githubusercontent.com/anshukumarbth/clubExcelImage/main/CipherChase.png",
    attendees: "NO Limite",
    category: "Fun Event",
    reg: "/cipher-chase-register",
  },
];

const Sankalp2025 = () => {
  const eventSectionRef = useRef(null);
  const eventSectionRef1 = useRef(null);
  const scrollToEvents = () => {
    eventSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToEvents1 = () => {
    eventSectionRef1.current?.scrollIntoView({ behavior: "smooth" });
  };

  const upcomingRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const upcomingInView = useInView(upcomingRef, {
    once: true,
    margin: "-100px",
  });

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut",
      },
    },
  };

  return (
    <div className=" w-screen bg-black text-white overflow-x-hidden relative ">
      <div className="relative flex flex-col items-center justify-center min-h-screen  text-white overflow-hidden px-6">
        {/* soft gradient light */}
        <div className="absolute inset-0 " />

        {/* header image (smaller now) */}
        <motion.div
          
          className="p-6 transition-all duration-500"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.08 }}
          transition={{ duration: 0.6, delay: 1 * 0.2 }}
        >
          <img src="/components/Short_Logo.jpg" alt="logo" className="w-[100%] ml-auto mr-auto " />
        </motion.div>

        {/* headline */}
        <motion.h1
          className="text-center text-4xl md:text-4xl font-extrabold tracking-tight leading-tight bg-clip-text text-transparent bg-gradient-to-r from-orange-400 via-red-500 to-pink-500"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          Code. Compete. Conquer.
        </motion.h1>

        {/* sub-text */}
        <motion.p
          className="text-gray-400 text-center mt-5 max-w-2xl text-lg leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2, delay: 0.2 }}
        >
          Club Excel presents{" "}
          <span className="text-orange-400">Sankalp 2025</span> — a fusion of
          coding, creativity &amp; competition. Experience challenges that push
          your limits.
        </motion.p>

        {/* logos */}
        <div className="relative z-10 mt-14 flex flex-wrap justify-center items-center gap-12">
          {[
            "/components/sankalplogo.png",
            "/components/clublogo.gif",
            "/sankalplogo12.png",
          ].map((src, i) => (
            <motion.div
              key={i}
              className="p-6 bg-[#18181f] rounded-2xl border border-white/10 hover:border-pink-500/40 hover:shadow-[0_0_25px_rgba(255,100,150,0.3)] transition-all duration-500 mt-2"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.08 }}
              transition={{ duration: 0.6, delay: i * 0.2 }}
            >
              <img src={src} alt="logo" className="w-20 sm:w-28 md:w-36" />
            </motion.div>
          ))}
        </div>
      </div>

      <section className="px-4 md:px-8 ">
        <div
          className="flex flex-row justify-end mt-10
         mr-10  md:mt-60"
        ></div>
        <div className="flex flex-row  gap-40  max-sm:flex-col max-sm:gap-1 ">
          <p className="text-[20px] font-extrabold md:text-6xl mt-12">
            <span style={{ color: "#f88e43" }}>SANKALP</span> 2025-26
          </p>
        </div>

        <h2 className="text-6xl font-bold md:text-8xl">
          <div className="w-full flex flex-row max-sm:flex-col">
            <span className="lg:text-[200px]">BIGGEST</span>
            <span style={{ color: "#F88E43" }} className="lg:text-[200px]">
              EVENT
            </span>
          </div>
        </h2>

        <div className="relative flex justify-center mt-12 w-full overflow-hidden">
          <img
            src="/sankalpbanner.png"
            alt="Event Highlight"
            className="w-full max-w-6xl"
          />
          <div
            className="absolute bottom-6 left-6 text-white md:bottom-10 md:left-10"
            ref={eventSectionRef}
          >
            {/* <motion.div
              className="text-left font-bold leading-none"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="block text-blue-400 text-3xl md:text-3xl tracking-wide font-serif">
                CLUB
              </span>
              <span
                className="block text-blue-500 text-9xl md:text-3xl  font-bold max-sm:text-6xl font-serif"
                style={{ letterSpacing: "-1px" }}
              >
                EXCEL
              </span>
            </motion.div> */}

            {/* <p className="mt-2 max-w-md text-sm text-gray-300 md:text-base">
              Club Excel brings tech and fun to Sankalp 2025! Join us for an
              electrifying experience of coding battles, tech challenges, and
              interactive events.
            </p> */}
          </div>
        </div>
      </section>

      <section className="py-20 relative">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Our{" "}
              <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                Events
              </span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Join us for exciting workshops, hackathons, and tech talks. Stay
              updated with upcoming events and relive memories from past
              gatherings.
            </p>
          </motion.div>

          <div ref={upcomingRef} className="mb-20">
            <motion.h2
              initial={{ opacity: 0, x: -50 }}
              animate={
                upcomingInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }
              }
              transition={{ duration: 0.8 }}
              className="text-3xl md:text-4xl font-bold mb-8"
            >
              Upcoming Events
            </motion.h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 ">
              {upcomingEvents.map((event, index) => (
                <motion.div
                  key={event.id}
                  variants={cardVariants}
                  initial="hidden"
                  animate={upcomingInView ? "visible" : "hidden"}
                  transition={{ delay: index * 0.1 }}
                  className="group"
                >
                  <div className="h-full rounded-3xl overflow-hidden bg-card border border-border hover:border-blue-500/40 transition-all duration-300 shadow-lg shadow-blue-200">
                    <div className="relative aspect-[9.5/9] m-2 overflow-hidden">
                      <Image
                        src={event.image}
                        alt={event.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>

                    <div className="p-6">
                      <h3 className="text-xl font-bold mb-3 group-hover:text-blue-500 transition-colors">
                        {event.title}
                      </h3>

                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="w-4 h-4 text-blue-500" />
                          <span>
                            {new Date(event.date).toLocaleDateString("en-US", {
                              month: "long",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="w-4 h-4 text-blue-500" />
                          <span>{event.time}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="w-4 h-4 text-blue-500" />
                          <span>{event.location}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Users className="w-4 h-4 text-blue-500" />
                          <span>{event.attendees} expected attendees</span>
                        </div>
                      </div>

                      <p className="text-sm text-muted-foreground mb-6">
                        {event.description}
                      </p>

                      <Link
                        href={event.reg}
                        className="w-full block"
                        prefetch={true}
                      >
                        <Button
                          className="w-full group/btn bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                          onClick={(e) => {
                            setIsLoading(true);
                          }}
                        >
                          {isLoading ? "Loading..." : "Register Now"}
                        </Button>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Sankalp2025;
