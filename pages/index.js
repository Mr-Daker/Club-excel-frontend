import Head from "next/head"

import { Inter } from "next/font/google"
import styled from "styled-components"
import Intro from "@/components/Intro/intro"
import About from "@/components/About/about"
import dynamic from "next/dynamic"
import QuickContact from "@/components/QuickContact/quickContact"
import Hero from "@/components/Hero/Hero"
import WhyChoose from "@/components/WhyChooseUs/whyChoose"
import { Suspense } from "react"
import { cards } from "@/mock"
import VideoAnimation from "@/components/VideoAnimation/VideoAnimation"
import PageMeta from "@/components/Common/PageMeta"

const Carroussel = dynamic(() => import("@/components/Carroussel/carousel"), {
  ssr: false,
})
const ScrollSection = dynamic(
  () => import("@/components/Domains/ScrollSection"),
  {
    ssr: false,
  }
)
const Card = dynamic(() => import("@/components/Carroussel/Card"), {
  ssr: false,
})

const inter = Inter({ subsets: ["latin"] })

const MainCont = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  .Hero-div {
    @media (max-width: 800px) {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
  }
`

export default function Home() {
  return (
    <>
      <PageMeta
        title="Club Excel"
        description="One of the Top Coding Club in NIST"
        icon="/clubexcellogo.png"
      />
      <Head>
        <title>Club Excel</title>
        <meta
          name="Club Excel"
          content="Popularising coding among Gen Z"
        />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1"
        />
        <link
          rel="icon"
          href="/clubexcellogo.png"
        />
      </Head>
      <Suspense fallback={<p>Loading . . .</p>}>
        <MainCont>
          <Hero />
          <div id="about">
            <QuickContact />
          </div>

          <div className="bg1"></div>
          <div className="bg2"></div>
          <div className="bg3"></div>
          <div className="hero-4"></div>

          <div className="intro-comp">
            <Intro />
          </div>
          <VideoAnimation />
          <About />
          <div className="scrolly">
            <div className="flex-scrolly">
              <div className="intro-text">Our Domains</div>
              <div className="scrolly-arrow"></div>
            </div>
            <ScrollSection />
          </div>

          <div>
            <WhyChoose />
          </div>
          <div id="Gallary">
            <div className="Gal-head">Gallery</div>
            <Carroussel
              cards={cards}
              height="500px"
              width="50%"
              margin="0 auto"
              offset={2}
              showArrows={false}
            />
          </div>
        </MainCont>
      </Suspense>
    </>
  )
}
