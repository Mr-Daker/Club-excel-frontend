import React from "react"
import styled from "styled-components"

const MainCont = styled.div`
margin-left: -100px;
  .head {
    font-family: Montserrat;
    font-size: 46px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;
    background: linear-gradient(#c0b7e8, #8176af);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;

    height: 56px;
  }
  .head-text {
    margin-left: 54px;
  }
  .head2 {
  }
  .white {
    font-family: Montserrat;
    font-size: 46px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;
    background: linear-gradient( #fff,grey);
    background: linear-gradient( #fff,grey);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .hero-p {
    margin-top: 36px;
    color: #fff;
    font-family: Montserrat;
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
    width: 450px;
    height: 72px;
  }
  .button {
    margin-top: 40px;
    display: flex;
    font-family: Montserrat;
    font-weight: 600;
    justify-content: center;
    align-self: flex-end;
    align-items: center;
    width: 214px;
    height: 48px;
    flex-shrink: 0;
    border-radius: 40px;
    background: linear-gradient(90deg, #8176af 0%, #c0b7e8 100%);
    cursor: pointer;
  }

  .button:hover {
    transform: scale(1.1);
    box-shadow: 0px 0px 14px 0px rgba(0, 0, 0, 0.5);
    transition: 0.5s;
  }
`

function LeftHero() {
  return (
    <MainCont>
      <div className="head-text">
        <div>
          <span className="head">CLUB</span>{" "}
          <span className="white">EXCEL</span>
        </div>
        <div className="">
        <span className="head">One of the </span> <span className="white">Top<br/>  Coding Club </span>
        <span className="head">in NIST</span>
        </div>
        <div className="hero-p">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore nisl tincidunt eget.
          Lectus mauris eros in vitae .
        </div>
        <div className="button">
          <span className="send">Send Message</span>
          <div className="arrow"></div>
        </div>
      </div>
    </MainCont>
  )
}

export default LeftHero
