import React, { useEffect, useRef, useState } from "react"
import styled from "styled-components"
import { Maximize2, Minimize2, Pause, Play, RotateCcw } from "lucide-react"

const Stage = styled.div`
  position: relative;
  width: 100%;
  min-width: 0;
  aspect-ratio: 1.12 / 1;
  min-height: 440px;
  isolation: isolate;
  color: #d8d2ed;
  font-family: "Space Mono", monospace;

  &::before {
    content: ""; position: absolute; inset: 8% 0 2%; z-index: -1;
    background: radial-gradient(ellipse at 50% 52%, #6954dc25, transparent 67%);
  }
  .sentinel-viewport { position: absolute; inset: 1% -4% 14%; outline: none; cursor: grab; touch-action: pan-y; }
  .sentinel-viewport:active { cursor: grabbing; }
  .sentinel-viewport:focus-visible { outline: 1px solid #ac9cf0; outline-offset: -4px; border-radius: 16px; }
  canvas { display: block; width: 100%; height: 100%; }
  .sentinel-heading, .sentinel-caption {
    position: absolute; left: 8%; right: 8%; display: flex; align-items: center;
    justify-content: space-between; gap: 12px; pointer-events: none;
  }
  .sentinel-heading { top: 5%; font-size: 9px; letter-spacing: 2px; color: #9d94b3; }
  .sentinel-serial { color: #c3b7e8; }
  .sentinel-status { display: flex; align-items: center; gap: 7px; letter-spacing: 1.3px; }
  .sentinel-status::before { content: ""; width: 4px; height: 4px; background: #8bedde; border-radius: 50%; box-shadow: 0 0 8px #8bedde80; }
  .sentinel-caption { bottom: 13%; font-size: 8px; letter-spacing: 1.6px; color: #9187a8; }
  .sentinel-caption span:last-child { color: #b4a9cd; }
  .sentinel-controls {
    position: absolute; bottom: 3%; left: 8%; right: 8%; display: flex;
    align-items: center; justify-content: space-between; gap: 12px;
    border-top: 1px solid #c3b4f21c; padding-top: 16px;
  }
  .sentinel-tools { display: flex; gap: 8px; }
  button {
    display: inline-flex; gap: 9px; align-items: center; justify-content: center;
    border: 1px solid #c8b8ff25; border-radius: 7px; padding: 10px 13px;
    color: #bdb1d8; background: #1b1435a8; font: inherit; font-size: 10px;
    cursor: pointer; transition: border-color .2s, background .2s, color .2s;
  }
  button:hover { color: #fff; border-color: #baa5ff80; background: #342551; }
  button:focus-visible { outline: 2px solid #9ae4e2; outline-offset: 4px; }
  button[aria-pressed="true"] { border-color: #9c85e789; color: #e0d6ff; }
  button:disabled { opacity: .4; cursor: default; }
  .sentinel-tools button { padding: 10px; }
  .sentinel-loading {
    position: absolute; inset: 15% 16%; display: grid; place-items: center;
    text-align: center; pointer-events: none; font-size: 11px; color: #c4b5e5;
  }
  .sentinel-fallback { width: 75%; max-height: 300px; filter: drop-shadow(0 0 25px #8564fd44); }
  .sentinel-fallback-label { position: absolute; bottom: 3%; font-size: 10px; letter-spacing: 1px; }
  @media (max-width: 800px) {
    min-height: 400px; max-width: 540px; margin: 0 auto;
    .sentinel-viewport { inset: 0 -4% 17%; }
    .sentinel-heading, .sentinel-caption, .sentinel-controls { left: 5%; right: 5%; }
    .sentinel-heading { top: 3%; font-size: 8px; }
    .sentinel-caption { font-size: 7px; bottom: 17%; }
    .sentinel-controls { bottom: 1%; padding-top: 12px; }
    button { min-height: 44px; }
    .sentinel-tools button { min-width: 44px; }
  }
`

