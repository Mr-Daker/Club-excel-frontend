import React from "react"
import styled from "styled-components"
import LeftHero from "./leftHero"
import RightHero from "./rightHero"

const HeroSection = styled.section`
  position: relative;
  z-index: 10;
  isolation: isolate;
  width: 100%;
  max-width: 1424px;
  margin: 0 auto;
  padding: 18px 52px 48px;

  &::before {
    content: "";
    position: absolute;
    z-index: -1;
    pointer-events: none;
    inset: 5% 0 0 30%;
    background: radial-gradient(ellipse at 60% 45%, rgba(89, 63, 178, 0.13), transparent 67%);
  }

  .excel-hero-layout {
    display: grid;
    grid-template-columns: minmax(0, 0.94fr) minmax(0, 1.06fr);
    align-items: center;
    gap: 14px;
    min-height: 550px;
  }

  .excel-hero-copy,
  .excel-hero-object {
    min-width: 0;
  }

  .excel-hero-copy {
    padding: 24px 0 32px 24px;
  }

  @media (min-width: 801px) and (max-width: 1100px) {
    padding: 22px 32px 48px;

    .excel-hero-layout {
      min-height: 560px;
      grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
      gap: 4px;
    }

    .excel-hero-copy {
      padding-left: 0;
    }
  }

  @media (max-width: 800px) {
    padding: 48px 22px 32px;

    .excel-hero-layout {
      grid-template-columns: minmax(0, 1fr);
      gap: 10px;
      min-height: 0;
    }

    .excel-hero-copy {
      width: 100%;
      max-width: 560px;
      margin: 0 auto;
      padding: 0;
    }

    .excel-hero-object {
      width: 100%;
      max-width: 600px;
      margin: 0 auto;
    }
  }
`

function Hero() {
  return (
    <HeroSection aria-labelledby="excel-hero-heading">
      <div className="excel-hero-layout">
        <div className="excel-hero-copy">
          <LeftHero />
        </div>
        <div className="excel-hero-object">
          <RightHero />
        </div>
      </div>
    </HeroSection>
  )
}

export default Hero
