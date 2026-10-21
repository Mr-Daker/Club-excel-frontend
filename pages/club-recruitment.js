import ClubRecruitment from "@/components/ClubSelection/clubRecruitment.jsx"
import Head from "next/head"

const page = () => {
  return (
    <>
      <Head>
        <title>Join the Club — Club Excel</title>
        <meta name="description" content="Find your people. Build your next idea. Apply to Club Excel, NIST's community of curious minds, creators, and problem solvers." />
      </Head>
      <ClubRecruitment />
    </>
  )
}

export default page
