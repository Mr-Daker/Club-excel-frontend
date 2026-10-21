import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"
import test from "node:test"

// Import the plain ES module without changing the Next.js project's module type.
const source = await readFile(new URL("./recruitmentForm.js", import.meta.url), "utf8")
const { initialFormData, formSteps, validateStep, submitRegistration, checkRegistration } =
  await import(`data:text/javascript;base64,${Buffer.from(source).toString("base64")}`)

const valid = {
  name: "Test Applicant", rollNo: "TEST/01", regNo: "TEST-REG",
  nistEmail: "student@nist.edu", personalEmail: "student@example.com",
  gender: "other", branch: "Computer Science", hackerrankId: "test_coder",
  techStacks: "JavaScript", mobile: "9876543210", hostelLocal: "localite",
  reason: "Learn and build with others.",
}

test("all original fields are required, grouped once across three steps", () => {
  assert.equal(Object.keys(initialFormData).length, 12)
  assert.deepEqual(formSteps.flat().sort(), Object.keys(initialFormData).sort())
  for (const [index, fields] of formSteps.entries()) {
    assert.deepEqual(Object.keys(validateStep(index, initialFormData)), fields)
    assert.deepEqual(validateStep(index, valid), {})
  }
  assert.throws(() => validateStep(3, valid), RangeError)
})

test("NIST domain is exact and case insensitive, with valid email syntax", () => {
  for (const nistEmail of ["student@nist.edu", " first.last+club@NIST.EDU "]) {
    assert.equal(validateStep(0, { ...valid, nistEmail }).nistEmail, undefined)
  }
  for (const nistEmail of ["nist.edu@example.com", "student@nist.edu.example.com", "student@sub.nist.edu", "a@@nist.edu", "a..b@nist.edu", ".a@nist.edu", "a @nist.edu"]) {
    assert.ok(validateStep(0, { ...valid, nistEmail }).nistEmail)
  }
  for (const personalEmail of ["not-an-email", "a@", "a@-example.com", "a@example..com"]) {
    assert.ok(validateStep(0, { ...valid, personalEmail }).personalEmail)
  }
})

test("mobile validation permits Indian numbers with optional +91 and spaces", () => {
  for (const mobile of ["9876543210", "+91 98765 43210", " 98765 43210 "]) {
    assert.equal(validateStep(0, { ...valid, mobile }).mobile, undefined)
  }
  for (const mobile of ["1234567890", "987654321", "+1 9876543210", "98765abcde", "+9198765432100"]) {
    assert.ok(validateStep(0, { ...valid, mobile }).mobile)
  }
  assert.ok(validateStep(1, { ...valid, gender: "unknown" }).gender)
  assert.ok(validateStep(1, { ...valid, hostelLocal: "unknown" }).hostelLocal)
})

test("submit sends only the 12 API fields and accepts only HTTP 201", async () => {
  let request
  const result = await submitRegistration({ ...valid, name: " Test Applicant ", mobile: "+91 98765 43210", internalUiState: true }, async (url, options) => {
    request = { url, ...options }
    return { status: 201 }
  })
  assert.deepEqual(result, { success: true })
  assert.equal(request.url, "https://club-excel-backend.vercel.app/api/register")
  assert.equal(request.method, "POST")
  assert.equal(request.headers["Content-Type"], "application/json")
  const payload = JSON.parse(request.body)
  assert.deepEqual(Object.keys(payload), Object.keys(initialFormData))
  assert.equal(payload.name, "Test Applicant")
  assert.equal(payload.mobile, "9876543210")
  assert.equal(valid.mobile, "9876543210")
  for (const status of [200, 202, 204, 400, 409, 429, 500]) {
    await assert.rejects(submitRegistration(valid, async () => ({ status })), error => error.status === status)
  }
})

test("invalid submission and blank status lookup never send requests", async () => {
  let calls = 0
  const fetchStub = async () => { calls += 1; return { status: 201 } }
  await assert.rejects(submitRegistration(initialFormData, fetchStub), error => error.code === "validation" && Object.keys(error.fieldErrors).length === 12)
  await assert.rejects(checkRegistration("   ", fetchStub), error => error.code === "validation")
  assert.equal(calls, 0)
})

test("status lookup encodes roll number and distinguishes 404 from other failures", async () => {
  let requestedUrl
  assert.deepEqual(await checkRegistration(" TEST/01 ? ", async (url, options) => {
    requestedUrl = url
    assert.equal(options.method, "GET")
    assert.equal(options.cache, "no-store")
    return { status: 200 }
  }), { found: true })
  assert.equal(requestedUrl, "https://club-excel-backend.vercel.app/api/getuser/TEST%2F01%20%3F")
  assert.deepEqual(await checkRegistration("TEST", async () => ({ status: 404 })), { found: false })
  for (const status of [201, 204, 400, 401, 429, 500, 503]) {
    await assert.rejects(checkRegistration("TEST", async () => ({ status })), error => error.status === status)
  }
})

test("network failures expose clean errors without raw backend or applicant data", async () => {
  const fetchStub = async () => { throw new Error("sensitive backend diagnostic") }
  for (const operation of [() => submitRegistration(valid, fetchStub), () => checkRegistration("TEST", fetchStub)]) {
    await assert.rejects(operation(), error => error.code === "network" && !error.message.includes("sensitive"))
  }
})

test("requests time out and abort even when a fetch implementation never resolves", async t => {
  t.mock.timers.enable({ apis: ["setTimeout"] })
  let requestSignal
  const pending = checkRegistration("TEST", (_url, options) => {
    requestSignal = options.signal
    return new Promise(() => {})
  })
  const rejection = assert.rejects(pending, error => error.code === "timeout")
  await Promise.resolve()
  t.mock.timers.tick(15000)
  await rejection
  assert.equal(requestSignal.aborted, true)
})
