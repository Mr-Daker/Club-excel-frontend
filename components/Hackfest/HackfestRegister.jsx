"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Head from "next/head";
import axios from "axios";
import {
  AlertCircle,
  CheckCircle2,
  MessageCircle,
  Moon,
  RotateCcw,
  Sun,
  X,
} from "lucide-react";

const WHATSAPP_LINK =
  "https://chat.whatsapp.com/KAD5WVxT1N0Jxk0NFYPn6i?s=sh&p=a&mlu=4&ilr=4";

const MAX_MEMBERS = 3;
const REQUIRED_FIELDS = 5;
const EMAIL_RULE = /^\S+@\S+\.\S+$/;

const CONFETTI_COLORS = ["#FFE45E", "#FF90E8", "#8BE9FD", "#B9FF3C", "#FF6B35"];

const TICKER =
  "HACKFEST 2026 ★ TEAM REGISTRATION ★ NIST BERHAMPUR ★ ONE TEAM LEADER PER ENTRY ★ UP TO THREE ADDITIONAL MEMBERS ★ ";

const emptyMember = () => ({ name: "", email: "", phone: "" });

const emptyForm = () => ({
  leader: { name: "", rollNo: "", email: "", phone: "" },
  members: [emptyMember(), emptyMember(), emptyMember()],
  projectDescription: "",
});

const PROGRESS_LABELS = [
  "Not started",
  "Just getting going",
  "Halfway there",
  "Nearly complete",
  "Ready to submit",
];

const validate = (form) => {
  const errors = {};
  const leader = form.leader;

  if (!leader.name.trim())
    errors["leader.name"] = "Team leader name is required.";
  if (!leader.rollNo.trim()) errors["leader.rollNo"] = "Roll number is required.";
  if (!leader.email.trim()) {
    errors["leader.email"] = "Email address is required.";
  } else if (!EMAIL_RULE.test(leader.email.trim())) {
    errors["leader.email"] = "Enter a valid email address.";
  }
  if (!leader.phone.trim()) errors["leader.phone"] = "Phone number is required.";
  if (!form.projectDescription.trim()) {
    errors.projectDescription = "Project description is required.";
  }

  return errors;
};

