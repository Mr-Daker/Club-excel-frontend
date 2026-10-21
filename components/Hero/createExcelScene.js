import * as THREE from "three"
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js"

// The complete emblem is procedural geometry: no image planes or external models.
const TAU = Math.PI * 2

function shieldPath(scale = 1, PathType = THREE.Shape) {
  const s = new PathType()
  s.moveTo(-1.31 * scale, 1.35 * scale)
  s.lineTo(-.93 * scale, 1.55 * scale)
  s.lineTo(.93 * scale, 1.55 * scale)
  s.lineTo(1.31 * scale, 1.35 * scale)
  s.lineTo(1.31 * scale, -.16 * scale)
  s.bezierCurveTo(1.31 * scale, -.91 * scale, .48 * scale, -1.49 * scale, 0, -1.76 * scale)
  s.bezierCurveTo(-.48 * scale, -1.49 * scale, -1.31 * scale, -.91 * scale, -1.31 * scale, -.16 * scale)
  s.closePath()
  return s
}

function headShape() {
  const s = new THREE.Shape()
  s.moveTo(-.55, -.91)
  s.lineTo(.3, -.91)
  s.lineTo(.3, -.52)
  s.lineTo(.59, -.52)
  s.quadraticCurveTo(.73, -.5, .73, -.36)
  s.lineTo(.73, -.21)
  s.lineTo(.93, -.16)
  s.lineTo(.68, .19)
  s.lineTo(.65, .59)
  s.lineTo(.42, .91)
  s.lineTo(-.1, 1.01)
  s.lineTo(-.52, .8)
  s.lineTo(-.74, .43)
  s.lineTo(-.71, .04)
  s.lineTo(-.5, -.36)
  s.closePath()
  const hole = new THREE.Path()
  hole.absarc(-.23, .41, .43, 0, TAU, true)
  s.holes.push(hole)
  return s
}

function gearShape() {
  const shape = new THREE.Shape()
  for (let i = 0; i < 72; i++) {
    const angle = i / 72 * TAU
    const radius = i % 6 === 0 || i % 6 === 5 ? .365 : .43
    const x = Math.cos(angle) * radius
    const y = Math.sin(angle) * radius
    if (i === 0) shape.moveTo(x, y)
    else shape.lineTo(x, y)
  }
  shape.closePath()
  const hole = new THREE.Path()
  hole.absarc(0, 0, .258, 0, TAU, true)
  shape.holes.push(hole)
  return shape
}

