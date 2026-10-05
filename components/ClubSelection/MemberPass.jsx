import React, { useId } from "react";
import styles from "../../styles/MemberPass.module.css";

export default function MemberPass() {
  const markGradient = `member-pass-metal-${useId().replace(/:/g, "")}`;

  return (
    <div className={styles.artwork} aria-hidden="true">
      <svg className={styles.orbits} viewBox="0 0 480 270" fill="none">
        <ellipse cx="241" cy="141" rx="213" ry="73" transform="rotate(-19 241 141)" />
        <ellipse cx="241" cy="141" rx="202" ry="92" transform="rotate(23 241 141)" />
        <path d="M31 170h13m-6.5-6.5v13M436 81h10m-5-5v10" />
        <circle cx="429" cy="84" r="3" className={styles.orbitPoint} />
        <circle cx="62" cy="201" r="2" className={styles.orbitPointMuted} />
      </svg>

      <div className={styles.cardShadow} />
      <div className={styles.pass}>
        <div className={styles.innerFrame} />
        <div className={styles.header}>
          <span className={styles.brand}>CLUB EXCEL<span>THE CODING COLLECTIVE</span></span>
          <span className={styles.edition}>EX / NEXT<span>↗</span></span>
        </div>
        <div className={styles.cardBody}>
          <div className={styles.message}>Your next<br />chapter.</div>
          <svg className={styles.mark} viewBox="0 0 116 116" fill="none">
            <defs>
              <linearGradient id={markGradient} x1="19" y1="13" x2="95" y2="103" gradientUnits="userSpaceOnUse">
                <stop stopColor="#F2F2FF" />
                <stop offset=".28" stopColor="#D6CAE9" />
                <stop offset=".47" stopColor="#736B91" />
                <stop offset=".57" stopColor="#E1DBF4" />
                <stop offset=".79" stopColor="#AAA5C5" />
                <stop offset="1" stopColor="#5F657E" />
              </linearGradient>
            </defs>
            <path d="M57 12 73 42l31 16-31 17-16 30-16-30L10 58l31-16Z" fill="#090815" fillOpacity=".42" transform="translate(3 5)" />
            <path d="m57 7 17 32 32 17-32 17-17 32-17-32L8 56l32-17Z" fill={`url(#${markGradient})`} stroke="#E8E0FA" strokeOpacity=".47" strokeWidth=".7" />
            <path d="m57 7 0 49 49 0M57 56v49M57 56H8" stroke="#F1EAFB" strokeOpacity=".3" strokeWidth=".7" />
            <path d="m57 38 18 18-18 18-18-18Z" fill="#343148" stroke="#D1C6EB" strokeWidth=".6" />
            <path d="m57 46 10 10-10 10-10-10Z" fill="#BDDDCF" />
          </svg>
        </div>
        <div className={styles.footer}>
          <span>CURIOUS MINDS.<br />LIMITLESS POSSIBILITIES.</span>
          <span className={styles.signal}><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /></span>
        </div>
      </div>
      <span className={styles.cornerLabel}>MADE FOR WHAT&apos;S NEXT</span>
    </div>
  );
}