const HackfestRegister = () => {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [shakeField, setShakeField] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [receipt, setReceipt] = useState(null);
  const [successOpen, setSuccessOpen] = useState(false);
  const [confetti, setConfetti] = useState([]);
  const [formError, setFormError] = useState("");
  const [theme, setTheme] = useState("light");

  const fieldRefs = useRef({});

  useEffect(() => {
    const stored = window.localStorage.getItem("ct-theme");
    if (stored === "dark" || stored === "light") {
      setTheme(stored);
      return;
    }
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setTheme("dark");
    }
  }, []);

  const toggleTheme = () =>
    setTheme((prev) => {
      const next = prev === "dark" ? "light" : "dark";
      window.localStorage.setItem("ct-theme", next);
      return next;
    });

  const clearError = (key) =>
    setErrors((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });

  const setLeaderField = (key) => (event) => {
    const { value } = event.target;
    setForm((prev) => ({ ...prev, leader: { ...prev.leader, [key]: value } }));
    clearError(`leader.${key}`);
  };

  const setMemberField = (index, key) => (event) => {
    const { value } = event.target;
    setForm((prev) => {
      const members = [...prev.members];
      members[index] = { ...members[index], [key]: value };
      return { ...prev, members };
    });
  };

  const completed = useMemo(() => {
    const leader = form.leader;
    const filled = [
      leader.name,
      leader.rollNo,
      leader.email,
      leader.phone,
      form.projectDescription,
    ].filter((value) => value.trim()).length;
    return Math.round((filled / REQUIRED_FIELDS) * 100);
  }, [form]);

  const filledMembers = useMemo(
    () =>
      form.members.filter(
        (m) => m.name.trim() || m.email.trim() || m.phone.trim()
      ).length,
    [form.members]
  );

  const progressIndex = Math.min(
    PROGRESS_LABELS.length - 1,
    Math.floor((completed / 100) * PROGRESS_LABELS.length)
  );

  const burst = () => {
    const stamp = Date.now();
    setConfetti(
      Array.from({ length: 60 }, (_, index) => ({
        id: `${stamp}-${index}`,
        left: Math.random() * 100,
        background: CONFETTI_COLORS[index % CONFETTI_COLORS.length],
        duration: 1800 + Math.random() * 1800,
        delay: Math.random() * 400,
      }))
    );
  };

  const dismissPiece = (id) =>
    setConfetti((prev) => prev.filter((piece) => piece.id !== id));

  const handleReset = () => {
    setForm(emptyForm());
    setErrors({});
    setShakeField("");
    setFormError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isSubmitting) return;

    setFormError("");

    const found = validate(form);
    setErrors(found);

    const keys = Object.keys(found);
    if (keys.length > 0) {
      const first = keys[0];
      setShakeField(first);
      setTimeout(() => setShakeField(""), 700);
      fieldRefs.current[first]?.focus();
      return;
    }

    setIsSubmitting(true);
    try {
      await axios.post("/api/hackfestreg", {
        teamLeader: { ...form.leader },
        members: form.members.map((member) => ({ ...member })),
        projectDescription: form.projectDescription,
      });

      setReceipt({ name: form.leader.name.trim(), members: filledMembers });
      setSuccessOpen(true);
      handleReset();
      burst();
    } catch (error) {
      setFormError(
        error.response?.data?.error ||
          "Registration failed. Please try again later."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const shakeStyle = (key) =>
    shakeField === key ? { animation: "ct-wig .35s 2" } : undefined;

  return (
    <>
      <Head>
        <title>Team Registration — Hackfest 2026 — Club Excel</title>
        <meta
          name="description"
          content="Register your Hackfest team with Club Excel. One team leader, up to three members, one project."
        />
        <link rel="icon" href="/clubexcellogo.png" />
      </Head>

      <div className={`ct-root ${theme === "dark" ? "dark" : ""}`}>
        <div className="ct-ticker">
          <div className="ct-ticker-inner">
            {Array.from({ length: 6 }, (_, i) => (
              <span key={i}>{TICKER}</span>
            ))}
          </div>
        </div>

        <div className="ct-wrap">
          <div className="ct-brand">
            <span className="ct-brand-logo">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/components/club%20excel.png"
                alt="Club Excel"
                width={1485}
                height={1485}
              />
            </span>
            <span className="ct-brand-text">
              <span className="ct-brand-a">Club Excel</span>
              <span className="ct-brand-x">&times;</span>
              <span className="ct-brand-b">Hackfest 2026</span>
            </span>
          </div>

          <div className="ct-top-row">
            <div className="ct-tag">NIST / Berhampur / Odisha</div>
            <div className="ct-tag">Hackfest — 2026</div>
            <div className="ct-tag dark">Registrations open</div>
            <button
              type="button"
              className="ct-theme-btn"
              onClick={toggleTheme}
              aria-label={
                theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
              }
            >
              {theme === "dark" ? <Sun size={13} /> : <Moon size={13} />}
              {theme === "dark" ? "Light" : "Dark"}
            </button>
          </div>

          <header className="ct-poster">
            <div className="ct-kicker">Team registration form</div>

            <h1>
              Register <span className="hl">your team</span>
            </h1>

            <p className="ct-sub">
              One team leader, up to three additional members, and a short
              description of your project. Fields marked{" "}
              <span className="ct-sub-req">must</span> are required.
            </p>

            <div className="ct-meta-grid">
              <div className="ct-meta-box">
                <b>1</b>Team leader
              </div>
              <div className="ct-meta-box">
                <b>0–3</b>Additional members
              </div>
              <div className="ct-meta-box">
                <b>1</b>Project write-up
              </div>
            </div>
          </header>

          <div className="ct-prog">
            <div className="ct-prog-top">
              <span>{completed}% complete</span>
              <span className="ct-prog-text">
                {PROGRESS_LABELS[progressIndex]}
              </span>
            </div>
            <div className="ct-blocks">
              {Array.from({ length: 10 }, (_, i) => {
                const lit = Math.round((completed / 100) * 10);
                const tone = lit <= 3 ? "" : lit <= 6 ? "y" : "g";
                return <i key={i} className={i < lit ? `fill ${tone}` : ""} />;
              })}
            </div>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            {/* 01 — leader */}
            <section>
              <div className="ct-sec-head">
                <div className="ct-num">01</div>
                <div>
                  <h2>Team Leader</h2>
                  <p>Primary contact and accountable owner for this team.</p>
                </div>
                <span className="ct-req-tag">Required</span>
              </div>

              <div className="ct-grid2">
                <div className="ct-field">
                  <label htmlFor="leader-name">
                    Full Name <span className="req">must</span>
                  </label>
                  <input
                    id="leader-name"
                    type="text"
                    value={form.leader.name}
                    onChange={setLeaderField("name")}
                    placeholder="As on your ID card"
                    autoComplete="name"
                    className={errors["leader.name"] ? "err" : ""}
                    style={shakeStyle("leader.name")}
                    ref={(n) => {
                      fieldRefs.current["leader.name"] = n;
                    }}
                  />
                  {errors["leader.name"] ? (
                    <span className="ct-err">
                      <AlertCircle size={12} /> {errors["leader.name"]}
                    </span>
                  ) : (
                    <span className="ct-note">Your legal name, please.</span>
                  )}
                </div>

                <div className="ct-field">
                  <label htmlFor="leader-roll">
                    Roll Number <span className="req">must</span>
                  </label>
                  <input
                    id="leader-roll"
                    type="text"
                    value={form.leader.rollNo}
                    onChange={setLeaderField("rollNo")}
                    placeholder="e.g. 220101001"
                    className={errors["leader.rollNo"] ? "err" : ""}
                    style={shakeStyle("leader.rollNo")}
                    ref={(n) => {
                      fieldRefs.current["leader.rollNo"] = n;
                    }}
                  />
                  {errors["leader.rollNo"] ? (
                    <span className="ct-err">
                      <AlertCircle size={12} /> {errors["leader.rollNo"]}
                    </span>
                  ) : (
                    <span className="ct-note">Used to identify duplicates.</span>
                  )}
                </div>

                <div className="ct-field">
                  <label htmlFor="leader-email">
                    Email Address <span className="req">must</span>
                  </label>
                  <input
                    id="leader-email"
                    type="email"
                    value={form.leader.email}
                    onChange={setLeaderField("email")}
                    placeholder="you@nist.edu"
                    autoComplete="email"
                    className={errors["leader.email"] ? "err" : ""}
                    style={shakeStyle("leader.email")}
                    ref={(n) => {
                      fieldRefs.current["leader.email"] = n;
                    }}
                  />
                  {errors["leader.email"] ? (
                    <span className="ct-err">
                      <AlertCircle size={12} /> {errors["leader.email"]}
                    </span>
                  ) : (
                    <span className="ct-note">Where confirmations go.</span>
                  )}
                </div>

                <div className="ct-field">
                  <label htmlFor="leader-phone">
                    Phone Number <span className="req">must</span>
                  </label>
                  <input
                    id="leader-phone"
                    type="tel"
                    value={form.leader.phone}
                    onChange={setLeaderField("phone")}
                    placeholder="98765 43210"
                    autoComplete="tel"
                    className={errors["leader.phone"] ? "err" : ""}
                    style={shakeStyle("leader.phone")}
                    ref={(n) => {
                      fieldRefs.current["leader.phone"] = n;
                    }}
                  />
                  {errors["leader.phone"] ? (
                    <span className="ct-err">
                      <AlertCircle size={12} /> {errors["leader.phone"]}
                    </span>
                  ) : (
                    <span className="ct-note">10 digits, no country code.</span>
                  )}
                </div>
              </div>
            </section>

            {/* 02 — members */}
            <section>
              <div className="ct-sec-head">
                <div className="ct-num">02</div>
                <div>
                  <h2>Team Members</h2>
                  <p>
                    Optional. Add up to three people, or leave any block blank
                    to skip it.
                  </p>
                </div>
                <span className="ct-req-tag soft">
                  {filledMembers} / {MAX_MEMBERS} added
                </span>
              </div>

              <div className="ct-member-list">
                {form.members.map((member, index) => {
                  const active =
                    member.name.trim() ||
                    member.email.trim() ||
                    member.phone.trim();

                  return (
                    <div
                      key={index}
                      className={`ct-member ${active ? "on" : ""}`}
                    >
                      <div className="ct-member-head">
                        <span className="ct-member-badge">{index + 1}</span>
                        <span>Member {index + 1}</span>
                        <span className="ct-member-opt"></span>
                        <span className="ct-count">
                          {active ? "Filled in" : "Empty"}
                        </span>
                      </div>

                      <div className="ct-grid3">
                        <div className="ct-field">
                          <label htmlFor={`m${index}-name`}>Name</label>
                          <input
                            id={`m${index}-name`}
                            type="text"
                            value={member.name}
                            onChange={setMemberField(index, "name")}
                            placeholder="Full name"
                          />
                        </div>
                        <div className="ct-field">
                          <label htmlFor={`m${index}-email`}>Email</label>
                          <input
                            id={`m${index}-email`}
                            type="email"
                            value={member.email}
                            onChange={setMemberField(index, "email")}
                            placeholder="name@nist.edu"
                          />
                        </div>
                        <div className="ct-field">
                          <label htmlFor={`m${index}-phone`}>Phone</label>
                          <input
                            id={`m${index}-phone`}
                            type="tel"
                            value={member.phone}
                            onChange={setMemberField(index, "phone")}
                            placeholder="98765 43210"
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* 03 — project */}
            <section>
              <div className="ct-sec-head">
                <div className="ct-num">03</div>
                <div>
                  <h2>Project Description</h2>
                  <p>Tell us what you are building and how.</p>
                </div>
                <span className="ct-req-tag">Required</span>
              </div>

              <div className="ct-field">
                <label htmlFor="project">
                  About your project <span className="req">must</span>
                </label>
                <textarea
                  id="project"
                  rows={7}
                  value={form.projectDescription}
                  onChange={(e) => {
                    const { value } = e.target;
                    setForm((prev) => ({
                      ...prev,
                      projectDescription: value,
                    }));
                    clearError("projectDescription");
                  }}
                  placeholder="Describe the problem you are solving, the approach you are taking, and the technologies you plan to use."
                  className={errors.projectDescription ? "err" : ""}
                  style={shakeStyle("projectDescription")}
                  ref={(n) => {
                    fieldRefs.current.projectDescription = n;
                  }}
                />
                {errors.projectDescription ? (
                  <span className="ct-err">
                    <AlertCircle size={12} /> {errors.projectDescription}
                  </span>
                ) : (
                  <span className="ct-note">
                    Problem, approach, and tech stack. Specifics beat
                    adjectives.
                  </span>
                )}
              </div>
            </section>

            {formError ? (
              <div className="ct-banner">
                <AlertCircle size={15} /> {formError}
              </div>
            ) : null}

            <div className="ct-actions">
              <button
                type="button"
                className="ct-btn ct-btn-cancel"
                onClick={handleReset}
                disabled={isSubmitting}
              >
                <RotateCcw size={15} /> Reset
              </button>
              <button
                type="submit"
                className="ct-btn ct-btn-go"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Registering..." : "Register team"}
              </button>
            </div>

            <p className="ct-fine">
              One team leader per entry. By registering you agree to the
              club&rsquo;s <u>participation guidelines</u>.
            </p>
          </form>
        </div>

        <footer className="ct-foot">
          <span>Club Excel — NIST Berhampur</span>
          <span>Hackfest 2026</span>
        </footer>
      </div>

      {confetti.map((piece) => (
        <span
          key={piece.id}
          className="ct-confetti"
          style={{
            left: `${piece.left}vw`,
            background: piece.background,
            animationDuration: `${piece.duration}ms`,
            animationDelay: `${piece.delay}ms`,
          }}
          onAnimationEnd={() => dismissPiece(piece.id)}
        />
      ))}

      {successOpen ? (
        <div className="ct-overlay" onClick={() => setSuccessOpen(false)}>
          <div className="ct-done" onClick={(e) => e.stopPropagation()}>
            <button
              className="ct-close"
              onClick={() => setSuccessOpen(false)}
              aria-label="Close"
            >
              <X size={22} />
            </button>
            <div className="ct-done-icon">
              <CheckCircle2 size={38} />
            </div>
            <h2>Team registered</h2>
            <p>
              <b>{receipt?.name}</b> is leading this team with{" "}
              <b>
                {receipt?.members || 0} additional member
                {(receipt?.members || 0) === 1 ? "" : "s"}
              </b>
              . Your entry has been recorded.
            </p>

            <p className="ct-done-wa-note">
              Join our WhatsApp group for announcements, schedule changes and
              event updates.
            </p>

            <div className="ct-done-actions">
              <a
                className="ct-btn ct-btn-wa"
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle size={17} /> Join WhatsApp group
              </a>
              <button
                className="ct-btn ct-btn-cancel"
                onClick={() => setSuccessOpen(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <style jsx>{`
        .ct-root {
          --paper: #fffdf2;
          --ink: #111110;
          --card: #ffffff;
          --yellow: #ffe45e;
          --pink: #ff90e8;
          --blue: #8be9fd;
          --lime: #b9ff3c;
          --red: #ff3b3b;
          --on-ink: #ffffff;
          --on-accent: #111110;
          --text: #333333;
          --muted: #555555;
          --faint: #9a9a9a;
          --ticker-fg: #b9b9b9;
          --field-bg: #ffffff;
          --field-focus: #fff9b8;
          --field-err: #fff2f2;
          --tint: #f4ffe2;
          --chip-soft: #ececec;
          --card-hover: #eeeeee;
          --line: rgba(17, 17, 16, 0.06);
          --scrim: rgba(17, 17, 16, 0.55);
          font-family: "Space Mono", monospace;
          background-color: var(--paper);
          color: var(--ink);
          background-image: linear-gradient(var(--line) 1px, transparent 1px),
            linear-gradient(90deg, var(--line) 1px, transparent 1px);
          background-size: 24px 24px;
          min-height: 100vh;
          padding-bottom: 40px;
        }

        /* DARK THEME */
        .ct-root.dark {
          --paper: #131313;
          --ink: #f2efe6;
          --card: #1e1e1e;
          --red: #ff5757;
          --on-ink: #131313;
          --on-accent: #111110;
          --text: #ddd8c9;
          --muted: #a5a094;
          --faint: #7a766d;
          --ticker-fg: #4a4740;
          --field-bg: #242424;
          --field-focus: #3d3a1c;
          --field-err: #3d1e1e;
          --tint: #1d2a10;
          --chip-soft: #2a2a2a;
          --card-hover: #2c2c2c;
          --line: rgba(242, 239, 230, 0.07);
          --scrim: rgba(0, 0, 0, 0.72);
        }

        .ct-root ::selection {
          background: var(--yellow);
          color: #000;
        }

        @keyframes ct-tick {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }
        @keyframes ct-wig {
          0%,
          100% {
            transform: translateX(0);
          }
          25% {
            transform: translateX(-5px);
          }
          75% {
            transform: translateX(5px);
          }
        }
        @keyframes ct-drop {
          from {
            transform: translateY(-10vh) rotate(0deg);
            opacity: 1;
          }
          to {
            transform: translateY(110vh) rotate(540deg);
            opacity: 0;
          }
        }

        .ct-ticker {
          background: var(--ink);
          color: var(--ticker-fg);
          overflow: hidden;
          white-space: nowrap;
          border-bottom: 2px solid var(--ink);
          font-weight: 700;
          font-size: 11px;
          letter-spacing: 0.12em;
          padding: 7px 0;
        }
        .ct-ticker-inner {
          display: inline-block;
          animation: ct-tick 34s linear infinite;
        }
        .ct-ticker-inner span {
          margin: 0 16px;
        }

        .ct-wrap {
          max-width: 900px;
          margin: 0 auto;
          padding: 18px 16px 24px;
        }

        .ct-brand {
          display: flex;
          align-items: center;
          gap: 14px;
          border: 3px solid var(--ink);
          background: var(--card);
          box-shadow: 4px 4px 0 var(--ink);
          padding: 10px 16px;
          margin-bottom: 14px;
        }
        .ct-brand-logo {
          position: relative;
          display: block;
          width: 52px;
          height: 56px;
          overflow: hidden;
          flex-shrink: 0;
        }
        .ct-brand-logo img {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 100%;
          height: 100%;
          object-fit: contain;
          transform: translate(-50%, -50%) scale(1.36);
          transform-origin: center;
        }
        .ct-brand-text {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
          font-family: "Archivo Black", sans-serif;
          font-size: clamp(13px, 2.4vw, 18px);
          text-transform: uppercase;
          letter-spacing: 0.01em;
          line-height: 1.1;
        }
        .ct-brand-a {
          color: var(--ink);
        }
        .ct-brand-x {
          color: var(--on-accent);
          background: var(--yellow);
          border: 2px solid var(--ink);
          box-shadow: 2px 2px 0 var(--ink);
          padding: 0 6px;
          font-size: 0.85em;
          line-height: 1.25;
        }
        .ct-brand-b {
          background: var(--ink);
          color: var(--paper);
          border: 2px solid var(--ink);
          box-shadow: 2px 2px 0 var(--lime);
          padding: 1px 8px;
          font-size: 0.85em;
          line-height: 1.35;
        }

        .ct-top-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 10px;
          margin-bottom: 14px;
          flex-wrap: wrap;
        }
        .ct-tag {
          border: 2px solid var(--ink);
          background: var(--card);
          padding: 5px 10px;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.04em;
          box-shadow: 3px 3px 0 var(--ink);
          text-transform: uppercase;
        }
        .ct-tag.dark {
          background: var(--ink);
          color: var(--on-ink);
        }

        .ct-theme-btn {
          margin-left: auto;
          display: inline-flex;
          align-items: center;
          gap: 7px;
          border: 2.5px solid var(--ink);
          background: var(--card);
          color: var(--ink);
          box-shadow: 3px 3px 0 var(--ink);
          padding: 5px 11px;
          cursor: pointer;
          font-family: "Archivo Black", sans-serif;
          font-size: 10px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          white-space: nowrap;
          transition: transform 0.1s, box-shadow 0.1s, background 0.1s;
        }
        .ct-theme-btn:hover {
          transform: translate(-1px, -1px);
          box-shadow: 4px 4px 0 var(--ink);
          background: var(--yellow);
          color: var(--on-accent);
        }
        .ct-theme-btn:active {
          transform: translate(2px, 2px);
          box-shadow: 1px 1px 0 var(--ink);
        }

        .ct-poster {
          background: var(--card);
          border: 3px solid var(--ink);
          box-shadow: 6px 6px 0 var(--ink);
          padding: 20px 20px 18px;
        }
        .ct-kicker {
          display: inline-block;
          background: var(--ink);
          color: var(--on-ink);
          font-size: 10.5px;
          font-weight: 700;
          letter-spacing: 0.14em;
          padding: 5px 9px;
          margin-bottom: 12px;
          text-transform: uppercase;
        }
        .ct-poster h1 {
          font-family: "Archivo Black", sans-serif;
          font-size: clamp(28px, 4.6vw, 46px);
          line-height: 1;
          letter-spacing: -0.01em;
          text-transform: uppercase;
          margin: 0;
        }
        .ct-poster h1 .hl {
          background: var(--yellow);
          color: #000;
          padding: 0 8px;
          border: 3px solid var(--ink);
          display: inline-block;
          box-shadow: 3px 3px 0 var(--ink);
        }
        .ct-sub {
          margin: 12px 0 0;
          font-size: 13px;
          line-height: 1.65;
          max-width: 70ch;
          color: var(--text);
        }
        .ct-sub-req {
          background: var(--red);
          color: #fff;
          padding: 1px 5px;
          border: 2px solid var(--ink);
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          white-space: nowrap;
        }
        .ct-meta-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
          margin-top: 14px;
        }
        .ct-meta-box {
          border: 2.5px solid var(--ink);
          padding: 8px 10px;
          font-size: 11.5px;
          background: var(--paper);
          color: var(--on-accent);
          box-shadow: 3px 3px 0 var(--ink);
          transition: transform 0.1s, box-shadow 0.1s;
        }
        .ct-meta-box:hover {
          transform: translate(-1px, -1px);
          box-shadow: 4px 4px 0 var(--ink);
        }
        .ct-meta-box:nth-child(1) {
          background: var(--lime);
        }
        .ct-meta-box:nth-child(2) {
          background: var(--blue);
        }
        .ct-meta-box:nth-child(3) {
          background: var(--pink);
        }
        .ct-meta-box b {
          display: block;
          font-family: "Archivo Black", sans-serif;
          font-size: 16px;
          font-weight: 400;
          line-height: 1.2;
        }

        .ct-prog {
          margin: 16px 0 0;
          border: 2.5px solid var(--ink);
          background: var(--card);
          box-shadow: 4px 4px 0 var(--ink);
          padding: 10px 12px 9px;
        }
        .ct-prog-top {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          margin-bottom: 8px;
          gap: 10px;
        }
        .ct-prog-text {
          font-family: "Caveat", cursive;
          font-size: 18px;
          text-transform: none;
          letter-spacing: 0;
        }
        .ct-blocks {
          display: flex;
          gap: 5px;
        }
        .ct-blocks i {
          height: 15px;
          flex: 1;
          border: 2px solid var(--ink);
          background: var(--field-bg);
          display: block;
        }
        .ct-blocks i.fill {
          background: var(--ink);
        }
        .ct-blocks i.fill.y {
          background: var(--yellow);
        }
        .ct-blocks i.fill.g {
          background: var(--lime);
        }

        section {
          margin-top: 16px;
          background: var(--card);
          border: 3px solid var(--ink);
          box-shadow: 5px 5px 0 var(--ink);
          padding: 16px 16px 18px;
        }
        .ct-sec-head {
          display: flex;
          gap: 12px;
          align-items: flex-start;
          border-bottom: 2px dashed var(--ink);
          padding-bottom: 11px;
          margin-bottom: 14px;
          flex-wrap: wrap;
        }
        .ct-num {
          font-family: "Archivo Black", sans-serif;
          font-size: 18px;
          background: var(--ink);
          color: var(--on-ink);
          width: 40px;
          height: 40px;
          display: grid;
          place-items: center;
          flex-shrink: 0;
          border: 2.5px solid var(--ink);
        }
        section:nth-of-type(1) .ct-num {
          background: var(--yellow);
          color: #000;
        }
        section:nth-of-type(2) .ct-num {
          background: var(--pink);
          color: #000;
        }
        section:nth-of-type(3) .ct-num {
          background: var(--lime);
          color: #000;
        }
        .ct-sec-head h2 {
          font-family: "Archivo Black", sans-serif;
          font-size: 17px;
          text-transform: uppercase;
          line-height: 1.1;
          margin: 0;
        }
        .ct-sec-head p {
          font-size: 12px;
          margin: 4px 0 0;
          color: var(--muted);
        }
        .ct-req-tag {
          margin-left: auto;
          align-self: center;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          border: 2px solid var(--ink);
          background: var(--paper);
          color: var(--ink);
          padding: 3px 8px;
          white-space: nowrap;
        }
        .ct-req-tag.soft {
          background: var(--chip-soft);
          color: var(--muted);
        }

        .ct-grid2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
        }
        .ct-grid3 {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 11px;
        }
        .ct-field {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .ct-field > label {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }
        .ct-field .req {
          background: var(--red);
          color: #fff;
          padding: 1px 5px;
          border: 2px solid var(--ink);
          margin-left: 5px;
          font-size: 9.5px;
          letter-spacing: 0.1em;
        }
        .ct-note {
          font-family: "Caveat", cursive;
          font-size: 16px;
          line-height: 1.1;
          color: var(--muted);
        }
        .ct-err {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 11.5px;
          font-weight: 700;
          color: var(--red);
        }

        input[type="text"],
        input[type="email"],
        input[type="tel"],
        textarea {
          width: 100%;
          font-family: "Space Mono", monospace;
          font-size: 13.5px;
          font-weight: 700;
          background: var(--field-bg);
          color: var(--ink);
          border: 2.5px solid var(--ink);
          padding: 10px 12px;
          outline: none;
          border-radius: 0;
          box-shadow: 3px 3px 0 var(--ink);
          transition: transform 0.1s, box-shadow 0.1s, background 0.1s;
        }
        textarea {
          min-height: 116px;
          line-height: 1.55;
          resize: vertical;
        }
        input:hover,
        textarea:hover {
          transform: translate(-1px, -1px);
          box-shadow: 4px 4px 0 var(--ink);
        }
        input:focus,
        textarea:focus {
          background: var(--field-focus);
          transform: translate(-2px, -2px);
          box-shadow: 5px 5px 0 var(--ink);
        }
        input::placeholder,
        textarea::placeholder {
          font-weight: 400;
          color: var(--faint);
        }
        input.err,
        textarea.err {
          border-color: var(--red);
          background: var(--field-err);
        }

        .ct-member-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .ct-member {
          border: 2.5px solid var(--ink);
          background: var(--paper);
          padding: 12px 12px 14px;
          box-shadow: 3px 3px 0 var(--ink);
          transition: transform 0.1s, box-shadow 0.1s;
        }
        .ct-member:hover {
          transform: translate(-1px, -1px);
          box-shadow: 4px 4px 0 var(--ink);
        }
        .ct-member.on {
          background: var(--tint);
        }
        .ct-member-head {
          display: flex;
          align-items: center;
          gap: 9px;
          margin-bottom: 11px;
          font-family: "Archivo Black", sans-serif;
          font-size: 12px;
          text-transform: uppercase;
        }
        .ct-member-badge {
          width: 24px;
          height: 24px;
          display: grid;
          place-items: center;
          background: var(--ink);
          color: var(--paper);
          font-size: 12px;
          border: 2px solid var(--ink);
        }
        .ct-member-opt {
          font-family: "Caveat", cursive;
          font-size: 16px;
          font-weight: 400;
          text-transform: none;
          letter-spacing: 0;
          line-height: 1;
          color: var(--muted);
          padding-bottom: 1px;
          border-bottom: 1px dashed var(--ink);
        }
        .ct-count {
          margin-left: auto;
          font-family: "Space Mono", monospace;
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          border: 2px solid var(--ink);
          padding: 2px 7px;
          background: var(--field-bg);
        }
        .ct-member.on .ct-count {
          background: var(--lime);
          color: #000;
        }

        .ct-banner {
          margin-top: 16px;
          display: flex;
          align-items: center;
          gap: 8px;
          border: 2.5px solid var(--red);
          background: var(--field-err);
          color: var(--red);
          font-weight: 700;
          font-size: 12.5px;
          padding: 11px 14px;
          box-shadow: 3px 3px 0 var(--red);
        }

        .ct-actions {
          display: grid;
          grid-template-columns: 200px 1fr;
          gap: 12px;
          margin-top: 16px;
        }
        .ct-btn {
          font-family: "Archivo Black", sans-serif;
          font-size: 14px;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          border: 3px solid var(--ink);
          padding: 14px;
          cursor: pointer;
          box-shadow: 4px 4px 0 var(--ink);
          transition: transform 0.1s, box-shadow 0.1s, background 0.1s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 9px;
        }
        .ct-btn-cancel {
          background: var(--card);
          color: var(--ink);
        }
        .ct-btn-cancel:hover {
          background: var(--card-hover);
          transform: translate(-2px, -2px);
          box-shadow: 6px 6px 0 var(--ink);
        }
        .ct-btn-go {
          background: var(--lime);
          color: #000;
        }
        .ct-btn-go:hover {
          background: var(--yellow);
          transform: translate(-2px, -2px);
          box-shadow: 6px 6px 0 var(--ink);
        }
        .ct-btn:active {
          transform: translate(3px, 3px) !important;
          box-shadow: 1px 1px 0 var(--ink) !important;
        }
        .ct-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .ct-fine {
          font-size: 11px;
          margin-top: 10px;
          text-align: center;
          color: var(--muted);
        }
        .ct-fine u {
          text-decoration-thickness: 2px;
        }

        .ct-foot {
          max-width: 900px;
          margin: 20px auto 0;
          padding: 12px 16px 0;
          border-top: 2px solid var(--ink);
          display: flex;
          justify-content: space-between;
          gap: 10px;
          flex-wrap: wrap;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: var(--muted);
        }

        .ct-confetti {
          position: fixed;
          width: 9px;
          height: 9px;
          top: -16px;
          z-index: 100;
          border: 2px solid var(--ink);
          pointer-events: none;
          animation-name: ct-drop;
          animation-timing-function: cubic-bezier(0.2, 0.7, 0.3, 1);
          animation-fill-mode: forwards;
        }

        .ct-overlay {
          position: fixed;
          inset: 0;
          background: var(--scrim);
          display: grid;
          place-items: center;
          z-index: 99;
          padding: 16px;
        }
        .ct-done {
          background: var(--card);
          border: 3px solid var(--ink);
          box-shadow: 7px 7px 0 var(--ink);
          max-width: 430px;
          width: 100%;
          padding: 24px 22px;
          text-align: center;
          position: relative;
        }
        .ct-done::before {
          content: "REGISTERED ✓";
          position: absolute;
          top: -15px;
          left: 50%;
          transform: translateX(-50%);
          background: var(--lime);
          color: #000;
          border: 3px solid var(--ink);
          font-family: "Archivo Black", sans-serif;
          font-size: 11px;
          padding: 5px 12px;
          white-space: nowrap;
        }
        .ct-done-icon {
          width: 70px;
          height: 70px;
          margin: 14px auto 4px;
          border: 3px solid var(--ink);
          background: var(--lime);
          color: #000;
          display: grid;
          place-items: center;
          box-shadow: 3px 3px 0 var(--ink);
        }
        .ct-done h2 {
          font-family: "Archivo Black", sans-serif;
          font-size: 24px;
          text-transform: uppercase;
          margin: 12px 0 7px;
          color: var(--ink);
        }
        .ct-done p {
          font-size: 12.5px;
          line-height: 1.65;
          margin: 0 0 16px;
          color: var(--text);
        }
        .ct-done p b {
          color: var(--ink);
        }
        .ct-done-wa-note {
          border: 2px dashed var(--ink);
          background: var(--paper);
          padding: 9px 11px;
          font-size: 11.5px !important;
          color: var(--muted) !important;
          margin-bottom: 14px !important;
        }
        .ct-done-actions {
          display: grid;
          gap: 10px;
        }
        .ct-btn-wa {
          background: #25d366;
          color: var(--on-accent);
          text-decoration: none;
        }
        .ct-btn-wa:hover {
          background: #1eb857;
          color: var(--on-accent);
          transform: translate(-2px, -2px);
          box-shadow: 6px 6px 0 var(--ink);
        }
        .ct-close {
          position: absolute;
          right: 12px;
          top: 12px;
          background: none;
          border: none;
          cursor: pointer;
          color: var(--muted);
          padding: 4px;
        }
        .ct-close:hover {
          color: var(--ink);
        }

        @media (max-width: 700px) {
          .ct-grid2,
          .ct-grid3,
          .ct-meta-grid,
          .ct-actions {
            grid-template-columns: 1fr;
          }
          .ct-req-tag {
            margin-left: 0;
          }
          .ct-theme-btn {
            margin-left: 0;
          }
        }
      `}</style>
    </>
  );
};

export default HackfestRegister;
