/**
 * Institutional Matriculation Number Generator & Formatter for Academora University
 * Standard Format: ACM/{YEAR}/{DEPT_CODE}/{SEQUENTIAL_NUMBER}
 * Example: ACM/2024/CSC/1084
 */

export const DEPARTMENT_CODES = {
  'Computer Science & Information Technology': 'CSC',
  'Electrical & Mechanical Engineering': 'ENG',
  'Business Administration & Finance': 'BUS',
  'Economics & Social Sciences': 'ECO',
  'Arts, Law & Humanities': 'LAW',
  'Biological & Chemical Sciences': 'SCI',
  'Postgraduate & Doctoral Studies': 'PGS'
}

export function generateMatricNumber(department = '', userId = '') {
  const year = new Date().getFullYear()
  const deptCode = DEPARTMENT_CODES[department] || 'CSC'

  let sequence = 1000
  if (userId) {
    let hash = 0
    for (let i = 0; i < userId.length; i++) {
      hash = (hash * 31 + userId.charCodeAt(i)) % 9000
    }
    sequence = 1000 + Math.abs(hash)
  } else {
    sequence = Math.floor(1000 + Math.random() * 9000)
  }

  return `ACM/${year}/${deptCode}/${sequence}`
}

export function isValidMatricNumber(matric = '') {
  return /^ACM\/\d{4}\/[A-Z]{3,4}\/\d{4}$/.test(matric.trim().toUpperCase())
}
