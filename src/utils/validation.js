/**
 * Frontend Input Validation Utilities
 * Mirrors backend validation for consistent user experience
 */

/**
 * Validate Course Name
 */
export const validateCourseName = (courseName) => {
  if (!courseName || String(courseName).trim().length === 0) {
    return { valid: false, error: "Course name is required" };
  }

  const name = String(courseName).trim();

  if (name.length < 2) {
    return { valid: false, error: "Course name must be at least 2 characters" };
  }

  if (name.length > 200) {
    return { valid: false, error: "Course name must be 200 characters or less" };
  }

  const allowedPattern = /^[a-zA-Z0-9\s+\-/#.&()]*$/;
  if (!allowedPattern.test(name)) {
    return {
      valid: false,
      error: "Course name contains invalid characters"
    };
  }

  if (/\s{2,}/.test(name)) {
    return { valid: false, error: "Too many consecutive spaces" };
  }

  return { valid: true, sanitized: name };
};

/**
 * Validate Email
 */
export const validateEmail = (email) => {
  if (!email || String(email).trim().length === 0) {
    return { valid: false, error: "Email is required" };
  }

  const emailStr = String(email).trim().toLowerCase();

  if (emailStr.length > 254) {
    return { valid: false, error: "Email is too long" };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(emailStr)) {
    return { valid: false, error: "Invalid email format" };
  }

  return { valid: true, sanitized: emailStr };
};

/**
 * Validate Username
 */
export const validateUsername = (username) => {
  if (!username || String(username).trim().length === 0) {
    return { valid: false, error: "Username is required" };
  }

  const usernameStr = String(username).trim().toLowerCase();

  if (usernameStr.length < 3) {
    return { valid: false, error: "Username must be at least 3 characters" };
  }

  if (usernameStr.length > 30) {
    return { valid: false, error: "Username must be 30 characters or less" };
  }

  const usernameRegex = /^[a-z0-9_-]+$/;
  if (!usernameRegex.test(usernameStr)) {
    return {
      valid: false,
      error: "Username can only contain letters, numbers, underscores, and dashes"
    };
  }

  if (usernameStr.startsWith("_") || usernameStr.startsWith("-")) {
    return { valid: false, error: "Username cannot start with underscore or dash" };
  }

  if (usernameStr.endsWith("_") || usernameStr.endsWith("-")) {
    return { valid: false, error: "Username cannot end with underscore or dash" };
  }

  return { valid: true, sanitized: usernameStr };
};

/**
 * Validate Password
 */
export const validatePassword = (password, strict = false) => {
  if (!password || String(password).length === 0) {
    return { valid: false, error: "Password is required" };
  }

  const passwordStr = String(password);

  const minLength = strict ? 12 : 8;
  if (passwordStr.length < minLength) {
    return {
      valid: false,
      error: `Password must be at least ${minLength} characters`
    };
  }

  if (passwordStr.length > 128) {
    return { valid: false, error: "Password is too long" };
  }

  if (!/[A-Z]/.test(passwordStr)) {
    return { valid: false, error: "Password must contain at least one uppercase letter" };
  }

  if (!/[a-z]/.test(passwordStr)) {
    return { valid: false, error: "Password must contain at least one lowercase letter" };
  }

  if (!/\d/.test(passwordStr)) {
    return { valid: false, error: "Password must contain at least one number" };
  }

  return {
    valid: true,
    strength: calculatePasswordStrength(passwordStr)
  };
};

/**
 * Calculate Password Strength (0-4 scale)
 */
export const calculatePasswordStrength = (password) => {
  let strength = 0;

  if (password.length >= 12) strength += 1;
  if (password.length >= 16) strength += 1;
  if (/[a-z]/.test(password)) strength += 0.5;
  if (/[A-Z]/.test(password)) strength += 0.5;
  if (/\d/.test(password)) strength += 0.5;
  if (/[!@#$%^&*()_\-+=\[\]{};:'",.<>?/\\|`~]/.test(password)) strength += 1;

  return Math.min(4, Math.floor(strength));
};

/**
 * Get Password Strength Label
 */
export const getPasswordStrengthLabel = (strength) => {
  const labels = ["Very Weak", "Weak", "Fair", "Good", "Strong"];
  return labels[strength] || "Unknown";
};

/**
 * Get Password Strength Color
 */
export const getPasswordStrengthColor = (strength) => {
  const colors = {
    0: "#ff6b6b", // Red
    1: "#ffa94d", // Orange
    2: "#ffd93d", // Yellow
    3: "#a8e6cf", // Light Green
    4: "#56ab91"  // Green
  };
  return colors[strength] || "#ccc";
};

/**
 * Validate All Login Fields
 */
export const validateLoginFields = (identifier, password) => {
  const errors = {};

  if (!identifier || String(identifier).trim().length === 0) {
    errors.identifier = "Email or username is required";
  }

  if (!password || String(password).length === 0) {
    errors.password = "Password is required";
  } else if (String(password).length < 6) {
    errors.password = "Password must be at least 6 characters";
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Validate All Signup Fields
 */
export const validateSignupFields = (email, username, password, confirmPassword) => {
  const errors = {};

  const emailValidation = validateEmail(email);
  if (!emailValidation.valid) {
    errors.email = emailValidation.error;
  }

  const usernameValidation = validateUsername(username);
  if (!usernameValidation.valid) {
    errors.username = usernameValidation.error;
  }

  const passwordValidation = validatePassword(password);
  if (!passwordValidation.valid) {
    errors.password = passwordValidation.error;
  }

  if (confirmPassword !== password) {
    errors.confirmPassword = "Passwords do not match";
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Validate Set Password Fields (Google Auth completion)
 */
export const validateSetPasswordFields = (username, password) => {
  const errors = {};

  const usernameValidation = validateUsername(username);
  if (!usernameValidation.valid) {
    errors.username = usernameValidation.error;
  }

  const passwordValidation = validatePassword(password);
  if (!passwordValidation.valid) {
    errors.password = passwordValidation.error;
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Sanitize Input (remove HTML/script tags)
 */
export const sanitizeInput = (input) => {
  if (typeof input !== "string") {
    return String(input);
  }

  return input
    .trim()
    .replace(/<script[^>]*>.*?<\/script>/gi, "")
    .replace(/<[^>]+>/g, "");
};
