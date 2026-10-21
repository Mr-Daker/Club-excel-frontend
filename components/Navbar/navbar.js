import React, { useRef, useState } from "react"
import styled from "styled-components"
import Image from "next/legacy/image"
import Link from "next/link"
import { useRouter } from "next/router"

const MainCont = styled.div`
  .navbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 30px 84px;

    @media (max-width: 1000px) {
      position: relative;
      z-index: 200;
      align-items: center;

      padding: 20px 20px;
      position: relative;
      transition: all 0.5s ease-in-out;
    }
    @media (min-width: 1001px) and (max-width: 1200px) {
      padding: 10px 34px;
    }
  }
  .ntxt {
    color: white;
    text-decoration: none;
    white-space: nowrap;
  }
  .nav-link a[aria-current="page"] .ntxt { color: #d4bdf6; }
  .nav-link a[aria-current="page"] { text-decoration: underline; text-decoration-color: #b7a1dd80; text-underline-offset: 8px; }
  .mobile-contact { display: none; }
  @media (max-width: 1000px) { .desktop-contact { display: none; } }

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
    white-space: nowrap;
    @media (min-width: 1001px) and (max-width: 1200px) {
      font-size: 30px;
    }
    @media (max-width: 1000px) {
      margin-left: 15px;
      font-size: 35px;
      margin-bottom: 10px;
      text-align: center;
    }
    @media (max-width: 380px) { font-size: 28px; margin-left: 10px; }
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

    @media (max-width: 1000px) {
      display: ${({ $menuOpen }) => $menuOpen ? "flex" : "none"};
      flex-direction: column;
      align-items: center;
      background-color: #1b122c;
      position: absolute;
      top: 100%;
      left: 0;
      width: 100%;
      padding: 28px 0;
      gap: 28px;
      border-bottom: 1px solid #b6a0d839;
      box-shadow: 0 18px 40px #0a041b66;
      animation: menuReveal .2s ease both;
      .mobile-contact { display: block; }
    }
  }

  @keyframes menuReveal {
    from { opacity: 0; transform: translateY(-8px); }
    to { opacity: 1; transform: translateY(0); }
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
    @media (max-width: 1000px) {
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
    @media (max-width: 1000px) {
      margin-left: 0;
    }
  }

  .nav-line {
    width: 100vw;
    border: 1px solid #fff;
  }

  .nav-logo {
    @media (min-width: 1001px) and (max-width: 1200px) {
    }
  }

  .menu-button {
    display: none;
    border: 0;
    padding: 0;
    background: transparent;
    flex-shrink: 0;

    @media (max-width: 1000px) {
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
    @media (max-width: 1000px) {
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
    @media (max-width: 1000px) {
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
  a:focus-visible, button:focus-visible { outline: 2px solid #a1e7de; outline-offset: 6px; border-radius: 4px; }
  @media (prefers-reduced-motion: reduce) { *, *::before, *::after { animation: none !important; transition: none !important; } }
`

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const router = useRouter()
  const menuButton = useRef(null)

  const toggleMenu = () => {
    setMenuOpen(!menuOpen)
  }

  const closeMenu = () => {
    setMenuOpen(false)
  }

  return (
    <MainCont $menuOpen={menuOpen} onKeyDown={event => {
      if (event.key === "Escape" && menuOpen) { closeMenu(); menuButton.current?.focus() }
    }}>
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

        <nav className="nav-link" id="primary-navigation" aria-label="Main navigation" onClick={closeMenu}>
          <Link href="/" aria-current={router.pathname === "/" ? "page" : undefined}>
            <div
              className="pointer hover ntxt"
              onClick={closeMenu}
            >
              HOME
            </div>
          </Link>
          <Link href="/sankalp" aria-current={router.pathname === "/sankalp" ? "page" : undefined}>
            <div
              className="pointer hover ntxt"
              onClick={closeMenu}
            >
              SANKALP
            </div>
          </Link>

          <Link href="/team" aria-current={router.pathname === "/team" ? "page" : undefined}>
            <div
              className="pointer hover ntxt"
              onClick={closeMenu}
            >
              OUR TEAM
            </div>
          </Link>
          <Link href="/club-recruitment" aria-current={router.pathname === "/club-recruitment" ? "page" : undefined}>
            <div
              className="pointer hover ntxt"
              onClick={closeMenu}
            >
              CLUB RECRUITMENT
            </div>
          </Link>
          <Link className="mobile-contact" href="/contact" aria-current={router.pathname === "/contact" ? "page" : undefined}><span className="ntxt">CONTACT US</span></Link>
        </nav>
        <Link href="/contact" className="desktop-contact">
          <div
            className="button1"
            onClick={closeMenu}
          >
            CONTACT US
          </div>
        </Link>

        <button
          ref={menuButton}
          type="button"
          aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={menuOpen}
          aria-controls="primary-navigation"
          className={menuOpen ? "open menu-button" : "menu-button"}
          onClick={toggleMenu}
        >
          <div className="menu-btn_burger"></div>
        </button>
      </div>
      <div className="nav-line"></div>
    </MainCont>
  )
}

export default Navbar
