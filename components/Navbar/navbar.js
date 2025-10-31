import React, { useState } from "react"
import styled from "styled-components"
import Image from "next/legacy/image"
import Link from "next/link"

const MainCont = styled.div`
  .navbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 30px 84px;

    @media (max-width: 800px) {
      position: relative;
      z-index: 200;
      align-items: center;

      padding: 20px 20px;
      position: relative;
      transition: all 0.5s ease-in-out;
    }
    @media (min-width: 801px) and (max-width: 1200px) {
      padding: 10px 34px;
    }
  }
  .ntxt {
    color: white;
    text-decoration: none;
  }

  .club-txt {
    margin-left: 20px;
    background: -webkit-linear-gradient(#c0b7e8, #8176af);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    font-family: Montserrat;
    font-size: 46px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;
    @media (min-width: 801px) and (max-width: 1200px) {
      font-size: 30px;
    }
    @media (max-width: 800px) {
      margin-left: 15px;
      font-size: 35px;
      margin-bottom: 10px;
      text-align: center;
    }
  }

  .nav-link {
    display: flex;
    gap: 42px;
    color: #fff;
    font-family: Montserrat;
    font-size: 14px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;

    @media (max-width: 800px) {
      display: flex;
      flex-direction: column;
      align-items: center;
      background-color: #00001a;
      position: absolute;
      top: 100%;
      left: 0;
      width: 100%;
      padding: 20px 0;
      animation: ${({ menuOpen }) =>
    menuOpen
      ? "slide 1s ease-in-out 1 forwards"
      : "revslide 1s ease-in-out 1 forwards"};
    }
  }

  @keyframes revslide {
    0% {
      transform: translateY(-10px);
    }
    20% {
      transform: translateY(40px);
    }
    100% {
      transform: translateY(-400px);
    }
  }

  @keyframes slide {
    from {
      transform: translateY(-400px);
    }
    to {
      transform: translateY(-10px);
    }
  }

  .button1 {
    color: #fff;
    font-family: Montserrat;
    font-size: 12px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;
    width: 154px;
    height: 48px;
    flex-shrink: 0;
    border-radius: 40px;
    border: 2px solid #fff;
    cursor: pointer;
    transition: 0.5s;
    display: flex;
    align-items: center;
    justify-content: center;
    @media (max-width: 800px) {
      margin-top: 10px;
      display: none;
    }
  }

  .button2 {
  }

  .button1:hover {
    background: linear-gradient(90deg, #8176af 0%, #c0b7e8 100%);
    transition: 0.5s;
    border: none;
    transform: scale(1.08);
  }

  .logo-img {
    display: flex;
    align-items: center;
    cursor: pointer;
    @media (max-width: 800px) {
      margin-left: 0;
    }
  }

  .nav-line {
    width: 100vw;
    border: 1px solid #fff;
  }

  .nav-logo {
    @media (min-width: 801px) and (max-width: 1200px) {
    }
  }

  .menu-button {
    display: none;

    @media (max-width: 800px) {
      height: 50px;
      width: 50px;
      display: block;
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      transition: all 0.5s ease-in-out;
    }
  }
  .menu-btn_burger {
    @media (max-width: 800px) {
      height: 4px;
      width: 40px;
      background: #fff;
      border-radius: 5px;
      box-shadow: 0 2px 5px rgba(140, 133, 255, 0.2);
      transition: all 0.5s ease-in-out;
    }
  }

  .menu-btn_burger::after,
  .menu-btn_burger::before {
    @media (max-width: 800px) {
      content: "";
      position: absolute;
      height: 4px;
      width: 40px;
      background: #fff;
      border-radius: 5px;
      box-shadow: 0 2px 5px rgba(140, 133, 255, 0.2);
      transition: all 0.5s ease-in-out;
    }
  }
  .menu-btn_burger::after {
    transform: translateY(12px);
  }
  .menu-btn_burger::before {
    transform: translateY(-12px);
  }

  .open .menu-btn_burger {
    transform: translateX(-50px);
    background: transparent;
    box-shadow: none;
  }
  .open .menu-btn_burger::before {
    transform: rotate(45deg) translate(35px, -35px);
  }
  .open .menu-btn_burger::after {
    transform: rotate(-45deg) translate(35px, 35px);
  }
`

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)

  const toggleMenu = () => {
    setMenuOpen(!menuOpen)
  }

  const closeMenu = () => {
    setMenuOpen(false)
  }

  return (
    <MainCont menuOpen={menuOpen}>
      <div className="navbar">
        <Link href="/">
          <div className="logo-img">
            <Image
              src={"/clubexcellogo.png"}
              height={70}
              width={70}
              alt="logo"
              className="nav-logo"
            />
            <div className="club-txt">Club Excel</div>
          </div>
        </Link>

        <div className="nav-link">
          <Link href="/">
            <div
              className="pointer hover ntxt"
              onClick={closeMenu}
            >
              HOME
            </div>
          </Link>
          <Link href="/event">
            <div
              className="pointer hover ntxt"
              onClick={closeMenu}
            >
              EVENT
            </div>
          </Link>
          <Link href="/sankalp">
            <div
              className="pointer hover ntxt"
              onClick={closeMenu}
            >
              Sankalp
            </div>
          </Link>

          <Link href="/team">
            <div
              className="pointer hover ntxt"
              onClick={closeMenu}
            >
              OUR TEAM
            </div>
          </Link>
          <Link href="/club-recruitment">
            <div
              className="pointer hover ntxt"
              onClick={closeMenu}
            >
              CLUB RECRUITMENT
            </div>
          </Link>
        </div>
        <Link href="/contact">
          <div
            className="button1"
            onClick={closeMenu}
          >
            CONTACT US
          </div>
        </Link>

        <div
          className={menuOpen ? "open menu-button" : "menu-button"}
          onClick={toggleMenu}
        >
          <div className="menu-btn_burger"></div>
        </div>
      </div>
      <div className="nav-line"></div>
    </MainCont>
  )
}

export default Navbar
