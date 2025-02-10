export function getPasswordStrength(password: string): "weak" | "medium" | "strong" {
  let strength = 0
  if (password.length >= 8) strength++
  if (/[A-Z]/.test(password)) strength++
  if (/[a-z]/.test(password)) strength++
  if (/[0-9]/.test(password)) strength++
  if (/[^A-Za-z0-9]/.test(password)) strength++

  if (strength < 3) return "weak"
  if (strength < 5) return "medium"
  return "strong"
}

