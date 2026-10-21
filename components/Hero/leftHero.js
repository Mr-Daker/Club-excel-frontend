import React from "react"
import styled from "styled-components"

const HeroCopy = styled.div`
  color: #f6f3ff;
  font-family: "Montserrat", Arial, sans-serif;

  .excel-hero-eyebrow {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 29px;
    color: #c2b8dc;
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 2.4px;
    line-height: 1.8;
  }

  .excel-hero-eyebrow::before {
    content: "";
    width: 6px;
    height: 6px;
    flex-shrink: 0;
    border-radius: 50%;
    background: #9cf5ed;
    box-shadow: 0 0 14px rgba(121, 245, 235, 0.6);
  }

  h1 {
    margin: 0;
    font-size: clamp(46px, 5.2vw, 73px);
    font-weight: 700;
    letter-spacing: -3.4px;
    line-height: 1.08;
  }

  .excel-hero-title-line {
    display: block;
  }

  .excel-hero-title-accent {
    color: #bcadf0;
    background: linear-gradient(110deg, #e1d7ff 4%, #b49aea 56%, #8acddc 100%);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .excel-hero-description {
    max-width: 400px;
    margin: 27px 0 0;
    color: #aca4c1;
    font-size: 15px;
    line-height: 1.85;
    font-weight: 400;
  }

  .excel-hero-description strong {
    color: #ede7fc;
    font-weight: 600;
  }

  .excel-hero-actions {
    display: flex;
    align-items: center;
    gap: 24px;
    flex-wrap: wrap;
    margin-top: 33px;
  }

  .excel-hero-contact {
    display: inline-flex;
    align-items: center;
    justify-content: space-between;
    gap: 27px;
    min-height: 52px;
    padding: 0 21px;
    border: 1px solid rgba(232, 222, 255, 0.48);
    border-radius: 8px;
    background: linear-gradient(110deg, #d7c8fb, #b19bdd);
    color: #211333;
    font-size: 12px;
    font-weight: 700;
    text-decoration: none;
    box-shadow: 0 5px 28px rgba(129, 91, 212, 0.15);
    transition: transform 180ms ease, box-shadow 180ms ease;
  }

  .excel-hero-contact:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 34px rgba(161, 126, 235, 0.28);
  }

  .excel-hero-explore {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 12px 0;
    color: #c5bdd6;
    font-size: 12px;
    font-weight: 500;
    text-decoration: none;
    transition: color 180ms ease;
  }

  .excel-hero-explore:hover {
    color: #fff;
  }

  .excel-hero-contact:focus-visible,
  .excel-hero-explore:focus-visible {
    outline: 2px solid #9cf5ed;
    outline-offset: 6px;
  }

  .excel-hero-principles {
    display: flex;
    align-items: center;
    gap: 15px;
    margin-top: 44px;
    color: #80758f;
    font-size: 9px;
    font-weight: 500;
    letter-spacing: 2px;
  }

  .excel-hero-principles span + span::before {
    content: "/";
    margin-right: 15px;
    color: #4e425f;
  }

  @media (max-width: 1100px) and (min-width: 801px) {
    h1 {
      font-size: clamp(44px, 5.7vw, 60px);
      letter-spacing: -2.6px;
    }

    .excel-hero-description {
      font-size: 14px;
    }

    .excel-hero-actions {
      gap: 20px;
    }
  }

  @media (max-width: 800px) {
    .excel-hero-eyebrow {
      margin-bottom: 23px;
      font-size: 9px;
      letter-spacing: 2px;
    }

    h1 {
      font-size: clamp(45px, 10vw, 66px);
      letter-spacing: -2.6px;
    }

    .excel-hero-description {
      max-width: 450px;
      margin-top: 22px;
      font-size: 14px;
    }

    .excel-hero-actions {
      margin-top: 26px;
      gap: 23px;
    }

    .excel-hero-principles {
      margin-top: 29px;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    a {
      transition: none !important;
    }
  }
`

function LeftHero() {
  return (
    <HeroCopy>
      <div className="excel-hero-eyebrow">NIST · THE CODING COLLECTIVE</div>
      <h1 id="excel-hero-heading">
        <span className="excel-hero-title-line">Code the</span>{" "}
        <span className="excel-hero-title-line excel-hero-title-accent">next frontier.</span>
      </h1>
      <p className="excel-hero-description">
        We are <strong>Club Excel.</strong> A community of curious minds at NIST,
        turning bold ideas into what comes next. Learn together. Build something
        that matters.
      </p>
      <div className="excel-hero-actions">
        <a className="excel-hero-contact" href="mailto:clubexcel@nist.edu">
          Let&apos;s build together
          <svg width="17" height="17" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path d="M4 10h12m-5-5 5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>
        <a className="excel-hero-explore" href="#about">
          Discover the club
          <svg width="14" height="14" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path d="M10 4v12m-5-5 5 5 5-5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>
      </div>
      <div className="excel-hero-principles" aria-label="Code, create, collaborate">
        <span>CODE</span>
        <span>CREATE</span>
        <span>COLLABORATE</span>
      </div>
    </HeroCopy>
  )
}

export default LeftHero
