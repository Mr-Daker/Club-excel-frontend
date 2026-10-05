import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight, Check, CheckCircle2,
  ChevronDown, Code2, Compass, Fingerprint, Loader2, Plus, Search, Sparkles, Users,
} from "lucide-react";
import MemberPass from "./MemberPass";
import { initialFormData, formSteps, validateStep, submitRegistration, checkRegistration } from "./recruitmentForm";
import styles from "@/styles/Recruitment.module.css";

const stepDetails = [
  { label: "About you", title: "First, a little about you.", description: "Every great connection starts with a hello." },
  { label: "Campus", title: "Your corner of campus.", description: "A few details to help us put a name to a face." },
  { label: "Interests", title: "What makes you curious?", description: "Tell us what you enjoy and what you want to explore." },
];

const fields = {
  name: { label: "Full name", placeholder: "Your full name", autoComplete: "name", wide: true },
  nistEmail: { label: "NIST email", placeholder: "you@nist.edu", type: "email", autoComplete: "email", wide: true },
  personalEmail: { label: "Personal email", placeholder: "you@example.com", type: "email", autoComplete: "email" },
  mobile: { label: "Mobile number", placeholder: "10-digit number", type: "tel", autoComplete: "tel" },
  rollNo: { label: "Roll number", placeholder: "Your college roll number" },
  regNo: { label: "Registration number", placeholder: "Your registration number" },
  branch: { label: "Branch", placeholder: "e.g. Computer Science", wide: true },
  gender: { label: "Gender", options: [["male", "Male"], ["female", "Female"], ["other", "Other"]], placeholder: "Select gender" },
  hostelLocal: { label: "Accommodation", options: [["hostelite", "Hostelite"], ["localite", "Localite"]], placeholder: "Select accommodation" },
  hackerrankId: { label: "HackerRank username", placeholder: "Your HackerRank username", wide: true, autoCapitalize: "none" },
  techStacks: { label: "Your skills & interests", placeholder: "e.g. Python, design, web development", wide: true },
  reason: { label: "Why would you like to join?", placeholder: "An idea you want to build. Something you want to learn. Tell us your story…", wide: true, textarea: true },
};

const benefits = [
  { icon: Code2, number: "01", title: "Make ideas real.", text: "Explore new tools, build projects, and put your curiosity to work." },
  { icon: Users, number: "02", title: "Find your people.", text: "Share the late-night breakthroughs with a community that gets it." },
  { icon: Compass, number: "03", title: "Go a little further.", text: "Learn with peers and mentors. Take on challenges, together." },
];

