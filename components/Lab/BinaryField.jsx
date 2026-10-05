import styles from "@/styles/BinaryField.module.css"

const binaryColumns = [
  "01 10\n00 11\n10 01\n01 00\n11 01\n00 10\n10 11\n01 01\n00 10\n11 00\n10 01\n01 11\n10 00\n00 01\n11 10\n01 00\n10 11\n00 10",
  "10\n01\n11\n00\n10\n00\n01\n10\n11\n01\n00\n11\n10\n01\n11\n00\n01\n10\n00\n11\n10\n01",
  "00\n11\n01\n10\n00\n01\n11\n10\n01\n00\n10\n11\n00\n10\n01\n11\n10\n00\n11\n01\n00\n10",
  "10 01\n01 11\n00 10\n11 00\n01 10\n10 11\n00 01\n11 10\n01 00\n10 01\n00 11\n11 01\n10 00\n01 10\n00 01\n11 10\n01 11\n10 00",
]

const circuitPaths = [
  "M0 190H68L103 225V351L143 391H205",
  "M0 710H77L115 672V551L164 502H211",
  "M1440 280H1375L1339 316V423L1298 464H1246",
  "M1440 831H1367L1328 792V674L1292 638H1236",
]

/** Decorative, deterministic layers driven by an ancestor's --scroll-shift. */
export default function BinaryField({ motionPaused = false }) {
  return (
    <div className={styles.field} aria-hidden="true" data-motion-paused={motionPaused}>
      <div className={styles.grid} />

      <svg className={`${styles.crosshairs} ${styles.parallax}`} viewBox="0 0 1440 1000" preserveAspectRatio="none" focusable="false">
        <path d="M164 128h12m-6-6v12M1238 119h12m-6-6v12M234 793h12m-6-6v12M1169 869h12m-6-6v12M80 466h8m-4-4v8M1352 574h8m-4-4v8" />
        <circle cx="171" cy="129" r="19" />
        <circle cx="1175" cy="869" r="19" />
      </svg>

      {binaryColumns.map((column, index) => (
        <pre key={index} className={`${styles.column} ${styles[`column${index + 1}`]} ${styles.parallax}`}>{column}</pre>
      ))}

      <svg className={`${styles.circuits} ${styles.parallax}`} viewBox="0 0 1440 1000" preserveAspectRatio="none" focusable="false">
        {circuitPaths.map((path, index) => (
          <g key={path}>
            <path className={styles.trace} d={path} />
            <path className={styles.signal} d={path} style={{ animationDelay: `${index * -4.7}s` }} />
          </g>
        ))}
        <g className={styles.nodes}>
          <circle cx="205" cy="391" r="3" /><circle cx="211" cy="502" r="3" />
          <circle cx="1246" cy="464" r="3" /><circle cx="1236" cy="638" r="3" />
        </g>
      </svg>

      <div className={`${styles.fragments} ${styles.parallax}`}>
        <pre className={styles.fragmentOne}><span>{"// OPEN POSSIBILITIES"}</span>{"\n01  /  explore.create.repeat"}</pre>
        <pre className={styles.fragmentTwo}>{"const next = "}<span>{"build(together);"}</span>{"\n    [ 0101 : 1010 ]"}</pre>
        <pre className={styles.fragmentThree}>{"<curiosity>"}<span>{"  1  "}</span>{"</curiosity>"}</pre>
      </div>
    </div>
  )
}
