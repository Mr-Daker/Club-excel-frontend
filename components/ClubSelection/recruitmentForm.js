const API_BASE = "https://club-excel-backend.vercel.app/api"
const REQUEST_TIMEOUT_MS = 15000

export const initialFormData = {
  name: "",
  rollNo: "",
  regNo: "",
  nistEmail: "",
  personalEmail: "",
  gender: "",
  branch: "",
  hackerrankId: "",
  techStacks: "",
  mobile: "",
  hostelLocal: "",
  reason: "",
}

export const formSteps = [
  ["name", "nistEmail", "personalEmail", "mobile"],
  ["rollNo", "regNo", "branch", "gender", "hostelLocal"],
  ["hackerrankId", "techStacks", "reason"],
]

const fieldLabels = {
  name: "your name",
  rollNo: "your roll number",
  regNo: "your registration number",
  nistEmail: "your NIST email address",
  personalEmail: "your personal email address",
  gender: "your gender",
  branch: "your branch",
  hackerrankId: "your HackerRank ID",
  techStacks: "your skills or technologies you want to explore",
  mobile: "your mobile number",
  hostelLocal: "your accommodation",
  reason: "why you would like to join",
}

function fieldValue(values, field) {
  return typeof values?.[field] === "string" ? values[field].trim() : ""
}

function validEmail(value) {
  if (value.length > 254 || /\s/.test(value)) return false
  const parts = value.split("@")
  if (parts.length !== 2) return false
  const [local, domain] = parts
  return local.length > 0 && local.length <= 64 &&
    /^[a-z\d!#$%&'*+/=?^_`{|}~.-]+$/i.test(local) &&
    !local.startsWith(".") && !local.endsWith(".") && !local.includes("..") &&
    domain.length <= 253 && domain.includes(".") &&
    domain.split(".").every(label => /^[a-z\d](?:[a-z\d-]{0,61}[a-z\d])?$/i.test(label))
}

function normalizedMobile(value) {
  return value.replace(/\s/g, "").replace(/^\+91/, "")
}

export function validateStep(stepIndex, values) {
  const fields = formSteps[stepIndex]
  if (!fields) throw new RangeError("Unknown registration step")

  const errors = {}
  for (const field of fields) {
    const value = fieldValue(values, field)
    if (!value) {
      errors[field] = `Please enter ${fieldLabels[field]}.`
    } else if (field === "nistEmail") {
      if (!validEmail(value) || value.split("@")[1].toLowerCase() !== "nist.edu") {
        errors[field] = "Use your NIST email address ending in @nist.edu."
      }
    } else if (field === "personalEmail" && !validEmail(value)) {
      errors[field] = "Enter a valid personal email address."
    } else if (field === "mobile" && !/^(?:\+91)?[6-9]\d{9}$/.test(value.replace(/\s/g, ""))) {
      errors[field] = "Enter a 10-digit Indian mobile number. You can include +91."
    } else if (field === "gender" && !["male", "female", "other"].includes(value)) {
      errors[field] = "Please select a gender option."
    } else if (field === "hostelLocal" && !["hostelite", "localite"].includes(value)) {
      errors[field] = "Please select your accommodation."
    }
  }
  return errors
}

function requestError(code, message, status) {
  const error = new Error(message)
  error.code = code
  if (status !== undefined) error.status = status
  return error
}

async function request(url, options, fetchImpl) {
  const controller = new AbortController()
  let timeoutId
  const timeout = new Promise((_, reject) => {
    timeoutId = setTimeout(() => {
      reject(requestError("timeout", "The request took too long. Please try again."))
      controller.abort()
    }, REQUEST_TIMEOUT_MS)
  })

  try {
    return await Promise.race([
      Promise.resolve().then(() => fetchImpl(url, { ...options, signal: controller.signal })),
      timeout,
    ])
  } catch (error) {
    if (error?.code === "timeout") throw error
    throw requestError("network", "We couldn't connect. Check your connection and try again.")
  } finally {
    clearTimeout(timeoutId)
  }
}

function responseError(status, action) {
  if (status === 409 && action === "register") {
    return requestError("duplicate", "A registration already exists. Use Check registration to confirm it.", status)
  }
  if (status === 429) {
    return requestError("request", "Too many requests. Please wait a moment and try again.", status)
  }
  if (status >= 500) {
    return requestError("server", "The registration service is unavailable right now. Please try again later.", status)
  }
  return requestError("request", action === "register"
    ? "Registration could not be confirmed. Check your status before trying again."
    : "We couldn't check your registration right now. Please try again.", status)
}

export async function submitRegistration(values, fetchImpl = fetch) {
  const fieldErrors = Object.assign({}, ...formSteps.map((_, index) => validateStep(index, values)))
  if (Object.keys(fieldErrors).length) {
    const error = requestError("validation", "Please check the highlighted fields.")
    error.fieldErrors = fieldErrors
    throw error
  }

  // Select only the original API fields; UI state must never enter the payload.
  const payload = Object.fromEntries(Object.keys(initialFormData).map(field => [field, fieldValue(values, field)]))
  payload.mobile = normalizedMobile(payload.mobile)
  const response = await request(`${API_BASE}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  }, fetchImpl)

  if (response.status !== 201) throw responseError(response.status, "register")
  return { success: true }
}

export async function checkRegistration(rollNo, fetchImpl = fetch) {
  const value = typeof rollNo === "string" ? rollNo.trim() : ""
  if (!value) {
    throw requestError("validation", "Enter your roll number to check your registration.")
  }
  const response = await request(`${API_BASE}/getuser/${encodeURIComponent(value)}`, {
    method: "GET",
    cache: "no-store",
  }, fetchImpl)

  if (response.status === 200) return { found: true }
  if (response.status === 404) return { found: false }
  throw responseError(response.status, "check")
}
