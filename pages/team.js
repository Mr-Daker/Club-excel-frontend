import React, { useEffect, useMemo, useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight, ArrowRight, Search, X, Plus, ChevronDown, Sparkles, Linkedin, Globe } from "lucide-react"
import PageMeta from "@/components/Common/PageMeta"
import { clubMembers, AlumunaiMembers } from "@/components/Team/teamData"
import styles from "@/styles/Team.module.css"

const PAGE_SIZE = 12
const advisors = [
  { name: "Swetanjali Maharana", img: "/team/swetanjali.jpg", position: "Assistant Professor" },
  { name: "Bandhan Panda", img: "/team/bandhan.jpg", position: "Assistant Professor" },
]
const disciplines = [
  { value: "all", label: "All disciplines", match: () => true },
  { value: "development", label: "Web & software", match: d => /web|full.?stack|backend|frontend|software|product|programmer|devops/i.test(d) },
  { value: "mobile", label: "Mobile development", match: d => /android|flutter|ios/i.test(d) },
  { value: "data", label: "AI & data", match: d => /data|machine learning/i.test(d) },
  { value: "design", label: "UI / UX", match: d => /ui\/ux/i.test(d) },
  { value: "security", label: "Security & Web3", match: d => /security|blockchain|web3/i.test(d) },
]

