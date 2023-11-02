import React from "react"
import styled from "styled-components"
import Image from "next/legacy/image"

const MainCont = styled.div`
  width: fit-content;
  margin-right: -800px;
  @media (max-width: 800px) {
    margin-left: 0px;
    margin-right: 0px;
    margin-top: -350px;
  }
  .rightHero {
    
  }
`

function RightHero() {
  return (
    <MainCont>
      <div className="rightHero">
        <Image
          src={"/Excel_Logo_Anim.gif"}
          alt="Logo"
          height={426}
          width={490}
        />
      </div>
    </MainCont>
  )
}

export default RightHero