export const PASSWORD_RULES = [
  { key: 'length', label: 'At least 8 characters', test: (v) => v.length >= 8 },
  { key: 'lower', label: 'One lowercase letter', test: (v) => /[a-z]/.test(v) },
  { key: 'upper', label: 'One uppercase letter', test: (v) => /[A-Z]/.test(v) },
  { key: 'number', label: 'One number', test: (v) => /\d/.test(v) },
  { key: 'special', label: 'One special character (!@#$...)', test: (v) => /[!@#$%^&*()_\-+={}[\]|\\:;"'<>,.?/~`]/.test(v) }
]

export function validatePassword(value = '') {
  const results = PASSWORD_RULES.map((rule) => ({ ...rule, passed: rule.test(value) }))
  const passedCount = results.filter((r) => r.passed).length
  return {
    results,
    isValid: passedCount === PASSWORD_RULES.length,
    score: passedCount // 0-5
  }
}

export function validateEmail(value = '') {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

export function validatePhone(value = '') {
  return /^[+]?[\d\s-]{7,15}$/.test(value)
}