function Field({ name, value, error, onChange }) {
  const field = fields[name];
  const id = `recruitment-${name}`;
  const props = {
    id, name, value, onChange, required: true,
    "aria-invalid": Boolean(error), "aria-describedby": error ? `${id}-error` : undefined,
    autoComplete: field.autoComplete || "off",
  };
  return (
    <div className={`${styles.field} ${field.wide ? styles.wideField : ""}`}>
      <label htmlFor={id}>{field.label}<span aria-hidden="true">*</span></label>
      {field.options ? (
        <div className={styles.selectWrap}>
          <select {...props}>
            <option value="" disabled>{field.placeholder}</option>
            {field.options.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </select>
          <ChevronDown size={14} aria-hidden="true" />
        </div>
      ) : field.textarea ? (
        <textarea {...props} rows={3} placeholder={field.placeholder} />
      ) : (
        <input {...props} type={field.type || "text"} placeholder={field.placeholder} autoCapitalize={field.autoCapitalize} />
      )}
      {error && <p className={styles.fieldError} id={`${id}-error`}>{error}</p>}
    </div>
  );
}

export default function ClubRecruitment() {
  const [formData, setFormData] = useState({ ...initialFormData });
  const [step, setStep] = useState(0);
  const [mode, setMode] = useState("apply");
  const [errors, setErrors] = useState({});
  const [requestError, setRequestError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registered, setRegistered] = useState(false);
  const [rollNo, setRollNo] = useState("");
  const [lookup, setLookup] = useState(null);
  const [isChecking, setIsChecking] = useState(false);
  const [focusRequest, setFocusRequest] = useState(null);
  const requestInFlight = useRef(false);
  const busy = isSubmitting || isChecking;

  useEffect(() => {
    if (focusRequest) document.getElementById(focusRequest.id)?.focus();
  }, [focusRequest]);

  function focus(id) { setFocusRequest({ id }); }

  function changeMode(nextMode) {
    if (busy) return;
    setMode(nextMode);
    setRequestError("");
  }

  function changeField(event) {
    const { name, value } = event.target;
    setFormData((previous) => ({ ...previous, [name]: value }));
    setErrors((previous) => ({ ...previous, [name]: undefined }));
    setRequestError("");
  }

  function goToStep(index) {
    setStep(index);
    setErrors({});
    setRequestError("");
    focus("application-step-title");
  }

  function showFieldErrors(nextErrors, stepIndex) {
    setStep(stepIndex);
    setErrors(nextErrors);
    focus(`recruitment-${Object.keys(nextErrors)[0]}`);
  }

  async function handleApplication(event) {
    event.preventDefault();
    if (requestInFlight.current) return;
    const stepErrors = validateStep(step, formData);
    if (Object.keys(stepErrors).length) {
      showFieldErrors(stepErrors, step);
      return;
    }
    if (step < stepDetails.length - 1) {
      goToStep(step + 1);
      return;
    }
    for (let index = 0; index < formSteps.length; index += 1) {
      const validation = validateStep(index, formData);
      if (Object.keys(validation).length) {
        showFieldErrors(validation, index);
        return;
      }
    }
    requestInFlight.current = true;
    setIsSubmitting(true);
    setRequestError("");
    try {
      await submitRegistration(formData);
      setRegistered(true);
      setFormData({ ...initialFormData });
      focus("registration-success");
    } catch (error) {
      setRequestError(error.message || "We couldn't submit your application. Please try again.");
    } finally {
      requestInFlight.current = false;
      setIsSubmitting(false);
    }
  }

  async function handleLookup(event) {
    event.preventDefault();
    if (requestInFlight.current) return;
    if (!rollNo.trim()) {
      setLookup({ type: "error", invalid: true, text: "Enter your roll number to check your registration." });
      focus("registration-lookup");
      return;
    }
    requestInFlight.current = true;
    setIsChecking(true);
    setLookup(null);
    try {
      const result = await checkRegistration(rollNo);
      setLookup(result.found
        ? { type: "success", text: "You're registered. We found an application for this roll number. This confirms registration, not selection." }
        : { type: "empty", text: "No registration found for this roll number. Check the number or start your application." });
    } catch (error) {
      setLookup({ type: "error", text: error.message || "We couldn't check your registration. Please try again." });
    } finally {
      requestInFlight.current = false;
      setIsChecking(false);
    }
  }

  function handleTabKey(event) {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key) || busy) return;
    event.preventDefault();
    const next = event.key === "Home" ? "apply" : event.key === "End" ? "check" : mode === "apply" ? "check" : "apply";
    changeMode(next);
    focus(`${next}-tab`);
  }

  return (
    <main className={styles.page}>
      <div className={styles.ambient} aria-hidden="true" />
      <div className={styles.container}>
        <div className={styles.topline}>
          <span><span className={styles.dot} />THE NEXT CHAPTER / CLUB EXCEL</span>
          <span>NIST · BERHAMPUR <ArrowUpRight size={12} aria-hidden="true" /></span>
        </div>
        <div className={styles.mainGrid}>
          <section className={styles.intro} aria-labelledby="recruitment-title">
            <p className={styles.eyebrow}><span>COME AS YOU ARE.</span> GROW WITH US.</p>
            <h1 id="recruitment-title">A place for<br /><span>curious minds.</span><Sparkles aria-hidden="true" className={styles.titleSpark} strokeWidth={1.2} /></h1>
            <p className={styles.introDescription}>The next big idea starts with a little curiosity.<br className={styles.desktopBreak} /> Bring yours. Let’s build something together.</p>
            <a className={styles.mobileApply} href="#application">Start your application <ArrowDown size={16} aria-hidden="true" /></a>
            <MemberPass />
            <div className={styles.introBottom}>
              <span className={styles.peopleMark} aria-hidden="true"><Users size={17} strokeWidth={1.3} /></span>
              <p>A little ambition. A lot of possibility.<br /><Link href="/team">Meet the people behind Excel <ArrowUpRight size={13} aria-hidden="true" /></Link></p>
            </div>
          </section>

          <section className={styles.applicationCard} id="application" aria-label="Club Excel application">
            <div className={styles.cardTabs} role="tablist" aria-label="Application options" onKeyDown={handleTabKey}>
              <button id="apply-tab" type="button" role="tab" aria-selected={mode === "apply"} aria-controls="application-panel" tabIndex={mode === "apply" ? 0 : -1} onClick={() => changeMode("apply")} disabled={busy}>Apply to join <ArrowUpRight size={14} aria-hidden="true" /></button>
              <button id="check-tab" type="button" role="tab" aria-selected={mode === "check"} aria-controls="application-panel" tabIndex={mode === "check" ? 0 : -1} onClick={() => changeMode("check")} disabled={busy}>Check registration</button>
            </div>
            {mode === "apply" ? (
              <div className={styles.cardBody} id="application-panel" role="tabpanel" aria-labelledby="apply-tab">
                {registered ? (
                  <div className={styles.successState}>
                    <div className={styles.successIcon}><Check size={30} aria-hidden="true" /></div>
                    <p className={styles.eyebrow}>APPLICATION RECEIVED</p>
                    <h2 id="registration-success" tabIndex={-1}>Your next chapter<br /><span>is in motion.</span></h2>
                    <p>You’re registered! Join the recruitment WhatsApp group to stay connected with the club.</p>
                    <a className={styles.primaryButton} href="https://chat.whatsapp.com/C9EOSiqiSwKK5Kb5gvIEwy?s=sw&p=a&ilr=0" target="_blank" rel="noopener noreferrer">Join the WhatsApp group <ArrowUpRight size={17} aria-hidden="true" /></a>
                    <p className={styles.smallNote}>Registration is the first step and does not confirm selection.</p>
                    <Link href="/team" className={styles.textLink}>Meet the collective <ArrowRight size={15} aria-hidden="true" /></Link>
                  </div>
                ) : (
                  <>
                    <ol className={styles.stepper} aria-label="Application progress">
                      {stepDetails.map((detail, index) => (
                        <li key={detail.label} className={index <= step ? styles.activeStep : ""}>
                          <button type="button" onClick={() => goToStep(index)} disabled={index >= step || busy} aria-current={index === step ? "step" : undefined} aria-label={`${detail.label}${index < step ? ", completed. Go back to edit" : ""}`}>
                            <span>{index < step ? <Check size={12} aria-hidden="true" /> : `0${index + 1}`}</span>{detail.label}
                          </button>
                        </li>
                      ))}
                    </ol>
                    <div className={styles.formHeading}>
                      <span className={styles.stepCaption}>STEP 0{step + 1} / 03</span>
                      <h2 id="application-step-title" tabIndex={-1}>{stepDetails[step].title}</h2>
                      <p>{stepDetails[step].description}</p>
                    </div>
                    <form onSubmit={handleApplication} noValidate aria-labelledby="application-step-title" aria-busy={isSubmitting}>
                      <fieldset disabled={isSubmitting} className={styles.fieldGrid}>
                        <legend className={styles.srOnly}>{stepDetails[step].label} — all fields are required</legend>
                        {formSteps[step].map((name) => <Field key={name} name={name} value={formData[name]} error={errors[name]} onChange={changeField} />)}
                      </fieldset>
                      {requestError && <p className={styles.requestError} role="alert">{requestError}</p>}
                      <div className={styles.formActions}>
                        {step > 0 && <button type="button" className={styles.backButton} onClick={() => goToStep(step - 1)} disabled={isSubmitting}><ArrowLeft size={15} aria-hidden="true" /> Back</button>}
                        <button type="submit" className={styles.primaryButton} disabled={isSubmitting}>
                          {isSubmitting ? <>Submitting <Loader2 size={17} className={styles.spinner} aria-hidden="true" /></> : <>{step === 2 ? "Submit application" : "Continue"}<ArrowRight size={17} aria-hidden="true" /></>}
                        </button>
                      </div>
                      <p className={styles.formNote}><Fingerprint size={14} aria-hidden="true" />{step === 2 ? "Take a moment to review your details before submitting." : "All fields are required. Make yourself known."}</p>
                    </form>
                  </>
                )}
              </div>
            ) : (
              <div className={`${styles.cardBody} ${styles.lookupPanel}`} id="application-panel" role="tabpanel" aria-labelledby="check-tab">
                <div className={styles.lookupIcon}><Search size={26} strokeWidth={1.3} aria-hidden="true" /></div>
                <p className={styles.stepCaption}>ALREADY APPLIED?</p>
                <h2>Pick up where<br /><span>you left off.</span></h2>
                <p className={styles.lookupDescription}>Enter your college roll number to see whether your registration has been received.</p>
                <form onSubmit={handleLookup} noValidate aria-busy={isChecking}>
                  <div className={styles.field}>
                    <label htmlFor="registration-lookup">Roll number <span aria-hidden="true">*</span></label>
                    <input id="registration-lookup" name="lookupRollNo" value={rollNo} onChange={(event) => { setRollNo(event.target.value); setLookup(null); }} placeholder="Your college roll number" required disabled={isChecking} aria-describedby={lookup ? "lookup-result" : undefined} aria-invalid={Boolean(lookup?.invalid)} />
                  </div>
                  <button type="submit" className={styles.primaryButton} disabled={isChecking}>{isChecking ? "Checking registration" : "Check registration"}{isChecking ? <Loader2 size={17} className={styles.spinner} aria-hidden="true" /> : <ArrowRight size={17} aria-hidden="true" />}</button>
                  {lookup && <div id="lookup-result" className={`${styles.lookupResult} ${lookup.type === "success" ? styles.lookupSuccess : ""}`} role={lookup.type === "error" ? "alert" : "status"}>{lookup.type === "success" && <CheckCircle2 size={19} aria-hidden="true" />}<p>{lookup.text}</p></div>}
                </form>
                <div className={styles.lookupFooter}><span>Haven’t applied yet?</span><button type="button" disabled={isChecking} onClick={() => { changeMode("apply"); focus(registered ? "registration-success" : "application-step-title"); }}>Start your application <ArrowUpRight size={14} aria-hidden="true" /></button></div>
              </div>
            )}
          </section>
        </div>

        <section className={styles.beyond} aria-labelledby="beyond-title">
          <div className={styles.sectionHeading}><p className={styles.eyebrow}>MORE THAN A CLUB</p><h2 id="beyond-title">Good things happen<br /><span>when we build together.</span></h2><Link href="/event">Life at Excel <ArrowUpRight size={16} aria-hidden="true" /></Link></div>
          <div className={styles.benefitGrid}>{benefits.map(({ icon: Icon, number, title, text }) => <article key={number} className={styles.benefit}><div><Icon size={23} strokeWidth={1.2} aria-hidden="true" /><span>{number}</span></div><h3>{title}</h3><p>{text}</p></article>)}</div>
        </section>
        <section className={styles.questions} aria-labelledby="questions-title">
          <div><p className={styles.eyebrow}>BEFORE YOU JUMP IN</p><h2 id="questions-title">A little clarity.</h2><p>Something else on your mind?<br /><Link href="/contact">Let’s talk <ArrowUpRight size={13} aria-hidden="true" /></Link></p></div>
          <div className={styles.accordions}>
            <details><summary>What should I have ready?<Plus size={18} aria-hidden="true" /></summary><p>Keep your NIST email, college roll and registration numbers, contact details, and HackerRank username handy. You’ll also tell us about your skills and why you’d like to join.</p></details>
            <details><summary>Can I edit my answers before submitting?<Plus size={18} aria-hidden="true" /></summary><p>Yes. Use Back or a completed step to review your answers. Your entries stay in the form while you move between steps or check your registration. Refreshing the page clears an unfinished application.</p></details>
            <details><summary>What happens after I apply?<Plus size={18} aria-hidden="true" /></summary><p>Once your registration is confirmed, you’ll get a link to the recruitment WhatsApp group. You can also use Check registration with your roll number to confirm your application was received. Registration does not confirm selection.</p></details>
          </div>
        </section>
      </div>
    </main>
  );
}
