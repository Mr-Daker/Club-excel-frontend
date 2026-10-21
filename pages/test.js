import Head from "next/head"
import Link from "next/link"
import Image from "next/image"
import { useEffect, useRef, useState } from "react"
import { ArrowDown, ArrowRight, ArrowUpRight, Asterisk, Check, ChevronRight, Code2, GitBranch, Layers3, Menu, Pause, Play, Terminal, X } from "lucide-react"
import HomepageEmblem from "@/components/Lab/HomepageEmblem"
import BinaryField from "@/components/Lab/BinaryField"
import pageStyles from "@/styles/Lab.module.css"
import heroStyles from "@/styles/LabHero.module.css"

const styles = { ...pageStyles, ...heroStyles }

const workspaces = [
  { id: "web", file: "create.tsx", language: "TypeScript React", tag: "01 / WEB & MOBILE", title: "From a blank file\nto your next big thing.", description: "Interfaces, apps, and the ideas behind them. Turn the things you wish existed into things people can use.", output: "An idea, brought to life.", color: "violet" },
  { id: "ai", file: "discover.py", language: "Python", tag: "02 / AI & MACHINE LEARNING", title: "Follow the data.\nFind the unexpected.", description: "Ask better questions. Explore patterns, train your intuition, and experiment with what intelligent systems can do.", output: "Curiosity finds a pattern.", color: "mint" },
  { id: "chain", file: "connect.sol", language: "Solidity", tag: "03 / BLOCKCHAIN", title: "Think in systems.\nBuild new connections.", description: "Explore the ideas behind decentralized networks, smart contracts, and a more connected digital world.", output: "Every connection matters.", color: "pink" },
]

function CodeLines({ active }) {
  if (active === "ai") return <>
    <span><i># Start with a question.</i></span><span><em>from</em> curiosity <em>import</em> possibility</span><span>&nbsp;</span><span>mind = <b>Model</b>(</span><span>    learning_rate=<strong>{'"always"'}</strong>,</span><span>    limits=<em>None</em></span><span>)</span><span>&nbsp;</span><span><em>for</em> idea <em>in</em> imagination:</span><span>    mind.<b>explore</b>(idea)</span><span>    mind.<b>learn</b>()</span><span>&nbsp;</span><span><b>print</b>(<strong>{'"What if? → What\'s next."'}</strong>)</span>
  </>
  if (active === "chain") return <>
    <span><i>{'// Built on shared possibility.'}</i></span><span><em>contract</em> <b>Collective</b> {'{'}</span><span>  <em>bool public</em> together = <em>true</em>;</span><span>&nbsp;</span><span>  <em>function</em> <b>connect</b>() <em>public</em> {'{'}</span><span>    ideas.<b>share</b>();</span><span>    trust.<b>build</b>();</span><span>    possibility.<b>expand</b>();</span><span>  {'}'}</span><span>&nbsp;</span><span>  <i>{'// The next block is yours.'}</i></span><span>{'}'}</span><span>&nbsp;</span>
  </>
  return <>
    <span><i>{'// A little curiosity goes a long way.'}</i></span><span><em>import</em> {'{'} ideas {'}'} <em>from</em> <strong>{'"you"'}</strong>;</span><span>&nbsp;</span><span><em>const</em> future = <b>create</b>({'{'}</span><span>  curiosity: <strong>{'"unlimited"'}</strong>,</span><span>  people: <strong>{'"your kind of people"'}</strong>,</span><span>  possibilities: <em>Infinity</em></span><span>{'}'});</span><span>&nbsp;</span><span>future.<b>learn</b>();</span><span>future.<b>build</b>(ideas);</span><span>future.<b>repeat</b>();</span><span><i>{"// Hello, what's next."}</i></span>
  </>
}