function profileLink(member) {
  const value = (member.linkedIn || member.LinkedIn || "").trim()
  if (!value) return null
  try {
    const url = new URL(/^https?:\/\//i.test(value) ? value : `https://${value}`)
    return ["http:", "https:"].includes(url.protocol) ? url.href : null
  } catch { return null }
}

function displayName(name) {
  const trimmed = name.trim()
  if (trimmed === trimmed.toUpperCase() || trimmed === trimmed.toLowerCase()) {
    return trimmed.split(/\s+/).map(word => word[0].toUpperCase() + word.slice(1).toLowerCase()).join(" ")
  }
  return trimmed
}

const rosters = {
  members: clubMembers.map(member => ({ ...member, name: displayName(member.name), domain: member.domain.trim(), profile: profileLink(member) })),
  alumni: AlumunaiMembers.map(member => ({ ...member, name: displayName(member.name), domain: member.domain.trim(), profile: profileLink(member) })),
}

function Portrait({ person, className = "", sizes, priority = false }) {
  const [failed, setFailed] = useState(false)
  return (
    <div className={`${styles.portrait} ${className}`}>
      {failed ? <span className={styles.initials} aria-label={person.name}>
        {person.name.split(" ").map(word => word[0]).slice(0, 2).join("")}
      </span> : <Image src={person.img} alt={`${person.name}, Club Excel`} fill
        sizes={sizes} priority={priority} onError={() => setFailed(true)} />}
    </div>
  )
}

function MemberCard({ person, cohort, index }) {
  const isLinkedIn = person.profile && new URL(person.profile).hostname.endsWith("linkedin.com")
  const content = <>
    <div className={styles.memberPhoto}>
      <Portrait person={person} sizes="(max-width: 550px) 46vw, (max-width: 900px) 43vw, (max-width: 1150px) 29vw, 280px" />
      <span className={styles.memberIndex}>{String(index + 1).padStart(2, "0")}</span>
      <span className={styles.memberCohort}>{cohort === "members" ? "THE COLLECTIVE" : "THE LEGACY"}</span>
      {person.profile && <span className={styles.profileHint}>{isLinkedIn ? <Linkedin size={13} /> : <Globe size={13} />} {isLinkedIn ? "LinkedIn" : "Website"} <ArrowUpRight size={13}/></span>}
    </div>
    <div className={styles.memberDetails}>
      <div><h3>{person.name}</h3><p>{person.domain}</p></div>
      {person.profile && <span className={styles.profileArrow}><ArrowUpRight size={18}/></span>}
    </div>
  </>
  return <li className={styles.memberCard} tabIndex={-1}>
    {person.profile ? <a href={person.profile} target="_blank" rel="noopener noreferrer"
      aria-label={`${person.name} — ${person.domain}. View ${isLinkedIn ? "LinkedIn" : "website"} profile (opens in a new tab)`}>{content}</a> : <article>{content}</article>}
  </li>
}

export default function Team() {
  const [cohort, setCohort] = useState("members")
  const [query, setQuery] = useState("")
  const [discipline, setDiscipline] = useState("all")
  const [limit, setLimit] = useState(PAGE_SIZE)
  const tabRefs = useRef([])
  const searchRef = useRef(null)
  const listRef = useRef(null)
  const pendingFocus = useRef(null)
  const filtered = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase()
    const category = disciplines.find(item => item.value === discipline)
    return rosters[cohort].filter(person => category.match(person.domain) &&
      `${person.name} ${person.domain}`.toLocaleLowerCase().includes(needle))
  }, [cohort, query, discipline])
  const visible = filtered.slice(0, limit)
  const hasFilters = Boolean(query || discipline !== "all")

  useEffect(() => {
    if (pendingFocus.current === null) return
    listRef.current?.children[pendingFocus.current]?.focus()
    pendingFocus.current = null
  }, [limit])

  function changeCohort(value) {
    setCohort(value)
    setLimit(PAGE_SIZE)
  }
  function handleTabKey(event, index) {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return
    event.preventDefault()
    const next = event.key === "Home" ? 0 : event.key === "End" ? 1 : 1 - index
    changeCohort(next === 0 ? "members" : "alumni")
    tabRefs.current[next]?.focus()
  }
  function clearFilters() {
    setQuery("")
    setDiscipline("all")
    setLimit(PAGE_SIZE)
    searchRef.current?.focus()
  }

  return <>
    <PageMeta title="Our People — Club Excel" description="Meet the members, alumni, and faculty advisors behind Club Excel at NIST. Different minds. One shared future." />
    <main className={styles.page}>
      <div className={styles.pageGlow} aria-hidden="true" />
      <div className={styles.container}>
        <h1 className={styles.visuallyHidden}>Our people — Club Excel</h1>
        <section id="mentors" className={styles.mentors} aria-labelledby="mentors-title">
          <div className={styles.mentorIntro}>
            <p className={styles.sectionEyebrow}><span>01</span>THE GUIDING MINDS</p>
            <h2 id="mentors-title">A little guidance.<br/><span>Limitless possibility.</span></h2>
            <p>The faculty advisors who help us ask better questions and take the next step.</p>
          </div>
          <div className={styles.mentorGrid}>
            {advisors.map((advisor, index) => <article className={styles.mentorCard} key={advisor.name}>
              <Portrait person={advisor} className={styles.mentorPortrait} sizes="(max-width: 550px) 38vw, 180px" priority />
              <div className={styles.mentorDetails}>
                <span className={styles.mentorLabel}>FACULTY ADVISOR <span>0{index + 1}</span></span>
                <h3>{advisor.name}</h3>
                <p>{advisor.position}</p>
                <span className={styles.mentorInstitute}>NIST · CLUB EXCEL</span>
              </div>
            </article>)}
          </div>
        </section>

        <section id="collective" className={styles.directory} aria-labelledby="directory-title">
          <div className={styles.directoryHeader}>
            <div><p className={styles.sectionEyebrow}><span>02</span>THE PEOPLE, THE POSSIBILITIES</p>
              <h2 id="directory-title">Individually curious.<br/><span>Collectively unstoppable.</span></h2></div>
            <p>Developers. Designers. Problem-solvers.<br/>Find the people who make Excel, Excel.</p>
          </div>
          <div className={styles.directoryToolbar}>
            <div role="tablist" aria-label="Team directory" className={styles.tabs}>
              {["members", "alumni"].map((value, index) => <button key={value} type="button" role="tab" id={`tab-${value}`}
                aria-selected={cohort === value} aria-controls="people-panel" tabIndex={cohort === value ? 0 : -1}
                ref={element => { tabRefs.current[index] = element }} onClick={() => changeCohort(value)} onKeyDown={event => handleTabKey(event, index)}>
                {value === "members" ? "Members" : "Alumni"}<span>{rosters[value].length}</span>
              </button>)}
            </div>
            <div className={styles.directoryFilters}>
              <div className={styles.searchBox}><Search size={16} aria-hidden="true"/>
                <input ref={searchRef} type="search" aria-label="Search people by name or discipline" placeholder="Find your people..." value={query}
                  onChange={event => { setQuery(event.target.value); setLimit(PAGE_SIZE) }} />
                {query && <button type="button" aria-label="Clear search" onClick={() => { setQuery(""); setLimit(PAGE_SIZE); searchRef.current?.focus() }}><X size={15}/></button>}
              </div>
              <div className={styles.selectBox}><select aria-label="Filter by discipline" value={discipline} onChange={event => { setDiscipline(event.target.value); setLimit(PAGE_SIZE) }}>
                {disciplines.map(item => <option key={item.value} value={item.value}>{item.label}</option>)}
              </select><ChevronDown size={14} aria-hidden="true"/></div>
            </div>
          </div>
          <div className={styles.resultsBar}>
            <p role="status" aria-live="polite" aria-atomic="true">{filtered.length} {filtered.length === 1 ? "person" : "people"}{cohort === "members" ? ", one collective." : ", an enduring connection."}</p>
            {hasFilters ? <button type="button" onClick={clearFilters}>Reset filters <X size={12}/></button> : <span>{cohort === "members" ? "BUILDING WHAT COMES NEXT" : "ONCE EXCEL. ALWAYS EXCEL."}</span>}
          </div>
          <div id="people-panel" role="tabpanel" aria-labelledby={`tab-${cohort}`} tabIndex={0} className={styles.peoplePanel}>
            {visible.length ? <ul ref={listRef} className={styles.memberGrid}>
              {visible.map(person => <MemberCard key={`${cohort}-${person.img}`} person={person} cohort={cohort} index={rosters[cohort].indexOf(person)} />)}
            </ul> : <div className={styles.emptyState}><Search size={28}/><h3>No matches, yet.</h3><p>Try a different name or explore another discipline.</p><button type="button" onClick={clearFilters}>Show everyone <ArrowRight size={15}/></button></div>}
          </div>
          {visible.length > 0 && <div className={styles.directoryBottom}>
            <span role="status" aria-live="polite" aria-atomic="true">SHOWING {visible.length} OF {filtered.length}</span>
            {visible.length < filtered.length ? <button type="button" aria-controls="people-panel" onClick={() => { pendingFocus.current = limit; setLimit(current => current + PAGE_SIZE) }}>More {cohort === "members" ? "brilliant minds" : "familiar faces"}<Plus size={16}/></button> : <p>{hasFilters ? "All matching people shown." : `You've met the whole ${cohort === "members" ? "collective" : "alumni community"}.`} <Sparkles size={13}/></p>}
          </div>}
        </section>

        <section className={styles.joinSection} aria-labelledby="join-title">
          <div className={styles.joinOrbit} aria-hidden="true"><span/><span/><span/><Sparkles size={38}/></div>
          <div><p className={styles.sectionEyebrow}>THERE&apos;S ROOM FOR YOUR IDEAS</p><h2 id="join-title">Your people.<br/><span>Your next chapter.</span></h2><p>You bring the curiosity. We&apos;ll build the rest together.</p></div>
          <Link href="/club-recruitment" className={styles.joinLink}>Find your place <ArrowUpRight size={20}/></Link>
        </section>
      </div>
    </main>
  </>
}
