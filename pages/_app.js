import Navbar from "@/components/navbar"
import "@/styles/globals.css"
import styles from "@/styles/Home.module.css"
import Footer from "@/components/footer"
import LeftHero from "@/components/leftHero"

export default function App({ Component, pageProps }) {
  return (
    <>
      {" "}
      <Navbar />
      <Component {...pageProps} />
    </>
  )
}
