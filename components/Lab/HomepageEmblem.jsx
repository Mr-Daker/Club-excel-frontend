import Image from "next/image"
import { useEffect, useRef, useState } from "react"
import styles from "@/styles/HomepageEmblem.module.css"

// Reuse the homepage's actual model, materials, orbitals and interaction.
export default function HomepageEmblem({ motionPaused = false, expanded = false }) {
  const host = useRef(null)
  const scene = useRef(null)
  const settings = useRef({ motionPaused, expanded })
  const [ready, setReady] = useState(false)
  settings.current = { motionPaused, expanded }

  useEffect(() => {
    let cancelled = false
    import("@/components/Hero/createExcelScene").then(({ createExcelScene }) => {
      if (cancelled || !host.current) return
      try {
        scene.current = createExcelScene(host.current, {
          paused: settings.current.motionPaused,
          onError: () => {
            scene.current?.dispose()
            scene.current = null
            if (!cancelled) setReady(false)
          },
        })
        scene.current.setExploded(settings.current.expanded)
        setReady(true)
      } catch {
        if (!cancelled) setReady(false)
      }
    }).catch(() => { if (!cancelled) setReady(false) })
    return () => {
      cancelled = true
      scene.current?.dispose()
      scene.current = null
    }
  }, [])

  useEffect(() => { scene.current?.setPaused(motionPaused) }, [motionPaused])
  useEffect(() => { scene.current?.setExploded(expanded) }, [expanded])

  return <div className={styles.stage}>
    <div ref={host} className={`${styles.canvasHost} ${styles.interactive}`} tabIndex={ready ? 0 : -1}
      role="img" aria-label="The homepage’s Excel Sentinel: a floating titanium shield, luminous gear, orbiting satellites and pedestal. Drag or use arrow keys to rotate. Press Home to reset the view." />
    {!ready && <div className={styles.fallbackHost}>
      <Image className={styles.homeFallback} src="/clubexcellogo.png" alt="Club Excel" width={1280} height={1280} priority />
    </div>}
  </div>
}