function WorkspaceVisual({ active }) {
  return <div className={styles.outputArt} aria-hidden="true">
    <div className={styles.outputGrid} />
    {active === "web" ? <div className={styles.miniBrowser}><div><i /><i /><i /><span>your-next-idea.dev</span></div><section><span>HELLO, WORLD.</span><strong>Made of<br />possibility<span>↗</span></strong><i /><i /><span className={styles.miniCta}>Let’s build <ArrowRight size={10} /></span></section></div>
      : active === "ai" ? <div className={styles.neuralArt}><svg viewBox="0 0 320 220"><g>{[0,1,2,3].flatMap(a=>[0,1,2,3,4].map(b=><path key={`a${a}${b}`} d={`M65 ${40+a*46} L160 ${22+b*44}`} />))}{[0,1,2,3,4].flatMap(a=>[0,1,2].map(b=><path key={`b${a}${b}`} d={`M160 ${22+a*44} L260 ${63+b*47}`} />))}</g>{[0,1,2,3].map(n=><circle key={`i${n}`} cx="65" cy={40+n*46} r="7" />)}{[0,1,2,3,4].map(n=><circle key={`m${n}`} cx="160" cy={22+n*44} r="9" />)}{[0,1,2].map(n=><circle key={`o${n}`} cx="260" cy={63+n*47} r="7" />)}</svg><span>INPUT → DISCOVERY → POSSIBILITY</span></div>
        : <div className={styles.chainArt}><div><Layers3 /><span>01</span></div><i /><div><Layers3 /><span>02</span></div><i /><div><Layers3 /><span>03</span></div></div>}
    <span className={styles.outputCoordinate}>X: IDEAS / Y: POSSIBILITY</span>
  </div>
}

