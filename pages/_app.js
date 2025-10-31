import Navbar from "@/components/Navbar/navbar"
import "@/styles/globals.css"
import "@/styles/Home.module.css"
import Footer from "@/components/Footer/footer"
import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import LoadingBar from "react-top-loading-bar"
import Loader from "@/components/Common/loder"

// Define the routes that should not have Navbar and Footer
const noLayoutPages = ["/club-recruitment", "/sankalp", , "/code-crusade-register", "/cipher-chase-register"]

export default function App({ Component, pageProps }) {
  const [progress, setProgress] = useState(0)
  const router = useRouter()
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const handleRouteChangeStart = () => {
      setProgress(40)
      setLoaded(false)
    }

    const handleRouteChangeComplete = () => {
      setProgress(100)
      setLoaded(true)
    }

    router.events.on("routeChangeStart", handleRouteChangeStart)
    router.events.on("routeChangeComplete", handleRouteChangeComplete)

    // Cleanup subscription on unmount
    return () => {
      router.events.off("routeChangeStart", handleRouteChangeStart)
      router.events.off("routeChangeComplete", handleRouteChangeComplete)
    }
  }, [router.events])

  useEffect(() => {
    setLoaded(false)
    setTimeout(() => {
      setLoaded(true)
    }, 5000)
  }, [])

  const isNoLayoutPage = noLayoutPages.includes(router.pathname)

  return (
    <>
      <LoadingBar
        color="violet"
        progress={progress}
        waitingTime={400}
        onLoaderFinished={() => setProgress(0)}
      />
      {!loaded ? <Loader /> : ""}

      {!isNoLayoutPage && <Navbar />}
      <Component {...pageProps} />
      {!isNoLayoutPage && <Footer />}
    </>
  )
}