export function createExcelScene(host, { paused: initialPaused = false, onError }) {
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "low-power" })
  const scene = new THREE.Scene()
  const ownedMaterials = []
  const ownedTextures = []
  const environmentResources = new Set()
  const releaseResources = () => {
    const geometries = new Set()
    scene.traverse(child => { if (child.geometry) geometries.add(child.geometry) })
    geometries.forEach(geometry => geometry.dispose())
    ownedMaterials.forEach(mat => mat.dispose())
    ownedTextures.forEach(texture => texture.dispose())
    environmentResources.forEach(resource => resource.dispose())
    renderer.dispose()
    renderer.forceContextLoss()
    renderer.domElement.remove()
  }
  try {
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75))
    renderer.setClearColor(0x000000, 0)
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = .95
    renderer.domElement.setAttribute("aria-hidden", "true")
    const camera = new THREE.PerspectiveCamera(36, 1, .1, 50)
    camera.position.set(0, .35, 8.3)
    camera.lookAt(0, -.08, 0)
    const pmrem = new THREE.PMREMGenerator(renderer)
    environmentResources.add(pmrem)
    const room = new RoomEnvironment()
    environmentResources.add(room)
    const environment = pmrem.fromScene(room, .04)
    environmentResources.add(environment)
    scene.environment = environment.texture
    room.dispose()
    environmentResources.delete(room)
    pmrem.dispose()
    environmentResources.delete(pmrem)

    const material = (color, metalness = .8, roughness = .28, extra = {}) =>
      new THREE.MeshStandardMaterial({ color, metalness, roughness, ...extra })
    const titanium = material(0xa8b3d6, .92, .22)
    const edgeMetal = material(0x4b466e, .88, .26)
    const graphite = material(0x141426, .78, .33)
    const inlay = material(0x211f48, .7, .26)
    const ceramic = material(0x9eaccb, .82, .27)
    const violet = material(0x9172f9, .5, .22, { emissive: 0x7650ee, emissiveIntensity: 1.2 })
    const cyan = material(0x79ffec, .35, .22, { emissive: 0x45dfcd, emissiveIntensity: 1.7 })
    const dimCyan = material(0x4a989c, .6, .3, { emissive: 0x318381, emissiveIntensity: .4 })
    const gold = material(0xc9ae8e, .9, .25)
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0x61557e, transparent: true, opacity: .35 })
    const circuitMaterial = new THREE.LineBasicMaterial({ color: 0x8276b3, transparent: true, opacity: .55 })
    ownedMaterials.push(titanium, edgeMetal, graphite, inlay, ceramic, violet, cyan, dimCyan, gold, lineMaterial, circuitMaterial)

    scene.add(new THREE.HemisphereLight(0xc5c0ff, 0x161026, 1.5))
    const key = new THREE.DirectionalLight(0xe9e8ff, 3)
    key.position.set(-3, 5, 6)
    scene.add(key)
    const rimLight = new THREE.DirectionalLight(0x9475ff, 4)
    rimLight.position.set(4, 1, -1)
    scene.add(rimLight)
    const fill = new THREE.DirectionalLight(0x8cfbe7, 1.5)
    fill.position.set(-4, -1, 3)
    scene.add(fill)

    function mesh(geometry, mat, parent, position = [0, 0, 0]) {
      const object = new THREE.Mesh(geometry, mat)
      object.position.set(...position)
      parent.add(object)
      return object
    }
    function extrude(shape, depth, bevel = .035) {
      return new THREE.ExtrudeGeometry(shape, {
        depth, bevelEnabled: bevel > 0, bevelSegments: 3,
        steps: 1, bevelSize: bevel, bevelThickness: bevel, curveSegments: 36,
      })
    }
    function trace(points, parent, mat = circuitMaterial) {
      const geometry = new THREE.BufferGeometry().setFromPoints(points.map(p => new THREE.Vector3(...p)))
      const line = new THREE.Line(geometry, mat)
      parent.add(line)
      return line
    }
    function tubeFromPath(path, radius, mat, parent, z) {
      const points = path.getPoints(110).map(p => new THREE.Vector3(p.x, p.y, z))
      const curve = new THREE.CatmullRomCurve3(points, true)
      return mesh(new THREE.TubeGeometry(curve, 180, radius, 6, true), mat, parent)
    }
    function arc(radius, thickness, length, mat, parent, position = [0, 0, 0], start = 0) {
      const object = mesh(new THREE.TorusGeometry(radius, thickness, 8, 100, length), mat, parent, position)
      object.rotation.z = start
      return object
    }
    function glowTexture() {
      const canvas = document.createElement("canvas")
      canvas.width = canvas.height = 128
      const context = canvas.getContext("2d")
      const gradient = context.createRadialGradient(64, 64, 0, 64, 64, 64)
      gradient.addColorStop(0, "rgba(255,255,255,0.75)")
      gradient.addColorStop(.15, "rgba(255,255,255,0.32)")
      gradient.addColorStop(.4, "rgba(255,255,255,0.08)")
      gradient.addColorStop(1, "rgba(255,255,255,0)")
      context.fillStyle = gradient
      context.fillRect(0, 0, 128, 128)
      const texture = new THREE.CanvasTexture(canvas)
      ownedTextures.push(texture)
      return texture
    }
    const glowMap = glowTexture()
    function glow(color, size, parent, position, opacity = .6) {
      const mat = new THREE.SpriteMaterial({ map: glowMap, color, transparent: true, opacity,
        blending: THREE.AdditiveBlending, depthWrite: false })
      ownedMaterials.push(mat)
      const sprite = new THREE.Sprite(mat)
      sprite.position.set(...position)
      sprite.scale.set(size, size, 1)
      parent.add(sprite)
      return sprite
    }

    const object = new THREE.Group()
    object.position.y = .14
    scene.add(object)
    const shield = new THREE.Group()
    object.add(shield)
    const rear = new THREE.Group()
    const frame = new THREE.Group()
    const face = new THREE.Group()
    const intelligence = new THREE.Group()
    shield.add(rear, frame, face, intelligence)

    // Beveled armor and a separate machined frame expose real thickness on rotation.
    mesh(extrude(shieldPath(), .2, .06), graphite, rear, [0, 0, -.24])
    mesh(extrude(shieldPath(.985), .045, .018), edgeMetal, rear, [0, 0, -.3])
    const frameShape = shieldPath()
    frameShape.holes.push(shieldPath(.89, THREE.Path))
    mesh(extrude(frameShape, .14, .028), titanium, frame, [0, 0, .005])
    mesh(extrude(shieldPath(.888), .055, .026), inlay, face, [0, 0, -.015])
    tubeFromPath(shieldPath(.918), .013, violet, frame, .166)
    tubeFromPath(shieldPath(.86), .007, dimCyan, face, .068)
    tubeFromPath(shieldPath(.985), .006, edgeMetal, rear, -.325)

    const circuits = [
      [[-.98, 1.15], [-.65, 1.15], [-.5, 1.3], [.58, 1.3]],
      [[-.98, .93], [-.82, .93], [-.69, 1.07], [-.4, 1.07]],
      [[.88, 1.1], [.97, 1.01], [.97, .58], [.84, .45]],
      [[-.99, .58], [-.99, -.55], [-.72, -.82], [-.72, -1.01]],
      [[-.86, .18], [-.86, -.49], [-.61, -.73], [-.61, -1.1]],
      [[.99, .12], [.99, -.42], [.7, -.72], [.51, -.72]],
      [[.88, -.24], [.88, -.47], [.64, -.7]],
      [[-.44, -1.13], [-.22, -1.36], [.15, -1.36], [.48, -1.02]],
    ]
    circuits.forEach(points => {
      trace(points.map(([x, y]) => [x, y, .07]), face)
      const [x, y] = points[points.length - 1]
      mesh(new THREE.SphereGeometry(.017, 8, 8), dimCyan, face, [x, y, .077])
    })
    const bolts = [[-1.15, 1.32], [1.15, 1.32], [-1.2, -.12], [1.2, -.12], [0, -1.58]]
    bolts.forEach(([x, y]) => {
      mesh(new THREE.CylinderGeometry(.035, .035, .024, 6), gold, frame, [x, y, .185]).rotation.x = Math.PI / 2
    })
    for (let i = 0; i < 7; i++) {
      mesh(new THREE.BoxGeometry(.035, .035, .018), i < 4 ? cyan : edgeMetal, face, [-.16 + i * .07, 1.17, .092])
    }
    for (const side of [-1, 1]) {
      for (let i = 0; i < 3; i++) {
        const bar = mesh(new THREE.BoxGeometry(.035, .14, .04), violet, frame, [side * 1.24, .62 - i * .23, .15])
        bar.rotation.z = side * -.14
      }
    }

    // A ceramic neural housing reinterprets the original thinking-head silhouette.
    mesh(extrude(headShape(), .13, .034), ceramic, intelligence, [-.03, -.035, .18])
    const headRim = mesh(extrude(headShape(), .04, .014), edgeMetal, intelligence, [-.03, -.035, .13])
    headRim.scale.set(1.027, 1.027, 1)
    const gear = new THREE.Group()
    gear.position.set(-.26, .375, .38)
    intelligence.add(gear)
    mesh(extrude(gearShape(), .095, .014), titanium, gear)
    arc(.288, .011, TAU, violet, gear, [0, 0, .112])
    const core = new THREE.Group()
    core.position.set(-.26, .375, .36)
    intelligence.add(core)
    mesh(new THREE.CylinderGeometry(.24, .24, .09, 48), graphite, core, [0, 0, .035]).rotation.x = Math.PI / 2
    arc(.207, .012, TAU, cyan, core, [0, 0, .092])
    const coreRing = arc(.175, .008, Math.PI * 1.3, violet, core, [0, 0, .113], .3)
    const crystal = mesh(new THREE.IcosahedronGeometry(.105, 0), cyan, core, [0, 0, .14])
    glow(0x73ffe3, .72, core, [0, 0, .125], .36)
    mesh(new THREE.BoxGeometry(.18, .027, .02), cyan, intelligence, [.5, .22, .358])
    trace([[-.31, -.12, .36], [-.31, -.42, .36], [-.12, -.58, .36], [-.12, -.8, .36]], intelligence)
    trace([[-.13, -.17, .36], [-.13, -.34, .36], [.04, -.48, .36], [.04, -.8, .36]], intelligence)
    for (let i = 0; i < 3; i++) mesh(new THREE.BoxGeometry(.045, .018, .016), violet, intelligence, [-.34 + i * .1, -.74, .36])

    const orbit = new THREE.Group()
    orbit.position.y = -.06
    object.add(orbit)
    const orbitA = new THREE.Group()
    orbitA.rotation.set(.83, .22, -.35)
    orbit.add(orbitA)
    arc(2.13, .009, TAU, edgeMetal, orbitA)
    arc(2.13, .015, 1.4, violet, orbitA, [0, 0, 0], .3)
    arc(2.13, .012, .6, cyan, orbitA, [0, 0, 0], Math.PI + .25)
    const satellite = mesh(new THREE.IcosahedronGeometry(.075, 1), ceramic, orbitA, [2.13, 0, 0])
    glow(0xb9a0ff, .32, orbitA, [2.13, 0, 0], .5)
    const orbitB = new THREE.Group()
    orbitB.rotation.set(-.62, -.6, .5)
    orbit.add(orbitB)
    arc(2.32, .005, TAU * .78, edgeMetal, orbitB)
    arc(2.32, .009, .5, dimCyan, orbitB, [0, 0, 0], 2.8)
    const satelliteB = mesh(new THREE.OctahedronGeometry(.055), cyan, orbitB, [-2.29, .35, 0])

    // Projection base and contact glow provide a spatial anchor for the floating shield.
    const base = new THREE.Group()
    base.position.set(0, -2.14, 0)
    scene.add(base)
    mesh(new THREE.CylinderGeometry(1.14, 1.22, .09, 80), graphite, base)
    mesh(new THREE.CylinderGeometry(.98, 1.13, .07, 80), edgeMetal, base, [0, .064, 0])
    const baseRing = arc(.98, .013, TAU, violet, base, [0, .107, 0])
    baseRing.rotation.x = Math.PI / 2
    const baseInner = arc(.72, .006, TAU, dimCyan, base, [0, .11, 0])
    baseInner.rotation.x = Math.PI / 2
    const baseGlow = glow(0x8059ff, 2.6, scene, [0, -2.1, .2], .35)
    baseGlow.scale.y = .4
    for (let i = 0; i < 36; i++) {
      const angle = i / 36 * TAU
      const tick = mesh(new THREE.BoxGeometry(.012, .007, i % 3 === 0 ? .085 : .035), i % 6 === 0 ? cyan : edgeMetal, base,
        [Math.sin(angle) * .86, .116, Math.cos(angle) * .86])
      tick.rotation.y = angle
    }

    const particlePositions = []
    for (let i = 0; i < 65; i++) {
      const n = Math.sin(i * 127.1 + 17.3) * 43758.5453
      const n2 = Math.sin(i * 311.7 + 63.1) * 15321.371
      particlePositions.push((n - Math.floor(n) - .5) * 6, (n2 - Math.floor(n2) - .5) * 5, -1.6 - (i % 7) * .12)
    }
    const particlesGeometry = new THREE.BufferGeometry()
    particlesGeometry.setAttribute("position", new THREE.Float32BufferAttribute(particlePositions, 3))
    const particlesMaterial = new THREE.PointsMaterial({ color: 0xb5a4f2, size: .018, transparent: true, opacity: .6, depthWrite: false })
    ownedMaterials.push(particlesMaterial)
    const particles = new THREE.Points(particlesGeometry, particlesMaterial)
    scene.add(particles)
    for (const side of [-1, 1]) {
      for (let i = 0; i < 19; i++) {
        const y = 1.75 - i * .18
        trace([[side * 2.55, y, -1.3], [side * (i % 3 === 0 ? 2.47 : 2.51), y, -1.3]], scene, lineMaterial)
      }
    }

    let disposed = false
    let paused = initialPaused
    let visible = true
    let exploded = false
    let separation = 0
    let animationFrame = 0
    let lastFrame = 0
    let elapsed = 0
    let dragging = false
    let previousX = 0
    let previousY = 0
    let yaw = -.4
    let pitch = .1
    const pointer = new THREE.Vector2()
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)")

    function resize() {
      const width = host.clientWidth
      const height = host.clientHeight
      if (!width || !height) return
      renderer.setSize(width, height, false)
      camera.aspect = width / height
      camera.position.z = camera.aspect < .85 ? 9.4 : 8.3
      camera.updateProjectionMatrix()
      requestDraw()
    }
    const resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(host)

    function draw(time) {
      animationFrame = 0
      if (disposed || !visible || document.hidden) return
      const delta = Math.min((time - lastFrame) / 1000 || 0, .045)
      lastFrame = time
      if (!paused) elapsed += delta
      const smoothing = 1 - Math.exp(-delta * 7)
      separation = THREE.MathUtils.lerp(separation, exploded ? 1 : 0, reduceMotion.matches ? 1 : smoothing)
      rear.position.z = -.44 * separation
      frame.position.z = .12 * separation
      face.position.z = .32 * separation
      intelligence.position.z = .96 * separation
      const targetYaw = yaw - separation * .38 + (paused ? 0 : Math.sin(elapsed * .28) * .075) + pointer.x * .095
      const targetPitch = pitch - pointer.y * .08
      shield.rotation.y = THREE.MathUtils.lerp(shield.rotation.y, targetYaw, smoothing)
      shield.rotation.x = THREE.MathUtils.lerp(shield.rotation.x, targetPitch, smoothing)
      shield.rotation.z = -.065
      shield.position.y = paused ? shield.position.y : Math.sin(elapsed * .9) * .07
      gear.rotation.z = -elapsed * .16
      coreRing.rotation.z = elapsed * .3
      crystal.rotation.set(elapsed * .4, elapsed * .55, .2)
      orbitA.rotation.z = -.35 + elapsed * .075
      orbitB.rotation.z = .5 - elapsed * .04
      satellite.rotation.y = elapsed * .4
      satelliteB.rotation.y = -elapsed * .5
      particles.rotation.y = Math.sin(elapsed * .08) * .08
      renderer.render(scene, camera)
      const settling = Math.abs(separation - (exploded ? 1 : 0)) > .001 ||
        Math.abs(shield.rotation.y - targetYaw) > .001 || Math.abs(shield.rotation.x - targetPitch) > .001
      if (!paused || settling) animationFrame = requestAnimationFrame(draw)
    }
    function requestDraw() {
      if (!animationFrame && !disposed && visible && !document.hidden) {
        lastFrame = performance.now() - 16
        animationFrame = requestAnimationFrame(draw)
      }
    }
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      if (visible) requestDraw()
      else { cancelAnimationFrame(animationFrame); animationFrame = 0 }
    }, { threshold: .02 })
    intersectionObserver.observe(host)
    const visibilityChange = () => {
      if (document.hidden) { cancelAnimationFrame(animationFrame); animationFrame = 0 }
      else requestDraw()
    }
    document.addEventListener("visibilitychange", visibilityChange)
    function pointerMove(event) {
      const bounds = host.getBoundingClientRect()
      if (dragging) {
        yaw = THREE.MathUtils.clamp(yaw + (event.clientX - previousX) * .008, -1.15, 1.15)
        pitch = THREE.MathUtils.clamp(pitch + (event.clientY - previousY) * .005, -.4, .4)
        previousX = event.clientX
        previousY = event.clientY
      } else if (event.pointerType !== "touch" && !reduceMotion.matches) {
        pointer.set((event.clientX - bounds.left) / bounds.width * 2 - 1, -(event.clientY - bounds.top) / bounds.height * 2 + 1)
      }
      requestDraw()
    }
    function pointerDown(event) {
      if (event.button !== 0) return
      dragging = true
      previousX = event.clientX
      previousY = event.clientY
      pointer.set(0, 0)
      host.setPointerCapture(event.pointerId)
    }
    function pointerUp(event) {
      dragging = false
      if (host.hasPointerCapture(event.pointerId)) host.releasePointerCapture(event.pointerId)
    }
    function pointerLeave() { if (!dragging) { pointer.set(0, 0); requestDraw() } }
    function reset() { yaw = -.4; pitch = .1; pointer.set(0, 0); requestDraw() }
    function keyDown(event) {
      if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home"].includes(event.key)) return
      event.preventDefault()
      if (event.key === "Home") reset()
      if (event.key === "ArrowLeft") yaw = Math.max(-1.15, yaw - .14)
      if (event.key === "ArrowRight") yaw = Math.min(1.15, yaw + .14)
      if (event.key === "ArrowUp") pitch = Math.max(-.4, pitch - .1)
      if (event.key === "ArrowDown") pitch = Math.min(.4, pitch + .1)
      requestDraw()
    }
    const events = { pointerdown: pointerDown, pointermove: pointerMove, pointerup: pointerUp,
      pointercancel: pointerUp, pointerleave: pointerLeave, keydown: keyDown }
    Object.entries(events).forEach(([name, callback]) => host.addEventListener(name, callback))
    function contextLost(event) {
      event.preventDefault()
      cancelAnimationFrame(animationFrame)
      animationFrame = 0
      visible = false
      onError?.()
    }
    renderer.domElement.addEventListener("webglcontextlost", contextLost)
    shield.rotation.set(pitch, yaw, -.065)
    host.appendChild(renderer.domElement)
    resize()

    return {
      setExploded(value) { exploded = value; requestDraw() },
      setPaused(value) { paused = value; requestDraw() },
      reset,
      dispose() {
        disposed = true
        cancelAnimationFrame(animationFrame)
        intersectionObserver.disconnect()
        resizeObserver.disconnect()
        document.removeEventListener("visibilitychange", visibilityChange)
        Object.entries(events).forEach(([name, callback]) => host.removeEventListener(name, callback))
        renderer.domElement.removeEventListener("webglcontextlost", contextLost)
        releaseResources()
      },
    }
  } catch (error) {
    releaseResources()
    throw error
  }
}