export default function TestLanding() {
  const pageRef = useRef(null)
  const trackRef = useRef(null)
  const sceneTrackRef = useRef(null)
  const scenePinRef = useRef(null)
  const progressRef = useRef(0)
  const [menuOpen, setMenuOpen] = useState(false)
  const [manualPaused, setManualPaused] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)
  const [heroPhase, setHeroPhase] = useState(false)
  const [compactLayout, setCompactLayout] = useState(false)
  const [activeWorkspace, setActiveWorkspace] = useState(0)
  const motionPaused = manualPaused || reducedMotion
  const selected = workspaces[activeWorkspace]
  const secondHeroVisible = heroPhase && !compactLayout

  useEffect(() => {
    // The site's overflow-x:hidden creates a non-scrolling ancestor for sticky.
    // Keep this route's cinematic stage tied to the document scroll container.
    const roots = [document.documentElement, document.body]
    const previous = roots.map(element => element.style.overflowX)
    roots.forEach(element => { element.style.overflowX = "clip" })
    return () => roots.forEach((element, index) => { element.style.overflowX = previous[index] })
  }, [])

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)")
    const change = () => setReducedMotion(media.matches)
    change()
    media.addEventListener("change", change)
    return () => media.removeEventListener("change", change)
  }, [])

  useEffect(() => {
    const media = window.matchMedia("(max-width: 700px)")
    const change = () => setCompactLayout(media.matches)
    change()
    media.addEventListener("change", change)
    return () => media.removeEventListener("change", change)
  }, [])

  useEffect(() => {
    const page = pageRef.current
    const track = compactLayout ? sceneTrackRef.current : trackRef.current
    if (!page || !track) return
    let frame = 0
    let previousPhase = null
    const parallaxItems = [...page.querySelectorAll("[data-parallax]")]
    const clamp = value => Math.min(1, Math.max(0, value))
    const update = () => {
      frame = 0
      const bounds = track.getBoundingClientRect()
      const pin = compactLayout ? scenePinRef.current : track.firstElementChild
      const pinStyle = getComputedStyle(pin)
      const stickyHeight = pin.offsetHeight
      const stickyTop = compactLayout ? parseFloat(pinStyle.top) || 0 : 0
      const travel = pinStyle.position === "sticky" ? track.offsetHeight - stickyHeight : 0
      const progress = reducedMotion || travel <= 1 ? 0 : motionPaused ? progressRef.current : clamp((stickyTop - bounds.top) / travel)
      progressRef.current = progress
      page.style.setProperty("--hero-progress", progress.toFixed(4))
      if (!motionPaused || reducedMotion) page.style.setProperty("--scroll-shift", `${reducedMotion ? 0 : Math.min(window.scrollY, innerHeight * 2)}px`)
      page.style.setProperty("--intro-opacity", (1 - clamp((progress - .14) / .27)).toFixed(3))
      page.style.setProperty("--outro-opacity", clamp((progress - .38) / .16).toFixed(3))
      page.style.setProperty("--intro-y", `${-progress * 100}px`)
      page.style.setProperty("--outro-y", `${(1 - clamp((progress - .38) / .16)) * 35}px`)
      const nextPhase = progress > .4
      if (nextPhase !== previousPhase) { previousPhase = nextPhase; setHeroPhase(nextPhase) }
      parallaxItems.forEach(item => {
        const viewProgress = clamp((innerHeight - item.getBoundingClientRect().top) / (innerHeight * 1.5)) - .5
        if (!motionPaused || reducedMotion) item.style.setProperty("--parallax", `${reducedMotion ? 0 : viewProgress * Number(item.dataset.parallax)}px`)
      })
    }
    const queue = () => { if (!frame) frame = requestAnimationFrame(update) }
    update()
    window.addEventListener("scroll", queue, { passive: true })
    window.addEventListener("resize", queue)
    return () => { cancelAnimationFrame(frame); window.removeEventListener("scroll", queue); window.removeEventListener("resize", queue) }
  }, [motionPaused, reducedMotion, compactLayout])

  function workspaceKey(event) {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return
    event.preventDefault()
    const next = event.key === "Home" ? 0 : event.key === "End" ? 2 : (activeWorkspace + (event.key === "ArrowRight" ? 1 : 2)) % 3
    setActiveWorkspace(next)
    document.getElementById(`workspace-tab-${next}`)?.focus()
  }

  return <div ref={pageRef} className={styles.page} data-motion={motionPaused ? "paused" : "active"}>
    <Head><title>Club Excel — Beyond the ordinary.</title><meta name="description" content="A community of curious minds at NIST. Code, experiment, and build what comes next with Club Excel." /><meta name="robots" content="noindex, nofollow" /></Head>
    <a className={styles.skipLink} href="#playground">Skip to explore</a>
    <header className={styles.header}>
      <Link className={styles.brand} href="/test" aria-label="Club Excel test landing"><svg className={styles.brandMark} width="30" height="36" viewBox="0 0 40 46" fill="none" aria-hidden="true"><path d="m4 6 5-3h22l5 3v17c0 9-9 16-16 20C13 39 4 32 4 23Z" fill="#21192d" stroke="#b8a4d2" strokeWidth="1.5"/><path d="m7 8 3-2h20l3 2v15c0 7-7 13-13 17C14 36 7 30 7 23Z" stroke="#b8f2cd" strokeOpacity=".5" strokeWidth=".6"/><path d="m15 16-5 6 5 6m10-12 5 6-5 6m-3-14-4 16" stroke="#d5c7e8" strokeWidth="1.6" strokeLinecap="square"/></svg><span>club<span>excel</span><i>*</i></span></Link>
      <nav className={`${styles.navigation} ${menuOpen ? styles.menuOpen : ""}`} aria-label="Main navigation" id="lab-navigation" onKeyDown={event => { if(event.key === "Escape") {setMenuOpen(false); document.getElementById("lab-menu-toggle")?.focus()} }}>
        <a href="#philosophy" onClick={()=>setMenuOpen(false)}>The mindset<span>01</span></a><a href="#playground" onClick={()=>setMenuOpen(false)}>The playground<span>02</span></a><Link href="/team">The people<span>03</span></Link>
      </nav>
      <Link className={styles.navJoin} href="/club-recruitment">Join the club <ArrowUpRight size={14} /></Link>
      <button className={styles.menuButton} id="lab-menu-toggle" aria-controls="lab-navigation" aria-expanded={menuOpen} aria-label={menuOpen ? "Close navigation" : "Open navigation"} onClick={()=>setMenuOpen(!menuOpen)} onKeyDown={event=>{if(event.key === "Escape")setMenuOpen(false)}}>{menuOpen ? <X size={22} /> : <Menu size={22} />}</button>
    </header>

    <main>
      <section className={styles.scrollTrack} ref={trackRef} aria-labelledby="lab-hero-title">
        <div className={styles.heroSticky}>
          <BinaryField motionPaused={motionPaused} />
          <div className={styles.heroGrid} aria-hidden="true" />
          <div className={styles.heroCorner} aria-hidden="true">EX / 001<span>COMPILED FROM CURIOSITY</span></div>
          <div className={styles.heroContent}>
            <div className={styles.heroBefore} aria-hidden={secondHeroVisible}>
              <p className={styles.eyebrow}><span className={styles.statusDot} /> A COLLECTIVE OF CURIOUS MINDS</p>
              <h1 id="lab-hero-title"><span className={styles.headlineWord}>Think.</span>{" "}<span className={styles.headlineWord}>Build.</span>{" "}<span className={styles.headlineAccent}>Go beyond<span className={styles.fullStop}>.</span></span></h1>
              <p className={styles.heroDescription}>We turn “what if” into what’s next.<br />A community for people who love to build.</p>
              <div className={styles.heroActions}><Link tabIndex={secondHeroVisible ? -1 : undefined} className={styles.primaryLink} href="/club-recruitment">Find your people <ArrowUpRight size={18} /></Link><a tabIndex={secondHeroVisible ? -1 : undefined} className={styles.secondaryLink} href="#playground"><Code2 size={16} /> Explore the possibilities</a></div>
            </div>
            <div className={styles.heroAfter} aria-hidden={!secondHeroVisible}>
              <p className={styles.eyebrow}><span className={styles.statusDot} /> THERE’S MORE BENEATH THE SURFACE.</p>
              <h2>Curiosity.<br />Engineered<br /><span>layer by layer.</span></h2>
              <p className={styles.heroDescription}>Look a little closer. Follow every connection.<br />Great ideas are built from the inside out.</p>
              <a href="#playground" tabIndex={secondHeroVisible ? undefined : -1} className={styles.primaryLink}>Enter the playground <ArrowDown size={17} /></a>
            </div>
          </div>
          <div ref={sceneTrackRef} className={styles.sceneTrack} id="sentinel-stage">
          <div ref={scenePinRef} className={styles.scenePin}>
          <div className={styles.emblemStage}>
            <span className={styles.emblemTop} aria-hidden="true"><i /> EXCEL / SENTINEL — 01</span>
            <HomepageEmblem motionPaused={motionPaused} expanded={heroPhase} />
            <span className={styles.emblemBottom} aria-hidden="true">{heroPhase ? "EXPLORE THE CORE" : "IDEAS, ENGINEERED. / DRAG TO EXPLORE"}<span>↗</span></span>
            <div className={styles.emblemCoordinates} aria-hidden="true">01000101<br />01011000<br /><span>CORE_01</span></div>
          </div>
          <div className={styles.heroFooter}>
            <a href="#philosophy" className={styles.scrollPrompt} onClick={event => {
              const track = compactLayout ? sceneTrackRef.current : trackRef.current
              const pin = compactLayout ? scenePinRef.current : track.firstElementChild
              const pinStyle = getComputedStyle(pin)
              const offset = compactLayout ? parseFloat(pinStyle.top) || 0 : 0
              const travel = pinStyle.position === "sticky" ? track.offsetHeight - pin.offsetHeight : 0
              if (!motionPaused && progressRef.current < .7 && travel > 1) {
                event.preventDefault()
                window.scrollTo({ top: window.scrollY + track.getBoundingClientRect().top - offset + travel * .7, behavior: "smooth" })
              }
            }}><span><ArrowDown size={16} /></span>{motionPaused ? "EXPLORE BELOW" : "SCROLL TO LOOK INSIDE"}</a>
            <div className={styles.heroTerminal} aria-hidden="true"><span>~/club-excel</span><ChevronRight size={12} /><b>build something that matters</b><i /></div>
            <button type="button" className={styles.motionButton} aria-label={motionPaused ? "Resume page animations" : "Pause page animations"} aria-pressed={motionPaused} disabled={reducedMotion} onClick={()=>setManualPaused(!manualPaused)}>{motionPaused ? <Play size={12} /> : <Pause size={12} />}<span>{motionPaused ? "MOTION OFF" : "MOTION ON"}</span></button>
          </div>
          <div className={styles.scrollProgress} aria-hidden="true"><span /></div>
          </div>
          </div>
        </div>
      </section>

      <div className={styles.languageStrip} aria-label="Create with code"><span>ONE MINDSET. MANY LANGUAGES.</span><div>{["<React />", "Python", "{ JavaScript }", "Solidity", "Flutter", "C++"].map(name=><span key={name}>{name}<Asterisk size={13} aria-hidden="true" /></span>)}</div></div>

      <section className={`${styles.philosophy} ${styles.section}`} id="philosophy" aria-labelledby="philosophy-title">
        <div className={styles.sectionLabel}><span>01 — THE MINDSET</span><span>{'{'} CURIOSITY IS THE SOURCE CODE {'}'}</span></div>
        <div className={styles.manifestoGrid}>
          <div className={styles.manifestoSymbol} data-parallax="-70" aria-hidden="true"><span>{'{'}</span><Asterisk strokeWidth={.6} /><span>{'}'}</span><i>MORE THAN THE SUM OF OUR PARTS.</i></div>
          <div><h2 id="philosophy-title">We’re not here to<br />follow the script.<br /><span>We’re here to write it.</span></h2><div className={styles.manifestoCopy}><p>Club Excel is where NIST’s curious minds come together to learn, experiment, and create. From your first line of code to the idea that keeps you up at night.</p><p>Bring the questions. Bring the unfinished projects.<br /><strong>There’s a place for you here.</strong></p></div><Link href="/team" className={styles.textLink}>Meet the collective <ArrowUpRight size={17} /></Link></div>
        </div>
      </section>

      <section className={`${styles.playground} ${styles.section}`} id="playground" aria-labelledby="playground-title">
        <div className={styles.sectionLabel}><span>02 — THE PLAYGROUND</span><span>YOUR CURIOSITY. YOUR DIRECTION.</span></div>
        <div className={styles.playgroundHeader}><h2 id="playground-title">Pick a rabbit hole<span>.</span></h2><p>There’s more than one way to build the future.<br />Find the thing that makes you lose track of time.</p></div>
        <div className={styles.workspace}>
          <div className={styles.workspaceTitle}><span className={styles.windowDots} aria-hidden="true"><i /><i /><i /></span><span><Terminal size={12} /> excel / possibility-lab</span><span className={styles.workspaceBranch}><GitBranch size={12} /> your-next-chapter</span></div>
          <div className={styles.workspaceTabs} role="tablist" aria-label="Explore coding domains" onKeyDown={workspaceKey}>{workspaces.map((item,index)=><button key={item.id} type="button" id={`workspace-tab-${index}`} role="tab" aria-selected={activeWorkspace===index} aria-controls="workspace-panel" tabIndex={activeWorkspace===index?0:-1} onClick={()=>setActiveWorkspace(index)}><span className={styles[`fileIcon${index}`]}>{index===0?"TS":index===1?"PY":"<>"}</span>{item.file}<span className={styles.tabDot} /></button>)}<span className={styles.editorNote}>A LITTLE CODE. A LOT OF POSSIBILITY.</span></div>
          <div id="workspace-panel" role="tabpanel" tabIndex={0} aria-labelledby={`workspace-tab-${activeWorkspace}`} className={styles.workspacePanel}>
            <div className={styles.codePane}><div className={styles.codeBreadcrumb}>the-playground <ChevronRight size={10} /> {selected.file}</div><div className={styles.codeContent}><div className={styles.lineNumbers} aria-hidden="true">{Array.from({length:13},(_,i)=><span key={i}>{i+1}</span>)}</div><pre aria-label={`${selected.language} inspired illustration`}><code><CodeLines active={selected.id} /></code></pre></div><div className={styles.codeComment}><span><Check size={11} /> No limits found.</span><span>UTF-8</span></div></div>
            <div className={styles.previewPane}><div className={styles.previewTitle}><span><span className={styles.statusDot} /> IDEA PREVIEW</span><ArrowUpRight size={13} /></div><WorkspaceVisual active={selected.id}/><div className={styles.outputMessage}><span>↳</span>{selected.output}</div></div>
          </div>
          <div className={styles.workspaceStatus}><span><GitBranch size={11} /> main* <span>↑ ∞ possibilities</span></span><span>{selected.language}<Check size={11} /></span></div>
        </div>
        <div className={styles.domainDescription}><p>{selected.tag}</p><h3>{selected.title}</h3><div><p>{selected.description}</p><Link href="/club-recruitment" className={styles.textLink}>Find your starting point <ArrowUpRight size={15} /></Link></div></div>
      </section>

      <section className={styles.community} aria-labelledby="community-title">
        <div className={styles.communityBackdrop} aria-hidden="true">TOGETHER.</div>
        <div className={styles.section}>
          <div className={styles.sectionLabel}><span>03 — THE HUMAN CONNECTION</span><span>OFFLINE FRIENDSHIPS. UNLIMITED POSSIBILITIES.</span></div>
          <div className={styles.communityHeading}><h2 id="community-title">Good code.<br /><span>Even better company.</span></h2><div><p>The best part isn’t what we build.<br />It’s who we build it with.</p><Link href="/team" className={styles.textLink}>These are our people <ArrowUpRight size={17}/></Link></div></div>
          <div className={styles.photoGrid}>
            <figure data-parallax="-50"><div className={styles.photoFrame}><Image src="/club excel image.jpg" alt="Club Excel members coding together at a NIST workshop" fill sizes="(max-width:700px) 92vw, 58vw" /><span className={styles.photoTag}><span className={styles.statusDot}/> IDEAS IN PROGRESS</span></div><figcaption><span>01 / BUILD SESSIONS</span><span>Better, together. ↗</span></figcaption></figure>
            <figure className={styles.peoplePhoto} data-parallax="60"><div className={styles.photoFrame}><Image src="/p36.jpg" alt="Members of the Club Excel community spending time together" fill sizes="(max-width:700px) 75vw, 33vw"/><span className={styles.photoTag}>THE PEOPLE BEHIND THE PIXELS</span></div><figcaption><span>02 / THE COLLECTIVE</span><span>Life beyond the screen.</span></figcaption></figure>
          </div>
          <div className={styles.communityNote}><span><GitBranch size={16}/> Different paths. One shared curiosity.</span><Link href="/sankalp">Explore Sankalp <ArrowUpRight size={15}/></Link></div>
        </div>
      </section>

      <section className={styles.joinSection} aria-labelledby="join-title">
        <div className={styles.joinCircuit} aria-hidden="true"><i/><i/><i/><i/><Code2 strokeWidth={.6}/></div>
        <p className={styles.eyebrow}>YOUR NEXT CHAPTER IS WAITING<span className={styles.statusDot}/></p>
        <h2 id="join-title">Hello,<br /><span>what’s next<span className={styles.cursor}>_</span></span></h2>
        <p>You don’t need to have it all figured out.<br />Just bring your curiosity. We’ll take it from there.</p>
        <Link href="/club-recruitment" className={styles.joinButton}>Let’s build something <ArrowUpRight size={21}/></Link>
        <span className={styles.joinComment}>{'// THE FUTURE IS A WORK IN PROGRESS. SO ARE WE.'}</span>
      </section>
    </main>
    <footer className={styles.footer}><Link href="/test" className={styles.footerWordmark}>clubexcel<span>*</span></Link><div><p>A little curiosity. A lot of possibility.</p><span>NIST, BERHAMPUR · BUILT TOGETHER.</span></div><nav aria-label="Footer navigation"><Link href="/team">People <ArrowUpRight size={12}/></Link><Link href="/contact">Say hello <ArrowUpRight size={12}/></Link><a href="#top" onClick={event=>{event.preventDefault();window.scrollTo({top:0,behavior:motionPaused?"instant":"smooth"})}}>Back to top <ArrowUpRight size={12}/></a></nav><div className={styles.footerBottom}><span>© {new Date().getFullYear()} CLUB EXCEL</span><span>MADE OF CODE. POWERED BY PEOPLE.</span><span><span className={styles.statusDot}/> ALWAYS CURIOUS</span></div></footer>
  </div>
}

TestLanding.standaloneLayout = true
TestLanding.skipIntro = true