function StaticSentinel() {
  return (
    <svg className="sentinel-fallback" viewBox="0 0 260 310" role="img" aria-label="Excel Sentinel shield">
      <defs>
        <linearGradient id="sentinel-metal" x2="1" y2="1"><stop stopColor="#e2e7fb"/><stop offset=".48" stopColor="#665d91"/><stop offset="1" stopColor="#bbb2e6"/></linearGradient>
        <linearGradient id="sentinel-core" x2="1" y2="1"><stop stopColor="#6cead6"/><stop offset="1" stopColor="#9876fd"/></linearGradient>
      </defs>
      <path d="M23 36 62 17h136l39 19v129c0 58-61 101-107 127C84 266 23 223 23 165Z" fill="#1e183c" stroke="url(#sentinel-metal)" strokeWidth="10"/>
      <path d="M37 44 66 31h128l29 13v120c0 46-48 85-93 112-45-27-93-66-93-112Z" fill="none" stroke="url(#sentinel-core)" strokeWidth="2"/>
      <path d="m83 213 1-50-17-30 8-44 39-27 45 6 24 28 1 30 20 27-17 6-2 27-35 5-2 22Z" fill="url(#sentinel-metal)"/>
      <circle cx="111" cy="115" r="30" fill="#171127" stroke="#9b8bd7" strokeWidth="9"/>
      <circle cx="111" cy="115" r="19" fill="none" stroke="url(#sentinel-core)" strokeWidth="4"/>
      <path d="m105 107-8 8 8 8m12-16 8 8-8 8" fill="none" stroke="#a7ffed" strokeWidth="3"/>
    </svg>
  )
}

export default function RightHero() {
  const host = useRef(null)
  const scene = useRef(null)
  const [status, setStatus] = useState("loading")
  const [exploded, setExploded] = useState(false)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    let cancelled = false
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)")
    setPaused(reducedMotion.matches)
    import("./createExcelScene").then(({ createExcelScene }) => {
      if (cancelled || !host.current) return
      try {
        scene.current = createExcelScene(host.current, {
          paused: reducedMotion.matches,
          onError: () => {
            scene.current?.dispose()
            scene.current = null
            setStatus("fallback")
          },
        })
        setStatus("ready")
      } catch (error) {
        console.warn("The interactive emblem is unavailable; showing the static shield.", error)
        setStatus("fallback")
      }
    }).catch(() => { if (!cancelled) setStatus("fallback") })
    const updateMotion = (event) => {
      setPaused(event.matches)
      scene.current?.setPaused(event.matches)
    }
    reducedMotion.addEventListener("change", updateMotion)
    return () => {
      cancelled = true
      reducedMotion.removeEventListener("change", updateMotion)
      scene.current?.dispose()
      scene.current = null
    }
  }, [])

  const toggleLayers = () => {
    scene.current?.setExploded(!exploded)
    setExploded(!exploded)
  }
  const toggleMotion = () => {
    scene.current?.setPaused(!paused)
    setPaused(!paused)
  }

  return (
    <Stage aria-label="Excel Sentinel interactive 3D emblem">
      <div ref={host} className="sentinel-viewport" tabIndex={status === "ready" ? 0 : -1}
        role="img" aria-label="A floating titanium shield with a luminous mechanical intelligence core. Drag or use arrow keys to rotate; press Home to reset." />
      <div className="sentinel-heading" aria-hidden="true">
        <span className="sentinel-serial">EXCEL / SENTINEL — 01</span>
        <span className="sentinel-status">{status === "fallback" ? "STANDBY" : "CORE ONLINE"}</span>
      </div>
      {status !== "ready" && <div className="sentinel-loading" role="status">
        <StaticSentinel />
        <span className="sentinel-fallback-label">{status === "loading" ? "INITIALIZING SENTINEL" : "EXCEL SENTINEL"}</span>
      </div>}
      <div className="sentinel-caption" aria-hidden="true">
        <span>IDEAS, ENGINEERED.</span><span>{status === "ready" ? "DRAG TO EXPLORE ↗" : "BUILT FOR THE FUTURE"}</span>
      </div>
      <div className="sentinel-controls">
        <button type="button" onClick={toggleLayers} aria-pressed={exploded} disabled={status !== "ready"}>
          {exploded ? <Minimize2 size={13} /> : <Maximize2 size={13} />}{exploded ? "Assemble shield" : "Explore core"}
        </button>
        <div className="sentinel-tools">
          <button type="button" aria-label="Reset shield rotation" title="Reset view" onClick={() => scene.current?.reset()} disabled={status !== "ready"}><RotateCcw size={13} /></button>
          <button type="button" aria-label={paused ? "Play shield animation" : "Pause shield animation"} title={paused ? "Play motion" : "Pause motion"} onClick={toggleMotion} disabled={status !== "ready"}>
            {paused ? <Play size={13} /> : <Pause size={13} />}
          </button>
        </div>
      </div>
    </Stage>
  )
}
